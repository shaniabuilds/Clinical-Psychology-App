const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
      index: true,
    },
    ab: {
      type: String,
      required: [true, "Test abbreviation (ab) is required"],
      trim: true,
    },
    name: {
      type: String,
      default: "",
    },
    cat: {
      type: String,
      default: "",
    },
    raw: {
      type: Number,
      required: [true, "Raw score (raw) is required"],
    },
    max: {
      type: Number,
      default: null,
    },
    scaled: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    rank: {
      type: Number,
      default: null,
    },
    risk: {
      type: Boolean,
      default: false,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notes: {
      type: String,
      default: "",
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index({ patient: 1, ab: 1, takenAt: 1 });

module.exports = mongoose.model("Result", resultSchema);
