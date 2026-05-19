// --- PIXEL JUMP MINIGAME ---

window.pixelJumpData = { 
    gameActive: false, 
    playerY: 0, 
    velocity: 0, 
    obstacles: [], 
    frame: 0, 
    score: 0,
    animId: null,
    bgScroll: 0,
    // Powerup State
    hasTrident: false,
    tridentCollected: false,
    tridentActive: false,
    tridentTimer: 0,
    // Audio State
    bgmAudio: null,
    jumpAudio: null,
    itemAudio: null
};

window.startGameMarathon = function() {
    if (state.energy < 30) {
            document.getElementById('modal-overlay').classList.add('hidden');
            window.queueModal("Too Tired", "You need 30 Energy to focus on gaming.", "Okay", "💤", () => window.handleLeisureMenu());
             return;
    }

    document.getElementById('modal-overlay').classList.add('hidden');
    
    // Stop all other audio before starting the minigame
    if (window.stopAllAudio) window.stopAllAudio();

    // --- AUDIO SETUP ---
    let bgm = new Audio('audio/pixeljump/pixeljump.ogg');
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play().catch(e => console.warn("Audio blocked:", e));

    window.pixelJumpData = { 
        gameActive: true, 
        playerY: 0, 
        velocity: 0, 
        obstacles: [], 
        frame: 0, 
        score: 0,
        animId: null,
        bgScroll: 0,
        hasTrident: false,
        tridentCollected: false,
        tridentActive: false,
        tridentTimer: 0, // Spawn immediately when score > 10
        bgmAudio: bgm,
        jumpAudio: new Audio('audio/pixeljump/jump.ogg'),
        itemAudio: new Audio('audio/pixeljump/item.ogg')
    };

    const gameHtml = `
        <div class="max-w-md mx-auto py-2 select-none" onclick="window.playerJump()">
            <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">FREE TIME</h1>
            <div class="text-6xl mb-4">👾</div>
            <h2 class="text-2xl font-black uppercase italic text-white mb-2">Pixel Jump</h2>
            <p class="text-slate-300 mb-6 text-sm">Spacebar or Click to Jump!</p>
            
            <!-- Progress Bar -->
            <div class="w-full h-4 bg-slate-800 rounded-full mb-2 overflow-hidden border border-slate-600">
                <div id="jump-progress" class="h-full bg-indigo-500 transition-all duration-100" style="width: 0%"></div>
            </div>

            <!-- Game Area -->
            <div id="jump-area" class="bg-slate-900 rounded-xl h-48 relative overflow-hidden border-4 border-slate-700 shadow-inner" style="image-rendering: pixelated;">
                
                <!-- PARALLAX BACKGROUND LAYERS -->
                <div id="bg-layer-1" class="absolute inset-0 z-0 transition-none" 
                     style="background-image: url('images/minigames/pixeljump/bg_sky.webp'); background-repeat: repeat-x; background-size: auto 100%;"></div>
                <div id="bg-layer-2" class="absolute inset-0 z-1 opacity-90 transition-none" 
                     style="background-image: url('images/minigames/pixeljump/bg_mid.webp'); background-repeat: repeat-x; background-size: auto 100%;"></div>
                <div id="bg-layer-3" class="absolute inset-0 z-2 transition-none" 
                     style="background-image: url('images/minigames/pixeljump/bg_ground.webp'); background-repeat: repeat-x; background-size: auto 100%;"></div>

                <!-- Player -->
                <div id="jump-player" 
                     class="absolute left-10 w-16 h-16 z-10 transition-none" 
                     style="bottom: 0px; 
                            background-image: url('images/minigames/pixeljump/tritonsprites.webp'); 
                            background-size: 500% 500%; 
                            background-repeat: no-repeat;
                            background-position: 0% 0%;">
                </div>
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            const handleKey = (e) => {
                if (e.code === 'Space') {
                    e.preventDefault();
                    window.playerJump();
                }
            };
            document.addEventListener('keydown', handleKey);
            
            const loop = () => {
                if (!window.pixelJumpData.gameActive) {
                    document.removeEventListener('keydown', handleKey);
                    return;
                }
                window.updatePixelJump();
                window.pixelJumpData.animId = requestAnimationFrame(loop);
            };
            window.pixelJumpData.animId = requestAnimationFrame(loop);
        }
    });
    window.processModalQueue();
};

window.playerJump = function() {
    const d = window.pixelJumpData;
    if (d.playerY < 50) {
        d.velocity = 12; 
        
        // Play Jump SFX (Clone node allows rapid overlapping playback)
        if (d.jumpAudio) {
            let sfx = d.jumpAudio.cloneNode();
            sfx.volume = 0.4;
            sfx.play().catch(()=>{});
        }
    }
};

window.finishPixelJump = function(success, msg) {
    window.pixelJumpData.gameActive = false;
    if (window.pixelJumpData.animId) cancelAnimationFrame(window.pixelJumpData.animId);
    
    // --- AUDIO CLEANUP ---
    if (window.pixelJumpData.bgmAudio) {
        window.pixelJumpData.bgmAudio.pause();
        window.pixelJumpData.bgmAudio.currentTime = 0;
    }
    // Resume standard dashboard music
    if (window.manageBackgroundAudio) window.manageBackgroundAudio();

    document.getElementById('modal-overlay').classList.add('hidden');

    setTimeout(() => {
        let title, text, btnText, icon;
        let relief = 0;
        const score = Math.floor(window.pixelJumpData.score);
        const energyCost = 30; 

        if (success) {
            relief = 40; 
            title = "HIGH SCORE!";
            text = "You entered the flow state. The game beat you, but you beat the game.";
            btnText = "GG";
            icon = "🏆";
        } else {
            relief = Math.floor(score * 0.8);
            title = "GAME OVER";
            text = (msg || "You hit an obstacle.") + " The run ended early.";
            btnText = "Retry later";
            icon = "💀";
        }

        state.energy = Math.max(0, state.energy - energyCost); 
        state.dayStats.energy -= energyCost;
        state.stress = Math.max(0, state.stress - relief); 
        state.dayStats.stress -= relief;
        state.hasRelaxedToday = true;

        let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
            <div class="text-red-400 flex justify-between"><span>Energy Cost</span><span>-${energyCost}%</span></div>
            <div class="text-purple-400 flex justify-between"><span>Score</span><span>${score} Jumps</span></div>
            <div class="text-green-400 flex justify-between"><span>Stress Relief</span><span>-${relief}%</span></div>
        </div>`;

        state.pendingModals.push({
            title: title,
            text: text + html,
            buttonText: btnText,
            icon: icon,
            showCloseX: false,
            callback: () => window.updateUI(),
            onOpen: () => {
                const btn = document.getElementById('modal-confirm-btn');
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }, 1500);
                }
            }
        });
        window.processModalQueue();

    }, 100);
};

window.updatePixelJump = function() {
    const d = window.pixelJumpData;
    d.frame++;
    const area = document.getElementById('jump-area');

    // 1. PARALLAX
    d.bgScroll -= 1.5; 
    const bg1 = document.getElementById('bg-layer-1');
    const bg2 = document.getElementById('bg-layer-2');
    const bg3 = document.getElementById('bg-layer-3');
    if(bg1) bg1.style.backgroundPositionX = Math.floor(d.bgScroll * 0.1) + 'px'; 
    if(bg2) bg2.style.backgroundPositionX = Math.floor(d.bgScroll * 0.5) + 'px'; 
    if(bg3) bg3.style.backgroundPositionX = Math.floor(d.bgScroll * 1.0) + 'px'; 

    // 2. Physics
    d.playerY += d.velocity;
    d.velocity -= 0.6; 
    if (d.playerY < 0) {
        d.playerY = 0;
        d.velocity = 0;
    }
    
    // 3. Player Animation & Sprite Management
    const playerEl = document.getElementById('jump-player');
    if (playerEl) {
        playerEl.style.bottom = Math.floor(d.playerY) + 'px';
        
        // SWITCH SPRITESHEET based on Powerup
        const spriteSheet = d.hasTrident ? 'images/minigames/pixeljump/tritonspritest.webp' : 'images/minigames/pixeljump/tritonsprites.webp';
        
        // Update URL only if changed (prevents flickering)
        if (!playerEl.style.backgroundImage.includes(spriteSheet)) {
            playerEl.style.backgroundImage = `url('${spriteSheet}')`;
        }
        
        // Animation Loop
        const totalFrames = 25;
        const cols = 5;
        const animFrame = Math.floor((d.frame / 5) % totalFrames);
        const col = animFrame % cols;
        const row = Math.floor(animFrame / cols);
        const bgX = col * 25; 
        const bgY = row * 25;

        if (d.playerY <= 0) {
             playerEl.style.backgroundPosition = `${bgX}% ${bgY}%`;
        } else {
             playerEl.style.backgroundPosition = "50% 0%"; 
        }
    }

    // 4. Spawn Logic
    let spawnRate = Math.max(40, 90 - Math.floor(d.score));
    
    // TRIDENT SPAWN LOGIC
    let spawnedTrident = false;
    if (d.score > 10 && !d.tridentCollected && !d.tridentActive) {
        if (d.tridentTimer <= 0) {
            d.tridentActive = true;
            spawnedTrident = true;
            const tri = document.createElement('div');
            tri.innerText = "🔱";
            tri.className = "absolute text-3xl transition-none z-10 animate-pulse";
            // Spawn HIGH (must jump to get it)
            tri.style.bottom = "50px"; 
            tri.style.left = "100%"; 
            tri.dataset.x = 100;
            tri.dataset.type = "trident";
            area.appendChild(tri);
            d.obstacles.push(tri);
        } else {
            d.tridentTimer--;
        }
    }
    
    // OBSTACLE SPAWN LOGIC (Only if trident didn't just spawn)
    if (!spawnedTrident && d.frame % spawnRate === 0) { 
        const obs = document.createElement('div');
        obs.className = "absolute transition-none z-10 flex items-end justify-center";
        obs.style.bottom = "0px";
        obs.style.left = "100%"; 
        obs.dataset.x = 100; 
        obs.dataset.type = "enemy";
        obs.dataset.passed = "false";
        
        // Randomize between Classic Emojis and New Car Images
        const isCar = Math.random() > 0.6; // 40% chance for a car obstacle
        if (isCar) {
            const carImages = ["images/minigames/pixeljump/prius.webp", "images/minigames/pixeljump/rav.webp"];
            const imgSrc = carImages[Math.floor(Math.random() * carImages.length)];
            // Load the image inside the div, scaling the height to match standard obstacles
            obs.innerHTML = `<img src="${imgSrc}" class="h-8 w-auto object-contain drop-shadow-md">`;
        } else {
            const types = ["🔥", "🌵", "🧱", "🐍"];
            obs.innerText = types[Math.floor(Math.random() * types.length)];
            obs.classList.add("text-2xl");
        }

        area.appendChild(obs);
        d.obstacles.push(obs);
    }

    // 5. Move & Collision
    for (let i = 0; i < d.obstacles.length; i++) {
        let obs = d.obstacles[i];
        let x = parseFloat(obs.dataset.x);
        let speed = 1.0 + (d.score * 0.03);
        x -= speed;
        obs.dataset.x = x;
        obs.style.left = x + '%';

        // Collision Zone (Player is at ~10% Left)
        if (x > 8 && x < 15) {
            
            // Check based on Type
            if (obs.dataset.type === "trident") {
                // COLLECT TRIDENT
                if (d.playerY > 20 && Math.abs(d.playerY - 50) < 30) {
                    d.hasTrident = true;
                    d.tridentCollected = true;
                    d.tridentActive = false;
                    obs.remove();
                    d.obstacles.splice(i, 1);
                    i--;
                    
                    // Play Item Collection SFX
                    if (d.itemAudio) {
                        let sfx = d.itemAudio.cloneNode();
                        sfx.volume = 0.6;
                        sfx.play().catch(()=>{});
                    }
                    
                    continue; 
                }
            } 
            else if (obs.dataset.type === "enemy") {
                // HIT ENEMY
                if (d.playerY < 25) {
                    if (d.hasTrident) {
                        // ARMOR BREAK
                        d.hasTrident = false;
                        
                        // Clear image or text and replace with explosion emoji
                        obs.innerHTML = "💥"; 
                        obs.classList.add('text-2xl');
                        obs.remove();
                        d.obstacles.splice(i, 1);
                        i--;
                    } else {
                        // GAME OVER
                        window.finishPixelJump(false, "You hit an obstacle!");
                        return;
                    }
                }
            }
        }

        // Scoring (Only enemies count)
        if (obs.dataset.type === "enemy" && x < 5 && obs.dataset.passed === "false") {
            d.score++;
            obs.dataset.passed = "true";
        }

        // Cleanup
        if (x < -10) {
            // Check if we missed the trident
            if (obs.dataset.type === "trident") {
                d.tridentActive = false;
                d.tridentTimer = Math.floor(Math.random() * 240);
            }
            obs.remove();
            d.obstacles.splice(i, 1);
            i--;
        }
    }

    // 6. Update Progress Bar
    let progress = Math.min(100, (d.score / 40) * 100);
    const bar = document.getElementById('jump-progress');
    if (bar) {
        bar.style.width = progress + '%';
        // Make bar gold if powered up
        bar.className = d.hasTrident 
            ? "h-full bg-yellow-400 transition-all duration-100"
            : "h-full bg-indigo-500 transition-all duration-100";
    }

    // 7. Win Condition
    if (d.score >= 40) {
        window.finishPixelJump(true);
    }
};