window.zipperData = { progress: 0, lastY: 0, velocity: 0, interval: null };

        window.startZipperGame = function() {
            window.zipperData = { progress: 0, lastY: 0, velocity: 0, interval: null };
            
            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🧥</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Zipper Stuck!</h2>
                    <p class="text-slate-300 mb-6 text-sm">Scrub mouse UP and DOWN to force it!</p>
                    
                    <div class="relative w-16 h-64 bg-slate-800 border-4 border-slate-600 rounded-full mx-auto overflow-hidden" onmousemove="window.scrubZipper(event)">
                        <!-- Zipper Teeth -->
                        <div class="absolute inset-0 flex flex-col justify-between py-2 opacity-30">
                            ${Array(10).fill('<div class="w-full h-2 bg-white"></div>').join('')}
                        </div>
                        
                        <!-- The Zipper Head -->
                        <div id="zip-head" class="absolute bottom-0 w-full h-12 bg-indigo-500 border-y-4 border-indigo-300 flex items-center justify-center text-2xl transition-all duration-75">
                            🤐
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    // Friction Loop
                    window.zipperData.interval = setInterval(() => {
                        // Progress decays if you stop scrubbing
                        window.zipperData.progress = Math.max(0, window.zipperData.progress - 0.5);
                        
                        const head = document.getElementById('zip-head');
                        if(head) head.style.bottom = window.zipperData.progress + '%';
                        
                        if (window.zipperData.progress >= 90) {
                            window.finishZipperGame();
                        }
                    }, 50);
                }
            });
            window.processModalQueue();
        };

        window.scrubZipper = function(e) {
            const delta = Math.abs(e.clientY - window.zipperData.lastY);
            window.zipperData.lastY = e.clientY;
            
            // Add progress based on speed of movement
            if (delta > 5) {
                window.zipperData.progress += 2;
            }
        };

        window.finishZipperGame = function() {
            clearInterval(window.zipperData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                state.stress = Math.max(0, state.stress - 5);
                window.queueModal("ZIPPED", "You fixed it without ripping the fabric. <br><span class='text-green-400'>-5% Stress</span>", "Warm", "🧥", () => window.finalizeDay(), null, false, "DAILY EVENT");
            }, 100);
        };