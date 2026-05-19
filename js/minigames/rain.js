// --- DAILY EVENT: RAINSTORM (MASH) ---
        window.rainData = { distance: 0, timer: 4.0, interval: null };

        window.startRainEvent = function() {
            if (window.rainData.interval) clearInterval(window.rainData.interval);
            window.rainData.distance = 0;
            window.rainData.timer = 4.0;

            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">⛈️</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Sudden Downpour!</h2>
                    <p class="text-slate-300 mb-6 text-sm">Run home before you get soaked!</p>
                    
                    <div class="bg-slate-800 p-4 rounded-3xl border-4 border-slate-700 mb-8 relative h-32 overflow-hidden">
                        <div class="absolute inset-0 opacity-20 bg-slate-600"></div> 
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-4xl">🏠</div>
                        <div id="rain-runner" class="absolute left-4 top-1/2 text-4xl transition-all duration-75" style="left: 5%; transform: translateY(-50%) scaleX(-1);">🏃</div>
                    </div>
                    <div class="mb-4 text-xl font-bold text-red-400 text-right" id="rain-timer">4.0s</div>

                    <button onmousedown="window.mashRain()" class="w-full bg-blue-600 text-white py-12 rounded-2xl font-black uppercase tracking-widest text-4xl shadow-xl active:scale-95 transition-all select-none">RUN!</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.rainData.interval = setInterval(() => {
                        window.rainData.timer -= 0.1;
                        const timerEl = document.getElementById('rain-timer');
                        if (timerEl) timerEl.innerText = Math.max(0, window.rainData.timer).toFixed(1) + 's';
                        
                        if (window.rainData.timer <= 0) {
                            window.finishRainGame(false);
                        }
                    }, 100);
                }
            });
            window.processModalQueue();
        };

        window.renderRainGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">⛈️</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Sudden Downpour!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Run home before you get soaked!</p>
                    
                    <div class="bg-slate-800 p-4 rounded-3xl border-4 border-slate-700 mb-8 relative h-32 overflow-hidden">
                        <div class="absolute inset-0 opacity-20 bg-slate-600"></div> 
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-4xl">🏠</div>
                        <!-- Updated Runner: Flipped horizontally -->
                        <div id="rain-runner" class="absolute left-4 top-1/2 text-4xl transition-all duration-75" style="left: 5%; transform: translateY(-50%) scaleX(-1);">🏃</div>
                    </div>
                    <div class="mb-4 text-xl font-bold text-red-400 text-right" id="rain-timer">4.0s</div>

                    <button onmousedown="window.mashRain()" class="w-full bg-blue-600 text-white py-12 rounded-2xl font-black uppercase tracking-widest text-4xl shadow-xl active:scale-95 transition-all select-none">RUN!</button>
                </div>
            `;
        };

        window.mashRain = function() {
            if (window.rainData.timer <= 0) return;
            window.rainData.distance += 8; // ~12 clicks
            const runner = document.getElementById('rain-runner');
            if (runner) runner.style.left = Math.min(85, 5 + window.rainData.distance) + '%';
            
            if (window.rainData.distance >= 80) {
                window.finishRainGame(true);
            }
        };

        window.finishRainGame = function(success) {
            clearInterval(window.rainData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close
            
            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                state.energy = Math.max(0, state.energy - 10); state.dayStats.energy -= 10;
                
                statHtml += `<div class="text-red-400 flex justify-between"><span>Sprint Cost</span><span>-10% Energy</span></div>`;
                statHtml += `</div>`;

                window.queueModal("MADE IT!", "You got inside just as the sky opened up. Dry and safe." + statHtml, "Phew", "🏠", () => window.finalizeDay());
            } else {
                state.stress = Math.min(100, state.stress + 15); state.dayStats.stress += 15;
                state.balance -= 15; state.dayStats.cash -= 15;
                
                statHtml += `<div class="text-red-400 flex justify-between"><span>Medicine Cost</span><span>-$15.00</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Miserable</span><span>+15% Stress</span></div>`;
                statHtml += `</div>`;

                window.queueModal("SOAKED", "You couldn't outrun the rain. You're wet, miserable, and had to buy medicine." + statHtml, "Ugh", "💦", () => window.finalizeDay());
            }

            setTimeout(() => {
                const btn = document.getElementById('modal-confirm-btn');
                if(btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }, 1500);
                }
            }, 50);
        };