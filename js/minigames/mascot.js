// --- DAILY EVENT: MASCOT DUTY (MASH) ---
        window.mascotData = { progress: 0, timer: 5.0, interval: null };

        window.startMascotEvent = function() {
            if (window.mascotData.interval) clearInterval(window.mascotData.interval);
            window.mascotData.progress = 0;
            window.mascotData.timer = 5.0;

            // (Copy the SVG content from your existing renderMascotGame into this string)
            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <!-- Insert Triton SVG here -->
                    <div class="text-6xl mb-4">🧜‍♂️</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Mascot Duty!</h2>
                    <p class="text-slate-300 mb-6 text-sm">Mash to hype the crowd!</p>
                    
                    <div class="mb-2 flex justify-between text-xs font-bold text-acs-gold px-1">
                        <span>HYPE LEVEL</span>
                        <span id="mascot-timer">5.0s</span>
                    </div>
                    <div class="w-full h-8 bg-slate-800 rounded-full border-2 border-slate-600 mb-8 overflow-hidden">
                        <div id="mascot-bar" class="h-full bg-green-500 transition-all duration-75" style="width: 0%"></div>
                    </div>

                    <button onmousedown="window.mashMascot()" class="w-full bg-acs-gold text-acs-navy py-12 rounded-2xl font-black uppercase tracking-widest text-4xl shadow-xl active:scale-95 transition-all select-none">DANCE!</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.mascotData.interval = setInterval(() => {
                        window.mascotData.timer -= 0.1;
                        const timerEl = document.getElementById('mascot-timer');
                        if (timerEl) timerEl.innerText = Math.max(0, window.mascotData.timer).toFixed(1) + 's';
                        
                        if (window.mascotData.timer <= 0) {
                            window.finishMascotGame(false);
                        }
                    }, 100);
                }
            });
            window.processModalQueue();
        };

        window.renderMascotGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <!-- Replaced Merman Emoji with Custom King Triton SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" class="mx-auto mb-4">
                      <defs>
                        <linearGradient id="beardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <!-- Hair & Beard base -->
                      <path d="M15,40 Q10,15 35,10 Q50,5 65,10 Q90,15 85,40 Q95,60 85,85 Q50,105 15,85 Q5,60 15,40 Z" fill="url(#beardGrad)"/>
                      <!-- Face -->
                      <ellipse cx="50" cy="50" rx="22" ry="28" fill="#FFDBAC"/>
                      <!-- Mustache -->
                      <path d="M38,62 Q50,70 62,62 Q60,58 50,60 Q40,58 38,62 Z" fill="url(#beardGrad)"/>
                      <!-- Crown -->
                      <path d="M30,22 L40,5 L50,15 L60,5 L70,22 Q50,28 30,22 Z" fill="#FDB913"/>
                      <!-- Eyes -->
                      <circle cx="42" cy="48" r="3" fill="#002147"/>
                      <circle cx="58" cy="48" r="3" fill="#002147"/>
                      <!-- Beard Details (Fixed Top Edge) -->
                      <path d="M25,60 Q50,70 75,60 Q85,85 50,98 Q15,85 25,60 Z" fill="url(#beardGrad)"/>
                    </svg>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Mascot Duty!</h2>
                    <p class="text-slate-300 mb-8 text-sm">The principal needs you to fill in as King Triton. Mash to hype the crowd!</p>
                    
                    <div class="mb-2 flex justify-between text-xs font-bold text-acs-gold px-1">
                        <span>HYPE LEVEL</span>
                        <span id="mascot-timer">5.0s</span>
                    </div>
                    <div class="w-full h-8 bg-slate-800 rounded-full border-2 border-slate-600 mb-8 overflow-hidden">
                        <div id="mascot-bar" class="h-full bg-green-500 transition-all duration-75" style="width: 0%"></div>
                    </div>

                    <button onmousedown="window.mashMascot()" class="w-full bg-acs-gold text-acs-navy py-12 rounded-2xl font-black uppercase tracking-widest text-4xl shadow-xl active:scale-95 transition-all select-none">DANCE!</button>
                </div>
            `;
        };

        window.mashMascot = function() {
            if (window.mascotData.timer <= 0) return;
            window.mascotData.progress += 8; // ~13 clicks required
            const bar = document.getElementById('mascot-bar');
            if (bar) bar.style.width = window.mascotData.progress + '%';
            
            if (window.mascotData.progress >= 100) {
                window.finishMascotGame(true);
            }
        };

        window.finishMascotGame = function(success) {
            clearInterval(window.mascotData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close
            
            // Define mini SVG for modal icon (Fixed Beard Path here too)
            const tritonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50" style="display:inline-block;"><defs><linearGradient id="bGS" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#e2e8f0"/></linearGradient></defs><path d="M15,40 Q10,15 35,10 Q50,5 65,10 Q90,15 85,40 Q95,60 85,85 Q50,105 15,85 Q5,60 15,40 Z" fill="url(#bGS)"/><ellipse cx="50" cy="50" rx="22" ry="28" fill="#FFDBAC"/><path d="M25,60 Q50,70 75,60 Q85,85 50,98 Q15,85 25,60 Z" fill="url(#bGS)"/><path d="M38,62 Q50,70 62,62 Q60,58 50,60 Q40,58 38,62 Z" fill="url(#bGS)"/><path d="M30,22 L40,5 L50,15 L60,5 L70,22 Q50,28 30,22 Z" fill="#FDB913"/><circle cx="42" cy="48" r="3" fill="#002147"/><circle cx="58" cy="48" r="3" fill="#002147"/></svg>`;

            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                state.balance += 50; state.dayStats.cash += 50;
                state.energy = Math.max(0, state.energy - 30); state.dayStats.energy -= 30;
                
                state.completedMascotEvent = true;
                window.tryUnlockKingTriton();

                statHtml += `<div class="text-green-400 flex justify-between"><span>Payment</span><span>+$50.00</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Exhaustion</span><span>-30% Energy</span></div>`;
                statHtml += `</div>`;

                window.queueModal("CROWD GOES WILD!", "You hyped them up! The principal slipped you a bonus." + statHtml, "Nice", tritonIcon, () => window.finalizeDay());
            } else {
                state.balance += 10; state.dayStats.cash += 10;
                state.stress = Math.min(100, state.stress + 20); state.dayStats.stress += 20;
                
                statHtml += `<div class="text-green-400 flex justify-between"><span>Pity Pay</span><span>+$10.00</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Embarrassment</span><span>+20% Stress</span></div>`;
                statHtml += `</div>`;

                window.queueModal("TRIPPED", "You fell over the trident. It was embarrassing, but they paid you for showing up." + statHtml, "Oof", "🙈", () => window.finalizeDay());
            }

            // SAFETY LOCK: Disable button for 1.5s to prevent accidental clicks
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