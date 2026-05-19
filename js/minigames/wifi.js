window.wifiData = { targetX: 0, targetY: 0, foundTimer: 0, interval: null };

        window.startWifiGame = function() {
            // Random spot
            window.wifiData = { 
                targetX: Math.random() * 200 + 50, 
                targetY: Math.random() * 200 + 50,
                foundTimer: 0,
                interval: null
            };

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📶</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">No Signal</h2>
                    <p class="text-slate-300 mb-6 text-sm">Move around to find the sweet spot!</p>
                    
                    <div id="wifi-zone" class="bg-black border-4 border-slate-700 h-[300px] w-[300px] mx-auto rounded-xl relative cursor-crosshair" onmousemove="window.checkWifiSignal(event)">
                        <!-- Signal Indicator -->
                        <div id="wifi-bar" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-red-600 font-black">
                            •
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {}
            });
            window.processModalQueue();
        };

        window.checkWifiSignal = function(e) {
            const d = window.wifiData;
            const rect = document.getElementById('wifi-zone').getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const dist = Math.sqrt(Math.pow(x - d.targetX, 2) + Math.pow(y - d.targetY, 2));
            const bar = document.getElementById('wifi-bar');
            
            if (dist < 30) {
                // FOUND IT
                bar.innerText = "📶";
                bar.className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-green-500 animate-pulse";
                d.foundTimer++;
                if (d.foundTimer > 20) window.finishWifiGame(true); // Hold for a bit
            } else if (dist < 80) {
                bar.innerText = "lı";
                bar.className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-yellow-500";
            } else {
                bar.innerText = "•";
                bar.className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-red-600";
            }
        };

        window.finishWifiGame = function() {
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                state.stress = Math.max(0, state.stress - 5);
                window.queueModal("CONNECTED", "You found the one spot in the room with reception. <br><span class='text-green-400'>-5% Stress</span>", "Finally", "📶", () => window.finalizeDay(), null, false, "DAILY EVENT");
            }, 100);
        };