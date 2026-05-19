// Generic data object for gym games
window.gymGameData = {
    active: false,
    interval: null,
};

// Main entry point - now a router
window.startGymGame = function() {
    if (state.energy < 30) {
        window.queueModal("Too Tired", "A workout requires 30 Energy.", "Okay", "💤");
        return;
    }
    if (state.gymPlayed) {
        window.queueModal("Rest Day", "You already worked out today. Don't overdo it.", "Okay", "💪");
        return;
    }

    const gymMinigames = [
        'startBenchPressGame',
        'startTreadmillGame',
        'startRowingGame',
        'startJumpRopeGame',
        'startLegPressGame'
    ];

    const chosenGame = gymMinigames[Math.floor(Math.random() * gymMinigames.length)];
    
    if (typeof window[chosenGame] === 'function') {
        window[chosenGame]();
    } else {
        window.startBenchPressGame();
    }
};

// 1. Bench Press Minigame
window.startBenchPressGame = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
    window.gymGameData = {
        active: true,
        progress: 0,
        decay: 0.7,
        reps: 0,
        maxReps: 5,
        canPress: true,
        interval: null
    };

    const html = `
        <div id="bench-press-area" class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">THE GYM</h1>
            <div class="text-6xl mb-4">🏋️</div>
            <h2 class="text-2xl font-black uppercase text-white mb-2">Bench Press</h2>
            <p class="text-slate-300 mb-6 text-sm">Click or press <span class="text-white font-bold">SPACE</span> for each rep!</p>
            <div class="text-lg font-bold text-white mb-2">REPS: <span id="gym-reps">0 / 5</span></div>
            <div class="w-full h-8 bg-slate-800 rounded-full border-2 border-slate-600 mx-auto relative overflow-hidden">
                <div id="gym-bar" class="absolute left-0 top-0 bottom-0 bg-red-500 transition-all duration-75" style="width: 0%"></div>
                <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">LIFT</div>
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: html,
        onOpen: () => {
            const gameArea = document.getElementById('bench-press-area');
            const data = window.gymGameData;

            const press = () => {
                if (data.active && data.canPress) {
                    data.progress += 15;
                    data.canPress = false;
                }
            };
            const release = () => { data.canPress = true; };

            gameArea.onmousedown = press;
            window.onmouseup = release;
            const handleKeyDown = (e) => { if (e.code === 'Space') { e.preventDefault(); press(); } };
            const handleKeyUp = (e) => { if (e.code === 'Space') { e.preventDefault(); release(); } };
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            data.interval = setInterval(() => {
                if (!data.active) {
                    document.removeEventListener('keydown', handleKeyDown);
                    document.removeEventListener('keyup', handleKeyUp);
                    gameArea.onmousedown = null;
                    window.onmouseup = null;
                    clearInterval(data.interval);
                    return;
                }
                data.progress = Math.max(0, data.progress - data.decay);
                if (data.progress >= 100) {
                    data.reps++;
                    data.progress = 0;
                    document.getElementById('gym-reps').innerText = `${data.reps} / ${data.maxReps}`;
                }
                const gymBar = document.getElementById('gym-bar');
                if (gymBar) gymBar.style.width = data.progress + '%';
                if (data.reps >= data.maxReps) {
                    window.finishGymGame(true, data.reps / data.maxReps);
                }
            }, 20);
        }
    });
    window.processModalQueue();
};

// 2. Treadmill Minigame
window.startTreadmillGame = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
    window.gymGameData = {
        active: true,
        speed: 50,
        target: 50,
        variance: 12,
        timer: 25 * 1000, 
        interval: null,
        targetDirection: 1,
        targetSpeedChange: 0.25,
        timeInZone: 0,
        totalTime: 0,
    };

    const html = `
        <div class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">THE GYM</h1>
            <div class="text-6xl mb-4">🏃</div>
            <h2 class="text-2xl font-black uppercase text-white mb-2">Treadmill Endurance</h2>
            <p class="text-slate-300 mb-6 text-sm">Use <span class="text-white font-bold">A</span> and <span class="text-white font-bold">D</span> to stay in the green zone!</p>
            <div class="text-lg font-bold text-white mb-2">TIME: <span id="gym-timer">25.0</span></div>
            <div class="w-full h-8 bg-slate-800 rounded-full border-2 border-slate-600 mx-auto relative overflow-hidden">
                <div id="gym-green-zone" class="absolute top-0 bottom-0 bg-green-500/30" style="left: ${window.gymGameData.target - window.gymGameData.variance}%; width: ${window.gymGameData.variance * 2}%;"></div>
                <div id="gym-runner" class="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white]" style="left: 50%;"></div>
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: html,
        onOpen: () => {
            const handleKey = (e) => {
                const data = window.gymGameData;
                if (!data.active) return;
                if (e.key.toLowerCase() === 'a') { data.speed -= 4; }
                else if (e.key.toLowerCase() === 'd') { data.speed += 4; }
            };
            document.addEventListener('keydown', handleKey);

            window.gymGameData.interval = setInterval(() => {
                const data = window.gymGameData;
                if (!data.active) {
                    document.removeEventListener('keydown', handleKey);
                    clearInterval(data.interval);
                    return;
                }

                data.timer -= 30;
                if (data.timer <= 0) {
                    const performance = data.totalTime > 0 ? data.timeInZone / data.totalTime : 0;
                    window.finishGymGame(true, performance);
                    return;
                }

                data.target += data.targetSpeedChange * data.targetDirection;
                if (data.target > 85 || data.target < 15) { data.targetDirection *= -1; }
                
                data.speed -= 0.15;
                data.speed = Math.max(0, Math.min(100, data.speed));
                
                data.totalTime++;
                const isInZone = data.speed > (data.target - data.variance) && data.speed < (data.target + data.variance);
                if (isInZone) {
                    data.timeInZone++;
                }

                const runner = document.getElementById('gym-runner');
                const greenZoneEl = document.getElementById('gym-green-zone');
                const timerEl = document.getElementById('gym-timer');

                if (runner && greenZoneEl) {
                    const safeMargin = data.variance * 0.6;
                    const isSafe = data.speed > (data.target - safeMargin) && data.speed < (data.target + safeMargin);
                    
                    if (isSafe) {
                        runner.style.backgroundColor = 'white';
                        runner.style.boxShadow = '0 0 10px white';
                        greenZoneEl.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
                    } else if (isInZone) {
                        runner.style.backgroundColor = '#f97316';
                        runner.style.boxShadow = '0 0 10px #f97316';
                        greenZoneEl.style.backgroundColor = 'rgba(74, 222, 128, 0.3)';
                    } else {
                        runner.style.backgroundColor = '#ef4444';
                        runner.style.boxShadow = '0 0 10px #ef4444';
                        greenZoneEl.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                    }
                    runner.style.left = data.speed + '%';
                    greenZoneEl.style.left = (data.target - data.variance) + '%';
                }
                if(timerEl) timerEl.innerText = (data.timer / 1000).toFixed(1);

            }, 30);
        }
    });
    window.processModalQueue();
};


// 3. Rowing Machine Minigame
window.startRowingGame = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
     window.gymGameData = {
        active: true,
        power: 0,
        reps: 0,
        maxReps: 10,
        phase: 'pull',
        timer: 20 * 1000, 
        interval: null
    };

    const html = `
        <div class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">THE GYM</h1>
            <div class="text-6xl mb-4">🚣</div>
            <h2 class="text-2xl font-black uppercase text-white mb-2">Rowing Machine</h2>
            <p class="text-slate-300 mb-6 text-sm">Match the rhythm! Press <span class="text-white font-bold">SPACE</span> in the blue, release in the gray.</p>
            <div class="text-lg font-bold text-white mb-2">REPS: <span id="gym-reps">0 / 10</span> | TIME: <span id="gym-timer">20</span></div>
            <div class="w-full h-8 bg-slate-800 rounded-full border-2 border-slate-600 mx-auto relative overflow-hidden">
                <div id="gym-rhythm-bar" class="absolute top-0 bottom-0 bg-blue-500" style="left: 0%; width: 50%;"></div>
                <div id="gym-player-marker" class="absolute top-0 bottom-0 w-2 bg-white" style="left: 0%;"></div>
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: html,
        onOpen: () => {
            const handleKeyDown = (e) => { if (e.code === 'Space' && window.gymGameData.active) { e.preventDefault(); window.gymGameData.phase = 'pull'; } };
            const handleKeyUp = (e) => { if (e.code === 'Space' && window.gymGameData.active) { e.preventDefault(); window.gymGameData.phase = 'recover'; } }
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            let rhythmPos = 0, rhythmDir = 2;

            window.gymGameData.interval = setInterval(() => {
                const data = window.gymGameData;
                if (!data.active) {
                    document.removeEventListener('keydown', handleKeyDown);
                    document.removeEventListener('keyup', handleKeyUp);
                    clearInterval(data.interval);
                    return;
                }
                
                data.timer -= 25;
                if (data.timer <= 0) { window.finishGymGame(true, data.reps / data.maxReps); return; }
                const timerEl = document.getElementById('gym-timer');
                if(timerEl) timerEl.innerText = (data.timer / 1000).toFixed(1);

                rhythmPos += rhythmDir;
                if(rhythmPos > 98 || rhythmPos < 0) rhythmDir *= -1;
                const rhythmBar = document.getElementById('gym-rhythm-bar');
                if(rhythmBar) rhythmBar.style.left = rhythmPos + '%';

                const isPullPhase = rhythmPos < 50;
                if((isPullPhase && data.phase === 'pull') || (!isPullPhase && data.phase === 'recover')) {
                    data.power = Math.min(100, data.power + 2.5);
                } else {
                    data.power = Math.max(0, data.power - 4);
                }

                if(data.power >= 100) {
                    data.reps++;
                    data.power = 0;
                    const repsEl = document.getElementById('gym-reps');
                    if(repsEl) repsEl.innerText = `${data.reps} / ${data.maxReps}`;
                }
                
                const playerMarker = document.getElementById('gym-player-marker');
                if(playerMarker) playerMarker.style.left = data.power + '%';

                if (data.reps >= data.maxReps) { window.finishGymGame(true, 1.0); }
            }, 25);
        }
    });
    window.processModalQueue();
};

// 4. Jump Rope Minigame (Final Polish)
window.startJumpRopeGame = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
    window.gymGameData = {
        active: false, 
        jumps: 0,
        maxJumps: 15,
        ropePos: 0, 
        ropeSpeed: 3, // Slower initial speed
        playerJumpedThisCycle: false,
        canJump: true,
        interval: null,
    };

    const playerAvatarSvg = window.getAvatarSVG(state.appearance, '100%');

    const html = `
        <div class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">THE GYM</h1>
            <div class="text-6xl mb-4">🤸</div>
            <h2 class="text-2xl font-black uppercase text-white mb-2">Jump Rope</h2>
            <p class="text-slate-300 mb-6 text-sm">Press <span class="text-white font-bold">SPACE</span> as the rope nears the bottom!</p>
            <div class="text-lg font-bold text-white mb-2">JUMPS: <span id="gym-jumps">0 / 15</span></div>
            <div id="jump-game-area" class="w-full h-32 bg-slate-800 rounded-lg border-2 border-slate-600 mx-auto relative overflow-hidden">
                <div id="gym-player" class="absolute w-12 h-12 transition-transform duration-200" style="left: 50%; bottom: 10px; transform: translateX(-50%);">
                    ${playerAvatarSvg}
                </div>
                <div id="gym-rope" class="absolute w-full h-1 bg-red-500" style="top: 0%;"></div>
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: html,
        onOpen: () => {
            const data = window.gymGameData;
            const handleKeyDown = (e) => {
                if (e.code === 'Space' && data.active && data.canJump) {
                    e.preventDefault();
                    data.canJump = false;
                    data.playerJumpedThisCycle = true;
                    const playerEl = document.getElementById('gym-player');
                    if (playerEl) {
                        playerEl.style.transform = 'translateX(-50%) translateY(-30px) scale(1.1)';
                        setTimeout(() => {
                           if(playerEl) playerEl.style.transform = 'translateX(-50%) translateY(0px)';
                        }, 250);
                    }
                }
            };
            const handleKeyUp = (e) => {
                if(e.code === 'Space' && data.active) {
                    e.preventDefault();
                    data.canJump = true;
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            
            const gameArea = document.getElementById('jump-game-area');
            const countdownEl = document.createElement('div');
            countdownEl.className = 'absolute inset-0 flex items-center justify-center text-6xl font-black text-white bg-black/70 z-10';
            gameArea.appendChild(countdownEl);

            let count = 3;
            countdownEl.innerText = count;
            const countdownInterval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownEl.innerText = count;
                } else {
                    countdownEl.remove();
                    clearInterval(countdownInterval);
                    
                    data.active = true;
                    data.interval = setInterval(() => {
                        if (!data.active) {
                            document.removeEventListener('keydown', handleKeyDown);
                            document.removeEventListener('keyup', handleKeyUp);
                            clearInterval(data.interval);
                            return;
                        }

                        data.ropePos += data.ropeSpeed;
                        const ropeEl = document.getElementById('gym-rope');
                        if(ropeEl) ropeEl.style.top = data.ropePos + '%';

                        if (data.ropePos >= 85 && data.ropePos < 100) { 
                            if (!data.playerJumpedThisCycle) {
                                window.finishGymGame(false, data.jumps / data.maxJumps);
                                return;
                            }
                        }
                        
                        if (data.ropePos >= 100) {
                            data.jumps++;
                            const jumpsEl = document.getElementById('gym-jumps');
                            if(jumpsEl) jumpsEl.innerText = `${data.jumps} / ${data.maxJumps}`;
                            data.ropePos = 0; 
                            data.playerJumpedThisCycle = false; 
                            data.ropeSpeed = Math.min(10, data.ropeSpeed + 0.15); // Reduced ramp-up
                        }

                        if (data.jumps >= data.maxJumps) {
                            window.finishGymGame(true, 1.0);
                        }
                    }, 20);
                }
            }, 1000);
        }
    });
    window.processModalQueue();
};

// 5. Leg Press Minigame
window.startLegPressGame = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
    window.gymGameData = {
        active: true,
        progress: 0,
        strength: 0,
        decay: 1.5,
        reps: 0,
        maxReps: 8,
        isAtTop: false,
        interval: null
    };

    const html = `
        <div class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">THE GYM</h1>
            <div class="text-6xl mb-4">🦵</div>
            <h2 class="text-2xl font-black uppercase text-white mb-2">Leg Press</h2>
            <p class="text-slate-300 mb-6 text-sm">Hold <span class="text-white font-bold">SPACE</span> to push, release to lower the weight.</p>
            <div class="text-lg font-bold text-white mb-2">REPS: <span id="gym-reps">0 / 8</span></div>
            <div class="w-8 h-48 bg-slate-800 rounded-full border-2 border-slate-600 mx-auto relative overflow-hidden">
                 <div id="gym-weight" class="absolute left-0 right-0 w-full bg-white transition-all duration-75" style="bottom: 0%; height:0%;"></div>
            </div>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: html,
        onOpen: () => {
            const handleKeyDown = (e) => { if (e.code === 'Space' && window.gymGameData.active) { e.preventDefault(); window.gymGameData.strength = 2.5; } };
            const handleKeyUp = (e) => { if (e.code === 'Space' && window.gymGameData.active) { e.preventDefault(); window.gymGameData.strength = 0; } };
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            window.gymGameData.interval = setInterval(() => {
                const data = window.gymGameData;
                if (!data.active) {
                    document.removeEventListener('keydown', handleKeyDown);
                    document.removeEventListener('keyup', handleKeyUp);
                    clearInterval(data.interval);
                    return;
                }
                data.progress += data.strength;
                data.progress -= data.decay;
                data.progress = Math.max(0, Math.min(100, data.progress));
                
                if (data.progress >= 100 && !data.isAtTop) {
                   data.reps++;
                   data.isAtTop = true;
                   const repsEl = document.getElementById('gym-reps');
                   if(repsEl) repsEl.innerText = `${data.reps} / ${data.maxReps}`;
                } else if (data.progress < 20) {
                    data.isAtTop = false;
                }

                const weightEl = document.getElementById('gym-weight');
                if(weightEl) weightEl.style.height = `${data.progress}%`;

                if (data.reps >= data.maxReps) {
                    window.finishGymGame(true, 1.0);
                }
            }, 20);
        }
    });
    window.processModalQueue();
};

// Universal finish function
window.finishGymGame = function(success, performance = 0.0) {
    if (!window.gymGameData.active) return;
    
    window.gymGameData.active = false;
    if(window.gymGameData.interval) {
        clearInterval(window.gymGameData.interval);
    }
    
    document.getElementById('modal-overlay').classList.add('hidden');

    state.energy -= 30;
    state.dayStats.energy -= 30;
    state.gymPlayed = true;
    state.hasRelaxedToday = true;

    const maxRelief = 50;
    let stressRelief = success ? Math.max(15, Math.round(maxRelief * performance)) : 10;
    let title = success ? "PUMPED UP" : "WORKOUT FAILED";
    let message = success ? `You completed the workout. The endorphins are flowing.` : "You stumbled and couldn't complete the set.";
    let icon = success ? "😤" : "😖";

    state.stress = Math.max(0, state.stress - stressRelief);
    state.dayStats.stress -= stressRelief;

    if (typeof window.unlockContact === 'function' && (!state.relationships || !state.relationships['collyn'])) {
        setTimeout(() => window.unlockContact('collyn'), 150);
    }

    setTimeout(() => {
        state.pendingModals.push({
            title: title,
            text: `${message}<br><br><span class='text-green-400'>-${stressRelief}% Stress</span>`,
            buttonText: "Yeah!",
            icon: icon,
            callback: () => window.updateUI(),
            useInputCooldown: true
        });
        window.processModalQueue();
    }, 100);
};
