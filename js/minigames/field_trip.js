// --- DAILY EVENT: PERMISSION SLIP (MOTION/TRACE) ---
        window.tripData = { timer: 6.0, startX: 0, completed: false, interval: null, failCount: 0 };

        window.startTripEvent = function() {
            // Clean up old timers
            if (window.tripData && window.tripData.interval) clearInterval(window.tripData.interval);
            
            // Initialize Data
            window.tripData = { 
                timer: 6.0, 
                progress: 0, 
                isDrawing: false, 
                lastX: 0, 
                lastY: 0,
                interval: null
            };

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🚌</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Field Trip!</h2>
                    <p class="text-slate-300 mb-4 text-sm">The bus is leaving! Scribble your signature fast!</p>
                    
                    <div class="flex justify-between text-xs font-bold px-2 mb-1">
                        <span class="text-acs-gold">INK LEVEL</span>
                        <span id="trip-timer" class="text-white">6.0s</span>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="w-full h-3 bg-slate-800 rounded-full mb-3 border border-slate-600">
                        <div id="trip-progress" class="h-full bg-blue-500 rounded-full transition-all duration-75" style="width: 0%"></div>
                    </div>

                    <!-- Signature Pad -->
                    <div class="relative bg-white rounded-xl h-40 border-4 border-slate-700 overflow-hidden shadow-inner cursor-crosshair">
                        <!-- Background Line -->
                        <div class="absolute bottom-10 left-4 right-4 h-0.5 bg-slate-300"></div>
                        <div class="absolute bottom-10 left-4 text-slate-400 text-2xl font-black -translate-y-1/2">X</div>
                        
                        <!-- Drawing Canvas -->
                        <canvas id="sig-canvas" width="400" height="160" class="absolute inset-0 w-full h-full z-10"></canvas>
                        
                        <!-- Countdown Overlay -->
                        <div id="trip-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold z-20 pointer-events-none select-none" style="-webkit-text-stroke: 2px #002147;">3</div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    const canvas = document.getElementById('sig-canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Resize canvas to match display size for crisp lines
                    const rect = canvas.getBoundingClientRect();
                    canvas.width = rect.width;
                    canvas.height = rect.height;

                    ctx.strokeStyle = "#002147"; // Navy Ink
                    ctx.lineWidth = 3;
                    ctx.lineCap = "round";

                    // --- DRAWING LOGIC ---
                    const startDraw = (e) => {
                        window.tripData.isDrawing = true;
                        const rect = canvas.getBoundingClientRect();
                        window.tripData.lastX = e.clientX - rect.left;
                        window.tripData.lastY = e.clientY - rect.top;
                    };

                    const draw = (e) => {
                        if (!window.tripData.isDrawing || window.tripData.timer <= 0) return;
                        
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        // Visuals
                        ctx.beginPath();
                        ctx.moveTo(window.tripData.lastX, window.tripData.lastY);
                        ctx.lineTo(x, y);
                        ctx.stroke();

                        // Math: Calculate distance moved to fill bar
                        const dist = Math.sqrt(Math.pow(x - window.tripData.lastX, 2) + Math.pow(y - window.tripData.lastY, 2));
                        window.tripData.progress += dist * 0.15; // Adjustment factor for difficulty
                        
                        // Update UI
                        const pct = Math.min(100, window.tripData.progress);
                        document.getElementById('trip-progress').style.width = pct + '%';

                        window.tripData.lastX = x;
                        window.tripData.lastY = y;
                        
                        if (pct >= 100) {
                            window.finishTripGame(true);
                        }
                    };

                    const stopDraw = () => {
                        window.tripData.isDrawing = false;
                    };

                    // Listeners
                    canvas.addEventListener('mousedown', startDraw);
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', stopDraw);
                    canvas.addEventListener('mouseleave', stopDraw);

                    // --- TIMER LOGIC ---
                    let count = 3;
                    const countEl = document.getElementById('trip-countdown');
                    const startLoop = setInterval(() => {
                        count--;
                        if (count > 0) { 
                            if (countEl) countEl.innerText = count; 
                        } else {
                            clearInterval(startLoop);
                            if (countEl) countEl.style.display = 'none';
                            
                            // Start Game Timer
                            window.tripData.interval = setInterval(() => {
                                window.tripData.timer -= 0.1;
                                const timerEl = document.getElementById('trip-timer');
                                if (timerEl) timerEl.innerText = Math.max(0, window.tripData.timer).toFixed(1) + 's';
                                
                                if (window.tripData.timer <= 0) {
                                     window.finishTripGame(false); // Time out
                                }
                            }, 100);
                        }
                    }, 500); // Fast countdown (0.5s beats)
                }
            });
            window.processModalQueue();
        };

        window.renderTripGame = function() {
            const screen = document.getElementById('game-screen');
            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🚌</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Field Trip!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Sign the permission slip before the bus leaves! Trace the line left to right.</p>
                    
                    <div class="mb-2 text-right text-xs font-bold text-acs-gold px-1" id="trip-timer">6.0s</div>

                    <div id="trip-pad" class="bg-white rounded-xl h-32 relative overflow-hidden cursor-crosshair border-4 border-slate-700" onmousemove="window.traceSignature(event)" onmouseleave="window.resetSignature()">
                        <!-- Countdown Overlay -->
                        
                        <!-- Countdown Overlay (Explicitly Forced Black) -->
                        <div id="trip-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black z-20 pointer-events-none select-none" 
                             style="color: #000000 !important; -webkit-text-stroke: 0 !important; text-shadow: none !important; -webkit-text-fill-color: #000000 !important;">3</div>
                        
                        <div class="absolute inset-0 flex items-center px-4">
                            <!-- Dotted Line -->
                            <div class="w-full h-1 border-b-4 border-dotted border-slate-300"></div>
                        </div>
                        <!-- Safe Zone Visual -->
                        <div class="absolute inset-0 bg-blue-500/10 pointer-events-none" style="top: 35%; bottom: 35%;"></div>
                        
                        <!-- Pen Trail Visual -->
                        <div id="trip-pen" class="absolute w-4 h-4 bg-acs-navy rounded-full pointer-events-none transition-none" style="display:none;"></div>
                        
                        <!-- Progress text -->
                        <div id="trip-feedback" class="absolute bottom-2 right-4 text-slate-400 text-xs font-bold select-none">START AT LEFT</div>
                    </div>
                </div>
            `;
        };

        window.resetSignature = function() {
            // Reset logic if they leave the box
            if (window.tripData.completed) return;
            const pen = document.getElementById('trip-pen');
            if (pen) pen.style.display = 'none';
        };

        window.traceSignature = function(e) {
            // Logic Check: Game must be running
            if (!window.tripData.interval) return;
            if (window.tripData.completed || window.tripData.timer <= 0) return;

            const pad = document.getElementById('trip-pad');
            const pen = document.getElementById('trip-pen');
            const feedback = document.getElementById('trip-feedback');
            const rect = pad.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Visual Pen
            pen.style.display = 'block';
            pen.style.left = (x - 8) + 'px';
            pen.style.top = (y - 8) + 'px';

            // Bounds Check (Vertical)
            // Height is ~128px (h-32). Middle is 64. 
            // Safe zone is approx 35% to 65% height.
            const safeTop = rect.height * 0.30;
            const safeBottom = rect.height * 0.70;

            if (y < safeTop || y > safeBottom) {
                // Out of bounds - Visual warning
                pad.style.borderColor = '#ef4444'; // Red border
                feedback.innerText = "TOO WOBBLY!";
                feedback.className = "absolute bottom-2 right-4 text-red-500 text-xs font-bold select-none";
                return;
            } else {
                pad.style.borderColor = '#334155'; // Reset border
                feedback.innerText = "SIGNING...";
                feedback.className = "absolute bottom-2 right-4 text-slate-400 text-xs font-bold select-none";
            }

            // Progress Check (Horizontal)
            const percent = (x / rect.width) * 100;
            
            if (percent > 90) {
                window.tripData.completed = true;
                window.finishTripGame(true);
            }
        };

        window.finishTripGame = function(success) {
            // Stop logic
            if (window.tripData.interval) clearInterval(window.tripData.interval);
            window.tripData.interval = null;
            window.tripData.timer = 0; // Prevent further drawing
            
            // Force Close
            document.getElementById('modal-overlay').classList.add('hidden');

            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;
            
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 10); 
                    state.dayStats.stress -= 10;
                    
                    statHtml += `<div class="text-green-400 flex justify-between"><span>Signed</span><span>-10% Stress</span></div>`;
                    statHtml += `</div>`;
                    
                    window.queueModal("APPROVED", "You scribbled something resembling a name just as the doors closed." + statHtml, "Yay", "🚌", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.grades = Math.max(0, state.grades - 5); 
                    state.dayStats.grades -= 5;
                    state.stress = Math.min(100, state.stress + 10);
                    state.dayStats.stress += 10;
                    
                    statHtml += `<div class="text-red-400 flex justify-between"><span>Missed Trip</span><span>-5% GPA</span></div>`;
                    statHtml += `<div class="text-red-400 flex justify-between"><span>Panic</span><span>+10% Stress</span></div>`;
                    statHtml += `</div>`;
                    
                    window.queueModal("TOO LATE", "You hesitated. The bus drove away while you were looking for a pen." + statHtml, "Aw", "🛑", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };