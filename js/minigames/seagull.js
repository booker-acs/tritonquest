// --- DAILY EVENT: SEAGULL ATTACK (REFLEX) ---
        window.seagullData = { timer: 8.0, spawnTimer: 0, birds: [], interval: null, gameActive: false };

        window.startSeagullEvent = function() {
            if (window.seagullData.interval) clearInterval(window.seagullData.interval);
            window.seagullData.timer = 8.0;
            window.seagullData.spawnTimer = 0;
            window.seagullData.birds = [];
            window.seagullData.gameActive = true;

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 relative h-full">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Seagull Attack!</h2>
                    <p class="text-slate-300 mb-4 text-sm">Protect your lunch! Click the birds!</p>
                    
                    <div id="seagull-timer" class="text-xl font-bold text-acs-gold mb-2">8.0s</div>

                    <div id="seagull-arena" class="bg-sky-200/20 rounded-3xl border-4 border-slate-700 h-64 relative overflow-hidden cursor-crosshair">
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl z-10 drop-shadow-md">🥪</div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.seagullData.interval = setInterval(window.updateSeagullGame, 50);
                }
            });
            window.processModalQueue();
        };

        window.renderSeagullGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center relative h-full">
                    <h1 class="text-5xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Seagull Attack!</h2>
                    <p class="text-slate-300 mb-4 text-sm">Protect your lunch! Click the birds before they grab it!</p>
                    
                    <div id="seagull-timer" class="text-xl font-bold text-acs-gold mb-2">8.0s</div>

                    <div id="seagull-arena" class="bg-sky-200/20 rounded-3xl border-4 border-slate-700 h-64 relative overflow-hidden cursor-crosshair">
                        <!-- The Lunch -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl z-10 drop-shadow-md">🥪</div>
                    </div>
                </div>
            `;
        };

        window.updateSeagullGame = function() {
            if (!window.seagullData.gameActive) return;

            // Timer Logic
            window.seagullData.timer -= 0.05;
            const timerEl = document.getElementById('seagull-timer');
            if (timerEl) timerEl.innerText = Math.max(0, window.seagullData.timer).toFixed(1) + 's';

            if (window.seagullData.timer <= 0) {
                window.finishSeagullGame(true);
                return;
            }

            // Spawning Logic
            window.seagullData.spawnTimer += 50;
            if (window.seagullData.spawnTimer > 800) { // Spawn every 0.8s
                window.spawnSeagull();
                window.seagullData.spawnTimer = 0;
            }

            // Movement Logic & Collision
            const arena = document.getElementById('seagull-arena');
            if (!arena) return;
            
            const birds = document.getElementsByClassName('seagull-target');
            const centerX = arena.offsetWidth / 2;
            const centerY = arena.offsetHeight / 2;

            for (let bird of birds) {
                let x = parseFloat(bird.dataset.x);
                let y = parseFloat(bird.dataset.y);
                
                // Move towards center
                const dx = centerX - x;
                const dy = centerY - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 20) { // Hit the sandwich
                    window.finishSeagullGame(false);
                    return;
                }

                const moveSpeed = 3; // Pixels per tick
                x += (dx / dist) * moveSpeed;
                y += (dy / dist) * moveSpeed;

                bird.dataset.x = x;
                bird.dataset.y = y;
                bird.style.left = (x - 15) + 'px'; // Center anchor adjustment
                bird.style.top = (y - 15) + 'px';
            }
        };

        window.spawnSeagull = function() {
            const arena = document.getElementById('seagull-arena');
            if (!arena) return;

            const bird = document.createElement('div');
            bird.innerText = '🦅'; // Changed to Eagle
            bird.className = 'seagull-target absolute text-3xl select-none transition-transform active:scale-50';
            
            // Random edge spawn
            const side = Math.floor(Math.random() * 4);
            let startX, startY;
            
            if (side === 0) { startX = Math.random() * arena.offsetWidth; startY = -30; } // Top
            else if (side === 1) { startX = arena.offsetWidth + 30; startY = Math.random() * arena.offsetHeight; } // Right
            else if (side === 2) { startX = Math.random() * arena.offsetWidth; startY = arena.offsetHeight + 30; } // Bottom
            else { startX = -30; startY = Math.random() * arena.offsetHeight; } // Left

            bird.dataset.x = startX;
            bird.dataset.y = startY;
            bird.style.left = startX + 'px';
            bird.style.top = startY + 'px';
            
            // Flip sprite if coming from LEFT (faces right towards center)
            if (startX < arena.offsetWidth / 2) bird.style.transform = "scaleX(-1)";

            bird.onmousedown = function() {
                this.remove();
            };

            arena.appendChild(bird);
        };

        window.finishSeagullGame = function(success) {
            window.seagullData.gameActive = false;
            clearInterval(window.seagullData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close
            
            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                state.stress = Math.max(0, state.stress - 5);
                state.dayStats.stress -= 5;
                statHtml += `<div class="text-green-400 flex justify-between"><span>Lunch Saved</span><span>-5% Stress</span></div>`;
                statHtml += `</div>`;
                window.queueModal("SAFE!", "You successfully defended your lunch from the avian menace." + statHtml, "Eat", "🥪", () => window.finalizeDay());
            } else {
                state.hungerLevel = 0; // Hungry
                state.stress = Math.min(100, state.stress + 15);
                state.dayStats.stress += 15;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Lunch Stolen</span><span>Hunger Reset</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Anger</span><span>+15% Stress</span></div>`;
                statHtml += `</div>`;
                window.queueModal("THEFT!", "A seagull swooped in and stole your entire sandwich!" + statHtml, "Ugh", "🦅", () => window.finalizeDay());
            }
        };