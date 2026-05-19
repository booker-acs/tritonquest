window.clawData = { stage: 0, x: 0, dir: 2, interval: null };

        window.startClawGame = function() {
            window.clawData = { stage: 0, x: 10, dir: 3, interval: null };
            
            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🕹️</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">The Claw</h2>
                    <p class="text-slate-300 mb-6 text-sm">Align the claw with the prize!</p>
                    
                    <div class="relative bg-slate-900 border-4 border-pink-500 h-48 rounded-xl overflow-hidden mb-6 shadow-[0_0_15px_#ec4899]">
                        <!-- Claw -->
                        <div id="claw-arm" class="absolute top-0 text-4xl transition-none" style="left: 10%">🏗️</div>
                        
                        <!-- Prize (Random Position) -->
                        <div id="claw-prize" class="absolute bottom-2 text-3xl" style="left: ${Math.floor(Math.random()*70 + 10)}%">🧸</div>
                    </div>
                    
                    <button onclick="window.moveClaw()" id="btn-claw" class="w-full bg-pink-600 text-white py-4 rounded-full font-black uppercase tracking-widest text-xl shadow-xl hover:bg-pink-500">MOVE ➡️</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const claw = document.getElementById('claw-arm');
                    window.clawData.interval = setInterval(() => {
                        // Stage 0: Waiting
                        // Stage 1: Moving Right
                        if (window.clawData.stage === 1) {
                            window.clawData.x += 1.5;
                            if (window.clawData.x > 90) window.clawData.x = 10; // Loop? Or Bounce? Let's loop like arcade
                            claw.style.left = window.clawData.x + '%';
                        }
                    }, 20);
                }
            });
            window.processModalQueue();
        };

        window.moveClaw = function() {
            const btn = document.getElementById('btn-claw');
            
            if (window.clawData.stage === 0) {
                window.clawData.stage = 1;
                btn.innerText = "DROP ⬇️";
                btn.classList.replace('bg-pink-600', 'bg-green-600');
            } else if (window.clawData.stage === 1) {
                window.clawData.stage = 2; // Stop
                clearInterval(window.clawData.interval);
                btn.disabled = true;
                
                // Drop Logic
                const claw = document.getElementById('claw-arm');
                const prize = document.getElementById('claw-prize');
                
                // Animate Drop
                claw.style.transition = "top 0.5s ease";
                claw.style.top = "60%";
                
                setTimeout(() => {
                    // Check Collision
                    // Parse left % as integers
                    const clawX = window.clawData.x;
                    const prizeX = parseFloat(prize.style.left);
                    const diff = Math.abs(clawX - prizeX);
                    
                    // Claw width ~10%. Prize width ~10%. Overlap needs to be close.
                    if (diff < 8) {
                        window.finishClawGame(true);
                    } else {
                        window.finishClawGame(false);
                    }
                }, 600);
            }
        };

        window.finishClawGame = function(success) {
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 20);
                    window.queueModal("WINNER!", "You grabbed the limited edition bear! <br><span class='text-green-400'>-20% Stress</span>", "Yay", "🧸", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.balance -= 1; // Cost of play?
                    state.dayStats.cash -= 1;
                    state.stress += 5;
                    window.queueModal("RIGGED!", "The claw grip was too weak. It slipped right off. <br><span class='text-red-400'>+5% Stress, -$1.00</span>", "Scam", "🕹️", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };