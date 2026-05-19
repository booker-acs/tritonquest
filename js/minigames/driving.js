// --- WEEKEND DAY TRIP: SCENIC ROUTE (LANE SWITCHER) ---
        window.drivingData = { 
            lane: 1, 
            obstacles: [], 
            carsPassed: 0, 
            targetCars: 40, // Goal: Pass 40 cars
            gameActive: false, 
            interval: null,
            frame: 0
        };

        window.startDrivingGame = function() {
            if (state.balance < 50) {
                 window.queueModal("No Funds", "A weekend trip costs $50 for gas and snacks.", "Okay", "💸");
                 return;
            }
            if (state.energy < 25) {
                 window.queueModal("Too Tired", "You are too tired to drive safely.", "Okay", "💤");
                 return;
            }

            // Cleanup any potential ghosts before starting
            if (window.drivingData && window.drivingData.handleKey) {
                document.removeEventListener('keydown', window.drivingData.handleKey);
            }
            if (window.drivingData && window.drivingData.interval) {
                clearInterval(window.drivingData.interval);
            }

            document.getElementById('modal-overlay').classList.add('hidden');
            
            // Define Key Handler HERE so we can store it
            const handleKey = (e) => {
                if (e.repeat) return; // Prevent key holding
                if (!window.drivingData.gameActive) return;
                
                if (e.key === 'ArrowLeft') window.switchLane(Math.max(0, window.drivingData.lane - 1));
                if (e.key === 'ArrowRight') window.switchLane(Math.min(2, window.drivingData.lane + 1));
            };

            window.drivingData = { 
                lane: 1, 
                obstacles: [], 
                carsPassed: 0, 
                bonusRelief: 0,
                targetCars: 40,
                gameActive: true, 
                interval: null,
                frame: 0,
                handleKey: handleKey // Store reference for cleanup
            };

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">FREE TIME</h1>
                    <div class="text-6xl mb-4">🚗</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Scenic Route</h2>
                    <p class="text-slate-300 mb-6 text-sm">Steer with Arrow Keys or Click lanes. Avoid traffic!</p>
                    
                    <div class="flex justify-between text-xs font-bold mb-2 px-2">
                        <span class="text-slate-400">Cars Passed: <span id="drive-score" class="text-white">0</span></span>
                        <span class="text-slate-400">Progress: <span id="drive-pct">0</span>%</span>
                    </div>

                    <div id="drive-area" class="bg-slate-800 rounded-3xl h-64 relative overflow-hidden border-4 border-slate-700 cursor-pointer shadow-inner grid grid-cols-3">
                        <!-- Road Markings -->
                        <div class="absolute inset-0 flex justify-evenly pointer-events-none opacity-20">
                            <div class="w-2 h-full bg-dashed-line"></div>
                            <div class="w-2 h-full bg-dashed-line"></div>
                        </div>

                        <!-- Lanes (Invisible click targets) -->
                        <div class="h-full z-10" onclick="window.switchLane(0)"></div>
                        <div class="h-full z-10" onclick="window.switchLane(1)"></div>
                        <div class="h-full z-10" onclick="window.switchLane(2)"></div>

                        <!-- Player Car -->
                        <img id="drive-car" src="images/minigames/driving/cargame.webp" 
                             class="absolute bottom-4 w-12 h-20 object-contain transition-all duration-200 pointer-events-none z-20" 
                             style="left: 50%; transform: translateX(-50%);">
                        
                        <!-- Progress Bar -->
                        <div class="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-200" id="drive-bar" style="width: 0%"></div>
                    </div>
                    
                    <style>
                        .bg-dashed-line {
                            background-image: linear-gradient(to bottom, #fff 50%, transparent 50%);
                            background-size: 100% 40px;
                            animation: moveRoad 0.5s linear infinite;
                        }
                        @keyframes moveRoad {
                            from { background-position: 0 0; }
                            to { background-position: 0 40px; }
                        }
                    </style>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    document.addEventListener('keydown', window.drivingData.handleKey);

                    // Update Car Position Visually immediately
                    window.switchLane(1);

                    // Game Loop
                    window.drivingData.interval = setInterval(() => {
                        // We do NOT check for listener cleanup here anymore.
                        // It is handled in finishDrivingGame.
                        if (!window.drivingData.gameActive) return;
                        window.updateDrivingGame();
                    }, 30);
                }
            });
            window.processModalQueue();
        };

        window.switchLane = function(laneIdx) {
            if (!window.drivingData.gameActive) return;
            window.drivingData.lane = laneIdx;
            const car = document.getElementById('drive-car');
            if (car) {
                // Centers of columns: 16.6%, 50%, 83.3%
                const positions = ['16.6%', '50%', '83.3%'];
                car.style.left = positions[laneIdx];
            }
        };

        window.updateDrivingGame = function() {
            const d = window.drivingData;
            const area = document.getElementById('drive-area');
            d.frame++;
            
            // Spawn Obstacles (Consistent rate ~1 sec)
            if (d.frame % 35 === 0) {
                const item = document.createElement('div'); // Wrapper div for positioning
                const isBad = Math.random() < 0.8; // 80% traffic
                const lane = Math.floor(Math.random() * 3);
                
                // --- NEW IMAGE LOGIC ---
                let content = "";
                if (isBad) {
                    // Random car image 01-07
                    const carNum = Math.floor(Math.random() * 7) + 1;
                    const carStr = carNum < 10 ? '0' + carNum : carNum; // Ensure '01', '02' format
                    content = `<img src="images/minigames/driving/${carStr}.webp" class="w-full h-full object-contain">`;
                } else {
                    // Good item (Photo Op)
                    content = `<div class="text-3xl">📸</div>`;
                }
                
                item.innerHTML = content;
                item.className = "absolute transition-none flex justify-center items-center pointer-events-none z-10";
                item.style.top = "-60px";
                item.style.width = "33.3%";
                item.style.height = "60px"; // Taller for cars
                item.style.left = (lane * 33.33) + "%";
                
                item.dataset.lane = lane;
                item.dataset.y = -60;
                item.dataset.type = isBad ? 'bad' : 'good';
                
                area.appendChild(item);
                d.obstacles.push(item);
            }

            // Move Items
            for (let i = 0; i < d.obstacles.length; i++) {
                let item = d.obstacles[i];
                let y = parseFloat(item.dataset.y);
                y += 6; // Speed
                item.dataset.y = y;
                item.style.top = y + "px";

                // Collision Check
                // Car is at bottom-4. Visual car height is 80px (h-20).
                // Container height 256px.
                // Car Y range approx: 170px to 250px.
                
                if (y > 170 && y < 240 && parseInt(item.dataset.lane) === d.lane) {
                    if (item.dataset.type === 'bad') {
                        window.finishDrivingGame(false, "CRASH!");
                        return;
                    } else {
                        // Bonus for Photo Op
                        d.bonusRelief += 5; // +5 Stress Relief per photo
                        item.innerHTML = "<div class='text-3xl animate-ping'>✨</div>";
                        d.obstacles.splice(i, 1);
                        i--;
                        // Visual flash effect only
                        continue;
                    }
                }

                // Cleanup & Progress
                if (y > 300) {
                    if (item.dataset.type === 'bad') {
                        d.carsPassed++;
                    }
                    item.remove();
                    d.obstacles.splice(i, 1);
                    i--;
                }
            }

            // Update UI
            const pct = Math.min(100, Math.floor((d.carsPassed / d.targetCars) * 100));
            const scoreEl = document.getElementById('drive-score');
            const pctEl = document.getElementById('drive-pct');
            const barEl = document.getElementById('drive-bar');
            
            if(scoreEl) scoreEl.innerText = d.carsPassed;
            if(pctEl) pctEl.innerText = pct;
            if(barEl) barEl.style.width = pct + '%';

            // Win Condition
            if (d.carsPassed >= d.targetCars) {
                window.finishDrivingGame(true);
            }
        };

        window.finishDrivingGame = function(success, msg) {
            window.drivingData.gameActive = false;
            clearInterval(window.drivingData.interval);
            
            // --- FIX: Remove the specific listener we stored ---
            if (window.drivingData.handleKey) {
                document.removeEventListener('keydown', window.drivingData.handleKey);
            }
            // --------------------------------------------------

            document.getElementById('modal-overlay').classList.add('hidden');

            const baseRelief = 80;
            const bonus = window.drivingData.bonusRelief || 0; // Retrieve the bonus
            
            setTimeout(() => {
                let relief = 0;
                let title, text, btnText, icon;

                if (success) {
                    relief = baseRelief + bonus; // Add bonus to base
                    state.balance -= 50; state.dayStats.cash -= 50;
                    state.energy = Math.max(0, state.energy - 25); state.dayStats.energy -= 25;
                    state.stress = Math.max(0, state.stress - relief); state.dayStats.stress -= relief;
                    state.hasRelaxedToday = true;

                    title = "PERFECT TRIP";
                    text = "The views were incredible. You feel completely renewed.<div class='mt-4 border-t border-slate-600 pt-4 font-bold text-sm'><div class='text-red-400 flex justify-between'><span>Trip Cost</span><span>-$50.00</span></div><div class='text-red-400 flex justify-between'><span>Energy</span><span>-25%</span></div><div class='text-green-400 flex justify-between'><span>Total Relief</span><span>-" + relief + "% Stress</span></div></div>";
                    btnText = "Zen";
                    icon = "🏔️";
                } else {
                    const pct = window.drivingData.carsPassed / window.drivingData.targetCars;
                    relief = Math.floor((baseRelief * pct) + (bonus / 2));
                    
                    
                    state.balance -= 50; state.dayStats.cash -= 50;
                    state.energy = Math.max(0, state.energy - 10);
                    state.stress = Math.max(0, state.stress - relief); 
                    state.dayStats.stress -= relief;
                    
                    state.hasRelaxedToday = true; 

                    title = "FENDER BENDER";
                    text = (msg || "You hit traffic.") + " The trip was cut short.<div class='mt-4 border-t border-slate-600 pt-4 font-bold text-sm'><div class='text-red-400 flex justify-between'><span>Trip Cost</span><span>-$50.00</span></div><div class='text-green-400 flex justify-between'><span>Partial Relief</span><span>-" + relief + "% Stress</span></div></div>";
                    btnText = "Ouch";
                    icon = "💥";
                }

                const btn = document.getElementById('modal-confirm-btn');
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50');
                    setTimeout(() => { btn.disabled = false; btn.classList.remove('opacity-50'); }, 1000);
                }

                window.queueModal(title, text, btnText, icon, () => window.updateUI());

            }, 100);
        };