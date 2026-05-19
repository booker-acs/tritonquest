// ==========================================
// SUMMER VACATION MINIGAMES FRAMEWORK
// ==========================================

window.triggerSummerMinigame = function() {
    const summerGames = [
        'wave_rider', 'shark_sprint', 'spike_it', 'seagull_defense', 'castle_builder',
        'golden_roast', 'downhill_dodge', 'frisbee_catch', 'firefly_jar', 'itch_defense',
        'woods_wanderer', 'cup_pong', 'fuse_run', 'stargazer', 'midnight_snack',
        'ice_cream_drip', 'lemonade_stand', 'cannonball', 'water_balloon', 'ant_squish'
    ];

    const selectedGame = summerGames[Math.floor(Math.random() * summerGames.length)];
    window['startSummerGame_' + selectedGame]();
};

window.finishSummerGame = function(success, title, msg, icon) {
    if (window.activeSummerTimer) clearInterval(window.activeSummerTimer);
    document.getElementById('modal-overlay').classList.add('hidden');

    let energyCost = 10;
    let stressRelief = success ? 25 : -10; // Gain 10 stress if you fail!

    state.energy = Math.max(0, state.energy - energyCost);
    state.dayStats.energy -= energyCost;
    
    if (stressRelief > 0) {
        state.stress = Math.max(0, state.stress - stressRelief);
    } else {
        state.stress = Math.min(100, state.stress + Math.abs(stressRelief));
    }
    state.dayStats.stress -= stressRelief;

    let html = `
        <div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
            <div class="text-red-400 flex justify-between"><span>Energy</span><span>-10%</span></div>
            <div class="${success ? 'text-green-400' : 'text-red-400'} flex justify-between"><span>Stress</span><span>${success ? '-25%' : '+10%'}</span></div>
        </div>
    `;

    setTimeout(() => {
        window.queueModal(title, msg + html, "Back to Summer", icon, () => {
            if (typeof window.updateUI === 'function') window.updateUI();
        });
    }, 100);
};

// ==========================================
// 1. WAVE RIDER (Surfing - Balance Meter)
// ==========================================
window.startSummerGame_wave_rider = function() {
    window.smrData = { balance: 50, vel: 0, time: 10, active: true };

    window.surfPush = function(dir) {
        if (!window.smrData.active) return;
        window.smrData.vel += (dir * 4);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-blue-400 uppercase tracking-widest mb-2">Wave Rider</h2>
            <div class="text-2xl font-black text-red-400 mb-4" id="smr-timer">10s</div>
            <p class="text-[10px] text-slate-400 mb-4">Tap LEFT/RIGHT to keep the surfer in the green zone!</p>
            
            <div class="w-full h-8 bg-blue-900 rounded-full border-4 border-slate-600 relative overflow-hidden mb-6 shadow-inner">
                <div class="absolute inset-y-0 bg-green-500/40 border-x-2 border-green-400 z-0" style="left: 35%; right: 35%;"></div>
                <div id="surf-marker" class="absolute inset-y-0 w-8 bg-white rounded-full shadow border-2 border-slate-400 z-10 flex items-center justify-center text-xs transition-none" style="left: 50%; transform: translateX(-50%);">🏄</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.surfPush(-1)" class="py-6 bg-cyan-600 text-white font-black text-3xl rounded-xl active:scale-95 shadow-md">⬅️</button>
                <button onclick="window.surfPush(1)" class="py-6 bg-cyan-600 text-white font-black text-3xl rounded-xl active:scale-95 shadow-md">➡️</button>
            </div>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Wipe Out", "🌊", () => window.finishSummerGame(false, "WIPEOUT", "You immediately fell off the board.", "💥"));

    setTimeout(() => {
        let frame = 0;
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if (t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(true, "GNARLY!", "You rode the wave all the way to the beach!", "🏄");
                }
            }

            // Chaos push
            window.smrData.vel += (Math.random() - 0.5) * 1.5;
            window.smrData.balance += window.smrData.vel;
            window.smrData.vel *= 0.9; // Friction

            const marker = document.getElementById('surf-marker');
            if (marker) marker.style.left = Math.max(0, Math.min(100, window.smrData.balance)) + '%';

            if (window.smrData.balance < 5 || window.smrData.balance > 95) {
                window.smrData.active = false;
                window.finishSummerGame(false, "WIPEOUT", "You lost your balance and ate sand.", "🌊");
            }
        }, 16);
    }, 100);
};

// ==========================================
// 2. SHARK SPRINT (Swimming - Mashing)
// ==========================================
window.startSummerGame_shark_sprint = function() {
    window.smrData = { pX: 10, sX: 0, active: true };

    window.swimMash = function() {
        if (!window.smrData.active) return;
        window.smrData.pX += 4;
        
        const b = document.getElementById('btn-swim');
        if(b) { b.classList.add('bg-blue-400'); setTimeout(()=>b.classList.remove('bg-blue-400'), 50); }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-red-500 uppercase tracking-widest mb-4">Shark Attack!</h2>
            <p class="text-[10px] text-slate-400 mb-6">Mash the button to outswim the shark to the dock!</p>
            
            <div class="w-full h-24 bg-blue-600 rounded-xl border-4 border-blue-800 relative overflow-hidden mb-6 shadow-inner">
                <div class="absolute right-0 top-0 bottom-0 w-8 bg-amber-700 border-l-4 border-amber-900 z-0"></div> <!-- Dock -->
                <div id="shark-marker" class="absolute bottom-4 text-4xl z-10 transition-none" style="left: 0%; transform: scaleX(-1);">🦈</div>
                <div id="swim-marker" class="absolute bottom-4 text-3xl z-20 transition-none" style="left: 10%;">🏊</div>
            </div>

            <button id="btn-swim" onmousedown="window.swimMash()" ontouchstart="(e)=>{e.preventDefault(); window.swimMash();}" class="w-full py-6 bg-blue-600 text-white font-black text-2xl rounded-xl uppercase shadow-md active:scale-95">
                SWIM!
            </button>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Give Up", "🦈", () => window.finishSummerGame(false, "CHOMP", "You became fish food.", "🩸"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            
            window.smrData.sX += 0.8; // Shark speed
            
            const shark = document.getElementById('shark-marker');
            const player = document.getElementById('swim-marker');
            
            if (shark) shark.style.left = window.smrData.sX + '%';
            if (player) player.style.left = window.smrData.pX + '%';

            if (window.smrData.sX >= window.smrData.pX - 5) {
                window.smrData.active = false;
                window.finishSummerGame(false, "CHOMP", "The shark caught your leg!", "🩸");
            } else if (window.smrData.pX >= 90) {
                window.smrData.active = false;
                window.finishSummerGame(true, "SAFE!", "You scrambled onto the dock just in time.", "🛶");
            }
        }, 16);
    }, 100);
};

// ==========================================
// 3. SPIKE IT! (Volleyball - Timing)
// ==========================================
window.startSummerGame_spike_it = function() {
    window.smrData = { size: 100, active: true };

    window.spikeBall = function() {
        if (!window.smrData.active) return;
        window.smrData.active = false;
        
        let s = window.smrData.size;
        // Perfect zone is when outer ring matches inner ring (size ~30)
        if (s >= 20 && s <= 40) {
            window.finishSummerGame(true, "PERFECT SPIKE!", "You smashed it into the sand for game point!", "🏐");
        } else {
            window.finishSummerGame(false, "NET BALL", "You completely mis-timed your jump.", "🤦");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-4">Spike It!</h2>
            <p class="text-[10px] text-slate-400 mb-6">Tap when the shrinking ring perfectly overlaps the volleyball!</p>
            
            <div class="w-full h-48 bg-sky-300 rounded-xl relative overflow-hidden mb-6 flex items-center justify-center cursor-pointer shadow-inner" onmousedown="window.spikeBall()" ontouchstart="(e)=>{e.preventDefault(); window.spikeBall();}">
                <!-- The Ball -->
                <div class="absolute w-12 h-12 bg-white rounded-full border-2 border-slate-300 shadow flex items-center justify-center text-3xl z-0">🏐</div>
                <!-- Shrinking Ring -->
                <div id="spike-ring" class="absolute rounded-full border-4 border-red-500 z-10 transition-none pointer-events-none" style="width: 100%; height: 100%; max-width: 200px; max-height: 200px;"></div>
            </div>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Miss", "🏐", () => window.finishSummerGame(false, "WHIFF", "You let the ball hit the sand.", "🏜️"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.size -= 1.2;
            
            const ring = document.getElementById('spike-ring');
            if (ring) {
                ring.style.width = window.smrData.size + '%';
                ring.style.height = window.smrData.size + '%';
            }

            if (window.smrData.size <= 0) {
                window.smrData.active = false;
                window.finishSummerGame(false, "TOO LATE", "The ball already dropped.", "⏱️");
            }
        }, 16);
    }, 100);
};

// ==========================================
// 4. SEAGULL DEFENSE (Whack-a-Mole / Swipe)
// ==========================================
window.startSummerGame_seagull_defense = function() {
    window.smrData = { time: 10, gulls: [], active: true };

    window.shooGull = function(id) {
        if (!window.smrData.active) return;
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = "💨";
            setTimeout(() => el.remove(), 200);
        }
        window.smrData.gulls = window.smrData.gulls.filter(g => g.id !== id);
    };

    const spawnGull = () => {
        const area = document.getElementById('gull-area');
        if (!area) return;
        const id = 'gull-' + Date.now();
        const obj = { id, timer: 100 }; // Lives for ~1.5s
        window.smrData.gulls.push(obj);

        const el = document.createElement('div');
        el.id = id;
        el.className = "absolute text-4xl cursor-pointer hover:scale-110 active:scale-90 transition-transform drop-shadow-lg";
        el.innerHTML = "🐦";
        el.style.left = (10 + Math.random() * 70) + '%';
        el.style.top = (10 + Math.random() * 70) + '%';
        
        // Swiping or clicking removes it
        el.onmouseenter = () => window.shooGull(id);
        el.onmousedown = () => window.shooGull(id);
        el.ontouchstart = (e) => { e.preventDefault(); window.shooGull(id); };

        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-2 px-2">
                <h2 class="text-xl font-black text-cyan-500 uppercase tracking-widest">Seagull Attack</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Swipe or tap the seagulls before they steal your fries!</p>
            
            <div id="gull-area" class="w-full h-48 bg-amber-100 rounded-xl relative overflow-hidden shadow-inner border-4 border-amber-200">
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-5xl opacity-50 pointer-events-none z-0">🍟</div>
            </div>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Surrender Fries", "🍟", () => window.finishSummerGame(false, "ROBBED", "The birds took everything.", "🐦"));

    setTimeout(() => {
        let frame = 0;
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if (t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(true, "SAFE", "You protected your lunch from the sky rats.", "🍟");
                }
            }

            if (frame % 30 === 0) spawnGull();

            // Check if any gull lived too long
            window.smrData.gulls.forEach((g, i) => {
                g.timer--;
                if (g.timer <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(false, "STOLEN!", "A seagull swooped in and stole your food.", "🍟");
                }
            });

        }, 16);
    }, 100);
};

// ==========================================
// 5. CASTLE BUILDER (Stacking)
// ==========================================
window.startSummerGame_castle_builder = function() {
    window.smrData = { blocks: [], currentX: 0, dir: 3, active: true };

    window.dropBlock = function() {
        if (!window.smrData.active) return;
        
        let dropX = window.smrData.currentX;
        let lastX = window.smrData.blocks.length > 0 ? window.smrData.blocks[window.smrData.blocks.length - 1] : 50;

        // Check offset
        if (window.smrData.blocks.length > 0 && Math.abs(dropX - lastX) > 20) {
            window.smrData.active = false;
            window.finishSummerGame(false, "TIMBER!", "Your sandcastle toppled over.", "💥");
            return;
        }

        window.smrData.blocks.push(dropX);
        renderBlocks();

        if (window.smrData.blocks.length >= 5) {
            window.smrData.active = false;
            window.finishSummerGame(true, "MASTER BUILDER", "A beautiful, structurally sound sandcastle.", "🏰");
        } else {
            // Speed up
            window.smrData.dir = (window.smrData.dir > 0 ? 1 : -1) * (3 + window.smrData.blocks.length);
        }
    };

    const renderBlocks = () => {
        const area = document.getElementById('castle-stack');
        if (area) {
            area.innerHTML = window.smrData.blocks.map(x => `
                <div class="h-8 w-16 bg-amber-400 border-2 border-amber-600 rounded-t-sm shadow absolute transition-all" style="left: calc(${x}% - 32px); bottom: ${(window.smrData.blocks.indexOf(x)) * 32}px;"></div>
            `).join('');
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-amber-500 uppercase tracking-widest mb-4">Sandcastle</h2>
            <p class="text-[10px] text-slate-400 mb-6">Tap to drop the bucket and stack 5 layers!</p>
            
            <div class="w-full h-56 bg-sky-200 border-4 border-slate-300 rounded-xl relative overflow-hidden mb-6 shadow-inner cursor-pointer" onmousedown="window.dropBlock()" ontouchstart="(e)=>{e.preventDefault(); window.dropBlock();}">
                <!-- Swinging Bucket -->
                <div id="cb-bucket" class="absolute top-4 w-8 h-8 bg-red-500 rounded-b-lg border-2 border-slate-700 z-20 flex items-center justify-center text-xs text-white" style="left: 0%; transform: translateX(-50%);">🪣</div>
                
                <!-- Stack Area -->
                <div id="castle-stack" class="absolute bottom-0 w-full h-full z-10 pointer-events-none"></div>
            </div>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Kick it", "🥾", () => window.finishSummerGame(false, "RUINED", "You kicked the sand everywhere.", "🏖️"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.currentX += window.smrData.dir;
            if (window.smrData.currentX > 90 || window.smrData.currentX < 10) window.smrData.dir *= -1;
            
            const b = document.getElementById('cb-bucket');
            if (b) b.style.left = window.smrData.currentX + '%';
        }, 16);
    }, 100);
};

// ==========================================
// 6. GOLDEN ROAST (Hold & Release)
// ==========================================
window.startSummerGame_golden_roast = function() {
    window.smrData = { roast: 0, isHolding: false, active: true };

    window.roastHold = function(state) {
        if (!window.smrData.active) return;
        window.smrData.isHolding = state;
        const b = document.getElementById('btn-roast');
        if (b) b.innerText = state ? "ROASTING..." : "PULL BACK!";

        if (!state) {
            // Check win
            window.smrData.active = false;
            let r = window.smrData.roast;
            if (r >= 65 && r <= 85) {
                window.finishSummerGame(true, "PERFECT S'MORE", "Golden brown and gooey inside. Delicious.", "🏕️");
            } else if (r > 85) {
                window.finishSummerGame(false, "BURNT", "It caught on fire. You are eating a briquette.", "🔥");
            } else {
                window.finishSummerGame(false, "RAW", "It's literally just cold marshmallow.", "🧊");
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-orange-500 uppercase tracking-widest mb-4">Golden Roast</h2>
            <p class="text-[10px] text-slate-400 mb-6">Hold to roast. Release when it's perfectly brown!</p>
            
            <div class="flex justify-center items-center gap-4 mb-6">
                <div class="text-5xl animate-pulse">🔥</div>
                <!-- Marshmallow on stick -->
                <div class="relative w-32 h-16 flex items-center">
                    <div class="w-full h-2 bg-amber-900 rounded-full"></div>
                    <div id="marshmallow" class="absolute left-4 w-12 h-12 bg-white border-2 border-slate-300 rounded-xl transition-colors duration-100"></div>
                </div>
            </div>

            <button id="btn-roast" onmousedown="window.roastHold(true)" onmouseup="window.roastHold(false)" onmouseleave="if(window.smrData.isHolding) window.roastHold(false)" ontouchstart="(e)=>{e.preventDefault(); window.roastHold(true);}" ontouchend="window.roastHold(false)" class="w-full py-6 bg-orange-700 text-white font-black text-2xl rounded-xl uppercase shadow-md active:scale-95 transition-all">
                HOLD IN FIRE
            </button>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Eat it Raw", "🍬", () => window.finishSummerGame(false, "WEAK", "You didn't even try to cook it.", "🤦"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            if (window.smrData.isHolding) {
                window.smrData.roast += 1.5;
                const m = document.getElementById('marshmallow');
                if (m) {
                    if (window.smrData.roast > 85) m.style.backgroundColor = '#1a202c'; // Black
                    else if (window.smrData.roast > 65) m.style.backgroundColor = '#d97706'; // Golden
                    else if (window.smrData.roast > 30) m.style.backgroundColor = '#fde68a'; // Light yellow
                }
                if (window.smrData.roast > 100) window.roastHold(false); // Auto fail
            }
        }, 16);
    }, 100);
};

// ==========================================
// 7. DOWNHILL DODGE (Lane Switching)
// ==========================================
window.startSummerGame_downhill_dodge = function() {
    window.smrData = { time: 15, lane: 1, obs: [], frame: 0, active: true };

    window.ddMove = function(dir) {
        if (!window.smrData.active) return;
        window.smrData.lane = Math.max(0, Math.min(2, window.smrData.lane + dir));
        const p = document.getElementById('dd-player');
        if (p) p.style.left = `calc(${16.6 + (window.smrData.lane * 33.3)}% - 16px)`;
    };

    const spawnObs = () => {
        const area = document.getElementById('dd-area');
        if (!area) return;
        const id = Date.now();
        const lane = Math.floor(Math.random() * 3);
        window.smrData.obs.push({ id, lane, y: -20 });

        const el = document.createElement('div');
        el.id = `ddobs-${id}`;
        el.className = "absolute text-3xl transition-none z-10";
        el.innerHTML = Math.random() > 0.5 ? "🪨" : "🚧";
        el.style.left = `calc(${16.6 + (lane * 33.3)}% - 16px)`;
        el.style.top = '-20%';
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Downhill Bomb</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Switch lanes to dodge the rocks!</p>

            <div id="dd-area" class="relative w-full h-48 bg-slate-600 border-4 border-slate-700 rounded-xl overflow-hidden mb-4 shadow-inner">
                <div class="absolute w-full h-full flex justify-between px-[33%] opacity-50">
                    <div class="h-full w-1 bg-yellow-400 border-dashed"></div>
                    <div class="h-full w-1 bg-yellow-400 border-dashed"></div>
                </div>
                <div id="dd-player" class="absolute bottom-4 text-3xl z-20 transition-all duration-100 ease-out" style="left: calc(50% - 16px);">🚲</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.ddMove(-1)" class="py-4 bg-slate-800 text-white font-black text-2xl rounded-xl shadow-md active:bg-slate-700">⬅️</button>
                <button onclick="window.ddMove(1)" class="py-4 bg-slate-800 text-white font-black text-2xl rounded-xl shadow-md active:bg-slate-700">➡️</button>
            </div>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Hit the Brakes", "🛑", () => window.finishSummerGame(false, "CHICKEN", "You walked down the hill slowly.", "🐔"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.frame++;

            if (window.smrData.frame % 60 === 0) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if(t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(true, "SPEED DEMON", "You made it to the bottom safely!", "🚲");
                }
            }

            if (window.smrData.frame % 25 === 0) spawnObs();

            for (let i = 0; i < window.smrData.obs.length; i++) {
                let o = window.smrData.obs[i];
                o.y += 3; // Fast speed
                const el = document.getElementById(`ddobs-${o.id}`);
                if (el) el.style.top = o.y + '%';

                if (o.y > 75 && o.y < 95 && o.lane === window.smrData.lane) {
                    window.smrData.active = false;
                    if(el) el.innerHTML = "💥";
                    document.getElementById('dd-player').innerHTML = "😵";
                    setTimeout(() => window.finishSummerGame(false, "CRASH", "You hit a rock and went over the handlebars.", "🤕"), 500);
                    return;
                }
                if (o.y > 110) {
                    if (el) el.remove();
                    window.smrData.obs.splice(i, 1);
                    i--;
                }
            }
        }, 16);
    }, 100);
};

// ==========================================
// 8. FRISBEE CATCH (Cursor Tracking)
// ==========================================
window.startSummerGame_frisbee_catch = function() {
    window.smrData = { time: 8, mx: 50, my: 50, fx: 50, fy: 50, vx: 2, vy: 2, active: true };

    window.trackFrisbee = function(e) {
        if (!window.smrData.active) return;
        const area = document.getElementById('frisbee-area');
        if (!area) return;
        const rect = area.getBoundingClientRect();
        
        let cx = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        let cy = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        
        window.smrData.mx = ((cx - rect.left) / rect.width) * 100;
        window.smrData.my = ((cy - rect.top) / rect.height) * 100;
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-blue-500 uppercase tracking-widest">Frisbee Catch</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Keep your cursor/finger exactly ON the frisbee to catch it!</p>

            <div id="frisbee-area" class="relative w-full h-48 bg-sky-200 border-4 border-slate-300 rounded-xl overflow-hidden cursor-crosshair shadow-inner"
                 onmousemove="window.trackFrisbee(event)" ontouchmove="(e)=>{e.preventDefault(); window.trackFrisbee(e);}">
                <div id="f-target" class="absolute w-12 h-12 bg-red-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xs font-bold text-white z-10 transition-none" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">🥏</div>
                
                <!-- Player Hand Indicator -->
                <div id="f-hand" class="absolute w-16 h-16 border-4 border-dashed border-slate-800 rounded-full pointer-events-none transition-none z-20" style="left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
            </div>
        </div>
    `;

    window.queueModal("Summer Activity", html, "Drop It", "🤦", () => window.finishSummerGame(false, "DROPPED", "It hit you in the face.", "🤕"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            const d = window.smrData;

            // Move Frisbee erratically
            d.fx += d.vx;
            d.fy += d.vy;
            if (d.fx < 10 || d.fx > 90) d.vx *= -1;
            if (d.fy < 10 || d.fy > 90) d.vy *= -1;
            
            // Random wind gusts
            if (Math.random() < 0.05) { d.vx += (Math.random()-0.5)*2; d.vy += (Math.random()-0.5)*2; }
            d.vx = Math.max(-3, Math.min(3, d.vx));
            d.vy = Math.max(-3, Math.min(3, d.vy));

            const fTarget = document.getElementById('f-target');
            const fHand = document.getElementById('f-hand');
            if (fTarget) { fTarget.style.left = d.fx + '%'; fTarget.style.top = d.fy + '%'; }
            if (fHand) { fHand.style.left = d.mx + '%'; fHand.style.top = d.my + '%'; }

            // Check distance
            let dist = Math.hypot(d.fx - d.mx, d.fy - d.my);
            if (dist > 15) {
                // Warning color
                if(fHand) fHand.classList.replace('border-slate-800', 'border-red-500');
                d.outOfBounds = (d.outOfBounds || 0) + 1;
                if (d.outOfBounds > 30) { // Allowed outside for ~0.5s total
                    d.active = false;
                    window.finishSummerGame(false, "MISSED IT", "The wind carried it away.", "💨");
                }
            } else {
                if(fHand) fHand.classList.replace('border-red-500', 'border-slate-800');
            }

            // Timer
            if (Math.random() < 0.02) { // Fake frame timer
                d.time -= 0.5;
                const t = document.getElementById('smr-timer');
                if (t) t.innerText = Math.ceil(d.time) + "s";
                if (d.time <= 0) {
                    d.active = false;
                    window.finishSummerGame(true, "CAUGHT", "A perfect grab right out of the air!", "🥏");
                }
            }
        }, 16);
    }, 100);
};

// ==========================================
// 9. FIREFLY JAR (Target Clicking)
// ==========================================
window.startSummerGame_firefly_jar = function() {
    window.smrData = { caught: 0, req: 5, time: 10, flies: [], active: true };

    window.catchFly = function(id) {
        if (!window.smrData.active) return;
        window.smrData.caught++;
        document.getElementById('ff-count').innerText = `${window.smrData.caught}/${window.smrData.req}`;
        
        const el = document.getElementById(id);
        if (el) { el.innerHTML = "✨"; setTimeout(()=>el.remove(), 200); }
        window.smrData.flies = window.smrData.flies.filter(f => f.id !== id);

        if (window.smrData.caught >= window.smrData.req) {
            window.smrData.active = false;
            window.finishSummerGame(true, "BEAUTIFUL", "You caught a jar full of fireflies!", "🫙");
        }
    };

    const spawnFly = () => {
        if (!window.smrData.active) return;
        const area = document.getElementById('ff-area');
        if (!area) return;
        const id = 'ff-' + Date.now() + Math.random();
        
        window.smrData.flies.push({ id, x: 50, y: 50, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3 });

        const el = document.createElement('div');
        el.id = id;
        el.className = "absolute w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_15px_yellow] cursor-pointer animate-pulse z-10";
        el.style.left = '50%'; el.style.top = '50%';
        el.onmousedown = () => window.catchFly(id);
        el.ontouchstart = (e) => { e.preventDefault(); window.catchFly(id); };
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-yellow-300 uppercase tracking-widest">Fireflies</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-2">Tap 5 fireflies to catch them in your jar!</p>
            <div class="text-sm font-bold text-slate-300 mb-4">Caught: <span id="ff-count" class="text-green-400">0/5</span></div>

            <div id="ff-area" class="relative w-full h-48 bg-slate-950 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner">
                <!-- Distant static stars -->
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_70%,#fff_1px,transparent_1px)]" style="background-size: 50px 50px; opacity: 0.2;"></div>
            </div>
        </div>
    `;

    window.queueModal("Summer Night", html, "Go Inside", "🚪", () => window.finishSummerGame(false, "BORING", "You went inside and watched TV instead.", "📺"));

    setTimeout(() => {
        for(let i=0; i<6; i++) spawnFly(); // Spawn initial batch
        
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;

            // Timer approx
            if (Math.random() < 0.015) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if (t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(false, "TOO SLOW", "They all flew away into the night.", "🌌");
                }
            }

            // Move flies
            window.smrData.flies.forEach(f => {
                f.x += f.vx; f.y += f.vy;
                if (f.x < 5 || f.x > 95) f.vx *= -1;
                if (f.y < 5 || f.y > 95) f.vy *= -1;
                if (Math.random() < 0.05) { f.vx += (Math.random()-0.5); f.vy += (Math.random()-0.5); } // erratic movement
                
                const el = document.getElementById(f.id);
                if (el) { el.style.left = f.x + '%'; el.style.top = f.y + '%'; }
            });
        }, 16);
    }, 100);
};

// ==========================================
// 10. ITCH DEFENSE (Mosquito Swat)
// ==========================================
window.startSummerGame_itch_defense = function() {
    window.smrData = { bites: 0, time: 10, bugs: [], active: true };

    window.swatBug = function(id) {
        if (!window.smrData.active) return;
        const el = document.getElementById(id);
        if (el) { el.innerHTML = "💥"; setTimeout(()=>el.remove(), 200); }
        window.smrData.bugs = window.smrData.bugs.filter(b => b.id !== id);
    };

    const spawnBug = () => {
        if (!window.smrData.active) return;
        const area = document.getElementById('bug-area');
        if (!area) return;
        const id = 'bug-' + Date.now();
        window.smrData.bugs.push({ id, life: 60 }); // 1 second to click

        const el = document.createElement('div');
        el.id = id;
        el.className = "absolute text-3xl cursor-pointer hover:scale-110 active:scale-90 transition-transform drop-shadow z-10 bg-red-500/20 rounded-full";
        el.innerHTML = "🦟";
        el.style.left = (10 + Math.random() * 80) + '%';
        el.style.top = (10 + Math.random() * 80) + '%';
        el.onmousedown = () => window.swatBug(id);
        el.ontouchstart = (e) => { e.preventDefault(); window.swatBug(id); };
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-red-500 uppercase tracking-widest mb-2">Mosquito Attack!</h2>
            <div class="text-2xl font-black text-slate-800 mb-2" id="smr-timer">10s</div>
            <p class="text-[10px] text-slate-500 mb-4">Tap them fast before they bite you! 3 bites and you're out.</p>

            <div class="flex justify-center mb-2 text-xl" id="bite-tracker"></div>

            <div id="bug-area" class="relative w-full h-48 bg-[#FFDBAC] border-4 border-[#e0b98f] rounded-3xl overflow-hidden shadow-inner cursor-crosshair"></div>
        </div>
    `;

    window.queueModal("Summer Evening", html, "Run Away", "🏃", () => window.finishSummerGame(false, "ITCHY", "You fled inside covered in welts.", "🦟"));

    setTimeout(() => {
        let frame = 0;
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if(t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(true, "ITCH FREE", "You successfully defended your skin.", "✨");
                }
            }

            if (frame % 30 === 0) spawnBug();

            // Check if bugs bit you
            for(let i=0; i < window.smrData.bugs.length; i++) {
                let b = window.smrData.bugs[i];
                b.life--;
                if (b.life <= 0) {
                    // Bitten
                    window.smrData.bites++;
                    document.getElementById('bite-tracker').innerHTML += "🔴";
                    const el = document.getElementById(b.id);
                    if(el) el.remove();
                    window.smrData.bugs.splice(i, 1);
                    i--;

                    if (window.smrData.bites >= 3) {
                        window.smrData.active = false;
                        window.finishSummerGame(false, "EATEN ALIVE", "You are covered in mosquito bites.", "🦟");
                        return;
                    }
                } else if (b.life < 20) {
                    // Pulse red warning
                    const el = document.getElementById(b.id);
                    if(el) el.classList.add('bg-red-500');
                }
            }
        }, 16);
    }, 100);
};

// ==========================================
// 11. WOODS WANDERER (Spotlight / Maze)
// ==========================================
window.startSummerGame_woods_wanderer = function() {
    // 3x3 Grid. 0 is start, 8 is end.
    window.smrData = { pos: 0, time: 10, active: true };
    const path = [1, 2, 5, 8]; // Correct safe path

    window.moveWoods = function(cell) {
        if (!window.smrData.active) return;
        // Check adjacency (simplistic grid math)
        const cur = window.smrData.pos;
        const valid = [cur-1, cur+1, cur-3, cur+3];
        if (valid.includes(cell)) {
            window.smrData.pos = cell;
            renderWoods();

            if (cell === 8) {
                window.smrData.active = false;
                window.finishSummerGame(true, "ESCAPED", "You found your way out of the dark woods.", "🌲");
            } else if (!path.includes(cell) && cell !== 0) {
                window.smrData.active = false;
                window.finishSummerGame(false, "LOST", "You stepped into a swamp and ruined your shoes.", "🐸");
            }
        }
    };

    const renderWoods = () => {
        const area = document.getElementById('woods-grid');
        if (!area) return;
        
        let gridHtml = '';
        for (let i = 0; i < 9; i++) {
            // Only show adjacent cells (simulating a flashlight)
            const cur = window.smrData.pos;
            const isVisible = (i === cur) || ([cur-1, cur+1, cur-3, cur+3].includes(i));
            
            if (isVisible) {
                let icon = i === 8 ? "🚪" : (i === cur ? "🔦" : "🌲");
                gridHtml += `<div onclick="window.moveWoods(${i})" class="bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center text-3xl cursor-pointer hover:bg-slate-700 transition-colors shadow-inner">${icon}</div>`;
            } else {
                gridHtml += `<div class="bg-black border-2 border-slate-900 rounded-lg"></div>`; // Pitch black
            }
        }
        area.innerHTML = gridHtml;
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-green-600 uppercase tracking-widest">Lost in Woods</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Click adjacent tiles to find the exit (🚪). Don't get lost!</p>
            
            <div id="woods-grid" class="grid grid-cols-3 gap-2 w-48 h-48 mx-auto bg-black p-2 rounded-xl shadow-2xl border-4 border-slate-700">
                <!-- Cells injected here -->
            </div>
        </div>
    `;

    window.queueModal("Summer Night", html, "Call for Help", "📱", () => window.finishSummerGame(false, "RESCUED", "Your parents had to pick you up. Embarrassing.", "🚓"));

    setTimeout(() => {
        renderWoods();
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.time--;
            const t = document.getElementById('smr-timer');
            if (t) t.innerText = window.smrData.time + "s";
            
            if (window.smrData.time <= 0) {
                window.smrData.active = false;
                window.finishSummerGame(false, "PITCH BLACK", "Your flashlight died. You are stuck.", "🪫");
            }
        }, 1000);
    }, 100);
};

// ==========================================
// 12. CUP PONG (Power & Angle Meter)
// ==========================================
window.startSummerGame_cup_pong = function() {
    window.smrData = { pwr: 0, dir: 3, active: true };

    window.shootPong = function() {
        if (!window.smrData.active) return;
        window.smrData.active = false;
        clearInterval(window.activeSummerTimer);

        let p = window.smrData.pwr;
        const ball = document.getElementById('pong-ball');
        
        if (ball) {
            // Animate throw based on power
            ball.style.transform = `translateY(-120px) scale(0.5)`;
        }

        setTimeout(() => {
            if (p >= 70 && p <= 85) {
                window.finishSummerGame(true, "SINK IT", "Perfect arc right into the last cup! The party goes wild.", "🍻");
            } else {
                window.finishSummerGame(false, "BOUNCE OUT", "You threw it too hard and it bounced off the table.", "🤦");
            }
        }, 500);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-red-500 uppercase tracking-widest mb-4">Cup Pong</h2>
            <p class="text-[10px] text-slate-400 mb-6">Tap SHOOT when the power bar is in the <span class="text-green-400 font-bold">GREEN</span> zone!</p>

            <div class="relative w-48 h-64 mx-auto bg-slate-800 border-4 border-slate-600 rounded-xl overflow-hidden mb-6 flex flex-col items-center shadow-inner">
                <!-- Target Cup -->
                <div class="absolute top-4 w-12 h-12 bg-red-600 border-t-4 border-white rounded-b-xl z-10 flex items-center justify-center shadow-lg">🍺</div>
                
                <!-- Power Meter -->
                <div class="absolute right-2 top-4 bottom-4 w-4 bg-slate-900 border border-slate-700 rounded-full overflow-hidden">
                    <div class="absolute w-full bg-green-500 z-10" style="bottom: 70%; height: 15%;"></div>
                    <div id="pong-power" class="absolute bottom-0 w-full bg-orange-500 transition-none z-0" style="height: 0%;"></div>
                </div>

                <!-- Ball -->
                <div id="pong-ball" class="absolute bottom-4 text-3xl transition-transform duration-500 ease-in-out z-20">⚪</div>
            </div>

            <button onclick="window.shootPong()" class="w-full py-4 bg-red-600 text-white font-black text-2xl rounded-xl shadow-md active:scale-95 uppercase tracking-widest">
                SHOOT!
            </button>
        </div>
    `;

    window.queueModal("House Party", html, "Pass Turn", "🚶", () => {
        window.finishSummerGame(false, "WEAK", "You passed the ball to your partner.", "👎");
    });

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.pwr += window.smrData.dir;
            if (window.smrData.pwr > 100 || window.smrData.pwr < 0) window.smrData.dir *= -1;
            
            const p = document.getElementById('pong-power');
            if (p) p.style.height = window.smrData.pwr + '%';
        }, 16);
    }, 100);
};

// ==========================================
// 13. FUSE RUN (Path Tracing)
// ==========================================
window.startSummerGame_fuse_run = function() {
    window.smrData = { time: 8, lit: 0, total: 6, active: true };

    window.lightFuse = function(id) {
        if (!window.smrData.active) return;
        // Must hit them in exact order (0 to 5)
        if (id === window.smrData.lit) {
            window.smrData.lit++;
            const el = document.getElementById(`fuse-${id}`);
            if (el) el.classList.replace('bg-slate-600', 'bg-orange-500');

            if (window.smrData.lit >= window.smrData.total) {
                window.smrData.active = false;
                window.finishSummerGame(true, "BOOM!", "The fireworks launched perfectly!", "🎆");
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-orange-400 uppercase tracking-widest">Light the Fuse!</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Swipe your finger/mouse across the dots in order to light the firework!</p>

            <div class="relative w-full h-48 bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner">
                <!-- Firework -->
                <div class="absolute right-4 top-4 text-5xl">🧨</div>
                
                <!-- Dots (Path) -->
                <div id="fuse-0" onmouseenter="window.lightFuse(0)" ontouchstart="(e)=>{e.preventDefault(); window.lightFuse(0);}" class="absolute left-4 bottom-4 w-8 h-8 rounded-full bg-slate-600 shadow border-2 border-white z-10"></div>
                <div id="fuse-1" onmouseenter="window.lightFuse(1)" ontouchmove="(e)=>{e.preventDefault(); window.lightFuse(1);}" class="absolute left-20 bottom-16 w-8 h-8 rounded-full bg-slate-600 shadow border-2 border-white z-10"></div>
                <div id="fuse-2" onmouseenter="window.lightFuse(2)" ontouchmove="(e)=>{e.preventDefault(); window.lightFuse(2);}" class="absolute left-1/2 bottom-8 w-8 h-8 rounded-full bg-slate-600 shadow border-2 border-white z-10 -translate-x-1/2"></div>
                <div id="fuse-3" onmouseenter="window.lightFuse(3)" ontouchmove="(e)=>{e.preventDefault(); window.lightFuse(3);}" class="absolute right-24 bottom-24 w-8 h-8 rounded-full bg-slate-600 shadow border-2 border-white z-10"></div>
                <div id="fuse-4" onmouseenter="window.lightFuse(4)" ontouchmove="(e)=>{e.preventDefault(); window.lightFuse(4);}" class="absolute right-12 bottom-12 w-8 h-8 rounded-full bg-slate-600 shadow border-2 border-white z-10"></div>
                <div id="fuse-5" onmouseenter="window.lightFuse(5)" ontouchmove="(e)=>{e.preventDefault(); window.lightFuse(5);}" class="absolute right-12 top-20 w-8 h-8 rounded-full bg-slate-600 shadow border-2 border-white z-10"></div>
            </div>
        </div>
    `;

    window.queueModal("Summer Night", html, "Run Away", "🏃", () => window.finishSummerGame(false, "FIZZLE", "You let the fuse die out.", "💨"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.time--;
            const t = document.getElementById('smr-timer');
            if(t) t.innerText = window.smrData.time + "s";
            
            if (window.smrData.time <= 0) {
                window.smrData.active = false;
                window.finishSummerGame(false, "FIZZLE", "You were too slow. It's a dud.", "💨");
            }
        }, 1000);
    }, 100);
};

// ==========================================
// 14. STARGAZER (Memory Pattern)
// ==========================================
window.startSummerGame_stargazer = function() {
    window.smrData = { seq: [], input: [], phase: 'show', step: 0, active: true };
    
    // Generate sequence of 4
    for(let i=0; i<4; i++) window.smrData.seq.push(Math.floor(Math.random() * 4));

    window.clickStar = function(id) {
        if (!window.smrData.active || window.smrData.phase !== 'input') return;
        
        // Flash star
        const el = document.getElementById(`star-${id}`);
        if(el) { el.classList.add('scale-150', 'text-yellow-300'); setTimeout(()=>el.classList.remove('scale-150', 'text-yellow-300'), 200); }

        window.smrData.input.push(id);
        const currentIndex = window.smrData.input.length - 1;

        if (window.smrData.input[currentIndex] !== window.smrData.seq[currentIndex]) {
            // Wrong!
            window.smrData.active = false;
            window.finishSummerGame(false, "LOST TRACK", "You forgot the constellation pattern.", "🌌");
        } else if (window.smrData.input.length === window.smrData.seq.length) {
            // Win!
            window.smrData.active = false;
            window.finishSummerGame(true, "ASTRONOMER", "You mapped the stars perfectly.", "✨");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-indigo-300 uppercase tracking-widest mb-4">Stargazer</h2>
            <p id="star-instr" class="text-xs text-slate-400 mb-6">Watch the stars flash...</p>

            <div class="relative w-full h-48 bg-slate-950 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <div class="grid grid-cols-2 gap-8">
                    <div id="star-0" onclick="window.clickStar(0)" class="text-3xl text-white cursor-pointer transition-all duration-200">⭐</div>
                    <div id="star-1" onclick="window.clickStar(1)" class="text-3xl text-white cursor-pointer transition-all duration-200 mt-8">⭐</div>
                    <div id="star-2" onclick="window.clickStar(2)" class="text-3xl text-white cursor-pointer transition-all duration-200 ml-8">⭐</div>
                    <div id="star-3" onclick="window.clickStar(3)" class="text-3xl text-white cursor-pointer transition-all duration-200">⭐</div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Summer Night", html, "Close Eyes", "😴", () => window.finishSummerGame(false, "SLEEPY", "You fell asleep on the grass.", "💤"));

    // Play sequence
    setTimeout(() => {
        let i = 0;
        window.activeSummerTimer = setInterval(() => {
            if (i >= window.smrData.seq.length) {
                clearInterval(window.activeSummerTimer);
                window.smrData.phase = 'input';
                document.getElementById('star-instr').innerText = "Now repeat the pattern!";
                return;
            }
            
            let sId = window.smrData.seq[i];
            const el = document.getElementById(`star-${sId}`);
            if(el) { 
                el.classList.add('scale-150', 'text-yellow-300'); 
                setTimeout(()=>el.classList.remove('scale-150', 'text-yellow-300'), 400); 
            }
            i++;
        }, 800);
    }, 500);
};

// ==========================================
// 15. MIDNIGHT SNACK (Red Light, Green Light)
// ==========================================
window.startSummerGame_midnight_snack = function() {
    window.smrData = { prog: 0, momState: 'sleep', time: 15, isSneaking: false, active: true };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Fridge Raid</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Hold to sneak to the fridge. Stop immediately if the hallway light turns on!</p>

            <div class="w-full h-4 bg-slate-800 rounded-full mb-4 overflow-hidden border border-slate-600 shadow-inner">
                <div id="sneak-progress" class="h-full bg-indigo-500 transition-none" style="width: 0%;"></div>
            </div>

            <!-- Hallway Light Display -->
            <div id="hall-light" class="w-full h-24 mx-auto mb-6 bg-slate-900 border-4 border-slate-700 rounded-2xl shadow-md transition-colors duration-200 flex items-center justify-center text-4xl">
                🌑
            </div>

            <button id="btn-sneak" class="w-full py-4 bg-indigo-600 text-white font-black rounded-xl active:bg-indigo-500 active:scale-95 transition-all shadow-md uppercase tracking-widest"
                    onmousedown="window.smrData.isSneaking = true; this.innerText='TIPTOEING...'" 
                    onmouseup="window.smrData.isSneaking = false; this.innerText='HOLD TO SNEAK'" 
                    onmouseleave="window.smrData.isSneaking = false; this.innerText='HOLD TO SNEAK'"
                    ontouchstart="(e)=>{e.preventDefault(); window.smrData.isSneaking = true; document.getElementById('btn-sneak').innerText='TIPTOEING...';}" 
                    ontouchend="window.smrData.isSneaking = false; document.getElementById('btn-sneak').innerText='HOLD TO SNEAK'">
                HOLD TO SNEAK
            </button>
        </div>
    `;

    window.queueModal("Late Night", html, "Go back to bed", "🛌", () => window.finishSummerGame(false, "HUNGRY", "You went to bed with a growling stomach.", "📉"));

    setTimeout(() => {
        let frame = 0;
        let nextChange = 50 + Math.random() * 50;

        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if(t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(false, "SUNRISE", "You took too long. Morning is here.", "☀️");
                }
            }

            // AI Logic
            nextChange--;
            if (nextChange <= 0) {
                const hl = document.getElementById('hall-light');
                if (window.smrData.momState === 'sleep') {
                    window.smrData.momState = 'waking';
                    if(hl) { hl.innerHTML = "💡"; hl.classList.replace('bg-slate-900', 'bg-yellow-900/50'); }
                    nextChange = 20; // Brief warning
                } else if (window.smrData.momState === 'waking') {
                    window.smrData.momState = 'awake';
                    if(hl) { hl.innerHTML = "👩🔦"; hl.classList.replace('bg-yellow-900/50', 'bg-yellow-100'); }
                    nextChange = 40 + Math.random() * 50;
                } else {
                    window.smrData.momState = 'sleep';
                    if(hl) { hl.innerHTML = "🌑"; hl.classList.replace('bg-yellow-100', 'bg-slate-900'); }
                    nextChange = 50 + Math.random() * 80;
                }
            }

            // Movement Logic
            if (window.smrData.isSneaking) {
                if (window.smrData.momState === 'awake') {
                    window.smrData.active = false;
                    window.finishSummerGame(false, "BUSTED", "Your mom caught you out of bed!", "😡");
                    return;
                }
                
                window.smrData.prog += 1.0;
                const p = document.getElementById('sneak-progress');
                if(p) p.style.width = Math.min(100, window.smrData.prog) + '%';

                if (window.smrData.prog >= 100) {
                    window.smrData.active = false;
                    window.finishSummerGame(true, "SNACK SECURED", "You got the leftover pizza without making a sound!", "🍕");
                }
            }
        }, 16);
    }, 100);
};

// ==========================================
// 16. ICE CREAM DRIP (Mouse Balancing)
// ==========================================
window.startSummerGame_ice_cream_drip = function() {
    window.smrData = { tilt: 0, lastX: -1, time: 10, active: true };

    window.balanceIceCream = function(e) {
        if (!window.smrData.active) return;
        let cX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        
        if (window.smrData.lastX !== -1) {
            let delta = cX - window.smrData.lastX;
            // Pushing mouse Right leans it Left
            window.smrData.tilt -= delta * 0.5; 
        }
        window.smrData.lastX = cX;
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-pink-400 uppercase tracking-widest">Meltdown</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Swipe left/right opposite to the lean to keep the ice cream balanced!</p>

            <div class="w-full h-64 bg-sky-200 border-4 border-slate-300 rounded-xl relative overflow-hidden shadow-inner flex flex-col items-center justify-end cursor-ew-resize"
                 onmousemove="window.balanceIceCream(event)" ontouchmove="(e)=>{e.preventDefault(); window.balanceIceCream(e);}">
                
                <div id="ic-cone" class="flex flex-col items-center origin-bottom transition-transform duration-75" style="transform: rotate(0deg); margin-bottom: -20px;">
                    <div class="text-5xl -mb-4 z-30 drop-shadow-md">🍓</div>
                    <div class="text-5xl -mb-4 z-20 drop-shadow-md">🍦</div>
                    <div class="text-5xl -mb-2 z-10 drop-shadow-md">🍫</div>
                    <div class="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[80px] border-t-amber-600 drop-shadow-lg"></div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Heatwave", html, "Throw it away", "🗑️", () => window.finishSummerGame(false, "WASTED", "You threw away a perfectly good cone.", "😢"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            const d = window.smrData;
            
            // Gravity/Chaos adds to tilt
            d.tilt += (d.tilt > 0 ? 0.5 : -0.5) + (Math.random()-0.5)*2;

            const cone = document.getElementById('ic-cone');
            if (cone) cone.style.transform = `rotate(${d.tilt}deg)`;

            // Check boundaries
            if (Math.abs(d.tilt) > 45) {
                d.active = false;
                window.finishSummerGame(false, "SPLAT", "The ice cream fell on the hot pavement.", "💥");
            }

            // Timer
            if (Math.random() < 0.02) { // Frame rough approximation
                d.time -= 0.6;
                const t = document.getElementById('smr-timer');
                if(t) t.innerText = Math.ceil(d.time) + "s";
                if (d.time <= 0) {
                    d.active = false;
                    window.finishSummerGame(true, "DEVOURED", "You ate the whole thing before it melted.", "😋");
                }
            }
        }, 16);
    }, 100);
};

// ==========================================
// 17. LEMONADE STAND (Physics Dropper)
// ==========================================
window.startSummerGame_lemonade_stand = function() {
    window.smrData = { fill: 20, active: true };

    window.dropIce = function() {
        if (!window.smrData.active) return;
        window.smrData.fill += 20; // Each cube fills 20%
        
        const fillEl = document.getElementById('lem-fill');
        if (fillEl) fillEl.style.height = window.smrData.fill + '%';

        // Check conditions
        if (window.smrData.fill > 100) {
            window.smrData.active = false;
            window.finishSummerGame(false, "OVERFLOW", "You added too much ice and spilled it everywhere.", "💦");
        } else if (window.smrData.fill >= 90) { // Perfect is 100, give slight buffer
            window.smrData.active = false;
            setTimeout(() => window.finishSummerGame(true, "PERFECT POUR", "Ice cold and ready to sell.", "🍋"), 500);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-yellow-400 uppercase tracking-widest mb-4">Lemonade Stand</h2>
            <p class="text-[10px] text-slate-400 mb-6">Tap to drop ice cubes. Fill it perfectly to the top line without overflowing!</p>

            <div class="relative w-24 h-48 mx-auto bg-white/20 border-4 border-slate-300 rounded-b-xl rounded-t flex flex-col justify-end shadow-inner cursor-pointer mb-6" onmousedown="window.dropIce()" ontouchstart="(e)=>{e.preventDefault(); window.dropIce();}">
                <!-- Fill Line -->
                <div class="absolute w-full border-t-2 border-dashed border-red-500 z-20 pointer-events-none" style="top: 10%;"></div>
                
                <!-- Liquid -->
                <div id="lem-fill" class="w-full bg-yellow-300/80 transition-all duration-200 flex flex-wrap-reverse content-start z-10" style="height: 20%;"></div>
            </div>
            
            <p class="text-xs text-slate-500 uppercase font-bold tracking-widest">Tap Glass to add Ice 🧊</p>
        </div>
    `;

    window.queueModal("Summer Job", html, "Drink it", "😋", () => window.finishSummerGame(false, "NO PROFIT", "You drank your own supply.", "💸"));
};

// ==========================================
// 18. CANNONBALL! (Spinning Dial)
// ==========================================
window.startSummerGame_cannonball = function() {
    window.smrData = { frame: 0, active: true };

    window.stopDial = function() {
        if (!window.smrData.active) return;
        window.smrData.active = false;
        clearInterval(window.activeSummerTimer);
        
        // Same logic as Locker Jam
        const currentRot = (window.smrData.frame * 0.15 * (180/Math.PI)) % 360;
        let dist = Math.min(currentRot, 360 - currentRot);

        if (dist < 25) { // Hit top
            window.finishSummerGame(true, "TSUNAMI!", "Massive splash! You soaked everyone.", "🌊");
        } else {
            window.finishSummerGame(false, "BELLY FLOP", "Ouch. That sounded incredibly painful.", "💥");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-blue-500 uppercase tracking-widest mb-4">Cannonball!</h2>
            <p class="text-[10px] text-slate-400 mb-6">Tap to stop the dial in the <span class="text-green-400 font-bold">TOP ZONE</span> for max splash!</p>

            <div class="relative w-40 h-40 mx-auto bg-slate-800 rounded-full border-8 border-slate-600 shadow-xl flex items-center justify-center cursor-pointer mb-6"
                 onmousedown="window.stopDial()" ontouchstart="(e)=>{e.preventDefault(); window.stopDial();}">
                
                <!-- Target Zone Overlay -->
                <div class="absolute top-0 w-12 h-12 border-x-4 border-t-4 border-green-500 rounded-t-xl z-0 opacity-60"></div>
                
                <!-- Spinning Dial -->
                <div id="cb-dial" class="w-full h-full rounded-full transition-none z-10 flex items-start justify-center pt-2">
                    <div class="w-3 h-8 bg-blue-400 rounded-full shadow"></div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Pool Day", html, "Climb Down", "🪜", () => window.finishSummerGame(false, "BORING", "You used the ladder like an old man.", "👴"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.frame++;
            let rot = window.smrData.frame * 0.15;
            const dial = document.getElementById('cb-dial');
            if (dial) dial.style.transform = `rotate(${rot}rad)`;
        }, 16);
    }, 100);
};

// ==========================================
// 19. WATER BALLOON FIGHT (Reaction / Duck)
// ==========================================
window.startSummerGame_water_balloon = function() {
    window.smrData = { time: 10, required: 5, dodged: 0, target: '', active: true };

    const throwBalloon = () => {
        const zones = ['L', 'Duck', 'R'];
        window.smrData.target = zones[Math.floor(Math.random() * zones.length)];
        
        const el = document.getElementById('wb-warning');
        if (el) {
            el.innerText = window.smrData.target === 'Duck' ? '⬇️' : (window.smrData.target === 'L' ? '⬅️' : '➡️');
            el.classList.remove('scale-0');
            el.classList.add('scale-100');
        }
    };

    window.dodgeWB = function(action) {
        if (!window.smrData.active) return;
        
        const el = document.getElementById('wb-warning');
        if(el) { el.classList.remove('scale-100'); el.classList.add('scale-0'); }

        if (action === window.smrData.target) {
            window.smrData.dodged++;
            document.getElementById('wb-count').innerText = `${window.smrData.dodged}/${window.smrData.required}`;
            
            if (window.smrData.dodged >= window.smrData.required) {
                window.smrData.active = false;
                clearInterval(window.activeSummerTimer);
                window.finishSummerGame(true, "NINJA", "You dodged every single balloon!", "🥷");
            } else {
                setTimeout(throwBalloon, 500); // Next throw
            }
        } else {
            window.smrData.active = false;
            clearInterval(window.activeSummerTimer);
            window.finishSummerGame(false, "SPLASH", "Right in the face! You are soaked.", "💦");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-blue-500 uppercase tracking-widest">Dodgeball</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">React fast! Match the arrow direction to dodge!</p>
            <div class="text-sm font-bold text-slate-300 mb-4">Dodged: <span id="wb-count" class="text-green-400">0/5</span></div>

            <div class="w-full h-32 bg-slate-800 rounded-xl mb-6 flex items-center justify-center border-4 border-slate-600 shadow-inner">
                <div id="wb-warning" class="text-6xl scale-0 transition-transform duration-100">⚠️</div>
            </div>

            <div class="grid grid-cols-3 gap-2">
                <button onclick="window.dodgeWB('L')" class="py-4 bg-slate-700 text-white font-black text-xl rounded-xl active:bg-blue-500 transition-colors shadow">LEFT</button>
                <button onclick="window.dodgeWB('Duck')" class="py-4 bg-slate-700 text-white font-black text-xl rounded-xl active:bg-blue-500 transition-colors shadow">DUCK</button>
                <button onclick="window.dodgeWB('R')" class="py-4 bg-slate-700 text-white font-black text-xl rounded-xl active:bg-blue-500 transition-colors shadow">RIGHT</button>
            </div>
        </div>
    `;

    window.queueModal("Neighborhood Block", html, "Surrender", "🏳️", () => {
        window.smrData.active = false;
        clearInterval(window.activeSummerTimer);
        window.finishSummerGame(false, "SOAKED", "You gave up and got pelted.", "💦");
    });

    setTimeout(() => {
        throwBalloon();
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.time--;
            const t = document.getElementById('smr-timer');
            if(t) t.innerText = window.smrData.time + "s";
            
            if (window.smrData.time <= 0) {
                window.smrData.active = false;
                window.finishSummerGame(false, "TOO SLOW", "You stood still and got hit.", "⏱️");
            }
        }, 1000);
    }, 500);
};

// ==========================================
// 20. ANT SQUISH (Path Interception)
// ==========================================
window.startSummerGame_ant_squish = function() {
    window.smrData = { time: 10, ants: [], frame: 0, active: true };

    window.squishAnt = function(id) {
        if (!window.smrData.active) return;
        const el = document.getElementById(id);
        if (el) { el.innerHTML = "💥"; setTimeout(()=>el.remove(), 200); }
        window.smrData.ants = window.smrData.ants.filter(a => a.id !== id);
    };

    const spawnAnt = () => {
        if (!window.smrData.active) return;
        const area = document.getElementById('ant-area');
        if (!area) return;
        const id = 'ant-' + Date.now();
        
        // Spawn from edges
        let edge = Math.floor(Math.random() * 4);
        let x, y;
        if (edge === 0) { x = Math.random()*100; y = 0; } // Top
        if (edge === 1) { x = Math.random()*100; y = 100; } // Bottom
        if (edge === 2) { x = 0; y = Math.random()*100; } // Left
        if (edge === 3) { x = 100; y = Math.random()*100; } // Right

        window.smrData.ants.push({ id, x, y });

        const el = document.createElement('div');
        el.id = id;
        el.className = "absolute text-2xl z-10 cursor-crosshair";
        el.innerHTML = "🐜";
        el.style.left = x + '%'; el.style.top = y + '%';
        el.onmouseenter = () => window.squishAnt(id);
        el.ontouchstart = (e) => { e.preventDefault(); window.squishAnt(id); };
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-red-500 uppercase tracking-widest">Picnic Attack</h2>
                <div class="text-2xl font-black text-red-400" id="smr-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Swipe over the ants before they reach the watermelon!</p>

            <div id="ant-area" class="relative w-full h-48 bg-[#a3e635] border-4 border-[#65a30d] rounded-xl overflow-hidden cursor-crosshair shadow-inner flex items-center justify-center"
                 ontouchmove="(e)=>{
                    e.preventDefault();
                    let t = e.touches[0];
                    let el = document.elementFromPoint(t.clientX, t.clientY);
                    if(el && el.id && el.id.startsWith('ant-')) window.squishAnt(el.id);
                 }">
                <!-- Watermelon Target -->
                <div class="text-6xl z-0 animate-pulse">🍉</div>
            </div>
        </div>
    `;

    window.queueModal("Picnic", html, "Flee", "🏃", () => window.finishSummerGame(false, "OVERRUN", "The ants took the whole slice.", "🐜"));

    setTimeout(() => {
        window.activeSummerTimer = setInterval(() => {
            if (!window.smrData.active) return;
            window.smrData.frame++;

            if (window.smrData.frame % 60 === 0) {
                window.smrData.time--;
                const t = document.getElementById('smr-timer');
                if (t) t.innerText = window.smrData.time + "s";
                if (window.smrData.time <= 0) {
                    window.smrData.active = false;
                    window.finishSummerGame(true, "SAVED", "Your picnic is ant-free!", "🍉");
                }
            }

            if (window.smrData.frame % 20 === 0) spawnAnt();

            // Move ants toward center (50, 50)
            window.smrData.ants.forEach(a => {
                let dx = 50 - a.x;
                let dy = 50 - a.y;
                let dist = Math.hypot(dx, dy);
                
                if (dist < 5) {
                    // Reached center
                    window.smrData.active = false;
                    window.finishSummerGame(false, "INFESTED", "The ants got the watermelon.", "🐜");
                    return;
                }

                a.x += (dx/dist) * 0.4;
                a.y += (dy/dist) * 0.4;

                const el = document.getElementById(a.id);
                if (el) { el.style.left = a.x + '%'; el.style.top = a.y + '%'; }
            });
        }, 16);
    }, 100);
};