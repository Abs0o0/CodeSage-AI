import crypto from "crypto";
import jwt from "jsonwebtoken";

import RefreshToken from "../models/RefreshToken.model.js";

const REFRESH_COOKIE_NAME = "codesage_refresh_token";

function getRefreshTokenExpiryDate() {
  const days = Number(process.env.REFRESH_TOKEN_DAYS || 7);
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + days);

  return expiresAt;
}

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" || isProduction,
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
    path: "/api/auth",
    maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000),
  };
}

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    }
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function setRefreshTokenCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions());
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: undefined,
  });
}

export function getRefreshTokenFromRequest(req) {
  return req.cookies?.[REFRESH_COOKIE_NAME] || null;
}

export async function createRefreshToken({ userId, ipAddress = "" }) {
  const rawToken = generateRefreshToken();
  const tokenHash = hashToken(rawToken);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt: getRefreshTokenExpiryDate(),
    createdByIp: ipAddress,
  });

  return rawToken;
}

export async function revokeRefreshToken(rawToken, ipAddress = "") {
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);

  return RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
      revokedByIp: ipAddress,
    },
    {
      new: true,
    }
  );
}

export async function findValidRefreshToken(rawToken) {
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);

  const refreshToken = await RefreshToken.findOne({ tokenHash }).populate("user");

  if (!refreshToken) return null;

  if (refreshToken.isRevoked || refreshToken.isExpired) {
    return null;
  }

  if (!refreshToken.user || !refreshToken.user.active) {
    return null;
  }

  return refreshToken;
}

export async function rotateRefreshToken({ rawToken, ipAddress = "" }) {
  const existingToken = await findValidRefreshToken(rawToken);

  if (!existingToken) {
    return null;
  }

  const newRawToken = generateRefreshToken();
  const newTokenHash = hashToken(newRawToken);

  await RefreshToken.create({
    user: existingToken.user._id,
    tokenHash: newTokenHash,
    expiresAt: getRefreshTokenExpiryDate(),
    createdByIp: ipAddress,
  });

  existingToken.revokedAt = new Date();
  existingToken.revokedByIp = ipAddress;
  existingToken.replacedByTokenHash = newTokenHash;

  await existingToken.save();

  return {
    user: existingToken.user,
    refreshToken: newRawToken,
  };
}