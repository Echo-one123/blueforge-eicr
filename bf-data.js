/* BlueForge EICR – reference content: coding guide + on-site handbook.
   Coding guide: typical classifications, paraphrased from the industry consensus in
   Electrical Safety First / NICEIC Best Practice Guide 4 (Issue 7). The inspector's judgement always decides. */
window.BF_CODES = [
 // ---- C1 danger present
 {c:"C1", g:"Danger present", t:"Accessible live parts – broken accessory, cracked socket or switch exposing live terminals", k:"socket switch cracked broken face plate exposed live terminals damaged accessory"},
 {c:"C1", g:"Danger present", t:"Live conductors with missing or damaged insulation that can be touched", k:"bare live conductor insulation damaged exposed copper"},
 {c:"C1", g:"Danger present", t:"Missing blanks in the consumer unit / distribution board – live parts accessible through the gap", k:"blank blanks missing consumer unit board gap busbar ip2x ip4x"},
 {c:"C1", g:"Danger present", t:"Live terminations or connections not in any enclosure (e.g. terminal block hanging in a void, exposed joints)", k:"unenclosed joint connection terminal block choc block taped joint no enclosure"},
 {c:"C1", g:"Danger present", t:"Metalwork or exposed-conductive-parts live because of a fault", k:"live metalwork casing live fault touch voltage shock"},
 {c:"C1", g:"Danger present", t:"Incorrect polarity at the origin of the installation", k:"polarity reversed origin supply cut out incoming"},
 {c:"C1", g:"Danger present", t:"Severe damage to switchgear – fire damage, melted or burnt components with live parts exposed", k:"fire damage melted burnt board consumer unit arcing"},
 // ---- earthing
 {c:"C2", g:"Earthing", t:"No reliable and effective means of earthing for the installation", k:"no earth earthing absent missing main earth terminal met"},
 {c:"C2", g:"Earthing", t:"Gas, oil or metal water pipe being used as the means of earthing", k:"water pipe gas pipe used as earth electrode"},
 {c:"C2", g:"Earthing", t:"No circuit protective conductor on a circuit supplying Class I equipment or accessories", k:"no cpc lighting class i metal fitting no earth circuit"},
 {c:"C2", g:"Earthing", t:"Socket-outlet not earthed", k:"socket no earth unearthed"},
 {c:"C2", g:"Earthing", t:"Earthing conductor too small to survive a fault (fails the adiabatic check) or badly corroded", k:"earthing conductor undersized corroded 6mm small adiabatic"},
 {c:"C3", g:"Earthing", t:"No cpc on a lighting circuit where every fitting is Class II and unlikely to be changed", k:"no cpc lighting class ii plastic fittings old lighting"},
 {c:"—",  g:"Earthing", t:"Metal back box without earth tail where the accessory makes no contact with it – non-compliance, no code", k:"back box earth fly lead tail metal box"},
 // ---- bonding
 {c:"C2", g:"Bonding", t:"Main protective bonding missing to an incoming service (water, gas, oil, structural steel)", k:"main bonding missing gas water oil no bond extraneous"},
 {c:"C2", g:"Bonding", t:"Main bonding conductor smaller than 6 mm² or showing heat damage", k:"main bonding undersized 4mm 2.5mm bonding small"},
 {c:"—",  g:"Bonding", t:"Main bonding 6 mm² or larger but below today's size (e.g. 6 mm² on PME needing 10 mm²), no damage – non-compliance, no code", k:"main bonding 6mm undersized pme 10mm"},
 {c:"C3", g:"Bonding", t:"Main bonding connections cannot be accessed for inspection or testing", k:"bonding clamp hidden inaccessible boxed in"},
 {c:"C3", g:"Bonding", t:"Main bonding connected to branch pipework where continuity back to the service cannot be relied on", k:"bonding branch pipework wrong position after meter 600mm"},
 {c:"C2", g:"Bathrooms", t:"Supplementary bonding missing in a bath/shower room where it is required (no 30 mA RCD protection on all circuits)", k:"supplementary bonding bathroom shower missing"},
 {c:"C2", g:"Bathrooms", t:"Socket-outlet (not a shaver or SELV supply) within 2.5 m horizontally of zone 1", k:"socket bathroom zone near bath shower"},
 {c:"C2", g:"Bathrooms", t:"No 30 mA RCD protection for socket circuits in a location containing a bath or shower", k:"rcd bathroom socket shower room"},
 {c:"C3", g:"Bathrooms", t:"No 30 mA RCD on other bathroom circuits (lighting, fan) where supplementary bonding is present and adequate", k:"rcd bathroom lighting fan extractor supplementary bonding present"},
 {c:"C2", g:"Bathrooms", t:"Equipment in a bathroom zone without the IP rating needed for its position", k:"ip rating bathroom zone fitting ipx4 ipx5 light fan"},
 // ---- RCD
 {c:"C2", g:"RCD", t:"No 30 mA RCD protection for socket-outlets that could supply portable equipment outdoors", k:"rcd outdoor socket garden garage kitchen door mobile equipment outside"},
 {c:"C3", g:"RCD", t:"No 30 mA RCD protection for general socket-outlets unlikely to be used for equipment outdoors (circuit otherwise satisfactory)", k:"rcd sockets general no rcd upstairs bedroom"},
 {c:"C3", g:"RCD", t:"No 30 mA RCD protection for cables concealed less than 50 mm deep in walls without other protection", k:"rcd concealed cables walls 50mm depth buried"},
 {c:"C3", g:"RCD", t:"No 30 mA RCD protection for lighting circuits in a dwelling", k:"rcd lighting circuit domestic house"},
 {c:"C3", g:"RCD", t:"Type AC RCD fitted where Type A (or better) is needed for the equipment supplied", k:"type ac rcd type a ev inverter induction hob"},
 {c:"C2", g:"RCD", t:"RCD fails to trip within the required time, or the test button does not operate it", k:"rcd fail trip time test button not working slow"},
 {c:"C2", g:"Protection", t:"Earth fault loop impedance too high for the device and no RCD providing fault protection", k:"zs high loop impedance exceeds maximum ads disconnection"},
 {c:"C2", g:"Protection", t:"Overcurrent device rated higher than the cable can carry (cable not protected)", k:"cable undersized overloaded breaker too big fuse too big 32a on 1.5"},
 {c:"C2", g:"Protection", t:"Fuse or single-pole device in the neutral conductor (double-pole fusing)", k:"fuse neutral double pole fusing old board"},
 {c:"C2", g:"Protection", t:"Recalled or known-faulty protective device installed", k:"recalled breaker rcbo faulty product recall"},
 {c:"—",  g:"Protection", t:"Rewireable (BS 3036) fuses or BS 3871 circuit-breakers giving adequate protection – not a defect in themselves", k:"rewireable fuse wylex bs3036 bs3871 old breaker"},
 {c:"C2", g:"TT systems", t:"TT installation where the main RCD / earth-leakage device fails its test", k:"tt rcd fail electrode earth leakage"},
 {c:"C3", g:"TT systems", t:"Voltage-operated earth-leakage circuit-breaker still relied on (and proved working)", k:"voelcb voltage operated elcb old tt"},
 // ---- wiring & connections
 {c:"C2", g:"Wiring & connections", t:"Poor connections – conductors not fully in terminals, clamped on insulation, loose or overheating", k:"loose connection overheating terminal insulation clamped poor termination"},
 {c:"C2", g:"Wiring & connections", t:"Borrowed neutral between circuits", k:"borrowed neutral shared neutral two way lighting different circuit"},
 {c:"C2", g:"Wiring & connections", t:"Ring final circuit conductor discontinuous, or ring cross-connected with another circuit", k:"ring broken open ring discontinuous cross connected interconnected"},
 {c:"C2", g:"Wiring & connections", t:"Insulation resistance below 1 MΩ", k:"insulation resistance low ir fail below 1"},
 {c:"FI", g:"Wiring & connections", t:"Insulation resistance low but cause not found within the agreed extent (e.g. appliances could not be disconnected)", k:"insulation low investigate appliances cannot disconnect"},
 {c:"C2", g:"Wiring & connections", t:"Insulation deteriorated or breaking away from conductors (e.g. old rubber cable)", k:"rubber cable vir perished insulation brittle old wiring"},
 {c:"C2", g:"Wiring & connections", t:"Cable sheath not taken into the accessory or enclosure so the cores are exposed and accessible", k:"sheath not into box cores exposed singles visible"},
 {c:"C3", g:"Wiring & connections", t:"Sheath stops short of the accessory but cores are not accessible", k:"sheath short cores not accessible"},
 {c:"C2", g:"Wiring & connections", t:"Unenclosed connections at luminaires", k:"light fitting connection unenclosed ceiling rose"},
 {c:"C2", g:"Wiring & connections", t:"Wiring not adequately supported in an escape route (risk of entanglement / early collapse in a fire)", k:"escape route cables support fire clips plastic trunking corridor"},
 {c:"C3", g:"Wiring & connections", t:"Cables or meter tails not adequately supported", k:"cables unsupported clips meter tails loose"},
 {c:"C3", g:"Wiring & connections", t:"Unsheathed flex used for pendant lighting", k:"pendant flex unsheathed lighting"},
 {c:"C3", g:"Wiring & connections", t:"Green/yellow conductor oversleeved and used as a line or neutral", k:"green yellow used as live oversleeved"},
 {c:"C3", g:"Wiring & connections", t:"External PVC cable with no sign of deterioration", k:"external cable outside pvc uv"},
 {c:"—",  g:"Wiring & connections", t:"Old cable colours (red/black) – no code on their own; add a mixed-colours notice where missing", k:"old colours red black mixed colours"},
 {c:"—",  g:"Wiring & connections", t:"Switch lines not identified as line conductors at terminations – non-compliance, no code", k:"switch line not sleeved brown blue"},
 {c:"FI", g:"Wiring & connections", t:"Test results that don't make sense for the circuit (e.g. R1+R2 far higher than expected) – investigate", k:"results unexpected investigate high r1 r2 inconsistent"},
 // ---- equipment
 {c:"C2", g:"Equipment", t:"Consumer unit with missing or insecure blanks (no live parts accessible)", k:"blanks insecure missing consumer unit"},
 {c:"C2", g:"Equipment", t:"Mixed-make devices in a board with heat damage, modifications, poor fit or wrong operation", k:"mixed breakers different make board heat damage"},
 {c:"C3", g:"Equipment", t:"Mixed-make devices in a board, no damage, secure and working correctly", k:"mixed breakers different manufacturer"},
 {c:"C2", g:"Equipment", t:"Equipment with an IP rating unsuitable for its location (water, dust, impact)", k:"ip rating outside wet dust enclosure"},
 {c:"C3", g:"Equipment", t:"Combustible (plastic) consumer unit under a staircase or in the only escape route of a dwelling", k:"plastic consumer unit under stairs escape route combustible"},
 {c:"—",  g:"Equipment", t:"Combustible consumer unit elsewhere in a dwelling – not coded", k:"plastic consumer unit combustible"},
 {c:"C3", g:"Equipment", t:"Socket-outlet mounted where the socket, plug or flex is likely to be damaged", k:"socket position skirting floor damage"},
 {c:"C2", g:"Equipment", t:"Immersion heater on a plastic cistern without the required thermal cut-out", k:"immersion heater plastic tank cistern"},
 // ---- fire & heat
 {c:"C2", g:"Fire & heat", t:"Signs of excessive heat – charring or discolouration at accessories or connections", k:"scorch burn marks charring heat discoloured"},
 {c:"C2", g:"Fire & heat", t:"Fire barrier breached by electrical work, or equipment installed so it is a fire risk", k:"fire barrier firestopping hole downlight insulation"},
 {c:"C2", g:"Fire & heat", t:"Lamps above rated wattage for the fitting or too close to combustible material", k:"lamp wattage bulb too big downlight combustible"},
 // ---- notices & records / newer requirements
 {c:"C3", g:"Notices & records", t:"No circuit chart or identification at the consumer unit", k:"circuit chart labels schedule identification missing"},
 {c:"C3", g:"Notices & records", t:"No 'Safety electrical connection – do not remove' label at earthing/bonding connections", k:"earth label safety electrical connection bonding label"},
 {c:"C3", g:"Notices & records", t:"No warning notice for an alternative or additional supply (e.g. solar PV, battery, generator)", k:"pv solar battery notice dual supply warning"},
 {c:"C3", g:"Notices & records", t:"Missing periodic inspection or RCD test notices", k:"notice periodic inspection rcd test label"},
 {c:"C3", g:"Newer requirements", t:"No SPD where BS 7671 would require one for this installation", k:"spd surge protection device missing"},
 {c:"C3", g:"Newer requirements", t:"No AFDDs in higher-risk residential buildings, HMOs, purpose-built student accommodation or care homes", k:"afdd arc fault hmo student care home"},
 {c:"—",  g:"Newer requirements", t:"No AFDDs in an ordinary dwelling – observation only, no code", k:"afdd arc fault house"},
 {c:"C3", g:"Newer requirements", t:"EV charger on a PME earth without the protection measures BS 7671 requires", k:"ev charger pme car charging earth open pen"},
 {c:"C3", g:"Newer requirements", t:"Type A/F RCD protecting an EV charge point without DC fault detection (RDC-DD)", k:"ev rdc-dd dc 6ma type a"},
 // ---- further investigation / limitations
 {c:"FI", g:"Further investigation", t:"Supply voltage or Ze outside what you'd expect – query with the DNO", k:"ze high voltage supply dno abnormal"},
 {c:"FI", g:"Further investigation", t:"Signs of a defect that couldn't be traced within the agreed extent (e.g. tripping, damage behind finishes)", k:"trip tripping unknown cause water ingress investigate"},
 {c:"LIM", g:"Further investigation", t:"Areas not accessible (locked rooms, loft, under floors) – record as a limitation, not a code", k:"inaccessible locked loft floorboards limitation"},
 // ---- not defects
 {c:"✓", g:"Not defects", t:"No bonding to metal sinks, baths or boiler pipework that aren't extraneous-conductive-parts", k:"sink bath bonding boiler pipework myth"},
 {c:"✓", g:"Not defects", t:"Shaver supply unit to BS EN 61558-2-5 in zone 2 away from direct spray", k:"shaver socket zone 2 bathroom"},
 {c:"✓", g:"Not defects", t:"No internal barriers in a consumer unit whose cover needs a key or tool to remove", k:"consumer unit barriers cover"},
 {c:"✓", g:"Not defects", t:"Socket-outlets or fused spurs without switches", k:"unswitched socket spur switch"},
 {c:"✓", g:"Not defects", t:"Installation not divided into as many circuits as a new one would be", k:"circuits division few circuits"},
];

window.BF_BOOK = [
 {id:"isolation", t:"Safe isolation", h:`
<ol>
<li>Identify the circuit or equipment and get permission to isolate.</li>
<li>Prove your approved voltage indicator (GS38 leads/probes) on a proving unit or known live source.</li>
<li>Isolate using a device that is suitable for isolation. Lock it off, keep the key, and fit a warning notice.</li>
<li>Test between all conductors at the point of work: L–N, L–E, N–E (and all lines on three-phase).</li>
<li>Re-prove the voltage indicator on the proving unit.</li>
<li>Only then start work. Remember neutrals can carry current from other circuits (borrowed neutrals) and there may be more than one supply (PV, batteries, generators).</li>
</ol>`},
 {id:"sequence", t:"Test sequence", h:`
<p><b>Dead tests</b> (supply isolated):</p>
<ol><li>Continuity of protective conductors – main and supplementary bonding, R1+R2 or R2 for every circuit.</li>
<li>Continuity of ring final circuit conductors (end-to-end r1, rn, r2, then cross-connect).</li>
<li>Insulation resistance.</li>
<li>Protection by separation (SELV/PELV, electrical separation) where used.</li>
<li>Polarity (by continuity).</li>
<li>Earth electrode resistance (TT) – loop tester method or dedicated tester.</li></ol>
<p><b>Live tests</b>:</p>
<ol start="7"><li>Earth fault loop impedance – Ze at the origin (main earth disconnected, then reconnected!), Zs per circuit.</li>
<li>Prospective fault current – record the higher of PSCC and PEFC.</li>
<li>Check of phase sequence (three-phase).</li>
<li>RCD operation, then the test button.</li>
<li>AFDD test button, functional checks of switchgear and controls.</li>
<li>Voltage drop – where needed, usually by calculation.</li></ol>`},
 {id:"continuity", t:"Continuity & ring finals", h:`
<p><b>R1+R2</b>: link line to cpc at the board, measure line–cpc at each point. Highest reading (usually the far end) is recorded. Null your leads first.</p>
<p><b>Ring final – three steps</b></p>
<ol><li>End-to-end: measure r1 (lines), rn (neutrals), r2 (cpcs). r1 and rn should be within 0.05 Ω. For 2.5/1.5 T&amp;E, r2 ≈ 1.67 × r1.</li>
<li>Cross-connect L to N (opposite ends). Reading at each socket should be about (r1+rn)/4 and the same everywhere. A higher reading at one socket suggests a spur or a poor connection.</li>
<li>Cross-connect L to cpc. Reading at each socket ≈ (r1+r2)/4 – this is your R1+R2 for the circuit. A steadily rising reading means you have crossed the wrong ends.</li></ol>
<p><b>Resistance of copper conductors at 20 °C</b> (mΩ/m): the table below. Multiply R1+R2 by 1.2 for design at 70 °C (thermoplastic), or use the 80% rule on measured Zs.</p>
{{RES_TABLE}}`},
 {id:"ir", t:"Insulation resistance", h:`
<table><tr><th>Circuit</th><th>Test voltage</th><th>Minimum</th></tr>
<tr><td>SELV and PELV</td><td>250 V d.c.</td><td>0.5 MΩ</td></tr>
<tr><td>Up to and including 500 V (normal 230/400 V)</td><td>500 V d.c.</td><td>1.0 MΩ</td></tr>
<tr><td>Above 500 V</td><td>1000 V d.c.</td><td>1.0 MΩ</td></tr></table>
<ul><li>Readings under 2 MΩ are worth investigating even though they pass – they often point to a latent fault or a damp accessory.</li>
<li>Before testing: disconnect or protect SPDs, electronic equipment, dimmers, PIRs, LED drivers, smoke alarms and anything that could be damaged or give a false low reading. If they can't be disconnected, test L+N together to earth (a 250 V test may be used where SPDs can't be removed – record it).</li>
<li>Test L–N, L–E, N–E (or L+N to E), with the main switch off, all lamps removed where practical and all circuit switches on.</li>
<li>Low reading on a whole board? Split it circuit by circuit to find the culprit.</li></ul>`},
 {id:"zs", t:"Max Zs tables", h:`<p>Tabulated values (BS 7671 Tables 41.2–41.4, Cmin 0.95) and the 80% figure to compare with readings taken at normal room temperature. Choose a device:</p>{{ZS_TABLE}}`},
 {id:"disconnect", t:"Disconnection times", h:`
<table><tr><th>Circuit</th><th>TN (TN-S, TN-C-S)</th><th>TT</th></tr>
<tr><td>Final circuits up to 63 A with sockets, and up to 32 A supplying fixed equipment</td><td>0.4 s</td><td>0.2 s</td></tr>
<tr><td>Distribution circuits and other final circuits</td><td>5 s</td><td>1 s</td></tr></table>
<p>For TT, disconnection is normally achieved by an RCD: RA × IΔn ≤ 50 V. For a 30 mA RCD that allows up to 1667 Ω, but aim for 200 Ω or less – higher values may not stay stable through the seasons.</p>`},
 {id:"rcd", t:"RCDs", h:`
<p><b>30 mA additional protection is needed for:</b></p>
<ul><li>Socket-outlets rated up to 32 A (exceptions only with a documented risk assessment, not in dwellings).</li>
<li>Mobile equipment used outdoors, rated up to 32 A.</li>
<li>Cables concealed in walls or partitions at less than 50 mm depth, unless otherwise protected (earthed metal covering, conduit etc.).</li>
<li>AC final circuits supplying luminaires in domestic premises.</li>
<li>All circuits in a location containing a bath or shower.</li></ul>
<p><b>Test limits</b></p>
<table><tr><th>Type</th><th>At 1 × IΔn</th><th>At 5 × IΔn (if tested)</th></tr>
<tr><td>General (non-delay)</td><td>≤ 300 ms</td><td>≤ 40 ms</td></tr>
<tr><td>S-type (time-delayed)</td><td>130–500 ms</td><td>≤ 150 ms</td></tr></table>
<p><b>Types</b>: AC – sinusoidal AC only. A – also pulsating DC (most electronics, induction hobs, washing machines). F – A plus mixed frequencies (inverter-driven appliances). B – also smooth DC (some EV chargers, PV inverters, three-phase drives). Type AC should no longer be used where equipment is likely to produce DC components.</p>`},
 {id:"bonding", t:"Earthing & bonding sizes", h:`
<p><b>Earthing conductor</b> (copper, same material as the line conductor): line up to 16 mm² → same size; 16–35 mm² → 16 mm²; over 35 mm² → half the line size. Buried earthing conductors have their own minimums.</p>
<p><b>Main protective bonding</b></p>
<table><tr><th>Supply neutral (≈ tails)</th><th>PME: main bonding</th></tr>
<tr><td>35 mm² or less</td><td>10 mm²</td></tr><tr><td>over 35 up to 50 mm²</td><td>16 mm²</td></tr>
<tr><td>over 50 up to 95 mm²</td><td>25 mm²</td></tr><tr><td>over 95 up to 150 mm²</td><td>35 mm²</td></tr><tr><td>over 150 mm²</td><td>50 mm²</td></tr></table>
<p>Not PME: at least half the earthing conductor size, minimum 6 mm², need not exceed 25 mm². The DNO may ask for more – check their requirements.</p>
<p><b>Bonding position</b>: as near as practicable to the point of entry, within 600 mm of the meter outlet union or at the point of entry if the meter is internal, on the consumer's side before any branch.</p>
<p><b>Supplementary bonding</b>: 2.5 mm² if mechanically protected, 4 mm² if not (copper).</p>`},
 {id:"bathrooms", t:"Bath & shower rooms", h:`
<ul><li><b>Zone 0</b>: inside the bath or shower tray.</li>
<li><b>Zone 1</b>: above zone 0 up to 2.25 m from the floor (or the shower head if higher, up to 2.25 m), within the bath's edges; for a walk-in shower, within 1.2 m of the fixed water outlet.</li>
<li><b>Zone 2</b>: 0.6 m horizontally beyond zone 1, up to 2.25 m high.</li>
<li>All circuits in the room – and those passing through it – need 30 mA RCD protection.</li>
<li>Equipment in zones 1 and 2 at least IPX4 (IPX5 where water jets are used for cleaning).</li>
<li>Socket-outlets (other than shaver units and SELV) must be at least 2.5 m horizontally from the boundary of zone 1.</li>
<li>Supplementary bonding can be left out if: every circuit has 30 mA RCD protection, all circuits meet ADS disconnection times, and all extraneous-conductive-parts are effectively connected to the main bonding.</li></ul>`},
 {id:"zones", t:"Concealed cables", h:`
<p>Cables concealed in walls or partitions should run in the <b>prescribed zones</b>:</p>
<ul><li>Within 150 mm of the top of the wall (ceiling line) or of a corner formed by two walls.</li>
<li>Horizontally or vertically in line with an accessory, switch, socket or point.</li></ul>
<p>If a cable is less than 50 mm from the surface it also needs 30 mA RCD protection, or an earthed metallic covering / conduit / trunking, or mechanical protection against nails and screws. Partitions with metal parts need these measures whatever the depth.</p>`},
 {id:"cables", t:"Cable selection", h:`
<ul><li><b>Ib ≤ In ≤ Iz</b> – design current ≤ device rating ≤ corrected cable capacity.</li>
<li><b>It ≥ In ÷ (Ca × Cg × Ci × Cc)</b> – Ca ambient temperature, Cg grouping, Ci thermal insulation, Cc 0.725 for BS 3036 fuses, 0.9 for cables buried in the ground.</li>
<li><b>Voltage drop</b> (public LV supply): lighting 3% = 6.9 V; other uses 5% = 11.5 V, at 230 V.</li>
<li>VD = mV/A/m × Ib × L ÷ 1000.</li></ul>
<p>Use the calculators below for voltage drop, adiabatic check and design current. Always check capacities against BS 7671 Appendix 4 for the installation method.</p>`},
 {id:"adiabatic", t:"Adiabatic check", h:`
<p><b>S = √(I²t) ÷ k</b> – minimum cpc size (mm²).</p>
<ul><li>I = fault current: Uo × Cmin ÷ Zs (≈ 218.5 ÷ Zs)</li>
<li>t = disconnection time of the device at that current (from its time/current curve). For MCBs in the instantaneous region, 0.1 s is commonly used.</li>
<li>k: 115 for a copper cpc that is a core in a 70 °C thermoplastic (PVC) cable such as T&amp;E; 143 for a separate 70 °C thermoplastic-insulated copper cpc; 176 for a separate 90 °C thermosetting copper cpc.</li></ul>
<p>If the cpc is at least the size in Table 54.7 (same size as line up to 16 mm², etc.) the check isn't needed.</p>`},
 {id:"notify", t:"Notifiable work (Wales)", h:`
<p>You're not on a competent person scheme, so notifiable work must go to building control (building notice or full plans) <b>before</b> you start. In Wales that includes:</p>
<ul><li>Any new circuit.</li><li>Replacing a consumer unit.</li>
<li>Adding to a circuit in a <b>kitchen</b>, or in a special location (bath/shower room, swimming pool, sauna).</li>
<li>Special installations: outdoor lighting or power, garden/outbuilding wiring, floor or ceiling heating, solar PV, micro-CHP, extra-low-voltage lighting that isn't a pre-assembled kit.</li>
<li>New wiring to detached garages or sheds, external wall sockets, new central heating control wiring.</li></ul>
<p><b>Not notifiable</b>: like-for-like replacement of accessories; replacing a damaged cable on the same route; adding sockets or lights to an existing circuit outside kitchens and special locations; installing or upgrading bonding; adding mechanical protection.</p>
<p class="muted">Source: Welsh Government Approved Document P. Check the current edition before relying on it.</p>`},
 {id:"handy", t:"Handy figures", h:`
<table>
<tr><td>Typical max Ze quoted by DNOs</td><td>TN-C-S 0.35 Ω · TN-S 0.8 Ω · TT 21 Ω (electrode not included)</td></tr>
<tr><td>PEFC from Ze</td><td>≈ 230 ÷ Ze (Ω) amps; three-phase PSCC ≈ 2 × single-phase</td></tr>
<tr><td>Max Zs rule of thumb</td><td>Measured Zs ≤ 80% of the BS 7671 table value</td></tr>
<tr><td>MCB instantaneous trip</td><td>Type B 3–5 × In · Type C 5–10 × In · Type D 10–20 × In</td></tr>
<tr><td>Uo × Cmin</td><td>230 × 0.95 = 218.5 V</td></tr>
<tr><td>Ring final (typical)</td><td>2.5/1.5 T&amp;E on 32 A, max 100 m² floor area served</td></tr>
<tr><td>Radial (typical)</td><td>2.5 mm² on 20 A up to 50 m²; 4 mm² on 32 A up to 75 m²</td></tr>
</table>`},
];
