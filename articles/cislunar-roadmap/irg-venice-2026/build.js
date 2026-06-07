const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "Todd McCaffrey";
p.title = "Export Momentum, Not Mass";

const W = 13.333, H = 7.5;
// Palette — "Cislunar": deep navy dominant, regolith copper primary accent, guidance cyan secondary
const NAVY = "0E1B2A", NAVY2 = "172A3E";
const DARK = "0E1B2A", DARKPANEL = "18293B";
const INK = "16222E", MUTE = "5C7080", FAINT = "9AAAB6";
const PAPER = "FFFFFF", LIGHT = "F3F6F8", LIGHT2 = "E8EDF1";
const COP = "C97B2C", COP_LT = "E0A85E", COP_DK = "9E5E1C";
const CYAN = "2693A6", CYAN_LT = "5FC3D2";
const RED = "B0413A";

const FH = "Georgia";   // header font
const FB = "Calibri";   // body font

function footer(s, n) {
  s.addText("IRG / IAA · 2nd European Interstellar Symposium · Venice · Dec 2026",
    { x: 0.5, y: 7.04, w: 9.5, h: 0.3, fontFace: FB, fontSize: 9, color: FAINT, align: "left", margin: 0 });
  s.addText(String(n), { x: 12.4, y: 7.04, w: 0.5, h: 0.3, fontFace: FB, fontSize: 9, color: FAINT, align: "right", margin: 0 });
}

// orbital node + trajectory motif (a small arc with two nodes)
function motif(s, x, y, scale, c1, c2) {
  const r = 0.16 * scale;
  s.addShape(p.shapes.OVAL, { x: x, y: y, w: r, h: r, fill: { color: c1 } });
  s.addShape(p.shapes.OVAL, { x: x + 2.4*scale, y: y - 0.5*scale, w: r, h: r, fill: { color: c2 } });
  s.addShape(p.shapes.LINE, { x: x + r*0.6, y: y + r*0.4, w: 2.4*scale, h: -0.5*scale,
    line: { color: c2, width: 1.25, dashType: "dash" } });
}

function kicker(s, text, color) {
  s.addText(text.toUpperCase(), { x: 0.7, y: 0.55, w: 11, h: 0.35, fontFace: FB, fontSize: 12.5,
    color: color, bold: true, charSpacing: 3, margin: 0 });
}
function title(s, text, color) {
  s.addText(text, { x: 0.7, y: 0.92, w: 12, h: 1.0, fontFace: FH, fontSize: 30, color: color, bold: true, margin: 0 });
}

const mkShadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.13 });

/* ============================== SLIDE 1 — TITLE ============================== */
let s = p.addSlide(); s.background = { color: NAVY };
for (let i = 0; i < 5; i++) {
  motif(s, 0.6 + i*0.05, 6.0 + i*0.18, 1.0 + i*0.15, i%2? CYAN : COP, i%2? COP : CYAN);
}
s.addText("EXPORT MOMENTUM,", { x: 0.8, y: 2.0, w: 12, h: 1.0, fontFace: FH, fontSize: 50, color: PAPER, bold: true, margin: 0 });
s.addText([{ text: "NOT ", options: { color: PAPER } }, { text: "MASS", options: { color: COP_LT } }],
  { x: 0.8, y: 2.9, w: 12, h: 1.0, fontFace: FH, fontSize: 50, bold: true, margin: 0 });
s.addText("The lunar mass driver as the keystone of cislunar — and interstellar — logistics",
  { x: 0.82, y: 4.05, w: 11.5, h: 0.5, fontFace: FB, fontSize: 18, color: CYAN_LT, italic: true, margin: 0 });
s.addShape(p.shapes.LINE, { x: 0.85, y: 4.75, w: 3.0, h: 0, line: { color: COP, width: 2 } });
s.addText([
  { text: "Todd McCaffrey", options: { bold: true, color: PAPER, breakLine: true } },
  { text: "FoxxeLabs  ·  drawing on \u201CThe Long Bootstrap\u201D cislunar roadmap", options: { color: FAINT } },
], { x: 0.85, y: 4.95, w: 11, h: 0.8, fontFace: FB, fontSize: 14, margin: 0 });

/* ============================== SLIDE 2 — THESIS ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "The argument in one line", COP);
title(s, "To reach the stars, stop throwing your water away.", INK);
s.addText([
  { text: "Interstellar capability is built on a cislunar industrial base. That base has a first export problem — and the obvious answer is the wrong one.", options: { breakLine: true, color: INK } },
], { x: 0.7, y: 2.0, w: 7.4, h: 1.3, fontFace: FB, fontSize: 17, lineSpacingMultiple: 1.15, margin: 0 });

const claims = [
  ["The wrong export", "Refined lunar water as propellant — sells a stock the Moon can never replace.", RED],
  ["The right export", "Raw momentum — sintered regolith thrown by a solar-powered launcher.", COP],
  ["The real product", "Deterministic delivery across distance — the same primitive interstellar precursors need.", CYAN],
];
let cy = 3.5;
claims.forEach(([h, b, c]) => {
  s.addShape(p.shapes.RECTANGLE, { x: 0.7, y: cy, w: 0.09, h: 0.92, fill: { color: c } });
  s.addText(h, { x: 0.95, y: cy + 0.04, w: 3.0, h: 0.85, fontFace: FH, fontSize: 16, bold: true, color: c, valign: "top", margin: 0 });
  s.addText(b, { x: 4.1, y: cy + 0.02, w: 8.4, h: 0.9, fontFace: FB, fontSize: 14.5, color: INK, valign: "middle", margin: 0 });
  cy += 1.12;
});
footer(s, 2);

/* ============================== SLIDE 3 — THE BRIDGE ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "Why this belongs at an interstellar symposium", CYAN);
title(s, "Cislunar industry is interstellar precursor infrastructure", INK);
s.addText("The technologies that move mass and energy across cislunar space are the same ones a starflight precursor depends on. Get the near-domain primitive right and the far-domain capability inherits it.",
  { x: 0.7, y: 1.95, w: 12, h: 0.9, fontFace: FB, fontSize: 15.5, color: MUTE, lineSpacingMultiple: 1.1, margin: 0 });
const bridge = [
  ["Beamed energy", "Power and momentum delivered over distance — pole-to-crater today, sail-to-star tomorrow."],
  ["Mass streams", "Electromagnetic launch of discrete payloads — the lineage of pellet- and mass-stream propulsion."],
  ["Autonomous rendezvous", "Closed-loop catch of a delivered stream — precision that scales from orbit to the beam-rider."],
];
let bx = 0.7, bw = 3.95, gap = 0.25;
bridge.forEach(([h, b], i) => {
  const x = bx + i*(bw+gap);
  s.addShape(p.shapes.RECTANGLE, { x, y: 3.15, w: bw, h: 3.05, fill: { color: LIGHT }, shadow: mkShadow() });
  s.addShape(p.shapes.RECTANGLE, { x, y: 3.15, w: bw, h: 0.12, fill: { color: i===2?CYAN:i===1?COP:CYAN } });
  s.addShape(p.shapes.OVAL, { x: x+0.35, y: 3.5, w: 0.6, h: 0.6, fill: { color: NAVY } });
  s.addText(String(i+1), { x: x+0.35, y: 3.5, w: 0.6, h: 0.6, align: "center", valign: "middle", fontFace: FH, fontSize: 22, bold: true, color: COP_LT, margin: 0 });
  s.addText(h, { x: x+0.35, y: 4.3, w: bw-0.7, h: 0.7, fontFace: FH, fontSize: 18, bold: true, color: INK, valign: "top", margin: 0 });
  s.addText(b, { x: x+0.35, y: 4.95, w: bw-0.7, h: 1.15, fontFace: FB, fontSize: 13, color: MUTE, valign: "top", lineSpacingMultiple: 1.08, margin: 0 });
});
footer(s, 3);

/* ============================== SLIDE 4 — STOCK VS FLOW ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "The Layer 1 question", COP);
title(s, "What should the Moon export first?", INK);
s.addText("Every viable first export must be cheap to source, valuable downstream, and shallow in the gravity well. The decisive split is not chemistry — it is stock versus flow.",
  { x: 0.7, y: 1.95, w: 12, h: 0.85, fontFace: FB, fontSize: 15.5, color: MUTE, lineSpacingMultiple: 1.1, margin: 0 });
function col(x, head, headC, rows, bg) {
  s.addShape(p.shapes.RECTANGLE, { x, y: 3.1, w: 5.9, h: 3.4, fill: { color: bg }, shadow: mkShadow() });
  s.addShape(p.shapes.RECTANGLE, { x, y: 3.1, w: 5.9, h: 0.7, fill: { color: headC } });
  s.addText(head, { x: x+0.3, y: 3.1, w: 5.3, h: 0.7, fontFace: FH, fontSize: 19, bold: true, color: PAPER, valign: "middle", margin: 0 });
  let ry = 4.0;
  rows.forEach(r => {
    s.addText([{ text: "—  ", options: { color: headC, bold: true } }, { text: r, options: { color: INK } }],
      { x: x+0.3, y: ry, w: 5.35, h: 0.62, fontFace: FB, fontSize: 13.5, valign: "top", margin: 0, lineSpacingMultiple: 1.02 });
    ry += 0.62;
  });
}
col(0.7, "STOCK  —  polar water", RED, [
  "Finite, unproven, locked in 40 K shadow",
  "Also drinking water, oxygen, shielding, crops",
  "Exporting it drains the colony that uses it",
  "Reserve is inferred, not measured",
], "FBEDEA");
col(6.75, "FLOW  —  regolith", COP, [
  "Effectively infinite, equatorial, no prospecting",
  "Zero life-support option value",
  "Throwable as inert sintered mass",
  "Sourced anywhere the lander sits",
], "FBF1E6");
footer(s, 4);

/* ============================== SLIDE 5 — HEINLEIN / TANSTAAFL ============================== */
s = p.addSlide(); s.background = { color: NAVY };
kicker(s, "The failure mode Heinlein named", COP_LT);
s.addText("Exporting water is catabolism", { x: 0.7, y: 0.92, w: 12, h: 1.0, fontFace: FH, fontSize: 30, color: PAPER, bold: true, margin: 0 });
s.addText("\u201CThe Moon Is a Harsh Mistress\u201D: Luna ships grain — water in disguise — down a one-way well. The colony eats its own hydrosphere and books the drawdown as income.",
  { x: 0.7, y: 2.05, w: 7.2, h: 1.4, fontFace: FB, fontSize: 16, color: CYAN_LT, italic: true, lineSpacingMultiple: 1.18, margin: 0 });
s.addText([
  { text: "The gravity asymmetry that makes the propellant business profitable is the same asymmetry that makes the draining cheap and the refill impossible.", options: { breakLine: true, color: PAPER } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "Profitable catabolism is still catabolism. A market closing is not the same as a resource being sustainable.", options: { color: FAINT } },
], { x: 0.7, y: 3.6, w: 7.2, h: 2.2, fontFace: FB, fontSize: 15, lineSpacingMultiple: 1.18, margin: 0 });
s.addShape(p.shapes.RECTANGLE, { x: 8.5, y: 2.2, w: 4.1, h: 3.4, fill: { color: DARKPANEL }, line: { color: COP, width: 1 } });
s.addText("~7", { x: 8.5, y: 2.5, w: 4.1, h: 1.3, align: "center", fontFace: FH, fontSize: 84, bold: true, color: COP_LT, margin: 0 });
s.addText("years to famine", { x: 8.5, y: 3.85, w: 4.1, h: 0.5, align: "center", fontFace: FB, fontSize: 18, bold: true, color: PAPER, margin: 0 });
s.addText("at the export rate the Authority forces in the novel — the bill the balance sheet ignored",
  { x: 8.8, y: 4.4, w: 3.5, h: 1.0, align: "center", fontFace: FB, fontSize: 12.5, color: FAINT, lineSpacingMultiple: 1.1, margin: 0 });
footer(s, 5);

/* ============================== SLIDE 6 — NO PROVEN RESERVES ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "And the reserve does not exist — yet", RED);
title(s, "There are no proven reserves. None.", INK);
s.addText("Mapped onto a JORC/SEC resource classification, lunar polar ice sits at inferred resource at best — closer to exploration target, the tier you cannot attach tonnage to.",
  { x: 0.7, y: 1.95, w: 12, h: 0.85, fontFace: FB, fontSize: 15.5, color: MUTE, lineSpacingMultiple: 1.1, margin: 0 });
const ladder = [
  ["LCROSS, 2009", "One impact into Cabeus: 5.6 \u00B1 2.9 wt% water in the ejecta. A single assay point, error bar nearly as wide as the value."],
  ["Neutron spectrometry", "Lunar Prospector, LRO/LEND: elevated hydrogen in PSRs — depth-integrated, tens-of-km resolution, hydrogen \u2260 water."],
  ["M\u00B3 / SOFIA", "Surface hydration and molecular water at hundreds of ppm. A curiosity, not an orebody."],
  ["Aggregate PSR estimates", "Span orders of magnitude, with unconstrained assumptions on physical form: pore ice vs. slab vs. adsorbed."],
];
let ly = 3.05;
ladder.forEach(([h, b], i) => {
  s.addShape(p.shapes.OVAL, { x: 0.7, y: ly+0.05, w: 0.34, h: 0.34, fill: { color: i<2?COP:CYAN } });
  s.addText(h, { x: 1.25, y: ly, w: 3.3, h: 0.85, fontFace: FH, fontSize: 15, bold: true, color: INK, valign: "top", margin: 0 });
  s.addText(b, { x: 4.7, y: ly, w: 7.9, h: 0.85, fontFace: FB, fontSize: 13.5, color: MUTE, valign: "top", lineSpacingMultiple: 1.05, margin: 0 });
  ly += 0.92;
});
footer(s, 6);

/* ============================== SLIDE 7 — GROUND TRUTH TIMELINE ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "First ground truth", CYAN);
title(s, "No resource-grade data before ~2027", INK);
s.addShape(p.shapes.LINE, { x: 1.0, y: 3.4, w: 11.3, h: 0, line: { color: LIGHT2, width: 3 } });
const tl = [
  ["Jul 2024", "VIPER cancelled", "Cost overruns; the water-hunting rover shelved nearly complete.", MUTE],
  ["Sep 2025", "VIPER revived", "$190M CLPS task order to Blue Origin on Blue Moon MK1.", COP],
  ["2026", "Chang'e-7", "Shackleton rim; a hopping probe meant to enter a PSR.", CYAN],
  ["Late 2027", "VIPER lands", "South pole. The first in-situ assay of polar volatiles.", COP_DK],
];
let tx = 1.0, tw = 2.8;
tl.forEach(([d, h, b, c], i) => {
  const x = tx + i*tw;
  s.addShape(p.shapes.OVAL, { x: x+0.05, y: 3.22, w: 0.36, h: 0.36, fill: { color: c }, line: { color: PAPER, width: 2 } });
  s.addText(d, { x: x-0.1, y: 2.55, w: tw-0.1, h: 0.4, fontFace: FH, fontSize: 16, bold: true, color: c, margin: 0 });
  s.addText(h, { x: x-0.1, y: 3.75, w: tw-0.15, h: 0.4, fontFace: FB, fontSize: 14.5, bold: true, color: INK, margin: 0 });
  s.addText(b, { x: x-0.1, y: 4.2, w: tw-0.2, h: 1.4, fontFace: FB, fontSize: 12.5, color: MUTE, lineSpacingMultiple: 1.08, valign: "top", margin: 0 });
});
s.addText("The bulk-logistics case must stand without this measurement. The propellant residual cannot — which is exactly why the architecture routes around it.",
  { x: 1.0, y: 5.95, w: 11.3, h: 0.7, fontFace: FB, fontSize: 14, italic: true, color: INK, align: "center", margin: 0 });
footer(s, 7);

/* ============================== SLIDE 8 — THROW THE ROCK ============================== */
s = p.addSlide(); s.background = { color: NAVY };
kicker(s, "The reframe", COP_LT);
s.addText("Throw the rock — don't refine it", { x: 0.7, y: 0.92, w: 12, h: 1.0, fontFace: FH, fontSize: 30, color: PAPER, bold: true, margin: 0 });
s.addText("A mass driver is not a rocket: nothing is heated or expelled. Delivery velocity is set by track and current, not exhaust chemistry. The energy is solar. So compare the only two things you can do with a slug of regolith:",
  { x: 0.7, y: 2.0, w: 12, h: 0.9, fontFace: FB, fontSize: 15, color: CYAN_LT, lineSpacingMultiple: 1.12, margin: 0 });
function bigstat(x, num, unit, label, sub, c) {
  s.addShape(p.shapes.RECTANGLE, { x, y: 3.25, w: 5.6, h: 2.75, fill: { color: DARKPANEL }, line: { color: c, width: 1 } });
  s.addText([{ text: num, options: { fontSize: 64, bold: true, color: c } }, { text: " "+unit, options: { fontSize: 22, color: PAPER } }],
    { x: x+0.3, y: 3.5, w: 5.0, h: 1.1, fontFace: FH, valign: "middle", margin: 0 });
  s.addText(label, { x: x+0.32, y: 4.7, w: 5.0, h: 0.45, fontFace: FB, fontSize: 16, bold: true, color: PAPER, margin: 0 });
  s.addText(sub, { x: x+0.32, y: 5.15, w: 5.0, h: 0.7, fontFace: FB, fontSize: 12.5, color: FAINT, lineSpacingMultiple: 1.05, margin: 0 });
}
bigstat(0.7, "2.9", "MJ/kg", "Throw it whole", "Kinetic energy to lunar escape (2.38 km/s). Delivers the entire mass.", COP_LT);
bigstat(7.05, "15", "MJ/kg", "Crack the SiO\u2082", "Bond enthalpy alone — before nozzle losses — for heavy, recondensing exhaust.", RED);
s.addText("Throwing the rock whole is ~5\u00D7 cheaper than merely breaking it — and the ammunition is the surplus, not the stock.",
  { x: 0.7, y: 6.2, w: 12, h: 0.5, fontFace: FB, fontSize: 14, italic: true, color: COP_LT, align: "center", margin: 0 });
footer(s, 8);

/* ============================== SLIDE 9 — O'NEILL ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "The launcher is a solved problem", COP);
title(s, "O'Neill's mass driver — proven, except for the catch", INK);
s.addText("A recirculating linear synchronous motor accelerates a dumb sintered payload and releases it. Bench hardware (Mass Driver I\u2013III, with Kolm at MIT) demonstrated >1000 g by 1980. NASA SP-428 worked the engineering.",
  { x: 0.7, y: 1.95, w: 12, h: 0.95, fontFace: FB, fontSize: 15.5, color: MUTE, lineSpacingMultiple: 1.12, margin: 0 });
s.addShape(p.shapes.RECTANGLE, { x: 0.7, y: 3.15, w: 5.9, h: 3.2, fill: { color: "EAF3F0" }, shadow: mkShadow() });
s.addShape(p.shapes.RECTANGLE, { x: 0.7, y: 3.15, w: 0.12, h: 3.2, fill: { color: CYAN } });
s.addText("SOLVED", { x: 1.0, y: 3.35, w: 5.3, h: 0.5, fontFace: FH, fontSize: 18, bold: true, color: CYAN, margin: 0 });
s.addText([
  { text: "Short track — thousands of g tolerated", options: { bullet: true, breakLine: true } },
  { text: "Linear motor is retired hardware", options: { bullet: true, breakLine: true } },
  { text: "Energy from solar, bucket KE recovered", options: { bullet: true, breakLine: true } },
  { text: "Net cost \u2248 payload KE \u2248 2.9 MJ/kg", options: { bullet: true } },
], { x: 1.0, y: 3.95, w: 5.3, h: 2.3, fontFace: FB, fontSize: 14, color: INK, paraSpaceAfter: 8, margin: 0 });

s.addShape(p.shapes.RECTANGLE, { x: 6.75, y: 3.15, w: 5.85, h: 3.2, fill: { color: "FBEDEA" }, shadow: mkShadow() });
s.addShape(p.shapes.RECTANGLE, { x: 6.75, y: 3.15, w: 0.12, h: 3.2, fill: { color: RED } });
s.addText("NEVER BUILT", { x: 7.05, y: 3.35, w: 5.3, h: 0.5, fontFace: FH, fontSize: 18, bold: true, color: RED, margin: 0 });
s.addText([
  { text: "The catcher at L2 — passive, enormous, lucky", options: { bullet: true, breakLine: true } },
  { text: "Ballistic slug, no correction over 64,000 km", options: { bullet: true, breakLine: true } },
  { text: "Launch dispersion integrates unbounded", options: { bullet: true, breakLine: true } },
  { text: "Died on SPS economics + no cheap heavy lift", options: { bullet: true } },
], { x: 7.05, y: 3.95, w: 5.3, h: 2.3, fontFace: FB, fontSize: 14, color: INK, paraSpaceAfter: 8, margin: 0 });
footer(s, 9);

/* ============================== SLIDE 10 — ONE PROBLEM, THREE COSTUMES ============================== */
s = p.addSlide(); s.background = { color: NAVY };
kicker(s, "The central move", COP_LT);
s.addText("One problem in three costumes", { x: 0.7, y: 0.92, w: 12, h: 1.0, fontFace: FH, fontSize: 30, color: PAPER, bold: true, margin: 0 });
s.addText("Three challenges we treat as separate are the same challenge. Solve it once and all three fall out together.",
  { x: 0.7, y: 2.05, w: 12, h: 0.5, fontFace: FB, fontSize: 16, color: CYAN_LT, margin: 0 });
const costumes = [["Beam pointing", "holding a spot on a target across cislunar distance"],
                  ["Slug dispersion", "placing thrown mass at a node without correction"],
                  ["Depot rendezvous", "closing the last metres onto a moving catcher"]];
let cx = 0.7;
costumes.forEach(([h, b], i) => {
  const x = cx + i*4.05;
  s.addShape(p.shapes.RECTANGLE, { x, y: 2.95, w: 3.75, h: 1.65, fill: { color: DARKPANEL }, line: { color: CYAN, width: 1 } });
  s.addText(h, { x: x+0.25, y: 3.1, w: 3.3, h: 0.5, fontFace: FH, fontSize: 17, bold: true, color: PAPER, margin: 0 });
  s.addText(b, { x: x+0.25, y: 3.62, w: 3.3, h: 0.9, fontFace: FB, fontSize: 12.5, color: FAINT, lineSpacingMultiple: 1.05, valign: "top", margin: 0 });
  if (i < 2) s.addText("=", { x: x+3.75, y: 3.1, w: 0.3, h: 1.3, align: "center", valign: "middle", fontFace: FH, fontSize: 28, bold: true, color: COP_LT, margin: 0 });
});
s.addShape(p.shapes.RECTANGLE, { x: 0.7, y: 5.1, w: 11.9, h: 1.2, fill: { color: COP } });
s.addText("Deterministic delivery of mass or energy across cislunar distance",
  { x: 0.9, y: 5.1, w: 11.5, h: 1.2, align: "center", valign: "middle", fontFace: FH, fontSize: 23, bold: true, color: NAVY, margin: 0 });
footer(s, 10);

/* ============================== SLIDE 11 — WHY NOW ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "The unlock O'Neill didn't have", CYAN);
title(s, "The catch was hard because it had to be open-loop", INK);
s.addText("In 1977, guidance that could ride a thousand-g projectile didn't exist at any mass, cost, or radiation budget that closed. That single constraint is now the most thoroughly retired risk in spaceflight.",
  { x: 0.7, y: 1.95, w: 12, h: 0.9, fontFace: FB, fontSize: 15.5, color: MUTE, lineSpacingMultiple: 1.12, margin: 0 });
const unlocks = [
  ["Cheap autonomous GNC", "Cubesat-class avionics — grams and dollars."],
  ["Optical + radar tracking", "Terminal sensing of a cooperative target is routine."],
  ["Propulsive terminal guidance", "The closed loop that made rocket landing \u201CTuesday.\u201D"],
  ["Autonomous rendezvous & docking", "Flown operationally, repeatedly, for years."],
];
let ux = 0.7, uw = 5.9;
unlocks.forEach(([h, b], i) => {
  const x = ux + (i%2)*(uw+0.25), y = 3.15 + Math.floor(i/2)*1.6;
  s.addShape(p.shapes.RECTANGLE, { x, y, w: uw, h: 1.42, fill: { color: LIGHT }, shadow: mkShadow() });
  s.addShape(p.shapes.OVAL, { x: x+0.28, y: y+0.45, w: 0.5, h: 0.5, fill: { color: CYAN } });
  s.addText("\u2713", { x: x+0.28, y: y+0.45, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: FB, fontSize: 20, bold: true, color: PAPER, margin: 0 });
  s.addText(h, { x: x+1.0, y: y+0.18, w: uw-1.2, h: 0.5, fontFace: FH, fontSize: 16, bold: true, color: INK, margin: 0 });
  s.addText(b, { x: x+1.0, y: y+0.7, w: uw-1.2, h: 0.6, fontFace: FB, fontSize: 13, color: MUTE, margin: 0 });
});
footer(s, 11);

/* ============================== SLIDE 12 — ARCHITECTURE: THREE MOVES ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "Architecture", COP);
title(s, "Three moves turn the unsolved problem into solved ones", INK);
const moves = [
  ["01", "Guided freighters, not guided pellets", "One minimal GNC unit per N-tonne round — trim thruster, transponder, retroreflector. Payload stays dumb and cheap; guidance amortises over the mass.", COP],
  ["02", "Catch sub-escape, in lunar orbit", "Throw ~1.7\u20131.8 km/s into a low catch orbit, not ballistic to L2. Cuts velocity, range and integration time; ferry to L1/L4/L5 with a solar-electric tug.", CYAN],
  ["03", "An active, autonomous catcher", "Wide aperture, optical + transponder tracking, delta-v to null the residual. The freighter closes most of the gap; the catcher closes the last metres.", COP_DK],
];
let mx = 0.7, mw = 3.95;
moves.forEach(([n, h, b, c], i) => {
  const x = mx + i*(mw+0.25);
  s.addShape(p.shapes.RECTANGLE, { x, y: 2.95, w: mw, h: 3.5, fill: { color: NAVY }, shadow: mkShadow() });
  s.addText(n, { x: x+0.3, y: 3.15, w: mw-0.6, h: 0.8, fontFace: FH, fontSize: 40, bold: true, color: c, margin: 0 });
  s.addShape(p.shapes.LINE, { x: x+0.32, y: 4.0, w: 1.0, h: 0, line: { color: c, width: 2 } });
  s.addText(h, { x: x+0.3, y: 4.15, w: mw-0.6, h: 0.95, fontFace: FH, fontSize: 16.5, bold: true, color: PAPER, valign: "top", margin: 0 });
  s.addText(b, { x: x+0.3, y: 5.15, w: mw-0.6, h: 1.2, fontFace: FB, fontSize: 12.5, color: FAINT, lineSpacingMultiple: 1.08, valign: "top", margin: 0 });
});
footer(s, 12);

/* ============================== SLIDE 13 — THE KEYSTONE + PHASING ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "What to build first", COP);
title(s, "The keystone: a closed-loop delivery-and-catch demo", INK);
s.addText("A guided freighter and an autonomous catcher demonstrating deterministic mass transfer across a meaningful gap — cubesat scale, LEO then LLO. A few hundred kg of smallsat and a good GNC team. The guidance layer is the real product.",
  { x: 0.7, y: 2.15, w: 12, h: 0.95, fontFace: FB, fontSize: 15, color: MUTE, lineSpacingMultiple: 1.1, margin: 0 });
const hcell = (t) => ({ text: t, options: { bold: true, color: PAPER, fill: { color: NAVY }, fontFace: FH, fontSize: 14 } });
const pcell = (t) => ({ text: t, options: { bold: true, color: COP_DK, fill: { color: LIGHT2 }, fontFace: FB, fontSize: 13 } });
const bcell = (t, alt) => ({ text: t, options: { color: INK, fill: { color: alt ? LIGHT : PAPER } } });
const rows = [
  [hcell("Phase"), hcell("Objective"), hcell("Retires")],
  [pcell("0 — Bench"), bcell("Sintered-simulant round; thermal + structural cycling; GNC integration", false), bcell("Round survivability — the one undemonstrated risk", false)],
  [pcell("1 — LEO loop"), bcell("Freighter released; active catcher acquires, tracks, nulls, captures", true), bcell("The core capability: deterministic cooperative catch", true)],
  [pcell("2 — LEO stream"), bcell("Multiple freighters; cadence, thermal load, accumulation logic", false), bcell("Throughput, queueing, catcher saturation", false)],
  [pcell("3 — LLO"), bcell("Repeat in lunar orbit; sub-escape geometry; tug hand-off", true), bcell("The operational environment + ferry integration", true)],
];
s.addTable(rows, {
  x: 0.7, y: 3.35, w: 11.9, colW: [2.4, 5.3, 4.2],
  border: { type: "solid", pt: 0.5, color: "D5DDE3" },
  fontFace: FB, fontSize: 12.5, valign: "middle",
  rowH: [0.5, 0.72, 0.72, 0.72, 0.72],
  margin: [3, 8, 3, 8],
});
footer(s, 13);

/* ============================== SLIDE 14 — INTERSTELLAR PAYOFF ============================== */
s = p.addSlide(); s.background = { color: NAVY };
kicker(s, "Why it matters here", COP_LT);
s.addText("The keystone scales to the stars", { x: 0.7, y: 0.92, w: 12, h: 1.0, fontFace: FH, fontSize: 30, color: PAPER, bold: true, margin: 0 });
s.addText("Solve deterministic delivery across cislunar distance and the capability does not stay cislunar. It is the precursor primitive under every beamed-propulsion architecture this room studies.",
  { x: 0.7, y: 2.05, w: 12, h: 0.9, fontFace: FB, fontSize: 16, color: CYAN_LT, lineSpacingMultiple: 1.12, margin: 0 });
const scale = [
  ["Cislunar", "Catch a guided regolith stream in lunar orbit.", COP_LT],
  ["Beam-rider", "Hold a beam on a sail across AU — the same pointing problem, longer arm.", CYAN_LT],
  ["Mass / pellet stream", "Deliver discrete momentum to a departing craft — the mass driver's direct descendant.", COP_LT],
];
let sx2 = 0.7;
scale.forEach(([h, b, c], i) => {
  const x = sx2 + i*4.05;
  s.addShape(p.shapes.OVAL, { x: x+1.55, y: 3.25, w: 0.65, h: 0.65, fill: { color: c } });
  s.addText(String(i+1), { x: x+1.55, y: 3.25, w: 0.65, h: 0.65, align: "center", valign: "middle", fontFace: FH, fontSize: 24, bold: true, color: NAVY, margin: 0 });
  if (i < 2) s.addShape(p.shapes.LINE, { x: x+2.25, y: 3.57, w: 1.75, h: 0, line: { color: FAINT, width: 1.5, dashType: "dash" } });
  s.addText(h, { x: x, y: 4.1, w: 3.75, h: 0.5, align: "center", fontFace: FH, fontSize: 18, bold: true, color: PAPER, margin: 0 });
  s.addText(b, { x: x+0.15, y: 4.65, w: 3.5, h: 1.4, align: "center", fontFace: FB, fontSize: 13, color: FAINT, lineSpacingMultiple: 1.1, valign: "top", margin: 0 });
});
footer(s, 14);

/* ============================== SLIDE 15 — RISKS & DUAL-USE ============================== */
s = p.addSlide(); s.background = { color: PAPER };
kicker(s, "Stated plainly", RED);
title(s, "Open risks — and the one that isn't only engineering", INK);
const risks = [
  ["Round survivability", "Thermal + structural integrity of a sintered round over a multi-day transit is unproven, even on a bench. Phase 0 exists for this.", COP],
  ["Catcher saturation", "It's a stream, not a shot. Delta-v budget, aperture and thermal load under cadence gate throughput.", COP],
  ["Propellant exposure", "The residual market still rides the unmeasured polar reserve. The architecture shrinks that exposure; it doesn't erase it.", COP],
];
let ry2 = 2.95;
risks.forEach(([h, b, c]) => {
  s.addShape(p.shapes.RECTANGLE, { x: 0.7, y: ry2, w: 0.09, h: 0.92, fill: { color: c } });
  s.addText(h, { x: 0.95, y: ry2, w: 3.0, h: 0.9, fontFace: FH, fontSize: 15.5, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(b, { x: 4.0, y: ry2, w: 8.6, h: 0.9, fontFace: FB, fontSize: 13.5, color: MUTE, valign: "middle", lineSpacingMultiple: 1.05, margin: 0 });
  ry2 += 1.0;
});
s.addShape(p.shapes.RECTANGLE, { x: 0.7, y: ry2+0.05, w: 11.9, h: 1.35, fill: { color: "FBEDEA" }, line: { color: RED, width: 1 } });
s.addText([
  { text: "Dual-use is intrinsic.  ", options: { bold: true, color: RED } },
  { text: "A system that deterministically places tonnes at a chosen cislunar point is, by construction, a precision kinetic delivery system. The catch problem and the targeting problem are one problem. Governance rides alongside the engineering from Phase 0 — cooperative-only catch, transparent trajectories. The logistics are open; the targeting is not.", options: { color: INK } },
], { x: 0.95, y: ry2+0.2, w: 11.4, h: 1.05, fontFace: FB, fontSize: 13, lineSpacingMultiple: 1.1, valign: "middle", margin: 0 });
footer(s, 15);

/* ============================== SLIDE 16 — CLOSING ============================== */
s = p.addSlide(); s.background = { color: NAVY };
for (let i = 0; i < 4; i++) motif(s, 9.6 + i*0.04, 0.7 + i*0.16, 1.1 + i*0.12, i%2? CYAN : COP, i%2? COP : CYAN);
s.addText("Export momentum,", { x: 0.8, y: 2.2, w: 12, h: 0.9, fontFace: FH, fontSize: 44, bold: true, color: PAPER, margin: 0 });
s.addText([{ text: "not ", options: { color: PAPER } }, { text: "mass.", options: { color: COP_LT } }],
  { x: 0.8, y: 3.05, w: 12, h: 0.9, fontFace: FH, fontSize: 44, bold: true, margin: 0 });
s.addText("Throw the surplus, not the stock. Build the closed-loop delivery-and-catch demonstrator first — it's the one blank O'Neill had to leave, and the one now within reach.",
  { x: 0.82, y: 4.15, w: 10.5, h: 1.0, fontFace: FB, fontSize: 17, italic: true, color: CYAN_LT, lineSpacingMultiple: 1.15, margin: 0 });
s.addShape(p.shapes.RECTANGLE, { x: 0.85, y: 5.4, w: 11.6, h: 0.95, fill: { color: DARKPANEL }, line: { color: COP, width: 1 } });
s.addText([
  { text: "The ask:  ", options: { bold: true, color: COP_LT } },
  { text: "scope Phase 0 — fabricate a sintered round and prove it survives the trip. Everything else stands on that one bench test.", options: { color: PAPER } },
], { x: 1.1, y: 5.4, w: 11.1, h: 0.95, fontFace: FB, fontSize: 14.5, valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
s.addText("Todd McCaffrey  ·  FoxxeLabs  ·  IRG / IAA 2nd European Interstellar Symposium, Venice 2026",
  { x: 0.85, y: 6.7, w: 11.6, h: 0.4, fontFace: FB, fontSize: 11, color: FAINT, margin: 0 });

p.writeFile({ fileName: "irg-venice-mass-driver.pptx" }).then(f => console.log("WROTE", f));
