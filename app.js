(function(){
"use strict";

/* ------------------------------------------------------------------ reference data */
const r2 = x => Math.round(x*100 + 1e-9)/100;
const r3 = x => Math.round(x*1000 + 1e-9)/1000;
const ZS = {};
const addZ = (dev, In, a, b) => { (ZS[dev] = ZS[dev] || {})[In] = [a, b]; };
const MCB_R = [3,6,10,16,20,25,32,40,50,63,80,100,125];
[["BS EN 60898 MCB","MCB"],["BS EN 61009 RCBO","RCBO"]].forEach(([fam]) => {
  [["B",5,5],["C",10,10],["D",20,10]].forEach(([t,k04,k5]) => {
    MCB_R.forEach(In => { if (In === 3 && t !== "B") return; addZ(`${fam} Type ${t}`, In, r2(218.5/(k04*In)), r2(218.5/(k5*In))); });
  });
});
const F88_2 = {2:[33.10,44.00],4:[15.60,21.00],6:[7.80,12.00],10:[4.65,6.80],16:[2.43,4.00],20:[1.68,2.80],25:[1.29,2.20],32:[0.99,1.70],40:[0.75,1.30],50:[0.57,0.99],63:[0.44,0.78],80:[null,0.55],100:[null,0.42],125:[null,0.32],160:[null,0.27],200:[null,0.18]};
const F88_3 = {5:[9.93,14.60],16:[2.30,3.90],20:[1.93,3.20],32:[0.91,1.60],45:[0.57,1.00],63:[0.36,0.68],80:[null,0.51],100:[null,0.38]};
const F3036 = {5:[9.10,16.80],15:[2.43,5.08],20:[1.68,3.64],30:[1.04,2.51],45:[0.56,1.51],60:[0.40,1.07],100:[null,0.51]};
const F1362 = {3:[15.60,22.00],13:[2.30,3.64]};
for (const [dev,t] of [["BS 88-2 gG fuse",F88_2],["BS 88-3 fuse",F88_3],["BS 3036 rewireable fuse",F3036],["BS 1362 plug fuse",F1362]])
  for (const In in t) addZ(dev, +In, t[In][0], t[In][1]);
const DEVICES = Object.keys(ZS).concat(["Other (see mfr data)"]);
const RES = {1:18.10,1.5:12.10,2.5:7.41,4:4.61,6:3.08,10:1.83,16:1.15,25:0.727,35:0.524,50:0.387,70:0.268,95:0.193};
const CSA = [1,1.5,2.5,4,6,10,16,25,35,50,70,95];
const PREMISES = [["Domestic – owner occupied",10],["Domestic – rented",5],["Commercial / office",5],["Shop / retail",5],["Restaurant / café / hotel",5],["Educational",5],["Industrial",3],["Agricultural / horticultural",3],["Caravan park",1],["Swimming pool",1],["Petrol station",1],["Launderette",1],["Construction site",0.25]];
const REASONS = ["Periodic inspection","Business / property sale","Landlord / letting requirement","Change of occupancy","Insurance","Client request","Other"];
const EARTH = ["TN-C-S (PME)","TN-S","TT"];
const WIRING = [["A","PVC/PVC (T&E)"],["B","PVC in metal conduit"],["C","PVC in plastic conduit"],["D","PVC in metal trunking"],["E","PVC in plastic trunking"],["F","PVC/SWA"],["G","XLPE/SWA"],["H","MICC"],["O","Other"]];
const REFM = ["A","B","C","E","F","100","101","102","103"];
const RCD_TYPES = ["AC","A","F","B","A (S-type)","B (S-type)"];
const CODES = [["C1","Danger present – immediate action"],["C2","Potentially dangerous – urgent remedial action"],["C3","Improvement recommended"],["FI","Further investigation required without delay"]];
const OUTCOMES = ["✓","C1","C2","C3","FI","N/V","LIM","N/A"];
const INSP = [
 ["1","Intake equipment (visual only)",[["1.1","Service cable and cut-out / service head"],["1.2","Meter tails – distributor's and consumer's"],["1.3","Metering equipment"],["1.4","Isolator (where present)"]]],
 ["2","Other sources of supply",[["2.1","Sources operating in parallel with the public supply"],["2.2","Switched alternative sources"]]],
 ["3","Earthing and bonding",[["3.1","Distributor's earthing arrangement or installation earth electrode"],["3.2","Earthing conductor – size and condition"],["3.3","Earthing conductor connections – accessible and secure"],["3.4","Main protective bonding – size and condition"],["3.5","Main bonding connections – accessible and secure"],["3.6","Safety labels at earthing and bonding connections"],["3.7","Supplementary bonding where required"]]],
 ["4","Consumer unit / distribution boards",[["4.1","Adequate working space and access"],["4.2","Security of fixing"],["4.3","Enclosure condition, IP and fire rating"],["4.4","Main switch present, suitable and operates"],["4.5","Manual operation of circuit-breakers and RCDs"],["4.6","Protective devices correct type and rating"],["4.7","Circuit identification / chart"],["4.8","Warning notices (RCD test, inspection date, mixed colours, alternative supplies)"],["4.9","Single-pole devices in line conductor only"],["4.10","Cable entries protected and correctly terminated"],["4.11","Surge protective devices and status indication"],["4.12","Arc fault detection devices (where fitted / required)"]]],
 ["5","Final circuits",[["5.1","Identification of conductors"],["5.2","Cables correctly supported"],["5.3","Condition of insulation of live parts"],["5.4","Non-sheathed cables enclosed"],["5.5","Current-carrying capacity suitable for installation method"],["5.6","Coordination of conductors and overload devices"],["5.7","Adequacy of circuit protective conductors"],["5.8","Wiring system suitable for external influences"],["5.9","Concealed cables in prescribed zones or protected"],["5.10","RCD additional protection – sockets up to 32 A"],["5.11","RCD additional protection – mobile equipment outdoors"],["5.12","RCD protection – cables concealed in walls"],["5.13","RCD protection – lighting circuits (domestic)"],["5.14","Fire barriers, seals and thermal protection"],["5.15","Band II segregated from Band I"],["5.16","Segregated from non-electrical services"],["5.17","Termination of cables at enclosures"],["5.18","Condition of accessories"],["5.19","Accessories suitable for external influences"],["5.20","Adequacy of connections"]]],
 ["6","Isolation and switching",[["6.1","Isolators – location, labelling, lockable"],["6.2","Switching off for mechanical maintenance"],["6.3","Emergency switching / stopping"],["6.4","Functional switching"]]],
 ["7","Current-using equipment",[["7.1","Condition for protection against shock"],["7.2","Enclosures undamaged; suitable IP rating"],["7.3","Suitable for environment; no fire risk"],["7.4","Recessed / enclosed luminaires"]]],
 ["8","Special locations",[["8.1","Bath or shower locations"],["8.2","Other special locations"],["8.3","EV charging equipment"],["8.4","Solar PV / battery storage"]]]
];
const INSP_FLAT = INSP.flatMap(s => s[2]);

/* ------------------------------------------------------------------ helpers */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num = v => { if (v === null || v === undefined) return null; const s = String(v).replace(/[>≥\s]/g,"").replace(",","."); if (s === "") return null; const n = parseFloat(s); return isFinite(n) ? n : null; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const fmt = (v, d=2) => v === null || v === undefined ? "–" : (typeof v === "number" ? v.toFixed(d) : v);
const today = () => new Date().toISOString().slice(0,10);
const ukDate = iso => { if (!iso) return ""; const [y,m,d] = iso.split("-"); return d && m && y ? `${d}/${m}/${y}` : iso; };
function getPath(o, p){ return p.split(".").reduce((a,k) => a == null ? a : a[k], o); }
function setPath(o, p, v){ const ks = p.split("."); let a = o; ks.slice(0,-1).forEach(k => { if (a[k] == null || typeof a[k] !== "object") a[k] = {}; a = a[k]; }); a[ks[ks.length-1]] = v; }
function devShort(c){
  if (!c.dev) return "No device";
  const m = c.dev.match(/Type ([BCD])$/); const kind = c.dev.includes("RCBO") ? "RCBO" : "MCB";
  if (m) return `${m[1]}${c.rating || "?"} ${kind}`;
  if (c.dev.startsWith("Other")) return "Other device";
  return `${c.dev.replace(" fuse","").replace(" rewireable","")} ${c.rating || "?"}A`;
}

/* ------------------------------------------------------------------ model */
const DEFAULT_SETTINGS = { officeEmail:"office@blueforge-engineering.co.uk", sendUrl:"", sendKey:"", autoSend:"Yes", userName:"", role:"Inspector", signOffName:"Adam Fyles", lastSync:0, company:"BlueForge Engineering", inspector:"Adam Fyles", position:"Owner / Inspector", address:"Llandudno, North Wales", phone:"", email:"", reg:"", mft:"", irSerial:"", loopSerial:"", elecSerial:"" };
let settings = { ...DEFAULT_SETTINGS };

function newCircuit(no){ return { id:uid(), no:String(no), desc:"", wtype:"A", ref:"C", pts:"", live:"", cpc:"", ctype:"Final", dev:"", rating:"", ka:"6", rcd:"", rcdType:"", len:"", ring:"N", r1:"", rn:"", r2:"", r12:"", R2:"", irv:"500", irll:"", irle:"", pol:"", zs:"", rcdt:"", rcdt5:"", rcdbtn:"", afdd:"", remarks:"" }; }
const TYPES = { EICR:"EICR", EIC:"EIC", MW:"Minor Works" };
const TYPE_LONG = { EICR:"Electrical Installation Condition Report", EIC:"Electrical Installation Certificate", MW:"Minor Electrical Installation Works Certificate" };
const typeOf = job => job.type || "EICR";
const COMPANY_KEYS = ["company","inspector","position","address","phone","email","reg"];
const companyCopy = () => { const o = {}; COMPANY_KEYS.forEach(k => o[k] = settings[k]); return o; };
const me = () => settings.userName || settings.inspector;
function newBoard(n){ return { id:uid(), ref:"DB"+n, location:"", testedBy: me(), from: n === 1 ? "Origin" : "", ocpd:"", zdb:"", ipf:"", phases:"1", spd:"", polarity:"", seq:"", date:today(), mft:settings.mft, irSerial:settings.irSerial, loopSerial:settings.loopSerial, elecSerial:settings.elecSerial, circuits:[] }; }
function newJob(type = "EICR"){
  const job = { id:uid(), type, created:Date.now(), updated:Date.now(), createdBy: me(), reportNo:"", issueDate:"",
    client:{name:"",phone:"",address:""}, reason:"", inspDate:today(), occupier:"", premises:"", address:"",
    wiringAge:"", alterations:"", alterAge:"", records:"", lastInsp:"", recordsHeld:"",
    extent:"The fixed electrical installation from the origin, including all distribution boards and final circuits listed in the schedules.",
    limitations:"No dismantling of fixed equipment. Cables concealed in the building fabric, under floors, above ceilings or in inaccessible roof spaces were not inspected. Accessories inspected on a sample basis.",
    limitAgreed:"", opLimits:"", condition:"", recInterval:"",
    company:companyCopy(), inspector:settings.role === "Tester" ? settings.signOffName : settings.inspector, position:settings.position, sigDate:"", sig:"", reviewer:"",
    supply:{earth:"",phases:"1-phase 2-wire",uo:"230",freq:"50",polarity:"",ze:"",ipf:"",devBs:"",devRating:"",devKa:"",means:"",electrode:"",ra:"",msBs:"",msRating:"",msRcd:"",msRcdTime:"",tails:"",earthCsa:"",bondCsa:"",bondVerified:"",water:"",gas:"",oil:"",steel:"",lightning:"",otherBond:""},
    boards:[newBoard(1)], insp:{}, obs:[],
    work:{ nature:"", desc:"", extent:"", maxDemand:"", departures:"", existing:"", notify:{}, bcRef:"", sameSigner:"Yes", designer:"", designDate:"", constructor:"", constructDate:"" } };
  if (type !== "EICR") { job.extent = ""; job.limitations = ""; job.reason = type === "EIC" ? "New installation work" : "Minor works"; }
  if (type === "MW") { job.boards[0].circuits.push(newCircuit(1)); }
  return job;
}
function normaliseJob(job){
  if (!job.type) job.type = "EICR";
  if (!job.work) job.work = { nature:"", desc:"", extent:"", maxDemand:"", departures:"", existing:"", notify:{}, bcRef:"", sameSigner:"Yes", designer:"", designDate:"", constructor:"", constructDate:"" };
  if (!job.work.notify) job.work.notify = {};
  if (job.company) { const c = {}; COMPANY_KEYS.forEach(k => c[k] = job.company[k] ?? settings[k]); job.company = c; }
  Object.keys(job.insp || {}).forEach(k => { if (k.includes(".")) { job.insp[k.replace(".","_")] = job.insp[k]; delete job.insp[k]; } });
  return job;
}

function exampleJob(){
  const j = newJob();
  j.id = "example"; j.example = true; j.reportNo = "EX-001";
  j.client = {name:"Example client", phone:"", address:"1 Example Promenade, Llandudno"};
  j.reason = "Business / property sale"; j.premises = "Shop / retail"; j.address = "Example Ice Cream Parlour, 1 Example Promenade";
  j.occupier = "Example Ltd"; j.wiringAge = "15"; j.alterations = "Yes"; j.alterAge = "5"; j.records = "No";
  j.condition = "Generally fair. Main defects: low insulation on the freezer radial and an outdoor sign circuit on a rewireable fuse with no RCD.";
  Object.assign(j.supply, {earth:"TN-C-S (PME)", ze:"0.28", ipf:"1.2", devBs:"BS 88-3", devRating:"100", tails:"25", earthCsa:"16", bondCsa:"10", means:"Distributor's facility", water:"✓", gas:"✓", polarity:"✓", bondVerified:"✓"});
  const b = j.boards[0]; b.location = "Shop floor, behind counter"; b.spd = "Type 2 – indicator OK"; b.polarity = "✓";
  const rows = [
    {desc:"Lighting – shop floor", pts:"8", live:"1.5", cpc:"1", dev:"BS EN 61009 RCBO Type B", rating:"6", rcd:"30", rcdType:"A", len:"28", r12:"0.87", irll:">999", irle:">999", pol:"✓", zs:"1.13", rcdt:"22", rcdbtn:"✓"},
    {desc:"Sockets – ring, shop floor", pts:"10", live:"2.5", cpc:"1.5", dev:"BS EN 61009 RCBO Type B", rating:"32", rcd:"30", rcdType:"A", len:"52", ring:"Y", r1:"0.38", rn:"0.37", r2:"0.62", r12:"0.25", irll:">999", irle:"150", pol:"✓", zs:"0.55", rcdt:"19", rcdbtn:"✓"},
    {desc:"Radial – ice cream freezers", pts:"3", live:"4", cpc:"1.5", dev:"BS EN 61009 RCBO Type C", rating:"32", rcd:"30", rcdType:"A", len:"22", r12:"0.36", irll:">999", irle:"1.4", pol:"✓", zs:"0.66", rcdt:"24", rcdbtn:"✓", remarks:"Low IR – disconnect freezers and retest"},
    {desc:"Water heater – back room", pts:"1", live:"2.5", cpc:"1.5", dev:"BS EN 60898 MCB Type B", rating:"16", len:"15", r12:"0.30", irll:">999", irle:"200", pol:"✓", zs:"0.59"},
    {desc:"Outside sign – rear yard", pts:"1", live:"1.5", cpc:"1", dev:"BS 3036 rewireable fuse", rating:"15", ka:"1", len:"45", r12:"1.40", irll:">999", irle:"50", pol:"✓", zs:"1.95", remarks:"Rewireable fuse; no RCD on outdoor circuit"}
  ];
  rows.forEach((r,i) => b.circuits.push(Object.assign(newCircuit(i+1), r)));
  j.insp["5_11"] = "C2"; j.insp["3_2"] = "✓"; j.insp["3_4"] = "✓";
  j.obs = [
    {id:uid(), text:"Outdoor sign circuit has no RCD protection and is on a BS 3036 rewireable fuse; measured Zs exceeds the limit for the fuse.", loc:"DB1 cct 5", reg:"411.3.3 / 411.4", code:"C2", src:"insp:5.11"},
    {id:uid(), text:"Insulation resistance on freezer radial 1.4 MΩ – further investigation required with appliances disconnected.", loc:"DB1 cct 3", reg:"643.3", code:"FI", src:""}
  ];
  return j;
}

/* ------------------------------------------------------------------ calculations */
function boardZdb(job, b){ const z = num(b.zdb); return z !== null ? z : num(job.supply.ze); }
function boardIpf(job, b){ const z = num(b.ipf); return z !== null ? z : num(job.supply.ipf); }

function calcCircuit(job, b, c){
  const TT = job.supply.earth === "TT";
  const out = {};
  out.disc = !c.ctype ? null : c.ctype === "Distribution" ? (TT ? 1 : 5) : (TT ? 0.2 : 0.4);
  out.maxZs = null; out.maxNote = "";
  if (c.dev && c.rating){
    if (c.dev.startsWith("Other")) out.maxNote = "mfr data";
    else { const e = ZS[c.dev] && ZS[c.dev][+c.rating]; const v = e ? e[(out.disc || 0) >= 5 ? 1 : 0] : null; if (v === null || v === undefined) out.maxNote = "n/a"; else out.maxZs = v; }
  }
  out.m80 = out.maxZs !== null ? r2(out.maxZs*0.8) : null;
  const rl = RES[c.live], rc = RES[c.cpc], ring = c.ring === "Y", len = num(c.len);
  const perm = rl && rc ? rl + rc : null;
  const ratio = rl && rc ? rc / rl : null;
  out.perm = perm;
  out.expR12 = perm && len !== null ? r3(perm*len/(ring ? 4 : 1)/1000) : null;
  const zdb = boardZdb(job, b), ipf = boardIpf(job, b);
  out.zdb = zdb;
  out.expZs = out.expR12 !== null && zdb !== null ? r2(zdb + out.expR12) : null;
  out.maxLen = null;
  if (out.m80 !== null && perm && zdb !== null) out.maxLen = out.m80 <= zdb ? "Zdb too high" : Math.floor((out.m80 - zdb)/(perm/1000)*(ring ? 4 : 1) + 1e-9);
  const zs = num(c.zs), r12 = num(c.r12);
  out.zsUsed = zs !== null ? zs : (r12 !== null && zdb !== null ? r2(zdb + r12) : null);
  out.zsCalc = zs === null && out.zsUsed !== null;

  const checks = [];
  const ka = num(c.ka);
  if (ka !== null && ipf !== null) checks.push({l:"Breaking cap.", s: ka >= ipf ? "pass" : "check", t: ka >= ipf ? `${ka} kA ≥ Ipf ${ipf} kA` : `${ka} kA is below Ipf ${ipf} kA – check the consumer unit's conditional rating`});
  const R1 = num(c.r1), RN = num(c.rn), RR2 = num(c.r2);
  if (ring && R1 !== null && RN !== null && RR2 !== null){
    let s = "pass", t = "End-to-end readings consistent";
    if (Math.abs(R1 - RN) > 0.05) { s = "check"; t = `r1 and rn differ by ${r2(Math.abs(R1-RN))} Ω (max 0.05)`; }
    else if (ratio && Math.abs(RR2 - R1*ratio) > 0.05*ratio) { s = "check"; t = `r2 expected ≈ ${r2(R1*ratio).toFixed(2)} Ω for ${c.live}/${c.cpc}`; }
    checks.push({l:"Ring", s, t});
  }
  if (r12 !== null){
    if (ring && R1 !== null && RR2 !== null){ const e = (R1+RR2)/4; const ok = Math.abs(r12 - e) <= 0.05; checks.push({l:"R1+R2", s: ok ? "pass" : "check", t: ok ? `Matches (r1+r2)/4 = ${r2(e).toFixed(2)} Ω` : `Expected ≈ (r1+r2)/4 = ${r2(e).toFixed(2)} Ω`}); }
    else if (out.expR12 !== null){ const hi = r12 > out.expR12*1.5 + 0.05; checks.push({l:"R1+R2", s: hi ? "check" : "pass", t: hi ? `Higher than expected ${out.expR12.toFixed(2)} Ω – check length / connections` : `In line with expected ${out.expR12.toFixed(2)} Ω`}); }
  }
  const ll = num(c.irll), le = num(c.irle);
  if (ll !== null || le !== null){
    const m = Math.min(ll ?? 1e9, le ?? 1e9), req = +c.irv === 250 ? 0.5 : 1;
    checks.push({l:"Insulation", s: m < req ? "fail" : m < 2 ? "check" : "pass", t: m < req ? `${m} MΩ is below ${req} MΩ minimum` : m < 2 ? `${m} MΩ – under 2 MΩ, investigate` : `Lowest ${m >= 999 ? "> 999" : m} MΩ (min ${req})`});
  }
  if (c.pol === "✗") checks.push({l:"Polarity", s:"fail", t:"Incorrect polarity"});
  if (out.zsUsed !== null){
    const rcd = num(c.rcd); const rcdOk = rcd ? out.zsUsed <= 50000/rcd : false;
    const lbl = out.zsCalc ? " (Zdb + R1+R2)" : "";
    if (out.m80 !== null){
      if (out.zsUsed <= out.m80) checks.push({l:"Zs", s:"pass", t:`${out.zsUsed.toFixed(2)} Ω${lbl} ≤ ${out.m80.toFixed(2)} Ω limit`});
      else if (rcdOk) checks.push({l:"Zs", s:"pass", t:`${out.zsUsed.toFixed(2)} Ω is over the ${out.m80.toFixed(2)} Ω device limit – passes on the ${rcd} mA RCD (Zs × IΔn ≤ 50 V)`});
      else checks.push({l:"Zs", s:"fail", t:`${out.zsUsed.toFixed(2)} Ω${lbl} is over the ${out.m80.toFixed(2)} Ω limit`});
    } else if (rcdOk) checks.push({l:"Zs", s:"pass", t:`Passes on the ${rcd} mA RCD (Zs × IΔn ≤ 50 V)`});
    else checks.push({l:"Zs", s:"check", t:"No tabulated limit – check manufacturer data"});
  }
  if (String(c.rcdt).trim() !== ""){
    const t = num(c.rcdt), t5 = num(c.rcdt5), S = /S-type/.test(c.rcdType);
    let ok;
    if (t === null) ok = false;
    else if (S) ok = t >= 130 && t <= 500 && (t5 === null || t5 <= 150);
    else ok = t <= 300 && (t5 === null || t5 <= 40);
    checks.push({l:"RCD", s: ok ? "pass" : "fail", t: t === null ? "Did not trip" : ok ? `${t} ms${t5 !== null ? `, ${t5} ms at 5×` : ""} – within ${S ? "130–500" : "300"} ms` : `${t} ms${t5 !== null ? ` / ${t5} ms at 5×` : ""} – outside limit (${S ? "130–500 ms, ≤150 at 5×" : "≤300 ms, ≤40 at 5×"})`});
  }
  if (c.rcdbtn === "✗") checks.push({l:"RCD button", s:"fail", t:"Test button did not operate"});
  if (out.maxNote === "n/a") checks.push({l:"Max Zs", s:"check", t:"No BS 7671 value for this device/time"});
  const anyTest = ll !== null || le !== null || out.zsUsed !== null || r12 !== null || R1 !== null;
  if (anyTest) {
    const missing = [];
    if (r12 === null && num(c.R2) === null && !(ring && R1 !== null && RR2 !== null)) missing.push("continuity (R1+R2)");
    if (ll === null && le === null) missing.push("insulation resistance");
    if (!c.pol) missing.push("polarity");
    if (out.zsUsed === null) missing.push(zdb === null ? "Zs (or Ze to calculate it)" : "Zs");
    if (num(c.rcd) && String(c.rcdt).trim() === "") missing.push("RCD trip time");
    if (missing.length) checks.push({l:"Not recorded", s:"check", t: missing.join(", ")});
  }
  out.checks = checks;
  const tested = ll !== null || le !== null || out.zsUsed !== null;
  out.result = checks.some(x => x.s === "fail") ? "fail" : !tested ? "none" : checks.some(x => x.s === "check") ? "check" : "pass";
  return out;
}

function calcSupply(job){
  const s = job.supply, o = {};
  const ze = num(s.ze), tails = num(s.tails), PME = s.earth === "TN-C-S (PME)";
  o.typZe = s.earth === "TN-C-S (PME)" ? 0.35 : s.earth === "TN-S" ? 0.8 : s.earth === "TT" ? 21 : null;
  o.zeCheck = ze !== null && o.typZe !== null ? (ze > o.typZe ? {s:"check", t:`Above typical ${o.typZe} Ω – investigate / query DNO`} : {s:"pass", t:`Within typical ${o.typZe} Ω`}) : null;
  o.pefc = ze ? r2(0.23/ze) : null;
  const t54_8 = t => t <= 35 ? 10 : t <= 50 ? 16 : t <= 95 ? 25 : t <= 150 ? 35 : 50;
  if (tails !== null){
    o.minEarth = Math.max(tails <= 16 ? tails : tails <= 35 ? 16 : tails/2, PME ? t54_8(tails) : 0);
    if (PME) o.minBond = t54_8(tails);
    else { const h = o.minEarth/2; o.minBond = h <= 6 ? 6 : h <= 10 ? 10 : h <= 16 ? 16 : 25; }
  }
  const ec = num(s.earthCsa), bc = num(s.bondCsa);
  o.earthCheck = ec !== null && o.minEarth ? (ec >= o.minEarth ? {s:"pass", t:"OK"} : {s:"fail", t:`Undersize – min ${o.minEarth} mm²`}) : null;
  o.bondCheck = bc !== null && o.minBond ? (bc >= o.minBond ? {s:"pass", t:"OK"} : {s:"fail", t:`Undersize – min ${o.minBond} mm²`}) : null;
  const ra = num(s.ra);
  o.raCheck = s.earth === "TT" && ra !== null ? (ra > 1667 ? {s:"fail", t:"Over 1667 Ω (50 V ÷ 30 mA)"} : ra > 200 ? {s:"check", t:"Over 200 Ω – may not be stable"} : {s:"pass", t:"OK (≤ 200 Ω)"}) : null;
  return o;
}

function jobSummary(job){
  const counts = {C1:0,C2:0,C3:0,FI:0};
  job.obs.forEach(o => { if (counts[o.code] !== undefined) counts[o.code]++; });
  let fails = [], tested = 0, total = 0;
  job.boards.forEach(b => b.circuits.forEach(c => { total++; const r = calcCircuit(job, b, c); if (r.result !== "none") tested++; if (r.result === "fail") fails.push({b, c}); }));
  const unsat = counts.C1 + counts.C2 + counts.FI > 0;
  const started = job.obs.length || tested || Object.keys(job.insp).length;
  const linked = new Set(job.obs.map(o => o.src).filter(Boolean));
  const unwrittenFails = fails.filter(f => !linked.has(`circ:${f.b.id}:${f.c.id}`));
  const coded = INSP_FLAT.filter(([id]) => ["C1","C2","C3","FI"].includes(job.insp[id.replace(".","_")]) && !linked.has("insp:"+id));
  const years = (PREMISES.find(p => p[0] === job.premises) || [])[1];
  const interval = num(job.recInterval) ?? years ?? null;
  let nextDue = "";
  if (interval && job.inspDate){ const d = new Date(job.inspDate + "T12:00:00"); d.setMonth(d.getMonth() + Math.round(interval*12)); nextDue = d.toISOString().slice(0,10); }
  const type = typeOf(job);
  if (type !== "EICR") {
    const inspFails = INSP_FLAT.filter(([id]) => job.insp[id.replace(".","_")] === "✗");
    const untested = total - tested;
    const incomplete = [];
    job.boards.forEach(b => b.circuits.forEach(c => { const r = calcCircuit(job, b, c); if (r.result === "check") incomplete.push({b, c, why: r.checks.filter(x => x.s === "check").map(x => x.l + ": " + x.t).join("; ")}); }));
    const status = fails.length || inspFails.length ? "fail" : tested && !untested && !incomplete.length ? "pass" : "none";
    return { counts, fails, unwrittenFails: [], coded: [], inspFails, incomplete, tested, total, untested, unsat: status === "fail", started, years, interval, nextDue, status };
  }
  return { counts, fails, unwrittenFails, coded, inspFails: [], incomplete: [], tested, total, untested: total - tested, unsat, started, years, interval, nextDue, status: !started ? "none" : unsat ? "fail" : "pass" };
}

/* ---- spoken readings parser (shared by app + tests) ---- */
const VW = {zero:0,nought:0,naught:0,nort:0,oh:0,one:1,won:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
const VT = {twenty:20,thirty:30,forty:40,fourty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
function speechNormalise(raw){
  let s = " " + String(raw).toLowerCase() + " ";
  s = s.replace(/[,;!?]/g, " ").replace(/\+/g, " plus ").replace(/&/g, " and ").replace(/Ω/g, " ").replace(/-/g, " ");
  s = s.replace(/\bmega? ?ohms?\b|\bmeg(?:s|ohms?)?\b|\bmΩ\b/g, " ").replace(/\bohms?\b/g, " ");
  s = s.replace(/\bmilli ?seconds?\b|\bmils?\b|\bms\b/g, " ");
  // number words -> digits
  const t = s.split(/\s+/).filter(Boolean), out = [];
  for (let i = 0; i < t.length; i++){
    const w = t[i];
    if (w in VT || w in VW){
      let v = w in VT ? VT[w] : VW[w];
      if (w in VT && t[i+1] in VW && VW[t[i+1]] > 0 && VW[t[i+1]] < 10) { v += VW[t[i+1]]; i++; }
      if (t[i+1] === "hundred") { v *= 100; i++; if (t[i+1] === "and") i++; if (t[i+1] in VT) { v += VT[t[i+1]]; i++; if (t[i+1] in VW && VW[t[i+1]] < 10) { v += VW[t[i+1]]; i++; } } else if (t[i+1] in VW) { v += VW[t[i+1]]; i++; } }
      out.push(String(v));
    } else if (w === "hundred") out.push("100");
    else out.push(w);
  }
  s = " " + out.join(" ") + " ";
  s = s.replace(/\b9 9 9\b/g, "999");
  // decimals: "0 point 3 6" / "point 3 6" / "0.36"
  s = s.replace(/(\d+)?\s*(?:\bpoint\b|\.)\s*((?:\d\s?)+)/g, (m, a, b) => ` ${a || "0"}.${b.replace(/\s/g, "")} `);
  // over-range
  s = s.replace(/\b(?:greater|more|higher|bigger) than\s*(\d+(?:\.\d+)?)/g, " >$1").replace(/\b(?:over|above|in excess of)\s*(\d+(?:\.\d+)?)/g, " >$1");
  s = s.replace(/\b(?:infinity|infinite|off (?:the )?scale|over ?range|o\.? ?l\.?)\b/g, " >999");
  return s.replace(/\s+/g, " ");
}
const V = "(>\\s?\\d+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?|no trip|not trip|did(?:n't| not) trip|n\\/?a)";
const SEP = "\\s*(?:is|was|of|at|=|:|reading|reads|equals|gives)?\\s*";
const IRP = "(?:insulation(?: resistance)?|i ?r|megger|megging|meg)";
const SPEECH_RULES = [
  ["r12",  "(?:r ?1 ?(?:plus|and)? ?r ?2|(?:are|our|or) ?1 ?(?:plus|and) ?(?:are|our|or) ?2|r1r2|continuity)"],
  ["irll", `${IRP}?\\s*(?:live ?(?:to )?live|l ?l|line ?(?:to )?(?:line|neutral)|live ?(?:to )?neutral)`],
  ["irle", `${IRP}?\\s*(?:live ?(?:to )?earth|l ?e|line ?(?:to )?earth|to earth)`],
  ["irboth", `${IRP}(?:\\s*both(?: ways)?)?`],
  ["rcdt5", "(?:5 ?(?:times|x)|times 5|x ?5)(?: (?:i ?)?(?:delta|dn|δn)(?: n)?)?(?: (?:trip|time))?"],
  ["rcdt", "(?:rcd(?: trip)?(?: time)?|trip(?: time)?|tripped(?: at| in)?|trips?(?: at| in))(?: (?:at )?(?:1 ?(?:times|x) )?(?:i ?)?(?:delta|dn|δn)(?: n)?)?"],
  ["zs",   "(?:measured )?(?:zs|z s|zed s|zee s|zed|earth loop(?: impedance)?|loop(?: impedance)?)"],
  ["r1",   "(?:ring )?(?:r ?1|(?:are|our) ?1|lines?(?: end to end)?)"],
  ["rn",   "(?:ring )?(?:r ?n|are ?n|neutrals?(?: end to end)?)"],
  ["r2",   "(?:ring )?(?:r ?2|(?:are|our) ?2|cpcs?(?: end to end)?|earths?(?: end to end)?)"],
  ["len",  "(?:cable |circuit |run )?length"],
];
const TE_CPC = {"1":"1","1.5":"1","2.5":"1.5","4":"1.5","6":"2.5","10":"4","16":"6"};
const OK_WORDS = "(?:ok|okay|good|correct|fine|tick|ticked|yes|pass|passed|confirmed|works|working|operates|operated|satisfactory)";
const BAD_WORDS = "(?:wrong|incorrect|reversed|fail|failed|no|cross|not working|didn't work|did not work|faulty)";
function parseSpeech(raw, ctx = {}){
  let s = speechNormalise(raw);
  const f = {}, cmd = [];
  const take = (re, fn) => { s = s.replace(re, (...m) => { fn(...m); return " "; }); };
  // commands and ticks
  take(new RegExp(`\\bpolarity\\s*(?:is\\s*)?${OK_WORDS}\\b`, "g"), () => f.pol = "✓");
  take(new RegExp(`\\bpolarity\\s*(?:is\\s*)?${BAD_WORDS}\\b`, "g"), () => f.pol = "✗");
  take(new RegExp(`\\b(?:rcd )?test button\\s*(?:is\\s*)?${OK_WORDS}\\b`, "g"), () => f.rcdbtn = "✓");
  take(new RegExp(`\\b(?:rcd )?test button\\s*(?:is\\s*)?${BAD_WORDS}\\b`, "g"), () => f.rcdbtn = "✗");
  take(new RegExp(`\\b(?:afdd|arc fault)(?: test)?(?: button)?\\s*(?:is\\s*)?${OK_WORDS}\\b`, "g"), () => f.afdd = "✓");
  take(/\b(?:at|test(?:ed)? at|test voltage)\s*(250|500|1000)\s*(?:volts?|v)\b/g, (m, v) => f.irv = v);
  take(/\b(\d+(?:\.\d+)?)\s*(?:metres?|meters?|m)\b(?: long| run| cable)?/g, (m, v) => f.len = v);
  const CS = "(1\\.5|2\\.5|10|16|1|4|6)", MM = "(?:\\s*(?:mm2?|mil|millimetres?|squared))*";
  take(new RegExp(`\\b(?:cable|twin and earth|t and e|t ?& ?e)\\s*${CS}\\b${MM}\\s*(?:(?:and|by|slash|with|\\/)\\s*${CS}\\b${MM})?`, "g"), (m, a, b) => { f.live = a; f.cpc = b || TE_CPC[a]; });
  take(new RegExp(`\\b${CS}${MM}\\s*(?:and|by|slash|with|\\/)\\s*${CS}\\b${MM}\\s*(?:cable|twin and earth|t and e)\\b`, "g"), (m, a, b) => { f.live = a; f.cpc = b; });
  take(/\b(mcb|rcbo|breaker)?\s*(?:type\s*)?\b([bcd])\s?(3|6|10|16|20|25|32|40|50|63|80|100|125)\b(?:\s*(?:amps?|a)\b)?\s*(mcb|rcbo|breaker)?/g, (m, k1, t, r, k2) => {
    const kind = (k1 || k2 || "").replace("breaker", "");
    const fam = kind === "rcbo" ? "BS EN 61009 RCBO" : kind === "mcb" ? "BS EN 60898 MCB" : (ctx.dev && ctx.dev.includes("RCBO") ? "BS EN 61009 RCBO" : "BS EN 60898 MCB");
    f.dev = `${fam} Type ${t.toUpperCase()}`; f.rating = r;
  });
  take(/\bring(?: final)?\b(?!\s*(?:r|are|our|lines?|neutrals?|earths?|cpc)\b)/g, () => f.ring = "Y");
  take(/\bradial\b/g, () => f.ring = "N");
  take(/\bnext circuit\b|\bnext\b\s*$/g, () => cmd.push("next"));
  for (const [key, pat] of SPEECH_RULES){
    const re = new RegExp(`\\b${pat}\\b${key === "len" ? SEP + "(\\d+(?:\\.\\d+)?)" : SEP + V}`, "g");
    take(re, (m, v) => {
      if (/trip/.test(v)) v = "No trip";
      else if (/^n\/?a$/.test(v)) v = "N/A";
      else v = v.replace(/\s/g, "");
      if (key === "irboth") { f.irll = f.irll || v; f.irle = f.irle || v; }
      else if (key === "r2" && ctx.ring !== "Y" && f.ring !== "Y") f.R2 = v;
      else f[key] = v;
    });
  }
  return { fields: f, commands: cmd, leftover: s.trim() };
}


/* ------------------------------------------------------------------ voice */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
const voice = { state:"idle", mode:"", bind:"", text:"", got:[], note:"", err:"", undo:null };
const VLABEL = {r12:"R1+R2",irll:"IR L–L",irle:"IR L–E",zs:"Zs",rcdt:"RCD",rcdt5:"RCD 5×",r1:"r1",rn:"rn",r2:"r2",R2:"R2",len:"Length",live:"Live",cpc:"cpc",dev:"Device",rating:"Rating",ring:"Ring",pol:"Polarity",rcdbtn:"RCD button",afdd:"AFDD",irv:"IR test V"};
function renderVoice(){
  const box = document.getElementById("voice"), fab = document.getElementById("micfab");
  const onCirc = view.screen === "job" && view.tab === "circuits" && curCirc() && !curJob().example;
  fab.hidden = !(SR && onCirc) || voice.state !== "idle";
  document.getElementById("app").classList.toggle("has-fab", !!(SR && onCirc));
  if (voice.state === "idle") { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  let body = "";
  if (voice.state === "listening") body = `<div class="row"><span class="pulse"></span><b>Listening…</b><span class="spacer"></span><button class="btn ghost sm" data-voice="stop">Stop</button></div>
    <div class="heard">${voice.text ? esc(voice.text) : `<i>${voice.mode === "readings" ? "Say e.g. “R1 plus R2 0.36, insulation greater than 999, Zs 0.66, RCD 22”" : "Speak now…"}</i>`}</div>`;
  else if (voice.state === "done") body = `<div class="heard"><span class="muted small">Heard</span><br>“${esc(voice.text)}”</div>
    ${voice.mode === "readings" ? (voice.got.length ? `<div class="got">${voice.got.map(g => `<span>${esc(g)}</span>`).join("")}</div>` : `<div class="warnline">Couldn't pick out any readings. Try saying the name then the value, e.g. “Zs 0.66”.</div>`) : ""}
    ${voice.note ? `<div class="muted small">${esc(voice.note)}</div>` : ""}
    <div class="row">${voice.undo ? `<button class="btn ghost sm" data-voice="undo">Undo</button>` : ""}<span class="spacer"></span><button class="btn ghost sm" data-voice="close">Close</button><button class="btn sm" data-voice="again">🎤 Again</button></div>`;
  else if (voice.state === "error") body = `<div class="errline">${esc(voice.err)}</div><div class="row"><span class="spacer"></span><button class="btn ghost sm" data-voice="close">Close</button></div>`;
  box.innerHTML = `<div class="in" role="status" aria-live="polite">${body}</div>`;
}
function startVoice(mode, bind){
  if (!SR) return;
  try { if (rec) rec.abort(); } catch(e){}
  Object.assign(voice, {state:"listening", mode, bind:bind || "", text:"", got:[], note:"", err:"", undo: mode === "readings" ? null : voice.undo});
  renderVoice();
  rec = new SR();
  rec.lang = "en-GB"; rec.interimResults = true; rec.maxAlternatives = 3; rec.continuous = false;
  let finalAlts = null;
  rec.onresult = e => {
    let txt = "";
    for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript + " ";
    voice.text = txt.trim();
    const last = e.results[e.results.length - 1];
    if (last.isFinal) finalAlts = Array.from(last).map(a => a.transcript);
    renderVoice();
  };
  rec.onerror = e => {
    const m = { "not-allowed":"Microphone blocked. Allow the microphone for this app in your phone's settings.", "service-not-allowed":"Voice input isn't available here. Use the microphone on your keyboard instead.",
      "network":"Voice input needs signal on this phone. Use the microphone on your keyboard instead – it works offline.", "no-speech":"Didn't hear anything. Tap the mic and try again.", "audio-capture":"No microphone found." }[e.error];
    if (e.error === "aborted") return;
    voice.state = "error"; voice.err = m || "Voice input stopped (" + e.error + ")."; renderVoice();
  };
  rec.onend = () => {
    if (voice.state !== "listening") return;
    if (!voice.text) { voice.state = "error"; voice.err = "Didn't hear anything. Tap the mic and try again."; renderVoice(); return; }
    finishVoice(finalAlts && finalAlts.length ? finalAlts : [voice.text]);
  };
  try { rec.start(); } catch(e){ voice.state = "error"; voice.err = "Couldn't start the microphone."; renderVoice(); }
}
function finishVoice(alts){
  voice.state = "done";
  if (voice.mode === "dictate") {
    const [root, ...rest] = voice.bind.split(".");
    const obj = roots()[root]; const path = rest.join(".");
    if (obj) {
      let t = alts[0].trim(); t = t.charAt(0).toUpperCase() + t.slice(1); if (!/[.!?]$/.test(t)) t += ".";
      const cur = getPath(obj, path) || "";
      voice.undo = {kind:"dictate", obj, path, prev: cur};
      setPath(obj, path, (cur ? cur.replace(/\s*$/, "") + " " : "") + t);
      markDirty(j()); rerender();
    }
    renderVoice(); return;
  }
  const c = curCirc(); if (!c) { renderVoice(); return; }
  // pick the alternative that recognises the most readings
  let best = null;
  alts.forEach(a => { const r = parseSpeech(a, {ring:c.ring, dev:c.dev}); if (!best || Object.keys(r.fields).length > Object.keys(best.fields).length) { best = r; voice.text = a; } });
  const f = best.fields;
  if ((f.r1 || f.rn) && c.ring !== "Y") f.ring = "Y";
  if ((f.rcdt || f.rcdt5) && !c.rcd) { f.rcd = "30"; voice.note = "RCD set to 30 mA because a trip time was given – change it if that's wrong."; }
  const prev = {}; Object.keys(f).forEach(k => prev[k] = c[k]);
  voice.undo = Object.keys(f).length ? {kind:"readings", circ:c, prev} : null;
  Object.assign(c, f);
  voice.got = Object.keys(f).filter(k => k !== "rcd").map(k => `${VLABEL[k] || k} ${k === "dev" ? devShort(c) : f[k]}`);
  if (Object.keys(f).length) markDirty(j());
  rerender();
  if (best.commands.includes("next")) { voice.state = "idle"; const n = document.querySelector('[data-act="next"]'); if (n) n.click(); return; }
  renderVoice();
}
document.addEventListener("click", e => {
  const d = e.target.closest("[data-dictate]");
  if (d) { e.preventDefault(); startVoice("dictate", d.dataset.dictate); return; }
  if (e.target.closest("#micfab")) { startVoice("readings"); return; }
  const v = e.target.closest("[data-voice]"); if (!v) return;
  const a = v.dataset.voice;
  if (a === "stop") { try { rec && rec.stop(); } catch(err){} }
  if (a === "close") { voice.state = "idle"; renderVoice(); }
  if (a === "again") startVoice(voice.mode || "readings", voice.bind);
  if (a === "undo" && voice.undo) {
    const u = voice.undo;
    if (u.kind === "readings") Object.assign(u.circ, u.prev); else setPath(u.obj, u.path, u.prev);
    voice.undo = null; voice.got = []; voice.note = "Undone."; markDirty(j()); rerender(); renderVoice();
  }
});

/* ------------------------------------------------------------------ storage (IndexedDB on the device, localStorage fallback) */
let dl = null, mode = "local";
let jobs = [];                    // every job on this device, including deleted ones kept as tombstones for syncing
const dirty = new Set();
let saveState = "saved";
const LS = "bf-eicr-v1", IDB_NAME = "bf-eicr", IDB_STORE = "kv";
let idb = null, writeChain = Promise.resolve(), persistTimer = null;
const liveJobs = () => jobs.filter(x => !x.deleted);
function idbOpen(){ return new Promise(res => { try { const r = indexedDB.open(IDB_NAME, 1); r.onupgradeneeded = () => r.result.createObjectStore(IDB_STORE); r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null); } catch(e){ res(null); } }); }
function idbGet(k){ return new Promise(res => { if (!idb) return res(undefined); try { const q = idb.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); } catch(e){ res(undefined); } }); }
function idbSet(k, v){ return new Promise(res => { if (!idb) return res(false); try { const tx = idb.transaction(IDB_STORE, "readwrite"); tx.objectStore(IDB_STORE).put(v, k); tx.oncomplete = () => res(true); tx.onerror = () => res(false); tx.onabort = () => res(false); } catch(e){ res(false); } }); }
function lsRead(){ try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch(e){ return {}; } }
function snapshot(){ return JSON.parse(JSON.stringify({ settings, jobs: jobs.filter(j => !j.example) })); }
function writeNow(){
  const snap = snapshot();
  writeChain = writeChain.then(async () => {
    let ok = await idbSet("state", snap);
    if (!ok) { try { localStorage.setItem(LS, JSON.stringify(snap)); ok = true; } catch(e){ ok = false; } }
    else { try { localStorage.removeItem(LS); } catch(e){} }
    saveState = ok ? "saved" : "full"; updateStatus();
  });
  return writeChain;
}
function lsWrite(){ clearTimeout(persistTimer); persistTimer = setTimeout(writeNow, 250); return true; }
function markDirty(job){
  if (!job || job.example) return;
  job.updated = Date.now();
  lsWrite();
  scheduleSync(6000);
}
function flush(){ lsWrite(); }
function setSaveState(s){ saveState = s; updateStatus(); }
function updateStatus(){ const el = document.getElementById("savestate"); if (el) el.outerHTML = statusHtml(); }
function agoText(t){ if (!t) return "never"; const m = Math.round((Date.now() - t)/60000); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m/60)} h ago` : ukDate(new Date(t).toISOString().slice(0,10)); }
let appUpdated = false;
function statusHtml(){
  if (appUpdated) return `<div class="status warn" id="savestate" role="status"><span class="dot"></span><span>A new version is ready.</span><button class="btn ghost sm" data-act="reload" style="margin-left:auto">Reload</button></div>`;
  let cls = "", txt = saveState === "full" ? "Phone storage full – back up and delete old reports" : "Saved on this device";
  if (saveState === "full") cls = "err";
  let sync = "";
  if (!settings.sendUrl) sync = " · Not syncing yet (set up in ⚙)";
  else if (syncState.state === "syncing") sync = " · Syncing…";
  else if (navigator.onLine === false || syncState.state === "offline") { sync = " · Offline – will sync when back online"; if (!cls) cls = "warn"; }
  else if (syncState.state === "error") { sync = " · Sync problem – " + syncState.err; cls = cls || "warn"; }
  else sync = " · Synced " + agoText(settings.lastSync);
  return `<div class="status ${cls}" id="savestate" role="status"><span class="dot"></span><span style="min-width:0">${esc(txt + sync)}</span></div>`;
}

async function init(){
  idb = await idbOpen();
  let st = await idbGet("state");
  if (!st) { const ls = lsRead(); if (ls && (ls.jobs || ls.settings)) st = ls; }
  if (st && st.settings) settings = {...DEFAULT_SETTINGS, ...st.settings};
  jobs = st && Array.isArray(st.jobs) ? st.jobs.map(normaliseJob) : [];
  if (!settings.deviceId) settings.deviceId = uid();
  if (!settings.sendKey) settings.sendKey = "bf-" + Array.from({length:3}, () => Math.random().toString(36).slice(2,10)).join("");
  writeNow();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    try {
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("sw.js").then(r => { try { r.update(); } catch(e){} }).catch(() => {});
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController) { appUpdated = true; updateStatus(); } });
    } catch(e){}
  }
  try { const r = JSON.parse(sessionStorage.getItem("bf-return") || "null"); sessionStorage.removeItem("bf-return"); if (r && jobs.some(x => x.id === r.jobId && !x.deleted)) view = {screen:"job", jobId:r.jobId, tab:r.tab, board:0, circ:null}; } catch(e){}
  render();
  window.addEventListener("online", () => { updateStatus(); syncNow(); });
  window.addEventListener("offline", updateStatus);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") syncNow(); else if (persistTimer) { clearTimeout(persistTimer); writeNow(); } });
  window.addEventListener("pagehide", () => { if (persistTimer) { clearTimeout(persistTimer); writeNow(); } });
  setInterval(() => { syncNow(); updateStatus(); }, 60000);
  setTimeout(syncNow, 800);
}

/* ------------------------------------------------------------------ sync with the Google Drive folder (via the user's own Apps Script) */
const syncState = { state:"idle", err:"" };
let syncing = false, syncTimer = null, syncAgain = false;
function setSync(state, err){ syncState.state = state; syncState.err = err || ""; updateStatus(); }
function scheduleSync(ms){ if (!settings.sendUrl) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, ms); }
async function api(action, data){
  const res = await fetch(settings.sendUrl, { method:"POST", body: JSON.stringify({ key: settings.sendKey, action, ...data }), redirect:"follow" });
  let o = null; try { o = await res.json(); } catch(e){}
  if (!o) throw new Error("no reply from your Google script – check the link");
  if (!o.ok) {
    const old = o.error === "Unknown action" || /Argument cannot be null|Cannot read propert|newBlob/i.test(o.error || "");
    throw new Error(old ? "your Google script is the old version – paste in the new setup script, then Deploy › Manage deployments › Edit (pencil) › Version: New version › Deploy" : (o.error || "script error"));
  }
  return o;
}
function isEditing(){ const a = document.activeElement; return !!(a && a.matches && a.matches("input,textarea,select") && document.getElementById("app").contains(a)); }
async function syncNow(){
  if (!settings.sendUrl) return;
  if (syncing) { syncAgain = true; return; }
  if (navigator.onLine === false) { setSync("offline"); return; }
  syncing = true; setSync("syncing");
  try {
    if (persistTimer) { clearTimeout(persistTimer); await writeNow(); }
    const { items } = await api("list", {});
    const remote = {}; (items || []).forEach(i => remote[i.id] = i.updated || 0);
    const push = jobs.filter(x => !x.example && (x.updated || 0) > (remote[x.id] || 0));
    for (let i = 0; i < push.length; i += 4) await api("save", { jobs: JSON.parse(JSON.stringify(push.slice(i, i + 4))) });
    const local = {}; jobs.forEach(x => local[x.id] = x.updated || 0);
    const want = Object.keys(remote).filter(id => remote[id] > (local[id] || 0));
    let changed = false, openChanged = false;
    for (let i = 0; i < want.length; i += 10) {
      const { jobs: got } = await api("get", { ids: want.slice(i, i + 10) });
      (got || []).forEach(g => {
        normaliseJob(g);
        const k = jobs.findIndex(x => x.id === g.id);
        if (k < 0) { jobs.push(g); changed = true; }
        else if ((g.updated || 0) > (jobs[k].updated || 0)) { jobs[k] = g; changed = true; if (g.id === view.jobId) openChanged = true; }
      });
    }
    settings.lastSync = Date.now();
    lsWrite();
    setSync("idle");
    if (changed && !isEditing() && !(openChanged && view.screen === "job" && view.circ)) rerender();
  } catch(e){
    setSync(navigator.onLine === false ? "offline" : "error", String(e.message || e).slice(0, 90));
  }
  syncing = false;
  processQueue();
  if (syncAgain) { syncAgain = false; scheduleSync(1500); }
}

/* ------------------------------------------------------------------ sending to the office */
let sending = false;
function jobTitle(job){ return (job.address || job.client.name || "Untitled job").split("\n")[0]; }
function outcomeText(job){
  const s = jobSummary(job), t = typeOf(job);
  if (t === "EICR") return s.status === "fail" ? "UNSATISFACTORY" : s.status === "pass" ? "SATISFACTORY" : "not yet assessed";
  return s.status === "fail" ? "TEST FAILURES" : s.status === "pass" ? "all tests passed" : "tests incomplete";
}
function reportSubject(job){ return `${TYPES[typeOf(job)]} ${job.reportNo ? job.reportNo + " – " : ""}${jobTitle(job)} – ${ukDate(job.inspDate)} – ${outcomeText(job)}`; }
function reportBody(job){
  const s = jobSummary(job), t = typeOf(job);
  return `<p>${esc(TYPE_LONG[t])} from ${esc((job.company || settings).company)} – signed by ${esc(job.inspector)}.</p>
<table cellpadding="4" style="border-collapse:collapse;font-family:Arial;font-size:13px">
<tr><td><b>Installation</b></td><td>${esc(job.address)}</td></tr>
<tr><td><b>Client</b></td><td>${esc(job.client.name)}</td></tr>
<tr><td><b>Date</b></td><td>${esc(ukDate(job.inspDate))}</td></tr>
<tr><td><b>Number</b></td><td>${esc(job.reportNo)}</td></tr>
<tr><td><b>${t === "EICR" ? "Overall assessment" : "Test results"}</b></td><td><b>${esc(outcomeText(job))}</b></td></tr>
${t === "EICR" ? `<tr><td><b>Observations</b></td><td>C1 ${s.counts.C1} · C2 ${s.counts.C2} · C3 ${s.counts.C3} · FI ${s.counts.FI}</td></tr>` : `<tr><td><b>Work</b></td><td>${esc(job.work.desc)}</td></tr>`}
<tr><td><b>Circuits tested</b></td><td>${s.tested} of ${s.total}</td></tr>
${t !== "MW" ? `<tr><td><b>Next inspection due</b></td><td>${esc(ukDate(s.nextDue))}</td></tr>` : ""}</table>
<p>Attached: the certificate/report as a PDF, the same document as a web page (open in a browser to print), and a data file that can be loaded back into the BlueForge app. A copy is also saved in the BlueForge EICR folder in Google Drive.</p>`;
}
function jobBackup(job){ return JSON.stringify({app:"blueforge-eicr", version:2, saved:new Date().toISOString(), jobs:[job]}); }
async function sendJob(job){
  await api("send", { to: settings.officeEmail, subject: reportSubject(job), body: reportBody(job),
    reportHtml: exportHtml(job), reportName: fileName(job, "html"), pdfName: fileName(job, "pdf"),
    backup: jobBackup(job), backupName: fileName(job, "json") });
}
async function processQueue(){
  if (sending || !settings.sendUrl || navigator.onLine === false) return;
  const queue = liveJobs().filter(x => x.sendQueued && (!x.sendDevice || x.sendDevice === settings.deviceId));
  if (!queue.length) return;
  sending = true;
  for (const job of queue){
    try { await sendJob(job); job.sendQueued = false; job.sentAt = Date.now(); job.sendError = ""; job.updated = Date.now(); }
    catch(e){ job.sendError = String(e.message || e); }
    lsWrite();
  }
  sending = false;
  scheduleSync(1000);
  if (!isEditing() && (view.screen === "home" || (view.screen === "job" && ["report","cert"].includes(view.tab)))) rerender();
}
async function shareToEmail(job){
  const files = [new File([exportHtml(job)], fileName(job, "html"), {type:"text/html"})];
  const data = { title: reportSubject(job), text: `${TYPES[typeOf(job)]} for ${jobTitle(job)} – please file. (Send to ${settings.officeEmail})`, files };
  if (navigator.canShare && navigator.canShare(data)) { try { await navigator.share(data); return true; } catch(e){ return e && e.name === "AbortError"; } }
  location.href = `mailto:${encodeURIComponent(settings.officeEmail)}?subject=${encodeURIComponent(reportSubject(job))}&body=${encodeURIComponent("The report file was saved to Downloads on the phone – please attach it to this email.")}`;
  return true;
}
async function finishAndSend(){
  const job = j(); if (!job || job.example) return;
  const copies = [{name: fileName(job, "html"), text: exportHtml(job), type: "text/html"}, {name: fileName(job, "json"), text: jobBackup(job), type: "application/json"}];
  job.finishedAt = Date.now();
  const auto = settings.sendUrl && settings.autoSend !== "No";
  if (auto) { job.sendQueued = true; job.sendError = ""; job.sendDevice = settings.deviceId; }
  if (!job.issueDate) job.issueDate = today();
  markDirty(job); rerender();
  if (IOS) { processQueue(); await shareFiles(copies, reportSubject(job)); return; }
  downloadFile(copies[0].name, copies[0].text, copies[0].type);
  setTimeout(() => downloadFile(copies[1].name, copies[1].text, copies[1].type), 600);
  if (auto) processQueue(); else { await shareToEmail(job); rerender(); }
}
function sendStatus(job){
  if (job.sendQueued) return job.sendDevice && job.sendDevice !== settings.deviceId ? pill("check","Sending from other device") : navigator.onLine === false ? pill("check","Waiting for signal") : pill("check", job.sendError ? "Retrying" : "Sending…");
  if (job.sentAt) return pill("pass","Sent to office");
  return "";
}
function connectionCode(){ try { return "BFEICR:" + btoa(unescape(encodeURIComponent(JSON.stringify({u: settings.sendUrl, k: settings.sendKey, o: settings.officeEmail})))); } catch(e){ return ""; } }
function applyConnectionCode(code){
  const m = String(code || "").trim().match(/^BFEICR:(.+)$/);
  if (!m) throw new Error("That isn't a BlueForge connection code.");
  const d = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
  if (!d.u || !d.k) throw new Error("The code is incomplete.");
  settings.sendUrl = d.u; settings.sendKey = d.k; if (d.o) settings.officeEmail = d.o;
  settings.lastSync = 0; lsWrite();
}
function scriptText(){
  return `// BlueForge EICR – syncs reports to Google Drive and emails finished certificates to the office.
// Setup: paste into a new project at script.google.com, Save, run "authorise" once and allow access,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
// Copy the web app URL into the app (Settings > Sync & office).
// To change anything later, edit here and use Deploy > Manage deployments > Edit > New version.
var KEY = "${settings.sendKey}";
var OFFICE = "${settings.officeEmail}";
var FOLDER_NAME = "BlueForge EICR";   // created in your Google Drive on first use. To use a shared drive folder, put its ID in FOLDER_ID below.
var FOLDER_ID = "";

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.key !== KEY) return reply({ok: false, error: "Wrong key – reconnect this device"});
    var action = d.action || (d.test ? "test" : (d.reportHtml ? "send" : ""));
    if (action === "test") {
      MailApp.sendEmail({to: d.to || OFFICE, subject: "BlueForge EICR – test email", htmlBody: "<p>The BlueForge app is connected. Reports will be emailed here and saved in the " + FOLDER_NAME + " folder in Google Drive.</p>", name: "BlueForge EICR"});
      folder_();
      return reply({ok: true});
    }
    if (action === "list") {
      var idx = readIndex_(), items = [];
      for (var id in idx) items.push({id: id, updated: idx[id]});
      return reply({ok: true, items: items});
    }
    if (action === "save") {
      var lock = LockService.getScriptLock(); lock.waitLock(25000);
      try {
        var idx2 = readIndex_(), data = sub_("Data");
        (d.jobs || []).forEach(function (job) {
          if (!job || !job.id || !/^[a-z0-9]+$/i.test(job.id)) return;
          if ((job.updated || 0) <= (idx2[job.id] || 0)) return;
          var s = JSON.stringify(job), f = file_(data, job.id + ".json");
          if (f) f.setContent(s); else data.createFile(job.id + ".json", s, "application/json");
          idx2[job.id] = job.updated || 0;
        });
        writeIndex_(idx2);
      } finally { lock.releaseLock(); }
      return reply({ok: true});
    }
    if (action === "get") {
      var data2 = sub_("Data"), out = [];
      (d.ids || []).forEach(function (id) { var f = file_(data2, id + ".json"); if (f) out.push(JSON.parse(f.getBlob().getDataAsString())); });
      return reply({ok: true, jobs: out});
    }
    if (action === "send") {
      var files = [], pdf = null;
      try { pdf = Utilities.newBlob(d.reportHtml, "text/html", "report.html").getAs("application/pdf").setName(d.pdfName); files.push(pdf); } catch (err) {}
      var html = Utilities.newBlob(d.reportHtml, "text/html", d.reportName);
      files.push(html);
      files.push(Utilities.newBlob(d.backup, "application/json", d.backupName));
      MailApp.sendEmail({to: d.to || OFFICE, subject: d.subject, htmlBody: d.body, attachments: files, name: "BlueForge EICR"});
      var certs = sub_("Certificates");
      if (pdf) replace_(certs, d.pdfName, pdf); else replace_(certs, d.reportName, html);
      return reply({ok: true});
    }
    return reply({ok: false, error: "Unknown action"});
  } catch (err) {
    return reply({ok: false, error: String(err)});
  }
}
function folder_() {
  if (FOLDER_ID) return DriveApp.getFolderById(FOLDER_ID);
  var p = PropertiesService.getScriptProperties(), id = p.getProperty("FOLDER_ID");
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = DriveApp.createFolder(FOLDER_NAME); p.setProperty("FOLDER_ID", f.getId()); return f;
}
function sub_(name) { var f = folder_(), it = f.getFoldersByName(name); return it.hasNext() ? it.next() : f.createFolder(name); }
function file_(folder, name) { var it = folder.getFilesByName(name); return it.hasNext() ? it.next() : null; }
function replace_(folder, name, blob) { var old = file_(folder, name); if (old) old.setTrashed(true); folder.createFile(blob.copyBlob().setName(name)); }
function readIndex_() { var f = file_(sub_("Data"), "index.json"); return f ? JSON.parse(f.getBlob().getDataAsString() || "{}") : {}; }
function writeIndex_(idx) { var data = sub_("Data"), f = file_(data, "index.json"), s = JSON.stringify(idx); if (f) f.setContent(s); else data.createFile("index.json", s, "application/json"); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
// Run once from the editor to grant permission to send email and use Drive.
function authorise() { MailApp.getRemainingDailyQuota(); folder_(); }
`;
}

/* ------------------------------------------------------------------ view state */
let view = { screen:"home", jobId:null, tab:"job", board:0, circ:null, confirmDel:null };
let EX = null;
const curJob = () => view.jobId === "example" ? (EX || (EX = exampleJob())) : jobs.find(j => j.id === view.jobId);
const curBoard = () => { const j = curJob(); return j && j.boards[Math.min(view.board, j.boards.length - 1)]; };
const curCirc = () => { const b = curBoard(); return b && view.circ !== null ? b.circuits.find(c => c.id === view.circ) : null; };
function roots(){ return { job: curJob(), board: curBoard(), circ: curCirc(), settings }; }

/* ------------------------------------------------------------------ form builders */
function bindVal(bind){ const [root, ...rest] = bind.split("."); return getPath(roots()[root], rest.join(".")); }
function field(label, bind, opts={}){
  const v = bindVal(bind) ?? "";
  const cls = opts.num ? "num" : "";
  const ph = opts.ph ? ` placeholder="${esc(opts.ph)}"` : "";
  const im = opts.num ? ` inputmode="decimal" autocomplete="off"` : opts.type === "tel" ? ` inputmode="tel"` : "";
  const type = opts.type === "date" ? "date" : opts.type === "email" ? "email" : "text";
  const id = "f-" + bind.replace(/\./g,"-");
  let input;
  if (opts.area) input = `<textarea id="${id}" data-bind="${bind}"${ph}>${esc(v)}</textarea>` + (SR && !bind.startsWith("settings") ? `<button type="button" class="btn ghost sm dict" data-dictate="${bind}">🎤 Dictate</button>` : "");
  else input = `<input id="${id}" type="${type}" class="${cls}" data-bind="${bind}" value="${esc(v)}"${ph}${im}>`;
  if (opts.unit) input = `<div class="unit">${input}<em>${esc(opts.unit)}</em></div>`;
  return `<label class="field" for="${id}"><span>${esc(label)}</span>${input}${opts.hint ? `<span class="hint">${opts.hint}</span>` : ""}${opts.extra || ""}</label>`;
}
function select(label, bind, options, opts={}){
  const v = bindVal(bind) ?? "";
  const id = "f-" + bind.replace(/\./g,"-");
  const o = [`<option value="">${esc(opts.blank || "Choose…")}</option>`].concat(options.map(x => { const [val, txt] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}"${String(val) === String(v) ? " selected" : ""}>${esc(txt)}</option>`; })).join("");
  return `<label class="field" for="${id}"><span>${esc(label)}</span><select id="${id}" data-bind="${bind}"${opts.rerender ? " data-rerender" : ""}>${o}</select></label>`;
}
function chips(label, bind, options, opts={}){
  const v = bindVal(bind) ?? "";
  const b = options.map(x => { const [val, txt] = Array.isArray(x) ? x : [x, x]; const on = String(val) === String(v); return `<button type="button" class="chip ${opts.small ? "small" : ""} ${opts.codes ? "code-" + esc(val) : ""}" data-chip="${bind}" data-val="${esc(val)}" aria-pressed="${on}">${esc(txt)}</button>`; }).join("");
  return `<div class="field"><span>${esc(label)}</span><div class="chips" role="group" aria-label="${esc(label)}">${b}</div></div>`;
}
function autoBox(label, key){ return `<div class="field"><span>${esc(label)}</span><div class="auto" data-derived="${key}">${DERIVED[key]()}</div></div>`; }
const pill = (s, t) => `<span class="pill ${s}">${esc(t)}</span>`;
const resultPill = r => r === "pass" ? pill("pass","PASS") : r === "fail" ? pill("fail","FAIL") : r === "check" ? pill("check","CHECK") : pill("none","Not tested");
const icon = n => ({
  job:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  supply:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  circuits:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8v4M11 8v4M15 8v4M7 16h10"/></svg>',
  inspect:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h10M4 12h10M4 18h10"/><path d="m16 6 2 2 3-4M16 18l2 2 3-4"/></svg>',
  cert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M14.5 4.5l5 5L9 20H4v-5z"/></svg>',
  report:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 3 20h18z"/><path d="M12 10v4M12 17v.5"/></svg>'
}[n]);

/* ------------------------------------------------------------------ derived blocks (live-updated) */
const DERIVED = {
  design(){
    const j = curJob(), b = curBoard(), c = curCirc(); if (!c) return "";
    const r = calcCircuit(j, b, c);
    const f = (lbl, v, key, d=2) => `<div class="fig ${key ? "key" : ""}"><span>${lbl}</span><b>${v === null || v === undefined ? "–" : typeof v === "number" ? v.toFixed(d) : esc(v)}</b></div>`;
    return f("Max Zs (BS 7671)", r.maxZs ?? (r.maxNote || null)) + f("Max measured Zs (80%)", r.m80, true) + f("Disconnection time (s)", r.disc, false, 1) +
      f("Expected R1+R2 (Ω)", r.expR12) + f("Expected Zs (Ω)", r.expZs, true) + f("Max cable length (m)", r.maxLen, false, 0);
  },
  designnote(){
    const j = curJob(), b = curBoard(), c = curCirc(); if (!c) return "";
    const r = calcCircuit(j, b, c);
    if (r.zdb === null) return `<div class="warnline">Enter Ze on the Supply tab (or Zdb for this board) to get expected Zs and max length.</div>`;
    if (!c.dev || !c.rating) return `<div class="muted small">Pick the device and rating for the Zs limits.</div>`;
    return `<div class="muted small">Using Zdb ${r.zdb.toFixed(2)} Ω. Expected figures use cable resistance at 20 °C${c.ring === "Y" ? "; ring length ÷ 4" : ""}.</div>`;
  },
  results(){
    const j = curJob(), b = curBoard(), c = curCirc(); if (!c) return "";
    const r = calcCircuit(j, b, c);
    if (!r.checks.length) return `<div class="muted small">Results appear here as you enter readings.</div>`;
    const linked = j.obs.some(o => o.src === `circ:${b.id}:${c.id}`);
    return `<div class="checks">${r.checks.map(x => `<div class="chk ${x.s}"><div class="l">${esc(x.l)}</div><div class="x">${esc(x.t)}</div></div>`).join("")}</div>` +
      (r.result === "fail" && !j.example ? (linked ? `<div class="muted small">Written up on the Report tab.</div>` : `<button class="btn ghost sm" data-act="obsFromCirc">Add to observations</button>`) : "");
  },
  cpill(){ const j = curJob(), b = curBoard(), c = curCirc(); return c ? resultPill(calcCircuit(j, b, c).result) : ""; },
  zdbHint(){ const j = curJob(); const z = num(j.supply.ze); return z !== null ? `Leave blank to use Ze (${z.toFixed(2)} Ω). On a sub-board, enter the Zdb measured there.` : "Blank = use Ze from the Supply tab."; },
  supTypZe(){ const o = calcSupply(curJob()); return o.typZe === null ? `<span class="muted">Pick earthing</span>` : `${o.typZe} Ω` + (o.zeCheck ? " " + pill(o.zeCheck.s === "pass" ? "pass" : "check", o.zeCheck.s === "pass" ? "OK" : "High") : ""); },
  supZeNote(){ const o = calcSupply(curJob()); return o.zeCheck && o.zeCheck.s !== "pass" ? `<div class="warnline">${esc(o.zeCheck.t)}</div>` : ""; },
  supPefc(){ const o = calcSupply(curJob()); return o.pefc === null ? "–" : `${o.pefc.toFixed(2)} kA`; },
  supEarth(){ const o = calcSupply(curJob()); return o.minEarth ? `${o.minEarth} mm²` + (o.earthCheck ? " " + pill(o.earthCheck.s, o.earthCheck.s === "pass" ? "OK" : "UNDERSIZE") : "") : `<span class="muted">Enter tails csa</span>`; },
  supBond(){ const o = calcSupply(curJob()); return o.minBond ? `${o.minBond} mm²` + (o.bondCheck ? " " + pill(o.bondCheck.s, o.bondCheck.s === "pass" ? "OK" : "UNDERSIZE") : "") : `<span class="muted">Enter tails csa</span>`; },
  supRa(){ const o = calcSupply(curJob()); return o.raCheck ? pill(o.raCheck.s, o.raCheck.t) : `<span class="muted">TT only</span>`; },
  nextDue(){ const s = jobSummary(curJob()); return s.nextDue ? ukDate(s.nextDue) : `<span class="muted">Set premises type and date</span>`; },
  maxInt(){ const s = jobSummary(curJob()); return s.years ? (s.years < 1 ? "3 months" : `${s.years} year${s.years === 1 ? "" : "s"}`) : "–"; }
};
function refreshDerived(){ document.querySelectorAll("[data-derived]").forEach(el => { const f = DERIVED[el.dataset.derived]; if (f) el.innerHTML = f(); }); }

/* ------------------------------------------------------------------ screens */
function render(){
  const app = document.getElementById("app");
  const y = window.scrollY;
  let html = "";
  if (view.screen === "home") html = renderHome();
  else if (view.screen === "settings") html = renderSettings();
  else if (view.screen === "book") html = renderBook();
  else if (view.screen === "codes") html = renderCodes();
  else if (view.screen === "job") { if (curJob() && !curJob().deleted) html = renderJob(); else { view = {screen:"home", tab:"job", board:0, circ:null}; html = renderHome(); } }
  app.innerHTML = html;
  renderTabs();
  initSig();
  if (typeof renderVoice === "function") { if (!(view.screen === "job" && view.tab === "circuits" && curCirc()) && voice.mode === "readings" && voice.state !== "listening") voice.state = "idle"; renderVoice(); }
  if (view.keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  view.keepScroll = false;
}
function rerender(){ view.keepScroll = true; render(); }

function jobPill(j){
  const s = jobSummary(j), t = typeOf(j);
  if (j.handoff && !j.sig && settings.role !== "Tester") return pill("check","Ready to sign");
  if (t === "EICR") return s.status === "fail" ? pill("fail","UNSATISFACTORY") : s.status === "pass" && s.tested ? pill("pass","SATISFACTORY") : pill("none","In progress");
  return s.status === "fail" ? pill("fail","TEST FAILURES") : s.status === "pass" ? pill("pass","ALL PASSED") : pill("none","In progress");
}
function jobCard(j){
  const circ = j.boards.reduce((n,b) => n + b.circuits.length, 0);
  const extra = [];
  if (!j.example && (j.sentAt || j.sendQueued)) extra.push(sendStatus(j));
  if (j.handoff && settings.role === "Tester") extra.push(pill("none", "Sent for sign-off"));
  return `<button class="card-link" data-act="open" data-id="${esc(j.id)}"><div class="grow"><div class="t">${esc(jobTitle(j))}</div><div class="d"><span class="typetag">${esc(TYPES[typeOf(j)])}</span> ${esc(ukDate(j.inspDate))}${j.reportNo ? " · " + esc(j.reportNo) : ""} · ${circ} circuit${circ === 1 ? "" : "s"}${j.example ? ' · <span class="ex-tag">Example</span>' : ""}</div>${extra.length ? `<span class="row" style="gap:6px;margin-top:4px">${extra.join("")}</span>` : ""}</div>${jobPill(j)}</button>`;
}
function homeList(){
  const q = (view.homeQ || "").toLowerCase().trim();
  const list = liveJobs().filter(j => !q || [j.address, j.client.name, j.reportNo, TYPES[typeOf(j)], j.occupier].join(" ").toLowerCase().includes(q))
    .sort((a,b) => (b.updated||0) - (a.updated||0));
  if (!liveJobs().length) return `<div class="empty"><div>No reports yet. Tap <b>New</b> to start one, or open the example below to see how it works.</div></div>`;
  if (!list.length) return `<div class="empty">Nothing matches “${esc(view.homeQ)}”.</div>`;
  return `<div style="display:flex;flex-direction:column;gap:8px">${list.map(jobCard).join("")}</div>`;
}
function renderHome(){
  const ready = settings.role !== "Tester" ? liveJobs().filter(j => j.handoff && !j.sig).length : 0;
  return `<header class="top"><h1>BlueForge<span class="sub brandmark">CERTIFICATES &amp; REPORTS</span></h1><button class="iconbtn" data-act="settings" aria-label="Settings">⚙</button></header>
  ${statusHtml()}
  <main>
    ${view.chooser ? `<div class="card"><h2>New</h2>
      <button class="card-link" data-act="newType" data-type="EICR"><div class="grow"><div class="t">EICR</div><div class="d">Condition report on an existing installation</div></div></button>
      <button class="card-link" data-act="newType" data-type="EIC"><div class="grow"><div class="t">EIC</div><div class="d">New installation, new circuits, consumer unit change</div></div></button>
      <button class="card-link" data-act="newType" data-type="MW"><div class="grow"><div class="t">Minor Works</div><div class="d">Addition or alteration that doesn't add a new circuit</div></div></button>
      <button class="btn ghost sm" data-act="chooserOff">Cancel</button></div>`
      : `<button class="btn block" data-act="chooser">+ New</button>`}
    <div class="tiles">
      <button class="tile" data-act="book"><b>Handbook</b><span>Tables, test methods, calculators</span></button>
      <button class="tile" data-act="codes"><b>Coding guide</b><span>Search C1 · C2 · C3 · FI</span></button>
    </div>
    ${ready ? `<div class="warnline">${ready} job${ready === 1 ? "" : "s"} ready for your sign-off.</div>` : ""}
    <div class="card"><h2>Your jobs <span class="count">${liveJobs().length}</span></h2>
      ${liveJobs().length > 3 ? `<label class="field" for="homeq"><span>Search</span><input id="homeq" type="search" data-local="homeQ" value="${esc(view.homeQ || "")}" placeholder="Address, client, number…" autocomplete="off"></label>` : ""}
      <div id="homelist">${homeList()}</div>
    </div>
    <div class="card"><h2>Example</h2>${jobCard(EX || (EX = exampleJob()))}<div class="muted small">A filled-in EICR on a shop board, so you can see the checks working. Changes to the example aren't saved.</div></div>
  </main>`;
}

function renderSettings(){
  const code = settings.sendUrl ? connectionCode() : "";
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Settings</h1></header>
  ${statusHtml()}
  <main>
    <div class="card"><h2>Who uses this device</h2>
      ${field("Your name","settings.userName",{ph:"e.g. Adam Fyles"})}
      ${chips("Role","settings.role",[["Inspector","Inspector – signs off"],["Tester","Tester – sends for sign-off"]])}
      ${settings.role === "Tester" ? field("Who signs your work off","settings.signOffName") : ""}
      <div class="muted small">${settings.role === "Tester" ? "You fill in and test. When a job is done, tap <b>Send for sign-off</b> – it syncs to " + esc(settings.signOffName || "the inspector") + ", who checks, signs and sends it to the office." : "Jobs your tester marks ready show up on your list with <b>Ready to sign</b>."}</div>
    </div>
    <div class="card"><h2>Sync &amp; office</h2>
      ${field("Office email","settings.officeEmail",{type:"email"})}
      ${chips("Email finished certificates to the office automatically","settings.autoSend",["Yes","No"])}
      ${field("Sync link (Google script web app URL)","settings.sendUrl",{ph:"https://script.google.com/macros/s/…/exec",hint:settings.sendUrl ? "Connected. Jobs sync to the BlueForge EICR folder in Google Drive." : "Not set up yet. Until it is, jobs stay on this device and Finish &amp; send opens your email app."})}
      <div class="row"><button class="btn ghost sm" data-act="syncNow">Sync now</button><button class="btn ghost sm" data-act="testSend">Send test email</button></div>
      <div id="sendmsg"></div>
      <details class="more"><summary>Set up sync and email (once, on a computer)</summary><div class="small">
        <ol style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px">
          <li>Tap <b>Copy setup script</b> below and send it to yourself, or open this app on your computer.</li>
          <li>Go to <b>script.google.com</b>, signed in to your Google account, and click <b>New project</b>.</li>
          <li>Delete what's there, paste the script, click <b>Save</b>.</li>
          <li>Choose <b>authorise</b> in the function list and click <b>Run</b>. Allow it to send email and use Google Drive.</li>
          <li><b>Deploy › New deployment</b>, type <b>Web app</b>, <i>Execute as: Me</i>, <i>Who has access: Anyone</i>, then <b>Deploy</b>.</li>
          <li>Paste the <b>Web app URL</b> into <i>Sync link</i> above, then tap <b>Send test email</b>.</li>
        </ol>
        <div class="muted">Everything is stored in a <b>BlueForge EICR</b> folder in your own Google Drive: <i>Data</i> (jobs, synced between devices) and <i>Certificates</i> (a PDF of each finished certificate). Nobody else can use the script without this app's private key.</div>
        <button class="btn ghost sm" data-act="copyScript">Copy setup script</button>
        <textarea id="scriptbox" readonly hidden style="width:100%;min-height:160px;font-family:var(--f-mono);font-size:11px"></textarea>
      </div></details>
    </div>
    <div class="card"><h2>Connect another device</h2>
      ${code ? `<div class="muted small">On your partner's phone or your PC: open the app, go to ⚙ › <b>Connect this device</b> and paste this code. It links to the same Drive folder and office email.</div>
        <textarea id="conncode" readonly style="width:100%;min-height:70px;font-family:var(--f-mono);font-size:11px;border:1.5px solid var(--line);border-radius:10px;padding:8px;background:var(--field)">${esc(code)}</textarea>
        <button class="btn ghost sm" data-act="copyCode">Copy code</button>` : `<div class="muted small">Set up sync first – then a code appears here to link other devices.</div>`}
      <label class="field" for="joincode"><span>Connect this device</span><textarea id="joincode" placeholder="Paste a BFEICR: code here" style="min-height:60px"></textarea></label>
      <button class="btn sm" data-act="join">Connect</button><div id="joinmsg"></div>
    </div>
    <div class="card"><h2>Contractor</h2>
      ${field("Company","settings.company")}${field("Inspector (signs certificates)","settings.inspector")}${field("Position","settings.position")}
      ${field("Address","settings.address",{area:true})}
      <div class="grid2">${field("Telephone","settings.phone",{type:"tel"})}${field("Email","settings.email",{type:"email"})}</div>
      ${field("Registration / scheme no.","settings.reg",{ph:"Leave blank if not registered"})}
    </div>
    <div class="card"><h2>Test instruments</h2><div class="muted small">Filled in automatically on each new board.</div>
      ${field("Multifunction tester (make / serial)","settings.mft")}${field("Insulation resistance tester serial","settings.irSerial",{ph:"e.g. As MFT"})}
      ${field("Continuity / loop / RCD tester serial","settings.loopSerial",{ph:"e.g. As MFT"})}${field("Earth electrode tester serial","settings.elecSerial")}
    </div>
    <div class="card"><h2>Backup file</h2>
      <div class="muted small">${IOS ? "On iPhone, always open the app from its home screen icon – data saved there is kept separately from Safari. " : ""}Everything is kept on this device${settings.sendUrl ? " and synced to Google Drive" : ""}. A backup file is an extra copy you can keep anywhere or load onto another device.</div>
      <button class="btn block" data-act="backup">Save backup file</button>
      <label class="btn block ghost" for="restore">Load a backup or job file</label>
      <input type="file" id="restore" accept=".json,application/json,text/plain" hidden>
      <div id="backupmsg"></div>
    </div>
  </main>`;
}

const TABS = {
  EICR: [["job","Job"],["supply","Supply"],["circuits","Circuits"],["inspect","Inspect"],["report","Report"]],
  EIC:  [["job","Work"],["supply","Supply"],["circuits","Circuits"],["inspect","Inspect"],["cert","Certify"]],
  MW:   [["job","Work"],["supply","Supply"],["circuits","Circuit"],["cert","Certify"]]
};
function renderJob(){
  const job = curJob();
  const t = typeOf(job);
  if (!TABS[t].some(x => x[0] === view.tab)) view.tab = "job";
  if (view.tab === "circuits" && curCirc()) return renderCircuit();
  const body = { job: t === "EICR" ? tabJob : tabWork, supply:tabSupply, circuits:tabCircuits, inspect:tabInspect, report:tabReport, cert:tabCert }[view.tab]();
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="All jobs">←</button><h1>${esc(jobTitle(job) === "Untitled job" ? "New " + TYPES[t] : jobTitle(job))}<span class="sub">${job.example ? "Example – not saved" : esc(TYPES[t]) + (job.reportNo ? " · " + esc(job.reportNo) : "")}</span></h1></header>
  ${job.example ? `<div class="status warn"><span class="dot"></span>Example report – edits aren't saved</div>` : statusHtml()}
  ${job.handoff && !job.sig && settings.role !== "Tester" && view.tab === "job" ? `<main style="padding-bottom:0"><div class="warnline">Tested by ${esc(job.handoff.by)} and sent for sign-off ${esc(agoText(job.handoff.at))}. Check it through, then sign on the ${t === "EICR" ? "Report" : "Certify"} tab.</div></main>` : ""}
  <main>${body}</main>`;
}

function renderTabs(){
  const nav = document.getElementById("tabs");
  if (view.screen !== "job" || !curJob() || (view.tab === "circuits" && curCirc())) { nav.hidden = true; nav.innerHTML = ""; return; }
  const job = curJob(), s = jobSummary(job), t = TABS[typeOf(job)];
  const warn = s.unwrittenFails.length + s.coded.length + (typeOf(job) !== "EICR" ? s.fails.length : 0);
  nav.hidden = false;
  nav.innerHTML = `<div class="in" style="grid-template-columns:repeat(${t.length},1fr)">${t.map(([k,l]) => `<button class="tab" data-tab="${k}" ${view.tab === k ? 'aria-current="page"' : ""}>${icon(k)}<span>${l}${(k === "report" || k === "cert") && warn ? `<span class="badge">${warn}</span>` : ""}</span></button>`).join("")}</div>`;
}

/* ---------------- EIC / Minor Works: the work tab */
const NOTIFY = [["newCircuit","A new circuit"],["cu","Consumer unit replacement"],["kitchen","Adding to a circuit in a kitchen"],["special","Work in a bath/shower room, pool or sauna"],["outdoor","Outdoor, garden or outbuilding wiring, external sockets"],["specialInst","Underfloor/ceiling heating, solar PV, micro-CHP, ELV lighting, heating controls"]];
function tabWork(){
  const job = j(), t = typeOf(job), w = job.work;
  const notifiable = NOTIFY.some(([k]) => w.notify[k] === "Yes");
  return `
  <div class="card"><h2>${t === "EIC" ? "Certificate" : "Minor works"}</h2><div class="grid2">${field(t === "EIC" ? "Certificate number" : "Certificate number","job.reportNo")}${field(t === "EIC" ? "Date of completion" : "Date work completed","job.inspDate",{type:"date"})}</div></div>
  <div class="card"><h2>Client</h2>${field("Client","job.client.name")}${field("Telephone","job.client.phone",{type:"tel"})}${field("Client address","job.client.address",{area:true})}</div>
  <div class="card"><h2>Installation</h2>${field("Installation address","job.address",{area:true})}${field("Occupier","job.occupier")}
    ${select("Description of premises","job.premises",PREMISES.map(p => p[0]),{rerender:true})}</div>
  <div class="card"><h2>The work</h2>
    ${t === "EIC" ? chips("Nature of the work","job.work.nature",["New installation","Addition","Alteration"]) : ""}
    ${field(t === "EIC" ? "Description of the installation work" : "Description of the minor works","job.work.desc",{area:true,ph: t === "EIC" ? "e.g. Consumer unit replacement and new 32 A radial to garage" : "e.g. Two additional socket-outlets on existing kitchen ring"})}
    ${t === "EIC" ? field("Extent of work covered by this certificate","job.work.extent",{area:true}) : ""}
    ${t === "EIC" ? field("Maximum demand","job.work.maxDemand",{num:true,unit:"A"}) : ""}
  </div>
  <div class="card"><h2>Building regs – notifiable work (Wales)</h2>
    <div class="muted small">Tick anything this job includes.</div>
    ${NOTIFY.map(([k,l]) => chips(l, "job.work.notify." + k, ["Yes","No"], {small:true})).join("")}
    ${notifiable ? `<div class="errline">This is notifiable work. As you're not on a competent person scheme, building control must be notified <b>before</b> the work starts (building notice or full plans).</div>${field("Building control reference","job.work.bcRef")}` : `<div class="muted small">Nothing notifiable ticked. See Handbook › Notifiable work for the full list.</div>`}
  </div>
  <div class="card"><h2>Departures and existing installation</h2>
    ${field("Departures from BS 7671 (if any)","job.work.departures",{area:true,ph:"None"})}
    ${field("Comments on the existing installation","job.work.existing",{area:true})}
    ${job.example ? "" : `<button class="btn ghost sm" data-act="codesFor" data-target="existing">Find a defect in the coding guide</button>`}
  </div>`;
}

/* ---------------- EIC / Minor Works: certify tab */
function signBlock(job){
  if (settings.role === "Tester") return `<div class="card"><h2>Sign-off</h2><div class="muted">This will be signed by <b>${esc(job.inspector || settings.signOffName)}</b>. When everything is filled in and tested, send it for sign-off below.</div></div>`;
  return `<div class="field"><span>Signature</span><canvas class="sig" id="sig" aria-label="Sign here with your finger"></canvas><div class="row"><span class="muted small">Sign with your finger</span><span class="spacer"></span><button class="btn ghost sm" data-act="clearSig">Clear</button></div></div>`;
}
function tabCert(){
  const job = j(), t = typeOf(job), s = jobSummary(job), w = job.work;
  const problems = [];
  s.fails.forEach(f => problems.push(`<div class="errline">${esc(f.b.ref)} circuit ${esc(f.c.no)} (${esc(f.c.desc || "no description")}) has failed a test.</div>`));
  s.inspFails.forEach(([id,q]) => problems.push(`<div class="errline">Inspection ${esc(id)} marked ✗ – ${esc(q)}.</div>`));
  s.incomplete.forEach(f => problems.push(`<div class="warnline">${esc(f.b.ref)} circuit ${esc(f.c.no)} (${esc(f.c.desc || "no description")}) – ${esc(f.why)}</div>`));
  if (!s.total) problems.push(`<div class="warnline">No circuits added yet – add them on the ${t === "MW" ? "Circuit" : "Circuits"} tab.</div>`);
  if (s.untested) problems.push(`<div class="warnline">${s.untested} circuit${s.untested === 1 ? " has" : "s have"} no test results yet.</div>`);
  if (NOTIFY.some(([k]) => w.notify[k] === "Yes") && !w.bcRef) problems.push(`<div class="warnline">Notifiable work – add the building control reference on the Work tab.</div>`);
  const banner = s.status === "fail" ? `<div class="banner fail"><span class="small">Test results</span><strong>NOT READY</strong><span class="small">Every circuit must pass before this can be certified.</span></div>`
    : s.status === "pass" ? `<div class="banner pass"><span class="small">Test results</span><strong>ALL PASSED</strong><span class="small">Ready to sign.</span></div>`
    : `<div class="banner none"><span class="small">Test results</span><strong>In progress</strong><span class="small">${s.incomplete.length ? "Some results still need checking or filling in." : "Fill in the circuit test results."}</span></div>`;
  const decl = t === "EIC" ? `
    ${settings.role === "Tester" ? "" : chips("Designed, constructed, inspected and tested by the same person","job.work.sameSigner",["Yes","No"])}
    ${w.sameSigner === "No" ? `<div class="grid2">${field("Designer","job.work.designer")}${field("Design date","job.work.designDate",{type:"date"})}</div><div class="grid2">${field("Constructor","job.work.constructor")}${field("Construction date","job.work.constructDate",{type:"date"})}</div>` : ""}
    <div class="grid2">${field(w.sameSigner === "No" ? "Inspected and tested by" : "Name","job.inspector")}${field("Position","job.position")}</div>` :
    `<div class="grid2">${field("Name","job.inspector")}${field("Position","job.position")}</div>`;
  return `${banner}
  ${problems.length ? `<div class="card"><h2>To sort out</h2>${problems.join("")}</div>` : ""}
  ${t === "EIC" ? `<div class="card"><h2>Next inspection</h2>
    <div class="grid2">${autoBox("Max interval for premises","maxInt")}${field("Your interval (optional)","job.recInterval",{num:true,unit:"yrs"})}</div>
    ${autoBox("Recommended first inspection by","nextDue")}</div>` : ""}
  <div class="card"><h2>Declaration</h2>${decl}
    ${settings.role === "Tester" ? "" : signBlock(job)}
    <div class="grid2">${field("Date signed","job.sigDate",{type:"date"})}${field("Date of issue","job.issueDate",{type:"date"})}</div>
  </div>
  ${settings.role === "Tester" ? signBlock(job) : ""}
  ${finishCard(job)}`;
}

/* ---------------- finishing: shared by all report types */
function finishCard(job){
  const t = typeOf(job), noun = t === "EICR" ? "report" : "certificate";
  if (job.example) return `<div class="card"><h2>Finished ${noun}</h2><button class="btn block ghost" data-act="print">Print / save as PDF</button></div>`;
  const tester = settings.role === "Tester";
  const main = tester
    ? `<button class="btn block" data-act="handoff">${job.handoff ? "Send for sign-off again" : "Send for sign-off"}</button>
       <div class="muted small">${job.handoff ? `Sent ${esc(agoText(job.handoff.at))}. ` : ""}${settings.sendUrl ? `It syncs to ${esc(job.inspector || settings.signOffName)} automatically when you have signal.` : "Sync isn't set up on this phone – set it up in ⚙ so the job reaches the inspector, or use Share job file below."}</div>
       <button class="btn ghost sm" data-act="shareJob">Share job file</button>`
    : (() => { const blockers = [];
        if (!job.sig) blockers.push("sign the declaration");
        if (t !== "EICR" && jobSummary(job).status !== "pass") blockers.push("get every circuit tested and passing");
        return blockers.length ? `<button class="btn block" disabled style="opacity:.5">Finish &amp; send to office</button><div class="warnline">Before finishing: ${blockers.join(" and ")}.</div>` : "";
      })() + `<button class="btn block" data-act="finish" ${!job.sig || (t !== "EICR" && jobSummary(job).status !== "pass") ? "hidden" : ""}>${job.sentAt || job.sendQueued ? "Send again to office" : "Finish &amp; send to office"}</button>
       <div class="row small"><span class="muted">To ${esc(settings.officeEmail)}${settings.sendUrl ? " and your Google Drive" : ""}. ${IOS ? (settings.sendUrl ? "Choose <b>Save to Files</b> to keep a copy on the phone." : "Choose <b>Mail</b> to send it to the office, or <b>Save to Files</b> to keep a copy.") : "A copy is also saved to Downloads."}</span>${sendStatus(job)}</div>
       ${job.sendError && job.sendQueued ? `<div class="warnline">Not sent yet: ${esc(job.sendError)}. It will keep trying.</div>` : ""}
       `;
  return `<div class="card"><h2>Finished ${noun}</h2>${main}
    <button class="btn block ghost" data-act="print">Print / save as PDF</button>
    <div class="muted small">${IOS ? `Shows the full ${noun}. Tap <b>Print / PDF</b>, then Share › <b>Save to Files</b> for a PDF. <b>Back to app</b> returns here.` : `Opens the full ${noun} laid out for A4. In the print screen choose <b>Save as PDF</b>.`}</div>
    <button class="btn block ghost" data-act="export">Download ${noun} file</button><div id="exportmsg"></div>
  </div>
  <div class="card"><h2>Delete</h2>${view.confirmDel === "job" ? `<div class="row"><span class="small">Delete this whole ${noun} from every synced device? This can't be undone.</span><button class="btn danger sm" data-act="delJob">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<button class="btn danger sm" data-act="askDel" data-what="job">Delete this ${noun}</button>`}</div>`;
}

/* ---------------- handbook */
const VD_MVAM = {1:44, 1.5:29, 2.5:18, 4:11, 6:7.3, 10:4.4, 16:2.8};
function zsTableHtml(){
  const dev = view.bookDev || "BS EN 60898 MCB Type B";
  const rows = Object.keys(ZS[dev]).map(Number).sort((a,b) => a - b).map(In => { const [a,b] = ZS[dev][In];
    const f = v => v === null || v === undefined ? "–" : v.toFixed(2);
    return `<tr><td><b>${In} A</b></td><td>${f(a)}</td><td><b>${a == null ? "–" : r2(a*0.8).toFixed(2)}</b></td><td>${f(b)}</td><td><b>${b == null ? "–" : r2(b*0.8).toFixed(2)}</b></td></tr>`; }).join("");
  return `<label class="field" for="bookdev"><span>Device</span><select id="bookdev" data-local="bookDev">${Object.keys(ZS).map(d => `<option${d === dev ? " selected" : ""}>${esc(d)}</option>`).join("")}</select></label>
  <div class="tscroll"><table class="bt"><tr><th>Rating</th><th>0.4 s table</th><th>0.4 s 80%</th><th>5 s table</th><th>5 s 80%</th></tr>${rows}</table></div>
  <p class="muted small">MCB/RCBO values: 230 × 0.95 ÷ (5, 10 or 20 × In). Fuse values from the BS 7671 tables – check the BS 88 rows against your copy once.</p>`;
}
function resTableHtml(){
  const csa = CSA.slice(0, 7);
  return `<div class="tscroll"><table class="bt"><tr><th>csa mm²</th>${csa.map(c => `<th>${c}</th>`).join("")}</tr><tr><td>mΩ/m</td>${csa.map(c => `<td>${RES[c]}</td>`).join("")}</tr></table></div>
  <p class="muted small">Common T&amp;E pairs (R1+R2 mΩ/m): 1.0/1.0 = 36.20 · 1.5/1.0 = 30.20 · 2.5/1.5 = 19.51 · 4/1.5 = 16.71 · 6/2.5 = 10.49 · 10/4 = 6.44 · 16/6 = 4.23</p>`;
}
function calcHtml(){
  const c = view.calc || (view.calc = {vdCsa:"2.5", vdIb:"", vdL:"", vdType:"Other", adZs:"", adT:"0.1", adK:"115", dcKw:"", dcPh:"1", dcPf:"1"});
  const inp = (label, key, unit) => `<label class="field" for="calc-${key}"><span>${esc(label)}</span><div class="unit"><input id="calc-${key}" class="num" inputmode="decimal" data-calc="${key}" value="${esc(c[key])}"><em>${esc(unit)}</em></div></label>`;
  const ch = (label, key, opts) => `<div class="field"><span>${esc(label)}</span><div class="chips">${opts.map(o => `<button type="button" class="chip small" data-calcchip="${key}" data-val="${esc(o)}" aria-pressed="${String(c[key]) === String(o)}">${esc(o)}</button>`).join("")}</div></div>`;
  return `<div class="card"><h2>Voltage drop (T&amp;E)</h2>
    ${ch("Cable csa (mm²)","vdCsa",Object.keys(VD_MVAM))}
    <div class="grid2">${inp("Design current Ib","vdIb","A")}${inp("Length","vdL","m")}</div>
    ${ch("Circuit","vdType",["Lighting","Other"])}
    <div class="auto" id="calc-vd">${calcVd()}</div><div class="muted small">mV/A/m for 70 °C T&amp;E. For other cables, use the BS 7671 Appendix 4 figure: VD = mV/A/m × Ib × L ÷ 1000.</div></div>
  <div class="card"><h2>Adiabatic check</h2>
    <div class="grid2">${inp("Zs","adZs","Ω")}${inp("Disconnection time","adT","s")}</div>
    ${ch("k","adK",["115","143","176"])}
    <div class="auto" id="calc-ad">${calcAd()}</div><div class="muted small">115 T&amp;E cpc · 143 separate PVC cpc · 176 separate XLPE cpc. Fault current = 218.5 ÷ Zs.</div></div>
  <div class="card"><h2>Design current</h2>
    <div class="grid2">${inp("Load","dcKw","kW")}${inp("Power factor","dcPf","")}</div>
    ${ch("Phases","dcPh",["1","3"])}
    <div class="auto" id="calc-dc">${calcDc()}</div></div>`;
}
function calcVd(){ const c = view.calc, ib = num(c.vdIb), l = num(c.vdL), mv = VD_MVAM[c.vdCsa]; if (ib === null || l === null || !mv) return `<span class="muted">Enter current and length</span>`;
  const v = mv*ib*l/1000, lim = c.vdType === "Lighting" ? 6.9 : 11.5; return `${v.toFixed(2)} V (${(v/2.3).toFixed(1)}%) ${pill(v <= lim ? "pass" : "fail", v <= lim ? `within ${lim} V` : `over ${lim} V`)}`; }
function calcAd(){ const c = view.calc, zs = num(c.adZs), t = num(c.adT), k = num(c.adK); if (!zs || !t || !k) return `<span class="muted">Enter Zs and time</span>`;
  const I = 218.5/zs, S = Math.sqrt(I*I*t)/k; const std = CSA.find(x => x >= S - 1e-9); return `If ${Math.round(I)} A → min cpc ${S.toFixed(2)} mm²${std ? ` (use ${std} mm² or larger)` : ""}`; }
function calcDc(){ const c = view.calc, kw = num(c.dcKw), pf = num(c.dcPf) || 1; if (kw === null) return `<span class="muted">Enter the load</span>`;
  const a = c.dcPh === "3" ? kw*1000/(Math.sqrt(3)*400*pf) : kw*1000/(230*pf); return `${a.toFixed(1)} A${c.dcPh === "3" ? " per phase" : ""}`; }
function renderBook(){
  const ch = BF_BOOK.find(b => b.id === view.chapter);
  if (!ch && view.chapter !== "calc") return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Handbook<span class="sub">On-site guide</span></h1></header>
  <main><div class="muted small">Practical reminders in plain English. BS 7671 and the manufacturer's data always come first.</div>
    <button class="card-link" data-act="chapter" data-id="calc"><div class="grow"><div class="t">Calculators</div><div class="d">Voltage drop · adiabatic · design current</div></div></button>
    ${BF_BOOK.map(b => `<button class="card-link" data-act="chapter" data-id="${b.id}"><div class="grow"><div class="t">${esc(b.t)}</div></div></button>`).join("")}</main>`;
  const body = view.chapter === "calc" ? calcHtml() : `<div class="card book">${ch.h.replace("{{ZS_TABLE}}", zsTableHtml()).replace("{{RES_TABLE}}", resTableHtml())}</div>`;
  return `<header class="top"><button class="iconbtn" data-act="bookHome" aria-label="Back to contents">←</button><h1>${esc(ch ? ch.t : "Calculators")}<span class="sub">Handbook</span></h1></header><main>${body}</main>`;
}

/* ---------------- coding guide */
function codeMatches(){
  const q = (view.codeQ || "").toLowerCase().replace(/[^a-z0-9 .\/]/g, " ").split(/\s+/).filter(w => w.length > 1);
  const f = view.codeF || "All";
  return BF_CODES.filter(x => (f === "All" || (f === "No code" ? ["—","✓","LIM"].includes(x.c) : x.c === f))
    && q.every(w => (x.t + " " + x.k + " " + x.g).toLowerCase().includes(w)));
}
function codeListHtml(){
  const list = codeMatches();
  const job = view.codeFor ? jobs.find(x => x.id === view.codeFor.jobId) : null;
  if (!list.length) return `<div class="empty">No match. Try a simpler word – e.g. “bonding”, “rcd”, “socket”, “blank”.</div>`;
  const label = c => c === "—" ? "No code" : c === "✓" ? "Not a defect" : c === "LIM" ? "Limitation" : c;
  const cls = c => c === "C1" ? "fail" : c === "C2" ? "fail" : c === "C3" ? "none" : c === "FI" ? "check" : "pass";
  return list.map((x, i) => `<div class="code-item"><div class="row"><span class="pill ${cls(x.c)}">${esc(label(x.c))}</span><span class="muted small">${esc(x.g)}</span><span class="spacer"></span>${job && ["C1","C2","C3","FI"].includes(x.c) ? `<button class="btn ghost sm" data-act="useCode" data-i="${BF_CODES.indexOf(x)}">Add</button>` : ""}</div><div>${esc(x.t)}</div></div>`).join("");
}
function renderCodes(){
  const job = view.codeFor ? jobs.find(x => x.id === view.codeFor.jobId) : null;
  return `<header class="top"><button class="iconbtn" data-act="${job ? "codesBack" : "home"}" aria-label="Back">←</button><h1>Coding guide<span class="sub">${job ? "Tap Add to put it on " + esc(jobTitle(job)) : "C1 · C2 · C3 · FI"}</span></h1></header>
  <main>
    <label class="field" for="codeq"><span>Search what you found</span><input id="codeq" type="search" data-local="codeQ" value="${esc(view.codeQ || "")}" placeholder="e.g. no rcd outside socket" autocomplete="off"></label>
    <div class="chips">${["All","C1","C2","C3","FI","No code"].map(f => `<button class="chip small" data-codef="${f}" aria-pressed="${(view.codeF || "All") === f}">${f}</button>`).join("")}</div>
    <div class="muted small">Typical codes for domestic and similar installations, based on the industry's Best Practice Guide 4 (Issue 7). Your judgement on site decides – the circumstances can raise or lower a code.</div>
    <div id="codelist" class="codes-list">${codeListHtml()}</div>
  </main>`;
}

function tabJob(){
  return `
  <div class="card"><h2>Report</h2><div class="grid2">${field("Report number","job.reportNo")}${field("Inspection date","job.inspDate",{type:"date"})}</div>
    ${select("Reason for the report","job.reason",REASONS)}</div>
  <div class="card"><h2>Client</h2>${field("Person ordering the report","job.client.name")}${field("Telephone","job.client.phone",{type:"tel"})}${field("Client address","job.client.address",{area:true})}</div>
  <div class="card"><h2>Installation</h2>${field("Installation address","job.address",{area:true})}${field("Occupier","job.occupier")}
    ${select("Description of premises","job.premises",PREMISES.map(p => p[0]),{rerender:true})}
    <div class="grid2">${field("Estimated age of wiring","job.wiringAge",{num:true,unit:"yrs"})}${field("Date of last inspection","job.lastInsp",{type:"date"})}</div>
    ${chips("Evidence of additions / alterations","job.alterations",["Yes","No","Not apparent"])}
    ${j().alterations === "Yes" ? field("Estimated age of alterations","job.alterAge",{num:true,unit:"yrs"}) : ""}
    ${chips("Installation records available","job.records",["Yes","No"])}${field("Records held by","job.recordsHeld")}</div>
  <div class="card"><h2>Extent and limitations</h2>${field("Extent of the installation covered","job.extent",{area:true})}${field("Agreed limitations (and reasons)","job.limitations",{area:true})}
    <div class="grid2">${field("Agreed with","job.limitAgreed")}${field("Operational limitations","job.opLimits")}</div></div>`;
}
const j = () => curJob();

function tabSupply(){
  const s = j().supply;
  return `
  <div class="card"><h2>Supply characteristics</h2>
    ${chips("Earthing arrangement","job.supply.earth",EARTH.concat(["TN-C","IT"]),{})}
    ${chips("Live conductors","job.supply.phases",["1-phase 2-wire","3-phase 4-wire","3-phase 3-wire"],{small:true})}
    <div class="grid2">${field("Ze measured","job.supply.ze",{num:true,unit:"Ω"})}${autoBox("Typical DNO max Ze","supTypZe")}</div>
    <div data-derived="supZeNote">${DERIVED.supZeNote()}</div>
    <div class="grid2">${field("Ipf measured","job.supply.ipf",{num:true,unit:"kA",hint:"Higher of PSCC / PEFC"})}${autoBox("PEFC from Ze","supPefc")}</div>
    ${chips("Supply polarity confirmed","job.supply.polarity",["✓","✗"])}
    <details class="more"><summary>Nominal voltage and supply fuse</summary><div>
      <div class="grid2">${field("Uo","job.supply.uo",{num:true,unit:"V"})}${field("Frequency","job.supply.freq",{num:true,unit:"Hz"})}</div>
      ${chips("Supply protective device","job.supply.devBs",["BS 88-3","BS 1361","BS 88-2","Other"],{small:true})}
      <div class="grid2">${field("Rating","job.supply.devRating",{num:true,unit:"A"})}${field("Short-circuit capacity","job.supply.devKa",{num:true,unit:"kA"})}</div>
    </div></details>
  </div>
  <div class="card"><h2>Earthing and bonding</h2>
    ${chips("Means of earthing","job.supply.means",["Distributor's facility","Installation earth electrode"],{small:true})}
    ${s.earth === "TT" || s.means === "Installation earth electrode" ? `${chips("Electrode type","job.supply.electrode",["Rod","Tape","Plate","Other"],{small:true})}<div class="grid2">${field("Electrode resistance RA","job.supply.ra",{num:true,unit:"Ω"})}${autoBox("Electrode check","supRa")}</div>` : ""}
    ${chips("Supply tails csa (mm²)","job.supply.tails",[16,25,35,50,70,95])}
    <div class="grid2">${select("Earthing conductor","job.supply.earthCsa",CSA.map(x => [x, x + " mm²"]))}${autoBox("Minimum earthing","supEarth")}</div>
    <div class="grid2">${select("Main bonding","job.supply.bondCsa",CSA.map(x => [x, x + " mm²"]))}${autoBox("Minimum bonding","supBond")}</div>
    ${chips("Earthing / bonding connections verified","job.supply.bondVerified",["✓","✗"])}
    <div class="grid2">${chips("Water","job.supply.water",["✓","✗","N/A"],{small:true})}${chips("Gas","job.supply.gas",["✓","✗","N/A"],{small:true})}
    ${chips("Oil","job.supply.oil",["✓","✗","N/A"],{small:true})}${chips("Structural steel","job.supply.steel",["✓","✗","N/A"],{small:true})}
    ${chips("Lightning protection","job.supply.lightning",["✓","✗","N/A"],{small:true})}</div>
    ${field("Other bonding","job.supply.otherBond")}
  </div>
  <div class="card"><h2>Main switch</h2><div class="grid2">${field("BS (EN)","job.supply.msBs")}${field("Poles / rating","job.supply.msRating",{ph:"e.g. DP 100 A"})}
    ${field("RCD IΔn (if RCD)","job.supply.msRcd",{num:true,unit:"mA"})}${field("RCD trip time","job.supply.msRcdTime",{num:true,unit:"ms"})}</div></div>`;
}

function tabCircuits(){
  const job = j(), b = curBoard();
  const boardChips = typeOf(job) === "MW" ? "" : job.boards.map((x,i) => `<button class="chip" data-act="board" data-i="${i}" aria-pressed="${i === Math.min(view.board, job.boards.length-1)}">${esc(x.ref || "DB" + (i+1))}</button>`).join("") + (typeOf(job) === "MW" ? "" : `<button class="chip" data-act="addBoard">+ Board</button>`);
  const list = b.circuits.map(c => { const r = calcCircuit(job, b, c); return `<button class="card-link" data-act="circ" data-id="${c.id}"><span class="cno">${esc(c.no)}</span><div class="grow"><div class="t">${esc(c.desc || "Circuit " + c.no)}</div><div class="d">${esc(devShort(c))}${c.live ? ` · ${esc(c.live)}/${esc(c.cpc || "?")} mm²` : ""}${c.ring === "Y" ? " · ring" : ""}${r.m80 !== null ? ` · limit ${r.m80.toFixed(2)} Ω` : ""}</div></div>${resultPill(r.result)}</button>`; }).join("");
  const counts = b.circuits.reduce((a,c) => { a[calcCircuit(job,b,c).result]++; return a; }, {pass:0,check:0,fail:0,none:0});
  return `
  <div class="boards" role="group" aria-label="Distribution boards">${boardChips}</div>
  <div class="card"><h2>${esc(b.ref || "Board")} details</h2>
    <div class="grid2">${field("DB reference","board.ref")}${field("Location","board.location")}</div>
    <div class="grid2">${field("Zdb at this board","board.zdb",{num:true,unit:"Ω",ph:num(job.supply.ze) !== null ? job.supply.ze : "= Ze"})}${field("Ipf at this board","board.ipf",{num:true,unit:"kA",ph:num(job.supply.ipf) !== null ? job.supply.ipf : "= Ipf"})}</div>
    <div class="hint small muted" data-derived="zdbHint">${DERIVED.zdbHint()}</div>
    <details class="more"><summary>Supply to board, SPD and instruments</summary><div>
      <div class="grid2">${field("Supplied from","board.from")}${field("Distribution OCPD","board.ocpd",{ph:"BS / rating"})}</div>
      ${chips("Phases","board.phases",["1","3"])}${field("SPD type / status","board.spd")}
      <div class="grid2">${chips("Polarity confirmed","board.polarity",["✓","✗"])}${chips("Phase sequence","board.seq",["✓","✗","N/A"],{small:true})}</div>
      <div class="grid2">${field("Tested by","board.testedBy")}${field("Date tested","board.date",{type:"date"})}</div>
      ${field("Multifunction tester","board.mft")}<div class="grid2">${field("IR tester","board.irSerial")}${field("Loop / RCD tester","board.loopSerial")}</div>${field("Earth electrode tester","board.elecSerial")}
      ${job.boards.length > 1 && !job.example ? (view.confirmDel === "board" ? `<div class="row"><span class="small">Delete this board and its ${b.circuits.length} circuits?</span><button class="btn danger sm" data-act="delBoard">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<button class="btn danger sm" data-act="askDel" data-what="board">Delete board</button>`) : ""}
    </div></details>
  </div>
  <div class="card"><h2>Circuits <span class="count">${counts.pass} pass · ${counts.check} check · ${counts.fail} fail</span></h2>
    ${list ? `<div style="display:flex;flex-direction:column;gap:8px">${list}</div>` : `<div class="empty">No circuits on this board yet.</div>`}
    <button class="btn block" data-act="addCirc">+ Add circuit</button>
  </div>`;
}

function renderCircuit(){
  const job = j(), b = curBoard(), c = curCirc();
  const idx = b.circuits.indexOf(c);
  const ratings = c.dev && ZS[c.dev] ? Object.keys(ZS[c.dev]).map(Number).sort((x,y) => x - y) : [];
  const ring = c.ring === "Y";
  return `<header class="top"><button class="iconbtn" data-act="back" aria-label="Back to circuits">←</button>
    <h1>${esc(b.ref)} · Circuit ${esc(c.no)}<span class="sub">${esc(c.desc || "No description")}</span></h1>
    <button class="iconbtn" data-act="prev" aria-label="Previous circuit" ${idx <= 0 ? "disabled" : ""}>‹</button><button class="iconbtn" data-act="next" aria-label="Next circuit">${idx >= b.circuits.length - 1 ? "+" : "›"}</button></header>
  ${job.example ? `<div class="status warn"><span class="dot"></span>Example – edits aren't saved</div>` : statusHtml()}
  <main>
    <div class="row"><span class="muted small">Result</span><span data-derived="cpill">${DERIVED.cpill()}</span></div>
    <div class="card"><h2>Circuit</h2>
      <div class="grid2">${field("Circuit no.","circ.no")}${field("Points served","circ.pts",{num:true})}</div>
      ${field("Description","circ.desc",{ph:"e.g. Sockets – ring, shop floor"})}
      ${chips("Circuit type","circ.ctype",["Final","Distribution"])}
      ${chips("Live csa (mm²)","circ.live",CSA.slice(0,8))}
      ${chips("cpc csa (mm²)","circ.cpc",CSA.slice(0,8))}
      ${chips("Ring final?","circ.ring",[["N","Radial"],["Y","Ring"]])}
      ${field(ring ? "Total ring length" : "Cable length","circ.len",{num:true,unit:"m"})}
      <details class="more"><summary>Wiring type and reference method</summary><div>
        ${chips("Wiring type","circ.wtype",WIRING.map(w => [w[0], w[0]]),{small:true})}<div class="muted small">${WIRING.map(w => `${w[0]} ${w[1]}`).join(" · ")}</div>
        ${chips("Reference method","circ.ref",REFM,{small:true})}
      </div></details>
    </div>
    <div class="card"><h2>Protective device</h2>
      ${select("Device","circ.dev",DEVICES,{rerender:true})}
      ${ratings.length ? chips("Rating (A)","circ.rating",ratings,{small:true}) : c.dev ? field("Rating","circ.rating",{num:true,unit:"A"}) : ""}
      ${field("Breaking capacity","circ.ka",{num:true,unit:"kA"})}
      ${chips("RCD IΔn (mA)","circ.rcd",[["","None"],"10","30","100","300"])}
      ${c.rcd ? chips("RCD type","circ.rcdType",RCD_TYPES,{small:true}) : ""}
    </div>
    <div class="card"><h2>Design figures</h2><div class="figs" data-derived="design">${DERIVED.design()}</div><div data-derived="designnote">${DERIVED.designnote()}</div></div>
    <div class="card"><h2>Test results</h2>${SR && !job.example ? `<div class="muted small">Tap the blue 🎤 and read out your results – e.g. “R1 plus R2 0.36, insulation greater than 999, Zs 0.66, RCD 22”. Say “next circuit” to move on.</div>` : ""}
      ${ring ? `<div class="grid2">${field("r1 (end to end)","circ.r1",{num:true,unit:"Ω"})}${field("rn (end to end)","circ.rn",{num:true,unit:"Ω"})}</div>${field("r2 (end to end)","circ.r2",{num:true,unit:"Ω"})}` : ""}
      <div class="grid2">${field("R1+R2","circ.r12",{num:true,unit:"Ω"})}${field("R2 (optional)","circ.R2",{num:true,unit:"Ω"})}</div>
      ${chips("IR test voltage (V)","circ.irv",["250","500","1000"],{small:true})}
      <div class="grid2">${field("IR Live–Live","circ.irll",{num:true,unit:"MΩ",extra:`<button type="button" class="chip small" data-quick="circ.irll" data-val=">999">>999</button>`})}${field("IR Live–Earth","circ.irle",{num:true,unit:"MΩ",extra:`<button type="button" class="chip small" data-quick="circ.irle" data-val=">999">>999</button>`})}</div>
      ${chips("Polarity","circ.pol",["✓","✗"])}
      ${field("Measured Zs","circ.zs",{num:true,unit:"Ω",hint:"Leave blank to use Zdb + R1+R2"})}
      ${c.rcd ? `<div class="grid2">${field("RCD time at IΔn","circ.rcdt",{num:true,unit:"ms"})}${field("At 5×IΔn (optional)","circ.rcdt5",{num:true,unit:"ms"})}</div>${chips("RCD test button","circ.rcdbtn",["✓","✗"])}` : ""}
      ${chips("AFDD test button","circ.afdd",["✓","✗","N/A"],{small:true})}
    </div>
    <div class="card"><h2>Results</h2><div data-derived="results">${DERIVED.results()}</div></div>
    <div class="card"><h2>Remarks</h2>${field("Remarks","circ.remarks",{area:true})}
      ${job.example ? "" : view.confirmDel === "circ" ? `<div class="row"><span class="small">Delete this circuit?</span><button class="btn danger sm" data-act="delCirc">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<div class="row"><button class="btn ghost sm" data-act="dupCirc">Copy to new circuit</button><span class="spacer"></span><button class="btn danger sm" data-act="askDel" data-what="circ">Delete</button></div>`}
    </div>
    <div class="row"><button class="btn ghost" data-act="back">Done</button><span class="spacer"></span><button class="btn" data-act="next">${idx >= b.circuits.length - 1 ? "+ Next circuit" : "Next circuit ›"}</button></div>
  </main>`;
}

function tabInspect(){
  const job = j();
  const done = INSP_FLAT.filter(([id]) => job.insp[id.replace(".","_")]).length;
  return `<div class="card"><h2>Schedule of inspections <span class="count">${done} / ${INSP_FLAT.length}</span></h2>
    <div class="muted small">${typeOf(job) === "EICR" ? "Coding an item C1, C2, C3 or FI adds it to your observations on the Report tab." : "✓ inspected and satisfactory · ✗ not satisfactory (must be put right before certifying) · N/A not applicable."}</div></div>` +
  INSP.map(([sid, title, items]) => `<div class="card"><h2>${esc(sid)}. ${esc(title)}</h2>
    <div class="insp-sec">${items.map(([id, q]) => `<div class="insp-item"><div class="q"><b>${esc(id)}</b>${esc(q)}</div>${chips("", "job.insp." + id.replace(".","_"), typeOf(job) === "EICR" ? OUTCOMES : ["✓","✗","N/A"], {small:true, codes:true}).replace('<span></span>','')}</div>`).join("")}</div>
    <button class="btn ghost sm" data-act="allOk" data-sec="${esc(sid)}">Mark the rest ✓</button></div>`).join("");
}

function tabReport(){
  const job = j(), s = jobSummary(job);
  const banner = s.status === "fail" ? `<div class="banner fail"><span class="small">Overall assessment</span><strong>UNSATISFACTORY</strong><span class="small">C1, C2 or FI observations recorded.</span></div>`
    : s.status === "pass" ? `<div class="banner pass"><span class="small">Overall assessment</span><strong>SATISFACTORY</strong><span class="small">No C1, C2 or FI observations.</span></div>`
    : `<div class="banner none"><span class="small">Overall assessment</span><strong>Not started</strong><span class="small">Worked out from your observation codes.</span></div>`;
  const warns = [];
  s.unwrittenFails.forEach(f => warns.push(`<div class="errline row"><span style="flex:1;min-width:0">${esc(f.b.ref)} circuit ${esc(f.c.no)} (${esc(f.c.desc || "no description")}) failed and isn't in the observations.</span>${job.example ? "" : `<button class="btn danger sm" data-act="obsFromFail" data-b="${f.b.id}" data-c="${f.c.id}">Add</button>`}</div>`));
  s.coded.forEach(([id,q]) => warns.push(`<div class="warnline">Inspection ${esc(id)} coded ${esc(job.insp[id.replace(".","_")])} but not in observations.</div>`));
  const obs = job.obs.map((o,i) => `<div class="obs"><div class="row"><b style="font-family:var(--f-mono)">${i+1}</b><span class="spacer"></span>${view.confirmDel === "obs:" + o.id ? `<button class="btn danger sm" data-act="delObs" data-id="${o.id}">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button>` : job.example ? "" : `<button class="btn ghost sm" data-act="askDel" data-what="obs:${o.id}">Remove</button>`}</div>
    ${field("Observation", `job.obs.${i}.text`, {area:true})}
    <div class="grid2">${field("Location / circuit", `job.obs.${i}.loc`)}${field("Regulation", `job.obs.${i}.reg`)}</div>
    ${chips("Code", `job.obs.${i}.code`, ["C1","C2","C3","FI"], {codes:true})}</div>`).join("");
  return `${banner}
  <div class="codes">${["C1","C2","C3","FI"].map(k => `<div><b>${s.counts[k]}</b><span>${k}</span></div>`).join("")}</div>
  ${warns.length ? `<div class="card"><h2>To sort out</h2>${warns.join("")}</div>` : ""}
  <div class="card"><h2>Observations <span class="count">${job.obs.length}</span></h2>
    <div class="muted small">${CODES.map(c => `<b>${c[0]}</b> ${esc(c[1])}`).join(" · ")}</div>
    ${obs || `<div class="empty">No observations yet.</div>`}
    ${job.example ? "" : `<div class="row"><button class="btn ghost sm" data-act="addObs">+ Add observation</button><button class="btn ghost sm" data-act="codesFor" data-target="obs">Find in coding guide</button></div>`}</div>
  <div class="card"><h2>Summary</h2>${field("General condition of the installation","job.condition",{area:true})}</div>
  <div class="card"><h2>Next inspection</h2>
    <div class="grid2">${autoBox("Max interval for premises","maxInt")}${field("Your interval (optional)","job.recInterval",{num:true,unit:"yrs"})}</div>
    ${autoBox("Next inspection due by","nextDue")}</div>
  <div class="card"><h2>Declaration</h2>
    <div class="grid2">${field("Inspected and tested by","job.inspector")}${field("Position","job.position")}</div>
    ${settings.role === "Tester" ? "" : signBlock(job)}
    <div class="grid2">${field("Date signed","job.sigDate",{type:"date"})}${field("Date of issue","job.issueDate",{type:"date"})}</div>
    ${field("Reviewed / authorised by","job.reviewer")}</div>
  ${settings.role === "Tester" ? signBlock(job) : ""}
  ${finishCard(job)}`;
}

/* ------------------------------------------------------------------ signature */
let sigTimer = null;
function initSig(){
  const cv = document.getElementById("sig"); if (!cv) return;
  const job = j();
  const dpr = window.devicePixelRatio || 1;
  const rect = cv.getBoundingClientRect();
  cv.width = Math.round(rect.width*dpr); cv.height = Math.round(rect.height*dpr);
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr); ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#000";
  if (job.sig){ const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height); img.src = job.sig; }
  let drawing = false, last = null;
  const pt = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener("pointerdown", e => { clearTimeout(sigTimer); drawing = true; last = pt(e); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
  cv.addEventListener("pointermove", e => { if (!drawing) return; const p = pt(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; });
  const end = () => { if (!drawing) return; drawing = false;
    // store as dark ink on transparent so it prints on white
    const out = document.createElement("canvas"); out.width = cv.width; out.height = cv.height; const o = out.getContext("2d");
    o.drawImage(cv, 0, 0); o.globalCompositeOperation = "source-in"; o.fillStyle = "#0F1B2D"; o.fillRect(0, 0, out.width, out.height);
    job.sig = out.toDataURL("image/png"); if (!job.sigDate) job.sigDate = today(); markDirty(job);
    clearTimeout(sigTimer); sigTimer = setTimeout(() => { if (!isEditing()) rerender(); }, 1800); };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
}

/* ------------------------------------------------------------------ events */
document.addEventListener("input", e => {
  const loc = e.target.closest("[data-local]");
  if (loc) {
    view[loc.dataset.local] = loc.value;
    if (loc.dataset.local === "homeQ") { const l = document.getElementById("homelist"); if (l) l.innerHTML = homeList(); }
    else if (loc.dataset.local === "codeQ") { const l = document.getElementById("codelist"); if (l) l.innerHTML = codeListHtml(); }
    else rerender();
    return;
  }
  const cin = e.target.closest("[data-calc]");
  if (cin) { view.calc[cin.dataset.calc] = cin.value; const u = (id, f) => { const el = document.getElementById(id); if (el) el.innerHTML = f(); }; u("calc-vd", calcVd); u("calc-ad", calcAd); u("calc-dc", calcDc); return; }
  const el = e.target.closest("[data-bind]"); if (!el) return;
  const [root, ...rest] = el.dataset.bind.split(".");
  const obj = roots()[root]; if (!obj) return;
  let path = rest.join(".");
  setPath(obj, path, el.value);
  if (root === "settings") flush();
  else markDirty(j());
  if (el.hasAttribute("data-rerender")) { if (path === "dev") { const c = curCirc(); if (c && ZS[c.dev] && !ZS[c.dev][+c.rating]) c.rating = ""; } rerender(); }
  else { refreshDerived(); if (root === "circ" && (path === "no" || path === "desc")) { const h = document.querySelector(".top h1"); const c = curCirc(); if (h && c) h.innerHTML = `${esc(curBoard().ref)} · Circuit ${esc(c.no)}<span class="sub">${esc(c.desc || "No description")}</span>`; } }
});

document.addEventListener("click", e => {
  const tab = e.target.closest("[data-tab]");
  if (tab){ view.tab = tab.dataset.tab; view.circ = null; view.confirmDel = null; render(); return; }
  const chip = e.target.closest("[data-chip]");
  if (chip){
    const [root, ...rest] = chip.dataset.chip.split(".");
    const obj = roots()[root]; const path = rest.join(".");
    const cur = getPath(obj, path);
    const val = String(cur) === chip.dataset.val ? "" : chip.dataset.val;
    setPath(obj, path, val);
    if (path.startsWith("insp.")) onInspCode(path.slice(5).replace("_","."), val);
    if (root === "settings") flush(); else markDirty(j());
    rerender(); return;
  }
  const cc = e.target.closest("[data-calcchip]");
  if (cc) { view.calc[cc.dataset.calcchip] = cc.dataset.val; rerender(); return; }
  const cf = e.target.closest("[data-codef]");
  if (cf) { view.codeF = cf.dataset.codef; rerender(); return; }
  const q = e.target.closest("[data-quick]");
  if (q){ const [root, ...rest] = q.dataset.quick.split("."); setPath(roots()[root], rest.join("."), q.dataset.val); markDirty(j()); rerender(); return; }
  const a = e.target.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act, job = curJob();
  switch(act){
    case "home": view = {screen:"home", tab:"job", board:0, circ:null, homeQ: view.homeQ}; render(); break;
    case "settings": view.screen = "settings"; render(); break;
    case "chooser": view.chooser = true; rerender(); break;
    case "chooserOff": view.chooser = false; rerender(); break;
    case "newType": { const nj = newJob(a.dataset.type); jobs.push(nj); markDirty(nj); view = {screen:"job", jobId:nj.id, tab:"job", board:0, circ:null}; render(); break; }
    case "book": view = {screen:"book", chapter:null, calc:view.calc, bookDev:view.bookDev}; render(); break;
    case "bookHome": view.chapter = null; render(); break;
    case "chapter": view.chapter = a.dataset.id; render(); break;
    case "codes": view = {screen:"codes", codeQ:"", codeF:"All", codeFor:null}; render(); break;
    case "codesFor": view = {screen:"codes", codeQ:"", codeF:"All", codeFor:{jobId: job.id, target: a.dataset.target, tab: view.tab}}; render(); break;
    case "codesBack": { const cf = view.codeFor; view = {screen:"job", jobId:cf.jobId, tab:cf.tab, board:0, circ:null}; render(); break; }
    case "useCode": { const cf = view.codeFor, jb = jobs.find(x => x.id === cf.jobId), item = BF_CODES[+a.dataset.i]; if (!jb || !item) break;
      if (cf.target === "obs") jb.obs.push({id:uid(), text:item.t, loc:"", reg:"", code:item.c, src:"guide"});
      else jb.work.existing = (jb.work.existing ? jb.work.existing.replace(/\s*$/, "") + "\n" : "") + `${item.t} (${item.c})`;
      jb.updated = Date.now(); lsWrite(); scheduleSync(6000);
      view = {screen:"job", jobId:cf.jobId, tab:cf.tab, board:0, circ:null}; render(); break; }
    case "syncNow": syncNow(); break;
    case "reload": (async () => { if (persistTimer) { clearTimeout(persistTimer); await writeNow(); } location.reload(); })(); break;
    case "copyCode": { const t = document.getElementById("conncode"); if (!t) break; const ok = () => { const m = document.getElementById("sendmsg"); a.textContent = "Copied"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(ok, () => { t.focus(); t.select(); }); else { t.focus(); t.select(); } break; }
    case "join": { const m = document.getElementById("joinmsg"); try { applyConnectionCode(document.getElementById("joincode").value); if (m) m.innerHTML = `<div class="muted small">Connected. Syncing now…</div>`; syncNow().then(() => rerender()); } catch(err){ if (m) m.innerHTML = `<div class="errline">${esc(err.message)}</div>`; } break; }
    case "handoff": if (job.example) break; job.handoff = {by: me(), at: Date.now()}; markDirty(job); scheduleSync(500); rerender(); break;
    case "shareJob": downloadFile(fileName(job, "json"), jobBackup(job), "application/json"); break;
    case "open": view = {screen:"job", jobId:a.dataset.id, tab:"job", board:0, circ:null}; render(); break;
    case "board": view.board = +a.dataset.i; view.confirmDel = null; render(); break;
    case "addBoard": if (job.example) break; job.boards.push(newBoard(job.boards.length + 1)); view.board = job.boards.length - 1; markDirty(job); render(); break;
    case "circ": view.circ = a.dataset.id; view.confirmDel = null; render(); break;
    case "addCirc": { const b = curBoard(); const c = newCircuit(b.circuits.length + 1); b.circuits.push(c); view.circ = c.id; markDirty(job); render(); break; }
    case "dupCirc": { const b = curBoard(), c = curCirc(); const n = Object.assign(newCircuit(b.circuits.length + 1), {desc:c.desc, wtype:c.wtype, ref:c.ref, live:c.live, cpc:c.cpc, ctype:c.ctype, dev:c.dev, rating:c.rating, ka:c.ka, rcd:c.rcd, rcdType:c.rcdType, ring:c.ring, irv:c.irv}); b.circuits.push(n); view.circ = n.id; markDirty(job); render(); break; }
    case "back": view.circ = null; view.confirmDel = null; render(); break;
    case "prev": { const b = curBoard(); const i = b.circuits.findIndex(c => c.id === view.circ); if (i > 0) { view.circ = b.circuits[i-1].id; render(); } break; }
    case "next": { const b = curBoard(); const i = b.circuits.findIndex(c => c.id === view.circ);
      if (i < b.circuits.length - 1) view.circ = b.circuits[i+1].id;
      else { const prev = b.circuits[i]; const c = newCircuit(b.circuits.length + 1); if (prev) Object.assign(c, {wtype:prev.wtype, ref:prev.ref, ka:prev.ka, irv:prev.irv}); b.circuits.push(c); view.circ = c.id; markDirty(job); }
      render(); break; }
    case "askDel": view.confirmDel = a.dataset.what; rerender(); break;
    case "cancelDel": view.confirmDel = null; rerender(); break;
    case "delCirc": { const b = curBoard(); b.circuits = b.circuits.filter(c => c.id !== view.circ); view.circ = null; view.confirmDel = null; markDirty(job); render(); break; }
    case "delBoard": job.boards.splice(Math.min(view.board, job.boards.length-1), 1); view.board = 0; view.confirmDel = null; markDirty(job); render(); break;
    case "delObs": job.obs = job.obs.filter(o => o.id !== a.dataset.id); view.confirmDel = null; markDirty(job); rerender(); break;
    case "delJob": { const i = jobs.findIndex(x => x.id === job.id);
      if (i >= 0) jobs[i] = normaliseJob({id: job.id, type: job.type, deleted: true, updated: Date.now(), client:{}, boards:[], obs:[], insp:{}, supply:{}});
      lsWrite(); scheduleSync(1000);
      view = {screen:"home", tab:"job", board:0, circ:null}; render(); break; }
    case "addObs": job.obs.push({id:uid(), text:"", loc:"", reg:"", code:"", src:""}); markDirty(job); rerender(); setTimeout(() => { const t = document.querySelectorAll(".obs textarea"); t.length && t[t.length-1].focus(); }, 50); break;
    case "obsFromCirc": obsFromCircuit(curBoard(), curCirc()); rerender(); break;
    case "obsFromFail": { const b = job.boards.find(x => x.id === a.dataset.b); const c = b && b.circuits.find(x => x.id === a.dataset.c); if (c) obsFromCircuit(b, c); rerender(); break; }
    case "allOk": { const sec = INSP.find(s => s[0] === a.dataset.sec); sec[2].forEach(([id]) => { const k = id.replace(".","_"); if (!job.insp[k]) job.insp[k] = "✓"; }); markDirty(job); rerender(); break; }
    case "clearSig": job.sig = ""; markDirty(job); rerender(); break;
    case "export": exportReport(); break;
    case "print": printReport(); break;
    case "finish": finishAndSend(); break;
    case "testSend": (async () => { const m = document.getElementById("sendmsg"); if (!settings.sendUrl) { if (m) m.innerHTML = `<div class="warnline">Paste the sync link first.</div>`; return; } if (m) m.innerHTML = `<div class="muted small">Sending…</div>`;
      try { await api("test", {to: settings.officeEmail}); syncNow();
        if (m) m.innerHTML = `<div class="muted small">Test email sent to ${esc(settings.officeEmail)}.</div>`; }
      catch(err){ const msg = String(err.message || err); if (m) m.innerHTML = `<div class="errline">Couldn't connect: ${esc(msg)}${/old version/.test(msg) ? "" : ". Check the link is the Web app URL ending in /exec, and that access is set to Anyone"}.</div>`; } })(); break;
    case "copyScript": { const t = scriptText(); const box = document.getElementById("scriptbox"); const m = document.getElementById("sendmsg");
      const shown = () => { box.hidden = false; box.value = t; box.focus(); box.select(); if (m) m.innerHTML = `<div class="muted small">Select all and copy the script below.</div>`; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => { if (m) m.innerHTML = `<div class="muted small">Script copied.</div>`; }, shown); else shown(); break; }
    case "backup": backup(); break;
  }
});

function onInspCode(id, val){
  const job = j(); if (job.example || typeOf(job) !== "EICR") return;
  if (["C1","C2","C3","FI"].includes(val)){
    const existing = job.obs.find(o => o.src === "insp:" + id);
    const item = INSP_FLAT.find(x => x[0] === id);
    if (existing) existing.code = val;
    else job.obs.push({id:uid(), text:item ? item[1] + " – " : "", loc:"", reg:"", code:val, src:"insp:" + id});
  }
}
function obsFromCircuit(b, c){
  const job = j(); if (job.example) return;
  const r = calcCircuit(job, b, c);
  const fails = r.checks.filter(x => x.s === "fail").map(x => `${x.l}: ${x.t}`).join("; ");
  job.obs.push({id:uid(), text:`${c.desc || "Circuit " + c.no} – ${fails}`, loc:`${b.ref} cct ${c.no}`, reg:"", code:"", src:`circ:${b.id}:${c.id}`});
  markDirty(job);
}

/* ------------------------------------------------------------------ printable export */
const REPORT_CSS = `@page{size:A4 portrait;margin:12mm}
@page wide{size:A4 landscape;margin:8mm}
body{font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#0F1B2D;margin:0;padding:12px;background:#fff}
.band{background:#1B365D;color:#fff;padding:10px 14px}
.band b{font-size:20px;letter-spacing:.04em;display:block}
.band span{font-size:12px}
.sub{background:#2E75B6;color:#fff;padding:5px 14px;font-weight:bold;font-size:13px}
h2{background:#1B365D;color:#fff;font-size:11.5px;padding:5px 8px;margin:14px 0 0;break-after:avoid}
table{border-collapse:collapse;width:100%}
.kv th,.kv td{border:1px solid #A6A6A6;padding:4px 6px;text-align:left;vertical-align:top}
.kv th{background:#DCE8F5;color:#1B365D;width:22%;font-size:9.5px}
.big{font-size:18px;font-weight:bold;text-align:center;padding:8px}
.big.pass{background:#C6EFCE;color:#006100}.big.fail{background:#F8CBAD;color:#9C0006}
.obs th,.obs td,.insp th,.insp td{border:1px solid #A6A6A6;padding:4px 6px;text-align:left;vertical-align:top}
.obs th,.insp th{background:#1B365D;color:#fff}
.code{font-weight:bold;text-align:center;width:40px}
.code.C1{background:#B42318;color:#fff}.code.C2{background:#F8CBAD;color:#9C0006}.code.FI{background:#FFEB9C;color:#9C5700}.code.C3{background:#DDEBF7}
.insp .grp td{background:#DCE8F5;font-weight:bold;color:#1B365D}
.insp td:last-child{text-align:center;width:48px;font-weight:bold}
section.wide{page:wide;break-before:page}
.sched{font-size:8px;margin-top:6px}
.sched th,.sched td{border:1px solid #A6A6A6;padding:2px 3px;text-align:center}
.sched th{background:#DCE8F5;color:#1B365D;font-size:7.5px}
.sched td:nth-child(2),.sched td:last-child{text-align:left}
.sched tr.fail td{background:#FDE2DF}.sched tr.check td{background:#FFF6D6}
.note{font-size:8px;color:#555}
.sig img{max-height:60px}
.guide{font-size:9.5px}
footer{margin-top:14px;font-size:9px;color:#555;text-align:center}
`;
function exportHtml(job){
  if (typeOf(job) !== "EICR") return exportCert(job);
  const s = jobSummary(job), sup = calcSupply(job), co = job.company || settings;
  const row = (l, v) => `<tr><th>${esc(l)}</th><td>${esc(v ?? "")}</td></tr>`;
  const row2 = (l1, v1, l2, v2) => `<tr><th>${esc(l1)}</th><td>${esc(v1 ?? "")}</td><th>${esc(l2)}</th><td>${esc(v2 ?? "")}</td></tr>`;
  const sec = t => `<h2>${esc(t)}</h2>`;
  const inspVal = id => job.insp[id.replace(".","_")] || "";
  const circuitsTable = b => {
    const head = ["No","Description","Type","Ref","Pts","Live","cpc","Device","In (A)","kA","RCD mA","Max Zs","Max meas. Zs","Length","Exp. R1+R2","Exp. Zs","r1","rn","r2","R1+R2","R2","IR V","IR L-L","IR L-E","Pol","Zs","RCD ms","5× ms","RCD btn","AFDD","Result","Remarks"];
    const rows = b.circuits.map(c => { const r = calcCircuit(job, b, c); const v = x => x === null || x === undefined ? "" : typeof x === "number" ? x.toFixed(2) : x;
      return `<tr class="${r.result}">${[c.no,c.desc,c.wtype,c.ref,c.pts,c.live,c.cpc,devShort(c),c.rating,c.ka,c.rcd,v(r.maxZs ?? r.maxNote),v(r.m80),c.len,v(r.expR12),v(r.expZs),c.r1,c.rn,c.r2,c.r12,c.R2,c.irv,c.irll,c.irle,c.pol,c.zs || (r.zsCalc ? v(r.zsUsed) + "*" : ""),c.rcdt,c.rcdt5,c.rcdbtn,c.afdd,{pass:"PASS",fail:"FAIL",check:"CHECK",none:""}[r.result],c.remarks].map(x => `<td>${esc(x)}</td>`).join("")}</tr>`; }).join("");
    return `<table class="sched"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
  };
  const boards = job.boards.map(b => `<section class="wide">${sec(`Schedule of circuit details and test results – ${b.ref}`)}
    <table class="kv"><tbody>${row2("Location", b.location, "Supplied from", b.from)}${row2("Tested by", b.testedBy, "Distribution OCPD", b.ocpd)}${row2("Phases", b.phases, "", "")}${row2("Zdb (Ω)", boardZdb(job,b) ?? "", "Ipf at board (kA)", boardIpf(job,b) ?? "")}${row2("Polarity confirmed", b.polarity, "Phase sequence", b.seq)}${row2("SPD", b.spd, "Date tested", ukDate(b.date))}${row2("Multifunction tester", b.mft, "IR tester", b.irSerial)}${row2("Continuity / loop / RCD tester", b.loopSerial, "Earth electrode tester", b.elecSerial)}</tbody></table>
    ${circuitsTable(b)}<p class="note">Max measured Zs is 80% of the BS 7671 Table 41.2–41.4 value. * Zs calculated as Zdb + R1+R2. Wiring codes: A PVC/PVC, B PVC in metal conduit, C PVC in plastic conduit, D PVC in metal trunking, E PVC in plastic trunking, F PVC/SWA, G XLPE/SWA, H MICC, O other.</p></section>`).join("");
  const title = `EICR – ${job.address || job.client.name || "report"}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>${REPORT_CSS}</style></head><body>
<div class="band"><b>${esc(co.company || "BlueForge Engineering")}</b><span>${esc([co.address, co.phone, co.email].filter(Boolean).join(" · "))}</span></div>
<div class="sub">Electrical Installation Condition Report (EICR) – BS 7671:2018+A4:2026</div>
<table class="kv"><tbody>${row2("Report number", job.reportNo, "Date of issue", ukDate(job.issueDate))}</tbody></table>
${sec("A. Contractor")}<table class="kv"><tbody>${row2("Company", co.company, "Inspector", job.inspector)}${row2("Address", co.address, "Telephone", co.phone)}${row2("Email", co.email, "Registration / scheme no.", co.reg)}</tbody></table>
${sec("B. Person ordering the report")}<table class="kv"><tbody>${row2("Name", job.client.name, "Telephone", job.client.phone)}${row("Address", job.client.address)}</tbody></table>
${sec("C. Reason for producing this report")}<table class="kv"><tbody>${row2("Reason", job.reason, "Date(s) of inspection", ukDate(job.inspDate))}</tbody></table>
${sec("D. Details of the installation")}<table class="kv"><tbody>${row2("Occupier", job.occupier, "Description of premises", job.premises)}${row("Installation address", job.address)}${row2("Estimated age of wiring (years)", job.wiringAge, "Evidence of additions / alterations", job.alterations + (job.alterAge ? ` (approx. ${job.alterAge} yrs)` : ""))}${row2("Installation records available", job.records, "Records held by", job.recordsHeld)}${row("Date of last inspection", ukDate(job.lastInsp))}</tbody></table>
${sec("E. Extent and limitations")}<table class="kv"><tbody>${row("Extent of the installation covered", job.extent)}${row("Agreed limitations", job.limitations)}${row2("Agreed with", job.limitAgreed, "Operational limitations", job.opLimits)}</tbody></table>
${sec("F. Summary of the condition of the installation")}<table class="kv"><tbody>${row("General condition", job.condition)}</tbody></table>
<div class="big ${s.status === "fail" ? "fail" : "pass"}">Overall assessment: ${s.status === "fail" ? "UNSATISFACTORY" : "SATISFACTORY"}</div>
<table class="kv"><tbody>${row2("C1 – Danger present", s.counts.C1, "C2 – Potentially dangerous", s.counts.C2)}${row2("C3 – Improvement recommended", s.counts.C3, "FI – Further investigation", s.counts.FI)}</tbody></table>
${sec("G. Recommendations")}<table class="kv"><tbody>${row2("Recommended interval", s.interval ? (s.interval < 1 ? "3 months" : s.interval + " years") : "", "Next inspection due by", ukDate(s.nextDue))}${row("Remedial action", s.status === "fail" ? "C1 items need immediate action, C2 items urgent remedial action and FI items investigating without delay. Re-inspect once remedial work is complete." : "Items coded C3 are recommended for improvement. No immediate or urgent remedial action required.")}</tbody></table>
${sec("H. Declaration")}<p class="guide">I/We, being the person(s) responsible for the inspection and testing of the electrical installation described above, having exercised reasonable skill and care, declare that the information in this report, including the observations and attached schedules, is an accurate assessment of the condition of the installation, taking into account the stated extent and limitations.</p>
<table class="kv"><tbody>${row2("Inspected and tested by", job.inspector, "Position", job.position)}<tr><th>Signature</th><td class="sig">${job.sig ? `<img src="${job.sig}" alt="Signature">` : ""}</td><th>Date</th><td>${esc(ukDate(job.sigDate))}</td></tr>${row("Reviewed / authorised by", job.reviewer)}</tbody></table>
${sec("I. Supply characteristics and earthing arrangements")}<table class="kv"><tbody>${row2("Earthing arrangement", job.supply.earth, "Live conductors", job.supply.phases)}${row2("Nominal voltage Uo (V)", job.supply.uo, "Frequency (Hz)", job.supply.freq)}${row2("Ze (Ω)", job.supply.ze, "Ipf (kA)", job.supply.ipf)}${row2("Supply polarity confirmed", job.supply.polarity, "Supply protective device", [job.supply.devBs, job.supply.devRating && job.supply.devRating + " A", job.supply.devKa && job.supply.devKa + " kA"].filter(Boolean).join(" · "))}</tbody></table>
${sec("J. Particulars of the installation at the origin")}<table class="kv"><tbody>${row2("Means of earthing", job.supply.means, "Electrode type / RA (Ω)", [job.supply.electrode, job.supply.ra].filter(Boolean).join(" / "))}${row2("Main switch BS (EN)", job.supply.msBs, "Poles / rating", job.supply.msRating)}${row2("Main switch RCD IΔn (mA)", job.supply.msRcd, "RCD time (ms)", job.supply.msRcdTime)}${row2("Earthing conductor (mm²)", job.supply.earthCsa + (sup.earthCheck ? ` – ${sup.earthCheck.t}` : ""), "Main bonding (mm²)", job.supply.bondCsa + (sup.bondCheck ? ` – ${sup.bondCheck.t}` : ""))}${row2("Connections verified", job.supply.bondVerified, "Bonding: water / gas / oil", [job.supply.water, job.supply.gas, job.supply.oil].map(x => x || "–").join(" / "))}${row2("Bonding: structural steel", job.supply.steel, "Bonding: lightning / other", [job.supply.lightning || "–", job.supply.otherBond].filter(Boolean).join(" / "))}</tbody></table>
${sec("K. Observations and recommendations")}<table class="obs"><thead><tr><th>Item</th><th>Observation</th><th>Location</th><th>Regulation</th><th>Code</th></tr></thead><tbody>${job.obs.length ? job.obs.map((o,i) => `<tr><td>${i+1}</td><td>${esc(o.text)}</td><td>${esc(o.loc)}</td><td>${esc(o.reg)}</td><td class="code ${esc(o.code)}">${esc(o.code)}</td></tr>`).join("") : `<tr><td colspan="5">No observations.</td></tr>`}</tbody></table>
<p class="guide">C1 Danger present – immediate action required. C2 Potentially dangerous – urgent remedial action required. C3 Improvement recommended. FI Further investigation required without delay.</p>
<h2>Guidance for recipients</h2><p class="guide">This report assesses the condition of the electrical installation at the time of inspection, within the extent and limitations stated. Keep it safe and show it to anyone carrying out further work or the next inspection. If the overall assessment is UNSATISFACTORY, arrange for the C1, C2 and FI items to be put right by a competent person as soon as possible.</p>
<section style="break-before:page">${sec("Schedule of inspections")}<table class="insp"><thead><tr><th>Item</th><th>Description</th><th>Outcome</th></tr></thead><tbody>${INSP.map(([sid,t,items]) => `<tr class="grp"><td>${sid}</td><td colspan="2">${esc(t)}</td></tr>` + items.map(([id,q]) => `<tr><td>${id}</td><td>${esc(q)}</td><td>${esc(inspVal(id))}</td></tr>`).join("")).join("")}</tbody></table>
<p class="guide">✓ Acceptable · C1/C2/C3/FI see observations · N/V Not verified · LIM Limitation · N/A Not applicable</p></section>
${boards}
<footer>${esc(co.company || "BlueForge Engineering")} – EICR ${esc(job.reportNo || "")} – ${esc(job.address || "")}</footer>
</body></html>`;
}
function certCircuitRows(job, b){
  const v = x => x === null || x === undefined ? "" : typeof x === "number" ? x.toFixed(2) : x;
  return b.circuits.map(c => { const r = calcCircuit(job, b, c);
    return `<tr class="${r.result}">${[c.no,c.desc,c.wtype,c.ref,c.pts,c.live,c.cpc,devShort(c),c.rating,c.ka,c.rcd,v(r.maxZs ?? r.maxNote),v(r.m80),c.r1,c.rn,c.r2,c.r12,c.R2,c.irv,c.irll,c.irle,c.pol,c.zs || (r.zsCalc ? v(r.zsUsed) + "*" : ""),c.rcdt,c.rcdt5,c.rcdbtn,c.afdd,{pass:"PASS",fail:"FAIL",check:"CHECK",none:""}[r.result],c.remarks].map(x => `<td>${esc(x)}</td>`).join("")}</tr>`; }).join("");
}
const CERT_HEAD = ["No","Description","Type","Ref","Pts","Live","cpc","Device","In (A)","kA","RCD mA","Max Zs","Max meas. Zs","r1","rn","r2","R1+R2","R2","IR V","IR L-L","IR L-E","Pol","Zs","RCD ms","5× ms","RCD btn","AFDD","Result","Remarks"];
function exportCert(job){
  const t = typeOf(job), s = jobSummary(job), sup = calcSupply(job), co = job.company || settings, w = job.work;
  const row = (l, v) => `<tr><th>${esc(l)}</th><td>${esc(v ?? "")}</td></tr>`;
  const row2 = (l1, v1, l2, v2) => `<tr><th>${esc(l1)}</th><td>${esc(v1 ?? "")}</td><th>${esc(l2)}</th><td>${esc(v2 ?? "")}</td></tr>`;
  const sec = x => `<h2>${esc(x)}</h2>`;
  const sigCell = job.sig ? `<img src="${job.sig}" alt="Signature">` : "";
  const notif = NOTIFY.filter(([k]) => w.notify[k] === "Yes").map(([,l]) => l);
  const boardTable = b => `<table class="kv"><tbody>${row2("Board", b.ref, "Location", b.location)}${row2("Zdb (Ω)", boardZdb(job,b) ?? "", "Ipf at board (kA)", boardIpf(job,b) ?? "")}${row2("Tested by", b.testedBy, "Date tested", ukDate(b.date))}${row2("Multifunction tester", b.mft, "IR / loop / RCD testers", [b.irSerial, b.loopSerial].filter(Boolean).join(" · "))}</tbody></table>
    <table class="sched"><thead><tr>${CERT_HEAD.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${certCircuitRows(job, b)}</tbody></table>`;
  const supplyTables = `${sec(t === "EIC" ? "Supply characteristics and earthing arrangements" : "Part 2 – Installation details")}<table class="kv"><tbody>${row2("Earthing arrangement", job.supply.earth, "Live conductors", job.supply.phases)}${row2("Ze (Ω)", job.supply.ze, "Ipf (kA)", job.supply.ipf)}${row2("Nominal voltage Uo (V)", job.supply.uo, "Frequency (Hz)", job.supply.freq)}${row2("Supply protective device", [job.supply.devBs, job.supply.devRating && job.supply.devRating + " A"].filter(Boolean).join(" · "), "Method of fault protection", "Automatic disconnection of supply")}${row2("Earthing conductor (mm²)", job.supply.earthCsa + (sup.earthCheck ? ` – ${sup.earthCheck.t}` : ""), "Main bonding (mm²)", job.supply.bondCsa + (sup.bondCheck ? ` – ${sup.bondCheck.t}` : ""))}${row2("Bonding: water / gas / oil", [job.supply.water, job.supply.gas, job.supply.oil].map(x => x || "–").join(" / "), "Bonding: steel / other", [job.supply.steel || "–", job.supply.otherBond].filter(Boolean).join(" / "))}${t === "EIC" ? row2("Main switch", [job.supply.msBs, job.supply.msRating].filter(Boolean).join(" · "), "Maximum demand (A)", w.maxDemand) : ""}</tbody></table>`;
  const inspTable = `<section style="break-before:page">${sec("Schedule of inspections")}<table class="insp"><thead><tr><th>Item</th><th>Description</th><th>Outcome</th></tr></thead><tbody>${INSP.map(([sid,tt,items]) => `<tr class="grp"><td>${sid}</td><td colspan="2">${esc(tt)}</td></tr>` + items.map(([id,q]) => `<tr><td>${id}</td><td>${esc(q)}</td><td>${esc(job.insp[id.replace(".","_")] || "")}</td></tr>`).join("")).join("")}</tbody></table><p class="guide">✓ Inspected and satisfactory · ✗ Not satisfactory · N/A Not applicable</p></section>`;
  let body;
  if (t === "EIC") {
    const signers = w.sameSigner === "No"
      ? `${row2("Design – by", w.designer, "Date", ukDate(w.designDate))}${row2("Construction – by", w.constructor, "Date", ukDate(w.constructDate))}<tr><th>Inspection &amp; testing – by</th><td>${esc(job.inspector)}</td><th>Date</th><td>${esc(ukDate(job.sigDate))}</td></tr><tr><th>Signature</th><td class="sig" colspan="3">${sigCell}</td></tr>`
      : `<tr><th>Designed, constructed, inspected and tested by</th><td>${esc(job.inspector)}${job.position ? " – " + esc(job.position) : ""}</td><th>Date</th><td>${esc(ukDate(job.sigDate))}</td></tr><tr><th>Signature</th><td class="sig" colspan="3">${sigCell}</td></tr>`;
    body = `
${sec("Details of the client and installation")}<table class="kv"><tbody>${row2("Client", job.client.name, "Telephone", job.client.phone)}${row("Client address", job.client.address)}${row("Installation address", job.address)}${row2("Occupier", job.occupier, "Premises", job.premises)}</tbody></table>
${sec("Description and extent of the installation")}<table class="kv"><tbody>${row2("Nature of the work", w.nature, "Date of completion", ukDate(job.inspDate))}${row("Description of the work", w.desc)}${row("Extent covered by this certificate", w.extent)}</tbody></table>
${sec("Design, construction, inspection and testing")}<p class="guide">I/We, being the person(s) responsible for the design, construction, inspection and testing of the electrical installation described above, having exercised reasonable skill and care, certify that the work for which I/we have been responsible is, to the best of my/our knowledge and belief, in accordance with BS 7671:2018+A4:2026 except for any departures listed below.</p>
<table class="kv"><tbody>${signers}${row("Departures from BS 7671", w.departures || "None")}</tbody></table>
${sec("Next inspection")}<table class="kv"><tbody>${row2("Recommended interval", s.interval ? (s.interval < 1 ? "3 months" : s.interval + " years") : "", "First inspection due by", ukDate(s.nextDue))}</tbody></table>
${w.nature !== "New installation" ? `${sec("Comments on the existing installation")}<table class="kv"><tbody>${row("Comments", w.existing || "None")}</tbody></table>` : ""}
${notif.length ? `${sec("Building Regulations")}<table class="kv"><tbody>${row("Notifiable work", notif.join("; "))}${row("Building control reference", w.bcRef)}</tbody></table>` : ""}
${supplyTables}
<h2>Guidance for recipients</h2><p class="guide">This certificate confirms that the new work described was designed, constructed, inspected and tested in line with BS 7671. Keep it safe and show it to anyone doing further work. The installation should be inspected and tested again by the date shown above.</p>
${inspTable}
${job.boards.map(b => `<section class="wide">${sec(`Schedule of circuit details and test results – ${b.ref}`)}${boardTable(b)}<p class="note">Max measured Zs is 80% of the BS 7671 Table 41.2–41.4 value. * Zs calculated as Zdb + R1+R2.</p></section>`).join("")}`;
  } else {
    const circs = job.boards.flatMap(b => b.circuits.map(c => ({b, c, r: calcCircuit(job, b, c)})));
    const circTables = circs.map(({b, c, r}) => `<table class="kv"><tbody>${row2("Board / circuit", `${b.ref} / ${c.no}`, "Circuit description", c.desc)}${row2("Protective device", `${devShort(c)}${c.ka ? " · " + c.ka + " kA" : ""}`, "RCD", c.rcd ? `${c.rcd} mA ${c.rcdType || ""}` : "None")}${row2("Cable (live / cpc mm²)", c.live ? `${c.live} / ${c.cpc}` : "", "Reference method", c.ref)}${row2("R1+R2 (Ω)", c.r12, "R2 (Ω)", c.R2)}${row2("Insulation L–L (MΩ)", c.irll, "Insulation L–E (MΩ)", c.irle)}${row2("Test voltage (V)", c.irv, "Polarity", c.pol)}${row2("Measured Zs (Ω)", c.zs || (r.zsCalc ? r.zsUsed.toFixed(2) + " (calc.)" : ""), "Max measured Zs (Ω)", r.m80 !== null ? r.m80.toFixed(2) : r.maxNote)}${row2("RCD time (ms)", [c.rcdt, c.rcdt5 && c.rcdt5 + " at 5×"].filter(Boolean).join(" / "), "RCD / AFDD test button", [c.rcdbtn, c.afdd].filter(Boolean).join(" / "))}${row2("Result", {pass:"PASS",fail:"FAIL",check:"CHECK",none:"Not tested"}[r.result], "Tested by", `${b.testedBy || ""}${b.mft ? " · " + b.mft : ""}`)}</tbody></table>`).join("");
    body = `
${sec("Part 1 – Description of the minor works")}<table class="kv"><tbody>${row2("Client", job.client.name, "Date work completed", ukDate(job.inspDate))}${row("Installation address", job.address)}${row("Description of the minor works", w.desc)}${row("Departures from BS 7671", w.departures || "None")}${row("Comments on the existing installation", w.existing || "None")}${notif.length ? row("Notifiable work / building control ref.", notif.join("; ") + (w.bcRef ? " – " + w.bcRef : "")) : ""}</tbody></table>
${supplyTables}
${sec("Part 3 – Essential tests")}${circTables || `<p class="guide">No circuit recorded.</p>`}
${sec("Part 4 – Declaration")}<p class="guide">I/We certify that the minor works described above have, to the best of my/our knowledge and belief, been designed, constructed, inspected and tested in accordance with BS 7671:2018+A4:2026 except for any departures stated in Part 1, and that the safety of the existing installation is not impaired by this work.</p>
<table class="kv"><tbody>${row2("Name", job.inspector, "Position", job.position)}<tr><th>Signature</th><td class="sig">${sigCell}</td><th>Date</th><td>${esc(ukDate(job.sigDate))}</td></tr></tbody></table>`;
  }
  const title = `${TYPES[t]} – ${jobTitle(job)}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>${REPORT_CSS}</style></head><body>
<div class="band"><b>${esc(co.company || "BlueForge Engineering")}</b><span>${esc([co.address, co.phone, co.email].filter(Boolean).join(" · "))}</span></div>
<div class="sub">${esc(TYPE_LONG[t])} – BS 7671:2018+A4:2026</div>
<table class="kv"><tbody>${row2("Certificate number", job.reportNo, "Date of issue", ukDate(job.issueDate))}${row2("Contractor", co.company, "Registration / scheme no.", co.reg)}</tbody></table>
${body}
<footer>${esc(co.company || "BlueForge Engineering")} – ${esc(TYPES[t])} ${esc(job.reportNo || "")} – ${esc(job.address || "")}</footer>
</body></html>`;
}
function fileName(job, ext){ return `${{EICR:"EICR", EIC:"EIC", MW:"Minor Works"}[typeOf(job)]} ${(job.address || job.client.name || "report").split(/[\n,]/)[0].trim().slice(0,60)} ${ukDate(job.inspDate).replace(/\//g,"-")}.${ext}`.replace(/[\\/:*?"<>|]/g,""); }
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
// iPhone: save files through the share sheet (Save to Files / Mail). Must be called straight from a tap.
async function shareFiles(list, title){
  const files = list.map(f => new File([f.text], f.name, {type: f.type}));
  const tryShare = async fs => { if (navigator.canShare && navigator.canShare({files: fs})) { await navigator.share({files: fs, title}); return true; } return false; };
  try { if (await tryShare(files)) return "shared"; if (files.length > 1 && await tryShare([files[0]])) return "shared"; }
  catch(e){ if (e && e.name === "AbortError") return "cancelled"; }
  list.forEach((f, i) => setTimeout(() => downloadFile(f.name, f.text, f.type, true), i*600));
  return "downloaded";
}
function downloadFile(name, text, type, noShare){
  if (IOS && !noShare) { shareFiles([{name, text, type}], name); return; }
  const blob = new Blob([text], {type});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}
function exportReport(){ const job = j(); downloadFile(fileName(job, "html"), exportHtml(job), "text/html"); const m = document.getElementById("exportmsg"); if (m) m.innerHTML = `<div class="muted small">${IOS ? "Choose Save to Files to keep a copy." : "Saved to Downloads."}</div>`; }
function printInPlace(job){
  // Swap the page for the report, with a toolbar that is hidden when printing. "Back" reloads the app (everything is already saved).
  try { if (persistTimer) { clearTimeout(persistTimer); writeNow(); } sessionStorage.setItem("bf-return", JSON.stringify({jobId: job.id, tab: view.tab})); } catch(e){}
  const bar = `<div id="bf-bar" style="position:sticky;top:0;z-index:9;display:flex;gap:8px;padding:10px 12px;padding-top:calc(10px + env(safe-area-inset-top,0px));background:#1B365D">
<button onclick="location.reload()" style="flex:1;min-height:44px;border-radius:10px;border:1px solid #fff;background:transparent;color:#fff;font:600 16px Arial">‹ Back to app</button>
<button onclick="window.print()" style="flex:1;min-height:44px;border-radius:10px;border:0;background:#2E75B6;color:#fff;font:600 16px Arial">Print / PDF</button></div>
<style>@media print{#bf-bar{display:none!important}}</style>`;
  const html = exportHtml(job).replace(/<body>/, "<body>" + bar).replace('<meta name="viewport" content="width=device-width,initial-scale=1">', '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">');
  document.open(); document.write(html); document.close(); window.scrollTo(0, 0);
}
function printReport(){
  const job = j();
  if (IOS) { printInPlace(job); return; }
  const w = window.open("", "_blank");
  if (!w) { exportReport(); return; }
  w.document.open(); w.document.write(exportHtml(job).replace("</body>", "<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body>")); w.document.close();
}
function backup(){
  const data = JSON.stringify({app:"blueforge-eicr", version:2, saved:new Date().toISOString(), settings, jobs: jobs.filter(x => !x.example)});
  downloadFile(`BlueForge EICR backup ${today()}.json`, data, "application/json");
  const m = document.getElementById("backupmsg"); if (m) m.innerHTML = `<div class="muted small">${IOS ? "Choose Save to Files or Mail to keep the backup." : "Backup saved to Downloads."}</div>`;
}
document.addEventListener("change", e => {
  if (e.target.id !== "restore" || !e.target.files[0]) return;
  const fr = new FileReader();
  fr.onload = () => {
    const m = document.getElementById("backupmsg");
    try {
      const d = JSON.parse(fr.result);
      if (!d || d.app !== "blueforge-eicr" || !Array.isArray(d.jobs)) throw new Error("not a backup");
      let added = 0;
      d.jobs.forEach(x => { if (!x || !x.id) return; normaliseJob(x); const i = jobs.findIndex(y => y.id === x.id); if (i < 0) { jobs.push(x); added++; } else if ((x.updated||0) > (jobs[i].updated||0)) { jobs[i] = x; added++; } });
      if (d.settings && !settings.sendUrl && d.settings.sendUrl) { settings.sendUrl = d.settings.sendUrl; if (d.settings.sendKey) settings.sendKey = d.settings.sendKey; }
      lsWrite(); scheduleSync(1000);
      if (m) m.innerHTML = `<div class="muted small">Loaded ${added} job${added === 1 ? "" : "s"} (newer copies only).</div>`;
    } catch(err){ if (m) m.innerHTML = `<div class="errline">That file isn't a BlueForge EICR backup.</div>`; }
  };
  fr.readAsText(e.target.files[0]);
});

init();
})();
