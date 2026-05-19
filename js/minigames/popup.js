window.popupData = {
    active: false,
    popups: [],
    closedCount: 0,
    target: 10,
    maxActive: 5,
    interval: null,
    spawnTimer: 0,
    crashProgress: 0
};

window.startPopupEvent = function() {
    // Clear old state
    if (window.popupData.interval) clearInterval(window.popupData.interval);
    
    window.popupData = {
        active: true,
        popups: [],
        closedCount: 0,
        target: 10,
        maxActive: 5,
        interval: null,
        spawnTimer: 0,
        crashProgress: 0
    };

    const gameHtml = `
        <div class="max-w-md mx-auto py-2 select-none text-center relative">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">DAILY EVENT</h1>
            <div class="text-6xl mb-2">💻</div>
            <h2 class="text-2xl font-black uppercase italic text-white mb-2">Ad Attack!</h2>
            <p class="text-slate-300 mb-4 text-xs font-mono">Close ${window.popupData.target} windows! Don't let 5 stack up!</p>
            
            <!-- System Status Bar -->
            <div class="w-full h-6 bg-slate-800 rounded-md border-2 border-slate-600 mb-4 relative overflow-hidden">
                <div id="cpu-bar" class="h-full bg-green-500 transition-all duration-200" style="width: 0%"></div>
                <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase drop-shadow-md">System Load</div>
            </div>

            <!-- Desktop Area -->
            <div id="desktop-area" class="relative bg-[#008080] border-4 border-slate-400 h-[300px] w-[300px] mx-auto rounded-lg overflow-hidden cursor-default shadow-inner">
                <!-- Windows Logo / Background -->
                <div class="absolute inset-0 flex items-center justify-center opacity-20 text-9xl">🪟</div>
            </div>
            
            <p class="text-[10px] text-slate-500 mt-4 italic">Click the [X] to close windows.</p>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            window.popupData.interval = setInterval(window.updatePopupGame, 50); // 20 FPS
            // Spawn first popup immediately
            window.spawnPopup();
        }
    });
    window.processModalQueue();
};

window.spawnPopup = function() {
    const area = document.getElementById('desktop-area');
    if (!area) return;

    const id = Date.now() + Math.random();
    const popup = document.createElement('div');
    
    // Random position (keep inside 300x300 box roughly)
    const x = Math.floor(Math.random() * 180);
    const y = Math.floor(Math.random() * 200);
    
    // Random Content
    const titles = ["YOU WON!", "Download RAM?", "Hot Singles!", "Virus Alert!", "Free Money!", "Click Me!"];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const colors = ["bg-slate-200", "bg-blue-200", "bg-pink-200", "bg-yellow-200"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    popup.id = `popup-${id}`;
    popup.className = `absolute border-2 border-slate-900 shadow-xl flex flex-col w-32 h-20 ${color} animate-pop`;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    // Random z-index to layer them
    popup.style.zIndex = window.popupData.popups.length + 10;

    popup.innerHTML = `
        <div class="bg-blue-800 text-white text-[8px] font-bold px-1 py-0.5 flex justify-between items-center cursor-default select-none">
            <span class="truncate">${title}</span>
            <button class="bg-slate-300 text-black px-1 leading-none hover:bg-red-500 hover:text-white border border-slate-500" onclick="window.closePopup('${id}')">X</button>
        </div>
        <div class="flex-1 flex items-center justify-center p-1">
            <span class="text-2xl">🎁</span>
        </div>
    `;

    area.appendChild(popup);
    window.popupData.popups.push(id);
};

window.closePopup = function(id) {
    const el = document.getElementById(`popup-${id}`);
    if (el) el.remove();
    
    window.popupData.popups = window.popupData.popups.filter(p => p !== id);
    window.popupData.closedCount++;

    // Win Check
    if (window.popupData.closedCount >= window.popupData.target) {
        window.finishPopupGame(true);
    }
};

window.updatePopupGame = function() {
    const d = window.popupData;
    if (!d.active) return;

    // Spawn Logic (Spawns get faster)
    d.spawnTimer++;
    // Spawn every 40 frames initially, down to 15 frames
    const rate = Math.max(15, 40 - (d.closedCount * 2));
    
    if (d.spawnTimer > rate) {
        window.spawnPopup();
        d.spawnTimer = 0;
    }

    // Crash Logic
    const count = d.popups.length;
    // Bar fills based on how many are active relative to max
    const load = (count / d.maxActive) * 100;
    
    const bar = document.getElementById('cpu-bar');
    if (bar) {
        bar.style.width = load + '%';
        if (load > 80) bar.className = "h-full bg-red-600 transition-all duration-200 animate-pulse";
        else if (load > 50) bar.className = "h-full bg-yellow-400 transition-all duration-200";
        else bar.className = "h-full bg-green-500 transition-all duration-200";
    }

    if (count >= d.maxActive) {
        window.finishPopupGame(false);
    }
};

window.finishPopupGame = function(success) {
    window.popupData.active = false;
    clearInterval(window.popupData.interval);
    document.getElementById('modal-overlay').classList.add('hidden');

    setTimeout(() => {
        let title, text, btn, icon;
        let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">`;

        if (success) {
            // Reward
            state.stress = Math.max(0, state.stress - 20);
            state.dayStats.stress -= 20;
            
            // Skill check: Techie gets extra cash for "fixing" it
            if (state.traits.includes('techie')) {
                state.balance += 20;
                state.dayStats.cash += 20;
                html += `<div class="text-green-400 flex justify-between"><span>Tech Bonus</span><span>+$20.00</span></div>`;
            }

            title = "SYSTEM SECURE";
            text = "You clicked the X's with surgical precision. The virus has been quarantined.";
            btn = "Nice";
            icon = "🛡️";
            html += `<div class="text-green-400 flex justify-between"><span>Relief</span><span>-20% Stress</span></div></div>`;
        } else {
            // Fail
            state.stress = Math.min(100, state.stress + 15);
            state.dayStats.stress += 15;
            
            title = "BLUE SCREEN";
            text = "Too many popups! The computer froze and made a horrible buzzing noise.";
            btn = "Reboot";
            icon = "💀";
            html += `<div class="text-red-400 flex justify-between"><span>Crash</span><span>+15% Stress</span></div></div>`;
        }

        window.queueModal(title, text + html, btn, icon, () => window.finalizeDay(), null, false, "DAILY EVENT");
    }, 100);
};