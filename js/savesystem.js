// --- SAVE SYSTEM ---
// Browser saves live in localStorage under SAVE_KEY as { slotName: state } (the original format, so older saves still load).
// Two rolling autosave slots are written when each day's summary appears. Any save can also be downloaded as a portable
// JSON file and loaded again on another computer.

(function () {

window.SAVE_KEY = "triton_quest_saves";
window.SAVE_FILE_FORMAT = 1;
window.SAVE_FILE_MAX_BYTES = 5 * 1024 * 1024;
window.AUTOSAVE_KEYS = ['__auto1', '__auto2'];            // latest, previous day

// Things that must never be written to a save (live audio objects, queued popups, debug flag)
const TRANSIENT_KEYS = ['pendingModals', 'introAudio', 'gameLoopAudio', 'currentAudio', 'debugMode'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
window.escapeHtml = esc;

// ---------- storage ----------

window.getSaves = function() {
    try {
        const raw = localStorage.getItem(window.SAVE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.warn("Save system not available:", e);
        return {};
    }
};

function writeSaves(saves) {
    localStorage.setItem(window.SAVE_KEY, JSON.stringify(saves));
}

window.serializeState = function(s) {
    return JSON.stringify(s || state, (key, value) => TRANSIENT_KEYS.includes(key) ? undefined : value);
};

// A clean copy of the current game, safe to store or export
function snapshotState() {
    const snap = JSON.parse(window.serializeState());
    snap.savedAt = Date.now();
    snap.saveTimestamp = new Date().toLocaleString();
    return snap;
}

// Slot names are shown in the UI and used as keys, so keep them tame
window.cleanSlotName = function(raw) {
    let name = String(raw || '').replace(/[<>"'`\\\/]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
    name = name.replace(/^_+/, '');   // leading underscores are reserved for autosaves
    return name;
};

window.slotLabel = function(key) {
    if (key === '__auto1') return 'Autosave';
    if (key === '__auto2') return 'Autosave (previous day)';
    return key;
};

const isAuto = (key) => window.AUTOSAVE_KEYS.includes(key);

window.describeSave = function(s) {
    const season = (window.SEASONS && window.SEASONS[s.currentSeasonIndex]) || '?';
    const bal = Number.isFinite(s.balance) ? '$' + Math.round(s.balance).toLocaleString() : '';
    return `Year ${s.currentYear} • ${season} ${s.dayOfMonth} • Day ${s.dayTotal} • ${esc(s.playerName)} • ${bal}`;
};

// ---------- manual save ----------

window.doSave = function(name, overwriteOk) {
    const clean = window.cleanSlotName(name);
    if (!clean) {
        document.getElementById('modal-overlay').classList.add('hidden');
        setTimeout(() => window.queueModal("NAME YOUR SAVE", "Give it a name first. Letters and numbers work best.", "Okay", "✏️", () => window.openSaveMenu()), 100);
        return;
    }

    try {
        const saves = window.getSaves();
        if (saves[clean] && !overwriteOk) {
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => window.queueModal(
                "OVERWRITE SAVE?",
                `There's already a save called <strong>${esc(clean)}</strong>. Replace it?`,
                "Overwrite", "💾",
                (yes) => { if (yes) window.doSave(clean, true); else window.openSaveMenu(); },
                "Cancel"
            ), 100);
            return;
        }

        const snap = snapshotState();
        snap.saveName = clean;
        state.saveName = clean;
        state.saveTimestamp = snap.saveTimestamp;
        saves[clean] = snap;
        writeSaves(saves);

        document.getElementById('modal-overlay').classList.add('hidden');
        setTimeout(() => {
            window.queueModal("GAME SAVED", `Progress saved to slot: <strong>${esc(clean)}</strong>`, "Okay", "💾");
        }, 100);
    } catch (e) {
        window.queueModal("ERROR", "Could not save game. Browser storage might be disabled or full. You can still download a save file from the Save menu.", "Okay", "❌");
    }
};

// ---------- autosave ----------

// Called when a day's summary screen appears. Loading an autosave puts you back on that summary, so the next
// morning's events (holidays, academy picks, tuition...) all still happen normally.
window.autosave = function() {
    window.lastAutosave = { ok: false };
    if (state.debugMode || !state.playerName || ['start', 'creator'].includes(state.step)) return false;
    try {
        const saves = window.getSaves();
        const snap = snapshotState();
        snap.saveName = 'Autosave';
        snap.isAutosave = true;
        if (saves.__auto1) saves.__auto2 = saves.__auto1;
        saves.__auto1 = snap;
        try {
            writeSaves(saves);
        } catch (quota) {
            delete saves.__auto2;            // make room by dropping the older autosave, then retry once
            writeSaves(saves);
        }
        window.lastAutosave = { ok: true, day: state.dayTotal };
        return true;
    } catch (e) {
        console.warn("Autosave failed:", e);
        if (!window.autosaveWarned) {
            window.autosaveWarned = true;
            window.queueModal("AUTOSAVE FAILED", "Your browser wouldn't let the game save automatically (storage may be full or disabled). Use the Save menu to download a save file so you don't lose progress.", "Okay", "⚠️");
        }
        return false;
    }
};

window.autosaveNote = function() {
    return (window.lastAutosave && window.lastAutosave.ok && window.lastAutosave.day === state.dayTotal)
        ? `<div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">💾 Autosaved</div>`
        : '';
};

// ---------- loading ----------

// Fill anything an older or hand-made save is missing from a pristine copy of the starting state
window.normalizeLoadedState = function(s) {
    const defaults = window.INITIAL_STATE || {};
    Object.keys(defaults).forEach(k => {
        if (s[k] === undefined) s[k] = JSON.parse(JSON.stringify(defaults[k]));
    });

    ['balance', 'bankBalance', 'energy', 'stress', 'social', 'grades', 'jobPerformance'].forEach(k => {
        if (!Number.isFinite(s[k])) s[k] = defaults[k] !== undefined ? defaults[k] : 0;
    });
    ['purchasedItems', 'subscriptions', 'traits', 'clubMemberships', 'log', 'seenDailyEvents', 'appliedJobs',
     'visibleJobs', 'submittedApps', 'apClasses', 'lastDayExpenses', 'pendingModals', 'seenSongs'].forEach(k => {
        if (!Array.isArray(s[k])) s[k] = [];
    });
    ['portfolio', 'relationships', 'marketPrices', 'phoneSeen', 'dayStats', 'endgameStats'].forEach(k => {
        if (!s[k] || typeof s[k] !== 'object' || Array.isArray(s[k])) s[k] = JSON.parse(JSON.stringify(defaults[k] || {}));
    });

    s.pendingModals = [];
    s.introAudio = s.gameLoopAudio = s.currentAudio = null;
    delete s.debugMode;
    return s;
};

window.applyLoadedState = function(loaded) {
    // Stop current music and any minigame loops from the game being replaced
    if (state.gameLoopAudio) { state.gameLoopAudio.pause(); state.gameLoopAudio = null; }
    if (state.introAudio) { state.introAudio.pause(); }
    if (state.currentAudio) { state.currentAudio.pause(); state.currentAudio = null; }
    ['paddleData', 'consoleData', 'tripData', 'fishingData'].forEach(n => {
        if (window[n] && window[n].interval) clearInterval(window[n].interval);
    });

    state = window.normalizeLoadedState(loaded);
    if (typeof window.restoreMarketPrices === 'function') window.restoreMarketPrices();
    window.tuitionDayActive = false;
    window.tuitionSkipInvestCheck = false;
    window.phoneContext = null;

    document.getElementById('modal-overlay').classList.add('hidden');
    setTimeout(() => {
        window.manageBackgroundAudio();
        window.updateUI();
        window.queueModal("LOADED", `Welcome back, ${esc(state.playerName)}.`, "Resume", "👋");
    }, 100);
};

window.doLoad = function(name) {
    const saves = window.getSaves();
    if (!saves[name]) return;
    window.applyLoadedState(JSON.parse(JSON.stringify(saves[name])));
};

window.deleteSave = function(name) {
    document.getElementById('modal-overlay').classList.add('hidden');
    setTimeout(() => {
        window.queueModal(
            "DELETE SAVE?",
            `Are you sure you want to permanently delete <strong>${esc(window.slotLabel(name))}</strong>? This cannot be undone.`,
            "Delete", "🗑️",
            (confirmed) => {
                if (confirmed) {
                    try {
                        const saves = window.getSaves();
                        delete saves[name];
                        writeSaves(saves);
                    } catch (e) { console.warn(e); }
                }
                window.openSaveMenu();
            },
            "Cancel"
        );
    }, 100);
};

// ---------- portable save files ----------

function fnv1a(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, '0');
}

function fileSafe(s) {
    return String(s || 'save').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'save';
}

window.buildSaveFile = function(snap) {
    const stateJson = JSON.stringify(snap);
    return JSON.stringify({
        game: 'triton-quest',
        format: window.SAVE_FILE_FORMAT,
        exportedAt: new Date().toISOString(),
        summary: {
            playerName: snap.playerName, year: snap.currentYear, season: window.SEASONS[snap.currentSeasonIndex],
            day: snap.dayOfMonth, dayTotal: snap.dayTotal, cash: Math.round(snap.balance || 0)
        },
        checksum: fnv1a(stateJson),
        state: snap
    }, null, 1);
};

function triggerDownload(filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// slotKey omitted = the game you're playing right now
window.downloadSave = function(slotKey) {
    let snap;
    if (slotKey) {
        const saves = window.getSaves();
        if (!saves[slotKey]) return;
        snap = JSON.parse(JSON.stringify(saves[slotKey]));
    } else {
        snap = snapshotState();
    }
    const fname = `triton-quest_${fileSafe(snap.playerName)}_day${snap.dayTotal}.json`;
    triggerDownload(fname, window.buildSaveFile(snap));
};

// Strip anything that could inject markup when a shared save is shown on screen
function sanitizeValue(v) {
    if (typeof v === 'string') return v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (Array.isArray(v)) return v.map(sanitizeValue);
    if (v && typeof v === 'object') {
        const out = {};
        Object.keys(v).forEach(k => {
            if (/^[A-Za-z0-9_ .\-]{1,60}$/.test(k) && k !== '__proto__') out[k] = sanitizeValue(v[k]);
        });
        return out;
    }
    return v;
}

window.sanitizeImportedState = function(s) {
    const clean = sanitizeValue(s);
    // Build the name from the raw value (not the escaped one) so truncation can't cut an entity in half
    clean.playerName = String(s.playerName || 'Student').replace(/[<>"`\\]/g, '').trim().slice(0, 30) || 'Student';
    // Lists of ids end up inside button handlers, so only allow plain id characters
    ['purchasedItems', 'subscriptions', 'traits', 'clubMemberships', 'apClasses'].forEach(k => {
        if (Array.isArray(clean[k])) clean[k] = clean[k].filter(x => typeof x === 'string' && /^[A-Za-z0-9_\-]{1,40}$/.test(x));
    });
    ['skill', 'negativeTrait', 'academy'].forEach(k => {
        if (typeof clean[k] === 'string' && !/^[A-Za-z0-9_\-]{1,40}$/.test(clean[k])) clean[k] = null;
    });
    // Clamp the core numbers so a hand-edited file can't break the UI
    const clamp = (k, lo, hi) => { if (Number.isFinite(clean[k])) clean[k] = Math.min(hi, Math.max(lo, clean[k])); };
    ['energy', 'stress', 'social', 'grades', 'jobPerformance'].forEach(k => clamp(k, 0, 100));
    clamp('bankBalance', 0, 1e9);
    if (!['sim_dashboard', 'day_summary', 'endgame', 'store', 'board'].includes(clean.step)) clean.step = 'sim_dashboard';
    return clean;
};

function validateSave(st) {
    if (!st || typeof st !== 'object' || Array.isArray(st)) return "The file doesn't contain a saved game.";
    if (typeof st.playerName !== 'string' || !st.playerName) return "This save has no player name, so it can't be a Triton Quest game.";
    if (!Number.isInteger(st.dayTotal) || st.dayTotal < 1 || st.dayTotal > 1000) return "The day count in this save isn't valid.";
    if (![1, 2, 3, 4].includes(st.currentYear)) return "The school year in this save isn't valid.";
    if (![0, 1, 2, 3].includes(st.currentSeasonIndex)) return "The season in this save isn't valid.";
    if (!Number.isInteger(st.dayOfMonth) || st.dayOfMonth < 1 || st.dayOfMonth > 28) return "The date in this save isn't valid.";
    return null;
}

// Returns { error } or { state, checksumOk, summaryHtml }
window.parseSaveFile = function(text) {
    let parsed;
    try { parsed = JSON.parse(text); }
    catch (e) { return { error: "That file isn't readable. It may be damaged or cut off, or it isn't a Triton Quest save." }; }

    let st, checksumOk = true;
    if (parsed && parsed.game === 'triton-quest' && parsed.state) {
        if (!Number.isInteger(parsed.format) || parsed.format > window.SAVE_FILE_FORMAT) {
            return { error: "This save was made by a newer version of the game. Update the game and try again." };
        }
        st = parsed.state;
        checksumOk = parsed.checksum === fnv1a(JSON.stringify(st));
    } else if (parsed && typeof parsed === 'object' && parsed.playerName && parsed.dayTotal) {
        st = parsed;     // a bare state object (e.g. copied from the console): accept it, no checksum to check
        checksumOk = false;
    } else {
        return { error: "That doesn't look like a Triton Quest save file." };
    }

    const problem = validateSave(st);
    if (problem) return { error: problem };
    return { state: st, checksumOk, bare: !(parsed && parsed.game === 'triton-quest') };
};

window.openImportPicker = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.tqsave,application/json';
    input.style.display = 'none';
    input.onchange = () => { if (input.files && input.files[0]) window.importSaveFile(input.files[0]); input.remove(); };
    document.body.appendChild(input);
    input.click();
};

window.importSaveFile = function(file) {
    document.getElementById('modal-overlay').classList.add('hidden');
    const fail = (msg) => setTimeout(() => window.queueModal("COULDN'T LOAD FILE", msg, "Okay", "⚠️", () => window.openSaveMenu()), 100);

    if (file.size > window.SAVE_FILE_MAX_BYTES) return fail("That file is too big to be a save (over 5 MB).");

    file.text().then(text => {
        const result = window.parseSaveFile(text);
        if (result.error) return fail(result.error);

        const s = result.state;
        const season = window.SEASONS[s.currentSeasonIndex];
        const warn = !result.checksumOk
            ? `<div class="mt-3 text-amber-400 text-xs font-bold">${result.bare ? "This file has no integrity check." : "This file was edited or damaged after it was saved."} It will probably still work, but you've been warned.</div>`
            : '';

        setTimeout(() => window.queueModal(
            "LOAD THIS SAVE?",
            `<div class="text-left text-sm font-bold space-y-1 mt-2">
                <div class="flex justify-between"><span class="text-slate-400">Student</span><span>${esc(String(s.playerName).slice(0, 30))}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Year</span><span>${s.currentYear} • ${esc(season)} ${s.dayOfMonth}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Day</span><span>${s.dayTotal}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Cash</span><span>${Number.isFinite(s.balance) ? '$' + Math.round(s.balance).toLocaleString() : '?'}</span></div>
             </div>
             <div class="mt-3 text-xs text-slate-400">Loading replaces the game you're playing now. A copy is also kept in this browser's saves.</div>
             <div class="mt-1 text-[10px] text-slate-500">Only load save files from people you trust.</div>
             ${warn}`,
            "Load It", "📂",
            (yes) => { if (yes) window.finishImport(s); else window.openSaveMenu(); },
            "Cancel", false, "SAVE FILE"
        ), 100);
    }).catch(() => fail("The file couldn't be read."));
};

window.finishImport = function(rawState) {
    const clean = window.normalizeLoadedState(window.sanitizeImportedState(rawState));
    clean.savedAt = Date.now();

    // Keep a copy as a browser save under a unique slot name
    try {
        const saves = window.getSaves();
        const base = window.cleanSlotName(`Imported ${clean.playerName} D${clean.dayTotal}`) || 'Imported save';
        let slot = base, n = 2;
        while (saves[slot]) slot = `${base} (${n++})`;
        clean.saveName = slot;
        saves[slot] = JSON.parse(JSON.stringify(clean));
        writeSaves(saves);
    } catch (e) { console.warn("Couldn't keep a browser copy of the imported save", e); }

    window.applyLoadedState(clean);
};

// ---------- save menu ----------

window.openSaveMenu = function() {
    const saves = window.getSaves();
    Object.keys(saves).forEach(k => { if (!saves[k] || typeof saves[k] !== 'object') delete saves[k]; });
    const keys = Object.keys(saves);
    const autos = window.AUTOSAVE_KEYS.filter(k => saves[k]);
    const manual = keys.filter(k => !isAuto(k)).sort((a, b) => (saves[b].savedAt || 0) - (saves[a].savedAt || 0));
    const ordered = [...autos, ...manual];
    const inGame = state.step && !['start', 'creator'].includes(state.step) && state.playerName && !state.debugMode;

    const rows = ordered.map(key => {
        const s = saves[key];
        const slot = encodeURIComponent(key);
        const auto = isAuto(key);
        return `
            <div class="flex items-center justify-between gap-2 bg-slate-800/50 p-3 rounded-xl border ${auto ? 'border-indigo-500/40' : 'border-slate-700/50'} hover:border-slate-500 transition-all">
                <div class="min-w-0">
                    <div class="font-bold text-sm text-white truncate">${auto ? '<span class="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded mr-1.5 align-middle">AUTO</span>' : ''}${esc(window.slotLabel(key))}</div>
                    <div class="text-[9px] text-slate-500 uppercase tracking-wider">${window.describeSave(s)}</div>
                    <div class="text-[9px] text-slate-600">${esc(s.saveTimestamp || '')}</div>
                </div>
                <div class="flex gap-1.5 flex-shrink-0">
                    <button data-slot="${slot}" onclick="window.doLoad(decodeURIComponent(this.dataset.slot))" class="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-500">LOAD</button>
                    <button data-slot="${slot}" onclick="window.downloadSave(decodeURIComponent(this.dataset.slot))" title="Download as a file" class="bg-slate-600 text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] hover:bg-slate-500">⬇</button>
                    <button data-slot="${slot}" onclick="window.deleteSave(decodeURIComponent(this.dataset.slot))" title="Delete" class="bg-red-900 text-red-300 px-2.5 py-1.5 rounded-lg font-bold text-[10px] hover:bg-red-700 hover:text-white">🗑</button>
                </div>
            </div>`;
    }).join('');

    let kb = 0;
    try { kb = Math.round((localStorage.getItem(window.SAVE_KEY) || '').length / 1024); } catch (e) {}

    const menuHtml = `
        <div class="flex flex-col gap-4 text-left">
            ${inGame ? `
            <div class="bg-slate-800 p-4 rounded-2xl border border-slate-600">
                <h3 class="text-xs font-black uppercase text-acs-gold mb-2 tracking-widest">Save to this browser</h3>
                <div class="flex gap-2">
                    <input type="text" id="save-name-input" maxlength="40" placeholder="Save name (e.g. Run 1)" class="flex-1 min-w-0 bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-acs-gold">
                    <button id="btn-save-game" class="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold uppercase text-xs hover:bg-indigo-500 transition-all">Save</button>
                </div>
                <p class="text-[10px] text-slate-500 mt-2">Stays in this browser only. Clearing your browser data erases it.</p>
            </div>` : ''}

            <div class="bg-slate-800 p-4 rounded-2xl border border-slate-600">
                <h3 class="text-xs font-black uppercase text-acs-gold mb-2 tracking-widest">Save file</h3>
                <div class="grid ${inGame ? 'grid-cols-2' : 'grid-cols-1'} gap-2">
                    ${inGame ? `<button onclick="window.downloadSave()" class="bg-slate-700 text-white px-3 py-2.5 rounded-xl font-bold uppercase text-[10px] hover:bg-slate-600 transition-all">⬇ Download this game</button>` : ''}
                    <button onclick="window.openImportPicker()" class="bg-slate-700 text-white px-3 py-2.5 rounded-xl font-bold uppercase text-[10px] hover:bg-slate-600 transition-all">⬆ Load from file</button>
                </div>
                <p class="text-[10px] text-slate-500 mt-2">A save file works on any computer. Use it for backups or to move your game.</p>
            </div>

            <div>
                <h3 class="text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Saves in this browser</h3>
                <div class="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scroll">
                    ${rows || `<div class="text-slate-600 italic text-sm text-center py-4">No saved games yet.</div>`}
                </div>
                ${rows ? `<p class="text-[9px] text-slate-600 mt-2">Autosaves happen every night when the day summary appears. ${ordered.length} save${ordered.length === 1 ? '' : 's'} • about ${kb} KB</p>` : ''}
            </div>
        </div>`;

    window.queueModal("SYSTEM MENU", menuHtml, "Close", "💾", () => window.phoneReturn('save'), null, false, "SAVE / LOAD");

    setTimeout(() => {
        const btn = document.getElementById('btn-save-game');
        const input = document.getElementById('save-name-input');
        if (btn && input) {
            const go = () => { if (input.value.trim()) window.doSave(input.value); };
            btn.onclick = go;
            input.onkeyup = (e) => { if (e.key === 'Enter') go(); };
        }
    }, 100);
};

// ---------- title screen ----------

window.startScreenSaveButtons = function() {
    const saves = window.getSaves();
    Object.keys(saves).forEach(k => { if (!saves[k] || typeof saves[k] !== 'object') delete saves[k]; });
    const keys = Object.keys(saves);
    let latestKey = null;
    keys.forEach(k => { if (!latestKey || (saves[k].savedAt || 0) > (saves[latestKey].savedAt || 0)) latestKey = k; });

    const btnClass = "w-full bg-slate-800 border-2 border-slate-600 text-slate-300 font-black py-4 rounded-2xl shadow-lg hover:border-acs-gold hover:text-white transition-all uppercase tracking-widest mt-4";
    let html = '';
    if (latestKey) {
        const s = saves[latestKey];
        html += `
            <button data-slot="${encodeURIComponent(latestKey)}" onclick="window.doLoad(decodeURIComponent(this.dataset.slot))" class="${btnClass} text-lg">
                Continue Career
                <div class="text-[10px] font-bold normal-case tracking-normal text-slate-500 mt-1">${window.describeSave(s)}</div>
            </button>
            <button onclick="window.openSaveMenu()" class="${btnClass} text-xs py-3 mt-2">All Saves &amp; Files</button>`;
    } else {
        html += `<button onclick="window.openImportPicker()" class="${btnClass} text-xs py-3">Load Save File</button>`;
    }
    return html;
};

})();
