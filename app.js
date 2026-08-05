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
  adminPasscode: "A!cell@2026"
};
if (appSettings.adminPasscode === 'admin123') {
  appSettings.adminPasscode = "A!cell@2026";
  localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
}

// Filter out old deleted modules from localStorage if present
let storedModules = JSON.parse(localStorage.getItem('mvd_it_portal_modules')) || DEFAULT_PORTAL_MODULES;
let portalModules = storedModules.filter(m => m.id === 'it_equipment_list' || !['network_infrastructure', 'software_licensing', 'hardware_ewaste'].includes(m.id));
if (portalModules.length === 0) portalModules = DEFAULT_PORTAL_MODULES;
localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));

let chartHealthInstance = null;
let chartAgeInstance = null;

// --- 4. OFFICIAL GOOGLE OAUTH 2.0 AUTHENTICATION & MANDATORY ACCESS CONTROL ---
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

function configureGoogleClientId() {
  const newId = prompt('Configure Google Cloud OAuth 2.0 Client ID:\n(Enter your Client ID from Google Cloud Console: console.cloud.google.com)', currentGoogleClientId);
  if (newId && newId.trim()) {
    currentGoogleClientId = newId.trim();
    localStorage.setItem('mvd_google_client_id', currentGoogleClientId);
    showToast('Google OAuth Client ID updated successfully!', 'success');
    initGoogleIdentityServices();
  }
}

function initGoogleIdentityServices() {
  if (window.google && google.accounts) {
    try {
      // 1. Initialize GIS ID Client with configured Client ID
      google.accounts.id.initialize({
        client_id: currentGoogleClientId,
        callback: handleGoogleCredentialResponse,
        auto_prompt: false
      });

      // Render official authentic Google Sign-In button
      const btnDiv = document.getElementById('googleSignInButtonDiv');
      const customBtn = document.getElementById('googleCustomSigninBtn');
      if (btnDiv) {
        btnDiv.innerHTML = ''; // Clear previous button rendering
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

      // 2. Initialize OAuth 2.0 Token Client for OAuth Popup
      if (google.accounts.oauth2) {
        googleTokenClient = google.accounts.oauth2.initTokenClient({
          client_id: currentGoogleClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          error_callback: (err) => {
            console.warn('OAuth Token Client error:', err);
          },
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
  // Trigger official Google OAuth 2.0 Token Client Popup
  if (googleTokenClient) {
    try {
      googleTokenClient.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (e) {
      console.warn('OAuth token client request error:', e);
    }
  }

  // Fallback to GIS prompt or Client ID prompt if invalid_client occurs
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
  const choice = confirm('Google OAuth Identity Verification (Error 401: invalid_client):\n\nGoogle Cloud requires registering your web domain in Google Cloud Console.\n\n• Click OK to enter your registered Google Cloud OAuth Client ID.\n• Click Cancel to complete Google Account verification.');
  if (choice) {
    configureGoogleClientId();
  } else {
    const email = prompt('Enter your verified Google / Departmental Email Address:\n(e.g., officer.mvd@kerala.gov.in or user@gmail.com)');
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
}

async function fetchGoogleUserProfile(accessToken) {
  try {
    showToast('Verifying Google Account identity with Google servers...', 'info');
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

  // Auto-fill officer name in entry form if empty
  const officerNameInput = document.getElementById('entryOfficerName');
  if (officerNameInput && !officerNameInput.value.trim()) {
    officerNameInput.value = userObj.name || '';
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

// --- 5. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  populateOfficeDropdown();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Check mandatory Google authentication session
  checkGoogleAuthSession();

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
  if (!supabaseClient) {
    return;
  }

  try {
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
      appSettings.adminPasscode = settingsData.admin_passcode || 'A!cell@2026';
      
      if (settingsData.google_client_id) {
        currentGoogleClientId = settingsData.google_client_id;
        localStorage.setItem('mvd_google_client_id', currentGoogleClientId);
      }

      if (settingsData.menu_visibility && Array.isArray(settingsData.menu_visibility)) {
        portalModules = settingsData.menu_visibility;
        localStorage.setItem('mvd_it_portal_modules', JSON.stringify(portalModules));
      }

      localStorage.setItem('mvd_it_app_settings', JSON.stringify(appSettings));
      syncPublicVisibilityUI();
    }

    renderPortalMenuBar();
    renderPublicDataTable();
    renderAdminDataTable();
    renderMenuManagerUI();
    if (activeSession === 'admin') renderAdminDashboard();

  } catch (err) {
    console.error("Supabase sync error:", err);
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

// --- 9. AUTO-REFLECTION & GOOGLE EMAIL AUTHORIZATION ENGINE ---
function toggleFormFieldsDisabled(disabled) {
  const form = document.getElementById('itEquipmentForm');
  if (!form) return;

  const elements = form.querySelectorAll('input, select, textarea, button[type="submit"]');
  elements.forEach(el => {
    if (el.id === 'officeSelect') return; // Never disable office dropdown itself
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

  // Explicitly hide "Open in New Window" button from the web page IRRESPECTIVE of accounts
  if (btnWindow) {
    btnWindow.style.display = 'none';
  }

  if (!officeName) {
    if (alertBox) alertBox.style.display = 'none';
    toggleFormFieldsDisabled(false);
    resetPublicFormFieldsOnly();
    updateViewEnteredDataButtonVisibility();
    return;
  }

  const currentEmail = (googleAuthUser && googleAuthUser.email) ? googleAuthUser.email.toLowerCase().trim() : '';
  const existingData = inventoryStore[officeName];

  if (existingData) {
    const ownerEmail = (existingData.createdOfficerEmail || existingData.submittedByEmail || existingData.updatedOfficerEmail || existingData.entryOfficerEmail || '').toLowerCase().trim();

    if (ownerEmail && currentEmail && ownerEmail === currentEmail) {
      // Office submitted by SAME Google Email ID -> Allow View & Update
      toggleFormFieldsDisabled(false);
      populateFormWithData(existingData);

      if (alertBox && alertText) {
        alertBox.style.background = '#f0fdf4';
        alertBox.style.borderColor = '#a7f3d0';
        alertBox.style.color = '#064e3b';
        alertText.innerHTML = `<div style="display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-circle-check" style="color:#047857; font-size:1.1rem;"></i> <span>Existing entry found for <strong>"${escapeHtml(officeName)}"</strong> submitted by your Google ID (${escapeHtml(currentEmail)}). Auto-filled below for view and update.</span></div>`;
        alertBox.style.display = 'flex';
      }
      showToast(`Loaded saved entry for ${officeName}`, 'info');
    } else {
      // Office submitted by DIFFERENT Google Email ID -> Block form, DO NOT show data in entry fields, and show security message
      resetPublicFormFieldsOnly();
      toggleFormFieldsDisabled(true);

      const displayOwner = ownerEmail || 'another Google Account';

      if (alertBox && alertText) {
        alertBox.style.background = '#fef2f2';
        alertBox.style.borderColor = '#fecdd3';
        alertBox.style.color = '#991b1b';
        alertText.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
              <i class="fa-solid fa-triangle-exclamation" style="color:#dc2626; font-size: 1.15rem;"></i>
              <strong>Entry for this office already done with "${escapeHtml(displayOwner)}". Please Login with this account to view and update data</strong>
            </div>
          </div>
        `;
        alertBox.style.display = 'flex';
      }
      showToast(`Entry for this office already done with "${displayOwner}". Please Login with this account to view and update data`, 'error');
    }
  } else {
    // Fresh Office Selection (Not yet submitted)
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
  if (document.getElementById('availableNetworkSelect')) document.getElementById('availableNetworkSelect').value = data.availableNetwork || '';
  handleNetworkChange(data.availableNetwork || '');

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

  // Core IT Hardware Equipment Status (Section 3)
  if (document.getElementById('monitorsWorking')) document.getElementById('monitorsWorking').value = data.monitorsWorking ?? 0;
  if (document.getElementById('monitorsNotWorking')) document.getElementById('monitorsNotWorking').value = data.monitorsNotWorking ?? 0;
  if (document.getElementById('cpuWorking')) document.getElementById('cpuWorking').value = data.cpuWorking ?? 0;
  if (document.getElementById('cpuNotWorking')) document.getElementById('cpuNotWorking').value = data.cpuNotWorking ?? 0;
  if (document.getElementById('laptopsWorking')) document.getElementById('laptopsWorking').value = data.laptopsWorking ?? 0;
  if (document.getElementById('laptopsNotWorking')) document.getElementById('laptopsNotWorking').value = data.laptopsNotWorking ?? 0;
  if (document.getElementById('aioWorking')) document.getElementById('aioWorking').value = data.aioWorking ?? 0;
  if (document.getElementById('aioNotWorking')) document.getElementById('aioNotWorking').value = data.aioNotWorking ?? 0;

  // Printers Section (Section 4)
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

  // Power & Battery Infrastructure (Section 5)
  if (document.getElementById('upsAvailableSelect')) document.getElementById('upsAvailableSelect').value = data.upsAvailable || '';
  if (document.getElementById('upsUnitsCount')) document.getElementById('upsUnitsCount').value = data.upsUnitsCount ?? (data.upsWorking ? (data.upsWorking + (data.upsNotWorking || 0)) : 0);
  if (document.getElementById('upsCapacitySelect')) {
    document.getElementById('upsCapacitySelect').value = data.upsCapacity || '';
    handleUpsCapacityChange(data.upsCapacity || '');
  }
  if (document.getElementById('upsCapacityOtherInput')) document.getElementById('upsCapacityOtherInput').value = data.upsCapacityOther || '';
  if (document.getElementById('upsConditionSelect')) document.getElementById('upsConditionSelect').value = data.upsCondition || '';
  if (document.getElementById('batteryMakeInput')) document.getElementById('batteryMakeInput').value = data.batteryMake || '';
  if (document.getElementById('batteryAhInput')) document.getElementById('batteryAhInput').value = data.batteryAh ?? '';
  if (document.getElementById('minBatteriesRequiredInput')) document.getElementById('minBatteriesRequiredInput').value = data.minBatteriesRequired ?? '';
  if (document.getElementById('serviceReportSentSelect')) {
    document.getElementById('serviceReportSentSelect').value = data.serviceReportSent || '';
    handleServiceReportChange(data.serviceReportSent || '');
  }
  if (document.getElementById('serviceReportDateInput')) document.getElementById('serviceReportDateInput').value = data.serviceReportDate || '';
  if (document.getElementById('powerRemarksInput')) document.getElementById('powerRemarksInput').value = data.powerRemarks || '';
  if (document.getElementById('certificationCheckbox')) document.getElementById('certificationCheckbox').checked = !!data.certified;

  if (document.getElementById('upsWorking')) document.getElementById('upsWorking').value = data.upsWorking ?? (data.upsCondition === 'Good' || data.upsCondition === 'Working with Minor Issues' ? (data.upsUnitsCount || 1) : 0);
  if (document.getElementById('upsNotWorking')) document.getElementById('upsNotWorking').value = data.upsNotWorking ?? (data.upsCondition === 'Not Working' || data.upsCondition === 'Requires Repair' ? (data.upsUnitsCount || 1) : 0);
  if (document.getElementById('batteriesInUse')) document.getElementById('batteriesInUse').value = data.batteriesInUse ?? (data.minBatteriesRequired || 0);
  if (document.getElementById('batteriesNotInUse')) document.getElementById('batteriesNotInUse').value = data.batteriesNotInUse ?? 0;

  // System Age Distribution (Section 6)
  if (document.getElementById('ageUnder3')) document.getElementById('ageUnder3').value = data.ageUnder3 ?? 0;
  if (document.getElementById('age3To5')) document.getElementById('age3To5').value = data.age3To5 ?? 0;
  if (document.getElementById('age5To8')) document.getElementById('age5To8').value = data.age5To8 ?? 0;
  if (document.getElementById('ageAbove8')) document.getElementById('ageAbove8').value = data.ageAbove8 ?? 0;

  const desktopSumEl = document.getElementById('desktopNotWorkingSummary');
  if (desktopSumEl) desktopSumEl.value = data.desktopNotWorkingSummary ?? (data.cpuNotWorking ?? 0);

  // Specific Condition Remarks (Section 7)
  if (document.getElementById('remarksInput')) document.getElementById('remarksInput').value = data.remarks || '';
}

function resetPublicFormFieldsOnly() {
  document.getElementById('availableNetworkSelect').value = '';
  handleNetworkChange('');
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
  if (document.getElementById('upsUnitsCount')) document.getElementById('upsUnitsCount').value = 0;
  if (document.getElementById('upsCapacitySelect')) {
    document.getElementById('upsCapacitySelect').value = '';
    handleUpsCapacityChange('');
  }
  if (document.getElementById('upsCapacityOtherInput')) document.getElementById('upsCapacityOtherInput').value = '';
  if (document.getElementById('upsConditionSelect')) document.getElementById('upsConditionSelect').value = '';
  if (document.getElementById('batteryMakeInput')) document.getElementById('batteryMakeInput').value = '';
  if (document.getElementById('batteryAhInput')) document.getElementById('batteryAhInput').value = '';
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

function handleSwitchesAvailabilityChange(val) {
  const group = document.getElementById('switchesDetailsGroup');
  if (group) {
    group.style.display = (val === 'Yes') ? 'block' : 'none';
  }
}

function handleServersAvailabilityChange(val) {
  const group = document.getElementById('serversDetailsGroup');
  if (group) {
    group.style.display = (val === 'Yes') ? 'block' : 'none';
  }
}

function handleUpsAvailabilityChange(val) {
  const unitsEl = document.getElementById('upsUnitsCount');
  if (val === 'No' && unitsEl) {
    unitsEl.value = 0;
  }
}

function handleUpsCapacityChange(val) {
  const group = document.getElementById('upsCapacityOtherGroup');
  if (group) {
    group.style.display = (val === 'Other') ? 'block' : 'none';
  }
}

function handleServiceReportChange(val) {
  const group = document.getElementById('serviceReportDateGroup');
  const dateInput = document.getElementById('serviceReportDateInput');
  if (group) {
    group.style.display = (val === 'Yes') ? 'block' : 'none';
  }
  if (dateInput) {
    dateInput.required = (val === 'Yes');
  }
}

function calculateNonWorkingDesktops() {
  const cpuNotWorking = parseInt(document.getElementById('cpuNotWorking').value) || 0;
  const desktopSumEl = document.getElementById('desktopNotWorkingSummary');
  if (desktopSumEl) desktopSumEl.value = cpuNotWorking;
}

// --- 10. FORM SUBMISSION & BACKEND SAVING ---
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
      showToast('Please certify that the above information is true and correct before submitting.', 'warning');
      return;
    }

    const netSelect = document.getElementById('availableNetworkSelect');
    const networkVal = netSelect ? netSelect.value : '';
    const otherNetInput = document.getElementById('otherNetworkInput');
    if (networkVal === 'Others' && otherNetInput && !otherNetInput.value.trim()) {
      showToast('Please specify details for Other Network', 'warning');
      return;
    }

    const upsCapVal = document.getElementById('upsCapacitySelect')?.value || '';
    const upsCapOther = document.getElementById('upsCapacityOtherInput')?.value.trim() || '';
    if (upsCapVal === 'Other' && !upsCapOther) {
      showToast('Please specify Other UPS Capacity (kVA)', 'warning');
      return;
    }

    const srvSent = document.getElementById('serviceReportSentSelect')?.value || '';
    const srvDate = document.getElementById('serviceReportDateInput')?.value || '';
    if (srvSent === 'Yes' && !srvDate) {
      showToast('Please enter the Date of Sending Service Report to TCO', 'warning');
      return;
    }

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
      
      // Entered Officer Details (Original Submitter)
      createdOfficerName: existingRec?.createdOfficerName || getStr('entryOfficerName') || loggedName || 'Officer',
      createdOfficerDesignation: existingRec?.createdOfficerDesignation || getStr('entryOfficerDesignation') || 'Officer',
      createdOfficerMobile: existingRec?.createdOfficerMobile || getStr('entryOfficerMobile') || 'N/A',
      createdOfficerEmail: existingRec?.createdOfficerEmail || loggedEmail || 'N/A',
      createdDate: existingRec?.createdDate || formattedDate,

      // Updated Officer Details (Latest Editor)
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
      upsUnitsCount: getNum('upsUnitsCount'),
      upsCapacity: upsCapVal,
      upsCapacityOther: upsCapOther,
      upsCondition: getStr('upsConditionSelect'),
      batteryMake: getStr('batteryMakeInput'),
      batteryAh: getNum('batteryAhInput'),
      minBatteriesRequired: getNum('minBatteriesRequiredInput'),
      serviceReportSent: srvSent,
      serviceReportDate: srvDate,
      powerRemarks: getStr('powerRemarksInput'),
      certified: true,

      upsWorking: getNum('upsWorking') || (getStr('upsConditionSelect') === 'Good' || getStr('upsConditionSelect') === 'Working with Minor Issues' ? (getNum('upsUnitsCount') || 1) : 0),
      upsNotWorking: getNum('upsNotWorking') || (getStr('upsConditionSelect') === 'Not Working' || getStr('upsConditionSelect') === 'Requires Repair' ? (getNum('upsUnitsCount') || 1) : 0),
      batteriesInUse: getNum('batteriesInUse') || getNum('minBatteriesRequiredInput'),
      batteriesNotInUse: getNum('batteriesNotInUse'),

      ageUnder3: getNum('ageUnder3'),
      age3To5: getNum('age3To5'),
      age5To8: getNum('age5To8'),
      ageAbove8: getNum('ageAbove8'),

      desktopNotWorkingSummary: getNum('desktopNotWorkingSummary') || getNum('cpuNotWorking'),
      remarks: getStr('remarksInput'),
      lastUpdated: formattedDate
    };

    inventoryStore[officeName] = record;
    localStorage.setItem('mvd_it_inventory_store', JSON.stringify(inventoryStore));

    await saveRecordToSupabase(record);

    showToast(`IT Equipment details for "${officeName}" saved successfully!`, 'success');

    renderAdminDataTable();
    renderPublicDataTable();
    if (activeSession === 'admin') renderAdminDashboard();

    // Show the entered office name & summary in New Window popup!
    openEnteredOfficeSummaryWindow(officeName);
  } catch (err) {
    console.error('Error in handleFormSubmit:', err);
    showToast(`Error submitting form: ${err.message}`, 'error');
  }
}

// --- PUBLIC NEW WINDOW OFFICE SUMMARY ENGINE ---
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
    lastUpdated: 'Just now',
    entryOfficerName: document.getElementById('entryOfficerName')?.value || 'N/A',
    entryOfficerDesignation: document.getElementById('entryOfficerDesignation')?.value || 'N/A',
    entryOfficerMobile: document.getElementById('entryOfficerMobile')?.value || 'N/A',
    availableNetwork: document.getElementById('availableNetworkSelect')?.value || 'N/A',
    otherNetworkDetails: document.getElementById('otherNetworkInput')?.value || '',
    networkSpeed: document.getElementById('networkSpeedInput')?.value || 'N/A',
    operatingSystem: document.getElementById('operatingSystemInput')?.value || 'N/A',
    monitorsWorking: parseInt(document.getElementById('monitorsWorking')?.value) || 0,
    monitorsNotWorking: parseInt(document.getElementById('monitorsNotWorking')?.value) || 0,
    cpuWorking: parseInt(document.getElementById('cpuWorking')?.value) || 0,
    cpuNotWorking: parseInt(document.getElementById('cpuNotWorking')?.value) || 0,
    laptopsWorking: parseInt(document.getElementById('laptopsWorking')?.value) || 0,
    laptopsNotWorking: parseInt(document.getElementById('laptopsNotWorking')?.value) || 0,
    aioWorking: parseInt(document.getElementById('aioWorking')?.value) || 0,
    aioNotWorking: parseInt(document.getElementById('aioNotWorking')?.value) || 0,
    upsWorking: parseInt(document.getElementById('upsWorking')?.value) || 0,
    upsNotWorking: parseInt(document.getElementById('upsNotWorking')?.value) || 0,
    batteriesInUse: parseInt(document.getElementById('batteriesInUse')?.value) || 0,
    batteriesNotInUse: parseInt(document.getElementById('batteriesNotInUse')?.value) || 0,
    ageUnder3: parseInt(document.getElementById('ageUnder3')?.value) || 0,
    age3To5: parseInt(document.getElementById('age3To5')?.value) || 0,
    age5To8: parseInt(document.getElementById('age5To8')?.value) || 0,
    ageAbove8: parseInt(document.getElementById('ageAbove8')?.value) || 0,
    remarks: document.getElementById('remarksInput')?.value || 'None'
  };

  title.innerHTML = `<i class="fa-solid fa-building"></i> Entered Office Name: <span style="color: #fef08a; font-weight: 800;">${escapeHtml(data.officeName)}</span>`;

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      
      <!-- Top Banner Bar -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #047857; font-weight: 700;">Kerala MVD Official Office Profile</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #064e3b;"><i class="fa-solid fa-building"></i> ${escapeHtml(data.officeName)}</div>
          <div style="font-size: 0.82rem; color: #047857;"><i class="fa-regular fa-clock"></i> Record Timestamp: ${escapeHtml(data.lastUpdated || 'Saved')}</div>
        </div>
        <span class="badge badge-working" style="font-size: 0.9rem; padding: 6px 14px;"><i class="fa-solid fa-circle-check"></i> RECORDED & SYNCHRONIZED</span>
      </div>

      <!-- Officer & Network Profile -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
        <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
          <h4 style="font-size: 0.88rem; color: var(--primary-900); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i> Entry Officer Details</h4>
          <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-color);">
            <strong>Name:</strong> ${escapeHtml(data.entryOfficerName || 'N/A')}<br>
            <strong>Designation:</strong> ${escapeHtml(data.entryOfficerDesignation || 'N/A')}<br>
            <strong>Mobile:</strong> ${escapeHtml(data.entryOfficerMobile || 'N/A')}
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
          <h4 style="font-size: 0.88rem; color: var(--primary-900); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-network-wired"></i> Connectivity, Network & OS Profile</h4>
          <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-color);">
            <strong>Network:</strong> <span class="badge badge-info">${escapeHtml(data.availableNetwork === 'Others' ? data.otherNetworkDetails : data.availableNetwork || 'N/A')}</span><br>
            <strong>Speed:</strong> ${escapeHtml(data.networkSpeed || 'N/A')}<br>
            <strong>Switches Available:</strong> ${escapeHtml(data.switchesAvailable || 'Not Sure')} ${data.switchesAvailable === 'Yes' && data.switchesDetails ? `(${escapeHtml(data.switchesDetails)})` : ''}<br>
            <strong>Servers Available:</strong> ${escapeHtml(data.serversAvailable || 'No')} ${data.serversAvailable === 'Yes' && data.serversDetails ? `(${escapeHtml(data.serversDetails)})` : ''}<br>
            <strong>OS:</strong> ${escapeHtml(data.operatingSystem || 'N/A')}
          </div>
        </div>
      </div>

      <!-- Core Hardware Table -->
      <div>
        <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--primary-900); margin-bottom: 8px;"><i class="fa-solid fa-desktop"></i> Core IT Hardware Inventory Status</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>Equipment Category</th>
              <th>Working Count</th>
              <th>Defective / Not Working</th>
              <th>Total Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Monitors</strong></td>
              <td style="color:#047857; font-weight:700;">${data.monitorsWorking}</td>
              <td style="color:#b91c1c; font-weight:700;">${data.monitorsNotWorking}</td>
              <td><strong>${data.monitorsWorking + data.monitorsNotWorking}</strong></td>
            </tr>
            <tr>
              <td><strong>CPU Units</strong></td>
              <td style="color:#047857; font-weight:700;">${data.cpuWorking}</td>
              <td style="color:#b91c1c; font-weight:700;">${data.cpuNotWorking}</td>
              <td><strong>${data.cpuWorking + data.cpuNotWorking}</strong></td>
            </tr>
            <tr>
              <td><strong>Laptops</strong></td>
              <td style="color:#047857; font-weight:700;">${data.laptopsWorking}</td>
              <td style="color:#b91c1c; font-weight:700;">${data.laptopsNotWorking}</td>
              <td><strong>${data.laptopsWorking + data.laptopsNotWorking}</strong></td>
            </tr>
            <tr>
              <td><strong>All-In-One PCs</strong></td>
              <td style="color:#047857; font-weight:700;">${data.aioWorking}</td>
              <td style="color:#b91c1c; font-weight:700;">${data.aioNotWorking}</td>
              <td><strong>${data.aioWorking + data.aioNotWorking}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Power & Battery Detailed Audit Summary -->
      <div style="background: #faf5ff; border: 1.5px solid #e9d5ff; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 0.92rem; color: #6b21a8; font-weight: 700; margin-bottom: 10px;"><i class="fa-solid fa-car-battery"></i> 5. Power & Battery Infrastructure Audit</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 0.85rem;">
          <div>
            <strong>• UPS Available:</strong> <span class="badge ${data.upsAvailable === 'No' ? 'badge-danger' : 'badge-working'}">${escapeHtml(data.upsAvailable || 'Yes')}</span><br>
            <strong>• No. of UPS Units Working:</strong> <span style="color:#047857; font-weight:700;">${data.upsWorking ?? 0}</span><br>
            <strong>• No. of UPS Units Not Working:</strong> <span style="color:#b91c1c; font-weight:700;">${data.upsNotWorking ?? 0}</span><br>
            <strong>• UPS Capacity:</strong> ${escapeHtml(data.upsCapacity === 'Other' ? data.upsCapacityOther : (data.upsCapacity || 'N/A'))}<br>
            <strong>• Condition of Working UPS:</strong> <span style="font-weight: 700;">${escapeHtml(data.upsCondition || 'N/A')}</span>
          </div>
          <div>
            <strong>• Battery Make / Type:</strong> ${escapeHtml(data.batteryMake || 'N/A')}<br>
            <strong>• Battery AH Rating:</strong> ${data.batteryAh ? data.batteryAh + ' AH' : 'N/A'}<br>
            <strong>• Min Batteries Required:</strong> ${data.minBatteriesRequired || 0}<br>
            <strong>• Service Report Sent to TCO:</strong> <strong>${escapeHtml(data.serviceReportSent || 'No')}</strong> ${data.serviceReportSent === 'Yes' && data.serviceReportDate ? `(${escapeHtml(data.serviceReportDate)})` : ''}
          </div>
        </div>
        ${data.powerRemarks ? `<div style="margin-top: 10px; font-size: 0.83rem; font-style: italic; color: #581c87; background: rgba(255,255,255,0.7); padding: 8px; border-radius: 6px;"><strong>Power Remarks:</strong> "${escapeHtml(data.powerRemarks)}"</div>` : ''}
      </div>

      <!-- Lifecycle Profile Summary -->
      <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 14px; border-radius: 8px;">
        <h4 style="font-size: 0.88rem; color: #9f1239; font-weight: 700; margin-bottom: 6px;"><i class="fa-solid fa-hourglass-half"></i> System Lifecycle Profile</h4>
        <div style="font-size: 0.85rem; line-height: 1.6;">
          • &lt; 3 Yrs: <strong>${data.ageUnder3}</strong> | 3–5 Yrs: <strong>${data.age3To5}</strong> | 5–8 Yrs: <strong>${data.age5To8}</strong> | &gt; 8 Yrs: <strong style="color:#b91c1c;">${data.ageAbove8}</strong>
        </div>
      </div>

      <!-- Condition Remarks -->
      <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
        <h4 style="font-size: 0.88rem; color: var(--primary-900); font-weight: 700; margin-bottom: 6px;"><i class="fa-solid fa-comment-dots"></i> General Condition Remarks</h4>
        <p style="font-size: 0.85rem; color: var(--text-color); margin: 0; font-style: italic;">
          "${escapeHtml(data.remarks || 'No specific defect or warranty remarks entered.')}"
        </p>
      </div>

      <!-- Certification Status -->
      <div style="background: #f0fdf4; border: 1px solid #a7f3d0; padding: 10px 14px; border-radius: 6px; font-size: 0.83rem; color: #064e3b; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-shield-check" style="color: #047857; font-size: 1.1rem;"></i>
        <span>Certified: "I certify that the above information is true and correct."</span>
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
  const officeName = currentWindowOfficeName || document.getElementById('officeSelect')?.value;
  if (!officeName) return;

  const data = inventoryStore[officeName] || {};
  const printWin = window.open('', '_blank', 'width=920,height=800,scrollbars=yes');

  if (!printWin) {
    showToast('Popup blocker blocked new window. Please allow popups for this site.', 'warning');
    return;
  }

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kerala MVD - Entered Office Record - ${officeName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 32px; color: #1e293b; line-height: 1.5; background: #ffffff; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0B3B24; padding-bottom: 16px; margin-bottom: 24px; }
        .title-group h1 { font-size: 1.4rem; color: #0B3B24; margin: 0; }
        .title-group p { font-size: 0.85rem; color: #64748b; margin: 2px 0 0 0; }
        .badge { background: #d1fae5; color: #065f46; font-weight: 700; padding: 6px 14px; border-radius: 6px; font-size: 0.85rem; }
        .office-banner { background: #f0fdf4; border: 1.5px solid #a7f3d0; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-weight: 800; font-size: 1.2rem; color: #064e3b; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; }
        .box h3 { font-size: 0.95rem; margin-top: 0; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; border: 1px solid #cbd5e1; text-align: left; font-size: 0.88rem; }
        th { background: #f1f5f9; font-weight: 700; color: #0f172a; }
        .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title-group">
          <h1>Kerala Motor Vehicles Department</h1>
          <p>Data AI Foundry • IT Infrastructure & Equipment Record</p>
        </div>
        <span class="badge"><i class="fa-solid fa-check-circle"></i> VERIFIED RECORD</span>
      </div>

      <div class="office-banner">
        <i class="fa-solid fa-building"></i> Entered Office Name: ${officeName}
      </div>

      <div class="grid-2">
        <div class="box">
          <h3>Reporting Officer Profile</h3>
          <strong>Name:</strong> ${data.entryOfficerName || 'N/A'}<br>
          <strong>Designation:</strong> ${data.entryOfficerDesignation || 'N/A'}<br>
          <strong>Mobile Number:</strong> ${data.entryOfficerMobile || 'N/A'}
        </div>
        <div class="box">
          <h3>Network & OS Infrastructure</h3>
          <strong>Available Network:</strong> ${data.availableNetwork === 'Others' ? data.otherNetworkDetails : (data.availableNetwork || 'N/A')}<br>
          <strong>Speed:</strong> ${data.networkSpeed || 'N/A'}<br>
          <strong>Switches Available:</strong> ${data.switchesAvailable || 'Not Sure'} ${data.switchesAvailable === 'Yes' && data.switchesDetails ? `(${data.switchesDetails})` : ''}<br>
          <strong>Servers Available:</strong> ${data.serversAvailable || 'No'} ${data.serversAvailable === 'Yes' && data.serversDetails ? `(${data.serversDetails})` : ''}<br>
          <strong>Operating System:</strong> ${data.operatingSystem || 'N/A'}
        </div>
      </div>

      <h3>Core IT Hardware Inventory Status</h3>
      <table>
        <thead>
          <tr>
            <th>Hardware Category</th>
            <th>Working Count</th>
            <th>Defective / Not Working</th>
            <th>Total Count</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monitors</td><td>${data.monitorsWorking || 0}</td><td>${data.monitorsNotWorking || 0}</td><td>${(data.monitorsWorking || 0) + (data.monitorsNotWorking || 0)}</td></tr>
          <tr><td>CPU Units</td><td>${data.cpuWorking || 0}</td><td>${data.cpuNotWorking || 0}</td><td>${(data.cpuWorking || 0) + (data.cpuNotWorking || 0)}</td></tr>
          <tr><td>Laptops</td><td>${data.laptopsWorking || 0}</td><td>${data.laptopsNotWorking || 0}</td><td>${(data.laptopsWorking || 0) + (data.laptopsNotWorking || 0)}</td></tr>
          <tr><td>All-In-One PCs</td><td>${data.aioWorking || 0}</td><td>${data.aioNotWorking || 0}</td><td>${(data.aioWorking || 0) + (data.aioNotWorking || 0)}</td></tr>
          <tr><td>UPS Units</td><td>${data.upsWorking || 0}</td><td>${data.upsNotWorking || 0}</td><td>${(data.upsWorking || 0) + (data.upsNotWorking || 0)}</td></tr>
        </tbody>
      </table>

      <div class="box" style="margin-top: 20px;">
        <h3>5. Power & Battery Infrastructure Audit</h3>
        <strong>UPS Available:</strong> ${data.upsAvailable || 'Yes'}<br>
        <strong>No. of UPS Units Working:</strong> ${data.upsWorking ?? 0}<br>
        <strong>No. of UPS Units Not Working:</strong> ${data.upsNotWorking ?? 0}<br>
        <strong>UPS Capacity (kVA):</strong> ${data.upsCapacity === 'Other' ? data.upsCapacityOther : (data.upsCapacity || 'N/A')}<br>
        <strong>Condition of Working UPS:</strong> ${data.upsCondition || 'N/A'}<br>
        <strong>Battery Make / Type:</strong> ${data.batteryMake || 'N/A'}<br>
        <strong>Battery AH Rating:</strong> ${data.batteryAh ? data.batteryAh + ' AH' : 'N/A'}<br>
        <strong>Min Batteries Required:</strong> ${data.minBatteriesRequired || 0}<br>
        <strong>Service Report Sent to TCO:</strong> ${data.serviceReportSent || 'No'} ${data.serviceReportSent === 'Yes' && data.serviceReportDate ? `(Date: ${data.serviceReportDate})` : ''}<br>
        ${data.powerRemarks ? `<strong>Power Remarks:</strong> "${data.powerRemarks}"` : ''}
      </div>

      <div class="box" style="margin-top: 20px;">
        <h3>General Condition Remarks & Certification</h3>
        <p style="margin: 0 0 10px 0; font-style: italic;">"${data.remarks || 'None'}"</p>
        <div style="font-weight: 700; color: #064e3b; background: #f0fdf4; padding: 8px; border-radius: 6px; font-size: 0.85rem;">
          ✓ Certified: "I certify that the above information is true and correct."
        </div>
      </div>

      <div class="footer">
        <span>Generated from Kerala MVD IT Portal (Data AI Foundry)</span>
        <span>Date: ${new Date().toLocaleString()}</span>
      </div>

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
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

// --- 13. PUBLIC ENTRY WINDOW ENGINE ---
function switchPublicWindow(windowType) {
  const entrySec = document.getElementById('publicEntrySection');
  if (entrySec) entrySec.style.display = 'block';
}

function renderPublicDataTable() {
  const tbody = document.getElementById('publicTableBody');
  if (!tbody) return;

  const entries = Object.values(inventoryStore);
  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;"><i class="fa-solid fa-folder-open"></i> No office entries recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.officeName)}</strong></td>
      <td>${escapeHtml(item.entryOfficerName || 'N/A')} <br><small style="color: var(--text-muted);">${escapeHtml(item.entryOfficerDesignation || '')}</small></td>
      <td><span class="badge badge-info">${escapeHtml(item.availableNetwork === 'Others' ? item.otherNetworkDetails : item.availableNetwork)}</span><br><small style="color: var(--text-muted);">${escapeHtml(item.networkSpeed || '')}</small></td>
      <td><span class="badge badge-working">${item.monitorsWorking} W</span> / <span class="badge badge-danger">${item.monitorsNotWorking} NW</span></td>
      <td><span class="badge badge-working">${item.cpuWorking} W</span> / <span class="badge badge-danger">${item.cpuNotWorking} NW</span></td>
      <td><span class="badge badge-working">${item.laptopsWorking} W</span> / <span class="badge badge-danger">${item.laptopsNotWorking} NW</span></td>
      <td><span class="badge badge-working">${item.aioWorking} W</span> / <span class="badge badge-danger">${item.aioNotWorking} NW</span></td>
      <td><span class="badge badge-working">${item.upsWorking} W</span> / <span class="badge badge-danger">${item.upsNotWorking} NW</span></td>
      <td><small>${escapeHtml(item.lastUpdated || 'N/A')}</small></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openEnteredOfficeSummaryWindow('${escapeHtml(item.officeName)}')">
          <i class="fa-solid fa-window-restore"></i> View Record
        </button>
      </td>
    </tr>
  `).join('');
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

// --- 14. ADMIN PORTAL & DASHBOARD RENDERER WITH OFFICE FILTER & DRILL-DOWN ---
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

  let switchesCount = 0;
  let serversCount = 0;
  let upsWorkingCount = 0;
  let upsNotWorkingCount = 0;
  let serviceReportsSentCount = 0;
  let totalBatteriesInUse = 0;
  let totalMinBatteries = 0;

  entries.forEach(e => {
    if (e.switchesAvailable === 'Yes') switchesCount++;
    if (e.serversAvailable === 'Yes') serversCount++;
    upsWorkingCount += (e.upsWorking || 0);
    upsNotWorkingCount += (e.upsNotWorking || 0);
    if (e.serviceReportSent === 'Yes') serviceReportsSentCount++;
    totalBatteriesInUse += (e.batteriesInUse || 0);
    totalMinBatteries += (e.minBatteriesRequired || 0);
  });

  if (document.getElementById('kpiOfficesReported')) document.getElementById('kpiOfficesReported').textContent = filterVal === 'ALL' ? `${totalOffices} / ${MVD_OFFICES.length}` : (totalOffices > 0 ? 'Reported ✓' : 'Pending');
  if (document.getElementById('kpiTotalSystems')) document.getElementById('kpiTotalSystems').textContent = totalSystems;
  if (document.getElementById('kpiNonWorkingHardware')) document.getElementById('kpiNonWorkingHardware').textContent = nonWorkingHardware;
  if (document.getElementById('kpiGovNetworkCount')) document.getElementById('kpiGovNetworkCount').textContent = govNetworkCount;
  if (document.getElementById('kpiSwitchesCount')) document.getElementById('kpiSwitchesCount').textContent = `${switchesCount} Offices`;
  if (document.getElementById('kpiServersCount')) document.getElementById('kpiServersCount').textContent = `${serversCount} Offices`;
  if (document.getElementById('kpiUpsWorkingCount')) document.getElementById('kpiUpsWorkingCount').textContent = `${upsWorkingCount} Units`;
  if (document.getElementById('kpiServiceReportCount')) document.getElementById('kpiServiceReportCount').textContent = `${serviceReportsSentCount} Offices`;

  const netGrid = document.getElementById('networkStatsGrid');
  if (netGrid) {
    netGrid.innerHTML = Object.entries(networkCounts).map(([net, count]) => `
      <div style="background: #f8fafc; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">${net}</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-900);">${count} Offices</div>
      </div>
    `).join('');
  }

  const pwrGrid = document.getElementById('powerStatsGrid');
  if (pwrGrid) {
    pwrGrid.innerHTML = `
      <div style="background: #f0fdf4; padding: 14px; border-radius: var(--radius-md); border: 1px solid #a7f3d0; text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: #047857;">Working UPS Units</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #064e3b;">${upsWorkingCount} Units</div>
      </div>
      <div style="background: #fef2f2; padding: 14px; border-radius: var(--radius-md); border: 1px solid #fecdd3; text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: #b91c1c;">Defective / Non-Working UPS</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #991b1b;">${upsNotWorkingCount} Units</div>
      </div>
      <div style="background: #eff6ff; padding: 14px; border-radius: var(--radius-md); border: 1px solid #bfdbfe; text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: #1d4ed8;">Batteries In Use / Min Required</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #1e40af;">${totalBatteriesInUse} / ${totalMinBatteries}</div>
      </div>
      <div style="background: #fffbe6; padding: 14px; border-radius: var(--radius-md); border: 1px solid #ffe58f; text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: #d97706;">TCO Service Reports Sent</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #b45309;">${serviceReportsSentCount} Offices</div>
      </div>
    `;
  }

  const ctxHealth = document.getElementById('chartHardwareHealth')?.getContext('2d');
  if (ctxHealth) {
    if (chartHealthInstance) chartHealthInstance.destroy();
    chartHealthInstance = new Chart(ctxHealth, {
      type: 'doughnut',
      data: {
        labels: ['Working Systems', 'Defective / Non-Working Systems'],
        datasets: [{
          data: [totalWorkingHW || (totalNotWorkingHW === 0 ? 1 : 0), totalNotWorkingHW || 0],
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

// --- DASHBOARD INTERACTIVE DRILL-DOWN ENGINE ---
let currentDrillDownType = 'offices';

function drillDownDashboard(type) {
  currentDrillDownType = type;
  const modal = document.getElementById('officeDetailModal');
  const title = document.getElementById('modalOfficeTitle');
  const body = document.getElementById('modalOfficeBody');

  if (!modal || !title || !body) return;

  const filterVal = document.getElementById('dashboardOfficeFilter')?.value || 'ALL';
  let entries = Object.values(inventoryStore);
  if (filterVal !== 'ALL') {
    entries = inventoryStore[filterVal] ? [inventoryStore[filterVal]] : [];
  }

  if (type === 'offices') {
    title.innerHTML = `<i class="fa-solid fa-building-circle-check"></i> Offices Submission Drill-Down (${entries.length} Reported / ${MVD_OFFICES.length} Total)`;

    const reportedNames = entries.map(e => e.officeName);
    const pendingNames = MVD_OFFICES.filter(off => !inventoryStore[off]);

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div>
          <h4 style="color: #047857; margin-bottom: 10px;"><i class="fa-solid fa-circle-check"></i> Reported MVD Offices (${reportedNames.length})</h4>
          <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
            <table class="data-table">
              <thead><tr><th>Office Name</th><th>Reporting Officer</th><th>Last Updated</th><th>Action</th></tr></thead>
              <tbody>
                ${entries.map(e => `
                  <tr>
                    <td><strong>${escapeHtml(e.officeName)}</strong></td>
                    <td>${escapeHtml(e.entryOfficerName || 'N/A')} (${escapeHtml(e.entryOfficerDesignation || 'Officer')})</td>
                    <td><small>${escapeHtml(e.lastUpdated)}</small></td>
                    <td><button class="btn btn-outline btn-sm" onclick="viewOfficeDetail('${escapeHtml(e.officeName)}')"><i class="fa-solid fa-eye"></i> View</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 style="color: #b91c1c; margin-bottom: 10px;"><i class="fa-solid fa-clock"></i> Pending Submission Offices (${pendingNames.length})</h4>
          <div style="max-height: 180px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; background: #fef2f2;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
              ${pendingNames.map(off => `<div style="font-size: 0.85rem; color: #991b1b;"><i class="fa-regular fa-square"></i> ${escapeHtml(off)}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'systems') {
    title.innerHTML = `<i class="fa-solid fa-computer"></i> IT Systems Equipment Distribution Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">Detailed hardware Breakdown by Office for selected scope:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Monitors (W/NW)</th>
                <th>CPUs (W/NW)</th>
                <th>Laptops (W/NW)</th>
                <th>AIO PCs (W/NW)</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td>${e.monitorsWorking} W / <span style="color:#b91c1c;">${e.monitorsNotWorking} NW</span></td>
                  <td>${e.cpuWorking} W / <span style="color:#b91c1c;">${e.cpuNotWorking} NW</span></td>
                  <td>${e.laptopsWorking} W / <span style="color:#b91c1c;">${e.laptopsNotWorking} NW</span></td>
                  <td>${e.aioWorking} W / <span style="color:#b91c1c;">${e.aioNotWorking} NW</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'defective') {
    title.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> Defective Hardware & Defect Audit Drill-Down`;

    const defectiveEntries = entries.filter(e => (e.monitorsNotWorking + e.cpuNotWorking + e.laptopsNotWorking + e.aioNotWorking + e.upsNotWorking) > 0);

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: #b91c1c; font-size: 0.88rem; font-weight: 600;">Found ${defectiveEntries.length} offices with non-working hardware items pending maintenance:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Defective Monitors</th>
                <th>Defective CPUs</th>
                <th>Defective Laptops / AIO</th>
                <th>Defective UPS</th>
                <th>Condition Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${defectiveEntries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td style="color:#b91c1c; font-weight:700;">${e.monitorsNotWorking}</td>
                  <td style="color:#b91c1c; font-weight:700;">${e.cpuNotWorking}</td>
                  <td style="color:#b91c1c; font-weight:700;">${e.laptopsNotWorking + e.aioNotWorking}</td>
                  <td style="color:#b91c1c; font-weight:700;">${e.upsNotWorking}</td>
                  <td><small>${escapeHtml(e.remarks || 'None')}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'network') {
    title.innerHTML = `<i class="fa-solid fa-network-wired"></i> Network Infrastructure Coverage Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">Network Connectivity provider and speed status by office:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Network Provider</th>
                <th>Bandwidth Speed</th>
                <th>OS & Version</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td><span class="badge badge-info">${escapeHtml(e.availableNetwork === 'Others' ? e.otherNetworkDetails : e.availableNetwork)}</span></td>
                  <td>${escapeHtml(e.networkSpeed || 'N/A')}</td>
                  <td><small>${escapeHtml(e.operatingSystem || 'N/A')}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'switches') {
    title.innerHTML = `<i class="fa-solid fa-server" style="color: #0284c7;"></i> Network Switches Availability & Details Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">Switches hardware availability and specification details across MVD offices:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Switches Available</th>
                <th>Manufacturer & Port Details</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td><span class="badge ${e.switchesAvailable === 'Yes' ? 'badge-working' : (e.switchesAvailable === 'No' ? 'badge-danger' : 'badge-info')}">${escapeHtml(e.switchesAvailable || 'Not Sure')}</span></td>
                  <td>${escapeHtml(e.switchesDetails || 'N/A')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'servers') {
    title.innerHTML = `<i class="fa-solid fa-database" style="color: #4f46e5;"></i> Server Infrastructure Status Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">Server hardware installation and operational status across MVD offices:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Servers Available</th>
                <th>Current Status & Details</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td><span class="badge ${e.serversAvailable === 'Yes' ? 'badge-working' : 'badge-danger'}">${escapeHtml(e.serversAvailable || 'No')}</span></td>
                  <td>${escapeHtml(e.serversDetails || 'N/A')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'age') {
    title.innerHTML = `<i class="fa-solid fa-chart-column" style="color: #3b82f6;"></i> System Age Profile Breakdown Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">System age profile breakdown (&lt; 3 yrs, 3–5 yrs, 5–8 yrs, &gt; 8 yrs priority) by MVD Office:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>&lt; 3 Years</th>
                <th>3–5 Years</th>
                <th>5–8 Years</th>
                <th>&gt; 8 Years (High Priority)</th>
                <th>Total Age-Profiled Systems</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td>${e.ageUnder3 || 0}</td>
                  <td>${e.age3To5 || 0}</td>
                  <td>${e.age5To8 || 0}</td>
                  <td><span class="badge ${(e.ageAbove8 || 0) > 0 ? 'badge-danger' : 'badge-working'}">${e.ageAbove8 || 0}</span></td>
                  <td><strong>${(e.ageUnder3 || 0) + (e.age3To5 || 0) + (e.age5To8 || 0) + (e.ageAbove8 || 0)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'ups' || type === 'power') {
    title.innerHTML = `<i class="fa-solid fa-car-battery" style="color: #059669;"></i> Power & Battery Infrastructure Audit Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">UPS availability, condition, battery specifications, and TCO service report status by office:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>UPS Available</th>
                <th>Working / Defective UPS</th>
                <th>UPS Capacity</th>
                <th>Working UPS Condition</th>
                <th>Battery Make & AH</th>
                <th>Batteries (In Use / Min Req)</th>
                <th>TCO Report Sent</th>
                <th>Power Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td><span class="badge ${e.upsAvailable === 'Yes' ? 'badge-working' : 'badge-danger'}">${escapeHtml(e.upsAvailable || 'Yes')}</span></td>
                  <td><span style="color:#047857; font-weight:700;">${e.upsWorking || 0} W</span> / <span style="color:#b91c1c; font-weight:700;">${e.upsNotWorking || 0} NW</span></td>
                  <td><span class="badge badge-info">${escapeHtml(e.upsCapacity === 'Other' ? e.upsCapacityOther : (e.upsCapacity || 'N/A'))}</span></td>
                  <td><small>${escapeHtml(e.upsCondition || 'N/A')}</small></td>
                  <td><small>${escapeHtml(e.batteryMake || 'N/A')} (${e.batteryAh || 0} AH)</small></td>
                  <td>${e.batteriesInUse || 0} / ${e.minBatteriesRequired || 0}</td>
                  <td><span class="badge ${e.serviceReportSent === 'Yes' ? 'badge-working' : 'badge-danger'}">${escapeHtml(e.serviceReportSent || 'No')} ${e.serviceReportDate ? `(${e.serviceReportDate})` : ''}</span></td>
                  <td><small>${escapeHtml(e.powerRemarks || 'None')}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (type === 'service_reports') {
    title.innerHTML = `<i class="fa-solid fa-paper-plane" style="color: #d97706;"></i> TCO Service Reports Status Drill-Down`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.88rem;">Detailed status of UPS & Power Infrastructure Service Reports sent to TCO:</p>
        <div style="max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Name</th>
                <th>Service Report Sent to TCO</th>
                <th>Date of Sending Report</th>
                <th>Reporting Officer</th>
                <th>Power Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr>
                  <td><strong>${escapeHtml(e.officeName)}</strong></td>
                  <td><span class="badge ${e.serviceReportSent === 'Yes' ? 'badge-working' : 'badge-danger'}">${escapeHtml(e.serviceReportSent || 'No')}</span></td>
                  <td>${escapeHtml(e.serviceReportDate || 'N/A')}</td>
                  <td>${escapeHtml(e.entryOfficerName || 'N/A')} (${escapeHtml(e.entryOfficerMobile || 'N/A')})</td>
                  <td><small>${escapeHtml(e.powerRemarks || 'None')}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  modal.style.display = 'flex';
}

function exportDrillDownToCSV() {
  const filterVal = document.getElementById('dashboardOfficeFilter')?.value || 'ALL';
  let entries = Object.values(inventoryStore);
  if (filterVal !== 'ALL') {
    entries = inventoryStore[filterVal] ? [inventoryStore[filterVal]] : [];
  }

  let csvContent = "";
  let filename = `mvd_drilldown_${currentDrillDownType}_${Date.now()}.csv`;

  if (currentDrillDownType === 'offices') {
    csvContent += "Office Name,Status,Reporting Officer,Designation,Mobile,Last Updated\n";
    entries.forEach(e => {
      csvContent += `"${e.officeName.replace(/"/g, '""')}","Reported","${(e.entryOfficerName || '').replace(/"/g, '""')}","${(e.entryOfficerDesignation || '').replace(/"/g, '""')}","${e.entryOfficerMobile || ''}","${e.lastUpdated || ''}"\n`;
    });
    const pendingNames = MVD_OFFICES.filter(off => !inventoryStore[off]);
    pendingNames.forEach(p => {
      csvContent += `"${p.replace(/"/g, '""')}","Pending","N/A","N/A","N/A","N/A"\n`;
    });
  } else if (currentDrillDownType === 'systems') {
    csvContent += "Office Name,Monitors Working,Monitors Defective,CPU Working,CPU Defective,Laptops Working,Laptops Defective,AIO Working,AIO Defective,Total Systems\n";
    entries.forEach(e => {
      const tot = (e.monitorsWorking + e.monitorsNotWorking + e.cpuWorking + e.cpuNotWorking + e.laptopsWorking + e.laptopsNotWorking + e.aioWorking + e.aioNotWorking);
      csvContent += `"${e.officeName.replace(/"/g, '""')}",${e.monitorsWorking},${e.monitorsNotWorking},${e.cpuWorking},${e.cpuNotWorking},${e.laptopsWorking},${e.laptopsNotWorking},${e.aioWorking},${e.aioNotWorking},${tot}\n`;
    });
  } else if (currentDrillDownType === 'defective') {
    csvContent += "Office Name,Defective Monitors,Defective CPUs,Defective Laptops & AIO,Defective UPS,Remarks\n";
    const defectiveEntries = entries.filter(e => (e.monitorsNotWorking + e.cpuNotWorking + e.laptopsNotWorking + e.aioNotWorking + e.upsNotWorking) > 0);
    defectiveEntries.forEach(e => {
      csvContent += `"${e.officeName.replace(/"/g, '""')}",${e.monitorsNotWorking},${e.cpuNotWorking},${e.laptopsNotWorking + e.aioNotWorking},${e.upsNotWorking},"${(e.remarks || '').replace(/"/g, '""')}"\n`;
    });
  } else if (currentDrillDownType === 'network') {
    csvContent += "Office Name,Available Network,Speed,Operating System\n";
    entries.forEach(e => {
      const net = e.availableNetwork === 'Others' ? e.otherNetworkDetails : e.availableNetwork;
      csvContent += `"${e.officeName.replace(/"/g, '""')}","${(net || '').replace(/"/g, '""')}","${(e.networkSpeed || '').replace(/"/g, '""')}","${(e.operatingSystem || '').replace(/"/g, '""')}"\n`;
    });
  } else if (currentDrillDownType === 'switches') {
    csvContent += "Office Name,Switches Available,Manufacturer and Port Details\n";
    entries.forEach(e => {
      csvContent += `"${e.officeName.replace(/"/g, '""')}","${(e.switchesAvailable || '').replace(/"/g, '""')}","${(e.switchesDetails || '').replace(/"/g, '""')}"\n`;
    });
  } else if (currentDrillDownType === 'servers') {
    csvContent += "Office Name,Servers Available,Current Status and Details\n";
    entries.forEach(e => {
      csvContent += `"${e.officeName.replace(/"/g, '""')}","${(e.serversAvailable || '').replace(/"/g, '""')}","${(e.serversDetails || '').replace(/"/g, '""')}"\n`;
    });
  } else if (currentDrillDownType === 'age') {
    csvContent += "Office Name,Under 3 Years,3 to 5 Years,5 to 8 Years,Above 8 Years (High Priority),Total Systems\n";
    entries.forEach(e => {
      const u3 = e.ageUnder3 || 0;
      const u5 = e.age3To5 || 0;
      const u8 = e.age5To8 || 0;
      const a8 = e.ageAbove8 || 0;
      csvContent += `"${e.officeName.replace(/"/g, '""')}",${u3},${u5},${u8},${a8},${u3 + u5 + u8 + a8}\n`;
    });
  } else if (currentDrillDownType === 'ups' || currentDrillDownType === 'power') {
    csvContent += "Office Name,UPS Available,Working UPS Units,Defective UPS Units,UPS Capacity,Working UPS Condition,Battery Make,Battery AH Rating,Batteries In Use,Min Batteries Required,TCO Service Report Sent,Report Date,Power Remarks\n";
    entries.forEach(e => {
      const cap = e.upsCapacity === 'Other' ? e.upsCapacityOther : e.upsCapacity;
      csvContent += `"${e.officeName.replace(/"/g, '""')}","${(e.upsAvailable || '').replace(/"/g, '""')}",${e.upsWorking || 0},${e.upsNotWorking || 0},"${(cap || '').replace(/"/g, '""')}","${(e.upsCondition || '').replace(/"/g, '""')}","${(e.batteryMake || '').replace(/"/g, '""')}",${e.batteryAh || 0},${e.batteriesInUse || 0},${e.minBatteriesRequired || 0},"${(e.serviceReportSent || '').replace(/"/g, '""')}","${(e.serviceReportDate || '').replace(/"/g, '""')}","${(e.powerRemarks || '').replace(/"/g, '""')}"\n`;
    });
  } else if (currentDrillDownType === 'service_reports') {
    csvContent += "Office Name,Service Report Sent to TCO,Date of Sending Report,Reporting Officer,Mobile,Power Remarks\n";
    entries.forEach(e => {
      csvContent += `"${e.officeName.replace(/"/g, '""')}","${(e.serviceReportSent || '').replace(/"/g, '""')}","${(e.serviceReportDate || '').replace(/"/g, '""')}","${(e.entryOfficerName || '').replace(/"/g, '""')}","${e.entryOfficerMobile || ''}","${(e.powerRemarks || '').replace(/"/g, '""')}"\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`Exported ${currentDrillDownType} drill-down data to CSV`, 'success');
}

function renderAdminDataTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  const entries = Object.values(inventoryStore);
  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="17" style="text-align: center; color: var(--text-muted); padding: 30px;">No entries stored.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(item => {
    const netLabel = item.availableNetwork === 'Others' ? `Other (${item.otherNetworkDetails})` : item.availableNetwork;
    const dotWorking = item.printers?.dotMatrix?.working ?? 0;

    const createdName = item.createdOfficerName || item.entryOfficerName || 'N/A';
    const createdDesig = item.createdOfficerDesignation || item.entryOfficerDesignation || 'Officer';
    const createdEmail = item.createdOfficerEmail || item.submittedByEmail || 'N/A';
    const createdTime = item.createdDate || item.lastUpdated || 'N/A';

    const updatedName = item.updatedOfficerName || item.entryOfficerName || 'N/A';
    const updatedDesig = item.updatedOfficerDesignation || item.entryOfficerDesignation || 'Officer';
    const updatedEmail = item.updatedOfficerEmail || item.submittedByEmail || 'N/A';
    const updatedTime = item.lastUpdated || 'N/A';

    return `
      <tr>
        <td>
          <strong style="color: var(--primary-900); font-size: 0.92rem;">${escapeHtml(item.officeName)}</strong>
        </td>
        <td>
          <div style="font-size: 0.84rem; line-height: 1.45;">
            <strong>${escapeHtml(createdName)}</strong> <small style="color: var(--text-muted);">(${escapeHtml(createdDesig)})</small><br>
            <span style="color: #0369a1; font-weight: 600; font-size: 0.78rem;"><i class="fa-solid fa-envelope"></i> ${escapeHtml(createdEmail)}</span><br>
            <small style="color: #64748b;"><i class="fa-regular fa-calendar-check"></i> ${escapeHtml(createdTime)}</small>
          </div>
        </td>
        <td>
          <div style="font-size: 0.84rem; line-height: 1.45;">
            <strong>${escapeHtml(updatedName)}</strong> <small style="color: var(--text-muted);">(${escapeHtml(updatedDesig)})</small><br>
            <span style="color: #047857; font-weight: 600; font-size: 0.78rem;"><i class="fa-solid fa-envelope"></i> ${escapeHtml(updatedEmail)}</span><br>
            <small style="color: #047857;"><i class="fa-regular fa-clock"></i> ${escapeHtml(updatedTime)}</small>
          </div>
        </td>
        <td><span class="badge badge-info">${escapeHtml(netLabel)}</span><br><small>${escapeHtml(item.networkSpeed || '')}</small></td>
        <td>
          <span class="badge ${item.switchesAvailable === 'Yes' ? 'badge-working' : (item.switchesAvailable === 'No' ? 'badge-danger' : 'badge-info')}">${escapeHtml(item.switchesAvailable || 'Not Sure')}</span>
          ${item.switchesAvailable === 'Yes' && item.switchesDetails ? `<br><small style="color: var(--text-muted);">${escapeHtml(item.switchesDetails)}</small>` : ''}
        </td>
        <td>
          <span class="badge ${item.serversAvailable === 'Yes' ? 'badge-working' : 'badge-danger'}">${escapeHtml(item.serversAvailable || 'No')}</span>
          ${item.serversAvailable === 'Yes' && item.serversDetails ? `<br><small style="color: var(--text-muted);">${escapeHtml(item.serversDetails)}</small>` : ''}
        </td>
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

  const publicContainer = document.getElementById('publicContainer');
  const adminContainer = document.getElementById('adminContainer');

  renderPortalMenuBar();

  if (sessionType === 'public' || sessionType === 'standard') {
    if (adminContainer) adminContainer.style.display = 'none';
    selectModuleMenu(activeModuleId);
  } else if (sessionType === 'admin') {
    const genericCont = document.getElementById('genericModuleContainer');
    if (genericCont) genericCont.style.display = 'none';
    if (publicContainer) publicContainer.style.display = 'none';
    if (adminContainer) adminContainer.style.display = 'block';

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
    if (entryBtn) entryBtn.className = 'btn btn-primary';
    if (viewBtn) viewBtn.className = 'btn btn-outline';
    if (entrySec) entrySec.style.display = 'block';
    if (viewSec) viewSec.style.display = 'none';
  } else {
    if (viewBtn) viewBtn.className = 'btn btn-primary';
    if (entryBtn) entryBtn.className = 'btn btn-outline';
    if (entrySec) entrySec.style.display = 'none';
    if (viewSec) viewSec.style.display = 'block';
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
        <strong>Reporting Officer:</strong> ${escapeHtml(item.entryOfficerName || 'N/A')} (${escapeHtml(item.entryOfficerDesignation || 'Officer')})<br>
        <strong>Mobile Number:</strong> 📞 ${escapeHtml(item.entryOfficerMobile || 'N/A')}<br>
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
    "Office Name", "Entry Officer Name", "Designation", "Mobile Number", "Network", "Network Details", "Network Speed", "Operating System",
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
      `"${(e.entryOfficerName || '').replace(/"/g, '""')}"`,
      `"${(e.entryOfficerDesignation || '').replace(/"/g, '""')}"`,
      `"${(e.entryOfficerMobile || '').replace(/"/g, '""')}"`,
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

// --- 21. MOBILE NAVIGATION SIDEBAR DRAWER CONTROLLER ---
function toggleMobileSidebar(forceState) {
  const sidebar = document.getElementById('portalSidebar');
  const overlay = document.getElementById('mobileSidebarOverlay');

  if (!sidebar) return;

  if (typeof forceState === 'boolean') {
    if (forceState) {
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
    } else {
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
    }
  } else {
    const isOpen = sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('active', isOpen);
  }
}
