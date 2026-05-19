// --- HOLIDAY EVENT & SPINNER LOGIC ---

window.startHolidaySpinner = function(holiday) {
    window.currentHolidayEvent = holiday; // Store reference to trigger the minigame later

    const data = holiday.spinData;
    if (!data) {
        console.error("Missing spin data for holiday:", holiday.name);
        return; 
    }

    // CSS Gradient string for the 4 quadrants
    const gradient = `conic-gradient(
        ${data[0].color} 0deg 90deg, 
        ${data[1].color} 90deg 180deg, 
        ${data[2].color} 180deg 270deg, 
        ${data[3].color} 270deg 360deg
    )`;

    const gameHtml = `
        <div class="max-w-md mx-auto py-2 select-none text-center">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">SPECIAL DAY EVENT</h1>
            <div class="text-6xl mb-2">${holiday.icon}</div>
            <h2 class="text-2xl font-black uppercase italic text-white mb-6">${holiday.name}</h2>
            
            <!-- SPINNER -->
            <div class="relative w-64 h-64 mx-auto mb-8">
                <!-- Wheel -->
                <div id="holiday-wheel" class="w-full h-full rounded-full border-4 border-slate-700 shadow-xl transition-transform duration-[3s] ease-out"
                     style="background: ${gradient}; transform: rotate(0deg);">
                     
                     <div class="absolute top-[15%] right-[15%] text-xs font-black text-white drop-shadow-md rotate-45">${data[0].label}</div>
                     <div class="absolute bottom-[15%] right-[15%] text-xs font-black text-white drop-shadow-md rotate-[135deg]">${data[1].label}</div>
                     <div class="absolute bottom-[15%] left-[15%] text-xs font-black text-white drop-shadow-md rotate-[225deg]">${data[2].label}</div>
                     <div class="absolute top-[15%] left-[15%] text-xs font-black text-white drop-shadow-md rotate-[315deg]">${data[3].label}</div>
                </div>

                <!-- Pointer (Pointing UP) -->
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg">⬇️</div>
                
                <!-- Center Cap -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-600"></div>
            </div>

            <button onclick="window.spinHolidayWheel()" id="btn-spin" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl hover:bg-indigo-500 transition-all">SPIN!</button>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: gameHtml,
        onOpen: () => {
            window.currentSpinData = data;
        }
    });
    window.processModalQueue();
};

window.spinHolidayWheel = function() {
    const wheel = document.getElementById('holiday-wheel');
    const btn = document.getElementById('btn-spin');
    
    if (!wheel) return;
    
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    const randomDeg = Math.floor(Math.random() * 360);
    const totalSpin = 1440 + randomDeg; // 4 spins + random

    wheel.style.transform = `rotate(-${totalSpin}deg)`;

    setTimeout(() => {
        const finalAngle = totalSpin % 360;
        let index = 0;

        // 0-90: Q1 (Index 0), 90-180: Q2 (Index 1), etc.
        if (finalAngle < 90) index = 0;
        else if (finalAngle < 180) index = 1;
        else if (finalAngle < 270) index = 2;
        else index = 3;

        const result = window.currentSpinData[index];
        window.resolveHolidaySpin(result);

    }, 3100);
};

window.resolveHolidaySpin = function(result) {
    document.getElementById('modal-overlay').classList.add('hidden');
    
    if (result.effect.cash) state.balance += result.effect.cash;
    if (result.effect.stress) state.stress = Math.max(0, Math.min(100, state.stress + result.effect.stress));
    if (result.effect.energy) state.energy = Math.max(0, Math.min(100, state.energy + result.effect.energy));
    if (result.effect.grades) state.grades = Math.max(0, Math.min(100, state.grades + result.effect.grades));
    if (result.effect.hungerSet !== undefined) state.hungerLevel = result.effect.hungerSet;

    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">`;
    if (result.effect.cash) html += `<div class="${result.effect.cash>0?'text-green-400':'text-red-400'} flex justify-between"><span>Money</span><span>${result.effect.cash>0?'+':''}$${result.effect.cash}</span></div>`;
    if (result.effect.stress) html += `<div class="${result.effect.stress<0?'text-green-400':'text-red-400'} flex justify-between"><span>Stress</span><span>${result.effect.stress>0?'+':''}${result.effect.stress}%</span></div>`;
    if (result.effect.energy) html += `<div class="${result.effect.energy>0?'text-green-400':'text-red-400'} flex justify-between"><span>Energy</span><span>${result.effect.energy>0?'+':''}${result.effect.energy}%</span></div>`;
    if (result.effect.grades) html += `<div class="${result.effect.grades>0?'text-green-400':'text-red-400'} flex justify-between"><span>GPA</span><span>${result.effect.grades>0?'+':''}${result.effect.grades}%</span></div>`;
    html += `</div>`;

    window.queueModal(result.label.toUpperCase(), result.msg + html, "Next", "🎁", () => {
        // Route to the corresponding minigame
        window.routeHolidayMinigame(window.currentHolidayEvent.name);
    });
};

// --- HOLIDAY MINIGAMES FRAMEWORK ---

window.routeHolidayMinigame = function(holidayName) {
    // Map Holiday Names to their functions
    const map = {
        "First Day of School": window.startHolidayGame_syllabus,
        "Laborious Day": window.startHolidayGame_labor,
        "Friendsgiving": window.startHolidayGame_friendsgiving,
        "Skel-o-ween": window.startHolidayGame_skeloween,
        "New Winter's Day": window.startHolidayGame_new_winter,
        "Midwinter's Day": window.startHolidayGame_midwinter,
        "Wintermas": window.startHolidayGame_wintermas,
        "Raccoon Day": window.startHolidayGame_raccoon,
        "Love's Day": window.startHolidayGame_love,
        "Spring Jubilee": window.startHolidayGame_jubilee,
        "Fool's Day": window.startHolidayGame_fool,
        "Last Day of School": window.startHolidayGame_breakout,
        "Grilldependence Day": window.startHolidayGame_grill,
        "End of Vacation": window.startHolidayGame_sunscreen
    };

    if (map[holidayName]) {
        map[holidayName]();
    } else {
        // Fallback to updating UI if no minigame exists
        if (typeof window.updateUI === 'function') window.updateUI(); 
    }
};

window.finishHolidayGame = function(success, msg, icon) {
    if (window.activeHolidayTimer) clearInterval(window.activeHolidayTimer);
    document.getElementById('modal-overlay').classList.add('hidden');
    
    // NOTE: This is a placeholder completion handler. 
    // Later, we will integrate this with the Holiday Spinner rewards system!
    setTimeout(() => {
        window.queueModal(success ? "SUCCESS!" : "FAILED...", msg, "Continue", icon, () => {
            if (typeof window.updateUI === 'function') window.updateUI(); // Back to main dashboard!
        });
    }, 100);
};

// ==========================================
// FALL MINIGAMES
// ==========================================

// 1. First Day of School (Syllabus Scramble - Conveyor Belt)
window.startHolidayGame_syllabus = function() {
    window.holidayGameData = { time: 10, collected: 0, required: 5, items: [], frame: 0, active: true };

    const goodItems = ['📚', '✏️', '💻'];
    const badItems = ['🎮', '🥪', '🪀'];

    window.grabSyllabusItem = function(id, isGood) {
        if (!window.holidayGameData.active) return;
        
        const el = document.getElementById(`sitem-${id}`);
        if (el) el.remove();

        // Find and remove from array
        const idx = window.holidayGameData.items.findIndex(i => i.id === id);
        if (idx > -1) window.holidayGameData.items.splice(idx, 1);

        if (isGood) {
            window.holidayGameData.collected++;
            document.getElementById('syllabus-count').innerText = `${window.holidayGameData.collected}/${window.holidayGameData.required}`;
            
            if (window.holidayGameData.collected >= window.holidayGameData.required) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                window.finishHolidayGame(true, "You packed all your school supplies! You are ready to learn.", "🎒");
            }
        } else {
            window.holidayGameData.active = false;
            clearInterval(window.activeHolidayTimer);
            window.finishHolidayGame(false, "You accidentally packed a distraction. The teacher confiscated it immediately.", "🎮");
        }
    };

    const spawnItem = () => {
        if (!window.holidayGameData.active) return;
        const area = document.getElementById('syllabus-belt');
        if (!area) return;

        const id = Date.now() + Math.random();
        const isGood = Math.random() > 0.4; // 60% chance for good item
        const icon = isGood ? goodItems[Math.floor(Math.random() * goodItems.length)] : badItems[Math.floor(Math.random() * badItems.length)];
        
        window.holidayGameData.items.push({ id, x: 100, speed: 1.0 + Math.random() * 0.5 });

        const el = document.createElement('div');
        el.id = `sitem-${id}`;
        el.className = "absolute top-1/2 -translate-y-1/2 text-4xl cursor-pointer hover:scale-110 active:scale-95 transition-transform drop-shadow-md z-10";
        el.innerHTML = icon;
        el.style.left = '100%';
        el.onmousedown = () => window.grabSyllabusItem(id, isGood);
        el.ontouchstart = (e) => { e.preventDefault(); window.grabSyllabusItem(id, isGood); };
        
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Pack Your Bag</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">Tap the school supplies (📚, ✏️, 💻) as they roll by. Avoid the distractions!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Packed: <span id="syllabus-count" class="text-green-400">0/5</span></div>

            <div id="syllabus-belt" class="relative w-full h-32 bg-slate-800 border-4 border-slate-600 rounded-xl overflow-hidden shadow-inner flex items-center">
                <!-- Conveyor Belt Detail -->
                <div class="absolute inset-0 opacity-20 pointer-events-none" style="background: repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 24px);"></div>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Skip Class", "🏫", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You showed up with nothing but a half-eaten sandwich.", "🥪");
    });

    setTimeout(() => {
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            window.holidayGameData.frame++;

            if (window.holidayGameData.frame % 60 === 0) {
                window.holidayGameData.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
                
                if (window.holidayGameData.time <= 0) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(false, "The bus left without you! Your bag is empty.", "⏱️");
                }
            }

            if (window.holidayGameData.frame % 40 === 0) spawnItem();

            // Move items
            for (let i = 0; i < window.holidayGameData.items.length; i++) {
                let it = window.holidayGameData.items[i];
                it.x -= it.speed;
                const el = document.getElementById(`sitem-${it.id}`);
                if (el) el.style.left = it.x + '%';

                if (it.x < -20) {
                    if (el) el.remove();
                    window.holidayGameData.items.splice(i, 1);
                    i--;
                }
            }
        }, 16);
    }, 100);
};

// 2. Laborious Day (Heavy Lifting - Button Mashing)
window.startHolidayGame_labor = function() {
    window.holidayGameData = { time: 8, progress: 15, active: true };

    window.liftCouch = function() {
        if (!window.holidayGameData.active) return;
        window.holidayGameData.progress = Math.min(100, window.holidayGameData.progress + 8);
        
        // Button visual feedback
        const btn = document.getElementById('btn-lift');
        if(btn) {
            btn.classList.add('scale-95', 'bg-orange-500');
            setTimeout(() => btn.classList.remove('scale-95', 'bg-orange-500'), 100);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Heavy Lifting</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Mash the button to carry the couch up the stairs!</p>
            
            <div class="relative w-16 h-48 mx-auto bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden mb-6 shadow-inner flex flex-col justify-end">
                <div class="absolute w-full h-1 bg-green-500/50 z-0" style="top: 10%;"></div>
                
                <div id="lift-bar" class="w-full bg-orange-600 transition-none z-10 relative flex justify-center items-start" style="height: 15%;">
                    <div class="text-3xl -mt-6">🛋️</div>
                </div>
            </div>

            <button id="btn-lift" onmousedown="window.liftCouch()" ontouchstart="(e)=>{e.preventDefault(); window.liftCouch();}" class="w-full py-6 bg-orange-700 text-white font-black text-2xl rounded-xl uppercase tracking-widest shadow-md transition-all">
                PIVOT!
            </button>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Drop It", "💥", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You dropped the couch down the stairs. Your friend is furious.", "🤦");
    });

    setTimeout(() => {
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;

            window.holidayGameData.progress -= 0.8; // Gravity
            if (window.holidayGameData.progress < 5) window.holidayGameData.progress = 5;

            const bar = document.getElementById('lift-bar');
            if (bar) bar.style.height = window.holidayGameData.progress + '%';

            if (window.holidayGameData.progress >= 95) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                window.finishHolidayGame(true, "You got the couch to the second floor! You deserve a nap.", "💪");
            }
        }, 16);

        // Timer interval separated to keep gravity smooth at 60fps
        let timeRemaining = 8;
        window.holidayTimeInt = setInterval(() => {
            if (!window.holidayGameData.active) { clearInterval(window.holidayTimeInt); return; }
            timeRemaining--;
            const timerEl = document.getElementById('holiday-timer');
            if (timerEl) timerEl.innerText = timeRemaining + "s";

            if (timeRemaining <= 0) {
                window.holidayGameData.active = false;
                clearInterval(window.holidayTimeInt);
                clearInterval(window.activeHolidayTimer);
                window.finishHolidayGame(false, "You ran out of stamina. The couch crushed you.", "🤕");
            }
        }, 1000);
    }, 100);
};

// 3. Friendsgiving (Plate Pass - Target Clicking)
window.startHolidayGame_friendsgiving = function() {
    window.holidayGameData = { time: 10, served: 0, required: 5, seats: [null, null, null], active: true, frame: 0 };

    window.servePlate = function(idx) {
        if (!window.holidayGameData.active) return;
        const seat = window.holidayGameData.seats[idx];
        if (!seat) return;

        if (seat.type === 'grumpy') {
            window.holidayGameData.active = false;
            clearInterval(window.activeHolidayTimer);
            window.finishHolidayGame(false, "You passed potatoes to the grumpy uncle. He immediately started a political argument.", "🤬");
            return;
        }

        // Served correctly
        window.holidayGameData.served++;
        document.getElementById('plate-count').innerText = `${window.holidayGameData.served}/${window.holidayGameData.required}`;
        
        // Clear seat
        window.holidayGameData.seats[idx] = null;
        renderSeats();

        if (window.holidayGameData.served >= window.holidayGameData.required) {
            window.holidayGameData.active = false;
            clearInterval(window.activeHolidayTimer);
            window.finishHolidayGame(true, "Everyone is fed and happy! No drama today.", "🍗");
        }
    };

    const renderSeats = () => {
        const d = window.holidayGameData;
        const container = document.getElementById('table-seats');
        if (!container) return;

        container.innerHTML = d.seats.map((seat, i) => {
            if (seat) {
                return `
                    <div onclick="window.servePlate(${i})" class="flex flex-col items-center cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                        <div class="text-5xl drop-shadow-md bg-white rounded-full h-16 w-16 flex items-center justify-center border-4 ${seat.type==='grumpy' ? 'border-red-500' : 'border-slate-300'} animate-pop">
                            ${seat.icon}
                        </div>
                        <div class="text-xs font-bold mt-2 bg-slate-900 px-2 py-0.5 rounded text-white shadow">Pass Plate</div>
                    </div>
                `;
            } else {
                return `<div class="w-16 h-16 rounded-full border-4 border-dashed border-amber-900/50 flex items-center justify-center opacity-50">🍽️</div>`;
            }
        }).join('');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-orange-400 uppercase tracking-widest">Plate Pass</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Pass the food to hungry relatives, but DO NOT serve the grumpy uncle (👴)!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Served: <span id="plate-count" class="text-green-400">0/5</span></div>

            <div class="relative w-full h-40 bg-amber-800 border-4 border-amber-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-around px-2" style="background-image: radial-gradient(#78350f 15%, transparent 16%); background-size: 20px 20px;">
                <!-- Table Wood Effect -->
                <div id="table-seats" class="w-full flex justify-around items-center z-10"></div>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Eat it Yourself", "🤤", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You ate all the mashed potatoes. Everyone is mad at you.", "🥔");
    });

    setTimeout(() => {
        renderSeats();
        const relatives = ['👵', '👨', '👩‍🦱', '🧒'];
        
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            const d = window.holidayGameData;
            d.frame++;

            if (d.frame % 60 === 0) {
                d.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = d.time + "s";
                
                if (d.time <= 0) {
                    d.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(false, "The food got cold while you were waiting.", "🥶");
                }
            }

            // Decay timers for active seats
            d.seats.forEach((seat, i) => {
                if (seat) {
                    seat.timer--;
                    if (seat.timer <= 0) {
                        d.seats[i] = null; // They leave
                        renderSeats();
                    }
                }
            });

            // Spawn new relative randomly
            if (d.frame % 40 === 0) {
                let emptyIdx = d.seats.findIndex(s => s === null);
                if (emptyIdx > -1 && Math.random() > 0.3) {
                    // 25% chance for grumpy uncle
                    const isGrumpy = Math.random() < 0.25;
                    d.seats[emptyIdx] = {
                        type: isGrumpy ? 'grumpy' : 'hungry',
                        icon: isGrumpy ? '👴' : relatives[Math.floor(Math.random() * relatives.length)],
                        timer: 90 + Math.random() * 60 // Stick around for 1.5 - 2.5 seconds
                    };
                    renderSeats();
                }
            }
        }, 16);
    }, 100);
};

// 4. Skel-o-ween (Candy Sort - Bin Sorting)
window.startHolidayGame_skeloween = function() {
    window.holidayGameData = { sorted: 0, required: 8, time: 10, targetType: '' };

    const treats = ['🍫', '🍬', '🍭', '🍪'];
    const tricks = ['🕷️', '🪥', '🪨', '🧅'];

    const generateCandy = () => {
        const isTreat = Math.random() > 0.4;
        window.holidayGameData.targetType = isTreat ? 'treat' : 'trick';
        
        const arr = isTreat ? treats : tricks;
        const icon = arr[Math.floor(Math.random() * arr.length)];
        
        const el = document.getElementById('candy-item');
        if (el) {
            el.innerHTML = icon;
            el.className = "text-6xl w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center animate-pop drop-shadow-xl border-4 border-slate-600";
        }
    };

    window.sortCandy = function(chosenType) {
        if (window.holidayGameData.targetType === chosenType) {
            window.holidayGameData.sorted++;
            document.getElementById('candy-count').innerText = `${window.holidayGameData.sorted}/${window.holidayGameData.required}`;
            
            if (window.holidayGameData.sorted >= window.holidayGameData.required) {
                window.finishHolidayGame(true, "You kept all the good candy and tossed the trash!", "🎃");
            } else {
                generateCandy();
            }
        } else {
            window.finishHolidayGame(false, "You accidentally ate a used toothbrush. Disgusting.", "🤢");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-purple-400 uppercase tracking-widest">Candy Sort</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">Sort the loot! Keep the Treats, toss the Tricks.</p>
            
            <div class="text-sm font-bold text-slate-300 mb-4">Sorted: <span id="candy-count" class="text-green-400">0/8</span></div>
            
            <div class="flex justify-center mb-8 h-24">
                <div id="candy-item"></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.sortCandy('treat')" class="h-16 bg-orange-500 border-b-8 border-orange-700 text-white font-black rounded-xl hover:bg-orange-400 active:translate-y-1 active:border-b-0 transition-all text-xl uppercase tracking-widest shadow-lg">TREAT</button>
                <button onclick="window.sortCandy('trick')" class="h-16 bg-purple-600 border-b-8 border-purple-800 text-white font-black rounded-xl hover:bg-purple-500 active:translate-y-1 active:border-b-0 transition-all text-xl uppercase tracking-widest shadow-lg">TRICK</button>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Eat it All", "🍬", () => {
        window.finishHolidayGame(false, "You ate everything without looking and got a stomach ache.", "🤕");
    });

    setTimeout(() => {
        generateCandy();
        window.activeHolidayTimer = setInterval(() => {
            window.holidayGameData.time--;
            const timerEl = document.getElementById('holiday-timer');
            if(timerEl) timerEl.innerText = window.holidayGameData.time + "s";
            
            if (window.holidayGameData.time <= 0) {
                window.finishHolidayGame(false, "Too slow! A goblin stole your bucket.", "👻");
            }
        }, 1000);
    }, 100);
};

// ==========================================
// WINTER MINIGAMES
// ==========================================

// 1. New Winter's Day (Midnight Drop - Precision Timing)
window.startHolidayGame_new_winter = function() {
    window.holidayGameData = { time: 3.5, active: true }; // Starts at 3.5 seconds
    let lastTime = Date.now();

    window.dropBall = function() {
        if (!window.holidayGameData.active) return;
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);

        let t = window.holidayGameData.time;
        const clockEl = document.getElementById('midnight-clock');
        
        // Provide immediate visual feedback of the exact time they stopped it at
        if (clockEl) {
            clockEl.innerText = t.toFixed(2);
            clockEl.classList.remove('animate-pulse');
        }

        // Winning threshold: Must click exactly between 0.20s and -0.20s
        if (t <= 0.2 && t >= -0.2) {
            if (clockEl) clockEl.classList.add('text-green-400');
            setTimeout(() => window.finishHolidayGame(true, "PERFECT TIMING! Happy New Winter!", "🪩"), 800);
        } else if (t > 0.2) {
            if (clockEl) clockEl.classList.add('text-yellow-400');
            setTimeout(() => window.finishHolidayGame(false, "You dropped the ball too early. Everyone is confused.", "🕰️"), 800);
        } else {
            if (clockEl) clockEl.classList.add('text-red-500');
            setTimeout(() => window.finishHolidayGame(false, "You missed midnight. The moment is ruined.", "🤦"), 800);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Midnight Drop</h2>
            <p class="text-[10px] text-slate-400 mb-6">Hit DROP exactly when the timer reaches 0.00!</p>

            <div class="bg-black border-4 border-slate-700 rounded-2xl p-6 mb-6 shadow-inner">
                <div id="midnight-clock" class="text-6xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    3.50
                </div>
            </div>

            <button onclick="window.dropBall()" class="w-full py-6 bg-indigo-600 text-white font-black text-2xl rounded-xl uppercase tracking-widest shadow-md hover:bg-indigo-500 active:scale-95 transition-all">
                DROP THE BALL!
            </button>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Go to Sleep", "🛌", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You slept right through the celebration.", "💤");
    });

    setTimeout(() => {
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            
            let now = Date.now();
            let dt = (now - lastTime) / 1000;
            lastTime = now;

            window.holidayGameData.time -= dt;
            const t = window.holidayGameData.time;

            const clockEl = document.getElementById('midnight-clock');
            if (clockEl) {
                // Formatting to keep the exact 0.00 layout
                if (t >= 0) {
                    clockEl.innerText = t.toFixed(2);
                } else {
                    // Show negative if they passed it
                    clockEl.innerText = t.toFixed(2);
                    clockEl.classList.add('text-red-500');
                }
            }

            // Auto-lose if they let it go way past 0
            if (t <= -0.5) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                setTimeout(() => window.finishHolidayGame(false, "You completely missed the countdown.", "🤦"), 500);
            }
        }, 16);
    }, 100);
};

// 2. Midwinter's Day (Fire Stoker - Hold & Release Balancing)
window.startHolidayGame_midwinter = function() {
    window.holidayGameData = { heat: 50, time: 8, isStoking: false, active: true };

    window.stokeFire = function(state) {
        if (!window.holidayGameData.active) return;
        window.holidayGameData.isStoking = state;
        
        const btn = document.getElementById('btn-stoke');
        if (btn) {
            if (state) {
                btn.classList.add('bg-orange-500', 'scale-95');
                btn.classList.remove('bg-orange-700');
                btn.innerText = "STOKING...";
            } else {
                btn.classList.remove('bg-orange-500', 'scale-95');
                btn.classList.add('bg-orange-700');
                btn.innerText = "HOLD TO STOKE";
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-orange-400 uppercase tracking-widest">Stay Warm!</h2>
                <div class="text-2xl font-black text-blue-400" id="holiday-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Hold the button to build the fire. Don't let it freeze or explode!</p>
            
            <div class="flex justify-center items-center gap-6 mb-6">
                <!-- Fire Visual -->
                <div id="fire-visual" class="text-6xl drop-shadow-[0_0_20px_orange] transition-transform duration-100">🔥</div>
                
                <!-- Thermometer -->
                <div class="relative w-8 h-40 bg-slate-900 border-4 border-slate-700 rounded-full overflow-hidden shadow-inner flex flex-col justify-end">
                    <!-- Too Hot Zone -->
                    <div class="absolute top-0 w-full h-1/5 bg-red-500/20 border-b-2 border-red-500 z-10 pointer-events-none"></div>
                    <!-- Cozy Zone -->
                    <div class="absolute w-full h-1/5 border-y-2 border-orange-400 z-10 pointer-events-none" style="bottom: 40%;"></div>
                    <!-- Freezing Zone -->
                    <div class="absolute bottom-0 w-full h-1/5 bg-blue-500/20 border-t-2 border-blue-500 z-10 pointer-events-none"></div>
                    
                    <!-- Mercury Level -->
                    <div id="heat-level" class="w-full bg-gradient-to-t from-blue-500 via-orange-500 to-red-500 transition-none z-0" style="height: 50%;"></div>
                </div>
            </div>

            <button id="btn-stoke" onmousedown="window.stokeFire(true)" onmouseup="window.stokeFire(false)" onmouseleave="window.stokeFire(false)" ontouchstart="(e)=>{e.preventDefault(); window.stokeFire(true);}" ontouchend="window.stokeFire(false)" class="w-full py-4 bg-orange-700 text-white font-black text-xl rounded-xl uppercase tracking-widest shadow-md transition-all">
                HOLD TO STOKE
            </button>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Freeze", "🧊", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You gave up and turned into an icicle.", "🥶");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            frame++;

            // Timer Tick
            if (frame % 60 === 0) {
                window.holidayGameData.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
                
                if (window.holidayGameData.time <= 0) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(true, "You survived the cold snap! Nice and cozy.", "🔥");
                }
            }

            // Physics
            if (window.holidayGameData.isStoking) {
                window.holidayGameData.heat += 1.2;
            } else {
                window.holidayGameData.heat -= 0.8;
            }

            const heat = window.holidayGameData.heat;
            
            // DOM Updates
            const levelEl = document.getElementById('heat-level');
            const fireEl = document.getElementById('fire-visual');
            
            if (levelEl) levelEl.style.height = Math.max(0, Math.min(100, heat)) + '%';
            if (fireEl) {
                let scale = 0.5 + (heat / 100);
                fireEl.style.transform = `scale(${scale})`;
                if (window.holidayGameData.isStoking) fireEl.style.filter = `brightness(1.5)`;
                else fireEl.style.filter = `brightness(1.0)`;
            }

            // Lose Conditions
            if (heat >= 100) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                if (fireEl) fireEl.innerHTML = "💥";
                setTimeout(() => window.finishHolidayGame(false, "You stoked the fire too much and burned your eyebrows off.", "🔥"), 500);
            } else if (heat <= 0) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                if (fireEl) fireEl.innerHTML = "🧊";
                setTimeout(() => window.finishHolidayGame(false, "The fire died out. You are freezing.", "🥶"), 500);
            }

        }, 16);
    }, 100);
};

// 3. Wintermas (Present Shredder - Mouse Swiping)
window.startHolidayGame_wintermas = function() {
    window.holidayGameData = { paperHp: 100, lastX: -1, time: 8, active: true };

    window.tearPaper = function(e) {
        if (!window.holidayGameData.active) return;

        let currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        
        if (window.holidayGameData.lastX !== -1) {
            let delta = Math.abs(currentX - window.holidayGameData.lastX);
            window.holidayGameData.paperHp -= delta * 0.15; // Tearing power
        }
        window.holidayGameData.lastX = currentX;

        const paperEl = document.getElementById('present-paper');
        if (paperEl) {
            paperEl.style.opacity = Math.max(0, window.holidayGameData.paperHp) / 100;
        }

        // Win check
        if (window.holidayGameData.paperHp <= 0) {
            window.holidayGameData.active = false;
            clearInterval(window.activeHolidayTimer);
            if (paperEl) paperEl.style.display = 'none'; // fully remove it
            setTimeout(() => window.finishHolidayGame(true, "You ripped open the present! Best gift ever.", "🎁"), 400);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-green-500 uppercase tracking-widest">Unwrap It!</h2>
                <div class="text-2xl font-black text-red-500" id="holiday-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Swipe back and forth rapidly across the box to tear off the wrapping paper!</p>

            <div class="flex justify-center mb-6">
                <div class="relative w-48 h-48 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden cursor-crosshair border-4 border-slate-700 bg-slate-800"
                     onmousemove="window.tearPaper(event)"
                     ontouchmove="(e)=>{e.preventDefault(); window.tearPaper(e);}">
                    
                    <!-- The Gift Inside -->
                    <div class="text-6xl animate-bounce drop-shadow-lg z-0">🎮</div>

                    <!-- Wrapping Paper Layer -->
                    <div id="present-paper" class="absolute inset-0 bg-red-600 z-10 transition-opacity duration-75 flex items-center justify-center pointer-events-none" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px);">
                        <!-- Ribbon details -->
                        <div class="absolute w-full h-4 bg-green-500 shadow"></div>
                        <div class="absolute h-full w-4 bg-green-500 shadow"></div>
                        <div class="absolute text-5xl drop-shadow-md">🎀</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Save it for Later", "📦", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You politely set the gift aside. Where's the fun in that?", "🥱");
    });

    setTimeout(() => {
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            window.holidayGameData.time--;
            const timerEl = document.getElementById('holiday-timer');
            if(timerEl) timerEl.innerText = window.holidayGameData.time + "s";

            if (window.holidayGameData.time <= 0) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                window.finishHolidayGame(false, "You were too gentle! The duct tape defeated you.", "🩹");
            }
        }, 1000);
    }, 100);
};

// ==========================================
// SPRING MINIGAMES
// ==========================================

// 1. Raccoon Day (Whack-a-Mole)
window.startHolidayGame_raccoon = function() {
    window.holidayGameData = { time: 10, cans: [0, 0, 0, 0], active: true };

    window.shooRaccoon = function(idx) {
        if (!window.holidayGameData.active) return;
        
        if (window.holidayGameData.cans[idx] === 1) {
            window.holidayGameData.cans[idx] = 0;
            renderCans();
        }
    };

    const renderCans = () => {
        const container = document.getElementById('trash-cans');
        if (!container) return;

        container.innerHTML = window.holidayGameData.cans.map((hasRaccoon, i) => {
            if (hasRaccoon) {
                return `
                    <div onclick="window.shooRaccoon(${i})" class="relative w-16 h-24 cursor-pointer flex flex-col items-center justify-end active:scale-95 transition-transform group">
                        <div class="text-4xl absolute bottom-12 animate-bounce z-10 group-hover:scale-110 drop-shadow-md">🦝</div>
                        <div class="text-5xl z-20 drop-shadow-lg">🗑️</div>
                    </div>
                `;
            } else {
                return `
                    <div class="relative w-16 h-24 flex flex-col items-center justify-end">
                        <div class="text-5xl z-20 drop-shadow-lg opacity-80">🗑️</div>
                    </div>
                `;
            }
        }).join('');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-blue-400 uppercase tracking-widest">Trash Defender</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">Tap the raccoons to shoo them away! Don't let 3 raid the trash at the same time.</p>
            
            <div id="trash-cans" class="flex justify-around items-end bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 h-40 shadow-inner">
                <!-- Cans injected here -->
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Give Up", "🦝", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You surrendered the trash. It's everywhere.", "🗑️");
    });

    setTimeout(() => {
        renderCans();
        let frame = 0;
        
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            frame++;

            // Timer (Every ~1s)
            if (frame % 60 === 0) {
                window.holidayGameData.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
                
                if (window.holidayGameData.time <= 0) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(true, "You successfully defended the garbage! Spring is saved.", "✨");
                }
            }

            // Spawn Logic (Every ~400ms)
            if (frame % 25 === 0) {
                let raccoonCount = window.holidayGameData.cans.filter(c => c === 1).length;
                
                // Lose Condition: 3 or more raccoons active
                if (raccoonCount >= 3) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(false, "Too many raccoons! They completely emptied the bins.", "🐾");
                    return;
                }

                // Pick an empty can and spawn
                let emptyCans = window.holidayGameData.cans.map((c, i) => c === 0 ? i : -1).filter(i => i !== -1);
                if (emptyCans.length > 0) {
                    let spawnIdx = emptyCans[Math.floor(Math.random() * emptyCans.length)];
                    window.holidayGameData.cans[spawnIdx] = 1;
                    renderCans();
                }
            }
        }, 16);
    }, 100);
};

// 2. Love's Day (Precision Timing)
window.startHolidayGame_love = function() {
    window.holidayGameData = { time: 8, pos: 5, dir: 2.5, active: true };

    window.shootArrow = function() {
        if (!window.holidayGameData.active) return;
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);

        const pos = window.holidayGameData.pos;
        
        // Target is between 40% and 60%
        if (pos >= 35 && pos <= 65) {
            // Hit!
            const heart = document.getElementById('cupid-heart');
            if(heart) heart.innerHTML = "💘";
            setTimeout(() => window.finishHolidayGame(true, "Bullseye! True love prevails.", "💘"), 600);
        } else {
            // Miss!
            const arrow = document.getElementById('cupid-arrow');
            if(arrow) arrow.style.transform = `translateY(-100px) rotate(45deg)`;
            setTimeout(() => window.finishHolidayGame(false, "You completely missed the target. Awkward.", "💔"), 600);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-pink-400 uppercase tracking-widest">Cupid's Aim</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">8s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Tap SHOOT when the heart is perfectly centered in the green zone!</p>

            <div class="relative w-full h-32 bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden mb-6 shadow-inner">
                <!-- Target Zone -->
                <div class="absolute top-0 bottom-0 bg-green-500/30 border-x-4 border-green-400 z-0" style="left: 40%; right: 40%;"></div>
                
                <!-- Moving Heart -->
                <div id="cupid-heart" class="absolute top-1/2 -translate-y-1/2 text-4xl z-10 drop-shadow-lg" style="left: 5%;">💖</div>
                
                <!-- Player Arrow Indicator -->
                <div id="cupid-arrow" class="absolute bottom-2 text-2xl z-20 transition-transform duration-300" style="left: calc(50% - 14px); transform: rotate(-45deg);">🏹</div>
            </div>

            <button onclick="window.shootArrow()" class="w-full py-4 bg-pink-600 text-white font-black rounded-xl active:bg-pink-500 active:scale-95 transition-all shadow-md uppercase tracking-widest">
                SHOOT!
            </button>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Ignore Love", "🤷", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You lowered your bow. Love is a scam anyway.", "🖤");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.holidayGameData.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
                
                if (window.holidayGameData.time <= 0) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(false, "Time ran out before you could take the shot.", "⏱️");
                }
            }

            // Ping-pong movement
            window.holidayGameData.pos += window.holidayGameData.dir;
            if (window.holidayGameData.pos > 85 || window.holidayGameData.pos < 5) {
                window.holidayGameData.dir *= -1;
            }

            const heart = document.getElementById('cupid-heart');
            if (heart) heart.style.left = window.holidayGameData.pos + '%';

        }, 16);
    }, 100);
};

// 3. Spring Jubilee (Rapid Alternating Taps)
window.startHolidayGame_jubilee = function() {
    window.holidayGameData = { meter: 0, nextKey: 'L', time: 10, active: true };

    // Handle button clicks or keyboard presses
    window.suppressSneeze = function(key) {
        if (!window.holidayGameData.active) return;

        if (key === window.holidayGameData.nextKey) {
            // Correct alternate tap
            window.holidayGameData.meter = Math.max(0, window.holidayGameData.meter - 10);
            window.holidayGameData.nextKey = (key === 'L') ? 'R' : 'L';
            
            // Visual feedback on buttons
            const btnL = document.getElementById('btn-sneeze-l');
            const btnR = document.getElementById('btn-sneeze-r');
            
            if (window.holidayGameData.nextKey === 'L') {
                btnL.classList.replace('bg-slate-700', 'bg-blue-500');
                btnR.classList.replace('bg-blue-500', 'bg-slate-700');
            } else {
                btnR.classList.replace('bg-slate-700', 'bg-blue-500');
                btnL.classList.replace('bg-blue-500', 'bg-slate-700');
            }
        } else {
            // Wrong tap (penalty)
            window.holidayGameData.meter += 5; 
        }
    };

    const handleKeydown = (e) => {
        if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') window.suppressSneeze('L');
        if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') window.suppressSneeze('R');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-green-400 uppercase tracking-widest">Pollen Attack!</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Alternate tapping LEFT and RIGHT to suppress your sneeze!</p>
            
            <div class="w-full h-8 bg-slate-900 rounded-full border-4 border-slate-700 overflow-hidden mb-6 relative shadow-inner">
                <div id="sneeze-fill" class="h-full bg-yellow-400 transition-none" style="width: 0%;"></div>
                <div class="absolute inset-0 flex justify-between px-4 items-center font-bold text-white/50 text-[10px] pointer-events-none">
                    <span>Safe</span>
                    <span class="text-red-400">ACHOO!</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button id="btn-sneeze-l" onmousedown="window.suppressSneeze('L')" ontouchstart="(e)=>{e.preventDefault(); window.suppressSneeze('L');}" class="py-8 bg-blue-500 text-white font-black text-2xl rounded-2xl shadow-md active:scale-95 transition-all">LEFT (A)</button>
                <button id="btn-sneeze-r" onmousedown="window.suppressSneeze('R')" ontouchstart="(e)=>{e.preventDefault(); window.suppressSneeze('R');}" class="py-8 bg-slate-700 text-white font-black text-2xl rounded-2xl shadow-md active:scale-95 transition-all">RIGHT (D)</button>
            </div>
        </div>
    `;

    document.addEventListener('keydown', handleKeydown);

    window.queueModal("Holiday Event", html, "Just Sneeze", "🤧", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        document.removeEventListener('keydown', handleKeydown);
        window.finishHolidayGame(false, "You sneezed so hard you pulled a muscle.", "🤕");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.holidayGameData.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
                
                if (window.holidayGameData.time <= 0) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    document.removeEventListener('keydown', handleKeydown);
                    window.finishHolidayGame(true, "You held it in! Your sinuses ache, but you survived.", "😮‍💨");
                }
            }

            // Meter fills automatically
            window.holidayGameData.meter += 0.8;
            
            const fill = document.getElementById('sneeze-fill');
            if (fill) {
                fill.style.width = Math.min(100, window.holidayGameData.meter) + '%';
                
                // Color shift as it gets dangerous
                if (window.holidayGameData.meter > 80) fill.classList.replace('bg-yellow-400', 'bg-red-500');
                else fill.classList.replace('bg-red-500', 'bg-yellow-400');
            }

            // Lose condition
            if (window.holidayGameData.meter >= 100) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                document.removeEventListener('keydown', handleKeydown);
                window.finishHolidayGame(false, "ACHOO! You sneezed all over the place.", "🤧");
            }

        }, 16);
    }, 100);
};

// 4. Fool's Day (The Shell Game)
window.startHolidayGame_fool = function() {
    window.holidayGameData = { 
        cups: [
            { id: 0, pos: 15 }, // % Left positions
            { id: 1, pos: 42.5 },
            { id: 2, pos: 70 }
        ],
        winningId: Math.floor(Math.random() * 3),
        phase: 'reveal', // reveal -> shuffle -> guess
        swapsLeft: 12
    };

    window.guessCup = function(id) {
        if (window.holidayGameData.phase !== 'guess') return;
        window.holidayGameData.phase = 'done';

        // Lift the clicked cup
        const clickedCup = document.getElementById(`cup-${id}`);
        if(clickedCup) clickedCup.style.transform = "translateY(-40px)";

        setTimeout(() => {
            if (id === window.holidayGameData.winningId) {
                window.finishHolidayGame(true, "You tracked the money perfectly!", "💵");
            } else {
                // Reveal the actual winner too
                const winCup = document.getElementById(`cup-${window.holidayGameData.winningId}`);
                if(winCup) winCup.style.transform = "translateY(-40px)";
                setTimeout(() => {
                    window.finishHolidayGame(false, "You got hustled. The money was under a different cup.", "🃏");
                }, 800);
            }
        }, 500);
    };

    const renderCups = () => {
        const d = window.holidayGameData;
        const container = document.getElementById('shell-area');
        if (!container) return;

        container.innerHTML = d.cups.map(c => {
            const hasBall = c.id === d.winningId;
            const ballHtml = hasBall ? `<div class="absolute bottom-2 text-3xl z-0">💵</div>` : '';
            
            return `
                <div class="absolute bottom-4 flex justify-center transition-all duration-300 ease-in-out z-10" style="left: ${c.pos}%; width: 60px;">
                    ${ballHtml}
                    <!-- The Cup -->
                    <div id="cup-${c.id}" onclick="window.guessCup(${c.id})" class="absolute bottom-0 text-6xl cursor-pointer z-10 transform transition-transform duration-300 drop-shadow-xl ${d.phase === 'guess' ? 'hover:-translate-y-2' : ''}">🥤</div>
                </div>
            `;
        }).join('');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-purple-400 uppercase tracking-widest mb-2">The Shell Game</h2>
            <p id="shell-instr" class="text-xs text-slate-400 mb-6">Watch closely...</p>

            <div class="relative w-full h-40 bg-slate-800 border-4 border-slate-600 rounded-xl overflow-hidden mb-4 shadow-inner">
                <!-- Table edge -->
                <div class="absolute bottom-0 w-full h-8 bg-slate-900 border-t-2 border-slate-700"></div>
                
                <div id="shell-area" class="absolute inset-0">
                    <!-- Cups injected here -->
                </div>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Walk Away", "🚶", () => {
        window.finishHolidayGame(false, "You decided not to gamble. Probably smart.", "🛡️");
    });

    setTimeout(() => {
        renderCups();
        
        // Lift the winning cup immediately to reveal
        const winCup = document.getElementById(`cup-${window.holidayGameData.winningId}`);
        if(winCup) winCup.style.transform = "translateY(-40px)";

        // Wait 1.5 seconds, drop the cup, start shuffling
        setTimeout(() => {
            if(winCup) winCup.style.transform = "translateY(0px)";
            window.holidayGameData.phase = 'shuffle';
            document.getElementById('shell-instr').innerText = "Keep your eye on it!";

            let shuffleInt = setInterval(() => {
                const d = window.holidayGameData;
                
                // Pick two random cups to swap
                let idx1 = Math.floor(Math.random() * 3);
                let idx2 = Math.floor(Math.random() * 3);
                while(idx1 === idx2) idx2 = Math.floor(Math.random() * 3);

                // Swap their positions
                let tempPos = d.cups[idx1].pos;
                d.cups[idx1].pos = d.cups[idx2].pos;
                d.cups[idx2].pos = tempPos;

                // Update DOM directly to utilize CSS transitions
                const el1 = document.getElementById(`cup-${d.cups[idx1].id}`).parentElement;
                const el2 = document.getElementById(`cup-${d.cups[idx2].id}`).parentElement;
                if(el1) el1.style.left = d.cups[idx1].pos + '%';
                if(el2) el2.style.left = d.cups[idx2].pos + '%';

                d.swapsLeft--;

                if (d.swapsLeft <= 0) {
                    clearInterval(shuffleInt);
                    d.phase = 'guess';
                    document.getElementById('shell-instr').innerText = "Where is the money? Click a cup!";
                    document.getElementById('shell-instr').classList.add('text-green-400', 'font-bold');
                }
            }, 350); // Speed of shuffles
        }, 1500);
    }, 100);
};

// ==========================================
// SUMMER MINIGAMES
// ==========================================

// 1. Last Day of School (Hallway Breakout - Lane Dodging)
window.startHolidayGame_breakout = function() {
    window.holidayGameData = { time: 12, lane: 1, obs: [], active: true, frame: 0 };

    window.moveBreakoutLane = function(dir) {
        if (!window.holidayGameData.active) return;
        window.holidayGameData.lane += dir;
        if (window.holidayGameData.lane < 0) window.holidayGameData.lane = 0;
        if (window.holidayGameData.lane > 2) window.holidayGameData.lane = 2;
        
        const player = document.getElementById('breakout-player');
        if (player) {
            player.style.left = `calc(${16.6 + (window.holidayGameData.lane * 33.3)}% - 16px)`;
        }
    };

    const spawnBreakoutObs = () => {
        if (!window.holidayGameData.active) return;
        const area = document.getElementById('breakout-area');
        if (!area) return;

        const id = Date.now() + Math.random();
        const lane = Math.floor(Math.random() * 3);
        const obj = { id, lane, y: -20, speed: 1.5 + Math.random() };
        window.holidayGameData.obs.push(obj);

        const el = document.createElement('div');
        el.id = `bobs-${id}`;
        el.className = "absolute text-3xl transition-none z-10 opacity-90 drop-shadow-md";
        // Mix of teachers and janitor carts
        el.innerHTML = Math.random() > 0.5 ? "👨‍🏫" : "🧹"; 
        el.style.left = `calc(${16.6 + (lane * 33.3)}% - 16px)`;
        el.style.top = '-20%';
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-yellow-400 uppercase tracking-widest">School's Out!</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">12s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Run to the exit! Dodge the teachers trying to hand out summer reading.</p>

            <div id="breakout-area" class="relative w-full h-48 bg-slate-300 border-4 border-slate-400 rounded-xl overflow-hidden mb-4 shadow-inner">
                <!-- Sunlight at the end of the hall -->
                <div class="absolute top-0 w-full h-8 bg-yellow-200/80 blur-sm z-0"></div>

                <!-- Lane Dividers -->
                <div class="absolute w-full h-full flex justify-between px-[33%] opacity-20">
                    <div class="h-full w-2 bg-slate-500"></div>
                    <div class="h-full w-2 bg-slate-500"></div>
                </div>

                <!-- Player -->
                <div id="breakout-player" class="absolute bottom-4 text-3xl z-20 transition-all duration-150 ease-out drop-shadow-md" style="left: calc(50% - 16px);">
                    🏃
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.moveBreakoutLane(-1)" class="py-4 bg-slate-700 text-white font-black text-2xl rounded-xl hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">⬅️</button>
                <button onclick="window.moveBreakoutLane(1)" class="py-4 bg-slate-700 text-white font-black text-2xl rounded-xl hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">➡️</button>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Walk Slowly", "🎒", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You got caught by the principal and handed a 500-page book.", "📚");
    });

    setTimeout(() => {
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            window.holidayGameData.frame++;

            if (window.holidayGameData.frame % 60 === 0) {
                window.holidayGameData.time--;
                const timerEl = document.getElementById('holiday-timer');
                if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
                
                if (window.holidayGameData.time <= 0) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    window.finishHolidayGame(true, "You burst through the double doors into the summer sun!", "☀️");
                }
            }

            if (window.holidayGameData.frame % 30 === 0) spawnBreakoutObs();

            // Physics & Collision
            for (let i = 0; i < window.holidayGameData.obs.length; i++) {
                let o = window.holidayGameData.obs[i];
                o.y += o.speed;
                const el = document.getElementById(`bobs-${o.id}`);
                if (el) el.style.top = o.y + '%';

                // Collision Box (Player is at bottom 80-95%)
                if (o.y > 75 && o.y < 95 && o.lane === window.holidayGameData.lane) {
                    window.holidayGameData.active = false;
                    clearInterval(window.activeHolidayTimer);
                    if(el) el.innerHTML = "💥";
                    document.getElementById('breakout-player').innerHTML = "😵";
                    setTimeout(() => {
                        window.finishHolidayGame(false, "You crashed right into a teacher. Summer ruined.", "🤦");
                    }, 500);
                    return;
                }

                if (o.y > 110) {
                    if (el) el.remove();
                    window.holidayGameData.obs.splice(i, 1);
                    i--;
                }
            }
        }, 16);
    }, 100);
};

// 2. Grilldependence Day (Perfect Flip - Plate Spinning)
window.startHolidayGame_grill = function() {
    window.holidayGameData = {
        dogs: [
            { id: 0, p: Math.random() * 20, speed: 0.3 + Math.random() * 0.2, flipped: false },
            { id: 1, p: Math.random() * 15, speed: 0.2 + Math.random() * 0.3, flipped: false },
            { id: 2, p: Math.random() * 30, speed: 0.4 + Math.random() * 0.2, flipped: false }
        ],
        successes: 0,
        active: true
    };

    window.flipDog = function(id) {
        if (!window.holidayGameData.active) return;
        const dog = window.holidayGameData.dogs[id];
        if (dog.flipped) return;

        dog.flipped = true;
        const btn = document.getElementById(`btn-grill-${id}`);
        const dogVisual = document.getElementById(`dog-visual-${id}`);
        
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50');
            btn.innerText = "SERVED";
        }

        if (dog.p >= 70 && dog.p <= 90) {
            // Perfect
            window.holidayGameData.successes++;
            if (dogVisual) dogVisual.innerHTML = "🌭"; // Bun it!
            if (btn) btn.classList.replace('bg-slate-700', 'bg-green-600');
        } else if (dog.p > 90) {
            failGrill("You served a burnt, charred cylinder!");
        } else {
            failGrill("You served a raw, cold hot dog!");
        }

        if (window.holidayGameData.successes === 3) {
            window.holidayGameData.active = false;
            clearInterval(window.activeHolidayTimer);
            window.finishHolidayGame(true, "Perfectly grilled hot dogs for everyone. You are a true patriot.", "🌭");
        }
    };

    const failGrill = (msg) => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, msg, "🔥");
    };

    const renderGrill = () => {
        return window.holidayGameData.dogs.map(d => `
            <div class="flex flex-col items-center gap-2">
                <div class="w-16 h-32 bg-slate-900 border-4 border-slate-700 rounded-xl relative overflow-hidden shadow-inner flex flex-col justify-between p-1">
                    <!-- Grill Grates -->
                    <div class="absolute inset-0 opacity-30" style="background: repeating-linear-gradient(90deg, transparent, transparent 10px, #000 10px, #000 14px);"></div>
                    
                    <div id="dog-visual-${d.id}" class="text-4xl z-10 transition-transform origin-bottom" style="transform: translateY(10px) rotate(90deg);">🌭</div>
                    
                    <!-- Target Zone 70-90 -->
                    <div class="w-full h-2 bg-slate-800 rounded-full mt-auto relative z-10 border border-slate-600 overflow-hidden">
                        <div id="dog-fill-${d.id}" class="absolute left-0 h-full transition-none" style="width: ${d.p}%; background-color: #fbcfe8;"></div>
                        <div class="absolute border-x-2 border-green-500 h-full z-10" style="left: 70%; width: 20%;"></div>
                    </div>
                </div>
                <button id="btn-grill-${d.id}" onclick="window.flipDog(${d.id})" class="w-full py-2 bg-slate-700 text-white font-bold text-[10px] uppercase rounded-lg hover:bg-slate-600 active:scale-95 transition-all shadow-md">
                    FLIP
                </button>
            </div>
        `).join('');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-red-500 uppercase tracking-widest mb-2">Grill Master</h2>
            <p class="text-xs text-slate-400 mb-6">Flip the hot dogs when their meter is in the <span class="text-green-400 font-bold">GREEN</span> zone!</p>

            <div class="flex justify-center gap-4 mb-4">
                ${renderGrill()}
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Walk Away", "🚶", () => {
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You left the grill unattended. Everything burned.", "🔥");
    });

    window.activeHolidayTimer = setInterval(() => {
        if (!window.holidayGameData.active) return;

        window.holidayGameData.dogs.forEach(d => {
            if (!d.flipped) {
                d.p += d.speed;
                const fillEl = document.getElementById(`dog-fill-${d.id}`);
                const visEl = document.getElementById(`dog-visual-${d.id}`);
                
                if (fillEl && visEl) {
                    fillEl.style.width = d.p + '%';

                    // Color shift based on doneness
                    if (d.p > 90) {
                        fillEl.style.backgroundColor = '#1a202c'; // Burnt black
                        visEl.style.filter = 'brightness(0.3) sepia(1) hue-rotate(180deg)';
                    } else if (d.p > 70) {
                        fillEl.style.backgroundColor = '#92400e'; // Perfect brown
                        visEl.style.filter = 'brightness(0.8) sepia(0.5)';
                    } else {
                        fillEl.style.backgroundColor = '#fbcfe8'; // Raw pink
                        visEl.style.filter = 'none';
                    }
                }

                if (d.p >= 100) {
                    failGrill("The food caught on fire! Classic holiday disaster.");
                }
            }
        });
    }, 16);
};

// 3. End of Vacation (Sunscreen Slap - Scrubbing)
window.startHolidayGame_sunscreen = function() {
    let spots = [];
    for (let i = 0; i < 5; i++) {
        spots.push({ 
            id: i, 
            x: 10 + Math.random() * 80, 
            y: 10 + Math.random() * 80, 
            hp: 100 
        });
    }

    window.holidayGameData = { spots: spots, time: 8, lastX: -1, lastY: -1, active: true };

    window.scrubSunburn = function(e) {
        if (!window.holidayGameData.active) return;

        const area = document.getElementById('sunscreen-area');
        if (!area) return;
        const rect = area.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        // Move cursor visual
        const cursor = document.getElementById('sunscreen-bottle');
        if (cursor) {
            cursor.style.left = (clientX - rect.left - 20) + 'px';
            cursor.style.top = (clientY - rect.top - 20) + 'px';
        }
        
        let spotsLeft = 0;
        
        window.holidayGameData.spots.forEach(spot => {
            if (spot.hp <= 0) return;
            spotsLeft++;
            
            const spotX = (spot.x / 100) * rect.width;
            const spotY = (spot.y / 100) * rect.height;
            
            const dx = (clientX - rect.left) - spotX;
            const dy = (clientY - rect.top) - spotY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 40) { // Scrub radius
                spot.hp -= 15; // Erase power
                const el = document.getElementById(`burn-${spot.id}`);
                if (el) {
                    el.style.opacity = spot.hp / 100;
                    if (spot.hp <= 0) {
                        el.remove();
                        spotsLeft--;
                    }
                }
            }
        });
        
        if (spotsLeft === 0) {
            window.holidayGameData.active = false;
            clearInterval(window.activeHolidayTimer);
            window.finishHolidayGame(true, "All sunburns treated. You are ready for the semester!", "🧴");
        }
    };

    const renderBurns = () => {
        return window.holidayGameData.spots.map(s => `
            <div id="burn-${s.id}" class="absolute w-16 h-16 bg-red-500/80 rounded-full blur-md pointer-events-none transition-opacity duration-75 mix-blend-multiply" style="left: calc(${s.x}% - 32px); top: calc(${s.y}% - 32px);"></div>
        `).join('');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Sunburn!</h2>
                <div class="text-2xl font-black text-red-400" id="holiday-timer">8s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">Swipe the sunscreen bottle over all the red spots to heal them!</p>
            
            <div id="sunscreen-area" class="relative w-full h-48 bg-orange-200 border-4 border-orange-300 rounded-2xl overflow-hidden cursor-none shadow-inner"
                 onmousemove="window.scrubSunburn(event)"
                 ontouchmove="(e)=>{e.preventDefault(); window.scrubSunburn(e);}">
                
                ${renderBurns()}
                
                <div id="sunscreen-bottle" class="absolute w-10 h-10 text-3xl pointer-events-none drop-shadow-md z-10 transition-none" style="left: 50%; top: 50%;">🧴</div>
            </div>
        </div>
    `;

    window.queueModal("Holiday Event", html, "Endure the Pain", "🥵", () => {
        window.holidayGameData.active = false;
        clearInterval(window.activeHolidayTimer);
        window.finishHolidayGame(false, "You decided to just peel the skin off later. Gross.", "🦞");
    });

    setTimeout(() => {
        window.activeHolidayTimer = setInterval(() => {
            if (!window.holidayGameData.active) return;
            window.holidayGameData.time--;
            
            const timerEl = document.getElementById('holiday-timer');
            if (timerEl) timerEl.innerText = window.holidayGameData.time + "s";
            
            if (window.holidayGameData.time <= 0) {
                window.holidayGameData.active = false;
                clearInterval(window.activeHolidayTimer);
                window.finishHolidayGame(false, "You ran out of time! Your skin is blistering.", "🔥");
            }
        }, 1000);
    }, 100);
};