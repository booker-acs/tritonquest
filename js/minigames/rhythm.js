// --- ROCK BAND RHYTHM GAME ---
        window.rhythmData = { active: false, notes: [], score: 0 };

        window.startRhythmGame = function(mode) {
            // Energy/Limit Checks
            if (state.energy < 20) {
                 window.queueModal("Too Tired", "Marching Band requires 20 Energy.", "Okay", "💤");
                 return;
            }
            if (mode === 'tryout' && state.hasTriedOutToday) {
                 window.queueModal("Limit Reached", "You can only try out once per day.", "Okay", "🛑");
                 return;
            }

            document.getElementById('modal-overlay').classList.add('hidden');

            // --- AUDIO SETUP ---
            // 1. Stop all other audio
            if(window.stopAllAudio) window.stopAllAudio();

            // 2. Select Random Track
            // Fallback to 'audio/band.ogg' if list is missing
            const tracks = window.RHYTHM_TRACKS || ["audio/band.ogg"];
            const selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];

            // 3. Start Minigame Music
            // Note: This minigame uses state.currentAudio, which might conflict if not handled well.
            // For now, we'll use it as intended, but a dedicated minigame audio channel would be better in a larger refactor.
            state.currentAudio = new Audio(selectedTrack); 
            state.currentAudio.volume = 0.3;
            state.currentAudio.loop = true;
            state.currentAudio.play().catch(e => console.log("Music play failed", e));

            // Init Data
            window.rhythmData = {
                active: true,
                mode: mode,
                score: 0,
                combo: 0,
                notes: [],
                interval: null,
                spawnRate: 25, 
                speed: 2,      
                gameLength: 1000, 
                targetScore: mode === 'tryout' ? 15 : 25
            };

            const title = mode === 'tryout' ? "BAND TRYOUT" : "BAND PRACTICE";
            const desc = mode === 'tryout' ? "Hit the notes to impress the band!" : "Keep the tempo! Arrow Keys (← ↑ ↓ →)";

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">${title}</h1>
                    <div class="text-6xl mb-2">🥁</div>
                    <p class="text-slate-300 mb-4 text-xs font-mono">${desc}</p>
                    
                    <div class="flex justify-between px-4 mb-2 text-xs font-bold font-mono">
                        <span class="text-green-400">SCORE: <span id="rhythm-score">0</span></span>
                        <span class="text-blue-400">COMBO: <span id="rhythm-combo">0</span></span>
                    </div>

                    <!-- Game Board -->
                    <div class="relative bg-slate-900 border-4 border-slate-700 h-64 rounded-xl overflow-hidden grid grid-cols-4 w-64 mx-auto shadow-inner">
                        <!-- Hit Zone -->
                        <div class="absolute bottom-4 left-0 w-full h-12 bg-white/5 border-y border-white/20 flex">
                            <div class="flex-1 flex items-center justify-center border-r border-white/10 text-slate-600 text-2xl" id="lane-0">←</div>
                            <div class="flex-1 flex items-center justify-center border-r border-white/10 text-slate-600 text-2xl" id="lane-1">↑</div>
                            <div class="flex-1 flex items-center justify-center border-r border-white/10 text-slate-600 text-2xl" id="lane-2">↓</div>
                            <div class="flex-1 flex items-center justify-center text-slate-600 text-2xl" id="lane-3">→</div>
                        </div>

                        <!-- Note Container -->
                        <div id="rhythm-notes" class="absolute inset-0 pointer-events-none"></div>
                        
                        <!-- Lane Dividers -->
                        <div class="border-r border-slate-800 h-full"></div>
                        <div class="border-r border-slate-800 h-full"></div>
                        <div class="border-r border-slate-800 h-full"></div>
                        <div></div>
                    </div>

                    <p class="text-[10px] text-slate-500 mt-4 italic">Use Arrow Keys when notes hit the zone.</p>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    // Input Handler
                    const handleInput = (e) => {
                        if (!window.rhythmData.active) return;
                        let lane = -1;
                        if (e.key === 'ArrowLeft') lane = 0;
                        if (e.key === 'ArrowUp') lane = 1;
                        if (e.key === 'ArrowDown') lane = 2;
                        if (e.key === 'ArrowRight') lane = 3;

                        if (lane !== -1) {
                            e.preventDefault();
                            window.checkRhythmHit(lane);
                            const btn = document.getElementById(`lane-${lane}`);
                            if(btn) {
                                btn.classList.add('bg-white/20', 'text-white');
                                setTimeout(() => btn.classList.remove('bg-white/20', 'text-white'), 100);
                            }
                        }
                    };
                    document.addEventListener('keydown', handleInput);
                    
                    let frame = 0;
                    window.rhythmData.interval = setInterval(() => {
                        if (!window.rhythmData.active) {
                            document.removeEventListener('keydown', handleInput);
                            clearInterval(window.rhythmData.interval);
                            return;
                        }
                        
                        frame++;
                        
                        if (frame % window.rhythmData.spawnRate === 0 && frame < window.rhythmData.gameLength - 100) {
                            window.spawnRhythmNote();
                        }

                        if (frame > window.rhythmData.gameLength) {
                            window.finishRhythmGame();
                        }

                        window.updateRhythmNotes();

                    }, 20); 
                }
            });
            window.processModalQueue();
        };

        window.spawnRhythmNote = function() {
            const lane = Math.floor(Math.random() * 4);
            const id = Date.now() + Math.random();
            const note = document.createElement('div');
            note.className = 'absolute w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-white';
            const colors = ['bg-pink-500', 'bg-cyan-500', 'bg-green-500', 'bg-yellow-500'];
            note.classList.add(colors[lane]);
            
            // Calc left position based on 64px wide columns + 12px offset
            const leftPx = (lane * 64) + 12;
            note.style.left = leftPx + 'px';
            note.style.top = '-50px';
            note.innerHTML = ['←','↑','↓','→'][lane];
            
            document.getElementById('rhythm-notes').appendChild(note);
            window.rhythmData.notes.push({ id, lane, el: note, y: -50, hit: false });
        };

        window.updateRhythmNotes = function() {
            const d = window.rhythmData;
            for (let i = 0; i < d.notes.length; i++) {
                let n = d.notes[i];
                if (n.hit) continue;

                n.y += d.speed;
                n.el.style.top = n.y + 'px';

                // Miss check (below 260px)
                if (n.y > 260) {
                    n.el.remove();
                    d.notes.splice(i, 1);
                    i--;
                    d.combo = 0;
                    const cEl = document.getElementById('rhythm-combo');
                    if(cEl) cEl.innerText = 0;
                }
            }
        };

        window.checkRhythmHit = function(lane) {
            const d = window.rhythmData;
            const zoneCenter = 216; // Vertical center of hit zone
            const tolerance = 35; // How forgiving the hit is
            
            const hitNoteIndex = d.notes.findIndex(n => n.lane === lane && Math.abs(n.y - zoneCenter) < tolerance);
            
            if (hitNoteIndex !== -1) {
                // HIT
                const n = d.notes[hitNoteIndex];
                n.hit = true;
                
                n.el.style.transform = "scale(1.5)";
                n.el.style.opacity = "0";
                setTimeout(() => n.el.remove(), 100);
                
                d.notes.splice(hitNoteIndex, 1);
                
                d.score++;
                d.combo++;
                document.getElementById('rhythm-score').innerText = d.score;
                document.getElementById('rhythm-combo').innerText = d.combo;
            } else {
                // MISS (Clicked empty lane)
                d.combo = 0;
                document.getElementById('rhythm-combo').innerText = 0;
            }
        };

        window.finishRhythmGame = function() {
            window.rhythmData.active = false;
            
            // --- STOP MUSIC ---
            if (state.currentAudio) {
                state.currentAudio.pause();
                state.currentAudio = null;
            }
            window.manageBackgroundAudio();
            // ------------------

            document.getElementById('modal-overlay').classList.add('hidden');
            
            const d = window.rhythmData;
            const success = d.score >= d.targetScore;
            
            setTimeout(() => {
                if (d.mode === 'tryout') {
                    state.hasTriedOutToday = true;
                    if (success) {
                        state.clubMemberships.push('band');
                        state.energy -= 20; state.dayStats.energy -= 20;
                        window.queueModal("WELCOME ABOARD!", "You nailed the audition! You are now in <strong>Leviathan</strong>.", "Awesome", "🎸", () => window.openClubsMenu());
                    } else {
                        state.energy -= 10;
                        window.queueModal("OFF BEAT", "You were rushing. Or dragging. Try again next time.", "Darn", "❌", () => window.openClubsMenu());
                    }
                } else {
                    state.hasAttendedClubToday = true;
                    state.energy -= 20; state.dayStats.energy -= 20;
                    
                    if (success) {
                        state.stress = Math.max(0, state.stress - 30);
                        state.dayStats.stress -= 30;
                        window.queueModal("GREAT PRACTICE", `You kept the tempo perfectly. <br><br><span class="text-green-400">-30% Stress</span>`, "Nice", "🎵", () => window.updateUI());
                    } else {
                        state.stress = Math.max(0, state.stress - 10);
                        state.dayStats.stress -= 10;
                        window.queueModal("SLOPPY PRACTICE", "You struggled with a few songs, but you got through it. <br><span class=text-green-400>-10% Stress</span>", "Okay", "🎼", () => window.updateUI());
                    }
                }
            }, 100);
        };