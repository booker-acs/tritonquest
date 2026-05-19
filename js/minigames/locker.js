// --- DAILY EVENT: CRACK THE CODE (LOCKER JAM) ---

        window.lockerData = { rotation: 0, speed: 5, targetStart: 0, targetEnd: 0, interval: null };

        window.startLockerJamEvent = function() {
            if (window.lockerData.interval) clearInterval(window.lockerData.interval);
            state.step = 'event_locker';
            
            // Random target zone (avoiding the very top 0/360 boundary for simplicity in math)
            const start = Math.floor(Math.random() * 200) + 50; 
            window.lockerData.targetStart = start;
            window.lockerData.targetEnd = start + 60; // Wider zone (60 degrees)
            window.lockerData.rotation = 0;
            
            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🔒</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Locker Jam!</h2>
                    <p class="text-slate-300 mb-6 text-sm">Stop the dial in the <span class="text-green-400 font-bold">Green Zone</span> to open it!</p>
                    
                    <!-- Game Area -->
                    <div class="flex justify-center mb-8">
                        <div class="relative w-48 h-48 bg-slate-800 rounded-full border-8 border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                            
                            <!-- The Dial Face -->
                            <div class="absolute inset-2 rounded-full border-2 border-slate-600 opacity-50"></div>
                            
                            <!-- The Target Zone (Conic Gradient) -->
                            <!-- We render this by rotating a div with a conic gradient slice -->
                            <div class="absolute inset-0 rounded-full" 
                                 style="background: conic-gradient(transparent ${start}deg, #4ade80 ${start}deg, #4ade80 ${start + 60}deg, transparent ${start + 60}deg);">
                            </div>

                            <!-- The Spinner (Rotates) -->
                            <div id="locker-spinner" class="absolute inset-0 transition-none origin-center" style="transform: rotate(0deg);">
                                <div class="w-1 h-1/2 bg-white mx-auto origin-bottom rounded-t-full shadow-[0_0_10px_white]"></div>
                            </div>
                            
                            <!-- Center Cap -->
                            <div class="absolute z-10 w-12 h-12 bg-slate-300 rounded-full border-4 border-slate-400 shadow-lg flex items-center justify-center">
                                <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
                            </div>

                        </div>
                    </div>

                    <button onclick="window.checkLockerLock()" class="w-full bg-acs-gold text-acs-navy py-6 rounded-2xl font-black uppercase tracking-widest text-2xl shadow-xl hover:bg-white hover:scale-105 transition-all">UNLOCK!</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.lockerData.interval = setInterval(() => {
                        const spinner = document.getElementById('locker-spinner');
                        if (!spinner) { clearInterval(window.lockerData.interval); return; }

                        window.lockerData.rotation = (window.lockerData.rotation + window.lockerData.speed) % 360;
                        spinner.style.transform = `rotate(${window.lockerData.rotation}deg)`;
                    }, 16); // ~60 FPS
                }
            });
            window.processModalQueue();
        };

        window.renderLockerGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🔒</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Locker Jam!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Your locker won't open. Crack the combination or pay the janitor to cut it.</p>
                    
                    <!-- Game Area -->
                    <div class="flex justify-center mb-8">
                        <div class="relative w-48 h-48 bg-slate-800 rounded-full border-8 border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                            <!-- Background Dial -->
                            <div id="locker-bg" class="absolute inset-0 bg-slate-800 transition-colors duration-100"></div>
                            
                            <!-- Static Marker at Top -->
                            <div class="absolute top-0 w-4 h-6 bg-red-500 z-20 rounded-b"></div>

                            <!-- Rotating Dial -->
                            <div id="locker-dial" class="w-full h-full rounded-full border-4 border-slate-600 relative transition-none" style="transform: rotate(0deg);">
                                <!-- The "Zone" on the dial -->
                                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full" 
                                     style="transform: rotate(${window.lockerData.targetStart}deg);">
                                    <div class="w-8 h-8 bg-acs-gold rounded-full mx-auto mt-2 shadow-[0_0_15px_#FDB913]"></div>
                                </div>
                            </div>
                            
                            <div class="absolute z-30 text-2xl font-black text-slate-500">ACS</div>
                        </div>
                    </div>

                    <button onclick="window.checkLockerLock()" class="w-full bg-acs-gold text-acs-navy py-6 rounded-2xl font-black uppercase tracking-widest text-2xl shadow-xl hover:bg-white hover:scale-105 transition-all">UNLOCK!</button>
                </div>
            `;

            window.lockerData.interval = setInterval(() => {
                const dial = document.getElementById('locker-dial');
                const bg = document.getElementById('locker-bg');
                if (!dial) { clearInterval(window.lockerData.interval); return; }

                window.lockerData.rotation = (window.lockerData.rotation + window.lockerData.speed) % 360;
                dial.style.transform = `rotate(${window.lockerData.rotation}deg)`;

                // Normalize rotation relative to the top marker (0 deg)
                // The visual gold dot moves with the dial. We need to click when the gold dot passes the top marker.
                // The gold dot is at 'targetStart' degrees on the dial.
                // The dial rotates.
                // Alignment happens when (Rotation + TargetStart) % 360 is roughly 0 (Top).
                // Actually easier: Let's rotate the DIAL. 
                // The dot is fixed on the dial at targetStart.
                // The dial rotates by 'rotation'.
                // The dot's world angle is (rotation + targetStart) % 360.
                // We want to stop when the dot is at the top (0 or 360).
                
                const currentDotPos = (window.lockerData.rotation + window.lockerData.targetStart) % 360;
                
                // Check if dot is near top (0 degrees +/- tolerance)
                // Since 0 is 360, we check range [340, 360] or [0, 20]
                const inZone = (currentDotPos >= 340 || currentDotPos <= 20);

                if (inZone) {
                    bg.classList.add('bg-green-900');
                    bg.classList.remove('bg-slate-800');
                } else {
                    bg.classList.remove('bg-green-900');
                    bg.classList.add('bg-slate-800');
                }

            }, 16);
        };

        window.checkLockerLock = function() {
            clearInterval(window.lockerData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close

            const current = window.lockerData.rotation;
            const start = window.lockerData.targetStart;
            const end = window.lockerData.targetEnd;

            // Simple Check: Is current rotation between start and end?
            const success = (current >= start && current <= end);

            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                state.stress = Math.max(0, state.stress - 5); // Relief
                state.dayStats.stress -= 5;
                
                statHtml += `<div class="text-green-400 flex justify-between"><span>Relief</span><span>-5% Stress</span></div>`;
                statHtml += `</div>`;
                
                window.queueModal("OPENED!", "Click. The door swings open effortlessly. You grab your books." + statHtml, "Phew", "🔓", () => window.finalizeDay(), null, false, "DAILY EVENT");
            } else {
                state.balance -= 10.00; state.dayStats.cash -= 10.00;
                state.stress = Math.min(100, state.stress + 10); state.dayStats.stress += 10;
                
                statHtml += `<div class="text-red-400 flex justify-between"><span>Janitor Fee</span><span>-$10.00</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Frustration</span><span>+10% Stress</span></div>`;
                statHtml += `</div>`;

                window.queueModal("JAMMED", "You missed the number. The lock seized up. You had to pay the janitor to cut it off." + statHtml, "Pay $10", "🔒", () => window.finalizeDay(), null, false, "DAILY EVENT");
            }
        };