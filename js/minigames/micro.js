window.microData = { time: 5.0, interval: null, stopped: false };

        window.startMicrowaveGame = function() {
            window.microData = { time: 3.5, interval: null, stopped: false };
            
            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🌯</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Midnight Snack</h2>
                    <p class="text-slate-300 mb-6 text-sm">Stop it at 0:01! Don't let it BEEP!</p>
                    
                    <div class="bg-black border-4 border-slate-700 rounded-xl p-4 w-64 mx-auto mb-8 relative">
                        <div id="micro-display" class="font-mono text-6xl text-red-500 font-bold">0:03</div>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <button onclick="window.stopMicrowave()" id="btn-micro" class="w-full bg-slate-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl hover:bg-slate-600 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1">OPEN DOOR</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const disp = document.getElementById('micro-display');
                    window.microData.interval = setInterval(() => {
                        window.microData.time -= 0.1;
                        if (disp) disp.innerText = "0:0" + Math.ceil(window.microData.time);
                        if (window.microData.time <= 0) window.stopMicrowave();
                    }, 100);
                }
            });
            window.processModalQueue();
        };

        window.stopMicrowave = function() {
            if (window.microData.stopped) return;
            window.microData.stopped = true;
            clearInterval(window.microData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            // Win window: > 0.0 and <= 1.0 (Stopped at 1 second mark essentially)
            // But visually updating every 0.1s means we need to catch it between 0.1 and 0.9
            const success = window.microData.time > 0.1 && window.microData.time < 1.1;

            setTimeout(() => {
                if (success) {
                    state.energy = Math.min(100, state.energy + 10);
                    state.stress = Math.max(0, state.stress - 5);
                    window.queueModal("NINJA", "You opened the door at 0:01. Silent victory. <br><span class=text-green-400>+10% Energy</span>", "Yum", "🌯", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else if (window.microData.time <= 0.1) {
                    state.stress = Math.min(100, state.stress + 10);
                    window.queueModal("BEEEEP!", "It hit zero. The loud beep woke your parents. <br><span class=text-red-400>+10% Stress</span>", "Oops", "🔊", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.hungerLevel = Math.max(0, state.hungerLevel - 1); // Not fully cooked
                    window.queueModal("COLD CENTER", "You stopped it too early. The burrito is frozen in the middle.", "Ew", "❄️", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };