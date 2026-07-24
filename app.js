/* ==========================================================================
   Kerala Motor Vehicles Department - IT Equipment Portal
   Production Application Engine with Supabase Cloud, Menu Bar & Modular Menu Provision
   ========================================================================== */

// --- 1. SUPABASE BACKEND CONFIGURATION ---
const SUPABASE_URL = "https://mghdekancxfqtnfoyfkj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naGRla2FuY3hmcXRuZm95ZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY5MzksImV4cCI6MjEwMDQ0MjkzOX0.wb9ZdBEKQSgmbd-vUFsbnSh3iHFYmAPW4Ywgb8vf4V0";

let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized successfully.");
  } catch (err) {
    console.warn("Failed to initialize Supabase client, running in local mode:", err);
  }
}

// --- 2. PRESET MVD OFFICES DATABASE ---
const MVD_OFFICES = [
  "TCO Transport Commissionerate",
  "DTC CZ I, Thrissur",
  "DTC Office CZ II, Ernakulam",
  "DTC Office NZ, Kozhikkode",
  "DTC Office SZ, Thiruvananthapuram",
  "KL01 RTO, Thiruvananthapuram",
  "KL02 RTO, Kollam",
  "KL03 RTO, Pathanamthitta",
  "KL04 RTO, Alappuzha",
  "KL05 RTO, Kottayam",
  "KL06 RTO, Idukki",
  "KL07 RTO, Ernakulam",
  "KL08 RTO, Thrissur",
  "KL09 RTO, Palakkad",
  "KL10 RTO, Malappuram",
  "KL11 RTO, Kozhikode",
  "KL12 RTO, Wayanad",
  "KL13 RTO, Kannur",
  "KL14 RTO, Kasaragod",
  "KL15 RTO NS, Thiruvananthapuram",
  "KL16 RTO, Attingal",
  "KL17 RTO, Muvattupuzha",
  "KL18 RTO, Vadakara",
  "KL19 SRTO, Parassala",
  "KL20 SRTO, Neyyattinkara",
  "KL21 SRTO, Nedumangad",
  "KL22 SRTO, Kazhakuttam",
  "KL23 SRTO, Karunagapally",
  "KL24 SRTO, Kottarakkara",
  "KL25 SRTO, Punalur",
  "KL26 SRTO, Adoor",
  "KL27 SRTO, Thiruvalla",
  "KL28 SRTO, Mallappally",
  "KL29 SRTO, Kayamkulam",
  "KL30 SRTO, Chengannur",
  "KL31 SRTO, Mavelikkara",
  "KL32 SRTO, Cherthala",
  "KL33 SRTO, Changanacherry",
  "KL34 SRTO, Kanjirapally",
  "KL35 SRTO, Pala",
  "KL36 SRTO, Vaikom",
  "KL37 SRTO, Vandiperiyar",
  "KL38 SRTO, Thodupuzha",
  "KL39 SRTO, Tripunithura",
  "KL40 SRTO, Perumbavoor",
  "KL41 SRTO, Aluva",
  "KL42 SRTO, North Paravoor",
  "KL43 SRTO, Mattancherry",
  "KL44 SRTO, Kothamangalam",
  "KL45 SRTO, Irinjalakuda",
  "KL46 SRTO, Guruvayoor",
  "KL47 SRTO, Kodungallur",
  "KL48 SRTO, Wadakkanchery",
  "KL49 SRTO, Alathur",
  "KL50 SRTO, Mannarkkad",
  "KL51 SRTO, Ottappalam",
  "KL52 SRTO, Pattambi",
  "KL53 SRTO, Perinthalmanna",
  "KL54 SRTO, Ponnani",
  "KL55 SRTO, Tirur",
  "KL56 SRTO, Koyilandy",
  "KL57 SRTO, Koduvally",
  "KL58 SRTO, Thalassery",
  "KL59 SRTO, Taliparamba",
  "KL60 SRTO, Kanhangad",
  "KL61 SRTO, Kunnathoor",
  "KL62 SRTO, Ranni",
  "KL63 SRTO, Angamaly",
  "KL64 SRTO, Chalakudy",
  "KL65 SRTO, Thirurangadi",
  "KL66 SRTO, Kuttanad",
  "KL67 SRTO, Uzhavoor",
  "KL68 SRTO, Devikulam",
  "KL69 SRTO, Udumpanchola",
  "KL70 SRTO, Chittur",
  "KL71 SRTO, Nilambur",
  "KL72 SRTO, Mananthavady",
  "KL73 SRTO, SulthanBathery",
  "KL74 SRTO, Kattakada",
  "KL75 SRTO, Thriprayar",
  "KL76 SRTO, Nanmanda",
  "KL77 SRTO, Perambra",
  "KL78 SRTO, Iritty",
  "KL79 SRTO, Vellarikundu",
  "KL80 SRTO, Pathanapuram",
  "KL81 SRTO, Varkala",
  "KL82 SRTO, Chadayamangalam",
  "KL83 SRTO, Konni",
  "KL84 SRTO, Kondotty",
  "KL85 SRTO, Ramanattukara(Feroke)",
  "KL86 SRTO, Payyanur",
  "KLE01 RTO Enforcement, Thiruvananthapuram",
  "KLE02 RTO Enforcement, Kollam",
  "KLE03 RTO Enforcement, Pathanamthitta",
  "KLE04 RTO Enforcement, Alappuzha",
  "KLE05 RTO Enforcement, Kottayam",
  "KLE06 RTO Enforcement, Idukki",
  "KLE07 RTO Enforcement, Ernakulam",
  "KLE08 RTO Enforcement, Thrissur",
  "KLE09 RTO Enforcement, Palakkad",
  "KLE10 RTO Enforcement, Malappuram",
  "KLE11 RTO Enforcement, Kozhikode",
  "KLE12 RTO Enforcement, Wayanad",
  "KLE13 RTO Enforcement, Kannur",
  "KLE14 RTO Enforcement, Kasaragod",
  "301 Checkpost, Amaravila (In)",
  "302 Checkpost, Amaravila (Out)",
  "303 Checkpost, Poovar",
  "304 Checkpost, Aryankavu",
  "305 Checkpost, Kumily",
  "306 Check Post, Walayar (IN)",
  "307 Check Post, Walayar (OUT)",
  "308 Check Post, Velamthavalam",
  "309 Check Post, Gopalapuram",
  "310 Check Post, Meenakshipuram",
  "311 Check Post, Nadupuni",
  "312 Check Post, Govindapuram",
  "313 Check Post, Vazhikadavu",
  "314 Check Post, Iritty",
  "315 Check Post, Kattikulam",
  "316 Check Post, SulthanBatheri (Muthanga)",
  "317 Check Post, Neeleswaram",
  "318 Check Post, Manjeswaram (Thalappady)",
  "319 Check Post, Perla (Adkasthala)"
];

// --- 3. SAMPLE SEED FALLBACK DATA ---
const SEED_DATA = {
  "TCO Transport Commissionerate": {
    officeName: "TCO Transport Commissionerate",
    availableNetwork: "KSWAN",
    otherNetworkDetails: "",
    networkSpeed: "1 Gbps Leased Line",
    operatingSystem: "Ubuntu 22.04 LTS & Windows 11 Pro",
    monitorsWorking: 42,
    monitorsNotWorking: 3,
    cpuWorking: 40,
    cpuNotWorking: 4,
    laptopsWorking: 18,
    laptopsNotWorking: 1,
    aioWorking: 12,
    aioNotWorking: 0,
    printers: {
      dotMatrix: { working: 8, notWorking: 2, multipurpose: false },
      inkjet: { working: 3, notWorking: 1, multipurpose: true },
      laser: { working: 24, notWorking: 2, multipurpose: true },
      xerox: { working: 4, notWorking: 0, multipurpose: true },
      others: { working: 2, notWorking: 0, multipurpose: false }
    },
    upsWorking: 8,
    upsNotWorking: 1,
    batteriesInUse: 64,
    batteriesNotInUse: 8,
    ageUnder3: 25,
    age3To5: 30,
    age5To8: 12,
    ageAbove8: 3,
    desktopNotWorkingSummary: 4,
    remarks: "Central datacenter hardware operating normally. 3 old CPUs scheduled for write-off.",
    lastUpdated: "2026-07-24 10:30 AM"
  },
  "KL01 RTO, Thiruvananthapuram": {
    officeName: "KL01 RTO, Thiruvananthapuram",
    availableNetwork: "KFONE",
    otherNetworkDetails: "",
    networkSpeed: "500 Mbps",
    operatingSystem: "Ubuntu 20.04 LTS",
    monitorsWorking: 28,
    monitorsNotWorking: 2,
    cpuWorking: 26,
    cpuNotWorking: 3,
    laptopsWorking: 6,
    laptopsNotWorking: 0,
    aioWorking: 4,
    aioNotWorking: 1,
    printers: {
      dotMatrix: { working: 12, notWorking: 1, multipurpose: false },
      inkjet: { working: 1, notWorking: 0, multipurpose: false },
      laser: { working: 10, notWorking: 2, multipurpose: true },
      xerox: { working: 2, notWorking: 0, multipurpose: true },
      others: { working: 1, notWorking: 0, multipurpose: false }
    },
    upsWorking: 4,
    upsNotWorking: 0,
    batteriesInUse: 32,
    batteriesNotInUse: 4,
    ageUnder3: 12,
    age3To5: 14,
    age5To8: 8,
    ageAbove8: 2,
    desktopNotWorkingSummary: 3,
    remarks: "Heavy counter usage. Additional dot matrix printers requested for RC printing.",
    lastUpdated: "2026-07-23 04:15 PM"
  }
};

// --- 4. DEFAULT PORTAL MODULES REGISTRY (FOR MENU BAR & EXPANSION) ---
const DEFAULT_PORTAL_MODULES = [
  {
    id: "it_equipment_list",
    title: "IT Equipment List",
    icon: "fa-desktop",
    description: "Core module for office-wise inventory of Monitors, CPUs, Laptops, Printers, UPS, Batteries, OS, and System Age.",
    visible: true
  }
];

// State Controller
let activeSession = 'public';
let publicSubView = 'entry';
let adminSubView = 'dashboard';
let activeModuleId = 'it_equipment_list';
let isAdminAuthenticated = false;

// Data Store in LocalStorage with fallbacks
let inventoryStore = JSON.parse(localStorage.getItem('mvd_it_inventory_store')) || SEED_DATA;
let appSettings = JSON.parse(localStorage.getItem('mvd_it_app_settings')) || {
  publicVisible: true,
  adminPasscode: "admin123"
};

// Filter out old deleted modules from localStorage if present
let storedModules = JSON.parse(localStorage.getItem('mvd_it_portal_modules')) || DEFAULT_PORTAL_MODULES;
let portalModules = storedModules.filter(m => m.id === 'it_equipment_list' || !['network_infrastructure', 'software_licensing', 'hardware_ewaste'].includes(m.id));
if (portalModules.length === 0) portalModules = DEFAULT_PORTAL_MODULES;
localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));

let chartHealthInstance = null;
let chartAgeInstance = null;

// --- 5. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  populateOfficeDropdown();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Render initial menu bar & sync UI
  renderPortalMenuBar();
  syncPublicVisibilityUI();

  // Load from Supabase on launch
  syncWithSupabaseBackend();

  // Initial UI Render
  renderPublicDataTable();
  renderAdminDataTable();
  renderMenuManagerUI();
});

// --- 6. LEFT SIDEBAR NAVIGATION MENU BAR RENDERER & SWITCHER ---
function renderPortalMenuBar() {
  const container = document.getElementById('dynamicPortalMenuBar');
  if (!container) return;

  const visibleModules = portalModules.filter(m => m.visible || activeSession === 'admin');

  if (visibleModules.length === 0) {
    container.innerHTML = `<span style="color: #cbd5e1; font-size: 0.85rem; padding: 10px 12px;"><i class="fa-solid fa-lock"></i> All module menus hidden.</span>`;
    return;
  }

  container.innerHTML = visibleModules.map(mod => {
    const isActive = (mod.id === activeModuleId);
    return `
      <button class="sidebar-item ${isActive ? 'active' : ''}" onclick="selectModuleMenu('${mod.id}')">
        <i class="fa-solid ${mod.icon || 'fa-cube'}"></i>
        <span>${escapeHtml(mod.title)}</span>
        ${(!mod.visible && activeSession === 'admin') ? '<small style="color: #fca5a5; margin-left: 4px;">(Hidden)</small>' : ''}
      </button>
    `;
  }).join('');
}

function selectModuleMenu(moduleId) {
  activeModuleId = moduleId;
  renderPortalMenuBar();

  const publicCont = document.getElementById('publicContainer');
  const genericCont = document.getElementById('genericModuleContainer');
  const selectedMod = portalModules.find(m => m.id === moduleId);

  if (activeSession === 'admin') {
    showToast(`Navigated to module "${selectedMod ? selectedMod.title : moduleId}"`, 'info');
    return;
  }

  if (moduleId === 'it_equipment_list') {
    if (genericCont) genericCont.style.display = 'none';
    const isVisible = appSettings.publicVisible && (selectedMod ? selectedMod.visible : true);

    if (isVisible) {
      if (publicCont) publicCont.style.display = 'block';
    } else {
      if (publicCont) publicCont.style.display = 'none';
    }
  } else {
    if (publicCont) publicCont.style.display = 'none';

    if (!selectedMod || !selectedMod.visible) {
      if (genericCont) genericCont.style.display = 'none';
    } else {
      renderGenericModuleView(selectedMod);
      if (genericCont) genericCont.style.display = 'block';
    }
  }
}

function renderGenericModuleView(mod) {
  const container = document.getElementById('genericModuleContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="card-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fa-solid ${mod.icon || 'fa-cube'}"></i> ${escapeHtml(mod.title)}
        </h2>
        <span class="badge badge-working">ACTIVE DEPARTMENTAL MODULE</span>
      </div>

      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5;">
        ${escapeHtml(mod.description)}
      </p>

      <div style="background: #f8fafc; border: 1.5px dashed var(--border-color); border-radius: var(--radius-md); padding: 40px; text-align: center;">
        <i class="fa-solid ${mod.icon || 'fa-cube'} fa-3x" style="color: var(--primary-500); margin-bottom: 16px; opacity: 0.8;"></i>
        <h3 style="color: var(--primary-900); font-size: 1.2rem; margin-bottom: 8px;">${escapeHtml(mod.title)} Information Portal</h3>
        <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 20px auto; font-size: 0.88rem;">
          Data collection and analytics for this module are active and synced with the MVD Datacenter in Thiruvananthapuram.
        </p>
        <button class="btn btn-outline" onclick="selectModuleMenu('it_equipment_list')">
          <i class="fa-solid fa-arrow-left"></i> Return to IT Equipment List
        </button>
      </div>
    </div>
  `;
}

// --- 7. SUPABASE SYNC ENGINE ---
async function syncWithSupabaseBackend() {
  const badge = document.getElementById('backendStatusBadge');
  if (!supabaseClient) {
    if (badge) {
      badge.className = 'badge badge-warning';
      badge.innerHTML = `<i class="fa-solid fa-hard-drive"></i> Local Storage Mode`;
    }
    return;
  }

  try {
    if (badge) {
      badge.className = 'badge badge-info';
      badge.innerHTML = `<i class="fa-solid fa-rotate fa-spin"></i> Syncing Supabase...`;
    }

    const { data: equipData, error: equipErr } = await supabaseClient
      .from('mvd_it_equipment')
      .select('*');

    if (equipErr) throw equipErr;

    if (equipData && equipData.length > 0) {
      equipData.forEach(row => {
        inventoryStore[row.office_name] = {
          officeName: row.office_name,
          availableNetwork: row.network_provider || '',
          otherNetworkDetails: row.network_provider_other || '',
          networkSpeed: row.network_speed || '',
          operatingSystem: row.os_with_version || '',
          monitorsWorking: row.monitors_working ?? 0,
          monitorsNotWorking: row.monitors_not_working ?? 0,
          cpuWorking: row.cpu_working ?? 0,
          cpuNotWorking: row.cpu_not_working ?? 0,
          laptopsWorking: row.laptops_working ?? 0,
          laptopsNotWorking: row.laptops_not_working ?? 0,
          aioWorking: row.aio_working ?? 0,
          aioNotWorking: row.aio_not_working ?? 0,
          printers: row.printers_data || {},
          upsWorking: row.ups_working ?? 0,
          upsNotWorking: row.ups_not_working ?? 0,
          batteriesInUse: row.batteries_in_use ?? 0,
          batteriesNotInUse: row.batteries_not_in_use ?? 0,
          ageUnder3: row.systems_under_3yrs ?? 0,
          age3To5: row.systems_3_to_5yrs ?? 0,
          age5To8: row.systems_5_to_8yrs ?? 0,
          ageAbove8: row.systems_above_8yrs ?? 0,
          desktopNotWorkingSummary: row.desktop_units_not_working ?? 0,
          remarks: row.remarks || '',
          lastUpdated: row.updated_at ? new Date(row.updated_at).toLocaleString('en-IN') : 'N/A'
        };
      });

      localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));
    }

    const { data: settingsData, error: settingsErr } = await supabaseClient
      .from('mvd_app_settings')
      .select('*')
      .eq('id', 'global_settings')
      .single();

    if (!settingsErr && settingsData) {
      appSettings.publicVisible = settingsData.public_visible;
      appSettings.adminPasscode = settingsData.admin_passcode || 'admin123';
      
      if (settingsData.menu_visibility && Array.isArray(settingsData.menu_visibility)) {
        portalModules = settingsData.menu_visibility;
        localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));
      }

      localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
      syncPublicVisibilityUI();
    }

    if (badge) {
      badge.className = 'badge badge-working';
      badge.innerHTML = `<i class="fa-solid fa-cloud-check"></i> Supabase Live Backend`;
    }

    renderPortalMenuBar();
    renderPublicDataTable();
    renderAdminDataTable();
    renderMenuManagerUI();
    if (activeSession === 'admin') renderAdminDashboard();

  } catch (err) {
    console.error("Supabase sync error:", err);
    if (badge) {
      badge.className = 'badge badge-warning';
      badge.innerHTML = `<i class="fa-solid fa-cloud-slash"></i> Offline / Fallback Mode`;
    }
  }
}

async function saveRecordToSupabase(record) {
  if (!supabaseClient) return;

  try {
    const dbPayload = {
      id: record.officeName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      office_name: record.officeName,
      network_provider: record.availableNetwork,
      network_provider_other: record.otherNetworkDetails,
      network_speed: record.networkSpeed,
      os_with_version: record.operatingSystem,
      monitors_working: record.monitorsWorking,
      monitors_not_working: record.monitorsNotWorking,
      cpu_working: record.cpuWorking,
      cpu_not_working: record.cpuNotWorking,
      laptops_working: record.laptopsWorking,
      laptops_not_working: record.laptopsNotWorking,
      aio_working: record.aioWorking,
      aio_not_working: record.aioNotWorking,
      printers_data: record.printers,
      dot_matrix_working: record.printers?.dotMatrix?.working || 0,
      ups_working: record.upsWorking,
      ups_not_working: record.upsNotWorking,
      batteries_in_use: record.batteriesInUse,
      batteries_not_in_use: record.batteriesNotInUse,
      systems_under_3yrs: record.ageUnder3,
      systems_3_to_5yrs: record.age3To5,
      systems_5_to_8yrs: record.age5To8,
      systems_above_8yrs: record.ageAbove8,
      desktop_units_not_working: record.desktopNotWorkingSummary,
      remarks: record.remarks,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
      .from('mvd_it_equipment')
      .upsert(dbPayload, { onConflict: 'office_name' });

    if (error) throw error;
  } catch (err) {
    console.error("Error saving record to Supabase:", err);
  }
}

async function deleteRecordFromSupabase(officeName) {
  if (!supabaseClient) return;

  try {
    const { error } = await supabaseClient
      .from('mvd_it_equipment')
      .delete()
      .eq('office_name', officeName);

    if (error) throw error;
  } catch (err) {
    console.error("Error deleting from Supabase:", err);
  }
}

async function saveSettingsToSupabase(isPublic) {
  if (!supabaseClient) return;

  try {
    await supabaseClient
      .from('mvd_app_settings')
      .upsert({
        id: 'global_settings',
        public_visible: isPublic,
        admin_passcode: appSettings.adminPasscode,
        menu_visibility: portalModules,
        updated_at: new Date().toISOString()
      });
  } catch (err) {
    console.error("Error saving settings to Supabase:", err);
  }
}

// --- 8. CLOCK & DROPDOWN HELPERS ---
function updateLiveClock() {
  const clockEl = document.getElementById('liveClockDisplay');
  if (clockEl) {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-IN', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    }) + ' | ' + now.toLocaleTimeString('en-IN');
    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatted}`;
  }
}

function populateOfficeDropdown() {
  const select = document.getElementById('officeSelect');
  if (!select) return;

  select.innerHTML = '<option value="">-- Choose MVD Office --</option>';

  const groups = {
    "Headquarters & DTCs": MVD_OFFICES.filter(o => o.startsWith("TC") || o.startsWith("DTC")),
    "Regional Transport Offices (RTO)": MVD_OFFICES.filter(o => o.includes("RTO") && !o.includes("SRTO") && !o.includes("Enforcement")),
    "Sub-Regional Transport Offices (SRTO)": MVD_OFFICES.filter(o => o.includes("SRTO")),
    "Enforcement RTOs": MVD_OFFICES.filter(o => o.includes("Enforcement")),
    "Border Checkposts": MVD_OFFICES.filter(o => o.includes("Check"))
  };

  for (const [groupName, officeList] of Object.entries(groups)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = groupName;
    officeList.forEach(off => {
      const opt = document.createElement('option');
      opt.value = off;
      opt.textContent = off;
      optgroup.appendChild(opt);
    });
    select.appendChild(optgroup);
  }
}

// --- 9. AUTO-REFLECTION ENGINE ---
function handleOfficeSelectChange(officeName) {
  const alertBox = document.getElementById('reflectionAlert');
  const alertText = document.getElementById('reflectionAlertText');

  if (!officeName) {
    if (alertBox) alertBox.style.display = 'none';
    resetPublicFormFieldsOnly();
    return;
  }

  const existingData = inventoryStore[officeName];
  if (existingData) {
    populateFormWithData(existingData);

    if (alertBox && alertText) {
      alertText.textContent = `Existing data recorded for "${officeName}". Values auto-filled below!`;
      alertBox.style.display = 'flex';
    }
    showToast(`Loaded saved data for ${officeName}`, 'info');
  } else {
    resetPublicFormFieldsOnly();
    if (alertBox) alertBox.style.display = 'none';
    showToast(`Fresh entry for ${officeName}`, 'info');
  }
}

function populateFormWithData(data) {
  document.getElementById('officeSelect').value = data.officeName || '';
  document.getElementById('availableNetworkSelect').value = data.availableNetwork || '';
  handleNetworkChange(data.availableNetwork || '');

  document.getElementById('otherNetworkInput').value = data.otherNetworkDetails || '';
  document.getElementById('networkSpeedInput').value = data.networkSpeed || '';
  document.getElementById('operatingSystemInput').value = data.operatingSystem || '';

  document.getElementById('monitorsWorking').value = data.monitorsWorking ?? 0;
  document.getElementById('monitorsNotWorking').value = data.monitorsNotWorking ?? 0;
  document.getElementById('cpuWorking').value = data.cpuWorking ?? 0;
  document.getElementById('cpuNotWorking').value = data.cpuNotWorking ?? 0;
  document.getElementById('laptopsWorking').value = data.laptopsWorking ?? 0;
  document.getElementById('laptopsNotWorking').value = data.laptopsNotWorking ?? 0;
  document.getElementById('aioWorking').value = data.aioWorking ?? 0;
  document.getElementById('aioNotWorking').value = data.aioNotWorking ?? 0;

  const p = data.printers || {};
  document.getElementById('printerDotMatrixWorking').value = p.dotMatrix?.working ?? 0;
  document.getElementById('printerDotMatrixNotWorking').value = p.dotMatrix?.notWorking ?? 0;
  document.getElementById('printerDotMatrixMulti').checked = !!p.dotMatrix?.multipurpose;

  document.getElementById('printerInkjetWorking').value = p.inkjet?.working ?? 0;
  document.getElementById('printerInkjetNotWorking').value = p.inkjet?.notWorking ?? 0;
  document.getElementById('printerInkjetMulti').checked = !!p.inkjet?.multipurpose;

  document.getElementById('printerLaserWorking').value = p.laser?.working ?? 0;
  document.getElementById('printerLaserNotWorking').value = p.laser?.notWorking ?? 0;
  document.getElementById('printerLaserMulti').checked = !!p.laser?.multipurpose;

  document.getElementById('printerXeroxWorking').value = p.xerox?.working ?? 0;
  document.getElementById('printerXeroxNotWorking').value = p.xerox?.notWorking ?? 0;
  document.getElementById('printerXeroxMulti').checked = !!p.xerox?.multipurpose;

  document.getElementById('printerOthersWorking').value = p.others?.working ?? 0;
  document.getElementById('printerOthersNotWorking').value = p.others?.notWorking ?? 0;
  document.getElementById('printerOthersMulti').checked = !!p.others?.multipurpose;

  document.getElementById('upsWorking').value = data.upsWorking ?? 0;
  document.getElementById('upsNotWorking').value = data.upsNotWorking ?? 0;
  document.getElementById('batteriesInUse').value = data.batteriesInUse ?? 0;
  document.getElementById('batteriesNotInUse').value = data.batteriesNotInUse ?? 0;

  document.getElementById('ageUnder3').value = data.ageUnder3 ?? 0;
  document.getElementById('age3To5').value = data.age3To5 ?? 0;
  document.getElementById('age5To8').value = data.age5To8 ?? 0;
  document.getElementById('ageAbove8').value = data.ageAbove8 ?? 0;

  document.getElementById('desktopNotWorkingSummary').value = data.desktopNotWorkingSummary ?? (data.cpuNotWorking ?? 0);
  document.getElementById('remarksInput').value = data.remarks || '';
}

function resetPublicFormFieldsOnly() {
  document.getElementById('availableNetworkSelect').value = '';
  handleNetworkChange('');
  document.getElementById('otherNetworkInput').value = '';
  document.getElementById('networkSpeedInput').value = '';
  document.getElementById('operatingSystemInput').value = '';

  const numIds = [
    'monitorsWorking', 'monitorsNotWorking', 'cpuWorking', 'cpuNotWorking',
    'laptopsWorking', 'laptopsNotWorking', 'aioWorking', 'aioNotWorking',
    'printerDotMatrixWorking', 'printerDotMatrixNotWorking',
    'printerInkjetWorking', 'printerInkjetNotWorking',
    'printerLaserWorking', 'printerLaserNotWorking',
    'printerXeroxWorking', 'printerXeroxNotWorking',
    'printerOthersWorking', 'printerOthersNotWorking',
    'upsWorking', 'upsNotWorking', 'batteriesInUse', 'batteriesNotInUse',
    'ageUnder3', 'age3To5', 'age5To8', 'ageAbove8', 'desktopNotWorkingSummary'
  ];

  numIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });

  const checkIds = ['printerDotMatrixMulti', 'printerInkjetMulti', 'printerLaserMulti', 'printerXeroxMulti', 'printerOthersMulti'];
  checkIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = (id === 'printerXeroxMulti');
  });

  document.getElementById('remarksInput').value = '';
}

function resetPublicForm() {
  document.getElementById('officeSelect').value = '';
  handleOfficeSelectChange('');
  showToast('Form reset', 'info');
}

function handleNetworkChange(value) {
  const otherGroup = document.getElementById('otherNetworkGroup');
  if (otherGroup) {
    otherGroup.style.display = (value === 'Others') ? 'block' : 'none';
  }
}

function calculateNonWorkingDesktops() {
  const cpuNotWorking = parseInt(document.getElementById('cpuNotWorking').value) || 0;
  document.getElementById('desktopNotWorkingSummary').value = cpuNotWorking;
}

// --- 10. FORM SUBMISSION & BACKEND SAVING ---
async function handleFormSubmit(e) {
  e.preventDefault();

  const officeName = document.getElementById('officeSelect').value;
  if (!officeName) {
    showToast('Please select an Office Name', 'error');
    return;
  }

  const networkVal = document.getElementById('availableNetworkSelect').value;
  if (networkVal === 'Others' && !document.getElementById('otherNetworkInput').value.trim()) {
    showToast('Please specify details for Other Network', 'warning');
    return;
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const record = {
    officeName,
    availableNetwork: networkVal,
    otherNetworkDetails: document.getElementById('otherNetworkInput').value.trim(),
    networkSpeed: document.getElementById('networkSpeedInput').value.trim(),
    operatingSystem: document.getElementById('operatingSystemInput').value.trim(),

    monitorsWorking: parseInt(document.getElementById('monitorsWorking').value) || 0,
    monitorsNotWorking: parseInt(document.getElementById('monitorsNotWorking').value) || 0,
    cpuWorking: parseInt(document.getElementById('cpuWorking').value) || 0,
    cpuNotWorking: parseInt(document.getElementById('cpuNotWorking').value) || 0,
    laptopsWorking: parseInt(document.getElementById('laptopsWorking').value) || 0,
    laptopsNotWorking: parseInt(document.getElementById('laptopsNotWorking').value) || 0,
    aioWorking: parseInt(document.getElementById('aioWorking').value) || 0,
    aioNotWorking: parseInt(document.getElementById('aioNotWorking').value) || 0,

    printers: {
      dotMatrix: {
        working: parseInt(document.getElementById('printerDotMatrixWorking').value) || 0,
        notWorking: parseInt(document.getElementById('printerDotMatrixNotWorking').value) || 0,
        multipurpose: document.getElementById('printerDotMatrixMulti').checked
      },
      inkjet: {
        working: parseInt(document.getElementById('printerInkjetWorking').value) || 0,
        notWorking: parseInt(document.getElementById('printerInkjetNotWorking').value) || 0,
        multipurpose: document.getElementById('printerInkjetMulti').checked
      },
      laser: {
        working: parseInt(document.getElementById('printerLaserWorking').value) || 0,
        notWorking: parseInt(document.getElementById('printerLaserNotWorking').value) || 0,
        multipurpose: document.getElementById('printerLaserMulti').checked
      },
      xerox: {
        working: parseInt(document.getElementById('printerXeroxWorking').value) || 0,
        notWorking: parseInt(document.getElementById('printerXeroxNotWorking').value) || 0,
        multipurpose: document.getElementById('printerXeroxMulti').checked
      },
      others: {
        working: parseInt(document.getElementById('printerOthersWorking').value) || 0,
        notWorking: parseInt(document.getElementById('printerOthersNotWorking').value) || 0,
        multipurpose: document.getElementById('printerOthersMulti').checked
      }
    },

    upsWorking: parseInt(document.getElementById('upsWorking').value) || 0,
    upsNotWorking: parseInt(document.getElementById('upsNotWorking').value) || 0,
    batteriesInUse: parseInt(document.getElementById('batteriesInUse').value) || 0,
    batteriesNotInUse: parseInt(document.getElementById('batteriesNotInUse').value) || 0,

    ageUnder3: parseInt(document.getElementById('ageUnder3').value) || 0,
    age3To5: parseInt(document.getElementById('age3To5').value) || 0,
    age5To8: parseInt(document.getElementById('age5To8').value) || 0,
    ageAbove8: parseInt(document.getElementById('ageAbove8').value) || 0,

    desktopNotWorkingSummary: parseInt(document.getElementById('desktopNotWorkingSummary').value) || 0,
    remarks: document.getElementById('remarksInput').value.trim(),
    lastUpdated: formattedDate
  };

  inventoryStore[officeName] = record;
  localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));

  await saveRecordToSupabase(record);

  showToast(`IT Equipment details for "${officeName}" saved successfully!`, 'success');

  renderPublicDataTable();
  renderAdminDataTable();
  if (activeSession === 'admin') renderAdminDashboard();

  if (activeSession === 'public') {
    switchPublicTab('view');
  }
}

// --- 11. ADMIN AUTHENTICATION & LOGOUT ENGINE ---
function triggerAdminLogin() {
  if (isAdminAuthenticated) {
    switchSession('admin');
  } else {
    document.getElementById('adminModal').style.display = 'flex';
    document.getElementById('adminPasscodeInput').value = '';
    document.getElementById('adminPasscodeInput').focus();
  }
}

function closeAdminModal() {
  document.getElementById('adminModal').style.display = 'none';
}

function verifyAdminPasscode(e) {
  e.preventDefault();
  const entered = document.getElementById('adminPasscodeInput').value;
  if (entered === appSettings.adminPasscode) {
    isAdminAuthenticated = true;
    closeAdminModal();
    showToast('Admin access granted', 'success');

    document.getElementById('adminLogoutHeaderBtn').style.display = 'inline-flex';

    switchSession('admin');
  } else {
    showToast('Invalid passcode. Default is admin123', 'error');
  }
}

function logoutAdmin() {
  isAdminAuthenticated = false;

  const logoutBtn = document.getElementById('adminLogoutHeaderBtn');
  if (logoutBtn) logoutBtn.style.display = 'none';

  switchSession('public');

  showToast('Admin logged out successfully.', 'info');
}

// --- 12. MODULAR MENU & MODULE MANAGER ENGINE ---
function renderMenuManagerUI() {
  const container = document.getElementById('menuManagerContainer');
  if (!container) return;

  container.innerHTML = portalModules.map(mod => `
    <div style="background: #ffffff; border-radius: var(--radius-md); border: 1.5px solid var(--border-color); padding: 20px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--primary-100); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="fa-solid ${mod.icon || 'fa-cube'}"></i>
            </div>
            <div>
              <h4 style="font-size: 1rem; color: var(--primary-900); font-weight: 700;">${escapeHtml(mod.title)}</h4>
              <span class="badge ${mod.visible ? 'badge-working' : 'badge-danger'}">
                ${mod.visible ? 'VISIBLE TO PUBLIC' : 'HIDDEN FROM PUBLIC'}
              </span>
            </div>
          </div>
          
          <label class="switch">
            <input type="checkbox" ${mod.visible ? 'checked' : ''} onchange="toggleModuleVisibility('${mod.id}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${escapeHtml(mod.description)}</p>
      </div>

      <div style="margin-top: 16px; pt: 12px; border-top: 1px dashed var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <small style="color: var(--text-light);">Module Code: <code>${mod.id}</code></small>
        ${mod.id !== 'it_equipment_list' ? `<button class="btn btn-outline btn-sm" onclick="removeModule('${mod.id}')" style="color: #b91c1c; border-color: #fca5a5;"><i class="fa-solid fa-trash"></i> Remove</button>` : `<small style="color: #059669; font-weight: 700;">Core Module</small>`}
      </div>
    </div>
  `).join('');
}

async function toggleModuleVisibility(moduleId, isVisible) {
  const mod = portalModules.find(m => m.id === moduleId);
  if (mod) {
    mod.visible = isVisible;
    localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));

    if (moduleId === 'it_equipment_list') {
      appSettings.publicVisible = isVisible;
      localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
    }

    renderPortalMenuBar();
    renderMenuManagerUI();
    syncPublicVisibilityUI();

    await saveSettingsToSupabase(appSettings.publicVisible);

    showToast(`Menu "${mod.title}" is now ${isVisible ? 'VISIBLE' : 'HIDDEN'} on Public Portal.`, isVisible ? 'success' : 'warning');
  }
}

function openAddMenuModal() {
  document.getElementById('addMenuModal').style.display = 'flex';
  document.getElementById('newMenuTitleInput').value = '';
  document.getElementById('newMenuDescInput').value = '';
  document.getElementById('newMenuTitleInput').focus();
}

function closeAddMenuModal() {
  document.getElementById('addMenuModal').style.display = 'none';
}

async function handleAddMenuSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('newMenuTitleInput').value.trim();
  const icon = document.getElementById('newMenuIconInput').value.trim() || 'fa-cube';
  const description = document.getElementById('newMenuDescInput').value.trim() || 'Custom departmental module menu.';

  if (!title) return;

  const id = title.toLowerCase().replace(/[^a-z0-9]/g, '_');

  if (portalModules.some(m => m.id === id)) {
    showToast('A module with a similar title already exists.', 'warning');
    return;
  }

  const newModule = {
    id,
    title,
    icon: icon.startsWith('fa-') ? icon : `fa-${icon}`,
    description,
    visible: true
  };

  portalModules.push(newModule);
  localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));

  closeAddMenuModal();
  renderPortalMenuBar();
  renderMenuManagerUI();
  syncPublicVisibilityUI();

  await saveSettingsToSupabase(appSettings.publicVisible);

  showToast(`Future Menu Module "${title}" added successfully!`, 'success');
}

async function removeModule(moduleId) {
  if (confirm(`Remove custom module menu "${moduleId}"?`)) {
    portalModules = portalModules.filter(m => m.id !== moduleId);
    localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));
    renderPortalMenuBar();
    renderMenuManagerUI();
    syncPublicVisibilityUI();
    await saveSettingsToSupabase(appSettings.publicVisible);
    showToast(`Removed module ${moduleId}`, 'info');
  }
}

// --- 13. PUBLIC DATA TABLE RENDERER ---
function renderPublicDataTable() {
  const tbody = document.getElementById('publicTableBody');
  if (!tbody) return;

  const entries = Object.values(inventoryStore);
  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 30px;">No IT Equipment entries recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(item => {
    const netLabel = item.availableNetwork === 'Others' ? `Other (${item.otherNetworkDetails})` : item.availableNetwork;
    const dotWorking = item.printers?.dotMatrix?.working ?? 0;

    return `
      <tr>
        <td><strong>${escapeHtml(item.officeName)}</strong></td>
        <td><span class="badge badge-info"><i class="fa-solid fa-network-wired"></i> ${escapeHtml(netLabel)}</span></td>
        <td>${escapeHtml(item.networkSpeed || 'N/A')}</td>
        <td>
          <span class="badge badge-working">${item.monitorsWorking} W</span> / 
          <span class="badge badge-danger">${item.monitorsNotWorking} NW</span>
        </td>
        <td>
          <span class="badge badge-working">${item.cpuWorking} W</span> / 
          <span class="badge badge-danger">${item.cpuNotWorking} NW</span>
        </td>
        <td>
          <span class="badge badge-working">${item.laptopsWorking} W</span> / 
          <span class="badge badge-danger">${item.laptopsNotWorking} NW</span>
        </td>
        <td>
          <span class="badge badge-working">${item.aioWorking} W</span> / 
          <span class="badge badge-danger">${item.aioNotWorking} NW</span>
        </td>
        <td><strong style="color: #047857;">${dotWorking}</strong></td>
        <td>
          <span class="badge badge-working">${item.upsWorking} W</span> / 
          <span class="badge badge-danger">${item.upsNotWorking} NW</span>
        </td>
        <td>
          <span class="badge badge-working">${item.batteriesInUse} Use</span> / 
          <span class="badge badge-warning">${item.batteriesNotInUse} Unused</span>
        </td>
        <td><small>${escapeHtml(item.lastUpdated || 'N/A')}</small></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="viewOfficeDetail('${escapeHtml(item.officeName)}')">
            <i class="fa-solid fa-eye"></i> Details
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterPublicTable() {
  const query = document.getElementById('publicSearchInput').value.toLowerCase();
  const category = document.getElementById('publicCategoryFilter').value;
  const rows = document.querySelectorAll('#publicTableBody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesSearch = text.includes(query);

    let matchesCategory = true;
    if (category === 'RTO') matchesCategory = text.includes('rto') && !text.includes('srto') && !text.includes('enforcement');
    else if (category === 'SRTO') matchesCategory = text.includes('srto');
    else if (category === 'Enforcement') matchesCategory = text.includes('enforcement');
    else if (category === 'Checkpost') matchesCategory = text.includes('check');
    else if (category === 'TC') matchesCategory = text.includes('tc') || text.includes('commissionerate') || text.includes('dtc');

    row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
  });
}

// --- 14. ADMIN PORTAL & DASHBOARD RENDERER ---
function renderAdminDashboard() {
  const entries = Object.values(inventoryStore);

  const totalOffices = entries.length;
  let totalSystems = 0;
  let nonWorkingHardware = 0;
  let govNetworkCount = 0;

  let totalWorkingHW = 0;
  let totalNotWorkingHW = 0;

  let totalUnder3 = 0, total3To5 = 0, total5To8 = 0, totalAbove8 = 0;

  const networkCounts = { KSWAN: 0, KFONE: 0, BSNL: 0, JIO: 0, "Kerala Vision": 0, Asianet: 0, Others: 0 };

  entries.forEach(e => {
    const sys = (e.monitorsWorking + e.monitorsNotWorking + e.cpuWorking + e.cpuNotWorking + e.laptopsWorking + e.laptopsNotWorking + e.aioWorking + e.aioNotWorking);
    totalSystems += sys;

    const nw = (e.monitorsNotWorking + e.cpuNotWorking + e.laptopsNotWorking + e.aioNotWorking + e.upsNotWorking);
    nonWorkingHardware += nw;

    totalWorkingHW += (e.monitorsWorking + e.cpuWorking + e.laptopsWorking + e.aioWorking);
    totalNotWorkingHW += (e.monitorsNotWorking + e.cpuNotWorking + e.laptopsNotWorking + e.aioNotWorking);

    if (e.availableNetwork === 'KSWAN' || e.availableNetwork === 'KFONE') {
      govNetworkCount++;
    }

    if (networkCounts[e.availableNetwork] !== undefined) {
      networkCounts[e.availableNetwork]++;
    } else {
      networkCounts.Others++;
    }

    totalUnder3 += (e.ageUnder3 || 0);
    total3To5 += (e.age3To5 || 0);
    total5To8 += (e.age5To8 || 0);
    totalAbove8 += (e.ageAbove8 || 0);
  });

  document.getElementById('kpiOfficesReported').textContent = `${totalOffices} / ${MVD_OFFICES.length}`;
  document.getElementById('kpiTotalSystems').textContent = totalSystems;
  document.getElementById('kpiNonWorkingHardware').textContent = nonWorkingHardware;
  document.getElementById('kpiGovNetworkCount').textContent = govNetworkCount;

  const netGrid = document.getElementById('networkStatsGrid');
  if (netGrid) {
    netGrid.innerHTML = Object.entries(networkCounts).map(([net, count]) => `
      <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">${net}</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-900);">${count} Offices</div>
      </div>
    `).join('');
  }

  const ctxHealth = document.getElementById('chartHardwareHealth')?.getContext('2d');
  if (ctxHealth) {
    if (chartHealthInstance) chartHealthInstance.destroy();
    chartHealthInstance = new Chart(ctxHealth, {
      type: 'doughnut',
      data: {
        labels: ['Working Systems', 'Defective / Non-Working Systems'],
        datasets: [{
          data: [totalWorkingHW || 1, totalNotWorkingHW || 0],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  const ctxAge = document.getElementById('chartAgeDistribution')?.getContext('2d');
  if (ctxAge) {
    if (chartAgeInstance) chartAgeInstance.destroy();
    chartAgeInstance = new Chart(ctxAge, {
      type: 'bar',
      data: {
        labels: ['< 3 Years', '3–5 Years', '5–8 Years', '> 8 Years (High Priority)'],
        datasets: [{
          label: 'Number of IT Systems',
          data: [totalUnder3, total3To5, total5To8, totalAbove8],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }
}

function renderAdminDataTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  const entries = Object.values(inventoryStore);
  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 30px;">No entries stored.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(item => {
    const netLabel = item.availableNetwork === 'Others' ? `Other (${item.otherNetworkDetails})` : item.availableNetwork;
    const dotWorking = item.printers?.dotMatrix?.working ?? 0;

    return `
      <tr>
        <td><strong>${escapeHtml(item.officeName)}</strong></td>
        <td><span class="badge badge-info">${escapeHtml(netLabel)}</span><br><small>${escapeHtml(item.networkSpeed || '')}</small></td>
        <td><small>${escapeHtml(item.operatingSystem || 'N/A')}</small></td>
        <td>${item.monitorsWorking} W / <span style="color:#b91c1c;">${item.monitorsNotWorking} NW</span></td>
        <td>${item.cpuWorking} W / <span style="color:#b91c1c;">${item.cpuNotWorking} NW</span></td>
        <td>${item.laptopsWorking} W / <span style="color:#b91c1c;">${item.laptopsNotWorking} NW</span></td>
        <td>${item.aioWorking} W / <span style="color:#b91c1c;">${item.aioNotWorking} NW</span></td>
        <td><strong style="color: #047857;">${dotWorking}</strong></td>
        <td>${item.upsWorking} W / <span style="color:#b91c1c;">${item.upsNotWorking} NW</span></td>
        <td>${item.batteriesInUse} / ${item.batteriesNotInUse}</td>
        <td><span class="badge ${item.ageAbove8 > 0 ? 'badge-danger' : 'badge-working'}">${item.ageAbove8 || 0}</span></td>
        <td><small>${escapeHtml(item.remarks ? item.remarks.substring(0, 30) + '...' : 'None')}</small></td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-outline btn-sm" onclick="editOfficeInAdmin('${escapeHtml(item.officeName)}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger btn-sm" onclick="deleteOfficeEntry('${escapeHtml(item.officeName)}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminTable() {
  const query = document.getElementById('adminSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#adminTableBody tr');

  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
}

function editOfficeInAdmin(officeName) {
  switchAdminSubView('entry');
  document.getElementById('officeSelect').value = officeName;
  handleOfficeSelectChange(officeName);
  showToast(`Editing ${officeName} in Admin Entry`, 'info');
}

async function deleteOfficeEntry(officeName) {
  if (confirm(`Are you sure you want to delete the IT equipment record for "${officeName}"?`)) {
    delete inventoryStore[officeName];
    localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));
    
    await deleteRecordFromSupabase(officeName);

    showToast(`Deleted entry for ${officeName}`, 'warning');
    renderPublicDataTable();
    renderAdminDataTable();
    if (activeSession === 'admin') renderAdminDashboard();
  }
}

// --- 15. SESSION & NAVIGATION CONTROLLER ---
function switchSession(sessionType) {
  activeSession = sessionType;

  const publicTabBtn = document.getElementById('tabPublicBtn');
  const adminTabBtn = document.getElementById('tabAdminBtn');
  const badge = document.getElementById('currentSessionBadge');

  const publicContainer = document.getElementById('publicContainer');
  const adminContainer = document.getElementById('adminContainer');

  renderPortalMenuBar();

  if (sessionType === 'public') {
    publicTabBtn.classList.add('active');
    adminTabBtn.classList.remove('active');

    badge.className = 'session-badge session-public';
    badge.innerHTML = `<i class="fa-solid fa-eye"></i> Public Session`;

    adminContainer.style.display = 'none';

    selectModuleMenu(activeModuleId);
  } else if (sessionType === 'admin') {
    adminTabBtn.classList.add('active');
    publicTabBtn.classList.remove('active');

    badge.className = 'session-badge session-admin';
    badge.innerHTML = `<i class="fa-solid fa-user-shield"></i> Admin Portal`;
    document.getElementById('genericModuleContainer').style.display = 'none';
    publicContainer.style.display = 'none';
    adminContainer.style.display = 'block';

    renderAdminDashboard();
    renderAdminDataTable();
    renderMenuManagerUI();
  }
}

function switchPublicTab(tab) {
  publicSubView = tab;
  const entryBtn = document.getElementById('btnPublicEntry');
  const viewBtn = document.getElementById('btnPublicView');
  const entrySec = document.getElementById('publicEntrySection');
  const viewSec = document.getElementById('publicViewSection');

  if (tab === 'entry') {
    entryBtn.className = 'btn btn-primary';
    viewBtn.className = 'btn btn-outline';
    entrySec.style.display = 'block';
    viewSec.style.display = 'none';
  } else {
    viewBtn.className = 'btn btn-primary';
    entryBtn.className = 'btn btn-outline';
    entrySec.style.display = 'none';
    viewSec.style.display = 'block';
    renderPublicDataTable();
  }
}

function switchAdminSubView(view) {
  adminSubView = view;

  const btnDash = document.getElementById('btnAdminNavDashboard');
  const btnEnt = document.getElementById('btnAdminNavEntry');
  const btnVw = document.getElementById('btnAdminNavView');
  const btnMn = document.getElementById('btnAdminNavMenus');

  const dashSec = document.getElementById('adminDashboardSubView');
  const entSec = document.getElementById('adminEntrySubView');
  const vwSec = document.getElementById('adminViewSubView');
  const mnSec = document.getElementById('adminMenusSubView');

  btnDash.style.background = (view === 'dashboard') ? 'var(--primary-600)' : 'transparent';
  btnEnt.style.background = (view === 'entry') ? 'var(--primary-600)' : 'transparent';
  btnVw.style.background = (view === 'view') ? 'var(--primary-600)' : 'transparent';
  if (btnMn) btnMn.style.background = (view === 'menus') ? 'var(--primary-600)' : 'transparent';

  dashSec.style.display = (view === 'dashboard') ? 'block' : 'none';
  entSec.style.display = (view === 'entry') ? 'block' : 'none';
  vwSec.style.display = (view === 'view') ? 'block' : 'none';
  if (mnSec) mnSec.style.display = (view === 'menus') ? 'block' : 'none';

  if (view === 'dashboard') renderAdminDashboard();
  if (view === 'view') renderAdminDataTable();
  if (view === 'menus') renderMenuManagerUI();
  if (view === 'entry') {
    const formSec = document.getElementById('publicEntrySection');
    document.getElementById('adminFormContainer').appendChild(formSec);
  } else {
    const formSec = document.getElementById('publicEntrySection');
    const pubCont = document.getElementById('publicContainer');
    if (formSec && pubCont && !pubCont.contains(formSec)) {
      pubCont.insertBefore(formSec, document.getElementById('publicViewSection'));
    }
  }
}

// --- 16. HIDE IT EQUIPMENT LIST PROVISION (GLOBAL TOGGLE) ---
async function togglePublicVisibility(isPublic) {
  appSettings.publicVisible = isPublic;
  
  const itMod = portalModules.find(m => m.id === 'it_equipment_list');
  if (itMod) itMod.visible = isPublic;

  localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
  localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));

  renderPortalMenuBar();
  syncPublicVisibilityUI();
  renderMenuManagerUI();
  await saveSettingsToSupabase(isPublic);

  if (isPublic) {
    showToast('Public View is now ENABLED for all users.', 'success');
  } else {
    showToast('Public View is now HIDDEN/RESTRICTED.', 'warning');
  }
}

function syncPublicVisibilityUI() {
  const toggle = document.getElementById('adminPublicVisibilityToggle');
  const label = document.getElementById('publicVisibilityLabel');

  const itMod = portalModules.find(m => m.id === 'it_equipment_list');
  const isVisible = appSettings.publicVisible && (itMod ? itMod.visible : true);

  if (toggle) toggle.checked = isVisible;
  if (label) {
    label.textContent = isVisible ? 'Status: PUBLIC CAN VIEW' : 'Status: HIDDEN FROM PUBLIC';
    label.style.color = isVisible ? '#a7f3d0' : '#fca5a5';
  }

  if (activeSession === 'public') {
    selectModuleMenu(activeModuleId);
  }
}

// --- 17. OFFICE DETAILS MODAL ---
function viewOfficeDetail(officeName) {
  const item = inventoryStore[officeName];
  if (!item) return;

  const modal = document.getElementById('officeDetailModal');
  const title = document.getElementById('modalOfficeTitle');
  const body = document.getElementById('modalOfficeBody');

  title.innerHTML = `<i class="fa-solid fa-building-circle-check"></i> ${escapeHtml(item.officeName)}`;

  const p = item.printers || {};

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="background: #f1f5f9; padding: 12px; border-radius: 8px;">
        <strong>Network & OS:</strong> ${escapeHtml(item.availableNetwork)} (${escapeHtml(item.networkSpeed || 'N/A')})<br>
        <strong>OS Version:</strong> ${escapeHtml(item.operatingSystem)}<br>
        <small style="color: var(--text-muted);">Last Updated: ${escapeHtml(item.lastUpdated || 'N/A')}</small>
      </div>

      <div>
        <h4 style="margin-bottom: 8px; color: var(--primary-900);"><i class="fa-solid fa-desktop"></i> Core Hardware Status</h4>
        <ul style="list-style: none; padding-left: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <li>Monitors: <strong>${item.monitorsWorking} Working</strong> / <span style="color:#b91c1c;">${item.monitorsNotWorking} NW</span></li>
          <li>CPUs: <strong>${item.cpuWorking} Working</strong> / <span style="color:#b91c1c;">${item.cpuNotWorking} NW</span></li>
          <li>Laptops: <strong>${item.laptopsWorking} Working</strong> / <span style="color:#b91c1c;">${item.laptopsNotWorking} NW</span></li>
          <li>AIO PCs: <strong>${item.aioWorking} Working</strong> / <span style="color:#b91c1c;">${item.aioNotWorking} NW</span></li>
        </ul>
      </div>

      <div>
        <h4 style="margin-bottom: 8px; color: var(--primary-900);"><i class="fa-solid fa-print"></i> Printer Breakdown</h4>
        <table class="printers-table">
          <thead>
            <tr><th>Type</th><th>Working</th><th>Not Working</th><th>Multipurpose</th></tr>
          </thead>
          <tbody>
            <tr><td>Dot Matrix</td><td>${p.dotMatrix?.working || 0}</td><td>${p.dotMatrix?.notWorking || 0}</td><td>${p.dotMatrix?.multipurpose ? 'Yes' : 'No'}</td></tr>
            <tr><td>Inkjet</td><td>${p.inkjet?.working || 0}</td><td>${p.inkjet?.notWorking || 0}</td><td>${p.inkjet?.multipurpose ? 'Yes' : 'No'}</td></tr>
            <tr><td>Laser</td><td>${p.laser?.working || 0}</td><td>${p.laser?.notWorking || 0}</td><td>${p.laser?.multipurpose ? 'Yes' : 'No'}</td></tr>
            <tr><td>Xerox</td><td>${p.xerox?.working || 0}</td><td>${p.xerox?.notWorking || 0}</td><td>${p.xerox?.multipurpose ? 'Yes' : 'No'}</td></tr>
            <tr><td>Others</td><td>${p.others?.working || 0}</td><td>${p.others?.notWorking || 0}</td><td>${p.others?.multipurpose ? 'Yes' : 'No'}</td></tr>
          </tbody>
        </table>
      </div>

      <div>
        <h4 style="margin-bottom: 8px; color: var(--primary-900);"><i class="fa-solid fa-car-battery"></i> UPS & Batteries</h4>
        <p>UPS: <strong>${item.upsWorking} Working</strong> / ${item.upsNotWorking} Not Working</p>
        <p>Batteries: <strong>${item.batteriesInUse} In Use</strong> / ${item.batteriesNotInUse} Unused</p>
      </div>

      <div>
        <h4 style="margin-bottom: 8px; color: var(--primary-900);"><i class="fa-solid fa-hourglass-half"></i> System Age Profile</h4>
        <p>&lt; 3 Yrs: ${item.ageUnder3 || 0} | 3–5 Yrs: ${item.age3To5 || 0} | 5–8 Yrs: ${item.age5To8 || 0} | <strong>&gt; 8 Yrs: ${item.ageAbove8 || 0}</strong></p>
      </div>

      <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 12px; border-radius: 8px; color: #991b1b;">
        <strong>Remarks & Specific Condition:</strong><br>
        ${escapeHtml(item.remarks || 'No specific remarks entered.')}
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeOfficeDetailModal() {
  document.getElementById('officeDetailModal').style.display = 'none';
}

// --- 18. CSV EXPORTER ---
function exportDataToCSV() {
  const entries = Object.values(inventoryStore);
  if (entries.length === 0) {
    showToast('No data available to export', 'warning');
    return;
  }

  const headers = [
    "Office Name", "Network", "Network Details", "Network Speed", "Operating System",
    "Monitors Working", "Monitors Not Working", "CPU Working", "CPU Not Working",
    "Laptops Working", "Laptops Not Working", "AIO Working", "AIO Not Working",
    "Dot Matrix Working", "Dot Matrix Not Working", "Dot Matrix Multi",
    "Inkjet Working", "Inkjet Not Working", "Inkjet Multi",
    "Laser Working", "Laser Not Working", "Laser Multi",
    "Xerox Working", "Xerox Not Working", "Xerox Multi",
    "Other Printers Working", "Other Printers Not Working", "Other Printers Multi",
    "UPS Working", "UPS Not Working", "Batteries In Use", "Batteries Not In Use",
    "Systems Under 3 Yrs", "Systems 3-5 Yrs", "Systems 5-8 Yrs", "Systems Above 8 Yrs",
    "Desktop Units Not Working", "Remarks", "Last Updated"
  ];

  const csvRows = [headers.join(',')];

  entries.forEach(e => {
    const p = e.printers || {};
    const row = [
      `"${(e.officeName || '').replace(/"/g, '""')}"`,
      `"${(e.availableNetwork || '').replace(/"/g, '""')}"`,
      `"${(e.otherNetworkDetails || '').replace(/"/g, '""')}"`,
      `"${(e.networkSpeed || '').replace(/"/g, '""')}"`,
      `"${(e.operatingSystem || '').replace(/"/g, '""')}"`,
      e.monitorsWorking || 0, e.monitorsNotWorking || 0,
      e.cpuWorking || 0, e.cpuNotWorking || 0,
      e.laptopsWorking || 0, e.laptopsNotWorking || 0,
      e.aioWorking || 0, e.aioNotWorking || 0,
      p.dotMatrix?.working || 0, p.dotMatrix?.notWorking || 0, p.dotMatrix?.multipurpose ? 'Yes' : 'No',
      p.inkjet?.working || 0, p.inkjet?.notWorking || 0, p.inkjet?.multipurpose ? 'Yes' : 'No',
      p.laser?.working || 0, p.laser?.notWorking || 0, p.laser?.multipurpose ? 'Yes' : 'No',
      p.xerox?.working || 0, p.xerox?.notWorking || 0, p.xerox?.multipurpose ? 'Yes' : 'No',
      p.others?.working || 0, p.others?.notWorking || 0, p.others?.multipurpose ? 'Yes' : 'No',
      e.upsWorking || 0, e.upsNotWorking || 0,
      e.batteriesInUse || 0, e.batteriesNotInUse || 0,
      e.ageUnder3 || 0, e.age3To5 || 0, e.age5To8 || 0, e.ageAbove8 || 0,
      e.desktopNotWorkingSummary || 0,
      `"${(e.remarks || '').replace(/"/g, '""')}"`,
      `"${(e.lastUpdated || '').replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `MVD_IT_Equipment_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('CSV Inventory export downloaded successfully!', 'success');
}

// --- 19. TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };

  toast.innerHTML = `<i class="fa-solid ${iconMap[type]}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- 20. UTILITIES ---
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
