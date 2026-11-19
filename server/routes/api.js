
const express = require("express");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Result = require("../models/Result");
const Record = require("../models/Record");
const IqConfig = require("../models/IqConfig");

const router = express.Router();
const KINDS = ["personality", "symptoms", "survey", "intake"];

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// ---------------------------------------------------------------- health
router.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ---------------------------------------------------------------- patients
// GET /api/patients  (each patient also gets resultCount, recordCount, lastActivityAt)
router.get("/patients", async (req, res, next) => {
  try {
    const group = {
      _id: "$patient",
      n: { $sum: 1 },
      last: { $max: "$takenAt" },
    };
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
      }),
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/patients   (profile = extra registration details sent by the client)
router.post("/patients", async (req, res, next) => {
  try {
    const { name, age, sex, examiner, referral, profile } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    const patient = await Patient.create({
      name: name.trim(),
      age: age != null ? String(age) : "",
      sex: sex != null ? String(sex) : "",
      examiner: examiner != null ? String(examiner) : "",
      referral: referral != null ? String(referral) : "",
      profile: profile && typeof profile === "object" ? profile : {},
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
    const { name, age, sex, examiner, referral, profile } = req.body;
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
    if (
      profile !== undefined &&
      profile !== null &&
      typeof profile === "object"
    )
      updates.profile = profile;

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

// GET /api/patients/:id/full  -> { patient, results, records }
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

// ---------------------------------------------------------------- results
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
    const {
      ab,
      name,
      cat,
      raw,
      max,
      scaled,
      label,
      rank,
      risk,
      answers,
      notes,
      takenAt,
    } = req.body;
    if (!ab || typeof ab !== "string" || !ab.trim()) {
      return res
        .status(400)
        .json({ error: "Test abbreviation (ab) is required" });
    }
    if (
      raw === undefined ||
      raw === null ||
      typeof raw !== "number" ||
      isNaN(raw)
    ) {
      return res
        .status(400)
        .json({ error: "Raw score (raw) must be a number" });
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

// ---------------------------------------------------------------- records
// GET /api/patients/:id/records?kind=
router.get("/patients/:id/records", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const query = { patient: req.params.id };
    if (req.query.kind) {
      query.kind = String(req.query.kind);
    }
    res.json(await Record.find(query).sort({ takenAt: 1 }));
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
      return res
        .status(400)
        .json({ error: "kind must be one of: " + KINDS.join(", ") });
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

// ---------------------------------------------------------------- IQ config (requireAuth is applied in server.js)
const who = (req) => (req.admin && req.admin.username) || "";

function validateItems(data) {
  if (!data || !Array.isArray(data.items) || data.items.length === 0)
    return "items must be a non-empty array";
  const ids = new Set();
  for (let i = 0; i < data.items.length; i++) {
    const it = data.items[i];
    const path = `items[${i}]`;
    if (typeof it.id !== "string" || !it.id)
      return `${path}.id must be a non-empty string`;
    if (ids.has(it.id)) return `${path}.id must be unique`;
    ids.add(it.id);
    if (typeof it.prompt !== "string" || !it.prompt.trim())
      return `${path}.prompt must be a non-empty string`;
    if (!Array.isArray(it.choices) || it.choices.length < 2)
      return `${path}.choices must be an array with at least 2 strings`;
    for (let c = 0; c < it.choices.length; c++) {
      if (typeof it.choices[c] !== "string")
        return `${path}.choices[${c}] must be a string`;
    }
    if (
      !Number.isInteger(it.answer) ||
      it.answer < 0 ||
      it.answer >= it.choices.length
    )
      return `${path}.answer must be an integer within the choices range`;
    if (typeof it.difficulty !== "number" || isNaN(it.difficulty))
      return `${path}.difficulty must be numeric`;
    if (
      typeof it.age_min !== "number" ||
      typeof it.age_max !== "number" ||
      it.age_min >= it.age_max
    )
      return `${path}.age_min and age_max must be numbers with age_min < age_max`;
  }
  return null;
}

function validateNorms(data) {
  if (!data || typeof data.countries !== "object" || data.countries === null)
    return "countries must be a non-empty object";
  if (Object.keys(data.countries).length === 0)
    return "countries cannot be empty";
  if (!data.default_country || !(data.default_country in data.countries))
    return "default_country must exist in countries";
  if (!Array.isArray(data.classifications) || data.classifications.length === 0)
    return "classifications must be a non-empty array";
  for (let i = 0; i < data.classifications.length; i++) {
    const c = data.classifications[i];
    if (
      !Array.isArray(c) ||
      c.length !== 2 ||
      typeof c[0] !== "number" ||
      typeof c[1] !== "string"
    ) {
      return `classifications[${i}] must be [number, string]`;
    }
  }
  for (const [code, country] of Object.entries(data.countries)) {
    if (!Array.isArray(country.age_bands) || country.age_bands.length === 0)
      return `countries[${code}].age_bands must be a non-empty array`;
    const bandIds = new Set();
    for (let i = 0; i < country.age_bands.length; i++) {
      const b = country.age_bands[i];
      const p = `countries[${code}].age_bands[${i}]`;
      if (typeof b.id !== "string" || !b.id)
        return `${p}.id must be a non-empty string`;
      if (bandIds.has(b.id)) return `${p}.id must be unique`;
      bandIds.add(b.id);
      if (
        typeof b.min_age !== "number" ||
        typeof b.max_age !== "number" ||
        b.min_age >= b.max_age
      )
        return `${p}.min_age and max_age must be numbers with min_age < max_age`;
      if (
        typeof b.reliability !== "number" ||
        b.reliability <= 0 ||
        b.reliability > 1
      )
        return `${p}.reliability must be in (0, 1]`;
      if (b.method === "linear") {
        if (
          typeof b.mean_raw !== "number" ||
          typeof b.sd_raw !== "number" ||
          isNaN(b.mean_raw) ||
          isNaN(b.sd_raw) ||
          b.sd_raw <= 0
        )
          return `${p}.mean_raw and sd_raw must be numbers with sd_raw > 0`;
      } else if (b.method === "lookup") {
        if (!Array.isArray(b.lookup) || b.lookup.length === 0)
          return `${p}.lookup must be a non-empty array`;
        let prevRaw = -Infinity;
        let prevPerc = -Infinity;
        for (let j = 0; j < b.lookup.length; j++) {
          const pair = b.lookup[j];
          if (!Array.isArray(pair) || pair.length !== 2)
            return `${p}.lookup[${j}] must be [raw, percentile]`;
          const [raw, perc] = pair;
          if (typeof raw !== "number" || typeof perc !== "number")
            return `${p}.lookup[${j}] must contain numbers`;
          if (raw < prevRaw) return `${p}.lookup raw values must be ascending`;
          if (perc < prevPerc)
            return `${p}.lookup percentiles must not decrease`;
          prevRaw = raw;
          prevPerc = perc;
        }
      } else {
        return `${p}.method must be "linear" or "lookup"`;
      }
    }
    const sorted = country.age_bands
      .slice()
      .sort((a, b) => a.min_age - b.min_age);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].min_age < sorted[i - 1].max_age)
        return `countries[${code}] age bands overlap: ${sorted[i - 1].id} and ${sorted[i].id}`;
    }
  }
  return null;
}

// GET /api/iq/config -> { items, norms }
router.get("/iq/config", async (req, res, next) => {
  try {
    const itemsDoc = await IqConfig.findOne({ key: "items" }).lean();
    const normsDoc = await IqConfig.findOne({ key: "norms" }).lean();
    res.json({
      items: (itemsDoc && itemsDoc.data) || {},
      norms: (normsDoc && normsDoc.data) || {},
    });
  } catch (e) {
    next(e);
  }
});

async function saveConfig(key, data, admin) {
  const existing = await IqConfig.findOne({ key }).lean();
  const updated = await IqConfig.findOneAndUpdate(
    { key },
    { data, previous: existing ? existing.data : null, updatedBy: admin },
    { upsert: true, new: true },
  );
  return updated.data;
}

router.put("/iq/items", async (req, res, next) => {
  try {
    const err = validateItems(req.body);
    if (err) return res.status(400).json({ error: err });
    res.json(await saveConfig("items", req.body, who(req)));
  } catch (e) {
    next(e);
  }
});

router.put("/iq/norms", async (req, res, next) => {
  try {
    const err = validateNorms(req.body);
    if (err) return res.status(400).json({ error: err });
    res.json(await saveConfig("norms", req.body, who(req)));
  } catch (e) {
    next(e);
  }
});

// POST /api/iq/norms/import-csv  body: { csv, default_country, source }
router.post("/iq/norms/import-csv", async (req, res, next) => {
  try {
    const { csv, default_country, source } = req.body || {};
    if (
      typeof csv !== "string" ||
      typeof default_country !== "string" ||
      typeof source !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "csv, default_country and source must be strings" });
    }
    const lines = csv.trim().split(/\r?\n/);
    const header = lines.shift() || "";
    const expected = [
      "code",
      "name",
      "country_sd_iq",
      "band_id",
      "min_age",
      "max_age",
      "method",
      "mean_raw",
      "sd_raw",
      "reliability",
      "form_length",
      "max_raw",
      "synthetic",
      "notes",
    ];
    if (
      header
        .split(",")
        .map((s) => s.trim())
        .join(",") !== expected.join(",")
    ) {
      return res.status(400).json({ error: "CSV header mismatch" });
    }
    const countries = {};
    for (const line of lines) {
      if (!line.trim()) continue;
      const cols = line.split(",").map((v) => v.trim());
      const [
        code,
        name,
        country_sd_iq,
        band_id,
        min_age,
        max_age,
        method,
        mean_raw,
        sd_raw,
        reliability,
        form_length,
        max_raw,
        synthetic,
        notes,
      ] = cols;
      if (synthetic !== "true" && synthetic !== "false") {
        return res
          .status(400)
          .json({ error: `synthetic must be true or false in line: ${line}` });
      }
      if (!countries[code]) {
        countries[code] = {
          name,
          sd_iq: Number(country_sd_iq),
          synthetic: synthetic === "true",
          notes: notes || "",
          age_bands: [],
        };
      }
      countries[code].age_bands.push({
        id: band_id,
        label: `${band_id} years`,
        min_age: Number(min_age),
        max_age: Number(max_age),
        method,
        mean_raw: Number(mean_raw),
        sd_raw: Number(sd_raw),
        reliability: Number(reliability),
        form_length: Number(form_length),
        max_raw: Number(max_raw),
        theta_mean: 0,
        theta_sd: 1,
      });
    }
    const existing = await IqConfig.findOne({ key: "norms" }).lean();
    const newData = {
      ...((existing && existing.data) || {}),
      countries,
      default_country,
      source,
    };
    const err = validateNorms(newData);
    if (err) return res.status(400).json({ error: err });
    res.json(await saveConfig("norms", newData, who(req)));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
