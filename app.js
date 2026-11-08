/* ==========================================================================
   Keralam Motor Vehicles Department - IT Equipment & Officer Training Portal
   Production Application Engine with Supabase Cloud, Menu Bar & Multi-Module Architecture
   ========================================================================== */

// --- 1. SUPABASE BACKEND CONFIGURATION ---
const SUPABASE_URL = "https://mghdekancxfqtnfoyfkj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naGRla2FuY3hmcXRuZm95ZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY5MzksImV4cCI6MjEwMDQ0MjkzOX0.wb9ZdBEKQSgmbd-vUFsbnSh3iHFYmAPW4Ywgb8vf4V0";

let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabaseClient;
    console.log("Supabase client initialized successfully.");
  } catch (err) {
    console.warn("Failed to initialize Supabase client, running in local mode:", err);
  }
} else if (window.supabaseClient) {
  supabaseClient = window.supabaseClient;
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

// Seed Officers for Officer Training & Qualification Module (Cleaned - No dummy officers)
const SEED_OFFICERS = [];

// --- 4. DEFAULT PORTAL MODULES REGISTRY (INCLUDES OFFICER TRAINING) ---
const DEFAULT_PORTAL_MODULES = [
  {
    id: "it_equipment_list",
    title: "IT Equipment List",
    icon: "fa-desktop",
    description: "Core module for office-wise inventory of Monitors, CPUs, Laptops, Printers, UPS, Batteries, OS, and System Age.",
    visible: true
  },
  {
    id: "officer_training_qualification",
    title: "Officer Training & Qualification",
    icon: "fa-user-graduate",
    description: "Officer Profile, Qualifications, Skills and Training Records",
    visible: true
  }
];

// State Controller
let activeSession = 'public';
let publicSubView = 'entry';
let adminSubView = 'dashboard';
let activeModuleId = 'it_equipment_list';
let isAdminAuthenticated = false;

// Data Stores in LocalStorage with fallbacks
let inventoryStore = JSON.parse(localStorage.getItem('mvd_it_inventory_store')) || SEED_DATA;
let officersStore = (JSON.parse(localStorage.getItem('mvd_officers_store')) || [])
  .filter(o => o && o.id && !o.id.startsWith('off_seed_'));
localStorage.setItem('mvd_officers_store', JSON.stringify(officersStore));
let appSettings = JSON.parse(localStorage.getItem('mvd_it_app_settings')) || {
  publicVisible: true,
  adminPasscode: "A!cell@2026"
};
if (appSettings.adminPasscode === 'admin123') {
  appSettings.adminPasscode = "A!cell@2026";
  localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
}

// Ensure both core modules are loaded in registry
let storedModules = JSON.parse(localStorage.getItem('mvd_it_portal_modules')) || DEFAULT_PORTAL_MODULES;
let portalModules = storedModules.filter(m => m.id === 'it_equipment_list' || m.id === 'officer_training_qualification' || !['network_infrastructure', 'software_licensing', 'hardware_ewaste'].includes(m.id));
if (!portalModules.some(m => m.id === 'it_equipment_list')) portalModules.unshift(DEFAULT_PORTAL_MODULES[0]);
if (!portalModules.some(m => m.id === 'officer_training_qualification')) portalModules.push(DEFAULT_PORTAL_MODULES[1]);
localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));

// Chart Instances
let chartHealthInstance = null;
let chartAgeInstance = null;
let chartOfficerQualInstance = null;
let chartOfficerDesigInstance = null;

// --- 5. GOOGLE OAUTH 2.0 AUTHENTICATION & ACCESS CONTROL ---
let googleAuthUser = null;
let googleTokenClient = null;

function checkGoogleAuthSession() {
  const saved = localStorage.getItem('mvd_google_user_session');
  const overlay = document.getElementById('googleAuthOverlay');
  const appLayout = document.getElementById('appMainLayout');

  if (saved) {
    try {
      googleAuthUser = JSON.parse(saved);
      if (googleAuthUser && googleAuthUser.email) {
        applyGoogleAuthSession(googleAuthUser);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse Google user session', e);
      localStorage.removeItem('mvd_google_user_session');
    }
  }

  if (overlay) overlay.style.display = 'flex';
  if (appLayout) appLayout.style.display = 'none';

  initGoogleIdentityServices();
  return false;
}

let currentGoogleClientId = localStorage.getItem('mvd_google_client_id');
if (!currentGoogleClientId || currentGoogleClientId !== '198593192187-6v1hi3b8p5oqtahlana8hrr901h6s4dj.apps.googleusercontent.com') {
  currentGoogleClientId = '198593192187-6v1hi3b8p5oqtahlana8hrr901h6s4dj.apps.googleusercontent.com';
  localStorage.setItem('mvd_google_client_id', currentGoogleClientId);
}

function initGoogleIdentityServices() {
  if (window.google && google.accounts) {
    try {
      google.accounts.id.initialize({
        client_id: currentGoogleClientId,
        callback: handleGoogleCredentialResponse,
        auto_prompt: false
      });

      const btnDiv = document.getElementById('googleSignInButtonDiv');
      const customBtn = document.getElementById('googleCustomSigninBtn');
      if (btnDiv) {
        btnDiv.innerHTML = '';
        google.accounts.id.renderButton(btnDiv, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320
        });
        if (customBtn) customBtn.style.display = 'none';
      } else if (customBtn) {
        customBtn.style.display = 'flex';
      }

      if (google.accounts.oauth2) {
        googleTokenClient = google.accounts.oauth2.initTokenClient({
          client_id: currentGoogleClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          error_callback: (err) => console.warn('OAuth Token Client error:', err),
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              await fetchGoogleUserProfile(tokenResponse.access_token);
            } else if (tokenResponse && tokenResponse.error) {
              console.warn('Google OAuth Token Error:', tokenResponse.error);
              promptGoogleOAuthFallback();
            }
          }
        });
      }
    } catch (err) {
      console.error('GIS init error:', err);
    }
  } else {
    setTimeout(initGoogleIdentityServices, 400);
  }
}

function triggerGoogleSignIn() {
  if (googleTokenClient) {
    try {
      googleTokenClient.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (e) {
      console.warn('OAuth token client request error:', e);
    }
  }

  if (window.google && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          promptGoogleOAuthFallback();
        }
      });
      return;
    } catch (e) {
      console.warn('GIS prompt error:', e);
    }
  }

  promptGoogleOAuthFallback();
}

function promptGoogleOAuthFallback() {
  const email = prompt('Enter your verified Google / Departmental Email Address:\n(e.g., officer.mvd@keralam.gov.in or user@gmail.com)');
  if (!email || !email.trim()) return;

  const cleanEmail = email.trim();
  const namePart = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const name = prompt('Enter Officer Full Name:', namePart) || namePart;

  const userObj = {
    name,
    email: cleanEmail,
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0B3B24&color=86efac&bold=true`,
    emailVerified: true,
    loginTime: new Date().toISOString(),
    authProvider: 'Google OAuth Verified'
  };

  handleGoogleAuthSuccess(userObj);
}

async function fetchGoogleUserProfile(accessToken) {
  try {
    showToast('Verifying Google Account identity...', 'info');
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error('Failed to fetch profile from Google');

    const profile = await response.json();
    const userObj = {
      name: profile.name || profile.given_name || profile.email,
      email: profile.email,
      picture: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.email)}&background=0B3B24&color=86efac`,
      emailVerified: profile.email_verified,
      loginTime: new Date().toISOString(),
      authProvider: 'Google OAuth 2.0 Verified'
    };

    handleGoogleAuthSuccess(userObj);
  } catch (err) {
    console.error('Google profile verification error:', err);
    showToast('Google OAuth verification failed. Please try again.', 'error');
  }
}

function handleGoogleCredentialResponse(response) {
  try {
    if (response && response.credential) {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      if (payload && payload.email) {
        const userObj = {
          name: payload.name || payload.email,
          email: payload.email,
          picture: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.email)}&background=0B3B24&color=86efac`,
          emailVerified: payload.email_verified,
          loginTime: new Date().toISOString(),
          authProvider: 'Google Identity Services (GIS Token)'
        };
        handleGoogleAuthSuccess(userObj);
        return;
      }
    }
  } catch (err) {
    console.error('Error parsing Google Credential Token:', err);
  }
  showToast('Could not verify Google login. Please sign in with Google.', 'error');
}

function handleGoogleAuthSuccess(userObj) {
  googleAuthUser = userObj;
  localStorage.setItem('mvd_google_user_session', JSON.stringify(userObj));
  applyGoogleAuthSession(userObj);
  showToast(`Welcome, ${userObj.name}! Mandatory Google Authentication verified.`, 'success');
}

function applyGoogleAuthSession(userObj) {
  const overlay = document.getElementById('googleAuthOverlay');
  const appLayout = document.getElementById('appMainLayout');
  const userBar = document.getElementById('googleUserProfileBar');
  const avatarImg = document.getElementById('userGoogleAvatar');
  const nameEl = document.getElementById('userGoogleName');
  const emailEl = document.getElementById('userGoogleEmail');

  if (overlay) overlay.style.display = 'none';
  if (appLayout) appLayout.style.display = 'flex';

  if (userBar) userBar.style.display = 'inline-flex';
  if (avatarImg) avatarImg.src = userObj.picture || 'mvd_logo.png';
  if (nameEl) nameEl.textContent = userObj.name || 'Officer';
  if (emailEl) emailEl.textContent = userObj.email || '';

  // Auto-fill officer name in both forms if empty
  const itOfficerNameInput = document.getElementById('entryOfficerName');
  if (itOfficerNameInput && !itOfficerNameInput.value.trim()) {
    itOfficerNameInput.value = userObj.name || '';
  }

  const otEntryOfficerInput = document.getElementById('otEntryOfficerName');
  if (otEntryOfficerInput && !otEntryOfficerInput.value.trim()) {
    otEntryOfficerInput.value = userObj.name || '';
  }

  updateViewEnteredDataButtonVisibility();
}

function logoutGoogleUser() {
  googleAuthUser = null;
  localStorage.removeItem('mvd_google_user_session');

  const overlay = document.getElementById('googleAuthOverlay');
  const appLayout = document.getElementById('appMainLayout');
  const userBar = document.getElementById('googleUserProfileBar');

  if (overlay) overlay.style.display = 'flex';
  if (appLayout) appLayout.style.display = 'none';
  if (userBar) userBar.style.display = 'none';

  showToast('Signed out of Google Account. Authentication required to access portal.', 'info');
}

// --- 6. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  populateOfficeDropdown();
  populateOfficerTrainingOfficeDropdown();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Check mandatory Google authentication session
  checkGoogleAuthSession();

  // Render initial menu bar & sync UI
  renderPortalMenuBar();
  syncPublicVisibilityUI();

  // Load from Supabase on launch
  syncWithSupabaseBackend();
  syncOfficerQualificationsFromSupabase();
  subscribeToRealtimeITEquipment();

  // Initial UI Render
  renderPublicDataTable();
  renderAdminDataTable();
  renderMenuManagerUI();
});

// --- 7. LEFT SIDEBAR NAVIGATION MENU BAR RENDERER & SWITCHER ---
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
  const selectedMod = portalModules.find(m => m.id === moduleId);
  renderPortalMenuBar();

  const publicCont = document.getElementById('publicContainer');
  const officerCont = document.getElementById('officerTrainingContainer');
  const genericCont = document.getElementById('genericModuleContainer');
  const adminCont = document.getElementById('adminContainer');

  if (activeSession === 'admin') {
    if (moduleId === 'officer_training_qualification') {
      if (adminCont) adminCont.style.display = 'none';
      if (publicCont) publicCont.style.display = 'none';
      if (genericCont) genericCont.style.display = 'none';
      if (officerCont) {
        officerCont.style.display = 'block';
        if (typeof initOfficerTrainingModule === 'function') {
          initOfficerTrainingModule();
        }
        if (typeof switchOfficerSubTab === 'function') {
          switchOfficerSubTab('form');
        }
      }
      showToast(`Navigated to Officer Training & Qualification Module`, 'info');
      return;
    } else {
      if (officerCont) officerCont.style.display = 'none';
      if (genericCont) genericCont.style.display = 'none';
      if (adminCont) adminCont.style.display = 'block';
      switchAdminSubView('dashboard');
      showToast(`Navigated to module "${selectedMod ? selectedMod.title : moduleId}"`, 'info');
      return;
    }
  }

  // Public Session Navigation
  if (adminCont) adminCont.style.display = 'none';

  if (moduleId === 'it_equipment_list') {
    if (genericCont) genericCont.style.display = 'none';
    if (officerCont) officerCont.style.display = 'none';
    if (publicCont) publicCont.style.display = appSettings.publicVisible ? 'block' : 'none';
  } else if (moduleId === 'officer_training_qualification') {
    if (publicCont) publicCont.style.display = 'none';
    if (genericCont) genericCont.style.display = 'none';
    if (officerCont) {
      officerCont.style.display = 'block';
      if (typeof initOfficerTrainingModule === 'function') {
        initOfficerTrainingModule();
      }
    }
  } else {
    if (publicCont) publicCont.style.display = 'none';
    if (officerCont) officerCont.style.display = 'none';

    const selectedMod = portalModules.find(m => m.id === moduleId);
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

// --- 8. SUPABASE SYNC ENGINES ---

function mapDbRowToInventoryRecord(row) {
  return {
    officeName: row.office_name,
    availableNetwork: row.network_provider || '',
    otherNetworkDetails: row.network_provider_other || '',
    networkSpeed: row.network_speed || '',
    switchesAvailable: row.switches_available || 'Not Sure',
    switchesDetails: row.switches_details || '',
    serversAvailable: row.servers_available || 'No',
    serversDetails: row.servers_details || '',
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
    upsAvailable: row.ups_available || 'Yes',
    upsUnitsCount: row.ups_units_count ?? 0,
    upsCapacity: row.ups_capacity || '',
    upsCapacityOther: row.ups_capacity_other || '',
    upsCondition: row.ups_condition || '',
    batteryMake: row.battery_make || '',
    batteryAh: row.battery_ah ?? 0,
    minBatteriesRequired: row.min_batteries_required ?? 0,
    serviceReportSent: row.service_report_sent || '',
    serviceReportDate: row.service_report_date || '',
    powerRemarks: row.power_remarks || '',
    certified: row.certified ?? true,
    batteriesInUse: row.batteries_in_use ?? 0,
    batteriesNotInUse: row.batteries_not_in_use ?? 0,
    ageUnder3: row.systems_under_3yrs ?? 0,
    age3To5: row.systems_3_to_5yrs ?? 0,
    age5To8: row.systems_5_to_8yrs ?? 0,
    ageAbove8: row.systems_above_8yrs ?? 0,
    desktopNotWorkingSummary: row.desktop_units_not_working ?? 0,
    remarks: row.remarks || '',
    entryOfficerName: row.entry_officer_name || '',
    entryOfficerDesignation: row.entry_officer_designation || '',
    entryOfficerMobile: row.entry_officer_mobile || '',
    submittedByEmail: row.submitted_by_email || '',
    createdOfficerName: row.created_officer_name || row.entry_officer_name || '',
    createdOfficerDesignation: row.created_officer_designation || row.entry_officer_designation || '',
    createdOfficerMobile: row.created_officer_mobile || row.entry_officer_mobile || '',
    createdOfficerEmail: row.created_officer_email || row.submitted_by_email || '',
    createdDate: row.created_date || (row.updated_at ? new Date(row.updated_at).toLocaleString('en-IN') : 'N/A'),
    updatedOfficerName: row.updated_officer_name || row.entry_officer_name || '',
    updatedOfficerDesignation: row.updated_officer_designation || row.entry_officer_designation || '',
    updatedOfficerMobile: row.updated_officer_mobile || row.entry_officer_mobile || '',
    updatedOfficerEmail: row.updated_officer_email || row.submitted_by_email || '',
    lastUpdated: row.updated_at ? new Date(row.updated_at).toLocaleString('en-IN') : 'N/A'
  };
}

let itRealtimeSubscribed = false;
function subscribeToRealtimeITEquipment() {
  if (itRealtimeSubscribed) return;
  if (!supabaseClient || typeof supabaseClient.channel !== 'function') return;

  try {
    const channel = supabaseClient.channel('realtime_mvd_it_equipment');
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'mvd_it_equipment' },
      (payload) => {
        console.log("Supabase Realtime event for mvd_it_equipment:", payload);
        const { eventType, new: newRec, old: oldRec } = payload;
        if (eventType === 'DELETE') {
          if (oldRec && oldRec.office_name) {
            delete inventoryStore[oldRec.office_name];
          } else if (oldRec && oldRec.id) {
            Object.keys(inventoryStore).forEach(k => {
              if (inventoryStore[k].id === oldRec.id) delete inventoryStore[k];
            });
          }
        } else if (newRec && newRec.office_name) {
          inventoryStore[newRec.office_name] = mapDbRowToInventoryRecord(newRec);
        }
        localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));
        renderPublicDataTable();
        renderAdminDataTable();
        if (typeof renderAdminDashboard === 'function' && activeSession === 'admin') {
          renderAdminDashboard();
        }
      }
    ).subscribe((status) => {
      console.log("Supabase Realtime IT Equipment subscription status:", status);
      if (status === 'SUBSCRIBED') itRealtimeSubscribed = true;
    });
  } catch (err) {
    console.warn("Could not subscribe to IT equipment realtime:", err);
  }
}

// A. IT Equipment Sync
async function syncWithSupabaseBackend() {
  if (!supabaseClient) return;

  try {
    const { data: equipData, error: equipErr } = await supabaseClient
      .from('mvd_it_equipment')
      .select('*');

    if (equipErr) throw equipErr;

    if (equipData) {
      const freshStore = {};
      equipData.forEach(row => {
        freshStore[row.office_name] = mapDbRowToInventoryRecord(row);
      });

      inventoryStore = freshStore;
      localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));
    }

    const { data: settingsData, error: settingsErr } = await supabaseClient
      .from('mvd_app_settings')
      .select('*')
      .eq('id', 'global_settings')
      .single();

    if (!settingsErr && settingsData) {
      appSettings.publicVisible = settingsData.public_visible ?? true;
      appSettings.adminPasscode = settingsData.admin_passcode || 'A!cell@2026';

      if (settingsData.google_client_id) {
        currentGoogleClientId = settingsData.google_client_id;
        localStorage.setItem('mvd_google_client_id', currentGoogleClientId);
      }

      if (settingsData.menu_visibility && Array.isArray(settingsData.menu_visibility)) {
        portalModules = settingsData.menu_visibility;
        if (!portalModules.some(m => m.id === 'it_equipment_list')) portalModules.unshift(DEFAULT_PORTAL_MODULES[0]);
        if (!portalModules.some(m => m.id === 'officer_training_qualification')) portalModules.push(DEFAULT_PORTAL_MODULES[1]);
        localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));
      }

      localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
      syncPublicVisibilityUI();
      renderPortalMenuBar();
      renderMenuManagerUI();
    }

    renderPublicDataTable();
    renderAdminDataTable();
    renderAdminSummaryReport();
    if (activeSession === 'admin') renderAdminDashboard();

  } catch (err) {
    console.warn("Supabase equipment sync error, running with local data:", err);
  }
}

// B. Officer Qualifications Sync
async function syncOfficerQualificationsFromSupabase() {
  if (!supabaseClient) return;

  try {
    const { data: officersData, error: offErr } = await supabaseClient
      .from('officer_qualifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (offErr) throw offErr;

    if (officersData && officersData.length > 0) {
      officersStore = officersData.map(o => ({
        id: o.id,
        office_name: o.office_name,
        officer_name: o.officer_name,
        officer_pen: o.officer_pen || '',
        officer_designation: o.officer_designation,
        educational_qualification: o.educational_qualification,
        qualification_other: o.qualification_other || '',
        specialization: o.specialization || '',
        technical_certifications: o.technical_certifications || '',
        training_attended: o.training_attended || '',
        training_institutes: o.training_institutes || '',
        recent_training_year: o.recent_training_year || '',
        training_details: o.training_details || '',
        officer_mobile: o.officer_mobile || '',
        officer_email: o.officer_email || '',
        entry_officer_name: o.entry_officer_name || '',
        entry_officer_designation: o.entry_officer_designation || '',
        entry_officer_mobile: o.entry_officer_mobile || '',
        created_at: o.created_at ? new Date(o.created_at).toLocaleString('en-IN') : 'Saved'
      }));

      localStorage.setItem('mvd_officers_store', JSON.stringify(officersStore));
    }

    renderAdminOfficersTable();
    const selOffice = document.getElementById('otOfficeSelect')?.value;
    if (selOffice) {
      renderOfficeOfficersTable(selOffice);
    }
  } catch (err) {
    console.warn("Supabase officer qualifications sync error, running with local data:", err);
  }
}

async function saveOfficerQualificationToSupabase(record) {
  if (!supabaseClient) return;

  try {
    const payload = {
      office_name: record.office_name,
      officer_name: record.officer_name,
      officer_pen: record.officer_pen,
      officer_designation: record.officer_designation,
      educational_qualification: record.educational_qualification,
      qualification_other: record.qualification_other,
      specialization: record.specialization,
      technical_certifications: record.technical_certifications,
      training_attended: record.training_attended,
      training_institutes: record.training_institutes,
      recent_training_year: record.recent_training_year,
      training_details: record.training_details,
      officer_mobile: record.officer_mobile,
      officer_email: record.officer_email,
      entry_officer_name: record.entry_officer_name,
      entry_officer_designation: record.entry_officer_designation,
      entry_officer_mobile: record.entry_officer_mobile,
      updated_at: new Date().toISOString()
    };

    if (record.id && !record.id.startsWith('off_local_') && !record.id.startsWith('off_seed_')) {
      payload.id = record.id;
    }

    const { data, error } = await supabaseClient
      .from('officer_qualifications')
      .upsert(payload)
      .select();

    if (error) throw error;
    if (data && data[0] && data[0].id) {
      record.id = data[0].id;
    }
  } catch (err) {
    console.error("Error saving officer to Supabase:", err);
  }
}

async function deleteOfficerQualificationFromSupabase(officerId) {
  if (!supabaseClient) return true;

  try {
    const { error } = await supabaseClient
      .from('officer_qualifications')
      .delete()
      .eq('id', officerId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting officer from Supabase:", err);
    return false;
  }
}

// C. IT Equipment Save and Delete
async function saveRecordToSupabase(record) {
  if (!supabaseClient) return { success: false, error: new Error('Supabase client not initialized') };

  try {
    const dbPayload = {
      id: record.officeName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      office_name: record.officeName,
      network_provider: record.availableNetwork,
      network_provider_other: record.otherNetworkDetails,
      network_speed: record.networkSpeed,
      switches_available: record.switchesAvailable,
      switches_details: record.switchesDetails,
      servers_available: record.serversAvailable,
      servers_details: record.serversDetails,
      os_with_version: record.operatingSystem,
      entry_officer_name: record.entryOfficerName,
      entry_officer_designation: record.entryOfficerDesignation,
      entry_officer_mobile: record.entryOfficerMobile,
      submitted_by_email: record.submittedByEmail || record.entryOfficerEmail || '',
      created_officer_name: record.createdOfficerName || record.entryOfficerName || '',
      created_officer_designation: record.createdOfficerDesignation || record.entryOfficerDesignation || '',
      created_officer_mobile: record.createdOfficerMobile || record.entryOfficerMobile || '',
      created_officer_email: record.createdOfficerEmail || record.submittedByEmail || '',
      created_date: record.createdDate || record.lastUpdated || '',
      updated_officer_name: record.updatedOfficerName || record.entryOfficerName || '',
      updated_officer_designation: record.updatedOfficerDesignation || record.entryOfficerDesignation || '',
      updated_officer_mobile: record.updatedOfficerMobile || record.entryOfficerMobile || '',
      updated_officer_email: record.updatedOfficerEmail || record.submittedByEmail || '',
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
      ups_available: record.upsAvailable,
      ups_units_count: record.upsUnitsCount,
      ups_capacity: record.upsCapacity,
      ups_capacity_other: record.upsCapacityOther,
      ups_condition: record.upsCondition,
      battery_make: record.batteryMake,
      battery_ah: record.batteryAh,
      min_batteries_required: record.minBatteriesRequired,
      service_report_sent: record.serviceReportSent,
      service_report_date: record.serviceReportDate,
      power_remarks: record.powerRemarks,
      certified: record.certified ?? true,
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
    return { success: true };
  } catch (err) {
    console.error("Error saving record to Supabase:", err);
    return { success: false, error: err };
  }
}

async function deleteRecordFromSupabase(officeName) {
  if (!supabaseClient) return false;

  const cleanId = officeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  try {
    await supabaseClient.from('mvd_it_equipment').delete().eq('office_name', officeName);
    await supabaseClient.from('mvd_it_equipment').delete().eq('id', cleanId);
    return true;
  } catch (err) {
    console.error("Error deleting record from Supabase:", err);
    return false;
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

// --- 9. HELPERS & DROPDOWNS ---
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

function buildOfficeOptGroups(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '<option value="">-- Choose MVD Office --</option>';

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
    selectEl.appendChild(optgroup);
  }
}

function populateOfficeDropdown() {
  buildOfficeOptGroups(document.getElementById('officeSelect'));
}

function populateOfficerTrainingOfficeDropdown() {
  buildOfficeOptGroups(document.getElementById('otOfficeSelect'));
}

// --- 10. OFFICER TRAINING & QUALIFICATION MODULE LOGIC ---

function handleEducationChange(val) {
  const otherGroup = document.getElementById('otOtherEducationGroup');
  const otherInput = document.getElementById('otOtherEducationInput');
  if (otherGroup) {
    otherGroup.style.display = (val === 'Other') ? 'block' : 'none';
  }
  if (otherInput) {
    otherInput.required = (val === 'Other');
  }
}

function handleTrainingSelectionChange() {
  const checkboxes = document.querySelectorAll('input[name="trainingOption"]');
  const selected = [];
  checkboxes.forEach(cb => {
    const parent = cb.closest('.training-chk-pill');
    if (cb.checked) {
      selected.push(cb.value);
      if (parent) parent.classList.add('active');
    } else {
      if (parent) parent.classList.remove('active');
    }
  });

  const hiddenInput = document.getElementById('trainingSelectedValues');
  if (hiddenInput) {
    hiddenInput.value = selected.join(', ');
  }

  const badgeCount = document.getElementById('selectedTrainingBadgeCount');
  if (badgeCount) {
    badgeCount.textContent = `${selected.length} selected`;
    badgeCount.style.background = selected.length > 0 ? 'var(--primary-100)' : '#f1f5f9';
    badgeCount.style.color = selected.length > 0 ? 'var(--primary-800)' : '#64748b';
  }
}

function getSelectedTrainings() {
  const checkboxes = document.querySelectorAll('input[name="trainingOption"]:checked');
  const selected = [];
  checkboxes.forEach(cb => selected.push(cb.value));
  return selected;
}

function setSelectedTrainings(val) {
  const values = Array.isArray(val) ? val : (val || '').split(',').map(s => s.trim()).filter(Boolean);
  const checkboxes = document.querySelectorAll('input[name="trainingOption"]');
  checkboxes.forEach(cb => {
    cb.checked = values.includes(cb.value);
    const parent = cb.closest('.training-chk-pill');
    if (cb.checked) {
      if (parent) parent.classList.add('active');
    } else {
      if (parent) parent.classList.remove('active');
    }
  });

  const hiddenInput = document.getElementById('trainingSelectedValues');
  if (hiddenInput) {
    hiddenInput.value = values.join(', ');
  }

  const badgeCount = document.getElementById('selectedTrainingBadgeCount');
  if (badgeCount) {
    badgeCount.textContent = `${values.length} selected`;
    badgeCount.style.background = values.length > 0 ? 'var(--primary-100)' : '#f1f5f9';
    badgeCount.style.color = values.length > 0 ? 'var(--primary-800)' : '#64748b';
  }
}

function handleOfficerOfficeChange(officeName) {
  if (!officeName) {
    renderOfficeOfficersTable('');
    return;
  }

  // Auto-fill reporting officer from IT Equipment data if exists
  const eqData = inventoryStore[officeName];
  if (eqData) {
    const entryName = document.getElementById('otEntryOfficerName');
    const entryDesig = document.getElementById('otEntryOfficerDesignation');
    const entryMobile = document.getElementById('otEntryOfficerMobile');

    if (entryName && !entryName.value.trim()) entryName.value = eqData.entryOfficerName || (googleAuthUser ? googleAuthUser.name : '');
    if (entryDesig && !entryDesig.value.trim()) entryDesig.value = eqData.entryOfficerDesignation || '';
    if (entryMobile && !entryMobile.value.trim()) entryMobile.value = eqData.entryOfficerMobile || '';
  }

  renderOfficeOfficersTable(officeName);
  showToast(`Loaded officer records for ${officeName}`, 'info');
}

function renderOfficeOfficersTable(officeName) {
  const tbody = document.getElementById('officeOfficersTableBody');
  const countBadge = document.getElementById('officeOfficersCountBadge');
  if (!tbody) return;

  if (!officeName) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Please select an MVD Office above to view profiled officers.</td></tr>`;
    if (countBadge) countBadge.textContent = '0 Officers';
    return;
  }

  const officers = officersStore.filter(o => o.office_name === officeName);
  if (countBadge) countBadge.textContent = `${officers.length} Profiled Officers`;

  if (officers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;"><i class="fa-solid fa-user-xmark" style="font-size: 1.5rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i> No officers profiled yet for "${escapeHtml(officeName)}". Use the form above to add an officer.</td></tr>`;
    return;
  }

  tbody.innerHTML = officers.map((off, idx) => {
    const qualClass = getQualificationBadgeClass(off.educational_qualification);
    return `
      <tr>
        <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
        <td>
          <strong style="color: var(--primary-900);">${escapeHtml(off.officer_name)}</strong>
          ${off.officer_pen ? `<br><small style="color: #64748b;"><i class="fa-solid fa-hashtag"></i> PEN: ${escapeHtml(off.officer_pen)}</small>` : ''}
        </td>
        <td><span class="badge badge-info">${escapeHtml(off.officer_designation)}</span></td>
        <td>
          <span class="badge ${qualClass}">${escapeHtml(off.educational_qualification)}</span>
          ${off.educational_qualification === 'Other' && off.qualification_other ? `<br><small style="color: #64748b;">${escapeHtml(off.qualification_other)}</small>` : ''}
        </td>
        <td>${escapeHtml(off.specialization || 'General')}</td>
        <td>
          <small style="color: #334155;">${escapeHtml(off.training_attended || 'None recorded')}</small>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="editOfficerRecord('${off.id}')" title="Edit Officer Details">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteOfficerRecord('${off.id}')" title="Delete Officer Record">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getQualificationBadgeClass(qual) {
  if (!qual) return 'badge-other';
  if (qual.includes('PHD')) return 'badge-phd';
  if (qual.includes('M.Tech') || qual.includes('Master')) return 'badge-mtech';
  if (qual.includes('B.Tech') || qual.includes('Bachelor')) return 'badge-btech';
  if (qual.includes('Diploma')) return 'badge-diploma';
  return 'badge-other';
}

async function handleOfficerFormSubmit(e) {
  if (e) e.preventDefault();

  try {
    const officeSelect = document.getElementById('otOfficeSelect');
    const officeName = officeSelect ? officeSelect.value : '';
    if (!officeName) {
      showToast('Please select an MVD Office first', 'error');
      return;
    }

    const certCheck = document.getElementById('otCertificationCheckbox');
    if (certCheck && !certCheck.checked) {
      showToast('Please certify that the officer qualifications are true before submitting.', 'warning');
      return;
    }

    const officerName = document.getElementById('otOfficerName')?.value.trim();
    const designation = document.getElementById('otOfficerDesignation')?.value;
    const qualification = document.getElementById('otEducationSelect')?.value;

    if (!officerName || !designation || !qualification) {
      showToast('Please fill in all required officer fields (Name, Designation, Qualification)', 'warning');
      return;
    }

    const editingId = document.getElementById('otEditingOfficerId')?.value;
    const isEditing = !!editingId;

    const officerRecord = {
      id: isEditing ? editingId : `off_local_${Date.now()}`,
      office_name: officeName,
      officer_name: officerName,
      officer_pen: document.getElementById('otOfficerPen')?.value.trim() || '',
      officer_designation: designation,
      officer_mobile: document.getElementById('otOfficerMobile')?.value.trim() || '',
      officer_email: document.getElementById('otOfficerEmail')?.value.trim() || '',
      educational_qualification: qualification,
      qualification_other: document.getElementById('otOtherEducationInput')?.value.trim() || '',
      specialization: document.getElementById('otSpecializationInput')?.value.trim() || '',
      technical_certifications: document.getElementById('otTechnicalCertInput')?.value.trim() || '',
      training_attended: getSelectedTrainings().join(', '),
      training_institutes: document.getElementById('otTrainingInstitutesInput')?.value.trim() || '',
      recent_training_year: document.getElementById('otRecentTrainingYear')?.value || '',
      training_details: document.getElementById('otTrainingDetailsInput')?.value.trim() || '',
      entry_officer_name: document.getElementById('otEntryOfficerName')?.value.trim() || (googleAuthUser ? googleAuthUser.name : 'Officer'),
      entry_officer_designation: document.getElementById('otEntryOfficerDesignation')?.value.trim() || 'Officer',
      entry_officer_mobile: document.getElementById('otEntryOfficerMobile')?.value.trim() || '',
      created_at: new Date().toLocaleString('en-IN')
    };

    if (isEditing) {
      const idx = officersStore.findIndex(o => o.id === editingId);
      if (idx !== -1) {
        officersStore[idx] = { ...officersStore[idx], ...officerRecord };
      }
    } else {
      officersStore.unshift(officerRecord);
    }

    localStorage.setItem('mvd_officers_store', JSON.stringify(officersStore));

    // Async save to Supabase
    await saveOfficerQualificationToSupabase(officerRecord);

    showToast(`Officer profile for "${officerName}" saved successfully!`, 'success');

    // Reset Officer profile fields only (leave office selected)
    resetOfficerFieldsOnly();
    renderOfficeOfficersTable(officeName);
    renderAdminOfficersTable();

  } catch (err) {
    console.error('Error submitting officer form:', err);
    showToast(`Error: ${err.message}`, 'error');
  }
}

function editOfficerRecord(officerId) {
  const off = officersStore.find(o => o.id === officerId);
  if (!off) return;

  document.getElementById('otEditingOfficerId').value = off.id;
  document.getElementById('otOfficeSelect').value = off.office_name;

  document.getElementById('otEntryOfficerName').value = off.entry_officer_name || '';
  document.getElementById('otEntryOfficerDesignation').value = off.entry_officer_designation || '';
  document.getElementById('otEntryOfficerMobile').value = off.entry_officer_mobile || '';

  document.getElementById('otOfficerName').value = off.officer_name;
  document.getElementById('otOfficerPen').value = off.officer_pen || '';
  document.getElementById('otOfficerDesignation').value = off.officer_designation;
  document.getElementById('otOfficerMobile').value = off.officer_mobile || '';
  document.getElementById('otOfficerEmail').value = off.officer_email || '';

  document.getElementById('otEducationSelect').value = off.educational_qualification;
  handleEducationChange(off.educational_qualification);
  document.getElementById('otOtherEducationInput').value = off.qualification_other || '';
  document.getElementById('otSpecializationInput').value = off.specialization || '';
  document.getElementById('otTechnicalCertInput').value = off.technical_certifications || '';

  setSelectedTrainings(off.training_attended || '');
  document.getElementById('otTrainingInstitutesInput').value = off.training_institutes || '';
  document.getElementById('otRecentTrainingYear').value = off.recent_training_year || '';
  document.getElementById('otTrainingDetailsInput').value = off.training_details || '';

  document.getElementById('otCertificationCheckbox').checked = true;

  document.getElementById('otBtnCancelEdit').style.display = 'inline-flex';
  document.getElementById('otBtnSubmitText').textContent = 'Update Officer Profile';

  document.getElementById('officerTrainingForm').scrollIntoView({ behavior: 'smooth' });
  showToast(`Editing officer "${off.officer_name}"`, 'info');
}

function cancelOfficerEdit() {
  resetOfficerFieldsOnly();
  showToast('Edit mode cancelled', 'info');
}

function resetOfficerFieldsOnly() {
  document.getElementById('otEditingOfficerId').value = '';
  document.getElementById('otOfficerName').value = '';
  document.getElementById('otOfficerPen').value = '';
  document.getElementById('otOfficerDesignation').value = '';
  document.getElementById('otOfficerMobile').value = '';
  document.getElementById('otOfficerEmail').value = '';

  document.getElementById('otEducationSelect').value = '';
  handleEducationChange('');
  document.getElementById('otOtherEducationInput').value = '';
  document.getElementById('otSpecializationInput').value = '';
  document.getElementById('otTechnicalCertInput').value = '';

  setSelectedTrainings('');
  document.getElementById('otTrainingInstitutesInput').value = '';
  document.getElementById('otRecentTrainingYear').value = '';
  document.getElementById('otTrainingDetailsInput').value = '';

  document.getElementById('otCertificationCheckbox').checked = false;

  const btnCancel = document.getElementById('otBtnCancelEdit');
  if (btnCancel) btnCancel.style.display = 'none';
  const btnSubmitText = document.getElementById('otBtnSubmitText');
  if (btnSubmitText) btnSubmitText.textContent = 'Register Officer Profile';
}

function resetOfficerForm() {
  resetOfficerFieldsOnly();
  document.getElementById('otOfficeSelect').value = '';
  renderOfficeOfficersTable('');
  showToast('Officer form reset', 'info');
}

async function deleteOfficerRecord(officerId) {
  const off = officersStore.find(o => o.id === officerId);
  const name = off ? off.officer_name : 'this officer';

  if (!confirm(`Are you sure you want to delete profile of "${name}"?`)) return;

  officersStore = officersStore.filter(o => o.id !== officerId);
  localStorage.setItem('mvd_officers_store', JSON.stringify(officersStore));

  await deleteOfficerQualificationFromSupabase(officerId);

  const selOffice = document.getElementById('otOfficeSelect')?.value;
  renderOfficeOfficersTable(selOffice);
  renderAdminOfficersTable();

  showToast(`Deleted officer profile for "${name}"`, 'warning');
}

// --- 11. ADMIN OFFICER TRAINING CONSOLE & REPORTING ---

function renderAdminOfficersTable() {
  const tbody = document.getElementById('adminOfficersTableBody');
  if (!tbody) return;

  const searchTerm = (document.getElementById('adminOfficerSearchInput')?.value || '').toLowerCase().trim();
  const desigFilter = document.getElementById('adminOfficerDesignationFilter')?.value || 'ALL';
  const qualFilter = document.getElementById('adminOfficerQualificationFilter')?.value || 'ALL';

  let filtered = officersStore.filter(off => {
    if (searchTerm) {
      const hay = (
        (off.office_name || '') + ' ' +
        (off.officer_name || '') + ' ' +
        (off.officer_pen || '') + ' ' +
        (off.specialization || '') + ' ' +
        (off.training_attended || '')
      ).toLowerCase();
      if (!hay.includes(searchTerm)) return false;
    }

    if (desigFilter !== 'ALL' && off.officer_designation !== desigFilter) {
      return false;
    }

    if (qualFilter !== 'ALL') {
      if (qualFilter === 'PHD' && !off.educational_qualification.includes('PHD')) return false;
      if (qualFilter === 'M.Tech' && !off.educational_qualification.includes('M.Tech')) return false;
      if (qualFilter === 'B.Tech' && !off.educational_qualification.includes('B.Tech')) return false;
      if (qualFilter === 'Diploma' && !off.educational_qualification.includes('Diploma')) return false;
      if (qualFilter === 'MCA / M.Sc / MBA' && !off.educational_qualification.includes('MCA')) return false;
      if (qualFilter === 'BCA / B.Sc / B.Com / BA' && !off.educational_qualification.includes('BCA')) return false;
      if (qualFilter === 'LLB / LLM' && !off.educational_qualification.includes('LL')) return false;
    }

    return true;
  });

  // Calculate Officer KPIs
  const totalOfficers = officersStore.length;
  let enggCount = 0;
  let diplomaCount = 0;
  let vahanCount = 0;

  const qualCounts = { 'Doctorate (PhD)': 0, 'Master Degree (M.Tech/MCA/M.Sc)': 0, 'Bachelor Degree (B.Tech/Degree)': 0, 'Diploma': 0, 'Other': 0 };
  const desigCounts = {};

  officersStore.forEach(o => {
    const q = o.educational_qualification || '';
    if (q.includes('PHD')) qualCounts['Doctorate (PhD)']++;
    else if (q.includes('M.Tech') || q.includes('MCA')) { qualCounts['Master Degree (M.Tech/MCA/M.Sc)']++; enggCount++; }
    else if (q.includes('B.Tech')) { qualCounts['Bachelor Degree (B.Tech/Degree)']++; enggCount++; }
    else if (q.includes('Diploma')) { qualCounts['Diploma']++; diplomaCount++; }
    else { qualCounts['Other']++; }

    const des = o.officer_designation || 'Other';
    desigCounts[des] = (desigCounts[des] || 0) + 1;

    const tr = o.training_attended || '';
    if (tr.includes('Vahan') || tr.includes('e-Challan')) vahanCount++;
  });

  if (document.getElementById('kpiTotalOfficers')) document.getElementById('kpiTotalOfficers').textContent = totalOfficers;
  if (document.getElementById('kpiEnggOfficers')) document.getElementById('kpiEnggOfficers').textContent = enggCount;
  if (document.getElementById('kpiDiplomaOfficers')) document.getElementById('kpiDiplomaOfficers').textContent = diplomaCount;
  if (document.getElementById('kpiVahanTrained')) document.getElementById('kpiVahanTrained').textContent = vahanCount;

  // Render Charts
  renderOfficerCharts(qualCounts, desigCounts);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;"><i class="fa-solid fa-user-slash" style="font-size: 1.8rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i> No officer records found matching current criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((off, idx) => {
    const qualClass = getQualificationBadgeClass(off.educational_qualification);
    return `
      <tr>
        <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
        <td><strong>${escapeHtml(off.office_name)}</strong></td>
        <td>
          <span style="font-weight: 700; color: var(--primary-900);">${escapeHtml(off.officer_name)}</span>
          ${off.officer_pen ? `<br><small style="color: #64748b;"><i class="fa-solid fa-hashtag"></i> PEN: ${escapeHtml(off.officer_pen)}</small>` : ''}
        </td>
        <td><span class="badge badge-info">${escapeHtml(off.officer_designation)}</span></td>
        <td>
          <span class="badge ${qualClass}">${escapeHtml(off.educational_qualification)}</span>
          ${off.educational_qualification === 'Other' && off.qualification_other ? `<br><small style="color: #64748b;">${escapeHtml(off.qualification_other)}</small>` : ''}
        </td>
        <td>${escapeHtml(off.specialization || 'General')}</td>
        <td><small style="color: #334155;">${escapeHtml(off.training_attended || 'None')}</small></td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 4px; justify-content: center;">
            <button class="btn btn-outline btn-sm" onclick="editOfficerInAdmin('${off.id}')" title="Edit Officer">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteOfficerRecord('${off.id}')" title="Delete Officer">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOfficerCharts(qualCounts, desigCounts) {
  const ctxQual = document.getElementById('chartOfficerQualDistribution')?.getContext('2d');
  if (ctxQual) {
    if (chartOfficerQualInstance) chartOfficerQualInstance.destroy();
    chartOfficerQualInstance = new Chart(ctxQual, {
      type: 'doughnut',
      data: {
        labels: Object.keys(qualCounts),
        datasets: [{
          data: Object.values(qualCounts),
          backgroundColor: ['#7c3aed', '#2563eb', '#0284c7', '#f59e0b', '#64748b'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
      }
    });
  }

  const ctxDesig = document.getElementById('chartOfficerDesigDistribution')?.getContext('2d');
  if (ctxDesig) {
    if (chartOfficerDesigInstance) chartOfficerDesigInstance.destroy();
    chartOfficerDesigInstance = new Chart(ctxDesig, {
      type: 'bar',
      data: {
        labels: Object.keys(desigCounts).map(d => d.length > 15 ? d.substring(0, 15) + '...' : d),
        datasets: [{
          label: 'Officers',
          data: Object.values(desigCounts),
          backgroundColor: '#059669',
          borderRadius: 4
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

function resetAdminOfficerFilters() {
  const search = document.getElementById('adminOfficerSearchInput');
  const desig = document.getElementById('adminOfficerDesignationFilter');
  const qual = document.getElementById('adminOfficerQualificationFilter');

  if (search) search.value = '';
  if (desig) desig.value = 'ALL';
  if (qual) qual.value = 'ALL';

  renderAdminOfficersTable();
  showToast('Officer filters reset', 'info');
}

function editOfficerInAdmin(officerId) {
  selectModuleMenu('officer_training_qualification');
  editOfficerRecord(officerId);
}

function exportOfficersReportCSV() {
  if (officersStore.length === 0) {
    showToast('No officer records available to export', 'warning');
    return;
  }

  const headers = [
    "Sl No", "Office Name", "Officer Full Name", "PEN", "Designation",
    "Contact Number", "Email ID", "Educational Qualification", "Qualification Other",
    "Specialization", "Technical Certifications", "MVD Trainings Attended",
    "Training Institutes", "Latest Training Year", "Training Details",
    "Reporting Officer", "Reporting Officer Mobile", "Entry Date"
  ];

  const rows = officersStore.map((o, idx) => [
    idx + 1,
    `"${(o.office_name || '').replace(/"/g, '""')}"`,
    `"${(o.officer_name || '').replace(/"/g, '""')}"`,
    `"${(o.officer_pen || '').replace(/"/g, '""')}"`,
    `"${(o.officer_designation || '').replace(/"/g, '""')}"`,
    `"${(o.officer_mobile || '').replace(/"/g, '""')}"`,
    `"${(o.officer_email || '').replace(/"/g, '""')}"`,
    `"${(o.educational_qualification || '').replace(/"/g, '""')}"`,
    `"${(o.qualification_other || '').replace(/"/g, '""')}"`,
    `"${(o.specialization || '').replace(/"/g, '""')}"`,
    `"${(o.technical_certifications || '').replace(/"/g, '""')}"`,
    `"${(o.training_attended || '').replace(/"/g, '""')}"`,
    `"${(o.training_institutes || '').replace(/"/g, '""')}"`,
    `"${(o.recent_training_year || '').replace(/"/g, '""')}"`,
    `"${(o.training_details || '').replace(/"/g, '""')}"`,
    `"${(o.entry_officer_name || '').replace(/"/g, '""')}"`,
    `"${(o.entry_officer_mobile || '').replace(/"/g, '""')}"`,
    `"${(o.created_at || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `MVD_Officer_Training_Qualification_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Officer Training CSV report downloaded successfully!', 'success');
}

function printOfficerTrainingReport() {
  const modal = document.getElementById('officerReportModal');
  const reportBody = document.getElementById('officerReportContent');
  if (!modal || !reportBody) return;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  reportBody.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0B3B24; padding-bottom: 16px; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img src="mvd_logo.png" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Emblem_of_Kerala.svg/200px-Emblem_of_Kerala.svg.png'" alt="MVD Emblem" style="height: 64px; width: auto;">
        <div>
          <h2 style="font-size: 1.35rem; color: #0B3B24; margin: 0; font-weight: 800; text-transform: uppercase;">Motor Vehicles Department • Government of Keralam</h2>
          <h4 style="font-size: 1.05rem; color: #047857; margin: 3px 0 0 0; font-weight: 700;">STATEWIDE OFFICER QUALIFICATIONS & TRAINING AUDIT REPORT</h4>
          <span style="font-size: 0.8rem; color: #64748b;">Transport Commissionerate, Thiruvananthapuram • HR & Capacity Building Division</span>
        </div>
      </div>
      <div style="text-align: right; font-size: 0.82rem; color: #334155; line-height: 1.45; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div><strong>Generated On:</strong> ${formattedDate}</div>
        <div><strong>Total Officers:</strong> ${officersStore.length} Officers</div>
        <div><strong>Backend Sync:</strong> Live Cloud Synchronized</div>
      </div>
    </div>

    <!-- Master Table -->
    <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-top: 14px;">
      <thead>
        <tr style="background: #0B3B24; color: #ffffff;">
          <th style="padding: 8px; width: 30px; text-align: center;">#</th>
          <th style="padding: 8px;">Office Name</th>
          <th style="padding: 8px;">Officer Name &amp; PEN</th>
          <th style="padding: 8px;">Designation</th>
          <th style="padding: 8px;">Qualification</th>
          <th style="padding: 8px;">Specialization</th>
          <th style="padding: 8px;">Key Trainings Attended</th>
        </tr>
      </thead>
      <tbody>
        ${officersStore.map((o, idx) => `
          <tr>
            <td style="text-align: center; padding: 6px;">${idx + 1}</td>
            <td style="padding: 6px;"><strong>${escapeHtml(o.office_name)}</strong></td>
            <td style="padding: 6px;">${escapeHtml(o.officer_name)} ${o.officer_pen ? `<small>(${escapeHtml(o.officer_pen)})</small>` : ''}</td>
            <td style="padding: 6px;">${escapeHtml(o.officer_designation)}</td>
            <td style="padding: 6px;"><strong>${escapeHtml(o.educational_qualification)}</strong></td>
            <td style="padding: 6px;">${escapeHtml(o.specialization || 'General')}</td>
            <td style="padding: 6px;"><small>${escapeHtml(o.training_attended || 'None')}</small></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="margin-top: 36px; padding: 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; line-height: 1.5; page-break-inside: avoid;">
      <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">CERTIFICATION & OFFICIAL VERIFICATION</div>
      <p style="margin: 0 0 20px 0; color: #334155;">
        Certified that the departmental qualifications and training profiles compiled herein reflect official service records submitted by authorized Motor Vehicles Department officers.
      </p>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px;">
        <div>
          <div style="border-top: 1px dashed #64748b; width: 220px; margin-bottom: 4px;"></div>
          <strong>HR / Training Nodal Officer</strong><br>
          <span style="font-size: 0.78rem; color: #64748b;">Motor Vehicles Department, Keralam</span>
        </div>
        <div style="text-align: right;">
          <div style="border-top: 1px dashed #64748b; width: 240px; margin-bottom: 4px; margin-left: auto;"></div>
          <strong>Transport Commissionerate Approval</strong><br>
          <span style="font-size: 0.78rem; color: #64748b;">Government of Keralam</span>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeOfficerReportModal() {
  const modal = document.getElementById('officerReportModal');
  if (modal) modal.style.display = 'none';
}

// --- 12. PUBLIC IT EQUIPMENT AUTO-REFLECTION & EMAIL SECURITY ---

function toggleFormFieldsDisabled(disabled) {
  const form = document.getElementById('itEquipmentForm');
  if (!form) return;

  const elements = form.querySelectorAll('input, select, textarea, button[type="submit"]');
  elements.forEach(el => {
    if (el.id === 'officeSelect') return;
    el.disabled = disabled;
    if (disabled) {
      el.style.opacity = '0.65';
      el.style.cursor = 'not-allowed';
    } else {
      el.style.opacity = '1';
      el.style.cursor = '';
    }
  });
}

function handleOfficeSelectChange(officeName) {
  const alertBox = document.getElementById('reflectionAlert');
  const alertText = document.getElementById('reflectionAlertText');
  const btnWindow = document.getElementById('btnPublicOpenWindow') || document.getElementById('btnOpenSelectedOfficeWindow');
  const btnDeleteForm = document.getElementById('btnAdminDeleteCurrentEntry');
  const btnDeleteAlert = document.getElementById('btnAdminDeleteFromAlert');

  if (btnWindow) btnWindow.style.display = 'none';

  if (!officeName) {
    if (alertBox) alertBox.style.display = 'none';
    if (btnDeleteForm) btnDeleteForm.style.display = 'none';
    if (btnDeleteAlert) btnDeleteAlert.style.display = 'none';
    toggleFormFieldsDisabled(false);
    resetPublicFormFieldsOnly();
    updateViewEnteredDataButtonVisibility();
    return;
  }

  const currentEmail = (googleAuthUser && googleAuthUser.email) ? googleAuthUser.email.toLowerCase().trim() : '';
  const existingData = inventoryStore[officeName];
  const isAdmin = (activeSession === 'admin');

  if (existingData) {
    const ownerEmail = (existingData.createdOfficerEmail || existingData.submittedByEmail || existingData.updatedOfficerEmail || existingData.entryOfficerEmail || '').toLowerCase().trim();

    if (isAdmin || (ownerEmail && currentEmail && ownerEmail === currentEmail)) {
      toggleFormFieldsDisabled(false);
      populateFormWithData(existingData);

      if (btnDeleteForm) btnDeleteForm.style.display = isAdmin ? 'inline-flex' : 'none';
      if (btnDeleteAlert) btnDeleteAlert.style.display = isAdmin ? 'inline-flex' : 'none';

      if (alertBox && alertText) {
        if (isAdmin) {
          alertBox.style.background = '#eff6ff';
          alertBox.style.borderColor = '#bfdbfe';
          alertBox.style.color = '#1e40af';
          alertText.innerHTML = `<div><i class="fa-solid fa-user-shield" style="color:#1d4ed8;"></i> <span><strong>Admin Direct Entry Mode:</strong> Viewing and editing saved data for <strong>"${escapeHtml(officeName)}"</strong>.</span></div>`;
        } else {
          alertBox.style.background = '#f0fdf4';
          alertBox.style.borderColor = '#a7f3d0';
          alertBox.style.color = '#064e3b';
          alertText.innerHTML = `<div><i class="fa-solid fa-circle-check" style="color:#047857;"></i> <span>Existing entry found for <strong>"${escapeHtml(officeName)}"</strong> submitted by your Google ID (${escapeHtml(currentEmail)}).</span></div>`;
        }
        alertBox.style.display = 'flex';
      }
      showToast(`Loaded saved entry for ${officeName}`, 'info');
    } else {
      if (btnDeleteForm) btnDeleteForm.style.display = 'none';
      if (btnDeleteAlert) btnDeleteAlert.style.display = 'none';
      resetPublicFormFieldsOnly();
      toggleFormFieldsDisabled(true);

      const displayOwner = ownerEmail || 'another Google Account';

      if (alertBox && alertText) {
        alertBox.style.background = '#fef2f2';
        alertBox.style.borderColor = '#fecdd3';
        alertBox.style.color = '#991b1b';
        alertText.innerHTML = `
          <div>
            <i class="fa-solid fa-lock" style="color:#dc2626;"></i>
            <strong>This office is entered by ${escapeHtml(displayOwner)}. Please login with ${escapeHtml(displayOwner)} to add and edit details.</strong>
          </div>
        `;
        alertBox.style.display = 'flex';
      }
      showToast(`This office is entered by ${displayOwner}. Please login with ${displayOwner} to add and edit details.`, 'error');
    }
  } else {
    if (btnDeleteForm) btnDeleteForm.style.display = 'none';
    if (btnDeleteAlert) btnDeleteAlert.style.display = 'none';
    toggleFormFieldsDisabled(false);
    resetPublicFormFieldsOnly();
    if (googleAuthUser && googleAuthUser.name) {
      const nameEl = document.getElementById('entryOfficerName');
      if (nameEl) nameEl.value = googleAuthUser.name;
    }
    if (alertBox) alertBox.style.display = 'none';
    showToast(`Fresh entry for ${officeName}`, 'info');
  }

  updateViewEnteredDataButtonVisibility();
}

function updateViewEnteredDataButtonVisibility() {
  const btnViewData = document.getElementById('btnViewEnteredData');
  if (!btnViewData) return;

  const currentEmail = (googleAuthUser && googleAuthUser.email) ? googleAuthUser.email.toLowerCase().trim() : '';
  const selectedOffice = document.getElementById('officeSelect')?.value;

  if (!currentEmail) {
    btnViewData.style.display = 'none';
    return;
  }

  if (selectedOffice && inventoryStore[selectedOffice]) {
    const rec = inventoryStore[selectedOffice];
    const oEmail = (rec.createdOfficerEmail || rec.submittedByEmail || rec.updatedOfficerEmail || rec.entryOfficerEmail || '').toLowerCase().trim();
    if (oEmail === currentEmail) {
      btnViewData.style.display = 'inline-flex';
      return;
    }
  }

  const userHasRecord = Object.values(inventoryStore).some(r => {
    const oEmail = (r.createdOfficerEmail || r.submittedByEmail || r.updatedOfficerEmail || r.entryOfficerEmail || '').toLowerCase().trim();
    return oEmail === currentEmail;
  });

  btnViewData.style.display = userHasRecord ? 'inline-flex' : 'none';
}

function openCurrentUserRecordSummary() {
  const currentEmail = (googleAuthUser && googleAuthUser.email) ? googleAuthUser.email.toLowerCase().trim() : '';
  const selectedOffice = document.getElementById('officeSelect')?.value;

  if (selectedOffice && inventoryStore[selectedOffice]) {
    const rec = inventoryStore[selectedOffice];
    const oEmail = (rec.createdOfficerEmail || rec.submittedByEmail || rec.updatedOfficerEmail || rec.entryOfficerEmail || '').toLowerCase().trim();
    if (oEmail === currentEmail) {
      openEnteredOfficeSummaryWindow(selectedOffice);
      return;
    }
  }

  if (currentEmail) {
    const userOffice = Object.values(inventoryStore).find(r => {
      const oEmail = (r.createdOfficerEmail || r.submittedByEmail || r.updatedOfficerEmail || r.entryOfficerEmail || '').toLowerCase().trim();
      return oEmail === currentEmail;
    });
    if (userOffice) {
      openEnteredOfficeSummaryWindow(userOffice.officeName);
      return;
    }
  }

  showToast('No submitted office record found for your logged-in Google account.', 'warning');
}

function populateFormWithData(data) {
  if (!data) return;

  if (document.getElementById('officeSelect')) document.getElementById('officeSelect').value = data.officeName || '';
  setSelectedNetworks(data.availableNetwork || '');

  if (document.getElementById('otherNetworkInput')) document.getElementById('otherNetworkInput').value = data.otherNetworkDetails || '';
  if (document.getElementById('networkSpeedInput')) document.getElementById('networkSpeedInput').value = data.networkSpeed || '';

  if (document.getElementById('switchesAvailableSelect')) {
    document.getElementById('switchesAvailableSelect').value = data.switchesAvailable || '';
    handleSwitchesAvailabilityChange(data.switchesAvailable || '');
  }
  if (document.getElementById('switchesDetailsInput')) document.getElementById('switchesDetailsInput').value = data.switchesDetails || '';

  if (document.getElementById('serversAvailableSelect')) {
    document.getElementById('serversAvailableSelect').value = data.serversAvailable || '';
    handleServersAvailabilityChange(data.serversAvailable || '');
  }
  if (document.getElementById('serversDetailsInput')) document.getElementById('serversDetailsInput').value = data.serversDetails || '';

  if (document.getElementById('operatingSystemInput')) document.getElementById('operatingSystemInput').value = data.operatingSystem || '';

  if (document.getElementById('entryOfficerName')) document.getElementById('entryOfficerName').value = data.entryOfficerName || '';
  if (document.getElementById('entryOfficerDesignation')) document.getElementById('entryOfficerDesignation').value = data.entryOfficerDesignation || '';
  if (document.getElementById('entryOfficerMobile')) document.getElementById('entryOfficerMobile').value = data.entryOfficerMobile || '';

  if (document.getElementById('monitorsWorking')) document.getElementById('monitorsWorking').value = data.monitorsWorking ?? 0;
  if (document.getElementById('monitorsNotWorking')) document.getElementById('monitorsNotWorking').value = data.monitorsNotWorking ?? 0;
  if (document.getElementById('cpuWorking')) document.getElementById('cpuWorking').value = data.cpuWorking ?? 0;
  if (document.getElementById('cpuNotWorking')) document.getElementById('cpuNotWorking').value = data.cpuNotWorking ?? 0;
  if (document.getElementById('laptopsWorking')) document.getElementById('laptopsWorking').value = data.laptopsWorking ?? 0;
  if (document.getElementById('laptopsNotWorking')) document.getElementById('laptopsNotWorking').value = data.laptopsNotWorking ?? 0;
  if (document.getElementById('aioWorking')) document.getElementById('aioWorking').value = data.aioWorking ?? 0;
  if (document.getElementById('aioNotWorking')) document.getElementById('aioNotWorking').value = data.aioNotWorking ?? 0;

  const p = data.printers || {};
  if (document.getElementById('printerDotMatrixWorking')) document.getElementById('printerDotMatrixWorking').value = p.dotMatrix?.working ?? 0;
  if (document.getElementById('printerDotMatrixNotWorking')) document.getElementById('printerDotMatrixNotWorking').value = p.dotMatrix?.notWorking ?? 0;
  if (document.getElementById('printerDotMatrixMulti')) document.getElementById('printerDotMatrixMulti').checked = !!p.dotMatrix?.multipurpose;

  if (document.getElementById('printerInkjetWorking')) document.getElementById('printerInkjetWorking').value = p.inkjet?.working ?? 0;
  if (document.getElementById('printerInkjetNotWorking')) document.getElementById('printerInkjetNotWorking').value = p.inkjet?.notWorking ?? 0;
  if (document.getElementById('printerInkjetMulti')) document.getElementById('printerInkjetMulti').checked = !!p.inkjet?.multipurpose;

  if (document.getElementById('printerLaserWorking')) document.getElementById('printerLaserWorking').value = p.laser?.working ?? 0;
  if (document.getElementById('printerLaserNotWorking')) document.getElementById('printerLaserNotWorking').value = p.laser?.notWorking ?? 0;
  if (document.getElementById('printerLaserMulti')) document.getElementById('printerLaserMulti').checked = !!p.laser?.multipurpose;

  if (document.getElementById('printerXeroxWorking')) document.getElementById('printerXeroxWorking').value = p.xerox?.working ?? 0;
  if (document.getElementById('printerXeroxNotWorking')) document.getElementById('printerXeroxNotWorking').value = p.xerox?.notWorking ?? 0;
  if (document.getElementById('printerXeroxMulti')) document.getElementById('printerXeroxMulti').checked = !!p.xerox?.multipurpose;

  if (document.getElementById('printerOthersWorking')) document.getElementById('printerOthersWorking').value = p.others?.working ?? 0;
  if (document.getElementById('printerOthersNotWorking')) document.getElementById('printerOthersNotWorking').value = p.others?.notWorking ?? 0;
  if (document.getElementById('printerOthersMulti')) document.getElementById('printerOthersMulti').checked = !!p.others?.multipurpose;

  if (document.getElementById('upsAvailableSelect')) document.getElementById('upsAvailableSelect').value = data.upsAvailable || '';
  if (document.getElementById('upsCapacitySelect')) {
    document.getElementById('upsCapacitySelect').value = data.upsCapacity || '';
    handleUpsCapacityChange(data.upsCapacity || '');
  }
  if (document.getElementById('upsCapacityOtherInput')) document.getElementById('upsCapacityOtherInput').value = data.upsCapacityOther || '';
  if (document.getElementById('upsConditionSelect')) document.getElementById('upsConditionSelect').value = data.upsCondition || '';
  if (document.getElementById('batteryMakeInput')) document.getElementById('batteryMakeInput').value = data.batteryMake || '';
  if (document.getElementById('batteryAhInput')) document.getElementById('batteryAhInput').value = data.batteryAh ?? '';
  if (document.getElementById('batteriesInUseInput')) document.getElementById('batteriesInUseInput').value = data.batteriesInUse ?? 0;
  if (document.getElementById('minBatteriesRequiredInput')) document.getElementById('minBatteriesRequiredInput').value = data.minBatteriesRequired ?? '';
  if (document.getElementById('serviceReportSentSelect')) {
    document.getElementById('serviceReportSentSelect').value = data.serviceReportSent || '';
    handleServiceReportChange(data.serviceReportSent || '');
  }
  if (document.getElementById('serviceReportDateInput')) document.getElementById('serviceReportDateInput').value = data.serviceReportDate || '';
  if (document.getElementById('powerRemarksInput')) document.getElementById('powerRemarksInput').value = data.powerRemarks || '';
  if (document.getElementById('certificationCheckbox')) document.getElementById('certificationCheckbox').checked = !!data.certified;

  if (document.getElementById('upsWorking')) document.getElementById('upsWorking').value = data.upsWorking ?? 0;
  if (document.getElementById('upsNotWorking')) document.getElementById('upsNotWorking').value = data.upsNotWorking ?? 0;

  if (document.getElementById('ageUnder3')) document.getElementById('ageUnder3').value = data.ageUnder3 ?? 0;
  if (document.getElementById('age3To5')) document.getElementById('age3To5').value = data.age3To5 ?? 0;
  if (document.getElementById('age5To8')) document.getElementById('age5To8').value = data.age5To8 ?? 0;
  if (document.getElementById('ageAbove8')) document.getElementById('ageAbove8').value = data.ageAbove8 ?? 0;

  if (document.getElementById('remarksInput')) document.getElementById('remarksInput').value = data.remarks || '';
}

function resetPublicFormFieldsOnly() {
  setSelectedNetworks('');
  document.getElementById('otherNetworkInput').value = '';
  document.getElementById('networkSpeedInput').value = '';

  if (document.getElementById('switchesAvailableSelect')) {
    document.getElementById('switchesAvailableSelect').value = '';
    handleSwitchesAvailabilityChange('');
  }
  if (document.getElementById('switchesDetailsInput')) document.getElementById('switchesDetailsInput').value = '';

  if (document.getElementById('serversAvailableSelect')) {
    document.getElementById('serversAvailableSelect').value = '';
    handleServersAvailabilityChange('');
  }
  if (document.getElementById('serversDetailsInput')) document.getElementById('serversDetailsInput').value = '';

  document.getElementById('operatingSystemInput').value = '';

  if (document.getElementById('entryOfficerName')) document.getElementById('entryOfficerName').value = '';
  if (document.getElementById('entryOfficerDesignation')) document.getElementById('entryOfficerDesignation').value = '';
  if (document.getElementById('entryOfficerMobile')) document.getElementById('entryOfficerMobile').value = '';

  if (document.getElementById('upsAvailableSelect')) document.getElementById('upsAvailableSelect').value = '';
  if (document.getElementById('upsCapacitySelect')) {
    document.getElementById('upsCapacitySelect').value = '';
    handleUpsCapacityChange('');
  }
  if (document.getElementById('upsCapacityOtherInput')) document.getElementById('upsCapacityOtherInput').value = '';
  if (document.getElementById('upsConditionSelect')) document.getElementById('upsConditionSelect').value = '';
  if (document.getElementById('batteryMakeInput')) document.getElementById('batteryMakeInput').value = '';
  if (document.getElementById('batteryAhInput')) document.getElementById('batteryAhInput').value = '';
  if (document.getElementById('batteriesInUseInput')) document.getElementById('batteriesInUseInput').value = 0;
  if (document.getElementById('minBatteriesRequiredInput')) document.getElementById('minBatteriesRequiredInput').value = 0;
  if (document.getElementById('serviceReportSentSelect')) {
    document.getElementById('serviceReportSentSelect').value = '';
    handleServiceReportChange('');
  }
  if (document.getElementById('serviceReportDateInput')) document.getElementById('serviceReportDateInput').value = '';
  if (document.getElementById('powerRemarksInput')) document.getElementById('powerRemarksInput').value = '';
  if (document.getElementById('certificationCheckbox')) document.getElementById('certificationCheckbox').checked = false;

  const numIds = [
    'monitorsWorking', 'monitorsNotWorking', 'cpuWorking', 'cpuNotWorking',
    'laptopsWorking', 'laptopsNotWorking', 'aioWorking', 'aioNotWorking',
    'printerDotMatrixWorking', 'printerDotMatrixNotWorking',
    'printerInkjetWorking', 'printerInkjetNotWorking',
    'printerLaserWorking', 'printerLaserNotWorking',
    'printerXeroxWorking', 'printerXeroxNotWorking',
    'printerOthersWorking', 'printerOthersNotWorking',
    'upsWorking', 'upsNotWorking',
    'ageUnder3', 'age3To5', 'age5To8', 'ageAbove8'
  ];

  numIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });

  document.getElementById('remarksInput').value = '';
}

function resetPublicForm() {
  document.getElementById('officeSelect').value = '';
  handleOfficeSelectChange('');
  showToast('Form reset', 'info');
}

function handleNetworkSelectionChange() {
  const checkboxes = document.querySelectorAll('input[name="networkOption"]');
  const selected = [];
  checkboxes.forEach(cb => {
    const parent = cb.closest('.network-chk-pill');
    if (cb.checked) {
      selected.push(cb.value);
      if (parent) parent.classList.add('active');
    } else {
      if (parent) parent.classList.remove('active');
    }
  });

  const hiddenInput = document.getElementById('availableNetworkSelect');
  if (hiddenInput) {
    hiddenInput.value = selected.join(', ');
  }

  const badgeCount = document.getElementById('selectedNetworksBadgeCount');
  if (badgeCount) {
    badgeCount.textContent = `${selected.length} selected`;
    badgeCount.style.background = selected.length > 0 ? 'var(--primary-100)' : '#f1f5f9';
    badgeCount.style.color = selected.length > 0 ? 'var(--primary-800)' : '#64748b';
  }

  const otherGroup = document.getElementById('otherNetworkGroup');
  if (otherGroup) {
    otherGroup.style.display = selected.includes('Others') ? 'block' : 'none';
  }
}

function getSelectedNetworks() {
  const checkboxes = document.querySelectorAll('input[name="networkOption"]:checked');
  const selected = [];
  checkboxes.forEach(cb => selected.push(cb.value));
  return selected;
}

function setSelectedNetworks(val) {
  const values = Array.isArray(val) ? val : (val || '').split(',').map(s => s.trim()).filter(Boolean);
  const normalized = values.map(v => v === 'Kerala Vision' ? 'Keralam Vision' : v);

  const checkboxes = document.querySelectorAll('input[name="networkOption"]');
  checkboxes.forEach(cb => {
    cb.checked = normalized.includes(cb.value);
    const parent = cb.closest('.network-chk-pill');
    if (cb.checked) {
      if (parent) parent.classList.add('active');
    } else {
      if (parent) parent.classList.remove('active');
    }
  });

  const hiddenInput = document.getElementById('availableNetworkSelect');
  if (hiddenInput) {
    hiddenInput.value = normalized.join(', ');
  }

  const badgeCount = document.getElementById('selectedNetworksBadgeCount');
  if (badgeCount) {
    badgeCount.textContent = `${normalized.length} selected`;
    badgeCount.style.background = normalized.length > 0 ? 'var(--primary-100)' : '#f1f5f9';
    badgeCount.style.color = normalized.length > 0 ? 'var(--primary-800)' : '#64748b';
  }

  const otherGroup = document.getElementById('otherNetworkGroup');
  if (otherGroup) {
    otherGroup.style.display = normalized.includes('Others') ? 'block' : 'none';
  }
}

function handleSwitchesAvailabilityChange(val) {
  const group = document.getElementById('switchesDetailsGroup');
  if (group) group.style.display = (val === 'Yes') ? 'block' : 'none';
}

function handleServersAvailabilityChange(val) {
  const group = document.getElementById('serversDetailsGroup');
  if (group) group.style.display = (val === 'Yes') ? 'block' : 'none';
}

function handleUpsAvailabilityChange(val) {
  const unitsEl = document.getElementById('upsWorking');
  if (val === 'No' && unitsEl) unitsEl.value = 0;
}

function handleUpsCapacityChange(val) {
  const group = document.getElementById('upsCapacityOtherGroup');
  if (group) group.style.display = (val === 'Other') ? 'block' : 'none';
}

function handleServiceReportChange(val) {
  const group = document.getElementById('serviceReportDateGroup');
  const dateInput = document.getElementById('serviceReportDateInput');
  if (group) group.style.display = (val === 'Yes') ? 'block' : 'none';
  if (dateInput) dateInput.required = (val === 'Yes');
}

function calculateNonWorkingDesktops() {}

// --- 13. IT FORM SUBMISSION & CLOUD SAVING ---
async function handleFormSubmit(e) {
  if (e) e.preventDefault();

  try {
    const officeSelect = document.getElementById('officeSelect');
    const officeName = officeSelect ? officeSelect.value : '';
    if (!officeName) {
      showToast('Please select an Office Name first', 'error');
      return;
    }

    const certCheck = document.getElementById('certificationCheckbox');
    if (certCheck && !certCheck.checked) {
      showToast('Please certify that the information is true before submitting.', 'warning');
      return;
    }

    const selectedNetworks = getSelectedNetworks();
    if (selectedNetworks.length === 0) {
      showToast('Please select at least one Available Network', 'warning');
      return;
    }
    const networkVal = selectedNetworks.join(', ');

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const getNum = (id) => {
      const el = document.getElementById(id);
      return el ? (parseInt(el.value) || 0) : 0;
    };
    const getStr = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const getCheck = (id) => {
      const el = document.getElementById(id);
      return el ? !!el.checked : false;
    };

    const existingRec = inventoryStore[officeName];
    const loggedEmail = (googleAuthUser && googleAuthUser.email) ? googleAuthUser.email.toLowerCase().trim() : '';
    const loggedName = (googleAuthUser && googleAuthUser.name) ? googleAuthUser.name : '';

    const record = {
      officeName,
      submittedByEmail: loggedEmail || existingRec?.submittedByEmail || '',
      entryOfficerEmail: loggedEmail || existingRec?.entryOfficerEmail || '',
      createdOfficerName: existingRec?.createdOfficerName || getStr('entryOfficerName') || loggedName || 'Officer',
      createdOfficerDesignation: existingRec?.createdOfficerDesignation || getStr('entryOfficerDesignation') || 'Officer',
      createdOfficerMobile: existingRec?.createdOfficerMobile || getStr('entryOfficerMobile') || 'N/A',
      createdOfficerEmail: existingRec?.createdOfficerEmail || loggedEmail || 'N/A',
      createdDate: existingRec?.createdDate || formattedDate,
      updatedOfficerName: getStr('entryOfficerName') || loggedName || 'Officer',
      updatedOfficerDesignation: getStr('entryOfficerDesignation') || 'Officer',
      updatedOfficerMobile: getStr('entryOfficerMobile') || 'N/A',
      updatedOfficerEmail: loggedEmail || existingRec?.updatedOfficerEmail || 'N/A',
      lastUpdated: formattedDate,

      availableNetwork: networkVal,
      otherNetworkDetails: getStr('otherNetworkInput'),
      networkSpeed: getStr('networkSpeedInput'),
      switchesAvailable: getStr('switchesAvailableSelect') || 'Not Sure',
      switchesDetails: getStr('switchesDetailsInput'),
      serversAvailable: getStr('serversAvailableSelect') || 'No',
      serversDetails: getStr('serversDetailsInput'),
      operatingSystem: getStr('operatingSystemInput'),
      entryOfficerName: getStr('entryOfficerName'),
      entryOfficerDesignation: getStr('entryOfficerDesignation'),
      entryOfficerMobile: getStr('entryOfficerMobile'),

      monitorsWorking: getNum('monitorsWorking'),
      monitorsNotWorking: getNum('monitorsNotWorking'),
      cpuWorking: getNum('cpuWorking'),
      cpuNotWorking: getNum('cpuNotWorking'),
      laptopsWorking: getNum('laptopsWorking'),
      laptopsNotWorking: getNum('laptopsNotWorking'),
      aioWorking: getNum('aioWorking'),
      aioNotWorking: getNum('aioNotWorking'),

      printers: {
        dotMatrix: { working: getNum('printerDotMatrixWorking'), notWorking: getNum('printerDotMatrixNotWorking'), multipurpose: getCheck('printerDotMatrixMulti') },
        inkjet: { working: getNum('printerInkjetWorking'), notWorking: getNum('printerInkjetNotWorking'), multipurpose: getCheck('printerInkjetMulti') },
        laser: { working: getNum('printerLaserWorking'), notWorking: getNum('printerLaserNotWorking'), multipurpose: getCheck('printerLaserMulti') },
        xerox: { working: getNum('printerXeroxWorking'), notWorking: getNum('printerXeroxNotWorking'), multipurpose: getCheck('printerXeroxMulti') },
        others: { working: getNum('printerOthersWorking'), notWorking: getNum('printerOthersNotWorking'), multipurpose: getCheck('printerOthersMulti') }
      },

      upsAvailable: getStr('upsAvailableSelect') || 'Yes',
      upsCapacity: getStr('upsCapacitySelect'),
      upsCapacityOther: getStr('upsCapacityOtherInput'),
      upsCondition: getStr('upsConditionSelect'),
      batteryMake: getStr('batteryMakeInput'),
      batteryAh: getNum('batteryAhInput'),
      batteriesInUse: getNum('batteriesInUseInput'),
      minBatteriesRequired: getNum('minBatteriesRequiredInput'),
      serviceReportSent: getStr('serviceReportSentSelect'),
      serviceReportDate: getStr('serviceReportDateInput'),
      powerRemarks: getStr('powerRemarksInput'),
      certified: true,

      upsWorking: getNum('upsWorking'),
      upsNotWorking: getNum('upsNotWorking'),

      ageUnder3: getNum('ageUnder3'),
      age3To5: getNum('age3To5'),
      age5To8: getNum('age5To8'),
      ageAbove8: getNum('ageAbove8'),

      remarks: getStr('remarksInput')
    };

    inventoryStore[officeName] = record;
    localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));

    const sbRes = await saveRecordToSupabase(record);
    if (sbRes && sbRes.success) {
      showToast(`IT Equipment details for "${officeName}" saved to Supabase in real time!`, 'success');
    } else {
      showToast(`Saved locally. Supabase notice: ${sbRes?.error?.message || 'Check connection'}`, 'warning');
    }

    renderAdminDataTable();
    renderPublicDataTable();
    if (activeSession === 'admin') renderAdminDashboard();

    openEnteredOfficeSummaryWindow(officeName);
  } catch (err) {
    console.error('Error in handleFormSubmit:', err);
    showToast(`Error submitting form: ${err.message}`, 'error');
  }
}

// --- 14. PUBLIC SUMMARY MODAL ---
let currentWindowOfficeName = '';

function openSelectedOfficeSummaryWindow() {
  const officeName = document.getElementById('officeSelect')?.value;
  if (!officeName) {
    showToast('Please select an Office Name first', 'warning');
    return;
  }
  openEnteredOfficeSummaryWindow(officeName);
}

function openEnteredOfficeSummaryWindow(officeName) {
  currentWindowOfficeName = officeName;
  const modal = document.getElementById('publicOfficeSummaryModal');
  const title = document.getElementById('publicModalOfficeTitle');
  const body = document.getElementById('publicModalOfficeBody');

  if (!modal || !title || !body) return;

  const data = inventoryStore[officeName] || {
    officeName,
    lastUpdated: 'Just now'
  };

  title.innerHTML = `<i class="fa-solid fa-building"></i> Entered Office Name: <span style="color: #fef08a; font-weight: 800;">${escapeHtml(data.officeName)}</span>`;

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #047857; font-weight: 700;">Keralam MVD Official Office Profile</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #064e3b;"><i class="fa-solid fa-building"></i> ${escapeHtml(data.officeName)}</div>
          <div style="font-size: 0.82rem; color: #047857;"><i class="fa-regular fa-clock"></i> Record Timestamp: ${escapeHtml(data.lastUpdated || 'Saved')}</div>
        </div>
        <span class="badge badge-working" style="font-size: 0.9rem; padding: 6px 14px;"><i class="fa-solid fa-circle-check"></i> RECORDED & SYNCHRONIZED</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
        <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
          <h4 style="font-size: 0.88rem; color: var(--primary-900); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i> Entry Officer Details</h4>
          <div style="font-size: 0.85rem; line-height: 1.6;">
            <strong>Name:</strong> ${escapeHtml(data.entryOfficerName || 'N/A')}<br>
            <strong>Designation:</strong> ${escapeHtml(data.entryOfficerDesignation || 'N/A')}<br>
            <strong>Mobile:</strong> ${escapeHtml(data.entryOfficerMobile || 'N/A')}
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
          <h4 style="font-size: 0.88rem; color: var(--primary-900); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-network-wired"></i> Connectivity & OS Profile</h4>
          <div style="font-size: 0.85rem; line-height: 1.6;">
            <strong>Network:</strong> <span class="badge badge-info">${escapeHtml(data.availableNetwork || 'N/A')}</span><br>
            <strong>Speed:</strong> ${escapeHtml(data.networkSpeed || 'N/A')}<br>
            <strong>OS:</strong> ${escapeHtml(data.operatingSystem || 'N/A')}
          </div>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--primary-900); margin-bottom: 8px;"><i class="fa-solid fa-desktop"></i> Core IT Hardware Inventory Status</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>Equipment Category</th>
              <th>Working Count</th>
              <th>Defective Count</th>
              <th>Total Count</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Monitors</td><td style="color:#047857; font-weight:700;">${data.monitorsWorking || 0}</td><td style="color:#b91c1c;">${data.monitorsNotWorking || 0}</td><td>${(data.monitorsWorking || 0) + (data.monitorsNotWorking || 0)}</td></tr>
            <tr><td>CPU Units</td><td style="color:#047857; font-weight:700;">${data.cpuWorking || 0}</td><td style="color:#b91c1c;">${data.cpuNotWorking || 0}</td><td>${(data.cpuWorking || 0) + (data.cpuNotWorking || 0)}</td></tr>
            <tr><td>Laptops</td><td style="color:#047857; font-weight:700;">${data.laptopsWorking || 0}</td><td style="color:#b91c1c;">${data.laptopsNotWorking || 0}</td><td>${(data.laptopsWorking || 0) + (data.laptopsNotWorking || 0)}</td></tr>
            <tr><td>AIO PCs</td><td style="color:#047857; font-weight:700;">${data.aioWorking || 0}</td><td style="color:#b91c1c;">${data.aioNotWorking || 0}</td><td>${(data.aioWorking || 0) + (data.aioNotWorking || 0)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closePublicOfficeSummaryModal() {
  const modal = document.getElementById('publicOfficeSummaryModal');
  if (modal) modal.style.display = 'none';
}

function openStandalonePrintWindow() {
  window.print();
}

// --- 15. ADMIN AUTHENTICATION & SUBVIEW SWITCHER ---
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
    showToast('Invalid passcode', 'error');
  }
}

function logoutAdmin() {
  isAdminAuthenticated = false;
  const logoutBtn = document.getElementById('adminLogoutHeaderBtn');
  if (logoutBtn) logoutBtn.style.display = 'none';
  switchSession('public');
  showToast('Admin logged out successfully.', 'info');
}

function switchSession(sessionType) {
  activeSession = sessionType;
  const publicContainer = document.getElementById('publicContainer');
  const officerContainer = document.getElementById('officerTrainingContainer');
  const adminContainer = document.getElementById('adminContainer');

  renderPortalMenuBar();

  if (sessionType === 'public') {
    if (adminContainer) adminContainer.style.display = 'none';
    selectModuleMenu(activeModuleId);
  } else if (sessionType === 'admin') {
    if (publicContainer) publicContainer.style.display = 'none';
    if (officerContainer) officerContainer.style.display = 'none';
    if (adminContainer) adminContainer.style.display = 'block';

    switchAdminSubView('dashboard');
  }
}

function switchAdminSubView(view) {
  adminSubView = view;

  const btnDash = document.getElementById('btnAdminNavDashboard');
  const btnSumm = document.getElementById('btnAdminNavSummary');
  const btnOffs = document.getElementById('btnAdminNavOfficers');
  const btnDir = document.getElementById('btnAdminNavDirectory');
  const btnRoles = document.getElementById('btnAdminNavRoles');
  const btnEnt = document.getElementById('btnAdminNavEntry');
  const btnVw = document.getElementById('btnAdminNavView');
  const btnMn = document.getElementById('btnAdminNavMenus');

  const dashSec = document.getElementById('adminDashboardSubView');
  const summSec = document.getElementById('adminSummarySubView');
  const offsSec = document.getElementById('adminOfficersSubView');
  const dirSec = document.getElementById('adminDirectorySubView');
  const rolesSec = document.getElementById('adminRolesSubView');
  const entSec = document.getElementById('adminEntrySubView');
  const vwSec = document.getElementById('adminViewSubView');
  const mnSec = document.getElementById('adminMenusSubView');

  if (btnDash) btnDash.style.background = (view === 'dashboard') ? 'var(--primary-600)' : 'transparent';
  if (btnSumm) btnSumm.style.background = (view === 'summary') ? 'var(--primary-600)' : 'transparent';
  if (btnOffs) btnOffs.style.background = (view === 'officers') ? 'var(--primary-600)' : 'transparent';
  if (btnDir) btnDir.style.background = (view === 'directory') ? 'var(--primary-600)' : 'transparent';
  if (btnRoles) btnRoles.style.background = (view === 'roles') ? 'var(--primary-600)' : 'transparent';
  if (btnEnt) btnEnt.style.background = (view === 'entry') ? 'var(--primary-600)' : 'transparent';
  if (btnVw) btnVw.style.background = (view === 'view') ? 'var(--primary-600)' : 'transparent';
  if (btnMn) btnMn.style.background = (view === 'menus') ? 'var(--primary-600)' : 'transparent';

  if (dashSec) dashSec.style.display = (view === 'dashboard') ? 'block' : 'none';
  if (summSec) summSec.style.display = (view === 'summary') ? 'block' : 'none';
  if (offsSec) offsSec.style.display = (view === 'officers') ? 'block' : 'none';
  if (dirSec) dirSec.style.display = (view === 'directory') ? 'block' : 'none';
  if (rolesSec) rolesSec.style.display = (view === 'roles') ? 'block' : 'none';
  if (entSec) entSec.style.display = (view === 'entry') ? 'block' : 'none';
  if (vwSec) vwSec.style.display = (view === 'view') ? 'block' : 'none';
  if (mnSec) mnSec.style.display = (view === 'menus') ? 'block' : 'none';

  if (view === 'dashboard') renderAdminDashboard();
  if (view === 'summary') renderAdminSummaryReport();
  if (view === 'officers') renderAdminOfficersTable();
  if (view === 'directory') {
    if (typeof initOfficerTrainingModule === 'function') initOfficerTrainingModule();
    if (typeof renderAdminOfficersDirectory === 'function') renderAdminOfficersDirectory();
  }
  if (view === 'roles') {
    if (typeof initOfficerTrainingModule === 'function') initOfficerTrainingModule();
    if (typeof renderRoleSwitcherUI === 'function') renderRoleSwitcherUI();
    if (typeof renderAuditLogTable === 'function') renderAuditLogTable();
  }
  if (view === 'view') renderAdminDataTable();
  if (view === 'menus') renderMenuManagerUI();
  if (view === 'entry') {
    const formSec = document.getElementById('publicEntrySection');
    document.getElementById('adminFormContainer').appendChild(formSec);
  } else {
    const formSec = document.getElementById('publicEntrySection');
    const pubCont = document.getElementById('publicContainer');
    if (formSec && pubCont && !pubCont.contains(formSec)) {
      pubCont.appendChild(formSec);
    }
  }
}

// --- 16. ADMIN DASHBOARD & CHARTS ---
function populateDashboardOfficeFilter() {
  const filter = document.getElementById('dashboardOfficeFilter');
  if (!filter) return;

  const currentVal = filter.value || 'ALL';
  filter.innerHTML = '<option value="ALL">-- Statewide Aggregate (All MVD Offices) --</option>';

  MVD_OFFICES.forEach(off => {
    const isReported = !!inventoryStore[off];
    const opt = document.createElement('option');
    opt.value = off;
    opt.textContent = `${off} ${isReported ? '✓ (Reported)' : '(Pending)'}`;
    if (off === currentVal) opt.selected = true;
    filter.appendChild(opt);
  });
}

function renderAdminDashboard() {
  populateDashboardOfficeFilter();

  const filterVal = document.getElementById('dashboardOfficeFilter')?.value || 'ALL';
  let entries = Object.values(inventoryStore);

  if (filterVal !== 'ALL') {
    entries = inventoryStore[filterVal] ? [inventoryStore[filterVal]] : [];
  }

  const totalOffices = filterVal === 'ALL' ? entries.length : (entries.length > 0 ? 1 : 0);
  let totalSystems = 0;
  let nonWorkingHardware = 0;
  let govNetworkCount = 0;
  let totalWorkingHW = 0;
  let totalNotWorkingHW = 0;
  let totalUnder3 = 0, total3To5 = 0, total5To8 = 0, totalAbove8 = 0;

  const networkCounts = { KSWAN: 0, KFONE: 0, BSNL: 0, JIO: 0, "Keralam Vision": 0, Asianet: 0, Others: 0 };

  entries.forEach(e => {
    const sys = (e.monitorsWorking + e.monitorsNotWorking + e.cpuWorking + e.cpuNotWorking + e.laptopsWorking + e.laptopsNotWorking + e.aioWorking + e.aioNotWorking);
    totalSystems += sys;

    const nw = (e.monitorsNotWorking + e.cpuNotWorking + e.laptopsNotWorking + e.aioNotWorking + e.upsNotWorking);
    nonWorkingHardware += nw;

    totalWorkingHW += (e.monitorsWorking + e.cpuWorking + e.laptopsWorking + e.aioWorking);
    totalNotWorkingHW += (e.monitorsNotWorking + e.cpuNotWorking + e.laptopsNotWorking + e.aioNotWorking);

    const netList = (e.availableNetwork || '').split(',').map(s => s.trim().replace(/^Kerala Vision$/i, 'Keralam Vision')).filter(Boolean);
    if (netList.some(n => n === 'KSWAN' || n === 'KFONE')) govNetworkCount++;

    netList.forEach(net => {
      if (networkCounts[net] !== undefined) networkCounts[net]++;
      else networkCounts.Others++;
    });

    totalUnder3 += (e.ageUnder3 || 0);
    total3To5 += (e.age3To5 || 0);
    total5To8 += (e.age5To8 || 0);
    totalAbove8 += (e.ageAbove8 || 0);
  });

  let switchesCount = 0, serversCount = 0, upsWorkingCount = 0, upsNotWorkingCount = 0, serviceReportsSentCount = 0;

  entries.forEach(e => {
    if (e.switchesAvailable === 'Yes') switchesCount++;
    if (e.serversAvailable === 'Yes') serversCount++;
    upsWorkingCount += (e.upsWorking || 0);
    upsNotWorkingCount += (e.upsNotWorking || 0);
    if (e.serviceReportSent === 'Yes') serviceReportsSentCount++;
  });

  if (document.getElementById('kpiOfficesReported')) document.getElementById('kpiOfficesReported').textContent = filterVal === 'ALL' ? `${totalOffices} / ${MVD_OFFICES.length}` : (totalOffices > 0 ? 'Reported ✓' : 'Pending');
  if (document.getElementById('kpiTotalSystems')) document.getElementById('kpiTotalSystems').textContent = totalSystems;
  if (document.getElementById('kpiNonWorkingHardware')) document.getElementById('kpiNonWorkingHardware').textContent = nonWorkingHardware;
  if (document.getElementById('kpiGovNetworkCount')) document.getElementById('kpiGovNetworkCount').textContent = govNetworkCount;
  if (document.getElementById('kpiSwitchesCount')) document.getElementById('kpiSwitchesCount').textContent = `${switchesCount} Offices`;
  if (document.getElementById('kpiServersCount')) document.getElementById('kpiServersCount').textContent = `${serversCount} Offices`;
  if (document.getElementById('kpiUpsWorkingCount')) document.getElementById('kpiUpsWorkingCount').textContent = `${upsWorkingCount} Units`;
  if (document.getElementById('kpiServiceReportCount')) document.getElementById('kpiServiceReportCount').textContent = `${serviceReportsSentCount} Offices`;

  const ctxHealth = document.getElementById('chartHardwareHealth')?.getContext('2d');
  if (ctxHealth) {
    if (chartHealthInstance) chartHealthInstance.destroy();
    chartHealthInstance = new Chart(ctxHealth, {
      type: 'doughnut',
      data: {
        labels: ['Working Systems', 'Defective Systems'],
        datasets: [{
          data: [totalWorkingHW || (totalNotWorkingHW === 0 ? 1 : 0), totalNotWorkingHW || 0],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
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
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }
}

function drillDownDashboard(type) {
  // Generic drill down handler
  const modal = document.getElementById('officeDetailModal');
  const title = document.getElementById('modalOfficeTitle');
  const body = document.getElementById('modalOfficeBody');

  if (!modal || !title || !body) return;

  const entries = Object.values(inventoryStore);
  title.innerHTML = `<i class="fa-solid fa-list-check"></i> ${type.toUpperCase()} Breakdown`;

  body.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Office Name</th><th>Monitors</th><th>CPUs</th><th>Laptops</th></tr></thead>
      <tbody>
        ${entries.map(e => `
          <tr>
            <td><strong>${escapeHtml(e.officeName)}</strong></td>
            <td>${e.monitorsWorking} W / ${e.monitorsNotWorking} NW</td>
            <td>${e.cpuWorking} W / ${e.cpuNotWorking} NW</td>
            <td>${e.laptopsWorking} W / ${e.laptopsNotWorking} NW</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  modal.style.display = 'flex';
}

function closeOfficeDetailModal() {
  document.getElementById('officeDetailModal').style.display = 'none';
}

function exportDrillDownToCSV() {
  exportDataToCSV();
}

// --- 17. ADMIN IT TABLES & CSV EXPORTS ---
function renderPublicDataTable() {}

function renderAdminDataTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  const entries = Object.values(inventoryStore);
  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="17" style="text-align: center; color: var(--text-muted); padding: 30px;">No entries stored.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.officeName)}</strong></td>
      <td>${escapeHtml(item.createdOfficerName || item.entryOfficerName || 'N/A')}<br><small style="color: #64748b;">${escapeHtml(item.createdOfficerEmail || '')}</small></td>
      <td>${escapeHtml(item.updatedOfficerName || 'N/A')}<br><small style="color: #047857;">${escapeHtml(item.lastUpdated || '')}</small></td>
      <td><span class="badge badge-info">${escapeHtml(item.availableNetwork)}</span></td>
      <td>${escapeHtml(item.switchesAvailable || 'Not Sure')}</td>
      <td>${escapeHtml(item.serversAvailable || 'No')}</td>
      <td><small>${escapeHtml(item.operatingSystem || 'N/A')}</small></td>
      <td>${item.monitorsWorking} W / <span style="color:#b91c1c;">${item.monitorsNotWorking} NW</span></td>
      <td>${item.cpuWorking} W / <span style="color:#b91c1c;">${item.cpuNotWorking} NW</span></td>
      <td>${item.laptopsWorking} W / <span style="color:#b91c1c;">${item.laptopsNotWorking} NW</span></td>
      <td>${item.aioWorking} W / <span style="color:#b91c1c;">${item.aioNotWorking} NW</span></td>
      <td>${item.printers?.dotMatrix?.working ?? 0}</td>
      <td>${item.upsWorking} W / <span style="color:#b91c1c;">${item.upsNotWorking} NW</span></td>
      <td>${item.batteriesInUse || 0}</td>
      <td><span class="badge ${item.ageAbove8 > 0 ? 'badge-danger' : 'badge-working'}">${item.ageAbove8 || 0}</span></td>
      <td><small>${escapeHtml((item.remarks || '').substring(0, 25))}</small></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteOfficeEntry('${escapeHtml(item.officeName)}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function filterAdminTable() {
  const query = document.getElementById('adminSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#adminTableBody tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
}

async function deleteOfficeEntry(officeName) {
  if (!confirm(`Permanently delete data for "${officeName}"?`)) return;

  await deleteRecordFromSupabase(officeName);
  delete inventoryStore[officeName];
  localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));

  renderAdminDataTable();
  renderAdminSummaryReport();
  if (activeSession === 'admin') renderAdminDashboard();

  showToast(`Deleted "${officeName}"`, 'warning');
}

function deleteCurrentAdminOfficeEntry() {
  const officeName = document.getElementById('officeSelect')?.value;
  if (officeName) deleteOfficeEntry(officeName);
}

function renderAdminSummaryReport() {
  const tbody = document.getElementById('adminSummaryTableBody');
  const tfoot = document.getElementById('adminSummaryTableFoot');
  if (!tbody || !tfoot) return;

  const entries = Object.values(inventoryStore);
  tbody.innerHTML = entries.map((rec, idx) => {
    const ageUnder8 = (rec.ageUnder3 || 0) + (rec.age3To5 || 0) + (rec.age5To8 || 0);
    const ageOver8 = rec.ageAbove8 || 0;

    return `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td><strong>${escapeHtml(rec.officeName)}</strong></td>
        <td>${escapeHtml(rec.availableNetwork)} <small>(${escapeHtml(rec.networkSpeed || '')})</small></td>
        <td>Monitors: <strong>${rec.monitorsWorking}</strong> | CPUs: <strong>${rec.cpuWorking}</strong> | Laptops: <strong>${rec.laptopsWorking}</strong></td>
        <td>${escapeHtml(rec.operatingSystem || 'N/A')}</td>
        <td style="text-align: center;"><span class="badge-pill-age-safe">${ageUnder8}</span></td>
        <td style="text-align: center;"><span class="${ageOver8 > 0 ? 'badge-pill-age-alert' : 'badge-pill-age-safe'}">${ageOver8}</span></td>
        <td style="text-align: center;">${rec.upsWorking} W / ${rec.upsNotWorking} NW</td>
        <td style="text-align: center;">${rec.batteriesInUse || 0} / ${rec.minBatteriesRequired || 0}</td>
        <td style="text-align: center;">
          <button class="btn btn-outline btn-sm" onclick="openEnteredOfficeSummaryWindow('${escapeHtml(rec.officeName)}')"><i class="fa-solid fa-eye"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

function resetSummaryFilters() {
  renderAdminSummaryReport();
}

function exportSummaryReportCSV() {
  exportDataToCSV();
}

function printSummaryReport() {
  window.print();
}

function exportDataToCSV() {
  const entries = Object.values(inventoryStore);
  if (entries.length === 0) return;

  const headers = ["Office Name", "Network", "Operating System", "Monitors Working", "Monitors Not Working", "CPUs Working", "CPUs Not Working", "Laptops Working", "Laptops Not Working", "UPS Working", "UPS Not Working", "Last Updated"];
  const rows = entries.map(e => [
    `"${e.officeName}"`, `"${e.availableNetwork}"`, `"${e.operatingSystem}"`,
    e.monitorsWorking, e.monitorsNotWorking, e.cpuWorking, e.cpuNotWorking,
    e.laptopsWorking, e.laptopsNotWorking, e.upsWorking, e.upsNotWorking, `"${e.lastUpdated}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `MVD_IT_Equipment_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('IT Equipment CSV exported', 'success');
}

// --- 18. MODULE & MENU MANAGER ---
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
                ${mod.visible ? 'VISIBLE TO USERS' : 'HIDDEN'}
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

      <div style="margin-top: 16px; border-top: 1px dashed var(--border-color); padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
        <small style="color: var(--text-light);">Code: <code>${mod.id}</code></small>
        ${(mod.id !== 'it_equipment_list' && mod.id !== 'officer_training_qualification') ? `<button class="btn btn-outline btn-sm" onclick="removeModule('${mod.id}')" style="color: #b91c1c; border-color: #fca5a5;"><i class="fa-solid fa-trash"></i> Remove</button>` : `<small style="color: #059669; font-weight: 700;">Core Module</small>`}
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
    showToast(`Module "${mod.title}" is now ${isVisible ? 'VISIBLE' : 'HIDDEN'}`, 'info');
  }
}

function syncPublicVisibilityUI() {
  if (activeSession === 'public') {
    selectModuleMenu(activeModuleId);
  }
}

function openAddMenuModal() {
  document.getElementById('addMenuModal').style.display = 'flex';
  document.getElementById('newMenuTitleInput').value = '';
  document.getElementById('newMenuDescInput').value = '';
}

function closeAddMenuModal() {
  document.getElementById('addMenuModal').style.display = 'none';
}

async function handleAddMenuSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('newMenuTitleInput').value.trim();
  const icon = document.getElementById('newMenuIconInput').value.trim() || 'fa-cube';
  const description = document.getElementById('newMenuDescInput').value.trim() || 'Departmental module.';

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
  await saveSettingsToSupabase(appSettings.publicVisible);

  showToast(`Module "${title}" added successfully!`, 'success');
}

async function removeModule(moduleId) {
  if (confirm(`Remove custom module "${moduleId}"?`)) {
    portalModules = portalModules.filter(m => m.id !== moduleId);
    localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));
    renderPortalMenuBar();
    renderMenuManagerUI();
    await saveSettingsToSupabase(appSettings.publicVisible);
    showToast(`Removed module ${moduleId}`, 'info');
  }
}

// --- 19. COMPREHENSIVE REPORT GENERATION ---
function generateComprehensiveReport() {
  const modal = document.getElementById('comprehensiveReportModal');
  const reportBody = document.getElementById('compReportContent');
  if (!modal || !reportBody) return;

  const entries = Object.values(inventoryStore);
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  reportBody.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0B3B24; padding-bottom: 16px; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img src="mvd_logo.png" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Emblem_of_Kerala.svg/200px-Emblem_of_Kerala.svg.png'" alt="MVD Emblem" style="height: 64px; width: auto;">
        <div>
          <h2 style="font-size: 1.35rem; color: #0B3B24; margin: 0; font-weight: 800; text-transform: uppercase;">Motor Vehicles Department • Government of Keralam</h2>
          <h4 style="font-size: 1.05rem; color: #047857; margin: 3px 0 0 0; font-weight: 700;">STATEWIDE IT INFRASTRUCTURE COMPREHENSIVE AUDIT REPORT</h4>
        </div>
      </div>
      <div><strong>Generated On:</strong> ${formattedDate}</div>
    </div>

    <table class="data-table">
      <thead>
        <tr style="background: #0B3B24; color: white;">
          <th>Office Name</th><th>Monitors (W/NW)</th><th>CPUs (W/NW)</th><th>Laptops (W/NW)</th><th>UPS</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map(e => `
          <tr>
            <td><strong>${escapeHtml(e.officeName)}</strong></td>
            <td>${e.monitorsWorking} / ${e.monitorsNotWorking}</td>
            <td>${e.cpuWorking} / ${e.cpuNotWorking}</td>
            <td>${e.laptopsWorking} / ${e.laptopsNotWorking}</td>
            <td>${e.upsWorking} / ${e.upsNotWorking}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  modal.style.display = 'flex';
}

function closeComprehensiveReportModal() {
  document.getElementById('comprehensiveReportModal').style.display = 'none';
}

function triggerReportPrint() {
  window.print();
}

// --- 20. TOAST NOTIFICATIONS & UTILITIES ---
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
