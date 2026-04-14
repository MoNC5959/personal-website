// ── STEP DATA ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    name:     'SPAR CAP ALIGNMENT',
    location: 'Front Spar, Full Length',
    zoneIdx:  0,
    scanPct:  { from: 0.12, to: 0.26 },
    result:   'pass',
    defect:   null,
    hud: {
      comp:     'FRONT SPAR',
      spec:     '±0.025 mm',
      readings: ['+0.018 mm', '+0.011 mm', '+0.008 mm'],
      finalReading: '+0.008 mm',
      finalStatus:  'PASS',
      conf:     '99.2%'
    },
    logLines: [
      { t: 200,  type: 'scan', text: 'Initiating HoloLens spatial scan...' },
      { t: 600,  type: 'info', text: 'Loading blueprint: FRONT-SPAR-737-WNG-042' },
      { t: 1100, type: 'scan', text: 'Scanning spar cap geometry...' },
      { t: 1700, type: 'scan', text: 'Measuring alignment delta...' },
      { t: 2300, type: 'pass', text: 'Alignment within tolerance: +0.008mm' },
      { t: 2600, type: 'pass', text: 'CHECKPOINT PASS — Spar Cap Alignment' },
    ]
  },
  {
    name:     'RIB STATION 4 FASTENER',
    location: 'Rib Station 4, Bolt A7-R4',
    zoneIdx:  1,
    scanPct:  { from: 0.32, to: 0.46 },
    result:   'fail',
    defect:   'm1',
    hud: {
      comp:     'BOLT A7-R4',
      spec:     '35 Nm',
      readings: ['8 Nm', '11 Nm', '12 Nm'],
      finalReading: '12 Nm',
      finalStatus:  'FAIL',
      conf:     '97.8%'
    },
    logLines: [
      { t: 200,  type: 'scan', text: 'Scanning Rib Station 4 fastener pattern...' },
      { t: 700,  type: 'info', text: 'Locating Bolt A7-R4...' },
      { t: 1200, type: 'scan', text: 'Reading torque signature via AI...' },
      { t: 1750, type: 'fail', text: '!! ANOMALY DETECTED — Torque variance' },
      { t: 2100, type: 'fail', text: 'Measured: 12 Nm — Required: 35 Nm' },
      { t: 2400, type: 'fail', text: 'DEFECT LOGGED: DEF-2847 — CRITICAL' },
    ],
    action:     'Bolt A7-R4 at Rib Station 4 installed at incorrect torque. Measured 12 Nm vs. required 35 Nm. Re-torque and re-verify before assembly proceeds.',
    actionType: 'fail'
  },
  {
    name:     'LEADING EDGE SKIN PANEL',
    location: 'Leading Edge, Full Span',
    zoneIdx:  2,
    scanPct:  { from: 0.04, to: 0.16 },
    result:   'pass',
    defect:   null,
    hud: {
      comp:     'LEAD EDGE SKIN',
      spec:     '≤0.008 mm dev',
      readings: ['0.005 mm', '0.004 mm', '0.003 mm'],
      finalReading: '0.003 mm',
      finalStatus:  'PASS',
      conf:     '98.6%'
    },
    logLines: [
      { t: 200,  type: 'scan', text: 'Scanning leading edge skin contour...' },
      { t: 700,  type: 'info', text: 'Comparing against surface spec: LE-SKIN-737' },
      { t: 1300, type: 'scan', text: 'Checking panel fastener count...' },
      { t: 1800, type: 'pass', text: 'Surface deviation: 0.003mm — within spec' },
      { t: 2200, type: 'pass', text: 'All 24 fasteners detected and verified' },
      { t: 2500, type: 'pass', text: 'CHECKPOINT PASS — Leading Edge Skin Panel' },
    ]
  },
  {
    name:     'TRAILING EDGE BRACKET',
    location: 'Rear Spar, Rib Station 6',
    zoneIdx:  3,
    scanPct:  { from: 0.58, to: 0.74 },
    result:   'fail',
    defect:   'm2',
    hud: {
      comp:     'TRAIL EDGE BKTS',
      spec:     '12 fasteners',
      readings: ['7 detected', '8 detected', '9 detected'],
      finalReading: '9 / 12',
      finalStatus:  'FAIL',
      conf:     '96.4%'
    },
    logLines: [
      { t: 200,  type: 'scan', text: 'Scanning Rear Spar — Rib Station 6...' },
      { t: 700,  type: 'info', text: 'Counting upper skin fastener pattern...' },
      { t: 1200, type: 'scan', text: 'Spatial mapping fastener positions...' },
      { t: 1700, type: 'fail', text: '!! INCOMPLETE PATTERN DETECTED' },
      { t: 2050, type: 'fail', text: 'Found: 9 fasteners — Required: 12' },
      { t: 2350, type: 'fail', text: 'DEFECT LOGGED: DEF-2849 — CRITICAL' },
    ],
    action:     'Fastener pattern at Rib Station 6 upper skin incomplete. 9 of 12 fasteners installed. Missing fasteners must be installed and torqued to spec.',
    actionType: 'fail'
  },
  {
    name:     'FUEL SEAL INTEGRITY',
    location: 'Wing Box, Station 3 — Station 7',
    zoneIdx:  4,
    scanPct:  { from: 0.22, to: 0.68 },
    result:   'warning',
    defect:   'm3',
    hud: {
      comp:     'WING BOX SEAL',
      spec:     '0.02 mm max',
      readings: ['1.8 mm', '2.1 mm', '2.3 mm'],
      finalReading: '2.3 mm',
      finalStatus:  'WARN',
      conf:     '94.1%'
    },
    logLines: [
      { t: 200,  type: 'scan', text: 'Initiating wide-area wing box scan...' },
      { t: 600,  type: 'info', text: 'Checking rear spar cap gap tolerances...' },
      { t: 1100, type: 'scan', text: 'Measuring spar cap gap at Station 5...' },
      { t: 1650, type: 'warn', text: '! VARIANCE DETECTED — Gap out of tolerance' },
      { t: 2000, type: 'warn', text: 'Gap measured: 2.3mm — Tolerance: 0.02mm' },
      { t: 2300, type: 'warn', text: 'DEFECT LOGGED: DEF-2848 — WARNING' },
    ],
    action:     'Spar cap gap at Rear Spar Station 5 exceeds tolerance. Measured 2.3mm vs. 0.02mm max. Re-inspect after torque sequence.',
    actionType: 'warn'
  }
];

const DEFECT_DATA = {
  m1: {
    id:       'DEF-2847',
    title:    'Bolt A7-R4 Incorrect Torque',
    location: 'Rib Station 4, Front Spar',
    severity: 'critical',
    spec:     '35 Nm',
    measured: '12 Nm',
    specVal:  35,
    measVal:  12,
    maxVal:   40,
    action:   'Re-torque bolt to 35 Nm using calibrated torque wrench. Re-verify measurement. Obtain inspector sign-off before assembly proceeds.',
    ref:      'REF: FAA AC 43.13-1B § 7-83 / Boeing AMM 57-10-01'
  },
  m2: {
    id:       'DEF-2849',
    title:    'Fastener Pattern Incomplete',
    location: 'Rib Station 6, Upper Skin Panel',
    severity: 'critical',
    spec:     '12 fasteners',
    measured: '9 fasteners',
    specVal:  12,
    measVal:  9,
    maxVal:   12,
    action:   'Install 3 missing fasteners per drawing REV-4.2.1. Torque all fasteners to spec. Re-scan to verify full pattern before closing panel.',
    ref:      'REF: Boeing SRM 57-20-04 / FAA AC 43.13-1B § 7-31'
  },
  m3: {
    id:       'DEF-2848',
    title:    'Spar Cap Gap Out of Tolerance',
    location: 'Rear Spar, Station 5',
    severity: 'warning',
    spec:     '0.02 mm',
    measured: '2.3 mm',
    specVal:  0.02,
    measVal:  2.3,
    maxVal:   3,
    action:   'Monitor spar cap gap. Re-inspect after torque sequence. Escalate to structural engineering if gap exceeds 2.5mm before sealing wing box.',
    ref:      'REF: Boeing SRM 57-10-01 / FAA AC 43.13-2B § 4-22'
  }
};

// ── ZONE MAPPING ───────────────────────────────────────────────────────────
// maps STEPS[i].zoneIdx → sz0..sz4
const ZONE_STEP_MAP = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };

// ── AUDIT LOG ──────────────────────────────────────────────────────────────
const auditLog = [];       // { step, timestamp, result, defectId }
let scanStartTime = null;

// ── DOM REFS ───────────────────────────────────────────────────────────────
const diagram        = document.getElementById('diagram');
const scanBeam       = document.getElementById('scanBeam');
const scanAreaHL     = document.getElementById('scanAreaHL');
const scanFlash      = document.getElementById('scanFlash');
const progressFill   = document.getElementById('progressFill');
const stepCounter    = document.getElementById('stepCounter');
const stepBadge      = document.getElementById('stepBadge');
const stepName       = document.getElementById('stepName');
const stepLocation   = document.getElementById('stepLocation');
const scanBtn        = document.getElementById('scanBtn');
const logFeed        = document.getElementById('logFeed');
const actionSection  = document.getElementById('actionSection');
const actionLabel    = document.getElementById('actionLabel');
const actionBox      = document.getElementById('actionBox');
const completeBanner = document.getElementById('completeBanner');
const topBadge       = document.getElementById('topBadge');
const statusVariance     = document.getElementById('statusVariance');
const statusInspection   = document.getElementById('statusInspection');
const defectPanel    = document.getElementById('defectPanel');

// HUD refs
const dataHud    = document.getElementById('dataHud');
const hudComp    = document.getElementById('hudComp');
const hudReading = document.getElementById('hudReading');
const hudSpec    = document.getElementById('hudSpec');
const hudStatus  = document.getElementById('hudStatus');
const hudConf    = document.getElementById('hudConf');

// Spec zone refs
const specZones  = document.getElementById('specZones');
const twinToggle = document.getElementById('twinToggle');
const szEls      = [
  document.getElementById('sz0'),
  document.getElementById('sz1'),
  document.getElementById('sz2'),
  document.getElementById('sz3'),
  document.getElementById('sz4'),
];

// Audit modal refs
const auditTrailBtn  = document.getElementById('auditTrailBtn');
const auditModal     = document.getElementById('auditModal');
const auditClose     = document.getElementById('auditClose');
const auditMeta      = document.getElementById('auditMeta');
const auditStepsEl   = document.getElementById('auditSteps');
const auditSummary   = document.getElementById('auditSummary');
const signoffBtn     = document.getElementById('signoffBtn');
const signoffLocked  = document.getElementById('signoffLocked');
const signoffTs      = document.getElementById('signoffTs');

// ── HELPERS ────────────────────────────────────────────────────────────────
function appendLog(text, type = 'info') {
  const now  = new Date();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.innerHTML = `<span class="log-time">${time}</span>${text}`;
  logFeed.appendChild(entry);
  logFeed.scrollTop = logFeed.scrollHeight;
}

function setChecklistState(idx, state) {
  const item = document.getElementById(`ci${idx}`);
  if (!item) return;
  const icon = item.querySelector('.check-icon');
  item.className = `checklist-item ${state}`;
  const icons = { pass: '&#10003;', fail: '&#10005;', warning: '!', pending: '&#9675;', active: '&#9655;' };
  icon.innerHTML = icons[state] || '&#9675;';
}

function setStepBadge(state, label) {
  stepBadge.className = `step-status-badge ${state}`;
  stepBadge.textContent = label;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fmtTime(d) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── SPEC ZONE HELPERS ──────────────────────────────────────────────────────
function setZoneState(zoneIdx, state) {
  const el = szEls[zoneIdx];
  if (!el) return;
  el.classList.remove('scanning', 'pass', 'fail', 'warn');
  if (state) el.classList.add(state);
}

// ── HUD HELPERS ────────────────────────────────────────────────────────────
function showHud(step) {
  hudComp.textContent    = step.hud.comp;
  hudSpec.textContent    = step.hud.spec;
  hudReading.textContent = '—';
  hudStatus.textContent  = 'SCANNING';
  hudStatus.style.color  = 'var(--cyan)';
  hudConf.textContent    = '—';
  dataHud.classList.add('show');
}

function animateHudReadings(step, scanDurationMs) {
  const readings = step.hud.readings;
  if (!readings.length) return;
  const interval = scanDurationMs / (readings.length + 1);
  readings.forEach((val, i) => {
    setTimeout(() => {
      hudReading.textContent = val;
      hudReading.style.animation = 'none';
      void hudReading.offsetWidth;
      hudReading.style.animation = '';
    }, interval * (i + 1));
  });
}

function finaliseHud(step) {
  hudReading.textContent = step.hud.finalReading;
  hudConf.textContent    = step.hud.conf;
  const statusColorMap = { PASS: 'var(--green)', FAIL: 'var(--red)', WARN: 'var(--orange)' };
  hudStatus.textContent  = step.hud.finalStatus;
  hudStatus.style.color  = statusColorMap[step.hud.finalStatus] || 'var(--cyan)';
}

// ── SCAN ANIMATION ─────────────────────────────────────────────────────────
function animateScan(fromPct, toPct, durationMs) {
  return new Promise(resolve => {
    const diagW  = diagram.offsetWidth;
    const startX = fromPct * diagW;
    const endX   = toPct   * diagW;

    scanAreaHL.style.left  = startX + 'px';
    scanAreaHL.style.width = (endX - startX) + 'px';
    scanAreaHL.classList.add('active');
    scanBeam.style.left = startX + 'px';
    scanBeam.classList.add('active');

    const t0 = performance.now();
    function frame(now) {
      const p    = Math.min((now - t0) / durationMs, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      scanBeam.style.left = (startX + (endX - startX) * ease) + 'px';
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        scanBeam.classList.remove('active');
        scanAreaHL.classList.remove('active');
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

// ── STEP RESULT ────────────────────────────────────────────────────────────
function applyStepResult(stepIdx) {
  const step = STEPS[stepIdx];
  const ts   = new Date();

  // Record for audit trail
  auditLog.push({ step: stepIdx, timestamp: ts, result: step.result, defectId: step.defect });

  // Flash diagram
  scanFlash.classList.remove('pass', 'fail', 'warn', 'show');
  void scanFlash.offsetWidth;
  const flashClass = { pass: 'pass', fail: 'fail', warning: 'warn' }[step.result] || 'pass';
  scanFlash.classList.add(flashClass, 'show');
  setTimeout(() => scanFlash.classList.remove('show'), 900);

  // Update checklist
  const clState = step.result === 'warning' ? 'warning' : step.result;
  setChecklistState(stepIdx, clState);

  // Update spec zone
  const zoneResult = { pass: 'pass', fail: 'fail', warning: 'warn' }[step.result] || 'pass';
  setZoneState(step.zoneIdx, zoneResult);

  // Finalise HUD
  finaliseHud(step);

  // Reveal defect marker
  if (step.defect) {
    document.getElementById(step.defect).classList.add('visible');
  }

  // Update action panel (latest defect wins)
  if (step.action) {
    actionSection.style.display = 'block';
    actionLabel.style.color     = step.actionType === 'warn' ? 'var(--orange)' : 'var(--red)';
    actionLabel.textContent     = step.actionType === 'warn' ? 'VARIANCE FLAGGED' : 'ACTION REQUIRED';
    actionBox.style.background  = step.actionType === 'warn' ? 'rgba(255,149,0,0.08)' : 'var(--red-dim)';
    actionBox.style.borderColor = step.actionType === 'warn' ? 'rgba(255,149,0,0.3)'  : 'rgba(255,51,51,0.3)';
    actionBox.textContent       = step.action;
  }

  // Status bar
  if (step.result === 'fail') {
    const defectCount = document.querySelectorAll('.defect-marker.visible').length;
    topBadge.className       = 'badge badge-red';
    topBadge.textContent     = `${defectCount} DEFECT(S) FOUND`;
    statusInspection.className   = 'status-fail';
    statusInspection.textContent = `✕ DEFECT FOUND — STEP ${stepIdx + 1}`;
  } else if (step.result === 'warning') {
    statusVariance.style.display = '';
    statusInspection.className   = 'status-warn';
    statusInspection.textContent = `▲ VARIANCE — STEP ${stepIdx + 1}`;
  } else {
    if (statusInspection.className !== 'status-fail') {
      statusInspection.className   = 'status-active';
      statusInspection.textContent = `✓ STEP ${stepIdx + 1} PASSED`;
    }
  }
}

// ── RUN FULL SCAN ──────────────────────────────────────────────────────────
async function runFullScan() {
  scanBtn.disabled    = true;
  scanBtn.textContent = 'SCANNING...';
  setStepBadge('scanning', 'SCANNING');
  appendLog('Full wing inspection sequence initiated.', 'scan');
  scanStartTime = new Date();

  for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];

    // Update sidebar
    stepCounter.textContent  = `STEP ${i + 1} OF ${STEPS.length}`;
    stepName.textContent     = step.name;
    stepLocation.textContent = step.location;
    progressFill.style.width = (i / STEPS.length * 100) + '%';
    setChecklistState(i, 'active');
    setStepBadge('scanning', 'SCANNING');

    // Mark zone as scanning
    setZoneState(step.zoneIdx, 'scanning');

    // Prime HUD for this step
    showHud(step);
    animateHudReadings(step, 2800);

    appendLog(`Starting checkpoint: ${step.name}`, 'scan');

    step.logLines.forEach(line => {
      setTimeout(() => appendLog(line.text, line.type), line.t);
    });

    await animateScan(step.scanPct.from, step.scanPct.to, 2800);
    await wait(500);

    applyStepResult(i);

    await wait(i < STEPS.length - 1 ? 1000 : 600);
  }

  // ── COMPLETE ──
  progressFill.style.width  = '100%';
  stepCounter.textContent   = 'ALL STEPS COMPLETE';
  stepName.textContent      = 'INSPECTION FINISHED';
  stepLocation.textContent  = '2 defects — 1 variance — 2 passed';
  setStepBadge('done', 'COMPLETE');
  scanBtn.textContent       = 'INSPECTION COMPLETE';
  scanBtn.className         = 'scan-btn complete-btn';
  scanBtn.disabled          = true;
  completeBanner.classList.add('show');
  topBadge.className        = 'badge badge-red';
  topBadge.textContent      = '2 DEFECTS FOUND';
  statusInspection.className   = 'status-fail';
  statusInspection.textContent = '✕ INSPECTION COMPLETE — 2 FAILED';
  appendLog('Inspection sequence complete. Report generated.', 'info');
  appendLog('2 critical defects logged. Assembly hold active.', 'fail');

  // Update HUD to final summary
  hudComp.textContent    = 'INSPECTION DONE';
  hudReading.textContent = '2 DEFECTS';
  hudSpec.textContent    = 'ALL CLEAR';
  hudStatus.textContent  = 'HOLD';
  hudStatus.style.color  = 'var(--red)';
  hudConf.textContent    = '—';
}

// ── SCAN BUTTON ────────────────────────────────────────────────────────────
scanBtn.addEventListener('click', () => {
  if (!scanBtn.disabled) runFullScan();
});

// ── TWIN TOGGLE ────────────────────────────────────────────────────────────
twinToggle.addEventListener('click', () => {
  const isActive = specZones.classList.toggle('visible');
  twinToggle.classList.toggle('active', isActive);
  twinToggle.textContent = isActive ? 'SPEC VIEW ON' : 'SPEC VIEW';
  appendLog(isActive ? 'Digital twin overlay enabled.' : 'Digital twin overlay hidden.', 'info');
});

// ── DEFECT PANEL ───────────────────────────────────────────────────────────
function openDefectPanel(defectId, anchorEl) {
  const d = DEFECT_DATA[defectId];
  if (!d) return;

  document.getElementById('dpId').textContent       = `DEFECT — ${d.id}`;
  document.getElementById('dpTitle').textContent    = d.title;
  document.getElementById('dpLocation').textContent = d.location;
  document.getElementById('dpSpec').textContent     = d.spec;
  document.getElementById('dpMeasured').textContent = d.measured;
  document.getElementById('dpAction').textContent   = d.action;
  document.getElementById('dpRef').textContent      = d.ref;

  const badge = document.getElementById('dpBadge');
  badge.className   = `dp-severity-badge ${d.severity}`;
  badge.textContent = d.severity === 'critical' ? 'CRITICAL' : 'WARNING';

  document.getElementById('dpMeasured').className =
    d.severity === 'warning' ? 'dp-meas-value measured warn-val' : 'dp-meas-value measured';

  const fillPct = Math.min((d.measVal / d.maxVal) * 100, 100);
  const specPct = Math.min((d.specVal / d.maxVal) * 100, 100);
  const fill    = document.getElementById('dpTolFill');
  const specMk  = document.getElementById('dpTolSpec');
  fill.className    = d.severity === 'warning' ? 'dp-tol-fill warn-fill' : 'dp-tol-fill';
  fill.style.width  = '0%';
  specMk.style.left = specPct + '%';

  const variance = document.getElementById('dpVariance');
  const pct = (((d.measVal - d.specVal) / d.specVal) * 100).toFixed(1);
  variance.className   = d.severity === 'warning' ? 'dp-variance-label warn-lbl' : 'dp-variance-label';
  variance.textContent = `VARIANCE: ${pct > 0 ? '+' : ''}${pct}% FROM SPEC`;

  const rect     = anchorEl.getBoundingClientRect();
  const diagRect = diagram.getBoundingClientRect();
  let left = rect.left - diagRect.left + 36;
  let top  = rect.top  - diagRect.top  - 20;
  if (left + 270 > diagRect.width  - 10) left = rect.left - diagRect.left - 276;
  if (top  + 280 > diagRect.height - 10) top  = diagRect.height - 295;
  if (top < 10) top = 10;

  defectPanel.style.left    = left + 'px';
  defectPanel.style.top     = top  + 'px';
  defectPanel.style.display = 'block';
  defectPanel.dataset.for   = defectId;

  setTimeout(() => { fill.style.width = fillPct + '%'; }, 80);
}

function closeDefectPanel() {
  defectPanel.style.display = 'none';
  defectPanel.dataset.for   = '';
}

document.getElementById('dpClose').addEventListener('click', closeDefectPanel);

['m1', 'm2', 'm3'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => {
    e.stopPropagation();
    if (defectPanel.dataset.for === id && defectPanel.style.display === 'block') {
      closeDefectPanel();
    } else {
      openDefectPanel(id, document.getElementById(id));
    }
  });
});

diagram.addEventListener('click', e => {
  if (!e.target.closest('.defect-panel') && !e.target.closest('.defect-marker')) {
    closeDefectPanel();
  }
});

// ── AUDIT TRAIL MODAL ──────────────────────────────────────────────────────
function buildAuditModal() {
  const now = new Date();

  // Meta block
  auditMeta.innerHTML = `
    <div class="audit-meta-row"><span class="audit-meta-key">AIRCRAFT PART</span><span class="audit-meta-val">737-WNG-042</span></div>
    <div class="audit-meta-row"><span class="audit-meta-key">SCAN START</span><span class="audit-meta-val">${scanStartTime ? fmtTime(scanStartTime) : '—'}</span></div>
    <div class="audit-meta-row"><span class="audit-meta-key">SCAN END</span><span class="audit-meta-val">${fmtTime(now)}</span></div>
    <div class="audit-meta-row"><span class="audit-meta-key">PLATFORM</span><span class="audit-meta-val">Cognitive QA v2.4.1</span></div>
    <div class="audit-meta-row"><span class="audit-meta-key">INSPECTOR</span><span class="audit-meta-val">CGQ-INS-0472</span></div>
  `;

  // Step rows — grid: 28px | 1fr | auto
  const badgeClass = { pass: 'pass', fail: 'fail', warning: 'warn' };
  const badgeLabel = { pass: 'PASS', fail: 'FAIL', warning: 'WARN' };

  auditStepsEl.innerHTML = auditLog.map((entry, i) => {
    const step   = STEPS[entry.step];
    const defect = entry.defectId ? DEFECT_DATA[entry.defectId] : null;
    const bc     = badgeClass[entry.result] || 'pass';
    const bl     = badgeLabel[entry.result] || 'PASS';
    return `
      <div class="audit-step-row">
        <div class="audit-step-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="audit-step-info">
          <div class="audit-step-name">${step.name}</div>
          <div class="audit-step-detail">${step.location}${defect ? ` — ${defect.id}` : ''}</div>
          <span class="audit-step-badge ${bc}">${bl}</span>
        </div>
        <div class="audit-step-ts">${fmtTime(entry.timestamp)}</div>
      </div>
    `;
  }).join('');

  // Summary block
  const passed   = auditLog.filter(e => e.result === 'pass').length;
  const failed   = auditLog.filter(e => e.result === 'fail').length;
  const warnings = auditLog.filter(e => e.result === 'warning').length;
  auditSummary.innerHTML = `
    <div class="audit-summary-title">INSPECTION SUMMARY</div>
    <div class="audit-summary-stats">
      <div class="audit-stat">
        <div class="audit-stat-num ok">${passed}</div>
        <div class="audit-stat-label">PASSED</div>
      </div>
      <div class="audit-stat">
        <div class="audit-stat-num">${failed}</div>
        <div class="audit-stat-label">FAILED</div>
      </div>
      <div class="audit-stat">
        <div class="audit-stat-num wa">${warnings}</div>
        <div class="audit-stat-label">WARNINGS</div>
      </div>
      <div class="audit-stat">
        <div class="audit-stat-num">${auditLog.length}</div>
        <div class="audit-stat-label">TOTAL</div>
      </div>
    </div>
    <div class="audit-hold">DISPOSITION: ASSEMBLY HOLD — Defects DEF-2847 and DEF-2849 require corrective action before flight release.</div>
  `;

  // Timestamp field
  signoffTs.textContent = fmtTime(now);
}

let recordLocked = false;

auditTrailBtn.addEventListener('click', () => {
  buildAuditModal();
  auditModal.classList.add('show');
  // restore sign-off button if record not yet locked
  if (!recordLocked) {
    signoffBtn.style.display = '';
    signoffBtn.disabled      = false;
    signoffBtn.textContent   = 'SIGN OFF AND LOCK RECORD';
  }
});

auditClose.addEventListener('click', () => {
  auditModal.classList.remove('show');
});

auditModal.addEventListener('click', e => {
  if (e.target === auditModal) auditModal.classList.remove('show');
});

// ── SIGN-OFF & LOCK ────────────────────────────────────────────────────────
signoffBtn.addEventListener('click', () => {
  const ts = new Date();
  signoffTs.textContent  = fmtTime(ts);
  signoffBtn.disabled    = true;
  signoffBtn.textContent = 'LOCKING...';

  setTimeout(() => {
    recordLocked             = true;
    signoffBtn.style.display = 'none';
    signoffLocked.classList.add('show');
    appendLog('Audit record signed off and locked by CGQ-INS-0472.', 'info');
    appendLog('Assembly hold confirmed. Awaiting corrective action.', 'fail');
  }, 900);
});

// ── INIT ───────────────────────────────────────────────────────────────────
stepCounter.textContent  = `STEP 1 OF ${STEPS.length}`;
stepName.textContent     = STEPS[0].name;
stepLocation.textContent = STEPS[0].location;
setChecklistState(0, 'active');
appendLog('HoloLens 2 connected. Digital twin loaded.', 'scan');
appendLog('Blueprint: 737-880 Wing Assy 737-WNG-042', 'info');
appendLog('Ready — click BEGIN SCAN to start.', 'info');
