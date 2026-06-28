import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    replacedByTokenHash: {
      type: String,
      default: "",
    },

    createdByIp: {
      type: String,
      default: "",
    },

    revokedByIp: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.virtual("isExpired").get(function () {
  return this.expiresAt <= new Date();
});

refreshTokenSchema.virtual("isRevoked").get(function () {
  return Boolean(this.revokedAt);
});

refreshTokenSchema.virtual("isActive").get(function () {
  return !this.isExpired && !this.isRevoked;
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;