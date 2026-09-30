/* Heating controls: Y-plan, S-plan, programmer / stat / boiler wiring, wiring centres, fault finding.
   Wiring centre terminal NUMBERS vary by make, so everything here is by FUNCTION. Valve colours are the Honeywell/Resideo
   convention (V4073A 3-port, V4043H 2-port), which most makes copy – always check the label on the valve in front of you. */
(function(){
const W = { brown:"#7B4A2A", blue:"#1F5FBF", grey:"#8C939C", orange:"#F08A24", white:"#FFFFFF", ge:"#3E9B3E", black:"#1B1F24" };
const sw = (c, name) => `<span class="wsw" style="--w:${W[c] || c}"></span>${name}`;
const ge = `<span class="wsw ge"></span>green/yellow`;
// one wire: dark underlay so white and grey show on the light plate, then the colour
const wire = (d, c) => `<path d="${d}" fill="none" stroke="#2B2F36" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${W[c]}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>`;
const box = (x, y, w, h, name, sub) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#FFFFFF" stroke="#44505F" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + (sub ? 20 : h / 2 + 5)}" text-anchor="middle" font-size="13" font-weight="700" fill="#101820">${name}</text>${sub ? `<text x="${x + w / 2}" y="${y + 36}" text-anchor="middle" font-size="10.5" fill="#44505F">${sub}</text>` : ""}`;
const tag = (x, y, t, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" font-size="10.5" font-weight="700" fill="#101820">${t}</text>`;
const lbl = (x, y, t, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "start"}" font-size="10.5" font-style="italic" fill="#44505F">${t}</text>`;
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#101820"/>`;
const plate = (h, body, alt) => `<figure class="wdia"><svg viewBox="0 0 360 ${h}" role="img" aria-label="${alt}" font-family="Barlow, Arial, sans-serif"><rect x="0" y="0" width="360" height="${h}" rx="12" fill="#EEF2F6"/>${body}</svg><figcaption>Switched lives only. Every item's neutral (blue) and earth (green/yellow) go to the N and E terminals – not drawn. Check the label on the valve and stats you are working on.</figcaption></figure>`;

const Y_DIAGRAM = plate(420,
  box(20, 14, 320, 40, "Programmer", "") +
  tag(81, 72, "4 CH ON", "start") + tag(156, 72, "1 HW OFF", "start") + tag(221, 72, "3 HW ON", "start") +
  wire("M75 54 V104", "brown") + wire("M215 54 V104", "brown") +
  box(30, 104, 90, 48, "Room stat", "COM → call") +
  box(175, 104, 90, 48, "Cyl stat", "C · 1 call · 2 sat") +
  wire("M150 54 V132", "grey") + wire("M175 132 H150", "grey") + dot(150, 132) +
  wire("M150 132 V228", "grey") + lbl(156, 200, "grey") +
  wire("M75 152 V228", "white") + lbl(81, 200, "white") +
  wire("M265 122 H318 V318", "brown") + lbl(272, 116, "1 call") + lbl(180, 165, "2 satisfied") +
  box(20, 228, 220, 56, "3-port mid-position valve", "rest: HW · white: both · white+grey: CH") +
  wire("M240 262 H318", "orange") + dot(318, 262) + lbl(250, 256, "orange") +
  wire("M318 318 V330 M210 330 H318", "orange") + wire("M210 330 V346", "orange") + wire("M318 330 V346", "orange") +
  box(160, 346, 100, 40, "Boiler SL", "") + box(280, 346, 70, 40, "Pump L", "") +
  lbl(20, 408, "Brown = live feeds the stats receive; grey, white, orange = valve leads."),
  "Y-plan wiring: programmer CH ON to room stat, room stat call to valve white; HW ON to cylinder stat; cylinder stat satisfied and programmer HW OFF to valve grey; cylinder stat call and valve orange to boiler and pump.");

const S_DIAGRAM = plate(420,
  box(20, 14, 320, 40, "Programmer", "") +
  tag(81, 72, "4 CH ON", "start") + tag(261, 72, "3 HW ON", "start") +
  wire("M75 54 V96", "brown") + wire("M255 54 V96", "brown") +
  box(30, 96, 90, 48, "Room stat", "COM → call") + box(210, 96, 90, 48, "Cyl stat", "C → 1 call") +
  wire("M75 144 V188", "brown") + wire("M255 144 V188", "brown") + lbl(81, 172, "brown") + lbl(261, 172, "brown") +
  box(20, 188, 120, 52, "CH zone valve", "2-port") + box(200, 188, 120, 52, "HW zone valve", "2-port") +
  wire("M45 240 V282", "grey") + wire("M225 240 V282", "grey") +
  wire("M115 240 V326", "orange") + wire("M295 240 V326", "orange") +
  wire("M20 282 H107 a8 8 0 0 1 16 0 H287 a8 8 0 0 1 16 0 H340", "brown") + dot(45, 282) + dot(225, 282) + tag(205, 304, "Permanent L (mains L)", "middle") + lbl(121, 262, "orange") + lbl(301, 262, "orange") + lbl(51, 262, "grey") + lbl(231, 262, "grey") +
  wire("M115 326 H295", "orange") + dot(115, 326) + dot(295, 326) + wire("M170 326 V350", "orange") + wire("M260 326 V350", "orange") +
  box(120, 350, 100, 40, "Boiler SL", "") + box(230, 350, 70, 40, "Pump L", "") +
  lbl(20, 408, "Each valve's grey–orange switch closes when the valve is fully open."),
  "S-plan wiring: CH ON to room stat, room stat call to CH valve brown; HW ON to cylinder stat, cylinder stat call to HW valve brown; both valve greys to permanent live; both oranges to boiler and pump.");

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
${Y_DIAGRAM}
<p><b>Valve leads</b>: ${sw("white","white")} CH call · ${sw("grey","grey")} HW satisfied / off · ${sw("orange","orange")} live out to boiler and pump · ${sw("blue","blue")} neutral · ${ge} earth.</p>
<p><b>Wiring centre, by function</b> (the numbers on the terminal strip vary by make – match these to the label in the lid):</p>
<div class="tscroll"><table>
<tr><th>Terminal does</th><th>What lands on it</th></tr>
<tr><td>Mains L</td><td>${sw("brown","L")} from the 3 A fused spur, programmer L, boiler permanent L (pump overrun boilers)</td></tr>
<tr><td>Mains N</td><td>${sw("blue","N")} from the spur, programmer N, valve ${sw("blue","blue")}, boiler N, pump N, room stat N if it needs one</td></tr>
<tr><td>Earth</td><td>Every earth: spur, valve ${ge}, pump, boiler, stats, cable cpcs</td></tr>
<tr><td>CH ON</td><td>Programmer <b>4</b>, room stat COM (live in)</td></tr>
<tr><td>HW ON</td><td>Programmer <b>3</b>, cylinder stat <b>C</b></td></tr>
<tr><td>HW OFF / satisfied</td><td>Programmer <b>1</b>, cylinder stat <b>2</b> (satisfied), valve ${sw("grey","grey")}</td></tr>
<tr><td>CH call</td><td>Room stat call-for-heat terminal, valve ${sw("white","white")}</td></tr>
<tr><td>Boiler &amp; pump SL</td><td>Cylinder stat <b>1</b> (call), valve ${sw("orange","orange")}, boiler switched live, pump L (or the boiler's pump terminals on a pump-overrun boiler)</td></tr>
<tr><td>Not used</td><td>Programmer <b>2</b> (CH OFF)</td></tr>
</table></div>
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
${S_DIAGRAM}
<p><b>Valve leads</b>: ${sw("brown","brown")} motor live in (from the stat) · ${sw("blue","blue")} motor neutral · ${sw("grey","grey")} and ${sw("orange","orange")} the end switch – grey to permanent live, orange out to boiler and pump · ${ge} earth. Some valves have a white instead of grey – it does the same job; check the label.</p>
<p><b>Wiring centre, by function</b>:</p>
<div class="tscroll"><table>
<tr><th>Terminal does</th><th>What lands on it</th></tr>
<tr><td>Mains L</td><td>${sw("brown","L")} from the 3 A fused spur, programmer L, <b>every valve ${sw("grey","grey")}</b>, boiler permanent L (pump overrun)</td></tr>
<tr><td>Mains N</td><td>Spur N, programmer N, every valve ${sw("blue","blue")}, boiler N, pump N, room stat N if needed</td></tr>
<tr><td>Earth</td><td>Every earth, including each valve's ${ge}</td></tr>
<tr><td>CH ON</td><td>Programmer <b>4</b>, room stat COM (every zone's room stat on S-plan plus)</td></tr>
<tr><td>HW ON</td><td>Programmer <b>3</b>, cylinder stat <b>C</b></td></tr>
<tr><td>CH call</td><td>Room stat call-for-heat, CH valve ${sw("brown","brown")} (one terminal per zone)</td></tr>
<tr><td>HW call</td><td>Cylinder stat <b>1</b>, HW valve ${sw("brown","brown")}</td></tr>
<tr><td>Boiler &amp; pump SL</td><td>Every valve ${sw("orange","orange")}, boiler switched live, pump L (or boiler pump terminals)</td></tr>
<tr><td>Not used</td><td>Programmer <b>1</b> and <b>2</b> (the OFF terminals), cylinder stat <b>2</b></td></tr>
</table></div>
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
