// MVD IT Equipment Portal - Core Controller

// Global App State
let supabaseClient = null;
let entriesData = [];
let officerQualificationsData = [];
let appSettings = { hide_public_submissions: false };
let charts = {};

// Default Admin Key
const DEFAULT_ADMIN_PASSWORD = "mvdadmin123";

// DOM Elements
const dbStatusBadge = document.getElementById("db-status-badge");
const themeToggle = document.getElementById("theme-toggle");
const navButtons = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".app-panel");

// Form Elements - IT Equipment
const equipmentForm = document.getElementById("equipment-form");
const officeNameSelect = document.getElementById("form-office-name");
const networkTypeSelect = document.getElementById("form-network-type");
const otherNetworkContainer = document.getElementById("other-network-container");
const otherNetworkInput = document.getElementById("form-network-other");

// Form Elements - Officer Qualification
const oqForm = document.getElementById("officer-qualification-form");
const oqOfficeSelect = document.getElementById("oq-office-name");
const oqEducationSelect = document.getElementById("oq-education-qualification");
const oqOtherQualContainer = document.getElementById("oq-other-qualification-container");
const oqOtherQualInput = document.getElementById("oq-qualification-other");

// Tally Elements
const calcWorkingDotMatrix = document.getElementById("calc-working-dot-matrix");
const calcNotWorkingDesktops = document.getElementById("calc-not-working-desktops");

// Initial Setup on DOM Load
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Initialize Theme (default to dark)
    const savedTheme = localStorage.getItem("mvd-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeToggleIcon(savedTheme);

    // 3. Populate Office Dropdowns
    populateOfficeDropdowns();

    // 4. Set up Supabase Client
    initSupabase();

    // 5. Setup Event Listeners
    setupEventListeners();

    // 6. Check Admin Session on load
    checkAdminSession();

    // 7. Load Data
    await refreshData();
});

// --- Theme Management ---
function updateThemeToggleIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === "dark" 
        ? '<i data-lucide="sun"></i>' 
        : '<i data-lucide="moon"></i>';
    if (window.lucide) window.lucide.createIcons();
}

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("mvd-theme", newTheme);
    updateThemeToggleIcon(newTheme);
});

// --- Office Dropdown Population ---
function populateOfficeDropdowns() {
    if (typeof MVD_OFFICES === 'undefined') return;
    
    // Sort offices alphabetically for ease of finding
    const sortedOffices = [...MVD_OFFICES].sort();
    
    const selects = [officeNameSelect, oqOfficeSelect];
    selects.forEach(selectEl => {
        if (!selectEl) return;
        // Keep the first disabled placeholder option
        const placeholder = selectEl.querySelector('option[disabled]');
        selectEl.innerHTML = "";
        if (placeholder) {
            selectEl.appendChild(placeholder);
        } else {
            const defaultOpt = document.createElement("option");
            defaultOpt.value = "";
            defaultOpt.textContent = "Select Office";
            defaultOpt.disabled = true;
            defaultOpt.selected = true;
            selectEl.appendChild(defaultOpt);
        }

        sortedOffices.forEach(office => {
            const option = document.createElement("option");
            option.value = office;
            option.textContent = office;
            selectEl.appendChild(option);
        });
    });
}

// --- Supabase Connection & Configuration ---
function initSupabase() {
    const url = localStorage.getItem("mvd_supabase_url");
    const key = localStorage.getItem("mvd_supabase_key");

    if (url && key) {
        try {
            supabaseClient = window.supabase.createClient(url, key);
            dbStatusBadge.className = "supabase-status-badge connected";
            dbStatusBadge.querySelector(".status-label").textContent = "Connected to Supabase";
        } catch (e) {
            console.error("Supabase Init Error:", e);
            dbStatusBadge.className = "supabase-status-badge disconnected";
            dbStatusBadge.querySelector(".status-label").textContent = "Connection Failed";
            supabaseClient = null;
        }
    } else {
        supabaseClient = null;
        dbStatusBadge.className = "supabase-status-badge disconnected";
        dbStatusBadge.querySelector(".status-label").textContent = "Offline Mode (Local Storage)";
    }
}

function openConfigModal() {
    const modal = document.getElementById("config-modal");
    modal.classList.remove("hidden");
    
    document.getElementById("config-url").value = localStorage.getItem("mvd_supabase_url") || "";
    document.getElementById("config-key").value = localStorage.getItem("mvd_supabase_key") || "";
}

function closeConfigModal() {
    document.getElementById("config-modal").classList.add("hidden");
}

function saveConnectionSettings() {
    const url = document.getElementById("config-url").value.trim();
    const key = document.getElementById("config-key").value.trim();

    if (url && key) {
        localStorage.setItem("mvd_supabase_url", url);
        localStorage.setItem("mvd_supabase_key", key);
        showToast("Supabase configuration saved. Connecting...", "success");
    } else {
        localStorage.removeItem("mvd_supabase_url");
        localStorage.removeItem("mvd_supabase_key");
        showToast("Switched to Offline Mode.", "info");
    }
    
    closeConfigModal();
    initSupabase();
    refreshData();
}

// --- Data Synchronization (Supabase vs LocalStorage) ---
async function fetchEntries() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('equipment_entries')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            entriesData = data || [];
            localStorage.setItem("mvd_entries_cache", JSON.stringify(entriesData));
        } catch (e) {
            console.warn("Supabase equipment fetch failed, loading from cache:", e);
            loadCachedEntries();
        }
    } else {
        loadCachedEntries();
    }
}

function loadCachedEntries() {
    const cached = localStorage.getItem("mvd_entries_cache");
    entriesData = cached ? JSON.parse(cached) : [];
}

async function fetchOfficerQualifications() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('officer_qualifications')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            officerQualificationsData = data || [];
            localStorage.setItem("mvd_officers_cache", JSON.stringify(officerQualificationsData));
        } catch (e) {
            console.warn("Supabase officers fetch failed, loading from cache:", e);
            loadCachedOfficers();
        }
    } else {
        loadCachedOfficers();
    }
}

function loadCachedOfficers() {
    const cached = localStorage.getItem("mvd_officers_cache");
    officerQualificationsData = cached ? JSON.parse(cached) : [];
}

async function fetchSettings() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('app_settings')
                .select('*')
                .eq('key', 'hide_public_submissions')
                .single();
            
            if (data) {
                appSettings.hide_public_submissions = data.value === true || data.value?.hidden === true;
            }
        } catch (e) {
            console.warn("Supabase settings fetch failed, using local settings:", e);
            loadLocalSettings();
        }
    } else {
        loadLocalSettings();
    }
    
    applySettingsToUI();
}

function loadLocalSettings() {
    const hidden = localStorage.getItem("mvd_hide_public_submissions") === "true";
    appSettings.hide_public_submissions = hidden;
}

function applySettingsToUI() {
    const banner = document.getElementById("submission-closed-banner");
    const form = document.getElementById("equipment-form");
    const settingToggle = document.getElementById("setting-hide-public");

    if (appSettings.hide_public_submissions) {
        banner.classList.remove("hidden");
        form.classList.add("hidden");
        if (settingToggle) settingToggle.checked = true;
    } else {
        banner.classList.add("hidden");
        form.classList.remove("hidden");
        if (settingToggle) settingToggle.checked = false;
    }
}

async function updateSetting(hideSubmissions) {
    appSettings.hide_public_submissions = hideSubmissions;
    localStorage.setItem("mvd_hide_public_submissions", hideSubmissions);

    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('app_settings')
                .upsert({ 
                    key: 'hide_public_submissions', 
                    value: hideSubmissions,
                    updated_at: new Date()
                });
            if (error) throw error;
            showToast("Public form visibility setting updated in Database.", "success");
        } catch (e) {
            console.error("Failed to update database setting:", e);
            showToast("Setting saved locally only.", "warning");
        }
    } else {
        showToast("Setting saved locally.", "info");
    }
    applySettingsToUI();
}

// Refresh all UI elements, tables, and charts
async function refreshData() {
    await fetchSettings();
    await fetchEntries();
    await fetchOfficerQualifications();
    
    renderPublicTable();
    renderPublicOfficersTable();
    renderAdminTable();
    renderAdminOfficersTable();
    renderDashboard();
    updateOfficeOfficersCard();
}

// --- Navigation & Routing ---
function setupEventListeners() {
    // Navigation panels switching
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            if (targetId) {
                document.getElementById(targetId).classList.add("active");
                
                // If viewing data, reload tables
                if (targetId === "panel-public-view") {
                    renderPublicTable();
                    renderPublicOfficersTable();
                } else if (targetId === "panel-admin") {
                    checkAdminSession();
                }
            }
        });
    });

    // 1. IT Equipment Network dropdown toggle
    networkTypeSelect.addEventListener("change", (e) => {
        if (e.target.value === "Others") {
            otherNetworkContainer.classList.remove("hidden");
            otherNetworkInput.setAttribute("required", "required");
        } else {
            otherNetworkContainer.classList.add("hidden");
            otherNetworkInput.removeAttribute("required");
            otherNetworkInput.value = "";
        }
    });

    // 2. IT Equipment Form real-time calculations
    const monitorInputs = [
        document.getElementById("form-monitor-working"),
        document.getElementById("form-monitor-not-working")
    ];
    const cpuInputs = [
        document.getElementById("form-cpu-working"),
        document.getElementById("form-cpu-not-working")
    ];
    
    const dotMatrixWorkInput = document.querySelector('tr[data-printer-type="dot_matrix"] .print-work');

    const updateCalculations = () => {
        const dotMatrixWork = parseInt(dotMatrixWorkInput.value) || 0;
        calcWorkingDotMatrix.textContent = dotMatrixWork;

        const cpuNoWork = parseInt(cpuInputs[1].value) || 0;
        const monNoWork = parseInt(monitorInputs[1].value) || 0;
        calcNotWorkingDesktops.textContent = cpuNoWork + monNoWork;
    };

    document.querySelectorAll('#equipment-form input[type="number"]').forEach(input => {
        input.addEventListener("input", updateCalculations);
    });

    // 3. IT Equipment Auto-Prefill values on Office selection
    officeNameSelect.addEventListener("change", async (e) => {
        const selectedOffice = e.target.value;
        if (!selectedOffice) return;

        showToast(`Loading previous details for ${selectedOffice}...`, "info");
        await prefillFormForOffice(selectedOffice, "equipment-form");
    });

    // 4. IT Equipment Form Submit
    equipmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await submitForm("equipment-form");
    });

    // 5. Officer Qualification: Qualification dropdown "Other" toggle
    if (oqEducationSelect) {
        oqEducationSelect.addEventListener("change", (e) => {
            if (e.target.value === "Other") {
                oqOtherQualContainer.classList.remove("hidden");
                oqOtherQualInput.setAttribute("required", "required");
            } else {
                oqOtherQualContainer.classList.add("hidden");
                oqOtherQualInput.removeAttribute("required");
                oqOtherQualInput.value = "";
            }
        });
    }

    // 6. Officer Qualification: Auto-Prefill Entry Officer on Office selection & Show existing officers
    if (oqOfficeSelect) {
        oqOfficeSelect.addEventListener("change", async (e) => {
            const selectedOffice = e.target.value;
            if (!selectedOffice) return;
            await prefillOfficerEntryForOffice(selectedOffice, "officer-qualification-form");
        });
    }

    // 7. Officer Qualification Form Submit
    if (oqForm) {
        oqForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await submitOfficerForm("officer-qualification-form");
        });
    }

    // 8. Public Search and Filter Events
    document.getElementById("public-search").addEventListener("input", renderPublicTable);
    document.getElementById("public-filter-network").addEventListener("change", renderPublicTable);

    const publicOfficersSearch = document.getElementById("public-officers-search");
    if (publicOfficersSearch) publicOfficersSearch.addEventListener("input", renderPublicOfficersTable);

    const publicOfficersFilterDesig = document.getElementById("public-officers-filter-desig");
    if (publicOfficersFilterDesig) publicOfficersFilterDesig.addEventListener("change", renderPublicOfficersTable);

    const publicOfficersFilterQual = document.getElementById("public-officers-filter-qual");
    if (publicOfficersFilterQual) publicOfficersFilterQual.addEventListener("change", renderPublicOfficersTable);

    // 9. Admin Settings Toggle
    const settingToggle = document.getElementById("setting-hide-public");
    if (settingToggle) {
        settingToggle.addEventListener("change", (e) => {
            updateSetting(e.target.checked);
        });
    }

    // 10. Admin Login Form
    document.getElementById("admin-login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const pwd = document.getElementById("admin-password").value;
        if (pwd === DEFAULT_ADMIN_PASSWORD) {
            sessionStorage.setItem("mvd_admin_auth", "true");
            checkAdminSession();
            showToast("Admin access authenticated.", "success");
        } else {
            showToast("Invalid security password key.", "danger");
        }
    });

    // 11. Admin sub-tabs routing
    const adminTabs = document.querySelectorAll(".admin-tab");
    adminTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            adminTabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));
            
            tab.classList.add("active");
            const targetId = tab.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
            
            if (targetId === "admin-tab-dashboard") {
                renderDashboard();
            } else if (targetId === "admin-tab-view") {
                renderAdminTable();
                renderAdminOfficersTable();
            }
        });
    });

    // 12. Export CSV Buttons
    document.getElementById("csv-export-btn").addEventListener("click", exportCSV);
    const exportOfficersBtn = document.getElementById("csv-export-officers-btn");
    if (exportOfficersBtn) {
        exportOfficersBtn.addEventListener("click", exportOfficersCSV);
    }

    // 13. Setup Admin Searches
    document.getElementById("admin-search").addEventListener("input", renderAdminTable);
    const adminOfficersSearch = document.getElementById("admin-officers-search");
    if (adminOfficersSearch) {
        adminOfficersSearch.addEventListener("input", renderAdminOfficersTable);
    }
}

// Helper: Navigate & scroll directly to Officer Qualification Module
function goToOfficerQualificationModule() {
    navButtons.forEach(b => b.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    const officersBtn = document.getElementById("nav-btn-officers");
    if (officersBtn) officersBtn.classList.add("active");
    
    const publicPanel = document.getElementById("panel-public-form");
    publicPanel.classList.add("active");

    const moduleEl = document.getElementById("module-officer-qualification");
    if (moduleEl) {
        moduleEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// --- Form Pre-fill Mechanism: IT Equipment ---
async function prefillFormForOffice(officeName, formId) {
    let entry = entriesData.find(e => e.office_name === officeName);
    
    if (!entry && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('equipment_entries')
                .select('*')
                .eq('office_name', officeName)
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (data && data.length > 0) {
                entry = data[0];
            }
        } catch (err) {
            console.error("Failed to prefill office:", err);
        }
    }

    const form = document.getElementById(formId);
    if (!form) return;

    if (entry) {
        form.querySelector("#form-os-version").value = entry.os_version || "";
        form.querySelector("#form-network-type").value = entry.network_type || "";
        form.querySelector("#form-network-speed").value = entry.network_speed || "";
        
        const otherSection = form.querySelector(formId === "equipment-form" ? "#other-network-container" : "#admin-other-network-container");
        const otherInput = form.querySelector(formId === "equipment-form" ? "#form-network-other" : "#admin-form-network-other");
        
        if (entry.network_type === "Others") {
            if (otherSection) otherSection.classList.remove("hidden");
            if (otherInput) {
                otherInput.value = entry.network_other_detail || "";
                otherInput.setAttribute("required", "required");
            }
        } else {
            if (otherSection) otherSection.classList.add("hidden");
            if (otherInput) {
                otherInput.value = "";
                otherInput.removeAttribute("required");
            }
        }

        form.querySelector("#form-monitor-working").value = entry.monitor_working;
        form.querySelector("#form-monitor-not-working").value = entry.monitor_not_working;
        form.querySelector("#form-cpu-working").value = entry.cpu_working;
        form.querySelector("#form-cpu-not-working").value = entry.cpu_not_working;
        form.querySelector("#form-laptops-working").value = entry.laptops_working;
        form.querySelector("#form-laptops-not-working").value = entry.laptops_not_working;
        form.querySelector("#form-aio-working").value = entry.aio_working;
        form.querySelector("#form-aio-not-working").value = entry.aio_not_working;

        form.querySelector("#form-ups-working").value = entry.ups_working;
        form.querySelector("#form-ups-not-working").value = entry.ups_not_working;
        form.querySelector("#form-batteries-working").value = entry.batteries_working;
        form.querySelector("#form-batteries-not-working").value = entry.batteries_not_working;

        form.querySelector("#form-age-3yr").value = entry.age_3yr;
        form.querySelector("#form-age-3-5yr").value = entry.age_3_5yr;
        form.querySelector("#form-age-5-8yr").value = entry.age_5_8yr;
        form.querySelector("#form-age-above-8yr").value = entry.age_above_8yr;

        form.querySelector("#form-remarks").value = entry.remarks || "";

        const printerData = entry.printers_data || {};
        const printerRows = form.querySelectorAll("#printers-table tbody tr");
        printerRows.forEach(row => {
            const type = row.getAttribute("data-printer-type");
            const data = printerData[type] || { working: 0, not_working: 0, multipurpose: 0 };
            
            row.querySelector(".print-work").value = data.working || 0;
            row.querySelector(".print-nowork").value = data.not_working || 0;
            row.querySelector(".print-multi").value = data.multipurpose || 0;
        });

        const calcDotMatrix = form.querySelector("#calc-working-dot-matrix");
        const calcBrokenDesktops = form.querySelector("#calc-not-working-desktops");
        if (calcDotMatrix) calcDotMatrix.textContent = printerData.dot_matrix?.working || 0;
        if (calcBrokenDesktops) calcBrokenDesktops.textContent = (entry.monitor_not_working + entry.cpu_not_working) || 0;

        showToast("Previous equipment data loaded. You are now editing this entry.", "success");
    } else {
        form.querySelectorAll('input[type="number"]').forEach(input => input.value = 0);
        form.querySelectorAll('input[type="text"]').forEach(input => input.value = "");
        form.querySelector('textarea').value = "";
        form.querySelector('#form-os-version').value = "";
        form.querySelector('#form-network-type').value = "";
        
        const otherSection = form.querySelector(formId === "equipment-form" ? "#other-network-container" : "#admin-other-network-container");
        if (otherSection) otherSection.classList.add("hidden");

        const calcDotMatrix = form.querySelector("#calc-working-dot-matrix");
        const calcBrokenDesktops = form.querySelector("#calc-not-working-desktops");
        if (calcDotMatrix) calcDotMatrix.textContent = "0";
        if (calcBrokenDesktops) calcBrokenDesktops.textContent = "0";
    }
}

// --- Form Pre-fill Mechanism: Officer Qualification ---
async function prefillOfficerEntryForOffice(officeName, formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // 1. Look for existing officer entries for this office to pre-populate entry officer details
    let existingEntry = officerQualificationsData.find(o => o.office_name === officeName);
    
    if (existingEntry) {
        const nameInput = form.querySelector(formId === "officer-qualification-form" ? "#oq-entry-officer-name" : "#admin-oq-entry-officer-name");
        const desigInput = form.querySelector(formId === "officer-qualification-form" ? "#oq-entry-officer-designation" : "#admin-oq-entry-officer-designation");
        const mobileInput = form.querySelector(formId === "officer-qualification-form" ? "#oq-entry-officer-mobile" : "#admin-oq-entry-officer-mobile");

        if (nameInput && !nameInput.value) nameInput.value = existingEntry.entry_officer_name || "";
        if (desigInput && !desigInput.value) desigInput.value = existingEntry.entry_officer_designation || "";
        if (mobileInput && !mobileInput.value) mobileInput.value = existingEntry.entry_officer_mobile || "";

        showToast(`Loaded entry officer details for ${officeName}.`, "info");
    }

    // 2. Update the live card showing all officers submitted for this office
    if (formId === "officer-qualification-form") {
        updateOfficeOfficersCard(officeName);
    }
}

// Render the live table of officers registered for the selected office
function updateOfficeOfficersCard(officeName) {
    const card = document.getElementById("oq-office-officers-card");
    const tbody = document.querySelector("#oq-office-officers-table tbody");
    const countBadge = document.getElementById("oq-office-officers-count");
    const titleEl = document.getElementById("oq-office-officers-title");
    
    if (!card || !tbody) return;

    const currentOffice = officeName || (oqOfficeSelect ? oqOfficeSelect.value : "");
    if (!currentOffice) {
        card.classList.add("hidden");
        return;
    }

    const officeOfficers = officerQualificationsData.filter(o => o.office_name === currentOffice);
    
    if (officeOfficers.length === 0) {
        card.classList.remove("hidden");
        titleEl.textContent = `Registered Officers in ${currentOffice}`;
        countBadge.textContent = "0 Officers";
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:1.5rem;">No officers registered yet for this office. Use the form above to add an officer.</td></tr>`;
        return;
    }

    card.classList.remove("hidden");
    titleEl.textContent = `Registered Officers in ${currentOffice}`;
    countBadge.textContent = `${officeOfficers.length} Officer${officeOfficers.length > 1 ? 's' : ''}`;
    tbody.innerHTML = "";

    officeOfficers.forEach(officer => {
        const tr = document.createElement("tr");
        const qualClass = getQualificationBadgeClass(officer.educational_qualification);
        const desigClass = getDesignationBadgeClass(officer.officer_designation);

        tr.innerHTML = `
            <td><strong>${officer.officer_name}</strong></td>
            <td><span class="badge ${desigClass}">${officer.officer_designation}</span></td>
            <td>
                <span class="badge ${qualClass}">${officer.educational_qualification}</span>
                ${officer.educational_qualification === 'Other' && officer.qualification_other ? `<small style="display:block;color:var(--text-muted);">${officer.qualification_other}</small>` : ''}
            </td>
            <td>${officer.specialization || '<span style="color:var(--text-muted);">-</span>'}</td>
            <td><span class="text-truncate-preview" title="${(officer.training_attended || '').replace(/"/g, '&quot;')}">${officer.training_attended || '<span style="color:var(--text-muted);">-</span>'}</span></td>
            <td>
                <button class="view-btn-action" title="View Profile" onclick="showOfficerDetails('${officer.id}')">
                    <i data-lucide="info"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

// --- Submit form handler: IT Equipment ---
async function submitForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="spinner"></i> Submitting...';

    // 1. Gather printer details
    const printersData = {};
    form.querySelectorAll("#printers-table tbody tr").forEach(row => {
        const type = row.getAttribute("data-printer-type");
        printersData[type] = {
            working: parseInt(row.querySelector(".print-work").value) || 0,
            not_working: parseInt(row.querySelector(".print-nowork").value) || 0,
            multipurpose: parseInt(row.querySelector(".print-multi").value) || 0
        };
    });

    // 2. Prepare payload
    const officeName = form.querySelector("#form-office-name").value;
    const monitorWorking = parseInt(form.querySelector("#form-monitor-working").value) || 0;
    const monitorNotWorking = parseInt(form.querySelector("#form-monitor-not-working").value) || 0;
    const cpuWorking = parseInt(form.querySelector("#form-cpu-working").value) || 0;
    const cpuNotWorking = parseInt(form.querySelector("#form-cpu-not-working").value) || 0;
    
    const workingDotMatrix = printersData.dot_matrix?.working || 0;
    const notWorkingDesktop = cpuNotWorking + monitorNotWorking;

    const payload = {
        office_name: officeName,
        monitor_working: monitorWorking,
        monitor_not_working: monitorNotWorking,
        cpu_working: cpuWorking,
        cpu_not_working: cpuNotWorking,
        laptops_working: parseInt(form.querySelector("#form-laptops-working").value) || 0,
        laptops_not_working: parseInt(form.querySelector("#form-laptops-not-working").value) || 0,
        aio_working: parseInt(form.querySelector("#form-aio-working").value) || 0,
        aio_not_working: parseInt(form.querySelector("#form-aio-not-working").value) || 0,
        
        ups_working: parseInt(form.querySelector("#form-ups-working").value) || 0,
        ups_not_working: parseInt(form.querySelector("#form-ups-not-working").value) || 0,
        batteries_working: parseInt(form.querySelector("#form-batteries-working").value) || 0,
        batteries_not_working: parseInt(form.querySelector("#form-batteries-not-working").value) || 0,
        
        working_dot_matrix: workingDotMatrix,
        not_working_desktop: notWorkingDesktop,
        printers_data: printersData,
        
        os_version: form.querySelector("#form-os-version").value,
        network_type: form.querySelector("#form-network-type").value,
        network_other_detail: form.querySelector("#form-network-type").value === "Others" 
            ? form.querySelector(formId === "equipment-form" ? "#form-network-other" : "#admin-form-network-other").value 
            : "",
        network_speed: form.querySelector("#form-network-speed").value,
        
        age_3yr: parseInt(form.querySelector("#form-age-3yr").value) || 0,
        age_3_5yr: parseInt(form.querySelector("#form-age-3-5yr").value) || 0,
        age_5_8yr: parseInt(form.querySelector("#form-age-5-8yr").value) || 0,
        age_above_8yr: parseInt(form.querySelector("#form-age-above-8yr").value) || 0,
        
        remarks: form.querySelector("#form-remarks").value
    };

    let success = false;
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('equipment_entries')
                .insert([payload]);
            if (error) throw error;
            success = true;
            showToast("Equipment details submitted successfully to Database!", "success");
        } catch (e) {
            console.error("Database save failed:", e);
            showToast("Database connection failed. Saving locally.", "warning");
            saveEntryLocally(payload);
            success = true;
        }
    } else {
        saveEntryLocally(payload);
        success = true;
        showToast("Equipment details saved locally.", "info");
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i data-lucide="send"></i> Submit Equipment Details';
    if (window.lucide) window.lucide.createIcons();

    if (success) {
        await refreshData();
        
        if (formId === "equipment-form") {
            equipmentForm.reset();
            document.getElementById("other-network-container").classList.add("hidden");
            calcWorkingDotMatrix.textContent = "0";
            calcNotWorkingDesktops.textContent = "0";
            
            document.getElementById("nav-btn-view").click();
            switchPublicView('equipment');
        } else {
            const adminForm = document.getElementById("admin-equipment-form");
            if (adminForm) {
                adminForm.reset();
                document.getElementById("admin-other-network-container").classList.add("hidden");
            }
            document.querySelector('.admin-tab[data-target="admin-tab-view"]').click();
            switchAdminManageView('equipment');
        }
    }
}

function saveEntryLocally(payload) {
    payload.id = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    payload.created_at = new Date().toISOString();
    entriesData.unshift(payload);
    localStorage.setItem("mvd_entries_cache", JSON.stringify(entriesData));
}

// --- Submit form handler: Officer Qualification ---
async function submitOfficerForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="spinner"></i> Submitting Officer...';

    const isPublic = formId === "officer-qualification-form";
    const officeName = form.querySelector(isPublic ? "#oq-office-name" : "#admin-oq-office-name").value;
    const entryOfficerName = form.querySelector(isPublic ? "#oq-entry-officer-name" : "#admin-oq-entry-officer-name").value;
    const entryOfficerDesig = form.querySelector(isPublic ? "#oq-entry-officer-designation" : "#admin-oq-entry-officer-designation").value;
    const entryOfficerMobile = form.querySelector(isPublic ? "#oq-entry-officer-mobile" : "#admin-oq-entry-officer-mobile").value;

    const officerName = form.querySelector(isPublic ? "#oq-officer-name" : "#admin-oq-officer-name").value;
    const officerDesig = form.querySelector(isPublic ? "#oq-officer-designation" : "#admin-oq-officer-designation").value;
    const educationQual = form.querySelector(isPublic ? "#oq-education-qualification" : "#admin-oq-education-qualification").value;
    const otherQualInput = form.querySelector(isPublic ? "#oq-qualification-other" : "#admin-oq-qualification-other");
    const qualOther = educationQual === "Other" && otherQualInput ? otherQualInput.value : "";
    const specialization = form.querySelector(isPublic ? "#oq-specialization" : "#admin-oq-specialization").value;
    const trainingAttended = form.querySelector(isPublic ? "#oq-training-attended" : "#admin-oq-training-attended").value;

    const payload = {
        office_name: officeName,
        entry_officer_name: entryOfficerName,
        entry_officer_designation: entryOfficerDesig,
        entry_officer_mobile: entryOfficerMobile,
        officer_name: officerName,
        officer_designation: officerDesig,
        educational_qualification: educationQual,
        qualification_other: qualOther,
        specialization: specialization,
        training_attended: trainingAttended
    };

    let success = false;
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('officer_qualifications')
                .insert([payload]);
            if (error) throw error;
            success = true;
            showToast(`Officer qualification for ${officerName} submitted successfully!`, "success");
        } catch (e) {
            console.error("Database save failed:", e);
            showToast("Database connection failed. Saving officer locally.", "warning");
            saveOfficerLocally(payload);
            success = true;
        }
    } else {
        saveOfficerLocally(payload);
        success = true;
        showToast(`Officer qualification for ${officerName} saved locally.`, "info");
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i data-lucide="user-plus"></i> Submit Officer Qualification';
    if (window.lucide) window.lucide.createIcons();

    if (success) {
        await refreshData();

        // Clear Officer Profile fields, but keep Office Section populated for rapid entry of next officer
        form.querySelector(isPublic ? "#oq-officer-name" : "#admin-oq-officer-name").value = "";
        form.querySelector(isPublic ? "#oq-officer-designation" : "#admin-oq-officer-designation").value = "";
        form.querySelector(isPublic ? "#oq-education-qualification" : "#admin-oq-education-qualification").value = "";
        if (otherQualInput) otherQualInput.value = "";
        const otherContainer = form.querySelector(isPublic ? "#oq-other-qualification-container" : "#admin-oq-other-qualification-container");
        if (otherContainer) otherContainer.classList.add("hidden");
        form.querySelector(isPublic ? "#oq-specialization" : "#admin-oq-specialization").value = "";
        form.querySelector(isPublic ? "#oq-training-attended" : "#admin-oq-training-attended").value = "";

        // Re-focus officer name field for convenience
        const nextInput = form.querySelector(isPublic ? "#oq-officer-name" : "#admin-oq-officer-name");
        if (nextInput) nextInput.focus();

        if (isPublic) {
            updateOfficeOfficersCard(officeName);
        }
    }
}

function saveOfficerLocally(payload) {
    payload.id = 'officer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    payload.created_at = new Date().toISOString();
    officerQualificationsData.unshift(payload);
    localStorage.setItem("mvd_officers_cache", JSON.stringify(officerQualificationsData));
}

// --- Render Public View Tables ---
function switchPublicView(view) {
    const equipPill = document.getElementById("view-pill-equipment");
    const officerPill = document.getElementById("view-pill-officers");
    const equipContainer = document.getElementById("public-view-equipment-container");
    const officerContainer = document.getElementById("public-view-officers-container");

    if (view === 'equipment') {
        equipPill.classList.add("active");
        officerPill.classList.remove("active");
        equipContainer.classList.remove("hidden");
        officerContainer.classList.add("hidden");
        renderPublicTable();
    } else {
        officerPill.classList.add("active");
        equipPill.classList.remove("active");
        officerContainer.classList.remove("hidden");
        equipContainer.classList.add("hidden");
        renderPublicOfficersTable();
    }
}

function renderPublicTable() {
    const tbody = document.querySelector("#public-entries-table tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    const searchQuery = document.getElementById("public-search").value.toLowerCase().trim();
    const networkFilter = document.getElementById("public-filter-network").value;

    const officeLatestEntries = getLatestEntriesPerOffice();

    let filtered = officeLatestEntries.filter(entry => {
        const matchesSearch = entry.office_name.toLowerCase().includes(searchQuery);
        const matchesNetwork = networkFilter === "" || entry.network_type === networkFilter;
        return matchesSearch && matchesNetwork;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="text-align:center;color:var(--text-muted);padding:2rem;">No submissions found matching criteria.</td></tr>`;
        return;
    }

    filtered.forEach(entry => {
        const tr = document.createElement("tr");
        
        const totalWorking = entry.cpu_working + entry.laptops_working + entry.aio_working;
        const totalFaulty = entry.cpu_not_working + entry.laptops_not_working + entry.aio_not_working;
        
        const formattedDate = new Date(entry.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        tr.innerHTML = `
            <td><strong>${entry.office_name}</strong></td>
            <td><span class="text-secondary">${entry.os_version || "N/A"}</span></td>
            <td><span class="badge badge-network">${entry.network_type} ${entry.network_type === 'Others' ? '(' + (entry.network_other_detail || '') + ')' : ''}</span></td>
            <td><span class="text-secondary">${entry.network_speed || "N/A"}</span></td>
            <td>
                <span class="badge badge-working">${totalWorking} Working</span>
                <span class="badge badge-time" style="background-color:var(--danger-glow);color:var(--danger-color);margin-left:4px;">${totalFaulty} Faulty</span>
            </td>
            <td><span class="badge badge-time">${formattedDate}</span></td>
            <td>
                <button class="view-btn-action" title="View details" onclick="showEntryDetails('${entry.id}')">
                    <i data-lucide="info"></i>
                </button>
            </td>
        `;

        tr.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                showEntryDetails(entry.id);
            }
        });

        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

function renderPublicOfficersTable() {
    const tbody = document.querySelector("#public-officers-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const searchInput = document.getElementById("public-officers-search");
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const filterDesig = document.getElementById("public-officers-filter-desig")?.value || "";
    const filterQual = document.getElementById("public-officers-filter-qual")?.value || "";

    let filtered = officerQualificationsData.filter(officer => {
        const matchesSearch = officer.office_name.toLowerCase().includes(searchQuery) ||
                              officer.officer_name.toLowerCase().includes(searchQuery) ||
                              (officer.specialization && officer.specialization.toLowerCase().includes(searchQuery)) ||
                              (officer.training_attended && officer.training_attended.toLowerCase().includes(searchQuery));
        const matchesDesig = filterDesig === "" || officer.officer_designation === filterDesig;
        const matchesQual = filterQual === "" || officer.educational_qualification === filterQual;
        return matchesSearch && matchesDesig && matchesQual;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="text-align:center;color:var(--text-muted);padding:2rem;">No officer qualification entries found.</td></tr>`;
        return;
    }

    filtered.forEach(officer => {
        const tr = document.createElement("tr");
        const qualClass = getQualificationBadgeClass(officer.educational_qualification);
        const desigClass = getDesignationBadgeClass(officer.officer_designation);

        const formattedDate = new Date(officer.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        tr.innerHTML = `
            <td><strong>${officer.office_name}</strong></td>
            <td><strong style="color:var(--text-primary);">${officer.officer_name}</strong></td>
            <td><span class="badge ${desigClass}">${officer.officer_designation}</span></td>
            <td>
                <span class="badge ${qualClass}">${officer.educational_qualification}</span>
                ${officer.educational_qualification === 'Other' && officer.qualification_other ? `<small style="display:block;color:var(--text-muted);">${officer.qualification_other}</small>` : ''}
            </td>
            <td>${officer.specialization || '<span style="color:var(--text-muted);">-</span>'}</td>
            <td><span class="text-truncate-preview" title="${(officer.training_attended || '').replace(/"/g, '&quot;')}">${officer.training_attended || '<span style="color:var(--text-muted);">-</span>'}</span></td>
            <td><span class="badge badge-time">${formattedDate}</span></td>
            <td>
                <button class="view-btn-action" title="View Details" onclick="showOfficerDetails('${officer.id}')">
                    <i data-lucide="info"></i>
                </button>
            </td>
        `;

        tr.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                showOfficerDetails(officer.id);
            }
        });

        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

// Badge styling helper
function getQualificationBadgeClass(qual) {
    if (!qual) return 'badge-qualification';
    if (qual.includes('PHD')) return 'badge-qualification phd';
    if (qual.includes('M.Tech')) return 'badge-qualification mtech';
    if (qual.includes('B.Tech')) return 'badge-qualification btech';
    if (qual.includes('Diploma')) return 'badge-qualification diploma';
    return 'badge-qualification';
}

function getDesignationBadgeClass(desig) {
    if (!desig) return 'badge-designation';
    if (desig === 'Regional Transport Officer') return 'badge-designation rto';
    if (desig === 'Joint Regional Transport Officer') return 'badge-designation jrto';
    if (desig === 'Motor Vehicle Inspector') return 'badge-designation mvi';
    if (desig === 'Asst. Motor Vehicles Inspector') return 'badge-designation amvi';
    return 'badge-designation';
}

function getLatestEntriesPerOffice() {
    const offices = {};
    entriesData.forEach(entry => {
        if (!offices[entry.office_name]) {
            offices[entry.office_name] = entry;
        } else {
            const currentObjDate = new Date(offices[entry.office_name].created_at);
            const thisObjDate = new Date(entry.created_at);
            if (thisObjDate > currentObjDate) {
                offices[entry.office_name] = entry;
            }
        }
    });
    return Object.values(offices);
}

// --- Render Admin View Tables ---
function switchAdminManageView(view) {
    const equipPill = document.getElementById("admin-manage-pill-equipment");
    const officerPill = document.getElementById("admin-manage-pill-officers");
    const equipContainer = document.getElementById("admin-manage-equipment-container");
    const officerContainer = document.getElementById("admin-manage-officers-container");

    if (view === 'equipment') {
        equipPill.classList.add("active");
        officerPill.classList.remove("active");
        equipContainer.classList.remove("hidden");
        officerContainer.classList.add("hidden");
        renderAdminTable();
    } else {
        officerPill.classList.add("active");
        equipPill.classList.remove("active");
        officerContainer.classList.remove("hidden");
        equipContainer.classList.add("hidden");
        renderAdminOfficersTable();
    }
}

function switchAdminEntryView(view) {
    const equipPill = document.getElementById("admin-entry-pill-equipment");
    const officerPill = document.getElementById("admin-entry-pill-officers");
    const equipContainer = document.getElementById("admin-equipment-form-container");
    const officerContainer = document.getElementById("admin-officers-form-container");

    if (view === 'equipment') {
        equipPill.classList.add("active");
        officerPill.classList.remove("active");
        equipContainer.classList.remove("hidden");
        officerContainer.classList.add("hidden");
    } else {
        officerPill.classList.add("active");
        equipPill.classList.remove("active");
        officerContainer.classList.remove("hidden");
        equipContainer.classList.add("hidden");
    }
}

function renderAdminTable() {
    const tbody = document.querySelector("#admin-entries-table tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    const searchQuery = document.getElementById("admin-search").value.toLowerCase().trim();

    let filtered = entriesData.filter(entry => {
        return entry.office_name.toLowerCase().includes(searchQuery) ||
               (entry.os_version && entry.os_version.toLowerCase().includes(searchQuery)) ||
               (entry.network_type && entry.network_type.toLowerCase().includes(searchQuery));
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="text-align:center;color:var(--text-muted);padding:2rem;">No entries found.</td></tr>`;
        return;
    }

    filtered.forEach(entry => {
        const tr = document.createElement("tr");
        
        const workingCount = `${entry.monitor_working} / ${entry.cpu_working} / ${entry.laptops_working}`;
        const brokenCount = `${entry.monitor_not_working} / ${entry.cpu_not_working} / ${entry.laptops_not_working}`;
        const batteries = `${entry.batteries_working} / ${entry.batteries_not_working}`;
        
        const formattedDate = new Date(entry.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        tr.innerHTML = `
            <td><strong>${entry.office_name}</strong></td>
            <td><span class="text-secondary" style="font-size:0.8rem;">${entry.os_version || "N/A"}</span></td>
            <td>
                <span class="badge badge-network">${entry.network_type}</span>
                <span class="text-muted" style="display:block;font-size:0.75rem;">${entry.network_speed || "N/A"}</span>
            </td>
            <td><span class="badge badge-working">${workingCount}</span></td>
            <td><span class="badge" style="background-color:var(--danger-glow);color:var(--danger-color);">${brokenCount}</span></td>
            <td><span class="text-secondary">${batteries}</span></td>
            <td><span class="badge badge-time" style="font-size:0.75rem;">${formattedDate}</span></td>
            <td>
                <div style="display:flex;gap:4px;">
                    <button class="view-btn-action" title="View Details" onclick="showEntryDetails('${entry.id}')">
                        <i data-lucide="info"></i>
                    </button>
                    <button class="delete-btn-action" title="Delete Entry" onclick="deleteEntry('${entry.id}', '${entry.office_name}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

function renderAdminOfficersTable() {
    const tbody = document.querySelector("#admin-officers-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const searchInput = document.getElementById("admin-officers-search");
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

    let filtered = officerQualificationsData.filter(officer => {
        return officer.office_name.toLowerCase().includes(searchQuery) ||
               officer.officer_name.toLowerCase().includes(searchQuery) ||
               officer.officer_designation.toLowerCase().includes(searchQuery) ||
               (officer.entry_officer_name && officer.entry_officer_name.toLowerCase().includes(searchQuery));
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="text-align:center;color:var(--text-muted);padding:2rem;">No officer entries found.</td></tr>`;
        return;
    }

    filtered.forEach(officer => {
        const tr = document.createElement("tr");
        const qualClass = getQualificationBadgeClass(officer.educational_qualification);
        const desigClass = getDesignationBadgeClass(officer.officer_designation);

        tr.innerHTML = `
            <td><strong>${officer.office_name}</strong></td>
            <td><strong style="color:var(--text-primary);">${officer.officer_name}</strong></td>
            <td><span class="badge ${desigClass}">${officer.officer_designation}</span></td>
            <td><span class="badge ${qualClass}">${officer.educational_qualification}</span></td>
            <td>${officer.specialization || '<span style="color:var(--text-muted);">-</span>'}</td>
            <td><span class="text-truncate-preview" title="${(officer.training_attended || '').replace(/"/g, '&quot;')}">${officer.training_attended || '<span style="color:var(--text-muted);">-</span>'}</span></td>
            <td>
                <span class="text-secondary" style="font-size:0.8rem;">${officer.entry_officer_name || "N/A"}</span>
                <small style="display:block;color:var(--text-muted);">${officer.entry_officer_mobile || ""}</small>
            </td>
            <td>
                <div style="display:flex;gap:4px;">
                    <button class="view-btn-action" title="View Details" onclick="showOfficerDetails('${officer.id}')">
                        <i data-lucide="info"></i>
                    </button>
                    <button class="delete-btn-action" title="Delete Entry" onclick="deleteOfficerEntry('${officer.id}', '${officer.officer_name}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

// --- View Entry Details Modals ---
function showEntryDetails(id) {
    const entry = entriesData.find(e => e.id === id);
    if (!entry) return;

    const modal = document.getElementById("details-modal");
    document.getElementById("modal-title").innerHTML = `<i data-lucide="server" style="width:20px;height:20px;margin-right:6px;"></i> ${entry.office_name} - IT Inventory Details`;
    
    const formattedDate = new Date(entry.created_at).toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const printers = entry.printers_data || {};
    const renderPrinterRow = (name, type) => {
        const p = printers[type] || { working: 0, not_working: 0, multipurpose: 0 };
        return `
            <tr>
                <td>${name}</td>
                <td style="color:#10b981;font-weight:600;">${p.working}</td>
                <td style="color:#ef4444;font-weight:600;">${p.not_working}</td>
                <td style="color:var(--primary-color);font-weight:600;">${p.multipurpose}</td>
            </tr>
        `;
    };

    const content = `
        <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:0.8rem;margin-bottom:1rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
            <span>Submission ID: ${entry.id}</span>
            <span>Recorded at: ${formattedDate}</span>
        </div>

        <div class="modal-section-title">1. Office & Network Settings</div>
        <table class="modal-details-table">
            <tr>
                <th>Operating System</th>
                <td>${entry.os_version || "N/A"}</td>
            </tr>
            <tr>
                <th>Available Network</th>
                <td>${entry.network_type} ${entry.network_type === 'Others' ? '(' + (entry.network_other_detail || '') + ')' : ''}</td>
            </tr>
            <tr>
                <th>Network Speed</th>
                <td>${entry.network_speed || "N/A"}</td>
            </tr>
        </table>

        <div class="modal-section-title">2. Compute Systems Tally</div>
        <table class="modal-details-table">
            <thead>
                <tr style="background-color:rgba(0,0,0,0.05)">
                    <th style="font-weight:600;">System Type</th>
                    <th style="font-weight:600;color:#10b981;">Working</th>
                    <th style="font-weight:600;color:#ef4444;">Not Working</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Monitors</th>
                    <td>${entry.monitor_working}</td>
                    <td>${entry.monitor_not_working}</td>
                </tr>
                <tr>
                    <th>CPUs</th>
                    <td>${entry.cpu_working}</td>
                    <td>${entry.cpu_not_working}</td>
                </tr>
                <tr>
                    <th>Laptops</th>
                    <td>${entry.laptops_working}</td>
                    <td>${entry.laptops_not_working}</td>
                </tr>
                <tr>
                    <th>All-in-One PCs</th>
                    <td>${entry.aio_working}</td>
                    <td>${entry.aio_not_working}</td>
                </tr>
            </tbody>
        </table>

        <div class="modal-section-title">3. Printer Systems Tally</div>
        <table class="modal-details-table">
            <thead>
                <tr style="background-color:rgba(0,0,0,0.05)">
                    <th style="font-weight:600;">Printer Model</th>
                    <th style="font-weight:600;color:#10b981;">Working</th>
                    <th style="font-weight:600;color:#ef4444;">Not Working</th>
                    <th style="font-weight:600;color:var(--primary-color);">Multipurpose</th>
                </tr>
            </thead>
            <tbody>
                ${renderPrinterRow("Dot Matrix Printer", "dot_matrix")}
                ${renderPrinterRow("Ink Jet Printer", "ink_jet")}
                ${renderPrinterRow("Laser Printer", "laser")}
                ${renderPrinterRow("Xerox Machine", "xerox")}
                ${renderPrinterRow("Others", "others")}
            </tbody>
        </table>

        <div class="modal-section-title">4. Batteries & UPS Power</div>
        <table class="modal-details-table">
            <tr>
                <th>UPS Units</th>
                <td>${entry.ups_working} Working / ${entry.ups_not_working} Faulty</td>
            </tr>
            <tr>
                <th>Batteries Status</th>
                <td>${entry.batteries_working} In-Use / ${entry.batteries_not_working} Not In Use</td>
            </tr>
        </table>

        <div class="modal-section-title">5. Equipment Age (Years)</div>
        <table class="modal-details-table">
            <tr>
                <th>Under 3 Years Old</th>
                <td>${entry.age_3yr} Systems</td>
            </tr>
            <tr>
                <th>3 to 5 Years Old</th>
                <td>${entry.age_3_5yr} Systems</td>
            </tr>
            <tr>
                <th>5 to 8 Years Old</th>
                <td>${entry.age_5_8yr} Systems</td>
            </tr>
            <tr>
                <th>Above 8 Years Old</th>
                <td>${entry.age_above_8yr} Systems</td>
            </tr>
        </table>

        <div class="modal-section-title">6. Auto-Aggregates & Remarks</div>
        <table class="modal-details-table">
            <tr>
                <th>Dot Matrix Working Count</th>
                <td>${entry.working_dot_matrix} devices</td>
            </tr>
            <tr>
                <th>Faulty Desktop Units (CPU + Monitor)</th>
                <td>${entry.not_working_desktop} units</td>
            </tr>
            <tr>
                <th>Remarks & Specific Conditions</th>
                <td style="white-space:pre-wrap;">${entry.remarks || "No remarks provided."}</td>
            </tr>
        </table>
    `;

    document.getElementById("modal-body-content").innerHTML = content;
    modal.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
}

function showOfficerDetails(id) {
    const officer = officerQualificationsData.find(o => o.id === id);
    if (!officer) return;

    const modal = document.getElementById("details-modal");
    document.getElementById("modal-title").innerHTML = `<i data-lucide="graduation-cap" style="width:20px;height:20px;margin-right:6px;"></i> ${officer.officer_name} - Qualification Profile`;

    const formattedDate = new Date(officer.created_at).toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const qualClass = getQualificationBadgeClass(officer.educational_qualification);
    const desigClass = getDesignationBadgeClass(officer.officer_designation);

    const content = `
        <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:0.8rem;margin-bottom:1rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
            <span>Officer Record ID: ${officer.id}</span>
            <span>Recorded at: ${formattedDate}</span>
        </div>

        <div class="modal-section-title">1. Office Information</div>
        <table class="modal-details-table">
            <tr>
                <th>Office Name</th>
                <td><strong>${officer.office_name}</strong></td>
            </tr>
            <tr>
                <th>Entry Officer Name</th>
                <td>${officer.entry_officer_name || "N/A"}</td>
            </tr>
            <tr>
                <th>Entry Officer Designation</th>
                <td>${officer.entry_officer_designation || "N/A"}</td>
            </tr>
            <tr>
                <th>Mobile Number</th>
                <td><a href="tel:${officer.entry_officer_mobile}" style="color:var(--primary-color);text-decoration:none;">${officer.entry_officer_mobile || "N/A"}</a></td>
            </tr>
        </table>

        <div class="modal-section-title">2. Officer Profile</div>
        <table class="modal-details-table">
            <tr>
                <th>Name of Officer</th>
                <td><strong style="font-size:1.05rem;color:var(--text-primary);">${officer.officer_name}</strong></td>
            </tr>
            <tr>
                <th>Designation</th>
                <td><span class="badge ${desigClass}">${officer.officer_designation}</span></td>
            </tr>
            <tr>
                <th>Educational Qualification</th>
                <td>
                    <span class="badge ${qualClass}">${officer.educational_qualification}</span>
                    ${officer.educational_qualification === 'Other' && officer.qualification_other ? ` <em>(${officer.qualification_other})</em>` : ''}
                </td>
            </tr>
            <tr>
                <th>Specialization</th>
                <td>${officer.specialization || "None specified"}</td>
            </tr>
            <tr>
                <th>Training Attended</th>
                <td style="white-space:pre-wrap;">${officer.training_attended || "No training records reported."}</td>
            </tr>
        </table>
    `;

    document.getElementById("modal-body-content").innerHTML = content;
    modal.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
}

function closeDetailsModal() {
    document.getElementById("details-modal").classList.add("hidden");
}

// --- Delete Entry (Admin Action) ---
async function deleteEntry(id, officeName) {
    if (!confirm(`Are you absolutely sure you want to delete the equipment entry for ${officeName}?`)) {
        return;
    }

    let success = false;
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('equipment_entries')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            success = true;
            showToast(`Database entry for ${officeName} deleted.`, "success");
        } catch (e) {
            console.error("Database deletion failed:", e);
            showToast("Failed to delete from database. Deleting locally.", "warning");
            deleteLocalEntry(id);
            success = true;
        }
    } else {
        deleteLocalEntry(id);
        success = true;
        showToast("Local entry deleted.", "info");
    }

    if (success) {
        await refreshData();
    }
}

function deleteLocalEntry(id) {
    entriesData = entriesData.filter(e => e.id !== id);
    localStorage.setItem("mvd_entries_cache", JSON.stringify(entriesData));
}

async function deleteOfficerEntry(id, officerName) {
    if (!confirm(`Are you sure you want to delete the officer record for ${officerName}?`)) {
        return;
    }

    let success = false;
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('officer_qualifications')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            success = true;
            showToast(`Officer record for ${officerName} deleted.`, "success");
        } catch (e) {
            console.error("Database officer deletion failed:", e);
            showToast("Failed to delete from database. Deleting locally.", "warning");
            deleteLocalOfficerEntry(id);
            success = true;
        }
    } else {
        deleteLocalOfficerEntry(id);
        success = true;
        showToast("Local officer entry deleted.", "info");
    }

    if (success) {
        await refreshData();
    }
}

function deleteLocalOfficerEntry(id) {
    officerQualificationsData = officerQualificationsData.filter(o => o.id !== id);
    localStorage.setItem("mvd_officers_cache", JSON.stringify(officerQualificationsData));
}

// --- Admin Authentication Check ---
function checkAdminSession() {
    const isAuth = sessionStorage.getItem("mvd_admin_auth") === "true";
    const loginPanel = document.getElementById("admin-login-panel");
    const workspacePanel = document.getElementById("admin-workspace-panel");

    if (isAuth) {
        loginPanel.classList.add("hidden");
        workspacePanel.classList.remove("hidden");
        
        setupAdminFormMirrors();
        renderDashboard();
        renderAdminTable();
        renderAdminOfficersTable();
    } else {
        loginPanel.classList.remove("hidden");
        workspacePanel.classList.add("hidden");
    }
}

function logoutAdmin() {
    sessionStorage.removeItem("mvd_admin_auth");
    checkAdminSession();
    showToast("Logged out from admin console.", "info");
}

// Create copies of forms for admin workspace direct entry
function setupAdminFormMirrors() {
    // 1. Setup Equipment Mirror
    const equipContainer = document.getElementById("admin-form-placeholder");
    if (equipContainer && equipContainer.children.length === 0) {
        const formHTML = equipmentForm.innerHTML;
        const newForm = document.createElement("form");
        newForm.id = "admin-equipment-form";
        newForm.className = "grid-form";
        
        let customizedHTML = formHTML
            .replace(/id="form-office-name"/g, 'id="admin-form-office-name"')
            .replace(/id="other-network-container"/g, 'id="admin-other-network-container"')
            .replace(/id="form-network-other"/g, 'id="admin-form-network-other"')
            .replace(/id="submit-form-btn"/g, 'id="admin-submit-form-btn"');
        
        newForm.innerHTML = customizedHTML;
        equipContainer.appendChild(newForm);

        const adminOfficeSelect = newForm.querySelector("#admin-form-office-name");
        const sortedOffices = [...MVD_OFFICES].sort();
        sortedOffices.forEach(office => {
            const option = document.createElement("option");
            option.value = office;
            option.textContent = office;
            adminOfficeSelect.appendChild(option);
        });

        const adminNetworkSelect = newForm.querySelector("#form-network-type");
        const adminOtherContainer = newForm.querySelector("#admin-other-network-container");
        const adminOtherInput = newForm.querySelector("#admin-form-network-other");

        adminNetworkSelect.addEventListener("change", (e) => {
            if (e.target.value === "Others") {
                adminOtherContainer.classList.remove("hidden");
                adminOtherInput.setAttribute("required", "required");
            } else {
                adminOtherContainer.classList.add("hidden");
                adminOtherInput.removeAttribute("required");
                adminOtherInput.value = "";
            }
        });

        const updateAdminCalculations = () => {
            const monNoWork = parseInt(newForm.querySelector("#form-monitor-not-working").value) || 0;
            const cpuNoWork = parseInt(newForm.querySelector("#form-cpu-not-working").value) || 0;
            const dotMatrixWork = parseInt(newForm.querySelector('tr[data-printer-type="dot_matrix"] .print-work').value) || 0;

            newForm.querySelector("#calc-working-dot-matrix").textContent = dotMatrixWork;
            newForm.querySelector("#calc-not-working-desktops").textContent = monNoWork + cpuNoWork;
        };

        newForm.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener("input", updateAdminCalculations);
        });

        adminOfficeSelect.addEventListener("change", async (e) => {
            const office = e.target.value;
            if (!office) return;
            showToast(`Loading previous details for ${office}...`, "info");
            await prefillFormForOffice(office, "admin-equipment-form");
        });

        newForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await submitForm("admin-equipment-form");
        });
    }

    // 2. Setup Officer Qualification Mirror
    const officerContainer = document.getElementById("admin-officers-form-placeholder");
    if (officerContainer && officerContainer.children.length === 0 && oqForm) {
        const oqHTML = oqForm.innerHTML;
        const newOqForm = document.createElement("form");
        newOqForm.id = "admin-officers-form";
        newOqForm.className = "grid-form";

        let customizedOqHTML = oqHTML
            .replace(/id="oq-office-name"/g, 'id="admin-oq-office-name"')
            .replace(/id="oq-entry-officer-name"/g, 'id="admin-oq-entry-officer-name"')
            .replace(/id="oq-entry-officer-designation"/g, 'id="admin-oq-entry-officer-designation"')
            .replace(/id="oq-entry-officer-mobile"/g, 'id="admin-oq-entry-officer-mobile"')
            .replace(/id="oq-officer-name"/g, 'id="admin-oq-officer-name"')
            .replace(/id="oq-officer-designation"/g, 'id="admin-oq-officer-designation"')
            .replace(/id="oq-education-qualification"/g, 'id="admin-oq-education-qualification"')
            .replace(/id="oq-other-qualification-container"/g, 'id="admin-oq-other-qualification-container"')
            .replace(/id="oq-qualification-other"/g, 'id="admin-oq-qualification-other"')
            .replace(/id="oq-specialization"/g, 'id="admin-oq-specialization"')
            .replace(/id="oq-training-attended"/g, 'id="admin-oq-training-attended"')
            .replace(/id="oq-submit-btn"/g, 'id="admin-oq-submit-btn"');

        newOqForm.innerHTML = customizedOqHTML;
        officerContainer.appendChild(newOqForm);

        const adminOqOfficeSelect = newOqForm.querySelector("#admin-oq-office-name");
        const sortedOffices = [...MVD_OFFICES].sort();
        sortedOffices.forEach(office => {
            const option = document.createElement("option");
            option.value = office;
            option.textContent = office;
            adminOqOfficeSelect.appendChild(option);
        });

        const adminOqQualSelect = newOqForm.querySelector("#admin-oq-education-qualification");
        const adminOqOtherContainer = newOqForm.querySelector("#admin-oq-other-qualification-container");
        const adminOqOtherInput = newOqForm.querySelector("#admin-oq-qualification-other");

        adminOqQualSelect.addEventListener("change", (e) => {
            if (e.target.value === "Other") {
                adminOqOtherContainer.classList.remove("hidden");
                adminOqOtherInput.setAttribute("required", "required");
            } else {
                adminOqOtherContainer.classList.add("hidden");
                adminOqOtherInput.removeAttribute("required");
                adminOqOtherInput.value = "";
            }
        });

        adminOqOfficeSelect.addEventListener("change", async (e) => {
            const office = e.target.value;
            if (!office) return;
            await prefillOfficerEntryForOffice(office, "admin-officers-form");
        });

        newOqForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await submitOfficerForm("admin-officers-form");
        });
    }

    if (window.lucide) window.lucide.createIcons();
}

// --- Admin Dashboard Analytics (Chart.js) ---
function renderDashboard() {
    const isAuth = sessionStorage.getItem("mvd_admin_auth") === "true";
    if (!isAuth) return;

    const latestEntries = getLatestEntriesPerOffice();

    // 1. Equipment KPI Cards
    document.getElementById("kpi-offices-count").textContent = latestEntries.length;

    let totalWorkingSystems = 0;
    let totalFaultyDesktops = 0;
    let kswanCount = 0;

    latestEntries.forEach(entry => {
        totalWorkingSystems += (entry.cpu_working + entry.laptops_working + entry.aio_working);
        totalFaultyDesktops += (entry.cpu_not_working + entry.monitor_not_working);
        if (entry.network_type === "KSWAN") {
            kswanCount++;
        }
    });

    document.getElementById("kpi-working-systems").textContent = totalWorkingSystems;
    document.getElementById("kpi-faulty-desktops").textContent = totalFaultyDesktops;
    
    const kswanPercentage = latestEntries.length > 0 ? Math.round((kswanCount / latestEntries.length) * 100) : 0;
    document.getElementById("kpi-kswan-percent").textContent = `${kswanPercentage}%`;

    // 2. Officer KPI Cards
    const kpiOfficersCount = document.getElementById("kpi-officers-count");
    const kpiHigherQual = document.getElementById("kpi-higher-qual-count");
    const kpiTechnical = document.getElementById("kpi-technical-count");
    const kpiInspectors = document.getElementById("kpi-inspectors-count");

    if (kpiOfficersCount) kpiOfficersCount.textContent = officerQualificationsData.length;

    let higherCount = 0;
    let technicalCount = 0;
    let inspectorCount = 0;

    officerQualificationsData.forEach(o => {
        const q = o.educational_qualification;
        if (q === "PHD with Postdoc" || q === "PHD" || q === "M.Tech") {
            higherCount++;
        }
        if (q === "B.Tech" || q === "Diploma") {
            technicalCount++;
        }
        const d = o.officer_designation;
        if (d === "Motor Vehicle Inspector" || d === "Asst. Motor Vehicles Inspector") {
            inspectorCount++;
        }
    });

    if (kpiHigherQual) kpiHigherQual.textContent = higherCount;
    if (kpiTechnical) kpiTechnical.textContent = technicalCount;
    if (kpiInspectors) kpiInspectors.textContent = inspectorCount;

    // 3. Chart Visualizations
    drawSystemsHealthChart(latestEntries);
    drawSystemsAgeChart(latestEntries);
    drawNetworkDistChart(latestEntries);
    drawOfficerQualChart(officerQualificationsData);
    drawOfficerDesigChart(officerQualificationsData);
}

function drawSystemsHealthChart(data) {
    const ctx = document.getElementById("chart-systems-health");
    if (!ctx) return;

    if (charts.health) charts.health.destroy();

    let working = { monitors: 0, cpus: 0, laptops: 0, aios: 0 };
    let broken = { monitors: 0, cpus: 0, laptops: 0, aios: 0 };

    data.forEach(e => {
        working.monitors += e.monitor_working;
        broken.monitors += e.monitor_not_working;
        working.cpus += e.cpu_working;
        broken.cpus += e.cpu_not_working;
        working.laptops += e.laptops_working;
        broken.laptops += e.laptops_not_working;
        working.aios += e.aio_working;
        broken.aios += e.aio_not_working;
    });

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textColor = isDark ? "#9ca3af" : "#4b5563";

    charts.health = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Monitors', 'CPUs', 'Laptops', 'All-in-One PCs'],
            datasets: [
                {
                    label: 'Working Count',
                    data: [working.monitors, working.cpus, working.laptops, working.aios],
                    backgroundColor: '#10b981',
                    borderRadius: 6
                },
                {
                    label: 'Not Working Count',
                    data: [broken.monitors, broken.cpus, broken.laptops, broken.aios],
                    backgroundColor: '#ef4444',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor } }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                }
            }
        }
    });
}

function drawSystemsAgeChart(data) {
    const ctx = document.getElementById("chart-systems-age");
    if (!ctx) return;

    if (charts.age) charts.age.destroy();

    let ages = { age3: 0, age3_5: 0, age5_8: 0, ageAbove8: 0 };

    data.forEach(e => {
        ages.age3 += e.age_3yr;
        ages.age3_5 += e.age_3_5yr;
        ages.age5_8 += e.age_5_8yr;
        ages.ageAbove8 += e.age_above_8yr;
    });

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#9ca3af" : "#4b5563";

    charts.age = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['3 Years Old', '3-5 Years Old', '5-8 Years Old', '>8 Years Old'],
            datasets: [{
                data: [ages.age3, ages.age3_5, ages.age5_8, ages.ageAbove8],
                backgroundColor: ['#0ea5e9', '#6366f1', '#f59e0b', '#dc2626'],
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? '#111827' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: textColor }
                }
            }
        }
    });
}

function drawNetworkDistChart(data) {
    const ctx = document.getElementById("chart-network-dist");
    if (!ctx) return;

    if (charts.network) charts.network.destroy();

    const networks = {
        'KSWAN': 0, 'KFONE': 0, 'BSNL': 0, 'JIO': 0, 
        'Kerala Vision': 0, 'Asianet': 0, 'Others': 0
    };

    data.forEach(e => {
        if (networks[e.network_type] !== undefined) {
            networks[e.network_type]++;
        } else if (e.network_type) {
            networks['Others']++;
        }
    });

    const labels = Object.keys(networks);
    const chartData = Object.values(networks);
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textColor = isDark ? "#9ca3af" : "#4b5563";

    charts.network = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Offices Connected',
                data: chartData,
                backgroundColor: '#a855f7',
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, precision: 0 }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                }
            }
        }
    });
}

function drawOfficerQualChart(data) {
    const ctx = document.getElementById("chart-officers-qual");
    if (!ctx) return;

    if (charts.officerQual) charts.officerQual.destroy();

    const counts = {
        'PHD with Postdoc': 0,
        'PHD': 0,
        'M.Tech': 0,
        'B.Tech': 0,
        'Diploma': 0,
        'Other': 0
    };

    data.forEach(o => {
        if (counts[o.educational_qualification] !== undefined) {
            counts[o.educational_qualification]++;
        } else {
            counts['Other']++;
        }
    });

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#9ca3af" : "#4b5563";

    charts.officerQual = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#ec4899', '#f43f5e', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'],
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? '#111827' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: textColor }
                }
            }
        }
    });
}

function drawOfficerDesigChart(data) {
    const ctx = document.getElementById("chart-officers-desig");
    if (!ctx) return;

    if (charts.officerDesig) charts.officerDesig.destroy();

    const counts = {
        'RTO': 0,
        'Joint RTO': 0,
        'MVI': 0,
        'AMVI': 0
    };

    data.forEach(o => {
        if (o.officer_designation === 'Regional Transport Officer') counts['RTO']++;
        else if (o.officer_designation === 'Joint Regional Transport Officer') counts['Joint RTO']++;
        else if (o.officer_designation === 'Motor Vehicle Inspector') counts['MVI']++;
        else if (o.officer_designation === 'Asst. Motor Vehicles Inspector') counts['AMVI']++;
    });

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textColor = isDark ? "#9ca3af" : "#4b5563";

    charts.officerDesig = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Officers Count',
                data: Object.values(counts),
                backgroundColor: ['#c084fc', '#38bdf8', '#34d399', '#fbbf24'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, precision: 0 }
                }
            }
        }
    });
}

// --- CSV Export Functionality ---
function exportCSV() {
    if (entriesData.length === 0) {
        showToast("No equipment logs available to export.", "warning");
        return;
    }

    const headers = [
        "Office Name", "OS Version", "Network Provider", "Other Network Detail", 
        "Network Speed", "Monitor Working", "Monitor Faulty", "CPU Working", "CPU Faulty", 
        "Laptops Working", "Laptops Faulty", "AIO Working", "AIO Faulty", 
        "UPS Working", "UPS Faulty", "Batteries In Use", "Batteries Idle", 
        "Systems 3yr", "Systems 3-5yr", "Systems 5-8yr", "Systems >8yr", 
        "Dot Matrix Printers Working", "Xerox Working", "Remarks", "Created Date"
    ];

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

    entriesData.forEach(e => {
        const printers = e.printers_data || {};
        const dotMatrixWork = printers.dot_matrix?.working || 0;
        const xeroxWork = printers.xerox?.working || 0;

        const row = [
            `"${e.office_name}"`,
            `"${e.os_version || ''}"`,
            `"${e.network_type || ''}"`,
            `"${e.network_other_detail || ''}"`,
            `"${e.network_speed || ''}"`,
            e.monitor_working,
            e.monitor_not_working,
            e.cpu_working,
            e.cpu_not_working,
            e.laptops_working,
            e.laptops_not_working,
            e.aio_working,
            e.aio_not_working,
            e.ups_working,
            e.ups_not_working,
            e.batteries_working,
            e.batteries_not_working,
            e.age_3yr,
            e.age_3_5yr,
            e.age_5_8yr,
            e.age_above_8yr,
            dotMatrixWork,
            xeroxWork,
            `"${(e.remarks || '').replace(/"/g, '""')}"`,
            `"${e.created_at}"`
        ];
        
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MVD_IT_Equipment_List_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Equipment CSV report downloaded successfully.", "success");
}

function exportOfficersCSV() {
    if (officerQualificationsData.length === 0) {
        showToast("No officer qualification records available to export.", "warning");
        return;
    }

    const headers = [
        "Office Name", "Entry Officer Name", "Entry Officer Designation", "Entry Officer Mobile",
        "Officer Name", "Officer Designation", "Educational Qualification", "Qualification Other",
        "Specialization", "Training Attended", "Created Date"
    ];

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

    officerQualificationsData.forEach(o => {
        const row = [
            `"${o.office_name}"`,
            `"${(o.entry_officer_name || '').replace(/"/g, '""')}"`,
            `"${(o.entry_officer_designation || '').replace(/"/g, '""')}"`,
            `"${o.entry_officer_mobile || ''}"`,
            `"${(o.officer_name || '').replace(/"/g, '""')}"`,
            `"${o.officer_designation || ''}"`,
            `"${o.educational_qualification || ''}"`,
            `"${(o.qualification_other || '').replace(/"/g, '""')}"`,
            `"${(o.specialization || '').replace(/"/g, '""')}"`,
            `"${(o.training_attended || '').replace(/"/g, '""')}"`,
            `"${o.created_at}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MVD_Officer_Qualifications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Officer qualifications CSV downloaded successfully.", "success");
}

// --- Toast Notifications system ---
function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.position = "fixed";
        container.style.bottom = "2rem";
        container.style.right = "2rem";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "0.75rem";
        container.style.zIndex = "9999";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "info";
    let color = "#38bdf8";
    let bg = "rgba(14,165,233,0.15)";
    let border = "rgba(14,165,233,0.25)";
    
    if (type === "success") {
        icon = "check-circle";
        color = "#10b981";
        bg = "rgba(16,185,129,0.15)";
        border = "rgba(16,185,129,0.25)";
    } else if (type === "danger") {
        icon = "alert-circle";
        color = "#ef4444";
        bg = "rgba(239,68,68,0.15)";
        border = "rgba(239,68,68,0.25)";
    } else if (type === "warning") {
        icon = "alert-triangle";
        color = "#f59e0b";
        bg = "rgba(245,158,11,0.15)";
        border = "rgba(245,158,11,0.25)";
    }

    toast.style.background = bg;
    toast.style.color = color;
    toast.style.border = `1px solid ${border}`;
    toast.style.backdropFilter = "blur(8px)";
    toast.style.padding = "0.85rem 1.5rem";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.3)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "0.5rem";
    toast.style.fontSize = "0.875rem";
    toast.style.fontWeight = "500";
    toast.style.minWidth = "280px";
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)";

    toast.innerHTML = `<i data-lucide="${icon}" style="width:18px;height:18px;flex-shrink:0;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) container.remove();
        }, 300);
    }, 4000);
}

// Add animation keyframes in CSS style dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%) scale(0.9); }
        to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
    }
    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);
