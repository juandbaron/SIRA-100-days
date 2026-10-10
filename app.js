
const actions = MOCK_ACTIONS;
const PACT_START = new Date(Date.UTC(2026, 9, 15));
const PACT_END = new Date(Date.UTC(2027, 0, 23));
const effectiveness = actions.filter(a=>a.type==='Effectiveness');
const axisMeta = [["1. Effectiveness", "Legal and operational conditions required to reach effectiveness", "axis-blue", "✓"], ["2. PIU establishment & staffing", "Team, governance, focal points and implementation structure", "axis-purple", "◉"], ["3. Fiduciary systems, planning & operational access", "Accounts, STEP, signatures, manuals, plans and audit", "axis-orange", "▦"], ["4. Administration & logistics", "Office, equipment, connectivity and administrative setup", "axis-green", "⌂"], ["5. Implementation launch", "First 20 procurements, partnerships, safeguards and contract mobilization", "axis-slate", "▶"]];
const readiness = axisMeta.map(([title,sub,cls,icon])=>{
  const subset=actions.filter(a=>a.axis===title);
  return {title,sub,cls,icon,
    progress:subset.length?Math.round(subset.reduce((n,a)=>n+(a.progress||0),0)/subset.length):0,
    counts:[
      subset.filter(a=>a.status==='Completed'||a.status==='On track').length,
      subset.filter(a=>a.status==='At risk'||a.status==='To confirm').length,
      subset.filter(a=>a.status==='Overdue').length
    ]};
});
const statusClass = s => s==='Completed'||s==='On track'?'green':s==='At risk'||s==='To confirm'?'amber':'red';
const statusLabel = s => `<span class="pill ${statusClass(s)}">${s}</span>`;

function renderEffectiveness(){
  const el=document.getElementById('effectivenessList');
  el.innerHTML=effectiveness.map(a=>`<div class="list-card" data-action-id="${a.id}"><div class="list-top"><div><div class="status-line"><span class="dot ${statusClass(a.status)}"></span><div class="list-title">${a.title}</div></div><div class="list-meta">${a.owner}</div></div><div class="chevron">›</div></div><div class="list-footer">${statusLabel(a.status)}<span class="deadline">Target: ${a.timing}</span></div></div>`).join('');
  bindActionCards();
}
function renderReadiness(){
  const el=document.getElementById('readinessList');
  el.innerHTML=readiness.map((r,idx)=>`<div class="list-card readiness-card no-click"><div class="readiness-head"><div class="axis-icon ${r.cls}">${r.icon}</div><div class="grow"><div class="axis-title">${r.title}</div><div class="axis-sub">${r.sub}</div></div></div><div class="axis-progress"><div class="progress-bar"><span style="width:${r.progress}%"></span></div><strong>${r.progress}%</strong></div><div class="axis-counts"><span><i class="dot green"></i>${r.counts[0]}</span><span><i class="dot amber"></i>${r.counts[1]}</span><span><i class="dot red"></i>${r.counts[2]}</span></div></div>`).join('');
}
function actionCard(a){
  return `<div class="list-card" data-action-id="${a.id}"><div class="list-top"><div><div class="status-line"><span class="dot ${statusClass(a.status)}"></span><div>${statusLabel(a.status)}</div></div><div class="list-title" style="margin-top:8px">${a.id} · ${a.title}</div><div class="list-meta">${a.owner}<br>${a.axis}</div></div><div class="chevron">›</div></div><div class="list-footer"><span class="deadline">${a.timing}</span><strong>${a.progress||0}%</strong></div></div>`;
}
function bindActionCards(){document.querySelectorAll('[data-action-id]').forEach(el=>el.addEventListener('click',()=>openAction(el.dataset.actionId)));}
function renderWeek(){
  const priority=actions.filter(a=>a.week);
  document.querySelector('#weekView .meta-row span:last-child').textContent=priority.length+' actions';
  document.getElementById('weekList').innerHTML=priority.map(actionCard).join('');
  bindActionCards();
}
function renderActions(){
  const q=document.getElementById('searchInput').value.toLowerCase().trim();
  const status=document.getElementById('statusFilter').value;
  const group=document.getElementById('groupFilter').value;
  const filtered=actions.filter(a=>(status==='all'||a.status===status)&&(group==='all'||a.axis===group)&&(!q||`${a.title} ${a.owner} ${a.axis} ${a.basis} ${a.info}`.toLowerCase().includes(q)));
  document.getElementById('actionsList').innerHTML=filtered.length?filtered.map(actionCard).join(''):'<div class="list-card no-click">No actions match the filters.</div>';
  bindActionCards();
}
function openAction(id){
  const a=actions.find(x=>String(x.id)===String(id)); if(!a)return;
  document.getElementById('detailContent').innerHTML=`<div class="detail-card">${statusLabel(a.status)}<h2>${a.id} · ${a.title}</h2>
    <div class="detail-row"><div class="detail-label">Responsible institution</div><div class="detail-value">${a.owner}</div></div>
    <div class="detail-row"><div class="detail-label">Group</div><div class="detail-value">${a.axis}</div></div>
    <div class="detail-row"><div class="detail-label">Target timing</div><div class="detail-value">${a.timing}</div></div>
    <div class="detail-row"><div class="detail-label">Basis</div><div class="detail-value">${a.basis}</div></div>
    <div class="detail-row"><div class="detail-label">Progress</div><div class="detail-value"><strong>${a.progress||0}%</strong><div class="progress-bar"><span style="width:${a.progress||0}%"></span></div></div></div>
    <div class="detail-highlight"><div class="detail-label">Blocker / decision needed</div><div class="detail-value">${a.blocker}</div></div>
    <div class="detail-row"><div class="detail-label">Next step</div><div class="detail-value">${a.next}</div></div>
    <div class="detail-row"><div class="detail-label">Evidence of completion</div><div class="detail-value">${a.evidence}</div></div>
    <div class="detail-row"><div class="detail-label">Additional information required</div><div class="detail-value">${a.info}</div></div>
  </div>`;
  showView('detail');
}
function renderInfo(){
  document.getElementById('infoList').innerHTML=INFO_GAPS.map((x,i)=>`<div class="list-card no-click"><div class="list-top"><div><div class="list-title">${i+1}. ${x}</div></div></div></div>`).join('');
}
function populateGroupFilter(){
  const el=document.getElementById('groupFilter');
  axisMeta.forEach(([title])=>{const o=document.createElement('option');o.value=title;o.textContent=title;el.appendChild(o);});
}

const drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim');
function openMenu(){drawer.classList.add('open');scrim.classList.add('show');drawer.setAttribute('aria-hidden','false')}
function closeMenu(){drawer.classList.remove('open');scrim.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
document.getElementById('menuBtn').addEventListener('click',openMenu);
document.getElementById('closeMenuBtn').addEventListener('click',closeMenu);
scrim.addEventListener('click',closeMenu);
function showView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const target=document.getElementById(name+'View'); if(target)target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===name));
  window.scrollTo({top:0,behavior:'smooth'}); closeMenu();
}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.getElementById('detailBack').addEventListener('click',()=>showView('actions'));
document.getElementById('statusFilter').addEventListener('change',renderActions);
document.getElementById('groupFilter').addEventListener('change',renderActions);
document.getElementById('searchInput').addEventListener('input',renderActions);

populateGroupFilter(); renderEffectiveness(); renderReadiness(); renderWeek(); renderActions(); renderInfo();

// Executive overview synchronization
const avg=Math.round(actions.reduce((s,a)=>s+(a.progress||0),0)/actions.length);
const doneEff=effectiveness.filter(a=>a.status==='Completed').length;
const effPct=effectiveness.length?Math.round(doneEff/effectiveness.length*100):0;
document.querySelector('.progress-ring').style.setProperty('--p',avg);
document.querySelector('.progress-ring span').textContent=avg+'%';
document.querySelector('.hero-card .progress-bar span').style.width=avg+'%';
document.querySelector('.effectiveness-card .row-between strong:last-child').textContent=effPct+'%';
document.querySelector('.effectiveness-card .subtext').textContent=doneEff+' of '+effectiveness.length+' effectiveness actions confirmed completed';
document.querySelector('.effectiveness-card .progress-bar span').style.width=effPct+'%';
const statEls=document.querySelectorAll('.status-grid .mini-card strong');
statEls[0].textContent=actions.filter(a=>a.status==='On track'||a.status==='Completed').length;
statEls[1].textContent=actions.filter(a=>a.status==='At risk'||a.status==='To confirm').length;
statEls[2].textContent=actions.filter(a=>a.status==='Overdue').length;
document.querySelector('.red-tint .grow div').textContent=actions.filter(a=>a.status==='At risk'||a.status==='Overdue'||a.status==='To confirm').length+' actions requiring confirmation or attention';

// Effectiveness summary
const es=document.querySelector('#effectivenessView .effectiveness-summary');
if(es){
  es.querySelector('.row-between strong:first-child').textContent=doneEff+' of '+effectiveness.length+' confirmed completed';
  es.querySelector('.row-between strong:last-child').textContent=effPct+'%';
  es.querySelector('.progress-bar span').style.width=effPct+'%';
  es.querySelector('p').textContent='Status remains provisional until the Government/PIU provides the current effectiveness evidence.';
}


// Effectiveness target date
document.querySelectorAll('.effectiveness-card .tiny span:last-child, #effectivenessView .summary-note span:last-child')
  .forEach(el => el.textContent = 'Target date: 30 Nov. 2026');


// Automatic pact timeline: updates whenever the dashboard opens.
function updatePactTimeline(){
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  const totalDays = Math.round((PACT_END - PACT_START) / MS_PER_DAY); // 100
  let elapsedDays = Math.floor((todayUTC - PACT_START) / MS_PER_DAY);
  let remainingDays = Math.ceil((PACT_END - todayUTC) / MS_PER_DAY);

  if (todayUTC < PACT_START) {
    elapsedDays = 0;
    remainingDays = totalDays;
  } else if (todayUTC >= PACT_END) {
    elapsedDays = totalDays;
    remainingDays = 0;
  } else {
    elapsedDays = Math.max(0, Math.min(totalDays, elapsedDays));
    remainingDays = Math.max(0, Math.min(totalDays, remainingDays));
  }

  const meta = document.querySelector('#overviewView .meta-row');
  if (meta) {
    const spans = meta.querySelectorAll('span, strong');
    if (spans.length >= 2) {
      spans[0].textContent = '15 Oct. 2026 — 23 Jan. 2027';
      spans[1].textContent = `Day ${elapsedDays} of 100`;
    }
  }

  const remainingEl = document.querySelector('.hero-stat .big-number');
  if (remainingEl) remainingEl.textContent = remainingDays;

  const remainingLabel = document.querySelector('.hero-stat .muted');
  if (remainingLabel) remainingLabel.textContent = remainingDays === 1 ? 'day remaining' : 'days remaining';
}

updatePactTimeline();
