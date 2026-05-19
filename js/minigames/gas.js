window.gasData = { val: 10.00, speed: 0.03, interval: null, stopped: false };

        window.startGasGame = function() {
            window.gasData = { val: 18.50, speed: 0.05, interval: null, stopped: false };
            
            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">⛽</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Perfect Pump</h2>
                    <p class="text-slate-300 mb-6 text-sm">Stop exactly on <span class="text-green-400 font-bold">$20.00</span>!</p>
                    
                    <div class="bg-slate-800 p-6 rounded-xl border-4 border-slate-600 mb-8 inline-block shadow-inner">
                        <div class="bg-black/50 p-4 rounded-lg border border-slate-700">
                            <div id="gas-display" class="font-mono text-5xl text-green-500 font-black tracking-widest">$18.50</div>
                        </div>
                    </div>

                    <button onclick="window.stopGas()" id="btn-gas" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl hover:bg-indigo-500 transition-all">STOP</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const disp = document.getElementById('gas-display');
                    window.gasData.interval = setInterval(() => {
                        window.gasData.val += Math.random() * 0.05; // Variable speed for difficulty
                        if (disp) disp.innerText = "$" + window.gasData.val.toFixed(2);
                        if (window.gasData.val >= 21.00) window.stopGas(); // Auto fail if too far
                    }, 50);
                }
            });
            window.processModalQueue();
        };

        window.stopGas = function() {
            if (window.gasData.stopped) return;
            window.gasData.stopped = true;
            clearInterval(window.gasData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            const final = parseFloat(window.gasData.val.toFixed(2));
            const diff = Math.abs(final - 20.00);
            
            setTimeout(() => {
                if (diff < 0.05) { // Allow 19.96 - 20.04 (Very hard)
                    state.stress = Math.max(0, state.stress - 15);
                    window.queueModal("PERFECT!", `You stopped at $${final.toFixed(2)}. So satisfying. <br><span class="text-green-400">-15% Stress</span>`, "Nice", "⛽", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.stress = Math.min(100, state.stress + 5);
                    window.queueModal("RUINED", `You stopped at $${final.toFixed(2)}. The round number is ruined. <br><span class="text-red-400">+5% Stress</span>`, "Ugh", "😫", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };