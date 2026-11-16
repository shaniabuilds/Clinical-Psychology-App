// // // record.js: admin login, Patients page, complete Patient Record. Loads after run.js.

// // const TK = "cpt_token";
// // TABS.splice(1, 0, ["patients", "Patients"], ["record", "Patient Record"]);
// // Object.assign(state, { pq2: "", np: false });

// // // ---- auth: every API call carries the admin token ----
// // api = async function (path, method, body) {
// //   if (!API) return null;
// //   try {
// //     const r = await fetch(API + path, {
// //       method: method || "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: "Bearer " + (sessionStorage.getItem(TK) || ""),
// //       },
// //       body: body ? JSON.stringify(body) : undefined,
// //     });
// //     if (r.status === 401) {
// //       logout();
// //       return null;
// //     }
// //     if (!r.ok) return null;
// //     return r.status === 204 ? {} : await r.json();
// //   } catch (e) {
// //     return null;
// //   }
// // };
// // function logout() {
// //   sessionStorage.removeItem(TK);
// //   localStorage.removeItem("cpt_clients_v1");
// //   CL = [];
// //   state.cid = undefined;
// //   render();
// // }

// // async function doLogin(u, p, msg) {
// //   msg.textContent = "";
// //   try {
// //     const r = await fetch(API + "/auth/login", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ username: u, password: p }),
// //     });
// //     if (!r.ok) {
// //       msg.textContent =
// //         r.status === 401
// //           ? "Wrong username or password."
// //           : "Could not sign in. Try again.";
// //       return;
// //     }
// //     const d = await r.json();
// //     sessionStorage.setItem(TK, d.token);
// //     location.hash = "#patients";
// //     await syncAll();
// //     render();
// //   } catch (e) {
// //     msg.textContent = "Cannot connect. Check your internet connection.";
// //   }
// // }
// // function loginView() {
// //   $("#nav").replaceChildren();
// //   const u = el("input", {
// //       type: "text",
// //       placeholder: "Username",
// //       autocomplete: "username",
// //     }),
// //     p = el("input", {
// //       type: "password",
// //       placeholder: "Password",
// //       autocomplete: "current-password",
// //     }),
// //     m = el("div", { class: "bad", style: "display:none" });
// //   const go = async () => {
// //     await doLogin(u.value.trim(), p.value, m);
// //     m.style.display = m.textContent ? "block" : "none";
// //   };
// //   p.addEventListener("keydown", (e) => {
// //     if (e.key === "Enter") go();
// //   });
// //   $("#app").replaceChildren(
// //     el(
// //       "div",
// //       { class: "login card" },
// //       el("img", { src: "logo-icon.webp", alt: "", class: "login-logo" }),
// //       el("h2", {}, "Admin sign in"),
// //       el("p", { class: "mut" }, "Susa Lab Clinical Psychology Test Battery"),
// //       u,
// //       p,
// //       m,
// //       el("button", { onclick: go }, "Sign in"),
// //     ),
// //   );
// // }
// // const _render = render;
// // render = function (k) {
// //   if (!sessionStorage.getItem(TK)) {
// //     loginView();
// //     return;
// //   }
// //   _render(k);
// //   $("#nav").append(
// //     el(
// //       "a",
// //       {
// //         href: "#",
// //         onclick: (e) => {
// //           e.preventDefault();
// //           logout();
// //         },
// //       },
// //       "Logout",
// //     ),
// //   );
// // };

// // // ---- other records: personality, symptom checker, quick survey, intake ----
// // async function saveRecord(c, kind, data) {
// //   const r = { id: "r" + Date.now(), kind, data, at: new Date().toISOString() };
// //   (c.records = c.records || []).push(r);
// //   save();
// //   if (await pushPatient(c)) {
// //     const x = await api("/patients/" + c.sid + "/records", "POST", {
// //       kind,
// //       data,
// //       takenAt: r.at,
// //     });
// //     if (x && x._id) {
// //       r.sid = x._id;
// //       save();
// //     }
// //   }
// //   return r;
// // }
// // const _syncAll = syncAll;
// // syncAll = async function () {
// //   await _syncAll();
// //   for (const c of CL) {
// //     if (!c.sid) continue;
// //     for (const r of c.records || [])
// //       if (!r.sid) {
// //         const x = await api("/patients/" + c.sid + "/records", "POST", {
// //           kind: r.kind,
// //           data: r.data,
// //           takenAt: r.at,
// //         });
// //         if (x && x._id) r.sid = x._id;
// //       }
// //   }
// //   save();
// // };
// // function buildPQ() {
// //   const P = D.pq,
// //     ans = state.pq;
// //   if (Object.keys(ans).length < P.items.length)
// //     return "Answer all personality questions first.";
// //   const traits = {};
// //   Object.keys(P.traits).forEach((k) => {
// //     const idx = P.items.map((q, i) => [q, i]).filter(([q]) => q.t === k);
// //     const sum = idx.reduce((s, [q, i]) => s + (q.r ? 6 - ans[i] : ans[i]), 0),
// //       p = (sum - idx.length) / (4 * idx.length);
// //     traits[k] = {
// //       name: P.traits[k].name,
// //       pct: Math.round(p * 100),
// //       level: p <= 0.4 ? "Low" : p >= 0.65 ? "High" : "Medium",
// //     };
// //   });
// //   return { traits, answers: ans };
// // }
// // function buildSX() {
// //   const sx = state.sx,
// //     sel = D.syms.filter((s) => sx[s.id]);
// //   if (!sel.length) return "Tick at least one symptom first.";
// //   const top = D.cond
// //     .map((c) => {
// //       const m = c.sy.filter((s) => sx[s]);
// //       return { name: c.name, p: m.length / c.sy.length, n: m.length };
// //     })
// //     .filter((r) => r.n)
// //     .sort((a, b) => b.p - a.p || b.n - a.n)
// //     .slice(0, 6)
// //     .map((r) => ({ name: r.name, pct: Math.round(r.p * 100) }));
// //   return { symptoms: sel.map((s) => ({ id: s.id, label: s.l })), top };
// // }
// // function buildSV() {
// //   const a = state.ans,
// //     q = D.surv;
// //   if (!q.some((x) => a[x.no] != null && a[x.no] !== ""))
// //     return "Answer at least one survey question first.";
// //   const areas = {};
// //   q.forEach((x) => {
// //     const o = areas[x.area] || (areas[x.area] = { score: 0, max: 0 });
// //     o.score += +a[x.no] || 0;
// //     o.max += 3;
// //   });
// //   return {
// //     total: q
// //       .filter((x) => x.no !== 31)
// //       .reduce((s, x) => s + (+a[x.no] || 0), 0),
// //     max: 3 * (q.length - 1),
// //     risk: +a[31] > 0,
// //     areas,
// //     age: state.age,
// //     lit: state.lit,
// //   };
// // }
// // function buildIN() {
// //   const all = D.intake,
// //     yes = all.filter((q) => state.yn[q.id] === "Yes"),
// //     by = {};
// //   const answered = all.filter(
// //     (q) => state.yn[q.id] || (state.notes[q.id] || "").trim(),
// //   );
// //   yes.forEach((q) => {
// //     if (/^B\d/.test(q.bid)) by[q.bid] = (by[q.bid] || 0) + 1;
// //   });
// //   return {
// //     answered: answered.length,
// //     total: all.length,
// //     yes: yes.length,
// //     safety: yes.filter((q) => q.sec === "Safety / Risk").length,
// //     areas: by,
// //     notes: all
// //       .filter((q) => (state.notes[q.id] || "").trim())
// //       .map((q) => ({ q: q.q, note: state.notes[q.id] })),
// //     yn: state.yn,
// //   };
// // }
// // function saveBar(kind, build) {
// //   const st = el("span", { class: "mut" });
// //   return el(
// //     "div",
// //     { class: "card np", style: "border:2px solid var(--acc)" },
// //     el("h3", {}, "Save to patient record"),
// //     CL.length
// //       ? el(
// //           "div",
// //           { class: "row" },
// //           el(
// //             "select",
// //             {
// //               onchange: (e) => {
// //                 state.cid = e.target.value;
// //               },
// //             },
// //             CL.map((x) =>
// //               el(
// //                 "option",
// //                 { value: x.id, selected: x.id === state.cid },
// //                 x.name,
// //               ),
// //             ),
// //           ),
// //           el(
// //             "button",
// //             {
// //               onclick: async () => {
// //                 const c = cc(),
// //                   d = build();
// //                 if (typeof d === "string") {
// //                   st.textContent = d;
// //                   return;
// //                 }
// //                 await saveRecord(c, kind, d);
// //                 st.textContent = "Saved to " + c.name + "'s record \u2713";
// //               },
// //             },
// //             "Save",
// //           ),
// //           st,
// //         )
// //       : el(
// //           "p",
// //           { class: "mut" },
// //           "Create a patient first in the Patients tab.",
// //         ),
// //   );
// // }
// // const wrap = (name, fn) => {
// //   const o = V[name];
// //   V[name] = function () {
// //     const d = o(),
// //       b = fn();
// //     if (b) d.append(b);
// //     return d;
// //   };
// // };
// // wrap("personality", () => saveBar("personality", buildPQ));
// // wrap("checker", () => saveBar("symptoms", buildSX));
// // wrap("survey", () => saveBar("survey", buildSV));
// // wrap("intake", () => (state.isub ? saveBar("intake", buildIN) : null));

// // // ---- Patients page ----
// // V.patients = function () {
// //   if (!state.pT || Date.now() - state.pT > 20000) {
// //     state.pT = Date.now();
// //     api("/patients").then(async (x) => {
// //       if (!Array.isArray(x)) return;
// //       state.pst = {};
// //       x.forEach((p) => (state.pst[p._id] = p));
// //       await pullPatients();
// //       render();
// //     });
// //   }
// //   const st = state.pst || {},
// //     q = (state.pq2 || "").toLowerCase();
// //   const info = (c) => {
// //     const s = c.sid && st[c.sid];
// //     return {
// //       tests: s ? s.resultCount : (c.history || []).length,
// //       recs: s ? s.recordCount : (c.records || []).length,
// //       last:
// //         (s && s.lastActivityAt) ||
// //         (c.history || [])
// //           .concat(c.records || [])
// //           .map((x) => x.at)
// //           .sort()
// //           .pop() ||
// //         "",
// //     };
// //   };
// //   const list = CL.filter(
// //     (c) => !q || (c.name + " " + (c.ref || "")).toLowerCase().includes(q),
// //   )
// //     .map((c) => [c, info(c)])
// //     .sort((a, b) => (b[1].last > a[1].last ? 1 : -1));
// //   const f = { name: "", age: "", sex: "", ref: "" },
// //     inp = (k, ph) =>
// //       el("input", {
// //         type: "text",
// //         placeholder: ph,
// //         oninput: (e) => (f[k] = e.target.value),
// //       });
// //   const create = async () => {
// //     if (!f.name.trim()) return alert("Enter the patient name");
// //     const c = {
// //       id: "c" + Date.now(),
// //       name: f.name.trim(),
// //       age: f.age,
// //       sex: f.sex,
// //       date: new Date().toISOString().slice(0, 10),
// //       examiner: "",
// //       ref: f.ref,
// //       runs: {},
// //       history: [],
// //       records: [],
// //     };
// //     CL.push(c);
// //     state.cid = c.id;
// //     state.np = false;
// //     save();
// //     await pushPatient(c);
// //     goTo("record");
// //   };
// //   return el(
// //     "div",
// //     {},
// //     el("h2", {}, "Patients"),
// //     state.np
// //       ? el(
// //           "div",
// //           { class: "card" },
// //           el("h3", {}, "New patient"),
// //           el(
// //             "div",
// //             { class: "row" },
// //             inp("name", "Full name"),
// //             inp("age", "Age"),
// //             el(
// //               "select",
// //               { onchange: (e) => (f.sex = e.target.value) },
// //               ["", "Male", "Female", "Other"].map((a) => el("option", {}, a)),
// //             ),
// //             inp("ref", "Reason for visit"),
// //           ),
// //           el(
// //             "div",
// //             { class: "row" },
// //             el("button", { onclick: create }, "Create and open record"),
// //             el(
// //               "button",
// //               {
// //                 class: "sec",
// //                 onclick: () => {
// //                   state.np = false;
// //                   render();
// //                 },
// //               },
// //               "Cancel",
// //             ),
// //           ),
// //         )
// //       : el(
// //           "div",
// //           { class: "row" },
// //           el("input", {
// //             type: "search",
// //             placeholder: "Search patients",
// //             value: state.pq2,
// //             oninput: (e) => {
// //               state.pq2 = e.target.value;
// //               render(true);
// //             },
// //           }),
// //           el(
// //             "button",
// //             {
// //               onclick: () => {
// //                 state.np = true;
// //                 render();
// //               },
// //             },
// //             "+ New patient",
// //           ),
// //         ),
// //     list.length
// //       ? list.map(([c, i]) =>
// //           el(
// //             "div",
// //             { class: "card pc" },
// //             el(
// //               "div",
// //               {},
// //               el("b", {}, c.name),
// //               el(
// //                 "div",
// //                 { class: "mut" },
// //                 [c.age && "Age " + c.age, c.sex, c.ref]
// //                   .filter(Boolean)
// //                   .join(" | "),
// //               ),
// //               el(
// //                 "div",
// //                 { class: "mut" },
// //                 i.tests +
// //                   " test result(s), " +
// //                   i.recs +
// //                   " other record(s)" +
// //                   (i.last
// //                     ? ", last activity " + String(i.last).slice(0, 10)
// //                     : ""),
// //               ),
// //             ),
// //             el(
// //               "div",
// //               { class: "row" },
// //               el(
// //                 "button",
// //                 {
// //                   onclick: () => {
// //                     state.cid = c.id;
// //                     goTo("record");
// //                   },
// //                 },
// //                 "Open record",
// //               ),
// //               el(
// //                 "button",
// //                 {
// //                   class: "sec",
// //                   onclick: () => {
// //                     state.cid = c.id;
// //                     goTo("administer");
// //                   },
// //                 },
// //                 "Take a test",
// //               ),
// //             ),
// //           ),
// //         )
// //       : el("p", { class: "mut" }, "No patients yet. Press + New patient."),
// //   );
// // };

// // // ---- Patient Record: complete history with before/after ----
// // async function loadFull(c) {
// //   const x = await api("/patients/" + c.sid + "/full");
// //   if (!x || !Array.isArray(x.results)) return false;
// //   const loc = (c.history || []).filter((h) => !h.sid),
// //     locr = (c.records || []).filter((r) => !r.sid);
// //   c.history = x.results
// //     .map((h) => ({
// //       id: h._id,
// //       sid: h._id,
// //       ab: h.ab,
// //       name: h.name,
// //       cat: h.cat,
// //       raw: h.raw,
// //       max: h.max,
// //       label: h.label,
// //       rank: h.rank,
// //       risk: !!h.risk,
// //       scaled: h.scaled || "",
// //       notes: h.notes || "",
// //       at: h.takenAt,
// //     }))
// //     .concat(loc);
// //   c.records = (x.records || [])
// //     .map((r) => ({
// //       id: r._id,
// //       sid: r._id,
// //       kind: r.kind,
// //       data: r.data,
// //       at: r.takenAt,
// //     }))
// //     .concat(locr);
// //   save();
// //   return true;
// // }
// // const by = (c, k) =>
// //   (c.records || [])
// //     .filter((r) => r.kind === k)
// //     .sort((a, b) => (a.at < b.at ? -1 : 1));
// // const dir = (a, b) => (b < a ? "better" : b > a ? "worse" : "same");
// // const dirTag = (d) =>
// //   el(
// //     "span",
// //     d === "better"
// //       ? { class: "tag ok" }
// //       : d === "worse"
// //         ? { class: "tag", style: "background:#fde2e2;color:#7f1d1d" }
// //         : { class: "tag" },
// //     d === "better" ? "Improved" : d === "worse" ? "Worse" : "No change",
// //   );
// // const LV = { Low: 0, Medium: 1, High: 2 },
// //   day = (x) => String(x).slice(0, 10),
// //   nm = (t) => t.name.split(" (")[0];
// // const tdir = (pts) => {
// //   if (pts.length < 2) return null;
// //   const a = pts[0],
// //     b = pts[pts.length - 1],
// //     cfg = SC[a.ab];
// //   if (!cfg) return null;
// //   const d = b.raw - a.raw;
// //   return d === 0 ? "same" : (cfg.low ? d > 0 : d < 0) ? "better" : "worse";
// // };
// // V.record = function () {
// //   const c = cc();
// //   if (!c)
// //     return el(
// //       "div",
// //       {},
// //       el("h2", {}, "Patient Record"),
// //       el("p", { class: "mut" }, "Open a patient from the Patients tab."),
// //       el("button", { onclick: () => goTo("patients") }, "Go to Patients"),
// //     );
// //   if (c.sid && state.fl !== c.id) {
// //     state.fl = c.id;
// //     loadFull(c).then((ok) => {
// //       state.off = !ok;
// //       render();
// //     });
// //   }
// //   const H = (c.history || []).slice().sort((a, b) => (a.at < b.at ? -1 : 1)),
// //     abs = [...new Set(H.map((h) => h.ab))];
// //   const P = by(c, "personality"),
// //     S = by(c, "symptoms"),
// //     SV = by(c, "survey"),
// //     I = by(c, "intake"),
// //     last = (a) => a[a.length - 1];
// //   const g = [],
// //     td = abs.map((a) => tdir(H.filter((h) => h.ab === a))).filter(Boolean);
// //   if (td.length) {
// //     const b = td.filter((x) => x === "better").length,
// //       w = td.filter((x) => x === "worse").length;
// //     g.push([
// //       "Tests",
// //       b +
// //         " improved, " +
// //         w +
// //         " worse, " +
// //         (td.length - b - w) +
// //         " unchanged (of " +
// //         td.length +
// //         " repeated tests)",
// //       b > w ? "better" : w > b ? "worse" : "same",
// //     ]);
// //   }
// //   if (P.length > 1 && P[0].data.traits.N && last(P).data.traits.N)
// //     g.push([
// //       "Stress and worry (personality)",
// //       P[0].data.traits.N.level + " \u2192 " + last(P).data.traits.N.level,
// //       dir(LV[P[0].data.traits.N.level], LV[last(P).data.traits.N.level]),
// //     ]);
// //   if (S.length > 1)
// //     g.push([
// //       "Symptoms ticked",
// //       S[0].data.symptoms.length + " \u2192 " + last(S).data.symptoms.length,
// //       dir(S[0].data.symptoms.length, last(S).data.symptoms.length),
// //     ]);
// //   if (SV.length > 1)
// //     g.push([
// //       "Quick survey total",
// //       SV[0].data.total + " \u2192 " + last(SV).data.total,
// //       dir(SV[0].data.total, last(SV).data.total),
// //     ]);
// //   if (I.length > 1)
// //     g.push([
// //       "Intake: Yes answers",
// //       I[0].data.yes + " \u2192 " + last(I).data.yes,
// //       dir(I[0].data.yes, last(I).data.yes),
// //     ]);
// //   const del = (r) =>
// //     el(
// //       "button",
// //       {
// //         class: "sec np",
// //         onclick: async () => {
// //           if (!confirm("Delete this record?")) return;
// //           if (r.sid) await api("/records/" + r.sid, "DELETE");
// //           c.records = c.records.filter((x) => x !== r);
// //           save();
// //           render();
// //         },
// //       },
// //       "Delete",
// //     );
// //   const rows = (arr, fmt) =>
// //     arr
// //       .slice()
// //       .reverse()
// //       .map((r) =>
// //         el(
// //           "div",
// //           { class: "row" },
// //           el("b", {}, day(r.at)),
// //           el("span", {}, fmt(r.data)),
// //           del(r),
// //         ),
// //       );
// //   const sec = (t, kids, n) =>
// //     el(
// //       "div",
// //       { class: "card" },
// //       el("h3", {}, t),
// //       n ? kids.flat(Infinity) : el("p", { class: "mut" }, "Nothing saved yet."),
// //     );
// //   const set = (a, b) => {
// //       const z = new Set(b);
// //       return a.filter((x) => !z.has(x));
// //     },
// //     l = (a) => (a.length ? a.join("; ") : "none");
// //   const box = el("div");
// //   if (H.some((h) => pct(h) != null))
// //     box.innerHTML = chart(H, abs, state.hid || {});
// //   const leg = el(
// //     "div",
// //     { class: "row np" },
// //     abs
// //       .filter((a) => H.some((h) => h.ab === a && pct(h) != null))
// //       .map((a) => {
// //         const hd = (state.hid || {})[a],
// //           cl = tcol(abs, a);
// //         return el(
// //           "button",
// //           {
// //             style: hd
// //               ? "background:transparent;color:" + cl + ";border-color:" + cl
// //               : "background:" + cl + ";border-color:" + cl + ";color:#fff",
// //             onclick: () => {
// //               (state.hid = state.hid || {})[a] = !hd;
// //               render();
// //             },
// //           },
// //           a,
// //         );
// //       }),
// //   );
// //   const sl = (r) => r.data.symptoms.map((s) => s.label);
// //   return el(
// //     "div",
// //     {},
// //     el("h2", {}, "Patient Record"),
// //     el(
// //       "div",
// //       { class: "row np" },
// //       el(
// //         "button",
// //         { class: "sec", onclick: () => goTo("patients") },
// //         "\u2190 All patients",
// //       ),
// //       el("button", { onclick: () => window.print() }, "Print full record"),
// //     ),
// //     state.off &&
// //       el(
// //         "div",
// //         { class: "card mut" },
// //         "Offline: showing records saved on this device. They upload automatically when the database is reachable.",
// //       ),
// //     el(
// //       "div",
// //       { class: "card" },
// //       el("h3", {}, c.name),
// //       el(
// //         "div",
// //         { class: "mut" },
// //         [
// //           c.age && "Age " + c.age,
// //           c.sex,
// //           c.ref && "Reason: " + c.ref,
// //           "Report date " + new Date().toISOString().slice(0, 10),
// //         ]
// //           .filter(Boolean)
// //           .join(" | "),
// //       ),
// //     ),
// //     el(
// //       "div",
// //       { class: "card" },
// //       el("h3", {}, "Progress at a glance (first visit \u2192 latest)"),
// //       g.length
// //         ? el(
// //             "ul",
// //             {},
// //             g.map(([lb, t, d]) =>
// //               el("li", {}, el("b", {}, lb + ": "), t + " ", dirTag(d)),
// //             ),
// //           )
// //         : el(
// //             "p",
// //             { class: "mut" },
// //             "Repeat a test, quiz or checker on another day to see improvement here.",
// //           ),
// //     ),
// //     sec(
// //       "Test results",
// //       [
// //         el(
// //           "ul",
// //           {},
// //           abs.map((a) =>
// //             el(
// //               "li",
// //               {},
// //               el("b", {}, a + ": "),
// //               trend(H.filter((h) => h.ab === a)),
// //             ),
// //           ),
// //         ),
// //         leg,
// //         box,
// //         H.slice()
// //           .reverse()
// //           .map((h) =>
// //             el(
// //               "div",
// //               { class: "row" },
// //               el("b", {}, day(h.at)),
// //               el(
// //                 "span",
// //                 {},
// //                 h.ab +
// //                   ": " +
// //                   h.raw +
// //                   (h.max ? " / " + h.max : "") +
// //                   " \u2013 " +
// //                   h.label +
// //                   (h.risk ? " (RISK FLAG)" : ""),
// //               ),
// //             ),
// //           ),
// //       ],
// //       H.length,
// //     ),
// //     sec(
// //       "Personality quiz",
// //       [
// //         rows(P, (d) =>
// //           Object.values(d.traits)
// //             .map((t) => nm(t) + ": " + t.level)
// //             .join(" | "),
// //         ),
// //         P.length > 1 &&
// //           el(
// //             "p",
// //             { class: "mut" },
// //             "Change: " +
// //               Object.keys(last(P).data.traits)
// //                 .filter((k) => P[0].data.traits[k])
// //                 .map(
// //                   (k) =>
// //                     nm(last(P).data.traits[k]) +
// //                     " " +
// //                     P[0].data.traits[k].level +
// //                     " \u2192 " +
// //                     last(P).data.traits[k].level,
// //                 )
// //                 .join(" | "),
// //           ),
// //       ],
// //       P.length,
// //     ),
// //     sec(
// //       "Symptom checker",
// //       [
// //         rows(
// //           S,
// //           (d) =>
// //             d.symptoms.length +
// //             " symptoms. Likely: " +
// //             d.top
// //               .slice(0, 3)
// //               .map((t) => t.name + " " + t.pct + "%")
// //               .join(", "),
// //         ),
// //         S.length > 1 &&
// //           el(
// //             "p",
// //             { class: "mut" },
// //             "Resolved since first visit: " +
// //               l(set(sl(S[0]), sl(last(S)))) +
// //               ". New: " +
// //               l(set(sl(last(S)), sl(S[0]))) +
// //               ".",
// //           ),
// //       ],
// //       S.length,
// //     ),
// //     sec(
// //       "Quick survey",
// //       [
// //         rows(
// //           SV,
// //           (d) =>
// //             "Total " +
// //             d.total +
// //             " / " +
// //             d.max +
// //             (d.risk ? " (SAFETY FLAG)" : ""),
// //         ),
// //         SV.length > 1 &&
// //           el(
// //             "p",
// //             { class: "mut" },
// //             "Area scores changed: " +
// //               l(
// //                 Object.keys(last(SV).data.areas)
// //                   .filter(
// //                     (k) =>
// //                       SV[0].data.areas[k] &&
// //                       SV[0].data.areas[k].score !==
// //                         last(SV).data.areas[k].score,
// //                   )
// //                   .map(
// //                     (k) =>
// //                       k +
// //                       " " +
// //                       SV[0].data.areas[k].score +
// //                       " \u2192 " +
// //                       last(SV).data.areas[k].score,
// //                   ),
// //               ),
// //           ),
// //       ],
// //       SV.length,
// //     ),
// //     sec(
// //       "Intake interview",
// //       [
// //         rows(
// //           I,
// //           (d) =>
// //             d.answered +
// //             "/" +
// //             d.total +
// //             " answered, " +
// //             d.yes +
// //             " Yes" +
// //             (d.safety ? " (" + d.safety + " safety)" : ""),
// //         ),
// //         I.length > 1 &&
// //           el(
// //             "p",
// //             { class: "mut" },
// //             "Yes answers: " + I[0].data.yes + " \u2192 " + last(I).data.yes,
// //           ),
// //       ],
// //       I.length,
// //     ),
// //   );
// // };
// // if (sessionStorage.getItem(TK)) syncAll().then(() => render());
// // render();

// // record.js: admin login, Patients page, complete Patient Record. Loads after run.js.
// const TK = "cpt_token";
// TABS.splice(1, 0, ["patients", "Patients"], ["record", "Patient Record"]);
// Object.assign(state, { pq2: "", np: false });

// // ---- auth: every API call carries the admin token ----
// api = async function (path, method, body) {
//   if (!API) return null;
//   try {
//     const r = await fetch(API + path, {
//       method: method || "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + (sessionStorage.getItem(TK) || ""),
//       },
//       body: body ? JSON.stringify(body) : undefined,
//     });
//     if (r.status === 401) {
//       logout();
//       return null;
//     }
//     if (!r.ok) return null;
//     return r.status === 204 ? {} : await r.json();
//   } catch (e) {
//     return null;
//   }
// };
// function logout() {
//   sessionStorage.removeItem(TK);
//   localStorage.removeItem("cpt_sel");
//   state.cid = null;
//   render();
// }
// async function doLogin(u, p, msg) {
//   msg.textContent = "";
//   try {
//     const r = await fetch(API + "/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username: u, password: p }),
//     });
//     if (!r.ok) {
//       msg.textContent =
//         r.status === 401
//           ? "Wrong username or password."
//           : "Could not sign in. Try again.";
//       return;
//     }
//     const d = await r.json();
//     sessionStorage.setItem(TK, d.token);
//     location.hash = "#patients";
//     await syncAll();
//     render();
//   } catch (e) {
//     msg.textContent = "Cannot connect. Check your internet connection.";
//   }
// }
// function loginView() {
//   $("#nav").replaceChildren();
//   const u = el("input", {
//       type: "text",
//       placeholder: "Username",
//       autocomplete: "username",
//     }),
//     p = el("input", {
//       type: "password",
//       placeholder: "Password",
//       autocomplete: "current-password",
//     }),
//     m = el("div", { class: "bad", style: "display:none" });
//   const go = async () => {
//     await doLogin(u.value.trim(), p.value, m);
//     m.style.display = m.textContent ? "block" : "none";
//   };
//   p.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") go();
//   });
//   $("#app").replaceChildren(
//     el(
//       "div",
//       { class: "login card" },
//       el("img", { src: "logo-icon.webp", alt: "", class: "login-logo" }),
//       el("h2", {}, "Admin sign in"),
//       el("p", { class: "mut" }, "Susa Lab Clinical Psychology Test Battery"),
//       u,
//       p,
//       m,
//       el("button", { onclick: go }, "Sign in"),
//     ),
//   );
// }
// const _render = render;
// render = function (k) {
//   if (!sessionStorage.getItem(TK)) {
//     loginView();
//     return;
//   }
//   _render(k);
//   if (cur() !== "patients" && cur() !== "home") $("#app").prepend(strip());
//   $("#nav").append(
//     el(
//       "a",
//       {
//         href: "#",
//         onclick: (e) => {
//           e.preventDefault();
//           logout();
//         },
//       },
//       "Logout",
//     ),
//   );
// };

// // ---- other records: personality, symptom checker, quick survey, intake ----
// async function saveRecord(c, kind, data) {
//   const r = { id: "r" + Date.now(), kind, data, at: new Date().toISOString() };
//   (c.records = c.records || []).push(r);
//   save();
//   if (await pushPatient(c)) {
//     const x = await api("/patients/" + c.sid + "/records", "POST", {
//       kind,
//       data,
//       takenAt: r.at,
//     });
//     if (x && x._id) {
//       r.sid = x._id;
//       save();
//     }
//   }
//   return r;
// }
// const _syncAll = syncAll;
// syncAll = async function () {
//   await _syncAll();
//   for (const c of CL) {
//     if (!c.sid) continue;
//     for (const r of c.records || [])
//       if (!r.sid) {
//         const x = await api("/patients/" + c.sid + "/records", "POST", {
//           kind: r.kind,
//           data: r.data,
//           takenAt: r.at,
//         });
//         if (x && x._id) r.sid = x._id;
//       }
//   }
//   save();
// };
// function buildPQ() {
//   const P = D.pq,
//     ans = state.pq;
//   if (Object.keys(ans).length < P.items.length)
//     return "Answer all personality questions first.";
//   const traits = {};
//   Object.keys(P.traits).forEach((k) => {
//     const idx = P.items.map((q, i) => [q, i]).filter(([q]) => q.t === k);
//     const sum = idx.reduce((s, [q, i]) => s + (q.r ? 6 - ans[i] : ans[i]), 0),
//       p = (sum - idx.length) / (4 * idx.length);
//     traits[k] = {
//       name: P.traits[k].name,
//       pct: Math.round(p * 100),
//       level: p <= 0.4 ? "Low" : p >= 0.65 ? "High" : "Medium",
//     };
//   });
//   return { traits, answers: ans };
// }
// function buildSX() {
//   const sx = state.sx,
//     sel = D.syms.filter((s) => sx[s.id]);
//   if (!sel.length) return "Tick at least one symptom first.";
//   const top = D.cond
//     .map((c) => {
//       const m = c.sy.filter((s) => sx[s]);
//       return { name: c.name, p: m.length / c.sy.length, n: m.length };
//     })
//     .filter((r) => r.n)
//     .sort((a, b) => b.p - a.p || b.n - a.n)
//     .slice(0, 6)
//     .map((r) => ({ name: r.name, pct: Math.round(r.p * 100) }));
//   return { symptoms: sel.map((s) => ({ id: s.id, label: s.l })), top };
// }
// function buildSV() {
//   const a = state.ans,
//     q = D.surv;
//   if (!q.some((x) => a[x.no] != null && a[x.no] !== ""))
//     return "Answer at least one survey question first.";
//   const areas = {};
//   q.forEach((x) => {
//     const o = areas[x.area] || (areas[x.area] = { score: 0, max: 0 });
//     o.score += +a[x.no] || 0;
//     o.max += 3;
//   });
//   return {
//     total: q
//       .filter((x) => x.no !== 31)
//       .reduce((s, x) => s + (+a[x.no] || 0), 0),
//     max: 3 * (q.length - 1),
//     risk: +a[31] > 0,
//     areas,
//     age: state.age,
//     lit: state.lit,
//   };
// }
// function buildIN() {
//   const all = D.intake,
//     yes = all.filter((q) => state.yn[q.id] === "Yes"),
//     by = {};
//   const answered = all.filter(
//     (q) => state.yn[q.id] || (state.notes[q.id] || "").trim(),
//   );
//   yes.forEach((q) => {
//     if (/^B\d/.test(q.bid)) by[q.bid] = (by[q.bid] || 0) + 1;
//   });
//   return {
//     answered: answered.length,
//     total: all.length,
//     yes: yes.length,
//     safety: yes.filter((q) => q.sec === "Safety / Risk").length,
//     areas: by,
//     notes: all
//       .filter((q) => (state.notes[q.id] || "").trim())
//       .map((q) => ({ q: q.q, note: state.notes[q.id] })),
//     yn: state.yn,
//   };
// }
// function saveBar(kind, build) {
//   const st = el("span", { class: "mut" }),
//     c0 = cc();
//   return el(
//     "div",
//     { class: "card np", style: "border:2px solid var(--acc)" },
//     el("h3", {}, "Save to patient record"),
//     el(
//       "div",
//       { class: "row" },
//       el(
//         "span",
//         {},
//         "Saving to: ",
//         el("b", {}, c0 ? c0.name : "no patient selected"),
//       ),
//       el(
//         "button",
//         {
//           onclick: async () => {
//             const c = cc();
//             if (!c) {
//               st.textContent = "Select a patient first (Patients tab).";
//               return;
//             }
//             const d = build();
//             if (typeof d === "string") {
//               st.textContent = d;
//               return;
//             }
//             await saveRecord(c, kind, d);
//             st.textContent = "Saved to " + c.name + "'s record \u2713";
//           },
//         },
//         "Save",
//       ),
//       st,
//     ),
//   );
// }
// const wrap = (name, fn) => {
//   const o = V[name];
//   V[name] = function () {
//     const d = o(),
//       b = fn();
//     if (b) d.append(b);
//     return d;
//   };
// };
// wrap("personality", () => saveBar("personality", buildPQ));
// wrap("checker", () => saveBar("symptoms", buildSX));
// wrap("survey", () => saveBar("survey", buildSV));
// wrap("intake", () => (state.isub ? saveBar("intake", buildIN) : null));

// // ---- Patients page: clinic registration, search, select ----
// const PF = [
//   [
//     "Basic details",
//     [
//       ["name", "Full name *"],
//       ["age", "Age *", "number"],
//       ["sex", "Sex", "select", ["", "Male", "Female", "Other"]],
//       ["dob", "Date of birth", "date"],
//       [
//         "marital",
//         "Marital status",
//         "select",
//         ["", "Single", "Married", "Divorced", "Widowed"],
//       ],
//       ["education", "Education"],
//       ["occupation", "Occupation"],
//       ["language", "Preferred language"],
//     ],
//   ],
//   [
//     "Contact",
//     [
//       ["phone", "Phone number *", "tel"],
//       ["phone2", "Secondary number", "tel"],
//       ["email", "Email", "email"],
//       ["address", "Address / city"],
//       ["emName", "Emergency contact name"],

//     ],
//   ],
//   [
//     "Body",
//     [
//       ["height", "Height (cm)", "number"],
//       ["weight", "Weight (kg)", "number"],
//     ],
//   ],
//   [
//     "Visit and history",
//     [
//       ["ref", "Reason for visit *", "textarea"],
//       ["referred", "Referred by"],
//       [
//         "medHx",
//         "Medical history: accident, head injury, operation, illness",
//         "textarea",
//       ],
//       ["meds", "Current medicines", "textarea"],
//       ["allergy", "Allergies"],
//       ["psyHx", "Past mental health treatment", "textarea"],
//       [
//         "famHx",
//         "Family history (mental illness, memory problems, substance use)",
//         "textarea",
//       ],
//       ["substance", "Alcohol, tobacco or drug use", "textarea"],
//     ],
//   ],
// ];
// const PFK = PF.flatMap((g) => g[1].map((x) => x[0])).concat("consent");
// const PROF = PFK.filter(
//   (k) => !["name", "age", "sex", "ref"].includes(k),
// ).concat(["pid", "date"]);
// const bmi = (c) => {
//   const h = +c.height / 100,
//     w = +c.weight;
//   return h > 0 && w > 0 ? (w / (h * h)).toFixed(1) : "";
// };
// const brief = (c) =>
//   [c.age && c.age + " yrs", c.sex, c.phone].filter(Boolean).join(" \u00B7 ");
// pushPatient = async function (c) {
//   const prof = {};
//   PROF.forEach((k) => (prof[k] = c[k] === undefined ? "" : c[k]));
//   const d = {
//     name: c.name,
//     age: c.age,
//     sex: c.sex,
//     examiner: c.examiner,
//     referral: c.ref,
//     profile: prof,
//   };
//   const p = c.sid
//     ? await api("/patients/" + c.sid, "PUT", d)
//     : await api("/patients", "POST", d);
//   if (p && p._id) {
//     c.sid = p._id;
//     save();
//   }
//   return !!(p && p._id);
// };
// pullPatients = async function () {
//   const x = await api("/patients");
//   if (!Array.isArray(x)) return false;
//   x.forEach((p) => {
//     let c = CL.find((q) => q.sid === p._id);
//     if (!c) {
//       c = { id: "s" + p._id, sid: p._id, runs: {}, history: [], records: [] };
//       CL.push(c);
//     }
//     Object.assign(
//       c,
//       {
//         name: p.name,
//         age: p.age || "",
//         sex: p.sex || "",
//         examiner: p.examiner || "",
//         ref: p.referral || "",
//       },
//       p.profile || {},
//     );
//   });
//   save();
//   return true;
// };
// function selectPatient(id) {
//   if (state.cid !== id) {
//     Object.assign(state, {
//       pq: {},
//       sx: {},
//       yn: {},
//       notes: {},
//       ans: {},
//       isub: false,
//       runAb: null,
//       runBat: null,
//       focusBat: null,
//       hid: {},
//       fl: null,
//       hab: null,
//     });
//     state.cid = id;
//   }
//   const c = cc(),
//     a = parseInt(c && c.age);
//   if (!isNaN(a))
//     state.age =
//       a < 18
//         ? "Child/Adolescent (under 18)"
//         : a >= 60
//           ? "Older adult (60+)"
//           : "Adult (18-59)";
//   localStorage.setItem("cpt_sel", id);
// }
// clientBar = function () {
//   return el("div", { style: "display:none" });
// };
// function strip() {
//   const c = cc();
//   return el(
//     "div",
//     { class: "card np pstrip" },
//     c
//       ? el(
//           "div",
//           {},
//           el("b", {}, "Patient: " + c.name),
//           el("span", { class: "mut" }, "  " + brief(c)),
//         )
//       : el(
//           "span",
//           { class: "mut" },
//           "No patient selected. Select a patient to continue.",
//         ),
//     el(
//       "button",
//       { class: "sec", onclick: () => goTo("patients") },
//       c ? "Change patient" : "Select patient",
//     ),
//   );
// }
// function pfield(x) {
//   const [k, label, type, opts] = x,
//     f = state.pf;
//   const mk =
//     type === "textarea"
//       ? el("textarea", { oninput: (e) => (f[k] = e.target.value) }, f[k] || "")
//       : type === "select"
//         ? el(
//             "select",
//             { onchange: (e) => (f[k] = e.target.value) },
//             opts.map((o) => el("option", { selected: o === (f[k] || "") }, o)),
//           )
//         : el("input", {
//             type: type || "text",
//             value: f[k] || "",
//             oninput: (e) => (f[k] = e.target.value),
//           });
//   return el("label", { class: type === "textarea" ? "wide" : "" }, label, mk);
// }
// async function savePatient() {
//   const f = state.pf,
//     errs = [],
//     isNew = state.pe === "new";
//   if (!(f.name || "").trim()) errs.push("Name");
//   if (!f.age || isNaN(+f.age)) errs.push("Age");
//   if (!/^[+\d][\d\s-]{6,}$/.test((f.phone || "").trim()))
//     errs.push("Phone number (at least 7 digits)");
//   if (!(f.ref || "").trim()) errs.push("Reason for visit");
//   if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim()))
//     errs.push("Email (not valid)");
//   if (!f.consent) errs.push("Consent");
//   if (errs.length) return alert("Please fill: " + errs.join(", "));
//   const dup = CL.find(
//     (x) => x.id !== state.pe && x.phone && x.phone === f.phone.trim(),
//   );
//   if (
//     isNew &&
//     dup &&
//     !confirm(
//       "A patient with this phone number already exists (" +
//         dup.name +
//         "). Create another?",
//     )
//   )
//     return;
//   let c = isNew ? null : CL.find((x) => x.id === state.pe);
//   if (!c) {
//     c = {
//       id: "c" + Date.now(),
//       runs: {},
//       history: [],
//       records: [],
//       examiner: "",
//       date: new Date().toISOString().slice(0, 10),
//       pid: "P" + Date.now().toString(36).slice(-5).toUpperCase(),
//     };
//     CL.push(c);
//   }
//   PFK.forEach((k) => (c[k] = typeof f[k] === "string" ? f[k].trim() : f[k]));
//   state.pe = null;
//   save();
//   await pushPatient(c);
//   selectPatient(c.id);
//   goTo(isNew ? "intake" : "patients");
// }
// function patientForm() {
//   const isNew = state.pe === "new",
//     c = isNew ? null : CL.find((x) => x.id === state.pe);
//   return el(
//     "div",
//     {},
//     el("h2", {}, isNew ? "New patient" : "Edit patient"),
//     PF.map((g) =>
//       el(
//         "div",
//         { class: "card" },
//         el("h3", {}, g[0]),
//         el("div", { class: "pform" }, g[1].map(pfield)),
//       ),
//     ),
//     el(
//       "div",
//       { class: "card" },
//       el(
//         "label",
//         { class: "row" },
//         el("input", {
//           type: "checkbox",
//           checked: !!state.pf.consent,
//           onchange: (e) => (state.pf.consent = e.target.checked),
//         }),
//         "The patient (or guardian) has given consent for assessment and for storing these records. *",
//       ),
//     ),
//     el(
//       "div",
//       { class: "row" },
//       el(
//         "button",
//         { onclick: savePatient },
//         isNew ? "Save and start intake" : "Save changes",
//       ),
//       el(
//         "button",
//         {
//           class: "sec",
//           onclick: () => {
//             state.pe = null;
//             render();
//           },
//         },
//         "Cancel",
//       ),
//       c &&
//         el(
//           "button",
//           {
//             class: "sec",
//             onclick: async () => {
//               if (
//                 !confirm("Delete " + c.name + " and all records permanently?")
//               )
//                 return;
//               if (c.sid) await api("/patients/" + c.sid, "DELETE");
//               CL = CL.filter((x) => x !== c);
//               if (state.cid === c.id) state.cid = null;
//               state.pe = null;
//               save();
//               render();
//             },
//           },
//           "Delete patient",
//         ),
//     ),
//   );
// }
// V.patients = function () {
//   if (!state.pT || Date.now() - state.pT > 20000) {
//     state.pT = Date.now();
//     api("/patients").then(async (x) => {
//       if (!Array.isArray(x)) return;
//       state.pst = {};
//       x.forEach((p) => (state.pst[p._id] = p));
//       await pullPatients();
//       if (!state.pe) render();
//     });
//   }
//   if (state.pe) return patientForm();
//   const st = state.pst || {},
//     q = (state.pq2 || "").toLowerCase().trim(),
//     qd = q.replace(/\D/g, "");
//   const hit = (c) =>
//     !q ||
//     [c.name, c.phone, c.phone2, c.email, c.pid, c.ref].some((v) =>
//       String(v || "")
//         .toLowerCase()
//         .includes(q),
//     ) ||
//     (qd.length >= 3 &&
//       [c.phone, c.phone2, c.emPhone].some((v) =>
//         String(v || "")
//           .replace(/\D/g, "")
//           .includes(qd),
//       ));
//   const info = (c) => {
//     const s = c.sid && st[c.sid];
//     return {
//       tests: s ? s.resultCount : (c.history || []).length,
//       recs: s ? s.recordCount : (c.records || []).length,
//       last:
//         (s && s.lastActivityAt) ||
//         (c.history || [])
//           .concat(c.records || [])
//           .map((x) => x.at)
//           .sort()
//           .pop() ||
//         "",
//     };
//   };
//   const list = CL.filter(hit)
//     .map((c) => [c, info(c)])
//     .sort((a, b) => (b[1].last > a[1].last ? 1 : -1));
//   return el(
//     "div",
//     {},
//     el("h2", {}, "Patients"),
//     el(
//       "div",
//       { class: "row" },
//       el("input", {
//         type: "search",
//         placeholder: "Search by name, phone number, email or ID",
//         value: state.pq2,
//         oninput: (e) => {
//           state.pq2 = e.target.value;
//           render(true);
//         },
//       }),
//       el(
//         "button",
//         {
//           onclick: () => {
//             state.pe = "new";
//             state.pf = {};
//             render();
//           },
//         },
//         "+ New patient",
//       ),
//     ),
//     el(
//       "p",
//       { class: "mut" },
//       CL.length +
//         " patient(s)" +
//         (q ? ", " + list.length + " match" : "") +
//         ". Select a patient to use their name in every page.",
//     ),
//     list.length
//       ? list.map(([c, i]) =>
//           el(
//             "div",
//             {
//               class: "card pc",
//               style: c.id === state.cid ? "border:2px solid var(--acc)" : "",
//             },
//             el(
//               "div",
//               {},
//               el("b", {}, c.name),
//               c.id === state.cid
//                 ? el(
//                     "span",
//                     { class: "tag ok", style: "margin-left:8px" },
//                     "Selected",
//                   )
//                 : null,
//               el(
//                 "div",
//                 { class: "mut" },
//                 [
//                   brief(c),
//                   c.pid && "ID " + c.pid,
//                   c.height && c.weight && "BMI " + bmi(c),
//                 ]
//                   .filter(Boolean)
//                   .join(" | "),
//               ),
//               el("div", { class: "mut" }, "Reason: " + (c.ref || "-")),
//               el(
//                 "div",
//                 { class: "mut" },
//                 i.tests +
//                   " test result(s), " +
//                   i.recs +
//                   " other record(s)" +
//                   (i.last
//                     ? ", last activity " + String(i.last).slice(0, 10)
//                     : ""),
//               ),
//             ),
//             el(
//               "div",
//               { class: "row" },
//               el(
//                 "button",
//                 {
//                   onclick: () => {
//                     selectPatient(c.id);
//                     goTo("intake");
//                   },
//                 },
//                 "Select and start",
//               ),
//               el(
//                 "button",
//                 {
//                   class: "sec",
//                   onclick: () => {
//                     selectPatient(c.id);
//                     goTo("record");
//                   },
//                 },
//                 "Open record",
//               ),
//               el(
//                 "button",
//                 {
//                   class: "sec",
//                   onclick: () => {
//                     state.pe = c.id;
//                     state.pf = Object.assign({}, c);
//                     render();
//                   },
//                 },
//                 "Edit",
//               ),
//             ),
//           ),
//         )
//       : el(
//           "p",
//           { class: "mut" },
//           q
//             ? "No patient matches your search."
//             : "No patients yet. Press + New patient.",
//         ),
//   );
// };
// // report card: patient details come from the registration, only the examiner is asked
// const _rep = V.report;
// V.report = function () {
//   const d = _rep(),
//     c = cc();
//   if (!c) return d;
//   const form = [...d.children].find(
//     (x) => x.querySelector && x.querySelector("input[type=date]"),
//   );
//   if (form)
//     d.replaceChild(
//       el(
//         "div",
//         { class: "card row np" },
//         el(
//           "label",
//           {},
//           "Examiner (doctor name) ",
//           el("input", {
//             type: "text",
//             value: c.examiner || "",
//             oninput: (e) => {
//               c.examiner = e.target.value;
//               save();
//               const b = d.querySelector(".sh-info").children[3].lastChild;
//               b.textContent = c.examiner || "-";
//             },
//             onchange: () => pushPatient(c),
//           }),
//         ),
//       ),
//       form,
//     );
//   const info = d.querySelector(".sh-info"),
//     wide = info && info.querySelector(".wide");
//   const mk = (l, v) =>
//     el("div", { class: "sh-cell" }, el("small", {}, l), el("b", {}, v || "-"));
//   if (wide) {
//     [
//       mk("Patient ID", c.pid),
//       mk("Phone", c.phone),
//       mk(
//         "Height / Weight",
//         c.height || c.weight
//           ? (c.height || "-") +
//               " cm / " +
//               (c.weight || "-") +
//               " kg" +
//               (bmi(c) ? " (BMI " + bmi(c) + ")" : "")
//           : "-",
//       ),
//     ].forEach((n) => info.insertBefore(n, wide));
//   }
//   const r = d.querySelector(".sh-r");
//   if (r) r.textContent = "Date: " + new Date().toISOString().slice(0, 10);
//   return d;
// };
// state.cid = CL.some((c) => c.id === localStorage.getItem("cpt_sel"))
//   ? localStorage.getItem("cpt_sel")
//   : null;

// // ---- Patient Record: complete history with before/after ----
// async function loadFull(c) {
//   const x = await api("/patients/" + c.sid + "/full");
//   if (!x || !Array.isArray(x.results)) return false;
//   const loc = (c.history || []).filter((h) => !h.sid),
//     locr = (c.records || []).filter((r) => !r.sid);
//   c.history = x.results
//     .map((h) => ({
//       id: h._id,
//       sid: h._id,
//       ab: h.ab,
//       name: h.name,
//       cat: h.cat,
//       raw: h.raw,
//       max: h.max,
//       label: h.label,
//       rank: h.rank,
//       risk: !!h.risk,
//       scaled: h.scaled || "",
//       notes: h.notes || "",
//       at: h.takenAt,
//     }))
//     .concat(loc);
//   c.records = (x.records || [])
//     .map((r) => ({
//       id: r._id,
//       sid: r._id,
//       kind: r.kind,
//       data: r.data,
//       at: r.takenAt,
//     }))
//     .concat(locr);
//   save();
//   return true;
// }
// const by = (c, k) =>
//   (c.records || [])
//     .filter((r) => r.kind === k)
//     .sort((a, b) => (a.at < b.at ? -1 : 1));
// const dir = (a, b) => (b < a ? "better" : b > a ? "worse" : "same");
// const dirTag = (d) =>
//   el(
//     "span",
//     d === "better"
//       ? { class: "tag ok" }
//       : d === "worse"
//         ? { class: "tag", style: "background:#fde2e2;color:#7f1d1d" }
//         : { class: "tag" },
//     d === "better" ? "Improved" : d === "worse" ? "Worse" : "No change",
//   );
// const LV = { Low: 0, Medium: 1, High: 2 },
//   day = (x) => String(x).slice(0, 10),
//   nm = (t) => t.name.split(" (")[0];
// const tdir = (pts) => {
//   if (pts.length < 2) return null;
//   const a = pts[0],
//     b = pts[pts.length - 1],
//     cfg = SC[a.ab];
//   if (!cfg) return null;
//   const d = b.raw - a.raw;
//   return d === 0 ? "same" : (cfg.low ? d > 0 : d < 0) ? "better" : "worse";
// };
// V.record = function () {
//   const c = cc();
//   if (!c)
//     return el(
//       "div",
//       {},
//       el("h2", {}, "Patient Record"),
//       el("p", { class: "mut" }, "Open a patient from the Patients tab."),
//       el("button", { onclick: () => goTo("patients") }, "Go to Patients"),
//     );
//   if (c.sid && state.fl !== c.id) {
//     state.fl = c.id;
//     loadFull(c).then((ok) => {
//       state.off = !ok;
//       render();
//     });
//   }
//   const H = (c.history || []).slice().sort((a, b) => (a.at < b.at ? -1 : 1)),
//     abs = [...new Set(H.map((h) => h.ab))];
//   const P = by(c, "personality"),
//     S = by(c, "symptoms"),
//     SV = by(c, "survey"),
//     I = by(c, "intake"),
//     last = (a) => a[a.length - 1];
//   const g = [],
//     td = abs.map((a) => tdir(H.filter((h) => h.ab === a))).filter(Boolean);
//   if (td.length) {
//     const b = td.filter((x) => x === "better").length,
//       w = td.filter((x) => x === "worse").length;
//     g.push([
//       "Tests",
//       b +
//         " improved, " +
//         w +
//         " worse, " +
//         (td.length - b - w) +
//         " unchanged (of " +
//         td.length +
//         " repeated tests)",
//       b > w ? "better" : w > b ? "worse" : "same",
//     ]);
//   }
//   if (P.length > 1 && P[0].data.traits.N && last(P).data.traits.N)
//     g.push([
//       "Stress and worry (personality)",
//       P[0].data.traits.N.level + " \u2192 " + last(P).data.traits.N.level,
//       dir(LV[P[0].data.traits.N.level], LV[last(P).data.traits.N.level]),
//     ]);
//   if (S.length > 1)
//     g.push([
//       "Symptoms ticked",
//       S[0].data.symptoms.length + " \u2192 " + last(S).data.symptoms.length,
//       dir(S[0].data.symptoms.length, last(S).data.symptoms.length),
//     ]);
//   if (SV.length > 1)
//     g.push([
//       "Quick survey total",
//       SV[0].data.total + " \u2192 " + last(SV).data.total,
//       dir(SV[0].data.total, last(SV).data.total),
//     ]);
//   if (I.length > 1)
//     g.push([
//       "Intake: Yes answers",
//       I[0].data.yes + " \u2192 " + last(I).data.yes,
//       dir(I[0].data.yes, last(I).data.yes),
//     ]);
//   const del = (r) =>
//     el(
//       "button",
//       {
//         class: "sec np",
//         onclick: async () => {
//           if (!confirm("Delete this record?")) return;
//           if (r.sid) await api("/records/" + r.sid, "DELETE");
//           c.records = c.records.filter((x) => x !== r);
//           save();
//           render();
//         },
//       },
//       "Delete",
//     );
//   const rows = (arr, fmt) =>
//     arr
//       .slice()
//       .reverse()
//       .map((r) =>
//         el(
//           "div",
//           { class: "row" },
//           el("b", {}, day(r.at)),
//           el("span", {}, fmt(r.data)),
//           del(r),
//         ),
//       );
//   const sec = (t, kids, n) =>
//     el(
//       "div",
//       { class: "card" },
//       el("h3", {}, t),
//       n ? kids.flat(Infinity) : el("p", { class: "mut" }, "Nothing saved yet."),
//     );
//   const set = (a, b) => {
//       const z = new Set(b);
//       return a.filter((x) => !z.has(x));
//     },
//     l = (a) => (a.length ? a.join("; ") : "none");
//   const box = el("div");
//   if (H.some((h) => pct(h) != null))
//     box.innerHTML = chart(H, abs, state.hid || {});
//   const leg = el(
//     "div",
//     { class: "row np" },
//     abs
//       .filter((a) => H.some((h) => h.ab === a && pct(h) != null))
//       .map((a) => {
//         const hd = (state.hid || {})[a],
//           cl = tcol(abs, a);
//         return el(
//           "button",
//           {
//             style: hd
//               ? "background:transparent;color:" + cl + ";border-color:" + cl
//               : "background:" + cl + ";border-color:" + cl + ";color:#fff",
//             onclick: () => {
//               (state.hid = state.hid || {})[a] = !hd;
//               render();
//             },
//           },
//           a,
//         );
//       }),
//   );
//   const sl = (r) => r.data.symptoms.map((s) => s.label);
//   return el(
//     "div",
//     {},
//     el("h2", {}, "Patient Record"),
//     el(
//       "div",
//       { class: "row np" },
//       el(
//         "button",
//         { class: "sec", onclick: () => goTo("patients") },
//         "\u2190 All patients",
//       ),
//       el("button", { onclick: () => window.print() }, "Print full record"),
//     ),
//     state.off &&
//       el(
//         "div",
//         { class: "card mut" },
//         "Offline: showing records saved on this device. They upload automatically when the database is reachable.",
//       ),
//     el(
//       "div",
//       { class: "card" },
//       el("h3", {}, c.name),
//       el(
//         "div",
//         { class: "mut" },
//         [
//           c.age && "Age " + c.age,
//           c.sex,
//           c.ref && "Reason: " + c.ref,
//           "Report date " + new Date().toISOString().slice(0, 10),
//         ]
//           .filter(Boolean)
//           .join(" | "),
//       ),
//     ),
//     el(
//       "div",
//       { class: "card" },
//       el("h3", {}, "Progress at a glance (first visit \u2192 latest)"),
//       g.length
//         ? el(
//             "ul",
//             {},
//             g.map(([lb, t, d]) =>
//               el("li", {}, el("b", {}, lb + ": "), t + " ", dirTag(d)),
//             ),
//           )
//         : el(
//             "p",
//             { class: "mut" },
//             "Repeat a test, quiz or checker on another day to see improvement here.",
//           ),
//     ),
//     sec(
//       "Test results",
//       [
//         el(
//           "ul",
//           {},
//           abs.map((a) =>
//             el(
//               "li",
//               {},
//               el("b", {}, a + ": "),
//               trend(H.filter((h) => h.ab === a)),
//             ),
//           ),
//         ),
//         leg,
//         box,
//         H.slice()
//           .reverse()
//           .map((h) =>
//             el(
//               "div",
//               { class: "row" },
//               el("b", {}, day(h.at)),
//               el(
//                 "span",
//                 {},
//                 h.ab +
//                   ": " +
//                   h.raw +
//                   (h.max ? " / " + h.max : "") +
//                   " \u2013 " +
//                   h.label +
//                   (h.risk ? " (RISK FLAG)" : ""),
//               ),
//             ),
//           ),
//       ],
//       H.length,
//     ),
//     sec(
//       "Personality quiz",
//       [
//         rows(P, (d) =>
//           Object.values(d.traits)
//             .map((t) => nm(t) + ": " + t.level)
//             .join(" | "),
//         ),
//         P.length > 1 &&
//           el(
//             "p",
//             { class: "mut" },
//             "Change: " +
//               Object.keys(last(P).data.traits)
//                 .filter((k) => P[0].data.traits[k])
//                 .map(
//                   (k) =>
//                     nm(last(P).data.traits[k]) +
//                     " " +
//                     P[0].data.traits[k].level +
//                     " \u2192 " +
//                     last(P).data.traits[k].level,
//                 )
//                 .join(" | "),
//           ),
//       ],
//       P.length,
//     ),
//     sec(
//       "Symptom checker",
//       [
//         rows(
//           S,
//           (d) =>
//             d.symptoms.length +
//             " symptoms. Likely: " +
//             d.top
//               .slice(0, 3)
//               .map((t) => t.name + " " + t.pct + "%")
//               .join(", "),
//         ),
//         S.length > 1 &&
//           el(
//             "p",
//             { class: "mut" },
//             "Resolved since first visit: " +
//               l(set(sl(S[0]), sl(last(S)))) +
//               ". New: " +
//               l(set(sl(last(S)), sl(S[0]))) +
//               ".",
//           ),
//       ],
//       S.length,
//     ),
//     sec(
//       "Quick survey",
//       [
//         rows(
//           SV,
//           (d) =>
//             "Total " +
//             d.total +
//             " / " +
//             d.max +
//             (d.risk ? " (SAFETY FLAG)" : ""),
//         ),
//         SV.length > 1 &&
//           el(
//             "p",
//             { class: "mut" },
//             "Area scores changed: " +
//               l(
//                 Object.keys(last(SV).data.areas)
//                   .filter(
//                     (k) =>
//                       SV[0].data.areas[k] &&
//                       SV[0].data.areas[k].score !==
//                         last(SV).data.areas[k].score,
//                   )
//                   .map(
//                     (k) =>
//                       k +
//                       " " +
//                       SV[0].data.areas[k].score +
//                       " \u2192 " +
//                       last(SV).data.areas[k].score,
//                   ),
//               ),
//           ),
//       ],
//       SV.length,
//     ),
//     sec(
//       "Intake interview",
//       [
//         rows(
//           I,
//           (d) =>
//             d.answered +
//             "/" +
//             d.total +
//             " answered, " +
//             d.yes +
//             " Yes" +
//             (d.safety ? " (" + d.safety + " safety)" : ""),
//         ),
//         I.length > 1 &&
//           el(
//             "p",
//             { class: "mut" },
//             "Yes answers: " + I[0].data.yes + " \u2192 " + last(I).data.yes,
//           ),
//       ],
//       I.length,
//     ),
//   );
// };
// if (sessionStorage.getItem(TK)) syncAll().then(() => render());
// render();

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
              {},
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
              { class: "row" },
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
if (sessionStorage.getItem(TK)) syncAll().then(() => render());
render();
