import mongoose from "mongoose";
import bcrypt from "bcrypt";

const USER_ROLES = ["admin", "user"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
      default: "",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
      required: true,
    },

    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
      default: "",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    avatarPublicId: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

userSchema.virtual("isLocked").get(function () {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    username: this.username,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    jobTitle: this.jobTitle,
    avatarUrl: this.avatarUrl,
    active: this.active,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;