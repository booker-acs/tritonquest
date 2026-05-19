// --- BASKETBALL MINIGAME (Freethrow) ---
        window.basketData = { 
            active: false, 
            shots: 0, 
            score: 0, 
            maxShots: 5,
            state: 'aiming', // aiming, shooting, result
            meterPos: 50, // 0 to 100
            meterDir: 2,
            ballX: 150, ballY: 250, ballScale: 1,
            velX: 0, velY: 0,
            interval: null,
            mode: 'attend'
        };

        window.startBasketballGame = function(mode) {
            // Checks
            if (state.energy < 20) {
                 window.queueModal("Too Tired", "Basketball requires 20 Energy.", "Okay", "💤");
                 return;
            }
            if (mode === 'tryout' && state.hasTriedOutToday) {
                 window.queueModal("Limit Reached", "You can only try out once per day.", "Okay", "🛑");
                 return;
            }

            document.getElementById('modal-overlay').classList.add('hidden');
            
            window.basketData = { 
                active: true, 
                shots: 0, 
                score: 0, 
                maxShots: 5,
                state: 'aiming',
                meterPos: 50, meterDir: 2.5,
                ballX: 150, ballY: 250, ballScale: 1,
                velX: 0, velY: 0,
                interval: null,
                mode: mode
            };

            const title = mode === 'tryout' ? "TRYOUTS" : "SHOOTAROUND";
            const desc = mode === 'tryout' ? "Sink 3 baskets to make the team!" : "Nothing but net.";

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">${title}</h1>
                    <div class="text-6xl mb-2">🏀</div>
                    <p class="text-slate-300 mb-4 text-xs font-mono">${desc}</p>
                    
                    <div class="flex justify-between px-8 mb-2 text-xs font-bold font-mono">
                        <span class="text-slate-400">SHOTS: <span id="basket-shots" class="text-white">0/5</span></span>
                        <span class="text-orange-500">SCORE: <span id="basket-score">0</span></span>
                    </div>

                    <!-- Game Canvas -->
                    <div class="relative bg-slate-800 border-4 border-slate-700 h-[300px] w-[300px] mx-auto rounded-xl overflow-hidden shadow-2xl">
                        <canvas id="basket-canvas" width="300" height="300" class="w-full h-full"></canvas>
                    </div>

                    <!-- Meter -->
                    <div class="w-[280px] mx-auto mt-4 relative h-8 bg-slate-900 rounded-full border-2 border-slate-600 overflow-hidden cursor-pointer" onclick="window.shootBasketball()">
                        <!-- Zones -->
                        <div class="absolute inset-0 flex justify-center">
                            <div class="w-[20%] h-full bg-green-500/50"></div>
                            <div class="absolute w-[10%] h-full bg-green-500"></div>
                        </div>
                        <!-- Slider -->
                        <div id="basket-slider" class="absolute top-1 bottom-1 w-6 bg-orange-500 rounded-full border-2 border-white shadow-lg transition-none" style="left: 50%; transform: translateX(-50%);"></div>
                    </div>

                    <button onclick="window.shootBasketball()" class="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500 transition-all">SHOOT!</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    const canvas = document.getElementById('basket-canvas');
                    const ctx = canvas.getContext('2d');
                    window.basketData.interval = setInterval(() => {
                        if (!window.basketData.active) return;
                        window.updateBasketballGame(ctx, canvas);
                    }, 20);
                }
            });
            window.processModalQueue();
        };

        window.shootBasketball = function() {
            const d = window.basketData;
            if (d.state === 'aiming') {
                d.state = 'shooting';
                
                // Calculate trajectory based on meter
                // 50 is perfect center. 
                const offset = d.meterPos - 50; // -50 to +50
                
                // Physics setup
                d.velY = -16; // Upward force
                d.velX = offset * 0.15; // Horizontal drift based on aim
            }
        };

        window.updateBasketballGame = function(ctx, canvas) {
            const d = window.basketData;
            
            // --- 1. LOGIC ---
            
            if (d.state === 'aiming') {
                d.meterPos += d.meterDir;
                if (d.meterPos >= 95 || d.meterPos <= 5) d.meterDir *= -1;
                
                const slider = document.getElementById('basket-slider');
                if(slider) slider.style.left = d.meterPos + '%';
            }
            else if (d.state === 'shooting') {
                // Ball Physics
                d.ballX += d.velX;
                d.ballY += d.velY;
                d.velY += 0.8; // Gravity
                
                // Scale ball for depth effect (starts 1, ends ~0.6 at hoop)
                d.ballScale = Math.max(0.6, d.ballScale - 0.015);
                
                // Hoop Hit Check
                // Hoop is at x=150, y=90
                // Ball must be moving DOWN (velY > 0) to enter
                if (d.velY > 0 && d.ballY > 80 && d.ballY < 100) {
                    const distFromCenter = Math.abs(d.ballX - 150);
                    
                    if (distFromCenter < 10) {
                        // SWISH
                        d.score++;
                        d.state = 'result_swish';
                        setTimeout(window.nextBasketballShot, 1000);
                    } 
                    else if (distFromCenter < 25) {
                        // RIM BOUNCE (Random Chance)
                        if (Math.random() > 0.5) {
                            d.score++;
                            d.state = 'result_bounce'; // Lucky bounce
                            d.velY = -3; // Pop up slightly then fall in
                            d.velX = 0;
                        } else {
                            d.state = 'result_miss'; // Rim out
                            d.velX *= -1.5; // Bounce away
                            d.velY = -5;
                        }
                        setTimeout(window.nextBasketballShot, 1000);
                    }
                }
                
                // Miss (Floor/Air)
                if (d.ballY > 320) {
                    d.state = 'result_miss';
                    setTimeout(window.nextBasketballShot, 500);
                }
            }

            // --- 2. RENDER ---
            
            // Background (Gym Floor / Wall)
            var grad = ctx.createLinearGradient(0,0,0,300);
            grad.addColorStop(0, "#1e293b"); // Wall top
            grad.addColorStop(0.7, "#334155"); // Wall bottom
            grad.addColorStop(0.7, "#ca8a04"); // Floor
            grad.addColorStop(1, "#a16207");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 300, 300);

            // Backboard
            ctx.fillStyle = "white";
            ctx.fillRect(100, 30, 100, 70);
            ctx.strokeStyle = "#ef4444"; // Red square
            ctx.lineWidth = 2;
            ctx.strokeRect(130, 60, 40, 35);
            
            // Rim (Front part needs to be drawn AFTER ball if ball goes in)
            // For simplicity in 2D, we draw back rim -> Ball -> Front rim
            ctx.strokeStyle = "#ea580c";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(130, 90);
            ctx.lineTo(170, 90); // Back of rim attached to board
            ctx.stroke();

            // Net
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.beginPath();
            ctx.moveTo(130, 90);
            ctx.lineTo(135, 130);
            ctx.lineTo(165, 130);
            ctx.lineTo(170, 90);
            ctx.fill();

            // Ball
            ctx.font = `${40 * d.ballScale}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🏀", d.ballX, d.ballY);

            // Front Rim (Visual depth)
            ctx.strokeStyle = "#ea580c";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(150, 90, 20, 0, Math.PI, false); // Front semi-circle
            ctx.stroke();

            // Result Text
            if (d.state.startsWith('result')) {
                ctx.font = "900 40px 'Outfit'";
                if (d.state === 'result_swish' || d.state === 'result_bounce') {
                    ctx.fillStyle = "#fbbf24";
                    ctx.fillText("SCORE!", 150, 150);
                } else if (d.state === 'result_miss') {
                    ctx.fillStyle = "#ef4444";
                    ctx.fillText("MISS", 150, 150);
                }
            }

            // Update DOM
            const shotsEl = document.getElementById('basket-shots');
            const scoreEl = document.getElementById('basket-score');
            if(shotsEl) shotsEl.innerText = `${d.shots}/${d.maxShots}`;
            if(scoreEl) scoreEl.innerText = d.score;
        };

        window.nextBasketballShot = function() {
            const d = window.basketData;
            d.shots++;
            
            if (d.shots >= d.maxShots) {
                window.finishBasketballGame();
            } else {
                d.ballX = 150;
                d.ballY = 250;
                d.ballScale = 1;
                d.velX = 0; d.velY = 0;
                d.state = 'aiming';
                d.meterPos = Math.random() * 100; // Randomize start pos
            }
        };

        window.finishBasketballGame = function() {
            window.basketData.active = false;
            clearInterval(window.basketData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            const d = window.basketData;
            const passed = d.score >= 3;

            setTimeout(() => {
                if (d.mode === 'tryout') {
                    // TRYOUT
                    state.hasTriedOutToday = true;
                    if (passed) {
                        state.clubMemberships.push('basketball');
                        state.energy -= 20; state.dayStats.energy -= 20;
                        window.queueModal("NOTHING BUT NET", "You made the team! You are now a member of <strong>Basketball</strong>.", "Awesome", "🏀", () => window.openClubsMenu());
                    } else {
                        state.energy -= 10;
                        window.queueModal("AIRBALL", `You only scored ${d.score}/5. The coach told you to work on your form.`, "Darn", "❌", () => window.openClubsMenu());
                    }
                } else {
                    // PRACTICE
                    state.hasAttendedClubToday = true;
                    state.energy -= 20; state.dayStats.energy -= 20;
                    
                    if (passed) {
                        state.stress = Math.max(0, state.stress - 30);
                        state.dayStats.stress -= 30;
                        window.queueModal("ON FIRE", `You were raining threes today. <br><br><span class="text-green-400">-30% Stress</span>`, "Nice", "🔥", () => window.updateUI());
                    } else {
                        state.stress = Math.max(0, state.stress - 10);
                        state.dayStats.stress -= 10;
                        window.queueModal("BRICK LAYER", "You missed a lot of shots, but running laps was good cardio. <br><span class=text-green-400>-10% Stress</span>", "Okay", "🧱", () => window.updateUI());
                    }
                }
            }, 100);
        };