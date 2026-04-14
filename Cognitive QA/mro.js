// ── ZONE DATA ──────────────────────────────────────────────────────────────
const ZONES = [
  {
    id: 'z-nose', overlayId: 'zo-nose', name: 'NOSE / RADOME',
    status: 'good', findings: 0,
    lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
    note: 'All radome panels within spec. No delamination detected. Seals nominal.'
  },
  {
    id: 'z-cockpit', overlayId: 'zo-cockpit', name: 'COCKPIT / FWD FUSE',
    status: 'critical', findings: 1,
    lastCheck: '2025-01-14', nextDue: '2025-05-18', flightHrs: '12,842',
    note: 'DEF-003: Hairline crack at Frame 12, Skin Panel C. NDT required before next revenue flight.'
  },
  {
    id: 'z-fwd', overlayId: 'zo-fwd', name: 'FWD CABIN',
    status: 'critical', findings: 2,
    lastCheck: '2025-01-14', nextDue: '2025-03-01', flightHrs: '12,842',
    note: 'DEF-001: Missing bolt at Frame 42, Stringer 7. DEF-004: Loose fastener at Frame 61 door frame. Assembly hold active.'
  },
  {
    id: 'z-mid', overlayId: 'zo-mid', name: 'MID CABIN',
    status: 'good', findings: 0,
    lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
    note: 'All structural checks passed. No findings. Released at last A-Check.'
  },
  {
    id: 'z-aft', overlayId: 'zo-aft', name: 'AFT CABIN',
    status: 'warning', findings: 1,
    lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
    note: 'DEF-002: Misaligned bracket at Frame 38, L-Bracket B. Offset 3.2mm beyond tolerance. Monitor — repair at next scheduled check.'
  },
  {
    id: 'z-tail', overlayId: 'zo-tail', name: 'TAIL / EMPENNAGE',
    status: 'good', findings: 0,
    lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
    note: 'Horizontal and vertical stabilizers nominal. Control surface play within limits.'
  },
  {
    id: 'z-wing', overlayId: 'zo-wing', name: 'WING / ENGINE',
    status: 'good', findings: 0,
    lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
    note: 'Wing structure and engine mounts within spec. Fan blades inspected. No erosion detected.'
  }
];

// ── HISTORY DATA ───────────────────────────────────────────────────────────
const HISTORY = [
  {
    id: 'INS-2025-0004', date: '2025-01-14', type: 'UNSCHEDULED', result: 'open',
    subtype: 'Discrepancy Report — Frame 12',
    inspector: 'M. REYES', station: 'SEA · Hangar 4',
    findings: [
      'DEF-003 opened: Hairline crack at Frame 12, Skin Panel C — 4.7mm length',
      'NDT inspection initiated — pending results',
      'Aircraft placed on ground hold pending engineering disposition'
    ]
  },
  {
    id: 'INS-2025-0002', date: '2025-01-09', type: 'UNSCHEDULED', result: 'open',
    subtype: 'Discrepancy Report — FWD Cabin',
    inspector: 'T. OKAFOR', station: 'SEA · Hangar 4',
    findings: [
      'DEF-001 opened: Missing bolt at Frame 42, Stringer 7',
      'DEF-004 opened: Loose fastener at Frame 61 door frame — 8 Nm vs 25 Nm required',
      'Both items logged as open — corrective action pending'
    ]
  },
  {
    id: 'INS-2024-0047', date: '2024-11-18', type: 'A-CHECK', result: 'pass',
    subtype: 'Routine 500-hr Structural Check',
    inspector: 'T. OKAFOR', station: 'SEA · Hangar 2',
    findings: [
      '851 structural components scanned across all 7 zones',
      'Zero critical findings logged',
      'DEF-002 (Aft bracket offset) noted — within monitor threshold',
      'Signed off by T. Okafor — Released to service'
    ]
  },
  {
    id: 'INS-2024-0039', date: '2024-09-03', type: 'UNSCHEDULED', result: 'closed',
    subtype: 'Bolt Replacement — Frame 42',
    inspector: 'T. OKAFOR', station: 'SEA · Hangar 2',
    findings: [
      'DEF-002 rework: Frame 42 bolt replaced with HI-LOK HL-4118',
      'Re-torqued to 35 Nm — verified with calibrated torque wrench',
      'DEF-002 closed — cleared for service'
    ]
  },
  {
    id: 'INS-2024-0031', date: '2024-06-22', type: 'B-CHECK', result: 'pass',
    subtype: 'Structural Inspection — 2,000-hr Check',
    inspector: 'A. SINGH', station: 'LAX · Hangar 7',
    findings: [
      'Full fuselage structural scan completed — 1,204 points inspected',
      'Frame 38 bracket: 0.8mm offset noted, within tolerance at time of check',
      'Engine mounts and nacelles inspected — nominal',
      'Cleared — released to service'
    ]
  },
  {
    id: 'INS-2024-0018', date: '2024-03-10', type: 'A-CHECK', result: 'pass',
    subtype: 'Routine 500-hr Structural Check',
    inspector: 'M. REYES', station: 'SEA · Hangar 4',
    findings: [
      'All 7 zones inspected — 0 findings',
      'Previous bolt replacement (Frame 42) verified and holding',
      'Released to service — no open items'
    ]
  },
  {
    id: 'INS-2023-0062', date: '2023-11-05', type: 'C-CHECK', result: 'pass',
    subtype: '6-Year Heavy Maintenance',
    inspector: 'D. CHEN', station: 'MHV · Facility B',
    findings: [
      'Full aircraft disassembly and structural inspection',
      'Engine overhaul completed — 737 CFM56 overhauled to zero-time',
      'Fuselage repaint and corrosion treatment applied',
      'All systems tested — zero open findings at release',
      'Released to service — signed by D. Chen (DAR #7741-A)'
    ]
  }
];

// ── DEFECT DATA ────────────────────────────────────────────────────────────
const DEFECTS = {
  d1: { id: 'DEF-001', title: 'Missing Bolt', detail: 'Frame 42, Stringer 7\nRequires immediate replacement\nFastener spec: HI-LOK HL-4118', severity: 'SEVERITY: CRITICAL — GROUNDING RISK', type: 'critical' },
  d2: { id: 'DEF-002', title: 'Misaligned Bracket', detail: 'Frame 38, L-Bracket B\nOffset: 3.2mm beyond tolerance\nRequires re-alignment and re-torque', severity: 'SEVERITY: WARNING — REPAIR REQUIRED', type: 'warning' },
  d3: { id: 'DEF-003', title: 'Hairline Crack', detail: 'Frame 12, Skin Panel C\nCrack length: 4.7mm\nNon-destructive test required', severity: 'SEVERITY: CRITICAL — HOLD REQUIRED', type: 'critical' },
  d4: { id: 'DEF-004', title: 'Loose Fastener', detail: 'Frame 61, Door Frame\nTorque: 8 Nm (required: 25 Nm)\nMonitor — re-torque at next check', severity: 'SEVERITY: WARNING — MONITOR', type: 'warning' }
};

// ── DOM REFS ───────────────────────────────────────────────────────────────
const diagram   = document.getElementById('diagram');
const zoneHud   = document.getElementById('zoneHud');
const healthGrid = document.getElementById('healthGrid');
const timelineEl = document.getElementById('timeline');
const popup     = document.getElementById('popup');

// ── CLOCK ──────────────────────────────────────────────────────────────────
function updateClock() {
  const n = new Date();
  document.getElementById('clock').textContent =
    [n.getHours(), n.getMinutes(), n.getSeconds()]
      .map(v => String(v).padStart(2, '0')).join(':');
}
updateClock();
setInterval(updateClock, 1000);

// ── SCAN BAR ───────────────────────────────────────────────────────────────
const scanFill   = document.getElementById('scan-fill');
const scanPctEl  = document.getElementById('scan-pct');
const scanStatEl = document.getElementById('scan-status');
let scanPct = 0;
const scanInterval = setInterval(() => {
  scanPct += 1;
  scanFill.style.width  = scanPct + '%';
  scanPctEl.textContent = scanPct + '%';
  if (scanPct >= 100) {
    clearInterval(scanInterval);
    scanStatEl.textContent = 'COMPLETE';
    scanStatEl.style.color = 'var(--green)';
    scanPctEl.style.color  = 'var(--green)';
  }
}, 40);

// ── ZONE OVERLAYS ──────────────────────────────────────────────────────────
const STATUS_LABEL = { good: 'NOMINAL', warning: 'ATTENTION', critical: 'CRITICAL' };

// Apply health status classes to SVG zone overlays
ZONES.forEach(zone => {
  const el = document.getElementById(zone.overlayId);
  if (el) el.classList.add(zone.status);
});

// ── ZONE HUD ───────────────────────────────────────────────────────────────
let activeZoneId = null;

function showZoneHud(zoneId, triggerEl) {
  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) return;

  const findText = zone.findings === 0
    ? '0 open findings'
    : `${zone.findings} open finding${zone.findings > 1 ? 's' : ''}`;

  zoneHud.innerHTML = `
    <div class="zhud-top">
      <div class="zhud-name">${zone.name}</div>
      <button class="zhud-close" id="zhudCloseBtn">&#10005;</button>
    </div>
    <div class="zhud-status ${zone.status}">
      <div class="zhud-dot"></div>
      <span class="zhud-lbl">${STATUS_LABEL[zone.status]}</span>
    </div>
    <div class="zhud-rows">
      <div class="zhud-row"><span class="zhud-key">FINDINGS</span><span class="zhud-val">${findText}</span></div>
      <div class="zhud-row"><span class="zhud-key">LAST CHECK</span><span class="zhud-val">${zone.lastCheck}</span></div>
      <div class="zhud-row"><span class="zhud-key">NEXT DUE</span><span class="zhud-val">${zone.nextDue}</span></div>
      <div class="zhud-row"><span class="zhud-key">FLIGHT HRS</span><span class="zhud-val">${zone.flightHrs}</span></div>
    </div>
    <div class="zhud-note">${zone.note}</div>
  `;

  // Position relative to diagram container
  const svgEl     = document.getElementById('aircraftSvg');
  const svgRect   = svgEl.getBoundingClientRect();
  const diagRect  = diagram.getBoundingClientRect();
  const zoneRect  = triggerEl.getBoundingClientRect();

  const scroll = diagram.scrollTop;
  let left = zoneRect.right - diagRect.left + 12;
  let top  = (zoneRect.top - diagRect.top) + scroll - 10;
  if (left + 240 > diagRect.width - 8)  left = zoneRect.left - diagRect.left - 244;
  const viewH = diagRect.height;
  if ((zoneRect.top - diagRect.top) + 220 > viewH - 8) top = scroll + viewH - 228;
  if (top < scroll + 8) top = scroll + 8;

  zoneHud.style.left    = left + 'px';
  zoneHud.style.top     = top  + 'px';
  zoneHud.style.display = 'block';
  void zoneHud.offsetWidth;
  zoneHud.classList.add('show');

  document.getElementById('zhudCloseBtn').addEventListener('click', e => {
    e.stopPropagation();
    closeZoneHud();
  });

  // Highlight selected zone in health grid
  document.querySelectorAll('.health-zone').forEach(el => el.classList.remove('selected'));
  const gridItem = document.querySelector(`.health-zone[data-zone="${zoneId}"]`);
  if (gridItem) gridItem.classList.add('selected');

  // Highlight SVG overlay
  document.querySelectorAll('.zone-overlay').forEach(el => el.classList.remove('selected'));
  triggerEl.classList.add('selected');

  activeZoneId = zoneId;
}

function closeZoneHud() {
  zoneHud.classList.remove('show');
  setTimeout(() => { zoneHud.style.display = 'none'; }, 200);
  document.querySelectorAll('.zone-overlay').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.health-zone').forEach(el => el.classList.remove('selected'));
  activeZoneId = null;
}

// SVG zone clicks
document.getElementById('zoneOverlays').querySelectorAll('.zone-overlay').forEach(el => {
  el.addEventListener('click', e => {
    e.stopPropagation();
    const zoneId = el.dataset.zone;
    if (activeZoneId === zoneId) {
      closeZoneHud();
    } else {
      showZoneHud(zoneId, el);
    }
  });
});

// Close on diagram background click
diagram.addEventListener('click', e => {
  if (!e.target.closest('.zone-hud') && !e.target.closest('.zone-overlay') &&
      !e.target.closest('.svg-marker') && !e.target.closest('.defect-popup')) {
    closeZoneHud();
    hideDefectPopup();
  }
});

// ── HEALTH GRID ────────────────────────────────────────────────────────────
ZONES.forEach(zone => {
  const findText = zone.findings === 0 ? 'No findings' : `${zone.findings} finding${zone.findings > 1 ? 's' : ''}`;
  const el = document.createElement('div');
  el.className = `health-zone ${zone.status}`;
  el.dataset.zone = zone.id;
  el.innerHTML = `
    <div class="hz-dot"></div>
    <div class="hz-info">
      <div class="hz-name">${zone.name}</div>
      <div class="hz-find">${findText}</div>
    </div>
  `;
  el.addEventListener('click', () => {
    const overlayEl = document.getElementById(zone.overlayId);
    if (activeZoneId === zone.id) {
      closeZoneHud();
    } else {
      showZoneHud(zone.id, overlayEl);
    }
  });
  healthGrid.appendChild(el);
});

// ── INSPECTION HISTORY TIMELINE ────────────────────────────────────────────
const RESULT_LABEL = { pass: 'PASS', open: 'OPEN', closed: 'CLOSED', rework: 'REWORK' };

HISTORY.forEach((entry, i) => {
  const el = document.createElement('div');
  el.className = `tl-entry ${entry.result}${entry.result === 'open' ? ' expanded' : ''}`;

  const findingsHtml = entry.findings
    .map(f => `<div class="tl-finding">${f}</div>`)
    .join('');

  el.innerHTML = `
    <div class="tl-dot"></div>
    <div class="tl-top">
      <span class="tl-date">${entry.date}</span>
      <span>
        <span class="tl-badge">${RESULT_LABEL[entry.result]}</span>
        <span class="tl-chevron">&#9660;</span>
      </span>
    </div>
    <div class="tl-type">${entry.type}</div>
    <div class="tl-subtype">${entry.subtype}</div>
    <div class="tl-meta">
      <span>${entry.inspector}</span>
      <span>${entry.station}</span>
      <span>${entry.id}</span>
    </div>
    <div class="tl-findings">${findingsHtml}</div>
  `;

  el.addEventListener('click', () => {
    el.classList.toggle('expanded');
  });

  timelineEl.appendChild(el);
});

// ── DEFECT MARKERS ─────────────────────────────────────────────────────────
let activeDefect = null;

function showDefectPopup(id, markerEl) {
  const d = DEFECTS[id];
  if (!d) return;
  popup.className = 'defect-popup' + (d.type === 'warning' ? ' warning' : '');
  popup.innerHTML = `
    <div class="defect-popup-id">DEFECT — ${d.id}</div>
    <div class="defect-popup-title">${d.title}</div>
    <div class="defect-popup-detail">${d.detail.replace(/\n/g, '<br>')}</div>
    <div class="defect-popup-severity">${d.severity}</div>
  `;
  // getBoundingClientRect() works on SVG elements — gives viewport coords
  const rect     = markerEl.getBoundingClientRect();
  const diagRect = diagram.getBoundingClientRect();
  const scroll   = diagram.scrollTop;
  // anchor popup to the right of the marker centre; account for scroll offset
  let left = (rect.left + rect.width / 2) - diagRect.left + 18;
  let top  = (rect.top  + rect.height / 2) - diagRect.top  + scroll - 20;
  if (left + 230 > diagRect.width - 10) left = (rect.left + rect.width / 2) - diagRect.left - 238;
  if (top < scroll + 4) top = (rect.top + rect.height / 2) - diagRect.top + scroll + 20;
  popup.style.left    = left + 'px';
  popup.style.top     = top  + 'px';
  popup.style.display = 'block';
  activeDefect = id;
}

function hideDefectPopup() {
  popup.style.display = 'none';
  activeDefect = null;
}

// ── DAMAGE MAP DATA ────────────────────────────────────────────────────────
const DAMAGE_MAP = [
  {
    id: 'DEF-003', zone: 'COCKPIT / FWD FUSE', location: 'Frame 12 · Skin Panel C',
    sev: 'S1', sevLabel: 'CRITICAL', sevFill: 4,
    action: 'ground', actionLabel: 'AIRCRAFT GROUNDED',
    ref: 'AMM 53-10-11',
    basis: 'Crack exceeds SRM allowable limit — engineering disposition required before return to service'
  },
  {
    id: 'DEF-001', zone: 'FWD CABIN', location: 'Frame 42 · Stringer 7',
    sev: 'S1', sevLabel: 'CRITICAL', sevFill: 4,
    action: 'ground', actionLabel: 'AIRCRAFT GROUNDED',
    ref: 'AMM 51-40-01',
    basis: 'Missing primary structural fastener — no dispatch relief available, immediate rectification required'
  },
  {
    id: 'DEF-004', zone: 'FWD CABIN', location: 'Frame 61 · Door Frame',
    sev: 'S2', sevLabel: 'MAJOR', sevFill: 3,
    action: 'preflight', actionLabel: 'REPAIR BEFORE NEXT FLIGHT',
    ref: 'AMM 52-11-09',
    basis: 'Fastener torque 68% below minimum spec — CDL does not apply, flight safety risk confirmed'
  },
  {
    id: 'DEF-002', zone: 'AFT CABIN', location: 'Frame 38 · L-Bracket B',
    sev: 'S2', sevLabel: 'MAJOR', sevFill: 3,
    action: 'monitor', actionLabel: 'MONITOR — REPAIR AT NEXT CHECK',
    ref: 'SRM 53-00-05',
    basis: 'Bracket offset 3.2mm — within MEL monitor threshold, active trend watch required'
  }
];

const ZONE_LOAD = [
  { name: 'COCKPIT / FWD FUSE', pct: 92, level: 'high'    },
  { name: 'FWD CABIN',          pct: 88, level: 'high'    },
  { name: 'AFT CABIN',          pct: 44, level: 'medium'  },
  { name: 'NOSE / RADOME',      pct:  7, level: 'nominal' },
  { name: 'MID CABIN',          pct:  5, level: 'nominal' },
  { name: 'WING / ENGINE',      pct:  5, level: 'nominal' },
  { name: 'TAIL / EMPENNAGE',   pct:  4, level: 'nominal' }
];

// Determination: any S1 = NO-GO
const GNG = {
  value:  'NO-GO',
  reason: '2 S1 CRITICAL DEFECTS\nGROUND HOLD ACTIVE',
  isGo:   false
};

// ── DRAWER ─────────────────────────────────────────────────────────────────
const drawer     = document.getElementById('damageDrawer');
const dmgToggle  = document.getElementById('dmgToggle');
const drawerClose= document.getElementById('drawerClose');
let drawerOpen     = false;
let barsAnimated   = false;

function buildDrawer() {
  // --- Summary ---
  const s1 = DAMAGE_MAP.filter(d => d.sev === 'S1').length;
  const s2 = DAMAGE_MAP.filter(d => d.sev === 'S2').length;
  const s3 = DAMAGE_MAP.filter(d => d.sev === 'S3').length;
  const clear = ZONES.filter(z => z.findings === 0).length;
  const refs  = [...new Set(DAMAGE_MAP.map(d => d.ref))];
  const ts    = new Date().toISOString().slice(0, 16).replace('T', ' ');

  document.getElementById('drawerSummary').innerHTML = `
    <div>
      <div class="ds-block-label">AIRWORTHINESS DETERMINATION</div>
      <div class="gng-card${GNG.isGo ? ' go-state' : ''}">
        <div class="gng-value">${GNG.value}</div>
        <div class="gng-reason">${GNG.reason.replace('\n', '<br>')}</div>
      </div>
    </div>
    <div>
      <div class="ds-block-label">FINDING COUNTS</div>
      <div class="ds-counts">
        <div class="ds-count-row"><span class="ds-count-key">S1 CRITICAL</span><span class="ds-count-val s1-col">${s1}</span></div>
        <div class="ds-count-row"><span class="ds-count-key">S2 MAJOR</span><span class="ds-count-val s2-col">${s2}</span></div>
        <div class="ds-count-row"><span class="ds-count-key">S3 MINOR</span><span class="ds-count-val s3-col">${s3}</span></div>
        <div class="ds-count-row"><span class="ds-count-key">ZONES CLEAR</span><span class="ds-count-val ok-col">${clear} / ${ZONES.length}</span></div>
      </div>
    </div>
    <div>
      <div class="ds-block-label">REGULATORY BASIS</div>
      <div class="ds-refs">
        ${refs.map(r => {
          const parts = r.split(' ');
          return `<div class="ds-ref"><strong>${parts[0]}</strong> ${parts.slice(1).join(' ')}</div>`;
        }).join('')}
        <div class="ds-ref">Boeing AMM Rev 48 · MMEL Rev 12</div>
      </div>
    </div>
    <div class="ds-timestamp">ASSESSED: ${ts} UTC</div>
  `;

  // --- Matrix rows ---
  const rows = DAMAGE_MAP.map(d => {
    const segs = [1,2,3,4].map(n =>
      `<div class="sev-seg${n <= d.sevFill ? ' on-' + d.sev.toLowerCase() : ''}"></div>`
    ).join('');
    return `
      <tr>
        <td><span class="dt-id">${d.id}</span></td>
        <td>
          <div class="dt-zone">${d.zone}</div>
          <div class="dt-loc">${d.location}</div>
          <div class="dt-basis">${d.basis}</div>
        </td>
        <td>
          <div class="sev-wrap">
            <div class="sev-segs">${segs}</div>
            <span class="sev-label ${d.sev.toLowerCase()}">${d.sev} · ${d.sevLabel}</span>
          </div>
        </td>
        <td><span class="act-badge ${d.action}">${d.actionLabel}</span></td>
        <td><span class="dt-ref">${d.ref}</span></td>
      </tr>`;
  }).join('');

  // --- Zone load bars ---
  const bars = ZONE_LOAD.map(z => `
    <div class="zl-row ${z.level}">
      <span class="zl-name">${z.name}</span>
      <div class="zl-track"><div class="zl-fill" data-pct="${z.pct}"></div></div>
      <span class="zl-pct">${z.pct}%</span>
      <span class="zl-lvl">${z.level.toUpperCase()}</span>
    </div>`).join('');

  document.getElementById('drawerContent').innerHTML = `
    <div class="dc-section">
      <div class="dc-label">DAMAGE SEVERITY MATRIX</div>
      <table class="dmg-table" role="table">
        <thead>
          <tr>
            <th>DEFECT</th>
            <th>ZONE / LOCATION</th>
            <th>SEVERITY</th>
            <th>REQUIRED ACTION</th>
            <th>REFERENCE</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="dc-section">
      <div class="dc-label">ZONE DAMAGE LOAD</div>
      <div class="zl-list">${bars}</div>
    </div>
  `;
}

function openDrawer() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  dmgToggle.setAttribute('aria-expanded', 'true');
  dmgToggle.classList.add('active');
  drawerOpen = true;
  if (!barsAnimated) {
    setTimeout(() => {
      document.querySelectorAll('.zl-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
      barsAnimated = true;
    }, 340);
  }
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  dmgToggle.setAttribute('aria-expanded', 'false');
  dmgToggle.classList.remove('active');
  drawerOpen = false;
}

buildDrawer();
dmgToggle.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());
drawerClose.addEventListener('click', closeDrawer);

// Wire up SVG marker <g> elements
document.getElementById('markers').querySelectorAll('.svg-marker').forEach(el => {
  el.addEventListener('click', e => {
    e.stopPropagation();
    const id = el.id;
    activeDefect === id ? hideDefectPopup() : showDefectPopup(id, el);
  });
});
