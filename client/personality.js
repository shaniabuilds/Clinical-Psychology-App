// personality.js
// Better personality quiz: 50 IPIP Big Five questions (public domain), a Quick mode (15 questions),
// 10 personality types and a pie chart. Load it after app.js and BEFORE run.js / record.js.

// ---------- questions: [text, reverse-scored?, in quick mode?] ----------
const PQ_BY_TRAIT = {
  E: [
    ["I am the life of the party.", 0, 1],
    ["I don't talk a lot.", 1, 1],
    ["I feel comfortable around people.", 0, 1],
    ["I keep in the background.", 1],
    ["I start conversations.", 0],
    ["I have little to say.", 1],
    ["I talk to a lot of different people at parties.", 0],
    ["I don't like to draw attention to myself.", 1],
    ["I don't mind being the center of attention.", 0],
    ["I am quiet around strangers.", 1],
  ],
  A: [
    ["I feel little concern for others.", 1],
    ["I am interested in people.", 0, 1],
    ["I insult people.", 1, 1],
    ["I sympathize with others' feelings.", 0, 1],
    ["I am not interested in other people's problems.", 1],
    ["I have a soft heart.", 0],
    ["I am not really interested in others.", 1],
    ["I take time out for others.", 0],
    ["I feel others' emotions.", 0],
    ["I make people feel at ease.", 0],
  ],
  C: [
    ["I am always prepared.", 0, 1],
    ["I leave my belongings around.", 1, 1],
    ["I pay attention to details.", 0],
    ["I make a mess of things.", 1],
    ["I get chores done right away.", 0],
    ["I often forget to put things back in their proper place.", 1],
    ["I like order.", 0],
    ["I shirk my duties.", 1],
    ["I follow a schedule.", 0, 1],
    ["I am exacting in my work.", 0],
  ],
  N: [
    ["I get stressed out easily.", 0, 1],
    ["I am relaxed most of the time.", 1, 1],
    ["I worry about things.", 0, 1],
    ["I seldom feel blue.", 1],
    ["I am easily disturbed.", 0],
    ["I get upset easily.", 0],
    ["I change my mood a lot.", 0],
    ["I have frequent mood swings.", 0],
    ["I get irritated easily.", 0],
    ["I often feel blue.", 0],
  ],
  O: [
    ["I have a rich vocabulary.", 0],
    ["I have difficulty understanding abstract ideas.", 1],
    ["I have a vivid imagination.", 0, 1],
    ["I am not interested in abstract ideas.", 1],
    ["I have excellent ideas.", 0, 1],
    ["I do not have a good imagination.", 1, 1],
    ["I am quick to understand things.", 0],
    ["I use difficult words.", 0],
    ["I spend time reflecting on things.", 0],
    ["I am full of ideas.", 0],
  ],
};
// mix the five traits so questions do not come in blocks
const PQ_ALL = [];
for (let i = 0; i < 10; i++)
  for (const t of "EACNO") {
    const [q, r, quick] = PQ_BY_TRAIT[t][i];
    PQ_ALL.push({ t, q, r: r ? 1 : 0, quick: !!quick });
  }

// ---------- 10 personality types (ideal Big Five profile 0-1: E, A, C, N, O) ----------
const PQ_TYPES = [
  {
    name: "Confident Leader",
    color: "#1f77b4",
    e: 0.85,
    a: 0.45,
    c: 0.85,
    n: 0.2,
    o: 0.55,
    sum: "Energetic, driven and calm under pressure. You take charge, set goals and get results.",
    good: "Decisive, organised, handles stress well.",
    watch: "Can be pushy or impatient with slower people.",
    tip: "Ask for other opinions before you decide.",
  },
  {
    name: "Caring Supporter",
    color: "#2f9e44",
    e: 0.55,
    a: 0.9,
    c: 0.6,
    n: 0.45,
    o: 0.5,
    sum: "Warm, kind and loyal. People trust you and come to you for support.",
    good: "Good listener, cooperative, dependable.",
    watch: "May put others first and say yes too often.",
    tip: "Practise saying no and keep time for yourself.",
  },
  {
    name: "Reliable Organiser",
    color: "#5c7cfa",
    e: 0.4,
    a: 0.55,
    c: 0.9,
    n: 0.25,
    o: 0.3,
    sum: "Careful, practical and steady. You like plans, rules and finishing what you start.",
    good: "Punctual, thorough, calm.",
    watch: "May resist change or new methods.",
    tip: "Try one new thing each week to stay flexible.",
  },
  {
    name: "Creative Explorer",
    color: "#e8590c",
    e: 0.65,
    a: 0.5,
    c: 0.25,
    n: 0.4,
    o: 0.9,
    sum: "Curious and imaginative. You love new ideas, art and trying different things.",
    good: "Original, open-minded, adaptable.",
    watch: "May start many things and finish few.",
    tip: "Use simple lists and deadlines to finish projects.",
  },
  {
    name: "Social Connector",
    color: "#d6336c",
    e: 0.9,
    a: 0.8,
    c: 0.3,
    n: 0.4,
    o: 0.55,
    sum: "Friendly, lively and fun. You make friends easily and bring energy to a group.",
    good: "Great with people, positive, encouraging.",
    watch: "May avoid boring but important tasks.",
    tip: "Plan fixed time for tasks before social plans.",
  },
  {
    name: "Calm Analyst",
    color: "#0c8599",
    e: 0.2,
    a: 0.45,
    c: 0.8,
    n: 0.2,
    o: 0.85,
    sum: "Thoughtful and independent. You like deep thinking, facts and solving problems quietly.",
    good: "Logical, focused, steady under stress.",
    watch: "May seem distant or keep ideas to yourself.",
    tip: "Share your thinking with others more often.",
  },
  {
    name: "Sensitive Idealist",
    color: "#9c36b5",
    e: 0.3,
    a: 0.8,
    c: 0.5,
    n: 0.8,
    o: 0.8,
    sum: "Deep-feeling and imaginative. You care strongly about values, people and meaning.",
    good: "Empathic, creative, caring.",
    watch: "Stress and worry can build up quickly.",
    tip: "Build daily routines for rest, and talk to someone you trust.",
  },
  {
    name: "Independent Realist",
    color: "#868e96",
    e: 0.3,
    a: 0.2,
    c: 0.6,
    n: 0.2,
    o: 0.4,
    sum: "Direct, self-reliant and practical. You trust facts and prefer to do things your own way.",
    good: "Honest, tough-minded, not easily upset.",
    watch: "May seem blunt or hard to get close to.",
    tip: "Explain your reasons and notice others' feelings.",
  },
  {
    name: "Careful Perfectionist",
    color: "#f59f00",
    e: 0.3,
    a: 0.5,
    c: 0.9,
    n: 0.8,
    o: 0.3,
    sum: "Hard-working with very high standards. You plan carefully and worry about mistakes.",
    good: "Responsible, detailed, committed.",
    watch: "Can be hard on yourself and stressed.",
    tip: "Aim for 'good enough' on small tasks and take breaks.",
  },
  {
    name: "Easy-going Balanced",
    color: "#74b816",
    e: 0.5,
    a: 0.6,
    c: 0.5,
    n: 0.35,
    o: 0.5,
    sum: "Balanced and adaptable. You fit in with many people and situations without extremes.",
    good: "Flexible, steady, easy to work with.",
    watch: "May avoid taking a clear stand.",
    tip: "Pick one goal that matters to you and go for it.",
  },
];

// ---------- scoring ----------
function pqScores(ans, items) {
  // -> {E:0..1, A:.., C:.., N:.., O:..}
  const out = {};
  "EACNO".split("").forEach((k) => {
    const g = items
      .map((q, i) => [q, i])
      .filter(([q, i]) => q.t === k && ans[i]);
    out[k] = g.length
      ? (g.reduce((s, [q, i]) => s + (q.r ? 6 - ans[i] : ans[i]), 0) -
          g.length) /
        (4 * g.length)
      : 0.5;
  });
  return out;
}
function pqMatch(p) {
  // match % of every type (sums to 100)
  const rows = PQ_TYPES.map((t) => {
    const d = Math.sqrt(
      ["e", "a", "c", "n", "o"].reduce(
        (s, k, j) => s + Math.pow(p["EACNO"[j]] - t[k], 2),
        0,
      ) / 5,
    );
    return { t, sim: Math.exp(-Math.pow(d / 0.2, 2)) };
  });
  const tot = rows.reduce((s, r) => s + r.sim, 0) || 1;
  rows.forEach((r) => (r.pct = (100 * r.sim) / tot));
  return rows.sort((a, b) => b.pct - a.pct);
}
// used by record.js so the closest type is saved in the patient record
window.personalityType = function (traits) {
  const p = {};
  "EACNO"
    .split("")
    .forEach((k) => (p[k] = traits[k] ? traits[k].pct / 100 : 0.5));
  const r = pqMatch(p)[0];
  return { name: "Closest type", pct: Math.round(r.pct), level: r.t.name };
};

// ---------- pie chart (plain SVG, no library) ----------
function pieSVG(rows) {
  const R = 95,
    cx = 110,
    cy = 110,
    f = (n) => n.toFixed(2);
  let a = -Math.PI / 2;
  let s =
    '<svg viewBox="0 0 220 220" style="width:100%;max-width:280px" role="img" aria-label="Pie chart of personality type match">';
  rows.forEach((r) => {
    const label =
      r.t.name.replace(/[<>&"]/g, "") + ": " + Math.round(r.pct) + "%";
    if (r.pct >= 99.9) {
      s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${r.t.color}"><title>${label}</title></circle>`;
      return;
    }
    const ang = (r.pct / 100) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(a),
      y1 = cy + R * Math.sin(a);
    a += ang;
    const x2 = cx + R * Math.cos(a),
      y2 = cy + R * Math.sin(a);
    s += `<path d="M${cx} ${cy} L${f(x1)} ${f(y1)} A${R} ${R} 0 ${ang > Math.PI ? 1 : 0} 1 ${f(x2)} ${f(y2)} Z" fill="${r.t.color}" stroke="#fff" stroke-width="1.5"><title>${label}</title></path>`;
  });
  return s + "</svg>";
}

// ---------- the page ----------
function setPQMode(m) {
  state.pmode = m;
  D.pq.items = PQ_ALL.filter((q) => m === "full" || q.quick); // record.js reads D.pq.items
  state.pq = {};
}
setPQMode("full");

V.personality = function () {
  const P = D.pq,
    ans = state.pq,
    total = P.items.length,
    done = Object.keys(ans).length;
  const lvl = (p) => (p <= 0.4 ? "Low" : p >= 0.65 ? "High" : "Medium");
  let result = null;
  if (done >= total) {
    const sc = pqScores(ans, P.items),
      rows = pqMatch(sc),
      top = rows[0].t;
    const pie = el("div");
    pie.innerHTML = pieSVG(rows);
    result = el(
      "div",
      { class: "card", style: "border:2px solid var(--acc)" },
      el("h3", {}, "Your result"),
      el(
        "p",
        {},
        "Your closest personality type: ",
        el("b", {}, top.name),
        " (" + Math.round(rows[0].pct) + "% match)",
      ),
      el("p", {}, top.sum),
      el("div", {}, el("b", {}, "Strengths: "), top.good),
      el("div", {}, el("b", {}, "Watch out for: "), top.watch),
      el("div", {}, el("b", {}, "Tip: "), top.tip),
      el(
        "p",
        { class: "mut" },
        "Next closest: " +
          rows[1].t.name +
          " (" +
          Math.round(rows[1].pct) +
          "%) and " +
          rows[2].t.name +
          " (" +
          Math.round(rows[2].pct) +
          "%).",
      ),
      el("h3", {}, "Match with all 10 types"),
      el(
        "div",
        { class: "row", style: "align-items:center" },
        pie,
        el(
          "div",
          {},
          rows.map((r) =>
            el(
              "div",
              {},
              el("span", {
                style:
                  "display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;background:" +
                  r.t.color,
              }),
              r.t.name + ": " + Math.round(r.pct) + "%",
            ),
          ),
        ),
      ),
      el("h3", {}, "Your five main traits"),
      Object.keys(P.traits).map((k) => {
        const t = P.traits[k],
          p = sc[k],
          l = lvl(p);
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
            el("i", { style: "width:" + Math.round(p * 100) + "%" }),
          ),
          el("div", {}, l === "Low" ? t.lo : l === "High" ? t.hi : t.mid),
        );
      }),
      el(
        "p",
        { class: "mut" },
        (state.pmode === "quick"
          ? "This is the quick version (15 questions). Take the full 50-question version for a more reliable result. "
          : "") +
          "The five traits come from the Big Five model. The 10 types are easy descriptions made from those traits. This is not a medical test and does not show any illness.",
      ),
    );
  }
  return el(
    "div",
    {},
    el("h2", {}, "Personality Quiz"),
    el(
      "div",
      { class: "row" },
      [
        ["full", "Full profile (50 questions, more accurate)"],
        ["quick", "Quick check (15 questions)"],
      ].map(([m, l]) =>
        el(
          "button",
          {
            class: state.pmode === m ? "" : "sec",
            onclick: () => {
              setPQMode(m);
              render();
            },
          },
          l,
        ),
      ),
    ),
    el(
      "p",
      { class: "mut" },
      "Read each sentence and choose how true it is for you: 1 = not true at all, 2 = a little true, 3 = sometimes true, 4 = mostly true, 5 = very true. There are no right or wrong answers. Changing the version clears your answers.",
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
    result,
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
