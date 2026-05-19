// --- SUPER PADDLEBALL MINIGAME ---

window.superPaddleData = { 
    gameActive: false,
    animId: null,
    ctx: null,
    canvas: null,
    score: 0, 
    lives: 3,
    frame: 0,
    
    // Physics Objects
    ball: { x: 150, y: 150, vx: 3, vy: -3, size: 8 },
    paddle: { x: 150, targetX: 150, y: 350, w: 60, h: 10, baseW: 60 },
    
    // Arrays
    powerups: [],
    particles: [],
    
    // Active Buffs
    buffs: {
        wide: 0,
        multi: 0,
        slow: 0
    },
    
    // Audio
    bgmAudio: null,
    padHitAudio: null,
    wallHitAudio: null,
    getAudio: null
};

window.startSuperPaddleGame = function() {
    if (state.energy < 20) {
        window.queueModal("Too Tired", "You need 20 Energy to focus on a retro game.", "Okay", "💤");
        return;
    }

    document.getElementById('modal-overlay').classList.add('hidden');
    
    // Audio hooks
    if (typeof window.pauseMainBGM === 'function') window.pauseMainBGM();
    
    let bgm = new Audio('audio/superpaddle/paddlesong.ogg');
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play().catch(e => console.warn("Audio blocked:", e));

    // Reset Data
    window.superPaddleData = { 
        gameActive: true, animId: null, ctx: null, canvas: null,
        score: 0, lives: 3, frame: 0,
        ball: { x: 150, y: 150, vx: 3, vy: -5, size: 8 },
        paddle: { x: 150, targetX: 150, y: 350, w: 60, h: 10, baseW: 60 },
        powerups: [], particles: [],
        buffs: { wide: 0, multi: 0, slow: 0 },
        bgmAudio: bgm,
        padHitAudio: new Audio('audio/superpaddle/padhit.ogg'),
        wallHitAudio: new Audio('audio/superpaddle/wall.ogg'),
        getAudio: new Audio('audio/superpaddle/get.ogg')
    };

    const gameHtml = `
        <div class="max-w-md mx-auto py-2 select-none">
            <h1 class="text-2xl font-black text-acs-gold mb-1 uppercase tracking-widest leading-none text-center">SUPER PADDLEBALL</h1>
            
            <div class="flex justify-between items-center mb-2 px-2">
                <div class="text-xs font-bold text-purple-400 flex items-center gap-2">
                    SCORE: <span id="sp-score" class="text-white">0</span>
                    <span id="sp-multi" class="hidden text-[10px] bg-yellow-500 text-black px-1 rounded font-black animate-pulse">2X</span>
                </div>
                <div id="sp-lives" class="text-lg">❤️❤️❤️</div>
            </div>

            <div class="relative bg-slate-950 rounded-xl border-4 border-slate-700 overflow-hidden cursor-none mx-auto shadow-inner" style="width: 300px; height: 400px;">
                <canvas id="super-paddle-canvas" width="300" height="400" class="w-full h-full block" style="image-rendering: pixelated;"
                    onmousemove="window.moveSuperPaddle(event)"
                    ontouchstart="event.preventDefault(); window.moveSuperPaddleTouch(event);"
                    ontouchmove="event.preventDefault(); window.moveSuperPaddleTouch(event);">
                </canvas>
                <!-- Retro Scanlines -->
                <div class="absolute inset-0 pointer-events-none opacity-20" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px);"></div>
                
                <!-- Start Overlay -->
                <div id="sp-start-overlay" class="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                    <div class="text-white font-black text-2xl tracking-widest animate-pulse drop-shadow-md">GET READY</div>
                </div>
            </div>
            
            <div class="text-center mt-3 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Drag to move.<br>Don't let the ball drop!
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            const canvas = document.getElementById('super-paddle-canvas');
            if (canvas) {
                window.superPaddleData.canvas = canvas;
                window.superPaddleData.ctx = canvas.getContext('2d', { alpha: false });
                
                // Initial Draw
                window.drawSuperPaddle();
            }

            // Cleanup Hook
            const originalFinish = typeof window.finishConsoleGame === 'function' ? window.finishConsoleGame : null;
            window.finishConsoleGame = function() {
                if (originalFinish) originalFinish();
            };

            setTimeout(() => {
                const overlay = document.getElementById('sp-start-overlay');
                if (overlay) overlay.remove();
                if (window.superPaddleData.gameActive) {
                    window.superPaddleData.animId = requestAnimationFrame(window.superPaddleLoop);
                }
            }, 1500);
        }
    });
    window.processModalQueue();
};

window.moveSuperPaddle = function(e) {
    if (!window.superPaddleData.gameActive) return;
    const canvas = window.superPaddleData.canvas;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let x = (e.clientX - rect.left) * scaleX;
    
    // Clamp target to screen
    window.superPaddleData.paddle.targetX = Math.max(0, Math.min(canvas.width, x));
};

window.moveSuperPaddleTouch = function(e) {
    if (e.touches && e.touches.length > 0) {
        window.moveSuperPaddle(e.touches[0]);
    }
};

window.superPaddleLoop = function() {
    if (!window.superPaddleData.gameActive) return;
    
    window.updateSuperPaddle();
    window.drawSuperPaddle();
    
    window.superPaddleData.animId = requestAnimationFrame(window.superPaddleLoop);
};

window.updateSuperPaddle = function() {
    const d = window.superPaddleData;
    if (!d.canvas || !d.ctx) return; // Safety check
    
    d.frame++;

    // --- BUFF TIMERS ---
    if (d.buffs.wide > 0) {
        d.buffs.wide--;
        d.paddle.w = d.paddle.baseW * 1.8;
    } else {
        d.paddle.w = d.paddle.baseW;
    }

    const multiEl = document.getElementById('sp-multi');
    if (d.buffs.multi > 0) {
        d.buffs.multi--;
        if (multiEl) multiEl.classList.remove('hidden');
    } else {
        if (multiEl) multiEl.classList.add('hidden');
    }

    if (d.buffs.slow > 0) d.buffs.slow--;

    // --- PADDLE MOVEMENT ---
    // Smooth lerp for paddle to match mouse, giving it a bit of "weight"
    d.paddle.x += (d.paddle.targetX - d.paddle.x) * 0.4;
    // Clamp
    d.paddle.x = Math.max(d.paddle.w/2, Math.min(d.canvas.width - d.paddle.w/2, d.paddle.x));

    // --- BALL PHYSICS ---
    let gravity = d.buffs.slow > 0 ? 0.08 : 0.15;
    let maxSpeedY = d.buffs.slow > 0 ? 6 : 9;

    d.ball.vy += gravity; // Pull ball down
    
    // Apply velocity
    d.ball.x += d.ball.vx;
    d.ball.y += d.ball.vy;

    // Ceiling Collision
    if (d.ball.y - d.ball.size/2 < 0) {
        d.ball.y = d.ball.size/2;
        d.ball.vy *= -0.8;
        if (d.wallHitAudio) {
            let sfx = d.wallHitAudio.cloneNode();
            sfx.volume = 0.4;
            sfx.play().catch(()=>{});
        }
    }
    // Wall Collisions
    if (d.ball.x - d.ball.size/2 < 0) {
        d.ball.x = d.ball.size/2;
        d.ball.vx *= -0.9;
        if (d.wallHitAudio) {
            let sfx = d.wallHitAudio.cloneNode();
            sfx.volume = 0.4;
            sfx.play().catch(()=>{});
        }
    } else if (d.ball.x + d.ball.size/2 > d.canvas.width) {
        d.ball.x = d.canvas.width - d.ball.size/2;
        d.ball.vx *= -0.9;
        if (d.wallHitAudio) {
            let sfx = d.wallHitAudio.cloneNode();
            sfx.volume = 0.4;
            sfx.play().catch(()=>{});
        }
    }

    // Paddle Collision
    // Check if ball is dropping and crossing the paddle's Y threshold
    if (d.ball.vy > 0 && d.ball.y + d.ball.size/2 >= d.paddle.y - d.paddle.h/2 && d.ball.y - d.ball.size/2 <= d.paddle.y + d.paddle.h/2) {
        // Check X alignment
        if (Math.abs(d.ball.x - d.paddle.x) < d.paddle.w/2 + d.ball.size/2) {
            
            // Base Bounce
            d.ball.vy = -Math.abs(d.ball.vy) * 1.05; // Slightly elastic
            
            // Add horizontal english based on where it hit the paddle
            let hitOffset = (d.ball.x - d.paddle.x) / (d.paddle.w / 2);
            d.ball.vx += hitOffset * 3.0; // Pushes it left or right
            
            // Cap Speeds
            d.ball.vy = Math.max(-maxSpeedY, d.ball.vy);
            d.ball.vx = Math.max(-6, Math.min(6, d.ball.vx));

            // Move ball above paddle to prevent getting stuck
            d.ball.y = d.paddle.y - d.paddle.h/2 - d.ball.size/2;

            // Score & Visuals
            let pts = d.buffs.multi > 0 ? 2 : 1;
            d.score += pts;
            const scoreEl = document.getElementById('sp-score');
            if (scoreEl) scoreEl.innerText = d.score;
            
            // Paddle hit audio
            if (d.padHitAudio) {
                let sfx = d.padHitAudio.cloneNode();
                sfx.volume = 0.5;
                sfx.play().catch(()=>{});
            }

            // Paddle hit particles
            window.explodeSP(d.ball.x, d.paddle.y - 5, '#ffffff', 5);
        }
    }

    // Floor Collision (Life Lost)
    if (d.ball.y > d.canvas.height + 20) {
        d.lives--;
        window.explodeSP(d.ball.x, d.canvas.height, '#ef4444', 20); // Big red explosion
        
        // Update UI
        const livesStr = "❤️".repeat(Math.max(0, d.lives));
        const livesEl = document.getElementById('sp-lives');
        if (livesEl) livesEl.innerText = livesStr;

        if (d.lives <= 0) {
            window.finishSuperPaddle();
            return;
        } else {
            // Reset ball
            d.ball.x = d.paddle.x;
            d.ball.y = 100;
            d.ball.vx = (Math.random() > 0.5 ? 2 : -2);
            d.ball.vy = -2;
            
            // Screen shake
            if (d.canvas) {
                d.canvas.classList.add('translate-y-2');
                setTimeout(() => { if(d.canvas) d.canvas.classList.remove('translate-y-2'); }, 100);
            }
        }
    }

    // --- POWERUPS ---
    // Spawn Powerups (Random chance)
    if (d.frame % 180 === 0 && Math.random() < 0.4) {
        const types = [
            { type: 'wide', color: '#3b82f6', text: 'W' }, // Blue
            { type: 'multi', color: '#eab308', text: 'x2' }, // Gold
            { type: 'slow', color: '#22c55e', text: 'S' }, // Green
            { type: 'life', color: '#ef4444', text: '1UP' } // Red (Rarer)
        ];
        
        let pool = [...types, types[0], types[1], types[2]]; // Dilute life chance
        let sel = pool[Math.floor(Math.random() * pool.length)];

        d.powerups.push({
            x: 20 + Math.random() * (d.canvas.width - 40),
            y: -20,
            vy: 1.5,
            ...sel
        });
    }

    // Move & Collect Powerups
    for (let i = 0; i < d.powerups.length; i++) {
        let p = d.powerups[i];
        p.y += p.vy;

        // Collision with paddle
        if (p.y + 10 >= d.paddle.y - d.paddle.h/2 && p.y - 10 <= d.paddle.y + d.paddle.h/2) {
            if (Math.abs(p.x - d.paddle.x) < d.paddle.w/2 + 10) {
                // Collected!
                window.explodeSP(p.x, p.y, p.color, 15);
                
                // Powerup get audio
                if (d.getAudio) {
                    let sfx = d.getAudio.cloneNode();
                    sfx.volume = 0.5;
                    sfx.play().catch(()=>{});
                }
                
                if (p.type === 'wide') d.buffs.wide = 600; // 10 seconds (60fps)
                if (p.type === 'multi') d.buffs.multi = 600;
                if (p.type === 'slow') d.buffs.slow = 400;
                if (p.type === 'life') {
                    d.lives = Math.min(5, d.lives + 1);
                    const livesEl = document.getElementById('sp-lives');
                    if (livesEl) livesEl.innerText = "❤️".repeat(d.lives);
                }

                d.powerups.splice(i, 1);
                i--;
                continue;
            }
        }

        // Missed
        if (p.y > d.canvas.height + 20) {
            d.powerups.splice(i, 1);
            i--;
        }
    }

    // --- PARTICLES ---
    for (let i = 0; i < d.particles.length; i++) {
        let p = d.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) { d.particles.splice(i, 1); i--; }
    }
};

window.drawSuperPaddle = function() {
    const d = window.superPaddleData;
    const ctx = d.ctx;
    if (!ctx) return; // Safety check

    // Background
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, d.canvas.width, d.canvas.height);

    // Draw String (Tension visual)
    ctx.beginPath();
    ctx.moveTo(d.paddle.x, d.paddle.y);
    // Add a slight curve/sag to the string based on horizontal distance
    let sag = Math.abs(d.paddle.x - d.ball.x) * 0.2;
    ctx.quadraticCurveTo(
        (d.paddle.x + d.ball.x) / 2, 
        (d.paddle.y + d.ball.y) / 2 + sag, 
        d.ball.x, 
        d.ball.y
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569'; // Slate 600
    ctx.stroke();

    // Draw Particles
    for (let p of d.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1.0;

    // Draw Powerups
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "12px monospace";
    for (let p of d.powerups) {
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x - 10, p.y - 10, 20, 20);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.fillText(p.text, p.x, p.y);
    }

    // Draw Paddle
    ctx.fillStyle = d.buffs.wide > 0 ? '#38bdf8' : '#fbbf24'; // Blue if wide, else Gold
    ctx.shadowBlur = 8;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fillRect(d.paddle.x - d.paddle.w/2, d.paddle.y - d.paddle.h/2, d.paddle.w, d.paddle.h);
    
    // Paddle Core (Detail)
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 0;
    ctx.fillRect(d.paddle.x - (d.paddle.w/2 - 4), d.paddle.y - 1, d.paddle.w - 8, 2);

    // Draw Ball
    ctx.fillStyle = d.buffs.multi > 0 ? '#eab308' : '#ef4444'; // Gold if multi, else Red
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.fillStyle;
    
    // Pixelated circle approximation
    let r = d.ball.size;
    ctx.fillRect(d.ball.x - r, d.ball.y - r/2, r*2, r);
    ctx.fillRect(d.ball.x - r/2, d.ball.y - r, r, r*2);
    ctx.shadowBlur = 0;
};

// Particle Helper
window.explodeSP = function(x, y, color, count) {
    if (!window.superPaddleData.gameActive) return;
    for(let i=0; i<count; i++) {
        let angle = Math.random() * Math.PI * 2;
        let spd = Math.random() * 4 + 1;
        window.superPaddleData.particles.push({
            x: x, y: y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            life: 1.0,
            color: color
        });
    }
};

window.finishSuperPaddle = function() {
    window.superPaddleData.gameActive = false;
    if (window.superPaddleData.animId) cancelAnimationFrame(window.superPaddleData.animId);
    document.getElementById('modal-overlay').classList.add('hidden');

    // Clean up audio
    if (window.superPaddleData.bgmAudio) {
        window.superPaddleData.bgmAudio.pause();
        window.superPaddleData.bgmAudio.currentTime = 0;
    }
    if (typeof window.resumeMainBGM === 'function') window.resumeMainBGM();

    const score = window.superPaddleData.score;
    
    // Apply Stats (Every 5 points = 1% stress relief, capped at 60%)
    const relief = Math.min(60, Math.floor(score / 5));
    const energyCost = 20;

    state.energy = Math.max(0, state.energy - energyCost);
    state.dayStats.energy -= energyCost;
    state.stress = Math.max(0, state.stress - relief);
    state.dayStats.stress -= relief;
    state.hasPlayedConsole = true; // Acts as a console game now!

    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
        <div class="text-red-400 flex justify-between"><span>Energy Cost</span><span>-${energyCost}%</span></div>
        <div class="text-purple-400 flex justify-between"><span>Total Hits</span><span>${score}</span></div>
        <div class="text-green-400 flex justify-between"><span>Stress Relief</span><span>-${relief}%</span></div>
    </div>`;
    
    setTimeout(() => {
        window.queueModal("GAME OVER", "The ball dropped.", "GG", "🏓", () => window.updateUI());
    }, 100);
};