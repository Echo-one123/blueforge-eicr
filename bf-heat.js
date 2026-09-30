/* Heating controls: Y-plan, S-plan, programmer / stat / boiler wiring, wiring centres, fault finding.
   Wiring centre terminal NUMBERS vary by make, so everything here is by FUNCTION. Valve colours are the Honeywell/Resideo
   convention (V4073A 3-port, V4043H 2-port), which most makes copy – always check the label on the valve in front of you. */
(function(){
const W = { brown:"#7B4A2A", blue:"#1F5FBF", grey:"#8C939C", orange:"#F08A24", white:"#FFFFFF", ge:"#3E9B3E", black:"#1B1F24" };
const sw = (c, name) => `<span class="wsw" style="--w:${W[c] || c}"></span>${name}`;
const ge = `<span class="wsw ge"></span>green/yellow`;
/* ---------- real-world wiring drawings: devices as they look, every core to its wiring-centre terminal ---------- */
// Example wiring-centre numbering (a plain 8-way + earth box, labelled like this). Real centres are numbered differently – match by job.
const STRIP = [["1","Mains L"],["2","Neutral"],["3","CH ON"],["4","HW ON"],["5","HW OFF"],["6","CH call"],["7","HW call"],["8","Boiler SL"],["E","Earth"]];
const SX = t => t === "E" ? 612 : 108 + (+t - 1) * 63;   // x of each terminal on the strip
const SY0 = 402, SY1 = 462;                               // strip top / bottom edge
const COL = { brown:"#7B4A2A", blue:"#1F5FBF", grey:"#8C939C", orange:"#F08A24", white:"#FFFFFF", black:"#1B1F24", ge:"#3E9B3E" };
const DEV = {
  spur: { name:"3 A fused spur", x:16, y:30, w:110, h:118, side:"top", terms:[["L",36],["N",71],["E",106]] },
  prog: { name:"Programmer backplate", x:146, y:30, w:262, h:118, side:"top", terms:[["N",170],["L",208],["1",246],["2",284],["3",322],["4",360]] },
  room: { name:"Room stat", x:428, y:30, w:128, h:118, side:"top", terms:[["COM",448],["call",482],["N",516],["E",546]] },
  cyl:  { name:"Cylinder stat", x:576, y:30, w:128, h:118, side:"top", terms:[["C",596],["1",630],["2",664],["E",694]] },
  boil: { name:"Boiler", x:380, y:600, w:170, h:150, side:"bottom", terms:[["L",400],["N",440],["E",480],["SL",520]] },
  pump: { name:"Pump", x:576, y:600, w:128, h:150, side:"bottom", terms:[["L",600],["N",640],["E",680]] },
};
const VALVE3 = { name:"3-port valve (Y-plan)", x:40, y:600, w:300, h:150, side:"lead", gland:[190, 600] };
const VALVE2A = { name:"CH zone valve", x:16, y:600, w:170, h:150, side:"lead", gland:[100, 600] };
const VALVE2B = { name:"HW zone valve", x:198, y:600, w:170, h:150, side:"lead", gland:[282, 600] };
// [device, device terminal or lead colour name, core colour, strip terminal, what it does]
const PLAN = {
 y: { devices: { spur: DEV.spur, prog: DEV.prog, room: DEV.room, cyl: DEV.cyl, valve: VALVE3, boil: DEV.boil, pump: DEV.pump },
   conns: [
    ["spur","L","brown","1","Supply live in"], ["spur","N","blue","2","Supply neutral"], ["spur","E","ge","E","Earth"],
    ["prog","L","brown","1","Programmer supply"], ["prog","N","blue","2","Programmer neutral"],
    ["prog","4","black","3","CH ON – live when heating is timed on"], ["prog","3","grey","4","HW ON – live when hot water is timed on"], ["prog","1","white","5","HW OFF – tells the valve hot water is off"],
    ["room","COM","brown","3","Live in from CH ON"], ["room","call","black","6","Call for heat out"], ["room","N","blue","2","Neutral (only if the stat needs one)"], ["room","E","ge","E","Earth continuity"],
    ["cyl","C","brown","4","Live in from HW ON"], ["cyl","1","black","8","Call for heat – fires boiler and pump directly"], ["cyl","2","grey","5","Satisfied – joins HW OFF to the valve grey"], ["cyl","E","ge","E","Earth continuity"],
    ["valve","white","white","6","Drives valve towards heating when the room stat calls"], ["valve","grey","grey","5","With white: heating only (HW off or satisfied)"], ["valve","orange","orange","8","Live out when at heating – fires boiler and pump"], ["valve","blue","blue","2","Motor neutral"], ["valve","green/yellow","ge","E","Earth"],
    ["boil","L","brown","1","Permanent live (needed for pump overrun)"], ["boil","N","blue","2","Neutral"], ["boil","E","ge","E","Earth"], ["boil","SL","black","8","Switched live – the demand"],
    ["pump","L","brown","8","Runs with the boiler (pump-overrun boiler: wire to the boiler's pump terminals instead)"], ["pump","N","blue","2","Neutral"], ["pump","E","ge","E","Earth"],
   ], unused:"Terminal 7 (HW call) and programmer 2 (CH OFF) are not used on Y-plan." },
 s: { devices: { spur: DEV.spur, prog: DEV.prog, room: DEV.room, cyl: DEV.cyl, chv: VALVE2A, hwv: VALVE2B, boil: DEV.boil, pump: DEV.pump },
   conns: [
    ["spur","L","brown","1","Supply live in"], ["spur","N","blue","2","Supply neutral"], ["spur","E","ge","E","Earth"],
    ["prog","L","brown","1","Programmer supply"], ["prog","N","blue","2","Programmer neutral"],
    ["prog","4","black","3","CH ON – live when heating is timed on"], ["prog","3","grey","4","HW ON – live when hot water is timed on"],
    ["room","COM","brown","3","Live in from CH ON"], ["room","call","black","6","Call for heat – opens the CH valve"], ["room","N","blue","2","Neutral (only if the stat needs one)"], ["room","E","ge","E","Earth continuity"],
    ["cyl","C","brown","4","Live in from HW ON"], ["cyl","1","black","7","Call for heat – opens the HW valve"], ["cyl","E","ge","E","Earth continuity"],
    ["chv","brown","brown","6","Motor live – opens the valve"], ["chv","blue","blue","2","Motor neutral"], ["chv","grey","grey","1","End switch in – permanent live"], ["chv","orange","orange","8","End switch out – fires boiler and pump when open"], ["chv","green/yellow","ge","E","Earth"],
    ["hwv","brown","brown","7","Motor live – opens the valve"], ["hwv","blue","blue","2","Motor neutral"], ["hwv","grey","grey","1","End switch in – permanent live"], ["hwv","orange","orange","8","End switch out – fires boiler and pump when open"], ["hwv","green/yellow","ge","E","Earth"],
    ["boil","L","brown","1","Permanent live (needed for pump overrun)"], ["boil","N","blue","2","Neutral"], ["boil","E","ge","E","Earth"], ["boil","SL","black","8","Switched live – the demand"],
    ["pump","L","brown","8","Runs with the boiler (pump-overrun boiler: wire to the boiler's pump terminals instead)"], ["pump","N","blue","2","Neutral"], ["pump","E","ge","E","Earth"],
   ], unused:"Terminal 5 (HW OFF), programmer 1 and 2, and cylinder stat 2 are not used on S-plan – park any spare cores in a connector." },
};
const COLNAME = { brown:"brown", blue:"blue", grey:"grey", orange:"orange", white:"white", black:"black", ge:"green/yellow" };
const screw = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#D4B45A" stroke="#7A6320" stroke-width="1.5"/><path d="M${x - 5} ${y + 3} L${x + 5} ${y - 3}" stroke="#6B5518" stroke-width="2"/>`;
function devicePic(k, d){
  const {x, y, w, h} = d, cx = x + w / 2;
  let g = "";
  if (d.side === "lead"){   // motorised valve: grey motor head on a brass body with pipe ports
    g += `<rect x="${x + 10}" y="${y + 14}" width="${w - 20}" height="${h - 64}" rx="10" fill="#C9CED6" stroke="#5B6573" stroke-width="2"/>`;
    g += `<rect x="${x + 22}" y="${y + 26}" width="${w - 44}" height="16" rx="3" fill="#EEF1F4" stroke="#8993A1"/><text x="${cx}" y="${y + 38}" text-anchor="middle" font-size="11" font-weight="700" fill="#222">MOTOR HEAD</text>`;
    g += `<rect x="${x + 16}" y="${y + h - 50}" width="${w - 32}" height="22" rx="4" fill="#C8A04A" stroke="#7A6320"/>`;
    g += `<rect x="${x}" y="${y + h - 44}" width="18" height="12" fill="#C87F3A"/><rect x="${x + w - 18}" y="${y + h - 44}" width="18" height="12" fill="#C87F3A"/>`;
    if (k === "valve") g += `<rect x="${cx - 6}" y="${y + h - 28}" width="12" height="22" fill="#C87F3A"/><text x="${x + 4}" y="${y + h - 50}" font-size="11" font-weight="700" fill="#222">A heating</text><text x="${x + w - 4}" y="${y + h - 50}" text-anchor="end" font-size="11" font-weight="700" fill="#222">B hot water</text><text x="${cx + 10}" y="${y + h - 10}" font-size="11" font-weight="700" fill="#222">AB from boiler</text>`;
    g += `<rect x="${d.gland[0] - 9}" y="${d.gland[1] - 30}" width="18" height="34" rx="5" fill="#9AA2AD" stroke="#5B6573"/>`;   // cable sheath out of the gland
  } else {
    const fill = k === "boil" ? "#F7F8FA" : k === "pump" ? "#2E6BB5" : "#F4F5F7";
    g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="#5B6573" stroke-width="2"/>`;
    if (k === "pump") g += `<circle cx="${cx}" cy="${y + 78}" r="34" fill="#255A99" stroke="#153A66" stroke-width="2"/><circle cx="${cx}" cy="${y + 78}" r="10" fill="#9DB9DD"/>`;
    if (k === "spur") g += `<rect x="${cx - 22}" y="${y + 18}" width="44" height="26" rx="4" fill="#fff" stroke="#8993A1"/><text x="${cx}" y="${y + 36}" text-anchor="middle" font-size="12" font-weight="700" fill="#B42318">3 A</text>`;
    if (k === "room") g += `<circle cx="${cx}" cy="${y + 34}" r="18" fill="#fff" stroke="#8993A1" stroke-width="2"/><path d="M${cx} ${y + 34} L${cx + 10} ${y + 24}" stroke="#B42318" stroke-width="3"/>`;
    if (k === "cyl") g += `<rect x="${cx - 12}" y="${y + 14}" width="24" height="40" rx="6" fill="#fff" stroke="#8993A1"/><text x="${cx}" y="${y + 40}" text-anchor="middle" font-size="11" fill="#222">°C</text>`;
    if (k === "prog") g += `<rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="30" rx="4" fill="#DDE3EA" stroke="#8993A1"/><text x="${cx}" y="${y + 34}" text-anchor="middle" font-size="12" font-weight="700" fill="#222">STANDARD UK BACKPLATE</text>`;
    if (k === "boil") g += `<rect x="${x + 20}" y="${y + 60}" width="${w - 40}" height="50" rx="6" fill="#E3E7EC" stroke="#8993A1"/><text x="${cx}" y="${y + 90}" text-anchor="middle" font-size="11" fill="#222">wiring terminals only</text>`;
    const ty = d.side === "top" ? y + h - 22 : y + 22, ly = d.side === "top" ? ty - 16 : ty + 26;
    g += `<rect x="${x + 8}" y="${ty - 13}" width="${w - 16}" height="26" rx="4" fill="#2B2F36"/>`;
    d.terms.forEach(([t, tx]) => { g += screw(tx, ty) + `<text x="${tx}" y="${ly}" text-anchor="middle" font-size="12" font-weight="800" fill="${k === "pump" ? "#fff" : "#101820"}">${t}</text>`; });
  }
  const ny = d.side === "top" ? y - 8 : y + h + 22;
  g += `<text x="${x + w / 2}" y="${ny}" text-anchor="middle" font-size="14" font-weight="800" fill="#101820">${d.name}</text>`;
  return `<g class="wdev" data-act="wireSel" data-dev="${k}">${g}</g>`;
}
function wiringSvg(plan, sel){
  const P = PLAN[plan], D = P.devices;
  // spread several cores landing on one terminal
  const count = {}, seen = {};
  P.conns.forEach(c => { const side = D[c[0]].side === "top" ? "t" : "b"; const key = c[3] + side; count[key] = (count[key] || 0) + 1; });
  let wires = "", lit = "";
  P.conns.forEach(c => {
    const [dk, term, col, to] = c, d = D[dk], side = d.side === "top" ? "t" : "b", key = to + side;
    const i = (seen[key] = (seen[key] || 0) + 1) - 1, n = count[key], off = n > 1 ? (i - (n - 1) / 2) * Math.min(9, 36 / (n - 1)) : 0;
    const x2 = SX(to) + off, y2 = side === "t" ? SY0 : SY1;
    let x1, y1;
    if (d.side === "lead"){ const lead = ["white","grey","orange","blue","green/yellow","brown"].indexOf(term); x1 = d.gland[0] + (lead - 2) * 4; y1 = d.gland[1] - 30; }
    else { x1 = d.terms.find(t => t[0] === term)[1]; y1 = side === "t" ? d.y + d.h - 22 : d.y + 22; }
    const my = (y1 + y2) / 2, path = `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
    const on = !sel || sel === dk, stroke = COL[col];
    const w = `<path d="${path}" fill="none" stroke="#1A1D22" stroke-width="${on ? 7 : 5}" stroke-linecap="round"/><path d="${path}" fill="none" stroke="${stroke}" stroke-width="${on ? 4.5 : 3}" stroke-linecap="round"${col === "ge" ? ` stroke-dasharray="7 6"` : ""}/>${col === "ge" ? `<path d="${path}" fill="none" stroke="#F2D12E" stroke-width="${on ? 4.5 : 3}" stroke-dasharray="6 7" stroke-dashoffset="7" stroke-linecap="butt"/>` : ""}`;
    if (on && sel) lit += w; else wires += `<g opacity="${on ? 1 : 0.13}">${w}</g>`;
  });
  let strip = `<rect x="70" y="${SY0}" width="580" height="${SY1 - SY0}" rx="8" fill="#F4F5F7" stroke="#5B6573" stroke-width="2"/>`;
  let stripText = "";
  STRIP.forEach(([t, f]) => { const x = SX(t); strip += `<rect x="${x - 22}" y="${SY0 + 6}" width="44" height="${SY1 - SY0 - 12}" rx="4" fill="#2B2F36"/>` + screw(x, SY0 + 18) + screw(x, SY1 - 18) + `<text x="${x}" y="${SY0 + 36}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${t}</text>`;
    const tw = f.length * 6.6 + 10; stripText += `<rect x="${x - tw / 2}" y="${SY1 + 6}" width="${tw}" height="17" rx="4" fill="#FFFFFF" stroke="#8993A1"/><text x="${x}" y="${SY1 + 19}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#101820">${f}</text>`; });
  stripText += `<rect x="190" y="${SY0 - 26}" width="340" height="20" rx="5" fill="#FFFFFF" stroke="#8993A1"/><text x="360" y="${SY0 - 11}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#101820">WIRING CENTRE – example numbering, label yours to match</text>`;
  const devs = Object.entries(D).map(([k, d]) => devicePic(k, d)).join("");
  return `<svg viewBox="0 0 720 800" role="img" aria-label="${plan === "y" ? "Y-plan" : "S-plan"} wiring: each component's cores to the wiring centre" font-family="Barlow, Arial, sans-serif"><rect width="720" height="800" rx="14" fill="#E9EDF2"/>${strip}${wires}${devs}${lit}${stripText}</svg>`;
}
function wiringList(plan, sel){
  const P = PLAN[plan], D = P.devices;
  return Object.entries(D).filter(([k]) => !sel || sel === k).map(([k, d]) => {
    const rows = P.conns.filter(c => c[0] === k).map(([, term, col, to, what]) => `<tr><td><span class="wsw${col === "ge" ? " ge" : ""}" style="--w:${COL[col]}"></span>${d.side === "lead" ? COLNAME[col] : `<b>${term}</b> <span class="muted">(${COLNAME[col]})</span>`}</td><td><b>${to}</b> ${STRIP.find(s => s[0] === to)[1]}</td><td>${what}</td></tr>`).join("");
    return `<div class="wlist${sel === k ? " on" : ""}"><h4>${d.name}${d.side === "lead" ? " – flying lead" : ""}</h4><div class="tscroll"><table><tr><th>${d.side === "lead" ? "Core" : "Terminal (core)"}</th><th>Goes to</th><th>Does</th></tr>${rows}</table></div></div>`;
  }).join("") + `<p class="small muted">${P.unused}</p>`;
}
window.BF_WIRING = function(plan, sel, zoom){
  const D = PLAN[plan].devices; if (sel && !D[sel]) sel = null;
  const chips = `<div class="chips wchips"><button class="chip small" data-act="wireSel" data-dev="" aria-pressed="${!sel}">Everything</button>${Object.entries(D).map(([k, d]) => `<button class="chip small" data-act="wireSel" data-dev="${k}" aria-pressed="${sel === k}">${d.name.replace(" (Y-plan)", "")}</button>`).join("")}</div>`;
  return `<div class="wreal">${chips}<div class="wpic${zoom ? " zoom" : ""}">${wiringSvg(plan, sel)}</div>
    <div class="row"><button class="btn ghost sm" data-act="wireZoom">${zoom ? "Fit to screen" : "Enlarge to zoom"}</button><span class="small muted">Tap a part to show only its wires.</span></div>
    <p class="small muted">Valve, pump and supply cores are the makers' colours. Stat and programmer cable cores are examples (3-core + earth flex): any core can be used, so sleeve and label them.</p>
    <h3 class="wh">Which colour goes where</h3>${wiringList(plan, sel)}</div>`;
};

const faults = (items) => items.map(([q, a]) => `<details class="fault"><summary>${q}</summary><div>${a}</div></details>`).join("");

const CH = [
 {id:"heat-y", g:"Heating controls", t:"Y-plan (3-port mid-position valve)", h:`
<p><b>What it is:</b> one 3-port mid-position valve (e.g. Honeywell V4073A) sends boiler water to heating (port A), hot water (port B) or both. Common in older UK homes with a vented or unvented cylinder.</p>
<p><b>How the valve moves</b></p>
<ul>
<li><b>No power:</b> spring returns it to hot water only (B).</li>
<li><b>White only</b> (room stat calling, cylinder still wants heat): mid position, both A and B.</li>
<li><b>White + grey</b> (room stat calling, cylinder satisfied or HW timed off): heating only (A).</li>
<li><b>Orange</b> is live out when the valve is at heating: it fires the boiler and pump. On hot water alone, the cylinder stat's call terminal fires them directly.</li>
</ul>
{{WIRING:y}}
<p><b>Y-plan must have a programmer with a HW OFF terminal (1).</b> Without it the grey never gets told hot water is off, so the valve sits in mid position and heats the cylinder all the time the heating is on.</p>
<p><b>Y-plan specific faults</b></p>
${faults([
 ["Heating only works if hot water is on too", "Valve can't reach heating-only. Check 230 V on <b>white</b> when the room stat calls, and 230 V on <b>grey</b> when HW is off or satisfied. No grey = missing HW OFF link or cylinder stat 2 not connected. Both present but no movement = valve motor or microswitch."],
 ["Cylinder keeps heating when HW is off", "Valve stuck in mid or B position: motor head failed, synchronous motor seized, or spindle stiff. Check the manual lever moves freely. Also check programmer HW OFF (1) reaches grey."],
 ["Heating on but boiler doesn't fire", "With valve at heating, <b>orange</b> must be live. White live and valve moved but no 230 V on orange = microswitch in the motor head."],
])}
<p class="small muted">Source convention: Honeywell/Resideo V4073A. Some older valves (e.g. Sunvic, ACL) use different colours – use the label.</p>`},

 {id:"heat-s", g:"Heating controls", t:"S-plan and S-plan plus (2-port valves)", h:`
<p><b>What it is:</b> a separate 2-port zone valve (e.g. Honeywell V4043H) for heating and for hot water. Each valve opens on its own stat and, once fully open, closes a switch that fires the boiler and pump. <b>S-plan plus</b> adds a valve and room stat per extra zone (e.g. upstairs / downstairs); new builds over 150 m² normally need separate heating zones.</p>
{{WIRING:s}}
<p><b>Adding a zone (S-plan plus):</b> new room stat COM from CH ON (or a separate programmer channel), its call to the new valve's brown, grey to L, orange to boiler SL, blue to N.</p>
<p><b>S-plan specific faults</b></p>
${faults([
 ["Boiler runs with nothing calling", "A valve's end switch is stuck closed or the valve is stuck open with the switch made. Disconnect oranges one at a time at the wiring centre until the boiler stops – that's the valve. A new motor head usually fixes it."],
 ["One zone never heats", "Stat calling? 230 V on that valve's <b>brown</b>. Brown live but valve doesn't open (lever won't move to open by itself) = motor head. Opens but boiler doesn't fire = end switch (no 230 V on its orange with grey live)."],
 ["Valve hums, doesn't open", "Motor stalling on a stiff spindle. Isolate, pull the head, try the spindle by hand. Stiff spindle = valve body (drain down, or freeze kit). Free spindle = motor head."],
])}`},

 {id:"heat-wiring", g:"Heating controls", t:"Programmer, stats and boiler wiring", h:`
<p><b>Supply:</b> heating controls normally run from a <b>3 A fused connection unit</b> near the boiler, on its own or from a suitable circuit. Isolate there – and remember a boiler can have a second supply (e.g. a separate pump or immersion circuit).</p>
<p><b>Programmer standard backplate</b> (the common UK "universal" plate used by Honeywell, Drayton, Danfoss, Salus and others):</p>
<div class="tscroll"><table>
<tr><th>Terminal</th><th>Does</th></tr>
<tr><td>L / N</td><td>Supply from the 3 A spur</td></tr>
<tr><td>1</td><td>HW OFF – live when hot water is off (Y-plan grey; spare on S-plan)</td></tr>
<tr><td>2</td><td>CH OFF – live when heating is off (rarely used)</td></tr>
<tr><td>3</td><td>HW ON – live when hot water is timed on</td></tr>
<tr><td>4</td><td>CH ON – live when heating is timed on</td></tr>
</table></div>
<p>Switching is at 230 V: in each channel the live goes to either ON or OFF. Some plates have a link or switch for <b>pumped / gravity</b> and a <b>combi / single channel</b> setting – match it to the system.</p>
<p><b>Room stats</b></p>
<ul>
<li><b>Mechanical (2 or 3 wire):</b> COM / L in, call-for-heat out, and sometimes N for the accelerator (anticipator) resistor. Terminal numbers differ by make – find "call for heat" (closes on temperature fall).</li>
<li><b>Programmable / smart with a receiver</b> (Hive, Nest, tado°, Drayton Wiser…): the receiver usually replaces the programmer and uses the same 1–4 backplate. Battery room units need no wiring.</li>
<li><b>Frost stat:</b> wired in parallel with the room stat and programmer so it can call for heat whatever the time clock says.</li>
</ul>
<p><b>Cylinder stat</b> (e.g. Honeywell L641A): <b>C</b> live in, <b>1</b> call for heat (closes as the cylinder cools), <b>2</b> satisfied (closes when hot). Unvented cylinders also have a high-limit stat wired to cut the HW valve – leave it in circuit.</p>
<p><b>Boiler terminals</b></p>
<ul>
<li><b>L, N, E</b> – permanent supply. <b>SL</b> (switched live) – the demand signal from the valves or stats.</li>
<li><b>Pump overrun:</b> the boiler keeps its permanent live and runs the pump after the burner stops, so the pump is wired to the boiler's pump terminals, not straight to the SL. Some wiring centres need a link cut for this.</li>
<li><b>Combi and system boilers:</b> often have a link between L and SL (or a volt-free pair) that is removed when an external stat or programmer is fitted.</li>
<li><b>Low-voltage and OpenTherm terminals</b> (often marked 24 V, OT or with a 2-wire bus): <b>never put 230 V on them</b>. Smart stats using OpenTherm connect here instead of the SL.</li>
<li>Stay on the boiler's external wiring terminals. Anything behind the sealed combustion case is <b>Gas Safe</b> work.</li>
</ul>
<p><b>Cable colours you'll meet</b></p>
<ul>
<li>Current: ${sw("brown","brown")} L, ${sw("blue","blue")} N, ${ge} E. Before 2004–2006: red L, black N.</li>
<li>Heating flex and 3-core + E: switched lives are often ${sw("black","black")}, ${sw("grey","grey")} or ${sw("brown","brown")} – sleeve or tag them so the next person knows. Valve and pump leads keep the maker's colours.</li>
<li>Photograph every terminal before you disconnect anything.</li>
</ul>`},

 {id:"heat-centre", g:"Heating controls", t:"Wiring centres", h:`
<p><b>What it is:</b> a junction box with a numbered terminal strip (Honeywell Sundial, Drayton, Danfoss, Salus, or a plain 10-way box) where every control cable meets. It does no switching of its own.</p>
<ul>
<li><b>Numbering varies by make.</b> Terminal 5 on one brand is not terminal 5 on another. Work by function: find Mains L, N, E, CH ON, HW ON, HW OFF, CH call, HW call and boiler SL on the label in the lid, then use the Y-plan or S-plan tables.</li>
<li><b>Links to cut:</b> some printed-circuit wiring centres have small links you cut for Y-plan or S-plan and for pump-overrun boilers. Follow the diagram in the lid exactly.</li>
<li><b>Identifying an unlabelled centre:</b> with the power on and a GS38 tester, time the heating on with HW off (and the reverse) and find which terminal goes live. Turn the room stat up and down to find CH call. Write the functions on the lid.</li>
<li><b>Several cables per terminal</b> is normal (e.g. every neutral). Use proper terminals, not twisted joints, and keep earths continuous to every item.</li>
<li><b>Lid label:</b> after any change, write the plan type (Y / S / S plus), pump overrun yes/no, and the date.</li>
</ul>`},

 {id:"heat-faults", g:"Heating controls", t:"Heating fault finding", h:`
<p><b>Method:</b> follow the live through the chain – programmer → stat → valve → valve switch → boiler SL – checking for 230 V at each step at the wiring centre. Safe isolation before touching anything; live testing with GS38 probes only.</p>
<p class="small muted">Tap a symptom.</p>
${faults([
 ["No heating, hot water fine", "<ol><li>Programmer CH on? 230 V on <b>CH ON (4)</b>.</li><li>Room stat turned up: 230 V on <b>CH call</b>.</li><li>Valve moves? (Y: white live; S: CH valve brown live.)</li><li>Valve switch: 230 V on <b>orange</b> → boiler SL.</li><li>Boiler SL live but no fire = boiler fault (Gas Safe).</li></ol>"],
 ["No hot water, heating fine", "<ol><li>230 V on <b>HW ON (3)</b>.</li><li>Cylinder stat turned up: 230 V on stat <b>1</b>.</li><li>Y-plan: valve should rest at HW; with no white it goes there by spring. S-plan: HW valve brown live, then its orange.</li><li>Unvented: has the high-limit stat tripped? Reset only after finding why.</li></ol>"],
 ["Nothing works at all", "3 A fuse in the spur, supply to the spur (RCD/MCB), programmer display blank (supply or dead programmer), frost/pipe stat wiring, boiler lockout or low pressure (check the gauge – usually 1–1.5 bar cold)."],
 ["Boiler or pump won't turn off", "Something is holding the SL live: stuck valve end switch (S-plan), valve stuck open, SL linked to L at the boiler or wiring centre, or a failed stat stuck calling. Lift oranges / stat outputs one at a time."],
 ["Pump runs all the time", "Pump wired to permanent L instead of SL or the boiler pump terminals, pump-overrun link not cut, or a valve switch stuck closed. Pump overrun running for a few minutes after the burner stops is normal."],
 ["Radiators warm when heating is off", "Heating valve passing (worn seat or stuck open), gravity circulation on an open-vented system, or a Y-plan valve stuck at mid. Check with the valve's lever and feel the pipes each side."],
 ["RCD or fuse trips", "Isolate, then insulation test each item on its own: pump, each valve motor, cables. Disconnect the programmer, electronic stats and the boiler PCB before testing (or test at 250 V with L and N joined). Water in a wiring centre or a pump terminal box is common."],
 ["After changing the programmer nothing works", "Wrong plate or setting: pumped/gravity or combi jumper, missing HW OFF on Y-plan, or L and N swapped. Compare with your photos and the backplate diagram."],
 ["Room stat clicks but nothing happens", "Stat wired to the wrong output (satisfied instead of call), CH ON not live (time clock off), or the valve/boiler downstream – carry on down the chain."],
])}`},
];
window.BF_BOOK = (window.BF_BOOK || []).concat(CH);
})();
