// App logic: tabs, forms, survey, quiz and symptom checker. Data comes from data.js (const D).
const TABS = [
  ["home", "Home"],
  ["personality", "Personality Quiz"],
  ["checker", "Symptom Checker"],
  ["intake", "Intake Form"],
  ["survey", "Quick Survey"],
  ["conditions", "Condition Guide"],
  ["tests", "Test Library"],
  ["administer", "Administer Test"],
  ["report", "Report Card"],
  ["history", "History & Progress"],
  ["batteries", "Batteries"],
];
const $ = (s) => document.querySelector(s);
function el(t, a, ...k) {
  const e = document.createElement(t);
  for (const x in a || {}) {
    if (x === "class") e.className = a[x];
    else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]);
    else if (["checked", "selected", "value", "disabled", "open"].includes(x))
      e[x] = a[x];
    else e.setAttribute(x, a[x]);
  }
  for (const c of k.flat())
    if (c != null && c !== false)
      e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
const state = {
  pq: {},
  sx: {},
  yn: {},
  isub: false,
  focusBat: null,
  cfocus: null,
  age: "Adult (18-59)",
  lit: "Standard (literate in test language)",
  ans: {},
  notes: {},
  iarea: "All",
  tq: "",
  tcat: "All",
  tacc: "All",
};
function nav() {
  const n = $("#nav");
  n.replaceChildren(
    ...TABS.map(([id, l]) =>
      el(
        "a",
        {
          href: "#" + id,
          class: cur() === id ? "on" : "",
          onclick: () => {
            state.tq = "";
            state.focusBat = null;
            state.cfocus = null;
            state.isub = false;
          },
        },
        l,
      ),
    ),
  );
}
function cur() {
  const h = location.hash.slice(1);
  return TABS.some((t) => t[0] === h) ? h : "home";
}
function chips(arr) {
  return arr.filter(Boolean).map((x) => el("span", { class: "tag" }, x));
}
function linkify(s) {
  const m = String(s).match(/https?:\/\/\S+/);
  return m ? el("a", { href: m[0], target: "_blank", rel: "noopener" }, s) : s;
}
function goTo(tab, fn) {
  if (fn) fn();
  if (location.hash === "#" + tab) {
    render();
    scrollTo(0, 0);
  } else location.hash = "#" + tab;
}
const V = {
  home() {
    const c = D.tests.reduce(
      (o, t) => ((o[t.cat] = (o[t.cat] || 0) + 1), o),
      {},
    );
    return el(
      "div",
      {},
      el("h2", {}, "Welcome"),
      stats(),
      whichTool(),
      el(
        "div",
        { class: "card" },
        el(
          "p",
          {},
          `A single place to find clinical psychology tests, choose a battery, interview the person and follow the test procedure. It holds ${D.tests.length} tests in ${Object.keys(c).length} categories, ${D.bat.length} ready batteries, ${D.intake.length} interview questions and ${D.cond.length} condition summaries.`,
        ),
        el(
          "p",
          { class: "mut" },
          "Screening pointers only, not a diagnosis. Items, times and ranges are approximate; check the publisher\u2019s manual and your qualification before real use. Saved patient results are kept for history tracking.",
        ),
      ),
      el("h2", {}, "How to use (in this order)"),
      el(
        "div",
        { class: "card" },
        el(
          "ol",
          {},
          D.tut.map((t) =>
            el(
              "li",
              {},
              t.what + " ",
              el("span", { class: "mut" }, "(" + t.where + ")"),
            ),
          ),
        ),
      ),
      el("h2", {}, "Standard process for any test"),
      ["Before", "During", "After"].map((s) =>
        el(
          "div",
          { class: "card" },
          el("h3", {}, s),
          el(
            "ul",
            {},
            D.gen
              .filter((g) => g.stage === s)
              .map((g) =>
                el(
                  "li",
                  {},
                  el("b", {}, g.step.replace(/^\d+\.\s*/, "") + ": "),
                  g.what,
                ),
              ),
          ),
        ),
      ),
      el("h2", {}, "Tests per category"),
      el(
        "div",
        { class: "row" },
        Object.entries(c).map(([k, v]) =>
          el("span", { class: "tag" }, k + ": " + v),
        ),
      ),
    );
  },
  intake() {
    if (state.isub) return intakeSummary();
    const areas = ["All", ...new Set(D.intake.map((q) => q.sec))];
    const list = D.intake.filter(
      (q) => state.iarea === "All" || q.sec === state.iarea,
    );
    const done = D.intake.filter(
      (q) => state.yn[q.id] || (state.notes[q.id] || "").trim(),
    ).length;
    const keep = () => {
      const y = scrollY;
      render();
      scrollTo(0, y);
    };
    return el(
      "div",
      {},
      el("h2", {}, "Intake Form: questions to ask the person"),
      el(
        "p",
        { class: "mut" },
        "Ask the questions. For closed questions choose Yes, No or Not sure, and type notes if needed. When you finish, press Submit to see the summary and next steps.",
      ),
      el(
        "div",
        { class: "row" },
        el(
          "select",
          {
            onchange: (e) => {
              state.iarea = e.target.value;
              render();
            },
          },
          areas.map((a) =>
            el("option", { value: a, selected: a === state.iarea }, a),
          ),
        ),
        el(
          "span",
          { class: "tag" },
          "Answered " + done + " of " + D.intake.length,
        ),
      ),
      list.map((q) =>
        el(
          "div",
          { class: "card" },
          el(
            "div",
            {},
            ...chips([q.sec, q.bid !== "All" ? q.bid : "", q.type]),
          ),
          el("b", {}, q.q),
          el(
            "div",
            { class: "mut" },
            "Why: " + q.why + "  |  Probe: " + q.probe,
          ),
          q.type !== "Open" &&
            el(
              "div",
              { class: "opts" },
              ["Yes", "No", "Not sure"].map((v) =>
                el(
                  "label",
                  {},
                  el("input", {
                    type: "radio",
                    name: "yn" + q.id,
                    value: v,
                    checked: state.yn[q.id] === v,
                    onchange: () => {
                      state.yn[q.id] = v;
                      keep();
                    },
                  }),
                  v,
                ),
              ),
            ),
          el(
            "textarea",
            {
              placeholder: "Notes / answer",
              oninput: (e) => (state.notes[q.id] = e.target.value),
            },
            state.notes[q.id] || "",
          ),
        ),
      ),
      el(
        "button",
        {
          onclick: () => {
            state.isub = true;
            render();
            scrollTo(0, 0);
          },
        },
        "Submit and see summary",
      ),
    );
  },
  survey() {
    const q0 = D.surv,
      older = state.age === "Older adult (60+)",
      child = state.age === "Child/Adolescent (under 18)",
      low = state.lit.startsWith("Low");
    const sum = (f) =>
        q0.filter(f).reduce((s, q) => s + (+state.ans[q.no] || 0), 0),
      cnt = (f) => 3 * q0.filter(f).length,
      isCog = (q) => q.bid.startsWith("B03 /");
    const res = D.bat
      .map((b) => {
        let sc, mx;
        const id = b.id;
        if (["B03", "B05", "B11"].includes(id)) {
          const on = id === "B05" ? older : id === "B11" ? low : !older && !low;
          sc = on ? sum(isCog) : 0;
          mx = cnt(isCog);
        } else if (id === "B08" || id === "B09") {
          sc = child ? sum((q) => q.bid === id) : 0;
          mx = cnt((q) => q.bid === id);
        } else {
          sc = sum((q) => q.bid === id);
          mx = cnt((q) => q.bid === id);
        }
        return { b, sc, mx, rec: sc > 0 && sc >= Math.ceil(0.4 * mx) };
      })
      .filter((r) => r.mx > 0);
    const risk = +state.ans[31] > 0,
      recs = res.filter((r) => r.rec);
    const top = res
      .filter((r) => r.sc > 0)
      .sort((a, b) => b.sc / b.mx - a.sc / a.mx || b.sc - a.sc)[0];
    const topCard =
      top &&
      el(
        "div",
        { class: "card", style: "border:2px solid var(--acc)" },
        el("div", { class: "mut" }, "Best match"),
        el("h3", {}, top.b.name),
        el(
          "div",
          { class: "mut" },
          "Score " +
            top.sc +
            " of " +
            top.mx +
            "  |  about " +
            top.b.time +
            " min",
        ),
        el(
          "button",
          {
            onclick: () => goTo("batteries", () => (state.focusBat = top.b.id)),
          },
          "View this battery",
        ),
      );
    const out = el(
      "div",
      { class: "card" },
      el("h3", {}, "Result"),
      risk &&
        el(
          "div",
          { class: "bad" },
          "SAFETY ALERT: the safety question is above 0. Do a risk assessment (C-SSRS, BSS) and make a safety plan before any testing.",
        ),
      topCard,
      recs.length
        ? el(
            "p",
            {},
            "Recommended: ",
            ...recs.map((r) => el("span", { class: "tag ok" }, r.b.name)),
          )
        : el(
            "p",
            { class: "mut" },
            "No battery indicated yet. Answer the questions above.",
          ),
      res.map((r) =>
        el(
          "div",
          {},
          el(
            "div",
            {},
            el("b", {}, r.b.id + " " + r.b.name),
            ` : ${r.sc}/${r.mx}`,
          ),
          el(
            "div",
            { class: "bar" },
            el("i", { style: `width:${Math.round((100 * r.sc) / r.mx)}%` }),
          ),
          r.rec &&
            el(
              "div",
              { class: "mut" },
              "Tests: " + r.b.tests + "  |  about " + r.b.time + " min ",
              el(
                "button",
                {
                  class: "sec",
                  onclick: () =>
                    goTo("batteries", () => (state.focusBat = r.b.id)),
                },
                "View battery",
              ),
            ),
        ),
      ),
    );
    return el(
      "div",
      {},
      el("h2", {}, "Quick Survey"),
      el(
        "p",
        { class: "mut" },
        "Ask each question. Score 0 = not at all, 1 = several days, 2 = more than half the days, 3 = nearly every day. Open a question to see what it may point to.",
      ),
      el(
        "div",
        { class: "card row" },
        el(
          "label",
          {},
          "Age group ",
          el(
            "select",
            {
              onchange: (e) => {
                state.age = e.target.value;
                render();
              },
            },
            [
              "Child/Adolescent (under 18)",
              "Adult (18-59)",
              "Older adult (60+)",
            ].map((a) => el("option", { selected: a === state.age }, a)),
          ),
        ),
        el(
          "label",
          {},
          "Language / literacy ",
          el(
            "select",
            {
              onchange: (e) => {
                state.lit = e.target.value;
                render();
              },
            },
            [
              "Standard (literate in test language)",
              "Low literacy / regional language",
            ].map((a) => el("option", { selected: a === state.lit }, a)),
          ),
        ),
      ),
      out,
      q0.map((q) =>
        el(
          "div",
          { class: "card" },
          el("div", {}, ...chips([q.area])),
          el("b", {}, q.no + ". " + q.q),
          el(
            "div",
            { class: "opts" },
            [0, 1, 2, 3].map((v) =>
              el(
                "label",
                {},
                el("input", {
                  type: "radio",
                  name: "q" + q.no,
                  value: v,
                  checked: +state.ans[q.no] === v && state.ans[q.no] !== "",
                  onchange: () => {
                    state.ans[q.no] = v;
                    const y = scrollY;
                    render();
                    scrollTo(0, y);
                  },
                }),
                String(v),
              ),
            ),
          ),
          el(
            "details",
            {},
            el("summary", { class: "mut" }, "What it may point to"),
            el("div", { class: "mut" }, "Checks: " + q.checks),
            el("div", { class: "mut" }, "Possible conditions: " + q.cond),
            el("div", { class: "mut" }, "Battery: " + q.bname),
            el("div", { class: "mut" }, "Note: " + q.note),
          ),
        ),
      ),
      el(
        "button",
        {
          class: "sec",
          onclick: () => {
            state.ans = {};
            render();
          },
        },
        "Clear answers",
      ),
      top &&
        el(
          "div",
          { class: "dock" },
          el("span", {}, "Best match: ", el("b", {}, top.b.name)),
          el(
            "button",
            {
              onclick: () =>
                goTo("batteries", () => (state.focusBat = top.b.id)),
            },
            "View battery",
          ),
        ),
    );
  },
  conditions() {
    const s = state.tq.toLowerCase();
    let list = D.cond.filter(
      (c) => !s || JSON.stringify(c).toLowerCase().includes(s),
    );
    const fc = D.cond.find((c) => c.name === state.cfocus);
    if (fc) list = [fc];
    return el(
      "div",
      {},
      el("h2", {}, "Condition Guide"),
      fc
        ? el(
            "div",
            { class: "row" },
            el("span", { class: "tag ok" }, "Showing: " + fc.name),
            el(
              "button",
              {
                class: "sec",
                onclick: () => {
                  state.cfocus = null;
                  render();
                },
              },
              "Show all conditions",
            ),
          )
        : el(
            "div",
            { class: "row" },
            el("input", {
              type: "search",
              placeholder: "Search symptom or condition",
              value: state.tq,
              oninput: (e) => {
                state.tq = e.target.value;
                render(true);
              },
            }),
          ),
      list.map((c) =>
        el(
          "div",
          { class: "card" },
          el("h3", {}, c.name),
          el("div", {}, el("b", {}, "Symptoms: "), c.sym),
          el("div", {}, el("b", {}, "Duration / key point: "), c.dur),
          el("div", {}, el("b", {}, "Rule out: "), c.look),
          el("div", {}, el("b", {}, "Battery: "), c.bid + " " + c.bname),
          el("div", {}, el("b", {}, "Key tests: "), c.tests || c.other),
          c.tests && c.other && el("div", { class: "mut" }, "Also: " + c.other),
          c.bid &&
            c.bid.startsWith("B") &&
            el(
              "div",
              { class: "row" },
              el(
                "button",
                {
                  class: "sec",
                  onclick: () =>
                    goTo("batteries", () => (state.focusBat = c.bid)),
                },
                "View battery " + c.bid,
              ),
            ),
        ),
      ),
    );
  },
  tests() {
    const cats = ["All", ...new Set(D.tests.map((t) => t.cat))],
      acc = ["All", ...new Set(D.tests.map((t) => t.access))],
      s = state.tq.toLowerCase(),
      ex = D.tests.some((t) => t.ab.toLowerCase() === s);
    const list = D.tests.filter(
      (t) =>
        (state.tcat === "All" || t.cat === state.tcat) &&
        (state.tacc === "All" || t.access === state.tacc) &&
        (!s ||
          (ex
            ? t.ab.toLowerCase() === s
            : (t.name + t.ab + t.purpose).toLowerCase().includes(s))),
    );
    const sel = (arr, k) =>
      el(
        "select",
        {
          onchange: (e) => {
            state[k] = e.target.value;
            render(true);
          },
        },
        arr.map((a) => el("option", { value: a, selected: a === state[k] }, a)),
      );
    return el(
      "div",
      {},
      el("h2", {}, "Test Library (" + list.length + ")"),
      el(
        "div",
        { class: "row" },
        el("input", {
          type: "search",
          placeholder: "Search name, abbreviation, purpose",
          value: state.tq,
          oninput: (e) => {
            state.tq = e.target.value;
            render(true);
          },
        }),
        sel(cats, "tcat"),
        sel(acc, "tacc"),
      ),
      list.map((t) =>
        el(
          "details",
          { class: "card", open: ex && s.length > 0 },
          el("summary", {}, t.ab + " \u2013 " + t.name),
          el("div", { class: "mut" }, t.purpose),
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
          el("p", {}, el("b", {}, "Materials: "), t.mat),
          el("p", {}, el("b", {}, "Setting: "), t.prep),
          el("b", {}, "Steps"),
          el(
            "ol",
            {},
            t.steps.map((s) => el("li", {}, s.replace(/^\d+\.\s*/, ""))),
          ),
          el("p", {}, el("b", {}, "Scoring: "), t.score),
          el("p", {}, el("b", {}, "Interpretation: "), t.interp),
          el("p", {}, el("b", {}, "Precautions: "), t.prec),
          el("p", {}, el("b", {}, "Who can administer: "), t.who),
          el(
            "p",
            { class: "mut" },
            "Publisher: " + t.pub + "  |  Indian norms: " + t.india,
          ),
          el("p", { class: "mut" }, "Reference: ", linkify(t.ref)),
          el("button", { onclick: () => goTo("administer", () => { state.runAb = t.ab; }) }, "Perform this test"),
        ),
      ),
    );
  },
  batteries() {
    const card = (b, hl) =>
      el(
        "div",
        { class: "card", style: hl ? "border:2px solid var(--acc)" : "" },
        el("h3", {}, b.id + " " + b.name),
        el(
          "div",
          { class: "mut" },
          b.pop + "  |  " + b.n + " tests  |  about " + b.time + " min",
        ),
        el("p", {}, el("b", {}, "Tests: "), b.tests),
        el("p", {}, el("b", {}, "Procedure: "), b.order),
        el("p", {}, el("b", {}, "Sessions: "), b.session),
        el("p", {}, el("b", {}, "Precautions: "), b.prec),
      );
    const f = D.bat.find((b) => b.id === state.focusBat);
    if (f)
      return el(
        "div",
        {},
        el("h2", {}, "Selected battery"),
        card(f, true),
        el(
          "div",
          { class: "card" },
          el("h3", {}, "Tests in this battery (press to see how to perform)"),
          f.tests.split(" > ").map((a) => {
            const t = D.tests.find((x) => x.ab === a);
            return el(
              "div",
              { class: "row" },
              el("span", {}, el("b", {}, a), " " + (t ? t.name : "")),
              t &&
                el(
                  "button",
                  {
                    class: "sec",
                    onclick: () =>
                      goTo("tests", () => {
                        state.tq = a;
                        state.tcat = "All";
                        state.tacc = "All";
                      }),
                  },
                  "How to perform",
                ),
            );
          }),
        ),
        el(
          "button",
          {
            class: "sec",
            onclick: () => {
              state.focusBat = null;
              render();
            },
          },
          "Show all batteries",
        ),
      );
    return el(
      "div",
      {},
      el("h2", {}, "Batteries"),
      el(
        "div",
        { class: "grid" },
        D.bat.map((b) => card(b, false)),
      ),
      el("h2", {}, "Quick decision guide"),
      D.guide.map((g) =>
        el(
          "div",
          { class: "card" },
          el("b", {}, g.s),
          el("div", { class: "mut" }, g.bid + " " + g.bname + " | " + g.note),
        ),
      ),
    );
  },
};
function stats() {
  const items = [
    [D.tests.length, "Tests available"],
    [D.bat.length, "Batteries"],
    [D.cond.length, "Conditions"],
    [D.syms.length, "Symptoms in checker"],
    [D.pq.items.length, "Personality questions"],
    [D.intake.length, "Interview questions"],
  ];
  return el(
    "div",
    { class: "grid" },
    items.map(([n, l]) =>
      el(
        "div",
        { class: "card" },
        el("h3", {}, String(n)),
        el("div", { class: "mut" }, l),
      ),
    ),
  );
}
V.personality = function () {
  const P = D.pq,
    ans = state.pq,
    done = Object.keys(ans).length,
    total = P.items.length;
  const res = Object.keys(P.traits).map((k) => {
    const idx = P.items.map((q, i) => [q, i]).filter(([q]) => q.t === k);
    const got = idx.filter(([q, i]) => ans[i]);
    const sum = got.reduce((s, [q, i]) => s + (q.r ? 6 - ans[i] : ans[i]), 0);
    return { k, pct: got.length ? (sum - got.length) / (4 * got.length) : 0 };
  });
  const lvl = (p) => (p <= 0.4 ? "Low" : p >= 0.65 ? "High" : "Medium");
  const words = res
    .filter((r) => lvl(r.pct) !== "Medium")
    .map((r) => P.traits[r.k][lvl(r.pct) === "High" ? "w1" : "w0"]);
  const ptests = D.tests.filter(
    (t) => t.cat.startsWith("Personality") || t.cat === "Projective",
  );
  return el(
    "div",
    {},
    el("h2", {}, "Personality Quiz"),
    el(
      "p",
      { class: "mut" },
      "Read each sentence and choose how true it is for you: 1 = not true at all, 2 = a little true, 3 = sometimes true, 4 = mostly true, 5 = very true. There are no right or wrong answers.",
    ),
    el(
      "div",
      { class: "card" },
      "Answered " + done + " of " + total,
      el(
        "div",
        { class: "bar" },
        el("i", { style: "width:" + Math.round((100 * done) / total) + "%" }),
      ),
    ),
    done >= total &&
      el(
        "div",
        { class: "card", style: "border:2px solid var(--acc)" },
        el("h3", {}, "Your result"),
        el(
          "p",
          {},
          words.length
            ? "In simple words, you are: " + words.join(", ") + "."
            : "In simple words, you are balanced in all five areas. You adjust easily to the situation.",
        ),
        res.map((r) => {
          const t = P.traits[r.k],
            l = lvl(r.pct);
          return el(
            "div",
            { class: "card" },
            el(
              "div",
              {},
              el("b", {}, t.name),
              el("span", { class: "tag" + (l === "High" ? " ok" : "") }, l),
            ),
            el(
              "div",
              { class: "bar" },
              el("i", { style: "width:" + Math.round(r.pct * 100) + "%" }),
            ),
            el("div", {}, l === "Low" ? t.lo : l === "High" ? t.hi : t.mid),
          );
        }),
        el(
          "p",
          { class: "mut" },
          "This is not a medical test and does not show any illness. It only shows your usual style. Psychologists use these professional tests for personality (" +
            ptests.length +
            " in this database): " +
            ptests.map((t) => t.ab).join(", ") +
            ".",
        ),
        el(
          "button",
          {
            class: "sec",
            onclick: () =>
              goTo("batteries", () => {
                state.focusBat = "B22";
              }),
          },
          "View personality battery",
        ),
      ),
    P.items.map((q, i) =>
      el(
        "div",
        { class: "card" },
        el("b", {}, i + 1 + ". " + q.q),
        el(
          "div",
          { class: "opts" },
          [1, 2, 3, 4, 5].map((v) =>
            el(
              "label",
              {},
              el("input", {
                type: "radio",
                name: "p" + i,
                value: v,
                checked: ans[i] === v,
                onchange: () => {
                  state.pq[i] = v;
                  const y = scrollY;
                  render();
                  scrollTo(0, y);
                },
              }),
              String(v),
            ),
          ),
        ),
      ),
    ),
    el(
      "button",
      {
        class: "sec",
        onclick: () => {
          state.pq = {};
          render();
        },
      },
      "Clear answers",
    ),
  );
};
function whichTool() {
  const it = [
    [
      "Intake Form",
      "Talk to the person. Collect history, safety answers and notes, then press Submit for a summary.",
    ],
    [
      "Quick Survey",
      "Score symptoms from 0 to 3. The app tells you which battery (group of tests) to use.",
    ],
    [
      "Symptom Checker",
      "Tick the symptoms you see. The app shows which conditions are likely and links to them.",
    ],
    ["Personality Quiz", "Learn a person usual style (not an illness check)."],
  ];
  return el(
    "div",
    { class: "card" },
    el("h3", {}, "Which tool should I use?"),
    el(
      "ul",
      {},
      it.map(([a, b]) => el("li", {}, el("b", {}, a + ": "), b)),
    ),
  );
}
function intakeSummary() {
  const all = D.intake,
    yes = all.filter((q) => state.yn[q.id] === "Yes"),
    noted = all.filter((q) => (state.notes[q.id] || "").trim()),
    answered = all.filter(
      (q) => state.yn[q.id] || (state.notes[q.id] || "").trim(),
    );
  const risk = yes.filter((q) => q.sec === "Safety / Risk"),
    by = {};
  yes.forEach((q) => {
    if (/^B\d/.test(q.bid)) by[q.bid] = (by[q.bid] || 0) + 1;
  });
  const focus = Object.entries(by).sort((a, b) => b[1] - a[1]);
  return el(
    "div",
    {},
    el("h2", {}, "Intake Summary"),
    risk.length > 0 &&
      el(
        "div",
        { class: "bad" },
        "SAFETY ALERT: " +
          risk.length +
          " safety question(s) answered Yes. Do a full risk assessment (C-SSRS, BSS) and make a safety plan before any testing.",
      ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Overview"),
      el(
        "p",
        {},
        "Answered " +
          answered.length +
          " of " +
          all.length +
          " questions. Yes answers: " +
          yes.length +
          ". Notes written: " +
          noted.length +
          ".",
      ),
    ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Areas to look at next"),
      focus.length
        ? focus.map(([id, c]) => {
            const b = D.bat.find((x) => x.id === id);
            return el(
              "div",
              { class: "row" },
              el("span", {}, el("b", {}, b.name), " (" + c + " Yes answers)"),
              el(
                "button",
                {
                  class: "sec",
                  onclick: () =>
                    goTo("batteries", () => {
                      state.focusBat = id;
                    }),
                },
                "View battery",
              ),
            );
          })
        : el(
            "p",
            { class: "mut" },
            "No area flagged yet. Answer more closed questions, or go to the Quick Survey or Symptom Checker.",
          ),
    ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Next steps"),
      el(
        "div",
        { class: "row" },
        el(
          "button",
          {
            onclick: () =>
              goTo("survey", () => {
                state.isub = false;
              }),
          },
          "Go to Quick Survey",
        ),
        el(
          "button",
          {
            class: "sec",
            onclick: () =>
              goTo("checker", () => {
                state.isub = false;
              }),
          },
          "Go to Symptom Checker",
        ),
        el(
          "button",
          {
            class: "sec",
            onclick: () => {
              state.isub = false;
              render();
              scrollTo(0, 0);
            },
          },
          "Edit answers",
        ),
        el(
          "button",
          { class: "sec", onclick: () => window.print() },
          "Print summary",
        ),
      ),
    ),
    answered.length > 0 &&
      el(
        "div",
        { class: "card" },
        el("h3", {}, "Your answers"),
        el(
          "ul",
          {},
          answered.map((q) =>
            el(
              "li",
              {},
              el("b", {}, q.q),
              " ",
              state.yn[q.id]
                ? el("span", { class: "tag" }, state.yn[q.id])
                : null,
              (state.notes[q.id] || "").trim() ? " " + state.notes[q.id] : "",
            ),
          ),
        ),
      ),
  );
}
V.checker = function () {
  const sx = state.sx,
    sel = D.syms.filter((s) => sx[s.id]),
    lab = Object.fromEntries(D.syms.map((s) => [s.id, s.l]));
  const res = D.cond
    .map((c) => {
      const m = c.sy.filter((s) => sx[s]);
      return { c, m, p: m.length / c.sy.length };
    })
    .filter((r) => r.m.length > 0)
    .sort((a, b) => b.p - a.p || b.m.length - a.m.length)
    .slice(0, 6);
  const groups = [...new Set(D.syms.map((s) => s.g))];
  return el(
    "div",
    {},
    el("h2", {}, "Symptom Checker: possible conditions"),
    el(
      "p",
      { class: "mut" },
      "Tick the symptoms the person has. The list below shows conditions that match best and the battery to use. These are possible matches only. A clinician must confirm after a full interview.",
    ),
    sx.suicide &&
      el(
        "div",
        { class: "bad" },
        "SAFETY ALERT: suicidal thoughts ticked. Do a risk assessment (C-SSRS, BSS) and make a safety plan first.",
      ),
    sx.confuse &&
      el(
        "div",
        { class: "bad" },
        "URGENT: sudden confusion can be delirium. Arrange a medical check first.",
      ),
    el(
      "div",
      { class: "card" },
      el("h3", {}, "Possible conditions (" + sel.length + " symptoms ticked)"),
      res.length
        ? res.map((r) =>
            el(
              "div",
              { class: "card" },
              el("b", {}, r.c.name),
              el(
                "div",
                { class: "bar" },
                el("i", { style: "width:" + Math.round(r.p * 100) + "%" }),
              ),
              el(
                "div",
                { class: "mut" },
                "Matched " +
                  r.m.length +
                  " of " +
                  r.c.sy.length +
                  ": " +
                  r.m.map((x) => lab[x]).join("; "),
              ),
              el(
                "div",
                {},
                el("b", {}, "Battery: "),
                r.c.bid + " " + r.c.bname,
              ),
              el("div", {}, el("b", {}, "Key tests: "), r.c.tests || r.c.other),
              el(
                "div",
                { class: "mut" },
                "Duration: " + r.c.dur + "  |  Rule out: " + r.c.look,
              ),
              el(
                "div",
                { class: "row" },
                el(
                  "button",
                  {
                    onclick: () =>
                      goTo("conditions", () => {
                        state.cfocus = r.c.name;
                        state.tq = "";
                      }),
                  },
                  "View condition details",
                ),
                el(
                  "button",
                  {
                    class: "sec",
                    onclick: () =>
                      goTo("batteries", () => {
                        state.focusBat = r.c.bid;
                      }),
                  },
                  "View battery " + r.c.bid,
                ),
              ),
            ),
          )
        : el("p", { class: "mut" }, "Tick at least one symptom below."),
    ),
    groups.map((g) =>
      el(
        "div",
        { class: "card" },
        el("h3", {}, g),
        el(
          "div",
          { class: "opts" },
          D.syms
            .filter((s) => s.g === g)
            .map((s) =>
              el(
                "label",
                {},
                el("input", {
                  type: "checkbox",
                  checked: !!sx[s.id],
                  onchange: (e) => {
                    state.sx[s.id] = e.target.checked;
                    const y = scrollY;
                    render();
                    scrollTo(0, y);
                  },
                }),
                s.l,
              ),
            ),
        ),
      ),
    ),
    el(
      "button",
      {
        class: "sec",
        onclick: () => {
          state.sx = {};
          render();
        },
      },
      "Clear all",
    ),
  );
};

function render(keepFocus) {
  const id =
      document.activeElement && document.activeElement.type === "search"
        ? document.activeElement
        : null,
    pos = id ? id.selectionStart : 0;
  nav();
  $("#app").replaceChildren(V[cur()]());
  if (keepFocus && id) {
    const n = $("input[type=search]");
    if (n) {
      n.focus();
      n.setSelectionRange(pos, pos);
    }
  }
}
addEventListener("hashchange", () => {
  scrollTo(0, 0);
  render();
});

