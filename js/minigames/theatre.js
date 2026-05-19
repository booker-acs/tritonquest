// --- THEATRE MINIGAME (Spotlight Stealer) ---
        window.theatreData = { 
            active: false, 
            score: 50, // Starts at 50%
            spotX: 150, spotY: 150, // Center of 300x300 canvas
            targetX: 150, targetY: 150,
            mouseX: 0, mouseY: 0,
            mode: 'attend',
            interval: null,
            timer: 0
        };

        window.startTheatreGame = function(mode) {
             // Energy/Limit Checks
            if (state.energy < 20) {
                 window.queueModal("Too Tired", "Theatre requires 20 Energy.", "Okay", "💤");
                 return;
            }
            if (mode === 'tryout' && state.hasTriedOutToday) {
                 window.queueModal("Limit Reached", "You can only try out once per day.", "Okay", "🛑");
                 return;
            }

            document.getElementById('modal-overlay').classList.add('hidden');
            
            window.theatreData = { 
                active: true, 
                score: 50, 
                spotX: 150, spotY: 150, 
                targetX: 150, targetY: 150,
                mouseX: 150, mouseY: 150,
                mode: mode,
                interval: null,
                timer: 0
            };

            const title = mode === 'tryout' ? "AUDITION" : "REHEARSAL";
            const desc = mode === 'tryout' ? "Stay in the spotlight to get the part!" : "Find your light. Don't step into the dark.";

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">${title}</h1>
                    <div class="text-6xl mb-2">🎭</div>
                    <p class="text-slate-300 mb-4 text-xs font-mono">${desc}</p>
                    
                    <div class="w-full h-4 bg-slate-800 rounded-full mb-2 overflow-hidden border border-slate-600 relative">
                        <div id="theatre-bar" class="h-full bg-yellow-400 transition-all duration-75" style="width: 50%"></div>
                        <div class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-900 uppercase">Performance Quality</div>
                    </div>

                    <!-- Stage Canvas -->
                    <div class="relative bg-black border-4 border-slate-700 h-[300px] w-[300px] mx-auto rounded-full overflow-hidden cursor-none shadow-2xl">
                        <canvas id="stage-canvas" width="300" height="300" class="w-full h-full"></canvas>
                        <!-- Vignette -->
                        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,black_90%)]"></div>
                    </div>

                    <p class="text-[10px] text-slate-500 mt-4 italic">Move your mouse to follow the spotlight.</p>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    const canvas = document.getElementById('stage-canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Track Mouse
                    canvas.addEventListener('mousemove', (e) => {
                        const rect = canvas.getBoundingClientRect();
                        window.theatreData.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
                        window.theatreData.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
                    });

                    // Game Loop
                    window.theatreData.interval = setInterval(() => {
                        if (!window.theatreData.active) return;
                        window.updateTheatreGame(ctx, canvas);
                    }, 20); // 50 FPS
                }
            });
            window.processModalQueue();
        };

        window.updateTheatreGame = function(ctx, canvas) {
            const d = window.theatreData;
            d.timer++;

            // 1. Move Spotlight
            // Pick new target every ~40 frames (slower in practice, faster in tryout)
            const changeRate = d.mode === 'tryout' ? 30 : 50;
            const speed = d.mode === 'tryout' ? 0.08 : 0.05;

            if (d.timer % changeRate === 0) {
                // Keep somewhat centered
                d.targetX = Math.random() * 200 + 50; 
                d.targetY = Math.random() * 200 + 50; 
            }

            // Lerp towards target
            d.spotX += (d.targetX - d.spotX) * speed;
            d.spotY += (d.targetY - d.spotY) * speed;

            // 2. Check Collision (Is mouse in circle?)
            const radius = d.mode === 'tryout' ? 35 : 45; // Smaller in tryout
            const dist = Math.sqrt(Math.pow(d.mouseX - d.spotX, 2) + Math.pow(d.mouseY - d.spotY, 2));
            const inLight = dist < radius;

            // 3. Update Score
            if (inLight) {
                d.score += 0.4; // Gain confidence
            } else {
                d.score -= 0.1; // Lose confidence fast
            }
            d.score = Math.max(0, Math.min(100, d.score));

            // Update Bar
            const bar = document.getElementById('theatre-bar');
            if(bar) bar.style.width = d.score + '%';

            // 4. Render
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Spotlight
            // Radial Gradient for soft edge
            const g = ctx.createRadialGradient(d.spotX, d.spotY, radius * 0.5, d.spotX, d.spotY, radius);
            g.addColorStop(0, "rgba(255, 253, 208, 0.9)"); // Cream light
            g.addColorStop(1, "rgba(255, 253, 208, 0.0)");
            
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(d.spotX, d.spotY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw Player Cursor (Shadow)
            // If in light, draw a silhouette. If out, invisible.
            if (inLight) {
                ctx.fillStyle = "#1e293b"; // Dark slate
                ctx.beginPath();
                ctx.arc(d.mouseX, d.mouseY, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Little head/shoulders hint
                ctx.beginPath();
                ctx.arc(d.mouseX, d.mouseY + 12, 12, Math.PI, 0);
                ctx.fill();
            }

            // 5. End Condition
            if (d.timer > 800) { // Approx 16 seconds
                window.finishTheatreGame(true);
            } else if (d.score <= 0) {
                window.finishTheatreGame(false);
            }
        };

        window.finishTheatreGame = function(survived) {
            window.theatreData.active = false;
            clearInterval(window.theatreData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            const d = window.theatreData;
            // For survival, we also need a decent score ( > 70%) to "Pass" the tryout
            // For practice, survival is enough for partial credit
            const passed = survived && d.score >= 70;

            setTimeout(() => {
                if (d.mode === 'tryout') {
                    // --- TRYOUT ---
                    state.hasTriedOutToday = true;
                    if (passed) {
                        state.clubMemberships.push('theatre');
                        state.energy -= 20; state.dayStats.energy -= 20;
                        window.queueModal("CAST LIST", "You got the part! You are now a member of <strong>Theatre Arts</strong>.", "Drama!", "🎭", () => window.openClubsMenu());
                    } else {
                        state.energy -= 10;
                        window.queueModal("STAGE FRIGHT", "You froze up. The director asked you to leave the stage.", "Tragic", "🥀", () => window.openClubsMenu());
                    }
                } else {
                    // --- PRACTICE ---
                    state.hasAttendedClubToday = true;
                    state.energy -= 20; state.dayStats.energy -= 20;
                    
                    if (survived) {
                        // Better relief if score is high
                        const relief = d.score >= 80 ? 40 : 20;
                        state.stress = Math.max(0, state.stress - relief);
                        window.queueModal("STANDING OVATION", `You really felt the emotion today. <br><span class="text-green-400">-${relief}% Stress</span>`, "Bow", "🌹", () => window.updateUI());
                    } else {
                        state.stress = Math.min(100, state.stress + 5);
                        window.queueModal("OFF SCRIPT", "You forgot your lines and ruined the scene.", "Ugh", "😳", () => window.updateUI());
                    }
                }
            }, 100);
        };