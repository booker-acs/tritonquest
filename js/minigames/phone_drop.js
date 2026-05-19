// --- DAILY EVENT: PHONE DROP (REFLEX) ---
        window.phoneData = { dropY: 0, dropX: 50, paddleX: 50, speed: 0, interval: null, caught: false };

        window.startPhoneEvent = function() {
            if (window.phoneData.interval) clearInterval(window.phoneData.interval);
            window.phoneData.dropY = 0;
            window.phoneData.dropX = 20 + Math.random() * 60;
            window.phoneData.paddleX = 50;
            window.phoneData.speed = 1.5;
            window.phoneData.caught = false;

            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📱</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Butterfingers!</h2>
                    <p class="text-slate-300 mb-8 text-sm">You dropped your phone! Catch it!</p>
                    
                    <div id="phone-area" class="bg-slate-800 rounded-3xl border-4 border-slate-700 h-64 relative overflow-hidden" onmousemove="window.movePaddle(event)">
                        <div id="phone-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold/80 z-20 pointer-events-none">3</div>
                        <div id="falling-phone" class="absolute text-4xl z-10" style="top: 0%; left: ${window.phoneData.dropX}%;">📱</div>
                        <div id="catch-paddle" class="absolute bottom-2 w-20 h-4 bg-acs-gold rounded-full -translate-x-1/2" style="left: 50%;"></div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    let count = 3;
                    const countEl = document.getElementById('phone-countdown');
                    const startLoop = setInterval(() => {
                        count--;
                        if (count > 0) { if (countEl) countEl.innerText = count; } 
                        else {
                            clearInterval(startLoop);
                            if (countEl) countEl.style.display = 'none';
                            window.phoneData.interval = setInterval(window.updatePhoneGame, 16);
                        }
                    }, 500);
                }
            });
            window.processModalQueue();
        };

        window.renderPhoneGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📱</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Butterfingers!</h2>
                    <p class="text-slate-300 mb-8 text-sm">You dropped your phone! Catch it!</p>
                    
                    <div id="phone-area" class="bg-slate-800 rounded-3xl border-4 border-slate-700 h-64 relative overflow-hidden" onmousemove="window.movePaddle(event)">
                        <!-- Countdown Overlay -->
                        <div id="phone-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold/80 z-20 pointer-events-none">3</div>
                        
                        <!-- Phone -->
                        <div id="falling-phone" class="absolute text-4xl z-10" style="top: 0%; left: ${window.phoneData.dropX}%;">📱</div>
                        <!-- Paddle -->
                        <div id="catch-paddle" class="absolute bottom-2 w-20 h-4 bg-acs-gold rounded-full -translate-x-1/2" style="left: 50%;"></div>
                    </div>
                </div>
            `;
        };

        window.movePaddle = function(e) {
            const area = document.getElementById('phone-area');
            if (!area) return;
            const rect = area.getBoundingClientRect();
            
            // Get mouse position relative to the game container
            const mouseX = e.clientX - rect.left;
            
            // Calculate raw percentage (0 to 100)
            let rawPercent = (mouseX / rect.width) * 100;

            // INVERT: Subtract from 100 to flip direction
            // Mouse Left (0) -> Paddle Right (100)
            // Mouse Right (100) -> Paddle Left (0)
            let invertedPercent = 100 - rawPercent;

            // Clamp values so paddle stays within the box (assuming paddle anchor is center)
            invertedPercent = Math.max(10, Math.min(90, invertedPercent)); 
            
            window.phoneData.paddleX = invertedPercent;
            
            const paddle = document.getElementById('catch-paddle');
            if (paddle) paddle.style.left = invertedPercent + '%';
        };

        window.updatePhoneGame = function() {
            window.phoneData.dropY += window.phoneData.speed;
            window.phoneData.speed += 0.15; // Gravity acceleration

            const phoneEl = document.getElementById('falling-phone');
            if (phoneEl) phoneEl.style.top = window.phoneData.dropY + '%';

            // Collision Check at bottom
            if (window.phoneData.dropY >= 85) {
                // Check horizontal overlap
                // Paddle width is visually about 20%? No, it's hard pixel width.
                // Simple logic: distance between centers.
                const diff = Math.abs(window.phoneData.dropX - window.phoneData.paddleX);
                
                // Allow ~12% tolerance (paddle is roughly 20% wide)
                if (diff < 12) {
                    window.finishPhoneGame(true);
                } else {
                    window.finishPhoneGame(false);
                }
            }
        };

        window.finishPhoneGame = function(success) {
            clearInterval(window.phoneData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close
            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                state.energy = Math.min(100, state.energy + 10);
                state.dayStats.energy += 10;
                statHtml += `<div class="text-green-400 flex justify-between"><span>Adrenaline</span><span>+10% Energy</span></div>`;
                statHtml += `</div>`;
                window.queueModal("CAUGHT IT!", "Incredible reflexes. Not a scratch on it." + statHtml, "Phew", "🤲", () => window.finalizeDay());
            } else {
                state.balance -= 100; state.dayStats.cash -= 100;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Screen Repair</span><span>-$100.00</span></div>`;
                statHtml += `</div>`;
                window.queueModal("CRACKED", "It hit the pavement face down. The screen is shattered." + statHtml, "Nooo!", "🕸️", () => window.finalizeDay());
            }
        };