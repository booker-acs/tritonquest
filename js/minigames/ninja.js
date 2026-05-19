window.ninjaData = { 
            progress: 0, 
            teacherState: 'safe', // safe, warning, danger
            stateTimer: 0,
            interval: null,
            isTexting: false
        };

        window.startTextNinjaGame = function() {
            window.ninjaData = { progress: 0, teacherState: 'safe', stateTimer: 2000, interval: null, isTexting: false };

            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📱</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Text Ninja</h2>
                    <p class="text-slate-300 mb-6 text-sm">Hold <span class="text-white font-bold">SPACE/CLICK</span> to text. Don't get caught!</p>
                    
                    <div class="bg-slate-800 rounded-xl border-4 border-slate-600 p-4 h-64 relative overflow-hidden">
                        <!-- Teacher Area -->
                        <div id="ninja-teacher" class="text-8xl transition-all duration-200 mt-4">👩‍🏫</div>
                        <div id="ninja-status" class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Safe</div>

                        <!-- Phone/Hand (Visual Feedback) -->
                        <div id="ninja-hand" class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full transition-transform duration-200 text-6xl">
                            🤳
                        </div>
                        
                        <!-- Progress Bar -->
                        <div class="absolute bottom-4 left-4 right-4 h-4 bg-slate-900 rounded-full border border-slate-500 overflow-hidden">
                            <div id="ninja-bar" class="h-full bg-blue-500 w-0 transition-all duration-75"></div>
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const teacherEl = document.getElementById('ninja-teacher');
                    const statusEl = document.getElementById('ninja-status');
                    const handEl = document.getElementById('ninja-hand');
                    const barEl = document.getElementById('ninja-bar');

                    // Input Handlers
                    const startTexting = (e) => {
                        if(e.code && e.code !== 'Space') return;
                        if(e.type === 'keydown' && e.repeat) return;
                        
                        window.ninjaData.isTexting = true;
                        if(handEl) handEl.style.transform = "translate(-50%, -20%)"; // Hand pops up
                    };
                    
                    const stopTexting = (e) => {
                        if(e.code && e.code !== 'Space') return;
                        window.ninjaData.isTexting = false;
                        if(handEl) handEl.style.transform = "translate(-50%, 100%)"; // Hand hides
                    };

                    document.addEventListener('keydown', startTexting);
                    document.addEventListener('keyup', stopTexting);
                    document.addEventListener('mousedown', startTexting);
                    document.addEventListener('mouseup', stopTexting);

                    // Game Loop
                    window.ninjaData.interval = setInterval(() => {
                        const d = window.ninjaData;
                        
                        // 1. Teacher Logic
                        d.stateTimer -= 20;
                        if (d.stateTimer <= 0) {
                            // Cycle States
                            if (d.teacherState === 'safe') {
                                // Switch to Warning
                                d.teacherState = 'warning';
                                d.stateTimer = 500 + Math.random() * 500; // Short warning
                                teacherEl.innerText = "🤨";
                                statusEl.innerText = "SUSPICIOUS...";
                                statusEl.className = "text-xs font-bold text-yellow-400 mt-2 uppercase tracking-widest";
                            } else if (d.teacherState === 'warning') {
                                // Switch to Danger
                                d.teacherState = 'danger';
                                d.stateTimer = 1000 + Math.random() * 1500; // Look for 1-2.5s
                                teacherEl.innerText = "👁️";
                                teacherEl.style.transform = "scale(1.2)";
                                statusEl.innerText = "WATCHING!";
                                statusEl.className = "text-xs font-bold text-red-500 mt-2 uppercase tracking-widest animate-pulse";
                            } else {
                                // Switch to Safe
                                d.teacherState = 'safe';
                                d.stateTimer = 2000 + Math.random() * 2000; // Safe for 2-4s
                                teacherEl.innerText = "👩‍🏫";
                                teacherEl.style.transform = "scale(1)";
                                statusEl.innerText = "Safe";
                                statusEl.className = "text-xs font-bold text-green-400 mt-2 uppercase tracking-widest";
                            }
                        }

                        // 2. Gameplay Logic
                        if (d.isTexting) {
                            if (d.teacherState === 'danger') {
                                // CAUGHT!
                                window.finishNinjaGame(false);
                                return;
                            }
                            d.progress += 0.4;
                            if (barEl) barEl.style.width = d.progress + '%';
                            
                            if (d.progress >= 100) {
                                window.finishNinjaGame(true);
                            }
                        }
                    }, 20);

                    // Cleanup listeners override
                    const oldFinish = window.finishNinjaGame;
                    window.finishNinjaGame = function(s) {
                        document.removeEventListener('keydown', startTexting);
                        document.removeEventListener('keyup', stopTexting);
                        document.removeEventListener('mousedown', startTexting);
                        document.removeEventListener('mouseup', stopTexting);
                        oldFinish(s);
                    };
                }
            });
            window.processModalQueue();
        };

        window.finishNinjaGame = function(success) {
            clearInterval(window.ninjaData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 5);
                    state.social = Math.min(100, state.social + 5);
                    window.queueModal("SENT", "Message sent. You didn't learn any algebra, but your social life is intact. <br><span class='text-green-400'>-5% Stress</span>", "Nice", "📱", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.grades = Math.max(0, state.grades - 2);
                    state.stress += 10;
                    window.queueModal("DETENTION", "Teacher: 'Is that a phone?' She took it away. <br><span class='text-red-400'>-2% GPA, +10% Stress</span>", "Ugh", "🤬", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };