// --- DAILY EVENT: PADDLE BALL (SKILL) ---
        window.paddleData = { 
            ballX: 50, ballY: 50, 
            velX: 0, velY: 0, 
            paddleX: 50, 
            score: 0, 
            interval: null, 
            gameActive: false 
        };

        window.startPaddleGame = function() {
            if (state.hasPlayedPaddleBall) {
                window.queueModal("Already Played", "You've already played with your paddle ball today.", "Okay", "🏓");
                return;
            }

            if (window.paddleData.interval) clearInterval(window.paddleData.interval);
            
            // Reset Physics
            window.paddleData = { 
                ballX: 50, ballY: 30, 
                velX: 2, velY: -2, 
                paddleX: 50, 
                score: 0, 
                gameActive: true,
                interval: null 
            };

            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">FREE TIME</h1>
                    <div class="text-6xl mb-4">🏓</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Paddle Ball!</h2>
                    <p class="text-slate-300 mb-6 text-sm">Keep it bouncing! -0.5 Stress per hit.</p>
                    
                    <div class="mb-2 text-right text-xs font-bold text-green-400 px-1">SCORE: <span id="paddle-score">0</span></div>

                    <div id="paddle-area" class="bg-slate-800 rounded-3xl h-64 relative overflow-hidden border-4 border-slate-700 cursor-none" onmousemove="window.movePaddleBall(event)">
                        <!-- Countdown Overlay -->
                        <div id="paddle-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold/80 z-30 pointer-events-none select-none">3</div>

                        <!-- The String (SVG) -->
                        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
                            <line id="paddle-string" x1="50%" y1="90%" x2="50%" y2="30%" stroke="#475569" stroke-width="2" />
                        </svg>

                        <!-- The Ball -->
                        <div id="paddle-ball" class="absolute w-6 h-6 bg-red-500 rounded-full shadow-md z-10" style="left: 50%; top: 30%; margin-left: -12px; margin-top: -12px;"></div>
                        
                        <!-- The Paddle -->
                        <div id="paddle-player" class="absolute bottom-4 w-20 h-4 bg-acs-gold rounded-full -translate-x-1/2 shadow-lg z-20" style="left: 50%;"></div>
                    </div>
                    
                    <p class="text-xs text-slate-500 mt-4 italic">Mouse to move. Don't let it drop!</p>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    // Countdown Logic
                    let count = 3;
                    const countEl = document.getElementById('paddle-countdown');
                    
                    const startLoop = setInterval(() => {
                        count--;
                        if (count > 0) {
                            if (countEl) countEl.innerText = count;
                        } else {
                            clearInterval(startLoop);
                            if (countEl) countEl.style.display = 'none';
                            
                            // Start Physics Loop
                            window.paddleData.interval = setInterval(window.updatePaddleGame, 16);
                        }
                    }, 1000);
                }
            });
            window.processModalQueue();
        };

        window.movePaddleBall = function(e) {
            if (!window.paddleData.gameActive) return;
            const area = document.getElementById('paddle-area');
            if (!area) return;
            const rect = area.getBoundingClientRect();
            
            // Calculate Paddle X (Clamped 10% - 90%)
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            x = Math.max(10, Math.min(90, x));
            window.paddleData.paddleX = x;
            
            const paddle = document.getElementById('paddle-player');
            if (paddle) paddle.style.left = x + '%';
        };

        window.updatePaddleGame = function() {
            if (!window.paddleData.gameActive) return;

            const d = window.paddleData;
            
            // Physics
            d.velY += 0.15; // Gravity
            d.ballX += d.velX;
            d.ballY += d.velY;

            // Wall Collisions (Left/Right)
            if (d.ballX <= 2 || d.ballX >= 98) {
                d.velX *= -1;
                d.ballX = Math.max(2, Math.min(98, d.ballX));
            }

            // Paddle Collision (Bottom)
            // Paddle is at approx 88% top (bottom 4 + height)
            if (d.ballY >= 85 && d.ballY <= 92 && d.velY > 0) {
                // Check X alignment (Paddle width is approx 20%)
                if (Math.abs(d.ballX - d.paddleX) < 15) {
                    // BOUNCE!
                    d.velY = -Math.abs(d.velY * 1.05); // Speed up slightly
                    d.velY = Math.max(-4, d.velY); // Cap max speed
                    
                    // Add some X velocity based on where it hit the paddle
                    d.velX += (d.ballX - d.paddleX) * 0.1;
                    
                    d.score++;
                    const scoreEl = document.getElementById('paddle-score');
                    if (scoreEl) scoreEl.innerText = d.score;
                }
            }

            // Floor Collision (Game Over)
            if (d.ballY > 100) {
                window.finishPaddleGame();
                return;
            }

            // Ceiling Collision (Bounce down)
            if (d.ballY < 0) {
                d.velY *= -1;
            }

            // Render Ball
            const ball = document.getElementById('paddle-ball');
            if (ball) {
                ball.style.left = d.ballX + '%';
                ball.style.top = d.ballY + '%';
            }

            // Render String (Connect Paddle center to Ball center)
            const string = document.getElementById('paddle-string');
            if (string) {
                // Paddle Y is fixed at roughly 90%
                string.setAttribute('x1', d.paddleX + '%');
                string.setAttribute('y1', '90%');
                string.setAttribute('x2', d.ballX + '%');
                string.setAttribute('y2', d.ballY + '%');
            }
        };

        window.finishPaddleGame = function() {
            window.paddleData.gameActive = false;
            clearInterval(window.paddleData.interval);
            document.getElementById('modal-overlay').classList.add('hidden'); // Force close

            const score = window.paddleData.score;
            
            
            // Calculate actual reduction (Cap at current stress level so it doesn't go negative)
            // Example: If Stress is 5 and Score is 10, we only reduce by 5.
            const actualReduction = Math.min(state.stress, Math.round(score/2));

            // Apply Stats
            state.stress -= actualReduction;
            state.dayStats.stress -= actualReduction;
            state.hasPlayedPaddleBall = true;

            // Show Result
            let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                <div class="text-green-400 flex justify-between"><span>Score</span><span>${score} Hits</span></div>
                <div class="text-green-400 flex justify-between"><span>Stress Relief</span><span>-${actualReduction}%</span></div>
            </div>`;
            
            setTimeout(() => {
                window.queueModal("NICE RALLY!", "You played until you missed. Not bad." + html, "Cool", "🏓", () => window.updateUI());
            }, 100);
        };