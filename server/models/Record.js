const mongoose = require("mongoose");

// Stores every non-test item for a patient: personality quiz, symptom checker,
// quick survey and intake interview. The "data" field holds the full answers.
const recordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
      index: true,
    },
    kind: {
      type: String,
      required: [true, "Kind is required"],
      enum: ["personality", "symptoms", "survey", "intake"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Data is required"],
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

recordSchema.index({ patient: 1, kind: 1, takenAt: 1 });

module.exports = mongoose.model("Record", recordSchema);
