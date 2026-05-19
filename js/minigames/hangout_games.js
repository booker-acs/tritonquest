// --- GAME 1: THE DAP (Timing) ---
        window.startDapGame = function(friendId) {
            window.socialGameData = { friendId: friendId, active: true };
            
            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">THE DAP</h1>
                    <p class="text-slate-300 mb-6 text-sm">Don't leave them hanging! Click when the rings overlap.</p>
                    
                    <div class="relative h-48 w-48 mx-auto bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center cursor-pointer" onclick="window.slapHand()">
                        <!-- Target Ring -->
                        <div class="absolute w-24 h-24 border-4 border-green-500 rounded-full z-10"></div>
                        
                        <!-- Moving Hand (Scales down) -->
                        <div id="dap-hand" class="text-6xl transition-transform duration-[2000ms] ease-linear scale-[3.0] opacity-0">✋</div>
                    </div>
                </div>
            `;
            
            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const hand = document.getElementById('dap-hand');
                    // Trigger animation after slight delay
                    setTimeout(() => {
                        hand.classList.remove('opacity-0', 'scale-[3.0]');
                        hand.classList.add('opacity-100', 'scale-[0.5]');
                    }, 100);
                }
            });
            window.processModalQueue();
        };

        window.slapHand = function() {
            if (!window.socialGameData.active) return;
            window.socialGameData.active = false;
            
            const hand = document.getElementById('dap-hand');
            // Get current scale (approximate via computed style)
            const style = window.getComputedStyle(hand);
            const matrix = new WebKitCSSMatrix(style.transform);
            const scale = matrix.a; // Scale X
            
            // Target is roughly 1.0 (relative visual overlap)
            // The animation goes 3.0 -> 0.5. 
            // 1.0 is the sweet spot. 
            const diff = Math.abs(scale - 1.0);
            
            let score = 0;
            if (diff < 0.2) score = 100; // Perfect
            else if (diff < 0.5) score = 50; // Okay
            else score = 10; // Miss
            
            window.finishSocialGame(score);
        };

        // --- GAME 2: YAP SESH (Balance) ---
        window.startYapGame = function(friendId) {
            window.socialGameData = { friendId: friendId, active: true, barPos: 50, velocity: 0, timer: 0 };
            
            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">YAP SESH</h1>
                    <p class="text-slate-300 mb-4 text-xs">Keep the conversation alive! Click to talk, but don't dominate.</p>
                    
                    <div class="relative w-16 h-48 bg-slate-800 border-4 border-slate-700 rounded-full mx-auto overflow-hidden cursor-pointer" onmousedown="window.socialGameData.velocity += 4">
                        <!-- Zones -->
                        <div class="absolute top-0 w-full h-[20%] bg-red-500/30"></div> <!-- Too Loud -->
                        <div class="absolute top-[20%] w-full h-[60%] bg-green-500/30"></div> <!-- Sweet Spot -->
                        <div class="absolute bottom-0 w-full h-[20%] bg-blue-500/30"></div> <!-- Awkward Silence -->
                        
                        <!-- Indicator -->
                        <div id="yap-bar" class="absolute bottom-1/2 w-full h-2 bg-white shadow-[0_0_10px_white] transition-none"></div>
                    </div>
                    <div id="yap-timer" class="mt-2 font-mono font-bold text-xl text-white">5.0s</div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const timerEl = document.getElementById('yap-timer');
                    const barEl = document.getElementById('yap-bar');
                    let timeLeft = 5.0;
                    let totalGoodFrames = 0;
                    let totalFrames = 0;

                    window.socialGameData.interval = setInterval(() => {
                        const d = window.socialGameData;
                        
                        // Physics
                        d.velocity -= 0.3; // Gravity
                        d.barPos += d.velocity;
                        if(d.barPos < 0) { d.barPos = 0; d.velocity = 0; }
                        if(d.barPos > 98) { d.barPos = 98; d.velocity = 0; }
                        
                        barEl.style.bottom = d.barPos + '%';

                        // Scoring (20% to 80% is green zone)
                        if (d.barPos > 20 && d.barPos < 80) totalGoodFrames++;
                        totalFrames++;

                        // Time
                        timeLeft -= 0.02;
                        timerEl.innerText = Math.max(0, timeLeft).toFixed(1) + 's';

                        if (timeLeft <= 0) {
                            clearInterval(window.socialGameData.interval);
                            const score = Math.floor((totalGoodFrames / totalFrames) * 100);
                            window.finishSocialGame(score);
                        }
                    }, 20);
                }
            });
            window.processModalQueue();
        };

        // --- GAME 3: SECRET HANDSHAKE (Memory) ---
        window.startHandshakeGame = function(friendId) {
            const moves = ['👊', '🤚', '✌️', '🤙', '🤟'];
            const sequence = [
                moves[Math.floor(Math.random()*moves.length)],
                moves[Math.floor(Math.random()*moves.length)],
                moves[Math.floor(Math.random()*moves.length)]
            ];
            
            window.socialGameData = { friendId: friendId, active: true, seq: sequence, step: 0 };
            
            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">HANDSHAKE</h1>
                    <div id="hs-display" class="text-6xl mb-6 h-20 flex items-center justify-center gap-4">
                        <span class="animate-bounce">❓</span>
                        <span class="animate-bounce" style="animation-delay:0.1s">❓</span>
                        <span class="animate-bounce" style="animation-delay:0.2s">❓</span>
                    </div>
                    
                    <div id="hs-buttons" class="grid grid-cols-5 gap-2 opacity-50 pointer-events-none transition-opacity">
                        ${moves.map(m => `<button onclick="window.checkHandshake('${m}')" class="bg-slate-800 p-2 rounded-xl text-2xl border-2 border-slate-600 hover:border-acs-gold">${m}</button>`).join('')}
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const display = document.getElementById('hs-display');
                    const btns = document.getElementById('hs-buttons');
                    
                    // Show Sequence
                    let i = 0;
                    const showInterval = setInterval(() => {
                        if (i < 3) {
                            display.innerHTML = `<div class="text-8xl animate-pop">${sequence[i]}</div>`;
                            i++;
                        } else {
                            clearInterval(showInterval);
                            display.innerHTML = `<div class="text-lg text-slate-400">Your Turn!</div>`;
                            btns.classList.remove('opacity-50', 'pointer-events-none');
                        }
                    }, 800);
                }
            });
            window.processModalQueue();
        };

        window.checkHandshake = function(move) {
            const d = window.socialGameData;
            if (move === d.seq[d.step]) {
                d.step++;
                if (d.step >= 3) window.finishSocialGame(100);
            } else {
                window.finishSocialGame(20); // Failed
            }
        };

        // --- GAME 4: AUX CORD (Matching) ---
        window.startAuxGame = function(friendId) {
            const vibes = [
                { name: "CHILL", icon: "🧊", correct: ["Lo-Fi", "Acoustic", "Ambient"] },
                { name: "HYPE", icon: "🔥", correct: ["Trap", "Metal", "EDM"] },
                { name: "SAD", icon: "🌧️", correct: ["Ballad", "Slow", "Blues"] }
            ];
            const target = vibes[Math.floor(Math.random() * vibes.length)];
            
            // Generate options (1 correct, 3 wrong)
            const options = [
                { label: target.correct[0], isCorrect: true },
                { label: "Polka", isCorrect: false },
                { label: "Opera", isCorrect: false },
                { label: "News", isCorrect: false }
            ].sort(() => 0.5 - Math.random());

            window.socialGameData = { friendId: friendId, active: true };

            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">AUX CORD</h1>
                    <p class="text-slate-300 mb-6 text-sm">Pass the vibe check! They want: <strong class="text-white">${target.icon} ${target.name}</strong></p>
                    
                    <div class="grid grid-cols-2 gap-4">
                        ${options.map(opt => `
                            <button onclick="window.finishSocialGame(${opt.isCorrect ? 100 : 0})" class="bg-slate-800 p-4 rounded-xl border-2 border-slate-600 hover:border-indigo-400 font-bold text-white transition-all hover:scale-105 shadow-lg">
                                🎵 ${opt.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            state.pendingModals.push({ rawHtml: html, onOpen: ()=>{} });
            window.processModalQueue();
        };

        // --- GAME 5: PHOTO BOOTH (Stopwatch) ---
        window.startPhotoGame = function(friendId) {
            window.socialGameData = { friendId: friendId, active: true, frame: 0, interval: null };

            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">SELFIE</h1>
                    
                    <div class="relative w-48 h-48 mx-auto bg-slate-900 border-8 border-white rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                        <div id="photo-face" class="text-8xl">😐</div>
                        <!-- Flash overlay -->
                        <div id="photo-flash" class="absolute inset-0 bg-white opacity-0 pointer-events-none"></div>
                    </div>
                    
                    <button onclick="window.snapPhoto()" class="w-full mt-6 bg-red-600 text-white py-4 rounded-full font-black uppercase tracking-widest text-xl shadow-xl hover:bg-red-500">SNAP 📸</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const faces = ["😐", "😐", "😐", "😄", "😄", "🤪"]; // Smiling is the target
                    const faceEl = document.getElementById('photo-face');
                    
                    window.socialGameData.interval = setInterval(() => {
                        window.socialGameData.frame++;
                        // Cycle faces fast
                        const face = faces[window.socialGameData.frame % faces.length];
                        faceEl.innerText = face;
                    }, 150);
                }
            });
            window.processModalQueue();
        };

        window.snapPhoto = function() {
            clearInterval(window.socialGameData.interval);
            const face = document.getElementById('photo-face').innerText;
            
            // Visual Flash
            document.getElementById('photo-flash').classList.add('animate-ping', 'opacity-100');
            
            setTimeout(() => {
                if (face === "😄" || face === "🤪") window.finishSocialGame(100);
                else window.finishSocialGame(30); // Caught blinking/neutral
            }, 500);
        };