// --- PHONE: app registry, folders & navigation ---
// Each app still opens its own modal. launchPhoneApp() remembers where the player came from, so an app's
// Back button can call phoneReturn() to land in its folder (or the home screen). Apps opened any other way
// (e.g. Save from the title screen) are unaffected: phoneReturn() returns false and they close as before.

window.phoneContext = null;

// Top-level entries are either an app or a folder ({ folder: [apps] }).
// unlock(): hides the entry until it returns true. badge(): shows a red dot while it returns true.
window.PHONE_APPS = [
    { id: "contacts", name: "Contacts", icon: "👥", color: "bg-pink-600", action: () => window.openContactsMenu() },
    { id: "personal", name: "Personal Info", icon: "🗂️", color: "bg-slate-700", folder: [
        { id: "id_card", name: "ID Card", icon: "🆔", color: "bg-white", action: () => window.showCharacterResume() },
        { id: "health", name: "Health", icon: "🩺", color: "bg-red-500", action: () => window.handleHealthCheck() },
        { id: "style", name: "Style", icon: "✂️", color: "bg-blue-500", action: () => window.openStyleStudio() }
    ]},
    { id: "socials", name: "Socials", icon: "💬", color: "bg-slate-700", folder: [
        { id: "readedit", name: "Readedit", icon: "📱", color: "bg-green-500", action: () => window.scrollPhone() },
        { id: "dingdong", name: "Ding Dong", icon: "🎵", color: "bg-black border border-slate-600", action: () => window.openDingDong() }
    ]},
    { id: "financials", name: "Financials", icon: "💼", color: "bg-slate-700", folder: [
        { id: "bank", name: "Bank", icon: "🏦", color: "bg-emerald-600", action: () => window.openBankingApp() },
        { id: "invest", name: "Invest", icon: "📈", color: "bg-green-600", action: () => window.openInvestmentApp() },
        { id: "commonapp", name: "College App", icon: "🎓", color: "bg-indigo-800 border border-indigo-500",
          unlock: () => state.currentYear >= 4,
          badge: () => !(state.phoneSeen || {}).commonapp,
          action: () => window.openCollegeApp() }
    ]},
    { id: "save", name: "Save", icon: "💾", color: "bg-slate-600", action: () => window.openSaveMenu() },
    { id: "howto", name: "How to Play", icon: "📖", color: "bg-amber-500",
      badge: () => !(state.phoneSeen || {}).howto,
      action: () => window.openHowToPlay() }
];

window.findPhoneApp = function(id) {
    for (const entry of window.PHONE_APPS) {
        if (entry.id === id) return { app: entry, folder: null };
        if (entry.folder) {
            const child = entry.folder.find(a => a.id === id);
            if (child) return { app: child, folder: entry };
        }
    }
    return null;
};

window.phoneVisibleApps = function(entries) {
    return entries.filter(e => !e.unlock || e.unlock());
};

window.phoneHasBadge = function(entry) {
    if (entry.folder) return window.phoneVisibleApps(entry.folder).some(a => a.badge && a.badge());
    return !!(entry.badge && entry.badge());
};

// Custom art (window.GAME_ART.app_<id>_icon) wins over the emoji. Art is shrunk when drawn inside a folder preview.
window.phoneIconHtml = function(app, mini) {
    const art = window.GAME_ART && window.GAME_ART[`app_${app.id}_icon`];
    if (art && mini) {
        // Bare SVG art has no size classes, so give it a fixed box to fill
        if (art.trim().startsWith('<svg')) return `<div class="w-4 h-4">${art.replace('<svg ', '<svg width="100%" height="100%" ')}</div>`;
        return art.replace(/w-\d+/g, 'w-4').replace(/h-\d+/g, 'h-4');
    }
    if (art) return art;
    return `<div class="${mini ? 'text-[11px] leading-none' : 'text-2xl'}">${app.icon}</div>`;
};

window.phoneTileHtml = function(entry) {
    const badge = window.phoneHasBadge(entry)
        ? `<span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border border-slate-900">!</span>`
        : '';

    let iconHtml, onclick;
    if (entry.folder) {
        const preview = window.phoneVisibleApps(entry.folder).slice(0, 4)
            .map(a => `<div class="flex items-center justify-center">${window.phoneIconHtml(a, true)}</div>`).join('');
        iconHtml = `<div class="grid grid-cols-2 gap-1 p-1.5 w-full h-full place-items-center">${preview}</div>`;
        onclick = `window.openPhoneFolder('${entry.id}')`;
    } else {
        iconHtml = window.phoneIconHtml(entry, false);
        onclick = `window.launchPhoneApp('${entry.id}')`;
    }

    return `
        <button onclick="${onclick}" class="flex flex-col items-center gap-1 group">
            <div class="relative w-12 h-12 ${entry.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-white">
                <div class="w-full h-full rounded-xl overflow-hidden flex items-center justify-center">${iconHtml}</div>
                ${badge}
            </div>
            <span class="text-[9px] font-bold text-slate-300 tracking-wide">${entry.name}</span>
        </button>`;
};

// Draws the phone frame. If the phone is already on screen, swap the contents in place so moving between
// home and folders doesn't re-run the pop-in animation.
window.renderPhoneScreen = function(innerHtml) {
    const html = `
        <div id="phone-frame" class="flex justify-center items-center h-full py-4" onclick="if(event.target === this) { window.closePhone(); }">
            <div class="bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 w-72 shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto">
                <div class="bg-slate-900 px-4 py-2 flex justify-between text-[10px] text-slate-400 font-mono select-none">
                    <span>${state.dayTotal > 0 ? 'Day ' + state.dayTotal : 'No Sim'}</span>
                    <span>100% 🔋</span>
                </div>
                <div class="bg-slate-900 flex-1 p-6 min-h-[22rem]">${innerHtml}</div>
                <div class="bg-slate-900 h-10 flex justify-center items-center">
                    <button onclick="window.closePhone()" class="w-16 h-1 bg-slate-600 rounded-full hover:bg-white transition-colors"></button>
                </div>
            </div>
        </div>`;

    const overlay = document.getElementById('modal-overlay');
    const phoneIsUp = !overlay.classList.contains('hidden') && document.getElementById('phone-frame');
    if (phoneIsUp) {
        document.getElementById('modal-content').innerHTML = html;
        return;
    }

    overlay.classList.add('hidden');
    state.pendingModals.push({ rawHtml: html, onOpen: () => {} });
    window.processModalQueue();
};

window.openPhoneMenu = function() {
    window.phoneContext = null;
    const tiles = window.phoneVisibleApps(window.PHONE_APPS).map(window.phoneTileHtml).join('');
    window.renderPhoneScreen(`
        <div class="text-center mb-8 mt-4">
            <div class="text-4xl font-thin text-white">${window.SEASONS[state.currentSeasonIndex]}</div>
            <div class="text-xs text-acs-gold uppercase tracking-widest font-bold">Day ${state.dayOfMonth}</div>
        </div>
        <div class="grid grid-cols-3 gap-y-6 gap-x-4">${tiles}</div>`);
};

window.openPhoneFolder = function(folderId) {
    const folder = window.PHONE_APPS.find(e => e.id === folderId && e.folder);
    if (!folder) return window.openPhoneMenu();

    window.phoneContext = null;
    const tiles = window.phoneVisibleApps(folder.folder).map(window.phoneTileHtml).join('');
    window.renderPhoneScreen(`
        <div class="flex items-center justify-between mb-8 mt-2">
            <button onclick="window.openPhoneMenu()" title="Home" class="w-10 text-left text-sm font-bold text-slate-400 hover:text-white transition-colors">◀</button>
            <div class="text-sm font-black text-white uppercase tracking-widest text-center">${folder.name}</div>
            <div class="w-10"></div>
        </div>
        <div class="grid grid-cols-3 gap-y-6 gap-x-4">${tiles}</div>`);
};

window.launchPhoneApp = function(id) {
    const found = window.findPhoneApp(id);
    if (!found) return;

    if (!state.phoneSeen) state.phoneSeen = {};
    state.phoneSeen[id] = true;
    window.phoneContext = { appId: id, folderId: found.folder ? found.folder.id : null };

    document.getElementById('modal-overlay').classList.add('hidden');
    setTimeout(() => found.app.action(), 100);
};

window.closePhone = function() {
    window.phoneContext = null;
    document.getElementById('modal-overlay').classList.add('hidden');
};

// Called by an app's Back/Close button. Returns true if the app was opened from the phone and we navigated
// back, so callers can fall back to their old behaviour with: if (!window.phoneReturn('id')) { ... }
window.phoneReturn = function(appId) {
    const ctx = window.phoneContext;
    if (!ctx || ctx.appId !== appId) return false;

    window.phoneContext = null;
    document.getElementById('modal-overlay').classList.add('hidden');
    setTimeout(() => ctx.folderId ? window.openPhoneFolder(ctx.folderId) : window.openPhoneMenu(), 50);
    return true;
};
