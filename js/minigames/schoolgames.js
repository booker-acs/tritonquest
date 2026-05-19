// --- SCHOOL MINIGAME FRAMEWORK ---
// Universal completion handler for ALL school minigames
window.triggerSchoolMinigame = function() {
    // 25% chance to trigger an active minigame instead of standard text/quiz
    if (Math.random() > 0.25) {
        return false; // Did not trigger
    }

    // The full pool of planned school games
    const schoolGames = [
        'pop_quiz_panic',
        'sneaky_snacker',
        'paper_toss',
        'keep_awake',
        'pass_the_note',
        'chem_lab_mix',
        'hallway_dodger',
        'doodle_master',
        'locker_jam',
        'desk_drummer'
    ];

    // Filter to only games that have been implemented so far
    const availableGames = schoolGames.filter(game => typeof window['startSchoolGame_' + game] === 'function');
    
    if (availableGames.length === 0) return false;

    // Pick and launch a random game
    const selectedGame = availableGames[Math.floor(Math.random() * availableGames.length)];
    window['startSchoolGame_' + selectedGame]();
    
    return true; // Successfully intercepted the school day
};

// Universal completion handler for ALL school minigames
window.finishSchoolMinigame = function(success, title, msg, icon, statChanges) {
    // Clear any active timers
    if (window.activeSchoolTimer) clearInterval(window.activeSchoolTimer);

    document.getElementById('modal-overlay').classList.add('hidden');

    // Default stat structure if omitted
    const changes = Object.assign({
        gpa: 0,
        social: 0,
        energy: -10, // Base energy cost for active school games
        stress: 0
    }, statChanges);

    // Delegate to main school handler if available
    if (typeof window.finishSchoolClass === 'function') {
        window.finishSchoolClass(success, changes, msg, title, icon);
    } else {
        // Fallback logic if function missing
        state.energy = Math.max(0, state.energy + changes.energy);
        state.step = 'sim_dashboard';
        window.updateUI();
    }
};

// ==========================================
// SCHOOL MINIGAMES
// ==========================================

// 1. Pop Quiz Panic (Rapid Math)
window.startSchoolGame_pop_quiz_panic = function() {
    window.schoolGameData = { score: 0, required: 5, time: 10, currentAnswer: true };

    const generateQuestion = () => {
        const operators = ['+', '-', 'x'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        let a = Math.floor(Math.random() * 12) + 1;
        let b = Math.floor(Math.random() * 12) + 1;
        let realAnswer = 0;

        if (op === '+') realAnswer = a + b;
        if (op === '-') realAnswer = a - b;
        if (op === 'x') realAnswer = a * b;

        // 50% chance to show a fake answer
        window.schoolGameData.currentAnswer = Math.random() > 0.5;
        let displayedAnswer = window.schoolGameData.currentAnswer ? realAnswer : realAnswer + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);

        const eqEl = document.getElementById('quiz-equation');
        if (eqEl) {
            eqEl.innerHTML = `${a} ${op} ${b} = ${displayedAnswer}`;
        }
    };

    window.answerQuiz = function(guess) {
        if (guess === window.schoolGameData.currentAnswer) {
            window.schoolGameData.score++;
            document.getElementById('quiz-count').innerText = `${window.schoolGameData.score}/${window.schoolGameData.required}`;
            
            if (window.schoolGameData.score >= window.schoolGameData.required) {
                clearInterval(window.activeSchoolTimer);
                window.finishSchoolMinigame(
                    true, 
                    "A+ STUDENT", 
                    "You completely aced the pop quiz!", 
                    "💯", 
                    { gpa: 0.05, stress: -5, energy: -10 }
                );
            } else {
                generateQuestion();
            }
        } else {
            // Wrong answer! Immediate fail to add tension
            clearInterval(window.activeSchoolTimer);
            window.finishSchoolMinigame(
                false, 
                "FAILED", 
                "You blurted out the wrong answer in front of everyone.", 
                "🤦", 
                { gpa: -0.05, stress: 15, social: -5, energy: -5 }
            );
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Pop Quiz!</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">True or False? Answer 5 correctly before time runs out!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Correct: <span id="quiz-count" class="text-green-400">0/5</span></div>

            <div class="bg-white text-black p-6 rounded-2xl border-4 border-slate-300 mb-6 font-mono font-black text-4xl shadow-inner">
                <div id="quiz-equation">...</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.answerQuiz(true)" class="py-4 bg-green-600 text-white font-black text-xl rounded-xl hover:bg-green-500 active:scale-95 transition-all shadow-md">TRUE</button>
                <button onclick="window.answerQuiz(false)" class="py-4 bg-red-600 text-white font-black text-xl rounded-xl hover:bg-red-500 active:scale-95 transition-all shadow-md">FALSE</button>
            </div>
        </div>
    `;

    window.queueModal("Class Event", html, "Skip Quiz (-GPA)", "📝", () => {
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "ZERO", "You handed in a blank test.", "📝", { gpa: -0.1, stress: 5, energy: -5 });
    });

    setTimeout(() => {
        generateQuestion();
        window.activeSchoolTimer = setInterval(() => {
            window.schoolGameData.time--;
            const timerEl = document.getElementById('school-timer');
            if(timerEl) timerEl.innerText = window.schoolGameData.time + "s";
            
            if (window.schoolGameData.time <= 0) {
                clearInterval(window.activeSchoolTimer);
                window.finishSchoolMinigame(
                    false, 
                    "PENCILS DOWN", 
                    "You ran out of time before finishing!", 
                    "⏱️", 
                    { gpa: -0.05, stress: 10, energy: -10 }
                );
            }
        }, 1000);
    }, 100);
};

// ==========================================
// ADDITIONAL SCHOOL MINIGAMES
// ==========================================

// 2. Sneaky Snacker (Red Light, Green Light)
window.startSchoolGame_sneaky_snacker = function() {
    window.schoolGameData = { progress: 0, required: 100, time: 15, teacherState: 'away', isEating: false, active: true };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Sneaky Snacker</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Hold to eat chips. Release IMMEDIATELY when the teacher looks!</p>
            
            <div class="w-full h-4 bg-slate-800 rounded-full mb-4 overflow-hidden border border-slate-600 shadow-inner">
                <div id="snack-progress" class="h-full bg-orange-500 transition-none" style="width: 0%;"></div>
            </div>

            <!-- Teacher Display -->
            <div id="teacher-view" class="w-32 h-32 mx-auto mb-6 bg-slate-800 border-4 border-slate-600 rounded-2xl flex items-center justify-center text-6xl shadow-md transition-colors duration-200">
                👨‍🏫
            </div>

            <button id="btn-eat" class="w-full py-4 bg-orange-600 text-white font-black rounded-xl active:bg-orange-500 active:scale-95 transition-all shadow-md uppercase tracking-widest"
                    onmousedown="window.schoolGameData.isEating = true; this.innerText='CRUNCHING...'" 
                    onmouseup="window.schoolGameData.isEating = false; this.innerText='HOLD TO EAT'" 
                    onmouseleave="window.schoolGameData.isEating = false; this.innerText='HOLD TO EAT'"
                    ontouchstart="(e)=>{e.preventDefault(); window.schoolGameData.isEating = true; document.getElementById('btn-eat').innerText='CRUNCHING...';}" 
                    ontouchend="window.schoolGameData.isEating = false; document.getElementById('btn-eat').innerText='HOLD TO EAT'">
                HOLD TO EAT
            </button>
        </div>
    `;

    window.queueModal("Class Event", html, "Starve (-Energy)", "🥔", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "HUNGRY", "You survived, but your stomach was growling.", "📉", { energy: -15, stress: 5 });
    });

    setTimeout(() => {
        let frame = 0;
        let nextStateChange = 60 + Math.random() * 60; // Frames until teacher changes state

        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            frame++;

            // Timer
            if (frame % 60 === 0) {
                window.schoolGameData.time--;
                const timerEl = document.getElementById('school-timer');
                if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";
                
                if (window.schoolGameData.time <= 0) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(false, "RING RING", "Class ended before you finished your snack.", "⏱️", { stress: 5 });
                }
            }

            // Teacher AI
            nextStateChange--;
            if (nextStateChange <= 0) {
                const tv = document.getElementById('teacher-view');
                if (window.schoolGameData.teacherState === 'away') {
                    window.schoolGameData.teacherState = 'turning';
                    if (tv) { tv.innerHTML = "👀"; tv.classList.replace('border-slate-600', 'border-yellow-500'); tv.classList.replace('bg-slate-800', 'bg-yellow-900/50'); }
                    nextStateChange = 25; // Brief warning
                } else if (window.schoolGameData.teacherState === 'turning') {
                    window.schoolGameData.teacherState = 'looking';
                    if (tv) { tv.innerHTML = "👁️👁️"; tv.classList.replace('border-yellow-500', 'border-red-500'); tv.classList.replace('bg-yellow-900/50', 'bg-red-900/50'); }
                    nextStateChange = 40 + Math.random() * 60; // Looks for a bit
                } else {
                    window.schoolGameData.teacherState = 'away';
                    if (tv) { tv.innerHTML = "👨‍🏫"; tv.classList.replace('border-red-500', 'border-slate-600'); tv.classList.replace('bg-red-900/50', 'bg-slate-800'); }
                    nextStateChange = 60 + Math.random() * 100;
                }
            }

            // Gameplay Logic
            if (window.schoolGameData.isEating) {
                if (window.schoolGameData.teacherState === 'looking') {
                    // BUSTED!
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(false, "BUSTED", "The teacher caught you eating in class!", "😡", { gpa: -0.05, stress: 20, energy: -5 });
                    return;
                }
                
                window.schoolGameData.progress += 0.8;
                const progEl = document.getElementById('snack-progress');
                if (progEl) progEl.style.width = Math.min(100, window.schoolGameData.progress) + '%';

                if (window.schoolGameData.progress >= 100) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(true, "DELICIOUS", "You stealthily finished your snack.", "🥔", { energy: +15, stress: -10 });
                }
            }
        }, 16);
    }, 100);
};

// 3. Paper Toss (Timing / Aim)
window.startSchoolGame_paper_toss = function() {
    window.schoolGameData = { time: 10, targetPos: 50, frame: 0, active: true };

    window.shootPaper = function() {
        if (!window.schoolGameData.active) return;
        
        let currentPos = 50 + Math.sin(window.schoolGameData.frame * 0.1) * 45;
        let diff = Math.abs(currentPos - 50);

        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);

        const paper = document.getElementById('toss-paper');
        if (paper) {
            paper.style.bottom = "80%";
            paper.style.transform = `translateX(-50%) scale(0.5)`;
        }

        setTimeout(() => {
            if (diff < 10) { // Success
                window.finishSchoolMinigame(true, "KOBE!", "Perfect three-pointer into the trash can. The class cheered silently.", "🗑️", { social: 10, stress: -5 });
            } else { // Miss
                window.finishSchoolMinigame(false, "AIRBALL", "You missed the trash can and hit the teacher's desk.", "🤦", { gpa: -0.05, stress: 15, social: -5 });
            }
        }, 400);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Paper Toss</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Tap when the paper aligns perfectly with the trash can!</p>

            <div class="w-full h-48 bg-slate-900 border-4 border-slate-700 rounded-xl relative overflow-hidden shadow-inner mb-6" onmousedown="window.shootPaper()" ontouchstart="(e)=>{e.preventDefault(); window.shootPaper();}">
                <!-- The Target (Trash Can) -->
                <div class="absolute top-4 w-12 h-16 bg-slate-600 border-t-4 border-slate-500 rounded-b-lg flex items-center justify-center opacity-50 z-0" style="left: 50%; transform: translateX(-50%);">
                    🗑️
                </div>
                
                <!-- Target Zone Line -->
                <div class="absolute w-12 h-full border-x-2 border-dashed border-green-500/30 pointer-events-none" style="left: 50%; transform: translateX(-50%);"></div>

                <!-- Moving Paper Ball -->
                <div id="toss-paper" class="absolute bottom-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-xs z-10 transition-all duration-300" style="left: 50%; transform: translateX(-50%);">
                    📄
                </div>
            </div>
        </div>
    `;

    window.queueModal("Class Event", html, "Just Recycle It", "♻️", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "BORING", "You got up and threw it away normally.", "🚶", { social: -2, energy: -5 });
    });

    setTimeout(() => {
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            window.schoolGameData.frame++;

            if (window.schoolGameData.frame % 60 === 0) {
                window.schoolGameData.time--;
                const timerEl = document.getElementById('school-timer');
                if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";
                
                if (window.schoolGameData.time <= 0) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(false, "TOO SLOW", "The teacher turned around before you could throw.", "⏱️", { stress: 5 });
                }
            }

            // Move Paper side to side
            let pos = 50 + Math.sin(window.schoolGameData.frame * 0.1) * 45;
            const paper = document.getElementById('toss-paper');
            if (paper) paper.style.left = `${pos}%`;
        }, 16);
    }, 100);
};

// 4. Keep Awake (Button Mashing)
window.startSchoolGame_keep_awake = function() {
    window.schoolGameData = { awake: 100, time: 12, active: true };

    window.openEyes = function() {
        if (!window.schoolGameData.active) return;
        window.schoolGameData.awake = Math.min(100, window.schoolGameData.awake + 15);
        
        const btn = document.getElementById('awake-btn');
        if(btn) {
            btn.classList.add('scale-95', 'bg-slate-600');
            setTimeout(() => btn.classList.remove('scale-95', 'bg-slate-600'), 100);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Boring Lecture</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">12s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Mash the button to keep your heavy eyelids open!</p>
            
            <div class="w-full h-40 bg-slate-900 border-4 border-slate-700 rounded-xl relative overflow-hidden mb-6 shadow-inner flex items-center justify-center text-6xl">
                <!-- Eyelid Overlay -->
                <div id="eyelid-top" class="absolute top-0 left-0 w-full bg-slate-950 border-b-8 border-slate-900 transition-none z-10" style="height: 0%;"></div>
                <div id="eyelid-bot" class="absolute bottom-0 left-0 w-full bg-slate-950 border-t-8 border-slate-900 transition-none z-10" style="height: 0%;"></div>
                
                <!-- Eye Content -->
                <div class="z-0 animate-pulse text-slate-500">x_x</div>
            </div>

            <button id="awake-btn" onmousedown="window.openEyes()" ontouchstart="(e)=>{e.preventDefault(); window.openEyes();}" class="w-full py-4 bg-indigo-600 text-white text-2xl font-black rounded-xl uppercase tracking-widest shadow-md select-none">
                STAY AWAKE!
            </button>
        </div>
    `;

    window.queueModal("Class Event", html, "Just Sleep", "💤", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "ZONKED OUT", "You fell fast asleep and drooled on your notes.", "😴", { gpa: -0.1, energy: +20, stress: -10 });
    });

    setTimeout(() => {
        let frame = 0;
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.schoolGameData.time--;
                const timerEl = document.getElementById('school-timer');
                if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";
                
                if (window.schoolGameData.time <= 0) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(true, "SURVIVED", "You stayed awake for the whole lecture! You actually learned something.", "🧠", { gpa: 0.05, energy: -15, stress: 5 });
                }
            }

            // Eyes droop constantly
            window.schoolGameData.awake -= 0.6;
            
            // Calculate eyelid height (0 to 50%) based on awake (100 to 0)
            let droopPct = (1 - (window.schoolGameData.awake / 100)) * 50;

            const topLid = document.getElementById('eyelid-top');
            const botLid = document.getElementById('eyelid-bot');
            
            if (topLid) topLid.style.height = `${droopPct}%`;
            if (botLid) botLid.style.height = `${droopPct}%`;

            if (window.schoolGameData.awake <= 0) {
                window.schoolGameData.active = false;
                clearInterval(window.activeSchoolTimer);
                window.finishSchoolMinigame(false, "CAUGHT SLEEPING", "The teacher slammed a book on your desk. You were fast asleep.", "💥", { gpa: -0.1, stress: 20 });
            }
        }, 16);
    }, 100);
};

// 5. Pass the Note (Grid Movement)
window.startSchoolGame_pass_the_note = function() {
    window.schoolGameData = { desk: 0, required: 4, time: 15, teacherZone: 2, teacherDir: 1, active: true };

    window.passNote = function() {
        if (!window.schoolGameData.active) return;
        
        // If teacher is looking at the current desk + 1 (the space we are passing through)
        if (window.schoolGameData.teacherZone === window.schoolGameData.desk + 1) {
            window.schoolGameData.active = false;
            clearInterval(window.activeSchoolTimer);
            window.finishSchoolMinigame(false, "INTERCEPTED", "The teacher snatched the note from the air. You have detention.", "😡", { gpa: -0.05, social: -10, stress: 20 });
            return;
        }

        window.schoolGameData.desk++;
        renderNote();

        if (window.schoolGameData.desk >= window.schoolGameData.required) {
            window.schoolGameData.active = false;
            clearInterval(window.activeSchoolTimer);
            window.finishSchoolMinigame(true, "NOTE DELIVERED", "The note reached your crush successfully!", "💌", { social: 15, stress: -5 });
        }
    };

    const renderNote = () => {
        const p = document.getElementById('note-pos');
        if (p) {
            // Desk 0 is bottom, Desk 4 is top
            const bottomPct = (window.schoolGameData.desk / window.schoolGameData.required) * 80 + 10; 
            p.style.bottom = `${bottomPct}%`;
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Pass the Note</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Tap to pass the note forward, but don't pass when the red gaze is directly ahead!</p>

            <div class="relative w-32 h-48 mx-auto bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden mb-6 shadow-inner">
                <!-- Desk grid lines -->
                <div class="absolute inset-0 flex flex-col justify-between opacity-30">
                    <div class="h-px w-full bg-slate-400"></div><div class="h-px w-full bg-slate-400"></div><div class="h-px w-full bg-slate-400"></div><div class="h-px w-full bg-slate-400"></div>
                </div>

                <!-- Teacher Gaze -->
                <div id="teacher-gaze" class="absolute w-full h-1/4 bg-red-500/50 border-y-2 border-red-400 transition-all duration-300" style="bottom: 50%;"></div>
                
                <!-- The Note -->
                <div id="note-pos" class="absolute w-8 h-8 bg-white border border-slate-300 shadow flex items-center justify-center text-xs transition-all duration-300 z-10" style="left: 50%; transform: translateX(-50%); bottom: 10%;">
                    💌
                </div>
            </div>

            <button onclick="window.passNote()" class="w-full py-4 bg-indigo-600 text-white font-black rounded-xl active:bg-indigo-500 active:scale-95 transition-all shadow-md uppercase tracking-widest">
                PASS FORWARD
            </button>
        </div>
    `;

    window.queueModal("Class Event", html, "Rip it up (-Social)", "🗑️", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "CHICKENED OUT", "You chickened out and threw the note away.", "🐔", { social: -5 });
    });

    setTimeout(() => {
        let frame = 0;
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.schoolGameData.time--;
                const timerEl = document.getElementById('school-timer');
                if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";
                
                if (window.schoolGameData.time <= 0) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(false, "TOO SLOW", "The bell rang. You missed your chance.", "⏱️", { stress: 5 });
                }
            }

            // Move Teacher Gaze (0 to 4)
            if (frame % 45 === 0) {
                window.schoolGameData.teacherZone += window.schoolGameData.teacherDir;
                if (window.schoolGameData.teacherZone >= window.schoolGameData.required || window.schoolGameData.teacherZone <= 1) {
                    window.schoolGameData.teacherDir *= -1; // Bounce
                }
                const gaze = document.getElementById('teacher-gaze');
                if (gaze) {
                    const botPct = (window.schoolGameData.teacherZone / window.schoolGameData.required) * 80 + 10;
                    gaze.style.bottom = `calc(${botPct}% - 12%)`; 
                }
            }

        }, 16);
    }, 100);
};

// 6. Chem Lab Mix (Color Logic)
window.startSchoolGame_chem_lab_mix = function() {
    // Recipes
    const recipes = [
        { name: 'PURPLE', req: ['red', 'blue'], bg: 'bg-purple-500' },
        { name: 'GREEN', req: ['blue', 'yellow'], bg: 'bg-green-500' },
        { name: 'ORANGE', req: ['red', 'yellow'], bg: 'bg-orange-500' }
    ];
    
    window.schoolGameData = { time: 10, target: recipes[Math.floor(Math.random() * recipes.length)], selected: [], active: true };

    window.addChem = function(color) {
        if (!window.schoolGameData.active) return;
        if (window.schoolGameData.selected.length < 2 && !window.schoolGameData.selected.includes(color)) {
            window.schoolGameData.selected.push(color);
            
            // Visual Update
            const beaker = document.getElementById('chem-beaker');
            if (beaker) {
                if (window.schoolGameData.selected.length === 1) {
                    beaker.className = `w-16 h-16 rounded-b-3xl border-4 border-slate-400 bg-${color}-500/50 mt-auto`;
                } else {
                    beaker.className = `w-16 h-16 rounded-b-3xl border-4 border-slate-400 bg-slate-600 animate-pulse mt-auto`; // Mixed generic until check
                }
            }
        }
    };

    window.mixChem = function() {
        if (!window.schoolGameData.active || window.schoolGameData.selected.length !== 2) return;
        
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);

        let sel = window.schoolGameData.selected;
        let req = window.schoolGameData.target.req;
        
        // Check if selection matches requirements (order independent)
        let isCorrect = (sel.includes(req[0]) && sel.includes(req[1]));

        const beaker = document.getElementById('chem-beaker');

        if (isCorrect) {
            if(beaker) beaker.className = `w-16 h-16 rounded-b-3xl border-4 border-slate-400 ${window.schoolGameData.target.bg} mt-auto shadow-[0_0_20px_rgba(255,255,255,0.8)]`;
            setTimeout(() => {
                window.finishSchoolMinigame(true, "EUREKA!", "Perfect chemical synthesis. A+.", "🧪", { gpa: 0.1, energy: -5 });
            }, 600);
        } else {
            if(beaker) beaker.className = `w-16 h-16 rounded-b-3xl border-4 border-slate-400 bg-slate-900 mt-auto shadow-[0_0_20px_rgba(0,0,0,1)]`;
            setTimeout(() => {
                window.finishSchoolMinigame(false, "EXPLOSION!", "You mixed the wrong chemicals and blew up the beaker.", "💥", { gpa: -0.05, stress: 15, energy: -15 });
            }, 600);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Chem Lab</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">Combine two base colors to create <span class="${window.schoolGameData.target.bg.replace('bg-', 'text-')} font-black">${window.schoolGameData.target.name}</span>!</p>

            <div class="flex justify-center gap-6 mb-6">
                <button onclick="window.addChem('red')" class="w-10 h-24 bg-red-500 border-4 border-slate-300 rounded-b-full rounded-t hover:scale-105 active:scale-95 transition-transform flex flex-col justify-end pb-2 shadow-lg"><div class="text-white text-[8px] font-bold">RED</div></button>
                <button onclick="window.addChem('blue')" class="w-10 h-24 bg-blue-500 border-4 border-slate-300 rounded-b-full rounded-t hover:scale-105 active:scale-95 transition-transform flex flex-col justify-end pb-2 shadow-lg"><div class="text-white text-[8px] font-bold">BLU</div></button>
                <button onclick="window.addChem('yellow')" class="w-10 h-24 bg-yellow-400 border-4 border-slate-300 rounded-b-full rounded-t hover:scale-105 active:scale-95 transition-transform flex flex-col justify-end pb-2 shadow-lg"><div class="text-black text-[8px] font-bold">YEL</div></button>
            </div>

            <div class="flex flex-col items-center mb-4 h-24 bg-slate-800 p-2 border-2 border-slate-700 rounded-xl">
                <div class="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">Mixing Beaker</div>
                <div id="chem-beaker" class="w-16 h-16 rounded-b-3xl border-4 border-slate-400 bg-transparent mt-auto transition-colors duration-300"></div>
            </div>

            <button onclick="window.mixChem()" class="w-full py-4 bg-emerald-600 text-white font-black rounded-xl active:bg-emerald-500 active:scale-95 transition-all shadow-md uppercase tracking-widest">
                MIX IT!
            </button>
        </div>
    `;

    window.queueModal("Class Event", html, "Flee Lab", "🏃", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "SKIPPED LAB", "You refused to participate in the experiment.", "🧪", { gpa: -0.1 });
    });

    setTimeout(() => {
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            window.schoolGameData.time--;
            const timerEl = document.getElementById('school-timer');
            if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";
            
            if (window.schoolGameData.time <= 0) {
                window.schoolGameData.active = false;
                clearInterval(window.activeSchoolTimer);
                window.finishSchoolMinigame(false, "TOO SLOW", "Class is over. You failed the assignment.", "⏱️", { gpa: -0.05, stress: 5 });
            }
        }, 1000);
    }, 100);
};

// 7. Hallway Dodger (Lane Switching)
window.startSchoolGame_hallway_dodger = function() {
    window.schoolGameData = { time: 15, lane: 1, obs: [], active: true };

    window.moveHallway = function(dir) {
        if (!window.schoolGameData.active) return;
        window.schoolGameData.lane += dir;
        if (window.schoolGameData.lane < 0) window.schoolGameData.lane = 0;
        if (window.schoolGameData.lane > 2) window.schoolGameData.lane = 2;
        
        const player = document.getElementById('hall-player');
        if (player) {
            player.style.left = `calc(${16.6 + (window.schoolGameData.lane * 33.3)}% - 16px)`;
        }
    };

    const spawnHallObs = () => {
        if (!window.schoolGameData.active) return;
        const area = document.getElementById('hall-area');
        if (!area) return;

        const id = Date.now() + Math.random();
        const lane = Math.floor(Math.random() * 3);
        const obj = { id, lane, y: -20, speed: 1.5 + Math.random() };
        window.schoolGameData.obs.push(obj);

        const el = document.createElement('div');
        el.id = `hobs-${id}`;
        el.className = "absolute text-3xl transition-none z-10 opacity-80";
        el.innerHTML = "🚶"; // Freshman
        el.style.left = `calc(${16.6 + (lane * 33.3)}% - 16px)`;
        el.style.top = '-20%';
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Hallway Rush</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Dodge the slow-walking freshmen to get to class on time!</p>

            <div id="hall-area" class="relative w-full h-48 bg-slate-300 border-4 border-slate-400 rounded-xl overflow-hidden mb-4 shadow-inner">
                <!-- Lane Dividers -->
                <div class="absolute w-full h-full flex justify-between px-[33%] opacity-20">
                    <div class="h-full w-2 bg-slate-500"></div>
                    <div class="h-full w-2 bg-slate-500"></div>
                </div>

                <!-- Player -->
                <div id="hall-player" class="absolute bottom-4 text-3xl z-20 transition-all duration-150 ease-out drop-shadow-md" style="left: calc(50% - 16px);">
                    🏃
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.moveHallway(-1)" class="py-4 bg-slate-700 text-white font-black text-2xl rounded-xl hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">⬅️</button>
                <button onclick="window.moveHallway(1)" class="py-4 bg-slate-700 text-white font-black text-2xl rounded-xl hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">➡️</button>
            </div>
        </div>
    `;

    window.queueModal("Passing Period", html, "Walk Slowly (-10 Perf)", "🎒", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "TARDY", "You got stuck behind a couple holding hands.", "⏰", { stress: 10, energy: -5 });
    });

    setTimeout(() => {
        let frame = 0;
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.schoolGameData.time--;
                const timerEl = document.getElementById('school-timer');
                if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";
                
                if (window.schoolGameData.time <= 0) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(true, "ON TIME", "You threaded the needle and made it before the bell.", "🏫", { stress: -10, energy: -15 });
                }
            }

            if (frame % 35 === 0) spawnHallObs();

            // Physics & Collision
            for (let i = 0; i < window.schoolGameData.obs.length; i++) {
                let o = window.schoolGameData.obs[i];
                o.y += o.speed;
                const el = document.getElementById(`hobs-${o.id}`);
                if (el) el.style.top = o.y + '%';

                // Collision Box (Player is at bottom 80-95%)
                if (o.y > 75 && o.y < 95 && o.lane === window.schoolGameData.lane) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    if(el) el.innerHTML = "💥";
                    document.getElementById('hall-player').innerHTML = "😵";
                    setTimeout(() => {
                        window.finishSchoolMinigame(false, "CRASH", "You plowed right into a freshman and dropped all your books.", "📚", { stress: 20, social: -5, energy: -10 });
                    }, 500);
                    return;
                }

                if (o.y > 110) {
                    if (el) el.remove();
                    window.schoolGameData.obs.splice(i, 1);
                    i--;
                }
            }
        }, 16);
    }, 100);
};

// 8. Doodle Master (Scrubbing logic)
window.startSchoolGame_doodle_master = function() {
    window.schoolGameData = { drawn: 0, required: 50, lastX: -1, time: 8, active: true };

    window.drawDoodle = function(e) {
        if (!window.schoolGameData.active) return;

        let currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        
        if (window.schoolGameData.lastX !== -1) {
            let delta = Math.abs(currentX - window.schoolGameData.lastX);
            window.schoolGameData.drawn += delta * 0.1; 
        }
        window.schoolGameData.lastX = currentX;

        const drawingEl = document.getElementById('notebook-drawing');
        if (drawingEl) {
            // Opacity goes from 0 to 1 as drawn increases
            drawingEl.style.opacity = Math.min(1, window.schoolGameData.drawn / window.schoolGameData.required);
        }

        // Win check
        if (window.schoolGameData.drawn >= window.schoolGameData.required) {
            window.schoolGameData.active = false;
            clearInterval(window.activeSchoolTimer);
            window.finishSchoolMinigame(true, "MASTERPIECE", "A beautiful doodle of a dragon. Highly relaxing.", "🐉", { stress: -20, energy: -5 });
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Doodle Time</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Swipe rapidly across the notebook to finish your drawing before class ends!</p>

            <div class="w-full h-48 bg-yellow-50 border-4 border-yellow-200 rounded-lg relative overflow-hidden shadow-inner cursor-crosshair"
                 style="background-image: repeating-linear-gradient(transparent, transparent 19px, #60a5fa 20px);"
                 onmousemove="window.drawDoodle(event)"
                 ontouchmove="(e)=>{e.preventDefault(); window.drawDoodle(e);}">
                
                <!-- The Drawing (Hidden at first) -->
                <div id="notebook-drawing" class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-75">
                    <div class="text-8xl text-indigo-900/80 transform -rotate-12">🐉</div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Class Event", html, "Pay Attention", "📓", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(true, "FOCUSED", "You decided to actually take notes.", "📝", { gpa: 0.05, energy: -10 });
    });

    setTimeout(() => {
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            window.schoolGameData.time--;
            const timerEl = document.getElementById('school-timer');
            if (timerEl) timerEl.innerText = window.schoolGameData.time + "s";

            if (window.schoolGameData.time <= 0) {
                window.schoolGameData.active = false;
                clearInterval(window.activeSchoolTimer);
                window.finishSchoolMinigame(false, "HALF BAKED", "The bell rang and your drawing looks like a potato.", "🥔", { stress: 5 });
            }
        }, 1000);
    }, 100);
};

// 9. Locker Jam (Spin & Timing)
window.startSchoolGame_locker_jam = function() {
    window.schoolGameData = { time: 15, locks: 0, required: 3, frame: 0, active: true };

    window.stopDial = function() {
        if (!window.schoolGameData.active) return;
        
        const speed = 0.08 + (window.schoolGameData.locks * 0.03);
        const currentRot = (window.schoolGameData.frame * speed * (180/Math.PI)) % 360;
        
        // Target is at top (0 degrees). Give a window of ~15 degrees.
        // We evaluate distance to 0 or 360
        let dist = Math.min(currentRot, 360 - currentRot);

        if (dist < 20) { // Success
            window.schoolGameData.locks++;
            
            // Visual Update
            const p = document.getElementById(`lock-p-${window.schoolGameData.locks}`);
            if(p) p.classList.replace('bg-slate-700', 'bg-green-500');

            if (window.schoolGameData.locks >= window.schoolGameData.required) {
                window.schoolGameData.active = false;
                clearInterval(window.activeSchoolTimer);
                setTimeout(() => {
                    window.finishSchoolMinigame(true, "UNLOCKED", "You popped the locker open just in time!", "🔓", { stress: -5, social: 5 });
                }, 300);
            }
        } else {
            // Missed!
            window.schoolGameData.active = false;
            clearInterval(window.activeSchoolTimer);
            const dial = document.getElementById('locker-dial');
            if(dial) dial.classList.add('border-red-500', 'bg-red-500/30');
            setTimeout(() => {
                window.finishSchoolMinigame(false, "JAMMED", "You messed up the combo. Now you're late.", "🔒", { gpa: -0.05, stress: 15 });
            }, 600);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Locker Jam</h2>
                <div class="text-2xl font-black text-red-400" id="school-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Tap to stop the spinning dial exactly in the <span class="text-green-400 font-bold">TOP ZONE</span> three times!</p>

            <div class="flex justify-center gap-2 mb-4">
                <div id="lock-p-1" class="w-4 h-4 rounded-full bg-slate-700 transition-colors"></div>
                <div id="lock-p-2" class="w-4 h-4 rounded-full bg-slate-700 transition-colors"></div>
                <div id="lock-p-3" class="w-4 h-4 rounded-full bg-slate-700 transition-colors"></div>
            </div>

            <div class="relative w-40 h-40 mx-auto bg-slate-800 rounded-full border-8 border-slate-600 shadow-xl flex items-center justify-center cursor-pointer mb-6"
                 onmousedown="window.stopDial()" ontouchstart="(e)=>{e.preventDefault(); window.stopDial();}">
                
                <!-- Target Zone Overlay -->
                <div class="absolute top-0 w-8 h-8 border-x-4 border-t-4 border-green-500 rounded-t-lg z-0 opacity-50"></div>
                
                <!-- Spinning Dial -->
                <div id="locker-dial" class="w-full h-full rounded-full transition-none z-10 flex items-start justify-center pt-2">
                    <!-- Dial Marker -->
                    <div class="w-2 h-6 bg-acs-gold rounded-full shadow"></div>
                </div>
                
                <!-- Center Hub -->
                <div class="absolute w-12 h-12 bg-slate-900 rounded-full border-4 border-slate-700 z-20 pointer-events-none"></div>
            </div>
        </div>
    `;

    window.queueModal("Hallway Event", html, "Kick It (-Perf)", "🥾", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(false, "BROKEN", "You kicked the locker and bruised your toe.", "🩹", { stress: 20, energy: -10 });
    });

    setTimeout(() => {
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            window.schoolGameData.frame++;

            // Timer
            if (window.schoolGameData.frame % 60 === 0) {
                window.schoolGameData.time--;
                const timerEl = document.getElementById('school-timer');
                if(timerEl) timerEl.innerText = window.schoolGameData.time + "s";
                
                if (window.schoolGameData.time <= 0) {
                    window.schoolGameData.active = false;
                    clearInterval(window.activeSchoolTimer);
                    window.finishSchoolMinigame(false, "LATE", "You wrestled with the lock too long and missed the bell.", "⏱️", { gpa: -0.05, stress: 10 });
                }
            }

            // Spin Dial
            const speed = 0.08 + (window.schoolGameData.locks * 0.03); // Speeds up
            let rot = window.schoolGameData.frame * speed;
            const dial = document.getElementById('locker-dial');
            if (dial) dial.style.transform = `rotate(${rot}rad)`;

        }, 16);
    }, 100);
};

// 10. Desk Drummer (Rhythm Tapping)
window.startSchoolGame_desk_drummer = function() {
    window.schoolGameData = { hits: 0, misses: 0, required: 5, notes: [], frame: 0, active: true };

    const spawnNote = () => {
        if (!window.schoolGameData.active) return;
        const area = document.getElementById('rhythm-area');
        if (!area) return;

        const id = Date.now() + Math.random();
        // Spawns from right to left
        const obj = { id, x: 100 };
        window.schoolGameData.notes.push(obj);

        const el = document.createElement('div');
        el.id = `rnote-${id}`;
        el.className = "absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-md z-10 transition-none flex items-center justify-center text-xs";
        el.innerHTML = "🎵";
        el.style.left = '100%';
        area.appendChild(el);
    };

    window.hitDrum = function() {
        if (!window.schoolGameData.active) return;
        
        // Check for notes in the hit zone (10% to 25% X)
        let hitId = -1;
        for (let i = 0; i < window.schoolGameData.notes.length; i++) {
            let n = window.schoolGameData.notes[i];
            if (n.x > 5 && n.x < 30) {
                hitId = i;
                break;
            }
        }

        const btn = document.getElementById('drum-btn');
        const target = document.getElementById('rhythm-target');

        if (hitId > -1) {
            // Hit!
            const n = window.schoolGameData.notes[hitId];
            const el = document.getElementById(`rnote-${n.id}`);
            if(el) {
                el.innerHTML = "✨";
                el.classList.add('scale-150', 'opacity-0');
                setTimeout(()=>el.remove(), 200);
            }
            window.schoolGameData.notes.splice(hitId, 1);
            
            window.schoolGameData.hits++;
            document.getElementById('drum-count').innerText = `${window.schoolGameData.hits}/${window.schoolGameData.required}`;
            
            if(btn) btn.classList.replace('bg-indigo-600', 'bg-green-500');
            if(target) target.classList.add('border-green-400', 'bg-green-400/30');
            setTimeout(() => {
                if(btn) btn.classList.replace('bg-green-500', 'bg-indigo-600');
                if(target) target.classList.remove('border-green-400', 'bg-green-400/30');
            }, 150);

            if (window.schoolGameData.hits >= window.schoolGameData.required) {
                window.schoolGameData.active = false;
                clearInterval(window.activeSchoolTimer);
                setTimeout(()=> window.finishSchoolMinigame(true, "SICK BEATS", "The class was impressed by your pencil drumming.", "🥁", { social: 15, stress: -10 }), 300);
            }
        } else {
            // Miss click
            window.schoolGameData.misses++;
            if(btn) btn.classList.replace('bg-indigo-600', 'bg-red-500');
            if(target) target.classList.add('border-red-500', 'bg-red-500/30');
            setTimeout(() => {
                if(btn) btn.classList.replace('bg-red-500', 'bg-indigo-600');
                if(target) target.classList.remove('border-red-500', 'bg-red-500/30');
            }, 150);

            if (window.schoolGameData.misses >= 3) {
                window.schoolGameData.active = false;
                clearInterval(window.activeSchoolTimer);
                setTimeout(()=> window.finishSchoolMinigame(false, "NO RHYTHM", "You kept dropping the beat. Awkward.", "🤦", { social: -10, stress: 10 }), 300);
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-4">Desk Drummer</h2>
            <p class="text-[10px] text-slate-400 mb-6">Tap the button when the notes cross the target! Don't miss 3 times.</p>
            
            <div class="flex justify-between text-sm font-bold text-slate-300 mb-2 px-4">
                <span>Hits: <span id="drum-count" class="text-green-400">0/5</span></span>
                <span>Misses: <span class="text-red-400">3 allowed</span></span>
            </div>

            <div id="rhythm-area" class="relative w-full h-24 bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner mb-6 flex items-center">
                <!-- Track Line -->
                <div class="absolute w-full h-1 bg-slate-700"></div>
                
                <!-- Target Zone -->
                <div id="rhythm-target" class="absolute w-12 h-16 border-4 border-white rounded-lg transition-colors z-0" style="left: 15%;"></div>
            </div>

            <button id="drum-btn" onmousedown="window.hitDrum()" ontouchstart="(e)=>{e.preventDefault(); window.hitDrum();}" class="w-full py-6 bg-indigo-600 text-white text-3xl font-black rounded-xl active:scale-95 transition-all shadow-md uppercase tracking-widest">
                TAP!
            </button>
        </div>
    `;

    window.queueModal("Class Event", html, "Sit Quietly", "🤫", () => {
        window.schoolGameData.active = false;
        clearInterval(window.activeSchoolTimer);
        window.finishSchoolMinigame(true, "BORING", "You decided not to make a scene.", "🚶", { energy: -5 });
    });

    setTimeout(() => {
        window.activeSchoolTimer = setInterval(() => {
            if (!window.schoolGameData.active) return;
            window.schoolGameData.frame++;

            // Spawning Pattern
            if (window.schoolGameData.frame % 80 === 0) spawnNote();

            // Movement Physics
            for (let i = 0; i < window.schoolGameData.notes.length; i++) {
                let n = window.schoolGameData.notes[i];
                n.x -= 1.2; // Move left
                
                const el = document.getElementById(`rnote-${n.id}`);
                if (el) el.style.left = n.x + '%';

                // Passed target without hitting (Miss)
                if (n.x < 0) {
                    if (el) el.remove();
                    window.schoolGameData.notes.splice(i, 1);
                    i--;
                    
                    window.schoolGameData.misses++;
                    const target = document.getElementById('rhythm-target');
                    if(target) { target.classList.add('border-red-500', 'bg-red-500/30'); setTimeout(()=>target.classList.remove('border-red-500', 'bg-red-500/30'), 200); }

                    if (window.schoolGameData.misses >= 3) {
                        window.schoolGameData.active = false;
                        clearInterval(window.activeSchoolTimer);
                        window.finishSchoolMinigame(false, "LOST THE BEAT", "The notes passed you by.", "🤦", { social: -5, stress: 5 });
                        return;
                    }
                }
            }
        }, 16);
    }, 100);
};