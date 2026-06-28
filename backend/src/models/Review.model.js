import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    line: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const docSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    file: {
      type: String,
      default: "",
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      default: "groq",
      trim: true,
    },

    aiModel: {
      type: String,
      default: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      trim: true,
    },

    code: {
      type: String,
      required: true,
    },

    snippet: {
      type: String,
      default: "",
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    overview: {
      title: {
        type: String,
        default: "",
      },
      subtitle: {
        type: String,
        default: "",
      },
    },

    stats: {
      lines: {
        type: Number,
        default: 0,
      },
      issues: {
        type: Number,
        default: 0,
      },
    },

    issues: {
      type: [issueSchema],
      default: [],
    },

    refactoring: {
      type: [String],
      default: [],
    },

    docs: {
      type: [docSchema],
      default: [],
    },

    fixedCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;