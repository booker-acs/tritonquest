window.nodData = { pX: 10, targetX: 90, interval: null, stopped: false };

        window.startNodGame = function() {
            window.nodData = { pX: 10, targetX: 90, interval: null, stopped: false };
            
            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">😐</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">The Nod</h2>
                    <p class="text-slate-300 mb-6 text-sm">Acknowledge them at the right distance.</p>
                    
                    <div class="relative w-full h-32 bg-slate-800 rounded-xl border-4 border-slate-600 mb-8 overflow-hidden" onclick="window.doNod()">
                        <!-- Range Indicators -->
                        <div class="absolute left-[40%] width-[20%] h-full border-x-2 border-dashed border-white/20"></div>
                        
                        <!-- You -->
                        <div id="nod-p1" class="absolute top-1/2 -translate-y-1/2 text-4xl transition-none" style="left: 10%">😎</div>
                        <!-- Them -->
                        <div id="nod-p2" class="absolute top-1/2 -translate-y-1/2 text-4xl transition-none" style="left: 90%">😐</div>
                    </div>
                    
                    <button onclick="window.doNod()" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl">NOD</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    window.nodData.interval = setInterval(() => {
                        window.nodData.pX += 1;
                        window.nodData.targetX -= 1;
                        
                        const p1 = document.getElementById('nod-p1');
                        const p2 = document.getElementById('nod-p2');
                        if(p1) p1.style.left = window.nodData.pX + '%';
                        if(p2) p2.style.left = window.nodData.targetX + '%';
                        
                        // Fail if they pass each other
                        if (window.nodData.pX > window.nodData.targetX) window.doNod(); 
                    }, 30);
                }
            });
            window.processModalQueue();
        };

        window.doNod = function() {
            if (window.nodData.stopped) return;
            window.nodData.stopped = true;
            clearInterval(window.nodData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            // Optimal distance is when pX is around 35-45 (they meet at 50)
            const p1 = window.nodData.pX;
            // Gap between them: TargetX - pX. 
            // At start: 90 - 10 = 80 gap. 
            // At 30/70 = 40 gap (Too far).
            // At 40/60 = 20 gap (Perfect).
            // At 50/50 = 0 gap (Crash).
            
            const gap = window.nodData.targetX - p1;
            
            setTimeout(() => {
                if (gap > 15 && gap < 30) {
                    state.stress = Math.max(0, state.stress - 5);
                    window.queueModal("RESPECT", "Perfect execution. Downward nod. No words needed. <br><span class='text-green-400'>-5% Stress</span>", "Cool", "😎", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else if (gap <= 0) {
                    state.stress += 10;
                    window.queueModal("COLLISION", "You walked right into them. Awkward apology followed. <br><span class='text-red-400'>+10% Stress</span>", "Ouch", "💥", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else if (gap > 50) {
                    window.queueModal("TOO EARLY", "You nodded from 50 feet away. They didn't see you. <br><span class='text-slate-400'>No Effect</span>", "...", "😶", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    // Late / Weird
                    state.stress += 5;
                    window.queueModal("AWKWARD", "You nodded too late. It looked like a twitch. <br><span class='text-red-400'>+5% Stress</span>", "Ugh", "😬", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };