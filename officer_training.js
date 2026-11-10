/**
 * ============================================================================
 * KERALA MOTOR VEHICLES DEPARTMENT (MVD)
 * OFFICER TRAINING & QUALIFICATION MODULE
 * 
 * Features:
 *  - Official Identification & Current Posting (RTO, Joint RTO, MVI, AMVI)
 *  - Categorized Searchable Office Master (Commissionerate, RTO, Sub-RTO, Enforcement)
 *  - Academic & Technical Credentials (SSLC/Plus Two/Others, PhD/M.Tech/B.Tech/Diploma/Others, Grade)
 *  - Dynamic Additional Qualifications (Completed vs Pursuing status, Institutions, Expected/Passing Year, Remarks)
 *  - 17 Specialized Skills + Custom Skills
 *  - Repeatable In-Service Training History (Hours, Days, Weeks, Months, sorted latest first)
 *  - Entered-By Officer Details with 10-digit Mobile (+91 normalization)
 *  - Save Draft, Live Validation, Dirty Form warning, PEN Uniqueness
 *  - Profile Preview, Single Profile Print & PDF Download
 *  - Administrative Directory with 7 Filters, Pagination & Dual CSV Export (Profiles & Trainings)
 *  - Office-wise Summary Report with Overlap Handling, Excluded Drafts Count, Reporting Cut-off
 *  - Head of Office Digital Verification with Statutory Certification
 *  - Immutable Report Snapshots with Auto "Reverification Required" on roster changes
 *  - Outward / Dispatch Forwarding Workflow with Outward Number & Date Validation
 *  - Role-Based Access Control (Data Entry, Head of Office, Dispatcher, Admin)
 *  - Audit Trail in Asia/Kolkata (IST)
 *  - Supabase Cloud Persistence with LocalStorage Fallback
 * ============================================================================
 */

// --- 1. MASTER DATA: OFFICES & DESIGNATIONS ---

function escapeHtml(str) {
  if (typeof window !== 'undefined' && typeof window.escapeHtml === 'function' && window.escapeHtml !== escapeHtml) {
    return window.escapeHtml(str);
  }
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
if (typeof window !== 'undefined' && !window.escapeHtml) {
  window.escapeHtml = escapeHtml;
}

const OT_OFFICE_GROUPS = {
  "Commissionerate & DTC Offices": [
    { code: "TCO", name: "Transport Commissionerate" },
    { code: "DTC CZ I", name: "DTC CZ I, Thrissur" },
    { code: "DTC CZ II", name: "DTC Office CZ II, Ernakulam" },
    { code: "DTC NZ", name: "DTC Office NZ, Kozhikkode" },
    { code: "DTC SZ", name: "DTC Office SZ, Thiruvananthapuram" }
  ],
  "RTO Offices": [
    { code: "KL01", name: "RTO, Thiruvananthapuram" },
    { code: "KL02", name: "RTO, Kollam" },
    { code: "KL03", name: "RTO, Pathanamthitta" },
    { code: "KL04", name: "RTO, Alappuzha" },
    { code: "KL05", name: "RTO, Kottayam" },
    { code: "KL06", name: "RTO, Idukki" },
    { code: "KL07", name: "RTO, Ernakulam" },
    { code: "KL08", name: "RTO, Thrissur" },
    { code: "KL09", name: "RTO, Palakkad" },
    { code: "KL10", name: "RTO, Malappuram" },
    { code: "KL11", name: "RTO, Kozhikode" },
    { code: "KL12", name: "RTO, Wayanad" },
    { code: "KL13", name: "RTO, Kannur" },
    { code: "KL14", name: "RTO, Kasaragod" },
    { code: "KL15", name: "RTO NS, Thiruvananthapuram" },
    { code: "KL16", name: "RTO, Attingal" },
    { code: "KL17", name: "RTO, Muvattupuzha" },
    { code: "KL18", name: "RTO, Vadakara" }
  ],
  "Sub-RTO Offices": [
    { code: "KL19", name: "SRTO, Parassala" },
    { code: "KL20", name: "SRTO, Neyyattinkara" },
    { code: "KL21", name: "SRTO, Nedumangad" },
    { code: "KL22", name: "SRTO, Kazhakuttam" },
    { code: "KL23", name: "SRTO, Karunagapally" },
    { code: "KL24", name: "SRTO, Kottarakkara" },
    { code: "KL25", name: "SRTO, Punalur" }, // Corrected as per specification (was Punalal)
    { code: "KL26", name: "SRTO, Adoor" },
    { code: "KL27", name: "SRTO, Thiruvalla" },
    { code: "KL28", name: "SRTO, Mallappally" },
    { code: "KL29", name: "SRTO, Kayamkulam" },
    { code: "KL30", name: "SRTO, Chengannur" },
    { code: "KL31", name: "SRTO, Mavelikkara" },
    { code: "KL32", name: "SRTO, Cherthala" },
    { code: "KL33", name: "SRTO, Changanacherry" },
    { code: "KL34", name: "SRTO, Kanjirapally" },
    { code: "KL35", name: "SRTO, Pala" },
    { code: "KL36", name: "SRTO, Vaikom" },
    { code: "KL37", name: "SRTO, Vandiperiyar" },
    { code: "KL38", name: "SRTO, Thodupuzha" },
    { code: "KL39", name: "SRTO, Tripunithura" },
    { code: "KL40", name: "SRTO, Perumbavoor" },
    { code: "KL41", name: "SRTO, Aluva" },
    { code: "KL42", name: "SRTO, North Paravoor" },
    { code: "KL43", name: "SRTO, Mattancherry" },
    { code: "KL44", name: "SRTO, Kothamangalam" },
    { code: "KL45", name: "SRTO, Irinjalakuda" },
    { code: "KL46", name: "SRTO, Guruvayoor" },
    { code: "KL47", name: "SRTO, Kodungallur" },
    { code: "KL48", name: "SRTO, Wadakkanchery" },
    { code: "KL49", name: "SRTO, Alathur" },
    { code: "KL50", name: "SRTO, Mannarkkad" },
    { code: "KL51", name: "SRTO, Ottappalam" },
    { code: "KL52", name: "SRTO, Pattambi" },
    { code: "KL53", name: "SRTO, Perinthalmanna" },
    { code: "KL54", name: "SRTO, Ponnani" },
    { code: "KL55", name: "SRTO, Tirur" },
    { code: "KL56", name: "SRTO, Koyilandy" },
    { code: "KL57", name: "SRTO, Koduvally" },
    { code: "KL58", name: "SRTO, Thalassery" },
    { code: "KL59", name: "SRTO, Taliparamba" },
    { code: "KL60", name: "SRTO, Kanhangad" },
    { code: "KL61", name: "SRTO, Kunnathoor" },
    { code: "KL62", name: "SRTO, Ranni" },
    { code: "KL63", name: "SRTO, Angamaly" },
    { code: "KL64", name: "SRTO, Chalakudy" },
    { code: "KL65", name: "SRTO, Thirurangadi" },
    { code: "KL66", name: "SRTO, Kuttanad" },
    { code: "KL67", name: "SRTO, Uzhavoor" },
    { code: "KL68", name: "SRTO, Devikulam" },
    { code: "KL69", name: "SRTO, Udumpanchola" },
    { code: "KL70", name: "SRTO, Chittur" },
    { code: "KL71", name: "SRTO, Nilambur" },
    { code: "KL72", name: "SRTO, Mananthavady" },
    { code: "KL73", name: "SRTO, SulthanBathery" },
    { code: "KL74", name: "SRTO, Kattakada" },
    { code: "KL75", name: "SRTO, Thriprayar" },
    { code: "KL76", name: "SRTO, Nanmanda" },
    { code: "KL77", name: "SRTO, Perambra" },
    { code: "KL78", name: "SRTO, Iritty" },
    { code: "KL79", name: "SRTO, Vellarikundu" },
    { code: "KL80", name: "SRTO, Pathanapuram" },
    { code: "KL81", name: "SRTO, Varkala" },
    { code: "KL82", name: "SRTO, Chadayamangalam" },
    { code: "KL83", name: "SRTO, Konni" },
    { code: "KL84", name: "SRTO, Kondotty" },
    { code: "KL85", name: "SRTO, Ramanattukara(Feroke)" },
    { code: "KL86", name: "SRTO, Payyanur" }
  ],
  "Enforcement RTO Offices": [
    { code: "KLE01", name: "RTO Enforcement, Thiruvananthapuram" },
    { code: "KLE02", name: "RTO Enforcement, Kollam" },
    { code: "KLE03", name: "RTO Enforcement, Pathanamthitta" },
    { code: "KLE04", name: "RTO Enforcement, Alappuzha" },
    { code: "KLE05", name: "RTO Enforcement, Kottayam" },
    { code: "KLE06", name: "RTO Enforcement, Idukki" },
    { code: "KLE07", name: "RTO Enforcement, Ernakulam" },
    { code: "KLE08", name: "RTO Enforcement, Thrissur" },
    { code: "KLE09", name: "RTO Enforcement, Palakkad" },
    { code: "KLE10", name: "RTO Enforcement, Malappuram" },
    { code: "KLE11", name: "RTO Enforcement, Kozhikode" },
    { code: "KLE12", name: "RTO Enforcement, Wayanad" },
    { code: "KLE13", name: "RTO Enforcement, Kannur" },
    { code: "KLE14", name: "RTO Enforcement, Kasaragod" }
  ]
};

// Flattened lookup array
const ALL_MVD_OFFICES = [];
Object.entries(OT_OFFICE_GROUPS).forEach(([category, list]) => {
  list.forEach(item => {
    ALL_MVD_OFFICES.push({
      code: item.code,
      name: item.name,
      displayName: `${item.code} — ${item.name}`,
      category
    });
  });
});
window.ALL_MVD_OFFICES = ALL_MVD_OFFICES;

const DESIGNATION_OPTIONS = ["RTO", "Joint RTO", "MVI", "AMVI"];

const GENERAL_ED_OPTIONS = ["SSLC", "Plus Two", "Others"];

const TECH_QUAL_OPTIONS = [
  "B.Tech",
  "Diploma",
  "Others"
];

const ADDITIONAL_QUAL_OPTIONS = [
  "PHD with Post Doctoral research",
  "PHD",
  "M.Tech",
  "LLB",
  "LLM",
  "MBA",
  "PGDeG (e-Governance)",
  "Safety Engineering",
  "Safety Engineering Diploma",
  "PG Diploma in Cyber Law",
  "MCA (Computer Applications)",
  "Auto-CAD Certification",
  "Certificate in Automotive Mechatronics",
  "B.Sc. Computer Science",
  "Certified Data Analyst",
  "Others — Specify",
  "No additional Qualifications"
];

const SPECIALIZED_SKILL_OPTIONS = [
  "Legal & Prosecution",
  "Accident Investigation",
  "IT & Software",
  "AIS Standards & Homologation",
  "EV Architecture",
  "Data Analytics",
  "Radar & Speed Enforcement",
  "MV Act & Statutory Rules",
  "Vehicle Fitness Inspection",
  "Policy Drafting",
  "Heavy Commercial Vehicle Brake Systems",
  "Field Enforcement",
  "Hazardous Goods Transport",
  "PESO Regulations",
  "Transport Administration",
  "Vehicle Homologation",
  "Heavy Equipment Inspection",
  "IIT Trained",
  "ARAI",
  "CIRT",
  "IMG",
  "IDTR",
  "Others — Specify"
];
window.SPECIALIZED_SKILL_OPTIONS = SPECIALIZED_SKILL_OPTIONS;

// --- OFFICE LOCATION & DIGITAL SIGNATURE FORMATTING UTILITIES ---
function otGetOfficeLocation(officeObj, officeCode) {
  if (!officeObj && officeCode) {
    officeObj = (typeof ALL_MVD_OFFICES !== 'undefined' ? ALL_MVD_OFFICES.find(o => o.code === officeCode) : null);
  }
  if (!officeObj) return officeCode || "";
  if (officeObj.code === 'TCO') return "Thiruvananthapuram";
  if (officeObj.name && officeObj.name.includes(',')) {
    const parts = officeObj.name.split(',');
    return parts.slice(1).join(',').trim();
  }
  return officeObj.name || officeCode || "";
}
window.otGetOfficeLocation = otGetOfficeLocation;

function otFormatDigitalSignatureTimestamp(isoString) {
  const d = isoString ? new Date(isoString) : new Date();
  if (isNaN(d.getTime())) return '';
  try {
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).formatToParts(d);

    let day = '', month = '', year = '', hour = '', minute = '', dayPeriod = '';
    parts.forEach(p => {
      if (p.type === 'day') day = p.value.padStart(2, '0');
      if (p.type === 'month') month = p.value.padStart(2, '0');
      if (p.type === 'year') year = p.value;
      if (p.type === 'hour') hour = p.value.padStart(2, '0');
      if (p.type === 'minute') minute = p.value.padStart(2, '0');
      if (p.type === 'dayPeriod') dayPeriod = p.value.toUpperCase();
    });
    return `${day}-${month}-${year} ${hour}:${minute} ${dayPeriod}`;
  } catch (e) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${day}-${month}-${year} ${strHours}:${minutes} ${ampm}`;
  }
}
window.otFormatDigitalSignatureTimestamp = otFormatDigitalSignatureTimestamp;

// --- 2. SAMPLE SEED DATA (Cleaned - No hardcoded or dummy officers) ---
const SEED_OFFICER_PROFILES = [];

// --- DATA CLEANUP: Purge locally stored form drafts/caches to prevent caching issues upon load ---
try {
  const formCacheKeys = [
    'mvd_ot_form_draft',
    'mvd_ot_draft',
    'ot_form_cache',
    'otOfficerFormDraft',
    'mvd_officer_draft',
    'mvd_form_backup',
    'mvd_ot_cached_form',
    'mvd_ot_form_state'
  ];
  formCacheKeys.forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  if (typeof sessionStorage !== 'undefined') {
    try {
      Object.keys(sessionStorage).forEach(k => {
        if (k.toLowerCase().includes('form') || k.toLowerCase().includes('draft') || k.startsWith('ot_')) {
          sessionStorage.removeItem(k);
        }
      });
    } catch (e) {}
  }
} catch (e) {
  console.warn("Storage cleanup notice:", e);
}

// --- 3. STATE CONTROLLER ---
let otProfilesStore = (JSON.parse(localStorage.getItem('mvd_ot_profiles_store')) || [])
  .filter(p => p && p.id && p.status !== 'draft' && !p.id.startsWith('prof_kl01_') && !p.id.startsWith('prof_kl07_') && !p.id.startsWith('off_seed_'));

// Normalize any existing "IIT" skill entries to "IIT Trained"
otProfilesStore.forEach(p => {
  if (Array.isArray(p.specializedSkills)) {
    p.specializedSkills = p.specializedSkills.map(s => s === 'IIT' ? 'IIT Trained' : s);
  }
});

localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));
window.otProfilesStore = otProfilesStore;

let otReportSnapshotsStore = JSON.parse(localStorage.getItem('mvd_ot_report_snapshots')) || {};
window.otReportSnapshotsStore = otReportSnapshotsStore;
let otAuditLogs = JSON.parse(localStorage.getItem('mvd_ot_audit_logs')) || [];

// Office Lock Registry: Maps officeCode => authorized Gmail ID
let otOfficeLocks = JSON.parse(localStorage.getItem('mvd_ot_office_locks')) || {};
window.otOfficeLocks = otOfficeLocks;

// Cross-tab Synchronization Listener for instant multi-window unlock & status updates
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'mvd_ot_report_snapshots' && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        Object.assign(otReportSnapshotsStore, updated);
        if (window.otReportSnapshotsStore) Object.assign(window.otReportSnapshotsStore, updated);
        renderOfficeSummaryReport();
        if (typeof renderOfficerAdminDashboard === 'function') renderOfficerAdminDashboard();
        const curOffice = document.getElementById('otMainOfficeSelect')?.value;
        if (curOffice && typeof checkOfficeAccessAndLock === 'function') {
          checkOfficeAccessAndLock(curOffice);
          renderOfficeEditOptionList(curOffice);
        }
      } catch (err) {}
    }
  });

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('mvd_office_status_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'OFFICE_REVERTED') {
          const revCode = event.data.officeCode;
          const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
          const snap = snapStore[revCode];
          if (snap) {
            snap.isForwarded = false;
            snap.dispatchDetails = null;
          }
          renderOfficeSummaryReport();
          if (typeof renderOfficerAdminDashboard === 'function') renderOfficerAdminDashboard();
          const curOffice = document.getElementById('otMainOfficeSelect')?.value;
          const curCanon = (typeof getCanonicalOfficeCode === 'function') ? (getCanonicalOfficeCode(curOffice) || curOffice) : curOffice;
          if (curOffice && (curOffice === revCode || curCanon === revCode)) {
            if (typeof toggleOfficerFormDisabled === 'function') toggleOfficerFormDisabled(false);
            if (typeof checkOfficeAccessAndLock === 'function') checkOfficeAccessAndLock(curOffice);
            if (typeof renderOfficeEditOptionList === 'function') renderOfficeEditOptionList(curOffice);
          }
        }
      };
    } catch (err) {}
  }
}

// Active Session Roles:
// 'data_entry' | 'head_of_office' | 'dispatch_user' | 'admin'
let otCurrentRole = localStorage.getItem('mvd_ot_current_role') || 'head_of_office';
window.otCurrentRole = otCurrentRole;
let otActiveSubTab = 'form'; // 'form' | 'directory' | 'report' | 'roles'
let otFormDirty = false;
let otEditingProfileId = null;
let otOriginalEditingPen = null;

// Temporary staging for repeatable training records during form entry
let otStagedTrainings = [];
window.otStagedTrainings = otStagedTrainings;
let otEditingTrainingIndex = -1;

// Custom Qualifications staging
let otCustomQualificationsCount = 0;

// Administrative directory filter state
let otDirFilter = {
  search: "",
  office: "ALL",
  designation: "ALL",
  techQual: "ALL",
  addQual: "ALL",
  status: "ALL",
  skill: "ALL",
  trainingYear: "ALL",
  page: 1,
  pageSize: 10
};

// --- 4. FORMATTING & HELPER UTILITIES ---

function otFormatIST(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoString;
  }
}

function otNormalizePhone(phone) {
  if (!phone) return "";
  let clean = phone.toString().replace(/[^0-9]/g, "");
  if (clean.length === 12 && clean.startsWith("91")) {
    clean = clean.substring(2);
  }
  return clean;
}

function otSanitizePEN(pen) {
  if (!pen) return "";
  // Trim outer spaces without stripping internal leading zeros
  return pen.toString().trim();
}

function otLogAudit(action, profileOrReportRef, details) {
  const user = otGetCurrentUser();
  const entry = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    action,
    reference: profileOrReportRef,
    userRole: otCurrentRole,
    userName: user.name,
    userEmail: user.email,
    timestamp: new Date().toISOString(),
    details: details || {}
  };
  otAuditLogs.unshift(entry);
  if (otAuditLogs.length > 500) otAuditLogs.pop();
  localStorage.setItem('mvd_ot_audit_logs', JSON.stringify(otAuditLogs));
  if (typeof saveOfficerAuditLogToSupabase === 'function') {
    saveOfficerAuditLogToSupabase(entry);
  }
}

function otGetCurrentUser() {
  const gUser = window.googleAuthUser || JSON.parse(localStorage.getItem('mvd_google_user_session') || "null");

  return {
    name: (gUser && gUser.name) ? gUser.name : "",
    email: (gUser && gUser.email) ? gUser.email : "",
    role: otCurrentRole,
    assignedOfficeCode: "",
    assignedOfficeName: ""
  };
}

// Check permission logic
function otHasPermission(action) {
  const role = otCurrentRole;
  if (role === 'admin') return true; // Commissionerate admin can do everything

  switch (action) {
    case 'create_draft':
    case 'submit_profile':
    case 'edit_profile':
      return role === 'data_entry' || role === 'head_of_office';
    case 'verify_report':
      return role === 'head_of_office'; // Restricted to Head of Office / In-Charge
    case 'forward_report':
      return true; // Direct forwarding to Transport Commissionerate
    case 'view_all_offices':
      return role === 'admin';
    default:
      return false;
  }
}

// --- ACCESS CONTROL & OFFICE LOCKING UTILITIES ---

function clearFieldError(fieldId) {
  if (!fieldId) return;
  const field = document.getElementById(fieldId);
  const errContainer = document.getElementById(`err_${fieldId}`);
  if (field) field.classList.remove('is-invalid');
  if (errContainer) errContainer.textContent = '';
}
window.clearFieldError = clearFieldError;

function otGetLoggedInEmail() {
  const gUser = window.googleAuthUser || JSON.parse(localStorage.getItem('mvd_google_user_session') || "null");
  return (gUser && gUser.email) ? gUser.email.toLowerCase().trim() : '';
}

function getCanonicalOfficeCode(office) {
  if (!office) return '';
  const str = String(office).trim();
  const upper = str.toUpperCase();

  const masterList = (typeof ALL_MVD_OFFICES !== 'undefined' && Array.isArray(ALL_MVD_OFFICES) && ALL_MVD_OFFICES.length > 0)
    ? ALL_MVD_OFFICES
    : (window.ALL_MVD_OFFICES && Array.isArray(window.ALL_MVD_OFFICES) ? window.ALL_MVD_OFFICES : []);

  if (masterList.length > 0) {
    const found = masterList.find(o => 
      o.code.toUpperCase() === upper ||
      o.displayName?.toUpperCase() === upper ||
      o.name.toUpperCase() === upper
    );
    if (found) return found.code;
  }

  // Specific DTC Offices detection (guarantees the 4 DTC offices are strictly separate)
  if (upper.includes('DTC')) {
    if (upper.includes('CZ II') || upper.includes('CZ 2') || upper.includes('ERNAKULAM') || upper.includes('CZ-II') || upper.includes('CZ_II')) {
      return 'DTC CZ II';
    }
    if (upper.includes('CZ I') || upper.includes('CZ 1') || upper.includes('THRISSUR') || upper.includes('CZ-I') || upper.includes('CZ_I')) {
      return 'DTC CZ I';
    }
    if (upper.includes('NZ') || upper.includes('KOZHIKKODE') || upper.includes('KOZHIKODE') || upper.includes('CALICUT')) {
      return 'DTC NZ';
    }
    if (upper.includes('SZ') || upper.includes('THIRUVANANTHAPURAM') || upper.includes('TRIVANDRUM')) {
      return 'DTC SZ';
    }
  }

  if (upper.includes('TCO') || upper.includes('COMMISSIONERATE')) {
    return 'TCO';
  }

  for (const off of masterList) {
    if (off.code && upper.startsWith(off.code.toUpperCase())) {
      return off.code;
    }
  }

  const firstWord = upper.split(/[\s—–,-]+/)[0];
  if (firstWord && firstWord !== 'DTC') {
    return firstWord;
  }

  return str;
}
window.getCanonicalOfficeCode = getCanonicalOfficeCode;

function getOfficeLockedEmail(officeCode) {
  if (!officeCode) return '';
  const canonicalCode = getCanonicalOfficeCode(officeCode);
  const cleanCode = officeCode.trim();

  // Direct registry in mvd_ot_office_locks (authoritative source of truth)
  const locks = JSON.parse(localStorage.getItem('mvd_ot_office_locks') || '{}');
  if (locks['DTC']) {
    delete locks['DTC'];
    localStorage.setItem('mvd_ot_office_locks', JSON.stringify(locks));
  }

  if (canonicalCode && locks[canonicalCode]) return locks[canonicalCode].toLowerCase().trim();
  if (locks[cleanCode]) return locks[cleanCode].toLowerCase().trim();

  for (const [k, v] of Object.entries(locks)) {
    if (!v || k === 'DTC') continue;
    const kCanonical = getCanonicalOfficeCode(k);
    if (canonicalCode && kCanonical === canonicalCode) {
      return v.toLowerCase().trim();
    }
    if (k.toUpperCase() === cleanCode.toUpperCase()) {
      return v.toLowerCase().trim();
    }
  }

  return '';
}
window.getOfficeLockedEmail = getOfficeLockedEmail;

window.removeOfficeLock = function(code) {
  if (!code) return {};
  const canonical = getCanonicalOfficeCode(code);
  const clean = code.trim();
  const locks = JSON.parse(localStorage.getItem('mvd_ot_office_locks') || '{}');

  delete locks[canonical];
  delete locks[clean];
  delete locks['DTC'];

  for (const k of Object.keys(locks)) {
    const kCanonical = getCanonicalOfficeCode(k);
    if ((canonical && kCanonical === canonical) || k.toUpperCase() === clean.toUpperCase()) {
      delete locks[k];
    }
  }

  localStorage.setItem('mvd_ot_office_locks', JSON.stringify(locks));
  otOfficeLocks = locks;
  window.otOfficeLocks = locks;
  return locks;
};

window.removeAllOfficeLocks = function() {
  localStorage.setItem('mvd_ot_office_locks', JSON.stringify({}));
  otOfficeLocks = {};
  window.otOfficeLocks = {};
  return {};
};

function getAllOfficesLinkedToUser(email) {
  if (!email) return [];
  const clean = email.toLowerCase().trim();
  const linked = new Set();

  const locks = JSON.parse(localStorage.getItem('mvd_ot_office_locks') || '{}');
  if (typeof otOfficeLocks !== 'undefined' && otOfficeLocks) {
    Object.assign(locks, otOfficeLocks);
  }
  for (const [code, owner] of Object.entries(locks)) {
    if (owner && owner.toLowerCase().trim() === clean && code !== 'DTC') {
      const canonical = getCanonicalOfficeCode(code) || code;
      if (canonical) linked.add(canonical);
    }
  }

  if (Array.isArray(otProfilesStore)) {
    otProfilesStore.forEach(p => {
      if (p && p.officeCode && (
        (p.enteredBy?.userId && p.enteredBy.userId.toLowerCase().trim() === clean) ||
        (p.enteredBy?.email && p.enteredBy.email.toLowerCase().trim() === clean)
      )) {
        const canonical = getCanonicalOfficeCode(p.officeCode) || p.officeCode;
        if (canonical) linked.add(canonical);
      }
    });
  }

  const currentUser = otGetCurrentUser();
  if (currentUser && currentUser.assignedOfficeCode) {
    const canonical = getCanonicalOfficeCode(currentUser.assignedOfficeCode) || currentUser.assignedOfficeCode;
    if (canonical) linked.add(canonical);
  }

  // Active office selected and locked to this user
  const activeOffice = document.getElementById('otMainOfficeSelect')?.value;
  if (activeOffice) {
    const canonical = getCanonicalOfficeCode(activeOffice) || activeOffice;
    const lockedOwner = getOfficeLockedEmail(canonical);
    if (lockedOwner && lockedOwner.toLowerCase().trim() === clean) {
      linked.add(canonical);
    }
  }

  // Legacy IT equipment inventory owner check
  if (typeof inventoryStore !== 'undefined' && inventoryStore) {
    for (const [offName, rec] of Object.entries(inventoryStore)) {
      if (rec) {
        const oEmail = (rec.createdOfficerEmail || rec.submittedByEmail || rec.updatedOfficerEmail || rec.entryOfficerEmail || '').toLowerCase().trim();
        if (oEmail && oEmail === clean) {
          const canonical = getCanonicalOfficeCode(offName) || offName;
          if (canonical) linked.add(canonical);
        }
      }
    }
  }

  return Array.from(linked);
}
window.getAllOfficesLinkedToUser = getAllOfficesLinkedToUser;

function getOfficeLinkedToUser(email) {
  const all = getAllOfficesLinkedToUser(email);
  return all.length > 0 ? all[0] : null;
}
window.getOfficeLinkedToUser = getOfficeLinkedToUser;

function toggleOfficerFormDisabled(disabled) {
  const form = document.getElementById('otOfficerForm');
  if (!form) return;
  const elements = form.querySelectorAll('input:not(#otMainOfficeSelect), select:not(#otMainOfficeSelect), textarea');
  elements.forEach(el => {
    el.disabled = disabled;
    if (disabled) {
      el.style.opacity = '0.6';
      el.style.cursor = 'not-allowed';
    } else {
      el.style.opacity = '';
      el.style.cursor = '';
    }
  });

  const submitBtn = document.getElementById('otBtnSubmitProfile');
  const draftBtn = document.getElementById('otBtnSaveDraft');
  const prevBtn = document.querySelector('button[onclick="handleProfilePreview()"]');
  if (submitBtn) {
    submitBtn.disabled = disabled;
    submitBtn.style.opacity = disabled ? '0.6' : '';
    submitBtn.style.cursor = disabled ? 'not-allowed' : '';
  }
  if (draftBtn) {
    draftBtn.disabled = disabled;
    draftBtn.style.opacity = disabled ? '0.6' : '';
    draftBtn.style.cursor = disabled ? 'not-allowed' : '';
  }
  if (prevBtn) {
    prevBtn.disabled = disabled;
    prevBtn.style.opacity = disabled ? '0.6' : '';
    prevBtn.style.cursor = disabled ? 'not-allowed' : '';
  }
}

function checkOfficeAccessAndLock(officeCode) {
  const alertBox = document.getElementById('otOfficeLockAlert');
  const authPanel = document.getElementById('otOfficeAuthorizedPanel');

  if (!officeCode) {
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }
    if (authPanel) authPanel.style.display = 'none';
    toggleOfficerFormDisabled(false);
    return;
  }

  const currentEmail = otGetLoggedInEmail();
  const canonCode = getCanonicalOfficeCode(officeCode) || officeCode;
  const lockedEmail = getOfficeLockedEmail(canonCode) || getOfficeLockedEmail(officeCode);
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));

  if (isAdmin) {
    toggleOfficerFormDisabled(false);
    if (alertBox) {
      alertBox.className = 'reflection-alert alert-authorized';
      alertBox.style.display = 'flex';
      alertBox.style.background = '#eff6ff';
      alertBox.style.borderColor = '#93c5fd';
      alertBox.style.color = '#1e40af';
      alertBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-user-shield" style="color:#2563eb; font-size: 1.15rem;"></i>
          <span>Commissionerate Administrator Access — Full Edit & Verification Privileges for <strong>${escapeHtml(officeCode)}</strong>.</span>
        </div>
      `;
    }
    renderOfficeEditOptionList(officeCode);
    return;
  }

  if (lockedEmail) {
    if (currentEmail && lockedEmail.toLowerCase() === currentEmail.toLowerCase()) {
      // Authorized User
      // Check if office report has been sent to Transport Commissionerate
      const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
      const snap = snapStore[canonCode] || snapStore[officeCode];
      if (snap && snap.isForwarded === true) {
        toggleOfficerFormDisabled(true);
        if (alertBox) {
          alertBox.className = 'reflection-alert alert-authorized';
          alertBox.style.display = 'flex';
          alertBox.style.background = '#eff6ff';
          alertBox.style.borderColor = '#93c5fd';
          alertBox.style.color = '#1e40af';
          alertBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-lock" style="color:#2563eb; font-size: 1.15rem;"></i>
              <span>This office report has been <strong>Sent to Transport Commissionerate</strong>. Form is locked. If edits are required, an administrator can revert the forwarding status from the Admin Portal.</span>
            </div>
          `;
        }
        renderOfficeEditOptionList(officeCode);
        return;
      }

      toggleOfficerFormDisabled(false);
      if (alertBox) {
        alertBox.className = 'reflection-alert alert-authorized';
        alertBox.style.display = 'flex';
        alertBox.style.background = '#f0fdf4';
        alertBox.style.borderColor = '#86efac';
        alertBox.style.color = '#064e3b';
        alertBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-check" style="color:#059669; font-size: 1.15rem;"></i>
            <span>Use this Gmail ID: <strong>${escapeHtml(currentEmail)}</strong> for entering all officers Details. This Gmail ID is assigned for this office.</span>
          </div>
        `;
      }
      renderOfficeEditOptionList(officeCode);
    } else {
      // Locked to another account: PREVENT ACCESS IMMEDIATELY!
      toggleOfficerFormDisabled(true);
      if (authPanel) authPanel.style.display = 'none';

      // Clear input fields so unauthorized user cannot edit or submit
      if (document.getElementById('otFullName')) document.getElementById('otFullName').value = '';
      if (document.getElementById('otPen')) document.getElementById('otPen').value = '';
      if (document.getElementById('otDesignationSelect')) document.getElementById('otDesignationSelect').value = '';

      const alertMsg = `This office is entered by ${lockedEmail}. Please login with ${lockedEmail} to add and edit details.`;
      if (alertBox) {
        alertBox.className = 'reflection-alert alert-restricted';
        alertBox.style.display = 'flex';
        alertBox.style.background = '#fef2f2';
        alertBox.style.borderColor = '#ef4444';
        alertBox.style.color = '#991b1b';
        alertBox.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 12px; padding: 4px 0; width: 100%;">
            <i class="fa-solid fa-triangle-exclamation" style="color:#dc2626; font-size: 1.4rem; flex-shrink: 0; margin-top: 2px;"></i>
            <div style="font-size: 0.95rem; line-height: 1.5; color: #991b1b;">
              <div style="font-weight: 800; font-size: 1rem; margin-bottom: 4px; color: #b91c1c;">
                <i class="fa-solid fa-lock"></i> Access Restricted
              </div>
              <div>This office is entered by <strong>${escapeHtml(lockedEmail)}</strong>. Please login with <strong>${escapeHtml(lockedEmail)}</strong> to add and edit details.</div>
            </div>
          </div>
        `;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast(alertMsg, 'error');
    }
  } else {
    // Unlocked / Open office (first entry will lock to current account)
    toggleOfficerFormDisabled(false);
    if (currentEmail) {
      const canonical = getCanonicalOfficeCode(officeCode) || officeCode;
      if (canonical && canonical !== 'DTC' && !otOfficeLocks[canonical]) {
        otOfficeLocks[canonical] = currentEmail;
        delete otOfficeLocks['DTC'];
        localStorage.setItem('mvd_ot_office_locks', JSON.stringify(otOfficeLocks));
        window.otOfficeLocks = otOfficeLocks;
        if (typeof saveOfficeLocksToSupabase === 'function') {
          saveOfficeLocksToSupabase(otOfficeLocks);
        }
      }
    }
    if (authPanel) {
      const officeProfiles = otProfilesStore.filter(p => p.officeCode === officeCode);
      if (officeProfiles.length > 0) {
        renderOfficeEditOptionList(officeCode);
      } else {
        authPanel.style.display = 'none';
      }
    }
    if (alertBox) {
      if (currentEmail) {
        alertBox.className = 'reflection-alert alert-authorized';
        alertBox.style.display = 'flex';
        alertBox.style.background = '#f0fdf4';
        alertBox.style.borderColor = '#86efac';
        alertBox.style.color = '#064e3b';
        alertBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-check" style="color:#059669; font-size: 1.15rem;"></i>
            <span>Use this Gmail ID: <strong>${escapeHtml(currentEmail)}</strong> for entering all officers Details. This Gmail ID is assigned for this office.</span>
          </div>
        `;
      } else {
        alertBox.className = 'reflection-alert alert-unlocked';
        alertBox.style.display = 'flex';
        alertBox.style.background = '#eff6ff';
        alertBox.style.borderColor = '#93c5fd';
        alertBox.style.color = '#1e40af';
        alertBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-lock-open" style="color:#2563eb; font-size: 1.1rem;"></i>
            <span>This office is Open for data entry. Please sign in with your Google account to submit.</span>
          </div>
        `;
      }
    }
  }
}
window.checkOfficeAccessAndLock = checkOfficeAccessAndLock;

function renderOfficeEditOptionList(officeCode) {
  const panel = document.getElementById('otOfficeAuthorizedPanel');
  if (!panel) return;

  const officeProfiles = otProfilesStore.filter(p => p.officeCode === officeCode);
  if (officeProfiles.length === 0) {
    panel.style.display = 'none';
    return;
  }

  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
      <div style="font-weight: 700; color: #064e3b; font-size: 0.92rem;">
        <i class="fa-solid fa-user-check"></i> ${officeProfiles.length} Officer Profile(s) Registered for this Office
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="startNewOfficerForOffice('${officeCode}')" style="font-size: 0.8rem; padding: 4px 10px; background: white;">
        <i class="fa-solid fa-plus"></i> Add Another Officer
      </button>
    </div>
    <div class="data-table-container" style="max-height: 220px; overflow-y: auto; background: white; border-radius: 6px; border: 1px solid #d1fae5;">
      <table class="data-table" style="font-size: 0.85rem; margin: 0;">
        <thead>
          <tr style="background: #f0fdf4;">
            <th>Officer Full Name</th>
            <th>PEN</th>
            <th>Designation</th>
            <th>Status</th>
            <th style="text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${officeProfiles.map(p => `
            <tr>
              <td><strong>${escapeHtml(p.officerFullName)}</strong></td>
              <td><code>${escapeHtml(p.pen)}</code></td>
              <td>${escapeHtml(p.designation)}</td>
              <td><span class="badge ${p.status === 'submitted' ? 'badge-working' : 'badge-warning'}" style="font-size: 0.75rem;">${escapeHtml(p.status.toUpperCase())}</span></td>
              <td style="text-align: right;">
                <button type="button" class="btn btn-primary btn-sm" onclick="loadProfileForEditing('${p.id}')" style="padding: 3px 10px; font-size: 0.78rem;">
                  <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteOfficerProfile('${p.id}')" style="padding: 3px 10px; font-size: 0.78rem; margin-left: 6px;">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  panel.style.display = 'block';
}

async function startNewOfficerForOffice(officeCode) {
  const confirmFn = window.showCustomConfirm || (typeof showCustomConfirm === 'function' ? showCustomConfirm : null);
  let confirmed = false;
  if (confirmFn) {
    confirmed = await confirmFn({
      title: 'Add Another Officer',
      message: 'Do you want to add another Officer?',
      confirmText: 'Yes',
      cancelText: 'Cancel',
      isDanger: false
    });
  } else {
    confirmed = window.confirm('Do you want to add another Officer?');
  }
  if (!confirmed) return;

  await resetOfficerForm(true);
  prefillEnteredByDetails();
  const sel = document.getElementById('otMainOfficeSelect');
  if (sel) {
    sel.value = officeCode;
    const sInput = document.getElementById('otOfficeSearchInput');
    if (sInput) {
      const opt = sel.querySelector(`option[value="${officeCode}"]`);
      sInput.value = opt ? opt.textContent : officeCode;
    }
  }
  checkOfficeAccessAndLock(officeCode);
  switchOfficerSubTab('form');
  document.getElementById('officerTrainingFormCard')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('otFullName')?.focus();
  }, 300);
}
window.startNewOfficerForOffice = startNewOfficerForOffice;

// --- 5. INITIALIZATION & MODULE ACTIVATION ---

function initOfficerTrainingModule() {
  console.log("Initializing Officer Training & Qualification Module...");
  populateSearchableOfficeDropdowns();
  renderAdditionalQualOptions();
  renderSpecializedSkillsOptions();
  renderStagedTrainingTable();
  initUnsavedChangesProtection();
  prefillEnteredByDetails();
  renderRoleSwitcherUI();

  // Attach live persistence for entered-by details
  ['otEnteredByName', 'otEnteredByDesignation', 'otEnteredByMobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const saveHandler = () => {
        try {
          const name = document.getElementById('otEnteredByName')?.value?.trim() || '';
          const desig = document.getElementById('otEnteredByDesignation')?.value || '';
          const mob = document.getElementById('otEnteredByMobile')?.value?.trim() || '';
          if (name || desig || mob) {
            localStorage.setItem('mvd_ot_last_entered_by', JSON.stringify({
              fullName: name,
              designation: desig,
              mobile: mob
            }));
          }
        } catch (e) {}
      };
      el.addEventListener('input', saveHandler);
      el.addEventListener('change', saveHandler);
    }
  });

  // Attach instant validation listeners to main office dropdown
  const officeSelect = document.getElementById('otMainOfficeSelect');
  if (officeSelect) {
    officeSelect.onchange = function() { handleOfficeSelectPicked(this); };
    officeSelect.oninput = function() { handleOfficeSelectPicked(this); };
    if (officeSelect.value) {
      checkOfficeAccessAndLock(officeSelect.value);
    }
  }

  // Load from Supabase in background
  syncOfficerProfilesWithSupabase();
  if (typeof syncOfficeLocksFromSupabase === 'function') {
    syncOfficeLocksFromSupabase();
  }

  // Subscribe to live Realtime updates from Supabase
  subscribeToRealtimeOfficerProfiles();
}

// Window beforeunload prompt if unsaved changes exist
function initUnsavedChangesProtection() {
  window.addEventListener('beforeunload', (e) => {
    if (otFormDirty) {
      e.preventDefault();
      e.returnValue = "You have unsaved officer profile changes. Are you sure you want to leave?";
      return e.returnValue;
    }
  });
}

function markFormDirty(dirty = true) {
  otFormDirty = dirty;
  const badge = document.getElementById('otUnsavedBadge');
  if (badge) {
    badge.style.display = dirty ? 'inline-flex' : 'none';
  }
}

// --- 6. SEARCHABLE OFFICE DROPDOWN ENGINE ---

function populateSearchableOfficeDropdowns() {
  const mainSel = document.getElementById('otMainOfficeSelect');
  const dirFilterSel = document.getElementById('otDirOfficeFilter');
  const reportSel = document.getElementById('otReportOfficeSelect');

  [mainSel, dirFilterSel].forEach(sel => {
    if (!sel) return;
    const isFilter = sel.id === 'otDirOfficeFilter';
    sel.innerHTML = isFilter ? '<option value="ALL">-- All MVD Offices (Statewide) --</option>' : '<option value="">-- Select Office (Code — Name) --</option>';

    Object.entries(OT_OFFICE_GROUPS).forEach(([groupName, offices]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = groupName;
      offices.forEach(off => {
        const opt = document.createElement('option');
        opt.value = off.code;
        opt.textContent = `${off.code} — ${off.name}`;
        optgroup.appendChild(opt);
      });
      sel.appendChild(optgroup);
    });
  });

  // Report Select: Restricted to specifically assigned/authorized office for authenticated non-admin users
  if (reportSel) {
    const userEmail = otGetLoggedInEmail();
    const isAdmin = (otCurrentRole === 'admin' || (typeof activeSession !== 'undefined' && activeSession === 'admin'));
    if (isAdmin || !userEmail) {
      reportSel.innerHTML = '<option value="">-- Select Office (Code — Name) --</option>';
      Object.entries(OT_OFFICE_GROUPS).forEach(([groupName, offices]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = groupName;
        offices.forEach(off => {
          const opt = document.createElement('option');
          opt.value = off.code;
          opt.textContent = `${off.code} — ${off.name}`;
          optgroup.appendChild(opt);
        });
        reportSel.appendChild(optgroup);
      });
      reportSel.disabled = false;
    } else {
      const authorizedOffices = getAllOfficesLinkedToUser(userEmail);
      if (authorizedOffices.length > 0) {
        reportSel.innerHTML = authorizedOffices.map(code => {
          const off = ALL_MVD_OFFICES.find(o => o.code === code) || { code, name: code };
          return `<option value="${escapeHtml(code)}">${escapeHtml(code)} — ${escapeHtml(off.name)}</option>`;
        }).join('');
        reportSel.disabled = (authorizedOffices.length === 1);
        reportSel.title = (authorizedOffices.length === 1) ? "Summary Report is restricted to your authorized office" : "";
      } else {
        reportSel.innerHTML = '<option value="">-- No Authorized Office --</option>';
        reportSel.disabled = true;
        reportSel.title = "No office is authorized for your account";
      }
    }
  }
}

function handleOfficeSearchFilter(inputEl, targetSelectId) {
  const q = (inputEl.value || "").toLowerCase().trim();
  const sel = document.getElementById(targetSelectId);
  if (!sel) return;

  const optgroups = sel.querySelectorAll('optgroup');
  let matchCount = 0;
  let exactMatchOpt = null;
  let firstMatchOpt = null;

  optgroups.forEach(group => {
    let groupHasMatch = false;
    const options = group.querySelectorAll('option');
    options.forEach(opt => {
      const text = opt.textContent.toLowerCase();
      const code = opt.value.toLowerCase();
      const cleanCode = code.replace(/[^a-z0-9]/g, '');
      const cleanQ = q.replace(/[^a-z0-9]/g, '');
      const matches = !q || text.includes(q) || code.includes(q) || cleanCode.includes(cleanQ);
      opt.style.display = matches ? '' : 'none';
      if (matches && opt.value) {
        groupHasMatch = true;
        matchCount++;
        if (!firstMatchOpt) firstMatchOpt = opt;
        if (code === q || cleanCode === cleanQ || text === q) {
          exactMatchOpt = opt;
        }
      }
    });
    group.style.display = groupHasMatch ? '' : 'none';
  });

  // If user typed an exact code match (e.g. KL01, KLE01, TCO), auto-select it immediately
  if (exactMatchOpt) {
    sel.value = exactMatchOpt.value;
    clearFieldError(targetSelectId);
    clearFieldError(inputEl.id);
    markFormDirty(true);
  }
}

function handleOfficeSearchBlur(inputEl, targetSelectId) {
  const q = (inputEl.value || "").toLowerCase().trim();
  const sel = document.getElementById(targetSelectId);
  if (!sel || !q) return;

  // If already selected and matches visible option, update text and return
  if (sel.value) {
    const selectedOpt = sel.options[sel.selectedIndex];
    if (selectedOpt && selectedOpt.style.display !== 'none' && selectedOpt.value) {
      inputEl.value = selectedOpt.textContent;
      clearFieldError(targetSelectId);
      clearFieldError(inputEl.id);
      return;
    }
  }

  // Auto-pick first visible matching option
  const visibleOptions = Array.from(sel.querySelectorAll('option')).filter(o => o.value && o.style.display !== 'none');
  if (visibleOptions.length > 0) {
    sel.value = visibleOptions[0].value;
    inputEl.value = visibleOptions[0].textContent;
    clearFieldError(targetSelectId);
    clearFieldError(inputEl.id);
    markFormDirty(true);
  } else {
    // Check against ALL_MVD_OFFICES
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const m = ALL_MVD_OFFICES.find(o => 
      o.code.toLowerCase() === q || 
      o.code.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanQ ||
      o.name.toLowerCase().includes(q) || 
      `${o.code} ${o.name}`.toLowerCase().includes(q)
    );
    if (m) {
      sel.value = m.code;
      inputEl.value = `${m.code} — ${m.name}`;
      clearFieldError(targetSelectId);
      clearFieldError(inputEl.id);
      markFormDirty(true);
    }
  }
}

function handleOfficeSelectPicked(sel) {
  let val = '';
  if (typeof sel === 'string') {
    val = sel;
    const el = document.getElementById('otMainOfficeSelect');
    if (el && el.value !== val) el.value = val;
  } else if (sel && sel.value !== undefined) {
    val = sel.value;
  }
  const el = document.getElementById('otMainOfficeSelect');
  if (el) clearFieldError(el.id);
  markFormDirty(true);

  checkOfficeAccessAndLock(val);
}
window.handleOfficeSelectPicked = handleOfficeSelectPicked;

// --- 7. DYNAMIC FORM RENDERING (ADDITIONAL QUALIFICATIONS & SKILLS) ---

function renderAdditionalQualOptions() {
  const container = document.getElementById('otAddQualContainer');
  if (!container) return;

  container.innerHTML = ADDITIONAL_QUAL_OPTIONS.map((qual, idx) => {
    const isOther = qual === 'Others — Specify';
    const isNone = qual === 'No additional Qualifications';
    return `
      <div class="ot-qual-row" id="otQualRow_${idx}">
        <label class="ot-checkbox-label">
          <input type="checkbox" class="ot-add-qual-chk" value="${escapeHtml(qual)}" onchange="handleAdditionalQualCheck(${idx}, this)">
          <span class="ot-qual-name">${escapeHtml(qual)}</span>
        </label>

        ${isNone ? '' : `
        <!-- Dynamic Expandable Details for this Qualification -->
        <div class="ot-qual-detail-panel" id="otQualDetail_${idx}" style="display: none;">
          <div class="form-grid-3">
            <div class="form-group">
              <label><i class="fa-solid fa-list-check"></i> Completion Status <span class="req-star">*</span></label>
              <select class="form-control ot-detail-status" onchange="handleQualStatusChange(${idx}, this.value)">
                <option value="">-- Choose Status --</option>
                <option value="Completed">Completed</option>
                <option value="Pursuing">Pursuing</option>
              </select>
              <div class="field-error" id="err_qual_status_${idx}"></div>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-building-columns"></i> Institution / Board / University</label>
              <input type="text" class="form-control ot-detail-inst" placeholder="e.g. CLI Mumbai, ILI New Delhi, University of Kerala">
            </div>

            <div class="form-group">
              <label class="ot-detail-year-label" id="lbl_qual_year_${idx}"><i class="fa-regular fa-calendar"></i> Year of Passing / Expected</label>
              <input type="number" class="form-control ot-detail-year" min="1970" max="2040" placeholder="e.g. 2024">
              <div class="field-error" id="err_qual_year_${idx}"></div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label><i class="fa-solid fa-note-sticky"></i> Remarks / Specialization</label>
            <input type="text" class="form-control ot-detail-remarks" placeholder="e.g. Evening Batch, Distance Education, First Class">
          </div>

          ${isOther ? `
            <div class="form-group" style="margin-top: 10px; background: #fffbe6; padding: 10px; border-radius: 6px; border: 1px solid #ffe58f;">
              <label style="color: #b45309; font-weight: 700;"><i class="fa-solid fa-plus-circle"></i> Custom Qualification Name <span class="req-star">*</span></label>
              <input type="text" class="form-control ot-detail-custom-name" placeholder="Specify exact degree / diploma / certification name">
              <div class="field-error" id="err_qual_custom_${idx}"></div>
            </div>
          ` : ''}
        </div>
        `}
      </div>
    `;
  }).join('');
}

function handleAdditionalQualCheck(idx, chk) {
  markFormDirty(true);
  const qual = chk.value;
  if (qual === 'No additional Qualifications' && chk.checked) {
    document.querySelectorAll('.ot-add-qual-chk').forEach(otherChk => {
      if (otherChk !== chk && otherChk.checked) {
        otherChk.checked = false;
        const row = otherChk.closest('.ot-qual-row');
        if (row) {
          const detail = row.querySelector('.ot-qual-detail-panel');
          if (detail) detail.style.display = 'none';
        }
      }
    });
  } else if (chk.checked) {
    const noneChk = Array.from(document.querySelectorAll('.ot-add-qual-chk')).find(c => c.value === 'No additional Qualifications');
    if (noneChk && noneChk.checked) {
      noneChk.checked = false;
    }
  }

  toggleAdditionalQualDetail(idx, chk.checked);
}
window.handleAdditionalQualCheck = handleAdditionalQualCheck;

function toggleAdditionalQualDetail(idx, isChecked) {
  markFormDirty(true);
  const panel = document.getElementById(`otQualDetail_${idx}`);
  if (panel) {
    panel.style.display = isChecked ? 'block' : 'none';
  }
}

function handleQualStatusChange(idx, status) {
  markFormDirty(true);
  const label = document.getElementById(`lbl_qual_year_${idx}`);
  const currentYear = new Date().getFullYear();
  if (label) {
    if (status === 'Completed') {
      label.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Year of Passing (Max ${currentYear})`;
    } else if (status === 'Pursuing') {
      label.innerHTML = `<i class="fa-regular fa-calendar-plus"></i> Expected Completion Year (Allows Future)`;
    } else {
      label.innerHTML = `<i class="fa-regular fa-calendar"></i> Year of Passing / Expected`;
    }
  }
}

function renderSpecializedSkillsOptions() {
  const container = document.getElementById('otSpecializedSkillsContainer');
  if (!container) return;

  container.innerHTML = SPECIALIZED_SKILL_OPTIONS.map((skill, idx) => {
    const isOther = skill === 'Others — Specify';
    return `
      <label class="ot-skill-pill ${isOther ? 'ot-skill-other-pill' : ''}" id="otSkillPill_${idx}">
        <input type="checkbox" class="ot-skill-chk" value="${escapeHtml(skill)}" onchange="handleSkillSelectionChange(this, ${isOther})">
        <span>${escapeHtml(skill)}</span>
      </label>
    `;
  }).join('');
}

function handleSkillSelectionChange(chk, isOther) {
  markFormDirty(true);
  const pill = chk.closest('.ot-skill-pill');
  if (chk.checked) {
    pill.classList.add('active');
  } else {
    pill.classList.remove('active');
  }

  if (isOther) {
    const customGroup = document.getElementById('otCustomSkillsGroup');
    if (customGroup) {
      customGroup.style.display = chk.checked ? 'block' : 'none';
    }
  }
}

// Conditional fields for Section 2 (General & Technical Qualifications)
function handleGeneralEducationChange(val) {
  markFormDirty(true);
  const group = document.getElementById('otGenEdOtherGroup');
  const input = document.getElementById('otGenEdOtherInput');
  const show = val === 'Others';
  if (group) group.style.display = show ? 'block' : 'none';
  if (input && !show) input.value = '';
}

function handleTechnicalQualificationChange(val) {
  markFormDirty(true);
  const group = document.getElementById('otTechQualOtherGroup');
  const input = document.getElementById('otTechQualOtherInput');
  const show = val === 'Others';
  if (group) group.style.display = show ? 'block' : 'none';
  if (input && !show) input.value = '';
}

// --- 8. REPEATABLE IN-SERVICE TRAINING TABLE ENGINE ---

function renderStagedTrainingTable() {
  const tbody = document.getElementById('otTrainingTableBody');
  const mobileContainer = document.getElementById('otTrainingCardsMobile');
  if (!tbody) return;

  // Sort staged trainings latest first
  otStagedTrainings.sort((a, b) => (b.monthYear || "").localeCompare(a.monthYear || ""));

  if (otStagedTrainings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
          <i class="fa-regular fa-folder-open" style="font-size: 1.5rem; color: #cbd5e1; display: block; margin-bottom: 6px;"></i>
          <strong>No training records added</strong>. Click <em>"+ Add Training"</em> below to record in-service training history.
        </td>
      </tr>
    `;
    if (mobileContainer) {
      mobileContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px;">No training records added.</div>`;
    }
    return;
  }

  tbody.innerHTML = otStagedTrainings.map((tr, idx) => `
    <tr>
      <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
      <td><strong>${escapeHtml(tr.attended)}</strong></td>
      <td>${escapeHtml(tr.conductedBy)}</td>
      <td><span class="badge badge-info">${tr.durationValue} ${escapeHtml(tr.durationUnit)}</span></td>
      <td><strong><i class="fa-regular fa-calendar-check"></i> ${escapeHtml(tr.monthYear)}</strong></td>
      <td style="text-align: center;">
        <div style="display: flex; gap: 6px; justify-content: center;">
          <button type="button" class="btn btn-outline btn-sm" onclick="editStagedTraining(${idx})" title="Edit Training">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button type="button" class="btn btn-danger btn-sm" onclick="removeStagedTraining(${idx})" title="Remove Training">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Mobile responsive cards
  if (mobileContainer) {
    mobileContainer.innerHTML = otStagedTrainings.map((tr, idx) => `
      <div class="ot-mobile-training-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <strong style="color: var(--primary-900); font-size: 0.95rem;">${escapeHtml(tr.attended)}</strong>
          <span class="badge badge-info">${tr.durationValue} ${escapeHtml(tr.durationUnit)}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
          <i class="fa-solid fa-landmark"></i> Conducted by: ${escapeHtml(tr.conductedBy)}
        </div>
        <div style="font-size: 0.82rem; color: #047857; margin-top: 4px;">
          <i class="fa-regular fa-calendar"></i> Month & Year: <strong>${escapeHtml(tr.monthYear)}</strong>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 8px;">
          <button type="button" class="btn btn-outline btn-sm" onclick="editStagedTraining(${idx})"><i class="fa-solid fa-pen"></i> Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="removeStagedTraining(${idx})"><i class="fa-solid fa-trash"></i> Remove</button>
        </div>
      </div>
    `).join('');
  }
}

function openAddTrainingModal() {
  otEditingTrainingIndex = -1;
  document.getElementById('otTrainingModalTitle').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Add In-Service Training Record';
  document.getElementById('otTrAttendedInput').value = '';
  document.getElementById('otTrConductedByInput').value = '';
  document.getElementById('otTrDurationValInput').value = '';
  document.getElementById('otTrDurationUnitSelect').value = 'Days';

  // Set max month to current month (prevent future dates)
  const now = new Date();
  const ym = now.toISOString().substring(0, 7);
  const myInput = document.getElementById('otTrMonthYearInput');
  if (myInput) {
    myInput.max = ym;
    myInput.value = ym;
  }

  document.getElementById('otTrainingModal').style.display = 'flex';
}

function editStagedTraining(idx) {
  otEditingTrainingIndex = idx;
  const tr = otStagedTrainings[idx];
  if (!tr) return;

  document.getElementById('otTrainingModalTitle').innerHTML = '<i class="fa-solid fa-pen"></i> Edit In-Service Training Record';
  document.getElementById('otTrAttendedInput').value = tr.attended || '';
  document.getElementById('otTrConductedByInput').value = tr.conductedBy || '';
  document.getElementById('otTrDurationValInput').value = tr.durationValue || '';
  document.getElementById('otTrDurationUnitSelect').value = tr.durationUnit || 'Days';

  const myInput = document.getElementById('otTrMonthYearInput');
  const ym = new Date().toISOString().substring(0, 7);
  if (myInput) {
    myInput.max = ym;
    myInput.value = tr.monthYear || ym;
  }

  document.getElementById('otTrainingModal').style.display = 'flex';
}

function closeTrainingModal() {
  document.getElementById('otTrainingModal').style.display = 'none';
}

function saveStagedTrainingModal(e) {
  if (e) e.preventDefault();
  const attended = document.getElementById('otTrAttendedInput').value.trim();
  const conductedBy = document.getElementById('otTrConductedByInput').value.trim();
  const durVal = parseFloat(document.getElementById('otTrDurationValInput').value) || 0;
  const durUnit = document.getElementById('otTrDurationUnitSelect').value;
  const monthYear = document.getElementById('otTrMonthYearInput').value;

  if (!attended) {
    showToast("Please enter Training Attended", "warning");
    return;
  }
  if (!conductedBy) {
    showToast("Please enter Training Conducted By", "warning");
    return;
  }
  if (durVal <= 0) {
    showToast("Please enter a positive numeric value for Duration of Training", "warning");
    return;
  }
  if (!monthYear) {
    showToast("Please enter Month & Year of Training", "warning");
    return;
  }

  // Prevent future dates
  const currentYM = new Date().toISOString().substring(0, 7);
  if (monthYear > currentYM) {
    showToast("Future dates are not allowed for attended training.", "warning");
    return;
  }

  const record = {
    id: otEditingTrainingIndex >= 0 ? otStagedTrainings[otEditingTrainingIndex].id : "tr_" + Date.now(),
    attended,
    conductedBy,
    durationValue: durVal,
    durationUnit: durUnit,
    monthYear
  };

  if (otEditingTrainingIndex >= 0) {
    otStagedTrainings[otEditingTrainingIndex] = record;
  } else {
    otStagedTrainings.push(record);
  }

  markFormDirty(true);
  closeTrainingModal();
  renderStagedTrainingTable();
}

async function removeStagedTraining(idx) {
  const ok = await (window.showCustomConfirm || showCustomConfirm)({
    title: 'Remove Training Record',
    message: 'Are you sure you want to remove this training record?',
    confirmText: 'Remove',
    isDanger: true
  });
  if (!ok) return;
  otStagedTrainings.splice(idx, 1);
  markFormDirty(true);
  renderStagedTrainingTable();
}

// --- 9. SECTION 4: ENTERED-BY DETAILS & PREFILL ---

function prefillEnteredByDetails() {
  const user = otGetCurrentUser();
  const nameInput = document.getElementById('otEnteredByName');
  const desigInput = document.getElementById('otEnteredByDesignation');
  const mobInput = document.getElementById('otEnteredByMobile');

  // Check stored last entered-by details
  let lastEntered = null;
  try {
    const raw = localStorage.getItem('mvd_ot_last_entered_by');
    if (raw) lastEntered = JSON.parse(raw);
  } catch (e) {}

  // If not in localStorage, look up any previous profile entered by this user
  if (!lastEntered && Array.isArray(otProfilesStore) && otProfilesStore.length > 0) {
    const userEmail = otGetLoggedInEmail();
    const prevProf = otProfilesStore.find(p => p && p.enteredBy && (
      (userEmail && p.enteredBy.userId && p.enteredBy.userId.toLowerCase().trim() === userEmail) ||
      (user.name && p.enteredBy.fullName && p.enteredBy.fullName.toLowerCase().trim() === user.name.toLowerCase().trim())
    ));
    if (prevProf && prevProf.enteredBy) {
      lastEntered = {
        fullName: prevProf.enteredBy.fullName || "",
        designation: prevProf.enteredBy.designation || "",
        mobile: prevProf.enteredBy.mobile || ""
      };
    }
  }

  const defaultName = (lastEntered && lastEntered.fullName) ? lastEntered.fullName : (user.name || "");
  const defaultDesig = (lastEntered && lastEntered.designation) ? lastEntered.designation : "";
  const defaultMobile = (lastEntered && lastEntered.mobile) ? lastEntered.mobile : "";

  if (nameInput) {
    nameInput.value = defaultName;
  }
  if (desigInput && defaultDesig) {
    desigInput.value = defaultDesig;
  }
  if (mobInput && defaultMobile) {
    mobInput.value = defaultMobile;
  }
}
window.prefillEnteredByDetails = prefillEnteredByDetails;

// --- 10. FORM SUBMISSION, VALIDATION & DRAFT SAVING ---

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function setFieldError(fieldId, errorMsg) {
  const field = document.getElementById(fieldId);
  const errContainer = document.getElementById(`err_${fieldId}`);
  if (field) field.classList.add('is-invalid');
  if (errContainer) errContainer.textContent = errorMsg;
}

function extractOfficerFormData(status = 'submitted') {
  clearFieldErrors();
  let isValid = true;

  // Section 1: Identification & Current Posting
  const fullName = (document.getElementById('otFullName')?.value || "").trim();
  const rawPen = (document.getElementById('otPen')?.value || "").trim();
  const pen = otSanitizePEN(rawPen);
  const designation = document.getElementById('otDesignationSelect')?.value || "";
  let officeCode = document.getElementById('otMainOfficeSelect')?.value || "";
  if (!officeCode) {
    const sInput = document.getElementById('otOfficeSearchInput');
    const q = (sInput?.value || "").toLowerCase().trim();
    if (q) {
      const cleanQ = q.replace(/[^a-z0-9]/g, '');
      const match = ALL_MVD_OFFICES.find(o => 
        o.code.toLowerCase() === q || 
        o.code.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanQ ||
        o.name.toLowerCase().includes(q) || 
        `${o.code} ${o.name}`.toLowerCase().includes(q)
      );
      if (match) {
        officeCode = match.code;
        const sel = document.getElementById('otMainOfficeSelect');
        if (sel) sel.value = match.code;
        if (sInput) sInput.value = `${match.code} — ${match.name}`;
      }
    }
  }
  const officeObj = ALL_MVD_OFFICES.find(o => o.code === officeCode);
  const officeName = officeObj ? officeObj.name : "";

  // Section 2: Academic & Technical
  const genEd = document.getElementById('otGenEdSelect')?.value || "";
  const genEdOther = (document.getElementById('otGenEdOtherInput')?.value || "").trim();
  const techQual = document.getElementById('otTechQualSelect')?.value || "";
  const techQualOther = (document.getElementById('otTechQualOtherInput')?.value || "").trim();
  const institution = (document.getElementById('otTechInstitutionInput')?.value || "").trim();
  const passingYearVal = parseInt(document.getElementById('otPassingYearInput')?.value) || null;
  const grade = (document.getElementById('otGradeInput')?.value || "").trim();

  // Additional Qualifications
  const additionalQuals = [];
  const qualRows = document.querySelectorAll('.ot-qual-row');
  qualRows.forEach((row, idx) => {
    const chk = row.querySelector('.ot-add-qual-chk');
    if (chk && chk.checked) {
      const isNone = chk.value === 'No additional Qualifications';
      const isOther = chk.value === 'Others — Specify';
      const customName = isOther ? (row.querySelector('.ot-detail-custom-name')?.value || "").trim() : chk.value;
      const compStatus = isNone ? 'N/A' : (row.querySelector('.ot-detail-status')?.value || "");
      const inst = isNone ? '' : (row.querySelector('.ot-detail-inst')?.value || "").trim();
      const yr = isNone ? null : (parseInt(row.querySelector('.ot-detail-year')?.value) || null);
      const rem = isNone ? '' : (row.querySelector('.ot-detail-remarks')?.value || "").trim();

      if (status === 'submitted' && !isNone) {
        if (!compStatus) {
          const errEl = row.querySelector(`#err_qual_status_${idx}`);
          if (errEl) errEl.textContent = "Status is required (Completed / Pursuing)";
          isValid = false;
        }
        if (isOther && !customName) {
          const errEl = row.querySelector(`#err_qual_custom_${idx}`);
          if (errEl) errEl.textContent = "Specify the custom qualification name";
          isValid = false;
        }
        const currentYear = new Date().getFullYear();
        if (compStatus === 'Completed' && yr && yr > currentYear) {
          const errEl = row.querySelector(`#err_qual_year_${idx}`);
          if (errEl) errEl.textContent = `Passing year cannot be in the future (Max ${currentYear})`;
          isValid = false;
        }
      }

      additionalQuals.push({
        qualification: customName || chk.value,
        status: isNone ? 'Completed' : compStatus,
        institution: inst,
        year: yr,
        remarks: rem
      });
    }
  });

  // Section 3: Specialized Skills
  const specializedSkills = [];
  document.querySelectorAll('.ot-skill-chk:checked').forEach(cb => {
    if (cb.value !== 'Others — Specify') {
      specializedSkills.push(cb.value);
    }
  });
  const customSkills = (document.getElementById('otCustomSkillsInput')?.value || "").trim();
  const otherSkillChecked = document.querySelector('.ot-skill-chk[value="Others — Specify"]')?.checked;
  if (status === 'submitted' && otherSkillChecked && !customSkills) {
    setFieldError('otCustomSkillsInput', "Please enter the custom specialized skills");
    isValid = false;
  }
  if (otherSkillChecked && customSkills) {
    specializedSkills.push(`Others: ${customSkills}`);
  }

  // Section 5: Willingness to Contribute
  const willingnessToContribute = (document.getElementById('otWillingnessToContribute')?.value || "").trim();

  // Section 6: Entered-By Details
  const enteredByName = (document.getElementById('otEnteredByName')?.value || "").trim();
  const enteredByDesig = (document.getElementById('otEnteredByDesignation')?.value || "").trim();
  const rawMobile = (document.getElementById('otEnteredByMobile')?.value || "").trim();
  const normalizedMobile = otNormalizePhone(rawMobile);

  // Validation strictly for 'submitted' (Drafts allow saving partial data)
  if (status === 'submitted') {
    if (!fullName) {
      setFieldError('otFullName', "Officer Full Name is required");
      isValid = false;
    }
    if (!pen) {
      setFieldError('otPen', "PEN / Employee ID is required");
      isValid = false;
    }
    if (!designation) {
      setFieldError('otDesignationSelect', "Current Designation is required");
      isValid = false;
    }
    if (!officeCode) {
      setFieldError('otMainOfficeSelect', "Office Selection is required");
      isValid = false;
    }
    if (!genEd) {
      setFieldError('otGenEdSelect', "General Education is required");
      isValid = false;
    }
    if (genEd === 'Others' && !genEdOther) {
      setFieldError('otGenEdOtherInput', "Specify other General Education");
      isValid = false;
    }
    if (!techQual) {
      setFieldError('otTechQualSelect', "Basic Technical Qualification is required");
      isValid = false;
    }
    if (techQual === 'Others' && !techQualOther) {
      setFieldError('otTechQualOtherInput', "Specify other Basic Technical Qualification");
      isValid = false;
    }

    const currentYear = new Date().getFullYear();
    if (passingYearVal && passingYearVal > currentYear) {
      setFieldError('otPassingYearInput', `Passing year cannot be in the future (Max ${currentYear})`);
      isValid = false;
    }

    if (!enteredByName) {
      setFieldError('otEnteredByName', "Data entered By Officer Full Name is required");
      isValid = false;
    }
    if (!enteredByDesig) {
      setFieldError('otEnteredByDesignation', "Data entered By Designation is required");
      isValid = false;
    }
    if (!normalizedMobile || normalizedMobile.length !== 10) {
      setFieldError('otEnteredByMobile', "Please enter a valid 10-digit Indian Mobile Number");
      isValid = false;
    }

    // Check unique PEN (Prevent duplicate profile creation)
    const existingWithPen = otProfilesStore.find(p => p.pen === pen && p.id !== otEditingProfileId);
    if (existingWithPen) {
      setFieldError('otPen', `An officer profile already exists with PEN: "${pen}" (${existingWithPen.officerFullName})`);
      isValid = false;
    }
  }

  // If saving draft, PEN is at least required to identify record
  if (status === 'draft' && !pen) {
    setFieldError('otPen', "Please enter PEN / Employee ID to save a draft");
    return { isValid: false, data: null };
  }

  const currentUser = otGetCurrentUser();
  const nowISO = new Date().toISOString();

  const data = {
    id: otEditingProfileId || "prof_" + pen + "_" + Date.now().toString(36),
    officerFullName: fullName,
    pen,
    designation,
    officeCode,
    officeName,
    generalEducation: genEd,
    generalEducationOther: genEdOther,
    technicalQualification: techQual,
    technicalQualificationOther: techQualOther,
    institution,
    passingYear: passingYearVal,
    grade,
    additionalQualifications: additionalQuals,
    specializedSkills,
    customSkills,
    willingnessToContribute,
    trainingHistory: [...otStagedTrainings],
    enteredBy: {
      fullName: enteredByName,
      designation: enteredByDesig,
      mobile: normalizedMobile,
      userId: currentUser.email,
      timestamp: nowISO
    },
    status,
    createdAt: otEditingProfileId ? (otProfilesStore.find(p => p.id === otEditingProfileId)?.createdAt || nowISO) : nowISO,
    updatedAt: nowISO,
    version: otEditingProfileId ? ((otProfilesStore.find(p => p.id === otEditingProfileId)?.version || 1) + 1) : 1
  };

  if (enteredByName || enteredByDesig || normalizedMobile) {
    try {
      localStorage.setItem('mvd_ot_last_entered_by', JSON.stringify({
        fullName: enteredByName,
        designation: enteredByDesig,
        mobile: normalizedMobile
      }));
    } catch (e) {}
  }

  return { isValid, data };
}

async function handleSaveDraft() {
  const { isValid, data } = extractOfficerFormData('draft');
  if (!isValid || !data) {
    showToast("Please provide at least PEN / Employee ID to save a draft.", "warning");
    return;
  }

  const currentEmail = otGetLoggedInEmail();
  const isAdmin = (otCurrentRole === 'admin' || (typeof activeSession !== 'undefined' && activeSession === 'admin'));
  if (data.officeCode) {
    const lockedEmail = getOfficeLockedEmail(data.officeCode);
    if (lockedEmail && !isAdmin && currentEmail && lockedEmail.toLowerCase() !== currentEmail.toLowerCase()) {
      showToast(`This office is entered by ${lockedEmail}. Please login with ${lockedEmail} to add and edit details.`, 'error');
      return;
    }
    if (!lockedEmail && currentEmail) {
      const lockKey = getCanonicalOfficeCode(data.officeCode) || data.officeCode;
      otOfficeLocks[lockKey] = currentEmail;
      delete otOfficeLocks['DTC'];
      localStorage.setItem('mvd_ot_office_locks', JSON.stringify(otOfficeLocks));
      window.otOfficeLocks = otOfficeLocks;
      if (typeof saveOfficeLocksToSupabase === 'function') {
        saveOfficeLocksToSupabase(otOfficeLocks);
      }
    }
  }

  const draftBtn = document.getElementById('otBtnSaveDraft');
  const origBtnContent = draftBtn ? draftBtn.innerHTML : '';
  if (draftBtn) {
    draftBtn.disabled = true;
    draftBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
  }

  try {
    saveOfficerRecordToStore(data);
    markFormDirty(false);
    otLogAudit('SAVE_DRAFT', data.pen, { officer: data.officerFullName, office: data.officeCode });

    const result = await saveOfficerQualificationToSupabase(data);
    if (result && result.success) {
      showToast(`Draft for PEN: ${data.pen} saved successfully!`, "success");
    } else {
      showToast(`Draft saved locally for PEN: ${data.pen}`, "info");
    }
    if (data.officeCode) checkOfficeAccessAndLock(data.officeCode);
  } catch (err) {
    console.warn("Draft save error:", err);
    showToast(`Draft saved locally for PEN: ${data.pen}`, "info");
  } finally {
    if (draftBtn) {
      draftBtn.disabled = false;
      draftBtn.innerHTML = origBtnContent;
    }
  }
}

async function handleProfileSubmit(e) {
  if (e) e.preventDefault();
  const { isValid, data } = extractOfficerFormData('submitted');

  if (!isValid || !data) {
    showToast("Validation failed. Please correct the highlighted errors.", "error");
    // Scroll to first error
    const firstErr = document.querySelector('.is-invalid');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const currentEmail = otGetLoggedInEmail();
  const isAdmin = (otCurrentRole === 'admin' || (typeof activeSession !== 'undefined' && activeSession === 'admin'));
  if (data.officeCode) {
    const lockedEmail = getOfficeLockedEmail(data.officeCode);
    if (lockedEmail && !isAdmin && currentEmail && lockedEmail.toLowerCase() !== currentEmail.toLowerCase()) {
      showToast(`This office is entered by ${lockedEmail}. Please login with ${lockedEmail} to add and edit details.`, 'error');
      return;
    }
    if (!lockedEmail && currentEmail) {
      const lockKey = getCanonicalOfficeCode(data.officeCode) || data.officeCode;
      otOfficeLocks[lockKey] = currentEmail;
      delete otOfficeLocks['DTC'];
      localStorage.setItem('mvd_ot_office_locks', JSON.stringify(otOfficeLocks));
      window.otOfficeLocks = otOfficeLocks;
      if (typeof saveOfficeLocksToSupabase === 'function') {
        saveOfficeLocksToSupabase(otOfficeLocks);
      }
    }
  }

  const submitBtn = document.getElementById('otBtnSubmitProfile');
  const origBtnContent = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting profile...';
  }

  try {
    // Check if office has an existing verified report: if so, mark that report for reverification
    triggerReverificationCheck(data.officeCode);

    // If PEN changed during editing, permanently delete the old PEN row from Supabase first
    if (otOriginalEditingPen && otOriginalEditingPen !== data.pen) {
      await deleteOfficerFromSupabase(otEditingProfileId, otOriginalEditingPen);
    }

    saveOfficerRecordToStore(data);
    markFormDirty(false);
    otLogAudit(otEditingProfileId ? 'UPDATE_PROFILE' : 'CREATE_PROFILE', data.pen, { officer: data.officerFullName, designation: data.designation, office: data.officeCode });

    const result = await saveOfficerQualificationToSupabase(data);

    if (result && result.success) {
      showToast(`Officer Profile for "${data.officerFullName}" (PEN: ${data.pen}) saved successfully!`, "success");
    } else {
      const errMsg = result?.error?.message || "Sync warning";
      showToast(`Saved locally, but server returned notice: ${errMsg}`, "warning");
      console.warn("Supabase save error:", result?.error);
    }

    otOriginalEditingPen = null;

    // Refresh directory and office tables
    renderAdminOfficersDirectory();
    renderOfficeSummaryReport();
    if (typeof renderAdminOfficersTable === 'function') renderAdminOfficersTable();
    resetOfficerForm();
    if (data.officeCode) {
      const officeSel = document.getElementById('otMainOfficeSelect');
      if (officeSel) officeSel.value = data.officeCode;
      checkOfficeAccessAndLock(data.officeCode);
    }
  } catch (err) {
    console.error("Profile submit error:", err);
    showToast(`Submission error: ${err.message}`, "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnContent;
    }
  }
}

function saveOfficerRecordToStore(profile) {
  const profPen = profile.pen || profile.officer_pen || profile.officerPen;
  const existingIdx = otProfilesStore.findIndex(p => (profile.id && p.id === profile.id) || (profPen && (p.pen === profPen || p.officer_pen === profPen)));
  if (existingIdx >= 0) {
    otProfilesStore[existingIdx] = profile;
  } else {
    otProfilesStore.unshift(profile);
  }
  localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));

  // Sync to officersStore in app.js
  if (typeof officersStore !== 'undefined') {
    const offIdx = officersStore.findIndex(o => o.id === profile.id || o.officer_pen === profile.pen);
    const mappedOff = {
      id: profile.id,
      office_name: profile.officeName ? `${profile.officeCode} ${profile.officeName}` : profile.officeCode,
      officer_name: profile.officerFullName,
      officer_pen: profile.pen,
      officer_designation: profile.designation,
      educational_qualification: profile.technicalQualification || profile.generalEducation || 'Plus Two',
      qualification_other: profile.technicalQualificationOther || '',
      specialization: (profile.specializedSkills || []).join(', ') || 'General',
      technical_certifications: (profile.additionalQualifications || []).map(q => `${q.qualification} (${q.status})`).join(', ') || 'None',
      training_attended: (profile.trainingHistory || []).map(t => t.attended).join('; ') || 'None',
      training_institutes: (profile.trainingHistory || []).map(t => t.conductedBy).join('; ') || 'MVD',
      recent_training_year: profile.passingYear || 2024,
      training_details: JSON.stringify(profile.trainingHistory || []),
      officer_mobile: profile.enteredBy?.mobile || '9447000000',
      officer_email: profile.enteredBy?.userId || '',
      entry_officer_name: profile.enteredBy?.fullName || '',
      entry_officer_designation: profile.enteredBy?.designation || '',
      entry_officer_mobile: profile.enteredBy?.mobile || '',
      created_at: profile.updatedAt || new Date().toISOString()
    };
    if (offIdx >= 0) {
      officersStore[offIdx] = mappedOff;
    } else {
      officersStore.push(mappedOff);
    }
    localStorage.setItem('mvd_officers_store', JSON.stringify(officersStore));
  }
}

function resetOfficerFormSync() {
  otEditingProfileId = null;
  otOriginalEditingPen = null;
  otStagedTrainings = [];
  window.otStagedTrainings = otStagedTrainings;
  otEditingTrainingIndex = -1;
  markFormDirty(false);
  clearFieldErrors();

  const form = document.getElementById('otOfficerForm');
  if (form) form.reset();
  const contribEl = document.getElementById('otWillingnessToContribute');
  if (contribEl) contribEl.value = '';
  const actionTitle = document.getElementById('otFormActionTitle');
  if (actionTitle) actionTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Register New Officer Profile';
  const cancelBtn = document.getElementById('otBtnCancelEdit');
  if (cancelBtn) cancelBtn.style.display = 'none';

  // Deselect additional qual panels & skills
  document.querySelectorAll('.ot-add-qual-chk').forEach(c => c.checked = false);
  document.querySelectorAll('.ot-qual-detail-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.ot-skill-chk').forEach(c => {
    c.checked = false;
    c.closest('.ot-skill-pill')?.classList.remove('active');
  });

  const customGroup = document.getElementById('otCustomSkillsGroup');
  if (customGroup) customGroup.style.display = 'none';
  const genEdGroup = document.getElementById('otGenEdOtherGroup');
  if (genEdGroup) genEdGroup.style.display = 'none';
  const techQualGroup = document.getElementById('otTechQualOtherGroup');
  if (techQualGroup) techQualGroup.style.display = 'none';

  renderStagedTrainingTable();
  prefillEnteredByDetails();

  const sInput = document.getElementById('otOfficeSearchInput');
  if (sInput) sInput.value = '';
  const sel = document.getElementById('otMainOfficeSelect');
  if (sel) {
    sel.querySelectorAll('option, optgroup').forEach(el => el.style.display = '');
  }

  const alertBox = document.getElementById('otOfficeLockAlert');
  if (alertBox) alertBox.style.display = 'none';
  const authPanel = document.getElementById('otOfficeAuthorizedPanel');
  if (authPanel) authPanel.style.display = 'none';
  toggleOfficerFormDisabled(false);
  return true;
}

async function resetOfficerForm(force = false) {
  if (!force && otFormDirty) {
    const ok = await (window.showCustomConfirm || showCustomConfirm)({
      title: 'Discard Changes',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      confirmText: 'Discard',
      isDanger: true
    });
    if (!ok) return false;
  }
  return resetOfficerFormSync();
}

function cancelOfficerEdit() {
  resetOfficerForm();
}

function loadProfileForEditing(profileId) {
  const cleanId = String(profileId || '').trim();
  let profile = otProfilesStore.find(p => p && (
    String(p.id || '').trim() === cleanId ||
    String(p.pen || '').trim() === cleanId ||
    String(p.officer_pen || '').trim() === cleanId ||
    String(p.officerPen || '').trim() === cleanId
  ));
  if (!profile && typeof officersStore !== 'undefined') {
    const off = officersStore.find(o => o && (String(o.id || '').trim() === cleanId || String(o.officer_pen || '').trim() === cleanId));
    if (off) {
      profile = otProfilesStore.find(p => p && String(p.pen || '').trim() === String(off.officer_pen || '').trim());
      if (!profile) {
        const offCode = (off.office_name || '').split(' ')[0] || '';
        profile = {
          id: off.id || ('prof_' + (off.officer_pen || 'item')),
          pen: off.officer_pen || '',
          officerFullName: off.officer_name || '',
          designation: off.officer_designation || 'AMVI',
          officeCode: offCode,
          officeName: off.office_name || '',
          generalEducation: 'Plus Two',
          technicalQualification: off.educational_qualification || 'Diploma',
          technicalQualificationOther: off.qualification_other || '',
          institution: '',
          passingYear: off.recent_training_year || 2024,
          grade: 'First Class',
          additionalQualifications: [],
          specializedSkills: off.specialization ? off.specialization.split(',').map(s => s.trim()) : [],
          willingnessToContribute: off.willingness_to_contribute || '',
          trainingHistory: [],
          enteredBy: {
            fullName: off.entry_officer_name || 'Admin',
            designation: off.entry_officer_designation || 'Superintendent',
            mobile: off.entry_officer_mobile || '9447000000'
          },
          status: 'submitted',
          version: 1
        };
        otProfilesStore.push(profile);
      }
    }
  }
  if (!profile) {
    showToast("Profile not found", "error");
    return;
  }

  // Normalize property names (supports both camelCase and snake_case backend sources)
  const normFullName = profile.officerFullName || profile.officer_full_name || "";
  const normPen = profile.pen || profile.officer_pen || "";
  let normDesig = profile.designation || profile.current_designation || profile.officer_designation || "";
  if (normDesig === 'JRTO' || normDesig === 'Junior RTO') normDesig = 'Joint RTO';
  const normOfficeCode = profile.officeCode || profile.office_code || "";
  const normOfficeName = profile.officeName || profile.office_name || "";
  const normGenEd = profile.generalEducation || profile.general_education || "";
  const normGenEdOther = profile.generalEducationOther || profile.general_education_other || "";
  const normTechQual = profile.technicalQualification || profile.technical_qualification || profile.educational_qualification || "";
  const normTechQualOther = profile.technicalQualificationOther || profile.technical_qualification_other || profile.qualification_other || "";
  const normInstitution = profile.institution || "";
  const normPassingYear = profile.passingYear || profile.passing_year || profile.recent_training_year || "";
  const normGrade = profile.grade || profile.class_grade || "";
  const normWillingness = profile.willingnessToContribute || profile.willingness_to_contribute || "";

  // Normalize additional qualifications (handles array or stringified JSON)
  let normAddQuals = profile.additionalQualifications || profile.additional_qualifications || [];
  if (typeof normAddQuals === 'string') {
    try { normAddQuals = JSON.parse(normAddQuals); } catch (e) { normAddQuals = []; }
  }
  if (!Array.isArray(normAddQuals)) normAddQuals = [];

  // Normalize specialized skills (handles array, stringified JSON, or comma-separated string)
  let normSkills = profile.specializedSkills || profile.specialized_skills || [];
  if (typeof normSkills === 'string') {
    try { normSkills = JSON.parse(normSkills); } catch (e) { normSkills = normSkills.split(',').map(s => s.trim()); }
  }
  if (!Array.isArray(normSkills)) normSkills = [];
  normSkills = normSkills.map(s => (s === 'IIT' ? 'IIT Trained' : s));
  const normCustomSkills = profile.customSkills || profile.custom_skills || "";

  // Normalize training history
  let normTrainings = profile.trainingHistory || profile.training_history || [];
  if (typeof normTrainings === 'string') {
    try { normTrainings = JSON.parse(normTrainings); } catch (e) { normTrainings = []; }
  }
  if (!Array.isArray(normTrainings)) normTrainings = [];

  // Normalize entered by
  const normEnteredByName = profile.enteredBy?.fullName || profile.entered_by_name || profile.entry_officer_name || "";
  const normEnteredByDesig = profile.enteredBy?.designation || profile.entered_by_designation || profile.entry_officer_designation || "";
  const normEnteredByMobile = profile.enteredBy?.mobile || profile.entered_by_mobile || profile.entry_officer_mobile || "";

  // Permission check: Admin or Authorized User or role permission
  const currentEmail = otGetLoggedInEmail();
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  const lockedEmail = getOfficeLockedEmail(normOfficeCode);
  const isAuthorized = (currentEmail && lockedEmail && currentEmail.toLowerCase() === lockedEmail.toLowerCase());

  if (lockedEmail && !isAdmin && !isAuthorized && !otHasPermission('edit_profile')) {
    showToast(`This office is entered by ${lockedEmail}. Please login with ${lockedEmail} to add and edit details.`, "error");
    return;
  }

  // Ensure dynamic form containers are rendered
  if (!document.querySelector('.ot-add-qual-chk')) {
    renderAdditionalQualOptions();
  }
  if (!document.querySelector('.ot-skill-chk')) {
    renderSpecializedSkillsOptions();
  }

  // Instantly enable edit mode without prompts
  resetOfficerFormSync();
  otEditingProfileId = profile.id;
  otOriginalEditingPen = normPen;
  document.getElementById('otFormActionTitle').innerHTML = `<i class="fa-solid fa-user-pen"></i> Edit Profile: ${escapeHtml(normFullName)} (PEN: ${escapeHtml(normPen)})`;
  document.getElementById('otBtnCancelEdit').style.display = 'inline-flex';

  // 1. Official Identification & Office
  document.getElementById('otFullName').value = normFullName;
  document.getElementById('otPen').value = normPen;

  const desigSel = document.getElementById('otDesignationSelect');
  if (desigSel) {
    desigSel.value = normDesig;
    if (!desigSel.value && normDesig) {
      const opt = Array.from(desigSel.options).find(o => o.value.toLowerCase() === normDesig.toLowerCase() || o.textContent.toLowerCase() === normDesig.toLowerCase());
      if (opt) desigSel.value = opt.value;
    }
  }

  const officeSel = document.getElementById('otMainOfficeSelect');
  if (officeSel) {
    officeSel.value = normOfficeCode;
  }
  const sInput = document.getElementById('otOfficeSearchInput');
  if (sInput) {
    const selOpt = officeSel?.querySelector(`option[value="${normOfficeCode}"]`);
    sInput.value = selOpt ? selOpt.textContent : (normOfficeCode ? `${normOfficeCode} — ${normOfficeName}` : '');
  }

  toggleOfficerFormDisabled(false);
  checkOfficeAccessAndLock(normOfficeCode);
  toggleOfficerFormDisabled(false); // Guarantee enabled state during edit mode

  // 2. Academic & Basic Technical Credentials
  const genEdSel = document.getElementById('otGenEdSelect');
  if (genEdSel) {
    genEdSel.value = normGenEd;
    if (!genEdSel.value && normGenEd) {
      genEdSel.value = "Others";
    }
    handleGeneralEducationChange(genEdSel.value);
  }
  const genEdOtherIn = document.getElementById('otGenEdOtherInput');
  if (genEdOtherIn) {
    genEdOtherIn.value = (genEdSel && genEdSel.value === "Others" && !normGenEdOther) ? normGenEd : normGenEdOther;
  }

  const techQualSel = document.getElementById('otTechQualSelect');
  if (techQualSel) {
    techQualSel.value = normTechQual;
    if (!techQualSel.value && normTechQual) {
      techQualSel.value = "Others";
    }
    handleTechnicalQualificationChange(techQualSel.value);
  }
  const techOtherIn = document.getElementById('otTechQualOtherInput');
  if (techOtherIn) {
    techOtherIn.value = (techQualSel && techQualSel.value === "Others" && !normTechQualOther) ? normTechQual : normTechQualOther;
  }

  document.getElementById('otTechInstitutionInput').value = normInstitution;
  document.getElementById('otPassingYearInput').value = normPassingYear;
  document.getElementById('otGradeInput').value = normGrade;

  // 3. Additional Qualifications Checkboxes & Dynamic Sub-Fields
  const addQualCheckboxes = Array.from(document.querySelectorAll('.ot-add-qual-chk'));
  addQualCheckboxes.forEach(c => {
    c.checked = false;
    const row = c.closest('.ot-qual-row');
    if (row) {
      const panel = row.querySelector('.ot-qual-detail-panel');
      if (panel) panel.style.display = 'none';
    }
  });

  normAddQuals.forEach(aq => {
    const qName = (typeof aq === 'string' ? aq : (aq.qualification || '')).trim();
    if (!qName) return;

    let chk = addQualCheckboxes.find(c => {
      const val = (c.value || '').toLowerCase().trim();
      const target = qName.toLowerCase().trim();
      return val === target || val.replace(/&amp;/g, '&') === target || val === target.replace(/&amp;/g, '&');
    });
    let isCustom = false;

    if (!chk) {
      chk = addQualCheckboxes.find(c => c.value.startsWith('Others'));
      isCustom = true;
    }

    if (chk) {
      chk.checked = true;
      const row = chk.closest('.ot-qual-row');
      const isNone = chk.value === 'No additional Qualifications';

      if (row && !isNone) {
        const detail = row.querySelector('.ot-qual-detail-panel');
        if (detail) detail.style.display = 'block';

        const status = (typeof aq === 'object' && aq.status) ? aq.status : 'Completed';
        const statusSel = row.querySelector('.ot-detail-status');
        if (statusSel) {
          statusSel.value = status;
          const idx = row.id ? row.id.split('_')[1] : null;
          if (idx !== null && typeof handleQualStatusChange === 'function') {
            handleQualStatusChange(idx, status);
          }
        }

        const instIn = row.querySelector('.ot-detail-inst');
        if (instIn && typeof aq === 'object' && aq.institution !== undefined) {
          instIn.value = aq.institution || '';
        }

        const yrIn = row.querySelector('.ot-detail-year');
        if (yrIn && typeof aq === 'object' && aq.year !== undefined && aq.year !== null) {
          yrIn.value = aq.year || '';
        }

        const remIn = row.querySelector('.ot-detail-remarks');
        if (remIn && typeof aq === 'object' && aq.remarks !== undefined) {
          remIn.value = aq.remarks || '';
        }

        if (isCustom) {
          const custNameIn = row.querySelector('.ot-detail-custom-name');
          if (custNameIn) {
            custNameIn.value = (typeof aq === 'object' && aq.customName) ? aq.customName : (qName !== chk.value ? qName : '');
          }
        }
      }
    }
  });

  // 4. Specialized Skills Checkboxes & Pills
  const skillCheckboxes = Array.from(document.querySelectorAll('.ot-skill-chk'));
  skillCheckboxes.forEach(cb => {
    cb.checked = false;
    cb.closest('.ot-skill-pill')?.classList.remove('active');
  });

  const customSkillsGroup = document.getElementById('otCustomSkillsGroup');
  if (customSkillsGroup) customSkillsGroup.style.display = 'none';
  const customSkillsInput = document.getElementById('otCustomSkillsInput');
  if (customSkillsInput) customSkillsInput.value = '';

  normSkills.forEach(skill => {
    const clean = (typeof skill === 'string' ? skill : '').trim();
    if (!clean) return;

    if (clean.toLowerCase().startsWith('others:')) {
      const customText = clean.replace(/^others:\s*/i, '').trim();
      const otherChk = skillCheckboxes.find(c => c.value.startsWith('Others'));
      if (otherChk) {
        otherChk.checked = true;
        otherChk.closest('.ot-skill-pill')?.classList.add('active');
        if (customSkillsGroup) customSkillsGroup.style.display = 'block';
        if (customSkillsInput) customSkillsInput.value = customText;
      }
    } else {
      const chk = skillCheckboxes.find(c => {
        const val = (c.value || '').toLowerCase().trim();
        const target = clean.toLowerCase().trim();
        return val === target || val.replace(/&amp;/g, '&') === target || val === target.replace(/&amp;/g, '&');
      });
      if (chk) {
        chk.checked = true;
        chk.closest('.ot-skill-pill')?.classList.add('active');
      } else {
        const otherChk = skillCheckboxes.find(c => c.value.startsWith('Others'));
        if (otherChk) {
          otherChk.checked = true;
          otherChk.closest('.ot-skill-pill')?.classList.add('active');
          if (customSkillsGroup) customSkillsGroup.style.display = 'block';
          if (customSkillsInput) {
            customSkillsInput.value = customSkillsInput.value ? `${customSkillsInput.value}, ${clean}` : clean;
          }
        }
      }
    }
  });

  if (normCustomSkills) {
    const otherChk = skillCheckboxes.find(c => c.value.startsWith('Others'));
    if (otherChk) {
      otherChk.checked = true;
      otherChk.closest('.ot-skill-pill')?.classList.add('active');
      if (customSkillsGroup) customSkillsGroup.style.display = 'block';
      if (customSkillsInput) customSkillsInput.value = normCustomSkills;
    }
  }

  // 5. In-Service Training History
  otStagedTrainings = JSON.parse(JSON.stringify(normTrainings));
  window.otStagedTrainings = otStagedTrainings;
  renderStagedTrainingTable();

  // 6. Willingness to contribute
  const contribEl = document.getElementById('otWillingnessToContribute');
  if (contribEl) contribEl.value = normWillingness;

  // 7. Data entered By
  const nameEl = document.getElementById('otEnteredByName');
  const desigEl = document.getElementById('otEnteredByDesignation');
  const mobEl = document.getElementById('otEnteredByMobile');

  if (nameEl) nameEl.value = normEnteredByName;
  if (desigEl) desigEl.value = normEnteredByDesig;
  if (mobEl) mobEl.value = normEnteredByMobile;

  // 8. Navigation & View Switch
  markFormDirty(false);
  clearFieldErrors();

  if (typeof selectModuleMenu === 'function') {
    selectModuleMenu('officer_training_qualification');
  } else if (typeof switchPortalModule === 'function') {
    switchPortalModule('officer_training_qualification');
  }
  switchOfficerSubTab('form');
  document.getElementById('officerTrainingFormCard')?.scrollIntoView({ behavior: 'smooth' });
  showToast(`Loaded profile for editing: ${normFullName}`, "info");
}
window.loadProfileForEditing = loadProfileForEditing;

// --- 11. PROFILE PREVIEW & SINGLE PROFILE PRINT / PDF DOWNLOAD ---

function handleProfilePreview() {
  const { data } = extractOfficerFormData('preview');
  if (!data) {
    showToast("Please enter basic officer identification details to preview.", "warning");
    return;
  }
  openProfilePreviewModal(data);
}

function openProfilePreviewModal(profile) {
  const modal = document.getElementById('otProfilePreviewModal');
  const body = document.getElementById('otProfilePreviewBody');
  if (!modal || !body) return;

  const qualBadges = (profile.additionalQualifications || []).map(aq => `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 6px; margin-bottom: 6px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="color: var(--primary-900);">${escapeHtml(aq.qualification)}</strong>
        <span class="badge ${aq.status === 'Completed' ? 'badge-working' : 'badge-warning'}">
          ${aq.status === 'Completed' ? '<i class="fa-solid fa-check-circle"></i> COMPLETED' : '<i class="fa-solid fa-clock"></i> PURSUING'}
        </span>
      </div>
      <div style="font-size: 0.83rem; color: #475569; margin-top: 4px;">
        ${aq.institution ? `<i class="fa-solid fa-building-columns"></i> ${escapeHtml(aq.institution)} • ` : ''}
        ${aq.year ? `Year: <strong>${aq.year}</strong> • ` : ''}
        ${aq.remarks ? `Remarks: <em>${escapeHtml(aq.remarks)}</em>` : ''}
      </div>
    </div>
  `).join('');

  const skillPills = (profile.specializedSkills || []).map(s => `
    <span class="badge badge-info" style="font-size: 0.82rem; padding: 4px 10px; margin: 2px;">
      <i class="fa-solid fa-check"></i> ${escapeHtml(s)}
    </span>
  `).join('');

  const trainingRows = (profile.trainingHistory && profile.trainingHistory.length > 0) ? profile.trainingHistory.map((tr, i) => `
    <tr>
      <td style="text-align: center;">${i + 1}</td>
      <td><strong>${escapeHtml(tr.attended)}</strong></td>
      <td>${escapeHtml(tr.conductedBy)}</td>
      <td>${tr.durationValue} ${escapeHtml(tr.durationUnit)}</td>
      <td><strong>${escapeHtml(tr.monthYear)}</strong></td>
    </tr>
  `).join('') : `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No training records recorded.</td></tr>`;

  body.innerHTML = `
    <div class="ot-preview-container">
      
      <!-- Top Emblem Bar -->
      <div style="text-align: center; border-bottom: 3px solid #0B3B24; padding-bottom: 14px; margin-bottom: 18px;">
        <h2 style="font-size: 1.25rem; color: #0B3B24; margin: 0; font-weight: 800; text-transform: uppercase;">Motor Vehicles Department • Government of Kerala</h2>
        <h4 style="font-size: 0.98rem; color: #047857; margin: 4px 0 0 0; font-weight: 700;">OFFICER TRAINING & QUALIFICATION PROFILE</h4>
        <span style="font-size: 0.78rem; color: #64748b;">Official Service & Technical Qualifications Record</span>
      </div>

      <!-- Section 1 -->
      <div class="ot-preview-box">
        <h4><i class="fa-solid fa-id-card"></i> 1. Official Identification & Current Posting</h4>
        <div class="form-grid-2" style="font-size: 0.9rem;">
          <div><strong>Officer Full Name:</strong> ${escapeHtml(profile.officerFullName)}</div>
          <div><strong>PEN / Employee ID:</strong> <span class="badge badge-info" style="font-size: 0.9rem;">${escapeHtml(profile.pen)}</span></div>
          <div><strong>Current Designation:</strong> <span class="badge badge-working">${escapeHtml(profile.designation)}</span></div>
          <div><strong>Current Office:</strong> <strong>${escapeHtml(profile.officeCode)} — ${escapeHtml(profile.officeName)}</strong></div>
        </div>
      </div>

      <!-- Section 2 -->
      <div class="ot-preview-box">
        <h4><i class="fa-solid fa-graduation-cap"></i> 2. Academic & Basic Technical Credentials</h4>
        <div class="form-grid-2" style="font-size: 0.9rem; margin-bottom: 12px;">
          <div><strong>General Education:</strong> ${escapeHtml(profile.generalEducation === 'Others' ? profile.generalEducationOther : profile.generalEducation)}</div>
          <div><strong>Basic Technical Qualification:</strong> <strong>${escapeHtml(profile.technicalQualification === 'Others' ? profile.technicalQualificationOther : profile.technicalQualification)}</strong></div>
          <div><strong>Institution / Board / University:</strong> ${escapeHtml(profile.institution || 'N/A')}</div>
          <div><strong>Passing Year & Grade:</strong> ${escapeHtml(profile.passingYear || 'N/A')} (${escapeHtml(profile.grade || 'N/A')})</div>
        </div>

        <div style="margin-top: 10px;">
          <strong style="font-size: 0.88rem; color: #0f172a;">Additional Qualifications:</strong>
          <div style="margin-top: 6px;">
            ${qualBadges || '<span style="color: var(--text-muted); font-size: 0.85rem;">None recorded</span>'}
          </div>
        </div>
      </div>

      <!-- Section 3 -->
      <div class="ot-preview-box">
        <h4><i class="fa-solid fa-star"></i> 3. Specialized Skills & In-Service Trainings</h4>
        <div style="margin-bottom: 12px;">
          <strong style="font-size: 0.88rem; color: #0f172a;">Specialized Skills Recorded:</strong>
          <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
            ${skillPills || '<span style="color: var(--text-muted); font-size: 0.85rem;">None recorded</span>'}
          </div>
        </div>

        <div>
          <strong style="font-size: 0.88rem; color: #0f172a;">In-Service Training History:</strong>
          <table class="data-table" style="margin-top: 6px; font-size: 0.82rem;">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Training Attended</th>
                <th>Conducted By</th>
                <th>Duration</th>
                <th>Month & Year</th>
              </tr>
            </thead>
            <tbody>
              ${trainingRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 5 -->
      <div class="ot-preview-box">
        <h4><i class="fa-solid fa-hands-helping"></i> 5. Willingness to Contribute Other than Basic Duties</h4>
        <div style="font-size: 0.9rem; color: #1e293b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 6px; white-space: pre-wrap;">
          ${escapeHtml(profile.willingnessToContribute || 'None specified')}
        </div>
      </div>

      <!-- Section 6 -->
      <div class="ot-preview-box" style="background: #f0fdf4; border-color: #a7f3d0;">
        <h4><i class="fa-solid fa-user-pen"></i> 6. Data entered By</h4>
        <div class="form-grid-3" style="font-size: 0.85rem;">
          <div><strong>Data entered By:</strong> ${escapeHtml(profile.enteredBy?.fullName || 'N/A')}</div>
          <div><strong>Designation:</strong> ${escapeHtml(profile.enteredBy?.designation || 'N/A')}</div>
          <div><strong>Mobile:</strong> 📞 ${escapeHtml(profile.enteredBy?.mobile || 'N/A')}</div>
        </div>
        <div style="margin-top: 8px; font-size: 0.78rem; color: #047857;">
          <i class="fa-regular fa-clock"></i> Timestamp (IST): ${otFormatIST(profile.updatedAt || profile.createdAt)}
          • Status: <strong>${profile.status === 'submitted' ? 'SUBMITTED' : 'DRAFT'}</strong>
        </div>
      </div>

    </div>
  `;

  modal.style.display = 'flex';
}

function closeProfilePreviewModal() {
  document.getElementById('otProfilePreviewModal').style.display = 'none';
}

function printCurrentProfilePreview() {
  document.body.classList.add('printing-modal');
  const modal = document.getElementById('otProfilePreviewModal');
  if (modal) modal.classList.add('print-active');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-modal');
    if (modal) modal.classList.remove('print-active');
  }, 1000);
}

// --- 12. ADMINISTRATIVE DIRECTORY & FILTER LISTING ---

function renderAdminOfficersDirectory() {
  const tbody = document.getElementById('otDirTableBody');
  const countEl = document.getElementById('otDirResultCount');
  if (!tbody) return;

  const q = (document.getElementById('otDirSearchInput')?.value || "").toLowerCase().trim();
  const office = document.getElementById('otDirOfficeFilter')?.value || "ALL";
  const designation = document.getElementById('otDirDesignationFilter')?.value || "ALL";
  const techQual = document.getElementById('otDirTechQualFilter')?.value || "ALL";
  const addQual = document.getElementById('otDirAddQualFilter')?.value || "ALL";
  const status = document.getElementById('otDirStatusFilter')?.value || "ALL"; // 'draft' | 'submitted' | 'ALL'
  const skill = document.getElementById('otDirSkillFilter')?.value || "ALL";
  const trYear = document.getElementById('otDirTrainingYearFilter')?.value || "ALL";

  // Filter profiles
  let filtered = otProfilesStore.filter(p => {
    if (q) {
      const hay = `${p.officerFullName} ${p.pen} ${p.officeCode} ${p.officeName} ${p.institution || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (office !== "ALL" && p.officeCode !== office) return false;
    if (designation !== "ALL" && p.designation !== designation) return false;
    if (techQual !== "ALL" && p.technicalQualification !== techQual) return false;
    if (status !== "ALL" && p.status !== status) return false;

    if (addQual !== "ALL") {
      const hasQual = (p.additionalQualifications || []).some(aq => aq.qualification === addQual || (addQual === 'Others — Specify' && !ADDITIONAL_QUAL_OPTIONS.includes(aq.qualification)));
      if (!hasQual) return false;
    }

    if (skill !== "ALL") {
      const hasSkill = (p.specializedSkills || []).some(s => s === skill || s.includes(skill));
      if (!hasSkill) return false;
    }

    if (trYear !== "ALL") {
      const hasTrYear = (p.trainingHistory || []).some(t => t.monthYear && t.monthYear.startsWith(trYear));
      if (!hasTrYear) return false;
    }

    return true;
  });

  if (countEl) countEl.textContent = `${filtered.length} Officers Found`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">
          <i class="fa-solid fa-user-xmark" style="font-size: 2rem; color: #cbd5e1; display: block; margin-bottom: 8px;"></i>
          No officer profiles matched your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((p, idx) => {
    const qualBadges = (p.additionalQualifications || []).map(aq => `
      <span class="badge ${aq.status === 'Completed' ? 'badge-working' : 'badge-warning'}" style="font-size: 0.72rem; padding: 1px 6px; margin: 1px;">
        ${escapeHtml(aq.qualification)} (${aq.status})
      </span>
    `).join(' ');

    const skillsStr = (p.specializedSkills || []).slice(0, 2).map(s => escapeHtml(s)).join(', ') + ((p.specializedSkills || []).length > 2 ? ` (+${p.specializedSkills.length - 2} more)` : '');

    return `
      <tr>
        <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
        <td>
          <div style="font-weight: 800; color: #0f172a;">${escapeHtml(p.officerFullName)}</div>
          <div style="font-size: 0.78rem; color: #0284c7; font-weight: 700;"><i class="fa-solid fa-hashtag"></i> PEN: ${escapeHtml(p.pen)}</div>
        </td>
        <td><span class="badge badge-info">${escapeHtml(p.designation)}</span></td>
        <td>
          <div style="font-size: 0.84rem; font-weight: 700; color: #0f172a;">${escapeHtml(p.officeCode)}</div>
          <div style="font-size: 0.76rem; color: #475569;">${escapeHtml(p.officeName)}</div>
        </td>
        <td>
          <strong>${escapeHtml(p.technicalQualification === 'Others' ? p.technicalQualificationOther : p.technicalQualification)}</strong>
          ${p.institution ? `<br><small style="color: #64748b;">${escapeHtml(p.institution)}</small>` : ''}
        </td>
        <td>${qualBadges || '<small style="color: #94a3b8;">None</small>'}</td>
        <td><small style="color: #334155;">${skillsStr || '<span style="color: #94a3b8;">None</span>'}</small></td>
        <td>
          <span class="badge ${p.status === 'submitted' ? 'badge-working' : 'badge-danger'}">
            ${p.status === 'submitted' ? 'SUBMITTED' : 'DRAFT'}
          </span>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 4px; justify-content: center;">
            <button class="btn btn-outline btn-sm" onclick="openProfilePreviewModal(otProfilesStore.find(x => x.id === '${p.id}'))" title="Preview Profile">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-primary btn-sm" onclick="loadProfileForEditing('${p.id}')" title="Edit Profile">
              <i class="fa-solid fa-pen"></i>
            </button>
            ${otHasPermission('edit_profile') ? `
              <button class="btn btn-danger btn-sm" onclick="deleteOfficerProfile('${p.id}')" title="Delete Profile">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function resetAdminDirectoryFilters() {
  document.getElementById('otDirSearchInput').value = "";
  document.getElementById('otDirOfficeFilter').value = "ALL";
  document.getElementById('otDirDesignationFilter').value = "ALL";
  document.getElementById('otDirTechQualFilter').value = "ALL";
  document.getElementById('otDirAddQualFilter').value = "ALL";
  document.getElementById('otDirStatusFilter').value = "ALL";
  document.getElementById('otDirSkillFilter').value = "ALL";
  document.getElementById('otDirTrainingYearFilter').value = "ALL";
  renderAdminOfficersDirectory();
}

async function deleteOfficerProfile(profileId) {
  let p = otProfilesStore.find(x => x.id === profileId || x.pen === profileId);
  if (!p && typeof officersStore !== 'undefined') {
    const off = officersStore.find(o => o.id === profileId || o.officer_pen === profileId);
    if (off) {
      p = otProfilesStore.find(x => x.pen === off.officer_pen) || {
        id: off.id,
        pen: off.officer_pen,
        officerFullName: off.officer_name,
        officeCode: (off.office_name || '').split(' ')[0] || '',
        officeName: off.office_name || ''
      };
    }
  }
  if (!p) {
    showToast("Officer profile not found", "error");
    return;
  }

  // Permission check: Admin or Authorized User
  const currentEmail = otGetLoggedInEmail();
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  const lockedEmail = getOfficeLockedEmail(p.officeCode);
  const isAuthorized = (currentEmail && lockedEmail && currentEmail.toLowerCase() === lockedEmail.toLowerCase());

  if (lockedEmail && !isAdmin && !isAuthorized) {
    showToast(`This office is entered by ${lockedEmail}. Please login with ${lockedEmail} to add and edit details.`, 'error');
    return;
  }

  const confirmFn = window.showCustomConfirm || (typeof showCustomConfirm === 'function' ? showCustomConfirm : null);
  let confirmed = false;
  if (confirmFn) {
    confirmed = await confirmFn({
      title: 'Delete Officer Profile',
      message: `Are you sure you want to permanently delete profile for "${p.officerFullName}" (PEN: ${p.pen})?`,
      confirmText: 'Delete',
      isDanger: true
    });
  } else {
    confirmed = window.confirm(`Are you sure you want to permanently delete profile for "${p.officerFullName}" (PEN: ${p.pen})?`);
  }
  if (!confirmed) return;

  const pen = p.pen;
  const pId = p.id;
  const officeCode = p.officeCode;
  const officerName = p.officerFullName;

  // 1. Remove from local stores
  otProfilesStore = otProfilesStore.filter(x => x.id !== pId && x.pen !== pen);
  localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));

  if (typeof officersStore !== 'undefined') {
    officersStore = officersStore.filter(x => x.id !== pId && x.officer_pen !== pen);
    localStorage.setItem('mvd_officers_store', JSON.stringify(officersStore));
  }

  triggerReverificationCheck(officeCode);
  otLogAudit('DELETE_PROFILE', pen, { officer: officerName, office: officeCode });

  // 2. Delete from remote database in real time
  showToast(`Deleting profile for "${officerName}"...`, "info");
  const delRes = await deleteOfficerFromSupabase(pId, pen);

  if (delRes && delRes.success) {
    showToast(`Successfully deleted profile for "${officerName}" (PEN: ${pen}).`, "success");
  } else {
    showToast(`Deleted locally. Note: ${delRes?.error?.message || 'Remote sync completed'}`, "info");
  }

  // 3. Re-render directory and office tables
  renderAdminOfficersDirectory();
  renderOfficeSummaryReport();
  if (typeof renderAdminOfficersTable === 'function') renderAdminOfficersTable();
  if (officeCode) {
    renderOfficeEditOptionList(officeCode);
    checkOfficeAccessAndLock(officeCode);
  }
}
window.deleteOfficerProfile = deleteOfficerProfile;

// Multi-file CSV Export (Officer Profiles CSV and Linked Trainings CSV)
function exportOfficersDirectoryDualCSV() {
  if (otProfilesStore.length === 0) {
    showToast("No officer profiles available to export.", "warning");
    return;
  }

  // 1. Primary Profiles CSV
  const profileHeaders = [
    "PEN", "Full Name", "Designation", "Office Code", "Office Name",
    "General Education", "Basic Technical Qualification", "Institution", "Passing Year", "Grade",
    "Completed Additional Quals", "Pursuing Additional Quals", "Specialized Skills",
    "Willingness to Contribute",
    "Total Trainings Count", "Status", "Entered By Name", "Entered By Designation", "Entered By Mobile", "Last Updated IST"
  ];

  const profileRows = otProfilesStore.map(p => {
    const compQuals = (p.additionalQualifications || []).filter(q => q.status === 'Completed').map(q => q.qualification).join("; ");
    const purQuals = (p.additionalQualifications || []).filter(q => q.status === 'Pursuing').map(q => q.qualification).join("; ");
    const skills = (p.specializedSkills || []).join("; ");
    const trCount = (p.trainingHistory || []).length;

    return [
      `"${p.pen}"`,
      `"${p.officerFullName.replace(/"/g, '""')}"`,
      `"${p.designation}"`,
      `"${p.officeCode}"`,
      `"${p.officeName.replace(/"/g, '""')}"`,
      `"${p.generalEducation === 'Others' ? p.generalEducationOther : p.generalEducation}"`,
      `"${p.technicalQualification === 'Others' ? p.technicalQualificationOther : p.technicalQualification}"`,
      `"${(p.institution || '').replace(/"/g, '""')}"`,
      p.passingYear || "",
      `"${(p.grade || '').replace(/"/g, '""')}"`,
      `"${compQuals.replace(/"/g, '""')}"`,
      `"${purQuals.replace(/"/g, '""')}"`,
      `"${skills.replace(/"/g, '""')}"`,
      `"${(p.willingnessToContribute || '').replace(/"/g, '""')}"`,
      trCount,
      p.status,
      `"${(p.enteredBy?.fullName || '').replace(/"/g, '""')}"`,
      `"${(p.enteredBy?.designation || '').replace(/"/g, '""')}"`,
      `"${p.enteredBy?.mobile || ''}"`,
      `"${otFormatIST(p.updatedAt || p.createdAt)}"`
    ].join(',');
  });

  const profilesCsvContent = "data:text/csv;charset=utf-8," + [profileHeaders.join(','), ...profileRows].join('\n');
  otDownloadCsvFile(profilesCsvContent, `MVD_Officers_Profiles_${Date.now()}.csv`);

  // 2. Linked Trainings CSV (Linked by PEN)
  const trainingHeaders = ["PEN", "Officer Name", "Designation", "Office Code", "Training Attended", "Conducted By", "Duration Value", "Duration Unit", "Month & Year"];
  const trainingRows = [];

  otProfilesStore.forEach(p => {
    (p.trainingHistory || []).forEach(tr => {
      trainingRows.push([
        `"${p.pen}"`,
        `"${p.officerFullName.replace(/"/g, '""')}"`,
        `"${p.designation}"`,
        `"${p.officeCode}"`,
        `"${tr.attended.replace(/"/g, '""')}"`,
        `"${tr.conductedBy.replace(/"/g, '""')}"`,
        tr.durationValue,
        `"${tr.durationUnit}"`,
        `"${tr.monthYear}"`
      ].join(','));
    });
  });

  if (trainingRows.length > 0) {
    const trainingsCsvContent = "data:text/csv;charset=utf-8," + [trainingHeaders.join(','), ...trainingRows].join('\n');
    setTimeout(() => {
      otDownloadCsvFile(trainingsCsvContent, `MVD_Officers_Linked_Trainings_${Date.now()}.csv`);
    }, 500);
  }

  showToast("Exported Officers Profiles & Linked Trainings CSV files successfully!", "success");
}

function otDownloadCsvFile(encodedContent, filename) {
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(encodedContent));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- 13. OFFICE-WISE SUMMARY REPORT & VERIFICATION WORKFLOW ---

let otCurrentReportOfficeCode = "";
window.otCurrentReportOfficeCode = "";

function handleReportOfficeSelectChange(officeCode) {
  const userEmail = otGetLoggedInEmail();
  const isAdmin = (otCurrentRole === 'admin' || (typeof activeSession !== 'undefined' && activeSession === 'admin'));
  if (!isAdmin) {
    if (!userEmail) {
      if (typeof showToast === 'function') showToast("Please log in to view summary reports.", "warning");
      renderEmptyUserSummaryReport("Unauthenticated User");
      return;
    }
    const authorizedOffices = getAllOfficesLinkedToUser(userEmail);
    if (!authorizedOffices.includes(officeCode)) {
      if (typeof showToast === 'function') showToast("Access Denied: You are only authorized to view your assigned office.", "error");
      const reportSelect = document.getElementById('otReportOfficeSelect');
      if (reportSelect && authorizedOffices.length > 0) {
        reportSelect.value = authorizedOffices[0];
      }
      return;
    }
  }
  otCurrentReportOfficeCode = officeCode;
  window.otCurrentReportOfficeCode = officeCode;
  renderOfficeSummaryReport();
}
window.handleReportOfficeSelectChange = handleReportOfficeSelectChange;

function renderEmptyUserSummaryReport(userEmail) {
  const reportSelect = document.getElementById('otReportOfficeSelect');
  if (reportSelect) {
    reportSelect.innerHTML = '<option value="">-- No Authorized Office --</option>';
    reportSelect.disabled = true;
    reportSelect.value = "";
    reportSelect.title = "No office is authorized for your account yet";
  }

  const headerOfficeEl = document.getElementById('otReportHeaderOffice');
  if (headerOfficeEl) headerOfficeEl.textContent = "No Authorized Office Found";

  const cutoffEl = document.getElementById('otReportCutoffTime');
  if (cutoffEl) cutoffEl.textContent = otFormatIST(new Date().toISOString());

  const genDateEl = document.getElementById('otReportGenDate');
  if (genDateEl) genDateEl.textContent = otFormatIST(new Date().toISOString());

  const statusBadge = document.getElementById('otReportVerificationStatusBadge');
  if (statusBadge) {
    statusBadge.className = 'badge badge-secondary';
    statusBadge.innerHTML = `<i class="fa-solid fa-lock"></i> ACCESS RESTRICTED`;
  }

  const draftAlert = document.getElementById('otReportExcludedDraftsAlert');
  if (draftAlert) {
    draftAlert.style.display = 'flex';
    draftAlert.innerHTML = `
      <i class="fa-solid fa-circle-exclamation" style="font-size: 1.1rem; color: #0284c7;"></i>
      <span><strong>Access Restricted:</strong> Logged in as <strong>${escapeHtml(userEmail || 'User')}</strong>. You do not have an authorized office assigned or active. Please select your office in the <strong>Officer Entry &amp; Qualification</strong> tab to view and generate the Summary Report for your office.</span>
    `;
  }

  // Clear metric cards
  if (document.getElementById('otSummTotalOfficers')) document.getElementById('otSummTotalOfficers').textContent = "0";
  if (document.getElementById('otSummDesigCounts')) document.getElementById('otSummDesigCounts').innerHTML = "RTO: <strong>0</strong> • JRTO: <strong>0</strong> • MVI: <strong>0</strong> • AMVI: <strong>0</strong>";
  if (document.getElementById('otSummCompAddQual')) document.getElementById('otSummCompAddQual').textContent = "0";
  if (document.getElementById('otSummPursAddQual')) document.getElementById('otSummPursAddQual').textContent = "0";
  if (document.getElementById('otSummSkills')) document.getElementById('otSummSkills').textContent = "0";
  if (document.getElementById('otSummWithTrainings')) document.getElementById('otSummWithTrainings').textContent = "0";
  if (document.getElementById('otSummTotalTrainings')) document.getElementById('otSummTotalTrainings').textContent = "0";
  if (document.getElementById('otSummTechQualPills')) document.getElementById('otSummTechQualPills').innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">None</span>';

  // Clear tables
  const detailsTbody = document.getElementById('otReportDetailsTableBody');
  if (detailsTbody) {
    detailsTbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No authorized office linked to your account (${escapeHtml(userEmail || 'User')}). Select your office to view office data.</td></tr>`;
  }
  const annexTbody = document.getElementById('otReportAnnexureTableBody');
  if (annexTbody) {
    annexTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No training history records available.</td></tr>`;
  }
  const contribTbody = document.getElementById('otReportContributorsTableBody');
  if (contribTbody) {
    contribTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">No contributors recorded.</td></tr>`;
  }

  const digiVerifBox = document.getElementById('otReportDigitalVerificationDisplay');
  if (digiVerifBox) digiVerifBox.style.display = 'none';

  const dispatchBox = document.getElementById('otReportForwardingDetailsDisplay');
  if (dispatchBox) dispatchBox.style.display = 'none';

  const btnForward = document.getElementById('otBtnTriggerForward');
  if (btnForward) btnForward.style.display = 'none';
}

function renderOfficeSummaryReport() {
  const userEmail = otGetLoggedInEmail();
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  const reportSelect = document.getElementById('otReportOfficeSelect');

  let officeCode = (typeof window !== 'undefined' && window.otCurrentReportOfficeCode) || otCurrentReportOfficeCode;

  // Filter report to strictly show only the authorized office for authenticated non-admin users
  if (!isAdmin) {
    if (!userEmail) {
      renderEmptyUserSummaryReport("Unauthenticated User");
      return;
    }
    const authorizedOffices = getAllOfficesLinkedToUser(userEmail);
    if (!authorizedOffices || authorizedOffices.length === 0) {
      renderEmptyUserSummaryReport(userEmail);
      return;
    }

    if (!officeCode || !authorizedOffices.includes(officeCode)) {
      officeCode = authorizedOffices[0];
      otCurrentReportOfficeCode = officeCode;
      window.otCurrentReportOfficeCode = officeCode;
    }

    if (reportSelect) {
      reportSelect.innerHTML = authorizedOffices.map(c => {
        const off = ALL_MVD_OFFICES.find(o => o.code === c) || { code: c, name: c };
        return `<option value="${escapeHtml(c)}">${escapeHtml(c)} — ${escapeHtml(off.name)}</option>`;
      }).join('');
      reportSelect.value = officeCode;
      reportSelect.disabled = (authorizedOffices.length === 1);
      reportSelect.title = (authorizedOffices.length === 1) ? "Summary Report is restricted to your authorized office" : "";
    }
  } else {
    // Admin mode: can inspect all offices
    if (!officeCode) {
      officeCode = reportSelect?.value || "KL01";
      otCurrentReportOfficeCode = officeCode;
    }
    if (reportSelect) {
      if (reportSelect.options.length <= 1) {
        reportSelect.innerHTML = '<option value="">-- Select Office (Code — Name) --</option>';
        Object.entries(OT_OFFICE_GROUPS).forEach(([groupName, offices]) => {
          const optgroup = document.createElement('optgroup');
          optgroup.label = groupName;
          offices.forEach(off => {
            const opt = document.createElement('option');
            opt.value = off.code;
            opt.textContent = `${off.code} — ${off.name}`;
            optgroup.appendChild(opt);
          });
          reportSelect.appendChild(optgroup);
        });
      }
      reportSelect.disabled = false;
      reportSelect.value = officeCode;
      reportSelect.title = "Select office to review summary report";
    }
  }

  const officeObj = ALL_MVD_OFFICES.find(o => o.code === officeCode) || { code: officeCode, name: "Selected Office" };

  // Fetch all profiles for this office
  const allProfiles = otProfilesStore.filter(p => p.officeCode === officeCode);
  const submittedProfiles = allProfiles.filter(p => p.status === 'submitted');
  const draftProfiles = allProfiles.filter(p => p.status === 'draft');

  // Check saved snapshot for this office
  const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
  const canonCode = getCanonicalOfficeCode(officeCode) || officeCode;
  const savedSnapshot = snapStore[canonCode] || snapStore[officeCode];
  const isVerified = savedSnapshot && savedSnapshot.isVerified;
  const isReverificationRequired = savedSnapshot && savedSnapshot.reverificationRequired;
  const isForwarded = savedSnapshot && savedSnapshot.isForwarded === true;

  // Header Elements
  const headerOfficeEl = document.getElementById('otReportHeaderOffice');
  if (headerOfficeEl) headerOfficeEl.textContent = `${officeObj.name} (${officeObj.code})`;

  const cutoffEl = document.getElementById('otReportCutoffTime');
  if (cutoffEl) cutoffEl.textContent = savedSnapshot ? otFormatIST(savedSnapshot.cutoffTimestamp) : otFormatIST(new Date().toISOString());

  const genDateEl = document.getElementById('otReportGenDate');
  if (genDateEl) genDateEl.textContent = otFormatIST(new Date().toISOString());

  // Report Status Badge: SENT TO TRANSPORT COMMISSIONERATE when forwarded, explicitly ASSIGNED when reverted/open
  const statusBadge = document.getElementById('otReportVerificationStatusBadge');
  if (statusBadge) {
    if (isForwarded) {
      statusBadge.className = 'badge badge-working';
      statusBadge.innerHTML = `<i class="fa-solid fa-paper-plane"></i> SENT TO TRANSPORT COMMISSIONERATE`;
    } else {
      statusBadge.className = 'badge badge-info';
      statusBadge.innerHTML = `<i class="fa-solid fa-folder-open"></i> ASSIGNED`;
    }
  }

  // Excluded Drafts Alert
  const draftAlert = document.getElementById('otReportExcludedDraftsAlert');
  if (draftAlert) {
    if (draftProfiles.length > 0) {
      draftAlert.style.display = 'flex';
      draftAlert.innerHTML = `
        <i class="fa-solid fa-circle-info" style="font-size: 1.1rem; color: #b45309;"></i>
        <span><strong>Notice:</strong> <strong>${draftProfiles.length} draft profile(s)</strong> are currently excluded from this report snapshot. Only finalized, submitted officer profiles are forwarded to the Transport Commissionerate.</span>
      `;
    } else {
      draftAlert.style.display = 'none';
    }
  }

  // Summary Metrics Computation (each officer counted once per category)
  const totalOfficers = submittedProfiles.length;
  const desigCounts = { RTO: 0, "Joint RTO": 0, MVI: 0, AMVI: 0 };
  const techQualCounts = {};
  TECH_QUAL_OPTIONS.forEach(t => techQualCounts[t] = 0);

  let officersWithCompletedAddQual = 0;
  let officersWithPursuingAddQual = 0;
  let officersWithSkills = 0;
  let officersWithTrainings = 0;
  let totalTrainingsCount = 0;

  submittedProfiles.forEach(p => {
    // Designation counts
    if (desigCounts[p.designation] !== undefined) desigCounts[p.designation]++;

    // Tech qual counts
    const tq = p.technicalQualification || "Others";
    techQualCounts[tq] = (techQualCounts[tq] || 0) + 1;

    // Add quals
    const hasCompleted = (p.additionalQualifications || []).some(q => q.status === 'Completed');
    const hasPursuing = (p.additionalQualifications || []).some(q => q.status === 'Pursuing');
    if (hasCompleted) officersWithCompletedAddQual++;
    if (hasPursuing) officersWithPursuingAddQual++;

    // Skills
    if ((p.specializedSkills || []).length > 0) officersWithSkills++;

    // Trainings
    const trList = p.trainingHistory || [];
    if (trList.length > 0) {
      officersWithTrainings++;
      totalTrainingsCount += trList.length;
    }
  });

  // Render Metric Cards
  document.getElementById('otSummTotalOfficers').textContent = totalOfficers;
  document.getElementById('otSummDesigCounts').innerHTML = `
    RTO: <strong>${desigCounts.RTO}</strong> • 
    JRTO: <strong>${desigCounts['Joint RTO']}</strong> • 
    MVI: <strong>${desigCounts.MVI}</strong> • 
    AMVI: <strong>${desigCounts.AMVI}</strong>
  `;
  document.getElementById('otSummCompAddQual').textContent = officersWithCompletedAddQual;
  document.getElementById('otSummPursAddQual').textContent = officersWithPursuingAddQual;
  document.getElementById('otSummSkills').textContent = officersWithSkills;
  document.getElementById('otSummWithTrainings').textContent = officersWithTrainings;
  document.getElementById('otSummTotalTrainings').textContent = totalTrainingsCount;

  // Tech Qual Pills
  const techPillsEl = document.getElementById('otSummTechQualPills');
  if (techPillsEl) {
    techPillsEl.innerHTML = Object.entries(techQualCounts)
      .filter(([k, v]) => v > 0)
      .map(([k, v]) => `<span class="badge badge-info" style="margin: 2px;">${escapeHtml(k)}: <strong>${v}</strong></span>`)
      .join(' ') || '<span style="color: var(--text-muted); font-size: 0.85rem;">None</span>';
  }

  // Section D: Officer-wise Details Table
  const detailsTbody = document.getElementById('otReportDetailsTableBody');
  if (detailsTbody) {
    if (submittedProfiles.length === 0) {
      detailsTbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No submitted officer profiles found for this office.</td></tr>`;
    } else {
      detailsTbody.innerHTML = submittedProfiles.map((p, idx) => {
        const addQualsList = (p.additionalQualifications || []).map(aq => `
          <div>
            • <strong>${escapeHtml(aq.qualification)}</strong>
            <span class="badge ${aq.status === 'Completed' ? 'badge-working' : 'badge-warning'}" style="font-size: 0.7rem; padding: 1px 4px;">${aq.status}</span>
            ${aq.year ? `(${aq.year})` : ''}
          </div>
        `).join('') || '<span style="color: #94a3b8;">None</span>';

        const skillsList = (p.specializedSkills || []).map(s => `<div>• ${escapeHtml(s)}</div>`).join('') || '<span style="color: #94a3b8;">None</span>';

        return `
          <tr>
            <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
            <td><strong>${escapeHtml(p.officerFullName)}</strong></td>
            <td><span class="badge badge-info">${escapeHtml(p.pen)}</span></td>
            <td><strong>${escapeHtml(p.designation)}</strong></td>
            <td>${escapeHtml(p.generalEducation === 'Others' ? p.generalEducationOther : p.generalEducation)}</td>
            <td>
              <strong>${escapeHtml(p.technicalQualification === 'Others' ? p.technicalQualificationOther : p.technicalQualification)}</strong><br>
              <small style="color: #475569;">${escapeHtml(p.institution || 'N/A')}</small><br>
              <small style="color: #047857;">Passing Year: ${p.passingYear || 'N/A'} • Grade: ${escapeHtml(p.grade || 'N/A')}</small>
            </td>
            <td><div style="font-size: 0.82rem; line-height: 1.4;">${addQualsList}</div></td>
            <td><div style="font-size: 0.82rem; line-height: 1.4;">${skillsList}</div></td>
            <td><div style="font-size: 0.82rem; line-height: 1.4; color: #334155;">${escapeHtml(p.willingnessToContribute || 'None')}</div></td>
          </tr>
        `;
      }).join('');
    }
  }

  // Section E: Training History Annexure
  const annexTbody = document.getElementById('otReportAnnexureTableBody');
  if (annexTbody) {
    const allTrainings = [];
    submittedProfiles.forEach(p => {
      (p.trainingHistory || []).forEach(tr => {
        allTrainings.push({
          officerName: p.officerFullName,
          pen: p.pen,
          ...tr
        });
      });
    });

    if (allTrainings.length === 0) {
      annexTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No training records registered for submitted officers in this office.</td></tr>`;
    } else {
      annexTbody.innerHTML = allTrainings.map((tr, idx) => `
        <tr>
          <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
          <td><strong>${escapeHtml(tr.officerName)}</strong> (PEN: ${escapeHtml(tr.pen)})</td>
          <td><strong>${escapeHtml(tr.attended)}</strong></td>
          <td>${escapeHtml(tr.conductedBy)}</td>
          <td><span class="badge badge-info">${tr.durationValue} ${escapeHtml(tr.durationUnit)}</span></td>
          <td><strong>${escapeHtml(tr.monthYear)}</strong></td>
        </tr>
      `).join('');
    }
  }

  // Section F: Prepared / Entered By Contributors
  const contribTbody = document.getElementById('otReportContributorsTableBody');
  if (contribTbody) {
    const contributors = {};
    submittedProfiles.forEach(p => {
      if (p.enteredBy && p.enteredBy.fullName) {
        const key = p.enteredBy.fullName + "_" + p.enteredBy.mobile;
        contributors[key] = p.enteredBy;
      }
    });

    const contribList = Object.values(contributors);
    if (contribList.length === 0) {
      contribTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No submitter details stored.</td></tr>`;
    } else {
      contribTbody.innerHTML = contribList.map((c, i) => `
        <tr>
          <td style="text-align: center;">${i + 1}</td>
          <td><strong>${escapeHtml(c.fullName)}</strong></td>
          <td>${escapeHtml(c.designation)}</td>
          <td>📞 ${escapeHtml(c.mobile)}</td>
        </tr>
      `).join('');
    }
  }

  // Digital Verification Box Display (Skipped in simplified workflow)
  const digiVerifBox = document.getElementById('otReportDigitalVerificationDetails');
  if (digiVerifBox) {
    digiVerifBox.style.display = 'none';
  }

  // Dispatch / Forwarding Box Display
  const dispatchBox = document.getElementById('otReportForwardingDetailsDisplay');
  if (dispatchBox) {
    if (savedSnapshot && savedSnapshot.isForwarded) {
      dispatchBox.style.display = 'block';
      dispatchBox.innerHTML = `
        <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 14px 18px; margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 8px;">
            <div style="color: #1d4ed8; font-weight: 800; font-size: 0.95rem;">
              <i class="fa-solid fa-paper-plane"></i> SENT TO TRANSPORT COMMISSIONERATE
            </div>
            <span class="badge badge-working" style="font-size: 0.8rem; padding: 4px 8px;"><i class="fa-solid fa-circle-check"></i> Dispatched</span>
          </div>
          <div class="form-grid-4" style="font-size: 0.85rem; margin-top: 6px; gap: 12px;">
            <div><strong>Head of Office:</strong><br>${escapeHtml(savedSnapshot.dispatchDetails?.headName || savedSnapshot.verifiedBy?.name || 'N/A')}</div>
            <div><strong>Designation:</strong><br>${escapeHtml(savedSnapshot.dispatchDetails?.headDesignation || savedSnapshot.verifiedBy?.designation || 'N/A')}</div>
            <div><strong>File No.:</strong><br><span class="badge badge-info" style="font-size: 0.88rem;">${escapeHtml(savedSnapshot.dispatchDetails?.fileNo || savedSnapshot.dispatchDetails?.outwardNo || 'N/A')}</span></div>
            <div><strong>Date Sent:</strong><br><strong>${escapeHtml(savedSnapshot.dispatchDetails?.forwardDate || 'N/A')}</strong></div>
          </div>
          ${savedSnapshot.dispatchDetails?.remarks ? `<div style="font-size: 0.82rem; color: #1e40af; margin-top: 8px;"><strong>Forwarding Remarks:</strong> "${escapeHtml(savedSnapshot.dispatchDetails?.remarks)}"</div>` : ''}
          ${isAdmin ? `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #bfdbfe; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 0.82rem; color: #1e40af; font-weight: 600;">
                <i class="fa-solid fa-shield-halved"></i> Admin Control: Mistakenly forwarded? Revert status to unlock office for user edits.
              </span>
              <button type="button" class="btn btn-danger btn-sm" onclick="revertOfficeForwardingStatus('${escapeHtml(officeCode)}')" style="font-weight: 700; padding: 4px 12px; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-rotate-left"></i> Revert Forwarding Status (Unlock Office)
              </button>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      dispatchBox.style.display = 'none';
      dispatchBox.innerHTML = '';
    }
  }

  // Button Action States
  const btnVerify = document.getElementById('otBtnTriggerVerify');
  const btnForward = document.getElementById('otBtnTriggerForward');

  if (btnVerify) {
    btnVerify.style.display = 'none'; // Verification stage skipped
  }

  if (btnForward) {
    btnForward.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send to Transport Commissionerate';
    if (submittedProfiles.length === 0 || isForwarded) {
      btnForward.style.display = 'none';
    } else {
      btnForward.style.display = 'inline-flex';
    }
  }

  // Header Revert Button for Admin
  let btnRevert = document.getElementById('otBtnRevertForward');
  if (!btnRevert && btnForward && btnForward.parentNode) {
    btnRevert = document.createElement('button');
    btnRevert.type = 'button';
    btnRevert.id = 'otBtnRevertForward';
    btnRevert.className = 'btn btn-danger btn-sm';
    btnRevert.style.fontWeight = '700';
    btnRevert.style.display = 'none';
    btnRevert.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Revert Status';
    btnForward.parentNode.appendChild(btnRevert);
  }
  if (btnRevert) {
    if (isAdmin && isForwarded) {
      btnRevert.style.display = 'inline-flex';
      btnRevert.onclick = () => revertOfficeForwardingStatus(officeCode);
    } else {
      btnRevert.style.display = 'none';
    }
  }

  // PDF / Print Template Footer Formatting (Post-Forwarding vs Draft)
  const sigGrid = document.getElementById('otReportSigLineGrid');
  if (sigGrid) {
    if (isForwarded) {
      const dDetails = (savedSnapshot && savedSnapshot.dispatchDetails) || {};
      const headName = dDetails.headName || savedSnapshot?.verifiedBy?.name || "Head of Office";
      const headDesig = dDetails.headDesignation || savedSnapshot?.verifiedBy?.designation || "Head of Office";

      // 1. Place: Auto-fill with respective office location
      const officeLocation = otGetOfficeLocation(officeObj, officeCode);

      // 2. Date: Auto-fill with date of forwarding
      const rawFwdDate = dDetails.forwardDate || (savedSnapshot?.verifiedAt ? savedSnapshot.verifiedAt.substring(0, 10) : "");
      let formattedDate = rawFwdDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawFwdDate)) {
        const dp = rawFwdDate.split('-');
        formattedDate = `${dp[2]}-${dp[1]}-${dp[0]}`;
      }

      // 3. Digital signature strictly formatted as DD-MM-YYYY HH:MM AM/PM
      const rawTs = dDetails.timestamp || savedSnapshot?.verifiedAt || new Date().toISOString();
      const formattedTs = otFormatDigitalSignatureTimestamp(rawTs);

      // 4. Exact text string: (Digitally signed by [Name of Head of Office] at [Timestamp])
      const digitalSigText = `(Digitally signed by ${headName} at ${formattedTs})`;

      sigGrid.innerHTML = `
        <div id="otReportSigLeftCol">
          <div id="otSigPlaceLine" style="margin-bottom: 16px;"><strong>Place:</strong> ${escapeHtml(officeLocation)}</div>
          <div id="otSigDateLine" style="margin-bottom: 16px;"><strong>Date:</strong> ${escapeHtml(formattedDate)}</div>
        </div>
        <div id="otReportSigRightCol">
          <div id="otSigHeadLine" style="margin-bottom: 16px;"><strong>Signature of the Head of Office:</strong> ${escapeHtml(digitalSigText)}</div>
          <div id="otSigNameLine" style="margin-bottom: 16px;"><strong>Name:</strong> ${escapeHtml(headName)}</div>
          <div id="otSigDesigLine"><strong>Designation:</strong> ${escapeHtml(headDesig)}</div>
        </div>
      `;
    } else {
      sigGrid.innerHTML = `
        <div id="otReportSigLeftCol">
          <div id="otSigPlaceLine" style="margin-bottom: 16px;"><strong>Place:</strong> ______________________________</div>
          <div id="otSigDateLine" style="margin-bottom: 16px;"><strong>Date:</strong> _______________________________</div>
          <div id="otSigSealLine" style="margin-top: 28px;"><strong>Office Seal:</strong> _________________________</div>
        </div>
        <div id="otReportSigRightCol">
          <div id="otSigHeadLine" style="margin-bottom: 16px;"><strong>Signature of the Head of Office:</strong> ______________________________</div>
          <div id="otSigNameLine" style="margin-bottom: 16px;"><strong>Name:</strong> ______________________________</div>
          <div id="otSigDesigLine"><strong>Designation:</strong> _________________________</div>
        </div>
      `;
    }
  }
}
window.renderOfficeSummaryReport = renderOfficeSummaryReport;

// Trigger automatic "Reverification Required" when source records change
function triggerReverificationCheck(officeCode) {
  const snapshot = otReportSnapshotsStore[officeCode];
  if (snapshot && snapshot.isVerified) {
    snapshot.reverificationRequired = true;
    snapshot.isForwarded = false; // Reset forwarding on data modification
    otReportSnapshotsStore[officeCode] = snapshot;
    localStorage.setItem('mvd_ot_report_snapshots', JSON.stringify(otReportSnapshotsStore));
    otLogAudit('REVERIFICATION_FLAGGED', officeCode, { reason: "Source officer profiles changed after verification" });
  }
}

// Verification Modal & Handler
function openVerificationModal() {
  if (!otHasPermission('verify_report')) {
    showToast("Access Denied: Only Head of Office or Officer holding charge can verify reports.", "error");
    return;
  }

  const officeCode = (typeof window !== 'undefined' && window.otCurrentReportOfficeCode) || otCurrentReportOfficeCode;
  const user = otGetCurrentUser();

  document.getElementById('otVerifOfficeCodeDisplay').textContent = officeCode;
  document.getElementById('otVerifOfficerNameInput').value = user.name || "";
  document.getElementById('otVerifOfficerDesigInput').value = "";
  document.getElementById('otVerifRemarksInput').value = "";
  document.getElementById('otVerifCertCheckbox').checked = false;

  document.getElementById('otVerificationModal').style.display = 'flex';
}

function closeVerificationModal() {
  document.getElementById('otVerificationModal').style.display = 'none';
}

function submitReportVerification(e) {
  if (e) e.preventDefault();

  const certCheck = document.getElementById('otVerifCertCheckbox');
  if (!certCheck || !certCheck.checked) {
    showToast("You must confirm the statutory certification statement before verifying.", "warning");
    return;
  }

  const vName = document.getElementById('otVerifOfficerNameInput').value.trim();
  const vDesig = document.getElementById('otVerifOfficerDesigInput').value.trim();
  const vRemarks = document.getElementById('otVerifRemarksInput').value.trim();

  if (!vName || !vDesig) {
    showToast("Please enter Verifying Officer Name and Designation.", "warning");
    return;
  }

  const officeCode = (typeof window !== 'undefined' && window.otCurrentReportOfficeCode) || otCurrentReportOfficeCode;
  const officeObj = ALL_MVD_OFFICES.find(o => o.code === officeCode);
  const submittedProfiles = otProfilesStore.filter(p => p.officeCode === officeCode && p.status === 'submitted');
  const now = new Date().toISOString();

  const prevSnapshot = otReportSnapshotsStore[officeCode];
  const newVersion = prevSnapshot ? prevSnapshot.version + 1 : 1;
  const refNum = `MVD/OTQ/${officeCode}/${new Date().getFullYear()}/V${newVersion}`;

  const snapshot = {
    officeCode,
    officeName: officeObj ? officeObj.name : officeCode,
    referenceNumber: refNum,
    version: newVersion,
    cutoffTimestamp: now,
    verifiedAt: now,
    isVerified: true,
    reverificationRequired: false,
    isForwarded: false,
    verifiedBy: {
      name: vName,
      designation: vDesig
    },
    verifiedRemarks: vRemarks,
    includedOfficerPenList: submittedProfiles.map(p => p.pen),
    totalOfficersCount: submittedProfiles.length,
    historicalCopies: prevSnapshot ? [...(prevSnapshot.historicalCopies || []), { ...prevSnapshot, historicalCopies: [] }] : []
  };

  otReportSnapshotsStore[officeCode] = snapshot;
  localStorage.setItem('mvd_ot_report_snapshots', JSON.stringify(otReportSnapshotsStore));
  if (typeof saveOfficerReportToSupabase === 'function') {
    saveOfficerReportToSupabase(snapshot);
  }

  otLogAudit('VERIFY_REPORT', refNum, { office: officeCode, verifiedBy: vName, version: newVersion });
  closeVerificationModal();
  renderOfficeSummaryReport();
  showToast(`Office Report verified successfully! Reference: ${refNum}`, "success");
}

// Forwarding Modal & Handler
function openForwardingModal() {
  const officeCode = (typeof window !== 'undefined' && window.otCurrentReportOfficeCode) || otCurrentReportOfficeCode;
  const userEmail = otGetLoggedInEmail();
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  if (!isAdmin && userEmail) {
    const authorizedOffices = getAllOfficesLinkedToUser(userEmail);
    if (!authorizedOffices.includes(officeCode)) {
      showToast("Access Denied: You are not authorized to forward reports for this office.", "error");
      return;
    }
  }
  const user = otGetCurrentUser();
  const submittedProfiles = otProfilesStore.filter(p => p.officeCode === officeCode && p.status === 'submitted');

  if (submittedProfiles.length === 0) {
    showToast("Please submit officer profiles before sending to the Transport Commissionerate.", "warning");
    return;
  }

  const prevSnapshot = otReportSnapshotsStore[officeCode];
  const newVersion = prevSnapshot ? prevSnapshot.version + 1 : 1;
  const refNum = prevSnapshot ? prevSnapshot.referenceNumber : `MVD/OTQ/${officeCode}/${new Date().getFullYear()}/V${newVersion}`;

  const refDisplay = document.getElementById('otFwdReportRefDisplay');
  if (refDisplay) refDisplay.textContent = refNum;

  const headNameInput = document.getElementById('otFwdHeadNameInput');
  if (headNameInput) headNameInput.value = prevSnapshot?.dispatchDetails?.headName || user.name || "";

  const headDesigInput = document.getElementById('otFwdHeadDesigInput');
  if (headDesigInput) headDesigInput.value = prevSnapshot?.dispatchDetails?.headDesignation || "";

  const fileNoInput = document.getElementById('otFwdOutwardNoInput');
  if (fileNoInput) fileNoInput.value = prevSnapshot?.dispatchDetails?.fileNo || prevSnapshot?.dispatchDetails?.outwardNo || "";

  const today = new Date().toISOString().substring(0, 10);
  const fwdDateInput = document.getElementById('otFwdDateInput');
  if (fwdDateInput) {
    fwdDateInput.max = today;
    fwdDateInput.value = today;
  }
  const remarksInput = document.getElementById('otFwdRemarksInput');
  if (remarksInput) remarksInput.value = "";

  document.getElementById('otForwardingModal').style.display = 'flex';
}

function closeForwardingModal() {
  document.getElementById('otForwardingModal').style.display = 'none';
}

function submitReportForwarding(e) {
  if (e) e.preventDefault();

  const officeCode = (typeof window !== 'undefined' && window.otCurrentReportOfficeCode) || otCurrentReportOfficeCode;
  const userEmail = otGetLoggedInEmail();
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  if (!isAdmin && userEmail) {
    const authorizedOffices = getAllOfficesLinkedToUser(userEmail);
    if (!authorizedOffices.includes(officeCode)) {
      showToast("Access Denied: You cannot forward reports for an unauthorized office.", "error");
      return;
    }
  }

  const headName = document.getElementById('otFwdHeadNameInput').value.trim();
  const headDesig = document.getElementById('otFwdHeadDesigInput').value.trim();
  const fileNo = document.getElementById('otFwdOutwardNoInput').value.trim();
  const fwdDate = document.getElementById('otFwdDateInput').value;
  const remarks = document.getElementById('otFwdRemarksInput').value.trim();

  if (!headName) {
    showToast("Please enter Name of Head of Office Forwarding.", "warning");
    return;
  }
  if (!headDesig) {
    showToast("Please enter Designation of Head of Office.", "warning");
    return;
  }
  if (!fileNo) {
    showToast("Please enter File No.", "warning");
    return;
  }
  if (!fwdDate) {
    showToast("Please enter Date of Forwarding.", "warning");
    return;
  }

  const today = new Date().toISOString().substring(0, 10);
  if (fwdDate > today) {
    showToast("Future dates are not allowed for forwarding.", "warning");
    return;
  }

  const officeObj = ALL_MVD_OFFICES.find(o => o.code === officeCode);
  const submittedProfiles = otProfilesStore.filter(p => p.officeCode === officeCode && p.status === 'submitted');
  const now = new Date().toISOString();

  const prevSnapshot = otReportSnapshotsStore[officeCode];
  const newVersion = prevSnapshot ? prevSnapshot.version + 1 : 1;
  const refNum = `MVD/OTQ/${officeCode}/${new Date().getFullYear()}/V${newVersion}`;

  const user = otGetCurrentUser();
  const snapshot = {
    officeCode,
    officeName: officeObj ? officeObj.name : officeCode,
    referenceNumber: refNum,
    version: newVersion,
    cutoffTimestamp: now,
    verifiedAt: now,
    isVerified: true,
    reverificationRequired: false,
    isForwarded: true,
    verifiedBy: {
      name: headName,
      designation: headDesig
    },
    dispatchDetails: {
      fileNo,
      outwardNo: fileNo,
      forwardDate: fwdDate,
      remarks,
      headName,
      headDesignation: headDesig,
      userName: user.name || headName,
      userEmail: user.email,
      timestamp: now
    },
    includedOfficerPenList: submittedProfiles.map(p => p.pen),
    totalOfficersCount: submittedProfiles.length,
    historicalCopies: prevSnapshot ? [...(prevSnapshot.historicalCopies || []), { ...prevSnapshot, historicalCopies: [] }] : []
  };

  otReportSnapshotsStore[officeCode] = snapshot;
  localStorage.setItem('mvd_ot_report_snapshots', JSON.stringify(otReportSnapshotsStore));
  if (typeof saveOfficerReportToSupabase === 'function') {
    saveOfficerReportToSupabase(snapshot);
  }

  otLogAudit('FORWARD_REPORT', refNum, { office: officeCode, fileNo, headName, headDesignation: headDesig, forwardDate: fwdDate });
  closeForwardingModal();
  renderOfficeSummaryReport();
  showToast(`Report successfully sent to Transport Commissionerate (File No: ${fileNo})`, "success");
}

// --- ADMIN STATUS REVERSAL (UNDO FORWARDING FEATURE) ---
async function revertOfficeForwardingStatus(officeCode) {
  if (!officeCode) {
    if (typeof showToast === 'function') showToast("Please select a valid office to revert.", "warning");
    return;
  }

  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  if (!isAdmin) {
    if (typeof showToast === 'function') showToast("Access Denied: Only administrators can revert forwarding status.", "error");
    return;
  }

  const canonCode = getCanonicalOfficeCode(officeCode) || officeCode;
  const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
  let snapshot = snapStore[canonCode] || snapStore[officeCode];

  if (!snapshot) {
    try {
      const raw = localStorage.getItem('mvd_ot_report_snapshots');
      if (raw) {
        const parsed = JSON.parse(raw);
        snapshot = parsed[canonCode] || parsed[officeCode];
      }
    } catch (e) {}
  }

  if (!snapshot || !snapshot.isForwarded) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data: dbData } = await client
          .from('office_report_versions')
          .select('*')
          .or(`office_code.eq.${canonCode},office_code.eq.${officeCode}`)
          .eq('is_forwarded', true)
          .limit(1);
        if (dbData && dbData.length > 0) {
          const r = dbData[0];
          snapshot = {
            officeCode: r.office_code,
            officeName: r.office_name,
            referenceNumber: r.reference_number,
            version: r.version,
            cutoffTimestamp: r.cutoff_timestamp,
            verifiedAt: r.verified_at,
            isVerified: r.is_verified,
            reverificationRequired: r.reverification_required,
            isForwarded: true
          };
        }
      } catch (e) {}
    }
  }

  if (!snapshot || !snapshot.isForwarded) {
    if (typeof showToast === 'function') showToast(`Office ${canonCode} is not marked as forwarded to Transport Commissionerate.`, "info");
    return;
  }

  const confirmFn = window.showCustomConfirm || (typeof showCustomConfirm === 'function' ? showCustomConfirm : null);
  let confirmed = false;
  if (confirmFn) {
    confirmed = await confirmFn({
      title: 'Revert Forwarding Status',
      message: `Are you sure you want to revert the status for office "${canonCode}"? This will unlock the office and allow further edits by the authorized user.`,
      confirmText: 'Yes, Revert & Unlock',
      cancelText: 'Cancel',
      isDanger: true
    });
  } else if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
    confirmed = window.confirm(`Are you sure you want to revert forwarding status for office "${canonCode}"? This will allow further edits by the authorized user.`);
  } else {
    confirmed = true;
  }

  if (!confirmed) return;

  // 1. Reset in-memory snapshot state
  snapshot.isForwarded = false;
  snapshot.reverificationRequired = false;
  snapshot.isReverted = true;
  snapshot.dispatchDetails = null;
  snapshot.dispatchedByName = null;
  snapshot.dispatchedAt = null;
  snapshot.outwardNumber = null;
  snapshot.forwardDate = null;
  snapshot.forwardingRemarks = null;

  // Store in both canonical and raw keys
  otReportSnapshotsStore[canonCode] = snapshot;
  otReportSnapshotsStore[officeCode] = snapshot;
  if (typeof window !== 'undefined') {
    if (!window.otReportSnapshotsStore) window.otReportSnapshotsStore = {};
    window.otReportSnapshotsStore[canonCode] = snapshot;
    window.otReportSnapshotsStore[officeCode] = snapshot;
  }
  try {
    localStorage.setItem('mvd_ot_report_snapshots', JSON.stringify(otReportSnapshotsStore));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  // 2. Persist status reversal to Supabase backend
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error: updateErr } = await client
        .from('office_report_versions')
        .update({
          is_forwarded: false,
          reverification_required: false,
          outward_number: null,
          forward_date: null,
          forwarding_remarks: null,
          dispatched_by_name: null,
          dispatched_at: null,
          updated_at: new Date().toISOString()
        })
        .or(`office_code.eq.${canonCode},office_code.eq.${officeCode}`);

      if (updateErr) {
        console.warn("Supabase .or() update failed, trying direct .eq():", updateErr);
        await client
          .from('office_report_versions')
          .update({
            is_forwarded: false,
            reverification_required: false,
            outward_number: null,
            forward_date: null,
            forwarding_remarks: null,
            dispatched_by_name: null,
            dispatched_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('office_code', canonCode);
        if (officeCode !== canonCode) {
          await client
            .from('office_report_versions')
            .update({
              is_forwarded: false,
              reverification_required: false,
              outward_number: null,
              forward_date: null,
              forwarding_remarks: null,
              dispatched_by_name: null,
              dispatched_at: null,
              updated_at: new Date().toISOString()
            })
            .eq('office_code', officeCode);
        }
      }

      if (snapshot.referenceNumber && typeof saveOfficerReportToSupabase === 'function') {
        await saveOfficerReportToSupabase(snapshot);
      }
    } catch (err) {
      console.warn("Supabase revert call failed:", err);
    }
  }

  otLogAudit('REVERT_FORWARDING_STATUS', canonCode, {
    office: canonCode,
    action: "Reverted forwarding status to allow further edits"
  });

  closeAdminRevertForwardModal();

  // 3. Unlock Form & Instant UI State Sync
  toggleOfficerFormDisabled(false);

  const currentSelectedOffice = document.getElementById('otMainOfficeSelect')?.value || (typeof otCurrentOfficeCode !== 'undefined' && otCurrentOfficeCode);
  const curCanon = getCanonicalOfficeCode(currentSelectedOffice) || currentSelectedOffice;

  if (currentSelectedOffice && (currentSelectedOffice === officeCode || curCanon === canonCode || currentSelectedOffice === canonCode)) {
    checkOfficeAccessAndLock(currentSelectedOffice);
    renderOfficeEditOptionList(currentSelectedOffice);
  } else {
    checkOfficeAccessAndLock(canonCode);
    renderOfficeEditOptionList(canonCode);
  }

  // Update Summary Report view immediately
  if (typeof otCurrentReportOfficeCode !== 'undefined') otCurrentReportOfficeCode = canonCode;
  if (typeof window !== 'undefined') window.otCurrentReportOfficeCode = canonCode;
  const repSel = document.getElementById('otReportOfficeSelect');
  if (repSel) repSel.value = canonCode;
  renderOfficeSummaryReport();

  // Refresh Admin Dashboard & Charts
  if (typeof renderOfficerAdminDashboard === 'function') {
    renderOfficerAdminDashboard();
  }

  // Cross-tab broadcast
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('mvd_office_status_channel');
      bc.postMessage({ type: 'OFFICE_REVERTED', officeCode: canonCode });
      bc.close();
    }
  } catch (e) {}

  if (typeof showToast === 'function') {
    showToast(`Forwarding status for ${canonCode} reverted successfully. Office is now unlocked and status set to ASSIGNED.`, "success");
  }
}
window.revertOfficeForwardingStatus = revertOfficeForwardingStatus;

function openAdminRevertForwardingModal() {
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  if (!isAdmin) {
    if (typeof showToast === 'function') showToast("Access Denied: Admin authorization required.", "error");
    return;
  }

  const modal = document.getElementById('adminRevertForwardModal');
  if (!modal) return;

  const select = document.getElementById('adminRevertOfficeSelect');
  const detailsBox = document.getElementById('adminRevertOfficeDetails');
  const btnSubmit = document.getElementById('btnSubmitRevertOffice');

  if (select) {
    const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
    const forwardedCodes = Array.from(new Set(
      Object.keys(snapStore)
        .filter(code => snapStore[code]?.isForwarded === true)
        .map(code => getCanonicalOfficeCode(code) || code)
    ));

    if (forwardedCodes.length === 0) {
      select.innerHTML = '<option value="">-- No Forwarded Offices Found --</option>';
      select.disabled = true;
      if (btnSubmit) btnSubmit.disabled = true;
      if (detailsBox) {
        detailsBox.style.display = 'block';
        detailsBox.innerHTML = '<div style="color: #64748b; font-size: 0.88rem; text-align: center; padding: 12px;">No offices have completed "Send to Transport Commissionerate" yet.</div>';
      }
    } else {
      select.disabled = false;
      if (btnSubmit) btnSubmit.disabled = false;
      select.innerHTML = '<option value="">-- Select Forwarded Office to Revert --</option>' +
        forwardedCodes.map(code => {
          const off = (typeof ALL_MVD_OFFICES !== 'undefined' ? ALL_MVD_OFFICES.find(o => o.code === code) : null);
          return `<option value="${escapeHtml(code)}">${escapeHtml(code)} — ${escapeHtml(off ? off.name : code)}</option>`;
        }).join('');
      if (detailsBox) detailsBox.style.display = 'none';
    }
  }

  modal.style.display = 'flex';
}
window.openAdminRevertForwardingModal = openAdminRevertForwardingModal;

function closeAdminRevertForwardModal() {
  const modal = document.getElementById('adminRevertForwardModal');
  if (modal) modal.style.display = 'none';
}
window.closeAdminRevertForwardModal = closeAdminRevertForwardModal;

function handleAdminRevertOfficeSelectChange() {
  const code = document.getElementById('adminRevertOfficeSelect')?.value;
  const detailsBox = document.getElementById('adminRevertOfficeDetails');
  if (!detailsBox) return;

  if (!code || !otReportSnapshotsStore[code]) {
    detailsBox.style.display = 'none';
    return;
  }

  const snap = otReportSnapshotsStore[code];
  const d = snap.dispatchDetails || {};
  const off = (typeof ALL_MVD_OFFICES !== 'undefined' ? ALL_MVD_OFFICES.find(o => o.code === code) : null);

  detailsBox.style.display = 'block';
  detailsBox.innerHTML = `
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; font-size: 0.85rem;">
      <div style="font-weight: 700; color: #1e40af; margin-bottom: 6px;">
        <i class="fa-solid fa-building"></i> ${escapeHtml(off ? off.name : code)} (${escapeHtml(code)})
      </div>
      <div><strong>File / Outward No:</strong> ${escapeHtml(d.fileNo || d.outwardNo || 'N/A')}</div>
      <div><strong>Date Sent:</strong> ${escapeHtml(d.forwardDate || 'N/A')}</div>
      <div><strong>Head of Office:</strong> ${escapeHtml(d.headName || snap.verifiedBy?.name || 'N/A')} (${escapeHtml(d.headDesignation || snap.verifiedBy?.designation || 'N/A')})</div>
      <div><strong>Total Officers:</strong> ${snap.totalOfficersCount || snap.includedOfficerPenList?.length || 0}</div>
    </div>
  `;
}
window.handleAdminRevertOfficeSelectChange = handleAdminRevertOfficeSelectChange;

function submitAdminRevertOfficeModal() {
  const code = document.getElementById('adminRevertOfficeSelect')?.value;
  if (!code) {
    if (typeof showToast === 'function') showToast("Please select an office to revert.", "warning");
    return;
  }
  revertOfficeForwardingStatus(code);
}
window.submitAdminRevertOfficeModal = submitAdminRevertOfficeModal;

function printOfficeSummaryReport() {
  const userEmail = otGetLoggedInEmail();
  const isAdmin = ((typeof otCurrentRole !== 'undefined' && otCurrentRole === 'admin') || (typeof window !== 'undefined' && window.otCurrentRole === 'admin') || (typeof activeSession !== 'undefined' && activeSession === 'admin') || (typeof isAdminAuthenticated !== 'undefined' && isAdminAuthenticated));
  if (!isAdmin) {
    if (!userEmail) {
      if (typeof showToast === 'function') showToast("Please log in to print summary reports.", "warning");
      renderEmptyUserSummaryReport("Unauthenticated User");
      return;
    }
    const currentRepCode = (typeof window !== 'undefined' && window.otCurrentReportOfficeCode) || otCurrentReportOfficeCode;
    const authorizedOffices = getAllOfficesLinkedToUser(userEmail);
    if (!authorizedOffices || !authorizedOffices.includes(currentRepCode)) {
      if (typeof showToast === 'function') showToast("Access Denied: You cannot print reports for an unauthorized office.", "error");
      renderEmptyUserSummaryReport(userEmail);
      return;
    }
  }
  document.body.classList.remove('printing-modal');
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('print-active'));
  const repTab = document.getElementById('otTabContentReport');
  if (repTab) repTab.style.display = 'block';
  renderOfficeSummaryReport();
  window.print();
}

// --- 14. ROLE SIMULATION & AUDIT LOG VIEWER ---

function switchRoleSimulator(role) {
  otCurrentRole = role;
  localStorage.setItem('mvd_ot_current_role', role);
  renderRoleSwitcherUI();
  renderOfficeSummaryReport();
  renderAdminOfficersDirectory();
  showToast(`Switched active user role to: "${role.replace('_', ' ').toUpperCase()}"`, "info");
}

function renderRoleSwitcherUI() {
  const container = document.getElementById('otRoleIndicatorPill');
  if (container) {
    const roleLabels = {
      data_entry: "Data Entry User",
      head_of_office: "Office Head Entry Page",
      dispatch_user: "Office Dispatch User",
      admin: "Commissionerate Administrator"
    };
    container.innerHTML = `
      <i class="fa-solid fa-user-shield"></i> <strong>${roleLabels[otCurrentRole] || otCurrentRole}</strong>
    `;
  }

  // Active button highlight in Role Switcher section
  document.querySelectorAll('.ot-role-btn').forEach(btn => {
    if (btn.dataset.role === otCurrentRole) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderAuditLogTable();
}

function renderAuditLogTable() {
  const tbody = document.getElementById('otAuditLogTableBody');
  if (!tbody) return;

  if (otAuditLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No audit trail events logged yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = otAuditLogs.slice(0, 50).map((log, idx) => `
    <tr>
      <td style="text-align: center; color: var(--text-muted);">${idx + 1}</td>
      <td><strong><i class="fa-solid fa-clock"></i> ${otFormatIST(log.timestamp)}</strong></td>
      <td><span class="badge ${log.action.includes('DELETE') ? 'badge-danger' : (log.action.includes('VERIFY') ? 'badge-working' : 'badge-info')}">${log.action}</span></td>
      <td><strong>${escapeHtml(log.reference || '')}</strong></td>
      <td>${escapeHtml(log.userName || log.userEmail)} <small style="color: var(--text-muted);">(${escapeHtml(log.userRole)})</small></td>
    </tr>
  `).join('');
}

// Sub-Tab Switcher within Officer Training Module
function switchOfficerSubTab(tabName) {
  if (tabName === 'directory' || tabName === 'roles') {
    if (typeof switchAdminSubView === 'function') {
      switchAdminSubView(tabName);
    }
    return;
  }

  otActiveSubTab = tabName;
  document.querySelectorAll('.ot-subtab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });

  const formEl = document.getElementById('otTabContentForm');
  const repEl = document.getElementById('otTabContentReport');
  const dirEl = document.getElementById('otTabContentDirectory');
  const rolesEl = document.getElementById('otTabContentRoles');

  if (formEl) formEl.style.display = tabName === 'form' ? 'block' : 'none';
  if (repEl) repEl.style.display = tabName === 'report' ? 'block' : 'none';
  if (dirEl) dirEl.style.display = tabName === 'directory' ? 'block' : 'none';
  if (rolesEl) rolesEl.style.display = tabName === 'roles' ? 'block' : 'none';

  if (tabName === 'report') renderOfficeSummaryReport();
}

// --- 15. SUPABASE BACKEND PERSISTENCE & REALTIME SYNCHRONIZATION ---

function getSupabaseClient() {
  if (window.supabaseClient) return window.supabaseClient;
  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    window.supabaseClient = supabaseClient;
    return supabaseClient;
  }
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      window.supabaseClient = window.supabase.createClient(
        'https://mghdekancxfqtnfoyfkj.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naGRla2FuY3hmcXRuZm95ZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY5MzksImV4cCI6MjEwMDQ0MjkzOX0.wb9ZdBEKQSgmbd-vUFsbnSh3iHFYmAPW4Ywgb8vf4V0'
      );
      return window.supabaseClient;
    } catch (e) {
      console.warn("Could not instantiate Supabase client:", e);
    }
  }
  return null;
}

let otRealtimeSubscribed = false;
function subscribeToRealtimeOfficerProfiles() {
  if (otRealtimeSubscribed) return;
  const client = getSupabaseClient();
  if (!client || typeof client.channel !== 'function') return;

  try {
    const channel = client.channel('realtime_officer_profiles');
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'officer_profiles' },
      (payload) => {
        console.log("Supabase Realtime event for officer_profiles:", payload);
        const { eventType, new: newRec, old: oldRec } = payload;
        if (eventType === 'DELETE') {
          const targetPen = oldRec?.pen;
          const targetId = oldRec?.id;
          if (targetPen || targetId) {
            otProfilesStore = otProfilesStore.filter(p => (targetPen ? p.pen !== targetPen : true) && (targetId ? p.id !== targetId : true));
            localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));
            renderAdminOfficersDirectory();
            renderOfficeSummaryReport();
            if (typeof renderAdminOfficersTable === 'function') renderAdminOfficersTable();
            const currentSelectedOffice = document.getElementById('otMainOfficeSelect')?.value;
            if (currentSelectedOffice) renderOfficeEditOptionList(currentSelectedOffice);
          }
        } else if (newRec && newRec.pen) {
          const mapped = {
            id: newRec.id || ('off_' + newRec.pen),
            officerFullName: newRec.officer_full_name,
            pen: newRec.pen,
            designation: newRec.current_designation,
            officeCode: newRec.office_code,
            officeName: newRec.office_name,
            generalEducation: newRec.general_education || "Plus Two",
            generalEducationOther: newRec.general_education_other || "",
            technicalQualification: newRec.technical_qualification || "B.Tech",
            technicalQualificationOther: newRec.technical_qualification_other || "",
            institution: newRec.institution || "",
            passingYear: newRec.passing_year || 2020,
            grade: newRec.class_grade || "",
            additionalQualifications: Array.isArray(newRec.additional_qualifications) ? newRec.additional_qualifications : [],
            specializedSkills: Array.isArray(newRec.specialized_skills) ? newRec.specialized_skills : [],
            customSkills: "",
            willingnessToContribute: newRec.willingness_to_contribute || "",
            trainingHistory: Array.isArray(newRec.training_history) ? newRec.training_history : [],
            enteredBy: {
              fullName: newRec.entered_by_name || "Reporting Officer",
              designation: newRec.entered_by_designation || "Officer",
              mobile: newRec.entered_by_mobile || "9447000000",
              userId: newRec.entered_by_user_id || "",
              timestamp: newRec.entered_by_timestamp || newRec.created_at || new Date().toISOString()
            },
            status: newRec.status || "submitted",
            createdAt: newRec.created_at || new Date().toISOString(),
            updatedAt: newRec.updated_at || new Date().toISOString(),
            version: newRec.version || 1
          };
          const existingIdx = otProfilesStore.findIndex(p => p.pen === mapped.pen);
          if (existingIdx >= 0) {
            otProfilesStore[existingIdx] = mapped;
          } else {
            otProfilesStore.unshift(mapped);
          }
          localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));
          renderAdminOfficersDirectory();
          renderOfficeSummaryReport();
          if (typeof renderAdminOfficersTable === 'function') renderAdminOfficersTable();
          const currentSelectedOffice = document.getElementById('otMainOfficeSelect')?.value;
          if (currentSelectedOffice) renderOfficeEditOptionList(currentSelectedOffice);
        }
      }
    ).on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'mvd_app_settings' },
      (payload) => {
        const row = payload.new || payload.old;
        if (row && row.id === 'office_locks' && row.menu_visibility) {
          try {
            const locks = typeof row.menu_visibility === 'object' ? row.menu_visibility : JSON.parse(row.menu_visibility);
            localStorage.setItem('mvd_ot_office_locks', JSON.stringify(locks));
            if (typeof otOfficeLocks !== 'undefined' && otOfficeLocks) {
              for (const k in otOfficeLocks) {
                if (!locks[k]) delete otOfficeLocks[k];
              }
              Object.assign(otOfficeLocks, locks);
            }
            if (window.otOfficeLocks) {
              for (const k in window.otOfficeLocks) {
                if (!locks[k]) delete window.otOfficeLocks[k];
              }
              Object.assign(window.otOfficeLocks, locks);
            }
            if (typeof window.renderAdminOfficeLocksTable === 'function') {
              window.renderAdminOfficeLocksTable();
            }
            const officeCode = document.getElementById('otMainOfficeSelect')?.value;
            if (officeCode && typeof checkOfficeAccessAndLock === 'function') {
              checkOfficeAccessAndLock(officeCode);
            }
          } catch (e) {
            console.warn("Could not process realtime office_locks update:", e);
          }
        }
      }
    ).on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'office_report_versions' },
      (payload) => {
        console.log("Supabase Realtime event for office_report_versions:", payload);
        const { eventType, new: newRec, old: oldRec } = payload;
        const targetCode = newRec?.office_code || oldRec?.office_code;
        const canonTarget = getCanonicalOfficeCode(targetCode) || targetCode;

        if (eventType === 'DELETE' && targetCode) {
          delete otReportSnapshotsStore[targetCode];
          if (canonTarget) delete otReportSnapshotsStore[canonTarget];
        } else if (newRec && newRec.office_code) {
          const snapObj = {
            officeCode: newRec.office_code,
            officeName: newRec.office_name,
            referenceNumber: newRec.reference_number,
            version: newRec.version,
            cutoffTimestamp: newRec.cutoff_timestamp,
            verifiedAt: newRec.verified_at,
            isVerified: newRec.is_verified,
            reverificationRequired: newRec.reverification_required,
            isForwarded: !!newRec.is_forwarded,
            verifiedBy: {
              name: newRec.verified_by_name || "",
              designation: newRec.verified_by_designation || ""
            },
            verifiedRemarks: newRec.verification_remarks || "",
            dispatchDetails: newRec.is_forwarded ? {
              fileNo: newRec.outward_number || "",
              outwardNo: newRec.outward_number || "",
              forwardDate: newRec.forward_date || "",
              remarks: newRec.forwarding_remarks || "",
              headName: newRec.verified_by_name || "",
              headDesignation: newRec.verified_by_designation || "",
              userName: newRec.dispatched_by_name || ""
            } : null,
            includedOfficerPenList: newRec.included_officer_pens || [],
            totalOfficersCount: (newRec.included_officer_pens || []).length,
            historicalCopies: []
          };
          otReportSnapshotsStore[newRec.office_code] = snapObj;
          if (canonTarget) otReportSnapshotsStore[canonTarget] = snapObj;
          if (typeof window !== 'undefined') {
            if (!window.otReportSnapshotsStore) window.otReportSnapshotsStore = {};
            window.otReportSnapshotsStore[newRec.office_code] = snapObj;
            if (canonTarget) window.otReportSnapshotsStore[canonTarget] = snapObj;
          }
        }
        localStorage.setItem('mvd_ot_report_snapshots', JSON.stringify(otReportSnapshotsStore));
        renderOfficeSummaryReport();
        if (typeof renderOfficerAdminDashboard === 'function') renderOfficerAdminDashboard();
        const currentSelectedOffice = document.getElementById('otMainOfficeSelect')?.value;
        const curCanon = getCanonicalOfficeCode(currentSelectedOffice) || currentSelectedOffice;
        if (targetCode && (currentSelectedOffice === targetCode || curCanon === canonTarget || currentSelectedOffice === canonTarget) && typeof checkOfficeAccessAndLock === 'function') {
          toggleOfficerFormDisabled(false);
          checkOfficeAccessAndLock(currentSelectedOffice);
          renderOfficeEditOptionList(currentSelectedOffice);
        }
      }
    ).subscribe((status) => {
      console.log("Supabase Realtime Officer Profiles subscription status:", status);
      if (status === 'SUBSCRIBED') otRealtimeSubscribed = true;
    });
  } catch (err) {
    console.warn("Could not subscribe to officer profiles realtime:", err);
  }
}

async function syncOfficerProfilesWithSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    // 1. Primary: sync from officer_profiles
    let { data, error } = await client
      .from('officer_profiles')
      .select('*');

    if (!error && data && data.length > 0) {
      const mapped = data.map(row => ({
        id: row.id || ('off_' + row.pen),
        officerFullName: row.officer_full_name,
        pen: row.pen,
        designation: row.current_designation,
        officeCode: row.office_code,
        officeName: row.office_name,
        generalEducation: row.general_education || "Plus Two",
        generalEducationOther: row.general_education_other || "",
        technicalQualification: row.technical_qualification || "B.Tech",
        technicalQualificationOther: row.technical_qualification_other || "",
        institution: row.institution || "",
        passingYear: row.passing_year || 2020,
        grade: row.class_grade || "",
        additionalQualifications: Array.isArray(row.additional_qualifications) ? row.additional_qualifications : [],
        specializedSkills: Array.isArray(row.specialized_skills) ? row.specialized_skills : [],
        customSkills: "",
        willingnessToContribute: row.willingness_to_contribute || "",
        trainingHistory: Array.isArray(row.training_history) ? row.training_history : [],
        enteredBy: {
          fullName: row.entered_by_name || "Reporting Officer",
          designation: row.entered_by_designation || "Officer",
          mobile: row.entered_by_mobile || "9447000000",
          userId: row.entered_by_user_id || "",
          timestamp: row.entered_by_timestamp || row.created_at || new Date().toISOString()
        },
        status: row.status || "submitted",
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
        version: row.version || 1
      }));

      // Merge into otProfilesStore by PEN
      mapped.forEach(m => {
        const existingIdx = otProfilesStore.findIndex(p => p.pen === m.pen);
        if (existingIdx >= 0) {
          otProfilesStore[existingIdx] = m;
        } else {
          otProfilesStore.push(m);
        }
      });
      localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));
      renderAdminOfficersDirectory();
      if (typeof renderOfficerAdminDashboard === 'function') renderOfficerAdminDashboard();
      const currentSelectedOffice = document.getElementById('otMainOfficeSelect')?.value;
      if (currentSelectedOffice) checkOfficeAccessAndLock(currentSelectedOffice);
    } else {
      // Fallback: sync from legacy officer_qualifications
      const legacyRes = await client
        .from('officer_qualifications')
        .select('*');
      if (!legacyRes.error && legacyRes.data && legacyRes.data.length > 0) {
        const mappedLegacy = legacyRes.data.map(row => ({
          id: row.id,
          officerFullName: row.officer_name,
          pen: row.officer_pen,
          designation: row.officer_designation,
          officeCode: row.office_name ? (row.office_name.split(' ')[0] || "KL01") : "KL01",
          officeName: row.office_name || "MVD Office",
          generalEducation: "Plus Two",
          generalEducationOther: "",
          technicalQualification: row.educational_qualification || "B.Tech",
          technicalQualificationOther: row.qualification_other || "",
          institution: row.training_institutes || "",
          passingYear: row.recent_training_year || 2018,
          grade: "First Class",
          additionalQualifications: [],
          specializedSkills: row.specialization ? [row.specialization] : [],
          customSkills: "",
          willingnessToContribute: row.willingness_to_contribute || "",
          trainingHistory: row.training_details ? [{
            id: "tr_" + row.id,
            attended: row.training_attended || "Departmental Course",
            conductedBy: row.training_institutes || "MVD",
            durationValue: 1,
            durationUnit: "Weeks",
            monthYear: "2024-01"
          }] : [],
          enteredBy: {
            fullName: row.entry_officer_name || "Reporting Officer",
            designation: row.entry_officer_designation || "Officer",
            mobile: row.entry_officer_mobile || "9447000000",
            userId: "cloud@mvd.keralam.gov.in",
            timestamp: row.created_at || new Date().toISOString()
          },
          status: "submitted",
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: row.updated_at || new Date().toISOString(),
          version: 1
        }));
        mappedLegacy.forEach(m => {
          if (!otProfilesStore.some(p => p.pen === m.pen)) {
            otProfilesStore.push(m);
          }
        });
        localStorage.setItem('mvd_ot_profiles_store', JSON.stringify(otProfilesStore));
        renderAdminOfficersDirectory();
        if (typeof renderOfficerAdminDashboard === 'function') renderOfficerAdminDashboard();
      }
    }

    // 2. Sync report versions
    await syncOfficerReportsWithSupabase();

    // 3. Sync audit logs
    await syncOfficerAuditLogsWithSupabase();

  } catch (err) {
    console.warn("Officer Supabase sync error (using local storage fallback):", err);
  }
}

async function syncOfficerReportsWithSupabase() {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const { data, error } = await client
      .from('office_report_versions')
      .select('*');

    if (!error && data && data.length > 0) {
      data.forEach(r => {
        const snapObj = {
          officeCode: r.office_code,
          officeName: r.office_name,
          referenceNumber: r.reference_number,
          version: r.version,
          cutoffTimestamp: r.cutoff_timestamp,
          verifiedAt: r.verified_at,
          isVerified: r.is_verified,
          reverificationRequired: r.reverification_required,
          isForwarded: !!r.is_forwarded,
          verifiedBy: {
            name: r.verified_by_name || "",
            designation: r.verified_by_designation || ""
          },
          verifiedRemarks: r.verification_remarks || "",
          dispatchDetails: r.is_forwarded ? {
            fileNo: r.outward_number || "",
            outwardNo: r.outward_number || "",
            forwardDate: r.forward_date || "",
            remarks: r.forwarding_remarks || "",
            userName: r.dispatched_by_name || ""
          } : null,
          includedOfficerPenList: r.included_officer_pens || [],
          totalOfficersCount: (r.included_officer_pens || []).length,
          historicalCopies: []
        };
        otReportSnapshotsStore[r.office_code] = snapObj;
        const canon = getCanonicalOfficeCode(r.office_code);
        if (canon) otReportSnapshotsStore[canon] = snapObj;
      });
      if (typeof window !== 'undefined') window.otReportSnapshotsStore = otReportSnapshotsStore;
      localStorage.setItem('mvd_ot_report_snapshots', JSON.stringify(otReportSnapshotsStore));
    }
  } catch (e) {
    console.warn("Could not sync report versions:", e);
  }
}

async function syncOfficerAuditLogsWithSupabase() {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const { data, error } = await client
      .from('officer_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (!error && data && data.length > 0) {
      data.forEach(log => {
        if (!otAuditLogs.some(l => l.id === log.id)) {
          otAuditLogs.push({
            id: log.id,
            action: log.action,
            reference: log.reference,
            userRole: log.user_role,
            userName: log.user_name,
            userEmail: log.user_email,
            timestamp: log.timestamp,
            details: log.changed_fields || {}
          });
        }
      });
      otAuditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      localStorage.setItem('mvd_ot_audit_logs', JSON.stringify(otAuditLogs));
    }
  } catch (e) {
    console.warn("Could not sync audit logs:", e);
  }
}

async function saveOfficerQualificationToSupabase(record) {
  const client = getSupabaseClient();
  if (!client) {
    console.warn("Supabase client not initialized.");
    return { success: false, error: new Error("Database client not available") };
  }

  try {
    // 1. Save to officer_profiles
    const profilePayload = {
      id: record.id || ('off_' + record.pen),
      officer_full_name: record.officerFullName,
      pen: record.pen,
      current_designation: record.designation,
      office_code: record.officeCode,
      office_name: record.officeName,
      general_education: record.generalEducation || 'Plus Two',
      general_education_other: record.generalEducationOther || null,
      technical_qualification: record.technicalQualification || 'B.Tech',
      technical_qualification_other: record.technicalQualificationOther || null,
      institution: record.institution || null,
      passing_year: record.passingYear ? parseInt(record.passingYear) : null,
      class_grade: record.grade || null,
      additional_qualifications: record.additionalQualifications || [],
      specialized_skills: record.specializedSkills || [],
      willingness_to_contribute: record.willingnessToContribute || null,
      training_history: record.trainingHistory || [],
      entered_by_name: record.enteredBy?.fullName || 'Reporting Officer',
      entered_by_designation: record.enteredBy?.designation || 'Officer',
      entered_by_mobile: record.enteredBy?.mobile || '9447000000',
      entered_by_user_id: record.enteredBy?.userId || null,
      entered_by_timestamp: record.enteredBy?.timestamp || new Date().toISOString(),
      status: record.status || 'submitted',
      version: record.version || 1,
      updated_at: new Date().toISOString()
    };

    const { data: upsertData, error: profileError } = await client
      .from('officer_profiles')
      .upsert(profilePayload, { onConflict: 'pen' })
      .select();

    if (profileError) {
      console.error("Could not upsert to officer_profiles:", profileError);
      return { success: false, error: profileError };
    }

    // 2. Also save to legacy officer_qualifications for compatibility
    try {
      const legacyPayload = {
        office_name: `${record.officeCode} ${record.officeName}`,
        entry_officer_name: record.enteredBy?.fullName,
        entry_officer_designation: record.enteredBy?.designation,
        entry_officer_mobile: record.enteredBy?.mobile,
        officer_name: record.officerFullName,
        officer_pen: record.pen,
        officer_designation: record.designation,
        officer_mobile: record.enteredBy?.mobile,
        officer_email: record.enteredBy?.userId,
        educational_qualification: record.technicalQualification || record.generalEducation || 'Plus Two',
        qualification_other: record.technicalQualificationOther,
        specialization: (record.specializedSkills || []).join(', '),
        technical_certifications: (record.additionalQualifications || []).map(q => `${q.qualification} (${q.status})`).join(', '),
        willingness_to_contribute: record.willingnessToContribute || null,
        training_attended: (record.trainingHistory || []).map(t => t.attended).join('; '),
        training_institutes: (record.trainingHistory || []).map(t => t.conductedBy).join('; '),
        recent_training_year: record.passingYear || 2024,
        training_details: JSON.stringify(record.trainingHistory || []),
        updated_at: new Date().toISOString()
      };

      await client
        .from('officer_qualifications')
        .upsert(legacyPayload, { onConflict: 'officer_pen' });
    } catch (legErr) {
      console.warn("Legacy officer_qualifications sync warning (ignored):", legErr);
    }

    return { success: true, data: profilePayload };
  } catch (e) {
    console.error("Could not upsert officer to Supabase:", e);
    return { success: false, error: e };
  }
}

async function deleteOfficerFromSupabase(profileId, explicitPen) {
  const client = getSupabaseClient();
  if (!client) {
    console.warn("Supabase client unavailable for deletion");
    return { success: false, error: new Error("Database client not available") };
  }

  const pen = explicitPen || (typeof otProfilesStore !== 'undefined' ? otProfilesStore.find(x => x.id === profileId)?.pen : null) || (typeof officersStore !== 'undefined' ? officersStore.find(x => x.id === profileId)?.officer_pen : null) || profileId;
  console.log(`[Supabase Delete] Deleting officer profileId: "${profileId}", pen: "${pen}"...`);

  let pErr = null;
  let qErr = null;

  try {
    // 1. Delete from officer_profiles table by pen and by id
    if (pen) {
      const { error } = await client
        .from('officer_profiles')
        .delete()
        .eq('pen', pen);
      if (error) pErr = error;
    }
    if (profileId) {
      const { error } = await client
        .from('officer_profiles')
        .delete()
        .eq('id', profileId);
      if (error && !pErr) pErr = error;
    }

    // 2. Delete from legacy officer_qualifications table by officer_pen and by id
    if (pen) {
      const { error } = await client
        .from('officer_qualifications')
        .delete()
        .eq('officer_pen', pen);
      if (error) qErr = error;
    }
    if (profileId) {
      const { error } = await client
        .from('officer_qualifications')
        .delete()
        .eq('id', profileId);
      if (error && !qErr) qErr = error;
    }

    if (pErr) console.warn("Supabase delete warning (officer_profiles):", pErr);
    if (qErr) console.warn("Supabase delete warning (officer_qualifications):", qErr);

    return { success: !pErr, error: pErr || qErr };
  } catch (e) {
    console.error("Supabase delete exception:", e);
    return { success: false, error: e };
  }
}
window.deleteOfficerFromSupabase = deleteOfficerFromSupabase;
window.deleteOfficerQualificationFromSupabase = deleteOfficerFromSupabase;

async function saveOfficerReportToSupabase(snapshot) {
  const client = getSupabaseClient();
  if (!client || !snapshot) return;
  try {
    const payload = {
      id: "rep_" + snapshot.officeCode + "_v" + snapshot.version,
      reference_number: snapshot.referenceNumber,
      version: snapshot.version,
      office_code: snapshot.officeCode,
      office_name: snapshot.officeName,
      cutoff_timestamp: snapshot.cutoffTimestamp,
      is_verified: !!snapshot.isVerified,
      reverification_required: !!snapshot.reverificationRequired,
      verified_by_name: snapshot.verifiedBy?.name || null,
      verified_by_designation: snapshot.verifiedBy?.designation || null,
      verified_at: snapshot.verifiedAt || null,
      verification_remarks: snapshot.verifiedRemarks || null,
      is_forwarded: !!snapshot.isForwarded,
      outward_number: snapshot.dispatchDetails?.outwardNo || null,
      forward_date: snapshot.dispatchDetails?.forwardDate || null,
      forwarding_remarks: snapshot.dispatchDetails?.remarks || null,
      dispatched_by_name: snapshot.dispatchDetails?.userName || null,
      dispatched_at: snapshot.dispatchDetails?.timestamp || null,
      included_officer_pens: snapshot.includedOfficerPenList || [],
      summary_counts: { totalOfficersCount: snapshot.totalOfficersCount || 0 },
      updated_at: new Date().toISOString()
    };

    await client
      .from('office_report_versions')
      .upsert(payload, { onConflict: 'reference_number' });
  } catch (e) {
    console.warn("Could not save report version to Supabase:", e);
  }
}

async function saveOfficerAuditLogToSupabase(entry) {
  const client = getSupabaseClient();
  if (!client || !entry) return;
  try {
    const payload = {
      id: entry.id,
      action: entry.action,
      reference: entry.reference || '',
      user_role: entry.userRole,
      user_name: entry.userName || null,
      user_email: entry.userEmail || null,
      timestamp: entry.timestamp || new Date().toISOString(),
      changed_fields: entry.details || {}
    };

    await client
      .from('officer_audit_logs')
      .insert(payload);
  } catch (e) {
    // Fails silently if table not yet created
  }
}

// --- 16. ADMIN PORTAL OFFICER TRAINING & QUALIFICATION DASHBOARD ---

let otDashboardFilter = {
  search: '',
  office: 'ALL',
  designation: 'ALL',
  qualification: 'ALL',
  skill: 'ALL',
  willingness: 'ALL', // 'ALL' | 'WILLING' | 'NOT_SPECIFIED'
  drillDownType: null, // null | 'office' | 'qualification' | 'skill' | 'kpi'
  drillDownValue: null,
  pieDimension: 'qualifications', // 'qualifications' | 'basic_qualifications' | 'additional_qualifications' | 'specialized_skills'
  barScope: 'active' // 'active' | 'top15' | 'dtc_rto'
};

let otChartOfficerQualInstance = null;
let otChartOfficeCompletionInstance = null;

function getAdminOfficerDashboardData() {
  const map = new Map();

  // 1. Primary: Rich profiles from otProfilesStore
  const store = (typeof window !== 'undefined' && Array.isArray(window.otProfilesStore))
    ? window.otProfilesStore
    : otProfilesStore;
  if (Array.isArray(store)) {
    store.forEach(p => {
      if (!p || p.status === 'draft') return;
      const key = p.pen || p.id;
      if (!key) return;

      let addl = p.additionalQualifications || p.additional_qualifications || [];
      if (typeof addl === 'string') {
        try { addl = JSON.parse(addl); } catch (e) { addl = []; }
      }
      if (!Array.isArray(addl)) addl = [];
      addl = addl.filter(a => {
        const q = (typeof a === 'string' ? a : (a.qualification || a.name || '')).trim();
        return q && q !== 'No additional Qualifications' && q !== 'No additional Qualification';
      });

      let skills = p.specializedSkills || p.specialized_skills || [];
      if (typeof skills === 'string') {
        try { skills = JSON.parse(skills); } catch (e) { skills = skills.split(',').map(s => s.trim()).filter(Boolean); }
      }
      if (!Array.isArray(skills)) skills = [];
      skills = skills.map(s => s === 'IIT' ? 'IIT Trained' : s);

      let trainings = p.trainingHistory || p.training_history || [];
      if (typeof trainings === 'string') {
        try { trainings = JSON.parse(trainings); } catch (e) { trainings = []; }
      }
      if (!Array.isArray(trainings)) trainings = [];

      const item = {
        id: p.id,
        officeCode: p.officeCode || (p.officeName || '').split(' ')[0] || 'KL01',
        officeName: p.officeName || p.officeCode || 'MVD Office',
        officerFullName: p.officerFullName || p.officer_full_name || 'Officer',
        pen: p.pen || p.officer_pen || '',
        designation: p.designation || p.current_designation || p.officer_designation || 'AMVI',
        basicQualification: p.technicalQualification || p.technical_qualification || p.educational_qualification || p.generalEducation || 'Diploma',
        institution: p.institution || '',
        passingYear: p.passingYear || p.passing_year || '',
        grade: p.grade || p.class_grade || '',
        additionalQualifications: addl,
        specializedSkills: skills,
        customSkills: p.customSkills || p.custom_skills || '',
        willingnessToContribute: p.willingnessToContribute || p.willingness_to_contribute || '',
        trainingHistory: trainings,
        enteredBy: p.enteredBy || {
          fullName: p.entered_by_name || p.entry_officer_name || '',
          designation: p.entered_by_designation || p.entry_officer_designation || '',
          mobile: p.entered_by_mobile || p.entry_officer_mobile || ''
        },
        status: p.status || 'submitted',
        updatedAt: p.updatedAt || p.created_at || new Date().toISOString()
      };
      map.set(key, item);
    });
  }

  // 2. Secondary: Complementary profiles from officersStore in app.js
  if (typeof officersStore !== 'undefined' && Array.isArray(officersStore)) {
    officersStore.forEach(o => {
      if (!o) return;
      const key = o.officer_pen || o.id;
      if (!key || map.has(key)) return;

      const offCode = (o.office_name || '').split(' ')[0] || 'KL01';
      const skills = o.specialization ? o.specialization.split(',').map(s => s.trim() === 'IIT' ? 'IIT Trained' : s.trim()).filter(Boolean) : [];

      let trainings = [];
      if (o.training_details) {
        try { trainings = JSON.parse(o.training_details); } catch (e) { trainings = []; }
      } else if (o.training_attended && o.training_attended !== 'None') {
        trainings = [{ attended: o.training_attended, conductedBy: o.training_institutes || 'MVD', monthYear: o.recent_training_year ? String(o.recent_training_year) : '' }];
      }

      map.set(key, {
        id: o.id,
        officeCode: offCode,
        officeName: o.office_name || offCode,
        officerFullName: o.officer_name || '',
        pen: o.officer_pen || '',
        designation: o.officer_designation || 'AMVI',
        basicQualification: o.educational_qualification || 'Diploma',
        institution: '',
        passingYear: o.recent_training_year || '',
        grade: '',
        additionalQualifications: [],
        specializedSkills: skills,
        customSkills: o.qualification_other || '',
        willingnessToContribute: o.willingness_to_contribute || '',
        trainingHistory: trainings,
        enteredBy: {
          fullName: o.entry_officer_name || '',
          designation: o.entry_officer_designation || '',
          mobile: o.entry_officer_mobile || ''
        },
        status: 'submitted',
        updatedAt: o.created_at || new Date().toISOString()
      });
    });
  }

  return Array.from(map.values());
}

function getFilteredDashboardOfficers() {
  const all = getAdminOfficerDashboardData();
  return all.filter(o => {
    // 1. Text Search
    if (otDashboardFilter.search) {
      const q = otDashboardFilter.search.toLowerCase().trim();
      const hay = [
        o.officerFullName,
        o.pen,
        o.officeCode,
        o.officeName,
        o.designation,
        o.basicQualification,
        o.institution,
        (o.specializedSkills || []).join(' '),
        (o.additionalQualifications || []).map(a => a.qualification).join(' '),
        o.willingnessToContribute,
        (o.trainingHistory || []).map(t => t.attended).join(' ')
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }

    // 2. Office Filter
    if (otDashboardFilter.office !== 'ALL') {
      if (o.officeCode !== otDashboardFilter.office) return false;
    }

    // 3. Designation Filter
    if (otDashboardFilter.designation !== 'ALL') {
      if ((o.designation || '').toLowerCase() !== otDashboardFilter.designation.toLowerCase()) return false;
    }

    // 4. Qualification Filter
    if (otDashboardFilter.qualification !== 'ALL') {
      const targetQual = otDashboardFilter.qualification.toLowerCase();
      const basic = (o.basicQualification || '').toLowerCase();
      const addl = (o.additionalQualifications || []).map(a => (a.qualification || '').toLowerCase());
      const matchBasic = basic.includes(targetQual);
      const matchAddl = addl.some(a => a.includes(targetQual));
      if (!matchBasic && !matchAddl) return false;
    }

    // 5. Skill Filter
    if (otDashboardFilter.skill !== 'ALL') {
      const targetSkill = otDashboardFilter.skill.toLowerCase();
      const skills = (o.specializedSkills || []).map(s => s.toLowerCase());
      const custom = (o.customSkills || '').toLowerCase();
      if (!skills.includes(targetSkill) && !custom.includes(targetSkill)) return false;
    }

    // 6. Willingness Filter
    if (otDashboardFilter.willingness !== 'ALL') {
      const isWilling = !!(o.willingnessToContribute && o.willingnessToContribute.trim().length > 0);
      if (otDashboardFilter.willingness === 'WILLING' && !isWilling) return false;
      if (otDashboardFilter.willingness === 'NOT_SPECIFIED' && isWilling) return false;
    }

    // 7. Active Drill-Down Filter
    if (otDashboardFilter.drillDownType && otDashboardFilter.drillDownValue) {
      const val = String(otDashboardFilter.drillDownValue).toLowerCase().trim();
      if (otDashboardFilter.drillDownType === 'office') {
        if (o.officeCode.toLowerCase() !== val && !o.officeName.toLowerCase().includes(val)) return false;
      } else if (otDashboardFilter.drillDownType === 'skill') {
        const skills = (o.specializedSkills || []).map(s => s.toLowerCase());
        const custom = (o.customSkills || '').toLowerCase();
        if (!skills.includes(val) && !custom.includes(val)) return false;
      } else if (otDashboardFilter.drillDownType === 'qualification') {
        const basic = (o.basicQualification || '').toLowerCase();
        const addl = (o.additionalQualifications || []).map(a => (a.qualification || '').toLowerCase());
        if (!basic.includes(val) && !addl.some(a => a.includes(val))) return false;
      } else if (otDashboardFilter.drillDownType === 'kpi') {
        if (val === 'add_qual' && !(o.additionalQualifications && o.additionalQualifications.length > 0)) return false;
        if (val === 'skills_trainings' && !((o.specializedSkills && o.specializedSkills.length > 0) || (o.trainingHistory && o.trainingHistory.length > 0))) return false;
        if (val === 'willing' && !(o.willingnessToContribute && o.willingnessToContribute.trim().length > 0)) return false;
        if (val === 'offices_completed') {
          const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
          const snap = snapStore[o.officeCode];
          if (!snap || !snap.isForwarded) return false;
        }
        if (val === 'offices_pending') {
          const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
          const snap = snapStore[o.officeCode];
          if (snap && snap.isForwarded) return false;
        }
      }
    }

    return true;
  });
}

function updateOfficerDashboardKpis(allOfficers, filteredOfficers) {
  const total = allOfficers.length;
  const withAddl = allOfficers.filter(o => o.additionalQualifications && o.additionalQualifications.length > 0).length;
  const withSkillsTrainings = allOfficers.filter(o => 
    (o.specializedSkills && o.specializedSkills.length > 0) ||
    (o.customSkills && o.customSkills.trim().length > 0) ||
    (o.trainingHistory && o.trainingHistory.length > 0)
  ).length;
  const willing = allOfficers.filter(o => o.willingnessToContribute && o.willingnessToContribute.trim().length > 0).length;

  const elTotal = document.getElementById('kpiOtTotalOfficers');
  const elAddl = document.getElementById('kpiOtAddQualOfficers');
  const elAddlPct = document.getElementById('kpiOtAddQualPct');
  const elSkills = document.getElementById('kpiOtSkillsTrainingOfficers');
  const elSkillsPct = document.getElementById('kpiOtSkillsTrainingPct');
  const elWilling = document.getElementById('kpiOtWillingOfficers');
  const elWillingPct = document.getElementById('kpiOtWillingPct');

  if (elTotal) elTotal.textContent = total;
  if (elAddl) elAddl.textContent = withAddl;
  if (elAddlPct) elAddlPct.textContent = total > 0 ? `${Math.round((withAddl / total) * 100)}% of total officers` : '0% of total officers';
  if (elSkills) elSkills.textContent = withSkillsTrainings;
  if (elSkillsPct) elSkillsPct.textContent = total > 0 ? `${Math.round((withSkillsTrainings / total) * 100)}% specialized personnel` : '0% specialized personnel';
  if (elWilling) elWilling.textContent = willing;
  if (elWillingPct) elWillingPct.textContent = total > 0 ? `${Math.round((willing / total) * 100)}% ready for special duties` : '0% ready for special duties';

  // Calculate completed & pending offices for "Send to Transport Commissionerate" action
  const snapStore = (typeof window !== 'undefined' && window.otReportSnapshotsStore) || otReportSnapshotsStore || {};
  const knownOffices = new Set();
  (allOfficers || []).forEach(o => { if (o && o.officeCode) knownOffices.add(o.officeCode); });
  Object.keys(snapStore).forEach(c => { if (c) knownOffices.add(c); });

  let officesCompleted = 0;
  let officesPending = 0;

  knownOffices.forEach(code => {
    const snap = snapStore[code];
    if (snap && snap.isForwarded) {
      officesCompleted++;
    } else {
      officesPending++;
    }
  });

  const elCompleted = document.getElementById('kpiOtOfficesCompleted');
  const elCompletedSub = document.getElementById('kpiOtOfficesCompletedSub');
  const elPending = document.getElementById('kpiOtOfficesPending');
  const elPendingSub = document.getElementById('kpiOtOfficesPendingSub');

  if (elCompleted) elCompleted.textContent = officesCompleted;
  if (elCompletedSub) elCompletedSub.textContent = `${officesCompleted} office(s) sent`;
  if (elPending) elPending.textContent = officesPending;
  if (elPendingSub) elPendingSub.textContent = `${officesPending} office(s) pending action`;

  // Highlight active KPI card
  document.querySelectorAll('.ot-kpi-card').forEach(c => c.classList.remove('active'));
  if (otDashboardFilter.drillDownType === 'kpi') {
    if (otDashboardFilter.drillDownValue === 'all') document.getElementById('kpiCardTotalOfficers')?.classList.add('active');
    else if (otDashboardFilter.drillDownValue === 'add_qual') document.getElementById('kpiCardAddQual')?.classList.add('active');
    else if (otDashboardFilter.drillDownValue === 'skills_trainings') document.getElementById('kpiCardSkillsTrainings')?.classList.add('active');
    else if (otDashboardFilter.drillDownValue === 'willing') document.getElementById('kpiCardWilling')?.classList.add('active');
    else if (otDashboardFilter.drillDownValue === 'offices_completed') document.getElementById('kpiCardOfficesCompleted')?.classList.add('active');
    else if (otDashboardFilter.drillDownValue === 'offices_pending') document.getElementById('kpiCardOfficesPending')?.classList.add('active');
  }

  // Update table record count
  const countEl = document.getElementById('otDashboardRecordCount');
  if (countEl) countEl.textContent = `Showing ${filteredOfficers.length} of ${total} officers`;
}

function renderOfficerBreakdownPieChart(filteredOfficers) {
  const canvas = document.getElementById('chartOfficerQualDistribution');
  if (!canvas || typeof Chart === 'undefined') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dim = document.getElementById('otPieDimensionSelect')?.value || otDashboardFilter.pieDimension || 'qualifications';
  otDashboardFilter.pieDimension = dim;

  const officers = filteredOfficers || getFilteredDashboardOfficers();
  let counts = {};
  let title = "Qualification Breakdown";

  if (dim === 'qualifications') {
    title = "Qualifications Distribution (Basic & Additional)";
    counts = {
      'B.Tech / B.E': 0,
      'Diploma': 0,
      'ITI': 0,
      'LLB / Law': 0,
      'MBA': 0,
      'M.Tech': 0,
      'PhD': 0,
      'MCA / M.Sc': 0,
      'Other Qualifications': 0
    };
    officers.forEach(o => {
      const b = (o.basicQualification || '').toUpperCase();
      let categorized = false;
      if (b.includes('B.TECH') || b.includes('B.E')) { counts['B.Tech / B.E']++; categorized = true; }
      else if (b.includes('DIPLOMA')) { counts['Diploma']++; categorized = true; }
      else if (b.includes('ITI')) { counts['ITI']++; categorized = true; }

      (o.additionalQualifications || []).forEach(a => {
        const aq = (a.qualification || '').toUpperCase();
        if (aq.includes('LLB') || aq.includes('LAW') || aq.includes('LLM')) { counts['LLB / Law']++; categorized = true; }
        else if (aq.includes('MBA')) { counts['MBA']++; categorized = true; }
        else if (aq.includes('M.TECH')) { counts['M.Tech']++; categorized = true; }
        else if (aq.includes('PHD')) { counts['PhD']++; categorized = true; }
        else if (aq.includes('MCA') || aq.includes('M.SC')) { counts['MCA / M.Sc']++; categorized = true; }
      });
      if (!categorized) counts['Other Qualifications']++;
    });
  } else if (dim === 'basic_qualifications') {
    title = "Basic Technical Qualifications";
    counts = {};
    officers.forEach(o => {
      const q = o.basicQualification || 'Not Specified';
      counts[q] = (counts[q] || 0) + 1;
    });
  } else if (dim === 'additional_qualifications') {
    title = "Additional Qualifications Breakdown";
    counts = {};
    officers.forEach(o => {
      (o.additionalQualifications || []).forEach(a => {
        const q = a.qualification || 'Other';
        counts[q] = (counts[q] || 0) + 1;
      });
    });
    if (Object.keys(counts).length === 0) counts['No Additional Qualifications'] = 0;
  } else if (dim === 'specialized_skills') {
    title = "Specialized Skills & Trainings Distribution";
    counts = {};
    officers.forEach(o => {
      (o.specializedSkills || []).forEach(s => {
        const skillName = s === 'IIT' ? 'IIT Trained' : s;
        counts[skillName] = (counts[skillName] || 0) + 1;
      });
      if (o.customSkills) {
        counts['Custom / Other Skills'] = (counts['Custom / Other Skills'] || 0) + 1;
      }
    });
    if (Object.keys(counts).length === 0) counts['No Specialized Skills'] = 0;
  }

  const labels = [];
  const data = [];
  Object.entries(counts).forEach(([k, v]) => {
    if (v > 0) {
      labels.push(k);
      data.push(v);
    }
  });

  const headingEl = document.getElementById('otPieChartHeading');
  if (headingEl) headingEl.textContent = title;

  const palette = [
    '#059669', '#0284c7', '#7c3aed', '#f59e0b', '#dc2626',
    '#10b981', '#38bdf8', '#c084fc', '#fbbf24', '#f87171',
    '#065f46', '#0369a1', '#6b21a8', '#b45309', '#991b1b',
    '#64748b'
  ];

  if (otChartOfficerQualInstance) {
    try { otChartOfficerQualInstance.destroy(); } catch (e) {}
    otChartOfficerQualInstance = null;
  }

  if (labels.length === 0) {
    labels.push("No data");
    data.push(1);
  }

  otChartOfficerQualInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: palette.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" } }
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              const val = item.raw;
              const total = data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${item.label}: ${val} officers (${pct}%)`;
            }
          }
        }
      },
      onClick: (evt, activeEls) => {
        if (activeEls && activeEls.length > 0) {
          const idx = activeEls[0].index;
          const clickedLabel = labels[idx];
          if (clickedLabel === 'No data') return;
          if (dim === 'specialized_skills') {
            applyDrillDown('skill', clickedLabel);
          } else {
            applyDrillDown('qualification', clickedLabel);
          }
        }
      }
    }
  });
}

function renderOfficeCompletionBarChart(allOfficers) {
  const canvas = document.getElementById('chartOfficeCompletionRate');
  if (!canvas || typeof Chart === 'undefined') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const officers = allOfficers || getAdminOfficerDashboardData();
  const scope = document.getElementById('otBarScopeSelect')?.value || otDashboardFilter.barScope || 'active';
  otDashboardFilter.barScope = scope;

  const officeCounts = {};
  officers.forEach(o => {
    const code = o.officeCode || 'Unknown';
    officeCounts[code] = (officeCounts[code] || 0) + 1;
  });

  let sortedOffices = [];
  if (scope === 'active') {
    sortedOffices = Object.keys(officeCounts)
      .map(code => {
        const off = (typeof ALL_MVD_OFFICES !== 'undefined' ? ALL_MVD_OFFICES.find(m => m.code === code) : null);
        return { code, label: `${code} ${off ? off.name.replace(/^(RTO|SRTO|DTC),?\s*/i, '') : ''}`.trim(), count: officeCounts[code] };
      })
      .sort((a, b) => b.count - a.count);
  } else if (scope === 'top15') {
    sortedOffices = Object.keys(officeCounts)
      .map(code => {
        const off = (typeof ALL_MVD_OFFICES !== 'undefined' ? ALL_MVD_OFFICES.find(m => m.code === code) : null);
        return { code, label: `${code} ${off ? off.name.replace(/^(RTO|SRTO|DTC),?\s*/i, '') : ''}`.trim(), count: officeCounts[code] };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  } else if (scope === 'dtc_rto' && typeof ALL_MVD_OFFICES !== 'undefined') {
    sortedOffices = ALL_MVD_OFFICES
      .filter(m => m.category === 'Commissionerate & DTC Offices' || m.category === 'RTO Offices')
      .map(m => ({
        code: m.code,
        label: `${m.code} ${m.name.replace(/^(RTO|DTC),?\s*/i, '')}`.trim(),
        count: officeCounts[m.code] || 0
      }))
      .sort((a, b) => (b.count || 0) - (a.count || 0));
  }

  if (sortedOffices.length === 0) {
    sortedOffices = [{ code: "KL01", label: "KL01 Thiruvananthapuram", count: 0 }];
  }

  const labels = sortedOffices.map(o => o.label);
  const data = sortedOffices.map(o => o.count);
  const officeCodes = sortedOffices.map(o => o.code);

  if (otChartOfficeCompletionInstance) {
    try { otChartOfficeCompletionInstance.destroy(); } catch (e) {}
    otChartOfficeCompletionInstance = null;
  }

  otChartOfficeCompletionInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Officers Profiled',
        data,
        backgroundColor: data.map(c => c > 0 ? '#0284c7' : '#e2e8f0'),
        borderRadius: 4,
        maxBarThickness: 32
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` ${item.raw} profile(s) entered`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: 'Number of Officers', font: { size: 10 } }
        },
        x: {
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 30
          }
        }
      },
      onClick: (evt, activeEls) => {
        if (activeEls && activeEls.length > 0) {
          const idx = activeEls[0].index;
          const clickedCode = officeCodes[idx];
          applyDrillDown('office', clickedCode);
        }
      }
    }
  });
}

function applyDrillDown(type, value) {
  otDashboardFilter.drillDownType = type;
  otDashboardFilter.drillDownValue = value;

  const banner = document.getElementById('otAdminDrillDownBanner');
  const label = document.getElementById('otDrillDownLabel');
  if (banner && label) {
    banner.style.display = 'flex';
    const typeLabel = type === 'office' ? 'Office' : (type === 'skill' ? 'Specialized Skill' : (type === 'qualification' ? 'Qualification' : 'Filter'));
    label.textContent = `${typeLabel}: ${value}`;
  }

  if (type === 'office') {
    const sel = document.getElementById('adminOfficerOfficeFilter');
    if (sel) sel.value = value;
  } else if (type === 'skill') {
    const sel = document.getElementById('adminOfficerSkillFilter');
    if (sel) sel.value = value;
  } else if (type === 'qualification') {
    const sel = document.getElementById('adminOfficerQualificationFilter');
    if (sel) {
      const opt = Array.from(sel.options).find(o => o.value.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(o.value.toLowerCase()));
      if (opt) sel.value = opt.value;
    }
  }

  renderOfficerDashboardTable();

  const tableEl = document.getElementById('otDashboardTableWrapper');
  if (tableEl) {
    tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (typeof showToast === 'function') showToast(`Drill-Down applied for: ${value}`, 'info');
}

function clearDrillDown() {
  otDashboardFilter.drillDownType = null;
  otDashboardFilter.drillDownValue = null;
  const banner = document.getElementById('otAdminDrillDownBanner');
  if (banner) banner.style.display = 'none';

  document.querySelectorAll('.ot-kpi-card').forEach(c => c.classList.remove('active'));
  renderOfficerAdminDashboard();
  if (typeof showToast === 'function') showToast('Drill-down cleared', 'info');
}

function applyQuickKpiFilter(kpiType) {
  if (otDashboardFilter.drillDownType === 'kpi' && otDashboardFilter.drillDownValue === kpiType) {
    clearDrillDown();
    return;
  }
  otDashboardFilter.drillDownType = 'kpi';
  otDashboardFilter.drillDownValue = kpiType;

  const banner = document.getElementById('otAdminDrillDownBanner');
  const label = document.getElementById('otDrillDownLabel');
  if (banner && label) {
    banner.style.display = 'flex';
    const names = {
      all: 'All Registered Officers',
      add_qual: 'Officers with Additional Qualifications',
      skills_trainings: 'Officers with Specialized Skills / In-Service Trainings',
      willing: 'Officers Willing to Contribute More',
      offices_completed: 'Offices Sent to Transport Commissionerate (Completed)',
      offices_pending: 'Offices Pending "Send to Transport Commissionerate"'
    };
    label.textContent = `KPI Metric: ${names[kpiType] || kpiType}`;
  }

  renderOfficerDashboardTable();
  const tableEl = document.getElementById('otDashboardTableWrapper');
  if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function populateDashboardOfficeFilter() {
  const sel = document.getElementById('adminOfficerOfficeFilter');
  if (!sel || sel.options.length > 1) return;

  sel.innerHTML = '<option value="ALL">-- All Offices (Statewide) --</option>';
  if (typeof OT_OFFICE_GROUPS !== 'undefined') {
    Object.entries(OT_OFFICE_GROUPS).forEach(([groupName, offices]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = groupName;
      offices.forEach(off => {
        const opt = document.createElement('option');
        opt.value = off.code;
        opt.textContent = `${off.code} — ${off.name}`;
        optgroup.appendChild(opt);
      });
      sel.appendChild(optgroup);
    });
  }
}

function handleOfficerDashboardFilterChange() {
  otDashboardFilter.search = document.getElementById('adminOfficerSearchInput')?.value || '';
  otDashboardFilter.office = document.getElementById('adminOfficerOfficeFilter')?.value || 'ALL';
  otDashboardFilter.designation = document.getElementById('adminOfficerDesignationFilter')?.value || 'ALL';
  otDashboardFilter.qualification = document.getElementById('adminOfficerQualificationFilter')?.value || 'ALL';
  otDashboardFilter.skill = document.getElementById('adminOfficerSkillFilter')?.value || 'ALL';
  otDashboardFilter.willingness = document.getElementById('adminOfficerWillingnessFilter')?.value || 'ALL';

  const filtered = getFilteredDashboardOfficers();
  const all = getAdminOfficerDashboardData();

  updateOfficerDashboardKpis(all, filtered);
  renderOfficerBreakdownPieChart(filtered);
  renderOfficerDashboardTable();
}

function resetAdminOfficerDashboardFilters() {
  otDashboardFilter = {
    search: '',
    office: 'ALL',
    designation: 'ALL',
    qualification: 'ALL',
    skill: 'ALL',
    willingness: 'ALL',
    drillDownType: null,
    drillDownValue: null,
    pieDimension: 'qualifications',
    barScope: 'active'
  };

  if (document.getElementById('adminOfficerSearchInput')) document.getElementById('adminOfficerSearchInput').value = '';
  if (document.getElementById('adminOfficerOfficeFilter')) document.getElementById('adminOfficerOfficeFilter').value = 'ALL';
  if (document.getElementById('adminOfficerDesignationFilter')) document.getElementById('adminOfficerDesignationFilter').value = 'ALL';
  if (document.getElementById('adminOfficerQualificationFilter')) document.getElementById('adminOfficerQualificationFilter').value = 'ALL';
  if (document.getElementById('adminOfficerSkillFilter')) document.getElementById('adminOfficerSkillFilter').value = 'ALL';
  if (document.getElementById('adminOfficerWillingnessFilter')) document.getElementById('adminOfficerWillingnessFilter').value = 'ALL';

  const banner = document.getElementById('otAdminDrillDownBanner');
  if (banner) banner.style.display = 'none';

  renderOfficerAdminDashboard();
  if (typeof showToast === 'function') showToast("All dashboard filters reset", "info");
}

function renderOfficerDashboardTable() {
  const tbody = document.getElementById('adminOfficersTableBody');
  if (!tbody) return;

  const allOfficers = getAdminOfficerDashboardData();
  const filtered = getFilteredDashboardOfficers();

  updateOfficerDashboardKpis(allOfficers, filtered);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 36px 20px;">
          <i class="fa-solid fa-user-slash" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
          <span style="font-size: 0.95rem; font-weight: 700; color: #475569;">No officer records found matching the selected criteria.</span>
          <br>
          <small style="color: #94a3b8;">Try clearing the search term or resetting the filters.</small>
          <div style="margin-top: 12px;">
            <button class="btn btn-outline btn-sm" onclick="resetAdminOfficerDashboardFilters()" style="font-weight: 700;">
              <i class="fa-solid fa-rotate-left"></i> Reset All Filters
            </button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((o, idx) => {
    const qualClass = typeof getQualificationBadgeClass === 'function' ? getQualificationBadgeClass(o.basicQualification) : 'badge-info';
    const basicBadge = `<span class="badge ${qualClass}" style="font-size: 0.76rem;">${escapeHtml(o.basicQualification)}</span>${o.passingYear ? `<br><small style="color: #64748b;">Year: ${escapeHtml(o.passingYear)}</small>` : ''}`;

    const addlBadges = (o.additionalQualifications && o.additionalQualifications.length > 0)
      ? o.additionalQualifications.map(a => `<span class="badge badge-info" style="font-size: 0.72rem; margin: 1px 2px;" title="${escapeHtml(a.institution || '')}">${escapeHtml(a.qualification)} <small>(${escapeHtml(a.status || 'Completed')})</small></span>`).join('')
      : '<span style="color: #94a3b8; font-size: 0.8rem;">None</span>';

    const skillBadges = (o.specializedSkills && o.specializedSkills.length > 0)
      ? o.specializedSkills.map(s => {
          const isIit = s === 'IIT Trained';
          return `<span class="badge" style="background: ${isIit ? '#047857' : '#f3e8ff'}; color: ${isIit ? '#ffffff' : '#6b21a8'}; font-size: 0.72rem; margin: 1px 2px;">${escapeHtml(s)}</span>`;
        }).join('')
      : (o.customSkills ? `<span class="badge badge-warning" style="font-size: 0.72rem;">${escapeHtml(o.customSkills)}</span>` : '<span style="color: #94a3b8; font-size: 0.8rem;">None</span>');

    const trCount = (o.trainingHistory || []).length;
    const trBadge = trCount > 0
      ? `<span class="badge badge-working" style="font-size: 0.74rem; font-weight: 700;">${trCount} course(s)</span><br><small style="color: #475569;" title="${escapeHtml(o.trainingHistory.map(t => t.attended).join('; '))}">Latest: ${escapeHtml(o.trainingHistory[0]?.attended?.slice(0, 20) || '')}...</small>`
      : '<span style="color: #94a3b8; font-size: 0.8rem;">0 courses</span>';

    const willText = (o.willingnessToContribute || '').trim();
    const willBadge = willText
      ? `<span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.74rem; font-weight: 700;" title="${escapeHtml(willText)}"><i class="fa-solid fa-handshake-angle"></i> Willing</span><br><small style="color: #78350f; font-style: italic;">"${escapeHtml(willText.length > 32 ? willText.substring(0, 30) + '...' : willText)}"</small>`
      : '<span style="color: #94a3b8; font-size: 0.8rem;">Not Specified</span>';

    return `
      <tr>
        <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
        <td>
          <span class="badge badge-info" style="font-size: 0.74rem; font-weight: 800;">${escapeHtml(o.officeCode)}</span>
          <br><small style="color: #475569; font-weight: 600;">${escapeHtml(o.officeName || o.officeCode)}</small>
        </td>
        <td>
          <span style="font-weight: 800; color: #0B3B24;">${escapeHtml(o.officerFullName)}</span>
          <br><small style="color: #64748b; font-weight: 700;"><i class="fa-solid fa-hashtag"></i> PEN: ${escapeHtml(o.pen)}</small>
        </td>
        <td><span class="badge badge-info" style="font-weight: 700;">${escapeHtml(o.designation)}</span></td>
        <td>${basicBadge}</td>
        <td><div style="max-width: 190px; line-height: 1.4;">${addlBadges}</div></td>
        <td><div style="max-width: 190px; line-height: 1.4;">${skillBadges}</div></td>
        <td>${trBadge}</td>
        <td><div style="max-width: 180px;">${willBadge}</div></td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 4px; justify-content: center;">
            <button class="btn btn-outline btn-sm" onclick="editOfficerInAdmin('${escapeHtml(o.id || o.pen)}')" title="Edit Profile in Entry Form" style="padding: 4px 8px;">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteOfficerRecord('${escapeHtml(o.id || o.pen)}')" title="Delete Profile" style="padding: 4px 8px;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOfficerAdminDashboard() {
  populateDashboardOfficeFilter();
  const allOfficers = getAdminOfficerDashboardData();
  const filtered = getFilteredDashboardOfficers();

  updateOfficerDashboardKpis(allOfficers, filtered);
  renderOfficerBreakdownPieChart(filtered);
  renderOfficeCompletionBarChart(allOfficers);
  renderOfficerDashboardTable();
}

function exportOfficerDashboardToExcel() {
  const officers = getFilteredDashboardOfficers();
  if (officers.length === 0) {
    if (typeof showToast === 'function') showToast("No officer records match current filter criteria.", "warning");
    return;
  }

  if (typeof XLSX === 'undefined') {
    if (typeof showToast === 'function') showToast("SheetJS library loading... falling back to CSV export.", "info");
    exportOfficersReportCSV();
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN');
  const fileDate = now.toISOString().slice(0, 10);

  const total = officers.length;
  const withAddl = officers.filter(o => o.additionalQualifications && o.additionalQualifications.length > 0).length;
  const withSkills = officers.filter(o => (o.specializedSkills && o.specializedSkills.length > 0) || (o.trainingHistory && o.trainingHistory.length > 0)).length;
  const willing = officers.filter(o => o.willingnessToContribute && o.willingnessToContribute.trim().length > 0).length;

  const knownOffices = new Set();
  officers.forEach(o => { if (o && o.officeCode) knownOffices.add(o.officeCode); });
  Object.keys(otReportSnapshotsStore || {}).forEach(c => { if (c) knownOffices.add(c); });
  let offCompleted = 0, offPending = 0;
  knownOffices.forEach(code => {
    if (otReportSnapshotsStore && otReportSnapshotsStore[code]?.isForwarded) offCompleted++;
    else offPending++;
  });

  const headerRows = [
    ["KERALAM MOTOR VEHICLES DEPARTMENT"],
    ["OFFICER TRAINING & QUALIFICATIONS — EXECUTIVE ADMIN DASHBOARD REPORT"],
    [`Generated On: ${dateStr}`, `Applied Filters: Office: ${otDashboardFilter.office} | Designation: ${otDashboardFilter.designation} | Qual: ${otDashboardFilter.qualification} | Skill: ${otDashboardFilter.skill}`],
    [`Summary KPIs: Total Officers: ${total}`, `With Addl Qual: ${withAddl}`, `With Skills/Trainings: ${withSkills}`, `Willing to Contribute: ${willing}`, `Offices Sent to TC: ${offCompleted}`, `Offices Pending: ${offPending}`],
    []
  ];

  const columnHeaders = [
    "Sl No", "Office Code", "Office Name", "Officer Full Name", "PEN", "Designation",
    "Basic Technical Qualification", "Institution", "Passing Year", "Class / Grade",
    "Additional Qualifications", "Specialized Skills", "In-Service Trainings Count",
    "Training Courses Attended", "Willingness to Contribute More",
    "Entered By Name", "Entered By Designation", "Entered By Mobile", "Status"
  ];

  const dataRows = officers.map((o, idx) => {
    const addlStr = (o.additionalQualifications || []).map(a => `${a.qualification} (${a.status || 'Completed'}${a.year ? ' ' + a.year : ''})`).join('; ') || 'None';
    const skillsStr = (o.specializedSkills || []).join(', ') || (o.customSkills || 'None');
    const trainCount = (o.trainingHistory || []).length;
    const trainCourses = (o.trainingHistory || []).map(t => `${t.attended} (${t.conductedBy || 'MVD'})`).join('; ') || 'None';

    return [
      idx + 1,
      o.officeCode || '',
      o.officeName || '',
      o.officerFullName || '',
      o.pen || '',
      o.designation || '',
      o.basicQualification || '',
      o.institution || '',
      o.passingYear || '',
      o.grade || '',
      addlStr,
      skillsStr,
      trainCount,
      trainCourses,
      o.willingnessToContribute || 'Not Specified',
      o.enteredBy?.fullName || '',
      o.enteredBy?.designation || '',
      o.enteredBy?.mobile || '',
      o.status || 'submitted'
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([...headerRows, columnHeaders, ...dataRows]);

  ws['!cols'] = [
    { wch: 6 },  { wch: 12 }, { wch: 26 }, { wch: 24 }, { wch: 12 }, { wch: 18 },
    { wch: 22 }, { wch: 28 }, { wch: 12 }, { wch: 16 }, { wch: 34 }, { wch: 32 },
    { wch: 12 }, { wch: 38 }, { wch: 35 }, { wch: 20 }, { wch: 20 }, { wch: 14 },
    { wch: 12 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Officer Training Dashboard");
  XLSX.writeFile(wb, `MVD_Officer_Training_Dashboard_${fileDate}.xlsx`);
  if (typeof showToast === 'function') showToast(`Exported ${total} officer record(s) to Excel successfully!`, "success");
}

function exportOfficerDashboardToPDF() {
  const officers = getFilteredDashboardOfficers();
  if (officers.length === 0) {
    if (typeof showToast === 'function') showToast("No officer records match current filter criteria.", "warning");
    return;
  }

  const jsPDF = window.jspdf ? window.jspdf.jsPDF : (typeof jspdf !== 'undefined' ? jspdf.jsPDF : null);
  if (!jsPDF) {
    if (typeof showToast === 'function') showToast("jsPDF library not available; opening browser print view...", "info");
    window.print();
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  const total = officers.length;
  const withAddl = officers.filter(o => o.additionalQualifications && o.additionalQualifications.length > 0).length;
  const withSkills = officers.filter(o => (o.specializedSkills && o.specializedSkills.length > 0) || (o.trainingHistory && o.trainingHistory.length > 0)).length;
  const willing = officers.filter(o => o.willingnessToContribute && o.willingnessToContribute.trim().length > 0).length;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // 1. Header Banner
  doc.setFillColor(11, 59, 36);
  doc.rect(0, 0, 842, 54, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text("GOVERNMENT OF KERALAM • MOTOR VEHICLES DEPARTMENT", 40, 24);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("OFFICER TRAINING & QUALIFICATIONS — EXECUTIVE ADMIN DASHBOARD REPORT", 40, 42);

  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr}`, 680, 24);
  doc.text(`Total Records: ${total}`, 680, 42);

  // 2. Summary KPI Cards Strip (All 6 metrics)
  const knownOffices = new Set();
  officers.forEach(o => { if (o && o.officeCode) knownOffices.add(o.officeCode); });
  Object.keys(otReportSnapshotsStore || {}).forEach(c => { if (c) knownOffices.add(c); });
  let offCompleted = 0, offPending = 0;
  knownOffices.forEach(code => {
    if (otReportSnapshotsStore && otReportSnapshotsStore[code]?.isForwarded) offCompleted++;
    else offPending++;
  });

  const kpiY = 64;
  const kpiW = 118;
  const kpiH = 34;

  const kpis = [
    { label: "TOTAL ENTERED", val: String(total), color: [240, 253, 244], stroke: [134, 239, 172], text: [20, 83, 45] },
    { label: "ADDITIONAL QUAL", val: `${withAddl} (${total > 0 ? Math.round((withAddl/total)*100) : 0}%)`, color: [239, 246, 255], stroke: [147, 197, 253], text: [30, 58, 138] },
    { label: "SKILLS & TRAININGS", val: `${withSkills} (${total > 0 ? Math.round((withSkills/total)*100) : 0}%)`, color: [250, 245, 255], stroke: [216, 180, 254], text: [88, 28, 135] },
    { label: "WILLING TO CONTRIBUTE", val: `${willing} (${total > 0 ? Math.round((willing/total)*100) : 0}%)`, color: [255, 251, 235], stroke: [253, 230, 138], text: [120, 53, 15] },
    { label: "OFFICES SENT TO TC", val: `${offCompleted} (${knownOffices.size > 0 ? Math.round((offCompleted/knownOffices.size)*100) : 0}%)`, color: [236, 253, 245], stroke: [110, 231, 183], text: [6, 95, 70] },
    { label: "OFFICES PENDING TC", val: `${offPending} (${knownOffices.size > 0 ? Math.round((offPending/knownOffices.size)*100) : 0}%)`, color: [255, 247, 237], stroke: [253, 186, 116], text: [154, 52, 18] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = 40 + idx * (kpiW + 8);
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.setDrawColor(kpi.stroke[0], kpi.stroke[1], kpi.stroke[2]);
    doc.roundedRect(x, kpiY, kpiW, kpiH, 4, 4, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.label, x + 6, kpiY + 12);

    doc.setTextColor(kpi.text[0], kpi.text[1], kpi.text[2]);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.val, x + 6, kpiY + 27);
  });

  // 3. AutoTable
  const tableData = officers.map((o, idx) => {
    const addl = (o.additionalQualifications || []).map(a => `${a.qualification} (${a.status})`).join(', ') || '-';
    const skills = (o.specializedSkills || []).join(', ') || (o.customSkills || '-');
    const trCount = (o.trainingHistory || []).length;
    const trStr = trCount > 0 ? `${trCount} course(s)` : '-';
    const willStr = (o.willingnessToContribute || '').trim();

    return [
      idx + 1,
      `${o.officeCode}\n${(o.officeName || '').replace(/^(RTO|SRTO|DTC),?\s*/i, '')}`,
      `${o.officerFullName}\nPEN: ${o.pen}`,
      o.designation,
      `${o.basicQualification}${o.passingYear ? ' (' + o.passingYear + ')' : ''}`,
      addl,
      skills,
      trStr,
      willStr ? (willStr.length > 45 ? willStr.substring(0, 42) + '...' : willStr) : 'Not Specified'
    ];
  });

  doc.autoTable({
    startY: kpiY + kpiH + 12,
    head: [[
      "#", "Office", "Officer & PEN", "Designation",
      "Basic Qual", "Additional Qual", "Specialized Skills", "Trainings", "Willing to Contribute"
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 4,
      font: 'helvetica',
      overflow: 'linebreak',
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [11, 59, 36],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 105 },
      3: { cellWidth: 75 },
      4: { cellWidth: 85 },
      5: { cellWidth: 110 },
      6: { cellWidth: 110 },
      7: { cellWidth: 55, halign: 'center' },
      8: { cellWidth: 128 }
    },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount} • Motor Vehicles Department, Government of Keralam • Confidential Official Document`,
        40,
        575
      );
    }
  });

  const fileDate = now.toISOString().slice(0, 10);
  doc.save(`MVD_Officer_Training_Dashboard_${fileDate}.pdf`);
  if (typeof showToast === 'function') showToast(`PDF report generated and downloaded successfully!`, "success");
}

function exportOfficersReportCSV() {
  const officers = getFilteredDashboardOfficers();

  if (!officers || officers.length === 0) {
    if (typeof showToast === 'function') showToast('No officer records available to export', 'warning');
    return;
  }

  const headers = [
    "Sl No", "Office Code", "Office Name", "Officer Full Name", "PEN", "Designation",
    "Basic Qualification", "Institution", "Passing Year", "Grade",
    "Additional Qualifications", "Specialized Skills", "In-Service Trainings",
    "Willingness to Contribute More", "Entered By Name", "Entered By Designation", "Entered By Mobile"
  ];

  const rows = officers.map((o, idx) => {
    const addlStr = (o.additionalQualifications || []).map(a => `${a.qualification} (${a.status || 'Completed'})`).join('; ') || 'None';
    const skillsStr = (o.specializedSkills || []).join(', ') || (o.customSkills || 'None');
    const trainStr = (o.trainingHistory || []).map(t => `${t.attended} (${t.conductedBy || 'MVD'})`).join('; ') || 'None';

    return [
      idx + 1,
      `"${(o.officeCode || '').replace(/"/g, '""')}"`,
      `"${(o.officeName || '').replace(/"/g, '""')}"`,
      `"${(o.officerFullName || '').replace(/"/g, '""')}"`,
      `"${(o.pen || '').replace(/"/g, '""')}"`,
      `"${(o.designation || '').replace(/"/g, '""')}"`,
      `"${(o.basicQualification || '').replace(/"/g, '""')}"`,
      `"${(o.institution || '').replace(/"/g, '""')}"`,
      `"${(o.passingYear || '').replace(/"/g, '""')}"`,
      `"${(o.grade || '').replace(/"/g, '""')}"`,
      `"${addlStr.replace(/"/g, '""')}"`,
      `"${skillsStr.replace(/"/g, '""')}"`,
      `"${trainStr.replace(/"/g, '""')}"`,
      `"${(o.willingnessToContribute || 'Not Specified').replace(/"/g, '""')}"`,
      `"${(o.enteredBy?.fullName || '').replace(/"/g, '""')}"`,
      `"${(o.enteredBy?.designation || '').replace(/"/g, '""')}"`,
      `"${(o.enteredBy?.mobile || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `MVD_Officer_Training_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (typeof showToast === 'function') showToast(`Exported ${officers.length} officer record(s) to CSV`, 'success');
}

// Global Exports
window.renderOfficerAdminDashboard = renderOfficerAdminDashboard;
window.renderAdminOfficersTable = renderOfficerAdminDashboard;
window.exportOfficerDashboardToExcel = exportOfficerDashboardToExcel;
window.exportOfficerDashboardToPDF = exportOfficerDashboardToPDF;
window.exportOfficersReportCSV = exportOfficersReportCSV;
window.clearDrillDown = clearDrillDown;
window.applyQuickKpiFilter = applyQuickKpiFilter;
window.applyDrillDown = applyDrillDown;
window.handleOfficerDashboardFilterChange = handleOfficerDashboardFilterChange;
window.resetAdminOfficerDashboardFilters = resetAdminOfficerDashboardFilters;
window.renderOfficerBreakdownPieChart = renderOfficerBreakdownPieChart;
window.renderOfficeCompletionBarChart = renderOfficeCompletionBarChart;

// Automatically bind on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initOfficerTrainingModule();
});

