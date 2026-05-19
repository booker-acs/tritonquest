// ==========================================
// DESKTOP DEFENDER (Raiden Style Shooter)
// ==========================================

window.startDefenderGame = function() {
    if (state.energy < 20) {
        window.queueModal("Too Tired", "You need 20 Energy to focus on a fast-paced shooter.", "Okay", "💤");
        return;
    }

    document.getElementById('modal-overlay').classList.add('hidden');

    // Pause global background music if the helper exists
    if (typeof window.pauseMainBGM === 'function') window.pauseMainBGM();

    // Generate Parallax Digital Rain (Matrix Style)
    let stars = [];
    for(let i=0; i<75; i++) { 
        stars.push({
            x: Math.random() * 300,
            y: Math.random() * 400,
            speed: 1 + Math.random() * 3, 
            size: 10 + Math.random() * 10 
        });
    }

    // Pre-load Player Ship Images
    let shipImgs = [];
    for (let i = 1; i <= 3; i++) {
        let img = new Image();
        img.src = `images/minigames/defender/ship${i}.png`;
        shipImgs.push(img);
    }

    // Pre-load Thruster Images
    let thrustImgs = [];
    for (let i = 1; i <= 4; i++) {
        let img = new Image();
        img.src = `images/minigames/defender/thrust${i}.png`;
        thrustImgs.push(img);
    }

    // Pre-load Enemy Images
    let enemyImgs = {
        grunt: new Image(),
        weaver: new Image(),
        bruiser: new Image()
    };
    enemyImgs.grunt.src = 'images/minigames/defender/grunt.webp';
    enemyImgs.weaver.src = 'images/minigames/defender/weaver.webp';
    enemyImgs.bruiser.src = 'images/minigames/defender/bruiser.webp';

    // --- AUDIO SETUP ---
    let bgm = new Audio('audio/defender/defender.ogg');
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play().catch(e => console.warn("Audio blocked:", e));

    window.consoleData = { 
        score: 0, 
        playerX: 150, 
        playerY: 350,
        targetX: 150,
        targetY: 350,
        keys: { up: false, down: false, left: false, right: false },
        usingMouse: false,
        isShooting: false,
        lastShotFrame: 0,
        weaponLevel: 1, // Max 3
        invulnFrames: 0,
        enemies: [], 
        projectiles: [],
        enemyProjectiles: [],
        powerups: [],
        particles: [],
        stars: stars,
        shipImages: shipImgs,
        thrustImages: thrustImgs,
        enemyImages: enemyImgs,
        // Audio objects
        bgmAudio: bgm,
        lazerAudio: new Audio('audio/defender/lazer.ogg'),
        explodeAudio: new Audio('audio/defender/explode.ogg'),
        alertAudio: new Audio('audio/defender/alert.ogg'),
        lives: 3,
        gameActive: true, 
        interval: null, 
        frame: 0 
    };

    const gameHtml = `
        <div class="max-w-md mx-auto py-2 select-none">
            <h1 class="text-2xl font-black text-acs-gold mb-1 uppercase tracking-widest leading-none text-center">Desktop Defender</h1>
            
            <div class="flex justify-between items-center mb-2 px-2">
                <div class="text-xs font-bold text-purple-400">SCORE: <span id="console-score" class="text-white">0</span></div>
                <div id="console-lives" class="text-lg">❤️❤️❤️</div>
            </div>

            <div class="relative bg-slate-950 rounded-xl border-4 border-slate-700 overflow-hidden cursor-crosshair mx-auto shadow-inner" style="width: 300px; height: 400px;">
                <canvas id="shooter-canvas" width="300" height="400" class="w-full h-full block" 
                    onmousedown="window.consoleData.isShooting = true; window.consoleData.usingMouse = true;" 
                    onmouseup="window.consoleData.isShooting = false" 
                    onmouseleave="window.consoleData.isShooting = false"
                    ontouchstart="(e)=>{e.preventDefault(); window.consoleData.isShooting = true; window.consoleData.usingMouse = true; window.updateShooterTarget(e);}"
                    ontouchend="window.consoleData.isShooting = false"
                    ontouchmove="(e)=>{e.preventDefault(); window.updateShooterTarget(e);}">
                </canvas>
                <!-- Scanlines -->
                <div class="absolute inset-0 pointer-events-none opacity-20" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px);"></div>
            </div>
            
            <div class="text-center mt-3 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Hold Click/Space to Auto-Fire.<br>Drag or use Arrow Keys to move.
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            const canvas = document.getElementById('shooter-canvas');
            const ctx = canvas.getContext('2d');
            
            // Mouse/Touch Tracking
            window.updateShooterTarget = function(e) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                
                let clientX = e.clientX;
                let clientY = e.clientY;
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }

                window.consoleData.targetX = (clientX - rect.left) * scaleX;
                window.consoleData.targetY = (clientY - rect.top) * scaleY;
                window.consoleData.usingMouse = true;
            };

            canvas.addEventListener('mousemove', window.updateShooterTarget);

            // Keyboard Listeners
            const handleKeyDown = (e) => {
                const d = window.consoleData;
                const k = e.key.toLowerCase();
                if (k === 'arrowup' || k === 'w') { d.keys.up = true; d.usingMouse = false; }
                if (k === 'arrowdown' || k === 's') { d.keys.down = true; d.usingMouse = false; }
                if (k === 'arrowleft' || k === 'a') { d.keys.left = true; d.usingMouse = false; }
                if (k === 'arrowright' || k === 'd') { d.keys.right = true; d.usingMouse = false; }
                if (k === ' ') { e.preventDefault(); d.isShooting = true; }
            };
            const handleKeyUp = (e) => {
                const d = window.consoleData;
                const k = e.key.toLowerCase();
                if (k === 'arrowup' || k === 'w') d.keys.up = false;
                if (k === 'arrowdown' || k === 's') d.keys.down = false;
                if (k === 'arrowleft' || k === 'a') d.keys.left = false;
                if (k === 'arrowright' || k === 'd') d.keys.right = false;
                if (k === ' ') { e.preventDefault(); d.isShooting = false; }
            };

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            
            // Cleanup Key Listener on Close
            const originalFinish = window.finishConsoleGame;
            window.finishConsoleGame = function() {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                if (originalFinish) originalFinish();
            };

            window.consoleData.interval = setInterval(() => {
                if (!window.consoleData.gameActive) return;
                window.updateConsoleGame(ctx, canvas);
            }, 16); // ~60fps
        }
    });
    window.processModalQueue();
};

window.updateConsoleGame = function(ctx, canvas) {
    const d = window.consoleData;
    d.frame++;
    if (d.invulnFrames > 0) d.invulnFrames--;

    // 1. Move Player
    if (d.usingMouse) {
        // Smooth Lerp to mouse
        d.playerX += (d.targetX - d.playerX) * 0.15;
        d.playerY += (d.targetY - d.playerY) * 0.15;
    } else {
        // Keyboard movement
        let speed = 4.5;
        if (d.keys.left) d.playerX -= speed;
        if (d.keys.right) d.playerX += speed;
        if (d.keys.up) d.playerY -= speed;
        if (d.keys.down) d.playerY += speed;
    }

    // Clamp to screen
    d.playerX = Math.max(15, Math.min(canvas.width - 15, d.playerX));
    d.playerY = Math.max(15, Math.min(canvas.height - 15, d.playerY));

    // 2. Auto-Fire
    if (d.isShooting && d.frame > d.lastShotFrame + 8) {
        d.lastShotFrame = d.frame;
        
        // Play SFX (Clone node allows rapid overlapping playback)
        if (d.lazerAudio) {
            let sfx = d.lazerAudio.cloneNode();
            sfx.volume = 0.15; // Slightly quieter so it doesn't overwhelm the mix
            sfx.play().catch(()=>{});
        }

        // Weapon Logic
        if (d.weaponLevel === 1) {
            d.projectiles.push({ x: d.playerX, y: d.playerY - 10, vx: 0, vy: -12, color: '#fbbf24' });
        } else if (d.weaponLevel === 2) {
            d.projectiles.push({ x: d.playerX - 8, y: d.playerY - 10, vx: 0, vy: -12, color: '#fbbf24' });
            d.projectiles.push({ x: d.playerX + 8, y: d.playerY - 10, vx: 0, vy: -12, color: '#fbbf24' });
        } else {
            // Spread shot
            d.projectiles.push({ x: d.playerX, y: d.playerY - 10, vx: 0, vy: -12, color: '#38bdf8' });
            d.projectiles.push({ x: d.playerX - 10, y: d.playerY - 5, vx: -2, vy: -11, color: '#38bdf8' });
            d.projectiles.push({ x: d.playerX + 10, y: d.playerY - 5, vx: 2, vy: -11, color: '#38bdf8' });
        }
    }

    // 3. Spawn Enemies
    // Spawns get faster as score increases
    let spawnRate = Math.max(20, 60 - Math.floor(d.score / 50)); 
    
    if (d.frame % spawnRate === 0) {
        let rand = Math.random();
        let type, icon, hp, speed;

        if (d.score > 300 && rand < 0.15) {
            // Bruiser
            type = 'bruiser'; icon = '👹'; hp = 5; speed = 0.8;
        } else if (d.score > 100 && rand < 0.4) {
            // Weaver
            type = 'weaver'; icon = '🛸'; hp = 2; speed = 2.5;
        } else {
            // Grunt
            type = 'grunt'; icon = '👾'; hp = 1; speed = 2.0;
        }

        d.enemies.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: -20,
            type: type,
            icon: icon,
            hp: hp,
            speed: speed + (d.score * 0.001), // Scale speed slightly
            tick: 0
        });
    }

    // --- DRAWING ---

    // Clear Background
    ctx.fillStyle = '#020617'; // Deep dark blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Parallax Digital Rain
    const matrixChars = "0123456789!@#$%^&*()_+-=[]{}|;':\",.<>/?~";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    d.stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height + 20) {
            s.y = -20;
            s.x = Math.random() * canvas.width;
        }
        
        ctx.globalAlpha = Math.min(1, s.speed / 4); // Depth shading
        ctx.fillStyle = '#22c55e'; // Bright matrix green
        ctx.font = Math.floor(s.size) + "px monospace";
        
        // Randomly pick a new character every frame for a glitched look
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(char, s.x, s.y);
    });
    ctx.globalAlpha = 1.0;

    // Helper: Generate Explosion Particles
    const explode = (x, y, color, count) => {
        for(let i=0; i<count; i++) {
            let angle = Math.random() * Math.PI * 2;
            let spd = Math.random() * 3 + 1;
            d.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 1.0,
                color: color
            });
        }
    };

    // Update & Draw Particles
    for (let i = 0; i < d.particles.length; i++) {
        let p = d.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        
        if (p.life <= 0) { d.particles.splice(i, 1); i--; }
    }
    ctx.globalAlpha = 1.0;

    // Update & Draw Powerups (P)
    ctx.font = "16px 'CustomEmoji', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < d.powerups.length; i++) {
        let p = d.powerups[i];
        p.y += 1.5;
        
        // Bouncing animation
        ctx.fillText("🌟", p.x, p.y + Math.sin(d.frame * 0.1) * 5);
        
        // Catch Powerup
        if (Math.hypot(p.x - d.playerX, p.y - d.playerY) < 25) {
            d.weaponLevel = Math.min(3, d.weaponLevel + 1);
            d.score += 50;
            document.getElementById('console-score').innerText = d.score;
            explode(p.x, p.y, '#fde047', 10);
            d.powerups.splice(i, 1);
            i--;
            continue;
        }

        if (p.y > canvas.height + 20) { d.powerups.splice(i, 1); i--; }
    }

    // Update & Draw Player Projectiles
    for (let i = 0; i < d.projectiles.length; i++) {
        let p = d.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        ctx.fillStyle = p.color;
        // Add a slight glow
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x - 2, p.y, 4, 12);
        ctx.shadowBlur = 0;

        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) { d.projectiles.splice(i, 1); i--; }
    }

    // Update & Draw Enemies + Enemy Projectiles
    ctx.font = "24px 'CustomEmoji', Arial, sans-serif"; // Emoji size (fallback)
    for (let i = 0; i < d.enemies.length; i++) {
        let e = d.enemies[i];
        
        // AI Movement
        if (e.type === 'grunt') {
            e.y += e.speed;
        } else if (e.type === 'weaver') {
            e.y += e.speed;
            e.x += Math.sin(e.tick * 0.1) * 4;
        } else if (e.type === 'bruiser') {
            e.y += e.speed;
            // Bruiser aimed shooting
            if (e.tick % 70 === 0 && e.y < canvas.height - 100) {
                let angle = Math.atan2(d.playerY - e.y, d.playerX - e.x);
                d.enemyProjectiles.push({ x: e.x, y: e.y + 10, vx: Math.cos(angle)*4, vy: Math.sin(angle)*4 });
            }
        }
        e.tick++;

        // Draw Enemy
        let eImg = d.enemyImages[e.type];
        if (eImg && eImg.complete && eImg.naturalWidth > 0) {
            // Give bruisers a larger footprint
            let size = e.type === 'bruiser' ? 48 : 32;
            ctx.drawImage(eImg, e.x - size/2, e.y - size/2, size, size);
        } else {
            // Fallback to emoji if image hasn't loaded
            ctx.fillText(e.icon, e.x, e.y);
        }

        // Check Hit by Player Projectile
        let hit = false;
        for (let j = 0; j < d.projectiles.length; j++) {
            let p = d.projectiles[j];
            if (Math.abs(e.x - p.x) < 20 && Math.abs(e.y - p.y) < 20) {
                e.hp--;
                d.projectiles.splice(j, 1); // Remove Shot
                j--;
                
                // Small particle flash on hit
                explode(p.x, p.y, '#ffffff', 3);

                if (e.hp <= 0) {
                    hit = true;
                    // Score
                    let pts = e.type === 'bruiser' ? 50 : (e.type === 'weaver' ? 20 : 10);
                    d.score += pts;
                    document.getElementById('console-score').innerText = d.score;
                    
                    // Explosion SFX
                    if (d.explodeAudio) {
                        let sfx = d.explodeAudio.cloneNode();
                        sfx.volume = 0.3;
                        sfx.play().catch(()=>{});
                    }

                    // Explosion Particles
                    explode(e.x, e.y, e.type === 'bruiser' ? '#dc2626' : '#a855f7', 15);
                    
                    // Powerup Drop Logic (10% chance, or 30% for bruiser)
                    let dropChance = e.type === 'bruiser' ? 0.3 : 0.08;
                    if (Math.random() < dropChance) {
                        d.powerups.push({ x: e.x, y: e.y });
                    }

                    d.enemies.splice(i, 1); // Kill Enemy
                    i--; 
                    break; 
                }
            }
        }

        if (hit) continue; // Skip to next enemy if this one died

        // Collision with Player (Crash)
        if (d.invulnFrames <= 0 && i >= 0 && Math.abs(e.x - d.playerX) < 20 && Math.abs(e.y - d.playerY) < 20) {
            explode(e.x, e.y, '#ef4444', 20);
            d.enemies.splice(i, 1);
            i--;
            window.playerHit();
            continue;
        }

        // Remove off-screen
        if (i >= 0 && e.y > canvas.height + 30) {
            d.enemies.splice(i, 1);
            i--;
        }
    }

    // Enemy Projectiles
    ctx.fillStyle = '#ef4444'; // Red bullets
    for (let i = 0; i < d.enemyProjectiles.length; i++) {
        let ep = d.enemyProjectiles[i];
        ep.x += ep.vx || 0;
        ep.y += ep.vy || 4; // Fallback to straight down
        
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collision with Player
        if (d.invulnFrames <= 0 && Math.abs(ep.x - d.playerX) < 12 && Math.abs(ep.y - d.playerY) < 12) {
             explode(ep.x, ep.y, '#ef4444', 10);
             d.enemyProjectiles.splice(i, 1);
             i--;
             window.playerHit();
             continue;
        }
        
        if (i >= 0 && (ep.y > canvas.height || ep.x < 0 || ep.x > canvas.width)) {
            d.enemyProjectiles.splice(i, 1);
            i--;
        }
    }

    // 7. Draw Player Ship
    if (d.lives > 0) {
        // Blink if invulnerable
        if (d.invulnFrames <= 0 || d.frame % 10 < 5) {
            
            // Calculate Damage State (3 lives = ship1, 2 = ship2, 1 = ship3)
            let shipIndex = 3 - d.lives; 
            shipIndex = Math.max(0, Math.min(2, shipIndex)); // Clamp between 0 and 2 for safety
            let shipImg = d.shipImages[shipIndex];
            
            // Calculate Thruster Animation Frame (Loops 0-3)
            let thrustIndex = Math.floor(d.frame / 5) % 4; 
            let thrustImg = d.thrustImages[thrustIndex];

            let size = 40; // Base rendering width/height

            // Draw Thruster (Behind the ship and slightly offset downwards)
            if (thrustImg && thrustImg.complete && thrustImg.naturalWidth > 0) {
                ctx.drawImage(thrustImg, d.playerX - size/2, d.playerY -8, size, size * 0.8);
            }

            // Draw Main Ship Body
            if (shipImg && shipImg.complete && shipImg.naturalWidth > 0) {
                ctx.drawImage(shipImg, d.playerX - size/2, d.playerY - size/2, size, size);
            } else {
                // Fallback if images are missing or slow to load
                ctx.font = "28px 'CustomEmoji', Arial, sans-serif";
                ctx.fillText("🚀", d.playerX, d.playerY);
            }
        }
    }
};

window.playerHit = function() {
    const d = window.consoleData;
    d.lives--;
    d.invulnFrames = 90; // 1.5 seconds of invulnerability
    
    // Play Damage Alert SFX
    if (d.alertAudio) {
        let sfx = d.alertAudio.cloneNode();
        sfx.volume = 0.6;
        sfx.play().catch(()=>{});
    }

    // Weapon downgrade penalty
    d.weaponLevel = Math.max(1, d.weaponLevel - 1);
    
    // Screen Shake Effect
    const canvas = document.getElementById('shooter-canvas');
    if (canvas) {
        canvas.classList.add('translate-x-2', 'translate-y-2');
        setTimeout(() => canvas.classList.remove('translate-x-2', 'translate-y-2'), 50);
        setTimeout(() => canvas.classList.add('-translate-x-2', '-translate-y-2'), 100);
        setTimeout(() => canvas.classList.remove('-translate-x-2', '-translate-y-2'), 150);
    }

    // Visual Update
    const livesStr = "❤️".repeat(Math.max(0, d.lives));
    document.getElementById('console-lives').innerText = livesStr;

    if (d.lives <= 0) {
        window.finishConsoleGame();
    }
};

window.finishConsoleGame = function() {
    const d = window.consoleData;
    d.gameActive = false;
    clearInterval(d.interval);
    document.getElementById('modal-overlay').classList.add('hidden');

    // --- AUDIO CLEANUP ---
    if (d.bgmAudio) {
        d.bgmAudio.pause();
        d.bgmAudio.currentTime = 0;
    }
    // Resume standard dashboard music
    if (typeof window.resumeMainBGM === 'function') window.resumeMainBGM();

    // Score is converted directly into stress relief
    // Cap relief to avoid instantly clearing all stress
    const relief = Math.min(60, Math.floor(d.score / 15)); 
    
    // Apply Stats
    state.energy -= 20;
    state.dayStats.energy -= 20;
    state.stress = Math.max(0, state.stress - relief);
    state.dayStats.stress -= relief;
    state.hasPlayedConsole = true;

    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
        <div class="text-red-400 flex justify-between"><span>Energy Cost</span><span>-20%</span></div>
        <div class="text-purple-400 flex justify-between"><span>Final Score</span><span>${d.score}</span></div>
        <div class="text-green-400 flex justify-between"><span>Stress Relief</span><span>-${relief}%</span></div>
    </div>`;
    
    setTimeout(() => {
        window.queueModal("GAME OVER", "You fought bravely against the alien horde." + html, "GG", "👾", () => window.updateUI());
    }, 100);
};

// Generic placeholder function for text-based games
window.playGenericConsoleGame = function(name, relief) {
    state.energy = Math.max(0, state.energy - 20);
    state.dayStats.energy -= 20;
    state.stress = Math.max(0, state.stress - relief);
    state.dayStats.stress -= relief;
    
    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
        <div class="text-red-400 flex justify-between"><span>Energy Cost</span><span>-20%</span></div>
        <div class="text-green-400 flex justify-between"><span>Stress Relief</span><span>-${relief}%</span></div>
    </div>`;
    
    window.queueModal("GAME OVER", `You played ${name} for a few hours. It was a blast!` + html, "Done", "👾", () => window.updateUI());
};