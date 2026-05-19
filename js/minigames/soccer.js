// --- SOCCER MINIGAME (Shootout) ---
        window.soccerData = { 
            active: false, 
            shots: 0, 
            goals: 0, 
            maxShots: 5,
            state: 'aiming', // aiming, kicking, result
            ballX: 150, ballY: 250, ballScale: 1,
            targetX: 150, 
            goalieX: 150,
            interval: null,
            mode: 'attend'
        };

        window.startSoccerGame = function(mode) {
            // Checks
            if (state.energy < 20) {
                 window.queueModal("Too Tired", "Soccer requires 20 Energy.", "Okay", "💤");
                 return;
            }
            if (mode === 'tryout' && state.hasTriedOutToday) {
                 window.queueModal("Limit Reached", "You can only try out once per day.", "Okay", "🛑");
                 return;
            }

            document.getElementById('modal-overlay').classList.add('hidden');
            
            window.soccerData = { 
                active: true, 
                shots: 0, 
                goals: 0, 
                maxShots: 5,
                state: 'aiming',
                ballX: 150, ballY: 250, ballScale: 1,
                targetX: 150, 
                goalieX: 150,
                interval: null,
                mode: mode,
                frame: 0
            };

            const title = mode === 'tryout' ? "TRYOUTS" : "PRACTICE";
            const desc = mode === 'tryout' ? "Score 3 goals to make the team!" : "Score goals to blow off steam!";

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">${title}</h1>
                    <div class="text-6xl mb-2">⚽</div>
                    <p class="text-slate-300 mb-4 text-xs font-mono">${desc}</p>
                    
                    <div class="flex justify-between px-8 mb-2 text-xs font-bold font-mono">
                        <span class="text-slate-400">SHOTS: <span id="soccer-shots" class="text-white">0/5</span></span>
                        <span class="text-green-400">GOALS: <span id="soccer-goals">0</span></span>
                    </div>

                    <!-- Game Canvas -->
                    <div class="relative bg-green-800 border-4 border-slate-700 h-[300px] w-[300px] mx-auto rounded-xl overflow-hidden cursor-crosshair shadow-2xl"
                         onmousedown="window.kickBall()">
                        <canvas id="soccer-canvas" width="300" height="300" class="w-full h-full"></canvas>
                    </div>

                    <p class="text-[10px] text-slate-500 mt-4 italic">Click to Kick when the arrow finds a gap!</p>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    const canvas = document.getElementById('soccer-canvas');
                    const ctx = canvas.getContext('2d');
                    window.soccerData.interval = setInterval(() => {
                        if (!window.soccerData.active) return;
                        window.updateSoccerGame(ctx, canvas);
                    }, 20);
                }
            });
            window.processModalQueue();
        };

        window.kickBall = function() {
            if (window.soccerData.state === 'aiming') {
                window.soccerData.state = 'kicking';
            }
        };

        window.updateSoccerGame = function(ctx, canvas) {
            const d = window.soccerData;
            d.frame++;

            // --- 1. LOGIC ---
            
            // Move Goalie (Sine wave)
            // Center is 150. Range is roughly 100px. Speed determined by frame.
            d.goalieX = 150 + Math.sin(d.frame * 0.05) * 80;

            // Move Target (Faster Sine wave)
            if (d.state === 'aiming') {
                d.targetX = 150 + Math.sin(d.frame * 0.08) * 120;
            }
            
            // Kicking Physics
            if (d.state === 'kicking') {
                // Move ball towards target
                const speed = 15;
                const dx = d.targetX - d.ballX;
                const dy = 60 - d.ballY; // Target Y is inside net (approx 60)
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < speed) {
                    // Reached Goal Line
                    d.ballX = d.targetX;
                    d.ballY = 60;
                    d.ballScale = 0.6; // Ball shrinks as it goes away
                    
                    // Check Collision
                    // Goal width approx 200px (50 to 250)
                    // Goalie width approx 40px
                    const hitGoalie = Math.abs(d.ballX - d.goalieX) < 30;
                    const hitPost = d.ballX < 60 || d.ballX > 240;
                    
                    if (!hitGoalie && !hitPost) {
                        // GOAL!
                        d.goals++;
                        d.state = 'result_goal';
                    } else {
                        // MISS or BLOCKED
                        d.state = 'result_miss';
                    }
                    
                    // Delay before next shot
                    setTimeout(() => window.resetSoccerShot(), 1000);

                } else {
                    d.ballX += (dx / dist) * speed;
                    d.ballY += (dy / dist) * speed;
                    d.ballScale = Math.max(0.6, 1 - ((250 - d.ballY) / 400));
                }
            }

            // --- 2. RENDER ---
            
            // Grass
            ctx.fillStyle = "#15803d";
            ctx.fillRect(0, 0, 300, 300);
            
            // Penalty Box Line
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(50, 0, 200, 150);
            ctx.stroke();

            // The Goal Net
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fillRect(50, 20, 200, 60);
            // Net Pattern
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 1;
            for(let i=50; i<=250; i+=10) { ctx.beginPath(); ctx.moveTo(i, 20); ctx.lineTo(i, 80); ctx.stroke(); }
            for(let i=20; i<=80; i+=10) { ctx.beginPath(); ctx.moveTo(50, i); ctx.lineTo(250, i); ctx.stroke(); }
            
            // Goal Posts
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(50, 80); ctx.lineTo(50, 20); ctx.lineTo(250, 20); ctx.lineTo(250, 80);
            ctx.stroke();

            // Goalie
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🧤", d.goalieX, 60);

            // Ball
            ctx.font = `${30 * d.ballScale}px Arial`;
            ctx.fillText("⚽", d.ballX, d.ballY);

            // Aiming Arrow (Only when aiming)
            if (d.state === 'aiming') {
                ctx.fillStyle = "rgba(255, 253, 208, 0.8)";
                ctx.beginPath();
                ctx.moveTo(d.targetX, 85);
                ctx.lineTo(d.targetX - 5, 95);
                ctx.lineTo(d.targetX + 5, 95);
                ctx.fill();
            }

            // Result Text
            if (d.state.startsWith('result')) {
                ctx.font = "900 40px 'Outfit'";
                if (d.state === 'result_goal') {
                    ctx.fillStyle = "#fbbf24";
                    ctx.fillText("GOAL!", 150, 150);
                } else {
                    ctx.fillStyle = "#ef4444";
                    ctx.fillText("MISS", 150, 150);
                }
            }

            // Update DOM Counters
            document.getElementById('soccer-shots').innerText = `${d.shots}/${d.maxShots}`;
            document.getElementById('soccer-goals').innerText = d.goals;
        };

        window.resetSoccerShot = function() {
            const d = window.soccerData;
            d.shots++;
            
            if (d.shots >= d.maxShots) {
                window.finishSoccerGame();
            } else {
                // Reset for next shot
                d.ballX = 150;
                d.ballY = 250;
                d.ballScale = 1;
                d.state = 'aiming';
            }
        };

        window.finishSoccerGame = function() {
            window.soccerData.active = false;
            clearInterval(window.soccerData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            const d = window.soccerData;
            // Pass if 3 or more goals
            const passed = d.goals >= 3;

            setTimeout(() => {
                if (d.mode === 'tryout') {
                    // --- TRYOUT ---
                    state.hasTriedOutToday = true;
                    if (passed) {
                        state.clubMemberships.push('soccer');
                        window.unlockContact('brad');
                        state.energy -= 20; state.dayStats.energy -= 20;
                        window.queueModal("GOOOOOAL!", "You made the team! You are now a member of <strong>Soccer</strong>.", "Nice", "⚽", () => window.openClubsMenu());
                    } else {
                        state.energy -= 10;
                        window.queueModal("BENCHED", `You only scored ${d.goals}/5. The coach told you to practice your aim.`, "Darn", "❌", () => window.openClubsMenu());
                    }
                } else {
                    // --- PRACTICE ---
                    state.hasAttendedClubToday = true;
                    state.energy -= 20; state.dayStats.energy -= 20;
                    
                    if (passed) {
                        state.stress = Math.max(0, state.stress - 30);
                        state.dayStats.stress -= 30;
                        window.queueModal("HAT TRICK", `Great practice session. <br><br><span class="text-green-400">-30% Stress</span>`, "Nice", "👟", () => window.updateUI());
                    } else {
                        state.stress = Math.max(0, state.stress - 10);
                        state.dayStats.stress -= 10;
                        window.queueModal("ROUGH PRACTICE", "You spent most of the time chasing the ball. <br><span class=text-green-400>-10% Stress</span>", "Okay", "🏃", () => window.updateUI());
                    }
                }
            }, 100);
        };