import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs";

const isSupabaseConfigured = !SUPABASE_URL.startsWith('PASTE_');
const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? SUPABASE_ANON_KEY : 'placeholder'
);
const PHOTOS_BUCKET = 'report-photos';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

const statusBanner = document.getElementById('statusBanner');
if(SUPABASE_URL.startsWith('PASTE_')){
  statusBanner.textContent = '⚠ Supabase is not configured yet — edit supabase-config.js with your project values. See README.md.';
  statusBanner.style.color = '#B8402E';
}

/* ---------- RUBRIC DATA ---------- */
const SECTIONS = [
 {id:'A',title:'Statement of the Problem',part:1,items:[
   {id:'A1',label:'Statement addresses the experiment including variables (not a yes/no question)',scale:[2,1,0]}
 ]},
 {id:'B',title:'Hypothesis',part:1,items:[
   {id:'B1',label:'Statement predicts a relationship between the IV & DV',scale:[2,1,0]},
   {id:'B2',label:'Statement gives specific direction to the prediction',scale:[2,1,0]},
   {id:'B3',label:'A rationale is given for the hypothesis',scale:[2,1,0]}
 ]},
 {id:'C',title:'Variables',part:1,items:[
   {id:'C1',label:'IV correctly identified and operationally defined',scale:[3,2,1,0]},
   {id:'C2',label:'Levels of IV given (3+ for full credit)',scale:[3,2,1,0]},
   {id:'C3',label:'DV correctly identified and operationally defined',scale:[3,2,1,0]},
   {id:'C4',label:'1st controlled variable correctly identified and relevant',scale:[2,1,0]},
   {id:'C5',label:'2nd controlled variable correctly identified and relevant',scale:[2,1,0]},
   {id:'C6',label:'3rd controlled variable correctly identified and relevant',scale:[2,1,0]}
 ]},
 {id:'D',title:'Materials',part:1,items:[
   {id:'D1',label:'All materials used are listed and quantified',scale:[2,1,0]},
   {id:'D2',label:'No unused or extra materials are listed',scale:[2,1,0]}
 ]},
 {id:'E',title:'Procedure and Set-Up Diagrams',part:1,items:[
   {id:'E1',label:'Procedure is presented in numbered list form',scale:[2,1,0]},
   {id:'E2',label:'Procedure is in a logical sequence',scale:[2,1,0]},
   {id:'E3',label:'Steps for repeated trials are included',scale:[2,1,0]},
   {id:'E4',label:'Multiple relevant diagrams of setup are provided',scale:[2,1,0]},
   {id:'E5',label:'All diagrams are appropriately labeled with units',scale:[2,1,0]},
   {id:'E6',label:'Procedure detailed enough to repeat the experiment accurately',scale:[3,2,1,0]}
 ]},
 {id:'F',title:'Qualitative Observations',part:1,items:[
   {id:'F1',label:'Observations about the set-up are provided',scale:[2,1,0]},
   {id:'F2',label:'Observations about the procedure are provided',scale:[2,1,0]},
   {id:'F3',label:'Observations about the results are provided',scale:[2,1,0]}
 ]},
 {id:'G',title:'Quantitative Data - Data Table',part:1,items:[
   {id:'G1',label:'All raw data provided with units and labels',scale:[3,2,1,0]},
   {id:'G2',label:'Condensed data table (only data to be graphed), one sample calc per derived variable',scale:[2,1,0]}
 ]},
 {id:'H',title:'Graph',part:2,items:[
   {id:'H1',label:'Appropriate graph type is provided for the data',scale:[4,3,2,1,0]},
   {id:'H2',label:'Graph properly titled and axes labeled',scale:[4,3,2,1,0]},
   {id:'H3',label:'Appropriate scale and units included, no axis breaks',scale:[4,3,2,1,0]}
 ]},
 {id:'I',title:'Statistics',part:2,items:[
   {id:'I1',label:'Statistics of Central Tendency used (3 for full credit)',scale:[3,2,1,0]},
   {id:'I2',label:'Example calculation given for each central-tendency stat, with units',scale:[2,1,0]},
   {id:'I3',label:'Statistics of variation included',scale:[2,1,0]},
   {id:'I4',label:'Example calculation given for each variation stat, with units',scale:[2,1,0]},
   {id:'I5',label:'Two additional accurately calculated statistics included',scale:[2,1,0],stateOnly:true}
 ]},
 {id:'J',title:'Possible Experimental Errors',part:2,items:[
   {id:'J1',label:'1st specific error identified & effect on results discussed',scale:[3,2,1,0]},
   {id:'J2',label:'2nd specific error identified & effect on results discussed',scale:[3,2,1,0]}
 ]},
 {id:'K',title:'Analysis of Claim/Evidence/Reason',part:2,items:[
   {id:'K1',label:'Data trend — claim completed logically',scale:[2,1,0]},
   {id:'K2',label:'Data trend — evidence completed logically',scale:[2,1,0]},
   {id:'K3',label:'Data trend — reasoning completed logically',scale:[2,1,0]},
   {id:'K4',label:'Outliers — claim completed logically',scale:[2,1,0]},
   {id:'K5',label:'Outliers — evidence completed logically',scale:[2,1,0]},
   {id:'K6',label:'Outliers — reasoning completed logically',scale:[2,1,0]},
   {id:'K7',label:'Variation — claim completed logically',scale:[2,1,0],stateOnly:true},
   {id:'K8',label:'Variation — evidence completed logically',scale:[2,1,0],stateOnly:true},
   {id:'K9',label:'Variation — reasoning completed logically',scale:[2,1,0],stateOnly:true}
 ]},
 {id:'L',title:'Conclusion',part:2,items:[
   {id:'L1',label:'Hypothesis is restated',scale:[2,1,0]},
   {id:'L2',label:'Hypothesis — claim completed logically',scale:[2,1,0]},
   {id:'L3',label:'Hypothesis — evidence completed logically',scale:[2,1,0]},
   {id:'L4',label:'Hypothesis — reasoning completed logically',scale:[2,1,0]}
 ]},
 {id:'M',title:'Applications and Recommendations',part:2,items:[
   {id:'M1',label:'Suggestions to improve the experiment, with rationale (4 needed; 3 at Regionals)',scale:[4,3,2,1,0],regionalMax:3},
   {id:'M2',label:'Suggestions for practical applications (4 needed; 2 at Regionals)',scale:[4,3,2,1,0],regionalMax:2},
   {id:'M3',label:'Suggestions for future experiments (4 needed; 3 at Regionals)',scale:[4,3,2,1,0],regionalMax:3}
 ]}
];

/* ---------- APP STATE ---------- */
let currentInvId = null;
let level = 'regional';
let roster = [];
let currentTeamNumber = null;
let scores = {};
let images = [];        // in-memory working set: [{mediaType, base64, url?, storagePath?}]
let finalized = false;
let saveTimer = null;
let currentSectionIdx = 0;
let currentImageIdx = 0;

function isVisible(item){ return !(level==='regional' && item.stateOnly); }
function effScale(item){
  if(level==='regional' && item.regionalMax!=null) return item.scale.filter(v=>v<=item.regionalMax);
  return item.scale;
}
function effMax(item){ return effScale(item)[0] ?? 0; }
function partMax(part){
  let total=0;
  SECTIONS.filter(s=>s.part===part).forEach(sec=> sec.items.filter(isVisible).forEach(it=> total+=effMax(it)));
  return total;
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

/* ---------- SECTION STEPPER RENDER ---------- */
const root = document.getElementById('sectionStepper');
function renderSectionStepper(){
  const sec = SECTIONS[currentSectionIdx];
  const visItems = sec.items.filter(isVisible);
  const secMax = visItems.reduce((s,it)=>s+effMax(it),0);
  const secScore = visItems.reduce((s,it)=>s+(scores[it.id]??0),0);

  const tabsHTML = SECTIONS.map((s,i)=>
    `<button class="section-tab ${i===currentSectionIdx?'active':''}" data-idx="${i}">${s.id}</button>`
  ).join('');

  const itemsHTML = visItems.map(item=>{
    const scaleHTML = effScale(item).map(v=>{
      const sel = scores[item.id]===v ? 'selected':'';
      return `<button class="scale-btn large ${sel}" data-item="${item.id}" data-val="${v}">${v}</button>`;
    }).join('');
    return `<div class="stepper-item"><div class="stepper-item-label">${item.label}</div><div class="stepper-item-scale">${scaleHTML}</div></div>`;
  }).join('');

  root.innerHTML = `
    <div class="section-tabs">${tabsHTML}</div>
    <div class="part-heading"><h2>${sec.part===1?'Part I — Design & Construction':'Part II — Data, Analysis & Conclusions'}</h2><span class="max">/ ${partMax(sec.part)} pts</span></div>
    <div class="stepper-section-head"><h3><span class="letter">${sec.id}</span>${sec.title}</h3><span class="totals mono">${secScore} / ${secMax}</span></div>
    <div class="stepper-items">${itemsHTML}</div>
    <div class="stepper-nav">
      <button class="btn ghost" id="prevSectionBtn" ${currentSectionIdx===0?'disabled':''}>← Previous</button>
      <span class="stepper-progress mono">Section ${currentSectionIdx+1} of ${SECTIONS.length}</span>
      <button class="btn teal" id="nextSectionBtn" ${currentSectionIdx===SECTIONS.length-1?'disabled':''}>Next →</button>
    </div>
  `;

  root.querySelectorAll('.section-tab').forEach(b=>b.addEventListener('click',()=>{
    currentSectionIdx = Number(b.dataset.idx);
    renderSectionStepper();
  }));
  root.querySelectorAll('.scale-btn').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.item, val=Number(b.dataset.val);
    scores[id] = (scores[id]===val) ? null : val;
    renderSectionStepper(); updateTotals(); queueSave();
  }));
  const prevBtn = document.getElementById('prevSectionBtn');
  const nextBtn = document.getElementById('nextSectionBtn');
  prevBtn.addEventListener('click',()=>{ if(currentSectionIdx>0){ currentSectionIdx--; renderSectionStepper(); } });
  nextBtn.addEventListener('click',()=>{ if(currentSectionIdx<SECTIONS.length-1){ currentSectionIdx++; renderSectionStepper(); } });
}

function updateTotals(){
  const p1max=partMax(1), p2max=partMax(2);
  let p1=0,p2=0;
  SECTIONS.forEach(sec=> sec.items.filter(isVisible).forEach(it=>{
    const v=scores[it.id]??0; if(sec.part===1) p1+=v; else p2+=v;
  }));
  document.getElementById('totPart1').textContent = `${p1} / ${p1max}`;
  document.getElementById('totPart2').textContent = `${p2} / ${p2max}`;
  const raw = p1+p2;
  document.getElementById('totRaw').textContent = raw;
  const matM = document.getElementById('multMaterials').checked?0.95:1;
  const fakeM = document.getElementById('multFake').checked?0.25:1;
  const offM = Number(document.getElementById('multOffTopic').value);
  const mult = matM*fakeM*offM;
  document.getElementById('totMult').textContent = `×${mult.toFixed(2)}`;
  const final = (raw*mult);
  document.getElementById('totFinal').textContent = final.toFixed(2);
  updateReport(p1max,p2max,raw,mult,final);
  updateRosterScoreDisplay(final);
}

function updateReport(p1max,p2max,raw,mult,final){
  const invName = document.getElementById('invSelect').selectedOptions[0]?.textContent || '';
  const teamName = (roster.find(r=>r.number===currentTeamNumber)||{}).name || '';
  let lines = [];
  lines.push(`${invName} — Experimental Design (Division B)`);
  lines.push(`Team ${currentTeamNumber||'—'}${teamName?' — '+teamName:''}`);
  lines.push('');
  SECTIONS.forEach(sec=>{
    const vis = sec.items.filter(isVisible);
    const max = vis.reduce((s,it)=>s+effMax(it),0);
    const got = vis.reduce((s,it)=>s+(scores[it.id]??0),0);
    lines.push(`${sec.id}. ${sec.title}: ${got} / ${max}`);
  });
  lines.push('');
  lines.push(`Raw Total: ${raw} / ${p1max+p2max}`);
  lines.push(`Multiplier: ×${mult.toFixed(2)}`);
  lines.push(`Final Score: ${final.toFixed(2)}`);
  document.getElementById('reportText').value = lines.join('\n');
}
document.getElementById('copyReportBtn').addEventListener('click', async ()=>{
  const ta = document.getElementById('reportText');
  try{ await navigator.clipboard.writeText(ta.value); }
  catch(e){ ta.select(); document.execCommand('copy'); }
  const btn = document.getElementById('copyReportBtn');
  const old = btn.textContent; btn.textContent='Copied!'; setTimeout(()=>btn.textContent=old,1200);
});

document.getElementById('levelToggle').addEventListener('click',(e)=>{
  const btn=e.target.closest('button'); if(!btn) return;
  level = btn.dataset.level;
  document.querySelectorAll('#levelToggle button').forEach(b=>b.classList.toggle('active',b===btn));
  saveInvConfig();
  renderSectionStepper(); updateTotals(); queueSave();
});
['multMaterials','multFake'].forEach(id=>document.getElementById(id).addEventListener('change',()=>{updateTotals(); queueSave();}));
document.getElementById('multOffTopic').addEventListener('input',(e)=>{
  document.getElementById('offTopicVal').textContent = Number(e.target.value).toFixed(2);
  updateTotals(); queueSave();
});

/* ---------- IMAGE HANDLING ---------- */
const dropZone=document.getElementById('dropZone'), fileInput=document.getElementById('fileInput');
const imgThumbs=document.getElementById('imgThumbs');
const mainImageWrap=document.getElementById('mainImageWrap'), pageIndicator=document.getElementById('pageIndicator');
const prevPageBtn=document.getElementById('prevPageBtn'), nextPageBtn=document.getElementById('nextPageBtn');

dropZone.addEventListener('click',()=>{ if(!finalized) fileInput.click(); });
dropZone.addEventListener('dragover',(e)=>{e.preventDefault(); if(!finalized) dropZone.classList.add('dragover');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop',(e)=>{e.preventDefault(); dropZone.classList.remove('dragover'); if(!finalized) handleFiles(e.dataTransfer.files);});
fileInput.addEventListener('change',()=>handleFiles(fileInput.files));
prevPageBtn.addEventListener('click',()=>{ if(currentImageIdx>0){ currentImageIdx--; renderMainImage(); renderThumbs(); } });
nextPageBtn.addEventListener('click',()=>{ if(currentImageIdx<images.length-1){ currentImageIdx++; renderMainImage(); renderThumbs(); } });

function compressImage(file){
  return new Promise((resolve)=>{
    const img = new Image();
    const reader = new FileReader();
    reader.onload = ()=>{ img.onload = ()=>{
      const maxDim = 1500;
      let {width,height} = img;
      if(width>height && width>maxDim){ height*=maxDim/width; width=maxDim; }
      else if(height>maxDim){ width*=maxDim/height; height=maxDim; }
      const canvas=document.createElement('canvas'); canvas.width=width; canvas.height=height;
      canvas.getContext('2d').drawImage(img,0,0,width,height);
      const dataUrl = canvas.toDataURL('image/jpeg',0.72);
      resolve({mediaType:'image/jpeg', base64:dataUrl.split(',')[1], dataUrl});
    }; img.src = reader.result; };
    reader.readAsDataURL(file);
  });
}
async function rasterizePdf(file){
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data: buf}).promise;
  const pages = [];
  for(let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({scale:2});
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    pages.push({mediaType:'image/jpeg', base64: dataUrl.split(',')[1], dataUrl});
  }
  return pages;
}
async function handleFiles(list){
  for(const f of Array.from(list)){
    const isPdf = (f.type||'').includes('pdf') || f.name.toLowerCase().endsWith('.pdf');
    if(isPdf){
      const pages = await rasterizePdf(f);
      images.push(...pages);
    } else {
      images.push(await compressImage(f));
    }
  }
  currentImageIdx = images.length-1;
  renderThumbs(); renderMainImage();
  await uploadNewImagesToStorage();
}
function renderMainImage(){
  if(images.length===0){
    mainImageWrap.innerHTML = '<div class="empty-note">No pages uploaded yet.</div>';
    pageIndicator.textContent = '';
    prevPageBtn.disabled = true; nextPageBtn.disabled = true;
    return;
  }
  if(currentImageIdx>=images.length) currentImageIdx = images.length-1;
  if(currentImageIdx<0) currentImageIdx = 0;
  const im = images[currentImageIdx];
  const src = im.url || `data:${im.mediaType};base64,${im.base64}`;
  mainImageWrap.innerHTML = `<img src="${src}">`;
  mainImageWrap.querySelector('img').addEventListener('click',()=>openLightbox(src));
  pageIndicator.textContent = `Page ${currentImageIdx+1} of ${images.length}`;
  prevPageBtn.disabled = currentImageIdx===0;
  nextPageBtn.disabled = currentImageIdx===images.length-1;
}
function renderThumbs(){
  imgThumbs.innerHTML='';
  images.forEach((im,i)=>{
    const src = im.url || `data:${im.mediaType};base64,${im.base64}`;
    const wrap=document.createElement('div'); wrap.className='img-thumb-wrap' + (i===currentImageIdx?' active':'');
    wrap.innerHTML = `<img src="${src}"><button class="rm" data-i="${i}">×</button>`;
    wrap.querySelector('img').addEventListener('click',()=>{ currentImageIdx=i; renderMainImage(); renderThumbs(); });
    imgThumbs.appendChild(wrap);
  });
  imgThumbs.querySelectorAll('.rm').forEach(b=>b.addEventListener('click', async (e)=>{
    e.stopPropagation();
    const i = Number(b.dataset.i);
    const im = images[i];
    if(im.storagePath){ try{ await supabase.storage.from(PHOTOS_BUCKET).remove([im.storagePath]); }catch(err){ console.warn(err); } }
    images.splice(i,1);
    if(currentImageIdx>=i) currentImageIdx = Math.max(0, currentImageIdx-1);
    renderThumbs(); renderMainImage(); await saveCurrentTeam();
  }));
}
function openLightbox(src){
  const root = document.getElementById('lightboxRoot');
  root.innerHTML = `<div class="lightbox"><img src="${src}"></div>`;
  root.querySelector('.lightbox').addEventListener('click',()=>root.innerHTML='');
}

async function uploadNewImagesToStorage(){
  if(!currentInvId || !currentTeamNumber) return;
  for(const im of images){
    if(im.storagePath) continue; // already uploaded
    const path = `invitationals/${currentInvId}/${currentTeamNumber}/${Date.now()}-${Math.random().toString(36).slice(2,7)}.jpg`;
    try{
      const blob = await (await fetch(im.dataUrl)).blob();
      const {error} = await supabase.storage.from(PHOTOS_BUCKET).upload(path, blob, {contentType:'image/jpeg'});
      if(error) throw error;
      const {data:{publicUrl}} = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
      im.storagePath = path; im.url = publicUrl;
      delete im.base64; delete im.dataUrl; // don't keep raw base64 in memory/DB once hosted
    }catch(err){ console.error('upload failed', err); }
  }
  renderThumbs();
  await saveCurrentTeam();
}

/* ---------- FINALIZE (delete photos, keep scores) ---------- */
document.getElementById('finalizeBtn').addEventListener('click', async ()=>{
  if(!currentInvId || !currentTeamNumber) return;
  if(!confirm('Delete the uploaded photos for this team? Scores and the report will stay saved.')) return;
  const paths = images.filter(im=>im.storagePath).map(im=>im.storagePath);
  if(paths.length){ try{ await supabase.storage.from(PHOTOS_BUCKET).remove(paths); }catch(err){ console.warn(err); } }
  images = [];
  currentImageIdx = 0;
  finalized = true;
  await saveCurrentTeam();
  renderThumbs(); renderMainImage();
  document.getElementById('finalizedNote').style.display='block';
  dropZone.classList.add('disabled');
});

/* ---------- SUPABASE: INVITATIONALS ---------- */
const invSelect=document.getElementById('invSelect');

async function refreshInvSelect(){
  const {data: invs, error} = await supabase.from('invitationals').select('id,name').order('name');
  if(error){ console.error(error); return; }
  invSelect.innerHTML = '<option value="">— select or create —</option>' + invs.map(i=>`<option value="${i.id}">${escapeHtml(i.name)}</option>`).join('');
  const last = localStorage_safeGet('last-invitational-id');
  if(last && invs.find(i=>i.id===last)){ invSelect.value = last; await selectInvitational(last); }
}
// Note: this is only ever read to pre-select the dropdown for convenience on this device;
// no grading data is ever kept here — it all lives in Supabase.
function localStorage_safeGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function localStorage_safeSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

document.getElementById('createInvBtn').addEventListener('click', async ()=>{
  const name = document.getElementById('newInvName').value.trim();
  if(!name) return;
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Date.now().toString(36).slice(-4);
  await supabase.from('invitationals').insert({id, name, level:'regional'});
  document.getElementById('newInvName').value='';
  await refreshInvSelect();
  invSelect.value = id;
  await selectInvitational(id);
});
invSelect.addEventListener('change', async ()=>{
  if(invSelect.value) await selectInvitational(invSelect.value);
  else document.getElementById('invContent').style.display='none';
});

async function saveInvConfig(){
  if(!currentInvId) return;
  await supabase.from('invitationals').update({level}).eq('id', currentInvId);
}

async function selectInvitational(id){
  currentInvId = id;
  localStorage_safeSet('last-invitational-id', id);
  const {data: inv} = await supabase.from('invitationals').select('*').eq('id', id).maybeSingle();
  level = inv?.level || 'regional';
  const {data: teamRows} = await supabase.from('teams').select('number,name,final,finalized').eq('invitational_id', id);
  roster = teamRows || [];
  document.querySelectorAll('#levelToggle button').forEach(b=>b.classList.toggle('active', b.dataset.level===level));
  document.getElementById('rosterHeading').textContent = 'Roster — ' + invSelect.selectedOptions[0].textContent;
  document.getElementById('invContent').style.display='block';
  document.getElementById('gradingArea').style.display='none';
  currentTeamNumber=null;
  renderRoster();
}

function renderRoster(){
  const list = document.getElementById('rosterList');
  const empty = document.getElementById('rosterEmpty');
  list.innerHTML='';
  empty.style.display = roster.length ? 'none':'block';
  roster.slice().sort((a,b)=> (a.number||'').localeCompare(b.number||'', undefined, {numeric:true})).forEach(t=>{
    const row = document.createElement('div');
    row.className = 'roster-row' + (t.number===currentTeamNumber?' active':'');
    const status = t.finalized ? 'Finalized' : (t.final!=null ? 'In progress' : 'Not started');
    row.innerHTML = `<span class="rnum mono">${escapeHtml(t.number)}</span><span class="rname">${escapeHtml(t.name||'')}</span><span class="rstatus">${status}</span><span class="rscore mono">${t.final!=null?t.final.toFixed(2):'— pts'}</span><button class="btn small ghost" data-num="${t.number}">Grade</button>`;
    list.appendChild(row);
  });
  list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>selectTeamForGrading(b.dataset.num)));
}

document.getElementById('addTeamBtn').addEventListener('click', async ()=>{
  const number = document.getElementById('addNumber').value.trim();
  const name = document.getElementById('addName').value.trim();
  if(!number) return;
  const existing = roster.find(r=>r.number===number);
  if(existing) existing.name = name || existing.name;
  else roster.push({number, name, final:null, finalized:false});
  await supabase.from('teams').upsert(
    {invitational_id:currentInvId, number, name: (existing?existing.name:name)},
    {onConflict:'invitational_id,number'}
  );
  document.getElementById('addNumber').value=''; document.getElementById('addName').value='';
  renderRoster();
  selectTeamForGrading(number);
});

async function selectTeamForGrading(number){
  currentTeamNumber = number;
  scores={}; images=[]; finalized=false; currentSectionIdx=0; currentImageIdx=0;
  document.getElementById('finalizedNote').style.display='none';
  dropZone.classList.remove('disabled');
  try{
    const {data: d} = await supabase.from('teams').select('*')
      .eq('invitational_id', currentInvId).eq('number', number).maybeSingle();
    if(d){
      scores = d.scores||{};
      finalized = !!d.finalized;
      images = (d.images||[]).map(im=>({mediaType:im.mediaType, url:im.url, storagePath:im.storagePath}));
      if(d.mult){
        document.getElementById('multMaterials').checked = !!d.mult.materials;
        document.getElementById('multFake').checked = !!d.mult.fake;
        document.getElementById('multOffTopic').value = d.mult.offTopic ?? 1;
        document.getElementById('offTopicVal').textContent = Number(document.getElementById('multOffTopic').value).toFixed(2);
      }
      if(finalized){ document.getElementById('finalizedNote').style.display='block'; dropZone.classList.add('disabled'); }
    } else {
      document.getElementById('multMaterials').checked=false;
      document.getElementById('multFake').checked=false;
      document.getElementById('multOffTopic').value=1;
      document.getElementById('offTopicVal').textContent='1.00';
    }
  }catch(e){ console.error(e); }
  renderRoster();
  document.getElementById('gradingArea').style.display='block';
  renderThumbs(); renderMainImage();
  renderSectionStepper(); updateTotals();
}

function queueSave(){
  if(!currentInvId || !currentTeamNumber) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCurrentTeam, 900);
}
async function saveCurrentTeam(){
  if(!currentInvId || !currentTeamNumber) return;
  const rosterEntry = roster.find(r=>r.number===currentTeamNumber);
  const record = {
    invitational_id: currentInvId,
    number: currentTeamNumber,
    name: rosterEntry?.name || '',
    scores,
    finalized,
    final: rosterEntry?.final ?? null,
    images: images.map(im=>({mediaType:im.mediaType, url:im.url, storagePath:im.storagePath})),
    mult:{
      materials: document.getElementById('multMaterials').checked,
      fake: document.getElementById('multFake').checked,
      offTopic: document.getElementById('multOffTopic').value
    },
    updated_at: new Date().toISOString()
  };
  try{
    await supabase.from('teams').upsert(record, {onConflict:'invitational_id,number'});
  }catch(e){ console.error('save failed', e); }
}
function updateRosterScoreDisplay(final){
  const t = roster.find(r=>r.number===currentTeamNumber);
  if(!t) return;
  t.final = final;
  t.finalized = finalized;
  renderRoster();
}

/* ---------- INIT ---------- */
renderSectionStepper(); updateTotals(); renderMainImage();
refreshInvSelect();
