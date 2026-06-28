import User from "../models/User.model.js";
import {
  clearRefreshTokenCookie,
  createRefreshToken,
  findValidRefreshToken,
  generateAccessToken,
  getRefreshTokenFromRequest,
  revokeRefreshToken,
  rotateRefreshToken,
  setRefreshTokenCookie,
} from "../services/token.service.js";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    ""
  );
}

function getLockUntilDate() {
  return new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
}

function sanitizeUser(user) {
  if (typeof user.toSafeObject === "function") {
    return user.toSafeObject();
  }

  return {
    id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    jobTitle: user.jobTitle,
    avatarUrl: user.avatarUrl,
    active: user.active,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function sendAuthResponse({ req, res, user, statusCode = 200, message }) {
  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshToken({
    userId: user._id,
    ipAddress: getClientIp(req),
  });

  setRefreshTokenCookie(res, refreshToken);

  return res.status(statusCode).json({
    success: true,
    message,
    token: accessToken,
    user: sanitizeUser(user),
  });
}

async function handleFailedLogin(user) {
  user.failedLoginAttempts += 1;

  if (user.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    user.lockUntil = getLockUntilDate();
  }

  await user.save({
    validateBeforeSave: false,
  });
}

async function handleSuccessfulLogin(user) {
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.lastLoginAt = new Date();

  await user.save({
    validateBeforeSave: false,
  });
}

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username: username.trim() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "user",
    });

    user.lastLoginAt = new Date();
    await user.save({
      validateBeforeSave: false,
    });

    return sendAuthResponse({
      req,
      res,
      user,
      statusCode: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    if (user.isLocked) {
      const remainingMs = user.lockUntil.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / 60000);

      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again in ${remainingMinutes} minute(s).`,
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      await handleFailedLogin(user);

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    await handleSuccessfulLogin(user);

    return sendAuthResponse({
      req,
      res,
      user,
      statusCode: 200,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const currentRefreshToken = getRefreshTokenFromRequest(req);

    if (!currentRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    const rotated = await rotateRefreshToken({
      rawToken: currentRefreshToken,
      ipAddress: getClientIp(req),
    });

    if (!rotated) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const accessToken = generateAccessToken(rotated.user);

    setRefreshTokenCookie(res, rotated.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: accessToken,
      user: sanitizeUser(rotated.user),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const currentRefreshToken = getRefreshTokenFromRequest(req);

    if (currentRefreshToken) {
      await revokeRefreshToken(currentRefreshToken, getClientIp(req));
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};