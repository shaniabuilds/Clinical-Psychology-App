
const LOGO =
  "data:image/webp;base64,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";
const LS = "cpt_clients_v1";
let CL = [];
try {
  CL = JSON.parse(localStorage.getItem(LS) || "[]");
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem(LS, JSON.stringify(CL));
  } catch (e) {}
};
Object.assign(state, {
  rq: "",
  rcat: "All",
  runAb: null,
  cid: CL[0] && CL[0].id,
});
const cc = () => CL.find((c) => c.id === state.cid) || null;

const O4 = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];
const B = (max, bands, o) => Object.assign({ max, bands }, o || {});
// bands = [[upper score, label], ...] in ascending score order; low:1 means a LOW score is worse (cognitive tests)
const SC = {
  "PHQ-9": {
    max: 27,
    opts: O4,
    intro: "Over the last 2 weeks, how often has the person been bothered by:",
    risk: { i: 8 },
    bands: [
      [4, "Minimal"],
      [9, "Mild"],
      [14, "Moderate"],
      [19, "Moderately severe"],
      [27, "Severe"],
    ],
    items: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about self, a failure, or having let family down",
      "Trouble concentrating (reading, watching TV)",
      "Moving or speaking very slowly, or being very restless",
      "Thoughts of being better off dead, or of hurting self",
    ],
  },
  "GAD-7": {
    max: 21,
    opts: O4,
    intro: "Over the last 2 weeks, how often has the person been bothered by:",
    bands: [
      [4, "Minimal"],
      [9, "Mild"],
      [14, "Moderate"],
      [21, "Severe"],
    ],
    items: [
      "Feeling nervous, anxious or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
  },
  CAGE: {
    max: 4,
    opts: ["No", "Yes"],
    intro: "Ask each question about drinking:",
    bands: [
      [1, "Low suspicion"],
      [4, "Clinically significant (2 or more)"],
    ],
    items: [
      "Have you ever felt you should Cut down on your drinking?",
      "Have people Annoyed you by criticising your drinking?",
      "Have you ever felt bad or Guilty about your drinking?",
      "Have you ever had a drink first thing in the morning to steady nerves or cure a hangover (Eye-opener)?",
    ],
  },
  "BDI-II": B(
    63,
    [
      [13, "Minimal"],
      [19, "Mild"],
      [28, "Moderate"],
      [63, "Severe"],
    ],
    { risk: { min: 99 } },
  ),
  BAI: B(63, [
    [7, "Minimal"],
    [15, "Mild"],
    [25, "Moderate"],
    [63, "Severe"],
  ]),
  "HAM-D": B(52, [
    [7, "Normal"],
    [13, "Mild"],
    [18, "Moderate"],
    [22, "Severe"],
    [52, "Very severe"],
  ]),
  MADRS: B(60, [
    [6, "Normal"],
    [19, "Mild"],
    [34, "Moderate"],
    [60, "Severe"],
  ]),
  "HAM-A": B(56, [
    [17, "Mild"],
    [24, "Mild to moderate"],
    [30, "Moderate to severe"],
    [56, "Severe"],
  ]),
  "CES-D": B(60, [
    [15, "Below cutoff"],
    [60, "Possible depression risk (16+)"],
  ]),
  GDS: B(
    30,
    [
      [9, "Normal"],
      [19, "Mild depression"],
      [30, "Severe depression"],
    ],
    { hint: "30-item form" },
  ),
  EPDS: B(30, [
    [9, "Low risk"],
    [12, "Possible depression"],
    [30, "Probable depression (13+)"],
  ]),
  BHS: B(
    20,
    [
      [3, "Minimal"],
      [8, "Mild"],
      [14, "Moderate"],
      [20, "Severe"],
    ],
    { risk: { min: 9 } },
  ),
  "PCL-5": B(80, [
    [30, "Below cutoff"],
    [80, "Probable PTSD (31-33+)"],
  ]),
  "Y-BOCS": B(40, [
    [7, "Subclinical"],
    [15, "Mild"],
    [23, "Moderate"],
    [31, "Severe"],
    [40, "Extreme"],
  ]),
  "CY-BOCS": B(40, [
    [7, "Subclinical"],
    [15, "Mild"],
    [23, "Moderate"],
    [31, "Severe"],
    [40, "Extreme"],
  ]),
  "OCI-R": B(72, [
    [20, "Below cutoff"],
    [72, "Possible OCD (21+)"],
  ]),
  "PSS-10": B(40, [
    [13, "Low stress"],
    [26, "Moderate stress"],
    [40, "High stress"],
  ]),
  ISI: B(28, [
    [7, "No insomnia"],
    [14, "Subthreshold"],
    [21, "Moderate"],
    [28, "Severe"],
  ]),
  PSQI: B(21, [
    [5, "Good sleep"],
    [21, "Poor sleep (above 5)"],
  ]),
  AUDIT: B(40, [
    [7, "Low risk"],
    [15, "Hazardous use"],
    [19, "Harmful use"],
    [40, "Dependence likely"],
  ]),
  "DAST-10": B(10, [
    [0, "No problem"],
    [2, "Low"],
    [5, "Moderate"],
    [8, "Substantial"],
    [10, "Severe"],
  ]),
  FTND: B(10, [
    [2, "Very low"],
    [4, "Low"],
    [5, "Medium"],
    [7, "High"],
    [10, "Very high"],
  ]),
  K10: B(50, [
    [19, "Likely well"],
    [24, "Mild distress"],
    [29, "Moderate distress"],
    [50, "Severe distress"],
  ]),
  "GHQ-12": B(
    12,
    [
      [2, "Below cutoff"],
      [12, "Possible distress (3+)"],
    ],
    { hint: "GHQ scoring 0-0-1-1" },
  ),
  YMRS: B(60, [
    [11, "Below mania cutoff"],
    [60, "Possible mania (12+)"],
  ]),
  SPIN: B(68, [
    [18, "Below cutoff"],
    [68, "Possible social anxiety (19+)"],
  ]),
  PSWQ: B(80, [
    [61, "Below high-worry range"],
    [80, "High worry (62+)"],
  ]),
  LSAS: B(144, [
    [54, "Low"],
    [65, "Moderate"],
    [80, "Marked"],
    [144, "Severe"],
  ]),
  "EAT-26": B(78, [
    [19, "Below cutoff"],
    [78, "At risk (20+): refer"],
  ]),
  "M-CHAT-R/F": B(20, [
    [2, "Low risk"],
    [7, "Medium risk (do follow-up)"],
    [20, "High risk (refer)"],
  ]),
  "CARS-2": B(60, [
    [29, "Below autism cutoff"],
    [36, "Mild to moderate autism range"],
    [60, "Severe autism range"],
  ]),
  ISAA: B(200, [
    [69, "No autism"],
    [106, "Mild autism"],
    [153, "Moderate autism"],
    [200, "Severe autism"],
  ]),
  SDQ: B(40, [
    [13, "Close to average"],
    [16, "Slightly raised"],
    [19, "High"],
    [40, "Very high"],
  ]),
  MoCA: B(
    30,
    [
      [17, "Moderate to severe impairment range"],
      [25, "Below cutoff (possible MCI)"],
      [30, "Normal range"],
    ],
    { low: 1, hint: "Add 1 point if 12 years or less education" },
  ),
  MMSE: B(
    30,
    [
      [9, "Severe impairment"],
      [18, "Moderate impairment"],
      [23, "Mild impairment"],
      [30, "Normal range"],
    ],
    { low: 1 },
  ),
  "ACE-III": B(
    100,
    [
      [82, "Below cutoff (dementia likely)"],
      [88, "Borderline"],
      [100, "Above cutoff"],
    ],
    { low: 1 },
  ),
  FAB: B(
    18,
    [
      [11, "Possible frontal dysfunction"],
      [18, "Normal range"],
    ],
    { low: 1 },
  ),
  "C-SSRS": B(
    6,
    [
      [0, "No ideation or behaviour"],
      [2, "Low risk"],
      [4, "Moderate risk"],
      [6, "High risk"],
    ],
    {
      risk: { min: 3 },
      hint: "Enter the HIGHEST level: 0 none, 1 wish to be dead, 2 active thoughts, 3 method, 4 intent, 5 plan, 6 attempt or behaviour",
    },
  ),
};
Object.assign(SC, {
  GDS: {
    max: 15,
    opts: ["No", "Yes"],
    flip: [0, 4, 6, 10, 12],
    intro:
      "15-item form. Ask: how did the person feel over the past week? Answer Yes or No.",
    bands: [
      [4, "Normal"],
      [8, "Mild depression"],
      [11, "Moderate depression"],
      [15, "Severe depression"],
    ],
    items: [
      "Are you basically satisfied with your life?",
      "Have you dropped many of your activities and interests?",
      "Do you feel that your life is empty?",
      "Do you often get bored?",
      "Are you in good spirits most of the time?",
      "Are you afraid something bad is going to happen to you?",
      "Do you feel happy most of the time?",
      "Do you often feel helpless?",
      "Do you prefer to stay at home rather than go out and do new things?",
      "Do you feel you have more memory problems than most?",
      "Do you think it is wonderful to be alive now?",
      "Do you feel pretty worthless the way you are now?",
      "Do you feel full of energy?",
      "Do you feel that your situation is hopeless?",
      "Do you think most people are better off than you?",
    ],
  },
  "CES-D": {
    max: 60,
    opts: [
      "Rarely (less than 1 day)",
      "Some (1-2 days)",
      "Occasionally (3-4 days)",
      "Most (5-7 days)",
    ],
    flip: [3, 7, 11, 15],
    intro: "During the past week, how often did the person feel this way?",
    bands: [
      [15, "Below cutoff"],
      [60, "Possible depression risk (16+)"],
    ],
    items: [
      "Bothered by things that usually do not bother me",
      "Did not feel like eating; appetite was poor",
      "Could not shake off the blues",
      "Felt I was as good as other people",
      "Trouble keeping my mind on what I was doing",
      "Felt depressed",
      "Felt everything I did was an effort",
      "Felt hopeful about the future",
      "Thought my life had been a failure",
      "Felt fearful",
      "Sleep was restless",
      "Was happy",
      "Talked less than usual",
      "Felt lonely",
      "People were unfriendly",
      "Enjoyed life",
      "Had crying spells",
      "Felt sad",
      "Felt that people disliked me",
      "Could not get going",
    ],
  },
  "PSS-10": {
    max: 40,
    opts: ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"],
    flip: [3, 4, 6, 7],
    intro: "In the last month, how often has the person:",
    bands: [
      [13, "Low stress"],
      [26, "Moderate stress"],
      [40, "High stress"],
    ],
    items: [
      "Been upset because of something unexpected",
      "Felt unable to control the important things in life",
      "Felt nervous and stressed",
      "Felt confident about handling personal problems",
      "Felt that things were going their way",
      "Found they could not cope with all the things to do",
      "Been able to control irritations in life",
      "Felt on top of things",
      "Been angered by things outside their control",
      "Felt difficulties were piling up too high to overcome",
    ],
  },
  K10: {
    max: 50,
    offset: 10,
    opts: [
      "None of the time",
      "A little of the time",
      "Some of the time",
      "Most of the time",
      "All of the time",
    ],
    intro: "In the past 4 weeks, how often did the person feel:",
    bands: [
      [19, "Likely well"],
      [24, "Mild distress"],
      [29, "Moderate distress"],
      [50, "Severe distress"],
    ],
    items: [
      "Tired out for no good reason",
      "Nervous",
      "So nervous that nothing could calm them down",
      "Hopeless",
      "Restless or fidgety",
      "So restless they could not sit still",
      "Depressed",
      "That everything was an effort",
      "So sad that nothing could cheer them up",
      "Worthless",
    ],
  },
  "DAST-10": {
    max: 10,
    opts: ["No", "Yes"],
    flip: [2],
    intro: "In the past 12 months (not alcohol or tobacco):",
    bands: [
      [0, "No problem"],
      [2, "Low"],
      [5, "Moderate"],
      [8, "Substantial"],
      [10, "Severe"],
    ],
    items: [
      "Have you used drugs other than those required for medical reasons?",
      "Do you use more than one drug at a time?",
      "Are you always able to stop using drugs when you want to?",
      "Have you had blackouts or flashbacks from drug use?",
      "Do you ever feel bad or guilty about your drug use?",
      "Does your spouse or parent complain about your drug use?",
      "Have you neglected your family because of drug use?",
      "Have you engaged in illegal activities to obtain drugs?",
      "Have you experienced withdrawal symptoms when you stopped?",
      "Have you had medical problems because of drug use (for example memory loss, bleeding)?",
    ],
  },
});
delete SC["BDI-II"].risk;

function band(c, v) {
  const n = c.bands.length - 1 || 1;
  let k = c.bands.findIndex((b) => v <= b[0]);
  if (k < 0) k = c.bands.length - 1;
  return { label: c.bands[k][1], rank: c.low ? 1 - k / n : k / n };
}
function evalRun(ab, r) {
  const cfg = SC[ab];
  let raw = null;
  const a = r.ans || {};
  if (cfg && cfg.items) {
    if (cfg.items.every((_, i) => a[i] != null))
      raw =
        (cfg.offset || 0) +
        cfg.items.reduce(
          (s, _, i) =>
            s +
            (cfg.flip && cfg.flip.includes(i)
              ? cfg.opts.length - 1 - a[i]
              : a[i]),
          0,
        );
  } else if (r.raw !== "" && r.raw != null && !isNaN(+r.raw)) raw = +r.raw;
  if (raw == null) return null;
  if (cfg && (raw < 0 || raw > cfg.max)) return { invalid: true };
  if (!cfg)
    return {
      raw,
      label: "Score recorded. Interpret with manual norms.",
      rank: null,
    };
  const b = band(cfg, raw);
  let risk = false;
  if (cfg.risk) {
    if (cfg.risk.i != null) risk = (a[cfg.risk.i] || 0) > 0;
    if (cfg.risk.min != null) risk = risk || raw >= cfg.risk.min;
  }
  return { raw, max: cfg.max, label: b.label, rank: b.rank, risk };
}

function newClient() {
  const n = prompt("Patient name or ID:");
  if (!n || !n.trim()) return;
  const c = {
    id: "c" + Date.now(),
    name: n.trim(),
    age: "",
    sex: "",
    date: new Date().toISOString().slice(0, 10),
    examiner: "",
    ref: "",
    runs: {},
    history: [],
  };
  CL.push(c);
  pushPatient(c);
  state.cid = c.id;
  save();
  render();
}
function clientBar() {
  const c = cc();
  return el(
    "div",
    { class: "card row np" },
    CL.length
      ? el(
          "select",
          {
            onchange: (e) => {
              state.cid = e.target.value;
              render();
            },
          },
          CL.map((x) =>
            el("option", { value: x.id, selected: x.id === state.cid }, x.name),
          ),
        )
      : el("span", { class: "mut" }, "No patient yet."),
    el("button", { onclick: newClient }, "+ New patient"),
    c &&
      el(
        "button",
        {
          class: "sec",
          onclick: () => {
            if (confirm("Delete " + c.name + " and all scores?")) {
              if (c.sid) api("/patients/" + c.sid, "DELETE");
              CL = CL.filter((x) => x !== c);
              state.cid = CL[0] && CL[0].id;
              save();
              render();
            }
          },
        },
        "Delete patient",
      ),
    null,
  );
}
function stopwatch() {
  let t0 = 0,
    acc = 0,
    iv = null;
  const d = el("b", {}, "0.0 s");
  const show = () => {
    if (!d.isConnected) {
      clearInterval(iv);
      iv = null;
      return;
    }
    d.textContent =
      ((acc + (iv ? Date.now() - t0 : 0)) / 1000).toFixed(1) + " s";
  };
  return el(
    "div",
    { class: "row" },
    "Timer: ",
    d,
    el(
      "button",
      {
        class: "sec",
        onclick: () => {
          if (iv) {
            acc += Date.now() - t0;
            clearInterval(iv);
            iv = null;
          } else {
            t0 = Date.now();
            iv = setInterval(show, 100);
          }
          show();
        },
      },
      "Start / Stop",
    ),
    el(
      "button",
      {
        class: "sec",
        onclick: () => {
          clearInterval(iv);
          iv = null;
          acc = 0;
          show();
        },
      },
      "Reset",
    ),
  );
}
function panel(c, t) {
  const r = c.runs[t.ab] || {
      raw: "",
      scaled: "",
      ans: {},
      steps: {},
      notes: "",
    },
    cfg = SC[t.ab];
  const res = el("div", {
    class: "card",
    style: "border:2px solid var(--acc)",
  });
  const upd = () => {
    const e = evalRun(t.ab, r);
    res.replaceChildren(
      ...[
        el("h3", {}, "Live result"),
        !e
          ? el(
              "p",
              { class: "mut" },
              cfg && cfg.items
                ? "Answer all items to see the score."
                : "Enter the score to see the result.",
            )
          : e.invalid
            ? el(
                "div",
                { class: "bad" },
                "Score must be between 0 and " + cfg.max,
              )
            : [
                e.risk &&
                  el(
                    "div",
                    { class: "bad" },
                    "SAFETY ALERT: risk indicator positive. Do a risk assessment (C-SSRS) and make a safety plan.",
                  ),
                el(
                  "p",
                  {},
                  el("b", {}, "Score: "),
                  e.raw + (e.max ? " / " + e.max : ""),
                ),
                el("p", {}, el("b", {}, "Result: "), e.label),
              ],
      ]
        .flat()
        .filter(Boolean),
    );
  };
  const ch = () => {
    c.runs[t.ab] = r;
    save();
    upd();
  };
  upd();
  const locked = /^(Restricted|Licensed)/.test(t.access);
  const st = el("span", { class: "mut" });
  return el(
    "div",
    {},
    el("h2", {}, t.ab + " \u2013 " + t.name),
    el(
      "div",
      {},
      ...chips([
        t.cat,
        t.age,
        t.type,
        t.time + " min",
        t.items && t.items + " items",
        t.access,
      ]),
    ),
    el(
      "div",
      { class: "card" },
      el("b", {}, "What to do: "),
      cfg && cfg.items
        ? "Read each question below to the client (or let them read it) and tap their answer. The score appears at the end."
        : "Do this test on the real kit with the client. Tick each step as you finish it, then type the score below.",
    ),
    locked &&
      el(
        "div",
        { class: "card mut" },
        "This test is copyrighted or restricted. Its items and stimuli are not included here. Use your licensed kit or form, then follow the steps and enter the score below. Who can administer: " +
          t.who,
      ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Setup"),
      el("p", {}, el("b", {}, "Materials: "), t.mat),
      el("p", {}, el("b", {}, "Setting: "), t.prep),
      el("p", {}, el("b", {}, "Precautions: "), t.prec),
    ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Step by step (tick as you go)"),
      stopwatch(),
      t.steps.map((s, i) =>
        el(
          "div",
          {},
          el(
            "label",
            {},
            el("input", {
              type: "checkbox",
              checked: !!r.steps[i],
              onchange: (e) => {
                r.steps[i] = e.target.checked;
                ch();
              },
            }),
            " " + s.replace(/^\d+\.\s*/, ""),
          ),
        ),
      ),
    ),
    cfg && cfg.items
      ? el(
          "div",
          {},
          el("h3", {}, "Items"),
          el("p", { class: "mut" }, cfg.intro),
          cfg.items.map((q, i) =>
            el(
              "div",
              { class: "card" },
              el("b", {}, i + 1 + ". " + q),
              el(
                "div",
                { class: "opts" },
                cfg.opts.map((o, v) =>
                  el(
                    "label",
                    {},
                    el("input", {
                      type: "radio",
                      name: "it" + t.ab + i,
                      checked: r.ans[i] === v,
                      onchange: () => {
                        r.ans[i] = v;
                        ch();
                      },
                    }),
                    v + " " + o,
                  ),
                ),
              ),
            ),
          ),
        )
      : el(
          "div",
          { class: "card" },
          el("h3", {}, "Enter score"),
          el("p", { class: "mut" }, "Scoring: " + t.score),
          cfg && cfg.hint && el("p", { class: "mut" }, cfg.hint),
          el(
            "div",
            { class: "row" },
            el(
              "label",
              {},
              "Total / main raw score" +
                (cfg ? " (0 to " + cfg.max + ") " : " "),
              el(
                "input",
                Object.assign(
                  {
                    type: "number",
                    step: "any",
                    value: r.raw,
                    oninput: (e) => {
                      r.raw = e.target.value;
                      ch();
                    },
                  },
                  cfg ? { min: 0, max: cfg.max } : {},
                ),
              ),
            ),
            el(
              "label",
              {},
              "Scaled / standard score, IQ or percentile (optional) ",
              el("input", {
                type: "text",
                value: r.scaled || "",
                oninput: (e) => {
                  r.scaled = e.target.value;
                  ch();
                },
              }),
            ),
          ),
        ),
    res,
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Behaviour observed and notes"),
      el(
        "textarea",
        {
          placeholder: "Effort, attention, mood, anything unusual",
          oninput: (e) => {
            r.notes = e.target.value;
            c.runs[t.ab] = r;
            save();
          },
        },
        r.notes || "",
      ),
    ),
    el(
      "div",
      { class: "row" },
      el(
        "button",
        {
          onclick: async () => {
            c.runs[t.ab] = r;
            save();
            const h = await snap(c, t, r);
            st.textContent = h
              ? "Saved to history \u2713" +
                (API && !h.sid
                  ? " (saved on this device, will upload when the database is reachable)"
                  : "")
              : "Enter a valid score first";
          },
        },
        "Save to history",
      ),
      el(
        "button",
        {
          onclick: () =>
            goTo("report", () => {
              c.runs[t.ab] = r;
              save();
            }),
        },
        "Save and open report card",
      ),
      st,
      el(
        "button",
        {
          class: "sec",
          onclick: () => {
            delete c.runs[t.ab];
            save();
            render();
          },
        },
        "Clear this test",
      ),
    ),
  );
}
V.administer = function () {
  const c = cc(),
    s = (state.rq || "").toLowerCase(),
    cats = ["All", ...new Set(D.tests.map((t) => t.cat))];
  const list = D.tests.filter(
    (t) =>
      (state.rcat === "All" || t.cat === state.rcat) &&
      (!s || (t.name + t.ab).toLowerCase().includes(s)),
  );
  const t = D.tests.find((x) => x.ab === state.runAb);
  return el(
    "div",
    {},
    el("h2", {}, "Administer a test"),
    clientBar(),
    !c
      ? el("p", {}, "Press + New patient to start.")
      : el(
          "div",
          {},
          el(
            "div",
            { class: "card" },
            el("h3", {}, "How to perform a test here"),
            el(
              "ol",
              {},
              [
                "Press + New patient and enter the client's name (done already if you see a name above).",
                "Pick a test below. Tests marked \u25B6 are fully interactive: you ask each question, tap the client's answer, and the score and result appear by themselves. Try PHQ-9 first.",
                "Other tests (WAIS, WPPSI, Rorschach and similar) need a physical kit. Do the test on the kit, tick each step here, then type the score from the kit's scoring table.",
                "Press Save and open report card to see the report.",
              ].map((x) => el("li", {}, x)),
            ),
          ),
          el(
            "div",
            { class: "row" },
            el("input", {
              type: "search",
              placeholder: "Search test",
              value: state.rq,
              oninput: (e) => {
                state.rq = e.target.value;
                render(true);
              },
            }),
            el(
              "select",
              {
                onchange: (e) => {
                  state.rcat = e.target.value;
                  render();
                },
              },
              cats.map((a) =>
                el("option", { value: a, selected: a === state.rcat }, a),
              ),
            ),
          ),
          el(
            "div",
            { class: "row" },
            list.map((x) =>
              el(
                "button",
                {
                  class: x.ab === state.runAb ? "" : "sec",
                  onclick: () => {
                    state.runAb = x.ab;
                    render();
                    scrollTo(0, 0);
                  },
                },
                (SC[x.ab] && SC[x.ab].items ? "\u25B6 " : "") +
                  x.ab +
                  (c.runs[x.ab] ? " \u2713" : ""),
              ),
            ),
          ),
          t
            ? panel(c, t)
            : el(
                "p",
                { class: "mut" },
                "Pick a test above. \u2713 means data already entered for this client.",
              ),
        ),
  );
};

const CATREC = {
  Neuropsych:
    "Rule out reversible causes (thyroid, vitamin B12, medicines, depression, sleep) and consider neurology referral or brain imaging; involve a caregiver.",
  Substance:
    "Give brief intervention, check withdrawal risk and offer de-addiction services.",
  Developmental:
    "Refer for a full developmental assessment, early intervention, speech or occupational therapy and school support.",
  Trauma:
    "Offer trauma-focused therapy with a grounding plan; do not push for trauma details.",
  Psychosis:
    "Arrange psychiatric review soon, take informant history and check safety.",
  Anxiety:
    "Offer psychoeducation and CBT-based anxiety management; check medical and caffeine causes.",
  Depression:
    "Offer psychotherapy (for example CBT) and consider psychiatric review for medicines if moderate or severe.",
  OCD: "Refer for exposure and response prevention (ERP) therapy; check for depression and tics.",
};
const ABREC = {
  "EAT-26":
    "Refer to an eating-disorder specialist team; do not give weight or diet advice.",
  ISI: "Advise sleep hygiene and consider CBT for insomnia; rule out medical causes.",
  PSQI: "Advise sleep hygiene; rule out medical causes.",
};

V.report = function () {
  const c = cc();
  if (!c)
    return el(
      "div",
      {},
      el("h2", {}, "Report Card"),
      clientBar(),
      el(
        "p",
        { class: "mut" },
        "Create a patient, administer tests, then the report card appears here.",
      ),
    );
  const rows = Object.keys(c.runs)
    .map((ab) => ({ t: D.tests.find((x) => x.ab === ab), r: c.runs[ab] }))
    .filter((x) => x.t)
    .map((x) => Object.assign(x, { e: evalRun(x.t.ab, x.r) }))
    .filter((x) => x.e && !x.e.invalid);
  const risk = rows.filter((x) => x.e.risk),
    ranked = rows.filter((x) => x.e.rank != null);
  const top = ranked.slice().sort((a, b) => b.e.rank - a.e.rank)[0];
  const lvl = !ranked.length
    ? "Not enough scored tests"
    : top.e.rank >= 0.75
      ? "High concern"
      : top.e.rank >= 0.4
        ? "Moderate concern"
        : top.e.rank > 0
          ? "Mild concern"
          : "No significant concern";
  const rec = [];
  if (risk.length)
    rec.push(
      "URGENT: risk indicator positive on " +
        risk.map((x) => x.t.ab).join(", ") +
        ". Complete a suicide-risk assessment (C-SSRS), make a safety plan, involve family and refer to a psychiatrist the same day.",
    );
  if (lvl === "High concern")
    rec.push(
      "Refer for detailed clinical evaluation (psychiatrist or clinical psychologist) and plan treatment. Screening scores alone are not enough.",
    );
  else if (lvl === "Moderate concern")
    rec.push(
      "Confirm with a structured clinical interview, consider psychotherapy and review again in 2 to 4 weeks.",
    );
  else if (lvl === "Mild concern")
    rec.push(
      "Give psychoeducation, routine and sleep advice, monitor and repeat screening in about 4 weeks.",
    );
  else if (lvl === "No significant concern")
    rec.push(
      "No action needed on these scores. Rescreen if symptoms appear or get worse.",
    );
  const done = new Set();
  rows
    .filter((x) => x.e.rank >= 0.4)
    .forEach((x) => {
      const k = Object.keys(CATREC).find((k) => x.t.cat.startsWith(k));
      if (ABREC[x.t.ab] && !done.has(x.t.ab)) {
        done.add(x.t.ab);
        rec.push(ABREC[x.t.ab]);
      } else if (k && !done.has(k)) {
        done.add(k);
        rec.push(CATREC[k]);
      }
    });
  rec.push(
    "These are screening results, not a diagnosis. Combine with interview, history and observation, and check publisher norms before decisions.",
  );
  const f = (k, l, type) =>
    el(
      "label",
      {},
      l + " ",
      el("input", {
        type: type || "text",
        value: c[k] || "",
        oninput: (e) => {
          c[k] = e.target.value;
          save();
        },
        onchange: () => pushPatient(c),
      }),
    );
  const col = (r) =>
    r == null
      ? "#3b82d6"
      : r === 0
        ? "#2e9e66"
        : r < 0.4
          ? "#d9a300"
          : r < 0.75
            ? "#ee7b2c"
            : "#d64545";
  const lc =
    {
      "High concern": "#d64545",
      "Moderate concern": "#ee7b2c",
      "Mild concern": "#d9a300",
      "No significant concern": "#2e9e66",
    }[lvl] || "#3b82d6";
  const cell = (l, v, w) =>
    el(
      "div",
      { class: "sh-cell" + (w ? " wide" : "") },
      el("small", {}, l),
      el("b", {}, v || "-"),
    );
  const sheet = el(
    "div",
    { class: "sheet", id: "sheet" },
    el("div", { class: "sh-strip" }),
    el(
      "div",
      { class: "sh-head" },
      el("img", { src: LOGO, alt: "Susa Lab", class: "sh-logo" }),
      el(
        "div",
        { class: "sh-t" },
        el("div", { class: "sh-lab" }, "Susa Lab"),
        el("div", { class: "sh-sub" }, "Psychological Assessment Report Card"),
      ),
      el("div", { class: "sh-r" }, "Date: " + (c.date || "-")),
    ),
    el(
      "div",
      { class: "sh-info" },
      cell("Name / ID", c.name),
      cell("Age", c.age),
      cell("Sex", c.sex),
      cell("Examiner", c.examiner),
      cell("Referral reason", c.ref, 1),
    ),
    el(
      "div",
      { class: "sh-over", style: "border-color:" + lc },
      el("span", { class: "sh-pill", style: "background:" + lc }, lvl),
      el(
        "span",
        {},
        top && top.e.rank > 0
          ? "Highest finding: " + top.t.ab + " \u2013 " + top.e.label
          : rows.length + " test(s) scored",
      ),
    ),
    risk.length > 0 &&
      el(
        "div",
        { class: "sh-alert" },
        "SAFETY ALERT: positive risk indicator (" +
          risk.map((x) => x.t.ab).join(", ") +
          "). See recommendations.",
      ),
    el(
      "div",
      { class: "sh-h" },
      el("div", {}, "Test"),
      el("div", {}, "Score"),
      el("div", {}),
      el("div", {}, "Result"),
    ),
    rows.length
      ? rows.map((x) =>
          el(
            "div",
            { class: "sh-row" },
            el(
              "div",
              { class: "sh-n" },
              el("b", {}, x.t.ab),
              el("small", {}, " " + x.t.name),
            ),
            el(
              "div",
              {},
              x.e.raw +
                (x.e.max ? " / " + x.e.max : "") +
                (x.r.scaled ? " (" + x.r.scaled + ")" : ""),
            ),
            el(
              "div",
              { class: "sh-b" },
              x.e.max &&
                el("i", {
                  style:
                    "width:" +
                    Math.round((100 * x.e.raw) / x.e.max) +
                    "%;background:" +
                    col(x.e.rank),
                }),
            ),
            el(
              "div",
              { class: "sh-res", style: "color:" + col(x.e.rank) },
              x.e.rank == null
                ? "Interpret with manual: " + x.t.interp
                : x.e.label + (x.e.risk ? " \u26A0" : ""),
            ),
          ),
        )
      : el("div", { class: "sh-row" }, "No scores entered yet."),
    el(
      "div",
      { class: "sh-rec" },
      el("h4", {}, "Recommendations"),
      el(
        "ul",
        {},
        rec.map((x) => el("li", {}, x)),
      ),
    ),
    el(
      "div",
      { class: "sh-foot" },
      el(
        "span",
        {},
        "Screening results only, not a diagnosis. Verify with publisher norms.",
      ),
      el("span", {}, "Examiner signature: ____________________"),
    ),
  );
  return el(
    "div",
    {},
    el("h2", { class: "np" }, "Report Card"),
    clientBar(),
    el(
      "div",
      { class: "card row np" },
      f("name", "Name / ID"),
      f("age", "Age"),
      el(
        "label",
        {},
        "Sex ",
        el(
          "select",
          {
            onchange: (e) => {
              c.sex = e.target.value;
              save();
              pushPatient(c);
            },
          },
          ["", "Male", "Female", "Other"].map((a) =>
            el("option", { selected: a === c.sex }, a),
          ),
        ),
      ),
      f("date", "Date", "date"),
      f("examiner", "Examiner"),
      f("ref", "Referral reason"),
    ),
    el(
      "div",
      { class: "row np" },
      el(
        "button",
        { onclick: () => window.print() },
        "Print / Save as PDF (1 page)",
      ),
      el(
        "button",
        { class: "sec", onclick: () => goTo("administer") },
        "Administer more tests",
      ),
    ),
    sheet,
  );
};
// ---- History, progress graph and optional MongoDB backend (API contract: AGENT_PROMPT.md) ----
let API = localStorage.getItem("cpt_api");
if (API == null)
  API =
    (location.protocol || "").indexOf("http") === 0 &&
    (!location.port || location.port === "5000")
      ? "/api"
      : "http://localhost:5000/api";
const qa = new URLSearchParams(location.search).get("api");
if (qa != null) {
  API = qa;
  localStorage.setItem("cpt_api", qa);
}
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m],
  );
const colr = (r) =>
  r == null
    ? "#3b82d6"
    : r === 0
      ? "#2e9e66"
      : r < 0.4
        ? "#d9a300"
        : r < 0.75
          ? "#ee7b2c"
          : "#d64545";
async function api(path, method, body) {
  if (!API) return null;
  try {
    const r = await fetch(API + path, {
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) return null;
    return r.status === 204 ? {} : await r.json();
  } catch (e) {
    return null;
  }
}
async function pushPatient(c) {
  const d = {
    name: c.name,
    age: c.age,
    sex: c.sex,
    examiner: c.examiner,
    referral: c.ref,
  };
  const p = c.sid
    ? await api("/patients/" + c.sid, "PUT", d)
    : await api("/patients", "POST", d);
  if (p && p._id) {
    c.sid = p._id;
    save();
  }
  return !!(p && p._id);
}
async function snap(c, t, r) {
  const e = evalRun(t.ab, r);
  if (!e || e.invalid) return null;
  const h = {
    id: "h" + Date.now(),
    ab: t.ab,
    name: t.name,
    cat: t.cat,
    raw: e.raw,
    max: e.max || null,
    label: e.label,
    rank: e.rank,
    risk: !!e.risk,
    scaled: r.scaled || "",
    notes: r.notes || "",
    answers: r.ans || {},
    at: new Date().toISOString(),
  };
  (c.history = c.history || []).push(h);
  save();
  if (await pushPatient(c)) {
    const x = await api("/patients/" + c.sid + "/results", "POST", {
      ab: h.ab,
      name: h.name,
      cat: h.cat,
      raw: h.raw,
      max: h.max,
      scaled: h.scaled,
      label: h.label,
      rank: h.rank,
      risk: h.risk,
      answers: h.answers,
      notes: h.notes,
      takenAt: h.at,
    });
    if (x && x._id) {
      h.sid = x._id;
      save();
    }
  }
  return h;
}
async function pull(c) {
  const x = await api("/patients/" + c.sid + "/results");
  if (!Array.isArray(x)) return false;
  const loc = (c.history || []).filter((h) => !h.sid);
  c.history = x
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
  save();
  return true;
}
async function pullPatients() {
  const x = await api("/patients");
  if (!Array.isArray(x)) return false;
  x.forEach((p) => {
    if (!CL.some((c) => c.sid === p._id))
      CL.push({
        id: "s" + p._id,
        sid: p._id,
        name: p.name,
        age: p.age || "",
        sex: p.sex || "",
        date: new Date().toISOString().slice(0, 10),
        examiner: p.examiner || "",
        ref: p.referral || "",
        runs: {},
        history: [],
      });
  });
  if (!state.cid && CL[0]) state.cid = CL[0].id;
  save();
  return true;
}
async function syncAll() {
  if (!API || !(await pullPatients())) return;
  for (const c of CL) {
    if (!c.sid && !(await pushPatient(c))) continue;
    for (const h of c.history || [])
      if (!h.sid) {
        const x = await api("/patients/" + c.sid + "/results", "POST", {
          ab: h.ab,
          name: h.name,
          cat: h.cat,
          raw: h.raw,
          max: h.max,
          scaled: h.scaled,
          label: h.label,
          rank: h.rank,
          risk: h.risk,
          answers: h.answers || {},
          notes: h.notes,
          takenAt: h.at,
        });
        if (x && x._id) h.sid = x._id;
      }
  }
  save();
}
const PAL = [
  "#1f77b4",
  "#e8590c",
  "#2f9e44",
  "#9c36b5",
  "#d6336c",
  "#0c8599",
  "#f59f00",
  "#5c7cfa",
];
const tcol = (abs, a) => PAL[abs.indexOf(a) % PAL.length];
// Concern level 0-100 so different tests share one scale (up = worse; memory tests like MoCA are flipped)
const pct = (h) => {
  const cfg = SC[h.ab],
    m = h.max || (cfg && cfg.max);
  if (!m) return null;
  const v = (100 * h.raw) / m;
  return cfg && cfg.low ? 100 - v : v;
};
function chart(H, abs, hid) {
  const W = 680,
    Hh = 280,
    L = 44,
    R = 24,
    T = 16,
    Bm = 46;
  const days = [...new Set(H.map((h) => String(h.at).slice(0, 10)))].sort();
  const X = (d) =>
      L +
      (days.length === 1
        ? (W - L - R) / 2
        : (days.indexOf(d) * (W - L - R)) / (days.length - 1)),
    Y = (v) => T + (Hh - T - Bm) * (1 - v / 100);
  let s = `<svg viewBox="0 0 ${W} ${Hh}" style="width:100%;max-width:720px;background:#fff;border-radius:8px">`;
  [
    [0, 33, "#2e9e66"],
    [33, 66, "#ee7b2c"],
    [66, 100, "#d64545"],
  ].forEach((z) => {
    s += `<rect x="${L}" y="${Y(z[1])}" width="${W - L - R}" height="${Y(z[0]) - Y(z[1])}" fill="${z[2]}" opacity=".10"/>`;
  });
  [0, 25, 50, 75, 100].forEach((v) => {
    s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#d9dee6"/><text x="${L - 6}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="#5b6575">${v}%</text>`;
  });
  s += `<text x="${W - R}" y="${T + 12}" font-size="10" text-anchor="end" fill="#b02a2a">more concern</text><text x="${W - R}" y="${Y(0) - 5}" font-size="10" text-anchor="end" fill="#1f7a4d">better</text>`;
  days.forEach((d, i) => {
    if (days.length < 10 || i % 2 === 0)
      s += `<text x="${X(d)}" y="${Hh - 24}" font-size="10" text-anchor="middle" fill="#5b6575">${esc(d)}</text>`;
  });
  const total = H.filter((h) => pct(h) != null && !hid[h.ab]).length;
  abs
    .filter((a) => !hid[a])
    .forEach((a) => {
      const pts = H.filter((h) => h.ab === a && pct(h) != null),
        c = tcol(abs, a);
      if (!pts.length) return;
      s += `<polyline fill="none" stroke="${c}" stroke-width="2.5" points="${pts.map((p) => X(String(p.at).slice(0, 10)) + "," + Y(pct(p))).join(" ")}"/>`;
      pts.forEach((p) => {
        const x = X(String(p.at).slice(0, 10)),
          y = Y(pct(p));
        s += `<circle cx="${x}" cy="${y}" r="5" fill="${c}" stroke="#fff" stroke-width="1.5"><title>${esc(a)} ${esc(String(p.at).slice(0, 10))}: ${esc(p.raw)}${p.max ? " / " + esc(p.max) : ""} (${esc(p.label)})</title></circle>`;
        if (total <= 16)
          s += `<text x="${x}" y="${y - 9}" font-size="10" font-weight="700" text-anchor="middle" fill="${c}">${esc(p.raw)}</text>`;
      });
    });
  return s + "</svg>";
}
function trend(pts) {
  if (pts.length < 2)
    return "Only one result so far. Test again later to see progress.";
  const a = pts[0],
    b = pts[pts.length - 1],
    cfg = SC[a.ab],
    d = b.raw - a.raw;
  if (d === 0)
    return (
      "No change since the first test (" + b.raw + "). Latest: " + b.label + "."
    );
  if (!cfg)
    return (
      "Changed by " +
      (d > 0 ? "+" : "") +
      d +
      " points (" +
      a.raw +
      " \u2192 " +
      b.raw +
      "). Interpret with manual norms."
    );
  return (cfg.low ? d > 0 : d < 0)
    ? "Improved by " +
        Math.abs(d) +
        " points (" +
        a.raw +
        " \u2192 " +
        b.raw +
        "). Latest: " +
        b.label +
        "."
    : "Worsened by " +
        Math.abs(d) +
        " points (" +
        a.raw +
        " \u2192 " +
        b.raw +
        "). Latest: " +
        b.label +
        ".";
}
V.history = function () {
  const c = cc();
  if (c && c.sid && !(state.pl || {})[c.id]) {
    (state.pl = state.pl || {})[c.id] = 1;
    pull(c).then((ok) => {
      state.srv = ok;
      render();
    });
  }
  const H = c
    ? (c.history || []).slice().sort((a, b) => (a.at < b.at ? -1 : 1))
    : [];
  const abs = [...new Set(H.map((h) => h.ab))],
    sel = abs.includes(state.hab) ? state.hab : abs[0],
    pts = H.filter((h) => h.ab === sel);
  const box = el("div", { class: "card" });
  const plotted = H.filter((h) => pct(h) != null);
  if (plotted.length) box.innerHTML = chart(H, abs, state.hid || {});
  return el(
    "div",
    {},
    el("h2", {}, "History & Progress"),
    clientBar(),
    API && state.srv === false
      ? el(
          "div",
          { class: "card mut" },
          "Offline: showing results saved on this device. They upload automatically when the database is reachable.",
        )
      : null,
    !c
      ? el("p", { class: "mut" }, "Create or select a patient first.")
      : !H.length
        ? el(
            "p",
            { class: "mut" },
            "No saved results yet. In Administer Test, score a test and press Save to history.",
          )
        : el(
            "div",
            {},
            el(
              "div",
              { class: "card" },
              el("h3", {}, "Progress summary"),
              el(
                "ul",
                {},
                abs.map((a) =>
                  el(
                    "li",
                    {},
                    el("b", {}, a + ": "),
                    trend(H.filter((h) => h.ab === a)),
                  ),
                ),
              ),
            ),
            el(
              "div",
              { class: "row" },
              abs
                .filter((a) => H.some((h) => h.ab === a && pct(h) != null))
                .map((a) => {
                  const hidd = (state.hid || {})[a],
                    c = tcol(abs, a);
                  return el(
                    "button",
                    {
                      style: hidd
                        ? "background:transparent;color:" +
                          c +
                          ";border-color:" +
                          c
                        : "background:" +
                          c +
                          ";border-color:" +
                          c +
                          ";color:#fff",
                      onclick: () => {
                        (state.hid = state.hid || {})[a] = !hidd;
                        render();
                      },
                    },
                    a,
                  );
                }),
            ),
            box,
            el(
              "p",
              { class: "mut" },
              "One line per test, one dot per session. A line going down means improvement (fewer symptoms); going up means more concern. Memory tests (MoCA, MMSE, ACE-III, FAB) are flipped so up always means worse. Tap a test name above to hide or show its line. Tests without a fixed score range (for example WAIS-IV) are not plotted, see the list below.",
            ),
            el(
              "div",
              { class: "card" },
              el("h3", {}, "All saved results"),
              H.slice()
                .reverse()
                .map((h) =>
                  el(
                    "div",
                    { class: "row" },
                    el("span", {}, String(h.at).slice(0, 10) + "  "),
                    el("b", {}, h.ab),
                    el(
                      "span",
                      {},
                      h.raw +
                        (h.max ? " / " + h.max : "") +
                        "  \u2013 " +
                        h.label +
                        (h.risk ? " (RISK FLAG)" : ""),
                    ),
                    el(
                      "button",
                      {
                        class: "sec",
                        onclick: async () => {
                          if (!confirm("Delete this result?")) return;
                          if (h.sid) await api("/results/" + h.sid, "DELETE");
                          c.history = c.history.filter((x) => x !== h);
                          save();
                          render();
                        },
                      },
                      "Delete",
                    ),
                  ),
                ),
            ),
          ),
  );
};
addEventListener("beforeprint", () => {
  const s = document.getElementById("sheet");
  if (!s) return;
  s.style.zoom = "";
  s.style.width = "194mm";
  const h = s.offsetHeight;
  if (h > 1040) s.style.zoom = (1040 / h).toFixed(3);
});
addEventListener("afterprint", () => {
  const s = document.getElementById("sheet");
  if (s) {
    s.style.zoom = "";
    s.style.width = "";
  }
});
render();
syncAll().then(() => render());
