/* Real-world wiring drawings for the handbook: lighting, heat pumps, solar PV, inverters/batteries, metering.
   Same look as the heating drawings (bf-heat.js): parts drawn as they look, every core from terminal to terminal,
   tap a part to show only its wires, and a "which colour goes where" list. Lighting and metering can switch
   between current (brown/blue) and pre-2004 (red/black) colours. Everything here is generic: always follow the
   maker's instructions and the terminal labels on the kit in front of you. */
(function(){
const NEWC = { L:["#7B4A2A","brown"], N:["#1F5FBF","blue"], E:["ge","green/yellow"], Lc:["#7B4A2A","brown"],
  SL:["#1F5FBF","blue, sleeved brown","#7B4A2A"], C1:["#7B4A2A","brown"], C2:["#1B1F24","black"], C3:["#8C939C","grey"],
  FL:["#7B4A2A","brown (flex)"], FN:["#1F5FBF","blue (flex)"], DCP:["#C62828","red – PV +"], DCN:["#1B1F24","black – PV −"],
  BP:["#C62828","red – battery +"], BN:["#1B1F24","black – battery −"], CT:["#5E6673","CT lead"], CA:["#FFFFFF","comms core A"], CB:["#8C939C","comms core B"] };
const OLDC = Object.assign({}, NEWC, { L:["#C62828","red"], N:["#1B1F24","black"], Lc:["#C62828","red"],
  SL:["#1B1F24","black, sleeved red","#C62828"], C1:["#C62828","red"], C2:["#F2C12E","yellow"], C3:["#1F5FBF","blue"] });
const DIR = { top:[0,-1], bottom:[0,1], left:[-1,0], right:[1,0] };
const screw = (x, y) => `<circle cx="${x}" cy="${y}" r="8.5" fill="#D4B45A" stroke="#7A6320" stroke-width="1.5"/><path d="M${x - 5} ${y + 3} L${x + 5} ${y - 3}" stroke="#6B5518" stroke-width="2"/>`;
const T = (x, y, s, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || "middle"}" font-size="${(o && o.fs) || 12}" font-weight="${(o && o.fw) || 800}" fill="${(o && o.fill) || "#101820"}">${s}</text>`;

// decoration per kind of part (inside its box)
function deco(p){
  const {x, y, w, h} = p, cx = x + w / 2, cy = y + h / 2;
  switch (p.kind){
    case "cable": return `<rect x="${x + 14}" y="${y + 16}" width="${w - 28}" height="22" rx="11" fill="#E4E7EC" stroke="#8993A1"/>${T(cx, y + 31, p.sub || "T&E cable", {fs:11, fw:700})}`;
    case "rose": return `<circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) / 2 - 6}" fill="#FAFBFC" stroke="#8993A1" stroke-width="2"/>`;
    case "jb": return `<circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) / 2 - 4}" fill="#FAFBFC" stroke="#8993A1" stroke-width="2"/>`;
    case "bbox": return `<rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="8" fill="none" stroke="#8993A1" stroke-dasharray="6 5"/><rect x="${x + w - 70}" y="${y + h - 62}" width="44" height="44" rx="6" fill="#FAFBFC" stroke="#8993A1"/><rect x="${x + w - 56}" y="${y + h - 54}" width="16" height="28" rx="3" fill="#E4E7EC" stroke="#8993A1"/>`;
    case "sw": return `<rect x="${cx - 26}" y="${y + 18}" width="52" height="52" rx="8" fill="#FAFBFC" stroke="#8993A1" stroke-width="2"/><rect x="${cx - 9}" y="${y + 28}" width="18" height="32" rx="4" fill="#E4E7EC" stroke="#8993A1"/>`;
    case "lamp": return `<path d="M${cx - 18} ${y + 60} Q${cx} ${y + 150} ${cx + 18} ${y + 60} Z" fill="#FFF3C4" stroke="#C9A43A"/><circle cx="${cx}" cy="${y + 100}" r="26" fill="#FFF3C4" stroke="#C9A43A" stroke-width="2"/>`;
    case "fitting": return `<rect x="${x + 14}" y="${y + (p.barTop ? 16 : h - 40)}" width="${w - 28}" height="24" rx="12" fill="#FFF3C4" stroke="#C9A43A"/>`;
    case "cu": return (p.ways || []).map((wy, i) => `<rect x="${x + 16 + i * ((w - 32) / p.ways.length)}" y="${y + (p.waysY || 20)}" width="${(w - 32) / p.ways.length - 8}" height="46" rx="4" fill="#FAFBFC" stroke="#8993A1"/>${T(x + 16 + i * ((w - 32) / p.ways.length) + ((w - 32) / p.ways.length - 8) / 2, y + (p.waysY || 20) + 20, wy[0], {fs:11})}${T(x + 16 + i * ((w - 32) / p.ways.length) + ((w - 32) / p.ways.length - 8) / 2, y + (p.waysY || 20) + 36, wy[1], {fs:10, fw:600})}`).join("");
    case "iso": return `<circle cx="${cx}" cy="${cy}" r="22" fill="#F5C518" stroke="#8A6D00" stroke-width="2"/><rect x="${cx - 26}" y="${cy - 6}" width="52" height="12" rx="4" fill="#C62828"/>`;
    case "hp": return `<circle cx="${x + w * 0.38}" cy="${cy + 8}" r="${h * 0.3}" fill="#DDE2E8" stroke="#8993A1" stroke-width="2"/>${[0, 1, 2, 3].map(i => `<line x1="${x + w * 0.38 - h * 0.3}" y1="${cy + 8 - h * 0.2 + i * h * 0.13}" x2="${x + w * 0.38 + h * 0.3}" y2="${cy + 8 - h * 0.2 + i * h * 0.13}" stroke="#8993A1"/>`).join("")}`;
    case "ctrl": return `<rect x="${cx - 36}" y="${y + 18}" width="72" height="38" rx="5" fill="#0F2B45"/><text x="${cx}" y="${y + 42}" text-anchor="middle" font-size="13" font-weight="800" fill="#38D6FF">21.0°</text>`;
    case "imm": return `<rect x="${cx - 30}" y="${y + 14}" width="60" height="${h - 60}" rx="26" fill="#E4E7EC" stroke="#8993A1" stroke-width="2"/>`;
    case "pv": return [0, 1, 2].map(i => `<rect x="${x + 14 + i * ((w - 28) / 3)}" y="${y + 14}" width="${(w - 28) / 3 - 8}" height="${h - 60}" fill="#1D3B6A" stroke="#9FB4D6"/><path d="M${x + 14 + i * ((w - 28) / 3)} ${y + 14 + (h - 60) / 2} h${(w - 28) / 3 - 8}" stroke="#9FB4D6"/>`).join("");
    case "inv": return `<rect x="${cx - 40}" y="${cy - 15}" width="80" height="30" rx="4" fill="#0F2B45"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="#3BE08A">3.6 kW</text>`;
    case "batt": return `<rect x="${x + 20}" y="${y + 18}" width="${w - 40}" height="${h - 64}" rx="8" fill="#E4E7EC" stroke="#8993A1"/><rect x="${x + 34}" y="${y + 30}" width="${(w - 68) * 0.7}" height="14" rx="3" fill="#3BE08A"/>`;
    case "meter": return `<rect x="${cx - 44}" y="${y + (p.dispY || 18)}" width="88" height="30" rx="4" fill="#DCE7D4" stroke="#6B7A5E"/><text x="${cx}" y="${y + (p.dispY || 18) + 20}" text-anchor="middle" font-size="13" font-weight="800" fill="#223">012345.6</text>`;
    case "cutout": return `<rect x="${cx - 22}" y="${y + 16}" width="44" height="${h - 64}" rx="6" fill="#3A3F47"/><rect x="${cx - 12}" y="${y + 26}" width="24" height="${h - 84}" rx="3" fill="#C9CED6"/>${T(cx, y + h / 2 - 2, "FUSE", {fs:9, fill:"#222"})}`;
    case "ct": return `<circle cx="${cx}" cy="${cy - 6}" r="18" fill="none" stroke="#2B2F36" stroke-width="8"/><line x1="${x + 10}" y1="${cy - 6}" x2="${x + w - 10}" y2="${cy - 6}" stroke="#7B4A2A" stroke-width="7"/>`;
    case "pipe": return `<rect x="${x + 14}" y="${cy - 8}" width="${w - 28}" height="16" rx="8" fill="${p.pipe || "#C87F3A"}"/><rect x="${cx - 12}" y="${cy - 12}" width="24" height="24" rx="3" fill="#C9CED6" stroke="#5B6573"/>`;
    case "bar": return `<rect x="${x + 16}" y="${cy - 6}" width="${w - 32}" height="12" rx="3" fill="#C8A04A" stroke="#7A6320"/>`;
    default: return "";
  }
}
function partLayers(id, p){
  const body = `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="12" fill="${p.fill || "#F4F5F7"}" stroke="#5B6573" stroke-width="2"/>` + deco(p);
  let terms = "";
  (p.terms || []).forEach(([tid, tx, ty, side, label]) => {
    const X = p.x + tx, Y = p.y + ty, [dx, dy] = DIR[side], lab = label === undefined ? tid : label;
    terms += screw(X, Y);
    if (lab){ const lx = X - dx * 22, ly = Y - dy * 22 + 4, tw = String(lab).length * 6.6 + 8; terms += `<rect x="${lx - tw / 2}" y="${ly - 12}" width="${tw}" height="16" rx="4" fill="#FFFFFF" fill-opacity=".9"/>` + T(lx, ly, lab, {fs:11.5}); }
  });
  const ny = p.labelBelow ? p.y + p.h + 18 : p.y - 8, nw = p.name.length * 7.4 + 14;
  const name = `<rect x="${p.x + p.w / 2 - nw / 2}" y="${ny - 15}" width="${nw}" height="20" rx="5" fill="#FFFFFF" stroke="#8993A1"/>` + T(p.x + p.w / 2, ny, p.name, {fs:13.5});
  const g = s => `<g class="wdev" data-act="dSel" data-dev="${id}">${s}</g>`;
  return { body: g(body), top: g(terms + name) };
}
function tpos(p, tid){ const t = p.terms.find(t => t[0] === tid); if (!t) throw new Error("no terminal " + tid); return [p.x + t[1], p.y + t[2], t[3]]; }
function cubicLen(a, b, c, d){ let L = 0, px = a[0], py = a[1]; for (let i = 1; i <= 24; i++){ const t = i / 24, u = 1 - t; const x = u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0], y = u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1]; L += Math.hypot(x - px, y - py); px = x; py = y; } return L; }
function wireSvg(D, wdef, pal, on){
  const [pa, ta, pb, tb, role] = wdef, A = tpos(D.parts[pa], ta), B = tpos(D.parts[pb], tb);
  const d = Math.hypot(B[0] - A[0], B[1] - A[1]), k = Math.max(36, Math.min(150, d / 2.4));
  const a = [A[0], A[1]], b = [A[0] + DIR[A[2]][0] * k, A[1] + DIR[A[2]][1] * k], c = [B[0] + DIR[B[2]][0] * k, B[1] + DIR[B[2]][1] * k], e = [B[0], B[1]];
  const path = `M${a} C${b} ${c} ${e}`, col = pal[role], sw = on ? 4.5 : 3;
  let s = `<path d="${path}" fill="none" stroke="#1A1D22" stroke-width="${sw + 2.5}" stroke-linecap="round"/>`;
  if (col[0] === "ge") s += `<path d="${path}" fill="none" stroke="#3E9B3E" stroke-width="${sw}" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#F2D12E" stroke-width="${sw}" stroke-dasharray="7 7"/>`;
  else s += `<path d="${path}" fill="none" stroke="${col[0]}" stroke-width="${sw}" stroke-linecap="round"/>`;
  if (col[2]){ const L = cubicLen(a, b, c, e); s += `<path d="${path}" fill="none" stroke="${col[2]}" stroke-width="${sw + 1}" stroke-dasharray="22 ${Math.max(1, L - 44)} 22"/>`; }   // sleeve at both ends
  return s;
}
function diagSvg(id, sel, old){
  const D = DIAGS[id], pal = old && D.colours ? OLDC : NEWC;
  let dim = "", lit = "";
  D.wires.forEach(wd => { const on = !sel || wd[0] === sel || wd[2] === sel; const s = wireSvg(D, wd, pal, on); if (sel && on) lit += s; else dim += `<g opacity="${on ? 1 : 0.12}">${s}</g>`; });
  const L = Object.entries(D.parts).map(([k, p]) => partLayers(k, p));
  return `<svg viewBox="0 0 720 ${D.h}" role="img" aria-label="${D.title}" font-family="Barlow, Arial, sans-serif"><rect width="720" height="${D.h}" rx="14" fill="#E9EDF2"/>${L.map(l => l.body).join("")}${dim}${lit}${L.map(l => l.top).join("")}</svg>`;
}
function diagList(id, sel, old){
  const D = DIAGS[id], pal = old && D.colours ? OLDC : NEWC;
  return Object.entries(D.parts).filter(([k]) => (!sel || sel === k) && D.wires.some(w => w[0] === k || w[2] === k)).map(([k, p]) => {
    const rows = D.wires.filter(w => w[0] === k || w[2] === k).map(w => {
      const mine = w[0] === k, myT = mine ? w[1] : w[3], other = mine ? w[2] : w[0], oT = mine ? w[3] : w[1], col = pal[w[4]];
      const swch = col[0] === "ge" ? `<span class="wsw ge"></span>` : `<span class="wsw" style="--w:${col[0]}${col[2] ? `;box-shadow:inset 0 -4px 0 ${col[2]}` : ""}"></span>`;
      const lab = (p.terms.find(t => t[0] === myT) || [])[4] ?? myT, olab = (D.parts[other].terms.find(t => t[0] === oT) || [])[4] ?? oT;
      return `<div class="wrow"><div><b>${lab}</b> ${swch}${col[1]} <span class="arr">→</span> <b>${D.parts[other].short || D.parts[other].name}: ${olab}</b></div>${w[5] ? `<div class="small muted">${w[5]}</div>` : ""}</div>`;
    }).join("");
    return `<div class="wlist${sel === k ? " on" : ""}"><h4>${p.name}</h4>${rows}</div>`;
  }).join("");
}
window.BF_DIAG = function(id, st){
  const D = DIAGS[id]; if (!D) return "";
  st = st || {}; let sel = (st.sel || {})[id] || null; if (sel && !D.parts[sel]) sel = null;
  const old = !!st.old && !!D.colours, zoom = !!(st.zoom || {})[id];
  const chips = `<div class="chips wchips"><button class="chip small" data-act="dSel" data-d="${id}" data-dev="" aria-pressed="${!sel}">Everything</button>${Object.entries(D.parts).filter(([k]) => D.wires.some(w => w[0] === k || w[2] === k)).map(([k, p]) => `<button class="chip small" data-act="dSel" data-d="${id}" data-dev="${k}" aria-pressed="${sel === k}">${p.short || p.name}</button>`).join("")}</div>`;
  const colChips = D.colours ? `<div class="chips"><button class="chip small" data-act="dOld" data-v="" aria-pressed="${!old}">Current colours (brown/blue)</button><button class="chip small" data-act="dOld" data-v="1" aria-pressed="${old}">Old colours (red/black, pre-2004)</button></div>` : "";
  return `<div class="wreal" data-diag="${id}"><h3 class="wh">${D.title}</h3>${D.intro ? `<p>${D.intro}</p>` : ""}${colChips}${chips}<div class="wpic${zoom ? " zoom" : ""}">${diagSvg(id, sel, old)}</div>
    <div class="row"><button class="btn ghost sm" data-act="dZoom" data-d="${id}">${zoom ? "Fit to screen" : "Enlarge to zoom"}</button><span class="small muted">Tap a part to show only its wires.</span></div>
    ${D.note ? `<p class="small muted">${D.note}</p>` : ""}
    <details class="more"><summary>Which colour goes where</summary><div>${diagList(id, sel, old)}</div></details></div>`;
};

/* ------------------------------------------------------------------ the drawings
   parts: { id: {name, short?, kind, x, y, w, h, terms:[[id, x, y, side, label?]]} }  (terminal x/y relative to the part)
   wires: [partA, termA, partB, termB, role, what it does] */
const supply = (x, y, name, sub) => ({ name, short:"Supply in", kind:"cable", sub, x, y, w:170, h:96, terms:[["L", 40, 74, "bottom"], ["N", 85, 74, "bottom"], ["E", 130, 74, "bottom"]] });
const onward = (x, y) => ({ name:"On to next light", short:"Next light", kind:"cable", sub:"T&E out", x, y, w:170, h:96, terms:[["L", 40, 74, "bottom"], ["N", 85, 74, "bottom"], ["E", 130, 74, "bottom"]] });
const rose = (x, y) => ({ name:"Ceiling rose (loop-in)", short:"Ceiling rose", kind:"rose", x, y, w:250, h:170, terms:[["Loop", 50, 42, "top", "L loop"], ["N", 105, 42, "top"], ["SL", 160, 42, "top"], ["E", 210, 42, "top"], ["fSL", 160, 128, "bottom", "SL"], ["fN", 105, 128, "bottom", "N"]] });
const lamp = (x, y) => ({ name:"Lamp holder", kind:"lamp", x, y, w:110, h:150, labelBelow:true, terms:[["L", 35, 26, "top"], ["N", 75, 26, "top"]] });
const sw1 = (x, y, name) => ({ name: name || "One-way switch", short:"Switch", kind:"sw", x, y, w:170, h:150, labelBelow:true, terms:[["COM", 40, 112, "top"], ["L1", 90, 112, "top"], ["E", 140, 112, "top"]] });
const sw2 = (x, y, name, conn) => ({ name, short: name.replace(" two-way switch", ""), kind:"sw", x, y, w:220, h:150, labelBelow:true, terms:[["COM", 36, 112, "top"], ["L1", 80, 112, "top"], ["L2", 124, 112, "top"], ["E", 168, 112, "top"]].concat(conn ? [["J", 196, 40, "right", "conn."]] : []) });

const DIAGS = {
 "light-loop": { title:"One-way: loop-in at the ceiling rose (light fed)", colours:true, h:660,
  intro:"The supply loops in and out at each ceiling rose; a twin and earth drop goes down to the switch. Most common in UK houses.",
  note:"The blue (old: black) core of the switch drop carries a switched live, so it must be sleeved brown (old: red) at both ends. Flex to the lamp has been brown/blue since the 1970s, so it doesn't change with the old colours.",
  parts: { sup: supply(20, 24, "From consumer unit", "6 A MCB/RCBO, T&E"), nxt: onward(530, 24), rose: rose(235, 190), sw: sw1(24, 440), lamp: lamp(305, 480) },
  wires: [["sup","L","rose","Loop","L","Supply live into the loop terminal"],["sup","N","rose","N","N","Supply neutral"],["sup","E","rose","E","E","Circuit protective conductor"],
   ["rose","Loop","nxt","L","L","Live on to the next light"],["rose","N","nxt","N","N","Neutral on"],["rose","E","nxt","E","E","cpc on"],
   ["rose","Loop","sw","COM","L","Permanent live down to the switch"],["sw","L1","rose","SL","SL","Switched live back up (sleeved)"],["rose","E","sw","E","E","Earth to the switch box / plate"],
   ["rose","fSL","lamp","L","FL","Lamp live"],["rose","fN","lamp","N","FN","Lamp neutral"]] },

 "light-jb": { title:"One-way: junction box method (JB fed)", colours:true, h:660,
  intro:"All the joints are made in a 4-terminal junction box (L, N, E, switched live) under the floor, and plain cables run to the switch and the light. Common where fittings have no loop-in terminals.",
  note:"From the JB to the light the brown (old: red) core is the switched live – it's already a line colour so needs no sleeve. Junction boxes must be accessible for inspection unless they're maintenance-free (MF) type.",
  parts: { sup: supply(20, 24, "From consumer unit", "6 A MCB/RCBO, T&E"), nxt: onward(530, 24), jb: { name:"Junction box (4-terminal)", short:"Junction box", kind:"jb", x:250, y:190, w:220, h:170, terms:[["L", 50, 85, "left"], ["N", 110, 42, "top"], ["E", 170, 85, "right"], ["SL", 110, 130, "bottom"]] },
   sw: sw1(24, 440), fit: { name:"Light fitting", short:"Light", kind:"fitting", x:500, y:470, w:190, h:130, labelBelow:true, terms:[["L", 45, 30, "top"], ["N", 95, 30, "top"], ["E", 145, 30, "top"]] } },
  wires: [["sup","L","jb","L","L","Supply live"],["sup","N","jb","N","N","Supply neutral"],["sup","E","jb","E","E","cpc"],
   ["jb","L","nxt","L","L","Live on to the next JB"],["jb","N","nxt","N","N","Neutral on"],["jb","E","nxt","E","E","cpc on"],
   ["jb","L","sw","COM","L","Permanent live to the switch"],["sw","L1","jb","SL","SL","Switched live back (sleeved)"],["jb","E","sw","E","E","Earth to the switch"],
   ["jb","SL","fit","L","Lc","Switched live to the light"],["jb","N","fit","N","N","Neutral to the light"],["jb","E","fit","E","E","Earth to the light"]] },

 "light-switch": { title:"One-way: switch fed (supply at the switch)", colours:true, h:540,
  intro:"The supply cable comes into the switch back box and loops on from there. Neutrals are joined in a connector in the back box, and a twin and earth runs up to the light carrying switched live and neutral.",
  note:"Mark the back box connector clearly: the neutrals in it stay live-risk when the switch is off. Some smart switches need this neutral.",
  parts: { sup: supply(16, 24, "From consumer unit", "6 A MCB/RCBO, T&E"), nxt: onward(276, 24),
   bb: { name:"Switch back box", short:"Switch box", kind:"bbox", x:150, y:330, w:420, h:150, labelBelow:true, terms:[["COM", 60, 60, "top"], ["L1", 140, 60, "top"], ["NC", 230, 60, "top", "N conn."], ["E", 320, 60, "top"]] },
   fit: { name:"Light fitting", short:"Light", kind:"fitting", barTop:true, x:520, y:24, w:184, h:110, terms:[["L", 40, 88, "bottom"], ["N", 92, 88, "bottom"], ["E", 144, 88, "bottom"]] } },
  wires: [["sup","L","bb","COM","L","Supply live onto the switch COM"],["sup","N","bb","NC","N","Supply neutral into the connector"],["sup","E","bb","E","E","cpc"],
   ["nxt","L","bb","COM","L","Live on (also on COM)"],["nxt","N","bb","NC","N","Neutral on"],["nxt","E","bb","E","E","cpc on"],
   ["bb","L1","fit","L","Lc","Switched live up to the light"],["bb","NC","fit","N","N","Neutral up to the light"],["bb","E","fit","E","E","Earth to the light"]] },

 "light-2way": { title:"Two-way switching (3-core and earth between switches)", colours:true, h:660,
  intro:"Loop-in at the rose, a twin and earth drop to switch 1, then 3-core and earth between the switches. The two strappers link L1–L1 and L2–L2; switch 2's COM sends the switched live back.",
  note:"3-core colours: current brown, black, grey; old red, yellow, blue. The brown (old: red) core carries the switched live back from switch 2 and is joined to the sleeved switch-drop core in a connector at switch 1.",
  parts: { sup: supply(20, 24, "From consumer unit", "6 A MCB/RCBO, T&E"), rose: rose(260, 24), lamp: lamp(330, 230),
   s1: sw2(20, 430, "Switch 1 two-way switch", true), s2: sw2(470, 470, "Switch 2 two-way switch") },
  wires: [["sup","L","rose","Loop","L","Supply live"],["sup","N","rose","N","N","Supply neutral"],["sup","E","rose","E","E","cpc"],
   ["rose","fSL","lamp","L","FL","Lamp live"],["rose","fN","lamp","N","FN","Lamp neutral"],
   ["rose","Loop","s1","COM","L","Permanent live down to switch 1 COM"],["s1","J","rose","SL","SL","Switched live back up (sleeved)"],["rose","E","s1","E","E","Earth to switch 1"],
   ["s1","L1","s2","L1","C2","Strapper L1 to L1"],["s1","L2","s2","L2","C3","Strapper L2 to L2"],["s2","COM","s1","J","C1","Switched live from switch 2 COM, back to switch 1's connector"],["s1","E","s2","E","E","Earth on to switch 2"]] },

 "light-int": { title:"Intermediate switching (three or more switches)", colours:true, h:640,
  intro:"Two-way switches at each end, an intermediate switch (or several) in the middle. Both strappers go into one pair of the intermediate's terminals and out of the other pair; the return core passes through in a connector.",
  note:"Intermediate terminal marks vary (L1/L2 in and out, or L1–L4) – keep one strapper pair on the 'in' side and the other on the 'out' side, per the switch's label. If the light works from the ends but the middle switch does nothing, the pairs are crossed.",
  parts: { sup: supply(20, 24, "From consumer unit", "6 A MCB/RCBO, T&E"), rose: rose(260, 24), lamp: lamp(330, 230),
   s1: sw2(10, 440, "Switch 1 two-way switch", true),
   si: { name:"Intermediate switch", short:"Intermediate", kind:"sw", x:250, y:440, w:230, h:150, labelBelow:true, terms:[["aL1", 22, 112, "top", "L1 in"], ["aL2", 62, 112, "top", "L2 in"], ["J", 104, 112, "top", "conn."], ["E", 140, 112, "top"], ["bL1", 176, 112, "top", "L1 out"], ["bL2", 214, 112, "top", "L2 out"]] },
   s2: sw2(492, 440, "Switch 2 two-way switch") },
  wires: [["sup","L","rose","Loop","L","Supply live"],["sup","N","rose","N","N","Supply neutral"],["sup","E","rose","E","E","cpc"],
   ["rose","fSL","lamp","L","FL","Lamp live"],["rose","fN","lamp","N","FN","Lamp neutral"],
   ["rose","Loop","s1","COM","L","Permanent live to switch 1 COM"],["s1","J","rose","SL","SL","Switched live back up (sleeved)"],["rose","E","s1","E","E","Earth to switch 1"],
   ["s1","L1","si","aL1","C2","Strapper to intermediate"],["s1","L2","si","aL2","C3","Strapper to intermediate"],
   ["si","bL1","s2","L1","C2","Strapper on to switch 2"],["si","bL2","s2","L2","C3","Strapper on to switch 2"],
   ["s2","COM","si","J","C1","Switched live back from switch 2"],["si","J","s1","J","C1","…through the intermediate box to switch 1"],
   ["s1","E","si","E","E","Earth on"],["si","E","s2","E","E","Earth on"]] },

 "hp": { title:"Air source heat pump – supply and controls", h:700,
  intro:"A dedicated circuit to a lockable isolator beside the outdoor unit, a separate fused supply for the indoor controller, and the immersion on its own circuit. Terminal names differ by maker – follow their diagram.",
  note:"Size the circuit on the maker's maximum running current and cable route (outdoors: SWA or suitable cable, UV-resistant, protected). RCD type is set by the maker – many need Type A, some inverter units need Type B or an RDC-DD. Comms cable polarity matters on most units.",
  parts: { cu: { name:"Consumer unit", short:"Consumer unit", kind:"cu", x:20, y:24, w:320, h:170, ways:[["RCBO","heat pump"],["MCB 6A","controls"],["RCBO","immersion"]], terms:[["hL", 40, 110, "bottom", "L"], ["hN", 80, 110, "bottom", "N"], ["cL", 140, 110, "bottom", "L"], ["cN", 180, 110, "bottom", "N"], ["iL", 240, 110, "bottom", "L"], ["iN", 280, 110, "bottom", "N"], ["E", 160, 150, "bottom", "E bar"]] },
   iso: { name:"Rotary isolator (lockable)", short:"Isolator", kind:"iso", x:20, y:300, w:200, h:170, terms:[["iL", 40, 22, "top", "L"], ["iN", 100, 22, "top", "N"], ["iE", 160, 22, "top", "E"], ["oL", 40, 148, "bottom", "L"], ["oN", 100, 148, "bottom", "N"], ["oE", 160, 148, "bottom", "E"]] },
   hp: { name:"Outdoor unit (monobloc)", short:"Outdoor unit", kind:"hp", x:250, y:520, w:280, h:160, labelBelow:true, fill:"#F7F8FA", terms:[["L", 20, 24, "top"], ["N", 60, 24, "top"], ["E", 100, 24, "top"], ["A", 200, 24, "top"], ["B", 240, 24, "top"]] },
   ctrl: { name:"Indoor controller", short:"Controller", kind:"ctrl", x:520, y:280, w:180, h:150, terms:[["L", 30, 120, "bottom"], ["N", 70, 120, "bottom"], ["E", 110, 120, "bottom"], ["A", 30, 20, "top"], ["B", 150, 20, "top"]] },
   imm: { name:"Immersion (via 20 A DP switch)", short:"Immersion", kind:"imm", x:400, y:40, w:130, h:170, terms:[["L", 30, 150, "bottom"], ["N", 65, 150, "bottom"], ["E", 100, 150, "bottom"]] } },
  wires: [["cu","hL","iso","iL","L","Heat pump circuit live"],["cu","hN","iso","iN","N","Heat pump circuit neutral"],["cu","E","iso","iE","E","cpc"],
   ["iso","oL","hp","L","L","Live to the unit"],["iso","oN","hp","N","N","Neutral to the unit"],["iso","oE","hp","E","E","Earth to the unit"],
   ["cu","cL","ctrl","L","L","Controller supply (often via a 3 A fused spur)"],["cu","cN","ctrl","N","N","Controller neutral"],["cu","E","ctrl","E","E","Controller earth"],
   ["ctrl","A","hp","A","CA","Comms – low voltage, maker's cable"],["ctrl","B","hp","B","CB","Comms – polarity matters"],
   ["cu","iL","imm","L","L","Immersion live"],["cu","iN","imm","N","N","Immersion neutral"],["cu","E","imm","E","E","Immersion earth"]] },

 "pv": { title:"Solar PV – panels to the consumer unit", h:740,
  intro:"DC from the panels to the inverter through a DC isolator (often built into the inverter now), AC out through a lockable AC isolator and a generation meter to a dedicated way in the consumer unit. A CT clamp on the incoming tails tells the inverter what the house is using.",
  note:"PV DC is live whenever there's daylight and can't be switched off at the panels – treat it as live. DC cable must be PV-rated and polarity marked. Fit the dual-supply warning labels at the origin, meter, consumer unit and every isolator.",
  parts: { pv: { name:"PV array (string)", short:"Panels", kind:"pv", x:20, y:24, w:300, h:150, terms:[["+", 110, 128, "bottom", "+"], ["-", 190, 128, "bottom", "−"]] },
   dc: { name:"DC isolator", short:"DC isolator", kind:"iso", x:20, y:250, w:200, h:170, terms:[["i+", 60, 22, "top", "+ in"], ["i-", 140, 22, "top", "− in"], ["o+", 60, 148, "bottom", "+ out"], ["o-", 140, 148, "bottom", "− out"]] },
   inv: { name:"Inverter", kind:"inv", x:20, y:500, w:230, h:190, labelBelow:true, terms:[["+", 40, 26, "top", "DC +"], ["-", 95, 26, "top", "DC −"], ["CT", 160, 26, "top"], ["L", 208, 60, "right"], ["N", 208, 105, "right"], ["E", 208, 150, "right"]] },
   ac: { name:"AC isolator (lockable)", short:"AC isolator", kind:"iso", x:290, y:500, w:170, h:190, labelBelow:true, terms:[["iL", 22, 60, "left", "L"], ["iN", 22, 105, "left", "N"], ["iE", 22, 150, "left", "E"], ["oL", 148, 60, "right", "L"], ["oN", 148, 105, "right", "N"], ["oE", 148, 150, "right", "E"]] },
   gm: { name:"Generation meter", short:"Gen meter", kind:"meter", dispY:110, x:500, y:470, w:200, h:220, labelBelow:true, terms:[["Li", 22, 90, "left", "L in"], ["Ni", 22, 140, "left", "N in"], ["Lo", 110, 26, "top", "L out"], ["No", 165, 26, "top", "N out"]] },
   cu: { name:"Consumer unit", short:"Consumer unit", kind:"cu", x:400, y:24, w:300, h:170, ways:[["MCB","solar PV"],["Main","switch"]], terms:[["L", 210, 140, "bottom"], ["N", 255, 140, "bottom"], ["E", 40, 140, "bottom", "E bar"]] },
   ct: { name:"CT clamp on incoming live tail", short:"CT clamp", kind:"ct", x:250, y:260, w:130, h:120, terms:[["CT", 65, 102, "bottom", ""]] } },
  wires: [["pv","+","dc","i+","DCP","String positive"],["pv","-","dc","i-","DCN","String negative"],["dc","o+","inv","+","DCP","Positive to inverter"],["dc","o-","inv","-","DCN","Negative to inverter"],
   ["inv","L","ac","iL","L","Inverter AC live"],["inv","N","ac","iN","N","Inverter AC neutral"],["inv","E","ac","iE","E","Earth"],
   ["ac","oL","gm","Li","L","Live into the generation meter"],["ac","oN","gm","Ni","N","Neutral into the generation meter"],
   ["gm","Lo","cu","L","L","Live to the PV way"],["gm","No","cu","N","N","Neutral to the PV way"],["ac","oE","cu","E","E","Earth to the earth bar"],
   ["ct","CT","inv","CT","CT","Clamp lead – arrow to face the way the maker says"]] },

 "inv": { title:"Hybrid inverter with battery and backup circuits", h:760,
  intro:"A hybrid inverter takes PV and a battery on the DC side, connects to the house on its grid port, and can run chosen circuits from its backup (EPS) port in a power cut. A CT clamp on the incoming tails lets it follow the house load.",
  note:"Battery DC can deliver very high fault current – use the maker's fuse/isolator and cable size. In backup mode the inverter may create its own neutral–earth link: follow the maker's earthing arrangement, BS 7671 Chapter 82 and the IET Code of Practice for Electrical Energy Storage Systems.",
  parts: { pv: { name:"PV array", short:"Panels", kind:"pv", x:20, y:24, w:260, h:140, terms:[["+", 90, 118, "bottom", "+"], ["-", 170, 118, "bottom", "−"]] },
   bat: { name:"Battery", kind:"batt", x:20, y:520, w:220, h:150, labelBelow:true, terms:[["+", 40, 22, "top", "+"], ["-", 100, 22, "top", "−"], ["BMS", 180, 22, "top"]] },
   inv: { name:"Hybrid inverter", short:"Inverter", kind:"inv", x:250, y:240, w:250, h:200, terms:[["PV+", 30, 24, "top", "PV+"], ["PV-", 80, 24, "top", "PV−"], ["B+", 30, 176, "bottom", "BAT+"], ["B-", 80, 176, "bottom", "BAT−"], ["BMS", 130, 176, "bottom"], ["CT", 130, 24, "top"], ["GL", 225, 60, "right", "Grid L"], ["GN", 225, 100, "right", "Grid N"], ["GE", 225, 140, "right", "Grid E"], ["EL", 180, 176, "bottom", "EPS L"], ["EN", 222, 176, "bottom", "EPS N"]] },
   cu: { name:"Main consumer unit", short:"Main CU", kind:"cu", waysY:150, x:540, y:200, w:160, h:220, ways:[["RCBO","inverter"]], terms:[["L", 20, 40, "left"], ["N", 20, 80, "left"], ["E", 20, 120, "left", "E"]] },
   eps: { name:"Backup (EPS) board", short:"Backup board", kind:"cu", waysY:58, x:420, y:540, w:280, h:150, labelBelow:true, ways:[["RCBO","fridge"],["RCBO","lights"]], terms:[["L", 40, 22, "top"], ["N", 90, 22, "top"], ["E", 140, 22, "top"]] },
   ct: { name:"CT clamp on incoming tail", short:"CT clamp", kind:"ct", x:320, y:24, w:140, h:120, terms:[["CT", 70, 104, "bottom", ""]] } },
  wires: [["pv","+","inv","PV+","DCP","PV positive (via DC isolator)"],["pv","-","inv","PV-","DCN","PV negative (via DC isolator)"],
   ["bat","+","inv","B+","BP","Battery positive (via the maker's fuse/isolator)"],["bat","-","inv","B-","BN","Battery negative"],["bat","BMS","inv","BMS","CA","Battery management comms (CAN/RS485)"],
   ["inv","GL","cu","L","L","Grid port live (via AC isolator)"],["inv","GN","cu","N","N","Grid port neutral"],["inv","GE","cu","E","E","Earth"],
   ["inv","EL","eps","L","L","Backup live out"],["inv","EN","eps","N","N","Backup neutral out"],["cu","E","eps","E","E","Earth to the backup board"],
   ["ct","CT","inv","CT","CT","Clamp lead"]] },

 "meter": { title:"Supply intake: cut-out, meter, isolator and consumer unit", colours:true, h:770,
  intro:"The DNO's cut-out holds the main fuse; meter tails run to the supplier's meter, then usually through a double-pole isolator to the consumer unit's main switch. On TN-C-S (PME) the earth comes from the cut-out's earth terminal to your main earthing terminal.",
  note:"The cut-out, main fuse and meter are the DNO's and supplier's – never break their seals. Meter terminal order varies: check the meter's label. Typical sizes with 25 mm² tails on PME: 16 mm² earthing conductor, 10 mm² main bonding – confirm against BS 7671 Tables 54.7 and 54.8.",
  parts: { co: { name:"DNO cut-out (main fuse)", short:"Cut-out", kind:"cutout", x:20, y:40, w:170, h:220, terms:[["L", 55, 196, "bottom", "L"], ["N", 115, 196, "bottom", "N"], ["PE", 150, 60, "right", "PME"]] },
   m: { name:"Supplier's meter", short:"Meter", kind:"meter", x:250, y:40, w:300, h:170, terms:[["Li", 40, 148, "bottom", "L in"], ["Lo", 110, 148, "bottom", "L out"], ["Ni", 180, 148, "bottom", "N in"], ["No", 250, 148, "bottom", "N out"]] },
   iso: { name:"Double-pole isolator", short:"Isolator", kind:"iso", x:330, y:300, w:190, h:170, terms:[["iL", 40, 22, "top", "L in"], ["iN", 150, 22, "top", "N in"], ["oL", 40, 148, "bottom", "L out"], ["oN", 150, 148, "bottom", "N out"]] },
   cu: { name:"Consumer unit (main switch)", short:"Consumer unit", kind:"cu", waysY:60, labelBelow:true, x:420, y:560, w:280, h:170, ways:[["Main","switch"],["RCBO","ways"]], terms:[["L", 40, 22, "top"], ["N", 100, 22, "top"], ["E", 240, 22, "top", "E bar"]] },
   met: { name:"Main earthing terminal", short:"MET", kind:"bar", x:20, y:330, w:280, h:110, terms:[["in", 40, 26, "top", "in"], ["cu", 240, 84, "bottom", "to CU"], ["g", 60, 84, "bottom", "gas"], ["w", 150, 84, "bottom", "water"]] },
   gas: { name:"Gas pipe (main bonding)", short:"Gas bond", kind:"pipe", pipe:"#E8C23A", x:20, y:560, w:180, h:100, labelBelow:true, terms:[["c", 90, 20, "top", ""]] },
   wat: { name:"Water pipe (main bonding)", short:"Water bond", kind:"pipe", x:215, y:560, w:180, h:100, labelBelow:true, terms:[["c", 90, 20, "top", ""]] } },
  wires: [["co","L","m","Li","L","Meter tail – line in (25 mm² typical)"],["co","N","m","Ni","N","Meter tail – neutral in"],
   ["m","Lo","iso","iL","L","Line out to the isolator"],["m","No","iso","iN","N","Neutral out to the isolator"],
   ["iso","oL","cu","L","L","Tail to the main switch"],["iso","oN","cu","N","N","Neutral tail to the main switch"],
   ["co","PE","met","in","E","Earthing conductor from the PME terminal (16 mm² typical)"],["met","cu","cu","E","E","Earth to the consumer unit"],
   ["met","g","gas","c","E","Main bonding to gas, within 600 mm of the meter"],["met","w","wat","c","E","Main bonding to water, where it enters"]] },
};
window.BF_DIAG_IDS = Object.keys(DIAGS);

const CH = [
 {id:"light-1way", g:"Lighting", t:"One-way: loop-in, JB and switch fed", h:`
<p>Three ways the same one-way light is wired in UK homes. Use the colour buttons to see each one in current or pre-2004 colours.</p>
{{DIAG:light-loop}}
{{DIAG:light-jb}}
{{DIAG:light-switch}}
<p><b>At an existing rose</b></p>
<ul>
<li>The <b>loop</b> terminal has two or more browns (old: reds): supply in, supply on, and the switch drop's feed.</li>
<li>The <b>switched</b> terminal has one sleeved core from the switch and the lamp flex brown.</li>
<li>Prove dead before touching: the loop is live with the switch off, and on a shared neutral circuit the neutral can carry current.</li>
<li>Polarity: a single-pole switch must break the line conductor, never the neutral. Check it with continuity during dead testing.</li>
</ul>`},
 {id:"light-2way", g:"Lighting", t:"Two-way and intermediate", h:`
<p>The standard modern way uses 3-core and earth between the switches. Use the colour buttons for current (brown, black, grey) or pre-2004 (red, yellow, blue) colours.</p>
{{DIAG:light-2way}}
{{DIAG:light-int}}
<p><b>Converting a one-way switch to two-way</b></p>
<ol>
<li>Keep the existing drop. At switch 1: the drop's brown (old: red) to COM. The sleeved core goes into a connector instead of L1.</li>
<li>Run 3-core and earth to the new switch position.</li>
<li>Black and grey (old: yellow and blue) link L1–L1 and L2–L2.</li>
<li>The 3-core's brown (old: red) runs from switch 2's COM back to the connector at switch 1.</li>
<li>Earths through to both boxes. Test before refitting the plates.</li>
</ol>
<p class="small muted">Older installs sometimes have two-way wiring done with twin and earth pairs instead of 3-core. Trace each core with a continuity tester before reusing it.</p>`},
 {id:"hp-supply", g:"Renewables and supply", t:"Air source heat pumps", h:`
{{DIAG:hp}}
<ul>
<li><b>DNO notification</b> (ENA process): if the property's maximum demand stays at 60 A per phase or less, connect and then notify within 28 days. Above that, or with a looped service, an unsafe cut-out or uncertain capacity, apply before installing.</li>
<li><b>New circuit</b> from the consumer unit is notifiable under Part P – through a scheme or building control.</li>
<li><b>Isolator</b> next to the outdoor unit, lockable in the off position.</li>
<li><b>RCD type and cable size</b> come from the maker's installation manual (maximum running current, cable route, outdoor protection).</li>
<li><b>Earthing outdoors:</b> check the maker's guidance on PME and whether the unit's metal is within reach of other earthed metalwork.</li>
<li><b>Controls</b> (diverter or zone valves, cylinder sensor, room units) vary a lot by make. Wire them from the maker's diagram, not from a boiler wiring centre layout.</li>
</ul>`},
 {id:"pv", g:"Renewables and supply", t:"Solar PV", h:`
{{DIAG:pv}}
<ul>
<li><b>DNO:</b> up to 16 A per phase total generation (G98): notify within 28 days of commissioning. Over 16 A per phase (G99): get approval before installing.</li>
<li><b>BS 7671 Section 712</b> covers PV: DC isolation, cable selection, protection and labelling.</li>
<li><b>Labels:</b> dual supply warnings at the origin, meter position, consumer unit and every point of isolation.</li>
<li><b>Before working:</b> isolate AC first, then DC. Remember the DC side stays live in daylight – cover the panels or work as live.</li>
<li><b>Testing PV DC:</b> use a PV tester (open-circuit voltage, short-circuit current, insulation) – a standard MFT isn't designed for it.</li>
</ul>`},
 {id:"inverters", g:"Renewables and supply", t:"Inverters and batteries", h:`
{{DIAG:inv}}
<ul>
<li><b>String inverter:</b> PV only, one AC output.</li>
<li><b>Hybrid inverter:</b> PV and battery on one inverter.</li>
<li><b>AC-coupled battery:</b> its own inverter, added beside an existing PV system.</li>
<li><b>Micro-inverters:</b> one per panel, AC cabling on the roof.</li>
<li><b>CT clamp:</b> on the incoming live tail, before anything branches off. The arrow faces the way the maker says (usually towards the house or the grid). A reversed clamp makes it export the battery or read backwards.</li>
<li><b>Backup (EPS):</b> only the circuits on the backup board run in a power cut. The inverter must stop feeding the grid (anti-islanding), and the backup side needs its own earthing arrangement per the maker.</li>
<li><b>DNO:</b> batteries are generation. Over 3.68 kW the DNO form goes in before installation.</li>
</ul>`},
 {id:"metering", g:"Renewables and supply", t:"Metering and the supply intake", h:`
{{DIAG:meter}}
<ul>
<li><b>Earthing type:</b>
<ul>
<li><b>TN-C-S (PME):</b> earth terminal on the cut-out or neutral block.</li>
<li><b>TN-S:</b> earth clamp on the cable sheath.</li>
<li><b>TT:</b> your own earth electrode, no supplier earth.</li>
</ul></li>
<li><b>Isolator:</b> a double-pole isolator between meter and consumer unit lets you isolate without pulling the DNO fuse. If there isn't one, the supplier or DNO fits it (or pulls the fuse) – some DNOs let registered contractors withdraw the fuse under their own scheme.</li>
<li><b>Henley blocks</b> (service connector blocks) split the tails to feed a second board, e.g. a garage or EV charger. They must be suitably rated, enclosed and labelled.</li>
<li><b>Economy 7 and dual-rate:</b> older meters may have a teleswitch or a separate time switch and a second set of tails to an off-peak board. Smart meters can switch through an auxiliary load control relay.</li>
<li><b>Smart meters:</b> the comms hub sits on the meter. The supplier owns everything up to and including the meter.</li>
</ul>`},
];
window.BF_BOOK = (window.BF_BOOK || []).concat(CH);

})();
