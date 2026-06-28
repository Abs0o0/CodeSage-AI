import User from "../models/User.model.js";
import {
  clearRefreshTokenCookie,
  revokeRefreshToken,
  getRefreshTokenFromRequest,
} from "../services/token.service.js";
import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "../services/upload.service.js";

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

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { username, email, fullName, jobTitle } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (username !== undefined) {
      const normalizedUsername = String(username).trim();

      const existingUsername = await User.findOne({
        username: normalizedUsername,
        _id: { $ne: user._id },
      });

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }

      user.username = normalizedUsername;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      user.email = normalizedEmail;
    }

    if (fullName !== undefined) {
      user.fullName = String(fullName).trim();
    }

    if (jobTitle !== undefined) {
      user.jobTitle = String(jobTitle).trim();
    }

    await user.save();

    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.active = false;
    await user.save({
      validateBeforeSave: false,
    });

    const currentRefreshToken = getRefreshTokenFromRequest(req);
    if (currentRefreshToken) {
      await revokeRefreshToken(currentRefreshToken);
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMyAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar image is required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      public_id: `user-${user._id}-${Date.now()}`,
    });

    user.avatarUrl = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;

    await user.save({
      validateBeforeSave: false,
    });

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};