// --- FISHING MINIGAME (Cast, Hook, & Fight) ---

window.fishingData = { 
    state: 'idle', 
    power: 0, 
    powerDir: 2, 
    distance: 0,
    tension: 0,
    fishPos: 50, 
    fishForce: 0, 
    fishTimer: 0,
    playerPull: 0, 
    interval: null,
    handleKey: null,
    handleUp: null,
    // Audio placeholders
    castSfx: null,
    reelSfx: null,
    dragSfx: null,
    catchSfx: null
};

window.startFishingGame = function() {
    if (state.balance < 10) {
            window.queueModal("No Funds", "You need $10 for bait.", "Okay", "💸");
            return;
    }

    // Cleanup previous listeners
    if (window.fishingData.handleKey) document.removeEventListener('keydown', window.fishingData.handleKey);
    if (window.fishingData.handleUp) document.removeEventListener('keyup', window.fishingData.handleUp);
    if (window.fishingData.interval) clearInterval(window.fishingData.interval);

    document.getElementById('modal-overlay').classList.add('hidden');
    
    // Initialize Audio Objects
    const castSfx = new Audio('audio/fishing/cast.ogg');
    const reelSfx = new Audio('audio/fishing/reel.ogg');
    const dragSfx = new Audio('audio/fishing/drag.ogg');
    const catchSfx = new Audio('audio/fishing/catch.ogg');
    
    // Set loops
    reelSfx.loop = true;
    dragSfx.loop = true;

    // Init Data
    window.fishingData = { 
        state: 'cast', 
        power: 0, powerDir: 3, 
        distance: 50, tension: 0, fishPos: 50, fishForce: 0,
        fishTimer: 0, playerPull: 0, keysHeld: [], turnTimer: 0, grace: 0, cueKey: '', interval: null, handleKey: null, handleUp: null, bgFrame: 0,
        castSfx, reelSfx, dragSfx, catchSfx
    };

    const gameHtml = `
        <div class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">GONE FISHING</h1>
            
            <div class="flex justify-between items-center px-4 mb-2 text-xs font-bold font-mono bg-slate-900/50 p-2 rounded-lg">
                <div id="fish-msg" class="text-white">CAST THE LINE</div>
                <div id="fish-dist" class="text-green-400 hidden">50m</div>
            </div>

            <div id="fishing-view" class="relative bg-black rounded-2xl h-64 border-4 border-slate-700 overflow-hidden cursor-pointer shadow-inner" onmousedown="window.handleFishClick()">
                
                <img id="fishing-bg" src="images/minigames/fishing/bg1.webp" class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-200">
                <div class="absolute inset-0 bg-blue-900/20 pointer-events-none"></div>

                <!-- PHASE 1: POWER BAR -->
                <div id="cast-ui" class="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <div class="w-8 h-48 bg-slate-800 rounded-full border-2 border-white overflow-hidden relative">
                        <div id="power-fill" class="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-red-500 transition-none" style="height: 0%"></div>
                        <div class="absolute top-2 w-full text-center text-[10px] font-bold text-white">MAX</div>
                    </div>
                    <div class="ml-4 text-white font-bold animate-pulse">CLICK TO CAST</div>
                </div>

                <!-- PHASE 2: BOBBER -->
                <img id="bobber" src="images/minigames/fishing/bob1.webp" class="hidden absolute top-[60%] left-1/2 w-12 h-12 object-contain -translate-x-1/2 transition-transform duration-200 z-10">
                <div id="bite-alert" class="hidden absolute top-[32%] left-1/2 -translate-x-1/2 text-6xl animate-bounce z-20 pointer-events-none">❗</div>

                <!-- PHASE 3: THE FIGHT -->
                <div id="fight-ui" class="hidden absolute inset-0 z-10">
                    <div class="absolute top-[60%] left-1/2 -translate-x-1/2 text-4xl opacity-50">🌊</div>
                    <div id="fish-avatar" class="absolute top-[65%] text-4xl transition-all duration-100" style="left: 50%;">🐟</div>
                    <div id="fish-hint" class="absolute top-[53%] text-xl font-black text-red-400 pointer-events-none" style="left: 50%;"></div>
                    <div id="fish-tutorial" class="absolute top-3 left-4 right-4 bg-black/70 border border-yellow-300 rounded-xl py-2 px-3 text-xs font-bold text-yellow-200 pointer-events-none transition-opacity duration-500">The fish pulls one way &mdash; you pull the OPPOSITE way!<br>Follow the green arrow.</div>
                    
                    <div class="absolute bottom-4 left-4 right-4">
                        <div class="flex justify-between text-[9px] text-white font-bold mb-1">
                            <span>LINE TENSION <span id="rod-note"></span></span><span id="tension-val">0%</span>
                        </div>
                        <div class="w-full h-4 bg-slate-900 rounded-full border border-slate-500 overflow-hidden">
                            <div id="tension-bar" class="h-full bg-green-500 w-0 transition-none"></div>
                        </div>
                    </div>
                    
                    <div id="arrow-left" class="absolute left-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 flex items-center justify-center text-3xl font-black bg-slate-800/70 border-slate-500 text-slate-400 transition-all">◀</div>
                    <div id="arrow-right" class="absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 flex items-center justify-center text-3xl font-black bg-slate-800/70 border-slate-500 text-slate-400 transition-all">▶</div>
                </div>
            </div>
            <p id="fish-controls" class="text-xs text-slate-300 mt-2">Click to stop the power meter!</p>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            // Track every held key so rolling from one arrow to the other never leaves you with no input
            const dirOf = (e) => {
                const k = (e.key || '').toLowerCase();
                if (k === 'arrowleft' || k === 'a') return -1;
                if (k === 'arrowright' || k === 'd') return 1;
                return 0;
            };
            const syncPull = () => {
                const held = window.fishingData.keysHeld;
                window.fishingData.playerPull = held.length ? held[held.length - 1] : 0;
            };
            const handleKey = (e) => {
                const dir = dirOf(e);
                if (!dir || window.fishingData.state !== 'reel') return;
                e.preventDefault();
                const held = window.fishingData.keysHeld;
                if (!held.includes(dir)) held.push(dir);
                syncPull();
            };
            const handleUp = (e) => {
                const dir = dirOf(e);
                if (!dir) return;
                window.fishingData.keysHeld = window.fishingData.keysHeld.filter(k => k !== dir);
                syncPull();
            };

            window.fishingData.handleKey = handleKey;
            window.fishingData.handleUp = handleUp;
            document.addEventListener('keydown', handleKey);
            document.addEventListener('keyup', handleUp);
            window.fishingData.interval = setInterval(window.updateFishingGame, 20);
        }
    });
    window.processModalQueue();
};

// --- FISHING UI HELPERS ---
window.FISH_TELL_TICKS = 18;   // ~360ms warning before the fish changes direction
window.FISH_GRACE_TICKS = 8;   // ~160ms after a change where the line takes no strain

window.setFishMsg = function(text, cls) {
    const el = document.getElementById('fish-msg');
    if (!el) return;
    el.innerText = text;
    el.className = cls || 'text-white';
};

window.updateFishingCues = function() {
    const d = window.fishingData;
    const required = -d.fishForce;                 // direction the player should pull
    const warning = d.turnTimer <= window.FISH_TELL_TICKS;
    const side = (v) => v < 0 ? 'left' : 'right';
    const name = (v) => v < 0 ? '\u25C0 LEFT' : 'RIGHT \u25B6';
    const correct = d.playerPull === required;
    const wrong = d.playerPull !== 0 && !correct;

    // Cache so we only touch the DOM when something visible changes
    const key = [required, d.playerPull, warning, d.tension > 70].join('|');
    if (key === d.cueKey) return;
    d.cueKey = key;

    const arrowClass = (v) => {
        const base = 'absolute ' + (v < 0 ? 'left-2' : 'right-2') + ' top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 flex items-center justify-center text-3xl font-black transition-all ';
        const pressed = d.playerPull === v;
        if (v === required && pressed) return base + 'bg-green-500 border-green-200 text-white scale-125';
        if (v === required)            return base + 'bg-green-600/80 border-green-300 text-white animate-pulse scale-110';
        if (pressed)                   return base + 'bg-red-600 border-red-300 text-white scale-110';
        if (warning && v === -required) return base + 'bg-amber-500/80 border-amber-200 text-white animate-pulse';
        return base + 'bg-slate-800/70 border-slate-500 text-slate-400 opacity-60';
    };
    const l = document.getElementById('arrow-left');
    const r = document.getElementById('arrow-right');
    if (l) l.className = arrowClass(-1);
    if (r) r.className = arrowClass(1);

    if (warning) window.setFishMsg('\u26A0 SWITCH TO ' + name(-required) + '!', 'text-amber-300 animate-pulse font-black');
    else if (correct) window.setFishMsg('\u2705 PULL ' + name(required), 'text-green-400 font-black');
    else if (wrong) window.setFishMsg('\u274C WRONG WAY! PULL ' + name(required), 'text-red-400 font-black');
    else window.setFishMsg('PULL ' + name(required), 'text-white font-black');

    const view = document.getElementById('fishing-view');
    if (view) view.style.boxShadow = d.tension > 70 ? 'inset 0 0 40px rgba(239,68,68,0.7)' : '';
};

window.handleFishClick = function() {
    const d = window.fishingData;
    
    if (d.state === 'cast') {
        // TRANSITION: Cast -> Wait
        d.state = 'wait';
        
        // --- AUDIO: CAST ---
        if (d.castSfx) d.castSfx.play().catch(()=>{});

        // Calculate distance based on power
        d.distance = 20 + Math.floor(d.power / 2);
        
        // UI Updates
        document.getElementById('cast-ui').classList.add('hidden');
        document.getElementById('bobber').classList.remove('hidden');
        window.setFishMsg("WAIT FOR A BITE...", 'text-white');
        document.getElementById('fish-controls').innerText = "Don't click yet! Wait for the ❗ and the bobber to dip, then CLICK.";
        
        // Random bite time
        d.fishTimer = 100 + Math.random() * 150; 
    }
    else if (d.state === 'wait') {
        window.finishFishingGame(false, "Pulled too early!");
    }
    else if (d.state === 'bite') {
        // TRANSITION: Bite -> Reel
        d.state = 'reel';
        clearTimeout(d.biteTimeout);
        d.fishForce = Math.random() < 0.5 ? -1 : 1;
        d.turnTimer = 90 + Math.floor(Math.random() * 40);   // first direction change comes a little later
        d.grace = 0;
        document.getElementById('bobber').classList.add('hidden');
        document.getElementById('bite-alert').classList.add('hidden');
        document.getElementById('fishing-view').style.boxShadow = '';
        document.getElementById('fight-ui').classList.remove('hidden');
        document.getElementById('fish-dist').classList.remove('hidden');
        document.getElementById('fish-controls').innerText = "Hold \u25C0 / \u25B6 (or A / D). Pull the OPPOSITE way the fish swims to reel it in. Watch the tension bar!";
        const rodNote = document.getElementById('rod-note');
        if (rodNote) {
            rodNote.innerText = state.purchasedItems.includes('rod_upgrade') ? '\uD83C\uDFA3 PRO ROD: HALF STRAIN' : '(standard rod)';
            rodNote.className = state.purchasedItems.includes('rod_upgrade') ? 'text-green-400' : 'text-slate-400';
        }
        d.tutTimeout = setTimeout(() => {
            const tut = document.getElementById('fish-tutorial');
            if (tut) tut.style.opacity = '0';
        }, 3500);
        window.updateFishingCues();
    }
};

window.updateFishingGame = function() {
    const d = window.fishingData;
    
    // --- BACKGROUND & BOBBER ANIMATION ---
    d.bgFrame++;
    if (d.bgFrame % 25 === 0) {
        const bg = document.getElementById('fishing-bg');
        if (bg) {
            const isBg1 = bg.src.includes('bg1.webp');
            bg.src = isBg1 ? 'images/minigames/fishing/bg2.webp' : 'images/minigames/fishing/bg1.webp';
        }

        const bob = document.getElementById('bobber');
        if (bob && d.state === 'wait') {
                const isBob1 = bob.src.includes('bob1.webp');
                bob.src = isBob1 ? 'images/minigames/fishing/bob2.webp' : 'images/minigames/fishing/bob1.webp';
        }
    }
    
    // Phase 1: Casting
    if (d.state === 'cast') {
        d.power += d.powerDir;
        if (d.power >= 100 || d.power <= 0) d.powerDir *= -1;
        const bar = document.getElementById('power-fill');
        if (bar) bar.style.height = d.power + '%';
    }
    
    // Phase 2: Waiting
    else if (d.state === 'wait') {
        d.fishTimer--;
        const bobber = document.getElementById('bobber');
        if (bobber && d.fishTimer % 20 === 0) {
            bobber.style.transform = `translate(-50%, ${Math.random() * 5}px)`;
        }

        if (d.fishTimer <= 0) {
            d.state = 'bite';
            window.triggerBite();
        }
    }

    // Phase 3: Reeling
    else if (d.state === 'reel') {
        // The fish changes direction on a timer. updateFishingCues() warns the player a moment before it happens.
        d.turnTimer--;
        if (d.turnTimer <= 0) {
            d.fishForce = -d.fishForce;
            d.turnTimer = 60 + Math.floor(Math.random() * 60);
            d.grace = window.FISH_GRACE_TICKS;
        }

        const isCountering = (d.playerPull !== 0 && d.playerPull !== d.fishForce);
        const hasRod = state.purchasedItems.includes('rod_upgrade');

        if (isCountering) {
            // REELING IN
            d.distance -= 0.25;
            d.tension = Math.max(0, d.tension - 0.5);

            if (d.reelSfx.paused) d.reelSfx.play().catch(()=>{});
            if (!d.dragSfx.paused) d.dragSfx.pause();
        } else {
            // DRAGGING OUT
            d.distance += 0.05;

            // No strain right after the fish turns, so reaction time isn't punished.
            // Letting go entirely strains the line at half rate. Pro Rod halves all strain.
            if (d.grace <= 0) {
                const rate = hasRod ? 0.15 : 0.3;
                d.tension += (d.playerPull === 0) ? rate * 0.5 : rate;
            }

            if (d.dragSfx.paused) d.dragSfx.play().catch(()=>{});
            if (!d.reelSfx.paused) d.reelSfx.pause();
        }
        if (d.grace > 0) d.grace--;

        d.fishPos += d.fishForce;
        d.fishPos = Math.max(10, Math.min(90, d.fishPos));

        const fishEl = document.getElementById('fish-avatar');
        const hintEl = document.getElementById('fish-hint');
        const tensionBar = document.getElementById('tension-bar');
        const tensionVal = document.getElementById('tension-val');
        const distEl = document.getElementById('fish-dist');

        if (fishEl) {
            fishEl.style.left = d.fishPos + '%';
            // Shake the fish just before it turns
            const shake = d.turnTimer <= window.FISH_TELL_TICKS ? (d.turnTimer % 2 ? 3 : -3) : 0;
            fishEl.style.transform = `translateX(${shake}px) scaleX(${d.fishForce * -1})`;
        }
        if (hintEl) {
            hintEl.style.left = d.fishPos + '%';
            hintEl.innerText = d.fishForce < 0 ? '\u25C0\u25C0' : '\u25B6\u25B6';
        }
        if (tensionBar) {
            tensionBar.style.width = Math.min(100, d.tension) + '%';
            const color = d.tension > 70 ? 'bg-red-600 animate-pulse' : (d.tension > 40 ? 'bg-yellow-400' : 'bg-green-500');
            tensionBar.className = `h-full transition-none ${color}`;
        }
        if (tensionVal) tensionVal.innerText = d.tension > 70 ? 'DANGER ' + Math.floor(d.tension) + '%' : Math.floor(d.tension) + '%';
        if (distEl) distEl.innerText = Math.floor(d.distance) + 'm';

        window.updateFishingCues();

        // else-if chain: only one outcome can fire per tick
        if (d.distance <= 0) window.finishFishingGame(true);
        else if (d.tension >= 100) window.finishFishingGame(false, "Line snapped!");
        else if (d.distance >= 100) window.finishFishingGame(false, "Fish swam away!");
    }
};

window.triggerBite = function() {
    window.fishingData.state = 'bite';
    const bobber = document.getElementById('bobber');
    const alertEl = document.getElementById('bite-alert');
    const view = document.getElementById('fishing-view');

    if (bobber) {
        bobber.classList.remove('animate-bounce');
        bobber.style.transform = "translate(-50%, 20px) scale(0.8)";
    }
    if (alertEl) alertEl.classList.remove('hidden');
    if (view) view.style.boxShadow = 'inset 0 0 40px rgba(253,224,71,0.8)';
    window.setFishMsg("\uD83D\uDC1F BITE! CLICK NOW!", 'text-red-400 animate-pulse font-black');
    const ctrl = document.getElementById('fish-controls');
    if (ctrl) ctrl.innerText = "Click anywhere in the water NOW to hook it!";

    // 1.2s window to click
    window.fishingData.biteTimeout = setTimeout(() => {
        if (window.fishingData.state === 'bite') {
            window.finishFishingGame(false, "Too slow! It got away.");
        }
    }, 1200);
};

window.finishFishingGame = function(success, msg) {
            // Guard against double-finishing (would charge bait and open two result screens)
            if (window.fishingData.state === 'done') return;
            window.fishingData.state = 'done';
            clearTimeout(window.fishingData.biteTimeout);
            clearTimeout(window.fishingData.tutTimeout);

            // Cleanup
            window.fishingData.active = false;
            clearInterval(window.fishingData.interval);
            if (window.fishingData.handleKey) document.removeEventListener('keydown', window.fishingData.handleKey);
            if (window.fishingData.handleUp) document.removeEventListener('keyup', window.fishingData.handleUp);

            // --- AUDIO CLEANUP ---
            if (window.fishingData.reelSfx) {
                window.fishingData.reelSfx.pause();
                window.fishingData.reelSfx.currentTime = 0;
            }
            if (window.fishingData.dragSfx) {
                window.fishingData.dragSfx.pause();
                window.fishingData.dragSfx.currentTime = 0;
            }

            // Play Catch Sound
            if (success && window.fishingData.catchSfx) {
                window.fishingData.catchSfx.play().catch(()=>{});
            }

            document.getElementById('modal-overlay').classList.add('hidden');

            setTimeout(() => {
                let title, btn;
                
                // Result Variables
                let catchName = "";
                let catchDesc = "";
                let catchImg = "";
                let statsHtml = "";

                if (success) {
                    state.balance -= 10; state.dayStats.cash -= 10;
                    state.hasRelaxedToday = true;
                    state.hasFishedToday = true;

                    // --- LOOT SELECTION ---
                    let pool = [...window.FISH_LOOT_TABLE];
                    if (state.purchasedItems.includes('pearpods')) {
                        pool = pool.filter(i => i.id !== 'pearpods');
                    }
                    let totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
                    let random = Math.random() * totalWeight;
                    let catchItem = pool[0];
                    for (let item of pool) {
                        if (random < item.weight) {
                            catchItem = item;
                            break;
                        }
                        random -= item.weight;
                    }

                    // Stats
                    let stressRelief = 50; 
                    if (catchItem.type === 'trash') stressRelief = 25;
                    if (catchItem.type === 'rare') stressRelief = 75;

                    state.stress = Math.max(0, state.stress - stressRelief); 
                    state.dayStats.stress -= stressRelief;

                    if (catchItem.value > 0) {
                        state.balance += catchItem.value;
                        state.dayStats.cash += catchItem.value;
                        statsHtml += `<div class="text-green-400 flex justify-between"><span>Value</span><span>+$${catchItem.value}</span></div>`;
                    }
                    if (catchItem.effect === 'hunger') {
                        state.hungerLevel = 2; 
                        statsHtml += `<div class="text-green-400 flex justify-between"><span>Hunger</span><span>Filled</span></div>`;
                    }
                    if (catchItem.effect === 'unlock') {
                        if (!state.purchasedItems.includes('pearpods')) {
                            state.purchasedItems.push('pearpods');
                            statsHtml += `<div class="text-amber-400 flex justify-between"><span>Item</span><span>Unlocked</span></div>`;
                        }
                    }

                    title = "CATCH!";
                    btn = "Awesome";
                    catchName = catchItem.name;
                    catchDesc = catchItem.desc;
                    catchImg = catchItem.img;
                    
                    // Add base stat to HTML
                    statsHtml = `<div class='text-red-400 flex justify-between'><span>Bait Cost</span><span>-$10.00</span></div><div class='text-green-400 flex justify-between'><span>Serenity</span><span>-${stressRelief}% Stress</span></div>` + statsHtml;

                } else {
                    // FAIL STATE
                    state.balance -= 10; state.dayStats.cash -= 10;
                    title = "LOST IT";
                    btn = "Darn";
                    catchName = "Nothing";
                    catchDesc = msg || "It got away. You lost your bait.";
                    catchImg = "🎣"; // No hook image exists in the repo, so use the emoji
                    
                    statsHtml = `<div class='text-red-400 flex justify-between'><span>Bait Cost</span><span>-$10.00</span></div>`;
                }

                // --- CONSTRUCT RAW HTML ---
                // Handle Image vs Emoji fallback
                const imgDisplay = catchImg.includes('/') 
                    ? `<img src="${catchImg}" class="w-48 h-32 object-contain mx-auto drop-shadow-md" alt="${catchName}">`
                    : `<div class="text-6xl mb-4">${catchImg}</div>`;

                const resultHtml = `
                    <div class="max-w-md mx-auto py-2 text-center select-none">
                        <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">${title}</h1>
                        
                        <!-- IMAGE CONTAINER -->
                        <div class="flex justify-center mb-4">
                            ${imgDisplay}
                        </div>

                        <!-- TEXT CONTAINER -->
                        <div class="bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl border border-slate-600 shadow-xl">
                            <h2 class="text-xl font-black uppercase text-white mb-1">${catchName}</h2>
                            <p class="text-xs text-slate-400 italic mb-4">"${catchDesc}"</p>
                            
                            <div class="border-t border-slate-600 pt-3 font-bold text-sm">
                                ${statsHtml}
                            </div>
                        </div>

                        <button id="modal-confirm-btn" class="w-full mt-4 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl hover:bg-indigo-500 transition-all">${btn}</button>
                    </div>
                `;

                state.pendingModals.push({
                    rawHtml: resultHtml,
                    onOpen: () => {
                        const btnEl = document.getElementById('modal-confirm-btn');
                        if (btnEl) {
                            // Safety Lock
                            btnEl.disabled = true;
                            btnEl.classList.add('opacity-50', 'cursor-not-allowed');
                            setTimeout(() => {
                                btnEl.disabled = false;
                                btnEl.classList.remove('opacity-50', 'cursor-not-allowed');
                            }, 1500);

                            // Close Logic
                            btnEl.onclick = () => {
                                document.getElementById('modal-overlay').classList.add('hidden');
                                window.updateUI();
                                setTimeout(window.processModalQueue, 100);
                            };
                        }
                    }
                });
                window.processModalQueue();

            }, 100);
        };