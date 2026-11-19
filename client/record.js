
// record.js: admin login, Patients page, complete Patient Record. Loads after run.js.
const TK = "cpt_token";
TABS.splice(1, 0, ["patients", "Patients"], ["record", "Patient Record"]);
// navbar in working order, numbered so the doctor knows the next step
const LBL = Object.fromEntries(TABS.map((t) => [t[0], t[1]]));
const ORDER = [
  "home",
  "patients",
  "intake",
  "survey",
  "checker",
  "personality",
  "conditions",
  "batteries",
  "tests",
  "administer",
  "report",
  "history",
  "record",
];
TABS.splice(
  0,
  TABS.length,
  ...ORDER.map((id, i) => [id, (i ? i + ". " : "") + LBL[id]]),
);
Object.assign(state, { pq2: "", np: false });

// ---- auth: every API call carries the admin token ----
api = async function (path, method, body) {
  if (!API) return null;
  try {
    const r = await fetch(API + path, {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (sessionStorage.getItem(TK) || ""),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401) {
      logout();
      return null;
    }
    if (!r.ok) return null;
    return r.status === 204 ? {} : await r.json();
  } catch (e) {
    return null;
  }
};
function logout() {
  sessionStorage.removeItem(TK);
  localStorage.removeItem("cpt_sel");
  state.cid = null;
  render();
}
async function doLogin(u, p, msg) {
  msg.textContent = "";
  try {
    const r = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    if (!r.ok) {
      msg.textContent =
        r.status === 401
          ? "Wrong username or password."
          : "Could not sign in. Try again.";
      return;
    }
    const d = await r.json();
    sessionStorage.setItem(TK, d.token);
    location.hash = "#patients";
    await syncAll();
    render();
  } catch (e) {
    msg.textContent = "Cannot connect. Check your internet connection.";
  }
}
function loginView() {
  $("#nav").replaceChildren();
  const u = el("input", {
      type: "text",
      placeholder: "Username",
      autocomplete: "username",
    }),
    p = el("input", {
      type: "password",
      placeholder: "Password",
      autocomplete: "current-password",
    }),
    m = el("div", { class: "bad", style: "display:none" });
  const go = async () => {
    await doLogin(u.value.trim(), p.value, m);
    m.style.display = m.textContent ? "block" : "none";
  };
  p.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go();
  });
  $("#app").replaceChildren(
    el(
      "div",
      { class: "login card" },
      el("img", { src: "logo-icon.webp", alt: "", class: "login-logo" }),
      el("h2", {}, "Admin sign in"),
      el("p", { class: "mut" }, "Susa Lab Clinical Psychology Test Battery"),
      u,
      p,
      m,
      el("button", { onclick: go }, "Sign in"),
    ),
  );
}
const _render = render;
render = function (k) {
  if (!sessionStorage.getItem(TK)) {
    loginView();
    return;
  }
  _render(k);
  decorate();
  $("#nav").append(
    el(
      "a",
      {
        href: "#",
        onclick: (e) => {
          e.preventDefault();
          logout();
        },
      },
      "Logout",
    ),
  );
};

// ---- other records: personality, symptom checker, quick survey, intake ----
async function saveRecord(c, kind, data) {
  const r = { id: "r" + Date.now(), kind, data, at: new Date().toISOString() };
  (c.records = c.records || []).push(r);
  save();
  if (await pushPatient(c)) {
    const x = await api("/patients/" + c.sid + "/records", "POST", {
      kind,
      data,
      takenAt: r.at,
    });
    if (x && x._id) {
      r.sid = x._id;
      save();
    }
  }
  return r;
}
const _syncAll = syncAll;
syncAll = async function () {
  await loadIQ();
  await _syncAll();
  for (const c of CL) {
    if (!c.sid) continue;
    for (const r of c.records || [])
      if (!r.sid) {
        const x = await api("/patients/" + c.sid + "/records", "POST", {
          kind: r.kind,
          data: r.data,
          takenAt: r.at,
        });
        if (x && x._id) r.sid = x._id;
      }
  }
  save();
};
function buildPQ() {
  const P = D.pq,
    ans = state.pq;
  if (Object.keys(ans).length < P.items.length)
    return "Answer all personality questions first.";
  const traits = {};
  Object.keys(P.traits).forEach((k) => {
    const idx = P.items.map((q, i) => [q, i]).filter(([q]) => q.t === k);
    const sum = idx.reduce((s, [q, i]) => s + (q.r ? 6 - ans[i] : ans[i]), 0),
      p = (sum - idx.length) / (4 * idx.length);
    traits[k] = {
      name: P.traits[k].name,
      pct: Math.round(p * 100),
      level: p <= 0.4 ? "Low" : p >= 0.65 ? "High" : "Medium",
    };
  });
  return { traits, answers: ans };
}
function buildSX() {
  const sx = state.sx,
    sel = D.syms.filter((s) => sx[s.id]);
  if (!sel.length) return "Tick at least one symptom first.";
  const top = D.cond
    .map((c) => {
      const m = c.sy.filter((s) => sx[s]);
      return { name: c.name, p: m.length / c.sy.length, n: m.length };
    })
    .filter((r) => r.n)
    .sort((a, b) => b.p - a.p || b.n - a.n)
    .slice(0, 6)
    .map((r) => ({ name: r.name, pct: Math.round(r.p * 100) }));
  return { symptoms: sel.map((s) => ({ id: s.id, label: s.l })), top };
}
function buildSV() {
  const a = state.ans,
    q = D.surv;
  if (!q.some((x) => a[x.no] != null && a[x.no] !== ""))
    return "Answer at least one survey question first.";
  const areas = {};
  q.forEach((x) => {
    const o = areas[x.area] || (areas[x.area] = { score: 0, max: 0 });
    o.score += +a[x.no] || 0;
    o.max += 3;
  });
  return {
    total: q
      .filter((x) => x.no !== 31)
      .reduce((s, x) => s + (+a[x.no] || 0), 0),
    max: 3 * (q.length - 1),
    risk: +a[31] > 0,
    areas,
    age: state.age,
    lit: state.lit,
  };
}
function buildIN() {
  const all = D.intake,
    yes = all.filter((q) => state.yn[q.id] === "Yes"),
    by = {};
  const answered = all.filter(
    (q) => state.yn[q.id] || (state.notes[q.id] || "").trim(),
  );
  yes.forEach((q) => {
    if (/^B\d/.test(q.bid)) by[q.bid] = (by[q.bid] || 0) + 1;
  });
  return {
    answered: answered.length,
    total: all.length,
    yes: yes.length,
    safety: yes.filter((q) => q.sec === "Safety / Risk").length,
    areas: by,
    notes: all
      .filter((q) => (state.notes[q.id] || "").trim())
      .map((q) => ({ q: q.q, note: state.notes[q.id] })),
    yn: state.yn,
  };
}
function saveBar(kind, build) {
  const st = el("span", { class: "mut" }),
    c0 = cc();
  return el(
    "div",
    { class: "card np", style: "border:2px solid var(--acc)" },
    el("h3", {}, "Save to patient record"),
    el(
      "div",
      { class: "row" },
      el(
        "span",
        {},
        "Saving to: ",
        el("b", {}, c0 ? c0.name : "no patient selected"),
      ),
      el(
        "button",
        {
          onclick: async () => {
            const c = cc();
            if (!c) {
              st.textContent = "Select a patient first (Patients tab).";
              return;
            }
            const d = build();
            if (typeof d === "string") {
              st.textContent = d;
              return;
            }
            await saveRecord(c, kind, d);
            st.textContent = "Saved to " + c.name + "'s record \u2713";
          },
        },
        "Save",
      ),
      st,
    ),
  );
}
const wrap = (name, fn) => {
  const o = V[name];
  V[name] = function () {
    const d = o(),
      b = fn();
    if (b) d.append(b);
    return d;
  };
};
wrap("personality", () => saveBar("personality", buildPQ));
wrap("checker", () => saveBar("symptoms", buildSX));
wrap("survey", () => saveBar("survey", buildSV));
wrap("intake", () => (state.isub ? saveBar("intake", buildIN) : null));

// ---- Patients page: clinic registration, search, select ----
const PF = [
  [
    "Basic details",
    [
      ["name", "Full name *"],
      ["age", "Age *", "number"],
      ["sex", "Sex", "select", ["", "Male", "Female", "Other"]],
      ["dob", "Date of birth", "date"],
      [
        "marital",
        "Marital status",
        "select",
        ["", "Single", "Married", "Divorced", "Widowed"],
      ],
      ["education", "Education"],
      ["occupation", "Occupation"],
      ["language", "Preferred language"],
    ],
  ],
  [
    "Contact",
    [
      ["phone", "Phone number *", "tel"],
      ["phone2", "Secondary number", "tel"],
      ["email", "Email", "email"],
      ["address", "Address / city"],
      ["emName", "Emergency contact name"],
      ["emPhone", "Emergency contact number", "tel"],
    ],
  ],
  [
    "Body",
    [
      ["height", "Height (cm)", "number"],
      ["weight", "Weight (kg)", "number"],
    ],
  ],
  [
    "Visit and history",
    [
      ["ref", "Reason for visit *", "textarea"],
      ["referred", "Referred by"],
      [
        "medHx",
        "Medical history: accident, head injury, operation, illness",
        "textarea",
      ],
      ["meds", "Current medicines", "textarea"],
      ["allergy", "Allergies"],
      ["psyHx", "Past mental health treatment", "textarea"],
      [
        "famHx",
        "Family history (mental illness, memory problems, substance use)",
        "textarea",
      ],
      ["substance", "Alcohol, tobacco or drug use", "textarea"],
    ],
  ],
];
const PFK = PF.flatMap((g) => g[1].map((x) => x[0])).concat("consent");
const PROF = PFK.filter(
  (k) => !["name", "age", "sex", "ref"].includes(k),
).concat(["pid", "date"]);
const bmi = (c) => {
  const h = +c.height / 100,
    w = +c.weight;
  return h > 0 && w > 0 ? (w / (h * h)).toFixed(1) : "";
};
const brief = (c) =>
  [c.age && c.age + " yrs", c.sex, c.phone].filter(Boolean).join(" \u00B7 ");
pushPatient = async function (c) {
  const prof = {};
  PROF.forEach((k) => (prof[k] = c[k] === undefined ? "" : c[k]));
  const d = {
    name: c.name,
    age: c.age,
    sex: c.sex,
    examiner: c.examiner,
    referral: c.ref,
    profile: prof,
  };
  const p = c.sid
    ? await api("/patients/" + c.sid, "PUT", d)
    : await api("/patients", "POST", d);
  if (p && p._id) {
    c.sid = p._id;
    save();
  }
  return !!(p && p._id);
};
pullPatients = async function () {
  const x = await api("/patients");
  if (!Array.isArray(x)) return false;
  x.forEach((p) => {
    let c = CL.find((q) => q.sid === p._id);
    if (!c) {
      c = { id: "s" + p._id, sid: p._id, runs: {}, history: [], records: [] };
      CL.push(c);
    }
    Object.assign(
      c,
      {
        name: p.name,
        age: p.age || "",
        sex: p.sex || "",
        examiner: p.examiner || "",
        ref: p.referral || "",
      },
      p.profile || {},
    );
  });
  save();
  return true;
};
function selectPatient(id) {
  if (state.cid !== id) {
    Object.assign(state, {
      pq: {},
      sx: {},
      yn: {},
      notes: {},
      ans: {},
      isub: false,
      runAb: null,
      runBat: null,
      focusBat: null,
      hid: {},
      fl: null,
      hab: null,
    });
    state.cid = id;
  }
  const c = cc(),
    a = parseInt(c && c.age);
  if (!isNaN(a))
    state.age =
      a < 18
        ? "Child/Adolescent (under 18)"
        : a >= 60
          ? "Older adult (60+)"
          : "Adult (18-59)";
  localStorage.setItem("cpt_sel", id);
}
clientBar = function () {
  return el("div", { style: "display:none" });
};
function strip(bb) {
  const c = cc();
  return el(
    "div",
    { class: "card np pstrip" },
    el(
      "div",
      { class: "row", style: "margin:0" },
      bb,
      c
        ? el(
            "div",
            {},
            el("b", {}, "Patient: " + c.name),
            el("span", { class: "mut" }, "  " + brief(c)),
          )
        : el(
            "span",
            { class: "mut" },
            "No patient selected. Select a patient to continue.",
          ),
    ),
    el(
      "button",
      { class: "sec", onclick: () => goTo("patients") },
      c ? "Change patient" : "Select patient",
    ),
  );
}
function stepNav() {
  const c = cur(),
    i = TABS.findIndex((t) => t[0] === c),
    nx = TABS[i + 1];
  const back = () => {
    const p = (state.trail || []).pop();
    state.back = true;
    if (p) goTo(p);
    else if (i > 0) goTo(TABS[i - 1][0]);
  };
  const mk = () => el("button", { class: "sec", onclick: back }, "\u2190 Back");
  return {
    bb: i > 0 ? mk() : el("span"),
    bar: el(
      "div",
      {
        class: "row np",
        style: "justify-content:space-between;margin-top:14px",
      },
      i > 0 ? mk() : el("span"),
      nx
        ? el(
            "button",
            { onclick: () => goTo(nx[0]) },
            "Next: " + nx[1].replace(/^\d+\.\s*/, "") + " \u2192",
          )
        : el("span"),
    ),
  };
}
function decorate() {
  const c = cur(),
    s = stepNav(),
    app = $("#app");
  if (state.last && state.last !== c && !state.back) {
    (state.trail = state.trail || []).push(state.last);
    if (state.trail.length > 30) state.trail.shift();
  }
  state.last = c;
  state.back = false;
  if (c === "patients") app.prepend(el("div", { class: "row np" }, s.bb));
  else if (c !== "home") app.prepend(strip(s.bb));
  app.append(s.bar);
  const on = $("#nav a.on");
  if (on) $("#nav").scrollLeft = on.offsetLeft - 40;
}
function pfield(x) {
  const [k, label, type, opts] = x,
    f = state.pf;
  const mk =
    type === "textarea"
      ? el("textarea", { oninput: (e) => (f[k] = e.target.value) }, f[k] || "")
      : type === "select"
        ? el(
            "select",
            { onchange: (e) => (f[k] = e.target.value) },
            opts.map((o) => el("option", { selected: o === (f[k] || "") }, o)),
          )
        : el("input", {
            type: type || "text",
            value: f[k] || "",
            oninput: (e) => (f[k] = e.target.value),
          });
  return el("label", { class: type === "textarea" ? "wide" : "" }, label, mk);
}
async function savePatient() {
  const f = state.pf,
    errs = [],
    isNew = state.pe === "new";
  if (!(f.name || "").trim()) errs.push("Name");
  if (!f.age || isNaN(+f.age)) errs.push("Age");
  if (!/^[+\d][\d\s-]{6,}$/.test((f.phone || "").trim()))
    errs.push("Phone number (at least 7 digits)");
  if (!(f.ref || "").trim()) errs.push("Reason for visit");
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim()))
    errs.push("Email (not valid)");
  if (!f.consent) errs.push("Consent");
  if (errs.length) return alert("Please fill: " + errs.join(", "));
  const dup = CL.find(
    (x) => x.id !== state.pe && x.phone && x.phone === f.phone.trim(),
  );
  if (
    isNew &&
    dup &&
    !confirm(
      "A patient with this phone number already exists (" +
        dup.name +
        "). Create another?",
    )
  )
    return;
  let c = isNew ? null : CL.find((x) => x.id === state.pe);
  if (!c) {
    c = {
      id: "c" + Date.now(),
      runs: {},
      history: [],
      records: [],
      examiner: "",
      date: new Date().toISOString().slice(0, 10),
      pid: "P" + Date.now().toString(36).slice(-5).toUpperCase(),
    };
    CL.push(c);
  }
  PFK.forEach((k) => (c[k] = typeof f[k] === "string" ? f[k].trim() : f[k]));
  state.pe = null;
  save();
  await pushPatient(c);
  selectPatient(c.id);
  goTo(isNew ? "intake" : "patients");
}
function patientForm() {
  const isNew = state.pe === "new",
    c = isNew ? null : CL.find((x) => x.id === state.pe);
  return el(
    "div",
    {},
    el("h2", {}, isNew ? "New patient" : "Edit patient"),
    PF.map((g) =>
      el(
        "div",
        { class: "card" },
        el("h3", {}, g[0]),
        el("div", { class: "pform" }, g[1].map(pfield)),
      ),
    ),
    el(
      "div",
      { class: "card" },
      el(
        "label",
        { class: "row" },
        el("input", {
          type: "checkbox",
          checked: !!state.pf.consent,
          onchange: (e) => (state.pf.consent = e.target.checked),
        }),
        "The patient (or guardian) has given consent for assessment and for storing these records. *",
      ),
    ),
    el(
      "div",
      { class: "row" },
      el(
        "button",
        { onclick: savePatient },
        isNew ? "Save and start intake" : "Save changes",
      ),
      el(
        "button",
        {
          class: "sec",
          onclick: () => {
            state.pe = null;
            render();
          },
        },
        "Cancel",
      ),
      c &&
        el(
          "button",
          {
            class: "sec",
            onclick: async () => {
              if (
                !confirm("Delete " + c.name + " and all records permanently?")
              )
                return;
              if (c.sid) await api("/patients/" + c.sid, "DELETE");
              CL = CL.filter((x) => x !== c);
              if (state.cid === c.id) state.cid = null;
              state.pe = null;
              save();
              render();
            },
          },
          "Delete patient",
        ),
    ),
  );
}
V.patients = function () {
  if (!state.pT || Date.now() - state.pT > 20000) {
    state.pT = Date.now();
    api("/patients").then(async (x) => {
      if (!Array.isArray(x)) return;
      state.pst = {};
      x.forEach((p) => (state.pst[p._id] = p));
      await pullPatients();
      if (!state.pe) render();
    });
  }
  if (state.pe) return patientForm();
  const st = state.pst || {},
    q = (state.pq2 || "").toLowerCase().trim(),
    qd = q.replace(/\D/g, "");
  const hit = (c) =>
    !q ||
    [c.name, c.phone, c.phone2, c.email, c.pid, c.ref].some((v) =>
      String(v || "")
        .toLowerCase()
        .includes(q),
    ) ||
    (qd.length >= 3 &&
      [c.phone, c.phone2, c.emPhone].some((v) =>
        String(v || "")
          .replace(/\D/g, "")
          .includes(qd),
      ));
  const info = (c) => {
    const s = c.sid && st[c.sid];
    return {
      tests: s ? s.resultCount : (c.history || []).length,
      recs: s ? s.recordCount : (c.records || []).length,
      last:
        (s && s.lastActivityAt) ||
        (c.history || [])
          .concat(c.records || [])
          .map((x) => x.at)
          .sort()
          .pop() ||
        "",
    };
  };
  const list = CL.filter(hit)
    .map((c) => [c, info(c)])
    .sort((a, b) => (b[1].last > a[1].last ? 1 : -1));
  return el(
    "div",
    {},
    el("h2", {}, "Patients"),
    el(
      "div",
      { class: "row" },
      el("input", {
        type: "search",
        placeholder: "Search by name, phone number, email or ID",
        value: state.pq2,
        oninput: (e) => {
          state.pq2 = e.target.value;
          render(true);
        },
      }),
      el(
        "button",
        {
          onclick: () => {
            state.pe = "new";
            state.pf = {};
            render();
          },
        },
        "+ New patient",
      ),
    ),
    el(
      "p",
      { class: "mut" },
      CL.length +
        " patient(s)" +
        (q ? ", " + list.length + " match" : "") +
        ". Select a patient to use their name in every page.",
    ),
    list.length
      ? list.map(([c, i]) =>
          el(
            "div",
            {
              class: "card pc",
              style: c.id === state.cid ? "border:2px solid var(--acc)" : "",
            },
            el(
              "div",
              {},
              el("b", {}, c.name),
              c.id === state.cid
                ? el(
                    "span",
                    { class: "tag ok", style: "margin-left:8px" },
                    "Selected",
                  )
                : null,
              el(
                "div",
                { class: "mut" },
                [
                  brief(c),
                  c.pid && "ID " + c.pid,
                  c.height && c.weight && "BMI " + bmi(c),
                ]
                  .filter(Boolean)
                  .join(" | "),
              ),
              el("div", { class: "mut" }, "Reason: " + (c.ref || "-")),
              el(
                "div",
                { class: "mut" },
                i.tests +
                  " test result(s), " +
                  i.recs +
                  " other record(s)" +
                  (i.last
                    ? ", last activity " + String(i.last).slice(0, 10)
                    : ""),
              ),
            ),
            el(
              "div",
              { class: "row" },
              el(
                "button",
                {
                  onclick: () => {
                    selectPatient(c.id);
                    goTo("intake");
                  },
                },
                "Select and start",
              ),
              el(
                "button",
                {
                  class: "sec",
                  onclick: () => {
                    selectPatient(c.id);
                    goTo("record");
                  },
                },
                "Open record",
              ),
              el(
                "button",
                {
                  class: "sec",
                  onclick: () => {
                    state.pe = c.id;
                    state.pf = Object.assign({}, c);
                    render();
                  },
                },
                "Edit",
              ),
            ),
          ),
        )
      : el(
          "p",
          { class: "mut" },
          q
            ? "No patient matches your search."
            : "No patients yet. Press + New patient.",
        ),
  );
};
// report card: patient details come from the registration, only the examiner is asked
const _rep = V.report;
V.report = function () {
  const d = _rep(),
    c = cc();
  if (!c) return d;
  const form = [...d.children].find(
    (x) => x.querySelector && x.querySelector("input[type=date]"),
  );
  if (form)
    d.replaceChild(
      el(
        "div",
        { class: "card row np" },
        el(
          "label",
          {},
          "Examiner (doctor name) ",
          el("input", {
            type: "text",
            value: c.examiner || "",
            oninput: (e) => {
              c.examiner = e.target.value;
              save();
              const b = d.querySelector(".sh-info").children[3].lastChild;
              b.textContent = c.examiner || "-";
            },
            onchange: () => pushPatient(c),
          }),
        ),
      ),
      form,
    );
  const info = d.querySelector(".sh-info"),
    wide = info && info.querySelector(".wide");
  const mk = (l, v) =>
    el("div", { class: "sh-cell" }, el("small", {}, l), el("b", {}, v || "-"));
  if (wide) {
    [
      mk("Patient ID", c.pid),
      mk("Phone", c.phone),
      mk(
        "Height / Weight",
        c.height || c.weight
          ? (c.height || "-") +
              " cm / " +
              (c.weight || "-") +
              " kg" +
              (bmi(c) ? " (BMI " + bmi(c) + ")" : "")
          : "-",
      ),
    ].forEach((n) => info.insertBefore(n, wide));
  }
  const r = d.querySelector(".sh-r");
  if (r) r.textContent = "Date: " + new Date().toISOString().slice(0, 10);
  return d;
};
state.cid = CL.some((c) => c.id === localStorage.getItem("cpt_sel"))
  ? localStorage.getItem("cpt_sel")
  : null;

// ---- Patient Record: complete history with before/after ----
async function loadFull(c) {
  const x = await api("/patients/" + c.sid + "/full");
  if (!x || !Array.isArray(x.results)) return false;
  const loc = (c.history || []).filter((h) => !h.sid),
    locr = (c.records || []).filter((r) => !r.sid);
  c.history = x.results
    .map((h) => ({
      id: h._id,
      sid: h._id,
      ab: h.ab,
      name: h.name,
      cat: h.cat,
      raw: h.raw,
      max: h.max,
      label: h.label,
      rank: h.rank,
      risk: !!h.risk,
      scaled: h.scaled || "",
      notes: h.notes || "",
      at: h.takenAt,
    }))
    .concat(loc);
  c.records = (x.records || [])
    .map((r) => ({
      id: r._id,
      sid: r._id,
      kind: r.kind,
      data: r.data,
      at: r.takenAt,
    }))
    .concat(locr);
  save();
  return true;
}
const by = (c, k) =>
  (c.records || [])
    .filter((r) => r.kind === k)
    .sort((a, b) => (a.at < b.at ? -1 : 1));
const dir = (a, b) => (b < a ? "better" : b > a ? "worse" : "same");
const dirTag = (d) =>
  el(
    "span",
    d === "better"
      ? { class: "tag ok" }
      : d === "worse"
        ? { class: "tag", style: "background:#fde2e2;color:#7f1d1d" }
        : { class: "tag" },
    d === "better" ? "Improved" : d === "worse" ? "Worse" : "No change",
  );
const LV = { Low: 0, Medium: 1, High: 2 },
  day = (x) => String(x).slice(0, 10),
  nm = (t) => t.name.split(" (")[0];
const tdir = (pts) => {
  if (pts.length < 2) return null;
  const a = pts[0],
    b = pts[pts.length - 1],
    cfg = SC[a.ab];
  if (!cfg) return null;
  const d = b.raw - a.raw;
  return d === 0 ? "same" : (cfg.low ? d > 0 : d < 0) ? "better" : "worse";
};
V.record = function () {
  const c = cc();
  if (!c)
    return el(
      "div",
      {},
      el("h2", {}, "Patient Record"),
      el("p", { class: "mut" }, "Open a patient from the Patients tab."),
      el("button", { onclick: () => goTo("patients") }, "Go to Patients"),
    );
  if (c.sid && state.fl !== c.id) {
    state.fl = c.id;
    loadFull(c).then((ok) => {
      state.off = !ok;
      render();
    });
  }
  const H = (c.history || []).slice().sort((a, b) => (a.at < b.at ? -1 : 1)),
    abs = [...new Set(H.map((h) => h.ab))];
  const P = by(c, "personality"),
    S = by(c, "symptoms"),
    SV = by(c, "survey"),
    I = by(c, "intake"),
    last = (a) => a[a.length - 1];
  const g = [],
    td = abs.map((a) => tdir(H.filter((h) => h.ab === a))).filter(Boolean);
  if (td.length) {
    const b = td.filter((x) => x === "better").length,
      w = td.filter((x) => x === "worse").length;
    g.push([
      "Tests",
      b +
        " improved, " +
        w +
        " worse, " +
        (td.length - b - w) +
        " unchanged (of " +
        td.length +
        " repeated tests)",
      b > w ? "better" : w > b ? "worse" : "same",
    ]);
  }
  if (P.length > 1 && P[0].data.traits.N && last(P).data.traits.N)
    g.push([
      "Stress and worry (personality)",
      P[0].data.traits.N.level + " \u2192 " + last(P).data.traits.N.level,
      dir(LV[P[0].data.traits.N.level], LV[last(P).data.traits.N.level]),
    ]);
  if (S.length > 1)
    g.push([
      "Symptoms ticked",
      S[0].data.symptoms.length + " \u2192 " + last(S).data.symptoms.length,
      dir(S[0].data.symptoms.length, last(S).data.symptoms.length),
    ]);
  if (SV.length > 1)
    g.push([
      "Quick survey total",
      SV[0].data.total + " \u2192 " + last(SV).data.total,
      dir(SV[0].data.total, last(SV).data.total),
    ]);
  if (I.length > 1)
    g.push([
      "Intake: Yes answers",
      I[0].data.yes + " \u2192 " + last(I).data.yes,
      dir(I[0].data.yes, last(I).data.yes),
    ]);
  const del = (r) =>
    el(
      "button",
      {
        class: "sec np",
        onclick: async () => {
          if (!confirm("Delete this record?")) return;
          if (r.sid) await api("/records/" + r.sid, "DELETE");
          c.records = c.records.filter((x) => x !== r);
          save();
          render();
        },
      },
      "Delete",
    );
  const rows = (arr, fmt) =>
    arr
      .slice()
      .reverse()
      .map((r) =>
        el(
          "div",
          { class: "row" },
          el("b", {}, day(r.at)),
          el("span", {}, fmt(r.data)),
          del(r),
        ),
      );
  const sec = (t, kids, n) =>
    el(
      "div",
      { class: "card" },
      el("h3", {}, t),
      n ? kids.flat(Infinity) : el("p", { class: "mut" }, "Nothing saved yet."),
    );
  const set = (a, b) => {
      const z = new Set(b);
      return a.filter((x) => !z.has(x));
    },
    l = (a) => (a.length ? a.join("; ") : "none");
  const box = el("div");
  if (H.some((h) => pct(h) != null))
    box.innerHTML = chart(H, abs, state.hid || {});
  const leg = el(
    "div",
    { class: "row np" },
    abs
      .filter((a) => H.some((h) => h.ab === a && pct(h) != null))
      .map((a) => {
        const hd = (state.hid || {})[a],
          cl = tcol(abs, a);
        return el(
          "button",
          {
            style: hd
              ? "background:transparent;color:" + cl + ";border-color:" + cl
              : "background:" + cl + ";border-color:" + cl + ";color:#fff",
            onclick: () => {
              (state.hid = state.hid || {})[a] = !hd;
              render();
            },
          },
          a,
        );
      }),
  );
  const sl = (r) => r.data.symptoms.map((s) => s.label);
  return el(
    "div",
    {},
    el("h2", {}, "Patient Record"),
    el(
      "div",
      { class: "row np" },
      el(
        "button",
        { class: "sec", onclick: () => goTo("patients") },
        "\u2190 All patients",
      ),
      el("button", { onclick: () => window.print() }, "Print full record"),
    ),
    state.off &&
      el(
        "div",
        { class: "card mut" },
        "Offline: showing records saved on this device. They upload automatically when the database is reachable.",
      ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, c.name),
      el(
        "div",
        { class: "mut" },
        [
          c.age && "Age " + c.age,
          c.sex,
          c.ref && "Reason: " + c.ref,
          "Report date " + new Date().toISOString().slice(0, 10),
        ]
          .filter(Boolean)
          .join(" | "),
      ),
    ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Progress at a glance (first visit \u2192 latest)"),
      g.length
        ? el(
            "ul",
            {},
            g.map(([lb, t, d]) =>
              el("li", {}, el("b", {}, lb + ": "), t + " ", dirTag(d)),
            ),
          )
        : el(
            "p",
            { class: "mut" },
            "Repeat a test, quiz or checker on another day to see improvement here.",
          ),
    ),
    sec(
      "Test results",
      [
        el(
          "ul",
          {},
          abs.map((a) =>
            el(
              "li",
              { class: H.some((h) => h.ab === a && isIQ(h)) ? "np" : "" },
              el("b", {}, a + ": "),
              trend(H.filter((h) => h.ab === a)),
            ),
          ),
        ),
        leg,
        box,
        H.slice()
          .reverse()
          .map((h) =>
            el(
              "div",
              { class: isIQ(h) ? "row np" : "row" },
              el("b", {}, day(h.at)),
              el(
                "span",
                {},
                h.ab +
                  ": " +
                  h.raw +
                  (h.max ? " / " + h.max : "") +
                  " \u2013 " +
                  h.label +
                  (h.risk ? " (RISK FLAG)" : ""),
              ),
            ),
          ),
      ],
      H.length,
    ),
    H.some(isIQ) &&
      el(
        "div",
        { class: "card np", style: "border-left:4px solid var(--acc2)" },
        el("h3", {}, "Doctor only: intelligence results (never printed)"),
        H.filter(isIQ)
          .slice()
          .reverse()
          .map((h) =>
            el(
              "div",
              { class: "row" },
              el("b", {}, day(h.at)),
              el(
                "span",
                {},
                h.ab +
                  (h.scaled ? ": " + h.scaled : ": no IQ calculated") +
                  " (raw score " +
                  h.raw +
                  ")",
              ),
            ),
          ),
      ),
    sec(
      "Personality quiz",
      [
        rows(P, (d) =>
          Object.values(d.traits)
            .map((t) => nm(t) + ": " + t.level)
            .join(" | "),
        ),
        P.length > 1 &&
          el(
            "p",
            { class: "mut" },
            "Change: " +
              Object.keys(last(P).data.traits)
                .filter((k) => P[0].data.traits[k])
                .map(
                  (k) =>
                    nm(last(P).data.traits[k]) +
                    " " +
                    P[0].data.traits[k].level +
                    " \u2192 " +
                    last(P).data.traits[k].level,
                )
                .join(" | "),
          ),
      ],
      P.length,
    ),
    sec(
      "Symptom checker",
      [
        rows(
          S,
          (d) =>
            d.symptoms.length +
            " symptoms. Likely: " +
            d.top
              .slice(0, 3)
              .map((t) => t.name + " " + t.pct + "%")
              .join(", "),
        ),
        S.length > 1 &&
          el(
            "p",
            { class: "mut" },
            "Resolved since first visit: " +
              l(set(sl(S[0]), sl(last(S)))) +
              ". New: " +
              l(set(sl(last(S)), sl(S[0]))) +
              ".",
          ),
      ],
      S.length,
    ),
    sec(
      "Quick survey",
      [
        rows(
          SV,
          (d) =>
            "Total " +
            d.total +
            " / " +
            d.max +
            (d.risk ? " (SAFETY FLAG)" : ""),
        ),
        SV.length > 1 &&
          el(
            "p",
            { class: "mut" },
            "Area scores changed: " +
              l(
                Object.keys(last(SV).data.areas)
                  .filter(
                    (k) =>
                      SV[0].data.areas[k] &&
                      SV[0].data.areas[k].score !==
                        last(SV).data.areas[k].score,
                  )
                  .map(
                    (k) =>
                      k +
                      " " +
                      SV[0].data.areas[k].score +
                      " \u2192 " +
                      last(SV).data.areas[k].score,
                  ),
              ),
          ),
      ],
      SV.length,
    ),
    sec(
      "Intake interview",
      [
        rows(
          I,
          (d) =>
            d.answered +
            "/" +
            d.total +
            " answered, " +
            d.yes +
            " Yes" +
            (d.safety ? " (" + d.safety + " safety)" : ""),
        ),
        I.length > 1 &&
          el(
            "p",
            { class: "mut" },
            "Yes answers: " + I[0].data.yes + " \u2192 " + last(I).data.yes,
          ),
      ],
      I.length,
    ),
  );
};
// ---- IQ calculator: doctor only, stored in the record, never printed on the patient report ----
const isIQ = (h) => String(h.cat || "").indexOf("Intelligence") === 0;
function probit(p) {
  const a = [
      -39.69683028665376, 220.9460984245205, -275.9285104469687,
      138.357751867269, -30.66479806614716, 2.506628277459239,
    ],
    b = [
      -54.47609879822406, 161.5858368580409, -155.6989798598866,
      66.80131188771972, -13.28068155288572,
    ],
    c = [
      -0.007784894002430293, -0.3223964580411365, -2.400758277161838,
      -2.549732539343734, 4.374664141464968, 2.938163982698783,
    ],
    d = [
      0.007784695709041462, 0.3224671290700398, 2.445134137142996,
      3.754408661907416,
    ];
  const pl = 0.02425;
  let q, r;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > 1 - pl) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  q = p - 0.5;
  r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}
const IQM = [
  [
    "std",
    "I already have the IQ / standard score from the manual (mean 100, SD 15)",
    [["IQ or standard score", "x"]],
    (v) => v.x,
    "Add up the subtest scores as the manual says, then look the total up in the manual's conversion table. The table gives the composite or full-scale IQ. Type that number here.",
  ],
  [
    "dev",
    "Raw score with norm mean and SD",
    [
      ["Raw score", "x"],
      ["Norm mean", "m"],
      ["Norm SD", "s"],
    ],
    (v) => 100 + (15 * (v.x - v.m)) / v.s,
    "Raw score = the marks the patient got (filled in from the box above). Norm mean and norm SD = the Mean and SD columns in the manual's norm table for the patient's age group.",
  ],
  [
    "pct",
    "Percentile from the norm table",
    [["Percentile (1 to 99)", "p"]],
    (v) => 100 + 15 * probit(v.p / 100),
    "In the manual's norm table for the patient's age, find the patient's raw score and read the percentile next to it. Type that percentile.",
  ],
  [
    "ss",
    "Scaled score (mean 10, SD 3)",
    [["Scaled score", "x"]],
    (v) => 100 + (15 * (v.x - 10)) / 3,
    "The scaled score of a subtest comes from the manual's raw-to-scaled table. This gives an IQ-equivalent for that one subtest only.",
  ],
  [
    "t",
    "T-score (mean 50, SD 10)",
    [["T-score", "x"]],
    (v) => 100 + (15 * (v.x - 50)) / 10,
    "The T-score comes from the manual's norm table (average is 50).",
  ],
  [
    "z",
    "z-score (mean 0, SD 1)",
    [["z-score", "x"]],
    (v) => 100 + 15 * v.x,
    "Use only if you already have a z-score.",
  ],
  [
    "ratio",
    "Ratio IQ: mental age / chronological age (children)",
    [
      ["Mental age (months)", "ma"],
      ["Chronological age (months)", "ca"],
    ],
    (v) => (100 * v.ma) / v.ca,
    "Mental age = the age level at which the child performs (from the manual's age-equivalent table). Chronological age = the child's real age. Both in months.",
  ],
];
const IQH = {
  "WAIS-IV": [
    "std",
    "Add the subtest scaled scores, then use the manual's conversion table to get the Full Scale IQ (FSIQ). Type the FSIQ here.",
  ],
  "WISC-V": [
    "std",
    "Add the subtest scaled scores, then use the manual's conversion table to get the Full Scale IQ (FSIQ). Type the FSIQ here.",
  ],
  "WPPSI-IV": [
    "std",
    "Add the subtest scaled scores, then use the manual's conversion table to get the Full Scale IQ. Type it here.",
  ],
  "WASI-II": [
    "std",
    "Convert the sum of T-scores to FSIQ-4 or FSIQ-2 with the manual's table and type it here.",
  ],
  SB5: [
    "std",
    "Use the manual's table to get the Full Scale IQ and type it here.",
  ],
  "KABC-II": [
    "std",
    "Use the manual's table to get the global scale index (mean 100, SD 15) and type it here.",
  ],
  "Raven SPM": [
    "pct",
    "Count the correct answers (out of 60). In the Raven manual's norm table for the patient's age, find the percentile for that raw score and type it here.",
  ],
  "Raven CPM": [
    "pct",
    "Count the correct answers (out of 36). In the CPM norm table for the patient's age, find the percentile and type it here.",
  ],
  "Bhatia BPT": [
    "std",
    "The Bhatia manual's Indian norm table converts the total performance score to IQ. Type that IQ here. If the table gives a mean and SD for the age group, use the raw-score method instead.",
  ],
  MISIC: [
    "std",
    "Use the MISIC manual's tables to get the Verbal, Performance or Full-scale IQ and type it here.",
  ],
};
const IQT = (v) => iqClass(v);
const NG = () => {
  try {
    return JSON.parse(localStorage.getItem("cpt_norms") || "{}");
  } catch (e) {
    return {};
  }
};
const normFor = (ab, age) =>
  (NG()[ab] || []).find((b) => age >= b.lo && age <= b.hi);
const cdf = (z) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z)),
    d = 0.3989423 * Math.exp((-z * z) / 2),
    p =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};
// in-app IQ test: item bank, age-band norms and form selection come from iq-data.js (ported from the iq_engine package)
if (!D.tests.some((x) => x.ab === "IQT"))
  D.tests.push({
    id: "T110",
    ab: "IQT",
    name: "IQ Test (in-app)",
    cat: "Intelligence & Cognitive Ability",
    time: 15,
    mat: "This screen only; no kit needed",
    prep: "Quiet room with good light. Check vision, reading ability and tiredness. Read the questions aloud for patients with low literacy.",
    steps: [
      "1. Check the patient's age is saved (6 years or more).",
      "2. Explain: choose the best answer for each question; there is no time limit; do not help.",
      "3. Press Submit and score. The raw score, norm mean and SD and the IQ calculator fill in automatically.",
    ],
    score:
      "Number correct, converted with the age-band norm: IQ = 100 + 15 x (raw - mean) / SD.",
    interp:
      "Deviation IQ with 95% range. Placeholder norms until real norms are loaded.",
    prec: "Check whether the norms are marked placeholder before using the IQ. Not a diagnosis.",
    who: "Clinician, researcher or trained staff.",
    purpose:
      "Reasoning test using number series, analogies, classification, logic and arithmetic",
    age: "6+ yrs",
    type: "Performance-based",
    fmt: "Individual",
    items: "7 to 20 items by age band",
    pub: "Susa Lab (iq_engine item bank)",
    access: "Free / public domain",
    india: "Norms are placeholders until real data is loaded",
    ref: "iq_engine demo item bank",
  });
ASK.IQT = [
  "Education, language and reading ability?",
  "Vision (with glasses), hearing, and tiredness today?",
  "Any head injury, seizures or medicines that affect thinking?",
  "Read each question aloud if the patient has low literacy, and do not hint.",
  "Note effort, attention and anxiety about being tested.",
];
IQH.IQT = [
  "dev",
  "Submit the questions and the raw score, norm mean and SD fill in from the age-band norm table.",
];
async function loadIQ() {
  const x = await api("/iq/config");
  const its = x && x.items && (x.items.items || x.items);
  if (Array.isArray(its) && its.length && x.norms && x.norms.countries) {
    IQ_ITEMS = its;
    IQ_NORMS = x.norms;
  }
}
const _p3 = panel;
panel = function (c, t) {
  const d = _p3(c, t);
  const isI = t.cat.indexOf("Intelligence") === 0,
    W = isI ? "IQ" : "Standard score",
    isQ = t.ab === "IQT";
  const inp = [...d.querySelectorAll("input")].find((x) => x.type === "text"),
    host = inp && inp.closest(".card");
  if (!host) return d;
  const run = c.runs[t.ab],
    box = el("div", {
      class: "card np",
      style: "border:2px solid var(--acc2)",
    }),
    val = {},
    out = el("div", { style: "font-weight:700;margin:8px 0" }),
    age = parseInt(c.age),
    di = IQM.findIndex((m) => m[0] === "dev"),
    nb = { lo: isNaN(age) ? "" : age, hi: isNaN(age) ? "" : age },
    note = el("div", { class: "mut" }),
    ciNote = el("div", { class: "mut" }),
    warn = el("div", { class: "bad", style: "display:none" });
  let mi = di,
    iq = null,
    nk = t.ab;
  const calc = () => {
    const m = IQM[mi],
      v = {};
    let ok = true;
    m[2].forEach((f) => {
      v[f[1]] = parseFloat(val[m[0] + f[1]]);
      if (isNaN(v[f[1]])) ok = false;
    });
    if (ok && m[0] === "dev" && v.s <= 0) ok = false;
    if (ok && m[0] === "pct" && !(v.p > 0 && v.p < 100)) ok = false;
    if (ok && m[0] === "ratio" && v.ca <= 0) ok = false;
    iq = ok ? Math.round(m[3](v)) : null;
    out.textContent =
      iq === null
        ? "Fill the values to see the " + W + "."
        : W + " = " + iq + " (" + IQT(iq) + ")";
  };
  const draw = () => {
    if (mi === di && !val.devm) {
      const nm = normFor(nk, age);
      if (nm) {
        val.devm = nm.mean;
        val.devs = nm.sd;
        note.textContent =
          "Norm mean and SD filled from your saved norms for ages " +
          nm.lo +
          " to " +
          nm.hi +
          ".";
      }
    }
    box.replaceChildren(
      el("h3", {}, W + " calculator (doctor only)"),
      el(
        "p",
        { class: "mut" },
        "Saved for the doctor only. Never printed on the patient's report card.",
      ),
      el(
        "div",
        { class: "row" },
        IQM[mi][2].map((f) =>
          el(
            "label",
            {},
            f[0] + " ",
            el("input", {
              type: "number",
              step: "any",
              value: val[IQM[mi][0] + f[1]] || "",
              oninput: (e) => {
                val[IQM[mi][0] + f[1]] = e.target.value;
                ciNote.textContent = "";
                warn.style.display = "none";
                calc();
              },
            }),
          ),
        ),
      ),
      el(
        "p",
        { class: "mut" },
        "Norm mean and SD come from the test manual's norm table, or from the average and SD of your own sample of people of the same age.",
      ),
      IQH[t.ab]
        ? el("p", { class: "mut" }, "For " + t.ab + ": " + IQH[t.ab][1])
        : "",
      out,
      ciNote,
      warn,
      el(
        "div",
        { class: "row" },
        el(
          "button",
          {
            onclick: () => {
              if (iq === null) return;
              inp.value =
                W +
                " " +
                iq +
                " (" +
                IQT(iq) +
                ")" +
                (nk === "IQT" && !isQ ? " [IQ test]" : "");
              inp.dispatchEvent(new Event("input"));
            },
          },
          "Use this " + (isI ? "IQ" : "score") + " in the field above",
        ),
      ),
      mi === di
        ? el(
            "div",
            { class: "row" },
            el("span", { class: "mut" }, "Remember this mean and SD for ages"),
            el("input", {
              type: "number",
              style: "width:70px",
              value: nb.lo,
              oninput: (e) => (nb.lo = e.target.value),
            }),
            el("span", {}, "to"),
            el("input", {
              type: "number",
              style: "width:70px",
              value: nb.hi,
              oninput: (e) => (nb.hi = e.target.value),
            }),
            el(
              "button",
              {
                class: "sec",
                onclick: () => {
                  const m = parseFloat(val.devm),
                    sd = parseFloat(val.devs),
                    lo = parseFloat(nb.lo),
                    hi = parseFloat(nb.hi);
                  if (
                    isNaN(m) ||
                    !(sd > 0) ||
                    isNaN(lo) ||
                    isNaN(hi) ||
                    lo > hi
                  ) {
                    note.textContent =
                      "Fill the norm mean, SD and the age range first.";
                    return;
                  }
                  const g = NG();
                  g[nk] = (g[nk] || [])
                    .filter((b) => !(b.lo === lo && b.hi === hi))
                    .concat([{ lo, hi, mean: m, sd }]);
                  localStorage.setItem("cpt_norms", JSON.stringify(g));
                  note.textContent =
                    "Remembered. Patients aged " +
                    lo +
                    " to " +
                    hi +
                    " are now filled in automatically.";
                },
              },
              "Remember",
            ),
          )
        : "",
      note,
    );
    calc();
  };
  const rawIn = d.querySelector("input[type=number]");
  let quiz = null;
  if (isI) {
    const band = iqBand(age),
      form = band ? iqForm(band.min_age, band.form_length) : [],
      pick = {},
      msg = el("div", { style: "font-weight:700;margin-top:8px" }),
      syn = !!iqCountry().synthetic;
    const submit = () => {
      if (
        Object.keys(pick).length < form.length &&
        !confirm(
          "Some questions are unanswered and will count as wrong. Score anyway?",
        )
      )
        return;
      const raw = form.filter((it) => pick[it.id] === it.answer).length,
        sdq = iqCountry().sd_iq || 15,
        z = (raw - band.mean_raw) / band.sd_raw,
        v = 100 + sdq * z,
        sem = sdq * Math.sqrt(1 - band.reliability);
      nk = "IQT";
      val.devx = raw;
      val.devm = band.mean_raw;
      val.devs = band.sd_raw;
      note.textContent = "";
      mi = di;
      box.style.display = "";
      if (isQ && rawIn) {
        rawIn.value = raw;
        rawIn.dispatchEvent(new Event("input"));
      }
      draw();
      ciNote.textContent =
        "95% range: " +
        Math.round(v - 1.96 * sem) +
        " to " +
        Math.round(v + 1.96 * sem) +
        "  |  Percentile: " +
        Math.round(100 * cdf(z)) +
        "  |  Age band " +
        band.id;
      
      inp.value =
        W +
        " " +
        iq +
        " (" +
        IQT(iq) +
        ")" +
        (syn ? " [placeholder norms]" : "");
      inp.dispatchEvent(new Event("input"));
      msg.textContent =
        "Score " +
        raw +
        " / " +
        form.length +
        ". The IQ calculator below is filled in: " +
        W +
        " = " +
        iq +
        " (" +
        IQT(iq) +
        ")" +
        (syn ? ", placeholder norms." : ".");
    };
    quiz = el(
      "div",
      { class: "card np", style: "border:2px solid var(--acc)" },
      el(
        "h3",
        {},
        "IQ test" +
          (band
            ? " (" + form.length + " questions, age band " + band.id + ")"
            : ""),
      ),
      band && form.length
        ? [
            el(
              "p",
              { class: "mut" },
              "No time limit. Read the questions aloud for patients with low literacy. Do not help with answers." +
                (syn ? " The norms behind the score are placeholders." : ""),
            ),
            form.map((it, k) =>
              el(
                "div",
                { class: "card" },
                el("b", {}, k + 1 + ". " + it.prompt),
                el(
                  "div",
                  { class: "opts" },
                  it.choices.map((o, n) =>
                    el(
                      "label",
                      {},
                      el("input", {
                        type: "radio",
                        name: "iq" + k,
                        onchange: () => (pick[it.id] = n),
                      }),
                      o,
                    ),
                  ),
                ),
              ),
            ),
            el("button", { onclick: submit }, "Submit and score"),
            msg,
          ].flat(Infinity)
        : el(
            "p",
            { class: "mut" },
            "The IQ test needs the patient's age, 6 years or more. Edit the patient and add the age.",
          ),
    );
    if (!isQ) quiz.style.display = "none";
    host.before(quiz);
  }
  const lab = inp.closest("label");
  if (!isQ) box.style.display = "none";
  const tg = (el0) => {
    el0.style.display = el0.style.display === "none" ? "" : "none";
    el0.scrollIntoView({ block: "nearest" });
  };
  if (lab)
    lab.parentNode.after(
      el(
        "p",
        { class: "mut" },
        "Total / main raw score = the marks you counted on the real test sheet (for your record). Scaled / standard score, IQ or percentile = the converted score from the test manual, or the IQ from the calculator below. Changing one does not change the other.",
      ),
    );
  if (lab)
    lab.parentNode.append(
      ...[
        quiz && el("button", { onclick: () => tg(quiz) }, "Take IQ test"),
        el(
          "button",
          {
            class: "sec",
            onclick: () => {
              if (
                box.style.display === "none" &&
                !val.devx &&
                rawIn &&
                rawIn.value
              ) {
                val.devx = rawIn.value;
                draw();
              }
              tg(box);
            },
          },
          "Calculate " + (isI ? "IQ" : "standard score"),
        ),
      ].filter(Boolean),
    );
  draw();
  host.after(box);
  return d;
};
if (sessionStorage.getItem(TK)) syncAll().then(() => render());
render();
