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
        fishTimer: 0, playerPull: 0, interval: null, handleKey: null, handleUp: null, bgFrame: 0,
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

                <!-- PHASE 3: THE FIGHT -->
                <div id="fight-ui" class="hidden absolute inset-0 z-10">
                    <div class="absolute top-[60%] left-1/2 -translate-x-1/2 text-4xl opacity-50">🌊</div>
                    <div id="fish-avatar" class="absolute top-[65%] text-4xl transition-all duration-100" style="left: 50%;">🐟</div>
                    
                    <div class="absolute bottom-4 left-4 right-4">
                        <div class="flex justify-between text-[9px] text-white font-bold mb-1">
                            <span>LINE TENSION</span><span id="tension-val">0%</span>
                        </div>
                        <div class="w-full h-4 bg-slate-900 rounded-full border border-slate-500 overflow-hidden">
                            <div id="tension-bar" class="h-full bg-green-500 w-0 transition-none"></div>
                        </div>
                    </div>
                    
                    <div id="arrow-left" class="absolute left-2 top-1/2 text-4xl text-white opacity-50">⬅️</div>
                    <div id="arrow-right" class="absolute right-2 top-1/2 text-4xl text-white opacity-50">➡️</div>
                </div>
            </div>
            <p id="fish-controls" class="text-[10px] text-slate-500 mt-2 italic">Click to stop power meter!</p>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            const handleKey = (e) => {
                if (window.fishingData.state === 'reel') {
                    if (e.key === 'ArrowLeft' || e.key === 'a') { window.fishingData.playerPull = -1; updateArrows(); }
                    if (e.key === 'ArrowRight' || e.key === 'd') { window.fishingData.playerPull = 1; updateArrows(); }
                }
            };
            const handleUp = (e) => {
                if (window.fishingData.state === 'reel') {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') { 
                        window.fishingData.playerPull = 0; 
                        updateArrows();
                    }
                }
            };
            
            const updateArrows = () => {
                const l = document.getElementById('arrow-left');
                const r = document.getElementById('arrow-right');
                if (l && r) {
                    l.className = window.fishingData.playerPull === -1 ? "absolute left-2 top-1/2 text-4xl text-yellow-400 scale-125 transition-all" : "absolute left-2 top-1/2 text-4xl text-white opacity-50 transition-all";
                    r.className = window.fishingData.playerPull === 1 ? "absolute right-2 top-1/2 text-4xl text-yellow-400 scale-125 transition-all" : "absolute right-2 top-1/2 text-4xl text-white opacity-50 transition-all";
                }
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
        document.getElementById('fish-msg').innerText = "WAIT FOR SPLASH...";
        document.getElementById('fish-controls').innerText = "Wait for the bobber to sink, then CLICK!";
        
        // Random bite time
        d.fishTimer = 100 + Math.random() * 150; 
    }
    else if (d.state === 'wait') {
        window.finishFishingGame(false, "Pulled too early!");
    }
    else if (d.state === 'bite') {
        // TRANSITION: Bite -> Reel
        d.state = 'reel';
        document.getElementById('bobber').classList.add('hidden');
        document.getElementById('fight-ui').classList.remove('hidden');
        document.getElementById('fish-dist').classList.remove('hidden');
        document.getElementById('fish-msg').innerText = "REEL IT IN!";
        document.getElementById('fish-controls').innerText = "Use Arrows (or A/D) to pull AGAINST the fish!";
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
                if (Math.random() < 0.05) d.fishForce = Math.random() < 0.5 ? -1 : 1;
                
                const isCountering = (d.playerPull !== 0 && d.playerPull !== d.fishForce);
                
                if (isCountering) {
                    // REELING IN
                    d.distance -= 0.2; 
                    d.tension = Math.max(0, d.tension - 0.5); 
                    
                    if (d.reelSfx.paused) d.reelSfx.play().catch(()=>{});
                    if (!d.dragSfx.paused) d.dragSfx.pause();
                } else {
                    // DRAGGING OUT
                    d.distance += 0.05; 
                    
                    // --- NEW: ROD UPGRADE LOGIC ---
                    const hasRod = state.purchasedItems.includes('rod_upgrade');
                    d.tension += (hasRod ? 0.2 : 0.4); // Half tension if upgraded
                    // ------------------------------
                    
                    if (d.dragSfx.paused) d.dragSfx.play().catch(()=>{});
                    if (!d.reelSfx.paused) d.reelSfx.pause();
                }

        d.fishPos += d.fishForce;
        d.fishPos = Math.max(10, Math.min(90, d.fishPos));
        
        const fishEl = document.getElementById('fish-avatar');
        const tensionBar = document.getElementById('tension-bar');
        const tensionVal = document.getElementById('tension-val');
        const distEl = document.getElementById('fish-dist');

        if (fishEl) {
            fishEl.style.left = d.fishPos + '%';
            fishEl.style.transform = `scaleX(${d.fishForce * -1})`; 
        }
        if (tensionBar) {
            tensionBar.style.width = d.tension + '%';
            const color = d.tension > 70 ? 'bg-red-600' : (d.tension > 40 ? 'bg-yellow-400' : 'bg-green-500');
            tensionBar.className = `h-full transition-none ${color}`;
        }
        if (tensionVal) tensionVal.innerText = Math.floor(d.tension) + '%';
        if (distEl) distEl.innerText = Math.floor(d.distance) + 'm';

        if (d.distance <= 0) window.finishFishingGame(true);
        if (d.tension >= 100) window.finishFishingGame(false, "Line snapped!");
        if (d.distance >= 100) window.finishFishingGame(false, "Fish swam away!");
    }
};

window.triggerBite = function() {
    window.fishingData.state = 'bite';
    const bobber = document.getElementById('bobber');
    const status = document.getElementById('fish-status');
    
    if (bobber) {
        bobber.classList.remove('animate-bounce');
        bobber.style.transform = "translate(-50%, 20px) scale(0.8)"; 
    }
    if (status) {
        status.innerText = "CLICK NOW!";
        status.classList.add('text-red-500', 'animate-pulse', 'font-black');
    }

    // 0.8s window to click
    window.fishingData.biteTimeout = setTimeout(() => {
        if (window.fishingData.state === 'bite') {
            window.finishFishingGame(false, "Too slow! It got away.");
        }
    }, 800);
};

window.finishFishingGame = function(success, msg) {
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
                    catchImg = "images/minigames/fishing/hook.webp"; // Generic hook or empty image
                    // Fallback emoji if image missing
                    if (!catchImg) catchImg = "🎣"; 
                    
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