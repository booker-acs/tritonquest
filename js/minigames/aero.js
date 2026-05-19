// --- TRITON KART MINIGAME ---

window.aeroKartData = {
    active: false,
    animId: null,
    ctx: null,
    keys: { up: false, down: false, left: false, right: false },
    racers: [],
    playerIdx: 0,
    camera: { x: 0, y: 0 },
    trackImg: null,
    trackData: null,
    waypoints: [],
    obstacles: [],
    state: 'select', 
    startTime: 0,
    placement: 0,
    // Audio Objects
    introAudio: null,
    gameAudio: null
};

// Character Database - Added engine sound paths
window.AK_CHARS = [
    { id: 'booker', name: 'Mr. Booker', color: '#3b82f6', img: 'images/minigames/aerokart/booker.webp', fallback: '📚', engine: 'engine.ogg' },
    { id: 'triton', name: 'King Triton', color: '#eab308', img: 'images/minigames/aerokart/triton.webp', fallback: '🔱', engine: 'engine4.ogg' },
    { id: 'walsh', name: 'Mr. Walsh', color: '#22c55e', img: 'images/minigames/aerokart/walsh.webp', fallback: '💼', engine: 'engine3.ogg' },
    { id: 'mra', name: 'Mr. A', color: '#ef4444', img: 'images/minigames/aerokart/mra.webp', fallback: '👨‍🏫', engine: 'engine2.ogg' }
];

window.akBoxCoords = [
    { t: 11, l: 9.5, w: 31.5, h: 37 },  // 0: Booker
    { t: 11, l: 59, w: 32.5, h: 37 },   // 1: Triton
    { t: 55, l: 9.5, w: 31.5, h: 40 },  // 2: Walsh
    { t: 55, l: 59, w: 32.5, h: 40 }    // 3: Mr. A
];
window.akSelectIndex = 0;
window.akSelectAnimInterval = null;
window.akSelectAnimState = false;

// Audio Helper for pausing standard background music
window.pauseMainBGM = function() {
    if (window.bgMusic && typeof window.bgMusic.pause === 'function') window.bgMusic.pause();
    const bgmEl = document.getElementById('bgm');
    if (bgmEl && typeof bgmEl.pause === 'function') bgmEl.pause();
};

window.resumeMainBGM = function() {
    if (window.bgMusic && typeof window.bgMusic.play === 'function') window.bgMusic.play().catch(()=>{});
    const bgmEl = document.getElementById('bgm');
    if (bgmEl && typeof bgmEl.play === 'function') bgmEl.play().catch(()=>{});
};

window.cleanupAeroKartAudio = function() {
    const d = window.aeroKartData;
    if (d.introAudio) { d.introAudio.pause(); d.introAudio.currentTime = 0; }
    if (d.gameAudio) { d.gameAudio.pause(); d.gameAudio.currentTime = 0; }
    if (d.racers) {
        d.racers.forEach(r => {
            if (r.engineAudio) { r.engineAudio.pause(); r.engineAudio.currentTime = 0; }
        });
    }
    window.resumeMainBGM();
};

// 1. Entry Point & Character Select
window.startAeroKart = function() {
    if (state.energy < 20) {
        window.queueModal("Too Tired", "You need 20 Energy to focus on a high-speed race.", "Okay", "💤");
        return;
    }

    // Stop background music and play 8-bit intro
    window.pauseMainBGM();
    window.aeroKartData.introAudio = new Audio('audio/tritonkart/intro8bit.ogg');
    window.aeroKartData.introAudio.loop = true;
    window.aeroKartData.introAudio.volume = 0.5;
    window.aeroKartData.introAudio.play().catch(e => console.warn("Audio blocked:", e));

    window.akSelectIndex = 0;

    const selectHtml = `
        <div class="text-center select-none pb-2" id="ak-select-screen">
            <div class="relative w-full aspect-[4/3] mx-auto rounded-xl overflow-hidden shadow-xl border-4 border-slate-700 bg-black mb-4">
                <img src="images/minigames/aerokart/select.webp" class="absolute inset-0 w-full h-full object-cover pointer-events-none">
                <img id="ak-select-anim-img" src="images/minigames/aerokart/select2.webp" class="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-[50ms]" style="clip-path: inset(11% 59% 52% 9.5%);">
                <div id="ak-selector-box" class="absolute border-4 border-yellow-400 shadow-[0_0_15px_yellow,inset_0_0_15px_yellow] transition-all duration-200 pointer-events-none z-10 rounded-sm" 
                     style="top: ${window.akBoxCoords[0].t}%; left: ${window.akBoxCoords[0].l}%; width: ${window.akBoxCoords[0].w}%; height: ${window.akBoxCoords[0].h}%;"></div>
                ${window.akBoxCoords.map((c, i) => `
                    <div class="absolute cursor-pointer hover:bg-white/10 transition-colors" style="top: ${c.t}%; left: ${c.l}%; width: ${c.w}%; height: ${c.h}%;" onclick="window.clickAkSelect(${i})" ondblclick="window.confirmAkSelect()"></div>
                `).join('')}
            </div>
            
            <div class="flex flex-col items-center">
                <div class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Current Selection</div>
                <div id="ak-selected-name" class="text-2xl font-black uppercase tracking-widest mb-4 transition-colors duration-200" style="color: ${window.AK_CHARS[0].color}; text-shadow: 2px 2px 0px rgba(0,0,0,0.5);">${window.AK_CHARS[0].name}</div>
                <button onclick="window.confirmAkSelect()" class="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-black text-white uppercase shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all text-xl tracking-widest flex items-center justify-center gap-2">
                    <span>START RACE</span> <span class="text-lg">🏁</span>
                </button>
            </div>
            
            <div class="mt-4 text-[9px] text-slate-500 uppercase font-bold tracking-widest text-left bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <span class="text-white block mb-1">Controls:</span>
                • Arrows/WASD to pick character and drive.<br>
                • Tank Controls: Up/Down accelerates, Left/Right rotates.<br>
                • Avoid grass/sand. Buildings act as walls!<br>
                • Complete 3 laps to win!
            </div>
        </div>
        
        <div id="ak-game-screen" class="hidden text-center select-none relative">
            <div id="ak-loading" class="absolute inset-0 bg-slate-900 z-40 flex items-center justify-center rounded-xl border-4 border-slate-600">
                <div class="text-acs-gold font-black animate-pulse tracking-widest">LOADING TRACK...</div>
            </div>
            <div id="ak-countdown" class="absolute inset-0 z-30 hidden flex items-center justify-center pointer-events-none">
                <div id="ak-countdown-text" class="text-7xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse" style="text-shadow: 0 4px 10px rgba(0,0,0,0.5);">3</div>
            </div>
            <div class="flex justify-between items-center mb-2 px-2 text-white font-black uppercase tracking-widest text-xs">
                <div>Lap: <span id="ak-lap" class="text-acs-gold">1/3</span></div>
                <div>Pos: <span id="ak-pos" class="text-acs-gold">1st</span></div>
            </div>
            <canvas id="ak-canvas" width="320" height="240" class="bg-slate-900 rounded-xl border-4 border-slate-600 shadow-inner w-full aspect-[4/3]" style="image-rendering: pixelated;"></canvas>
            <div class="grid grid-cols-3 gap-2 mt-4 max-w-[200px] mx-auto md:hidden">
                <div></div>
                <button class="ak-btn bg-slate-700 h-12 rounded-lg font-black text-white active:bg-acs-gold" data-key="up">▲</button>
                <div></div>
                <button class="ak-btn bg-slate-700 h-12 rounded-lg font-black text-white active:bg-acs-gold" data-key="left">◀</button>
                <button class="ak-btn bg-slate-700 h-12 rounded-lg font-black text-white active:bg-acs-gold" data-key="down">▼</button>
                <button class="ak-btn bg-slate-700 h-12 rounded-lg font-black text-white active:bg-acs-gold" data-key="right">▶</button>
            </div>
        </div>
    `;

    window.queueModal("Game Station X", selectHtml, "Power Off", "📺", () => {
        if (window.akMenuKeyHandler) {
            document.removeEventListener('keydown', window.akMenuKeyHandler);
            window.akMenuKeyHandler = null;
        }
        if (window.akSelectAnimInterval) {
            clearInterval(window.akSelectAnimInterval);
            window.akSelectAnimInterval = null;
        }
        window.aeroKartData.active = false;
        if (window.aeroKartData.animId) cancelAnimationFrame(window.aeroKartData.animId);
        
        // Full Audio Cleanup on Close
        window.cleanupAeroKartAudio();
    });

    setTimeout(() => {
        window.akMenuKeyHandler = function(e) {
            const selectScreen = document.getElementById('ak-select-screen');
            if (!selectScreen || selectScreen.classList.contains('hidden')) return;
            
            e.preventDefault(); 
            switch(e.key.toLowerCase()) {
                case 'arrowup': case 'w': window.moveAkSelect(0, -1); break;
                case 'arrowdown': case 's': window.moveAkSelect(0, 1); break;
                case 'arrowleft': case 'a': window.moveAkSelect(-1, 0); break;
                case 'arrowright': case 'd': window.moveAkSelect(1, 0); break;
                case 'enter': case ' ': window.confirmAkSelect(); break;
            }
        };
        document.addEventListener('keydown', window.akMenuKeyHandler);

        if (window.akSelectAnimInterval) clearInterval(window.akSelectAnimInterval);
        window.akSelectAnimState = false;
        window.akSelectAnimInterval = setInterval(() => {
            const animImg = document.getElementById('ak-select-anim-img');
            if (animImg) {
                window.akSelectAnimState = !window.akSelectAnimState;
                animImg.style.opacity = window.akSelectAnimState ? "1" : "0";
            }
        }, 500);

        window.applyAkSelectVisuals();
    }, 100);
};

window.moveAkSelect = function(dirX, dirY) {
    let idx = window.akSelectIndex;
    let row = Math.floor(idx / 2);
    let col = idx % 2;
    row += dirY; col += dirX;
    if (row < 0) row = 1; if (row > 1) row = 0;
    if (col < 0) col = 1; if (col > 1) col = 0;
    window.akSelectIndex = row * 2 + col;
    window.applyAkSelectVisuals();
};

window.clickAkSelect = function(idx) {
    window.akSelectIndex = idx;
    window.applyAkSelectVisuals();
};

window.applyAkSelectVisuals = function() {
    const box = document.getElementById('ak-selector-box');
    const animImg = document.getElementById('ak-select-anim-img');
    if (box) {
        const c = window.akBoxCoords[window.akSelectIndex];
        box.style.top = c.t + '%'; box.style.left = c.l + '%';
        box.style.width = c.w + '%'; box.style.height = c.h + '%';
        if (animImg) {
            const rightDist = 100 - (c.l + c.w);
            const bottomDist = 100 - (c.t + c.h);
            animImg.style.clipPath = `inset(${c.t}% ${rightDist}% ${bottomDist}% ${c.l}%)`;
            animImg.style.opacity = "1";
            window.akSelectAnimState = true;
        }
    }
    const nameLabel = document.getElementById('ak-selected-name');
    if (nameLabel) {
        const char = window.AK_CHARS[window.akSelectIndex];
        nameLabel.innerText = char.name;
        nameLabel.style.color = char.color;
    }
};

window.confirmAkSelect = function() {
    if (window.akMenuKeyHandler) {
        document.removeEventListener('keydown', window.akMenuKeyHandler);
        window.akMenuKeyHandler = null;
    }
    if (window.akSelectAnimInterval) {
        clearInterval(window.akSelectAnimInterval);
        window.akSelectAnimInterval = null;
    }
    window.initAeroKartRace(window.akSelectIndex);
};


// 2. Initialize Race State
window.initAeroKartRace = function(playerSelectionIdx) {
    document.getElementById('ak-select-screen').classList.add('hidden');
    document.getElementById('ak-game-screen').classList.remove('hidden');

    // Audio Transition
    if (window.aeroKartData.introAudio) {
        window.aeroKartData.introAudio.pause();
    }
    window.aeroKartData.gameAudio = new Audio('audio/tritonkart/game.ogg');
    window.aeroKartData.gameAudio.loop = true;
    window.aeroKartData.gameAudio.volume = 0.4; // Slightly quieter to hear engines

    const canvas = document.getElementById('ak-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const waypoints = [
        { x: 220, y: 195 }, { x: 260, y: 185 }, { x: 275, y: 150 }, { x: 275, y: 100 }, 
        { x: 275, y:  55 }, { x: 240, y:  45 }, { x: 200, y:  45 }, { x: 140, y:  45 }, 
        { x:  90, y:  45 }, { x:  55, y:  75 }, { x: 115, y: 120 }, { x:  55, y: 165 }, 
        { x:  55, y: 195 }, { x: 100, y: 195 }, { x: 165, y: 195 }
    ];

    let startPositions = [
        { x: 140, y: 185 }, { x: 140, y: 198 },
        { x: 110, y: 185 }, { x: 110, y: 198 }
    ];

    let racers = [];
    window.AK_CHARS.forEach((c, i) => {
        let isPlayer = i === playerSelectionIdx;
        let pos = startPositions[i];
        
        let img = new Image();
        img.src = c.img;
        img.ready = false;
        img.onload = () => { img.ready = true; };

        // Initialize unique engine audio
        let eng = new Audio('audio/tritonkart/' + c.engine);
        eng.loop = true;
        eng.volume = isPlayer ? 0.5 : 0.15; // AI is quieter

        racers.push({
            id: c.id, name: c.name, color: c.color, isPlayer: isPlayer,
            x: pos.x, y: pos.y, angle: 0, speed: 0,
            maxSpeed: isPlayer ? 3.5 : (2.8 + Math.random() * 0.4),
            accel: 0.15, friction: 0.92, targetWp: 0, progress: 0, lap: 1,
            img: img, fallback: c.fallback, engineAudio: eng
        });
    });

    let pIdx = racers.findIndex(r => r.isPlayer);

    // Retain existing audio properties
    const iAudio = window.aeroKartData.introAudio;
    const gAudio = window.aeroKartData.gameAudio;

    window.aeroKartData = {
        active: true, ctx: ctx, width: canvas.width, height: canvas.height,
        keys: { up: false, down: false, left: false, right: false },
        racers: racers, playerIdx: pIdx, waypoints: waypoints, obstacles: [], 
        state: 'countdown', startTime: Date.now(), trackImg: new Image(), trackData: null,
        introAudio: iAudio, gameAudio: gAudio
    };

    window.akRaceKeyHandler = function(e, isDown) {
        const k = e.key.toLowerCase();
        if (k === 'arrowup' || k === 'w') window.aeroKartData.keys.up = isDown;
        if (k === 'arrowdown' || k === 's') window.aeroKartData.keys.down = isDown;
        if (k === 'arrowleft' || k === 'a') window.aeroKartData.keys.left = isDown;
        if (k === 'arrowright' || k === 'd') window.aeroKartData.keys.right = isDown;
    };
    
    document.addEventListener('keydown', (e) => window.akRaceKeyHandler(e, true));
    document.addEventListener('keyup', (e) => window.akRaceKeyHandler(e, false));

    document.querySelectorAll('.ak-btn').forEach(btn => {
        const k = btn.getAttribute('data-key');
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); window.aeroKartData.keys[k] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); window.aeroKartData.keys[k] = false; });
        btn.addEventListener('mousedown', () => { window.aeroKartData.keys[k] = true; });
        btn.addEventListener('mouseup', () => { window.aeroKartData.keys[k] = false; });
        btn.addEventListener('mouseleave', () => { window.aeroKartData.keys[k] = false; });
    });

    const beginCountdown = () => {
        document.getElementById('ak-loading').classList.add('hidden');
        document.getElementById('ak-countdown').classList.remove('hidden');
        
        window.aeroKartData.animId = requestAnimationFrame(window.akLoop);

        let count = 3;
        window.aeroKartData.gameAudio.play().catch(e => console.warn("Audio blocked:", e));
        const countText = document.getElementById('ak-countdown-text');
        if (countText) countText.innerText = count;

        let countdownInt = setInterval(() => {
            if (!window.aeroKartData.active) { clearInterval(countdownInt); return; }
            count--;
            
            if (count > 0) {
                if (countText) countText.innerText = count;
            } else if (count === 0) {
                if (countText) { countText.innerText = "GO!"; countText.classList.add('text-green-400'); }
                
                // Release karts and start race music
                window.aeroKartData.state = 'race';
                

            } else {
                clearInterval(countdownInt);
                document.getElementById('ak-countdown').classList.add('hidden');
            }
        }, 1000);
    };

    if (typeof window.AERO_KART_TRACK_B64 !== 'undefined') {
        window.aeroKartData.trackImg.src = window.AERO_KART_TRACK_B64;
    } else {
        window.aeroKartData.trackImg.src = 'images/minigames/aerokart/track1.webp'; 
    }
    
    window.aeroKartData.trackImg.onload = () => {
        try {
            const offscreen = document.createElement('canvas');
            offscreen.width = canvas.width; offscreen.height = canvas.height;
            const octx = offscreen.getContext('2d');
            octx.drawImage(window.aeroKartData.trackImg, 0, 0, canvas.width, canvas.height);
            window.aeroKartData.trackData = octx.getImageData(0, 0, canvas.width, canvas.height).data;
        } catch (e) {
            window.aeroKartData.trackData = new Uint8ClampedArray(canvas.width * canvas.height * 4); 
        }
        beginCountdown();
    };
    
    window.aeroKartData.trackImg.onerror = () => {
        window.aeroKartData.trackData = new Uint8ClampedArray(canvas.width * canvas.height * 4);
        beginCountdown();
    };
};

// 3. Game Loop & Physics
window.akLoop = function() {
    if (!window.aeroKartData.active) return;
    
    if (window.aeroKartData.state === 'race') {
        updateAeroKart();
    }
    
    drawAeroKart();
    
    if (window.aeroKartData.state === 'race' || window.aeroKartData.state === 'countdown') {
        window.aeroKartData.animId = requestAnimationFrame(window.akLoop);
    }
};

function updateAeroKart() {
    const d = window.aeroKartData;
    
    let sortedRacers = [...d.racers].sort((a, b) => b.progress - a.progress);
    d.placement = sortedRacers.findIndex(r => r.isPlayer) + 1;
    
    const p = d.racers[d.playerIdx];
    document.getElementById('ak-lap').innerText = `${Math.min(3, p.lap)}/3`;
    document.getElementById('ak-pos').innerText = d.placement + (d.placement===1?'st':d.placement===2?'nd':d.placement===3?'rd':'th');

    d.racers.forEach(r => {
        let currentFriction = r.friction;
        let isWall = false;

        let px = Math.floor(r.x); let py = Math.floor(r.y);
        
        if (px < 0 || px >= d.width || py < 0 || py >= d.height) {
            isWall = true;
        } else if (d.trackData) {
            let idx = (py * d.width + px) * 4;
            let R = d.trackData[idx]; let G = d.trackData[idx+1]; let B = d.trackData[idx+2];
            if (R !== undefined) {
                if (R > 190 && G > 190 && B > 190 && Math.abs(R-G) < 20 && Math.abs(G-B) < 20) isWall = true;
                else if (B > R + 30 && B > G + 10) isWall = true; 
                else if (G > R + 15 && G > B + 15) currentFriction = 0.8; 
                else if (R > 170 && G > 150 && B < 160) currentFriction = 0.8; 
            }
        }

        if (r.isPlayer) {
            let handling = 0.08;
            if (d.keys.left) r.angle -= handling;
            if (d.keys.right) r.angle += handling;
            if (d.keys.up) r.speed += r.accel;
            if (d.keys.down) r.speed -= r.accel;
        } else {
            let handling = 0.15; 
            let target = d.waypoints[r.targetWp];
            let dx = target.x - r.x; let dy = target.y - r.y;
            let targetAngle = Math.atan2(dy, dx);
            let angleDiff = targetAngle - r.angle;
            angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
            
            if (angleDiff > 0.1) r.angle += handling;
            else if (angleDiff < -0.1) r.angle -= handling;
            
            if (Math.abs(angleDiff) > 0.6) { r.speed += r.accel * 0.2; r.speed *= 0.92; } 
            else { r.speed += r.accel; }
            
            if (Math.hypot(dx, dy) < 25) { 
                r.targetWp = (r.targetWp + 1) % d.waypoints.length;
                r.progress++;
                if (r.targetWp === 0) r.lap++; 
            }
        }

        if (r.isPlayer) {
            let target = d.waypoints[r.targetWp];
            let distToTarget = Math.hypot(target.x - r.x, target.y - r.y);
            let hitRadius = (r.targetWp === d.waypoints.length - 1) ? 15 : 80;
            if (distToTarget < hitRadius) {
                r.targetWp = (r.targetWp + 1) % d.waypoints.length;
                r.progress++;
                if (r.targetWp === 0) r.lap++;
            }
        }

        r.speed *= currentFriction;
        r.speed = Math.max(-r.maxSpeed * 0.5, Math.min(r.maxSpeed, r.speed));

        if (isWall) {
            if (r.isPlayer) {
                r.speed *= -0.5; 
                r.x -= Math.cos(r.angle) * 6; r.y -= Math.sin(r.angle) * 6;
            } else {
                r.speed = 0.5; 
                let target = d.waypoints[r.targetWp];
                let dx = target.x - r.x; let dy = target.y - r.y; let dist = Math.hypot(dx, dy);
                if (dist > 0) {
                    r.angle = Math.atan2(dy, dx);
                    r.x += (dx / dist) * 3; r.y += (dy / dist) * 3;
                }
            }
        } else {
            r.x += Math.cos(r.angle) * r.speed; r.y += Math.sin(r.angle) * r.speed;
        }

        d.racers.forEach(other => {
            if (r.id !== other.id) {
                let dist = Math.hypot(r.x - other.x, r.y - other.y);
                if (dist < 15 && dist > 0) {
                    let overlap = 15 - dist;
                    let nx = (r.x - other.x) / dist; let ny = (r.y - other.y) / dist;
                    r.x += nx * overlap * 0.5; r.y += ny * overlap * 0.5;
                    r.speed *= 0.9;
                }
            }
        });

        // --- ENGINE AUDIO LOGIC ---
        if (d.state === 'race') {
            if (Math.abs(r.speed) > 0.2) {
                if (r.engineAudio.paused) r.engineAudio.play().catch(()=>{});
                // Bonus: Shift audio pitch based on current speed!
                r.engineAudio.playbackRate = 0.7 + (Math.abs(r.speed) / r.maxSpeed) * 0.8;
            } else {
                if (!r.engineAudio.paused) r.engineAudio.pause();
            }
        }
    });

    if (p.lap > 3 && d.state === 'race') {
        d.state = 'finished';
        endAeroKart();
    }
}

// 4. Rendering
function drawAeroKart() {
    const d = window.aeroKartData;
    const ctx = d.ctx;

    if (d.trackImg && d.trackImg.complete && d.trackImg.naturalWidth > 0) {
        ctx.drawImage(d.trackImg, 0, 0, d.width, d.height);
    } else {
        ctx.fillStyle = '#166534'; ctx.fillRect(0, 0, d.width, d.height);
        ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.roundRect(20, 20, 280, 200, 40); ctx.fill();
        ctx.fillStyle = '#166534'; ctx.beginPath(); ctx.roundRect(80, 70, 160, 100, 20); ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillRect(160 + i * 5, 175 + j * 5, 5, 5);
            } else {
                ctx.fillStyle = '#000000'; ctx.fillRect(160 + i * 5, 175 + j * 5, 5, 5); ctx.fillStyle = '#ffffff';
            }
        }
    }

    let renderRacers = [...d.racers].sort((a, b) => a.y - b.y);

    renderRacers.forEach(r => {
        ctx.save();
        ctx.translate(r.x, r.y);
        
        ctx.rotate(r.angle);
        ctx.fillStyle = r.color; ctx.fillRect(-8, -6, 16, 12);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(-6, -8, 4, 2); ctx.fillRect(4, -8, 4, 2); 
        ctx.fillRect(-6, 6, 4, 2);  ctx.fillRect(4, 6, 4, 2); 
        
        ctx.rotate(-r.angle); 

        if (r.img && r.img.ready && r.img.naturalWidth > 0) {
            ctx.drawImage(r.img, -10, -18, 20, 20);
        } else {
            ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(r.fallback, 0, -10);
        }

        if (r.isPlayer) {
            ctx.fillStyle = '#fde047'; ctx.beginPath();
            ctx.moveTo(0, -25); ctx.lineTo(-4, -30); ctx.lineTo(4, -30); ctx.fill();
        }

        ctx.restore();
    });
}

// 5. Resolution
function endAeroKart() {
    const d = window.aeroKartData;
    let pos = d.placement;
    
    document.removeEventListener('keydown', window.akRaceKeyHandler);
    document.removeEventListener('keyup', window.akRaceKeyHandler);
    
    // Stop all race audio immediately when crossing finish line
    if (d.gameAudio) d.gameAudio.pause();
    d.racers.forEach(r => {
        if (r.engineAudio) r.engineAudio.pause();
    });

    let title = pos === 1 ? "FIRST PLACE!" : "RACE FINISHED";
    let msg = pos === 1 ? "You dominated the track and took the gold cup!" : `You crossed the line in ${pos}${pos===2?'nd':pos===3?'rd':'th'} place. Good effort!`;
    
    let p = d.racers[d.playerIdx];
    let iconHtml = p.img && p.img.src ? `<img src="${p.img.src}" class="w-16 h-16 object-contain drop-shadow-lg mx-auto mb-2">` : (pos === 1 ? "🏆" : "🏁");
    
    let relief = pos === 1 ? 40 : (pos === 2 ? 30 : 20);
    
    state.energy = Math.max(0, state.energy - 20);
    state.dayStats.energy -= 20;
    state.stress = Math.max(0, state.stress - relief);
    state.dayStats.stress -= relief;
    state.hasPlayedConsole = true;

    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
        <div class="text-red-400 flex justify-between"><span>Energy Cost</span><span>-20%</span></div>
        <div class="text-green-400 flex justify-between"><span>Stress Relief</span><span>-${relief}%</span></div>
    </div>`;

    document.getElementById('modal-overlay').classList.add('hidden');
    setTimeout(() => {
        window.queueModal(title, msg + html, "Back to Room", iconHtml, () => {
            if (typeof window.updateUI === 'function') window.updateUI();
        });
    }, 100);
}