const express = require("express");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Result = require("../models/Result");
const Record = require("../models/Record");

const router = express.Router();
const KINDS = ["personality", "symptoms", "survey", "intake"];

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// GET /api/health
router.get("/health", (req, res) => {
  res.json({ ok: true });
});

// GET /api/patients  (each patient also gets resultCount, recordCount, lastActivityAt)
router.get("/patients", async (req, res, next) => {
  try {
    const group = { _id: "$patient", n: { $sum: 1 }, last: { $max: "$takenAt" } };
    const [patients, rc, kc] = await Promise.all([
      Patient.find().sort({ updatedAt: -1 }).lean(),
      Result.aggregate([{ $group: group }]),
      Record.aggregate([{ $group: group }]),
    ]);
    const R = new Map(rc.map((x) => [String(x._id), x]));
    const K = new Map(kc.map((x) => [String(x._id), x]));
    res.json(
      patients.map((p) => {
        const r = R.get(String(p._id));
        const k = K.get(String(p._id));
        const dates = [r && r.last, k && k.last].filter(Boolean).sort();
        return {
          ...p,
          resultCount: r ? r.n : 0,
          recordCount: k ? k.n : 0,
          lastActivityAt: dates.length ? dates[dates.length - 1] : null,
        };
      })
    );
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

// DELETE /api/patients/:id  (also deletes all their results and records)
router.delete("/patients/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    await Promise.all([
      Result.deleteMany({ patient: req.params.id }),
      Record.deleteMany({ patient: req.params.id }),
    ]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /api/patients/:id/full  -> { patient, results, records }  (complete patient record)
router.get("/patients/:id/full", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const [results, records] = await Promise.all([
      Result.find({ patient: req.params.id }).sort({ takenAt: 1 }),
      Record.find({ patient: req.params.id }).sort({ takenAt: 1 }),
    ]);
    res.json({ patient, results, records });
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
      query.ab = String(req.query.ab);
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

// POST /api/patients/:id/records  body: { kind, data, takenAt? }
router.post("/patients/:id/records", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const { kind, data, takenAt } = req.body || {};
    if (!KINDS.includes(kind)) {
      return res.status(400).json({ error: "kind must be one of: " + KINDS.join(", ") });
    }
    if (data === null || typeof data !== "object") {
      return res.status(400).json({ error: "data must be an object" });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const rec = { patient: req.params.id, kind, data };
    if (takenAt) {
      const d = new Date(takenAt);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "takenAt is not a valid date" });
      }
      rec.takenAt = d;
    }
    const record = await Record.create(rec);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/records/:id
router.delete("/records/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid record ID" });
    }
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
