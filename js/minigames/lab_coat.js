// --- DAILY EVENT: LAB COAT DISASTER (MOTION/SCRUB) ---
        window.labData = { scrubProgress: 0, timer: 5.0, interval: null };

        window.startLabEvent = function() {
            if (window.labData.interval) clearInterval(window.labData.interval);
            window.labData.scrubProgress = 0;
            window.labData.timer = 5.0;

            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🧪</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Chemical Spill!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Scrub the stain before it sets!</p>
                    
                    <div class="mb-2 flex justify-between text-xs font-bold text-acs-gold px-1">
                        <span>CLEANLINESS</span>
                        <span id="lab-timer">5.0s</span>
                    </div>

                    <div id="lab-area" class="bg-white rounded-3xl h-64 relative overflow-hidden cursor-none border-4 border-slate-700" onmousemove="window.scrubStain(event)">
                        <div id="lab-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-navy/80 z-20 pointer-events-none select-none">3</div>
                        <div id="lab-sponge" class="absolute text-4xl pointer-events-none z-10 select-none" style="display:none;">🧽</div>
                        <div class="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-200 text-9xl select-none">🥼</div>
                        <div id="lab-stain" class="absolute inset-0 bg-green-500 opacity-90 rounded-full blur-xl scale-75 transition-opacity duration-75 pointer-events-none"></div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    let count = 3;
                    const countEl = document.getElementById('lab-countdown');
                    const startLoop = setInterval(() => {
                        count--;
                        if (count > 0) { if (countEl) countEl.innerText = count; } 
                        else {
                            clearInterval(startLoop);
                            if (countEl) countEl.style.display = 'none';
                            window.labData.interval = setInterval(() => {
                                window.labData.timer -= 0.1;
                                const timerEl = document.getElementById('lab-timer');
                                if (timerEl) timerEl.innerText = Math.max(0, window.labData.timer).toFixed(1) + 's';
                                if (window.labData.timer <= 0) window.finishLabGame(false);
                            }, 100);
                        }
                    }, 500);
                }
            });
            window.processModalQueue();
        };

        window.renderLabGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🧪</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Chemical Spill!</h2>
                    <p class="text-slate-300 mb-8 text-sm">You spilled goop on your lab coat! Scrub it off before it stains!</p>
                    
                    <div class="mb-2 flex justify-between text-xs font-bold text-acs-gold px-1">
                        <span>CLEANLINESS</span>
                        <span id="lab-timer">5.0s</span>
                    </div>

                    <div id="lab-area" class="bg-white rounded-3xl h-64 relative overflow-hidden cursor-none border-4 border-slate-700" onmousemove="window.scrubStain(event)">
                        <!-- Countdown Overlay -->
                        <div id="lab-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-navy/80 z-20 pointer-events-none select-none">3</div>
                        
                        <!-- Sponge Cursor -->
                        <div id="lab-sponge" class="absolute text-4xl pointer-events-none z-10 select-none" style="display:none;">🧽</div>

                        <!-- Coat Background -->
                        <div class="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-200 text-9xl select-none">🥼</div>
                        <!-- The Stain -->
                        <div id="lab-stain" class="absolute inset-0 bg-green-500 opacity-90 rounded-full blur-xl scale-75 transition-opacity duration-75 pointer-events-none"></div>
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span class="text-slate-900/50 font-black text-xl animate-pulse">MOVE MOUSE RAPIDLY TO SCRUB!</span>
                        </div>
                    </div>
                </div>
            `;
        };

        window.scrubStain = function(e) {
            // Sponge Tracking (Always update visual if possible)
            const sponge = document.getElementById('lab-sponge');
            const area = document.getElementById('lab-area');
            if (sponge && area) {
                const rect = area.getBoundingClientRect();
                sponge.style.display = 'block';
                sponge.style.left = (e.clientX - rect.left - 20) + 'px'; // Center offset
                sponge.style.top = (e.clientY - rect.top - 20) + 'px';
            }

            // Logic Check: Game must be running
            if (!window.labData.interval) return;
            if (window.labData.timer <= 0) return;
            
            // Calculate movement speed (pixels moved)
            const movement = Math.abs(e.movementX) + Math.abs(e.movementY);
            
            // Add to progress based on movement intensity
            window.labData.scrubProgress += movement * 0.15;
            
            // Update Visuals (Reduce Opacity)
            const stain = document.getElementById('lab-stain');
            const opacity = Math.max(0, 0.9 - (window.labData.scrubProgress / 2000));
            
            if (stain) stain.style.opacity = opacity;

            if (opacity <= 0) {
                window.finishLabGame(true);
            }
        };

        window.finishLabGame = function(success) {
            clearInterval(window.labData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close
            window.labData.interval = null;
            
            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                state.stress = Math.max(0, state.stress - 5); state.dayStats.stress -= 5;
                
                statHtml += `<div class="text-green-400 flex justify-between"><span>Clean Coat</span><span>-5% Stress</span></div>`;
                statHtml += `</div>`;
                window.queueModal("SPARKLING!", "You got the stain out just in time." + statHtml, "Phew", "✨", () => window.finalizeDay());
            } else {
                state.balance -= 30; state.dayStats.cash -= 30;
                
                statHtml += `<div class="text-red-400 flex justify-between"><span>New Coat</span><span>-$30.00</span></div>`;
                statHtml += `</div>`;
                window.queueModal("STAINED", "It wouldn't come out. You had to buy a replacement from the supply closet." + statHtml, "Darn", "💸", () => window.finalizeDay());
            }
        };