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
const INSP_EV = ["9","EV charge point",[["9.1","Dedicated final circuit for the charge point"],["9.2","Earthing suitable – PME protection by an accepted method (e.g. open-PEN device, TT electrode)"],["9.3","RCD protection – Type A with 6 mA DC detection (RDC-DD) or Type B"],["9.4","Charge point IP and impact rating suitable for the location"],["9.5","Isolation and switching provided"],["9.6","Cable protected against damage and suitable for the route"],["9.7","DNO notified where required"],["9.8","Manufacturer's commissioning / load management checked"]]];
const INSP_PV = ["10","Solar PV / battery storage",[["10.1","DC isolator(s) present, correctly rated and labelled"],["10.2","AC isolator present, lockable and labelled"],["10.3","Dual supply warning labels at origin, meter and consumer unit"],["10.4","Inverter RCD type compatible with manufacturer's instructions"],["10.5","DC cables suitable (PV cable), protected and routed correctly"],["10.6","Need for surge protection assessed"],["10.7","Array frame earthing / bonding as required"],["10.8","DNO notification (G98 / G99) completed"],["10.9","Battery installed to manufacturer's instructions (location, ventilation, fire separation)"]]];
function inspSecs(job){ const w = (job && job.work) || {}; const s = INSP.slice(); if (w.ev === "Yes") s.push(INSP_EV); if (w.pv === "Yes") s.push(INSP_PV); return s; }
function inspFlat(job){ return inspSecs(job).flatMap(x => x[2]); }

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
const DEFAULT_SETTINGS = { lock:"Off", lockAfter:"5", vatReg:"No", vatRate:"20", payTerms:"14", numPrefix:"BF", labelModuleMm:"18", labFont:"standard", labSize:"L", labBold:"Yes", counters:{}, officeEmail:"office@blueforge-engineering.co.uk", sendUrl:"", sendKey:"", autoSend:"Yes", userName:"", role:"Inspector", signOffName:"Adam Fyles", lastSync:0, company:"BlueForge Engineering", inspector:"Adam Fyles", position:"Owner / Inspector", address:"Llandudno, North Wales", phone:"", email:"", reg:"", mft:"", irSerial:"", loopSerial:"", elecSerial:"" };
let settings = { ...DEFAULT_SETTINGS };

function newCircuit(no){ return { id:uid(), no:String(no), desc:"", wtype:"A", ref:"C", pts:"", live:"", cpc:"", ctype:"Final", dev:"", rating:"", ka:"6", rcd:"", rcdType:"", len:"", ring:"N", r1:"", rn:"", r2:"", r12:"", R2:"", irv:"500", irll:"", irle:"", pol:"", zs:"", rcdt:"", rcdt5:"", rcdbtn:"", afdd:"", remarks:"" }; }
const TYPES = { EICR:"EICR", EIC:"EIC", MW:"Minor Works", PAT:"PAT" };
Object.entries(window.BF_FORMS || {}).forEach(([k, f]) => { TYPES[k] = f.name; });
const TYPE_LONG = { EICR:"Electrical Installation Condition Report", EIC:"Electrical Installation Certificate", MW:"Minor Electrical Installation Works Certificate", PAT:"Portable Appliance Test Register" };
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
  if (type === "PAT") { job.boards = []; job.pat = { items: [] }; job.reason = "PAT testing"; }
  if (window.BF_FORMS && window.BF_FORMS[type]) { job.boards = []; job.extent = ""; job.limitations = ""; job.reason = window.BF_FORMS[type].long; job.form = { v: { _inst: settings.mft || "" }, chk: {}, rows: {}, roles: [] }; }
  return job;
}
function normaliseJob(job){
  if (!job.type) job.type = "EICR";
  if (!job.work) job.work = { nature:"", desc:"", extent:"", maxDemand:"", departures:"", existing:"", notify:{}, bcRef:"", sameSigner:"Yes", designer:"", designDate:"", constructor:"", constructDate:"" };
  if (!job.work.notify) job.work.notify = {};
  ensurePhotos(job);
  if (!job.handover) job.handover = {};
  if (!job.client) job.client = {};
  if (typeOf(job) === "PAT" && !job.pat) job.pat = { items: [] };
  if (window.BF_FORMS && window.BF_FORMS[job.type]) formInit(job);
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
  const coded = inspFlat(job).filter(([id]) => ["C1","C2","C3","FI"].includes(job.insp[id.replace(".","_")]) && !linked.has("insp:"+id));
  const years = (PREMISES.find(p => p[0] === job.premises) || [])[1];
  const interval = num(job.recInterval) ?? years ?? null;
  let nextDue = "";
  if (interval && job.inspDate){ const d = new Date(job.inspDate + "T12:00:00"); d.setMonth(d.getMonth() + Math.round(interval*12)); nextDue = d.toISOString().slice(0,10); }
  const type = typeOf(job);
  if (FORMS[type]) { const fs = formSummary(job); const nd = (job.form && job.form.nextDue) || fs.nextDue; return { counts, fails: [], unwrittenFails: [], coded: [], inspFails: [], incomplete: [], tested: fs.rows, total: fs.rows, untested: 0, unsat: formBad(FORMS[type], fs.outcome), started: fs.rows + fs.checksDone, years: null, interval: null, nextDue: nd, status: formBad(FORMS[type], fs.outcome) ? "fail" : fs.outcome && fs.outcome !== "Draft" ? "pass" : "none", form: fs }; }
  if (type === "PAT") { const ps = patSummary(job); return { counts, fails: [], unwrittenFails: [], coded: [], inspFails: [], incomplete: [], tested: ps.pass + ps.fail, total: ps.total, untested: ps.none + ps.check, unsat: false, started: ps.total, years: null, interval: null, nextDue: "", status: ps.status, pat: ps }; }
  if (type !== "EICR") {
    const inspFails = inspFlat(job).filter(([id]) => job.insp[id.replace(".","_")] === "✗");
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
const liveJobs = () => jobs.filter(x => !x.deleted && x.type !== "NVQ");
function idbOpen(){ return new Promise(res => { try { const r = indexedDB.open(IDB_NAME, 2); r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains(IDB_STORE)) d.createObjectStore(IDB_STORE); if (!d.objectStoreNames.contains("photos")) d.createObjectStore("photos"); }; r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null); } catch(e){ res(null); } }); }
function idbGet(k){ return new Promise(res => { if (!idb) return res(undefined); try { const q = idb.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); } catch(e){ res(undefined); } }); }
function idbSet(k, v){ return new Promise(res => { if (!idb) return res(false); try { const tx = idb.transaction(IDB_STORE, "readwrite"); tx.objectStore(IDB_STORE).put(v, k); tx.oncomplete = () => res(true); tx.onerror = () => res(false); tx.onabort = () => res(false); } catch(e){ res(false); } }); }
function lsRead(){ try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch(e){ return {}; } }
function snapshot(){ return JSON.parse(JSON.stringify({ settings, jobs: jobs.filter(j => !j.example) })); }
function writeNow(){ if (window.__bfRemoved) return;
  const snap = snapshot();
  writeChain = writeChain.then(async () => {
    let ok = await idbSet("state", snap);
    if (!ok) { try { localStorage.setItem(LS, JSON.stringify(snap)); ok = true; } catch(e){ ok = false; } }
    else { try { localStorage.removeItem(LS); } catch(e){} }
    saveState = ok ? "saved" : "full"; updateStatus();
  });
  return writeChain;
}
function lsWrite(){ if (window.__bfRemoved) return true; clearTimeout(persistTimer); persistTimer = setTimeout(writeNow, 250); return true; }
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
  else sync = " · Synced " + agoText(settings.lastSync) + (photoUploadsPending ? ` · ${photoUploadsPending} photos still uploading` : "");
  return `<div class="status ${cls}" id="savestate" role="status"><span class="dot"></span><span style="min-width:0">${esc(txt + sync)}</span></div>`;
}

const LOGOS = { bf: null, inaec: null };
async function loadLogos(){
  const get = async f => { try { const r = await fetch(f); if (!r.ok) return null; const b = await r.blob(); if (!/^image\//.test(b.type)) return null;
    return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(null); fr.readAsDataURL(b); }); } catch(e){ return null; } };
  [LOGOS.bf, LOGOS.inaec] = await Promise.all([get("logo-blueforge.png"), get("logo-inaec.png")]);
  const mk = await get("logo-mark.png"); if (!mk) LOGOS.bf = null;
  if (LOGOS.bf) document.documentElement.classList.add("has-logo");
}
function hideSplash(){ const sp = document.getElementById("splash"); if (!sp) return; const wait = Math.max(0, 700 - (Date.now() - (window.__bfStart || 0))); setTimeout(() => { sp.classList.add("gone"); setTimeout(() => sp.remove(), 450); }, wait); }
// Company band at the top of every document. Certificates (not quotes/invoices) also carry the INAEC Independent Contractor logo.
function band(co, cert){
  const bf = LOGOS.bf ? `<img class="lg" src="${LOGOS.bf}" alt="">` : "";
  const ic = cert && LOGOS.inaec ? `<img class="ic" src="${LOGOS.inaec}" alt="INAEC Independent Contractor">` : "";
  return `<div class="band${bf || ic ? " logos" : ""}">${bf}<div class="bt"><b>${esc(co.company || "BlueForge Engineering")}</b><span>${esc([co.address, co.phone, co.email].filter(Boolean).join(" · "))}</span></div>${ic}</div>`;
}
async function init(){
  window.__bfStart = window.__bfStart || Date.now();
  idb = await idbOpen();
  await loadLogos();
  let st = await idbGet("state");
  if (!st) { const ls = lsRead(); if (ls && (ls.jobs || ls.settings)) st = ls; }
  if (st && st.settings) settings = {...DEFAULT_SETTINGS, ...st.settings};
  jobs = st && Array.isArray(st.jobs) ? st.jobs.map(normaliseJob) : [];
  if (!settings.deviceId) settings.deviceId = uid();
  if (!settings.sendKey) settings.sendKey = "bf-" + Array.from(crypto.getRandomValues(new Uint8Array(18)), x => "abcdefghijklmnopqrstuvwxyz0123456789"[x % 36]).join("");
  writeNow();
  await initPhotoQueue();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    try {
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("sw.js").then(r => { try { r.update(); } catch(e){} }).catch(() => {});
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController) { appUpdated = true; updateStatus(); } });
    } catch(e){}
  }
  const lost = takePhotoPending();
  if (lost && String(lost.target || "").startsWith("pf:") && jobs.some(x => x.id === lost.jobId && !x.deleted)) { view = {screen:"nvq", jobId:lost.jobId, pfItem: lost.target.slice(3)}; setTimeout(() => toast("Your phone closed the app while the camera was open – use Gallery to add that photo"), 800); }
  else if (lost && jobs.some(x => x.id === lost.jobId && !x.deleted && x.type !== "NVQ")) { view = {screen:"job", jobId:lost.jobId, tab:"photos", board:0, circ:null, photoLost: lost.target}; }
  else try { const r = JSON.parse(sessionStorage.getItem("bf-return") || "null"); sessionStorage.removeItem("bf-return"); if (r && r.screen === "nvq") view = {screen:"nvq", jobId:r.jobId, pfItem:r.pfItem}; else if (r && jobs.some(x => x.id === r.jobId && !x.deleted && x.type !== "NVQ")) view = {screen:"job", jobId:r.jobId, tab:r.tab, board:0, circ:null}; } catch(e){}
  render(); hideSplash();
  if (lockOn()) showLock();
  window.addEventListener("online", () => { updateStatus(); syncNow(); });
  window.addEventListener("offline", updateStatus);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { setTimeout(clearPhotoPending, 5000); syncNow(); } else if (persistTimer) { clearTimeout(persistTimer); writeNow(); } });
  window.addEventListener("pagehide", () => { if (persistTimer) { clearTimeout(persistTimer); writeNow(); } });
  setInterval(() => { syncNow(); updateStatus(); }, 60000);
  setTimeout(syncNow, 800);
}

/* ------------------------------------------------------------------ sync with the Google Drive folder (via the user's own Apps Script) */
const syncState = { state:"idle", err:"" };
let syncing = false, syncTimer = null, syncAgain = false;
function setSync(state, err){ syncState.state = state; syncState.err = err || ""; updateStatus(); }
function scheduleSync(ms){ if (!settings.sendUrl) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, ms); }
function platformName(){ const u = navigator.userAgent; return /iPhone/.test(u) ? "iPhone" : /iPad/.test(u) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ? "iPad" : /Android/.test(u) ? "Android" : /Windows/.test(u) ? "Windows PC" : /Mac/.test(u) ? "Mac" : "Other"; }
async function api(action, data){
  const res = await fetch(settings.sendUrl, { method:"POST", body: JSON.stringify({ key: settings.sendKey, action, device: settings.deviceId, deviceName: settings.userName || "", role: settings.role, platform: platformName(), owner: settings.ownerHash || "", ...data }), redirect:"follow" });
  const text = await res.text().catch(() => "");
  let o = null; try { o = JSON.parse(text); } catch(e){}
  if (!o) {
    const t = text.toLowerCase();
    if (/authori[sz]ation is required|needs your permission|permission/.test(t)) throw new Error("Google needs permission – in the script editor run “authorise”, allow Drive and Gmail, then Deploy › Manage deployments › Edit › New version");
    if (/script function not found|dopost/.test(t)) throw new Error("the deployed script has no doPost – paste the new script, Save, then deploy a New version");
    if (/accounts\.google\.com|sign in|servicelogin/.test(t)) throw new Error("Google asked for a sign-in – set the deployment's access to “Anyone” (not “Anyone with a Google account”)");
    if (res.status === 404 || /unable to open the file|not found/.test(t)) throw new Error("that link doesn't point to a live script – use the Web app URL ending in /exec");
    throw new Error("no reply from your Google script (" + res.status + ") – check the link ends in /exec and a New version is deployed");
  }
  if (!o.ok && o.error === "DEVICE_REMOVED") { await deviceRemoved(); throw new Error("this device has been removed"); }
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
    await assignPendingNumbers();
    try { if (await syncPhotos()) syncAgain = true; }
    catch(e){ throw new Error("photos: " + String(e.message || e)); }
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

/* ------------------------------------------------------------------ photos
   Photos are stored separately from the job (IndexedDB "photos" store) and referenced by id:
   job.photos.slots[key] = [ids], job.photos.na[key] = "reason", obs.photos = [ids], job.photos.other = [ids]. */
const photoCache = new Map();          // id -> dataURL (in memory for the jobs we've looked at)
let photoUploadsPending = 0;
const pendingUploads = new Set();      // photo ids taken on this device that haven't reached Drive yet
async function initPhotoQueue(){ const recs = await photoAll(); recs.forEach(r => { if (!r.uploaded) pendingUploads.add(r.id); }); photoUploadsPending = pendingUploads.size; }
function photoKeys(){ return new Promise(res => { try { const st = photoTx("readonly"); if (!st) return res([]); const q = st.getAllKeys(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); } catch(e){ res([]); } }); }
function ensurePhotos(job){ if (!job.photos) job.photos = { slots:{}, na:{}, other:[] }; if (!job.photos.slots) job.photos.slots = {}; if (!job.photos.na) job.photos.na = {}; if (!job.photos.other) job.photos.other = []; (job.obs || []).forEach(o => { if (!o.photos) o.photos = []; }); return job.photos; }
function requiredSlots(job){
  if (typeOf(job) === "PAT" || isForm(job)) return [];
  const s = [["supply","Supply head / cut-out"],["mainfuse","Main (supply) fuse"],["earthing","Earthing arrangement (main earthing terminal / conductor)"]];
  (job.boards || []).forEach(b => { s.push(["b:" + b.id + ":on", `${b.ref || "Board"} – cover on`]); s.push(["b:" + b.id + ":off", `${b.ref || "Board"} – cover off`]); });
  return s;
}
function slotLabel(job, key){ const r = requiredSlots(job).find(x => x[0] === key); return r ? r[1] : key; }
function allPhotoIds(job){
  const p = ensurePhotos(job), ids = [];
  Object.values(p.slots).forEach(a => ids.push(...(a || [])));
  ids.push(...(p.other || []));
  (job.obs || []).forEach(o => ids.push(...(o.photos || [])));
  if (job.portfolio) (job.portfolio.items || []).forEach(it => ids.push(...(it.photos || [])));
  return ids;
}
function missingPhotos(job){
  const p = ensurePhotos(job);
  return requiredSlots(job).filter(([k]) => !(p.slots[k] || []).length && !String(p.na[k] || "").trim());
}
function photoTx(mode){ return idb && idb.objectStoreNames.contains("photos") ? idb.transaction("photos", mode).objectStore("photos") : null; }
function photoPut(rec){ return new Promise(res => { try { const st = photoTx("readwrite"); if (!st) return res(false); const q = st.put(rec, rec.id); q.onsuccess = () => res(true); q.onerror = () => res(false); } catch(e){ res(false); } }); }
function photoGet(id){ return new Promise(res => { try { const st = photoTx("readonly"); if (!st) return res(null); const q = st.get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch(e){ res(null); } }); }
function photoAll(){ return new Promise(res => { try { const st = photoTx("readonly"); if (!st) return res([]); const q = st.getAll(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); } catch(e){ res([]); } }); }
function photoDel(id){ return new Promise(res => { try { const st = photoTx("readwrite"); if (!st) return res(false); const q = st.delete(id); q.onsuccess = () => res(true); q.onerror = () => res(false); } catch(e){ res(false); } }); }
async function loadJobPhotos(job){
  if (!job) return;
  const want = allPhotoIds(job).filter(id => !photoCache.has(id));
  if (job.example) return;
  let got = false;
  for (const id of want){ const r = await photoGet(id); if (r && r.data) { photoCache.set(id, r.data); got = true; } }
  if (got && view.screen === "job" && view.jobId === job.id && !isEditing()) rerender();
}
// Shrink a camera photo to 1600 px without ever holding the full 12–50 MP image in memory where the browser allows it
// (decoding a full-size photo into a canvas is what makes low-memory phones kill the app).
const PHOTO_MAX = 1600;
async function compressImage(file){
  const toData = (src, sw, sh) => { const sc = Math.min(1, PHOTO_MAX / Math.max(sw, sh)); const w = Math.max(1, Math.round(sw * sc)), h = Math.max(1, Math.round(sh * sc));
    let cv = document.createElement("canvas"); cv.width = w; cv.height = h; const ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(src, 0, 0, w, h);
    const data = cv.toDataURL("image/jpeg", 0.72); cv.width = cv.height = 0; cv = null; return { data, w, h }; };
  if (window.createImageBitmap) {
    try {
      // First pass decodes straight to at most 1600 px wide; a tall photo may come back taller, the canvas step caps it.
      const bm = await createImageBitmap(file, { resizeWidth: PHOTO_MAX, resizeQuality: "high", imageOrientation: "from-image" });
      let out;
      if (bm.width > PHOTO_MAX * 1.02 || bm.height > PHOTO_MAX * 1.6) {  // resize option ignored (older Safari) – fall through to the image path below
        bm.close && bm.close();
      } else { out = toData(bm, bm.width, bm.height); bm.close && bm.close(); return out; }
    } catch(e){ /* fall back */ }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.decoding = "async";
    img.onload = () => { try { const r = toData(img, img.naturalWidth, img.naturalHeight); URL.revokeObjectURL(url); img.src = ""; resolve(r); } catch(e){ URL.revokeObjectURL(url); reject(new Error("The phone ran short of memory shrinking that photo – try again, or use Gallery.")); } };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a photo this device can read.")); };
    img.src = url;
  });
}
// If the phone closes the app while its camera is open, remember where we were so the app reopens on the same photo slot.
const PHOTO_MARK = "bf-photo-pending";
function markPhotoPending(target){ try { if (persistTimer) { clearTimeout(persistTimer); writeNow(); } sessionStorage.setItem(PHOTO_MARK, JSON.stringify({ jobId: view.jobId, tab: view.tab, target, at: Date.now() })); localStorage.setItem(PHOTO_MARK, sessionStorage.getItem(PHOTO_MARK)); } catch(e){} }
function clearPhotoPending(){ try { sessionStorage.removeItem(PHOTO_MARK); localStorage.removeItem(PHOTO_MARK); } catch(e){} }
function takePhotoPending(){ try { const r = JSON.parse(sessionStorage.getItem(PHOTO_MARK) || localStorage.getItem(PHOTO_MARK) || "null"); clearPhotoPending(); return r && Date.now() - r.at < 20 * 60000 ? r : null; } catch(e){ return null; } }
async function addPhotos(target, files){
  const job = j(); if (!job || job.example || !files || !files.length) return;
  const p = ensurePhotos(job);
  let added = 0, err = "";
  for (const f of Array.from(files)){
    try {
      const c = await compressImage(f);
      const id = uid();
      const rec = { id, jobId: job.id, data: c.data, w: c.w, h: c.h, created: Date.now(), uploaded: false };
      await photoPut(rec); photoCache.set(id, c.data); pendingUploads.add(id); photoUploadsPending = pendingUploads.size;
      if (target.startsWith("obs:")) { const o = job.obs.find(x => x.id === target.slice(4)); if (o) { o.photos = o.photos || []; o.photos.push(id); } }
      else if (target.startsWith("pf:")) { const it = job.portfolio && job.portfolio.items.find(x => x.id === target.slice(3)); if (it) { it.photos = it.photos || []; it.photos.push(id); } }
      else if (target === "other") p.other.push(id);
      else { (p.slots[target] = p.slots[target] || []).push(id); delete p.na[target]; }
      added++;
    } catch(e){ err = String(e.message || e); }
  }
  if (added) { markDirty(job); scheduleSync(2000); }
  rerender();
  if (err) toast(err);
}
function removePhoto(id){
  const job = j(); if (!job) return;
  const p = ensurePhotos(job);
  Object.keys(p.slots).forEach(k => p.slots[k] = (p.slots[k] || []).filter(x => x !== id));
  p.other = p.other.filter(x => x !== id);
  job.obs.forEach(o => o.photos = (o.photos || []).filter(x => x !== id));
  if (job.portfolio) job.portfolio.items.forEach(it => it.photos = (it.photos || []).filter(x => x !== id));
  (job.photoDeletes = job.photoDeletes || []).push(id);
  photoDel(id); photoCache.delete(id);
  markDirty(job);
}
function toast(msg){ let t = document.getElementById("toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); } t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => t.hidden = true, 4000); }
function thumbs(ids, target){
  const cells = (ids || []).map(id => { const src = photoCache.get(id);
    return `<button type="button" class="thumb" data-photo="${esc(id)}" aria-label="View photo">${src ? `<img src="${src}" alt="">` : `<span>Not on this device yet</span>`}</button>`; }).join("");
  const t = esc(target);
  const add = curJob().example ? "" : `<label class="thumb add" for="ph-${t}" data-photo-open="${t}">＋<span>Camera</span></label><input type="file" id="ph-${t}" data-photo-target="${t}" accept="image/*" capture="environment" hidden>`
    + `<label class="thumb add alt" for="pg-${t}" data-photo-open="${t}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/></svg><span>Gallery</span></label><input type="file" id="pg-${t}" data-photo-target="${t}" accept="image/*" multiple hidden>`;
  return `<div class="thumbs">${cells}${add}</div>`;
}
function tabPhotos(){
  const job = j(), p = ensurePhotos(job), miss = missingPhotos(job);
  if (typeOf(job) === "PAT") return `<div class="card"><h2>Photos</h2><div class="muted small">Optional – e.g. failed items or labels. They print at the end of the register.</div>${thumbs(p.other, "other")}</div>`;
  if (isForm(job)) return `<div class="card"><h2>Photos</h2><div class="muted small">Optional – panel, devices, labels, anything you need to show. They print at the end of the certificate.</div>${thumbs(p.other, "other")}</div>`;
  const slot = ([k, l]) => `<div class="slot ${(p.slots[k] || []).length || String(p.na[k] || "").trim() ? "done" : ""}">
    <div class="row"><b>${esc(l)}</b><span class="spacer"></span>${(p.slots[k] || []).length ? pill("pass", (p.slots[k].length) + " photo" + (p.slots[k].length === 1 ? "" : "s")) : String(p.na[k] || "").trim() ? pill("none","Not photographed") : pill("check","Required")}</div>
    ${thumbs(p.slots[k], k)}
    ${(p.slots[k] || []).length ? "" : `<details class="more"${p.na[k] ? " open" : ""}><summary>Can't photograph this?</summary><div>${field("Reason", "job.photos.na." + k, {ph:"e.g. Meter cupboard locked – no access"})}</div></details>`}
  </div>`;
  const obsWith = job.obs.filter(o => (o.photos || []).length);
  const lostBanner = view.photoLost ? `<div class="warnline">Your phone closed the app while the camera was open (it does this to save memory), so that photo didn't come through. Take the photo with the phone's own camera app, then tap <b>Gallery</b> on the slot and pick it – that way nothing is lost. <button class="btn ghost sm" data-act="lostOk">OK</button></div>` : "";
  return `${lostBanner}<div class="card"><h2>Required photos <span class="count">${requiredSlots(job).length - miss.length} / ${requiredSlots(job).length}</span></h2>
    <div class="muted small">Supply head, main fuse, earthing, and every board with the cover on and off. Photos are shrunk to save space and sync to the Photos folder in your Drive.</div></div>
  <div class="card"><h2>Supply &amp; earthing</h2>${requiredSlots(job).slice(0,3).map(slot).join("")}</div>
  ${job.boards.map(b => `<div class="card"><h2>${esc(b.ref || "Board")}${b.location ? ` <span class="count">${esc(b.location)}</span>` : ""}</h2>${[["b:"+b.id+":on", "Cover on"],["b:"+b.id+":off","Cover off"]].map(slot).join("")}</div>`).join("")}
  <div class="card"><h2>Other photos</h2>${thumbs(p.other, "other")}</div>
  ${typeOf(job) === "EICR" ? `<div class="card"><h2>Defect photos</h2><div class="muted small">Add photos to each observation on the Report tab – they print next to it.</div>
    ${obsWith.length ? obsWith.map(o => `<div class="small"><b>${esc(o.code || "–")}</b> ${esc(o.text.slice(0, 80))} – ${o.photos.length} photo${o.photos.length === 1 ? "" : "s"}</div>`).join("") : `<div class="muted small">None yet.</div>`}</div>` : ""}`;
}
function openViewer(id){
  const job = j(); const src = photoCache.get(id);
  let v = document.getElementById("viewer");
  if (!v) { v = document.createElement("div"); v.id = "viewer"; v.className = "viewer"; document.body.appendChild(v); }
  v.innerHTML = `<div class="vbar"><button class="btn ghost sm" data-viewer="close">Close</button><span class="spacer"></span>${job && !job.example ? `<button class="btn danger sm" data-viewer="del" data-id="${esc(id)}">Delete photo</button>` : ""}</div>
    <div class="vimg">${src ? `<img src="${src}" alt="Photo">` : `<div class="muted">This photo hasn't downloaded to this device yet.</div>`}</div>`;
  v.hidden = false;
}
document.addEventListener("toggle", e => { const d = e.target; if (d && d.matches && d.matches("details[data-frow]")) { if (d.open) view.frowOpen = d.dataset.frow; else if (view.frowOpen === d.dataset.frow) view.frowOpen = null; } }, true);
document.addEventListener("change", e => {
  const fb = e.target.closest && e.target.closest('input[data-bind^="job.form."]');
  if (fb && view.screen === "job") updateFormHint(fb);
  const nu = e.target.closest && e.target.closest("[data-nvqunit]");
  if (nu) { const pj = portfolioJob(), it = pj && pj.portfolio.items.find(x => x.id === view.pfItem); if (it) { it.units = it.units || {}; it.units[nu.dataset.nvqunit] = nu.checked; markDirty(pj); } return; }
  const am = e.target.closest && e.target.closest("[data-am2e]");
  if (am) { tr().am2e[am.dataset.am2e] = am.checked; flush(); const h = am.closest(".card") && am.closest(".card").querySelector(".count"); if (h) { const box = am.closest(".card"); h.textContent = box.querySelectorAll("[data-am2e]:checked").length + "/" + box.querySelectorAll("[data-am2e]").length; } return; }
  const rb = e.target.closest && e.target.closest("[data-readboard]");
  if (rb && rb.files && rb.files[0]) { clearPhotoPending(); const f = rb.files[0]; readBoardFromFile(rb.dataset.readboard, f); rb.value = ""; return; }
  const rs = e.target.closest && e.target.closest("select[data-rb]");
  if (rs && view.read) { const d = view.read.devs[+rs.dataset.rb]; d[rs.dataset.k] = rs.value; if (rs.value === "blank") d.use = false; rerender(); }
});
document.addEventListener("input", e => {
  const ri = e.target.closest && e.target.closest("input[data-rb]");
  if (ri && view.read) { const d = view.read.devs[+ri.dataset.rb]; d[ri.dataset.k] = ri.value; if (ri.dataset.k === "rating" && d.conf === "low" && ri.value) d.conf = "medium"; }
});
document.addEventListener("change", async e => {
  const inp = e.target.closest && e.target.closest("[data-photo-target]");
  if (!inp) return;
  clearPhotoPending();
  const files = inp.files; if (files && files.length) toast(files.length > 1 ? `Adding ${files.length} photos…` : "Adding photo…");
  await addPhotos(inp.dataset.photoTarget, files); inp.value = "";
});
document.addEventListener("click", e => {
  const po = e.target.closest("[data-photo-open]"); if (po) markPhotoPending(po.dataset.photoOpen);
  const t = e.target.closest("[data-photo]");
  if (t) { openViewer(t.dataset.photo); return; }
  const vb = e.target.closest("[data-viewer]");
  if (vb) { const v = document.getElementById("viewer");
    if (vb.dataset.viewer === "del") { if (vb.dataset.confirm) { removePhoto(vb.dataset.id); v.hidden = true; rerender(); } else { vb.dataset.confirm = "1"; vb.textContent = "Tap again to delete"; } }
    else v.hidden = true; }
});
async function syncPhotos(){
  // upload photos taken on this device, then download photos other devices have taken (a few per round so it never blocks)
  let budget = 8;
  const local = new Set(await photoKeys());
  const pending = [...pendingUploads]; let up = 0;
  for (const id of pending){
    if (budget-- <= 0) break;
    const r = await photoGet(id);
    if (!r) { pendingUploads.delete(id); continue; }
    await api("putPhoto", { id: r.id, jobId: r.jobId, data: r.data.split(",")[1] });
    r.uploaded = true; await photoPut(r); pendingUploads.delete(id); up++;
  }
  const deletes = [];
  for (const job of jobs){ if (job.photoDeletes && job.photoDeletes.length) deletes.push(...job.photoDeletes.map(id => ({job, id}))); }
  for (const d of deletes.slice(0, 20)){ try { await api("delPhoto", { id: d.id }); } catch(e){} d.job.photoDeletes = d.job.photoDeletes.filter(x => x !== d.id); }
  const want = [];
  jobs.filter(x => !x.deleted).forEach(job => allPhotoIds(job).forEach(id => { if (!local.has(id)) want.push({id, jobId: job.id}); }));
  let got = 0;
  for (const w of want){
    if (budget-- <= 0) break;
    try { const o = await api("getPhoto", { id: w.id }); if (o.data) { const data = "data:image/jpeg;base64," + o.data; await photoPut({ id: w.id, jobId: w.jobId, data, created: Date.now(), uploaded: true }); photoCache.set(w.id, data); got++; } } catch(e){ /* not uploaded yet by the other device */ }
  }
  photoUploadsPending = pendingUploads.size;
  if (got && view.screen === "job" && !isEditing()) rerender();
  return (up > 0 && pendingUploads.size > 0) || (got > 0 && want.length > got);
}
async function photosForBackup(){ const recs = await photoAll(); const out = {}; const ids = new Set(jobs.flatMap(allPhotoIds)); recs.forEach(r => { if (ids.has(r.id)) out[r.id] = {data: r.data, jobId: r.jobId}; }); return out; }
function photoHtml(ids, caption){
  const imgs = (ids || []).map(id => photoCache.get(id) ? `<figure><img src="${photoCache.get(id)}" alt=""><figcaption>${esc(caption)}</figcaption></figure>` : "").join("");
  return imgs;
}
function photosSectionHtml(job, withObs){
  const p = ensurePhotos(job);
  const req = requiredSlots(job).map(([k, l]) => (p.slots[k] || []).length ? photoHtml(p.slots[k], l) : String(p.na[k] || "").trim() ? `<figure class="na"><div>Not photographed</div><figcaption>${esc(l)} – ${esc(p.na[k])}</figcaption></figure>` : "").join("");
  const other = photoHtml(p.other, "Other");
  const obs = withObs ? job.obs.map((o, i) => photoHtml(o.photos, `Observation ${i + 1} (${o.code || "–"}): ${o.text.slice(0, 70)}`)).join("") : "";
  if (!req && !other && !obs) return "";
  return `<section style="break-before:page"><h2>Photographs</h2><div class="photos">${obs}${req}${other}</div></section>`;
}

/* ================================================================== batch 3: numbering, copying, labels, danger notice, handover, due list, PAT, EV/PV */

/* ---------------- automatic numbering: PREFIX-TYPE-YEAR-NNN, shared across devices through the Google script */
const NUM_CODE = { EICR:"EICR", EIC:"EIC", MW:"MW", PAT:"PAT" };
Object.entries(window.BF_FORMS || {}).forEach(([k, f]) => { NUM_CODE[k] = f.code || k; });
function fmtNumber(type, year, n){ return `${settings.numPrefix || "BF"}-${NUM_CODE[type] || type}-${year}-${String(n).padStart(3, "0")}`; }
async function assignNumber(job){
  if (!job || job.example || job.reportNo) { if (job) job.numPending = false; return; }
  const type = typeOf(job), year = String(job.inspDate || today()).slice(0, 4);
  if (!settings.sendUrl) {
    settings.counters = settings.counters || {};
    const k = type + ":" + year; settings.counters[k] = (settings.counters[k] || 0) + 1;
    job.reportNo = fmtNumber(type, year, settings.counters[k]); job.numPending = false; markDirty(job); return;
  }
  job.numPending = true;
  if (navigator.onLine === false) return;
  const pre = `${settings.numPrefix || "BF"}-${NUM_CODE[type] || type}-${year}-`;
  const floor = Math.max(0, ...jobs.map(x => String(x.reportNo || "").startsWith(pre) ? parseInt(String(x.reportNo).slice(pre.length), 10) || 0 : 0));
  try { const o = await api("nextNumber", { type: NUM_CODE[type] || type, year, prefix: settings.numPrefix || "BF", floor }); if (o.number && !job.reportNo) { job.reportNo = o.number; job.numPending = false; markDirty(job); if (view.jobId === job.id && !isEditing()) rerender(); } }
  catch(e){ /* stays pending – assigned on the next sync */ }
}
async function assignPendingNumbers(){ for (const job of liveJobs().filter(x => x.numPending && !x.reportNo)) await assignNumber(job); }

/* ---------------- copying jobs, boards */
const DESIGN_KEYS = ["no","desc","wtype","ref","pts","live","cpc","ctype","dev","rating","ka","rcd","rcdType","len","ring","irv"];
function copyBoard(b, n){
  const nb = newBoard(n);
  ["location","from","ocpd","phases","spd"].forEach(k => nb[k] = b[k]);
  nb.ref = n ? "DB" + n : b.ref;
  nb.circuits = (b.circuits || []).map(c => { const x = newCircuit(c.no); DESIGN_KEYS.forEach(k => x[k] = c[k]); return x; });
  return nb;
}
const normAddr = a => String(a || "").toLowerCase().split("\n")[0].replace(/[^a-z0-9]/g, "");
function sameAddressJobs(job){
  const k = normAddr(job.address);
  if (k.length < 6) return [];
  return liveJobs().filter(x => x.id !== job.id && normAddr(x.address) === k && typeOf(x) !== "PAT" && !isForm(x)).sort((a,b) => String(b.inspDate).localeCompare(String(a.inspDate)));
}
function copyFrom(dst, src){
  dst.client = {...src.client}; dst.address = src.address; dst.occupier = src.occupier; dst.premises = src.premises;
  if (typeOf(dst) === "EICR") { ["extent","limitations","wiringAge","records","recordsHeld"].forEach(k => dst[k] = src[k]); dst.lastInsp = src.inspDate; }
  const keep = {...src.supply}; ["ze","ipf","ra","polarity","msRcdTime"].forEach(k => keep[k] = ""); dst.supply = keep;
  dst.boards = src.boards.map((b, i) => { const nb = copyBoard(b, 0); nb.ref = b.ref; return nb; });
  if (!dst.boards.length) dst.boards = [newBoard(1)];
  dst.prevObs = (src.obs || []).map(o => ({text:o.text, code:o.code, loc:o.loc, reg:o.reg}));
  dst.copiedFrom = { id: src.id, type: typeOf(src), date: src.inspDate, no: src.reportNo };
  dst.work.ev = src.work && src.work.ev; dst.work.pv = src.work && src.work.pv;
}
function newJobFrom(src, type){
  const nj = newJob(type);
  copyFrom(nj, src);
  if (type === "MW") { nj.boards = [nj.boards[0] || newBoard(1)]; nj.boards[0].circuits = [newCircuit(1)]; }
  return nj;
}
function prevJobsCard(job){
  if (job.example) return "";
  const hasData = job.boards.some(b => b.circuits.some(c => c.desc || c.dev));
  const prev = sameAddressJobs(job);
  const reuse = typeOf(job) === "PAT" || isForm(job) ? "" : `<div class="card"><h2>Re-use this job</h2><div class="muted small">Start a new job at this address with the same client, supply, boards and circuits – test results are cleared.</div>
    <div class="row">${["EICR","EIC","MW"].map(t => `<button class="btn ghost sm" data-act="newFrom" data-type="${t}">New ${esc(TYPES[t])}</button>`).join("")}</div></div>`;
  if (!prev.length || hasData || job.copiedFrom) return reuse;
  return `<div class="card"><h2>Been here before</h2><div class="muted small">Copy the client, supply, boards and circuits from a previous job at this address. Test results aren't copied.</div>
    ${prev.slice(0, 3).map(p => `<button class="card-link" data-act="copyFrom" data-id="${esc(p.id)}"><div class="grow"><div class="t">${esc(TYPES[typeOf(p)])} ${esc(ukDate(p.inspDate))}</div><div class="d">${esc(p.reportNo || "")} · ${p.boards.reduce((n,b) => n + b.circuits.length, 0)} circuits</div></div><span class="pill none">Copy</span></button>`).join("")}</div>` + reuse;
}
function prevObsCard(job){
  if (!job.prevObs || !job.prevObs.length) return "";
  return `<div class="card"><h2>Last report's observations <span class="count">${job.copiedFrom ? esc(ukDate(job.copiedFrom.date)) : ""}</span></h2>
    <div class="muted small">Check each one on site. Tap <b>Still there</b> to add it to this report.</div>
    ${job.prevObs.map((o, i) => `<div class="code-item"><div class="row"><span class="pill ${o.code === "C3" ? "none" : o.code === "FI" ? "check" : "fail"}">${esc(o.code || "–")}</span><span class="spacer"></span>${o.added ? pill("pass","Added") : `<button class="btn ghost sm" data-act="prevObs" data-i="${i}">Still there</button>`}</div><div class="small">${esc(o.text)}</div></div>`).join("")}</div>`;
}

/* ---------------- circuit chart + label strips (Brother P-touch, 180 dpi) */
function circuitChartHtml(job, b){
  const co = job.company || settings;
  const rows = b.circuits.map(c => `<tr><td><b>${esc(c.no)}</b></td><td>${esc(c.desc)}</td><td>${esc(devShort(c))}</td><td>${c.rcd ? esc(c.rcd + " mA" + (c.rcdType ? " " + c.rcdType : "")) : ""}</td><td>${c.live ? esc(c.live + "/" + c.cpc + " mm²") : ""}</td><td>${esc(c.pts)}</td></tr>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Circuit chart – ${esc(b.ref)}</title>
<style>@page{size:A4 portrait;margin:12mm}body{font-family:Arial,sans-serif;color:#0F1B2D;margin:0;padding:12px}h1{font-size:20px;margin:0 0 4px}p{margin:0 0 10px;font-size:12px;color:#444}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #888;padding:6px;text-align:left}th{background:#1B365D;color:#fff}tr:nth-child(even) td{background:#F2F5F9}.foot{margin-top:10px;font-size:11px;color:#444}</style></head><body>
<h1>Circuit chart – ${esc(b.ref)}${b.location ? " (" + esc(b.location) + ")" : ""}</h1><p>${esc(jobTitle(job))} · Supplied from ${esc(b.from || "origin")}${b.ocpd ? " · " + esc(b.ocpd) : ""}</p>
<table><thead><tr><th>Cct</th><th>Description</th><th>Protective device</th><th>RCD</th><th>Cable</th><th>Points</th></tr></thead><tbody>${rows}</tbody></table>
<div class="foot">${esc(co.company || "BlueForge Engineering")} · ${esc(co.phone || "")} · Tested ${esc(ukDate(b.date || job.inspDate))}${job.reportNo ? " · Ref " + esc(job.reportNo) : ""}</div></body></html>`;
}
/* ---------------- circuit labels for the Brother PT-E560BT (24 mm TZe tape = 128 dots high at 180 dpi) */
const TAPE_H = 128, DPMM = 180 / 25.4;
const labText = (c) => String(c.label || c.desc || ("Circuit " + (c.no || ""))).replace(/\s+/g, " ").trim();
function labDevice(c){ const d = devShort(c); if (d === "No device") return ""; return (d.replace(" MCB","") + (c.rcd && !d.includes("RCBO") ? " · " + c.rcd + "mA RCD" : c.rcd ? " " + c.rcd + "mA" : "")).trim(); }
const labOn = (c) => !c.noLabel;
// Main switch / RCD / SPD etc. that sit in the board alongside the circuit breakers. pos = index of the circuit it sits before (0 = start).
const LAB_FONTS = {
  standard:["Standard", "Arial, Helvetica, Roboto, sans-serif"],
  narrow:["Narrow", "'Arial Narrow', 'Roboto Condensed', 'Helvetica Neue Condensed', 'AvenirNextCondensed-DemiBold', sans-serif-condensed, sans-serif"],
  heavy:["Heavy", "'Arial Black', 'Helvetica Neue', sans-serif-black, Arial, sans-serif"],
  mono:["Typewriter", "'Courier New', Courier, monospace"],
  serif:["Serif", "'Times New Roman', Times, Georgia, serif"] };
const LAB_SIZES = { S: 0.7, M: 0.85, L: 1, XL: 1.2 };
const EXTRA_KINDS = { ms:["MAIN SWITCH",2], rcd:["RCD",2], spd:["SPD",1], other:["",1] };
function defaultExtras(job, b, bi){
  const out = [], sup = job.supply || {};
  const msA = bi === 0 && num(sup.msRating) ? sup.msRating + "A" : "";
  out.push({ id: uid(), kind:"ms", text:"MAIN SWITCH", sub: msA, pos: 0, mods: 2 });
  // an RCD in front of each run of RCD-protected MCBs (RCBOs carry their own)
  let prev = null;
  b.circuits.forEach((c, i) => { const prot = c.rcd && !String(c.dev || "").includes("RCBO"); const key = prot ? String(c.rcd) : null;
    if (prot && key !== prev) out.push({ id: uid(), kind:"rcd", text:"RCD", sub: c.rcd + "mA", pos: i, mods: 2 });
    prev = key; });
  return out;
}
function labExtras(job, b){
  if (!Array.isArray(b.labExtras)) { b.labExtras = defaultExtras(job, b, job.boards.indexOf(b)); markDirty(job); }
  return b.labExtras;
}
function labItems(job, b, forStrip){
  const showDev = settings.labDevice !== "No", ex = labExtras(job, b), n = b.circuits.length, items = [];
  const exItem = e => ({ extra: true, no: "", big: String(e.text || EXTRA_KINDS[e.kind]?.[0] || "").trim() || "DEVICE", small: showDev ? String(e.sub || "") : "", mods: Math.max(1, Math.min(4, Math.round(num(e.mods) || 1))) });
  for (let p = 0; p <= n; p++) {
    ex.filter(e => Math.max(0, Math.min(n, Math.round(num(e.pos) ?? 0))) === p).forEach(e => items.push(exItem(e)));
    if (p < n) { const c = b.circuits[p];
      if (labOn(c)) items.push({ no: String(c.no || ""), big: labText(c), small: showDev ? labDevice(c) : "", mods: 1, cid: c.id });
      else if (forStrip) items.push({ blank: true, mods: 1 }); }
  }
  return b.labDir === "rtl" ? items.reverse() : items;
}
function labelCanvas(b, job){
  const layout = settings.labLayout || "single", head = settings.labHead === "Yes";
  const cv = document.createElement("canvas"), x = cv.getContext("2d");
  const FF = (LAB_FONTS[settings.labFont] || LAB_FONTS.standard)[1], SC = LAB_SIZES[settings.labSize] || 1, heavy = settings.labFont === "heavy";
  const BW = heavy ? "900" : settings.labBold === "No" ? "normal" : "bold", NW = heavy ? "900" : "normal";
  const fnt = (w, px) => `${w === "bold" ? (heavy ? "900" : "bold") : w} ${px}px ${FF}`;
  const fit = (t, max, size, weight) => { let f = Math.round(size); x.font = fnt(weight, f); while (x.measureText(t).width > max && f > 12) { f -= 1; x.font = fnt(weight, f); } return f; };
  if (layout === "strip") {
    const mod = Math.round((num(settings.labelModuleMm) || 18) * DPMM), items = labItems(job, b, true);
    cv.width = Math.max(mod, items.reduce((n, it) => n + it.mods * mod, 0)); cv.height = TAPE_H;
    x.fillStyle = "#fff"; x.fillRect(0, 0, cv.width, TAPE_H); x.fillStyle = "#000"; x.strokeStyle = "#000"; x.lineWidth = 2; x.textAlign = "center";
    let x0 = 0;
    items.forEach((it, i) => {
      const w = it.mods * mod, cx = x0 + w / 2; if (i) { x.beginPath(); x.moveTo(x0, 0); x.lineTo(x0, TAPE_H); x.stroke(); }
      if (!it.blank) {
        const bottom = it.small ? TAPE_H - 26 : TAPE_H - 6;
        let top = 36;
        if (it.no) { const nf = Math.round(30 * Math.min(SC, 1.1)); x.font = fnt("bold", nf); x.fillText(it.no, cx, nf); top = nf + 6; } else top = 4;
        let size = Math.round((it.extra ? 24 : 20) * SC), lines;
        for (;;) { x.font = fnt(it.extra ? "bold" : BW === "normal" ? NW : BW, size); lines = []; let line = "";
          for (const wd of it.big.split(" ")) { const t = line ? line + " " + wd : wd; if (x.measureText(t).width > w - 8 && line) { lines.push(line); line = wd; } else line = t; }
          if (line) lines.push(line);
          if ((lines.length * (size + 2) <= bottom - top && lines.every(l => x.measureText(l).width <= w - 6)) || size <= 12) break; size -= 1; }
        const blockH = lines.length * (size + 2), y0 = it.no ? top : top + Math.max(0, (bottom - top - blockH) / 2);
        lines.forEach((l, k) => { const y = y0 + (k + 1) * (size + 2) - 2; if (y <= bottom + 2) x.fillText(l, cx, y); });
        if (it.small) { const d = it.small.replace(/ · .*$/, ""); fit(d, w - 6, 17 * Math.min(SC, 1.15), "bold"); x.fillText(d, cx, TAPE_H - 8); }
      }
      x0 += w;
    });
    return cv;
  }
  // separate labels, one after another with cut marks
  const items = labItems(job, b, false);
  if (head) { const hd = { big: [b.ref, b.location].filter(Boolean).join(" · ") || "Board", small: `Tested ${ukDate(b.date || job.inspDate)}${job.reportNo ? " · " + job.reportNo : ""}` }; if (b.labDir === "rtl") items.push(hd); else items.unshift(hd); }
  const MAXW = 900, PAD = 26, GAP = 18;
  const sized = items.map(it => { const bigT = (it.no ? it.no + "  " : "") + it.big; const bf = fit(bigT, MAXW, (it.small ? 50 : 60) * SC, BW); const bw = x.measureText(bigT).width;
    let sw = 0, sf = 30; if (it.small) { sf = fit(it.small, MAXW, 30 * SC, BW); sw = x.measureText(it.small).width; }
    return { ...it, bigT, bf, sf, w: Math.ceil(Math.max(bw, sw, 120) + PAD * 2) }; });
  cv.width = Math.max(1, sized.reduce((n, it) => n + it.w + GAP, 0) - GAP); cv.height = TAPE_H;
  x.fillStyle = "#fff"; x.fillRect(0, 0, cv.width, TAPE_H); x.fillStyle = "#000"; x.strokeStyle = "#000"; x.textAlign = "center";
  let xo = 0;
  sized.forEach((it, i) => {
    const cx = xo + it.w / 2;
    // centre the text block on the tape whatever the size
    if (it.small) { const h1 = it.bf * 0.74, h2 = it.sf * 0.74, gap = Math.max(8, it.bf * 0.22), top = (TAPE_H - (h1 + gap + h2)) / 2;
      x.font = fnt(BW, it.bf); x.fillText(it.bigT, cx, top + h1); x.font = fnt(BW, it.sf); x.fillText(it.small, cx, top + h1 + gap + h2); }
    else { x.font = fnt(BW, it.bf); x.fillText(it.bigT, cx, (TAPE_H + it.bf * 0.72) / 2); }
    xo += it.w;
    if (i < sized.length - 1) { x.save(); x.setLineDash([8, 8]); x.lineWidth = 2; x.beginPath(); x.moveTo(xo + GAP / 2, 0); x.lineTo(xo + GAP / 2, TAPE_H); x.stroke(); x.restore(); xo += GAP; }
  });
  return cv;
}
function labelsCsv(job, b){
  const clean = v => String(v ?? "").replace(/²/g, "2").replace(/[–—]/g, "-").replace(/·/g, "-").replace(/[^\x20-\x7E]/g, "").trim();
  const q = v => { const t = clean(v); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const rows = [["Circuit","Label","Device","Board"]].concat(labItems(job, b, false).map(it => [it.no, it.big, it.small, b.ref]));
  return rows.map(r => r.map(q).join(",")).join("\r\n") + "\r\n";
}
async function shareFile(name, blob){
  const f = new File([blob], name, {type: blob.type});
  if (navigator.canShare && navigator.canShare({files:[f]})) { try { await navigator.share({files:[f], title: name}); return; } catch(e){ if (e && e.name === "AbortError") return; } }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}
const labName = (job, b, ext) => `Labels ${b.ref || "DB"} ${jobTitle(job)}.${ext}`.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ");
async function saveLabelPng(job, b){ const cv = labelCanvas(b, job); const blob = await new Promise(r => cv.toBlob(r, "image/png")); await shareFile(labName(job, b, "png"), blob); }
async function saveLabelCsv(job, b){ await shareFile(labName(job, b, "csv"), new Blob([labelsCsv(job, b)], {type: "text/csv"})); }
function drawLabelPreview(){
  const box = document.getElementById("labprev"); const job = curJob(); if (!box || !job) return;
  const b = curBoard(), cv = labelCanvas(b, job), n = labItems(job, b, false).length;
  cv.className = "labcv"; box.innerHTML = ""; if (n || settings.labHead === "Yes") box.appendChild(cv); else box.innerHTML = `<div class="muted small">Nothing ticked.</div>`;
  const m = document.getElementById("labmeta"); if (m) m.textContent = `${n} label${n === 1 ? "" : "s"} · about ${Math.round(cv.width / DPMM / 10)} cm of 24 mm tape`;
}
function labelsCard(job){
  if (job.example || typeOf(job) === "PAT" || isForm(job) || !job.boards.some(b => b.circuits.length)) return "";
  return `<div class="card"><h2>Circuit labels</h2><div class="muted small">Print a label for every circuit on the Brother on 24 mm tape – nothing is sent anywhere.</div><button class="btn block" data-act="openLabels">Labels</button></div>`;
}
function tabLabels(){
  const job = j(), b = curBoard(), layout = settings.labLayout || "single", extras = labExtras(job, b);
  if (!b.labDir) b.labDir = "ltr";
  const posOpts = e => b.circuits.map((c, k) => `<option value="${k}"${Math.round(num(e.pos) ?? 0) === k ? " selected" : ""}>Before circuit ${esc(c.no || k + 1)}</option>`).join("") + `<option value="${b.circuits.length}"${Math.round(num(e.pos) ?? 0) >= b.circuits.length ? " selected" : ""}>After the last circuit</option>`;
  const boardChips = job.boards.length > 1 ? `<div class="boards" role="group" aria-label="Boards">${job.boards.map((x,i) => `<button class="chip" data-act="board" data-i="${i}" aria-pressed="${i === Math.min(view.board, job.boards.length-1)}">${esc(x.ref || "DB" + (i+1))}</button>`).join("")}</div>` : "";
  const rows = b.circuits.map((c, i) => `<div class="labrow${labOn(c) ? "" : " off"}"><button type="button" class="chip small" data-act="labToggle" data-i="${i}" aria-pressed="${labOn(c)}" aria-label="Print circuit ${esc(c.no)}">${labOn(c) ? "✓" : "–"}</button><b class="cno">${esc(c.no)}</b>
    <input data-bind="board.circuits.${i}.label" value="${esc(c.label || "")}" placeholder="${esc(c.desc || "Circuit " + c.no)}" aria-label="Label for circuit ${esc(c.no)}"><span class="small muted">${esc(labDevice(c))}</span></div>`).join("");
  return `${boardChips}
  <div class="card"><h2>${esc(b.ref || "Board")} labels <span class="count" id="labmeta"></span></h2>
    ${chips("Layout","settings.labLayout",[["single","One label per circuit"],["strip","Strip under the breakers"]])}
    ${layout === "strip" ? field("Breaker width","settings.labelModuleMm",{num:true,unit:"mm",ph:"18",hint:"One section per breaker – 18 mm for most MCBs/RCBOs, 36 mm for double-width."}) : chips("Board name label first","settings.labHead",["Yes","No"])}
    ${chips("Font","settings.labFont",Object.entries(LAB_FONTS).map(([k, v]) => [k, v[0]]),{small:true})}
    <div class="grid2">${chips("Text size","settings.labSize",[["S","S"],["M","M"],["L","L"],["XL","XL"]],{small:true})}${chips("Bold","settings.labBold",["Yes","No"],{small:true})}</div>
    <div class="muted small">Text still shrinks to fit if a name is too long for its space. The picture uses these settings; with the Pro Label Tool list you choose font and size in the Brother app.</div>
    ${chips("Show breaker rating","settings.labDevice",["Yes","No"])}
    ${chips("Reads (this board)","board.labDir",[["ltr","Left → right"],["rtl","Right → left"]])}
    <div class="muted small">Right → left if the main switch is on the right of the board – the tape comes out in the order you stick it on.</div>
    <div class="labprev" id="labprev"></div>
    <div class="grid2"><button class="btn" data-act="labCsv">Save list for Pro Label Tool</button><button class="btn ghost" data-act="labPng">Save label picture</button></div>
    <button class="btn ghost sm" data-act="copyLabels">Copy label text</button>
  </div>
  <div class="card"><h2>Main switch, RCDs &amp; other devices</h2><div class="muted small">Set where each one sits – "before circuit 1" is the start of the board, or put an RCD before the first circuit it feeds.</div>
    ${extras.map((e, i) => `<div class="exrow"><input data-bind="board.labExtras.${i}.text" value="${esc(e.text || "")}" placeholder="${esc(EXTRA_KINDS[e.kind]?.[0] || "Label")}" aria-label="Device label"><input data-bind="board.labExtras.${i}.sub" value="${esc(e.sub || "")}" placeholder="e.g. 100A / 30mA" aria-label="Rating">
      <select data-bind="board.labExtras.${i}.pos" data-rerender aria-label="Position">${posOpts(e)}</select>${layout === "strip" ? `<select data-bind="board.labExtras.${i}.mods" data-rerender aria-label="Width">${[1,2,3,4].map(m => `<option value="${m}"${String(m) === String(e.mods) ? " selected" : ""}>${m} way${m > 1 ? "s" : ""} wide</option>`).join("")}</select>` : ""}
      <button type="button" class="btn ghost sm" data-act="exDel" data-i="${i}">Remove</button></div>`).join("") || `<div class="muted small">None.</div>`}
    <div class="row"><button class="btn ghost sm" data-act="exAdd" data-kind="ms">+ Main switch</button><button class="btn ghost sm" data-act="exAdd" data-kind="rcd">+ RCD</button><button class="btn ghost sm" data-act="exAdd" data-kind="spd">+ SPD</button><button class="btn ghost sm" data-act="exAdd" data-kind="other">+ Other</button></div>
    <button class="btn ghost sm" data-act="exReset">Reset to suggested</button></div>
  <div class="card"><h2>Circuits</h2><div class="muted small">Untick any you don't want. Type a shorter name to fit the tape – the certificate keeps the full description.</div>${rows || `<div class="empty">No circuits on this board.</div>`}</div>
  <div class="card"><h2>Printing on the Brother</h2><ol class="small steps">
    <li>Load <b>24 mm TZe tape</b> in the PT-E560BT and turn it on with Bluetooth on.</li>
    <li>Tap <b>Save list for Pro Label Tool</b> and save the file (Files / Downloads, or email it to yourself).</li>
    <li>In <b>Brother Pro Label Tool</b>, pick the label type (e.g. Flag / General, or Patch panel for a strip), then use its <b>import / database</b> option to open the file. Tick <b>first line is a header</b> and set the <b>Field</b> for each line – Label on line 1, Device on line 2 – or nothing prints.</li>
    <li>Check the preview and print – one label per circuit.</li>
  </ol><div class="muted small">No luck with the import? <b>Save label picture</b> gives the whole tape as one image at the printer's resolution – open it in P-touch Editor on the PC, or any Brother app that prints images.</div></div>`;
}
function printHtml(html, returnTab){
  if (IOS) {
    try { if (persistTimer) { clearTimeout(persistTimer); writeNow(); } sessionStorage.setItem("bf-return", JSON.stringify({jobId: view.jobId, tab: returnTab || view.tab, screen: view.screen, pfItem: view.pfItem || null})); } catch(e){}
    const bar = `<div id="bf-bar" style="position:sticky;top:0;z-index:9;display:flex;gap:8px;padding:10px 12px;padding-top:calc(10px + env(safe-area-inset-top,0px));background:#1B365D"><button onclick="location.reload()" style="flex:1;min-height:44px;border-radius:10px;border:1px solid #fff;background:transparent;color:#fff;font:600 16px Arial">‹ Back to app</button><button onclick="window.print()" style="flex:1;min-height:44px;border-radius:10px;border:0;background:#2E75B6;color:#fff;font:600 16px Arial">Print / PDF</button></div><style>@media print{#bf-bar{display:none!important}}</style>`;
    document.open(); document.write(html.replace(/<body>/, "<body>" + bar)); document.close(); window.scrollTo(0, 0); return;
  }
  const w = window.open("", "_blank");
  if (!w) { downloadFile("document.html", html, "text/html"); return; }
  w.document.open(); w.document.write(html.replace("</body>", "<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body>")); w.document.close();
}

/* ---------------- signatures: any <canvas class="sig" data-sig="path" data-sigdate="path"> */
function initSigs(){ document.querySelectorAll("canvas.sig[data-sig]").forEach(initSigCanvas); }
function initSigCanvas(cv){
  const job = j(); if (!job) return;
  const [root, ...rest] = cv.dataset.sig.split("."); const obj = roots()[root]; const path = rest.join(".");
  const dateBind = cv.dataset.sigdate ? cv.dataset.sigdate.split(".").slice(1).join(".") : "";
  const dpr = window.devicePixelRatio || 1, rect = cv.getBoundingClientRect();
  cv.width = Math.round(rect.width*dpr); cv.height = Math.round(rect.height*dpr);
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr); ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#000";
  const cur = getPath(obj, path);
  if (cur){ const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height); img.src = cur; }
  let drawing = false, last = null;
  const pt = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener("pointerdown", e => { clearTimeout(sigTimer); drawing = true; last = pt(e); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
  cv.addEventListener("pointermove", e => { if (!drawing) return; const p = pt(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; });
  const end = () => { if (!drawing) return; drawing = false;
    const out = document.createElement("canvas"); out.width = cv.width; out.height = cv.height; const o = out.getContext("2d");
    o.drawImage(cv, 0, 0); o.globalCompositeOperation = "source-in"; o.fillStyle = "#0F1B2D"; o.fillRect(0, 0, out.width, out.height);
    setPath(obj, path, out.toDataURL("image/png"));
    if (dateBind && !getPath(obj, dateBind)) setPath(obj, dateBind, today());
    markDirty(job);
    clearTimeout(sigTimer); sigTimer = setTimeout(() => { if (!isEditing()) rerender(); }, 1800); };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
}
function sigPad(label, bind, dateBind){
  return `<div class="field"><span>${esc(label)}</span><canvas class="sig" ${bind === "job.sig" ? 'id="sig"' : ""} data-sig="${bind}" data-sigdate="${dateBind || ""}" aria-label="Sign here with your finger"></canvas><div class="row"><span class="muted small">Sign with your finger</span><span class="spacer"></span><button class="btn ghost sm" data-act="clearSigPath" data-path="${bind}">Clear</button></div></div>`;
}

/* ---------------- customer handover signature (EIC / MW / PAT) */
function handoverCard(job){
  if (job.example || !billingOk()) return "";
  return `<div class="card"><h2>Customer handover</h2><div class="muted small">Optional – the customer signs to confirm they've received the ${typeOf(job) === "PAT" ? "register and been told about any failed items" : "certificate and been shown the installation"}.</div>
    <div class="grid2">${field("Customer name","job.handover.name")}${field("Date","job.handover.date",{type:"date"})}</div>
    ${sigPad("Customer signature","job.handover.sig","job.handover.date")}</div>`;
}

/* ---------------- C1 danger notice */
function c1Obs(job){ return (job.obs || []).filter(o => o.code === "C1"); }
function dangerCard(job){
  if (typeOf(job) !== "EICR" || !c1Obs(job).length || job.example) return "";
  const d = job.danger || {};
  return `<div class="card"><h2>C1 danger notice</h2><div class="muted small">${c1Obs(job).length} C1 item${c1Obs(job).length === 1 ? "" : "s"} recorded. Give the customer a signed notice of what you found and what you did.</div>
    <div class="row">${d.sig ? pill("pass","Customer signed") : pill("check","Not signed yet")}${d.sentAt ? pill("pass","Sent") : ""}<span class="spacer"></span><button class="btn sm" data-act="openDanger">Open notice</button></div></div>`;
}
function tabDanger(){
  const job = j(); job.danger = job.danger || {};
  const d = job.danger, items = c1Obs(job);
  return `<div class="card"><h2>Danger present – C1</h2><div class="muted small">The items below were found to be dangerous during the inspection.</div>
    ${items.map((o, i) => `<div class="code-item"><div class="row"><span class="pill fail">C1</span><span class="muted small">${esc(o.loc || "")}</span></div><div>${esc(o.text)}</div></div>`).join("")}</div>
  <div class="card"><h2>What was done</h2>
    ${chips("Action taken","job.danger.action",["Made safe – isolated / disconnected","Made safe – repaired","Customer refused permission to make safe","Other"],{small:true})}
    ${field("Details","job.danger.details",{area:true,ph:"e.g. Circuit 5 isolated at the consumer unit and labelled. Do not use until repaired."})}</div>
  <div class="card"><h2>Customer</h2>
    <div class="grid2">${field("Name","job.danger.name")}${field("Email (for their copy)","job.danger.email",{type:"email"})}</div>
    ${sigPad("Customer signature","job.danger.sig","job.danger.date")}
    ${field("Date","job.danger.date",{type:"date"})}
    <div class="muted small">By signing, the customer confirms they've been told about the danger and the action taken.</div></div>
  <div class="card"><h2>Send</h2>
    ${billingOk() ? `<button class="btn block" data-act="sendDanger" ${settings.sendUrl ? "" : "disabled"}>Email notice to customer and office</button>` : `<div class="muted small">Print it and leave the signed copy with the customer – the owner emails it after checking.</div>`}
    ${settings.sendUrl ? `<div class="muted small">${d.sentAt ? "Sent " + esc(agoText(d.sentAt)) + ". " : ""}Goes to ${esc(d.email || "the customer (add their email)")} and ${esc(settings.officeEmail)}.</div>` : `<div class="muted small">Set up sync in ⚙ to email it. You can still print it below.</div>`}
    <div id="dangermsg"></div>
    <button class="btn block ghost" data-act="printDanger">Print / save as PDF</button>
    <button class="btn ghost sm" data-act="backToReport">Back to report</button></div>`;
}
function dangerHtml(job){
  const d = job.danger || {}, co = job.company || settings;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Danger notice – ${esc(jobTitle(job))}</title>
<style>@page{size:A4;margin:14mm}body{font-family:Arial,sans-serif;color:#0F1B2D;margin:0;padding:14px;font-size:13px}.band{background:#B42318;color:#fff;padding:12px 14px}.band b{display:block;font-size:22px;letter-spacing:.05em}
table{border-collapse:collapse;width:100%;margin-top:10px}th,td{border:1px solid #999;padding:6px;text-align:left;vertical-align:top}th{background:#FDE2DF;width:28%}h2{font-size:14px;margin:16px 0 4px}.sig img{max-height:60px}</style></head><body>
<div class="band"><b>DANGER NOTICE – C1</b>Electrical installation: danger present, immediate action required</div>
<p>${LOGOS.bf ? `<img src="${LOGOS.bf}" alt="" style="height:44px;vertical-align:middle;margin-right:8px;background:#fff">` : ""}${esc(co.company || "BlueForge Engineering")} · ${esc([co.address, co.phone, co.email].filter(Boolean).join(" · "))}</p>
<table><tr><th>Installation address</th><td>${esc(job.address)}</td></tr><tr><th>Report reference</th><td>${esc(job.reportNo || "")}</td></tr><tr><th>Date of inspection</th><td>${esc(ukDate(job.inspDate))}</td></tr><tr><th>Inspector</th><td>${esc(job.inspector)}</td></tr></table>
<h2>Dangerous conditions found</h2><table>${c1Obs(job).map((o, i) => `<tr><th>C1 – ${i + 1}${o.loc ? "<br>" + esc(o.loc) : ""}</th><td>${esc(o.text)}</td></tr>`).join("")}</table>
<h2>Action taken</h2><table><tr><th>Action</th><td>${esc(d.action || "")}</td></tr><tr><th>Details</th><td>${esc(d.details || "")}</td></tr></table>
<p>These conditions present a risk of electric shock or fire. Do not use the affected parts of the installation until a competent person has put them right. If you have refused permission for them to be made safe, the responsibility for any consequences rests with you.</p>
<h2>Customer acknowledgement</h2><table><tr><th>Name</th><td>${esc(d.name || "")}</td></tr><tr><th>Signature</th><td class="sig">${d.sig ? `<img src="${d.sig}" alt="">` : ""}</td></tr><tr><th>Date</th><td>${esc(ukDate(d.date))}</td></tr></table>
${photosSectionHtml({...job, photos:{slots:{}, na:{}, other:[]}, obs: c1Obs(job), boards:[]}, true)}
</body></html>`;
}
async function sendDanger(){
  const job = j(), d = job.danger || {}, m = document.getElementById("dangermsg");
  await loadJobPhotos(job);
  try {
    if (m) m.innerHTML = `<div class="muted small">Sending…</div>`;
    const html = dangerHtml(job), base = `Danger notice ${jobTitle(job)} ${ukDate(job.inspDate).replace(/\//g,"-")}`.replace(/[\\/:*?"<>|]/g, "");
    await api("send", { to: d.email || settings.officeEmail, cc: d.email ? settings.officeEmail : "", subject: `DANGER NOTICE (C1) – ${jobTitle(job)} – ${ukDate(job.inspDate)}`,
      body: `<p>Please find attached the danger notice for ${esc(job.address)} following the electrical inspection on ${esc(ukDate(job.inspDate))}.</p><p>${esc((job.company || settings).company)}</p>`,
      reportHtml: html, reportName: base + ".html", pdfName: base + ".pdf", backup: "{}", backupName: "danger.json" });
    d.sentAt = Date.now(); job.danger = d; markDirty(job);
    if (m) m.innerHTML = `<div class="muted small">Sent.</div>`;
  } catch(e){ if (m) m.innerHTML = `<div class="errline">Couldn't send: ${esc(e.message || e)}</div>`; }
}

/* ---------------- re-inspections due */
function dueList(){
  const byAddr = new Map();
  liveJobs().filter(x => (["EICR","EIC"].includes(typeOf(x)) || isForm(x)) && x.address).forEach(x => { const k = normAddr(x.address) + (isForm(x) ? "|" + typeOf(x) : ""); const cur = byAddr.get(k); if (!cur || String(x.inspDate) > String(cur.inspDate)) byAddr.set(k, x); });
  const soon = new Date(); soon.setMonth(soon.getMonth() + 3); const lim = soon.toISOString().slice(0, 10);
  return [...byAddr.values()].map(x => ({job: x, due: jobSummary(x).nextDue})).filter(x => x.due && x.due <= lim).sort((a,b) => a.due.localeCompare(b.due));
}
function renderDue(){
  const list = dueList(), t = today();
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Re-inspections due<span class="sub">Overdue or due in the next 3 months</span></h1></header>
  <main>${list.length ? list.map(({job, due}) => { const c = job.client || {}; const over = due < t;
    const msg = encodeURIComponent(`Hello${c.name ? " " + c.name.split(" ")[0] : ""},\n\nThe electrical installation at ${jobTitle(job)} is due its next periodic inspection (EICR) by ${ukDate(due)}. Would you like us to book it in?\n\nKind regards,\n${settings.userName || settings.inspector}\n${settings.company}${settings.phone ? "\n" + settings.phone : ""}`);
    return `<div class="card"><div class="row"><b style="flex:1;min-width:0">${esc(jobTitle(job))}</b>${over ? pill("fail","Overdue " + ukDate(due)) : pill("check","Due " + ukDate(due))}</div>
      <div class="small muted">${esc(c.name || "No client name")} · last ${esc(TYPES[typeOf(job)])} ${esc(ukDate(job.inspDate))}${job.contactedAt ? " · contacted " + esc(agoText(job.contactedAt)) : ""}</div>
      <div class="row">${c.phone ? `<a class="btn ghost sm" href="tel:${esc(c.phone.replace(/\s/g, ""))}">Call</a>` : ""}${c.email ? `<a class="btn ghost sm" href="mailto:${esc(c.email)}?subject=${encodeURIComponent("Electrical inspection due – " + jobTitle(job))}&body=${msg}">Email</a>` : ""}
        <button class="btn ghost sm" data-act="contacted" data-id="${esc(job.id)}">${job.contactedAt ? "Contacted ✓" : "Mark contacted"}</button>
        <button class="btn sm" data-act="reinspect" data-id="${esc(job.id)}">Start ${esc(isForm(job) ? TYPES[typeOf(job)] : "EICR")}</button></div>
      ${!c.phone && !c.email ? `<div class="muted small">No phone or email saved for this client.</div>` : ""}</div>`; }).join("")
    : `<div class="empty">Nothing due in the next 3 months.</div>`}
    <div class="muted small">Based on the most recent EICR or EIC at each address and its recommended interval.</div></main>`;
}

/* ---------------- EV / PV details */
function evPvCard(job){
  const w = job.work;
  return `<div class="card"><h2>EV charging &amp; solar</h2>
    <div class="grid2">${chips("Includes an EV charge point","job.work.ev",["Yes","No"],{small:true})}${chips("Includes solar PV / battery","job.work.pv",["Yes","No"],{small:true})}</div>
    ${w.ev === "Yes" ? `<div class="grid2">${field("Charge point make / model","job.ev.model")}${field("Rating","job.ev.kw",{num:true,unit:"kW"})}</div>
      ${chips("EV earthing method","job.ev.earthing",["PME + open-PEN device (built in)","PME + separate open-PEN device","TT electrode","TN-S","Other"],{small:true})}` : ""}
    ${w.pv === "Yes" ? `<div class="grid2">${field("Inverter make / model","job.pv.inverter")}${field("Array size","job.pv.kwp",{num:true,unit:"kWp"})}</div>
      <div class="grid2">${field("Battery make / model","job.pv.battery")}${chips("DNO notification","job.pv.dno",["G98","G99","Pending"],{small:true})}</div>` : ""}
    ${w.ev === "Yes" || w.pv === "Yes" ? `<div class="muted small">Extra checklist items are added to the Inspect tab.</div>` : ""}</div>`;
}
function pvStringsCard(job){
  if (!job.work || job.work.pv !== "Yes") return "";
  job.pv = job.pv || {}; job.pv.strings = job.pv.strings || [];
  return `<div class="card"><h2>PV string tests</h2>
    ${job.pv.strings.map((st, i) => `<div class="obs"><div class="row"><b>String ${i + 1}</b><span class="spacer"></span><button class="btn ghost sm" data-act="delString" data-i="${i}">Remove</button></div>
      <div class="grid2">${field("Voc","job.pv.strings." + i + ".voc",{num:true,unit:"V"})}${field("Isc","job.pv.strings." + i + ".isc",{num:true,unit:"A"})}</div>
      <div class="grid2">${field("IR +ve to earth","job.pv.strings." + i + ".irp",{num:true,unit:"MΩ"})}${field("IR −ve to earth","job.pv.strings." + i + ".irn",{num:true,unit:"MΩ"})}</div>
      ${chips("Polarity","job.pv.strings." + i + ".pol",["✓","✗"],{small:true})}</div>`).join("")}
    <button class="btn ghost sm" data-act="addString">+ Add string</button></div>`;
}
function evPvExportHtml(job){
  const w = job.work || {}, ev = job.ev || {}, pv = job.pv || {};
  if (w.ev !== "Yes" && w.pv !== "Yes") return "";
  const r = (l, v) => `<tr><th>${esc(l)}</th><td>${esc(v || "")}</td></tr>`;
  return `<h2>EV charging and solar PV / battery</h2><table class="kv"><tbody>${w.ev === "Yes" ? r("EV charge point", [ev.model, ev.kw && ev.kw + " kW"].filter(Boolean).join(" · ")) + r("EV earthing method", ev.earthing) : ""}${w.pv === "Yes" ? r("Inverter", pv.inverter) + r("Array", pv.kwp && pv.kwp + " kWp") + r("Battery", pv.battery) + r("DNO notification", pv.dno) : ""}</tbody></table>
  ${(pv.strings || []).length ? `<table class="sched"><thead><tr><th>String</th><th>Voc (V)</th><th>Isc (A)</th><th>IR +ve (MΩ)</th><th>IR −ve (MΩ)</th><th>Polarity</th></tr></thead><tbody>${pv.strings.map((st, i) => `<tr><td>${i + 1}</td><td>${esc(st.voc)}</td><td>${esc(st.isc)}</td><td>${esc(st.irp)}</td><td>${esc(st.irn)}</td><td>${esc(st.pol)}</td></tr>`).join("")}</tbody></table>` : ""}`;
}

/* ---------------- PAT testing */
const FLEX_RES = {"0.5":39, "0.75":26, "1":19.5, "1.25":16, "1.5":13, "2.5":8};
function newPatItem(no){ return { id:uid(), no:String(no), desc:"", location:"", cls:"I", kind:"Portable", visual:"", fuse:"13", len:"", csa:"0.75", rpe:"", irv:"500", ir:"", leak:"", pol:"", interval:"12", notes:"" }; }
function calcPat(job, it){
  const checks = [];
  const rpe = num(it.rpe), ir = num(it.ir), leak = num(it.leak), len = num(it.len);
  const rpeLim = r2(0.1 + (len !== null && FLEX_RES[it.csa] ? len * FLEX_RES[it.csa] / 1000 : 0));
  const irMin = it.cls === "II" ? 2 : it.cls === "III" ? 0.25 : 1;
  const leakLim = it.cls === "II" ? 0.25 : ["Stationary","IT equipment"].includes(it.kind) ? 3.5 : 0.75;
  if (it.visual === "✗") checks.push({l:"Visual", s:"fail", t:"Failed visual inspection"});
  if (it.cls === "I" && rpe !== null) checks.push({l:"Earth continuity", s: rpe <= rpeLim ? "pass" : "fail", t:`${rpe} Ω (max ${rpeLim.toFixed(2)} Ω${len === null ? " – add cord length for an exact limit" : ""})`});
  if (ir !== null) checks.push({l:"Insulation", s: ir >= irMin ? "pass" : "fail", t:`${String(it.ir).includes(">") ? it.ir : ir} MΩ (min ${irMin} MΩ)`});
  if (leak !== null) checks.push({l:"Leakage", s: leak <= leakLim ? "pass" : "fail", t:`${leak} mA (max ${leakLim} mA)`});
  if (it.pol === "✗") checks.push({l:"Polarity", s:"fail", t:"Incorrect polarity"});
  const tested = !!it.visual || rpe !== null || ir !== null || leak !== null;
  const missing = [];
  if (tested) { if (!it.visual) missing.push("visual"); if (it.cls === "I" && rpe === null) missing.push("earth continuity"); if (it.cls !== "III" && ir === null && leak === null) missing.push("insulation or leakage"); if (it.kind === "Extension lead" && !it.pol) missing.push("polarity"); }
  if (missing.length) checks.push({l:"Not recorded", s:"check", t: missing.join(", ")});
  const result = checks.some(c => c.s === "fail") ? "fail" : !tested ? "none" : checks.some(c => c.s === "check") ? "check" : "pass";
  let next = "";
  if (job.inspDate && num(it.interval)) { const d = new Date(job.inspDate + "T12:00:00"); d.setMonth(d.getMonth() + num(it.interval)); next = d.toISOString().slice(0, 10); }
  return { checks, result, rpeLim, irMin, leakLim, next };
}
function patSummary(job){
  const items = (job.pat && job.pat.items) || [];
  const r = items.map(it => calcPat(job, it).result);
  const pass = r.filter(x => x === "pass").length, fail = r.filter(x => x === "fail").length, none = r.filter(x => x === "none").length, check = r.filter(x => x === "check").length;
  return { total: items.length, pass, fail, none, check, status: !items.length || none || check ? "none" : "pass" };
}
function tabPat(){
  const job = j(); job.pat = job.pat || {items:[]};
  const s = patSummary(job);
  return `<div class="card"><h2>Items <span class="count">${s.pass} pass · ${s.fail} fail · ${s.none + s.check} to do</span></h2>
    ${job.pat.items.length ? `<div style="display:flex;flex-direction:column;gap:8px">${job.pat.items.map(it => { const r = calcPat(job, it);
      return `<button class="card-link" data-act="patItem" data-id="${esc(it.id)}"><span class="cno">${esc(it.no)}</span><div class="grow"><div class="t">${esc(it.desc || "Item " + it.no)}</div><div class="d">Class ${esc(it.cls)} · ${esc(it.kind)}${it.location ? " · " + esc(it.location) : ""}</div></div>${resultPill(r.result)}</button>`; }).join("")}</div>` : `<div class="empty">No items yet.</div>`}
    ${job.example ? "" : `<button class="btn block" data-act="addPat">+ Add item</button>`}</div>
  <div class="card"><h2>Limits used</h2><div class="muted small">Earth continuity ≤ 0.1 Ω + cord resistance · Insulation ≥ 1 MΩ Class I, ≥ 2 MΩ Class II · Leakage ≤ 0.75 mA portable Class I, 3.5 mA stationary / IT, 0.25 mA Class II. Based on the IET Code of Practice for In-service Inspection and Testing – check against your copy.</div></div>`;
}
function renderPatItem(){
  const job = j(), items = job.pat.items, it = items.find(x => x.id === view.patItem), idx = items.indexOf(it), r = calcPat(job, it);
  const bind = k => "job.pat.items." + idx + "." + k;
  return `<header class="top"><button class="iconbtn" data-act="patBack" aria-label="Back to items">←</button><h1>Item ${esc(it.no)}<span class="sub">${esc(it.desc || "No description")}</span></h1>
    <button class="iconbtn" data-act="patNext" aria-label="Next item">${idx >= items.length - 1 ? "+" : "›"}</button></header>
  ${statusHtml()}
  <main><div class="row"><span class="muted small">Result</span>${resultPill(r.result)}</div>
    <div class="card"><h2>Item</h2><div class="grid2">${field("Item no. / asset ID", bind("no"))}${field("Location", bind("location"))}</div>
      ${field("Description", bind("desc"), {ph:"e.g. Kettle – Russell Hobbs"})}
      ${chips("Class", bind("cls"), ["I","II","III"])}
      ${chips("Type", bind("kind"), ["Portable","Handheld","Stationary","IT equipment","Extension lead"], {small:true})}
      <div class="grid2">${field("Fuse", bind("fuse"), {num:true,unit:"A"})}${chips("Retest (months)", bind("interval"), ["3","6","12","24","48"], {small:true})}</div></div>
    <div class="card"><h2>Tests</h2>
      ${chips("Visual inspection", bind("visual"), ["✓","✗"])}
      ${it.cls === "I" ? `<div class="grid2">${field("Cord length", bind("len"), {num:true,unit:"m"})}${chips("Cord csa (mm²)", bind("csa"), Object.keys(FLEX_RES), {small:true})}</div>${field("Earth continuity", bind("rpe"), {num:true,unit:"Ω",hint:"Limit " + r.rpeLim.toFixed(2) + " Ω"})}` : ""}
      ${it.cls !== "III" ? `${chips("IR test voltage (V)", bind("irv"), ["250","500"], {small:true})}${field("Insulation resistance", bind("ir"), {num:true,unit:"MΩ",hint:"Min " + r.irMin + " MΩ",extra:`<button type="button" class="chip small" data-quick="${bind("ir")}" data-val=">999">>999</button>`})}` : ""}
      ${field("Leakage / touch current (optional)", bind("leak"), {num:true,unit:"mA",hint:"Max " + r.leakLim + " mA"})}
      ${chips("Polarity (leads)", bind("pol"), ["✓","✗","N/A"], {small:true})}
      ${field("Notes", bind("notes"), {area:true})}</div>
    <div class="card"><h2>Results</h2>${r.checks.length ? `<div class="checks">${r.checks.map(x => `<div class="chk ${x.s}"><div class="l">${esc(x.l)}</div><div class="x">${esc(x.t)}</div></div>`).join("")}</div>` : `<div class="muted small">Results appear as you enter tests.</div>`}
      ${r.next ? `<div class="muted small">Next test due ${esc(ukDate(r.next))}</div>` : ""}</div>
    ${job.example ? "" : view.confirmDel === "pat" ? `<div class="row"><span class="small">Delete this item?</span><button class="btn danger sm" data-act="delPat">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<div class="row"><button class="btn ghost sm" data-act="dupPat">Copy to new item</button><span class="spacer"></span><button class="btn danger sm" data-act="askDel" data-what="pat">Delete</button></div>`}
    <div class="row"><button class="btn ghost" data-act="patBack">Done</button><span class="spacer"></span><button class="btn" data-act="patNext">${idx >= items.length - 1 ? "+ Next item" : "Next item ›"}</button></div></main>`;
}
function patWorkTab(){
  const job = j();
  return `<div class="card"><h2>PAT register</h2><div class="grid2">${field("Register number","job.reportNo")}${field("Test date","job.inspDate",{type:"date"})}</div></div>
  <div class="card"><h2>Client &amp; site</h2>${field("Client","job.client.name")}<div class="grid2">${field("Telephone","job.client.phone",{type:"tel"})}${field("Email","job.client.email",{type:"email"})}</div>${field("Site address","job.address",{area:true})}</div>
  <div class="card"><h2>Instrument</h2><div class="grid2">${field("PAT tester (make / serial)","job.patTester")}${field("Calibration due","job.patCal",{type:"date"})}</div></div>`;
}
function exportPat(job){
  const co = job.company || settings, s = patSummary(job), items = (job.pat && job.pat.items) || [];
  const rows = items.map(it => { const r = calcPat(job, it); return `<tr class="${r.result}"><td>${esc(it.no)}</td><td>${esc(it.desc)}</td><td>${esc(it.location)}</td><td>${esc(it.cls)}</td><td>${esc(it.kind)}</td><td>${esc(it.fuse)}</td><td>${esc(it.visual)}</td><td>${esc(it.rpe)}</td><td>${esc(it.ir)}</td><td>${esc(it.leak)}</td><td>${esc(it.pol)}</td><td>${{pass:"PASS",fail:"FAIL",check:"CHECK",none:""}[r.result]}</td><td>${esc(ukDate(r.next))}</td><td>${esc(it.notes)}</td></tr>`; }).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PAT register – ${esc(jobTitle(job))}</title><style>${REPORT_CSS}</style></head><body>
${band(co, true)}
<div class="sub">Portable Appliance Test Register – in-service inspection and testing of electrical equipment</div>
<table class="kv"><tbody><tr><th>Register number</th><td>${esc(job.reportNo)}</td><th>Test date</th><td>${esc(ukDate(job.inspDate))}</td></tr><tr><th>Client</th><td>${esc(job.client.name)}</td><th>Site</th><td>${esc(job.address)}</td></tr><tr><th>Instrument</th><td>${esc(job.patTester || "")}</td><th>Calibration due</th><td>${esc(ukDate(job.patCal))}</td></tr><tr><th>Items tested</th><td>${s.total}</td><th>Passed / failed</th><td>${s.pass} / ${s.fail}</td></tr></tbody></table>
<section class="wide"><h2>Register</h2><table class="sched"><thead><tr>${["No","Description","Location","Class","Type","Fuse","Visual","Earth (Ω)","IR (MΩ)","Leak (mA)","Pol","Result","Next due","Notes"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>
<p class="note">Failed items must be withdrawn from use and labelled until repaired or replaced.</p></section>
<h2>Declaration</h2><table class="kv"><tbody><tr><th>Tested by</th><td>${esc(job.inspector)}</td><th>Date</th><td>${esc(ukDate(job.sigDate))}</td></tr><tr><th>Signature</th><td class="sig" colspan="3">${job.sig ? `<img src="${job.sig}" alt="">` : ""}</td></tr>${job.handover && job.handover.name ? `<tr><th>Received by</th><td>${esc(job.handover.name)}</td><th>Signature</th><td class="sig">${job.handover.sig ? `<img src="${job.handover.sig}" alt="">` : ""}</td></tr>` : ""}</tbody></table>
${photosSectionHtml(job, false)}
<footer>${esc(co.company || "BlueForge Engineering")} – PAT register ${esc(job.reportNo || "")} – ${esc(job.address || "")}</footer></body></html>`;
}

/* ================================================================== batch 4: app lock, quotes, invoices, customer copies */

/* ---------------- money helpers */
const money = v => "£" + (Math.round((num(v) || 0) * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const DEFAULT_PRICES = [
  {desc:"Replace damaged socket-outlet or switch", price:"45"},
  {desc:"Fit blanking plates / blanks to consumer unit", price:"25"},
  {desc:"Install or upgrade main protective bonding (per service)", price:"95"},
  {desc:"Add 30 mA RCD protection – RCBO per circuit", price:"65"},
  {desc:"Replace consumer unit (up to 10 ways) with EIC", price:"650"},
  {desc:"Supplementary bonding in bathroom", price:"85"},
  {desc:"Fault finding / further investigation (per hour)", price:"60"},
  {desc:"Circuit chart and labelling", price:"30"},
  {desc:"Earthing conductor upgrade", price:"120"},
  {desc:"EICR – domestic (up to 10 circuits)", price:"150"},
  {desc:"EIC certificate", price:"60"},
  {desc:"Minor works certificate", price:"40"},
  {desc:"PAT testing (per item)", price:"2.50"}
];
function priceList(){ if (!Array.isArray(settings.prices)) settings.prices = DEFAULT_PRICES.map(p => ({...p})); return settings.prices; }
function suggestPrice(text){
  const STOP = new Set(["and","the","for","per","with","fit","from","not","any","all","into","has","are","was","this","that","remedy","investigate","replace","install","add","upgrade"]);
  const toks = t => (String(t || "").toLowerCase().match(/[a-z0-9]{3,}/g) || []).filter(w => !STOP.has(w)).map(w => w.replace(/s$/, ""));
  const words = new Set(toks(text));
  let best = null, score = 0;
  priceList().forEach(p => { const pw = new Set(toks(p.desc)); if (!pw.size) return; const hit = [...pw].filter(w => words.has(w)).length; const sc = hit + hit / pw.size; if (hit >= 2 && sc > score) { score = sc; best = p; } });
  return best;
}
function totals(lines){
  const sub = (lines || []).reduce((t, l) => t + (num(l.qty) ?? 1) * (num(l.price) || 0), 0);
  const vat = settings.vatReg === "Yes" ? sub * (num(settings.vatRate) ?? 20) / 100 : 0;
  return { sub, vat, total: sub + vat };
}
async function docNumber(code, year){
  const pre = `${settings.numPrefix || "BF"}-${code}-${year}-`;
  const all = jobs.flatMap(x => [x.reportNo, x.quote && x.quote.number, x.invoice && x.invoice.number]);
  const floor = Math.max(0, ...all.map(n => String(n || "").startsWith(pre) ? parseInt(String(n).slice(pre.length), 10) || 0 : 0));
  if (settings.sendUrl && navigator.onLine !== false) {
    try { const o = await api("nextNumber", { type: code, year, prefix: settings.numPrefix || "BF", floor }); if (o.number) return o.number; } catch(e){}
  }
  settings.counters = settings.counters || {};
  const k = code + ":" + year; settings.counters[k] = Math.max(settings.counters[k] || 0, floor) + 1; lsWrite();
  return pre + String(settings.counters[k]).padStart(3, "0");
}
function lineEditor(bindBase, lines){
  return `${lines.map((l, i) => `<div class="obs"><div class="row"><b style="font-family:var(--f-mono)">${i + 1}</b>${l.code ? `<span class="pill ${l.code === "C3" ? "none" : l.code === "FI" ? "check" : "fail"}">${esc(l.code)}</span>` : ""}<span class="spacer"></span><button class="btn ghost sm" data-act="delLine" data-base="${bindBase}" data-i="${i}">Remove</button></div>
    ${field("Description", `${bindBase}.${i}.desc`, {area:true})}
    <div class="grid2">${field("Qty", `${bindBase}.${i}.qty`, {num:true})}${field("Price each", `${bindBase}.${i}.price`, {num:true, unit:"£"})}</div>
    ${l.hint ? `<div class="muted small">${esc(l.hint)}</div>` : ""}</div>`).join("")}
    <div class="row"><button class="btn ghost sm" data-act="addLine" data-base="${bindBase}">+ Add line</button><button class="btn ghost sm" data-act="addFromPrices" data-base="${bindBase}">+ From price list</button></div>
    ${view.pricePick === bindBase ? `<div class="codes-list">${priceList().map((p, i) => `<button class="card-link" data-act="pickPrice" data-base="${bindBase}" data-i="${i}"><div class="grow"><div class="t">${esc(p.desc)}</div></div><b>${esc(money(p.price))}</b></button>`).join("")}</div>` : ""}`;
}
function totalsHtml(lines){
  const t = totals(lines);
  return `<div class="auto" style="flex-direction:column;align-items:stretch;gap:2px;padding:10px 12px" data-derived="${""}">
    <div class="row"><span>Subtotal</span><span class="spacer"></span><b>${money(t.sub)}</b></div>
    ${settings.vatReg === "Yes" ? `<div class="row"><span>VAT ${esc(settings.vatRate || "20")}%</span><span class="spacer"></span><b>${money(t.vat)}</b></div>` : ""}
    <div class="row"><span>Total</span><span class="spacer"></span><b style="font-size:18px">${money(t.total)}</b></div></div>`;
}

/* ---------------- billing is owner-only: unlocked per device with the owner passcode, checked by the Google script */
const billingOk = () => settings.billingOwner === true && settings.role !== "Tester";
async function billingHash(code){ return sha("bf-billing:" + String(code).trim()); }
function billingCard(){
  if (billingOk()) return `<div class="card"><h2>Owner access</h2><div class="row">${pill("pass","Owner access on")}<span class="spacer"></span><button class="btn ghost sm" data-act="billingOff">Turn off on this device</button></div><div class="muted small">Quotes, invoices, prices, bank details and emailing certificates to customers only work on devices unlocked with the owner passcode.</div></div>`;
  return `<div class="card"><h2>Owner access</h2><div class="muted small">Quotes, invoices, prices, bank details and emailing certificates to customers are turned off on this device. ${settings.role === "Tester" ? "Testers can't use billing." : "Enter the owner passcode to unlock them here. The first time, this sets the passcode – after that, only devices that know it can see billing."}</div>
    ${settings.role === "Tester" ? "" : `${settings.sendUrl ? "" : `<div class="warnline">Set up sync first – the passcode is checked by your Google script so it can't be bypassed on another phone.</div>`}
    <label class="field" for="ownercode"><span>Owner passcode</span><input id="ownercode" type="password" autocomplete="off" class="num"></label>
    <button class="btn sm" data-act="billingOn" ${settings.sendUrl ? "" : "disabled"}>Unlock owner access</button><div id="billmsg"></div>`}</div>`;
}

/* ---------------- form certificates: fire alarm, emergency lighting, EV charge point, solar PV (driven by bf-forms.js) */
const FORMS = window.BF_FORMS || {};
const isForm = job => !!FORMS[typeOf(job)];
const formOutcomes = F => F.outcomes || ["Satisfactory","Unsatisfactory"];
const formBad = (F, o) => !F.outcomes && o === "Unsatisfactory";
function formInit(job){ const f = job.form = job.form || {}; f.v = f.v || {}; f.chk = f.chk || {}; f.rows = f.rows || {}; f.roles = f.roles || []; return f; }
function formFieldFail(fd, val, job){
  const n = num(val); if (n === null) return "";
  if (fd.min != null && n < fd.min) return `below ${fd.min}${fd.unit ? " " + fd.unit : ""}`;
  if (fd.max != null && n > fd.max) return `above ${fd.max}${fd.unit ? " " + fd.unit : ""}`;
  if (fd.minFrom) { const ref = num(formInit(job).v[fd.minFrom]); if (ref !== null && n < ref) return `below ${ref} required`; }
  return "";
}
function formSummary(job){
  const F = FORMS[typeOf(job)], f = formInit(job); let fails = 0, rows = 0, checksDone = 0, checksTot = 0; const probs = [];
  F.sections.forEach(s => s.fields.forEach(fd => { const w = formFieldFail(fd, f.v[fd.k], job); if (w) { fails++; probs.push(`${fd.label}: ${w}`); } }));
  F.checks.forEach(c => c.items.forEach(([id, l]) => { checksTot++; const v = f.chk[c.id + "_" + id]; if (v) checksDone++; if (v === "✗") { fails++; probs.push(l); } }));
  F.tables.forEach(t => (f.rows[t.id] || []).forEach((r, i) => { rows++; t.cols.forEach(c => { const w = formFieldFail(c, r[c.k], job); if (w) { fails++; probs.push(`${t.row} ${r.ref || r.loc || i + 1} – ${c.label}: ${w}`); } }); if (r.res === "✗") { fails++; probs.push(`${t.row} ${r.ref || r.loc || i + 1} failed`); } }));
  let nextDue = f.v.next || f.v.nexta || "";
  if (!F.intervalMonths && !F.sections.some(s => s.fields.some(fd => fd.k === "next" || fd.k === "nexta"))) nextDue = "";
  else if (!nextDue && F.intervalMonths && job.inspDate) { const d = new Date(job.inspDate + "T12:00:00"); d.setMonth(d.getMonth() + F.intervalMonths); nextDue = d.toISOString().slice(0, 10); }
  return { fails, rows, checksDone, checksTot, probs, nextDue, outcome: f.outcome || "" };
}
function formFieldHtml(fd, bind, job, val){
  if (fd.t === "chips") return chips(fd.label, bind, fd.opts, { small: fd.opts.length > 4 || fd.opts.some(o => String(o).length > 14) });
  const w = fd.t === "num" ? formFieldFail(fd, val, job) : "";
  const rule = fd.min != null ? `Min ${fd.min}${fd.unit ? " " + fd.unit : ""}` : fd.max != null ? `Max ${fd.max}${fd.unit ? " " + fd.unit : ""}` : fd.minFrom ? "At least the rated duration" : "";
  return field(fd.label, bind, { num: fd.t === "num", unit: fd.unit, type: fd.t === "date" ? "date" : "", area: fd.t === "area", ph: fd.ph || "",
    hint: (w ? `<span class="rulefail">✗ ${esc(w)}</span> ` : "") + (rule && !w ? `<span class="muted">${esc(rule)}</span>` : "") + (fd.hint ? esc(fd.hint) : "") });
}
function formFrom(src){
  const nj = newJob(typeOf(src)); ["client","address","occupier"].forEach(k => nj[k] = JSON.parse(JSON.stringify(src[k] || "")));
  const f = formInit(nj), sf = formInit(src), F = FORMS[typeOf(src)];
  F.sections.forEach(s => s.fields.forEach(fd => { if (fd.t !== "date" && !/defect|notes|recs|vars/i.test(fd.k) && sf.v[fd.k] != null) f.v[fd.k] = sf.v[fd.k]; }));
  f.v._inst = sf.v._inst || f.v._inst;
  F.tables.forEach(t => { if (t.cols.some(c => c.t === "date")) return; f.rows[t.id] = (sf.rows[t.id] || []).map(r => { const n = {}; t.cols.forEach(c => { if (c.t === "text" || (c.t === "chips" && c.k !== "res")) n[c.k] = r[c.k]; }); return n; }); });
  return nj;
}
async function formAi(){
  const job = j(), f = formInit(job), m = document.getElementById("formaimsg");
  const what = [f.v.title, f.v.scope].filter(Boolean).join(" – ");
  if (!what) { if (m) m.innerHTML = `<div class="errline">Fill in the work being carried out (and ideally the scope) first.</div>`; return; }
  if (!settings.sendUrl) { if (m) m.innerHTML = `<div class="errline">Set up sync first – the AI works through your Google script.</div>`; return; }
  if (m) m.innerHTML = `<div class="muted small"><span class="pulse"></span> Drafting… (20–40 seconds)</div>`;
  const system = "You write practical RAMS (risk assessment and method statement) content for a small UK electrical contractor in Wales. Follow EAWR 1989, GS38 safe isolation, HSE guidance and BS 7671 practice. Be specific to the job, concise and realistic. Reply with JSON only.";
  const question = `Job: ${what}. Premises occupied: ${f.v.occupied || "unknown"}. Return {"steps":"numbered method statement, one step per line (8-15 steps)","hazards":[{"haz":"hazard","who":"Operatives|Occupants|Public|All","l":"1-5","s":"1-5","ctrl":"control measures","res":"Low|Medium|High"}]} with 6-12 hazards specific to this job.`;
  try {
    const o = await api("ask", { question, system, maxTokens: 3000 });
    const mm = String(o.answer || "").match(/\{[\s\S]*\}/); if (!mm) throw new Error("The AI didn't send a draft back – try again.");
    const d = JSON.parse(mm[0]); const rows = f.rows.haz = f.rows.haz || [];
    if (d.steps && !String(f.v.steps || "").trim()) f.v.steps = String(d.steps);
    let added = 0; (d.hazards || []).forEach(h => { if (h && h.haz && !rows.some(r => r.haz === h.haz)) { rows.push({ haz: String(h.haz), who: ["Operatives","Occupants","Public","All"].includes(h.who) ? h.who : "All", l: String(h.l || ""), s: String(h.s || ""), ctrl: String(h.ctrl || ""), res: ["Low","Medium","High"].includes(h.res) ? h.res : "" }); added++; } });
    markDirty(job); rerender(); toast(`Draft added – ${added} hazard${added === 1 ? "" : "s"}. Check every line before issuing.`);
  } catch(err){ const m2 = document.getElementById("formaimsg"); if (m2) m2.innerHTML = `<div class="errline">${esc(/Unknown action/i.test(err.message) ? "Your Google script needs updating – paste in the new script and redeploy." : err.message)}</div>`; }
}
function updateFormHint(el){
  const job = j(); if (!job || !isForm(job)) return;
  const F = FORMS[typeOf(job)], p = el.dataset.bind.split("."); let fd = null;
  if (p[2] === "v") F.sections.forEach(s => s.fields.forEach(x => { if (x.k === p[3]) fd = x; }));
  else if (p[2] === "rows") { const t = F.tables.find(x => x.id === p[3]); fd = t && t.cols.find(x => x.k === p[5]); }
  if (!fd || fd.t !== "num") return;
  const w = formFieldFail(fd, el.value, job), lab = el.closest("label.field"); if (!lab) return;
  let h = lab.querySelector(".hint"); if (!h) { h = document.createElement("span"); h.className = "hint"; lab.appendChild(h); }
  const rule = fd.min != null ? `Min ${fd.min}${fd.unit ? " " + fd.unit : ""}` : fd.max != null ? `Max ${fd.max}${fd.unit ? " " + fd.unit : ""}` : fd.minFrom ? "At least the rated duration" : "";
  h.innerHTML = w ? `<span class="rulefail">✗ ${esc(w)}</span>` : rule ? `<span class="muted">${esc(rule)}</span>` : "";
  if (p[2] === "rows") { const d = el.closest("details.frow"), t = F.tables.find(x => x.id === p[3]), row = (formInit(job).rows[p[3]] || [])[+p[4]]; if (d && t && row) { const sm = d.querySelector("summary"); if (sm) sm.innerHTML = formRowSummary(t, row, +p[4], job); } }
}
function formSiteTab(){
  const job = j(), F = FORMS[typeOf(job)];
  return `<div class="card"><h2>${esc(F.name)}</h2><div class="muted small">${esc(F.intro || "")}</div><div class="grid2">${field(F.noun === "document" ? "Reference" : "Certificate number","job.reportNo")}${field("Date","job.inspDate",{type:"date"})}</div></div>
  <div class="card"><h2>Client &amp; site</h2>${field("Client","job.client.name")}<div class="grid2">${field("Telephone","job.client.phone",{type:"tel"})}${field("Email","job.client.email",{type:"email"})}</div>${field("Site address","job.address",{area:true})}</div>
  ${F.noun === "document" ? "" : `<div class="card"><h2>Instruments</h2>${field("Test instruments (make / serial)","job.form.v._inst",{ph: settings.mft || ""})}</div>`}`;
}
function formDetailsTab(){
  const job = j(), F = FORMS[typeOf(job)], f = formInit(job);
  const ai = F.ai ? `<div class="card"><h2>Draft with AI</h2><div class="muted small">Fill in the work and scope below, then let the AI suggest the method statement and the hazards for this job. You check and edit everything before issuing. Needs signal.</div><button class="btn sm" data-act="formAi">Draft method &amp; hazards</button><div id="formaimsg"></div></div>` : "";
  return ai + F.sections.map(s => `<div class="card"><h2>${esc(s.title)}</h2>${s.fields.map(fd => formFieldHtml(fd, "job.form.v." + fd.k, job, f.v[fd.k])).join("")}</div>`).join("");
}
function formChecksTab(){
  const job = j(), F = FORMS[typeOf(job)], f = formInit(job);
  return F.checks.map(c => { const done = c.items.filter(([id]) => f.chk[c.id + "_" + id]).length;
    return `<div class="card"><h2>${esc(c.title)} <span class="count">${done}/${c.items.length}</span></h2>
      <button class="btn ghost sm" data-act="formAllOk" data-c="${esc(c.id)}">Mark the rest ✓</button>
      ${c.items.map(([id, l]) => `<div class="insp-item"><div class="q">${esc(l)}</div>${chips("", "job.form.chk." + c.id + "_" + id, ["✓","✗","N/A"], {small:true})}</div>`).join("")}</div>`; }).join("");
}
function formRowSummary(t, r, i, job){
  const bad = t.cols.some(c => formFieldFail(c, r[c.k], job)) || r.res === "✗";
  const risk = num(r.l) && num(r.s) ? num(r.l) * num(r.s) : null;
  if (t.presets || risk !== null) return `<b>${esc(String(i + 1))}</b> ${esc(String(r.haz || r.name || "New " + t.row.toLowerCase()).slice(0, 60))} ${risk !== null ? pill(risk >= 15 ? "fail" : risk >= 8 ? "check" : "pass", "Risk " + risk) : ""} ${r.res ? pill(r.res === "High" ? "fail" : r.res === "Medium" ? "check" : "pass", r.res) : ""}`;
  const bits = t.cols.filter(c => c.t !== "date" && r[c.k] && c.k !== "res").slice(0, 3).map(c => r[c.k]);
  return `<b>${esc(r.ref || r.name || String(i + 1))}</b> ${esc(bits.filter(x => x !== r.ref).join(" · ").slice(0, 70) || "New " + t.row.toLowerCase())} ${bad ? pill("fail","FAIL") : r.res === "✓" ? pill("pass","PASS") : ""}`;
}
function formSchedTab(){
  const job = j(), F = FORMS[typeOf(job)], f = formInit(job);
  return F.tables.map(t => { const rows = f.rows[t.id] = f.rows[t.id] || [];
    return `<div class="card"><h2>${esc(t.title)} <span class="count">${rows.length}</span></h2>
      ${rows.map((r, i) => `<details class="frow"${view.frowOpen === t.id + ":" + i ? " open" : ""} data-frow="${esc(t.id + ":" + i)}"><summary>${formRowSummary(t, r, i, job)}</summary><div>
        ${t.cols.map(c => formFieldHtml(c, `job.form.rows.${t.id}.${i}.${c.k}`, job, r[c.k])).join("")}
        <div class="row"><button class="btn ghost sm" data-act="frowDup" data-t="${esc(t.id)}" data-i="${i}">Copy to a new ${esc(t.row.toLowerCase())}</button><span class="spacer"></span><button class="btn ghost sm" data-act="frowDel" data-t="${esc(t.id)}" data-i="${i}">Remove</button></div></div></details>`).join("")}
      <div class="row"><button class="btn" data-act="frowAdd" data-t="${esc(t.id)}">+ Add ${esc(t.row.toLowerCase())}</button>${t.presets ? `<button class="btn ghost" data-act="presetOpen" data-t="${esc(t.id)}">Common ${esc(t.row.toLowerCase())}s</button>` : ""}</div>
      ${t.presets && view.presetOpen === t.id ? `<div class="presets">${t.presets.map((p, k) => { const have = rows.some(r => r.haz === p.haz); return `<button class="card-link" data-act="frowPreset" data-t="${esc(t.id)}" data-i="${k}" ${have ? "disabled" : ""}><div class="grow"><div class="t" style="white-space:normal">${esc(p.haz)}</div><div class="d">${esc(p.ctrl.slice(0, 90))}…</div></div><span class="pill ${have ? "pass" : "none"}">${have ? "Added" : "+ Add"}</span></button>`; }).join("")}</div>` : ""}</div>`; }).join("");
}
function formCertTab(){
  const job = j(), F = FORMS[typeOf(job)], f = formInit(job), s = formSummary(job);
  return `<div class="banner ${formBad(F, f.outcome) ? "fail" : f.outcome ? "pass" : "none"}"><span class="small">${esc(F.name)}</span><strong>${esc(f.outcome ? f.outcome.toUpperCase() : (F.resultLabel || "Result") + " not set")}</strong><span class="small">${s.rows} ${esc(F.tables[0] ? F.tables[0].row.toLowerCase() + (s.rows === 1 ? "" : "s") : "")} · ${s.checksDone}/${s.checksTot} checks</span></div>
    ${s.probs.length ? `<div class="card"><h2>Problems found (${s.probs.length})</h2>${s.probs.slice(0, 12).map(p => `<div class="errline small">${esc(p)}</div>`).join("")}${s.probs.length > 12 ? `<div class="small muted">…and ${s.probs.length - 12} more</div>` : ""}</div>` : ""}
    <div class="card"><h2>${F.intervalMonths ? "Result &amp; next visit" : esc(F.resultLabel || "Result")}</h2>
      <div class="field"><span>This certificate covers</span><div class="chips">${F.declare.roles.map(r => `<button type="button" class="chip small" data-act="formRole" data-r="${esc(r)}" aria-pressed="${f.roles.includes(r)}">${esc(r)}</button>`).join("")}</div></div>
      ${chips(F.resultLabel || "Overall result","job.form.outcome",formOutcomes(F))}
      ${s.fails && f.outcome === "Satisfactory" ? `<div class="warnline">${s.fails} problem${s.fails === 1 ? "" : "s"} recorded – make sure they're covered as variations or put right before marking satisfactory.</div>` : ""}
      ${F.interval ? `<div class="muted small">${esc(F.interval)}</div>` : ""}
      <div class="grid2">${F.intervalMonths ? field("Next inspection / service due","job.form.nextDue",{type:"date", hint: s.nextDue && !f.nextDue ? "Suggested " + ukDate(s.nextDue) : ""}) : ""}${field("Date of issue","job.issueDate",{type:"date"})}</div></div>
    <div class="card"><h2>Declaration</h2><div class="small">${esc(F.declare.text)}</div><div class="grid2">${field("Name","job.inspector")}${field("Position","job.position")}</div>${!billingOk() ? "" : signBlock(job)}
      <div class="grid2">${field("Date signed","job.sigDate",{type:"date"})}</div></div>
    ${!billingOk() ? signBlock(job) : ""}${handoverCard(job)}${finishCard(job)}`;
}
function exportForm(job){
  const F = FORMS[typeOf(job)], f = formInit(job), s = formSummary(job), co = job.company || settings;
  const kv = pairs => { let h = ""; for (let i = 0; i < pairs.length; i += 2) { const [a, b] = [pairs[i], pairs[i + 1]]; h += `<tr><th>${esc(a[0])}</th><td>${a[1]}</td>${b ? `<th>${esc(b[0])}</th><td>${b[1]}</td>` : `<th></th><td></td>`}</tr>`; } return `<table class="kv"><tbody>${h}</tbody></table>`; };
  const val = (fd, v) => { if (v == null || v === "") return ""; const w = formFieldFail(fd, v, job); const t = fd.t === "date" ? ukDate(v) : esc(v) + (fd.unit && fd.t === "num" ? " " + esc(fd.unit) : ""); return w ? `<b style="color:#B42318">${t} ✗</b>` : fd.t === "area" ? t.replace(/\n/g, "<br>") : t; };
  const secs = F.sections.map(sec => { const p = sec.fields.filter(fd => fd.t !== "area").map(fd => [fd.label, val(fd, f.v[fd.k])]); const areas = sec.fields.filter(fd => fd.t === "area" && f.v[fd.k]);
    return `<h2>${esc(sec.title)}</h2>${kv(p)}${areas.map(fd => `<table class="kv"><tbody><tr><th>${esc(fd.label)}</th><td>${val(fd, f.v[fd.k])}</td></tr></tbody></table>`).join("")}`; }).join("");
  const chks = F.checks.map(c => `<h2>${esc(c.title)}</h2><table class="insp"><tbody>${c.items.map(([id, l]) => `<tr><td>${esc(l)}</td><td class="c">${esc(f.chk[c.id + "_" + id] || "")}</td></tr>`).join("")}</tbody></table>`).join("");
  const tabs = F.tables.map(t => { const rows = f.rows[t.id] || []; if (!rows.length) return "";
    const risk = t.cols.some(c => c.k === "l") && t.cols.some(c => c.k === "s");
    return `<section class="wide"><h2>${esc(t.title)}</h2><table class="sched"><thead><tr><th>#</th>${t.cols.map(c => `<th>${esc(c.label)}${c.unit ? " (" + esc(c.unit) + ")" : ""}</th>`).join("")}${risk ? "<th>Risk (L×S)</th>" : ""}</tr></thead><tbody>${rows.map((r, i) => `<tr class="${t.cols.some(c => formFieldFail(c, r[c.k], job)) || r.res === "✗" ? "fail" : ""}"><td>${i + 1}</td>${t.cols.map(c => `<td>${val(c, r[c.k])}</td>`).join("")}${risk ? `<td><b>${num(r.l) && num(r.s) ? num(r.l) * num(r.s) : ""}</b></td>` : ""}</tr>`).join("")}</tbody></table>${risk ? `<p class="note">Risk = likelihood × severity (1–5 each): 1–7 low, 8–14 medium, 15–25 high – before controls. Residual risk is after the control measures.</p>` : ""}</section>`; }).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(F.long)} – ${esc(jobTitle(job))}</title><style>${REPORT_CSS}</style></head><body>
${band(co, true)}
<div class="sub">${esc(F.long)} – ${esc(F.std || "")}</div>
${kv([[F.noun === "document" ? "Reference" : "Certificate number", esc(job.reportNo)], ["Date", esc(ukDate(job.inspDate))], ["Client", esc(job.client.name || "")], ["Site", esc(job.address || "").replace(/\n/g, "<br>")], ["Contractor", esc(co.company || "")], ...(F.noun === "document" ? [] : [["Instruments", esc(f.v._inst || "")]])])}
<div class="big ${formBad(F, f.outcome) ? "fail" : f.outcome ? "pass" : ""}">${esc(f.outcome ? (F.resultLabel || "Overall") + ": " + f.outcome.toUpperCase() : (F.resultLabel || "Overall result") + " not recorded")}</div>
${secs}${chks}${tabs}
<h2>Declaration</h2><p class="note">${esc(F.declare.text)}</p>
${kv([["Covers", esc(f.roles.join(", ") || "–")], ...(F.intervalMonths ? [["Next inspection / service due", esc(ukDate(f.nextDue || s.nextDue))]] : []), ["Name", esc(job.inspector || "")], ["Position", esc(job.position || "")], ["Signature", job.sig ? `<img src="${job.sig}" alt="" style="max-height:60px">` : ""], ["Date signed", esc(ukDate(job.sigDate))]])}
${job.handover && job.handover.name ? `<h2>Received by</h2>${kv([["Name", esc(job.handover.name)], ["Date", esc(ukDate(job.handover.date))], ["Signature", job.handover.sig ? `<img src="${job.handover.sig}" alt="" style="max-height:60px">` : ""]])}` : ""}
${photosSectionHtml(job, false)}
<footer>${esc(co.company || "BlueForge Engineering")} – ${esc(F.name)} ${esc(job.reportNo || "")} – ${esc(job.address || "")}</footer></body></html>`;
}

/* ---------------- NVQ / experienced-worker portfolio (stored as one hidden, synced job) */
const NVQ = window.BF_NVQ || { frameworks: [], evidenceTypes: [], rules: [] };
function portfolioJob(create){
  const who = settings.userName || settings.inspector || "me";
  let pj = jobs.find(x => x.type === "NVQ" && !x.deleted && x.portfolio && (x.portfolio.who || who) === who);
  if (!pj && create) { pj = { id: uid(), type: "NVQ", created: Date.now(), updated: Date.now(), client: {}, boards: [], obs: [], insp: {}, photos: { slots: {}, na: {}, other: [] }, portfolio: { who, fw: (NVQ.frameworks.find(f => f.likely) || NVQ.frameworks[0] || {}).id || "", name: who === "me" ? "" : who, items: [] } }; jobs.push(pj); markDirty(pj); }
  if (pj) { pj.portfolio = pj.portfolio || { items: [] }; pj.portfolio.items = pj.portfolio.items || []; }
  return pj;
}
const nvqFw = pf => NVQ.frameworks.find(f => f.id === pf.fw) || NVQ.frameworks[0];
const fwName = fw => String(fw ? fw.name : "").replace(/\s*[-–]\s*named on .*$/i, "");
function nvqCoverage(pf){ const cov = {}; pf.items.forEach(it => Object.keys(it.units || {}).forEach(k => { if (it.units[k]) cov[k] = (cov[k] || 0) + 1; })); return cov; }
function renderNvq(){
  const pj = portfolioJob(true), pf = pj.portfolio, fw = nvqFw(pf), cov = nvqCoverage(pf);
  view.jobId = pj.id; loadJobPhotos(pj);
  if (view.pfItem) return renderNvqItem(pj);
  const perf = fw ? fw.units.filter(u => u.kind === "performance") : [];
  const outs = perf.flatMap(u => u.outcomes || []), done = outs.filter(o => (cov[o.id] || 0) >= 2).length, some = outs.filter(o => cov[o.id] === 1).length;
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>NVQ portfolio<span class="sub">${esc(fw ? fw.id.toUpperCase() : "")} · ${pf.items.length} evidence item${pf.items.length === 1 ? "" : "s"}</span></h1></header>
  <main>
    <div class="card"><h2>Your qualification</h2>
      <div class="chips">${NVQ.frameworks.map(f => `<button class="chip small" data-act="nvqFw" data-v="${esc(f.id)}" aria-pressed="${pf.fw === f.id}">${esc(f.id === "eal-ewq" ? "EAL experienced worker" : f.id === "2346" ? "C&G 2346-03" : f.id === "2357" ? "C&G 2357 NVQ" : f.id)}${f.likely ? " (likely yours)" : ""}</button>`).join("")}</div>
      <div class="small">${esc(fw ? fw.name : "")}</div>
      <details class="more"><summary>Check with Access Training</summary><div class="small">${mdLite(NVQ.note || "")}</div></details></div>
    <div class="card"><div class="tstats"><div><b>${done}</b><span>outcomes with 2+ pieces</span></div><div><b>${some}</b><span>with 1</span></div><div><b>${outs.length - done - some}</b><span>still to cover</span></div></div>
      <div class="row"><button class="btn" data-act="nvqNew">+ New evidence</button><button class="btn ghost" data-act="nvqFromJob">From a job in the app</button></div>
      ${view.nvqPick ? `<div class="presets">${liveJobs().filter(x => !x.example).sort((a, b) => String(b.inspDate).localeCompare(String(a.inspDate))).slice(0, 25).map(x => `<button class="card-link" data-act="nvqUseJob" data-id="${esc(x.id)}"><div class="grow"><div class="t">${esc(TYPES[typeOf(x)] || x.type)} · ${esc(ukDate(x.inspDate))}</div><div class="d">${esc(jobTitle(x))}${x.reportNo ? " · " + esc(x.reportNo) : ""}</div></div></button>`).join("") || `<div class="muted small">No jobs yet.</div>`}</div>` : ""}
    </div>
    ${pf.items.length ? `<div class="card"><h2>Evidence</h2>${pf.items.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map(it => { const n = Object.values(it.units || {}).filter(Boolean).length;
      return `<button class="card-link" data-act="nvqOpen" data-id="${esc(it.id)}"><div class="grow"><div class="t">${esc(it.title || "Untitled evidence")}</div><div class="d">${esc(ukDate(it.date))}${it.where ? " · " + esc(it.where) : ""} · ${(it.photos || []).length} photo${(it.photos || []).length === 1 ? "" : "s"}${it.wit && it.wit.sig ? " · witness signed" : ""}</div></div>${n ? pill("pass", n + " outcome" + (n === 1 ? "" : "s")) : pill("check","not mapped")}</button>`; }).join("")}</div>` : ""}
    ${fw ? `<div class="card"><h2>Coverage</h2><div class="muted small">Aim for at least two pieces of evidence for every outcome – most units have to be shown on more than one occasion.</div>
      ${fw.units.map(u => `<details class="more"${u.kind === "performance" ? "" : ""}><summary><b>${esc(u.no)}</b> ${esc(u.title)} ${u.kind === "performance" ? (() => { const o = u.outcomes || [], d = o.filter(x => (cov[x.id] || 0) >= 2).length; return pill(d === o.length && o.length ? "pass" : d || o.some(x => cov[x.id]) ? "check" : "fail", d + "/" + o.length); })() : pill("none", u.kind === "knowledge" ? "exam" : esc(u.kind || ""))}</summary><div>
        ${u.note ? `<div class="warnline small">${esc(u.note)}</div>` : ""}
        ${(u.outcomes || []).map(o => `<div class="nvqout"><div class="row"><span class="small" style="flex:1"><b>${esc(o.id)}</b> ${esc(o.text)}</span>${u.kind === "performance" ? pill((cov[o.id] || 0) >= 2 ? "pass" : cov[o.id] ? "check" : "fail", String(cov[o.id] || 0)) : ""}</div>
          ${(o.evidence || []).length ? `<div class="small muted">Good evidence: ${esc(o.evidence.join("; "))}</div>` : ""}</div>`).join("")}</div></details>`).join("")}</div>` : ""}
    <div class="card"><h2>Declaration &amp; export</h2><div class="small">I confirm that the evidence in this portfolio is my own work, carried out by me, and that witness statements were given by the people named.</div>
      ${field("Your name","job.portfolio.name")}${sigPad("Your signature","job.portfolio.sig","job.portfolio.sigDate")}
      <button class="btn block" data-act="nvqExport">Print / save the whole portfolio as PDF</button>
      <div class="muted small">Each evidence item can also be printed on its own – easier for uploading one by one to your e-portfolio.</div></div>
    <div class="card"><h2>Portfolio tips</h2><ul class="small">${(NVQ.rules || []).map(r => `<li>${esc(r)}</li>`).join("")}</ul>
      <details class="more"><summary>Evidence types that count</summary><div>${(NVQ.evidenceTypes || []).map(e => `<div class="small"><b>${esc(e.name)}</b> – ${esc(e.how)}</div>`).join("")}</div></details>
      <div class="small muted">Sources: ${(NVQ.sources || []).slice(0, 6).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join(" · ")}</div></div>
  </main>`;
}
function renderNvqItem(pj){
  const pf = pj.portfolio, i = pf.items.findIndex(x => x.id === view.pfItem), it = pf.items[i], fw = nvqFw(pf);
  if (!it) { view.pfItem = null; return renderNvq(); }
  const b = "job.portfolio.items." + i + ".";
  it.units = it.units || {}; it.types = it.types || {};
  return `<header class="top"><button class="iconbtn" data-act="nvqBack" aria-label="Back">←</button><h1>${esc(it.title || "New evidence")}<span class="sub">Evidence · ${esc(ukDate(it.date))}</span></h1></header>
  <main>
    <div class="card"><h2>The job</h2>${field("Title","" + b + "title",{ph:"e.g. Three-phase DB change at commercial unit"})}
      <div class="grid2">${field("Date","" + b + "date",{type:"date"})}${field("Site / location","" + b + "where",{ph:"Town, type of premises"})}</div>
      ${chips("Setting", b + "setting", ["Domestic","Commercial","Industrial"], {small:true})}
      ${it.jobRef && jobs.some(x => x.id === it.jobRef && !x.deleted) ? `<div class="row small"><span class="muted">Linked to</span><button class="btn ghost sm" data-act="open" data-id="${esc(it.jobRef)}">${esc(TYPES[typeOf(jobs.find(x => x.id === it.jobRef))] || "job")} ${esc(jobs.find(x => x.id === it.jobRef).reportNo || "")}</button><span class="muted">– its certificate prints with this evidence</span></div>` : ""}</div>
    <div class="card"><h2>What I did</h2><div class="muted small">A factual account in your own words: what the job was, what YOU did step by step, the decisions you made and why, the tests you did and results, and how you worked safely.</div>
      ${field("Factual account", b + "account", {area:true, ph:"On arrival I… I carried out safe isolation by… I then…"})}
      <button class="btn ghost sm" data-act="nvqAi">Tidy up my account (AI)</button><div id="nvqaimsg"></div></div>
    <div class="card"><h2>Photos</h2><div class="muted small">Before, during and after – show your work, your test instrument readings, labels and the finished job. No customers' faces or personal details.</div>${thumbs(it.photos || [], "pf:" + it.id)}</div>
    <div class="card"><h2>Type of evidence</h2><div class="chips">${(NVQ.evidenceTypes || []).map(e => `<button class="chip small" data-act="nvqType" data-v="${esc(e.id)}" aria-pressed="${!!it.types[e.id]}">${esc(e.name)}</button>`).join("")}</div></div>
    <div class="card"><h2>What it covers</h2><div class="muted small">Tick every outcome this job shows. Only tick what the account and photos actually prove.</div>
      ${fw ? fw.units.filter(u => u.kind === "performance").map(u => { const n = (u.outcomes || []).filter(o => it.units[o.id]).length; return `<details class="more"${n ? " open" : ""}><summary><b>${esc(u.no)}</b> ${esc(u.title)} ${n ? pill("pass", String(n)) : ""}</summary><div>
        ${(u.outcomes || []).map(o => `<label class="amitem"><input type="checkbox" data-nvqunit="${esc(o.id)}" ${it.units[o.id] ? "checked" : ""}><span><b>${esc(o.id)}</b> ${esc(o.text)}</span></label>`).join("")}</div></details>`; }).join("") : ""}</div>
    <div class="card"><h2>Witness testimony</h2><div class="muted small">From a supervisor, client or another qualified electrician who saw you do the work. They sign on your phone.</div>
      ${chips("Include a witness testimony", b + "hasWit", ["Yes","No"], {small:true})}
      ${it.hasWit === "Yes" ? `<div class="grid2">${field("Witness name", b + "wit.name")}${field("Job title / role", b + "wit.role")}</div>
        <div class="grid2">${field("Company", b + "wit.company")}${field("Relationship to you", b + "wit.rel", {ph:"e.g. site supervisor, client"})}</div>
        <div class="grid2">${field("Phone or email", b + "wit.contact")}${field("ECS / JIB card no. (if held)", b + "wit.card")}</div>
        ${field("Their statement", b + "wit.text", {area:true, ph:"I confirm that I saw Adam … on [date] at [site]. He …"})}
        <button class="btn ghost sm" data-act="nvqWitDraft">Draft the statement from my account</button><div class="muted small">The witness must read it and change anything they didn't see before signing – it has to be their statement.</div>
        ${sigPad("Witness signature", b + "wit.sig", b + "wit.date")}${field("Date", b + "wit.date", {type:"date"})}` : ""}</div>
    <div class="row"><button class="btn" data-act="nvqPrintItem">Print this evidence</button><span class="spacer"></span>${view.confirmDel === "pf" ? `<button class="btn danger sm" data-act="nvqDel">Delete it</button><button class="btn ghost sm" data-act="cancelDel">Keep</button>` : `<button class="btn ghost sm" data-act="askDel" data-what="pf">Delete</button>`}</div>
  </main>`;
}
function nvqItemHtml(pj, it, fw){
  const ref = it.jobRef ? jobs.find(x => x.id === it.jobRef && !x.deleted) : null;
  const outs = fw ? fw.units.flatMap(u => (u.outcomes || []).filter(o => (it.units || {})[o.id]).map(o => `<li><b>${esc(o.id)}</b> ${esc(o.text)}</li>`)) : [];
  const types = (NVQ.evidenceTypes || []).filter(e => (it.types || {})[e.id]).map(e => e.name);
  const w = it.hasWit === "Yes" ? (it.wit || {}) : null;
  return `<section class="pfitem"><h2>${esc(it.title || "Evidence")}</h2>
  <table class="kv"><tbody><tr><th>Date</th><td>${esc(ukDate(it.date))}</td><th>Site</th><td>${esc(it.where || "")}${it.setting ? " (" + esc(it.setting) + ")" : ""}</td></tr>
  <tr><th>Evidence type</th><td colspan="3">${esc(types.join(", ") || "–")}</td></tr>${ref ? `<tr><th>Certificate</th><td colspan="3">${esc(TYPE_LONG[typeOf(ref)] || ref.type)} ${esc(ref.reportNo || "")} – ${esc(jobTitle(ref))}</td></tr>` : ""}</tbody></table>
  <h3>Factual account</h3><p>${esc(it.account || "").replace(/\n/g, "<br>")}</p>
  ${outs.length ? `<h3>Outcomes covered</h3><ul>${outs.join("")}</ul>` : ""}
  ${(it.photos || []).length ? `<h3>Photos</h3><div class="pfphotos">${it.photos.map(id => photoCache.get(id) ? `<img src="${photoCache.get(id)}" alt="">` : "").join("")}</div>` : ""}
  ${w ? `<h3>Witness testimony</h3><table class="kv"><tbody><tr><th>Name</th><td>${esc(w.name || "")}</td><th>Role</th><td>${esc(w.role || "")}</td></tr><tr><th>Company</th><td>${esc(w.company || "")}</td><th>Relationship</th><td>${esc(w.rel || "")}</td></tr><tr><th>Contact</th><td>${esc(w.contact || "")}</td><th>Card no.</th><td>${esc(w.card || "")}</td></tr></tbody></table>
    <p>${esc(w.text || "").replace(/\n/g, "<br>")}</p><table class="kv"><tbody><tr><th>Signature</th><td>${w.sig ? `<img src="${w.sig}" alt="" style="max-height:60px">` : ""}</td><th>Date</th><td>${esc(ukDate(w.date))}</td></tr></tbody></table>` : ""}
  </section>`;
}
function nvqPackHtml(pj, items){
  const pf = pj.portfolio, fw = nvqFw(pf), cov = nvqCoverage({ items });
  const matrix = fw ? `<h2>Coverage</h2><table class="sched"><thead><tr><th>Outcome</th><th>Evidence</th></tr></thead><tbody>${fw.units.filter(u => u.kind === "performance").flatMap(u => (u.outcomes || []).map(o => `<tr class="${(cov[o.id] || 0) ? "" : "fail"}"><td><b>${esc(o.id)}</b> ${esc(o.text)}</td><td>${items.map((it, k) => (it.units || {})[o.id] ? "E" + (k + 1) : "").filter(Boolean).join(", ")}</td></tr>`)).join("")}</tbody></table>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio – ${esc(pf.name || "")}</title><style>${REPORT_CSS}
.pfitem{page-break-before:always}.pfitem h3{font-size:14px;margin:12px 0 4px;color:#1B365D}.pfitem p{font-size:12.5px;line-height:1.5}.pfphotos{display:flex;flex-wrap:wrap;gap:6px}.pfphotos img{width:48%;border:1px solid #ccc}</style></head><body>
${band(pj.company || settings, false)}
<div class="sub">Portfolio of evidence – ${esc(fwName(fw))}</div>
<table class="kv"><tbody><tr><th>Candidate</th><td>${esc(pf.name || "")}</td><th>Evidence items</th><td>${items.length}</td></tr></tbody></table>
${items.length > 1 ? matrix : ""}
${items.map((it, k) => nvqItemHtml(pj, Object.assign({}, it, { title: (items.length > 1 ? "E" + (k + 1) + " – " : "") + (it.title || "Evidence") }), fw)).join("")}
<h2>Declaration</h2><p class="note">I confirm that the evidence in this portfolio is my own work, carried out by me, and that witness statements were given by the people named.</p>
<table class="kv"><tbody><tr><th>Candidate</th><td>${esc(pf.name || "")}</td><th>Date</th><td>${esc(ukDate(pf.sigDate))}</td></tr><tr><th>Signature</th><td colspan="3">${pf.sig ? `<img src="${pf.sig}" alt="" style="max-height:60px">` : ""}</td></tr></tbody></table>
</body></html>`;
}
async function nvqAi(kind){
  const pj = portfolioJob(), it = pj.portfolio.items.find(x => x.id === view.pfItem), m = document.getElementById("nvqaimsg");
  if (!it || !String(it.account || "").trim()) { if (m) m.innerHTML = `<div class="errline">Write (or dictate) your account first – even rough notes.</div>`; return; }
  if (!settings.sendUrl) { if (m) m.innerHTML = `<div class="errline">Set up sync first – the AI works through your Google script.</div>`; return; }
  if (m) m.innerHTML = `<div class="muted small"><span class="pulse"></span> Working…</div>`;
  const system = kind === "wit"
    ? "You draft a short witness testimony for a UK electrician's NVQ portfolio, written in the first person as the witness, in plain English. Only state what the candidate's account says was done – invent nothing. Leave [square brackets] for anything the witness must fill in. Reply with the statement text only."
    : "You tidy a UK electrician's NVQ portfolio factual account. Keep it in the first person, past tense, plain English, in logical order (arrival, safe isolation, work done, decisions and why, testing and results, handover). Keep every fact the electrician gave and do NOT add any work, tests or readings they didn't mention – where something an assessor would expect is missing, add it as a [bracketed note] for them to fill in. Reply with the account text only.";
  try {
    const o = await api("ask", { question: (kind === "wit" ? `Candidate: ${pj.portfolio.name || settings.inspector}. Date: ${it.date || "[date]"}. Site: ${it.where || "[site]"}. Candidate's account:\n` : "Account to tidy:\n") + it.account, system, maxTokens: 1500 });
    const t = String(o.answer || "").replace(/\*\*/g, "").replace(/^#+\s*/gm, "").trim(); if (!t) throw new Error("Nothing came back – try again.");
    if (kind === "wit") { it.wit = it.wit || {}; it.wit.text = t; } else { it.accountOrig = it.accountOrig || it.account; it.account = t; }
    markDirty(pj); rerender(); toast(kind === "wit" ? "Statement drafted – the witness must read it and change anything that isn't right before signing" : "Account tidied – check it's all true before using it");
  } catch(err){ const m2 = document.getElementById("nvqaimsg"); if (m2) m2.innerHTML = `<div class="errline">${esc(err.message || err)}</div>`; }
}

/* ---------------- customers (built from the jobs) */
function custKey(j){ const c = j.client || {}; return (String(c.name || "").trim().toLowerCase().replace(/\s+/g, " ") || String(c.email || "").trim().toLowerCase() || String(c.phone || "").replace(/\D/g, "") || "addr:" + normAddr(j.address || "")); }
function customers(){
  const map = new Map();
  liveJobs().filter(j => !j.example && (j.client && (j.client.name || j.client.email || j.client.phone) || j.address)).forEach(j => {
    const k = custKey(j); if (k === "addr:") return;
    const c = map.get(k) || { key: k, name: "", phone: "", email: "", addrs: new Set(), jobs: [], owed: 0, last: "" };
    const cl = j.client || {}; c.name = c.name || cl.name || ""; c.phone = c.phone || cl.phone || ""; c.email = c.email || cl.email || "";
    if (j.address) c.addrs.add(j.address.split("\n")[0]);
    c.jobs.push(j); if (String(j.inspDate || "") > c.last) c.last = String(j.inspDate || "");
    if (j.invoice && j.invoice.status !== "Paid" && j.invoice.status !== "Draft") c.owed += totals(j.invoice.lines || []).total;
    map.set(k, c);
  });
  return [...map.values()].sort((a, b) => b.last.localeCompare(a.last));
}
function renderCustomers(){
  const q = String(view.custQ || "").toLowerCase(), list = customers().filter(c => !q || [c.name, c.phone, c.email, ...c.addrs].join(" ").toLowerCase().includes(q));
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Customers<span class="sub">From your jobs</span></h1></header>
  <main><label class="field"><span>Search</span><input id="custq" data-local="custQ" value="${esc(view.custQ || "")}" placeholder="Name, phone, street…"></label>
    <div id="custlist">${custListHtml(list)}</div></main>`;
}
function custListHtml(list){
  if (!list.length) return `<div class="empty">No customers yet – they appear here as you add client details to jobs.</div>`;
  return list.map(c => `<button class="card-link" data-act="cust" data-k="${esc(c.key)}"><div class="grow"><div class="t">${esc(c.name || [...c.addrs][0] || "No name")}</div><div class="d">${esc([...c.addrs].slice(0, 2).join(" · "))}</div><div class="d">${c.jobs.length} job${c.jobs.length === 1 ? "" : "s"}${c.last ? " · last " + esc(ukDate(c.last)) : ""}</div></div>${billingOk() && c.owed > 0 ? pill("check", money(c.owed) + " owed") : ""}</button>`).join("");
}
function renderCustomer(){
  const c = customers().find(x => x.key === view.custKey);
  if (!c) { view = {screen:"customers"}; return renderCustomers(); }
  const tel = c.phone.replace(/\s/g, "");
  return `<header class="top"><button class="iconbtn" data-act="customers" aria-label="Back">←</button><h1>${esc(c.name || "Customer")}<span class="sub">${c.jobs.length} job${c.jobs.length === 1 ? "" : "s"}</span></h1></header>
  <main><div class="card"><h2>Contact</h2>
      ${c.phone ? `<div>${esc(c.phone)}</div>` : ""}${c.email ? `<div>${esc(c.email)}</div>` : ""}${!c.phone && !c.email ? `<div class="muted small">No phone or email saved.</div>` : ""}
      <div class="row">${tel ? `<a class="btn ghost sm" href="tel:${esc(tel)}">Call</a><a class="btn ghost sm" href="sms:${esc(tel)}">Text</a>` : ""}${c.email ? `<a class="btn ghost sm" href="mailto:${esc(c.email)}">Email</a>` : ""}</div>
      ${billingOk() && c.owed > 0 ? `<div class="warnline">${money(c.owed)} invoiced and not yet paid.</div>` : ""}</div>
    <div class="card"><h2>Addresses</h2>${[...c.addrs].map(a => `<div class="row"><span style="flex:1">${esc(a)}</span><a class="btn ghost sm" href="https://maps.google.com/?q=${encodeURIComponent(a)}" target="_blank" rel="noopener">Map</a></div>`).join("") || `<div class="muted small">None saved.</div>`}</div>
    <div class="card"><h2>Jobs</h2>${c.jobs.sort((a, b) => String(b.inspDate).localeCompare(String(a.inspDate))).map(j => `<button class="card-link" data-act="open" data-id="${esc(j.id)}"><div class="grow"><div class="t">${esc(TYPES[typeOf(j)])} · ${esc(ukDate(j.inspDate))}</div><div class="d">${esc(j.reportNo || "")} · ${esc(jobTitle(j))}</div></div>${jobPill(j)}</button>`).join("")}</div>
    <div class="card"><h2>New job for ${esc(c.name || "this customer")}</h2><div class="muted small">Starts with their name, phone, email and address filled in.</div>
      <div class="chips">${Object.keys(TYPES).map(t => `<button class="chip" data-act="custNew" data-type="${esc(t)}">${esc(TYPES[t])}</button>`).join("")}</div></div>
  </main>`;
}

/* ---------------- training (EWA / AM2E / 2391) */
const DAY = 86400000, SR_GAPS = [0, 1, 3, 7, 14, 30];
const tr = () => { const t = settings.train = settings.train || {}; t.s = t.s || {}; t.am2e = t.am2e || {}; t.hist = t.hist || []; t.ai = t.ai || []; t.read = t.read || {}; return t; };
const lessonFor = topic => (window.BF_LESSONS || []).find(l => l.topic === topic);
function renderLesson(){
  const L = lessonFor(view.lessonTopic); if (!L) { view = {screen:"train"}; return renderTrain(); }
  const n = allQ().filter(q => q.topic === L.topic).length, st = view.steps = view.steps || {};
  return `<header class="top"><button class="iconbtn" data-act="train" aria-label="Back">←</button><h1>${esc(L.title)}<span class="sub">${esc(L.topic)} · ${L.mins} min read</span></h1></header>
  <main>
    <div class="card lesson">${mdLite(L.body)}${L.ref && L.ref !== L.topic ? `<div class="small muted">Ref: ${esc(L.ref)}</div>` : ""}</div>
    ${(L.worked || []).map((w, i) => { const shown = st[i] || 0, all = shown >= w.steps.length;
      return `<div class="card"><h2>Worked example ${i + 1}</h2><div class="qtext" style="font-size:16px">${esc(w.q)}</div>
        ${shown === 0 ? `<div class="muted small">Have a go on paper first, then reveal the working one step at a time.</div>` : ""}
        <ol class="wsteps">${w.steps.slice(0, shown).map(x => `<li>${esc(x.replace(/^\d+[.)]\s*/, ""))}</li>`).join("")}</ol>
        ${all ? `<div class="qexp ok"><b>Answer:</b> ${esc(w.answer)}</div>` : `<div class="row"><button class="btn sm" data-act="wStep" data-i="${i}">${shown ? "Next step" : "Show the first step"}</button><button class="btn ghost sm" data-act="wAll" data-i="${i}">Show all</button></div>`}</div>`; }).join("")}
    ${(L.keys || []).length ? `<div class="card"><h2>Remember</h2><ul class="small">${L.keys.map(k => `<li>${esc(k)}</li>`).join("")}</ul></div>` : ""}
    <div class="row"><button class="btn" data-act="lessonQuiz">Practise these ${n} questions</button><span class="spacer"></span>${tr().read[L.id] ? pill("pass","Read") : `<button class="btn ghost sm" data-act="lessonRead">Mark as read</button>`}</div>
    <div class="muted small" style="padding:12px 4px 20px">Original lesson written for this app and independently checked against BS 7671:2018+A2:2022 and GN3. Check anything critical against your own books.</div>
  </main>`;
}
const allQ = () => (window.BF_QB || []).concat(tr().ai);
const qById = id => allQ().find(q => q.id === id);
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [b[i], b[k]] = [b[k], b[i]]; } return b; };
function srMark(id, right){
  const s = tr().s, r = s[id] = s[id] || { b: 0, d: 0, r: 0, w: 0 };
  if (right) { r.r++; r.b = Math.min(5, (r.b || 0) + 1); } else { r.w++; r.b = 1; }
  r.d = Date.now() + (right ? SR_GAPS[r.b] * DAY : 10 * 60000); r.last = right ? 1 : 0; r.at = Date.now();
}
const dueIds = () => Object.entries(tr().s).filter(([id, r]) => r.d <= Date.now() && qById(id)).sort((a, b) => a[1].d - b[1].d).map(([id]) => id);
const weakIds = () => Object.entries(tr().s).filter(([id, r]) => r.last === 0 && qById(id)).map(([id]) => id);
function topicStats(){
  const out = {}; allQ().forEach(q => { const k = q.topic, o = out[k] = out[k] || { area: q.area || "AI questions", n: 0, seen: 0, r: 0, w: 0 }; o.n++; const s = tr().s[q.id]; if (s) { o.seen++; o.r += s.r; o.w += s.w; } }); return out;
}
function pickQuick(n){ // unseen and weak first, then the rest
  const s = tr().s, all = shuffle(allQ());
  const score = q => { const r = s[q.id]; return !r ? 0 : r.last === 0 ? 1 : r.d <= Date.now() ? 2 : 3; };
  return all.sort((a, b) => score(a) - score(b)).slice(0, n).map(q => q.id);
}
function startQuiz(mode, ids, title, limitMin){
  if (!ids.length) { toast("Nothing to practise there yet"); return; }
  view = { screen: "quiz", quiz: { mode, ids, i: 0, picks: {}, start: Date.now(), limitMin: limitMin || 0, title, done: false } }; render();
}
function renderTrain(){
  const st = topicStats(), t = tr(), seen = Object.keys(t.s).length, tot = allQ().length;
  const rr = Object.values(t.s).reduce((a, r) => [a[0] + r.r, a[1] + r.r + r.w], [0, 0]), acc = rr[1] ? Math.round(rr[0] / rr[1] * 100) : null;
  const due = dueIds().length, weak = weakIds().length;
  const am = window.BF_AM2E, amTot = am ? am.sections.reduce((n, s) => n + s.items.length, 0) : 0, amDone = Object.entries(t.am2e).filter(([k, v]) => v && !k.startsWith("am2:")).length;
  const areas = {}; Object.entries(st).forEach(([k, o]) => (areas[o.area] = areas[o.area] || []).push([k, o]));
  const bar = o => { const p = o.r + o.w ? Math.round(o.r / (o.r + o.w) * 100) : null; return `<div class="tbar"><i style="width:${p ?? 0}%;background:${p === null ? "transparent" : p >= 80 ? "var(--pass)" : p >= 60 ? "var(--check)" : "var(--fail)"}"></i></div><span class="small muted">${o.seen}/${o.n}${p === null ? "" : " · " + p + "%"}</span>`; };
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Training<span class="sub">EWA · AM2E · 2391</span></h1></header>
  <main>
    <div class="card"><div class="tstats"><div><b>${seen}</b><span>of ${tot} tried</span></div><div><b>${acc === null ? "–" : acc + "%"}</b><span>correct</span></div><div><b>${due}</b><span>due to revise</span></div></div>
      <div class="tiles">
        <button class="tile" data-act="trQuick"><b>Quick 10</b><span>New and missed questions first</span></button>
        <button class="tile" data-act="trCards" ${due ? "" : "disabled"}><b>Revise (${due})</b><span>Flashcards – missed ones come back</span></button>
        <button class="tile" data-act="trCalc"><b>Calculations</b><span>15 by hand – pen and paper</span></button>
        <button class="tile" data-act="trWeak" ${weak ? "" : "disabled"}><b>Weak spots (${weak})</b><span>Ones you last got wrong</span></button>
        <button class="tile" data-act="trMock"><b>Mock exam</b><span>40 questions · 60 min · marked at the end</span></button>
        <button class="tile" data-act="am2e"><b>AM2E / AM2</b><span>Checklists & practical lessons · ${amDone}/${amTot} ticked</span></button>
      </div></div>
    ${Object.entries(areas).map(([area, list]) => `<div class="card"><h2>${esc(area)}</h2>${list.sort((a, b) => a[0].localeCompare(b[0])).map(([k, o]) => { const L = lessonFor(k); return `<div class="trrow"><button class="card-link trtopic" data-act="${L ? "lesson" : "trTopic"}" data-t="${esc(k)}"><div class="grow"><div class="t">${esc(k)}</div>${bar(o)}${L ? `<span class="small ${t.read[L.id] ? "okc" : "muted"}">${t.read[L.id] ? "✓ Lesson read" : "📖 Lesson · " + L.mins + " min"}</span>` : ""}</div></button><button class="btn ghost sm trq" data-act="trTopic" data-t="${esc(k)}" aria-label="Practise ${esc(k)}">Quiz</button></div>`; }).join("")}</div>`).join("")}
    <div class="card"><h2>Make more questions (AI)</h2><div class="muted small">The AI writes fresh questions on any topic, with full working. They're marked "AI – not checked": treat them as extra practice, not gospel. Needs signal.</div>
      <label class="field" for="aitopic"><span>Topic</span><input id="aitopic" placeholder="e.g. voltage drop on long SWA runs, Section 701 zones"></label>
      <div class="row"><button class="btn sm" data-act="trAiGen">Make 5 questions</button>${t.ai.length ? `<span class="small muted">${t.ai.length} AI questions saved</span><button class="btn ghost sm" data-act="trAiClear">Remove them</button>` : ""}</div><div id="aigenmsg"></div></div>
    ${t.hist.length ? `<div class="card"><h2>Recent</h2>${t.hist.slice(-6).reverse().map(h => `<div class="row small"><span>${esc(h.title)}</span><span class="spacer"></span><b>${h.score}/${h.n}</b><span class="muted">${esc(agoText(h.at))}</span></div>`).join("")}</div>` : ""}
    <div class="muted small" style="padding:0 4px 20px">Questions are original, written for this app and independently checked against BS 7671:2018+A2 and GN3. Always confirm against your own books before the exam. Progress is kept on this device.</div>
  </main>`;
}
function renderQuiz(){
  const z = view.quiz, n = z.ids.length;
  if (z.done) return renderQuizEnd();
  const q = qById(z.ids[z.i]); if (!q) { z.i = Math.min(z.i + 1, n - 1); return renderQuizEnd(); }
  const pick = z.picks[q.id], mock = z.mode === "mock", show = !mock && pick !== undefined;
  const left = z.limitMin ? Math.max(0, z.limitMin * 60000 - (Date.now() - z.start)) : 0;
  const opt = (o, i) => { let cls = ""; if (show) cls = i === q.answer ? "right" : i === pick ? "wrong" : "dim"; else if (pick === i) cls = "picked";
    return `<button class="qopt ${cls}" data-act="qPick" data-i="${i}" ${show ? "disabled" : ""}><span>${"ABCD"[i]}</span>${esc(o)}</button>`; };
  return `<header class="top"><button class="iconbtn" data-act="qQuit" aria-label="Stop">✕</button><h1>${esc(z.title)}<span class="sub">Question ${z.i + 1} of ${n}${z.limitMin ? ` · <span id="qtimer">${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")}</span> left` : ""}</span></h1></header>
  <main>
    <div class="qprog"><i style="width:${Math.round((z.i + (show || (mock && pick !== undefined) ? 1 : 0)) / n * 100)}%"></i></div>
    <div class="card"><div class="row small muted"><span>${esc(q.topic)}</span><span class="spacer"></span>${q.ai ? pill("check","AI – not checked") : ""}${q.calc ? pill("none","calc") : ""}</div>
      <div class="qtext">${esc(q.q)}</div>
      ${q.calc && !show ? `<div class="muted small">Work it out on paper first – formula, numbers in, answer – then pick.</div>` : ""}
      <div class="qopts">${q.options.map(opt).join("")}</div>
      ${show ? `<div class="qexp ${pick === q.answer ? "ok" : "no"}"><b>${pick === q.answer ? "Correct." : "Not quite – the answer is " + "ABCD"[q.answer] + "."}</b>${mdLite(q.explain)}${q.ref ? `<div class="small muted">Ref: ${esc(q.ref)}</div>` : ""}${pick !== q.answer && lessonFor(q.topic) ? `<button class="btn ghost sm" data-act="qLesson" data-t="${esc(q.topic)}">Read the ${esc(q.topic)} lesson</button>` : ""}</div>` : ""}
    </div>
    <div class="row">${mock && z.i > 0 ? `<button class="btn ghost" data-act="qPrev">‹ Back</button>` : ""}<span class="spacer"></span>
      ${show || mock ? `<button class="btn" data-act="qNext">${z.i < n - 1 ? "Next ›" : mock ? "Finish & mark" : "See results"}</button>` : ""}</div>
    ${mock ? `<div class="qgrid">${z.ids.map((id, k) => `<button class="${k === z.i ? "cur" : ""} ${z.picks[id] !== undefined ? "done" : ""}" data-act="qJump" data-i="${k}">${k + 1}</button>`).join("")}</div>` : ""}
  </main>`;
}
function finishQuiz(){
  const z = view.quiz; if (z.done) return; z.done = true;
  if (z.mode === "mock") z.ids.forEach(id => { const q = qById(id); if (q && z.picks[id] !== undefined) srMark(id, z.picks[id] === q.answer); });
  const score = z.ids.filter(id => { const q = qById(id); return q && z.picks[id] === q.answer; }).length;
  tr().hist.push({ at: Date.now(), title: z.title, n: z.ids.length, score }); while (tr().hist.length > 50) tr().hist.shift();
  lsWrite();
}
function renderQuizEnd(){
  const z = view.quiz; finishQuiz();
  const qs = z.ids.map(qById).filter(Boolean), right = qs.filter(q => z.picks[q.id] === q.answer), wrong = qs.filter(q => z.picks[q.id] !== q.answer);
  const pct = qs.length ? Math.round(right.length / qs.length * 100) : 0;
  const by = {}; qs.forEach(q => { const o = by[q.topic] = by[q.topic] || [0, 0]; o[1]++; if (z.picks[q.id] === q.answer) o[0]++; });
  return `<header class="top"><button class="iconbtn" data-act="train" aria-label="Back">←</button><h1>${esc(z.title)}<span class="sub">Results</span></h1></header>
  <main>
    <div class="card qscore ${pct >= 80 ? "ok" : pct >= 60 ? "mid" : "no"}"><b>${right.length} / ${qs.length}</b><span>${pct}%${z.limitMin ? " · " + Math.round((Date.now() - z.start) / 60000) + " min" : ""}</span></div>
    <div class="card"><h2>By topic</h2>${Object.entries(by).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).map(([k, [r, n]]) => `<div class="row small"><span>${esc(k)}</span><span class="spacer"></span><b>${r}/${n}</b></div>`).join("")}</div>
    ${wrong.length ? `<div class="card"><h2>Go over these (${wrong.length})</h2><div class="muted small">They'll come back in Revise until you get them right.</div>${wrong.map(q => `<div class="qreview"><div class="qtext small">${esc(q.q)}</div>
      <div class="small">${z.picks[q.id] === undefined ? "Not answered" : `You: <s>${esc(q.options[z.picks[q.id]])}</s>`} · Answer: <b>${esc(q.options[q.answer])}</b></div><div class="small">${mdLite(q.explain)}</div></div>`).join("")}</div>` : ""}
    <div class="row"><button class="btn" data-act="train">Back to training</button>${wrong.length ? `<button class="btn ghost" data-act="trRetry">Retry the ${wrong.length} missed</button>` : ""}</div>
  </main>`;
}
function renderAm2e(){
  const which = view.which === "am2" ? "am2" : "am2e", m = which === "am2" ? window.BF_AM2 : window.BF_AM2E, t = tr(), pre = which === "am2" ? "am2:" : "";
  if (!m) return `<header class="top"><button class="iconbtn" data-act="train">←</button><h1>AM2E checklist</h1></header><main><div class="card">Not loaded.</div></main>`;
  return `<header class="top"><button class="iconbtn" data-act="train" aria-label="Back">←</button><h1>${which === "am2" ? "AM2 / AM2S checklist" : "AM2E checklist"}<span class="sub">Can I do this? Tick it off.</span></h1></header>
  <main>
    ${m.note ? `<div class="warnline small">${esc(m.note)}</div>` : ""}
    <div class="chips" style="margin:0 0 10px">${[["am2e","AM2E (experienced worker)"],["am2","AM2 / AM2S (apprentice)"]].map(([k, l]) => `<button class="chip" data-act="am2which" data-v="${k}" aria-pressed="${which === k}">${l}</button>`).join("")}</div>
    <button class="card-link" data-act="trPractical"><div class="grow"><div class="t">Practical lessons</div><div class="d">Safe isolation · installation · motors · lighting & heating · testing · fault finding · the day</div></div></button>
    ${m.sections.map(s => { const done = s.items.filter((_, i) => t.am2e[pre + s.id + ":" + i]).length; return `<div class="card"><h2>${esc(s.title)} <span class="count">${done}/${s.items.length}</span></h2>
      <div class="muted small">${s.time ? `<b>${esc(s.time)}</b> · ` : ""}${esc(s.what || "")}</div>
      ${s.items.map((it, i) => `<label class="amitem"><input type="checkbox" data-am2e="${esc(pre + s.id + ":" + i)}" ${t.am2e[pre + s.id + ":" + i] ? "checked" : ""}><span>${esc(it)}</span></label>`).join("")}
      ${s.fails && s.fails.length ? `<details class="more"><summary>Common fail points</summary><div><ul class="small">${s.fails.map(f => `<li>${esc(f)}</li>`).join("")}</ul></div></details>` : ""}</div>`; }).join("")}
    <div class="card"><h2>On the day</h2><ul class="small">${m.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="card"><h2>Sources</h2><div class="small">${m.sources.map(x => `<div><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a></div>`).join("")}</div><div class="muted small">Checked ${esc(m.updated || "")}. NET change details – confirm yours with your centre.</div></div>
  </main>`;
}
async function trAiGen(){
  const topic = ((document.getElementById("aitopic") || {}).value || "").trim(), m = document.getElementById("aigenmsg");
  if (!topic) { if (m) m.innerHTML = `<div class="errline">Type a topic first.</div>`; return; }
  if (!settings.sendUrl) { if (m) m.innerHTML = `<div class="errline">Set up sync first – the AI works through your Google script.</div>`; return; }
  if (m) m.innerHTML = `<div class="muted small"><span class="pulse"></span> Writing questions… (20–40 seconds)</div>`;
  const system = "You write exam practice questions for an experienced UK electrician preparing for the EWA entry test / AM2E / 2391, based on BS 7671:2018+A2:2022 and GN3. Only use facts you are certain of. For calculations give every value needed in the question and show numbered step-by-step manual working in the explanation. Reply with a JSON array only, no other text.";
  const question = `Write 5 multiple-choice questions on: ${topic}. Format: [{"q":"...","options":["...","...","...","..."],"answer":0,"explain":"...","ref":"Reg or table if certain, else topic","calc":false}]. Exactly 4 options, one correct, vary the answer position.`;
  try {
    const o = await api("ask", { question, system, maxTokens: 3500 });
    const txt = String(o.answer || ""), mm = txt.match(/\[[\s\S]*\]/); if (!mm) throw new Error("The AI didn't send questions back – try again.");
    const arr = JSON.parse(mm[0]).filter(q => q && typeof q.q === "string" && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    if (!arr.length) throw new Error("The AI's questions didn't come through properly – try again.");
    const made = arr.map(q => ({ id: "ai" + uid(), topic: topic.slice(0, 40), area: "AI questions", q: q.q, options: q.options.map(String), answer: q.answer, explain: String(q.explain || ""), ref: String(q.ref || ""), calc: !!q.calc, ai: true }));
    tr().ai.push(...made); while (tr().ai.length > 200) tr().ai.shift(); lsWrite();
    startQuiz("practice", made.map(q => q.id), "AI: " + topic.slice(0, 30));
  } catch(err){ const m2 = document.getElementById("aigenmsg"); if (m2) m2.innerHTML = `<div class="errline">${esc(/Unknown action/i.test(err.message) ? "Your Google script needs updating – paste in the new script and redeploy." : err.message)}</div>`; }
}
let quizTimer = null;
function tickQuiz(){ clearInterval(quizTimer); quizTimer = setInterval(() => { const z = view.quiz; if (view.screen !== "quiz" || !z || !z.limitMin || z.done) { clearInterval(quizTimer); return; }
  const left = z.limitMin * 60000 - (Date.now() - z.start); if (left <= 0) { finishQuiz(); render(); return; }
  const el = document.getElementById("qtimer"); if (el) el.textContent = `${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")}`; }, 1000); }

/* ---------------- AI regs assistant */
function mdLite(t){
  // escape first, then a few safe markdown bits: **bold**, lists, line breaks
  const lines = esc(String(t || "")).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").split(/\n/);
  let out = "", list = null;
  const close = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const l of lines) {
    const ul = l.match(/^\s*[-•*]\s+(.*)/), ol = l.match(/^\s*\d+[.)]\s+(.*)/);
    if (ul) { if (list !== "ul") { close(); out += "<ul>"; list = "ul"; } out += `<li>${ul[1]}</li>`; }
    else if (ol) { if (list !== "ol") { close(); out += "<ol>"; list = "ol"; } out += `<li>${ol[1]}</li>`; }
    else { close(); out += l.trim() ? `<p>${l.replace(/^#+\s*/, "")}</p>` : ""; }
  }
  close(); return out;
}
const askLog = () => (settings.askLog = Array.isArray(settings.askLog) ? settings.askLog : []);
let askBusy = false;
function renderAsk(){
  const log = askLog();
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Ask the regs<span class="sub">AI assistant · BS 7671:2018+A4</span></h1></header>
  <main>
    <div class="card"><div class="muted small">Ask anything – regs, test limits, coding, calcs, Part P. Answers quote regulation numbers; always check anything critical against your own copy of BS 7671 / GN3. Needs signal.</div>
      <label class="field" for="askq"><span>Your question</span><textarea id="askq" data-bind="settings.askDraft" placeholder="e.g. Does a 20 A radial to an outside socket need an RCD and what code if it hasn't?">${esc(settings.askDraft || "")}</textarea></label>
      ${SR ? `<button type="button" class="btn ghost sm dict" data-dictate="settings.askDraft">🎤 Dictate</button>` : ""}
      <div class="row"><button class="btn" data-act="askGo" ${askBusy ? "disabled" : ""}>${askBusy ? "Thinking…" : "Ask"}</button>${log.length ? `<label class="small row" style="gap:6px"><input type="checkbox" id="askfollow" ${view.askFollow ? "checked" : ""}> Follow-up to last answer</label>` : ""}</div>
      <div id="askmsg"></div></div>
    ${log.slice().reverse().map((h, i) => `<div class="card ask"><div class="q">${esc(h.q)}</div><div class="a">${mdLite(h.a)}</div><div class="row small muted"><span>${esc(agoText(h.at))}${h.by ? " · " + esc(h.by) : ""}</span><span class="spacer"></span><button class="btn ghost sm" data-act="askCopy" data-i="${log.length - 1 - i}">Copy</button><button class="btn ghost sm" data-act="askRemove" data-i="${log.length - 1 - i}">Remove</button></div></div>`).join("")}
    ${log.length ? `<button class="btn ghost sm" data-act="askClear">Clear all</button>` : `<div class="card"><h2>Try</h2>${["What's the max Zs for a B32 RCBO and how is the 80% figure worked out?","Is a missing main bonding to gas C2 or C3?","Minimum IR for a 230 V circuit and what test voltage?","Does replacing a consumer unit need notifying in Wales?"].map(q => `<button class="card-link" data-act="askTry" data-q="${esc(q)}"><div class="grow"><div class="t" style="font-weight:500">${esc(q)}</div></div></button>`).join("")}</div>`}
  </main>`;
}
async function askGo(){
  const box = document.getElementById("askq"), q = (box && box.value || "").trim(), m = document.getElementById("askmsg");
  if (!q) return;
  if (!settings.sendUrl) { if (m) m.innerHTML = `<div class="errline">Set up sync first (⚙ Settings) – questions go through your Google script.</div>`; return; }
  if (navigator.onLine === false) { if (m) m.innerHTML = `<div class="warnline">No signal – the assistant needs internet. Your question is kept here; tap Ask again when you have signal.</div>`; settings.askDraft = q; return; }
  const follow = (document.getElementById("askfollow") || {}).checked;
  settings.askDraft = q; view.askFollow = follow; askBusy = true; rerender();
  try {
    const o = await api("ask", { question: q, history: follow ? askLog().slice(-3) : [] });
    askLog().push({ q, a: String(o.answer || "").trim(), at: Date.now(), by: settings.userName || "" });
    while (askLog().length > 40) askLog().shift();
    settings.askDraft = ""; lsWrite();
  } catch(err){ askBusy = false; rerender(); const m2 = document.getElementById("askmsg"); if (m2) m2.innerHTML = `<div class="errline">${esc(/Unknown action/i.test(err.message) ? "Your Google script needs updating – paste in the new script and redeploy." : err.message)}</div>`; return; }
  askBusy = false; rerender();
}

/* ---------------- read a board from a photo (AI via the Google script) */
function readBoardCard(job, b){
  if (job.example || typeOf(job) === "PAT" || typeOf(job) === "MW") return "";
  const t = "read:" + b.id;
  return `<div class="card readcard"><div class="row"><b style="flex:1">Read board from photo</b>${pill("none","needs signal")}</div>
    <div class="muted small">Photo with the cover off, straight on, all devices in shot. It fills in devices, ratings, RCDs and names for you to check – nothing is saved until you confirm. The photo also goes in the board's "Cover off" slot.</div>
    <div class="row"><label class="btn sm" for="rb-cam-${esc(b.id)}" data-photo-open="${esc(t)}">📷 Take photo</label><input type="file" id="rb-cam-${esc(b.id)}" data-readboard="${esc(b.id)}" accept="image/*" capture="environment" hidden>
    <label class="btn ghost sm" for="rb-gal-${esc(b.id)}">Gallery</label><input type="file" id="rb-gal-${esc(b.id)}" data-readboard="${esc(b.id)}" accept="image/*" hidden></div>
    <div id="rbmsg-${esc(b.id)}"></div></div>`;
}
function incomerSide(devs){
  const real = devs.map((d, i) => [d, i]).filter(([d]) => d.kind !== "blank"); if (!real.length) return "left";
  const first = real[0][0], last = real[real.length - 1][0];
  const ms = devs.findIndex(d => d.kind === "ms");
  if (ms >= 0) return ms > (devs.length - 1) / 2 ? "right" : "left";
  if (last.kind === "rcd" && first.kind !== "rcd") return "right";
  return "left";
}
function reverseBoard(job, b){
  const n = b.circuits.length;
  b.circuits.reverse(); b.circuits.forEach((c, i) => c.no = String(i + 1));
  if (Array.isArray(b.labExtras)) { b.labExtras.forEach(e => e.pos = n - Math.max(0, Math.min(n, Math.round(num(e.pos) ?? 0)))); b.labExtras.reverse(); }
  b.labDir = b.labDir === "rtl" ? "ltr" : "rtl";
  markDirty(job);
}
const RB_KINDS = [["mcb","MCB"],["rcbo","RCBO"],["rcd","RCD"],["ms","Main switch"],["spd","SPD"],["fuse","Fuse"],["afdd","AFDD"],["blank","Blank / spare"],["other","Other"]];
async function readBoardFromFile(boardId, file){
  const job = j(), b = job && job.boards.find(x => x.id === boardId); if (!b) return;
  const m = () => document.getElementById("rbmsg-" + boardId);
  const say = (h) => { const e = m(); if (e) e.innerHTML = h; };
  if (!settings.sendUrl) { say(`<div class="errline">Set up sync first (⚙ Settings) – the photo is read through your Google script.</div>`); return; }
  say(`<div class="muted small">Shrinking photo…</div>`);
  let c; try { c = await compressImage(file); } catch(e){ say(`<div class="errline">${esc(e.message || e)}</div>`); return; }
  // keep it as the board's cover-off photo too
  try { const id = uid(); await photoPut({ id, jobId: job.id, data: c.data, w: c.w, h: c.h, created: Date.now(), uploaded: false }); photoCache.set(id, c.data); pendingUploads.add(id); const p = ensurePhotos(job), k = "b:" + b.id + ":off"; (p.slots[k] = p.slots[k] || []).push(id); delete p.na[k]; markDirty(job); scheduleSync(3000); } catch(e){}
  if (navigator.onLine === false) { say(`<div class="warnline">No signal – the photo is saved in "Cover off". Tap <b>Gallery</b> and pick it again once you have signal.</div>`); return; }
  say(`<div class="muted small"><span class="pulse"></span> Reading the board… (10–30 seconds)</div>`);
  try {
    const o = await api("readBoard", { image: c.data.split(",")[1], mediaType: "image/jpeg", boardRef: b.ref });
    const devs = ((o.board && o.board.devices) || []).map(d => ({
      kind: RB_KINDS.some(k => k[0] === d.kind) ? d.kind : "other", curve: ["B","C","D"].includes(String(d.curve || "").toUpperCase()) ? String(d.curve).toUpperCase() : "",
      rating: d.rating == null ? "" : String(d.rating), ma: d.ma == null ? "" : String(d.ma), rcdType: RCD_TYPES.includes(d.rcdType) ? d.rcdType : "",
      poles: d.poles || 1, label: String(d.label || "").trim(), conf: ["high","medium","low"].includes(d.confidence) ? d.confidence : "medium", use: d.kind !== "blank" }));
    if (!devs.length) { say(`<div class="errline">No devices found – try a closer, straighter photo with the cover off.</div>`); return; }
    // Circuits are numbered from the main switch (or main RCD) outwards – if that's on the right of the photo, count right to left.
    const side = incomerSide(devs);
    if (side === "right") devs.reverse();
    b.labDir = side === "right" ? "rtl" : "ltr";
    view.read = { boardId, devs, side, notes: String((o.board && o.board.notes) || ""), mode: b.circuits.some(x => x.desc || x.dev) ? "update" : "new" };
    view.tab = "readboard"; view.circ = null; render();
  } catch(e){ say(`<div class="errline">${esc(e.message || e)}</div>`); }
}
function tabReadBoard(){
  const job = j(), r = view.read, b = r && job.boards.find(x => x.id === r.boardId);
  if (!b) { view.tab = "circuits"; return tabCircuits(); }
  const kindSel = (d, i) => `<select data-rb="${i}" data-k="kind">${RB_KINDS.map(([k, l]) => `<option value="${k}"${d.kind === k ? " selected" : ""}>${l}</option>`).join("")}</select>`;
  const inp = (i, k, v, ph, w) => `<input data-rb="${i}" data-k="${k}" value="${esc(v)}" placeholder="${ph}" style="width:${w}" ${k === "rating" || k === "ma" ? 'inputmode="decimal"' : ""}>`;
  const rows = r.devs.map((d, i) => `<div class="rbrow${d.use ? "" : " off"}${d.conf === "low" ? " low" : ""}">
    <div class="row"><button type="button" class="chip small" data-act="rbUse" data-i="${i}" aria-pressed="${d.use}">${d.use ? "✓" : "–"}</button><b class="rbpos">${i + 1}</b>${kindSel(d, i)}
      ${d.conf === "low" ? pill("fail","check this") : d.conf === "medium" ? pill("check","unsure") : ""}</div>
    ${["mcb","rcbo"].includes(d.kind) ? `<div class="row">${["B","C","D"].map(cv => `<button type="button" class="chip small" data-act="rbCurve" data-i="${i}" data-v="${cv}" aria-pressed="${d.curve === cv}">${cv}</button>`).join("")}${inp(i,"rating",d.rating,"A","64px")}<span class="small">A</span></div>` : ["ms","fuse","afdd","other","rcd"].includes(d.kind) ? `<div class="row">${inp(i,"rating",d.rating,"A","64px")}<span class="small">A</span></div>` : ""}
    ${["rcd","rcbo"].includes(d.kind) ? `<div class="row">${inp(i,"ma",d.ma,"mA","64px")}<span class="small">mA</span>${RCD_TYPES.slice(0,4).map(t => `<button type="button" class="chip small" data-act="rbType" data-i="${i}" data-v="${t}" aria-pressed="${d.rcdType === t}">${t}</button>`).join("")}</div>` : ""}
    ${["mcb","rcbo","fuse","other"].includes(d.kind) ? inp(i,"label",d.label,"Circuit name","100%") : ""}
  </div>`).join("");
  const nC = r.devs.filter(d => d.use && ["mcb","rcbo","fuse","other"].includes(d.kind)).length;
  return `<div class="card"><h2>Check the board – ${esc(b.ref || "Board")}</h2>
    <div class="field"><span>Numbered from the main switch – it's on the</span><div class="chips">${[["left","Left"],["right","Right"]].map(([k, l]) => `<button type="button" class="chip" data-act="rbSide" data-v="${k}" aria-pressed="${r.side === k}">${l}</button>`).join("")}</div></div>
    <div class="muted small">Way 1 is next to the main switch. Fix anything that's wrong, untick anything that shouldn't be there. Ratings you're not sure of are marked – check them against the devices.</div>
    ${r.notes ? `<div class="warnline small">${esc(r.notes)}</div>` : ""}
    ${b.circuits.length ? `<div class="field"><span>This board already has ${b.circuits.length} circuit${b.circuits.length === 1 ? "" : "s"}</span><div class="chips">${[["update","Update them in order (keeps your readings)"],["new","Add as extra circuits"]].map(([k, l]) => `<button type="button" class="chip" data-act="rbMode" data-v="${k}" aria-pressed="${r.mode === k}">${l}</button>`).join("")}</div></div>` : ""}
  </div>
  <div class="card">${rows}</div>
  <div class="card"><div class="muted small">${nC} circuit${nC === 1 ? "" : "s"} · MCBs after an RCD are set as protected by it · main switch, RCDs and SPD go into the labels</div>
    <div class="row"><button class="btn" data-act="rbApply">Confirm and fill in</button><button class="btn ghost" data-act="rbCancel">Cancel</button></div></div>`;
}
function applyBoardRead(){
  const job = j(), r = view.read, b = r && job.boards.find(x => x.id === r.boardId); if (!b) return;
  const devName = d => d.kind === "mcb" ? `BS EN 60898 MCB Type ${d.curve || "B"}` : d.kind === "rcbo" ? `BS EN 61009 RCBO Type ${d.curve || "B"}` : d.kind === "fuse" ? "" : "";
  const extras = [], circ = [];
  let rcd = null;
  r.devs.filter(d => d.use).forEach(d => {
    if (d.kind === "ms") { extras.push({ id: uid(), kind:"ms", text:"MAIN SWITCH", sub: d.rating ? d.rating + "A" : "", pos: circ.length, mods: Math.max(1, Math.min(4, d.poles || 2)) }); rcd = null; if (job.boards.indexOf(b) === 0 && !job.supply.msRating && d.rating) job.supply.msRating = d.rating; }
    else if (d.kind === "rcd") { extras.push({ id: uid(), kind:"rcd", text:"RCD", sub: d.ma ? d.ma + "mA" : "", pos: circ.length, mods: Math.max(1, Math.min(4, d.poles || 2)) }); rcd = d; }
    else if (d.kind === "spd") extras.push({ id: uid(), kind:"spd", text:"SPD", sub:"", pos: circ.length, mods: Math.max(1, Math.min(4, d.poles || 1)) });
    else if (d.kind === "afdd") extras.push({ id: uid(), kind:"other", text:"AFDD", sub: d.rating ? d.rating + "A" : "", pos: circ.length, mods: 1 });
    else if (["mcb","rcbo","fuse","other"].includes(d.kind)) circ.push({ d, rcd: d.kind === "mcb" ? rcd : null });
  });
  const fill = (c, x) => { const d = x.d;
    if (d.label) c.desc = d.label;
    if (d.kind === "mcb" || d.kind === "rcbo") { c.dev = devName(d); c.rating = d.rating; }
    else if (d.kind === "fuse" || d.kind === "other") { c.dev = "Other (see mfr data)"; c.rating = d.rating; }
    if (d.kind === "rcbo") { c.rcd = d.ma || "30"; c.rcdType = d.rcdType || c.rcdType || ""; }
    else if (x.rcd) { c.rcd = x.rcd.ma || "30"; c.rcdType = x.rcd.rcdType || c.rcdType || ""; }
    else if (d.kind === "mcb") { c.rcd = ""; c.rcdType = ""; } };
  if (r.mode === "update" && b.circuits.length) {
    circ.forEach((x, i) => { if (b.circuits[i]) fill(b.circuits[i], x); else { const c = newCircuit(b.circuits.length + 1); fill(c, x); b.circuits.push(c); } });
  } else {
    const start = r.mode === "new" ? b.circuits.length : 0;
    circ.forEach((x, i) => { const c = newCircuit(start + i + 1); fill(c, x); b.circuits.push(c); });
    extras.forEach(e => e.pos += start);
  }
  b.labExtras = extras.length ? extras : b.labExtras;
  markDirty(job); view.read = null; view.tab = "circuits"; render();
  toast(`${circ.length} circuit${circ.length === 1 ? "" : "s"} filled in – check each one and add your test results`);
}
function aiCard(){
  if (!billingOk()) return "";
  return `<div class="card"><h2>Board photo reading (AI)</h2><div class="muted small">Reads devices and ratings from a photo of a board. Needs an Anthropic API key (console.anthropic.com → API keys). The key is stored in your Google script only – never on the phones.</div>
    ${settings.aiReady ? `<div class="row">${pill("pass","Set up")}<span class="spacer"></span><button class="btn ghost sm" data-act="aiOff">Remove key</button></div>` : ""}
    <label class="field" for="aikey"><span>${settings.aiReady ? "Replace key" : "Anthropic API key"}</span><input id="aikey" type="password" autocomplete="off" placeholder="sk-ant-…"></label>
    <button class="btn sm" data-act="aiSave">Save key to Google script</button><div id="aimsg"></div></div>`;
}

/* ---------------- linked devices (owner only) */
let devList = null, devErr = "";
async function deviceRemoved(){
  // Removed by the owner: stop syncing and wipe everything held on this device.
  clearTimeout(persistTimer); window.__bfRemoved = true;
  try { if (idb) idb.close(); idb = null; } catch(e){}
  await new Promise(r => { try { const q = indexedDB.deleteDatabase(IDB_NAME); q.onsuccess = q.onerror = q.onblocked = () => r(); setTimeout(r, 3000); } catch(e){ r(); } });
  try { localStorage.clear(); sessionStorage.clear(); } catch(e){}
  try { if (window.caches) for (const k of await caches.keys()) if (k.startsWith("bf-data")) await caches.delete(k); } catch(e){}
  jobs = []; settings = {...DEFAULT_SETTINGS};
  document.body.innerHTML = `<div style="font-family:Arial,sans-serif;padding:40px 20px;text-align:center;color:#0F1B2D"><h2>This device has been removed</h2><p>The owner has removed this device from BlueForge. Its jobs have been cleared from this device.</p><p>If that's a mistake, ask the owner to allow it back and send you a new connection code, then reload.</p><button onclick="location.reload()" style="margin-top:12px;padding:12px 20px;font-size:16px">Reload</button></div>`;
}
async function loadDevices(){
  devErr = ""; devList = null; rerender();
  try { const o = await api("devices", {}); devList = o.devices || []; } catch(e){ devErr = String(e.message || e); }
  rerender();
}
function devicesCard(){
  if (!billingOk() || !settings.sendUrl) return "";
  const rows = (devList || []).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0)).map(d => `<div class="code-item"><div class="row"><b style="flex:1;min-width:0">${esc(d.name || "Unnamed device")}${d.id === settings.deviceId ? " (this device)" : ""}</b>${d.revoked ? pill("fail","Removed") : d.owner ? pill("pass","Owner") : pill("none", d.role || "Device")}</div>
    <div class="small muted">${esc(d.platform || "")} · last synced ${esc(agoText(d.lastSeen))}</div>
    ${d.id === settings.deviceId ? "" : d.revoked ? `<button class="btn ghost sm" data-act="devAllow" data-id="${esc(d.id)}">Allow back</button>` : view.confirmDel === "dev:" + d.id ? `<div class="row"><span class="small">Remove this device? It stops syncing and its jobs are wiped from it next time it connects.</span><button class="btn danger sm" data-act="devRemove" data-id="${esc(d.id)}">Remove</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<button class="btn danger sm" data-act="askDel" data-what="dev:${esc(d.id)}">Remove</button>`}</div>`).join("");
  return `<div class="card"><h2>Linked devices</h2><div class="muted small">Every phone and PC connected to your BlueForge sync. Remove one if it's lost, sold, or someone leaves.</div>
    ${devList === null && !devErr ? `<button class="btn ghost sm" data-act="devLoad">Show linked devices</button>` : ""}
    ${devErr ? `<div class="errline">${esc(devErr)}</div>` : ""}
    ${devList ? (rows || `<div class="muted small">No devices yet.</div>`) + `<button class="btn ghost sm" data-act="devLoad">Refresh</button>` : ""}
    <details class="more"${view.confirmDel === "rotate" ? " open" : ""}><summary>Change the connection code</summary><div>
      <div class="muted small">Makes every other device's code stop working – use it if a removed device might still have the old code. You'll then need to re-connect your other devices (e.g. your PC) with the new code shown under <b>Connect another device</b>.</div>
      ${view.confirmDel === "rotate" ? `<div class="row"><button class="btn danger sm" data-act="rotateKey">Yes, change it</button><button class="btn ghost sm" data-act="cancelDel">Cancel</button></div>` : `<button class="btn danger sm" data-act="askDel" data-what="rotate">Change connection code</button>`}<div id="rotmsg"></div></div></details></div>`;
}

/* ---------------- quotes (EICR remedials) */
function quoteCard(job){
  if (typeOf(job) !== "EICR" || job.example || !billingOk()) return "";
  const q = job.quote;
  const n = job.obs.filter(o => ["C1","C2","FI"].includes(o.code)).length;
  if (!q) return n ? `<div class="card"><h2>Remedial quote</h2><div class="muted small">Turn the ${n} C1/C2/FI item${n === 1 ? "" : "s"} into a priced quote for the customer.</div><button class="btn sm" data-act="makeQuote">Create quote</button></div>` : "";
  return `<div class="card"><h2>Remedial quote <span class="count">${esc(q.number || "")}</span></h2><div class="row">${pill(q.status === "Accepted" ? "pass" : q.status === "Declined" ? "fail" : q.status === "Sent" ? "check" : "none", q.status || "Draft")}<b>${money(totals(q.lines).total)}</b><span class="spacer"></span><button class="btn sm" data-act="openQuote">Open quote</button></div></div>`;
}
async function makeQuote(job, withC3){
  const q = job.quote || { lines: [], status: "Draft", created: today(), valid: "30", notes: "" };
  const have = new Set(q.lines.map(l => l.obsId));
  job.obs.filter(o => (withC3 ? ["C1","C2","C3","FI"] : ["C1","C2","FI"]).includes(o.code) && !have.has(o.id)).forEach(o => {
    const sp = suggestPrice(o.text);
    q.lines.push({ obsId: o.id, code: o.code, desc: (o.code === "FI" ? "Investigate: " : "Remedy: ") + o.text + (o.loc ? ` (${o.loc})` : ""), qty: "1", price: sp ? sp.price : "", hint: sp ? `Price from your list: ${sp.desc}` : "No match in your price list – enter a price" });
  });
  job.quote = q; markDirty(job);
  if (!q.number) { q.number = await docNumber("Q", today().slice(0, 4)); markDirty(job); }
}
function tabQuote(){
  const job = j(); const q = job.quote;
  if (!q) return `<div class="empty">No quote yet.</div>`;
  return `<div class="card"><h2>Quote ${esc(q.number || "")}</h2>
    ${chips("Status","job.quote.status",["Draft","Sent","Accepted","Declined"],{small:true})}
    <div class="grid2">${field("Date","job.quote.created",{type:"date"})}${field("Valid for","job.quote.valid",{num:true,unit:"days"})}</div></div>
  <div class="card"><h2>Work <span class="count">${q.lines.length} line${q.lines.length === 1 ? "" : "s"}</span></h2>${lineEditor("job.quote.lines", q.lines)}
    ${job.obs.some(o => o.code === "C3") ? `<button class="btn ghost sm" data-act="addC3">+ Add the C3 items too</button>` : ""}</div>
  <div class="card"><h2>Total</h2><div id="qtot">${totalsHtml(q.lines)}</div>${field("Notes for the customer","job.quote.notes",{area:true,ph:"e.g. Price includes certification. Access to loft required."})}</div>
  <div class="card"><h2>Send</h2>
    <div class="grid2">${field("Customer name","job.client.name")}${field("Customer email","job.client.email",{type:"email"})}</div>
    <button class="btn block" data-act="sendQuote" ${settings.sendUrl ? "" : "disabled"}>Email quote to customer</button>
    <div class="muted small">${settings.sendUrl ? `The office (${esc(settings.officeEmail)}) gets a copy.` : "Set up sync in ⚙ to email quotes – you can print it meanwhile."}${q.sentAt ? " Sent " + esc(agoText(q.sentAt)) + "." : ""}</div><div id="quotemsg"></div>
    <button class="btn block ghost" data-act="printQuote">Print / save as PDF</button></div>
  ${q.status === "Accepted" ? `<div class="card"><h2>Do the work</h2>${q.workJob && jobs.some(x => x.id === q.workJob && !x.deleted) ? `<button class="btn block" data-act="open" data-id="${esc(q.workJob)}">Open the remedial job</button>` : `<div class="muted small">Start the certificate for the remedial work – the quote lines become the work description.</div><div class="row"><button class="btn sm" data-act="quoteToJob" data-type="MW">Start Minor Works</button><button class="btn sm" data-act="quoteToJob" data-type="EIC">Start EIC</button></div>`}</div>` : ""}
  <button class="btn ghost sm" data-act="backToReport">Back to report</button>`;
}
function docHtml(job, kind){
  const co = job.company || settings, d = kind === "quote" ? job.quote : job.invoice, t = totals(d.lines), c = job.client || {};
  const rows = d.lines.map((l, i) => `<tr><td>${i + 1}</td><td>${esc(l.desc)}</td><td style="text-align:right">${esc(l.qty || "1")}</td><td style="text-align:right">${money(l.price)}</td><td style="text-align:right">${money((num(l.qty) ?? 1) * (num(l.price) || 0))}</td></tr>`).join("");
  const due = kind === "invoice" && d.date ? (() => { const x = new Date(d.date + "T12:00:00"); x.setDate(x.getDate() + (num(settings.payTerms) ?? 14)); return x.toISOString().slice(0, 10); })() : "";
  const title = kind === "quote" ? "QUOTATION" : "INVOICE";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} ${esc(d.number || "")}</title>
<style>${REPORT_CSS}
.doc td,.doc th{border:1px solid #A6A6A6;padding:6px 8px}.doc th{background:#1B365D;color:#fff;text-align:left}.tot td{border:0;padding:3px 8px;text-align:right}.tot .big{font-size:15px;font-weight:bold;padding:4px 8px;text-align:right}.paid{color:#17663F;font-weight:bold;font-size:18px}</style></head><body>
${band(co, false)}
<div class="sub">${title}</div>
<table class="kv"><tbody><tr><th>${kind === "quote" ? "Quote" : "Invoice"} number</th><td>${esc(d.number || "")}</td><th>Date</th><td>${esc(ukDate(kind === "quote" ? d.created : d.date))}</td></tr>
<tr><th>Customer</th><td>${esc(c.name || "")}<br>${esc(c.address || "")}</td><th>${kind === "quote" ? "Valid until" : "Payment due"}</th><td>${esc(kind === "quote" ? ukDate((() => { const x = new Date((d.created || today()) + "T12:00:00"); x.setDate(x.getDate() + (num(d.valid) ?? 30)); return x.toISOString().slice(0, 10); })()) : ukDate(due))}</td></tr>
<tr><th>Installation address</th><td colspan="3">${esc(job.address || "")}</td></tr>
${kind === "quote" && job.reportNo ? `<tr><th>Based on report</th><td colspan="3">EICR ${esc(job.reportNo)} dated ${esc(ukDate(job.inspDate))}</td></tr>` : ""}
${kind === "invoice" && job.reportNo ? `<tr><th>Job reference</th><td colspan="3">${esc(TYPES[typeOf(job)])} ${esc(job.reportNo)}</td></tr>` : ""}</tbody></table>
<table class="doc" style="margin-top:10px"><thead><tr><th>#</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<table class="tot" style="margin-top:6px"><tr><td>Subtotal</td><td style="width:110px">${money(t.sub)}</td></tr>${settings.vatReg === "Yes" ? `<tr><td>VAT ${esc(settings.vatRate || "20")}%</td><td>${money(t.vat)}</td></tr>` : ""}<tr><td class="big">Total</td><td class="big">${money(t.total)}</td></tr></table>
${d.notes ? `<h2>Notes</h2><p class="guide" style="font-size:11px">${esc(d.notes)}</p>` : ""}
${kind === "quote" ? `<p class="guide" style="font-size:11px">To accept this quote, reply to this email or call ${esc(co.phone || "us")}. Work is carried out and certified to BS 7671.</p>` : ""}
${kind === "invoice" ? (d.status === "Paid" ? `<p class="paid">PAID ${esc(ukDate(d.paidDate))} – thank you</p>` : `<h2>Payment</h2><table class="kv"><tbody>${settings.bankName ? `<tr><th>Account name</th><td>${esc(settings.bankName)}</td></tr>` : ""}${settings.sortCode ? `<tr><th>Sort code</th><td>${esc(settings.sortCode)}</td></tr>` : ""}${settings.accountNo ? `<tr><th>Account number</th><td>${esc(settings.accountNo)}</td></tr>` : ""}<tr><th>Reference</th><td>${esc(d.number || "")}</td></tr><tr><th>Due</th><td>${esc(ukDate(due))} (${esc(settings.payTerms || "14")} days)</td></tr></tbody></table>`) : ""}
${settings.vatReg === "Yes" && settings.vatNo ? `<p class="guide">VAT registration number ${esc(settings.vatNo)}</p>` : ""}
<footer>${esc(co.company || "BlueForge Engineering")} – ${title.toLowerCase()} ${esc(d.number || "")}</footer></body></html>`;
}
async function emailDoc(job, kind){
  const d = kind === "quote" ? job.quote : job.invoice, c = job.client || {}, m = document.getElementById(kind + "msg");
  if (!c.email) { if (m) m.innerHTML = `<div class="warnline">Add the customer's email first.</div>`; return; }
  try {
    if (m) m.innerHTML = `<div class="muted small">Sending…</div>`;
    const name = `${kind === "quote" ? "Quote" : "Invoice"} ${d.number || ""}`.trim();
    const t = totals(d.lines);
    await api("send", { to: c.email, cc: settings.officeEmail, subject: `${name} – ${jobTitle(job)} – ${(job.company || settings).company}`,
      body: `<p>Dear ${esc(c.name || "customer")},</p><p>Please find attached our ${kind === "quote" ? "quotation for the remedial work found during the electrical inspection" : "invoice"} for ${esc(job.address || "")} – total ${money(t.total)}.</p>${kind === "quote" ? "<p>To go ahead, just reply to this email.</p>" : ""}<p>Kind regards,<br>${esc(settings.userName || settings.inspector)}<br>${esc((job.company || settings).company)}${settings.phone ? "<br>" + esc(settings.phone) : ""}</p>`,
      reportHtml: docHtml(job, kind), reportName: name + ".html", pdfName: name + ".pdf", folder: kind === "quote" ? "Quotes" : "Invoices" });
    d.sentAt = Date.now(); if (kind === "quote" && (!d.status || d.status === "Draft")) d.status = "Sent"; markDirty(job);
    if (m) m.innerHTML = `<div class="muted small">Sent to ${esc(c.email)}.</div>`;
    rerender();
  } catch(e){ if (m) m.innerHTML = `<div class="errline">Couldn't send: ${esc(e.message || e)}</div>`; }
}
function quoteToJob(job, type){
  const q = job.quote;
  const nj = newJobFrom(job, type);
  nj.prevObs = [];
  nj.work.desc = q.lines.map(l => l.desc.replace(/^(Remedy|Investigate): /, "")).join("\n");
  nj.work.nature = type === "EIC" ? "Alteration" : "";
  nj.fromQuote = { jobId: job.id, number: q.number };
  nj.invoiceLines = q.lines.map(l => ({ desc: l.desc.replace(/^(Remedy|Investigate): /, ""), qty: l.qty, price: l.price }));
  jobs.push(nj); q.workJob = nj.id; markDirty(job); markDirty(nj); assignNumber(nj);
  return nj;
}

/* ---------------- invoices (any job) */
function invoiceCard(job){
  if (job.example || !billingOk()) return "";
  const v = job.invoice;
  if (!v) return `<div class="card"><h2>Invoice</h2><div class="muted small">Raise an invoice for this job${job.fromQuote ? ` – lines come from quote ${esc(job.fromQuote.number || "")}` : ""}.</div><button class="btn sm" data-act="makeInvoice">Create invoice</button></div>`;
  return `<div class="card"><h2>Invoice <span class="count">${esc(v.number || "")}</span></h2><div class="row">${pill(v.status === "Paid" ? "pass" : "check", v.status === "Paid" ? "Paid" : "Unpaid")}<b>${money(totals(v.lines).total)}</b><span class="spacer"></span><button class="btn sm" data-act="openInvoice">Open invoice</button></div></div>`;
}
async function makeInvoice(job){
  const t = typeOf(job);
  let lines = job.invoiceLines ? job.invoiceLines.map(l => ({...l})) : null;
  if (!lines) {
    const circuits = job.boards.reduce((n, b) => n + b.circuits.length, 0), items = job.pat ? job.pat.items.length : 0;
    const desc = t === "PAT" ? `PAT testing – ${items} item${items === 1 ? "" : "s"}` : `${TYPE_LONG[t]} – ${jobTitle(job)}${t === "EICR" ? ` (${circuits} circuits)` : ""}`;
    const sp = t === "PAT" ? priceList().find(p => /pat/i.test(p.desc)) : suggestPrice(TYPE_LONG[t] + " " + TYPES[t] + " certificate");
    lines = [{ desc, qty: t === "PAT" ? String(items || 1) : "1", price: sp ? sp.price : "" }];
  }
  job.invoice = { lines, date: today(), status: "Unpaid", notes: "" };
  markDirty(job);
  job.invoice.number = await docNumber("INV", today().slice(0, 4)); markDirty(job);
}
function tabInvoice(){
  const job = j(), v = job.invoice;
  if (!v) return `<div class="empty">No invoice yet.</div>`;
  return `<div class="card"><h2>Invoice ${esc(v.number || "")}</h2>
    ${chips("Status","job.invoice.status",["Unpaid","Paid"])}
    <div class="grid2">${field("Invoice date","job.invoice.date",{type:"date"})}${v.status === "Paid" ? field("Date paid","job.invoice.paidDate",{type:"date"}) : ""}</div></div>
  <div class="card"><h2>Lines</h2>${lineEditor("job.invoice.lines", v.lines)}</div>
  <div class="card"><h2>Total</h2><div id="itot">${totalsHtml(v.lines)}</div>${field("Notes","job.invoice.notes",{area:true})}
    ${!settings.sortCode && !settings.accountNo ? `<div class="warnline">Add your bank details in ⚙ so they print on invoices.</div>` : ""}</div>
  <div class="card"><h2>Send</h2>
    <div class="grid2">${field("Customer name","job.client.name")}${field("Customer email","job.client.email",{type:"email"})}</div>
    <button class="btn block" data-act="sendInvoice" ${settings.sendUrl ? "" : "disabled"}>Email invoice to customer</button>
    <div class="muted small">${settings.sendUrl ? `The office gets a copy.` : "Set up sync in ⚙ to email invoices – you can print it meanwhile."}${v.sentAt ? " Sent " + esc(agoText(v.sentAt)) + "." : ""}</div><div id="invoicemsg"></div>
    <button class="btn block ghost" data-act="printInvoice">Print / save as PDF</button></div>
  <button class="btn ghost sm" data-act="backToFinish">Back</button>`;
}
function renderMoney(){
  const qs = liveJobs().filter(x => x.quote).sort((a,b) => String(b.quote.created).localeCompare(String(a.quote.created)));
  const inv = liveJobs().filter(x => x.invoice).sort((a,b) => String(b.invoice.date).localeCompare(String(a.invoice.date)));
  const unpaid = inv.filter(x => x.invoice.status !== "Paid"), owed = unpaid.reduce((t, x) => t + totals(x.invoice.lines).total, 0);
  const open = qs.filter(x => ["Draft","Sent"].includes(x.quote.status || "Draft")), pipe = open.reduce((t, x) => t + totals(x.quote.lines).total, 0);
  const row = (x, kind) => { const d = x[kind]; const st = kind === "quote" ? (d.status || "Draft") : (d.status || "Unpaid");
    return `<button class="card-link" data-act="openDoc" data-id="${esc(x.id)}" data-kind="${kind}"><div class="grow"><div class="t">${esc(jobTitle(x))}</div><div class="d">${esc(d.number || "")} · ${esc(ukDate(kind === "quote" ? d.created : d.date))}</div></div><div style="text-align:right"><b>${money(totals(d.lines).total)}</b><br>${pill(st === "Paid" || st === "Accepted" ? "pass" : st === "Declined" ? "fail" : st === "Draft" ? "none" : "check", st)}</div></button>`; };
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="Back">←</button><h1>Quotes &amp; invoices</h1></header>
  <main><div class="codes" style="grid-template-columns:1fr 1fr"><div><b>${money(owed)}</b><span>owed (${unpaid.length} unpaid)</span></div><div><b>${money(pipe)}</b><span>in open quotes (${open.length})</span></div></div>
    <div class="card"><h2>Invoices <span class="count">${inv.length}</span></h2>${inv.length ? inv.map(x => row(x, "invoice")).join("") : `<div class="muted small">None yet – create one from any job's ${"Report / Certify"} tab.</div>`}</div>
    <div class="card"><h2>Quotes <span class="count">${qs.length}</span></h2>${qs.length ? qs.map(x => row(x, "quote")).join("") : `<div class="muted small">None yet – create one from an EICR's Report tab.</div>`}</div></main>`;
}

/* ---------------- customer copy of the certificate (per job, off unless ticked) */
function customerCopyBlock(job){
  if (job.example || !billingOk()) return "";
  return `${chips("Also email this " + (typeOf(job) === "EICR" ? "report" : typeOf(job) === "PAT" ? "register" : "certificate") + " to the customer","job.emailCustomer",["Yes","No"],{small:true})}
    ${job.emailCustomer === "Yes" ? field("Customer email","job.client.email",{type:"email",hint: job.client.email ? "" : "Needed to send the customer a copy"}) : ""}
    ${job.customerSentAt ? `<div class="muted small">Customer copy sent ${esc(agoText(job.customerSentAt))}.</div>` : ""}`;
}
async function sendCustomerCopy(job){
  const c = job.client || {}, t = typeOf(job), co = job.company || settings;
  const noun = t === "EICR" ? "Electrical Installation Condition Report" : TYPE_LONG[t];
  await api("send", { to: c.email, subject: `Your ${noun} – ${jobTitle(job)}`,
    body: `<p>Dear ${esc(c.name || "customer")},</p><p>Please find attached your ${esc(noun)} for ${esc(job.address || "")}, dated ${esc(ukDate(job.inspDate))}${t === "EICR" ? ` – overall assessment: <b>${esc(outcomeText(job))}</b>` : ""}.</p><p>Please keep it safe – you'll need it if you sell the property, for insurance, or when further work is done.</p><p>Kind regards,<br>${esc(job.inspector || settings.inspector)}<br>${esc(co.company)}${co.phone ? "<br>" + esc(co.phone) : ""}</p>`,
    reportHtml: exportHtml(job), reportName: fileName(job, "html"), pdfName: fileName(job, "pdf"), noSave: true });
  job.customerSentAt = Date.now();
}

/* ---------------- app lock: PIN, plus fingerprint / face where the device supports it */
let locked = false, lastHidden = 0, pinEntry = "";
async function sha(s){ const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join(""); }
const lockOn = () => settings.lock === "On" && !!settings.pinHash;
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = s => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
async function bioAvailable(){ try { return !!(window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch(e){ return false; } }
async function bioRegister(){
  const cred = await navigator.credentials.create({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: "BlueForge Certificates" },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: settings.userName || "BlueForge user", displayName: settings.userName || "BlueForge user" },
    pubKeyCredParams: [{type:"public-key", alg:-7}, {type:"public-key", alg:-257}], authenticatorSelection: { authenticatorAttachment:"platform", userVerification:"required", residentKey:"discouraged" }, timeout: 60000 } });
  settings.bioId = b64u(cred.rawId); lsWrite();
}
async function bioUnlock(){
  await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type:"public-key", id: unb64u(settings.bioId) }], userVerification: "required", timeout: 60000 } });
  unlock();
}
function showLock(){
  if (!lockOn()) return;
  locked = true; pinEntry = "";
  let l = document.getElementById("lock");
  if (!l) { l = document.createElement("div"); l.id = "lock"; l.className = "lock"; document.body.appendChild(l); }
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  l.innerHTML = `<div class="lockin">${LOGOS.bf ? `<img class="locklogo" src="${LOGOS.bf}" alt="BlueForge Engineering">` : `<div class="brandmark">BLUEFORGE</div>`}<h2>Enter your PIN</h2><div class="dots" id="pindots">${"○".repeat(settings.pinLen || 4)}</div><div id="pinmsg" class="small"></div>
    <div class="keypad">${keys.map(k => k ? `<button class="key" data-pin="${k}">${k}</button>` : `<span></span>`).join("")}</div>
    ${settings.bioId ? `<button class="btn ghost" data-act="bio" style="color:#fff;border-color:rgba(255,255,255,.5)">Use fingerprint / face</button>` : ""}
    <button class="linkbtn" data-act="forgotPin">Forgot PIN?</button><div id="forgot"></div></div>`;
  l.hidden = false;
}
function unlock(){ locked = false; const l = document.getElementById("lock"); if (l) { l.hidden = true; l.innerHTML = ""; } }
document.addEventListener("click", async e => {
  const k = e.target.closest("[data-pin]");
  if (k && locked) {
    if (k.dataset.pin === "⌫") pinEntry = pinEntry.slice(0, -1); else pinEntry += k.dataset.pin;
    const len = settings.pinLen || 4, d = document.getElementById("pindots");
    if (d) d.textContent = "●".repeat(pinEntry.length) + "○".repeat(Math.max(0, len - pinEntry.length));
    if (pinEntry.length >= len) {
      const ok = (await sha(settings.pinSalt + pinEntry)) === settings.pinHash;
      if (ok) unlock(); else { pinEntry = ""; const m = document.getElementById("pinmsg"); if (m) m.textContent = "Wrong PIN – try again"; if (d) d.textContent = "○".repeat(len); }
    }
    return;
  }
  const a = e.target.closest("[data-act]"); if (!a) return;
  if (a.dataset.act === "bio" && locked) { try { await bioUnlock(); } catch(err){ const m = document.getElementById("pinmsg"); if (m) m.textContent = "Fingerprint didn't work – use your PIN"; } }
  if (a.dataset.act === "forgotPin" && locked) { const f = document.getElementById("forgot"); if (f) f.innerHTML = `<div class="small" style="margin-top:8px">Resetting clears everything on this device. Jobs that have synced to Google Drive come back once you reconnect with your connection code.</div><button class="btn danger sm" data-act="wipeDevice" style="margin-top:8px;background:#fff">Reset this device</button>`; }
  if (a.dataset.act === "wipeDevice" && locked) { try { indexedDB.deleteDatabase(IDB_NAME); localStorage.clear(); sessionStorage.clear(); } catch(err){} setTimeout(() => location.reload(), 300); }
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") lastHidden = Date.now();
  else if (lockOn() && !locked && lastHidden && Date.now() - lastHidden > (num(settings.lockAfter) ?? 5) * 60000) showLock();
});
function lockCard(){
  return `<div class="card"><h2>App lock</h2><div class="muted small">Asks for a PIN (or fingerprint / face) when the app opens and after it's been in the background. Protects customer details if the phone is lost.</div>
    ${settings.pinHash ? `<div class="row">${pill(settings.lock === "On" ? "pass" : "none", settings.lock === "On" ? "Lock on" : "Lock off")}${settings.bioId ? pill("pass","Fingerprint / face set up") : ""}</div>
      ${chips("Lock","settings.lock",["On","Off"])}
      ${chips("Lock again after (minutes in background)","settings.lockAfter",["1","5","15","30"],{small:true})}
      <div class="row">${settings.bioId ? `<button class="btn ghost sm" data-act="bioOff">Turn off fingerprint</button>` : `<button class="btn ghost sm" data-act="bioSetup">Set up fingerprint / face</button>`}<button class="btn ghost sm" data-act="changePin">Change PIN</button></div>` : ""}
    ${!settings.pinHash || view.changePin ? `<div class="grid2"><label class="field" for="newpin"><span>New PIN (4–6 digits)</span><input id="newpin" type="password" inputmode="numeric" autocomplete="off" maxlength="6" class="num"></label><label class="field" for="newpin2"><span>Repeat PIN</span><input id="newpin2" type="password" inputmode="numeric" autocomplete="off" maxlength="6" class="num"></label></div>
      <button class="btn sm" data-act="savePin">Save PIN and turn lock on</button>` : ""}
    <div id="lockmsg"></div></div>`;
}

/* ------------------------------------------------------------------ sending to the office */
let sending = false;
function jobTitle(job){ return (job.address || job.client.name || "Untitled job").split("\n")[0]; }
function outcomeText(job){
  const s = jobSummary(job), t = typeOf(job);
  if (t === "EICR") return s.status === "fail" ? "UNSATISFACTORY" : s.status === "pass" ? "SATISFACTORY" : "not yet assessed";
  if (FORMS[typeOf(job)]) return s.form.outcome ? s.form.outcome.toUpperCase() : "result not set";
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
  await loadJobPhotos(job);
  await api("send", { to: settings.officeEmail, subject: reportSubject(job), body: reportBody(job),
    reportHtml: exportHtml(job), reportName: fileName(job, "html"), pdfName: fileName(job, "pdf"),
    backup: jobBackup(job), backupName: fileName(job, "json") });
}
async function processQueue(){
  if (sending || !settings.sendUrl || navigator.onLine === false) return;
  const queue = liveJobs().filter(x => (x.sendQueued || x.customerPending) && (!x.sendDevice || x.sendDevice === settings.deviceId));
  if (!queue.length) return;
  sending = true;
  for (const job of queue){
    try {
      if (job.sendQueued) { await sendJob(job); job.sendQueued = false; job.sentAt = Date.now(); }
      if (job.customerPending && billingOk()) { await sendCustomerCopy(job); job.customerPending = false; }
      job.sendError = ""; job.updated = Date.now();
    }
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
  await loadJobPhotos(job);
  const copies = [{name: fileName(job, "html"), text: exportHtml(job), type: "text/html"}, {name: fileName(job, "json"), text: jobBackup(job), type: "application/json"}];
  job.finishedAt = Date.now();
  const auto = settings.sendUrl && settings.autoSend !== "No";
  if (auto) { job.sendQueued = true; job.sendError = ""; job.sendDevice = settings.deviceId; }
  job.customerPending = !!(billingOk() && settings.sendUrl && job.emailCustomer === "Yes" && job.client && job.client.email);
  if (job.customerPending) job.sendDevice = settings.deviceId;
  if (job.emailCustomer === "Yes" && !settings.sendUrl) toast("Sync isn't set up, so the customer copy can't be emailed – forward it from your email app.");
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
function connectionCode(){ try { return "BFEICR:" + btoa(unescape(encodeURIComponent(JSON.stringify({u: settings.sendUrl, k: settings.sendKey, o: settings.officeEmail})))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); } catch(e){ return ""; } }
function applyConnectionCode(code){
  // Email and chat apps often wrap long lines, add spaces or smart characters – strip anything that can't be part of the code.
  const raw = String(code || "").replace(/[\s\u200B-\u200D\uFEFF"'`<>]/g, "");
  const m = raw.match(/BFEICR:([A-Za-z0-9+\/_=-]+)/i);
  if (!m) throw new Error("Couldn't find a code starting with BFEICR: – paste the whole thing.");
  let b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  let d;
  try { d = JSON.parse(decodeURIComponent(escape(atob(b64)))); }
  catch(e){ throw new Error("The code looks cut short or changed – copy it again, or use the key box below instead."); }
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
var AI_MODEL = "claude-sonnet-5-5";   // model used to read board photos – change here if Anthropic retires it
var ASK_SYSTEM = "You are a senior UK electrical inspector helping an experienced electrician (NVQ, 2391) working in North Wales. " +
  "Answer questions about BS 7671:2018+A4:2026 (18th Edition, IET Wiring Regulations), the On-Site Guide, Guidance Note 3, Building Regulations Part P (Wales), EICR coding (Electrical Safety First Best Practice Guide 4), testing and inspection, and practical installation. " +
  "Be direct and practical: lead with the answer in one or two sentences, then the key points. Quote regulation, table or appendix numbers where they apply (e.g. Reg 411.3.3, Table 41.3). " +
  "Show calculations step by step with the formula. If a specific table value or clause matters and you are not certain of it, say so and tell them to check their copy of BS 7671 or GN3 – never invent numbers. " +
  "Mention safety-critical points (safe isolation, when something is C1/C2). Keep answers under about 250 words unless a calculation needs more. Use plain text with short lists; no tables.";
var BOARD_PROMPT = "This is a photo of an electrical consumer unit or distribution board in the UK with the cover off (or with the device fronts visible). " +
  "List every device on the DIN rail(s) strictly from LEFT to RIGHT as seen in the photo (if there are several rows, do the top row first). Include blank/spare ways. " +
  "For each device give: kind (one of: ms = main switch/isolator, rcd = RCCB/RCD, mcb, rcbo, spd = surge protector, fuse, afdd, blank, other), " +
  "curve (B, C or D for mcb/rcbo, from the marking such as B32), rating in amps (number), ma (RCD residual current in mA, for rcd/rcbo), rcdType (AC, A, F or B if shown by marking or symbol), " +
  "poles (1, 2, 3 or 4), label (any circuit name written on or next to the device, or from a circuit chart visible in the photo, else empty), " +
  "and confidence (high, medium or low – low if the marking is not clearly readable). Never guess a rating you cannot see: use null and confidence low. " +
  "Reply with JSON only, no other text, in exactly this shape: " +
  '{"devices":[{"kind":"mcb","curve":"B","rating":32,"ma":null,"rcdType":"","poles":1,"label":"Sockets","confidence":"high"}],"notes":"anything the electrician should check"}';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var P = PropertiesService.getScriptProperties();
    if (d.key !== (P.getProperty("key") || KEY)) return reply({ok: false, error: "Wrong key – reconnect this device"});
    var devs = JSON.parse(P.getProperty("devices") || "{}"), isOwner = !!d.owner && d.owner === P.getProperty("ownerHash");
    if (d.device) {
      var dv = devs[d.device] || {};
      if (dv.revoked) return reply({ok: false, error: "DEVICE_REMOVED"});
      var nm = d.deviceName || dv.name || "", rl = d.role || dv.role || "", pf = d.platform || dv.platform || "";
      if (!dv.lastSeen || Date.now() - dv.lastSeen > 600000 || dv.name !== nm || dv.role !== rl || dv.platform !== pf || !!dv.owner !== isOwner) {
        devs[d.device] = {name: nm, role: rl, platform: pf, lastSeen: Date.now(), owner: isOwner};
        P.setProperty("devices", JSON.stringify(devs));
      }
    }
    if (d.action === "devices" || d.action === "revokeDevice" || d.action === "restoreDevice" || d.action === "rotateKey") {
      if (!isOwner) return reply({ok: false, error: "Only the owner can manage devices"});
      if (d.action === "devices") { var list = []; for (var k in devs) { var x = devs[k]; x.id = k; list.push(x); } return reply({ok: true, devices: list}); }
      if (d.action === "revokeDevice" || d.action === "restoreDevice") { if (devs[d.id]) { devs[d.id].revoked = d.action === "revokeDevice"; P.setProperty("devices", JSON.stringify(devs)); } return reply({ok: true}); }
      if (d.action === "rotateKey") { if (!/^bf-[a-z0-9]{12,}$/.test(d.newKey || "")) return reply({ok: false, error: "Bad key"}); P.setProperty("key", d.newKey); return reply({ok: true}); }
    }
    if (d.action === "ping") return reply({ok: true, ai: !!P.getProperty("aiKey")});
    if (d.action === "setAiKey") {
      if (!isOwner) return reply({ok: false, error: "Only the owner can set the AI key"});
      var nk2 = String(d.aiKey || "").trim();
      if (nk2 && !/^sk-ant-/.test(nk2)) return reply({ok: false, error: "That doesn't look like an Anthropic API key (it should start sk-ant-)"});
      if (nk2) P.setProperty("aiKey", nk2); else P.deleteProperty("aiKey");
      return reply({ok: true, ai: !!nk2});
    }
    if (d.action === "ask") {
      var ak2 = P.getProperty("aiKey");
      if (!ak2) return reply({ok: false, error: "The AI isn't set up yet – the owner adds the AI key in Settings > Owner access"});
      var msgs = (d.history || []).slice(-6).reduce(function (a, h) { if (h && h.q && h.a) { a.push({role: "user", content: String(h.q).slice(0, 2000)}); a.push({role: "assistant", content: String(h.a).slice(0, 4000)}); } return a; }, []);
      msgs.push({role: "user", content: String(d.question || "").slice(0, 3000)});
      var r2 = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {method: "post", contentType: "application/json",
        headers: {"x-api-key": ak2, "anthropic-version": "2023-06-01"}, payload: JSON.stringify({model: AI_MODEL, max_tokens: d.maxTokens || 1500, system: d.system || ASK_SYSTEM, messages: msgs}), muteHttpExceptions: true});
      var c2 = r2.getResponseCode(), t2 = r2.getContentText();
      if (c2 !== 200) { var e2 = t2.slice(0, 200); try { e2 = JSON.parse(t2).error.message; } catch (x) {} return reply({ok: false, error: "AI failed (" + c2 + "): " + e2}); }
      return reply({ok: true, answer: (JSON.parse(t2).content || []).filter(function (c) { return c.type === "text"; }).map(function (c) { return c.text; }).join("")});
    }
    if (d.action === "readBoard") {
      var ak = P.getProperty("aiKey");
      if (!ak) return reply({ok: false, error: "Board reading isn't set up yet – the owner adds the AI key in Settings > Owner access"});
      var body = {model: AI_MODEL, max_tokens: 4000, messages: [{role: "user", content: [
        {type: "image", source: {type: "base64", media_type: d.mediaType || "image/jpeg", data: d.image}},
        {type: "text", text: BOARD_PROMPT}]}]};
      var r = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {method: "post", contentType: "application/json",
        headers: {"x-api-key": ak, "anthropic-version": "2023-06-01"}, payload: JSON.stringify(body), muteHttpExceptions: true});
      var code = r.getResponseCode(), rt = r.getContentText();
      if (code !== 200) { var em = rt.slice(0, 200); try { em = JSON.parse(rt).error.message; } catch (x) {} return reply({ok: false, error: "AI reading failed (" + code + "): " + em}); }
      var txt = (JSON.parse(rt).content || []).filter(function (c) { return c.type === "text"; }).map(function (c) { return c.text; }).join("");
      var mm = txt.match(/\\{[\\s\\S]*\\}/);
      if (!mm) return reply({ok: false, error: "Couldn't make sense of that photo – try a straighter, closer shot with the cover off"});
      try { return reply({ok: true, board: JSON.parse(mm[0])}); } catch (x) { return reply({ok: false, error: "Couldn't make sense of that photo – try again"}); }
    }
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
    if (action === "owner") {
      var op = PropertiesService.getScriptProperties(), have = op.getProperty("ownerHash");
      if (!d.hash) return reply({ok: false, error: "No passcode"});
      if (!have) { op.setProperty("ownerHash", d.hash); return reply({ok: true, created: true}); }
      if (have !== d.hash) { Utilities.sleep(1500); return reply({ok: false, error: "Wrong passcode"}); }
      return reply({ok: true});
    }
    if (action === "nextNumber") {
      var lk = LockService.getScriptLock(); lk.waitLock(25000);
      try {
        var props = PropertiesService.getScriptProperties(), nk = "num:" + d.type + ":" + d.year;
        var n = Math.max(Number(props.getProperty(nk) || 0), Number(d.floor || 0)) + 1; props.setProperty(nk, String(n));
        return reply({ok: true, number: (d.prefix || "BF") + "-" + d.type + "-" + d.year + "-" + ("00" + n).slice(-3)});
      } finally { lk.releaseLock(); }
    }
    if (action === "putPhoto") {
      if (!/^[a-z0-9]+$/i.test(d.id || "")) return reply({ok: false, error: "Bad photo id"});
      var photos = sub_("Photos"), name = d.id + ".jpg";
      var blob = Utilities.newBlob(Utilities.base64Decode(d.data), "image/jpeg", name);
      var existing = file_(photos, name); if (existing) existing.setTrashed(true);
      photos.createFile(blob).setDescription("job " + (d.jobId || ""));
      return reply({ok: true});
    }
    if (action === "getPhoto") {
      var f2 = file_(sub_("Photos"), (d.id || "") + ".jpg");
      if (!f2) return reply({ok: false, error: "Photo not uploaded yet"});
      return reply({ok: true, data: Utilities.base64Encode(f2.getBlob().getBytes())});
    }
    if (action === "delPhoto") {
      var f3 = file_(sub_("Photos"), (d.id || "") + ".jpg");
      if (f3) f3.setTrashed(true);
      return reply({ok: true});
    }
    if (action === "send") {
      var files = [], pdf = null;
      try { pdf = Utilities.newBlob(d.reportHtml, "text/html", "report.html").getAs("application/pdf").setName(d.pdfName); files.push(pdf); } catch (err) {}
      var html = Utilities.newBlob(d.reportHtml, "text/html", d.reportName);
      files.push(html);
      if (d.backup) files.push(Utilities.newBlob(d.backup, "application/json", d.backupName));
      var mail = {to: d.to || OFFICE, subject: d.subject, htmlBody: d.body, attachments: files, name: "BlueForge EICR"};
      if (d.cc) mail.cc = d.cc;
      MailApp.sendEmail(mail);
      if (!d.noSave) {
        var certs = sub_(d.folder || "Certificates");
        if (pdf) replace_(certs, d.pdfName, pdf); else replace_(certs, d.reportName, html);
      }
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
function authorise() { MailApp.getRemainingDailyQuota(); folder_(); UrlFetchApp.fetch("https://api.anthropic.com", {muteHttpExceptions: true}); }
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
  pat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v3"/></svg>',
  photos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  cert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M14.5 4.5l5 5L9 20H4v-5z"/></svg>',
  form:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  checks:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h10M4 12h10M4 18h10"/><path d="m16 6 2 2 3-4M16 18l2 2 3-4"/></svg>',
  sched:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/></svg>',
  report:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 3 20h18z"/><path d="M12 10v4M12 17v.5"/></svg>'
}[n] || "");

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
  else if (view.screen === "due") html = renderDue();
  else if (view.screen === "ask") html = renderAsk();
  else if (view.screen === "train") html = renderTrain();
  else if (view.screen === "customers") html = renderCustomers();
  else if (view.screen === "nvq") html = renderNvq();
  else if (view.screen === "customer") html = renderCustomer();
  else if (view.screen === "quiz" && view.quiz) { html = renderQuiz(); if (view.quiz.limitMin && !view.quiz.done) setTimeout(tickQuiz, 0); }
  else if (view.screen === "am2e") html = renderAm2e();
  else if (view.screen === "lesson") html = renderLesson();
  else if (view.screen === "money") html = billingOk() ? renderMoney() : renderHome();
  else if (view.screen === "job") { if (curJob() && !curJob().deleted) html = renderJob(); else { view = {screen:"home", tab:"job", board:0, circ:null}; html = renderHome(); } }
  app.innerHTML = html;
  renderTabs();
  if (view.screen === "job" && view.tab === "labels") drawLabelPreview();
  initSigs();
  if (typeof renderVoice === "function") { if (!(view.screen === "job" && view.tab === "circuits" && curCirc()) && voice.mode === "readings" && voice.state !== "listening") voice.state = "idle"; renderVoice(); }
  if (view.keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  view.keepScroll = false;
}
function rerender(){ view.keepScroll = true; render(); }

function jobPill(j){
  const s = jobSummary(j), t = typeOf(j);
  if (j.handoff && !j.sig && billingOk()) return pill("check","Ready to sign");
  if (FORMS[t]) return s.form.outcome ? pill(formBad(FORMS[t], s.form.outcome) ? "fail" : s.form.outcome === "Draft" ? "none" : "pass", s.form.outcome.toUpperCase()) : pill("none","In progress");
  if (t === "PAT") return s.total ? pill(s.pat.fail ? "fail" : s.status === "pass" ? "pass" : "none", `${s.pat.pass} pass · ${s.pat.fail} fail`) : pill("none","In progress");
  if (t === "EICR") return s.status === "fail" ? pill("fail","UNSATISFACTORY") : s.status === "pass" && s.tested ? pill("pass","SATISFACTORY") : pill("none","In progress");
  return s.status === "fail" ? pill("fail","TEST FAILURES") : s.status === "pass" ? pill("pass","ALL PASSED") : pill("none","In progress");
}
function jobCard(j){
  const circ = typeOf(j) === "PAT" ? ((j.pat && j.pat.items) || []).length : FORMS[typeOf(j)] ? formSummary(j).rows : j.boards.reduce((n,b) => n + b.circuits.length, 0);
  const unit = typeOf(j) === "PAT" ? "item" : FORMS[typeOf(j)] ? ((FORMS[typeOf(j)].tables[0] || {}).row || "item").toLowerCase() : "circuit";
  const extra = [];
  if (!j.example && (j.sentAt || j.sendQueued)) extra.push(sendStatus(j));
  if (j.handoff && settings.role === "Tester") extra.push(pill("none", "Sent for sign-off"));
  return `<button class="card-link" data-act="open" data-id="${esc(j.id)}"><div class="grow"><div class="t">${esc(jobTitle(j))}</div><div class="d"><span class="typetag">${esc(TYPES[typeOf(j)])}</span> ${esc(ukDate(j.inspDate))}${j.reportNo ? " · " + esc(j.reportNo) : ""} · ${circ} ${unit}${circ === 1 ? "" : "s"}${j.example ? ' · <span class="ex-tag">Example</span>' : ""}</div>${extra.length ? `<span class="row" style="gap:6px;margin-top:4px">${extra.join("")}</span>` : ""}</div>${jobPill(j)}</button>`;
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
  const ready = billingOk() ? liveJobs().filter(j => j.handoff && !j.sig).length : 0;
  return `<header class="top"><h1>BlueForge<span class="sub brandmark">CERTIFICATES &amp; REPORTS</span></h1><button class="iconbtn" data-act="settings" aria-label="Settings">⚙</button></header>
  ${statusHtml()}
  <main>
    ${view.chooser ? `<div class="card"><h2>New</h2>
      <button class="card-link" data-act="newType" data-type="EICR"><div class="grow"><div class="t">EICR</div><div class="d">Condition report on an existing installation</div></div></button>
      <button class="card-link" data-act="newType" data-type="EIC"><div class="grow"><div class="t">EIC</div><div class="d">New installation, new circuits, consumer unit change</div></div></button>
      <button class="card-link" data-act="newType" data-type="MW"><div class="grow"><div class="t">Minor Works</div><div class="d">Addition or alteration that doesn't add a new circuit</div></div></button>
      <button class="card-link" data-act="newType" data-type="PAT"><div class="grow"><div class="t">PAT register</div><div class="d">Portable appliance testing</div></div></button>
      ${Object.entries(FORMS).map(([k, f]) => `<button class="card-link" data-act="newType" data-type="${esc(k)}"><div class="grow"><div class="t">${esc(f.name)}</div><div class="d">${esc(f.long)} · ${esc(f.std || "")}</div></div></button>`).join("")}
      <button class="btn ghost sm" data-act="chooserOff">Cancel</button></div>`
      : `<button class="btn block" data-act="chooser">+ New</button>`}
    <div class="tiles">
      <button class="tile" data-act="book"><b>Handbook</b><span>Tables, test methods, calculators</span></button>
      <button class="tile" data-act="codes"><b>Coding guide</b><span>Search C1 · C2 · C3 · FI</span></button>
      <button class="tile" data-act="ask"><b>Ask the regs</b><span>AI answers with reg numbers</span></button>
      <button class="tile" data-act="train"><b>Training</b><span>EWA · AM2E · 2391 practice</span></button>
      <button class="tile" data-act="customers"><b>Customers</b><span>Contacts, addresses, job history</span></button>
      <button class="tile" data-act="nvq"><b>NVQ portfolio</b><span>Log evidence as you work</span></button>
      ${billingOk() ? "" : "<!--"}<button class="tile" data-act="money"><b>Quotes &amp; invoices</b><span>${(() => { const u = liveJobs().filter(x => x.invoice && x.invoice.status !== "Paid"); return u.length ? u.length + " unpaid" : "Nothing owed"; })()}</span></button>${billingOk() ? "" : "-->"}
      <button class="tile" data-act="due"><b>Due soon</b><span>${dueList().length} re-inspection${dueList().length === 1 ? "" : "s"} to chase</span></button>
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
      <details class="more"><summary>Or enter the link and key by hand</summary><div>
        <div class="muted small">Every connected device must have the same <b>Sync link</b> (in Sync &amp; office above) and the same <b>key</b>. Copy both from the device you set the script up on.</div>
        ${field("Sync key","settings.sendKey",{hint:"Starts with bf- … Must match the KEY line at the top of your Google script."})}
      </div></details>
    </div>
    <div class="card"><h2>Contractor</h2>
      ${field("Company","settings.company")}${field("Inspector (signs certificates)","settings.inspector")}${field("Position","settings.position")}
      ${field("Address","settings.address",{area:true})}
      <div class="grid2">${field("Telephone","settings.phone",{type:"tel"})}${field("Email","settings.email",{type:"email"})}</div>
      ${field("Registration / scheme no.","settings.reg",{ph:"Leave blank if not registered"})}
      <div class="grid2">${field("Certificate number prefix","settings.numPrefix",{ph:"BF",hint:"Numbers look like BF-EICR-2026-001"})}${field("Breaker width for labels","settings.labelModuleMm",{num:true,unit:"mm",ph:"18"})}</div>
    </div>
    ${lockCard()}
    ${billingCard()}
    ${aiCard()}
    ${devicesCard()}
    ${billingOk() ? `<div class="card"><h2>Prices</h2><div class="muted small">Used to price remedial quotes and invoices. These are examples – change them to your own.</div>
      ${priceList().map((p, i) => `<div class="row" style="align-items:flex-end;flex-wrap:nowrap">${field("Item", "settings.prices." + i + ".desc")}<div style="width:110px;flex:none">${field("Price", "settings.prices." + i + ".price", {num:true, unit:"£"})}</div><button class="btn ghost sm" data-act="delPrice" data-i="${i}" aria-label="Remove">✕</button></div>`).join("")}
      <button class="btn ghost sm" data-act="addPrice">+ Add price</button></div>
    <div class="card"><h2>Invoicing</h2>
      ${chips("VAT registered","settings.vatReg",["Yes","No"])}
      ${settings.vatReg === "Yes" ? `<div class="grid2">${field("VAT number","settings.vatNo")}${field("VAT rate","settings.vatRate",{num:true,unit:"%",ph:"20"})}</div>` : ""}
      ${field("Payment terms","settings.payTerms",{num:true,unit:"days",ph:"14"})}
      ${field("Bank account name","settings.bankName")}
      <div class="grid2">${field("Sort code","settings.sortCode",{ph:"00-00-00"})}${field("Account number","settings.accountNo",{num:true})}</div>
      <div class="muted small">Printed on invoices. Kept on this device only.</div></div>` : ""}
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

Object.entries(window.BF_FORMS || {}).forEach(([k, f]) => { TYPE_LONG[k] = f.long; });
const TABS = {
  EICR: [["job","Job"],["supply","Supply"],["circuits","Circuits"],["inspect","Inspect"],["photos","Photos"],["report","Report"]],
  EIC:  [["job","Work"],["supply","Supply"],["circuits","Circuits"],["inspect","Inspect"],["photos","Photos"],["cert","Certify"]],
  MW:   [["job","Work"],["supply","Supply"],["circuits","Circuit"],["photos","Photos"],["cert","Certify"]],
  PAT:  [["job","Site"],["pat","Items"],["photos","Photos"],["cert","Certify"]]
};
Object.entries(window.BF_FORMS || {}).forEach(([k, f]) => { const L = f.tabs || {}; TABS[k] = [["job","Site"],["form", L.form || "Details"],["checks", L.checks || "Checks"]].concat(f.tables.length ? [["sched", L.sched || f.tables[0].row + "s"]] : []).concat([["photos","Photos"],["cert", f.noun === "document" ? "Issue" : "Certify"]]); });
function renderJob(){
  const job = curJob();
  const t = typeOf(job);
  if (!TABS[t].some(x => x[0] === view.tab) && !(view.tab === "danger" && t === "EICR") && !(view.tab === "labels" && t !== "PAT") && !(view.tab === "readboard" && view.read) && !(view.tab === "quote" && t === "EICR" && billingOk()) && !(view.tab === "invoice" && billingOk())) view.tab = "job";
  if (view.tab === "circuits" && curCirc()) return renderCircuit();
  if (view.tab === "pat" && view.patItem && job.pat && job.pat.items.some(x => x.id === view.patItem)) return renderPatItem();
  loadJobPhotos(job);
  const body = { job: t === "EICR" ? tabJob : t === "PAT" ? patWorkTab : FORMS[t] ? formSiteTab : tabWork, form: formDetailsTab, checks: formChecksTab, sched: formSchedTab, supply:tabSupply, circuits:tabCircuits, inspect:tabInspect, photos:tabPhotos, report:tabReport, cert:tabCert, pat:tabPat, danger:tabDanger, labels:tabLabels, readboard:tabReadBoard, quote:tabQuote, invoice:tabInvoice }[view.tab]() + (view.tab === "job" && !job.example ? prevJobsCard(job) : "");
  return `<header class="top"><button class="iconbtn" data-act="home" aria-label="All jobs">←</button><h1>${esc(jobTitle(job) === "Untitled job" ? "New " + TYPES[t] : jobTitle(job))}<span class="sub">${job.example ? "Example – not saved" : esc(TYPES[t]) + (job.reportNo ? " · " + esc(job.reportNo) : "")}</span></h1></header>
  ${job.example ? `<div class="status warn"><span class="dot"></span>Example report – edits aren't saved</div>` : statusHtml()}
  ${job.handoff && !job.sig && billingOk() && view.tab === "job" ? `<main style="padding-bottom:0"><div class="warnline">Tested by ${esc(job.handoff.by)} and sent for sign-off ${esc(agoText(job.handoff.at))}. Check it through, then sign on the ${t === "EICR" ? "Report" : "Certify"} tab.</div></main>` : ""}
  <main>${body}</main>`;
}

function renderTabs(){
  const nav = document.getElementById("tabs");
  if (view.screen !== "job" || !curJob() || (view.tab === "circuits" && curCirc()) || (view.tab === "pat" && view.patItem)) { nav.hidden = true; nav.innerHTML = ""; return; }
  const job = curJob(), s = jobSummary(job), t = TABS[typeOf(job)];
  const warn = s.unwrittenFails.length + s.coded.length + (typeOf(job) !== "EICR" ? s.fails.length : 0);
  nav.hidden = false;
  nav.innerHTML = `<div class="in" style="grid-template-columns:repeat(${t.length},1fr)">${t.map(([k,l]) => `<button class="tab" data-tab="${k}" ${view.tab === k ? 'aria-current="page"' : ""}>${icon(k)}<span>${l}${(k === "report" || k === "cert") && warn ? `<span class="badge">${warn}</span>` : ""}${k === "photos" && missingPhotos(job).length ? `<span class="badge">${missingPhotos(job).length}</span>` : ""}</span></button>`).join("")}</div>`;
}

/* ---------------- EIC / Minor Works: the work tab */
const NOTIFY = [["newCircuit","A new circuit"],["cu","Consumer unit replacement"],["kitchen","Adding to a circuit in a kitchen"],["special","Work in a bath/shower room, pool or sauna"],["outdoor","Outdoor, garden or outbuilding wiring, external sockets"],["specialInst","Underfloor/ceiling heating, solar PV, micro-CHP, ELV lighting, heating controls"]];
function tabWork(){
  const job = j(), t = typeOf(job), w = job.work;
  const notifiable = NOTIFY.some(([k]) => w.notify[k] === "Yes");
  return `
  <div class="card"><h2>${t === "EIC" ? "Certificate" : "Minor works"}</h2><div class="grid2">${field(t === "EIC" ? "Certificate number" : "Certificate number","job.reportNo")}${field(t === "EIC" ? "Date of completion" : "Date work completed","job.inspDate",{type:"date"})}</div></div>
  <div class="card"><h2>Client</h2>${field("Client","job.client.name")}<div class="grid2">${field("Telephone","job.client.phone",{type:"tel"})}${field("Email","job.client.email",{type:"email"})}</div>${field("Client address","job.client.address",{area:true})}</div>
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
  </div>
  ${evPvCard(job)}`;
}

/* ---------------- EIC / Minor Works: certify tab */
function signBlock(job){
  if (!billingOk()) return `<div class="card"><h2>Sign-off</h2><div class="muted">This will be checked and signed by <b>${esc(settings.role === "Tester" ? (job.inspector || settings.signOffName) : settings.signOffName || "the owner")}</b>. When everything is filled in and tested, send it for sign-off below.${settings.role !== "Tester" ? " (This device doesn't have owner access – unlock it in ⚙ to sign here.)" : ""}</div></div>`;
  return sigPad("Signature", "job.sig", "job.sigDate");
}
function tabCert(){
  const job = j(), t = typeOf(job), s = jobSummary(job), w = job.work;
  if (FORMS[t]) return formCertTab();
  if (t === "PAT") {
    const ps = s.pat, probs = [];
    if (!ps.total) probs.push(`<div class="warnline">No items added yet.</div>`);
    if (ps.none + ps.check) probs.push(`<div class="warnline">${ps.none + ps.check} item${ps.none + ps.check === 1 ? " is" : "s are"} not fully tested yet.</div>`);
    if (ps.fail) probs.push(`<div class="errline">${ps.fail} item${ps.fail === 1 ? "" : "s"} failed – label and withdraw from use.</div>`);
    return `<div class="banner ${ps.fail ? "fail" : s.status === "pass" ? "pass" : "none"}"><span class="small">PAT register</span><strong>${ps.pass} PASS · ${ps.fail} FAIL</strong><span class="small">${ps.total} item${ps.total === 1 ? "" : "s"}</span></div>
    ${probs.length ? `<div class="card"><h2>To sort out</h2>${probs.join("")}</div>` : ""}
    <div class="card"><h2>Declaration</h2><div class="grid2">${field("Tested by","job.inspector")}${field("Position","job.position")}</div>${!billingOk() ? "" : signBlock(job)}
      <div class="grid2">${field("Date signed","job.sigDate",{type:"date"})}${field("Date of issue","job.issueDate",{type:"date"})}</div></div>
    ${!billingOk() ? signBlock(job) : ""}${handoverCard(job)}${finishCard(job)}${labelsCard(job)}`;
  }
  const problems = [];
  s.fails.forEach(f => problems.push(`<div class="errline">${esc(f.b.ref)} circuit ${esc(f.c.no)} (${esc(f.c.desc || "no description")}) has failed a test.</div>`));
  s.inspFails.forEach(([id,q]) => problems.push(`<div class="errline">Inspection ${esc(id)} marked ✗ – ${esc(q)}.</div>`));
  s.incomplete.forEach(f => problems.push(`<div class="warnline">${esc(f.b.ref)} circuit ${esc(f.c.no)} (${esc(f.c.desc || "no description")}) – ${esc(f.why)}</div>`));
  if (missingPhotos(job).length) problems.push(`<div class="warnline">${missingPhotos(job).length} required photo${missingPhotos(job).length === 1 ? "" : "s"} missing – see the Photos tab.</div>`);
  if (!s.total) problems.push(`<div class="warnline">No circuits added yet – add them on the ${t === "MW" ? "Circuit" : "Circuits"} tab.</div>`);
  if (s.untested) problems.push(`<div class="warnline">${s.untested} circuit${s.untested === 1 ? " has" : "s have"} no test results yet.</div>`);
  if (NOTIFY.some(([k]) => w.notify[k] === "Yes") && !w.bcRef) problems.push(`<div class="warnline">Notifiable work – add the building control reference on the Work tab.</div>`);
  const banner = s.status === "fail" ? `<div class="banner fail"><span class="small">Test results</span><strong>NOT READY</strong><span class="small">Every circuit must pass before this can be certified.</span></div>`
    : s.status === "pass" ? `<div class="banner pass"><span class="small">Test results</span><strong>ALL PASSED</strong><span class="small">Ready to sign.</span></div>`
    : `<div class="banner none"><span class="small">Test results</span><strong>In progress</strong><span class="small">${s.incomplete.length ? "Some results still need checking or filling in." : "Fill in the circuit test results."}</span></div>`;
  const decl = t === "EIC" ? `
    ${!billingOk() ? "" : chips("Designed, constructed, inspected and tested by the same person","job.work.sameSigner",["Yes","No"])}
    ${w.sameSigner === "No" ? `<div class="grid2">${field("Designer","job.work.designer")}${field("Design date","job.work.designDate",{type:"date"})}</div><div class="grid2">${field("Constructor","job.work.constructor")}${field("Construction date","job.work.constructDate",{type:"date"})}</div>` : ""}
    <div class="grid2">${field(w.sameSigner === "No" ? "Inspected and tested by" : "Name","job.inspector")}${field("Position","job.position")}</div>` :
    `<div class="grid2">${field("Name","job.inspector")}${field("Position","job.position")}</div>`;
  return `${banner}
  ${problems.length ? `<div class="card"><h2>To sort out</h2>${problems.join("")}</div>` : ""}
  ${t === "EIC" ? `<div class="card"><h2>Next inspection</h2>
    <div class="grid2">${autoBox("Max interval for premises","maxInt")}${field("Your interval (optional)","job.recInterval",{num:true,unit:"yrs"})}</div>
    ${autoBox("Recommended first inspection by","nextDue")}</div>` : ""}
  <div class="card"><h2>Declaration</h2>${decl}
    ${!billingOk() ? "" : signBlock(job)}
    <div class="grid2">${field("Date signed","job.sigDate",{type:"date"})}${field("Date of issue","job.issueDate",{type:"date"})}</div>
  </div>
  ${!billingOk() ? signBlock(job) : ""}
  ${handoverCard(job)}
  ${finishCard(job)}
  ${labelsCard(job)}`;
}

/* ---------------- finishing: shared by all report types */
function finishCard(job){
  const t = typeOf(job), noun = t === "EICR" ? "report" : (FORMS[t] && FORMS[t].noun) || "certificate";
  if (job.example) return `<div class="card"><h2>Finished ${noun}</h2><button class="btn block ghost" data-act="print">Print / save as PDF</button></div>`;
  const tester = !billingOk();
  const main = tester
    ? `<button class="btn block" data-act="handoff">${job.handoff ? "Send for sign-off again" : "Send for sign-off"}</button>
       <div class="muted small">${job.handoff ? `Sent ${esc(agoText(job.handoff.at))}. ` : ""}${settings.sendUrl ? `It syncs to ${esc(job.inspector || settings.signOffName)} automatically when you have signal.` : "Sync isn't set up on this phone – set it up in ⚙ so the job reaches the inspector, or use Share job file below."}</div>
       ${missingPhotos(job).length ? `<div class="warnline">${missingPhotos(job).length} required photo${missingPhotos(job).length === 1 ? "" : "s"} still to take – see the Photos tab.</div>` : ""}
       <button class="btn ghost sm" data-act="shareJob">Share job file</button>`
    : (() => { const blockers = [];
        if (!job.sig) blockers.push("sign the declaration");
        if (FORMS[t] && !(job.form && job.form.outcome)) blockers.push("choose the overall result");
        else if (FORMS[t]) {}
        else if (t === "PAT" && jobSummary(job).status !== "pass") blockers.push("finish testing every item");
        else if (t !== "EICR" && t !== "PAT" && jobSummary(job).status !== "pass") blockers.push("get every circuit tested and passing");
        const mp = missingPhotos(job).length; if (mp) blockers.push(`take the required photos (${mp} missing – see the Photos tab)`);
        return blockers.length ? `<button class="btn block" disabled style="opacity:.5">Finish &amp; send to office</button><div class="warnline">Before finishing: ${blockers.join(" and ")}.</div>` : "";
      })() + `<button class="btn block" data-act="finish" ${!job.sig || (FORMS[t] ? !(job.form && job.form.outcome) : (t !== "EICR" && jobSummary(job).status !== "pass")) || missingPhotos(job).length ? "hidden" : ""}>${job.sentAt || job.sendQueued ? "Send again to office" : "Finish &amp; send to office"}</button>
       <div class="row small"><span class="muted">To ${esc(settings.officeEmail)}${settings.sendUrl ? " and your Google Drive" : ""}. ${IOS ? (settings.sendUrl ? "Choose <b>Save to Files</b> to keep a copy on the phone." : "Choose <b>Mail</b> to send it to the office, or <b>Save to Files</b> to keep a copy.") : "A copy is also saved to Downloads."}</span>${sendStatus(job)}</div>
       ${job.sendError && job.sendQueued ? `<div class="warnline">Not sent yet: ${esc(job.sendError)}. It will keep trying.</div>` : ""}
       `;
  return `<div class="card"><h2>Finished ${noun}</h2>${customerCopyBlock(job)}${main}
    ${!billingOk() ? `<div class="muted small">Only the owner can sign, finish, print or send ${noun}s.</div></div>` + "<!--" : ""}
    <button class="btn block ghost" data-act="print">Print / save as PDF</button>
    <div class="muted small">${IOS ? `Shows the full ${noun}. Tap <b>Print / PDF</b>, then Share › <b>Save to Files</b> for a PDF. <b>Back to app</b> returns here.` : `Opens the full ${noun} laid out for A4. In the print screen choose <b>Save as PDF</b>.`}</div>
    <button class="btn block ghost" data-act="export">Download ${noun} file</button><div id="exportmsg"></div>
  </div>${!billingOk() ? "-->" : ""}
  ${invoiceCard(job)}
  ${!billingOk() ? "" : `<div class="card"><h2>Delete</h2>${view.confirmDel === "job" ? `<div class="row"><span class="small">Delete this whole ${noun} from every synced device? This can't be undone.</span><button class="btn danger sm" data-act="delJob">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<button class="btn danger sm" data-act="askDel" data-what="job">Delete this ${noun}</button>`}</div>`}`;
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
  const c = view.calc || (view.calc = {});
  Object.entries({vdCsa:"2.5", vdIb:"", vdL:"", vdType:"Other", adZs:"", adT:"0.1", adK:"115", dcKw:"", dcPh:"1", dcPf:"1", zsDev:"BS EN 60898 MCB Type B", zsIn:"32", zsT:"0.4",
    lpLive:"2.5", lpCpc:"1.5", lpL:"", lpZe:"", lpHot:"Yes", pfZ:"", pfPh:"1", rgR1:"", rgRn:"", rgR2:"", ttI:"30", irA:"", irB:"", irC:"", czIn:"", czCa:"1", czCg:"1", czCi:"1", czCc:"1",
    mdLt:"", mdHt:"", mdCk:"", mdCkS:"No", mdSk:"", mdSkN:"", mdWh:"", mdSh:"", mdEv:"", owV:"", owI:"", owR:""}).forEach(([k, v]) => { if (c[k] === undefined) c[k] = v; });
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
    <div class="auto" id="calc-dc">${calcDc()}</div></div>
  <div class="card"><h2>Max Zs lookup</h2>
    <label class="field"><span>Device</span><select data-calc="zsDev">${Object.keys(ZS).map(d => `<option${c.zsDev === d ? " selected" : ""}>${esc(d)}</option>`).join("")}</select></label>
    <div class="grid2">${inp("Rating","zsIn","A")}</div>${ch("Disconnection time","zsT",["0.4","5"])}
    <div class="auto" id="calc-zs">${calcZs()}</div><div class="muted small">BS 7671 Tables 41.2–41.4 (Cmin 0.95). The 80% figure is the GN3 rule of thumb for readings taken at room temperature.</div></div>
  <div class="card"><h2>R1+R2 and Zs from cable length</h2>
    ${ch("Line (mm²)","lpLive",CSA)}${ch("cpc (mm²)","lpCpc",CSA)}
    <div class="grid2">${inp("Length","lpL","m")}${inp("Ze / Zdb","lpZe","Ω")}</div>${ch("At operating temperature (×1.2)","lpHot",["Yes","No"])}
    <div class="auto" id="calc-lp">${calcLp()}</div><div class="muted small">Copper resistance at 20 °C (mΩ/m per conductor). ×1.2 converts to 70 °C for comparing with the BS 7671 maximum.</div></div>
  <div class="card"><h2>Prospective fault current</h2>
    <div class="grid2">${inp("Loop impedance Zs or Ze","pfZ","Ω")}</div>${ch("Supply","pfPh",["1","3"])}
    <div class="auto" id="calc-pf">${calcPf()}</div><div class="muted small">PFC = Uo ÷ Z. For three-phase, the common site approximation is 2 × the single-phase PSCC – use a measured value where you can.</div></div>
  <div class="card"><h2>Ring final continuity</h2>
    <div class="grid2">${inp("r1 (line end-to-end)","rgR1","Ω")}${inp("rn (neutral end-to-end)","rgRn","Ω")}</div><div class="grid2">${inp("r2 (cpc end-to-end)","rgR2","Ω")}</div>
    <div class="auto" id="calc-rg">${calcRg()}</div></div>
  <div class="card"><h2>TT earth electrode</h2>${ch("RCD IΔn (mA)","ttI",["30","100","300","500"])}
    <div class="auto" id="calc-tt">${calcTt()}</div><div class="muted small">RA × IΔn ≤ 50 V (Reg 411.5.3). Above 200 Ω the electrode may not be stable – GN3 guidance.</div></div>
  <div class="card"><h2>Insulation resistance in parallel</h2>
    <div class="grid2">${inp("Circuit A","irA","MΩ")}${inp("Circuit B","irB","MΩ")}</div><div class="grid2">${inp("Circuit C (optional)","irC","MΩ")}</div>
    <div class="auto" id="calc-ir">${calcIr()}</div><div class="muted small">1/Rt = 1/R1 + 1/R2 + … – why a whole board reads lower than any one circuit.</div></div>
  <div class="card"><h2>Tabulated current needed (It)</h2>
    <div class="grid2">${inp("Device rating In","czIn","A")}${inp("Ca (ambient)","czCa","")}</div><div class="grid2">${inp("Cg (grouping)","czCg","")}${inp("Ci (insulation)","czCi","")}</div>${inp("Cc (0.725 BS 3036, else 1)","czCc","")}
    <div class="auto" id="calc-cz">${calcCz()}</div><div class="muted small">It ≥ In ÷ (Ca × Cg × Ci × Cc). Then pick a cable from the BS 7671 Appendix 4 table for your installation method with It at least this.</div></div>
  <div class="card"><h2>Maximum demand (domestic, with diversity)</h2>
    <div class="grid2">${inp("Lighting total","mdLt","kW")}${inp("Heating & fixed power","mdHt","kW")}</div>
    <div class="grid2">${inp("Cooker(s) total","mdCk","kW")}${ch("Cooker has a socket","mdCkS",["Yes","No"])}</div>
    <div class="grid2">${inp("Socket circuits – largest","mdSk","A")}${inp("Other socket circuits (sum of ratings)","mdSkN","A")}</div>
    <div class="grid2">${inp("Water heater (thermostatic)","mdWh","kW")}${inp("Electric shower(s) – largest","mdSh","kW")}</div>${inp("EV charger (no diversity)","mdEv","A")}
    <div class="auto" id="calc-md">${calcMd()}</div><div class="muted small">On-Site Guide Appendix A diversity for households (lighting 66%; heating 10 A + 50% of the rest; cooking 10 A + 30% of the rest + 5 A for a cooker socket; largest socket circuit 100% + 40% of the others; shower and water heater 100%). A guide only – check it against your copy of the OSG and the DNO fuse.</div></div>
  <div class="card"><h2>Ohm's law &amp; power</h2><div class="muted small">Fill in any two.</div>
    <div class="grid2">${inp("Voltage","owV","V")}${inp("Current","owI","A")}</div>${inp("Resistance","owR","Ω")}
    <div class="auto" id="calc-ow">${calcOw()}</div></div>`;
}
const f2 = (x, d = 2) => Number(x).toFixed(d);
function calcZs(){ const c = view.calc, t = ZS[c.zsDev], r = t && t[+c.zsIn]; if (!t) return "";
  if (!r) return `<span class="muted">No table value for ${esc(c.zsIn)} A – ratings: ${Object.keys(t).join(", ")}</span>`;
  const v = c.zsT === "5" ? r[1] : r[0]; if (v == null) return `<span class="muted">No ${c.zsT} s value for this rating</span>`;
  return `Max Zs <b>${f2(v)} Ω</b> · 80% for measured readings <b>${f2(v * 0.8)} Ω</b>`; }
function calcLp(){ const c = view.calc, L = num(c.lpL), a = RES[c.lpLive], b = RES[c.lpCpc]; if (L === null || !a || !b) return `<span class="muted">Enter the length</span>`;
  const r = (a + b) * L / 1000, rh = c.lpHot === "Yes" ? r * 1.2 : r, ze = num(c.lpZe);
  return `R1+R2 = (${a} + ${b}) × ${L} ÷ 1000 = <b>${f2(r, 3)} Ω</b>${c.lpHot === "Yes" ? ` → ×1.2 = <b>${f2(rh, 3)} Ω</b>` : ""}${ze !== null ? `<br>Zs = ${ze} + ${f2(rh, 3)} = <b>${f2(ze + rh)} Ω</b>` : ""}`; }
function calcPf(){ const c = view.calc, z = num(c.pfZ); if (!z) return `<span class="muted">Enter an impedance</span>`;
  const i = 230 / z / 1000; return c.pfPh === "3" ? `Single-phase ${f2(i)} kA → three-phase approx <b>${f2(i * 2)} kA</b>` : `PFC = 230 ÷ ${z} = <b>${f2(i)} kA</b>`; }
function calcRg(){ const c = view.calc, r1 = num(c.rgR1), rn = num(c.rgRn), r2 = num(c.rgR2); if (r1 === null || rn === null) return `<span class="muted">Enter r1 and rn</span>`;
  const out = [`r1 and rn ${Math.abs(r1 - rn) <= 0.05 ? pill("pass","within 0.05 Ω") : pill("fail","differ by " + f2(Math.abs(r1 - rn)) + " Ω – check for a break or bad joint")}`, `Expected L–N at each socket ≈ (r1 + rn) ÷ 4 = <b>${f2((r1 + rn) / 4, 3)} Ω</b>`];
  if (r2 !== null) { out.push(`Expected R1+R2 at each socket ≈ (r1 + r2) ÷ 4 = <b>${f2((r1 + r2) / 4, 3)} Ω</b>`); out.push(`r2 ÷ r1 = ${f2(r2 / r1)} (≈1.67 for 2.5/1.5 T&amp;E, 1.0 for singles)`); }
  return out.join("<br>"); }
function calcTt(){ const c = view.calc, i = num(c.ttI); if (!i) return ""; const ra = 50 / (i / 1000); return `Max RA = 50 ÷ ${i / 1000} = <b>${Math.round(ra)} Ω</b>${ra > 200 ? " (aim for 200 Ω or less for a stable electrode)" : ""}`; }
function calcIr(){ const c = view.calc, v = [c.irA, c.irB, c.irC].map(num).filter(x => x); if (v.length < 2) return `<span class="muted">Enter at least two readings</span>`;
  const t = 1 / v.reduce((a, x) => a + 1 / x, 0); return `Combined = 1 ÷ (${v.map(x => "1/" + x).join(" + ")}) = <b>${f2(t)} MΩ</b>`; }
function calcCz(){ const c = view.calc, i = num(c.czIn), k = ["czCa","czCg","czCi","czCc"].map(x => num(c[x]) || 1); if (!i) return `<span class="muted">Enter the device rating</span>`;
  const f = k.reduce((a, x) => a * x, 1); return `It ≥ ${i} ÷ (${k.join(" × ")}) = ${i} ÷ ${f2(f, 3)} = <b>${f2(i / f, 1)} A</b>`; }
function calcMd(){ const c = view.calc, A = kw => kw * 1000 / 230, parts = [];
  const lt = num(c.mdLt), ht = num(c.mdHt), ck = num(c.mdCk), sk = num(c.mdSk), skn = num(c.mdSkN), wh = num(c.mdWh), sh = num(c.mdSh), ev = num(c.mdEv);
  if (lt) parts.push(["Lighting 66%", A(lt) * 0.66]);
  if (ht) { const a = A(ht); parts.push(["Heating & power", Math.min(a, 10) + Math.max(0, a - 10) * 0.5]); }
  if (ck) { const a = A(ck); parts.push(["Cooking", Math.min(a, 10) + Math.max(0, a - 10) * 0.3 + (c.mdCkS === "Yes" ? 5 : 0)]); }
  if (sk) parts.push(["Sockets", sk + (skn || 0) * 0.4]);
  if (wh) parts.push(["Water heater", A(wh)]);
  if (sh) parts.push(["Shower", A(sh)]);
  if (ev) parts.push(["EV charger", ev]);
  if (!parts.length) return `<span class="muted">Fill in what's in the property</span>`;
  const tot = parts.reduce((a, p) => a + p[1], 0);
  return parts.map(p => `${esc(p[0])}: ${f2(p[1], 1)} A`).join("<br>") + `<br><b>Total ≈ ${f2(tot, 0)} A</b> ${pill(tot <= 60 ? "pass" : tot <= 80 ? "check" : "fail", tot <= 60 ? "fits a 60 A fuse" : tot <= 80 ? "needs 80 A+" : "over 80 A – ask the DNO")}`; }
function calcOw(){ const c = view.calc, V = num(c.owV), I = num(c.owI), R = num(c.owR); let v = V, i = I, r = R;
  if (v !== null && i !== null) r = v / i; else if (v !== null && r !== null) i = v / r; else if (i !== null && r !== null) v = i * r; else return `<span class="muted">Fill in any two</span>`;
  return `V = <b>${f2(v)} V</b> · I = <b>${f2(i, 3)} A</b> · R = <b>${f2(r, 3)} Ω</b> · P = <b>${f2(v * i, 1)} W</b>`; }
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
    <button class="card-link" data-act="chapter" data-id="calc"><div class="grow"><div class="t">Calculators</div><div class="d">Volt drop · adiabatic · max Zs · R1+R2 · PFC · rings · TT · IR · It · max demand · Ohm's law</div></div></button>
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
  <div class="card"><h2>Client</h2>${field("Person ordering the report","job.client.name")}<div class="grid2">${field("Telephone","job.client.phone",{type:"tel"})}${field("Email","job.client.email",{type:"email"})}</div>${field("Client address","job.client.address",{area:true})}</div>
  <div class="card"><h2>Installation</h2>${field("Installation address","job.address",{area:true})}${field("Occupier","job.occupier")}
    ${select("Description of premises","job.premises",PREMISES.map(p => p[0]),{rerender:true})}
    <div class="grid2">${field("Estimated age of wiring","job.wiringAge",{num:true,unit:"yrs"})}${field("Date of last inspection","job.lastInsp",{type:"date"})}</div>
    ${chips("Evidence of additions / alterations","job.alterations",["Yes","No","Not apparent"])}
    ${j().alterations === "Yes" ? field("Estimated age of alterations","job.alterAge",{num:true,unit:"yrs"}) : ""}
    ${chips("Installation records available","job.records",["Yes","No"])}${field("Records held by","job.recordsHeld")}</div>
  <div class="card"><h2>Extent and limitations</h2>${field("Extent of the installation covered","job.extent",{area:true})}${field("Agreed limitations (and reasons)","job.limitations",{area:true})}
    <div class="grid2">${field("Agreed with","job.limitAgreed")}${field("Operational limitations","job.opLimits")}</div></div>
  ${evPvCard(j())}`;
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
    <details class="more"${view.confirmDel === "rev" || view.confirmDel === "board" ? " open" : ""}><summary>Supply to board, SPD and instruments</summary><div>
      <div class="grid2">${field("Supplied from","board.from")}${field("Distribution OCPD","board.ocpd",{ph:"BS / rating"})}</div>
      ${chips("Phases","board.phases",["1","3"])}${field("SPD type / status","board.spd")}
      <div class="grid2">${chips("Polarity confirmed","board.polarity",["✓","✗"])}${chips("Phase sequence","board.seq",["✓","✗","N/A"],{small:true})}</div>
      <div class="grid2">${field("Tested by","board.testedBy")}${field("Date tested","board.date",{type:"date"})}</div>
      ${field("Multifunction tester","board.mft")}<div class="grid2">${field("IR tester","board.irSerial")}${field("Loop / RCD tester","board.loopSerial")}</div>${field("Earth electrode tester","board.elecSerial")}
      ${job.example ? "" : `<div class="row"><button class="btn ghost sm" data-act="chart">Circuit chart</button><button class="btn ghost sm" data-act="labels">Labels</button>${b.circuits.length > 1 ? (view.confirmDel === "rev" ? `<button class="btn sm" data-act="revBoard">Yes, reverse numbering</button>` : `<button class="btn ghost sm" data-act="askDel" data-what="rev">Reverse circuit numbering</button>`) : ""}${typeOf(job) === "MW" ? "" : `<button class="btn ghost sm" data-act="dupBoard">Duplicate board</button>`}</div>`}
      ${job.boards.length > 1 && !job.example ? (view.confirmDel === "board" ? `<div class="row"><span class="small">Delete this board and its ${b.circuits.length} circuits?</span><button class="btn danger sm" data-act="delBoard">Delete</button><button class="btn ghost sm" data-act="cancelDel">Keep</button></div>` : `<button class="btn danger sm" data-act="askDel" data-what="board">Delete board</button>`) : ""}
    </div></details>
  </div>
  ${readBoardCard(job, b)}
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
  const done = inspFlat(job).filter(([id]) => job.insp[id.replace(".","_")]).length;
  return `<div class="card"><h2>Schedule of inspections <span class="count">${done} / ${inspFlat(job).length}</span></h2>
    <div class="muted small">${typeOf(job) === "EICR" ? "Coding an item C1, C2, C3 or FI adds it to your observations on the Report tab." : "✓ inspected and satisfactory · ✗ not satisfactory (must be put right before certifying) · N/A not applicable."}</div></div>` +
  inspSecs(job).map(([sid, title, items]) => `<div class="card"><h2>${esc(sid)}. ${esc(title)}</h2>
    <div class="insp-sec">${items.map(([id, q]) => `<div class="insp-item"><div class="q"><b>${esc(id)}</b>${esc(q)}</div>${chips("", "job.insp." + id.replace(".","_"), typeOf(job) === "EICR" ? OUTCOMES : ["✓","✗","N/A"], {small:true, codes:true}).replace('<span></span>','')}</div>`).join("")}</div>
    <button class="btn ghost sm" data-act="allOk" data-sec="${esc(sid)}">Mark the rest ✓</button></div>`).join("") + pvStringsCard(job);
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
    ${chips("Code", `job.obs.${i}.code`, ["C1","C2","C3","FI"], {codes:true})}
    <div class="field"><span>Photos</span>${thumbs(o.photos, "obs:" + o.id)}</div></div>`).join("");
  return `${banner}
  <div class="codes">${["C1","C2","C3","FI"].map(k => `<div><b>${s.counts[k]}</b><span>${k}</span></div>`).join("")}</div>
  ${dangerCard(job)}
  ${labelsCard(job)}
  ${quoteCard(job)}
  ${prevObsCard(job)}
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
    ${!billingOk() ? "" : signBlock(job)}
    <div class="grid2">${field("Date signed","job.sigDate",{type:"date"})}${field("Date of issue","job.issueDate",{type:"date"})}</div>
    ${field("Reviewed / authorised by","job.reviewer")}</div>
  ${!billingOk() ? signBlock(job) : ""}
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
    else if (loc.dataset.local === "custQ") { const q = String(view.custQ || "").toLowerCase(), l = document.getElementById("custlist"); if (l) l.innerHTML = custListHtml(customers().filter(c => !q || [c.name, c.phone, c.email, ...c.addrs].join(" ").toLowerCase().includes(q))); }
    else rerender();
    return;
  }
  const cin = e.target.closest("[data-calc]");
  if (cin) { view.calc[cin.dataset.calc] = cin.value; const u = (id, f) => { const el = document.getElementById(id); if (el) el.innerHTML = f(); }; [["calc-vd", calcVd], ["calc-ad", calcAd], ["calc-dc", calcDc], ["calc-zs", calcZs], ["calc-lp", calcLp], ["calc-pf", calcPf], ["calc-rg", calcRg], ["calc-tt", calcTt], ["calc-ir", calcIr], ["calc-cz", calcCz], ["calc-md", calcMd], ["calc-ow", calcOw]].forEach(([id, f]) => u(id, f)); return; }
  const el = e.target.closest("[data-bind]"); if (!el) return;
  const [root, ...rest] = el.dataset.bind.split(".");
  const obj = roots()[root]; if (!obj) return;
  let path = rest.join(".");
  setPath(obj, path, el.value);
  if (root === "job" && path === "reportNo") obj.numPending = false;
  if (root === "settings" && (path === "sendUrl" || path === "sendKey")) { scheduleSync(1500); settings.billingOwner = false; }
  if (path.includes(".lines.")) { const q = j(); const qt = document.getElementById("qtot"), it = document.getElementById("itot"); if (qt && q.quote) qt.innerHTML = totalsHtml(q.quote.lines); if (it && q.invoice) it.innerHTML = totalsHtml(q.invoice.lines); }
  if (root === "settings") flush();
  else markDirty(j());
  if (el.hasAttribute("data-rerender")) { if (path === "dev") { const c = curCirc(); if (c && ZS[c.dev] && !ZS[c.dev][+c.rating]) c.rating = ""; } rerender(); }
  else { refreshDerived(); if (view.tab === "labels" && (/\.label$/.test(path) || /^labExtras\.\d+\.(text|sub)$/.test(path) || path === "labelModuleMm")) drawLabelPreview(); if (root === "circ" && (path === "no" || path === "desc")) { const h = document.querySelector(".top h1"); const c = curCirc(); if (h && c) h.innerHTML = `${esc(curBoard().ref)} · Circuit ${esc(c.no)}<span class="sub">${esc(c.desc || "No description")}</span>`; } }
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
    case "newType": { const nj = newJob(a.dataset.type); jobs.push(nj); markDirty(nj); assignNumber(nj); view = {screen:"job", jobId:nj.id, tab:"job", board:0, circ:null}; render(); break; }
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
    case "money": if (billingOk()) { view = {screen:"money"}; render(); } break;
    case "billingOn": (async () => { const m = document.getElementById("billmsg"), code = document.getElementById("ownercode").value;
      if (String(code).trim().length < 4) { m.innerHTML = `<div class="warnline">Use at least 4 characters.</div>`; return; }
      try { const h = await billingHash(code); const o = await api("owner", { hash: h }); settings.billingOwner = true; settings.ownerHash = h; lsWrite(); rerender(); toast(o.created ? "Owner passcode set – owner access unlocked on this device" : "Owner access unlocked on this device"); }
      catch(err){ m.innerHTML = `<div class="errline">${esc(/wrong/i.test(err.message) ? "That passcode isn't right." : err.message)}</div>`; } })(); break;
    case "devLoad": loadDevices(); break;
    case "devRemove": (async () => { view.confirmDel = null; try { await api("revokeDevice", { id: a.dataset.id }); toast("Device removed"); } catch(err){ toast(String(err.message || err)); } loadDevices(); })(); break;
    case "devAllow": (async () => { try { await api("restoreDevice", { id: a.dataset.id }); toast("Device allowed back – send it the connection code"); } catch(err){ toast(String(err.message || err)); } loadDevices(); })(); break;
    case "rotateKey": (async () => { view.confirmDel = null; const nk = "bf-" + Array.from(crypto.getRandomValues(new Uint8Array(18)), x => "abcdefghijklmnopqrstuvwxyz0123456789"[x % 36]).join("");
      try { await api("rotateKey", { newKey: nk }); settings.sendKey = nk; lsWrite(); rerender(); toast("Connection code changed – re-connect your other devices with the new code"); }
      catch(err){ const m = document.getElementById("rotmsg"); if (m) m.innerHTML = `<div class="errline">${esc(err.message || err)}</div>`; } })(); break;
    case "billingOff": settings.billingOwner = false; settings.ownerHash = ""; lsWrite(); rerender(); break;
    case "makeQuote": makeQuote(job, false).then(() => { view.tab = "quote"; render(); }); break;
    case "openQuote": view.tab = "quote"; render(); break;
    case "addC3": makeQuote(job, true).then(rerender); break;
    case "sendQuote": emailDoc(job, "quote"); break;
    case "printQuote": printHtml(docHtml(job, "quote"), "quote"); break;
    case "quoteToJob": { job.quote.status = "Accepted"; const nj = quoteToJob(job, a.dataset.type); view = {screen:"job", jobId:nj.id, tab:"job", board:0, circ:null}; render(); toast(`${TYPES[a.dataset.type]} started – the quote lines are the work description`); break; }
    case "makeInvoice": makeInvoice(job).then(() => { view.tab = "invoice"; render(); }); break;
    case "openInvoice": view.tab = "invoice"; render(); break;
    case "sendInvoice": emailDoc(job, "invoice"); break;
    case "printInvoice": printHtml(docHtml(job, "invoice"), "invoice"); break;
    case "backToFinish": view.tab = TABS[typeOf(job)].some(x => x[0] === "report") ? "report" : "cert"; render(); break;
    case "openDoc": view = {screen:"job", jobId:a.dataset.id, tab:a.dataset.kind, board:0, circ:null}; render(); break;
    case "addLine": { const arr = getPath(roots().job, a.dataset.base.split(".").slice(1).join(".")); arr.push({desc:"", qty:"1", price:""}); markDirty(job); rerender(); break; }
    case "delLine": { const arr = getPath(roots().job, a.dataset.base.split(".").slice(1).join(".")); arr.splice(+a.dataset.i, 1); markDirty(job); rerender(); break; }
    case "addFromPrices": view.pricePick = view.pricePick === a.dataset.base ? null : a.dataset.base; rerender(); break;
    case "pickPrice": { const arr = getPath(roots().job, a.dataset.base.split(".").slice(1).join(".")); const p = priceList()[+a.dataset.i]; arr.push({desc:p.desc, qty:"1", price:p.price}); view.pricePick = null; markDirty(job); rerender(); break; }
    case "addPrice": priceList().push({desc:"", price:""}); lsWrite(); rerender(); break;
    case "delPrice": priceList().splice(+a.dataset.i, 1); lsWrite(); rerender(); break;
    case "changePin": view.changePin = true; rerender(); break;
    case "savePin": { const p1 = document.getElementById("newpin").value, p2 = document.getElementById("newpin2").value, m = document.getElementById("lockmsg");
      if (!/^\d{4,6}$/.test(p1)) { m.innerHTML = `<div class="warnline">Use 4 to 6 digits.</div>`; break; }
      if (p1 !== p2) { m.innerHTML = `<div class="warnline">The two PINs don't match.</div>`; break; }
      settings.pinSalt = uid(); sha(settings.pinSalt + p1).then(h => { settings.pinHash = h; settings.pinLen = p1.length; settings.lock = "On"; view.changePin = false; lsWrite(); rerender(); toast("PIN saved – the app will ask for it next time it opens"); }); break; }
    case "bioSetup": bioAvailable().then(async ok => { if (!ok) { toast("This device can't do fingerprint / face unlock from the app – use your PIN."); return; } try { await bioRegister(); rerender(); toast("Fingerprint / face unlock set up"); } catch(err){ toast("Couldn't set up fingerprint / face: " + (err.message || err)); } }); break;
    case "bioOff": settings.bioId = ""; lsWrite(); rerender(); break;
    case "newFrom": { const nj = newJobFrom(job, a.dataset.type); jobs.push(nj); markDirty(nj); assignNumber(nj); view = {screen:"job", jobId:nj.id, tab:"job", board:0, circ:null}; render(); toast(`New ${TYPES[a.dataset.type]} started from this job`); break; }
    case "copyFrom": { const src = jobs.find(x => x.id === a.dataset.id); if (!src) break; copyFrom(job, src); markDirty(job); rerender(); toast("Copied – check everything and re-test"); break; }
    case "prevObs": { const o = job.prevObs[+a.dataset.i]; if (!o) break; job.obs.push({id:uid(), text:o.text, loc:o.loc || "", reg:o.reg || "", code:o.code || "", src:"prev", photos:[]}); o.added = true; markDirty(job); rerender(); break; }
    case "dupBoard": { const b = curBoard(); const nb = copyBoard(b, job.boards.length + 1); job.boards.push(nb); view.board = job.boards.length - 1; markDirty(job); render(); toast(`${nb.ref} created with the same circuits – rename it and test`); break; }
    case "chart": printHtml(circuitChartHtml(job, curBoard()), "circuits"); break;
    case "labels": case "openLabels": view.tab = "labels"; view.circ = null; render(); break;
    case "labToggle": { const c = curBoard().circuits[+a.dataset.i]; if (c) { c.noLabel = !c.noLabel; markDirty(job); rerender(); } break; }
    case "rbUse": { const d = view.read.devs[+a.dataset.i]; d.use = !d.use; rerender(); break; }
    case "rbCurve": { const d = view.read.devs[+a.dataset.i]; d.curve = a.dataset.v; d.conf = d.conf === "low" && d.rating ? "medium" : d.conf; rerender(); break; }
    case "rbType": { const d = view.read.devs[+a.dataset.i]; d.rcdType = d.rcdType === a.dataset.v ? "" : a.dataset.v; rerender(); break; }
    case "rbApply": applyBoardRead(); break;
    case "rbMode": view.read.mode = a.dataset.v; rerender(); break;
    case "rbSide": { const r = view.read; if (r.side !== a.dataset.v) { r.devs.reverse(); r.side = a.dataset.v; const bb = j().boards.find(x => x.id === r.boardId); if (bb) bb.labDir = r.side === "right" ? "rtl" : "ltr"; } rerender(); break; }
    case "revBoard": { reverseBoard(job, curBoard()); view.confirmDel = null; rerender(); toast("Circuit numbers reversed – circuit 1 is now at the other end"); break; }
    case "rbCancel": view.read = null; view.tab = "circuits"; render(); break;
    case "aiSave": (async () => { const k = (document.getElementById("aikey") || {}).value || ""; const m = document.getElementById("aimsg");
      try { await api("setAiKey", { aiKey: k.trim() }); settings.aiReady = true; lsWrite(); rerender(); toast("AI key saved to your Google script"); }
      catch(err){ if (m) m.innerHTML = `<div class="errline">${esc(/Unknown action/i.test(err.message) ? "Your Google script needs updating first – paste in the new script and redeploy." : err.message)}</div>`; } })(); break;
    case "aiOff": (async () => { try { await api("setAiKey", { aiKey: "" }); settings.aiReady = false; lsWrite(); rerender(); toast("AI key removed"); } catch(err){ toast(String(err.message || err)); } })(); break;
    case "formAllOk": { const F = FORMS[typeOf(job)], f = formInit(job), c = F.checks.find(x => x.id === a.dataset.c); if (c) c.items.forEach(([id]) => { if (!f.chk[c.id + "_" + id]) f.chk[c.id + "_" + id] = "✓"; }); markDirty(job); rerender(); break; }
    case "formRole": { const f = formInit(job), r = a.dataset.r, i = f.roles.indexOf(r); if (i >= 0) f.roles.splice(i, 1); else f.roles.push(r); markDirty(job); rerender(); break; }
    case "presetOpen": view.presetOpen = view.presetOpen === a.dataset.t ? null : a.dataset.t; rerender(); break;
    case "frowPreset": { const F = FORMS[typeOf(job)], t = F.tables.find(x => x.id === a.dataset.t), p = t && t.presets[+a.dataset.i]; if (!p) break; const f = formInit(job); (f.rows[t.id] = f.rows[t.id] || []).push(Object.assign({}, p)); markDirty(job); rerender(); break; }
    case "formAi": formAi(); break;
    case "frowAdd": { const f = formInit(job), rows = f.rows[a.dataset.t] = f.rows[a.dataset.t] || []; rows.push({ ref: String(rows.length + 1) }); view.frowOpen = a.dataset.t + ":" + (rows.length - 1); markDirty(job); rerender(); break; }
    case "frowDup": { const f = formInit(job), rows = f.rows[a.dataset.t], src = rows[+a.dataset.i]; const n = Object.assign({}, src, { ref: String(rows.length + 1), res: "" }); rows.push(n); view.frowOpen = a.dataset.t + ":" + (rows.length - 1); markDirty(job); rerender(); break; }
    case "frowDel": { const f = formInit(job); f.rows[a.dataset.t].splice(+a.dataset.i, 1); view.frowOpen = null; markDirty(job); rerender(); break; }
    case "lostOk": view.photoLost = null; rerender(); break;
    case "labCsv": saveLabelCsv(job, curBoard()); break;
    case "exAdd": { const b = curBoard(), k = a.dataset.kind, [t, m] = EXTRA_KINDS[k]; labExtras(job, b).push({ id: uid(), kind: k, text: t, sub: k === "rcd" ? "30mA" : "", pos: 0, mods: m }); markDirty(job); rerender(); break; }
    case "exDel": { const b = curBoard(); labExtras(job, b).splice(+a.dataset.i, 1); markDirty(job); rerender(); break; }
    case "exReset": { const b = curBoard(); b.labExtras = defaultExtras(job, b, job.boards.indexOf(b)); markDirty(job); rerender(); break; }
    case "labPng": saveLabelPng(job, curBoard()); break;
    case "copyLabels": { const t = labItems(job, curBoard(), false).map(it => `${it.no} ${it.big} ${it.small}`.replace(/\s+/g, " ").trim()).join("\n");
      const done = () => toast(`Copied ${curBoard().circuits.length} labels – paste them into Pro Label Tool one per breaker`);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => toast(t)); else toast(t); break; }
    case "openDanger": view.tab = "danger"; render(); break;
    case "backToReport": view.tab = "report"; render(); break;
    case "sendDanger": if (billingOk()) sendDanger(); break;
    case "printDanger": printHtml(dangerHtml(job), "danger"); break;
    case "clearSigPath": { const [rt, ...rs] = a.dataset.path.split("."); setPath(roots()[rt], rs.join("."), ""); markDirty(job); rerender(); break; }
    case "due": view = {screen:"due"}; render(); break;
    case "ask": view = {screen:"ask"}; render(); break;
    case "train": view = {screen:"train"}; render(); break;
    case "nvq": view = {screen:"nvq"}; render(); break;
    case "nvqFw": { const pj = portfolioJob(true); pj.portfolio.fw = a.dataset.v; markDirty(pj); rerender(); break; }
    case "nvqNew": { const pj = portfolioJob(true), it = { id: uid(), date: today(), title: "", units: {}, types: { photo: true }, photos: [] }; pj.portfolio.items.push(it); markDirty(pj); view.pfItem = it.id; render(); break; }
    case "nvqFromJob": view.nvqPick = !view.nvqPick; rerender(); break;
    case "nvqUseJob": { const pj = portfolioJob(true), src = jobs.find(x => x.id === a.dataset.id); if (!src) break;
      const t = typeOf(src), circ = (src.boards || []).reduce((n, b2) => n + b2.circuits.length, 0);
      const acct = `${TYPE_LONG[t] || t} at ${jobTitle(src)} on ${ukDate(src.inspDate)}${src.reportNo ? " (" + src.reportNo + ")" : ""}.${circ ? ` ${circ} circuit${circ === 1 ? "" : "s"} on ${src.boards.length} board${src.boards.length === 1 ? "" : "s"}.` : ""}${t === "EICR" ? " Overall: " + outcomeText(src) + "." : ""}

[Describe what YOU did: safe isolation, the work, tests carried out and results, decisions you made, handover.]`;
      const it = { id: uid(), date: src.inspDate || today(), title: `${TYPES[t] || t} – ${jobTitle(src)}`, where: String(src.address || "").split("\n").slice(-1)[0] || "", setting: /domestic/i.test(src.premises || "") ? "Domestic" : src.premises ? "Commercial" : "", account: acct, units: {}, types: { certificate: true, photo: true }, photos: [], jobRef: src.id };
      pj.portfolio.items.push(it); markDirty(pj); view.nvqPick = false; view.pfItem = it.id; render(); break; }
    case "nvqOpen": view.pfItem = a.dataset.id; render(); break;
    case "nvqBack": view.pfItem = null; view.confirmDel = null; render(); break;
    case "nvqType": { const pj = portfolioJob(), it = pj.portfolio.items.find(x => x.id === view.pfItem); it.types = it.types || {}; it.types[a.dataset.v] = !it.types[a.dataset.v]; markDirty(pj); rerender(); break; }
    case "nvqAi": nvqAi("acct"); break;
    case "nvqWitDraft": nvqAi("wit"); break;
    case "nvqDel": { const pj = portfolioJob(); pj.portfolio.items = pj.portfolio.items.filter(x => x.id !== view.pfItem); markDirty(pj); view.pfItem = null; view.confirmDel = null; render(); break; }
    case "nvqPrintItem": { const pj = portfolioJob(), it = pj.portfolio.items.find(x => x.id === view.pfItem); if (!it) break; (async () => { await loadJobPhotos(pj); const ref = it.jobRef && jobs.find(x => x.id === it.jobRef && !x.deleted); let html = nvqPackHtml(pj, [it]); if (ref) { await loadJobPhotos(ref); html = html.replace("</body>", `<div style="page-break-before:always"></div>` + exportHtml(ref).replace(/^[\s\S]*?<body>/, "").replace(/<\/body>[\s\S]*$/, "") + "</body>"); } printHtml(html); })(); break; }
    case "nvqExport": { const pj = portfolioJob(); if (!pj || !pj.portfolio.items.length) { toast("Add some evidence first"); break; } (async () => { await loadJobPhotos(pj); printHtml(nvqPackHtml(pj, pj.portfolio.items.slice().sort((x, y) => String(x.date).localeCompare(String(y.date))))); })(); break; }
    case "customers": view = {screen:"customers", custQ: view.custQ || ""}; render(); break;
    case "cust": view = {screen:"customer", custKey: a.dataset.k}; render(); break;
    case "custNew": { const c = customers().find(x => x.key === view.custKey); const nj = newJob(a.dataset.type); if (c) { nj.client = Object.assign(nj.client || {}, { name: c.name, phone: c.phone, email: c.email, address: (c.jobs[0].client && c.jobs[0].client.address) || "" }); nj.address = c.jobs.slice().sort((x, y) => String(y.inspDate).localeCompare(String(x.inspDate)))[0].address || ""; }
      jobs.push(nj); markDirty(nj); assignNumber(nj); view = {screen:"job", jobId:nj.id, tab:"job", board:0, circ:null}; render(); break; }
    case "am2e": view = {screen:"am2e", which: view.which}; render(); break;
    case "am2which": view.which = a.dataset.v; render(); break;
    case "trPractical": view = {screen:"train", scrollTo:"Practical (AM2 / AM2E)"}; render(); { const h = [...document.querySelectorAll(".card h2")].find(x => x.textContent.startsWith("Practical")); if (h) h.scrollIntoView(); } break;
    case "trQuick": startQuiz("practice", pickQuick(10), "Quick 10"); break;
    case "trCards": startQuiz("practice", dueIds().slice(0, 20), "Revise"); break;
    case "trWeak": startQuiz("practice", shuffle(weakIds()).slice(0, 20), "Weak spots"); break;
    case "trCalc": startQuiz("practice", shuffle(allQ().filter(q => q.calc)).slice(0, 15), "Calculations"); break;
    case "lesson": view = {screen:"lesson", lessonTopic: a.dataset.t, steps: {}}; render(); break;
    case "wStep": view.steps[a.dataset.i] = (view.steps[a.dataset.i] || 0) + 1; rerender(); break;
    case "wAll": view.steps[a.dataset.i] = 99; rerender(); break;
    case "lessonRead": { const L = lessonFor(view.lessonTopic); if (L) { tr().read[L.id] = true; lsWrite(); rerender(); } break; }
    case "lessonQuiz": { const L = lessonFor(view.lessonTopic); if (L) { tr().read[L.id] = true; lsWrite(); startQuiz("practice", shuffle(allQ().filter(q => q.topic === L.topic)).slice(0, 20).map(q => q.id), L.topic); } break; }
    case "qLesson": view = {screen:"lesson", lessonTopic: a.dataset.t, steps: {}}; render(); break;
    case "trTopic": startQuiz("practice", shuffle(allQ().filter(q => q.topic === a.dataset.t)).slice(0, 20).map(q => q.id), a.dataset.t); break;
    case "trMock": { const A = shuffle((window.BF_QB || []).filter(q => q.area === "Regs & theory")).slice(0, 20), B = shuffle((window.BF_QB || []).filter(q => q.area === "Calcs & testing")).slice(0, 20); startQuiz("mock", shuffle(A.concat(B)).map(q => q.id), "Mock exam", 60); break; }
    case "trRetry": { const z = view.quiz; const wrong = z.ids.filter(id => { const q = qById(id); return q && z.picks[id] !== q.answer; }); startQuiz("practice", wrong, "Retry missed"); break; }
    case "trAiGen": trAiGen(); break;
    case "trAiClear": tr().ai = []; Object.keys(tr().s).forEach(k => { if (k.startsWith("ai")) delete tr().s[k]; }); lsWrite(); rerender(); break;
    case "qPick": { const z = view.quiz, q = qById(z.ids[z.i]); if (!q || z.done) break; const i = +a.dataset.i;
      if (z.mode === "mock") { z.picks[q.id] = i; lsWrite(); rerender(); break; }
      if (z.picks[q.id] !== undefined) break; z.picks[q.id] = i; srMark(q.id, i === q.answer); lsWrite(); view.keepScroll = true; rerender(); break; }
    case "qNext": { const z = view.quiz; if (z.i < z.ids.length - 1) { z.i++; render(); } else { finishQuiz(); render(); } break; }
    case "qPrev": { const z = view.quiz; if (z.i > 0) { z.i--; render(); } break; }
    case "qJump": view.quiz.i = +a.dataset.i; render(); break;
    case "qQuit": { const z = view.quiz; const answered = Object.keys(z.picks).length; if (z.mode === "mock" && answered && !z.done) { finishQuiz(); render(); } else { view = {screen:"train"}; render(); } break; }
    case "askGo": askGo(); break;
    case "askTry": { const b2 = document.getElementById("askq"); if (b2) { b2.value = a.dataset.q; settings.askDraft = a.dataset.q; } askGo(); break; }
    case "askCopy": { const h = askLog()[+a.dataset.i]; if (h) { const t = h.q + "\n\n" + h.a; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Copied"), () => toast("Couldn't copy on this device")); } break; }
    case "askRemove": askLog().splice(+a.dataset.i, 1); lsWrite(); rerender(); break;
    case "askClear": settings.askLog = []; lsWrite(); rerender(); break;
    case "contacted": { const x = jobs.find(y => y.id === a.dataset.id); if (x) { x.contactedAt = Date.now(); x.updated = Date.now(); lsWrite(); scheduleSync(3000); } rerender(); break; }
    case "reinspect": { const src = jobs.find(y => y.id === a.dataset.id); if (!src) break; const nj = isForm(src) ? formFrom(src) : newJobFrom(src, "EICR"); jobs.push(nj); markDirty(nj); assignNumber(nj); view = {screen:"job", jobId:nj.id, tab:"job", board:0, circ:null}; render(); break; }
    case "addPat": { job.pat.items.push(newPatItem(job.pat.items.length + 1)); view.patItem = job.pat.items[job.pat.items.length - 1].id; markDirty(job); render(); break; }
    case "patItem": view.patItem = a.dataset.id; view.confirmDel = null; render(); break;
    case "patBack": view.patItem = null; view.confirmDel = null; render(); break;
    case "patNext": { const it = job.pat.items; const i = it.findIndex(x => x.id === view.patItem);
      if (i < it.length - 1) view.patItem = it[i + 1].id;
      else { const prev = it[i]; const n = newPatItem(it.length + 1); if (prev) Object.assign(n, {location: prev.location, cls: prev.cls, kind: prev.kind, interval: prev.interval, irv: prev.irv}); it.push(n); view.patItem = n.id; markDirty(job); }
      render(); break; }
    case "dupPat": { const it = job.pat.items, cur = it.find(x => x.id === view.patItem); const n = Object.assign(newPatItem(it.length + 1), {desc: cur.desc, location: cur.location, cls: cur.cls, kind: cur.kind, fuse: cur.fuse, len: cur.len, csa: cur.csa, interval: cur.interval}); it.push(n); view.patItem = n.id; markDirty(job); render(); break; }
    case "delPat": job.pat.items = job.pat.items.filter(x => x.id !== view.patItem); view.patItem = null; view.confirmDel = null; markDirty(job); render(); break;
    case "addString": job.pv = job.pv || {}; job.pv.strings = job.pv.strings || []; job.pv.strings.push({voc:"", isc:"", irp:"", irn:"", pol:""}); markDirty(job); rerender(); break;
    case "delString": job.pv.strings.splice(+a.dataset.i, 1); markDirty(job); rerender(); break;

    case "reload": (async () => { if (persistTimer) { clearTimeout(persistTimer); await writeNow(); } location.reload(); })(); break;
    case "copyCode": { const t = document.getElementById("conncode"); if (!t) break; const ok = () => { const m = document.getElementById("sendmsg"); a.textContent = "Copied"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(ok, () => { t.focus(); t.select(); }); else { t.focus(); t.select(); } break; }
    case "join": { const m = document.getElementById("joinmsg"); try { applyConnectionCode(document.getElementById("joincode").value); if (m) m.innerHTML = `<div class="muted small">Checking…</div>`;
      api("ping", {}).catch(err => { if (/Unknown action/i.test(String(err.message))) return {}; throw err; }).then(() => { const m2 = document.getElementById("joinmsg"); if (m2) m2.innerHTML = `<div class="muted small">Connected. Syncing now…</div>`; syncNow().then(() => rerender()); })
        .catch(err => { const m2 = document.getElementById("joinmsg"); const offline = navigator.onLine === false || /Failed to fetch|NetworkError/i.test(String(err.message));
          if (m2) m2.innerHTML = offline ? `<div class="muted small">Saved – couldn't reach Google to check it just now (no signal?). It will keep trying and sync when it can.</div>` : `<div class="errline">${esc(/wrong key/i.test(err.message) ? "That code doesn't work any more – ask the owner for the current connection code." : err.message)}</div>`; });
    } catch(err){ if (m) m.innerHTML = `<div class="errline">${esc(err.message)}</div>`; } break; }
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
    case "delJob": { if (!billingOk()) break; const i = jobs.findIndex(x => x.id === job.id);
      allPhotoIds(job).forEach(id => { photoDel(id); photoCache.delete(id); });
      if (i >= 0) jobs[i] = normaliseJob({id: job.id, type: job.type, deleted: true, updated: Date.now(), client:{}, boards:[], obs:[], insp:{}, supply:{}});
      lsWrite(); scheduleSync(1000);
      view = {screen:"home", tab:"job", board:0, circ:null}; render(); break; }
    case "addObs": job.obs.push({id:uid(), text:"", loc:"", reg:"", code:"", src:""}); markDirty(job); rerender(); setTimeout(() => { const t = document.querySelectorAll(".obs textarea"); t.length && t[t.length-1].focus(); }, 50); break;
    case "obsFromCirc": obsFromCircuit(curBoard(), curCirc()); rerender(); break;
    case "obsFromFail": { const b = job.boards.find(x => x.id === a.dataset.b); const c = b && b.circuits.find(x => x.id === a.dataset.c); if (c) obsFromCircuit(b, c); rerender(); break; }
    case "allOk": { const sec = inspSecs(job).find(s => s[0] === a.dataset.sec); sec[2].forEach(([id]) => { const k = id.replace(".","_"); if (!job.insp[k]) job.insp[k] = "✓"; }); markDirty(job); rerender(); break; }
    case "clearSig": job.sig = ""; markDirty(job); rerender(); break;
    case "export": if (billingOk()) exportReport(); break;
    case "print": if (billingOk() || job.example) printReport(); break;
    case "finish": if (billingOk()) finishAndSend(); break;
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
    const item = inspFlat(job).find(x => x[0] === id);
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
.band.logos{display:flex;align-items:center;gap:12px}
.band .bt{flex:1;min-width:0}
.band.logos{background:#fff;color:#0F1B2D;border-bottom:4px solid #1B365D;padding:8px 4px}
.band.logos b{color:#1B365D;font-size:14px}
.band img{flex:none;object-fit:contain}
.band .lg{height:62px;max-width:190px}
.band .ic{height:56px;max-width:200px}
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
.photos{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.photos figure{margin:0;border:1px solid #A6A6A6;padding:4px;break-inside:avoid;page-break-inside:avoid}
.photos img{display:block;width:100%;max-height:95mm;object-fit:contain;background:#f4f4f4}
.photos figcaption{font-size:9px;margin-top:3px}
.photos .na div{height:60px;display:flex;align-items:center;justify-content:center;background:#f4f4f4;color:#555}
`;
function exportHtml(job){
  if (typeOf(job) === "PAT") return exportPat(job);
  if (isForm(job)) return exportForm(job);
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
${band(co, true)}
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
${sec("K. Observations and recommendations")}<table class="obs"><thead><tr><th>Item</th><th>Observation</th><th>Location</th><th>Regulation</th><th>Code</th></tr></thead><tbody>${job.obs.length ? job.obs.map((o,i) => `<tr><td>${i+1}</td><td>${esc(o.text)}${(o.photos || []).length ? ` <i>(photo${o.photos.length === 1 ? "" : "s"} attached)</i>` : ""}</td><td>${esc(o.loc)}</td><td>${esc(o.reg)}</td><td class="code ${esc(o.code)}">${esc(o.code)}</td></tr>`).join("") : `<tr><td colspan="5">No observations.</td></tr>`}</tbody></table>
<p class="guide">C1 Danger present – immediate action required. C2 Potentially dangerous – urgent remedial action required. C3 Improvement recommended. FI Further investigation required without delay.</p>
<h2>Guidance for recipients</h2><p class="guide">This report assesses the condition of the electrical installation at the time of inspection, within the extent and limitations stated. Keep it safe and show it to anyone carrying out further work or the next inspection. If the overall assessment is UNSATISFACTORY, arrange for the C1, C2 and FI items to be put right by a competent person as soon as possible.</p>
${evPvExportHtml(job)}
${photosSectionHtml(job, true)}
<section style="break-before:page">${sec("Schedule of inspections")}<table class="insp"><thead><tr><th>Item</th><th>Description</th><th>Outcome</th></tr></thead><tbody>${inspSecs(job).map(([sid,t,items]) => `<tr class="grp"><td>${sid}</td><td colspan="2">${esc(t)}</td></tr>` + items.map(([id,q]) => `<tr><td>${id}</td><td>${esc(q)}</td><td>${esc(inspVal(id))}</td></tr>`).join("")).join("")}</tbody></table>
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
  const inspTable = `<section style="break-before:page">${sec("Schedule of inspections")}<table class="insp"><thead><tr><th>Item</th><th>Description</th><th>Outcome</th></tr></thead><tbody>${inspSecs(job).map(([sid,tt,items]) => `<tr class="grp"><td>${sid}</td><td colspan="2">${esc(tt)}</td></tr>` + items.map(([id,q]) => `<tr><td>${id}</td><td>${esc(q)}</td><td>${esc(job.insp[id.replace(".","_")] || "")}</td></tr>`).join("")).join("")}</tbody></table><p class="guide">✓ Inspected and satisfactory · ✗ Not satisfactory · N/A Not applicable</p></section>`;
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
${band(co, true)}
<div class="sub">${esc(TYPE_LONG[t])} – BS 7671:2018+A4:2026</div>
<table class="kv"><tbody>${row2("Certificate number", job.reportNo, "Date of issue", ukDate(job.issueDate))}${row2("Contractor", co.company, "Registration / scheme no.", co.reg)}</tbody></table>
${body}
${evPvExportHtml(job)}
${job.handover && job.handover.name ? `<h2>Customer handover</h2><table class="kv"><tbody><tr><th>Received by</th><td>${esc(job.handover.name)}</td><th>Date</th><td>${esc(ukDate(job.handover.date))}</td></tr><tr><th>Signature</th><td class="sig" colspan="3">${job.handover.sig ? `<img src="${job.handover.sig}" alt="">` : ""}</td></tr></tbody></table>` : ""}
${photosSectionHtml(job, false)}
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
async function exportReport(){ const job = j(); await loadJobPhotos(job); downloadFile(fileName(job, "html"), exportHtml(job), "text/html"); const m = document.getElementById("exportmsg"); if (m) m.innerHTML = `<div class="muted small">${IOS ? "Choose Save to Files to keep a copy." : "Saved to Downloads."}</div>`; }
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
async function printReport(){
  const job = j();
  if (IOS) { await loadJobPhotos(job); printInPlace(job); return; }
  const w = window.open("", "_blank");
  if (!w) { exportReport(); return; }
  try { w.document.write("<p style='font:16px Arial;padding:20px'>Preparing the report…</p>"); } catch(e){}
  await loadJobPhotos(job);
  w.document.open(); w.document.write(exportHtml(job).replace("</body>", "<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body>")); w.document.close();
}
async function backup(){
  const photos = await photosForBackup();
  const data = JSON.stringify({app:"blueforge-eicr", version:2, saved:new Date().toISOString(), settings, jobs: jobs.filter(x => !x.example), photos});
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
      if (d.photos && typeof d.photos === "object") Object.entries(d.photos).forEach(([id, r]) => { if (r && r.data) { photoPut({id, jobId: r.jobId, data: r.data, created: Date.now(), uploaded: false}); pendingUploads.add(id); } });
      if (d.settings && !settings.sendUrl && d.settings.sendUrl) { settings.sendUrl = d.settings.sendUrl; if (d.settings.sendKey) settings.sendKey = d.settings.sendKey; }
      lsWrite(); scheduleSync(1000);
      if (m) m.innerHTML = `<div class="muted small">Loaded ${added} job${added === 1 ? "" : "s"} (newer copies only).</div>`;
    } catch(err){ if (m) m.innerHTML = `<div class="errline">That file isn't a BlueForge EICR backup.</div>`; }
  };
  fr.readAsText(e.target.files[0]);
});

init();
})();
