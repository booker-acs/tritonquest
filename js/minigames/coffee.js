window.coffeeData = { level: 0, pouring: false, interval: null };

        window.startCoffeeGame = function() {
            window.coffeeData = { level: 0, pouring: false, interval: null };

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none" onmouseup="window.stopPour()" onmouseleave="window.stopPour()">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">☕</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Morning Brew</h2>
                    <p class="text-slate-300 mb-6 text-sm">Hold CLICK to pour. Stop at the line!</p>
                    
                    <div class="relative w-32 h-48 bg-white/10 border-4 border-slate-400 border-t-0 rounded-b-xl mx-auto overflow-hidden" onmousedown="window.startPour()">
                        <!-- Target Line -->
                        <div class="absolute top-[20%] left-0 w-full h-1 bg-green-500 z-20"></div>
                        <div class="absolute top-[20%] right-0 text-[10px] text-green-400 font-bold -mr-8">FILL</div>

                        <!-- Coffee Liquid -->
                        <div id="coffee-liquid" class="absolute bottom-0 w-full bg-[#3f200b] transition-all duration-75" style="height: 0%"></div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    window.coffeeData.interval = setInterval(() => {
                        if (window.coffeeData.pouring) {
                            window.coffeeData.level += 1.5;
                            document.getElementById('coffee-liquid').style.height = window.coffeeData.level + '%';
                            
                            // Spill Check
                            if (window.coffeeData.level > 100) window.stopPour();
                        }
                    }, 30);
                }
            });
            window.processModalQueue();
        };

        window.startPour = function() { window.coffeeData.pouring = true; };
        
        window.stopPour = function() {
            if (!window.coffeeData.pouring && window.coffeeData.level === 0) return; // Haven't started
            
            window.coffeeData.pouring = false;
            clearInterval(window.coffeeData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            
            // Target is 80% (top 20%)
            // Accept range 70-90
            const lvl = window.coffeeData.level;
            
            setTimeout(() => {
                if (lvl > 70 && lvl < 90) {
                    state.energy = Math.min(100, state.energy + 10);
                    window.queueModal("PERFECT BREW", "Just the right amount. <br><span class='text-green-400'>+10 Energy</span>", "Sip", "☕", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else if (lvl >= 90) {
                    state.stress += 5;
                    window.queueModal("OVERFLOW", "You burned your hand! <br><span class='text-red-400'>+5% Stress</span>", "Ouch", "🤕", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    window.queueModal("WEAK POUR", "Not enough caffeine to matter.", "Sigh", "🥱", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };