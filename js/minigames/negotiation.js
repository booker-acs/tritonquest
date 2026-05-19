window.negotiationData = { pos: 0, dir: 3, interval: null, jobId: null };

        window.startNegotiationGame = function(jobId) {
            document.getElementById('modal-overlay').classList.add('hidden');
            
            window.negotiationData = { pos: 0, dir: 4, interval: null, jobId: jobId };

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">NEGOTIATION</h1>
                    <div class="text-6xl mb-2">🤝</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">The Ask</h2>
                    <p class="text-slate-300 mb-6 text-sm">Stop the bar in the <span class="text-green-400 font-bold">Green Center</span> to raise the offer!<br><span class="text-xs text-red-400">Warning: Missing the center lowers the offer.</span></p>
                    
                    <div class="w-full h-12 bg-slate-800 rounded-full mb-8 relative border-4 border-slate-600 overflow-hidden">
                        <!-- Zones -->
                        <div class="absolute top-0 bottom-0 bg-red-500/50 w-full left-0"></div> <!-- Base Red -->
                        <div class="absolute top-0 bottom-0 bg-yellow-500/50 left-[25%] right-[25%]"></div> <!-- Middle Yellow -->
                        <div class="absolute top-0 bottom-0 bg-green-500 left-[45%] right-[45%] shadow-[0_0_15px_#4ade80]"></div> <!-- Center Green -->
                        
                        <!-- Marker -->
                        <div id="neg-marker" class="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white] transition-none" style="left: 0%;"></div>
                    </div>

                    <button onclick="window.finishNegotiationGame()" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl hover:bg-indigo-500 transition-all">STOP!</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.negotiationData.interval = setInterval(() => {
                        let d = window.negotiationData;
                        d.pos += d.dir;
                        if (d.pos >= 100 || d.pos <= 0) d.dir *= -1;
                        const marker = document.getElementById('neg-marker');
                        if (marker) marker.style.left = d.pos + '%';
                    }, 16);
                }
            });
            window.processModalQueue();
        };

        window.finishNegotiationGame = function() {
            clearInterval(window.negotiationData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            
            const d = window.negotiationData;
            
            // Calculate Result
            // Center is 50. 
            // Dist 0 = +10%. Dist 25 = +0%. Dist 50 = -10%.
            const dist = Math.abs(50 - d.pos);
            
            // Formula: 10 - (dist * 0.4)
            // Example: Dist 0 -> 10 - 0 = +10%
            // Example: Dist 10 -> 10 - 4 = +6%
            // Example: Dist 25 -> 10 - 10 = 0%
            // Example: Dist 50 -> 10 - 20 = -10%
            let percentChange = 10 - (dist * 0.4);
            percentChange = Math.round(percentChange); // Integer percent

            // Clamp max/min just in case
            percentChange = Math.max(-10, Math.min(10, percentChange));

            // Apply to Application State
            const app = state.appliedJobs.find(a => a.jobId === d.jobId);
            if (app) {
                app.negotiated = true;
                // Store multiplier (e.g. 1.10 or 0.90)
                app.wageMultiplier = 1 + (percentChange / 100);
                app.negotiationResult = percentChange; // Store for flavor text
            }

            setTimeout(() => {
                let title = "OFFER UPDATED";
                let color = "text-slate-400";
                if (percentChange > 0) { title = "RAISE SECURED"; color = "text-green-400"; }
                if (percentChange < 0) { title = "OFFER REDUCED"; color = "text-red-400"; }

                const msg = `You finished the negotiation.<br><br>Result: <span class="font-black ${color}">${percentChange > 0 ? '+' : ''}${percentChange}% Starting Wage</span>`;
                
                window.queueModal(title, msg, "View Offer", "🤝", () => {
                    // Return to the offer screen
                    window.enterInterview(d.jobId);
                });
            }, 100);
        };