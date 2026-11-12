const express = require("express");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Result = require("../models/Result");

const router = express.Router();

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// GET /api/health
router.get("/health", (req, res) => {
  res.json({ ok: true });
});

// GET /api/patients
router.get("/patients", async (req, res, next) => {
  try {
    const patients = await Patient.find().sort({ updatedAt: -1 });
    res.json(patients);
  } catch (err) {
    next(err);
  }
});

// POST /api/patients
router.post("/patients", async (req, res, next) => {
  try {
    const { name, age, sex, examiner, referral } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    const patient = await Patient.create({
      name: name.trim(),
      age: age != null ? String(age) : "",
      sex: sex != null ? String(sex) : "",
      examiner: examiner != null ? String(examiner) : "",
      referral: referral != null ? String(referral) : "",
    });
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
});

// PUT /api/patients/:id
router.put("/patients/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const { name, age, sex, examiner, referral } = req.body;
    const updates = {};
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      updates.name = name.trim();
    }
    if (age !== undefined) updates.age = String(age);
    if (sex !== undefined) updates.sex = String(sex);
    if (examiner !== undefined) updates.examiner = String(examiner);
    if (referral !== undefined) updates.referral = String(referral);

    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/patients/:id
router.delete("/patients/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    await Result.deleteMany({ patient: req.params.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /api/patients/:id/results?ab=PHQ-9
router.get("/patients/:id/results", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const query = { patient: req.params.id };
    if (req.query.ab) {
      query.ab = req.query.ab;
    }
    const results = await Result.find(query).sort({ takenAt: 1 });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// POST /api/patients/:id/results
router.post("/patients/:id/results", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const { ab, name, cat, raw, max, scaled, label, rank, risk, answers, notes, takenAt } = req.body;
    if (!ab || typeof ab !== "string" || !ab.trim()) {
      return res.status(400).json({ error: "Test abbreviation (ab) is required" });
    }
    if (raw === undefined || raw === null || typeof raw !== "number" || isNaN(raw)) {
      return res.status(400).json({ error: "Raw score (raw) must be a number" });
    }

    const resultData = {
      patient: req.params.id,
      ab: ab.trim(),
      name: name != null ? String(name) : "",
      cat: cat != null ? String(cat) : "",
      raw,
      max: max !== undefined && max !== null ? Number(max) : null,
      scaled: scaled != null ? String(scaled) : "",
      label: label != null ? String(label) : "",
      rank: rank !== undefined && rank !== null ? Number(rank) : null,
      risk: Boolean(risk),
      answers: answers !== undefined ? answers : {},
      notes: notes != null ? String(notes) : "",
    };

    if (takenAt) {
      resultData.takenAt = takenAt;
    }

    const result = await Result.create(resultData);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/results/:id
router.delete("/results/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid result ID" });
    }
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
