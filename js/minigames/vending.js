//  VENDING MACHINE ---
        
        window.vendingData = { pos: 0, dir: 2, interval: null };

        window.startVendingMachineEvent = function() {
            if (window.vendingData.interval) clearInterval(window.vendingData.interval);
            
            // HTML for the modal content
            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🍫</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Snack Stuck!</h2>
                    <p class="text-slate-300 mb-6 text-sm">The vending machine ate your money. Slam it at the right moment!</p>
                    
                    <div class="bg-slate-800 p-8 rounded-3xl border-4 border-slate-700 mb-8 relative overflow-hidden">
                        <div class="w-full h-8 bg-slate-900 rounded-full relative border border-slate-600">
                            <div class="absolute top-0 bottom-0 bg-acs-gold opacity-80 left-[40%] w-[20%] rounded-sm"></div>
                            <div id="vending-indicator" class="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_white] transition-none" style="left: 0%;"></div>
                        </div>
                    </div>

                    <button onclick="window.hitVendingMachine()" class="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-2xl shadow-xl hover:bg-red-500 hover:scale-105 transition-all">SLAM!</button>
                </div>
            `;
            

            // Queue the modal with logic in onOpen
            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.vendingData.pos = 0;
                    window.vendingData.dir = 2.5;
                    window.vendingData.interval = setInterval(() => {
                        const indicator = document.getElementById('vending-indicator');
                        if (!indicator) { clearInterval(window.vendingData.interval); return; }
                        window.vendingData.pos += window.vendingData.dir;
                        if (window.vendingData.pos >= 98 || window.vendingData.pos <= 0) window.vendingData.dir *= -1;
                        indicator.style.left = window.vendingData.pos + '%';
                    }, 16);
                }
            });
            window.processModalQueue();
        };

        window.renderVendingGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🍫</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Snack Stuck!</h2>
                    <p class="text-slate-300 mb-8 text-sm">The vending machine ate your money. Slam it at the right moment to knock it loose!</p>
                    
                    <div class="bg-slate-800 p-8 rounded-3xl border-4 border-slate-700 mb-8 relative overflow-hidden">
                        <div class="w-full h-8 bg-slate-900 rounded-full relative border border-slate-600">
                            <div class="absolute top-0 bottom-0 bg-acs-gold opacity-80 left-[40%] w-[20%] rounded-sm"></div>
                            <div id="vending-indicator" class="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_white] transition-none" style="left: 0%;"></div>
                        </div>
                    </div>

                    <button onclick="window.hitVendingMachine()" class="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-2xl shadow-xl hover:bg-red-500 hover:scale-105 transition-all">SLAM!</button>
                </div>
            `;

            window.vendingData.pos = 0;
            window.vendingData.dir = 2.5;
            
            window.vendingData.interval = setInterval(() => {
                const indicator = document.getElementById('vending-indicator');
                if (!indicator) { clearInterval(window.vendingData.interval); return; }
                window.vendingData.pos += window.vendingData.dir;
                if (window.vendingData.pos >= 98 || window.vendingData.pos <= 0) window.vendingData.dir *= -1;
                indicator.style.left = window.vendingData.pos + '%';
            }, 16);
        };

        window.hitVendingMachine = function() {
            clearInterval(window.vendingData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close window

            const pos = window.vendingData.pos;
            const success = pos >= 38 && pos <= 62;

            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;
            
            if (success) {
                state.energy = Math.min(100, state.energy + 5);
                state.dayStats.energy += 5;
                
                statHtml += `<div class="text-green-400 flex justify-between"><span>Energy Boost</span><span>+5%</span></div>`;
                statHtml += `</div>`;
                
                window.queueModal("SUCCESS!", "You hit the sweet spot! The snack falls out.", "Nice", "🍫", () => { window.finalizeDay(); });
            } else {
                state.balance -= 5.00; state.dayStats.cash -= 5.00;
                state.stress = Math.min(100, state.stress + 10); state.dayStats.stress += 10;
                
                statHtml += `<div class="text-red-400 flex justify-between"><span>Money Lost</span><span>-$5.00</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Frustration</span><span>+10% Stress</span></div>`;
                statHtml += `</div>`;
                
                window.queueModal("FAIL", "You bruised your hand and the snack is still stuck." + statHtml, "Ugh...", "💢", () => { window.finalizeDay(); });
            }
            
            // Inject stats into success modal if it was success (queueModal is async-ish in logic but sync in DOM)
            if (success) {
                const content = document.querySelector('#modal-content .text-slate-300');
                if (content) content.innerHTML += statHtml;
            }
        };