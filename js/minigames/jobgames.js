// --- JOB MINIGAME FRAMEWORK ---

window.triggerJobMinigame = function() {
    // 25% chance to trigger an active minigame instead of a text scenario
    if (Math.random() > 0.25) {
        return false; // Did not trigger
    }

    if (!state.job || !state.job.type) return false;

    const jobType = state.job.type;
    
    // Dictionary of available minigames per job type
    const minigamePool = {
        'retail': ['restock_rush', 'spill_cleanup', 'barcode_scanner', 'karen_defense'],
        'food': ['burger_stacker', 'coffee_pour', 'dish_duty', 'fry_fryer'],
        'daycare': ['naptime_ninja', 'toy_sort', 'tantrum_tamer', 'tag_tracker'],
        'tech': ['bug_smasher', 'wire_connect', 'reboot_sequence', 'password_cracker'],
        'animal': ['kibble_catch', 'pet_petter', 'fish_netter', 'grooming_shears'],
        'labor': ['heavy_lifting', 'pipe_connect', 'brick_layer', 'lawn_mower']    };

    const availableGames = minigamePool[jobType];
    
    // If no games are programmed for this category yet, fallback to standard text
    if (!availableGames || availableGames.length === 0) return false;

    // Pick a random game from the pool
    const selectedGame = availableGames[Math.floor(Math.random() * availableGames.length)];
    const functionName = 'startJobGame_' + selectedGame;
    
    // Launch the selected game if the function exists
    if (typeof window[functionName] === 'function') {
        window[functionName]();
        return true; // Successfully intercepted the shift
    }

    return false; // Fallback
};

// Universal completion handler for ALL job minigames
window.finishJobMinigame = function(success, performanceChange, msg, icon) {
    // Clear any active job minigame timers
    if (window.activeJobTimer) clearInterval(window.activeJobTimer);

    document.getElementById('modal-overlay').classList.add('hidden');

    // Initialize performance if it doesn't exist on the save yet
    if (typeof state.jobPerformance === 'undefined') state.jobPerformance = 50;
    
    // Delegate to main shift handler
    // We pass 10 as the energy cost for minigames
    if (typeof window.finishWorkShift === 'function') {
        window.finishWorkShift(success, performanceChange, 10, msg);
    } else {
        // Fallback if function missing (shouldn't happen)
        state.jobPerformance = Math.max(0, Math.min(100, state.jobPerformance + performanceChange));
        state.energy = Math.max(0, state.energy - 10);
        state.step = 'sim_dashboard';
        window.updateUI();
    }
};



//// ALL JOB GAMES START HERE

// ==========================================
// RETAIL MINIGAMES
// ==========================================

// 1. Restock Rush (Sorting Game)
window.startJobGame_restock_rush = function() {
    window.jobGameData = { itemsSorted: 0, required: 8, time: 10, targetColor: '' };
    
    const colors = [
        { id: 'red', hex: 'bg-red-500', icon: '🍎' },
        { id: 'blue', hex: 'bg-blue-500', icon: '👖' },
        { id: 'green', hex: 'bg-green-500', icon: '📗' }
    ];

    const generateItem = () => {
        const c = colors[Math.floor(Math.random() * colors.length)];
        window.jobGameData.targetColor = c.id;
        const el = document.getElementById('restock-item');
        if (el) {
            el.innerHTML = c.icon;
            el.className = `text-6xl ${c.hex} w-24 h-24 rounded-2xl flex items-center justify-center shadow-md animate-pop`;
        }
    };

    window.checkRestock = function(chosenColor) {
        if (window.jobGameData.targetColor === chosenColor) {
            window.jobGameData.itemsSorted++;
            document.getElementById('restock-count').innerText = `${window.jobGameData.itemsSorted}/${window.jobGameData.required}`;
            
            if (window.jobGameData.itemsSorted >= window.jobGameData.required) {
                window.finishJobMinigame(true, 5, "You cleared the entire pallet in record time!", "📦");
            } else {
                generateItem();
            }
        } else {
            // Wrong bin! Lose immediately
            window.finishJobMinigame(false, -5, "You put items in the wrong bins! The manager is furious.", "🤦");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Restock Rush</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">Sort the items into the matching colored bins before time runs out!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-4">Sorted: <span id="restock-count" class="text-green-400">0/8</span></div>
            
            <div class="flex justify-center mb-8 h-24">
                <div id="restock-item"></div>
            </div>

            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.checkRestock('red')" class="h-16 bg-slate-800 border-b-8 border-red-500 rounded-xl hover:bg-slate-700 active:translate-y-1 active:border-b-0 transition-all"></button>
                <button onclick="window.checkRestock('green')" class="h-16 bg-slate-800 border-b-8 border-green-500 rounded-xl hover:bg-slate-700 active:translate-y-1 active:border-b-0 transition-all"></button>
                <button onclick="window.checkRestock('blue')" class="h-16 bg-slate-800 border-b-8 border-blue-500 rounded-xl hover:bg-slate-700 active:translate-y-1 active:border-b-0 transition-all"></button>
            </div>
        </div>
    `;
    
    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "🛒", () => {
        window.finishJobMinigame(false, -10, "You abandoned the pallet in the middle of the aisle.", "🏃");
    });

    // Start timer on open
    setTimeout(() => {
        generateItem();
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                window.finishJobMinigame(false, -5, "You were too slow. The aisle is completely blocked.", "⏱️");
            }
        }, 1000);
    }, 100);
};

// 2. Spill Cleanup (Rapid Clicker)
window.startJobGame_spill_cleanup = function() {
    window.jobGameData = { clicks: 0, required: 25, time: 7 };

    window.scrubSpill = function() {
        window.jobGameData.clicks++;
        const pct = 1 - (window.jobGameData.clicks / window.jobGameData.required);
        const spillEl = document.getElementById('spill-blob');
        
        if (spillEl) {
            spillEl.style.transform = `scale(${Math.max(0, pct)})`;
            spillEl.style.opacity = Math.max(0, pct);
        }

        if (window.jobGameData.clicks >= window.jobGameData.required) {
            window.finishJobMinigame(true, 5, "You scrubbed the floor until it sparkled!", "✨");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Spill Cleanup!</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">7s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">A customer dropped a massive soda. Tap the spill rapidly to scrub it before the manager sees!</p>
            
            <div class="relative w-full h-48 bg-slate-200 border-4 border-slate-300 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer shadow-inner" onmousedown="window.scrubSpill()" ontouchstart="(e)=>{e.preventDefault(); window.scrubSpill();}">
                <!-- Floor Tile Lines -->
                <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px); background-size: 40px 40px;"></div>
                
                <!-- The Spill -->
                <div id="spill-blob" class="w-32 h-32 bg-amber-600 rounded-full blur-md opacity-90 transition-all duration-75 pointer-events-none" style="filter: drop-shadow(0 0 10px rgba(217, 119, 6, 0.8));"></div>
            </div>
        </div>
    `;
    
    window.queueModal("Work Task", html, "Ignore Spill (-10 Perf)", "🧽", () => {
        window.finishJobMinigame(false, -10, "A customer slipped on the spill. You are in big trouble.", "⚠️");
    });

    setTimeout(() => {
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                window.finishJobMinigame(false, -5, "The manager saw the spill. 'I need hustle!' they yelled.", "😡");
            }
        }, 1000);
    }, 100);
};

// 3. Barcode Scanner (Numpad typing)
window.startJobGame_barcode_scanner = function() {
    window.jobGameData = { time: 15, currentCode: "", input: "", scanned: 0, required: 3 };

    const genCode = () => {
        window.jobGameData.currentCode = Math.floor(1000 + Math.random() * 9000).toString();
        window.jobGameData.input = "";
        
        const codeEl = document.getElementById('barcode-target');
        const inputEl = document.getElementById('barcode-input');
        if (codeEl) codeEl.innerText = window.jobGameData.currentCode;
        if (inputEl) inputEl.innerText = "____";
    };

    window.pressNumpad = function(num) {
        if (window.jobGameData.input.length < 4) {
            window.jobGameData.input += num;
        }
        
        const inputEl = document.getElementById('barcode-input');
        if (inputEl) {
            inputEl.innerText = window.jobGameData.input.padEnd(4, '_');
        }

        // Check if full
        if (window.jobGameData.input.length === 4) {
            if (window.jobGameData.input === window.jobGameData.currentCode) {
                // Correct
                window.jobGameData.scanned++;
                document.getElementById('barcode-count').innerText = `${window.jobGameData.scanned}/${window.jobGameData.required}`;
                
                if (window.jobGameData.scanned >= window.jobGameData.required) {
                    window.finishJobMinigame(true, 5, "Line cleared! You scan items like a machine.", "📠");
                } else {
                    // Flash green then next code
                    inputEl.classList.add('text-green-400');
                    setTimeout(() => {
                        inputEl.classList.remove('text-green-400');
                        genCode();
                    }, 200);
                }
            } else {
                // Wrong code
                inputEl.classList.add('text-red-500');
                setTimeout(() => {
                    inputEl.classList.remove('text-red-500');
                    window.jobGameData.input = "";
                    inputEl.innerText = "____";
                }, 300);
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Register Check</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">15s</div>
            </div>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Scanned: <span id="barcode-count" class="text-green-400">0/3</span></div>
            
            <div class="bg-white p-4 rounded-xl border-4 border-slate-300 mb-4">
                <div class="text-slate-800 text-xs font-bold uppercase mb-1 tracking-widest">SKU Number</div>
                <div id="barcode-target" class="text-4xl font-mono tracking-[0.2em] font-black text-black">0000</div>
                <!-- Fake barcode lines -->
                <div class="w-full h-8 flex justify-center gap-1 mt-2 opacity-70">
                    <div class="w-1 bg-black h-full"></div><div class="w-2 bg-black h-full"></div><div class="w-1 bg-black h-full"></div><div class="w-3 bg-black h-full"></div><div class="w-1 bg-black h-full"></div><div class="w-1 bg-black h-full"></div><div class="w-2 bg-black h-full"></div>
                </div>
            </div>
            
            <div id="barcode-input" class="text-3xl font-mono tracking-[0.3em] font-black text-white mb-4 h-10">____</div>

            <!-- Numpad -->
            <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                ${[1,2,3,4,5,6,7,8,9].map(n => `<button onclick="window.pressNumpad('${n}')" class="bg-slate-700 py-3 rounded-lg text-xl font-black hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">${n}</button>`).join('')}
                <div class="col-span-1"></div>
                <button onclick="window.pressNumpad('0')" class="bg-slate-700 py-3 rounded-lg text-xl font-black hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">0</button>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🛒", () => {
        window.finishJobMinigame(false, -10, "You abandoned the register. The line is out the door.", "🏃");
    });

    setTimeout(() => {
        genCode();
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                window.finishJobMinigame(false, -5, "The customer got impatient and left without paying.", "😡");
            }
        }, 1000);
    }, 100);
};

// 4. Customer Defense (Dialogue De-escalation)
window.startJobGame_karen_defense = function() {
    window.jobGameData = { stage: 0 };
    
    const dialogueStages = [
        {
            cust: "Excuse me! Where is the manager?!",
            correct: 0,
            opts: [
                "Let me see how I can help you first.",
                "I am the manager.", // Escalates
                "In the back."
            ]
        },
        {
            cust: "This coupon expired yesterday but I demand you honor it!",
            correct: 0,
            opts: [
                "Let me check the system for a grace period.",
                "Can't you read?", 
                "No."
            ]
        },
        {
            cust: "I'm never shopping here again!",
            correct: 0,
            opts: [
                "We're sorry to hear that, have a good day.",
                "Finally.", 
                "Please don't go!"
            ]
        }
    ];

    window.replyCustomer = function(index) {
        const currentData = dialogueStages[window.jobGameData.stage];
        
        if (index === currentData.correct) {
            window.jobGameData.stage++;
            
            if (window.jobGameData.stage >= dialogueStages.length) {
                window.finishJobMinigame(true, 10, "You successfully de-escalated the situation using corporate phrasing!", "🛡️");
            } else {
                // Next stage
                renderStage();
            }
        } else {
            window.finishJobMinigame(false, -10, "The customer screamed for the regional director. You made it worse.", "🗣️");
        }
    };

    const renderStage = () => {
        const currentData = dialogueStages[window.jobGameData.stage];
        const custTextEl = document.getElementById('customer-text');
        const optsContainer = document.getElementById('dialogue-opts');
        
        if (custTextEl) custTextEl.innerText = `"${currentData.cust}"`;
        
        if (optsContainer) {
            // Shuffle options visually
            let shuffled = currentData.opts.map((text, i) => ({text, i})).sort(() => Math.random() - 0.5);
            
            optsContainer.innerHTML = shuffled.map(o => `
                <button onclick="window.replyCustomer(${o.i})" class="w-full text-left p-3 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-acs-gold transition-all text-sm font-bold shadow-sm">
                    "${o.text}"
                </button>
            `).join('');
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Angry Customer</h2>
            <p class="text-xs text-slate-400 mb-4">Choose the correct corporate responses to de-escalate!</p>
            
            <div class="bg-red-950/50 border border-red-500 rounded-2xl p-4 mb-6 flex flex-col items-center">
                <div class="text-5xl mb-2 animate-pulse">🤬</div>
                <div id="customer-text" class="text-red-200 font-bold italic text-sm"></div>
            </div>
            
            <div id="dialogue-opts" class="flex flex-col gap-2">
                <!-- Buttons injected here -->
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Hide in Breakroom (-10 Perf)", "🛡️", () => {
        window.finishJobMinigame(false, -10, "You hid in the bathroom until the screaming stopped.", "🏃");
    });

    setTimeout(() => {
        renderStage();
    }, 100);
};

// ==========================================
// FOOD MINIGAMES
// ==========================================

// 1. Burger Stacker (Memory / Assembly)
window.startJobGame_burger_stacker = function() {
    const ingredients = [
        { id: 'bun_bot', icon: '🥯', name: 'Bottom Bun' },
        { id: 'meat', icon: '🥩', name: 'Patty' },
        { id: 'cheese', icon: '🧀', name: 'Cheese' },
        { id: 'lettuce', icon: '🥬', name: 'Lettuce' },
        { id: 'tomato', icon: '🍅', name: 'Tomato' },
        { id: 'bun_top', icon: '🥯', name: 'Top Bun' }
    ];

    // Generate random order of middle ingredients
    let mid = ['meat', 'cheese', 'lettuce', 'tomato'].sort(() => Math.random() - 0.5).slice(0, 3);
    window.jobGameData = {
        order: ['bun_bot', ...mid, 'bun_top'],
        currentStep: 0,
        built: []
    };

    window.addBurgerItem = function(id) {
        const d = window.jobGameData;
        if (d.order[d.currentStep] === id) {
            // Correct ingredient chosen
            d.built.push(id);
            d.currentStep++;
            renderBurger();

            if (d.currentStep >= d.order.length) {
                window.finishJobMinigame(true, 10, "Perfect order! The customer was thrilled.", "🍔");
            }
        } else {
            // Wrong ingredient chosen
            window.finishJobMinigame(false, -10, "You messed up the order. The customer demanded a refund.", "🤢");
        }
    };

    const renderBurger = () => {
        const stackEl = document.getElementById('burger-stack');
        if (stackEl) {
            // Render built items from bottom up using negative margins for stacking
            stackEl.innerHTML = window.jobGameData.built.map(id => {
                let icon = ingredients.find(i => i.id === id).icon;
                return `<div class="text-4xl -mt-4 drop-shadow-md animate-pop">${icon}</div>`;
            }).reverse().join(''); 
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Order Up!</h2>
            <p class="text-xs text-slate-400 mb-4" id="burger-instr">Memorize the order!</p>

            <!-- Order Ticket -->
            <div id="burger-order" class="flex justify-center gap-1 mb-6 h-12 items-center bg-slate-900 rounded-xl border border-slate-700 p-2">
                ${window.jobGameData.order.map(id => `<div class="text-2xl">${ingredients.find(i=>i.id===id).icon}</div>`).join('')}
            </div>

            <!-- Assembly Plate -->
            <div class="flex items-end justify-center h-32 mb-6 border-b-4 border-slate-700 w-32 mx-auto relative">
                <div id="burger-stack" class="flex flex-col items-center justify-end absolute bottom-0"></div>
            </div>

            <!-- Ingredients Pad -->
            <div id="burger-btns" class="grid grid-cols-3 gap-2 opacity-50 pointer-events-none transition-opacity">
                ${ingredients.map(i => `
                    <button onclick="window.addBurgerItem('${i.id}')" class="py-2 bg-slate-800 border-2 border-slate-600 rounded-xl hover:bg-slate-700 active:border-acs-gold flex flex-col items-center">
                        <span class="text-2xl">${i.icon}</span>
                        <span class="text-[9px] font-bold uppercase mt-1 text-slate-300">${i.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🍔", () => {
        window.finishJobMinigame(false, -10, "You walked away from the grill.", "🏃");
    });

    // Hide order ticket after 3 seconds and enable controls
    setTimeout(() => {
        const orderEl = document.getElementById('burger-order');
        const btnsEl = document.getElementById('burger-btns');
        const instrEl = document.getElementById('burger-instr');
        if (orderEl) orderEl.innerHTML = '<div class="text-slate-500 font-bold uppercase tracking-widest">???</div>';
        if (btnsEl) btnsEl.classList.remove('opacity-50', 'pointer-events-none');
        if (instrEl) instrEl.innerText = "Build it!";
    }, 3000);
};

// 2. Coffee Pour (Hold / Timing)
window.startJobGame_coffee_pour = function() {
    window.jobGameData = { fill: 0, isPouring: false, targetMin: 70, targetMax: 85, done: false };
    
    // --- FIX 1: Explicitly clear and nullify the timer on startup ---
    if (window.activeJobTimer) clearInterval(window.activeJobTimer);
    window.activeJobTimer = null; 

    // --- FIX 2: Fixed the ontouchstart syntax so mobile works properly ---
    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Latte Art</h2>
            <p class="text-xs text-slate-400 mb-6">Hold to pour milk. Release inside the <span class="text-green-400 font-bold">GREEN</span> zone!</p>

            <div class="relative w-16 h-48 bg-slate-900 border-4 border-slate-600 rounded-b-3xl rounded-t-lg mx-auto mb-6 overflow-hidden flex items-end shadow-inner">
                <!-- Target Zone -->
                <div class="absolute w-full bg-green-500/30 border-y-2 border-green-400 z-10" style="bottom: 70%; height: 15%;"></div>
                <!-- Liquid -->
                <div id="coffee-fill" class="w-full bg-amber-100 transition-none z-0" style="height: 0%;"></div>
            </div>

            <button id="btn-pour" class="w-full py-4 bg-emerald-600 text-white font-black rounded-xl active:bg-emerald-500 active:scale-95 transition-all shadow-md uppercase tracking-widest"
                    onmousedown="window.startPouring()" onmouseup="window.stopPouring()" onmouseleave="window.stopPouring()"
                    ontouchstart="event.preventDefault(); window.startPouring();" ontouchend="window.stopPouring()">
                Hold to Pour
            </button>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "☕", () => {
        if (window.activeJobTimer) clearInterval(window.activeJobTimer);
        window.activeJobTimer = null;
        window.finishJobMinigame(false, -10, "You dumped the milk down the drain.", "🗑️");
    });

    window.startPouring = function() {
        if (window.jobGameData.done) return;
        window.jobGameData.isPouring = true;
        document.getElementById('btn-pour').innerText = "POURING...";

        if (!window.activeJobTimer) {
            window.activeJobTimer = setInterval(() => {
                if (window.jobGameData.isPouring) {
                    window.jobGameData.fill += 1.5; // Fill speed
                    const fillEl = document.getElementById('coffee-fill');
                    if (fillEl) fillEl.style.height = window.jobGameData.fill + '%';

                    if (window.jobGameData.fill >= 100) {
                        window.stopPouring(true); // Overflowed!
                    }
                }
            }, 16);
        }
    };

    window.stopPouring = function(overflow = false) {
        if (window.jobGameData.done || !window.jobGameData.isPouring) return;
        window.jobGameData.isPouring = false;
        window.jobGameData.done = true;
        
        // --- FIX 3: Nullify here as well ---
        clearInterval(window.activeJobTimer);
        window.activeJobTimer = null;

        const fill = window.jobGameData.fill;
        const min = window.jobGameData.targetMin;
        const max = window.jobGameData.targetMax;

        if (overflow || fill > max) {
            window.finishJobMinigame(false, -5, "You overflowed the cup! What a mess.", "🔥");
        } else if (fill < min) {
            window.finishJobMinigame(false, -5, "You didn't pour enough. The customer looks disappointed.", "📉");
        } else {
            window.finishJobMinigame(true, 5, "Perfect pour! A flawless rosetta latte art.", "☕");
        }
    };
};
// 3. Dish Duty (Mouse Swipe / Scrubbing)
window.startJobGame_dish_duty = function() {
    window.jobGameData = { dirt: 100, lastX: -1, time: 8 };

    window.scrubDish = function(e) {
        if (window.jobGameData.dirt <= 0) return;

        let currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        
        if (window.jobGameData.lastX !== -1) {
            let delta = Math.abs(currentX - window.jobGameData.lastX);
            window.jobGameData.dirt -= delta * 0.15; // Scrub power
        }
        window.jobGameData.lastX = currentX;

        const dirtEl = document.getElementById('dish-dirt');
        if (dirtEl) {
            dirtEl.style.opacity = Math.max(0, window.jobGameData.dirt) / 100;
        }

        // Win check
        if (window.jobGameData.dirt <= 0) {
            clearInterval(window.activeJobTimer);
            window.finishJobMinigame(true, 5, "The plate is squeaky clean!", "✨");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Dish Duty</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">8s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">Swipe back and forth rapidly over the plate to scrub it clean!</p>

            <div class="flex justify-center mb-6">
                <div class="relative w-40 h-40 rounded-full border-4 border-slate-300 bg-white shadow-xl flex items-center justify-center overflow-hidden cursor-crosshair"
                     onmousemove="window.scrubDish(event)"
                     ontouchmove="(e)=>{e.preventDefault(); window.scrubDish(e);}">
                    <!-- Clean Plate Base -->
                    <div class="absolute inset-2 border border-slate-200 rounded-full pointer-events-none"></div>

                    <!-- Dirt Layer -->
                    <div id="dish-dirt" class="absolute inset-0 bg-amber-900/80 pointer-events-none transition-opacity duration-75 flex items-center justify-center mix-blend-multiply" style="background-image: radial-gradient(circle, #78350f 10%, transparent 20%); background-size: 15px 15px;">
                        <div class="text-4xl opacity-50">🍝</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Drop Plate (-10 Perf)", "🍽️", () => {
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You dropped the plate and it shattered.", "💥");
    });

    window.activeJobTimer = setInterval(() => {
        window.jobGameData.time--;
        const timerEl = document.getElementById('job-timer');
        if(timerEl) timerEl.innerText = window.jobGameData.time + "s";

        if (window.jobGameData.time <= 0) {
            clearInterval(window.activeJobTimer);
            window.finishJobMinigame(false, -5, "Too slow! The dishes are piling up.", "⏱️");
        }
    }, 1000);
};

// 4. Fry Fryer (Time Management)
window.startJobGame_fry_fryer = function() {
    window.jobGameData = {
        vats: [
            { id: 0, p: Math.random() * 30, speed: 0.3 + Math.random() * 0.2, pulled: false },
            { id: 1, p: Math.random() * 20, speed: 0.2 + Math.random() * 0.3, pulled: false },
            { id: 2, p: Math.random() * 40, speed: 0.4 + Math.random() * 0.2, pulled: false }
        ],
        successes: 0,
        active: true
    };

    window.pullFry = function(id) {
        if (!window.jobGameData.active) return;
        const vat = window.jobGameData.vats[id];
        if (vat.pulled) return;

        vat.pulled = true;
        const btn = document.getElementById(`btn-fry-${id}`);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50');
            btn.innerText = "PULLED";
        }

        if (vat.p >= 75 && vat.p <= 95) {
            // Perfect
            window.jobGameData.successes++;
            if (btn) btn.classList.replace('bg-slate-700', 'bg-green-600');
        } else if (vat.p > 95) {
            // Burnt
            failGame("You pulled burnt fries!");
        } else {
            // Raw
            failGame("You pulled raw, frozen fries!");
        }

        if (window.jobGameData.successes === 3) {
            winGame();
        }
    };

    const failGame = (msg) => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, msg, "🔥");
    };

    const winGame = () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(true, 10, "Perfectly golden fries across the board!", "🍟");
    };

    const renderVats = () => {
        return window.jobGameData.vats.map(v => `
            <div class="flex flex-col items-center gap-2">
                <div class="w-16 h-32 bg-slate-900 border-4 border-slate-600 rounded-t-xl rounded-b-md relative overflow-hidden shadow-inner">
                    <div id="vat-fill-${v.id}" class="absolute bottom-0 w-full transition-none" style="height: ${v.p}%; background-color: #eab308;"></div>
                    <!-- Target Zone 75-95 -->
                    <div class="absolute w-full border-y-2 border-green-400 bg-green-400/20 z-10 pointer-events-none" style="bottom: 75%; height: 20%;"></div>
                    <div class="absolute w-full bg-red-500/50 z-10 pointer-events-none" style="bottom: 95%; height: 5%;"></div>
                </div>
                <button id="btn-fry-${v.id}" onclick="window.pullFry(${v.id})" class="w-full py-2 bg-slate-700 text-white font-bold text-[10px] uppercase rounded-lg hover:bg-slate-600 active:scale-95 transition-all">
                    PULL
                </button>
            </div>
        `).join('');
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Fry Station</h2>
            <p class="text-xs text-slate-400 mb-6">Pull the baskets when they are in the <span class="text-green-400 font-bold">GREEN</span> zone. Don't let them burn in the <span class="text-red-400 font-bold">RED</span>!</p>

            <div class="flex justify-center gap-4 mb-4">
                ${renderVats()}
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🍟", () => {
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You left the fryers unattended.", "🏃");
    });

    window.activeJobTimer = setInterval(() => {
        if (!window.jobGameData.active) return;

        window.jobGameData.vats.forEach(v => {
            if (!v.pulled) {
                v.p += v.speed;
                const fillEl = document.getElementById(`vat-fill-${v.id}`);
                if (fillEl) {
                    fillEl.style.height = v.p + '%';

                    // Change color based on doneness
                    if (v.p > 95) fillEl.style.backgroundColor = '#dc2626'; // Burnt red
                    else if (v.p > 75) fillEl.style.backgroundColor = '#f59e0b'; // Perfect amber
                }

                if (v.p >= 100) {
                    failGame("The fries burned to a crisp! The fire alarm is going off.");
                }
            }
        });
    }, 16);
};

// ==========================================
// DAYCARE MINIGAMES
// ==========================================

// 1. Naptime Ninja (Whack-a-Mole)
window.startJobGame_naptime_ninja = function() {
    window.jobGameData = { shushed: 0, required: 8, time: 12, beds: [0,0,0,0,0,0], active: true };

    window.shushKid = function(idx) {
        if (!window.jobGameData.active) return;
        
        if (window.jobGameData.beds[idx] === 1) {
            window.jobGameData.beds[idx] = 0;
            window.jobGameData.shushed++;
            document.getElementById('ninja-count').innerText = `${window.jobGameData.shushed}/${window.jobGameData.required}`;
            renderBeds();
            
            if (window.jobGameData.shushed >= window.jobGameData.required) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 10, "Peace and quiet. A successful naptime.", "😴");
            }
        }
    };

    const renderBeds = () => {
        const el = document.getElementById('ninja-beds');
        if (el) {
            el.innerHTML = window.jobGameData.beds.map((state, i) => {
                if (state === 1) {
                    return `<div onclick="window.shushKid(${i})" class="bg-red-200 border-4 border-red-400 rounded-xl h-20 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all"><span class="text-4xl animate-bounce">😭</span></div>`;
                } else {
                    return `<div class="bg-indigo-900 border-4 border-indigo-700 rounded-xl h-20 flex items-center justify-center opacity-70 transition-all"><span class="text-3xl opacity-50">😴</span></div>`;
                }
            }).join('');
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Naptime Ninja</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">12s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Tap crying toddlers to shush them before 4 wake up at once!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Shushed: <span id="ninja-count" class="text-green-400">0/8</span></div>
            
            <div id="ninja-beds" class="grid grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-700 shadow-inner">
                <!-- Beds injected here -->
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Hide in Closet (-10 Perf)", "🍼", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You abandoned the children. Chaos ensued.", "🏃");
    });

    setTimeout(() => {
        renderBeds();
        // Custom interval logic handles both timer and spawning
        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            // Timer Tick (every ~1s)
            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "Naptime is over and they are cranky!", "⏱️");
                }
            }

            // Spawn Tick (every ~600ms)
            if (frame % 35 === 0) {
                let awakeCount = window.jobGameData.beds.filter(b => b === 1).length;
                
                // Lose Condition: Too many awake
                if (awakeCount >= 4) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -10, "Too many kids woke up! It's a complete disaster.", "😭");
                    return;
                }

                // Wake up a random sleeping kid
                let asleep = window.jobGameData.beds.map((b, i) => b === 0 ? i : -1).filter(i => i !== -1);
                if (asleep.length > 0) {
                    let wakeIdx = asleep[Math.floor(Math.random() * asleep.length)];
                    window.jobGameData.beds[wakeIdx] = 1;
                    renderBeds();
                }
            }
        }, 16);
    }, 100);
};

// 2. Toy Sort (Bin Sorting)
window.startJobGame_toy_sort = function() {
    window.jobGameData = { sorted: 0, required: 6, time: 10, targetType: '' };

    const toys = [
        { type: 'sports', icon: '⚽' }, { type: 'sports', icon: '🏀' },
        { type: 'cars', icon: '🚗' }, { type: 'cars', icon: '🚕' },
        { type: 'plush', icon: '🧸' }, { type: 'plush', icon: '🦄' }
    ];

    const generateToy = () => {
        const t = toys[Math.floor(Math.random() * toys.length)];
        window.jobGameData.targetType = t.type;
        const el = document.getElementById('toy-item');
        if (el) {
            el.innerHTML = t.icon;
            el.className = "text-6xl w-24 h-24 rounded-2xl flex items-center justify-center animate-pop drop-shadow-lg";
        }
    };

    window.checkToySort = function(chosenType) {
        if (window.jobGameData.targetType === chosenType) {
            window.jobGameData.sorted++;
            document.getElementById('toy-count').innerText = `${window.jobGameData.sorted}/${window.jobGameData.required}`;
            
            if (window.jobGameData.sorted >= window.jobGameData.required) {
                window.finishJobMinigame(true, 5, "You perfectly organized the playroom!", "🧸");
            } else {
                generateToy();
            }
        } else {
            window.finishJobMinigame(false, -5, "You threw a toy in the wrong bin and the kids threw a fit.", "😭");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Toy Sort</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">Sort the scattered toys into their correct bins!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-4">Cleaned: <span id="toy-count" class="text-green-400">0/6</span></div>
            
            <div class="flex justify-center mb-8 h-24">
                <div id="toy-item"></div>
            </div>

            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.checkToySort('sports')" class="h-16 bg-slate-800 border-2 border-slate-600 rounded-xl hover:bg-slate-700 active:translate-y-1 transition-all flex flex-col items-center justify-center text-xs font-bold text-slate-300 uppercase">Sports 🏈</button>
                <button onclick="window.checkToySort('cars')" class="h-16 bg-slate-800 border-2 border-slate-600 rounded-xl hover:bg-slate-700 active:translate-y-1 transition-all flex flex-col items-center justify-center text-xs font-bold text-slate-300 uppercase">Cars 🏎️</button>
                <button onclick="window.checkToySort('plush')" class="h-16 bg-slate-800 border-2 border-slate-600 rounded-xl hover:bg-slate-700 active:translate-y-1 transition-all flex flex-col items-center justify-center text-xs font-bold text-slate-300 uppercase">Plush 🧸</button>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "🧹", () => {
        window.finishJobMinigame(false, -10, "You refused to clean. The floor is a hazard.", "🏃");
    });

    setTimeout(() => {
        generateToy();
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                window.finishJobMinigame(false, -5, "Too slow! The parents arrived to a messy room.", "⏱️");
            }
        }, 1000);
    }, 100);
};

// 3. Tantrum Tamer (Matching)
window.startJobGame_tantrum_tamer = function() {
    window.jobGameData = { soothed: 0, required: 4, time: 10, targetWant: '' };

    const wants = ['🍼', '🧸', '🧃', '🍪'];

    const generateTantrum = () => {
        const want = wants[Math.floor(Math.random() * wants.length)];
        window.jobGameData.targetWant = want;
        const el = document.getElementById('toddler-want');
        if (el) {
            el.innerHTML = want;
            el.className = "text-5xl animate-bounce drop-shadow";
        }
    };

    window.giveItem = function(item) {
        if (window.jobGameData.targetWant === item) {
            window.jobGameData.soothed++;
            document.getElementById('soothe-count').innerText = `${window.jobGameData.soothed}/${window.jobGameData.required}`;
            
            if (window.jobGameData.soothed >= window.jobGameData.required) {
                window.finishJobMinigame(true, 5, "Crisis averted! You successfully prevented a meltdown.", "🍼");
            } else {
                generateTantrum();
            }
        } else {
            window.finishJobMinigame(false, -5, "You gave them the wrong thing. Full meltdown initiated!", "🤬");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Tantrum Tamer</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">Read their mind and hand them what they want fast!</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Soothed: <span id="soothe-count" class="text-green-400">0/4</span></div>

            <!-- Toddler Thought Bubble -->
            <div class="bg-blue-100 rounded-3xl p-6 w-48 mx-auto mb-6 relative border-4 border-blue-300 flex items-center justify-center h-32">
                <div id="toddler-want"></div>
                <!-- Bubble Tail -->
                <div class="absolute -bottom-6 left-1/2 w-6 h-6 bg-blue-100 border-b-4 border-r-4 border-blue-300 transform rotate-45 -translate-x-1/2"></div>
            </div>

            <!-- Options -->
            <div class="grid grid-cols-4 gap-2 max-w-[250px] mx-auto">
                ${wants.map(w => `<button onclick="window.giveItem('${w}')" class="bg-slate-700 h-14 rounded-xl text-3xl hover:bg-slate-600 active:scale-90 transition-all">${w}</button>`).join('')}
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Plug Ears (-10 Perf)", "🎧", () => {
        window.finishJobMinigame(false, -10, "You ignored the crying child. The manager was not happy.", "🏃");
    });

    setTimeout(() => {
        generateTantrum();
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                window.finishJobMinigame(false, -5, "Too slow. The tantrum is uncontrollable now.", "⏱️");
            }
        }, 1000);
    }, 100);
};

// 4. Tag Tracker (Catching / Agility)
window.startJobGame_tag_tracker = function() {
    window.jobGameData = { caught: 0, required: 4, time: 10, active: true };

    window.catchKid = function() {
        if (!window.jobGameData.active) return;
        
        window.jobGameData.caught++;
        document.getElementById('catch-count').innerText = `${window.jobGameData.caught}/${window.jobGameData.required}`;
        
        // Visual Pop on catch
        const el = document.getElementById('runner-kid');
        if(el) {
            el.innerHTML = "😵‍💫"; // Dizzy face when caught
            setTimeout(() => { if(el) el.innerHTML = "🏃"; }, 300);
        }
        
        if (window.jobGameData.caught >= window.jobGameData.required) {
            window.jobGameData.active = false;
            clearInterval(window.activeJobTimer);
            window.finishJobMinigame(true, 5, "You caught the runner before they escaped the playground!", "🏃");
        } else {
            moveKid(); // Instantly jump away when caught
        }
    };

    const moveKid = () => {
        if (!window.jobGameData.active) return;
        const el = document.getElementById('runner-kid');
        if (el) {
            // Keep strictly within container boundaries (10% to 85%)
            const x = 5 + Math.random() * 80;
            const y = 5 + Math.random() * 75;
            el.style.left = x + '%';
            el.style.top = y + '%';
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Recess Runner</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">A child is making a break for it! Click them to tag them.</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Tagged: <span id="catch-count" class="text-green-400">0/4</span></div>

            <!-- Playground Area -->
            <div class="relative w-full h-48 bg-emerald-800 rounded-xl border-4 border-slate-600 shadow-inner overflow-hidden cursor-crosshair" style="background-image: radial-gradient(#064e3b 15%, transparent 16%); background-size: 20px 20px;">
                <!-- Moving Target -->
                <div id="runner-kid" onmousedown="window.catchKid()" ontouchstart="(e)=>{e.preventDefault(); window.catchKid();}" class="absolute w-12 h-12 flex items-center justify-center text-4xl transition-all duration-300 ease-in-out z-10 active:scale-90" style="left: 40%; top: 40%;">
                    🏃
                </div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Let Them Go (-10 Perf)", "🚪", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You let them run out the front door. Are you kidding me?", "🏃");
    });

    setTimeout(() => {
        // Run timer and movement loops
        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            // Timer (Every ~1s)
            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "They got away and caused havoc in the lobby.", "⏱️");
                }
            }

            // Move randomly every ~600ms even if not clicked
            if (frame % 35 === 0) {
                moveKid();
            }
        }, 16);
    }, 100);

        
};

// ==========================================
// TECH MINIGAMES
// ==========================================

// 1. Bug Smasher (Moving Targets)
window.startJobGame_bug_smasher = function() {
    window.jobGameData = { smashed: 0, required: 6, time: 10, bugs: [], active: true };

    const spawnBug = () => {
        if (!window.jobGameData.active) return;
        const area = document.getElementById('code-area');
        if (!area) return;

        const id = Date.now() + Math.random();
        const isSpider = Math.random() > 0.5;
        const bug = {
            id,
            x: Math.random() * 80,
            y: Math.random() * 80,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        };
        
        window.jobGameData.bugs.push(bug);

        const el = document.createElement('div');
        el.id = `bug-${id}`;
        el.className = "absolute text-3xl cursor-crosshair z-20 hover:scale-110 transition-transform";
        el.innerHTML = isSpider ? "🕷️" : "🐛";
        el.style.left = bug.x + '%';
        el.style.top = bug.y + '%';
        el.onmousedown = () => window.smashBug(id);
        el.ontouchstart = (e) => { e.preventDefault(); window.smashBug(id); };
        area.appendChild(el);
    };

    window.smashBug = function(id) {
        if (!window.jobGameData.active) return;
        const idx = window.jobGameData.bugs.findIndex(b => b.id === id);
        if (idx > -1) {
            window.jobGameData.bugs.splice(idx, 1);
            const el = document.getElementById(`bug-${id}`);
            if (el) {
                el.innerHTML = "💥";
                setTimeout(() => el.remove(), 200);
            }
            
            window.jobGameData.smashed++;
            document.getElementById('bug-count').innerText = `${window.jobGameData.smashed}/${window.jobGameData.required}`;

            if (window.jobGameData.smashed >= window.jobGameData.required) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 5, "Bugs squashed! The code compiles perfectly.", "💻");
            } else {
                spawnBug(); // Keep pressure up
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Bug Smasher</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-2">Literal bugs in the code! Click them to debug the system.</p>
            <div class="text-sm font-bold text-slate-300 mb-2">Squashed: <span id="bug-count" class="text-green-400">0/6</span></div>

            <div id="code-area" class="relative w-full h-48 bg-slate-950 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner text-left p-2 font-mono text-[8px] text-green-500/50 leading-tight select-none pointer-events-auto">
                <div>function init() {</div>
                <div class="pl-4">let system = new Core();</div>
                <div class="pl-4">system.boot();</div>
                <div class="pl-4">if (system.hasError) {</div>
                <div class="pl-8">throw new Error("Critical Fault");</div>
                <div class="pl-4">}</div>
                <div>}</div>
                <div>while(true) { checkMem(); }</div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🐛", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You let the bugs take over the server room.", "🏃");
    });

    setTimeout(() => {
        for(let i=0; i<3; i++) spawnBug(); // Initial spawn

        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "The bugs multiplied and crashed the mainframe.", "💥");
                }
            }

            // Move bugs
            window.jobGameData.bugs.forEach(b => {
                b.x += b.dx;
                b.y += b.dy;
                // Bounce off walls
                if (b.x <= 0 || b.x >= 90) b.dx *= -1;
                if (b.y <= 0 || b.y >= 85) b.dy *= -1;

                const el = document.getElementById(`bug-${b.id}`);
                if (el) {
                    el.style.left = b.x + '%';
                    el.style.top = b.y + '%';
                }
            });
        }, 16);
    }, 100);
};

// 2. Wire Connect (Matching Logic)
window.startJobGame_wire_connect = function() {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
    let rightPorts = [...colors].sort(() => Math.random() - 0.5);

    window.jobGameData = { selectedColor: null, connected: 0, rightPorts, time: 12 };

    window.selectWire = function(color) {
        window.jobGameData.selectedColor = color;
        // Visual feedback for selection
        colors.forEach(c => {
            let el = document.getElementById(`wire-l-${c}`);
            if(el) el.classList.remove('ring-4', 'ring-white');
        });
        document.getElementById(`wire-l-${color}`).classList.add('ring-4', 'ring-white');
    };

    window.connectPort = function(index) {
        if (!window.jobGameData.selectedColor) return;
        
        const targetColor = window.jobGameData.rightPorts[index];
        const portEl = document.getElementById(`wire-r-${index}`);

        if (window.jobGameData.selectedColor === targetColor) {
            // Correct connection!
            portEl.classList.remove('bg-slate-800', 'border-slate-600');
            portEl.classList.add(targetColor, 'border-white', 'pointer-events-none');
            portEl.innerHTML = "✓";
            
            window.jobGameData.connected++;
            window.jobGameData.selectedColor = null; // Reset selection

            if (window.jobGameData.connected >= 4) {
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 5, "Servers re-wired perfectly!", "🔌");
            }
        } else {
            // Wrong connection
            portEl.classList.add('border-red-500', 'bg-red-500/20');
            setTimeout(() => {
                portEl.classList.remove('border-red-500', 'bg-red-500/20');
            }, 300);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Wire Connect</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">12s</div>
            </div>
            <p class="text-xs text-slate-400 mb-6">Click a colored wire on the left, then click the matching port on the right to connect them.</p>

            <div class="flex justify-between items-center px-8 mb-6">
                <!-- Left Wires -->
                <div class="flex flex-col gap-4">
                    ${colors.map(c => `<button id="wire-l-${c}" onclick="window.selectWire('${c}')" class="w-12 h-12 rounded-full border-2 border-slate-900 shadow-md ${c} transition-all"></button>`).join('')}
                </div>
                
                <div class="text-4xl text-slate-600">➡️</div>

                <!-- Right Ports -->
                <div class="flex flex-col gap-4">
                    ${rightPorts.map((c, i) => `<button id="wire-r-${i}" onclick="window.connectPort(${i})" class="w-12 h-12 rounded-xl border-4 border-slate-600 bg-slate-800 flex items-center justify-center font-black text-white transition-all shadow-inner"></button>`).join('')}
                </div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "⚡", () => {
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You tangled the wires and caused a short circuit.", "🔥");
    });

    setTimeout(() => {
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(false, -5, "You took too long. The server overheated.", "⏱️");
            }
        }, 1000);
    }, 100);
};

// 3. Reboot Sequence (Simon Says)
window.startJobGame_reboot_sequence = function() {
    window.jobGameData = { sequence: [], playerStep: 0, showing: false };
    const nodes = [0, 1, 2, 3];
    
    // Generate a 4-step sequence
    for(let i=0; i<4; i++) {
        window.jobGameData.sequence.push(Math.floor(Math.random() * 4));
    }

    const flashNode = (idx, delay) => {
        setTimeout(() => {
            const el = document.getElementById(`node-${idx}`);
            if (el) {
                el.classList.add('bg-acs-gold', 'scale-110');
                el.classList.remove('bg-slate-700');
                setTimeout(() => {
                    el.classList.remove('bg-acs-gold', 'scale-110');
                    el.classList.add('bg-slate-700');
                }, 400);
            }
        }, delay);
    };

    const playSequence = () => {
        window.jobGameData.showing = true;
        document.getElementById('reboot-status').innerText = "WATCH THE SEQUENCE...";
        document.getElementById('reboot-status').classList.replace('text-green-400', 'text-yellow-400');
        
        let delay = 500;
        window.jobGameData.sequence.forEach((nodeIdx) => {
            flashNode(nodeIdx, delay);
            delay += 600;
        });

        setTimeout(() => {
            window.jobGameData.showing = false;
            window.jobGameData.playerStep = 0;
            document.getElementById('reboot-status').innerText = "YOUR TURN!";
            document.getElementById('reboot-status').classList.replace('text-yellow-400', 'text-green-400');
        }, delay);
    };

    window.clickNode = function(idx) {
        if (window.jobGameData.showing) return;

        // Flash it briefly on click
        const el = document.getElementById(`node-${idx}`);
        if(el) {
            el.classList.add('bg-white');
            setTimeout(() => el.classList.remove('bg-white'), 150);
        }

        if (idx === window.jobGameData.sequence[window.jobGameData.playerStep]) {
            // Correct step
            window.jobGameData.playerStep++;
            if (window.jobGameData.playerStep >= window.jobGameData.sequence.length) {
                window.finishJobMinigame(true, 5, "Sequence accepted. Mainframe rebooted.", "💻");
            }
        } else {
            // Wrong step
            window.finishJobMinigame(false, -10, "Invalid sequence! You locked the entire system.", "🔒");
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Reboot Sequence</h2>
            <p class="text-xs text-slate-400 mb-6">Watch the nodes flash, then repeat the exact pattern!</p>
            
            <div id="reboot-status" class="text-sm font-black text-yellow-400 mb-6 tracking-widest">PREPARING...</div>

            <div class="grid grid-cols-2 gap-4 max-w-[200px] mx-auto mb-6">
                <button id="node-0" onclick="window.clickNode(0)" class="aspect-square bg-slate-700 border-4 border-slate-900 rounded-2xl shadow-inner transition-all"></button>
                <button id="node-1" onclick="window.clickNode(1)" class="aspect-square bg-slate-700 border-4 border-slate-900 rounded-2xl shadow-inner transition-all"></button>
                <button id="node-2" onclick="window.clickNode(2)" class="aspect-square bg-slate-700 border-4 border-slate-900 rounded-2xl shadow-inner transition-all"></button>
                <button id="node-3" onclick="window.clickNode(3)" class="aspect-square bg-slate-700 border-4 border-slate-900 rounded-2xl shadow-inner transition-all"></button>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🔄", () => {
        window.finishJobMinigame(false, -10, "You abandoned the console.", "🏃");
    });

    setTimeout(playSequence, 1000);
};

// 4. Password Cracker (Higher/Lower Logic)
window.startJobGame_password_cracker = function() {
    window.jobGameData = { time: 20, target: [0,0,0], currentBox: 0 };
    
    // Generate Target PIN (1-9)
    for(let i=0; i<3; i++) {
        window.jobGameData.target[i] = Math.floor(Math.random() * 9) + 1;
    }

    window.guessPin = function(num) {
        const d = window.jobGameData;
        if (d.currentBox > 2) return; // Done

        const val = parseInt(num);
        const targetVal = d.target[d.currentBox];
        const boxEl = document.getElementById(`pin-box-${d.currentBox}`);
        const hintEl = document.getElementById(`pin-hint-${d.currentBox}`);

        boxEl.innerText = val;

        if (val === targetVal) {
            boxEl.classList.replace('border-slate-500', 'border-green-500');
            boxEl.classList.add('text-green-400');
            hintEl.innerText = "✓";
            hintEl.classList.add('text-green-400');
            d.currentBox++;

            if (d.currentBox > 2) {
                clearInterval(window.activeJobTimer);
                setTimeout(() => {
                    window.finishJobMinigame(true, 10, "Access Granted! You cracked the PIN.", "🔓");
                }, 500);
            }
        } else if (val < targetVal) {
            hintEl.innerText = "HIGHER ⬆️";
            boxEl.classList.add('border-red-500');
            setTimeout(() => boxEl.classList.remove('border-red-500'), 300);
        } else {
            hintEl.innerText = "LOWER ⬇️";
            boxEl.classList.add('border-red-500');
            setTimeout(() => boxEl.classList.remove('border-red-500'), 300);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Password Cracker</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">20s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-4">Guess the 3-digit admin PIN. The system will tell you if the digit is Higher or Lower!</p>

            <div class="flex justify-center gap-4 mb-2">
                <div class="flex flex-col items-center">
                    <div id="pin-box-0" class="w-12 h-16 bg-slate-900 border-2 border-slate-500 rounded-lg flex items-center justify-center text-3xl font-mono font-black text-white">?</div>
                    <div id="pin-hint-0" class="text-[9px] font-bold text-slate-400 mt-1 h-3"></div>
                </div>
                <div class="flex flex-col items-center">
                    <div id="pin-box-1" class="w-12 h-16 bg-slate-900 border-2 border-slate-500 rounded-lg flex items-center justify-center text-3xl font-mono font-black text-white">?</div>
                    <div id="pin-hint-1" class="text-[9px] font-bold text-slate-400 mt-1 h-3"></div>
                </div>
                <div class="flex flex-col items-center">
                    <div id="pin-box-2" class="w-12 h-16 bg-slate-900 border-2 border-slate-500 rounded-lg flex items-center justify-center text-3xl font-mono font-black text-white">?</div>
                    <div id="pin-hint-2" class="text-[9px] font-bold text-slate-400 mt-1 h-3"></div>
                </div>
            </div>

            <!-- Numpad -->
            <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mt-4">
                ${[1,2,3,4,5,6,7,8,9].map(n => `<button onclick="window.guessPin(${n})" class="bg-slate-700 py-3 rounded-lg text-xl font-black hover:bg-slate-600 active:bg-acs-gold active:text-black transition-colors">${n}</button>`).join('')}
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Lock System (-10 Perf)", "⌨️", () => {
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You panicked and locked the system.", "🔒");
    });

    setTimeout(() => {
        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(false, -5, "Security lockdown! You took too long.", "🚨");
            }
        }, 1000);
    }, 100);
};

// ==========================================
// ANIMAL MINIGAMES
// ==========================================

// 1. Kibble Catch (Falling Objects)
window.startJobGame_kibble_catch = function() {
    window.jobGameData = { score: 0, required: 10, time: 15, items: [], active: true, bowlX: 50 };

    window.moveCatchBowl = function(e) {
        if (!window.jobGameData.active) return;
        const area = document.getElementById('catch-area');
        if (!area) return;
        
        let clientX = e.clientX || (e.touches && e.touches.length > 0 ? e.touches[0].clientX : window.jobGameData.bowlX);
        let rect = area.getBoundingClientRect();
        let x = clientX - rect.left;
        let pct = (x / rect.width) * 100;
        
        window.jobGameData.bowlX = Math.max(10, Math.min(90, pct));
        const bowl = document.getElementById('catch-bowl');
        if (bowl) bowl.style.left = `${window.jobGameData.bowlX}%`;
    };

    const spawnFallingItem = () => {
        if (!window.jobGameData.active) return;
        const area = document.getElementById('catch-area');
        if (!area) return;

        const isBad = Math.random() < 0.3; // 30% chance for a hairball
        const id = Date.now() + Math.random();
        
        const item = {
            id,
            x: 10 + Math.random() * 80,
            y: -10,
            speed: 0.8 + Math.random() * 1.5,
            isBad
        };
        
        window.jobGameData.items.push(item);

        const el = document.createElement('div');
        el.id = `drop-${id}`;
        el.className = "absolute text-3xl z-10 drop-shadow-md";
        el.innerHTML = isBad ? "🧶" : "🦴"; // Hairball vs Bone/Kibble
        el.style.left = item.x + '%';
        el.style.top = item.y + '%';
        el.style.transform = "translateX(-50%)";
        area.appendChild(el);
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Kibble Catch</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">15s</div>
            </div>
            <p class="text-xs text-slate-400 mb-2">Catch the 🦴 kibble, dodge the 🧶 hairballs!</p>
            <div class="text-sm font-bold text-slate-300 mb-2">Caught: <span id="catch-score" class="text-green-400">0/10</span></div>

            <div id="catch-area" class="relative w-full h-48 bg-amber-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner cursor-none"
                 onmousemove="window.moveCatchBowl(event)" 
                 ontouchmove="(e)=>{e.preventDefault(); window.moveCatchBowl(e);}">
                 
                <!-- The Bowl -->
                <div id="catch-bowl" class="absolute bottom-2 w-16 h-10 bg-slate-200 border-4 border-slate-400 rounded-b-3xl z-20" style="left: 50%; transform: translateX(-50%);">
                    <div class="w-full h-2 bg-slate-300 rounded-full absolute -top-1"></div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🦴", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You dropped all the food on the floor.", "🏃");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "Time's up! You didn't catch enough food.", "⏱️");
                }
            }

            if (frame % 40 === 0) spawnFallingItem();

            // Move & Collide items
            for (let i = 0; i < window.jobGameData.items.length; i++) {
                let item = window.jobGameData.items[i];
                item.y += item.speed;

                const el = document.getElementById(`drop-${item.id}`);
                if (el) el.style.top = item.y + '%';

                // Collision Check (Bowl is around y: 85)
                if (item.y > 80 && item.y < 95) {
                    // Check X alignment (bowl is 16px wide, roughly 15% of width)
                    if (Math.abs(item.x - window.jobGameData.bowlX) < 15) {
                        // Caught it!
                        if (el) el.remove();
                        window.jobGameData.items.splice(i, 1);
                        i--;

                        if (item.isBad) {
                            window.jobGameData.score = Math.max(0, window.jobGameData.score - 2);
                            const bowl = document.getElementById('catch-bowl');
                            if(bowl) { bowl.classList.add('bg-red-500'); setTimeout(()=>bowl.classList.remove('bg-red-500'), 200); }
                        } else {
                            window.jobGameData.score++;
                            const bowl = document.getElementById('catch-bowl');
                            if(bowl) { bowl.classList.add('bg-green-400'); setTimeout(()=>bowl.classList.remove('bg-green-400'), 200); }
                        }
                        
                        document.getElementById('catch-score').innerText = `${window.jobGameData.score}/${window.jobGameData.required}`;

                        if (window.jobGameData.score >= window.jobGameData.required) {
                            window.jobGameData.active = false;
                            clearInterval(window.activeJobTimer);
                            window.finishJobMinigame(true, 5, "You filled the bowl perfectly!", "🍲");
                        }
                        continue;
                    }
                }

                // Off screen
                if (item.y > 100) {
                    if (el) el.remove();
                    window.jobGameData.items.splice(i, 1);
                    i--;
                }
            }
        }, 16);
    }, 100);
};

// 2. Pet Petter (Hover Tracking)
window.startJobGame_pet_petter = function() {
    window.jobGameData = { progress: 0, required: 100, time: 10, active: true, spotX: 50, spotY: 50, mouseX: -100, mouseY: -100 };

    window.trackPetMouse = function(e) {
        const area = document.getElementById('pet-area');
        if (!area) return;
        let rect = area.getBoundingClientRect();
        let clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        let clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        
        window.jobGameData.mouseX = ((clientX - rect.left) / rect.width) * 100;
        window.jobGameData.mouseY = ((clientY - rect.top) / rect.height) * 100;
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Belly Rubs</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">Keep your cursor/finger inside the green <span class="font-bold text-green-400">Sweet Spot</span>!</p>

            <!-- Progress Bar -->
            <div class="w-full h-4 bg-slate-800 rounded-full mb-4 border border-slate-600 overflow-hidden shadow-inner">
                <div id="pet-progress" class="h-full bg-pink-500 transition-none" style="width: 0%;"></div>
            </div>

            <!-- Interaction Area -->
            <div id="pet-area" class="relative w-full h-48 bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner cursor-crosshair flex items-center justify-center"
                 onmousemove="window.trackPetMouse(event)" 
                 ontouchmove="(e)=>{e.preventDefault(); window.trackPetMouse(e);}">
                
                <div class="text-8xl pointer-events-none opacity-50">🐕</div>
                
                <!-- The Sweet Spot -->
                <div id="sweet-spot" class="absolute w-16 h-16 bg-green-500/50 border-2 border-green-400 rounded-full blur-[2px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-none" style="left: 50%; top: 50%;"></div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Ignore Dog (-10 Perf)", "🐕", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You refused to pet the dog. You monster.", "🏃");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "The dog got bored and walked away.", "⏱️");
                }
            }

            // Move the sweet spot in a figure-8 / Lissajous curve pattern
            window.jobGameData.spotX = 50 + Math.sin(frame * 0.05) * 35;
            window.jobGameData.spotY = 50 + Math.cos(frame * 0.03) * 30;

            const spot = document.getElementById('sweet-spot');
            if (spot) {
                spot.style.left = window.jobGameData.spotX + '%';
                spot.style.top = window.jobGameData.spotY + '%';
            }

            // Check distance from mouse to spot
            let dx = window.jobGameData.mouseX - window.jobGameData.spotX;
            let dy = window.jobGameData.mouseY - window.jobGameData.spotY;
            let dist = Math.sqrt(dx*dx + dy*dy);

            // If within radius (~15%), increase progress
            if (dist < 15) {
                window.jobGameData.progress += 0.5;
                if(spot) spot.classList.replace('bg-green-500/50', 'bg-pink-500/70'); // Highlight when hitting
            } else {
                if(spot) spot.classList.replace('bg-pink-500/70', 'bg-green-500/50');
            }

            const progEl = document.getElementById('pet-progress');
            if (progEl) progEl.style.width = Math.min(100, window.jobGameData.progress) + '%';

            if (window.jobGameData.progress >= 100) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 5, "The dog is kicking its leg! Great job.", "💖");
            }
        }, 16);
    }, 100);
};

// 3. Fish Netter (Click Moving Targets)
window.startJobGame_fish_netter = function() {
    window.jobGameData = { caught: 0, required: 5, time: 10, fish: [], active: true };

    const spawnFish = () => {
        if (!window.jobGameData.active) return;
        const area = document.getElementById('tank-area');
        if (!area) return;

        const id = Date.now() + Math.random();
        const types = ["🐠", "🐟", "🐡"];
        const f = {
            id,
            icon: types[Math.floor(Math.random() * types.length)],
            x: Math.random() * 80,
            y: Math.random() * 80,
            dx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5),
            dy: (Math.random() - 0.5) * 1.5
        };
        
        window.jobGameData.fish.push(f);

        const el = document.createElement('div');
        el.id = `netfish-${id}`;
        el.className = "absolute text-4xl cursor-crosshair z-20 hover:scale-110 active:scale-90 transition-transform select-none";
        el.innerHTML = f.icon;
        el.style.left = f.x + '%';
        el.style.top = f.y + '%';
        // Flip horizontally based on direction
        if (f.dx > 0) el.style.transform = "scaleX(-1)"; 
        
        el.onmousedown = () => window.netFish(id);
        el.ontouchstart = (e) => { e.preventDefault(); window.netFish(id); };
        area.appendChild(el);
    };

    window.netFish = function(id) {
        if (!window.jobGameData.active) return;
        const idx = window.jobGameData.fish.findIndex(f => f.id === id);
        if (idx > -1) {
            window.jobGameData.fish.splice(idx, 1);
            const el = document.getElementById(`netfish-${id}`);
            if (el) {
                el.innerHTML = "🥅"; // Net emoji
                el.classList.add('opacity-0', 'scale-150');
                setTimeout(() => el.remove(), 200);
            }
            
            window.jobGameData.caught++;
            document.getElementById('fish-count').innerText = `${window.jobGameData.caught}/${window.jobGameData.required}`;

            if (window.jobGameData.caught >= window.jobGameData.required) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 5, "You successfully bagged the customer's fish!", "🐠");
            } else {
                spawnFish(); // Keep them coming
            }
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Fish Netter</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-2">Tap the fish to scoop them into the bag!</p>
            <div class="text-sm font-bold text-slate-300 mb-2">Netted: <span id="fish-count" class="text-green-400">0/5</span></div>

            <div id="tank-area" class="relative w-full h-48 bg-blue-600 border-4 border-slate-700 rounded-xl overflow-hidden shadow-inner cursor-crosshair" style="background-image: linear-gradient(180deg, #2563eb 0%, #1e3a8a 100%);">
                <!-- Bubbles bg -->
                <div class="absolute w-2 h-2 bg-white/30 rounded-full bottom-2 left-10 animate-bounce"></div>
                <div class="absolute w-3 h-3 bg-white/20 rounded-full bottom-10 left-32 animate-pulse"></div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🥅", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You dropped the net in the tank.", "🏃");
    });

    setTimeout(() => {
        for(let i=0; i<4; i++) spawnFish();

        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "The customer got tired of waiting.", "⏱️");
                }
            }

            // Move fish
            window.jobGameData.fish.forEach(f => {
                f.x += f.dx;
                f.y += f.dy;
                
                // Bounce and flip logic
                if (f.x <= 0 || f.x >= 90) {
                    f.dx *= -1;
                    const el = document.getElementById(`netfish-${f.id}`);
                    if (el) el.style.transform = f.dx > 0 ? "scaleX(-1)" : "scaleX(1)";
                }
                if (f.y <= 0 || f.y >= 80) f.dy *= -1;

                const el = document.getElementById(`netfish-${f.id}`);
                if (el) {
                    el.style.left = f.x + '%';
                    el.style.top = f.y + '%';
                }
            });
        }, 16);
    }, 100);
};

// 4. Grooming Shears (Swipe/Drag to Clear)
window.startJobGame_grooming_shears = function() {
    window.jobGameData = { sheared: 0, required: 20, time: 10, active: true };

    window.shearHair = function(id) {
        if (!window.jobGameData.active) return;
        const el = document.getElementById(`hair-${id}`);
        if (el && !el.classList.contains('cleared')) {
            el.classList.add('cleared', 'opacity-0', 'scale-50', 'pointer-events-none');
            window.jobGameData.sheared++;
            
            // Progress Bar update
            const pct = (window.jobGameData.sheared / window.jobGameData.required) * 100;
            document.getElementById('groom-progress').style.width = `${pct}%`;

            if (window.jobGameData.sheared >= window.jobGameData.required) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 10, "A perfect haircut! The poodle looks fabulous.", "🐩");
            }
        }
    };

    // Mobile swipe support
    window.shearSwipeTouch = function(e) {
        e.preventDefault();
        if (!window.jobGameData.active || !e.touches || e.touches.length === 0) return;
        
        let touch = e.touches[0];
        // Find element under finger
        let el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.id && el.id.startsWith('hair-')) {
            let id = parseInt(el.id.split('-')[1]);
            window.shearHair(id);
        }
    };

    // Generate 20 fluffy hair blocks
    let hairGrid = "";
    for(let i=0; i<20; i++) {
        hairGrid += `<div id="hair-${i}" class="text-4xl bg-slate-100 rounded-full flex items-center justify-center cursor-crosshair shadow transition-all duration-200"
                          onmouseover="window.shearHair(${i})" 
                          onmousedown="window.shearHair(${i})">☁️</div>`;
    }

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Grooming Time</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-xs text-slate-400 mb-4">Swipe/drag your finger over all the fluff to trim the dog!</p>
            
            <div class="w-full h-2 bg-slate-800 rounded-full mb-4 border border-slate-600 overflow-hidden shadow-inner">
                <div id="groom-progress" class="h-full bg-pink-500 transition-all duration-100" style="width: 0%;"></div>
            </div>

            <!-- Grooming Area -->
            <div class="relative w-full h-48 bg-pink-200 border-4 border-pink-400 rounded-xl overflow-hidden shadow-inner flex items-center justify-center"
                 ontouchmove="window.shearSwipeTouch(event)">
                
                <!-- The finished dog waiting underneath -->
                <div class="absolute text-8xl z-0 drop-shadow-lg">🐩</div>
                
                <!-- The Fluff Grid -->
                <div class="absolute inset-0 z-10 grid grid-cols-5 grid-rows-4 gap-1 p-2 opacity-90">
                    ${hairGrid}
                </div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "✂️", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You handed the clippers back to the boss.", "🏃");
    });

    setTimeout(() => {
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(false, -5, "You ran out of time. The haircut is terribly lopsided.", "⏱️");
            }
        }, 1000);
    }, 100);
};

// ==========================================
// LABOR MINIGAMES
// ==========================================

// 1. Heavy Lifting (Button Mashing)
window.startJobGame_heavy_lifting = function() {
    window.jobGameData = { progress: 0, required: 100, time: 10, active: true };

    window.liftBeam = function() {
        if (!window.jobGameData.active) return;
        window.jobGameData.progress += 8; // Lift power per click
        
        // Visual feedback
        const btn = document.getElementById('lift-btn');
        if(btn) {
            btn.classList.add('scale-95', 'bg-slate-600');
            setTimeout(() => btn.classList.remove('scale-95', 'bg-slate-600'), 100);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Heavy Lifting</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">10s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Mash the button to hoist the steel beam before your stamina runs out!</p>
            
            <div class="w-full h-64 bg-slate-900 border-4 border-slate-700 rounded-xl relative flex flex-col justify-end items-center mb-4 shadow-inner">
                <!-- Hoist Line -->
                <div class="absolute top-0 w-2 bg-slate-500 z-0" style="bottom: 50%;"></div>
                
                <!-- The Beam -->
                <div id="steel-beam" class="w-40 h-8 bg-slate-400 border-4 border-slate-500 rounded flex items-center justify-center z-10 transition-none" style="margin-bottom: 0%;">
                    <div class="flex gap-4 opacity-50"><div class="w-2 h-2 rounded-full bg-slate-800"></div><div class="w-2 h-2 rounded-full bg-slate-800"></div></div>
                </div>
                
                <!-- Win Line -->
                <div class="absolute top-4 w-full border-t-4 border-dashed border-green-500 opacity-50"></div>
            </div>

            <button id="lift-btn" onmousedown="window.liftBeam()" ontouchstart="(e)=>{e.preventDefault(); window.liftBeam();}" class="w-full py-4 bg-slate-700 text-white text-2xl font-black rounded-xl uppercase tracking-widest shadow-md select-none">
                HEAVE!
            </button>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "🏗️", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You dropped the beam. The foreman is furious.", "🏃");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            // Timer Tick
            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "Your arms gave out. The beam crashed down.", "💥");
                }
            }

            // Gravity/Decay (Beam constantly falls)
            window.jobGameData.progress = Math.max(0, window.jobGameData.progress - 0.7);
            
            const beamEl = document.getElementById('steel-beam');
            if (beamEl) {
                // Max height visually is roughly 200px from bottom
                beamEl.style.marginBottom = `${window.jobGameData.progress * 2}px`;
            }

            // Win condition
            if (window.jobGameData.progress >= window.jobGameData.required) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(true, 10, "You secured the beam in place. Great muscle work!", "💪");
            }
        }, 16);
    }, 100);
};

// 2. Pipe Connect (Grid Rotation)
window.startJobGame_pipe_connect = function() {
    // Start with all pieces scattered. (90, 180, 270, 90)
    window.jobGameData = { time: 15, pipes: [90, 180, 270, 90] }; 

    // Map grid indices (TL, TR, BL, BR) to your requested image numbers
    const imageMap = [1, 2, 4, 3]; 

    window.rotatePipe = function(idx) {
        window.jobGameData.pipes[idx] = (window.jobGameData.pipes[idx] + 90) % 360;
        const el = document.getElementById(`pipe-img-${idx}`);
        if(el) el.style.transform = `rotate(${window.jobGameData.pipes[idx]}deg)`;

        // Check Win (All forming a continuous loop at their normal 0-degree orientation)
        const p = window.jobGameData.pipes;
        if (p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 0) {
            clearInterval(window.activeJobTimer);
            
            // Visual success flair: Glow the images blue
            for(let i = 0; i < 4; i++) {
                const img = document.getElementById(`pipe-img-${i}`);
                if(img) {
                    img.classList.add('brightness-125', 'drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]');
                }
            }
            
            setTimeout(() => {
                window.finishJobMinigame(true, 5, "Pipes connected! The flow is stabilized.", "💧");
            }, 600);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Pipe Connect</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-6">Click the tiles to rotate them and fix the machinery before the pressure bursts!</p>
            
            <div class="grid grid-cols-2 gap-1 w-48 h-48 mx-auto bg-slate-900 border-4 border-slate-700 rounded-lg p-2 shadow-inner">
                ${[0,1,2,3].map(i => `
                    <div class="w-full h-full bg-slate-800 rounded flex items-center justify-center cursor-pointer active:scale-95 transition-transform overflow-hidden" onclick="window.rotatePipe(${i})">
                        <img id="pipe-img-${i}" 
                             src="images/minigames/pipeconnect/${imageMap[i]}.webp" 
                             class="w-full h-full object-contain transition-all duration-200" 
                             style="transform: rotate(${window.jobGameData.pipes[i]}deg);" 
                             draggable="false">
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "🔧", () => {
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You couldn't fix the leak. The basement flooded.", "🌊");
    });

    setTimeout(() => {
        // Initial render rotations (safety check just in case inline styles fail)
        for(let i=0; i<4; i++) {
            const el = document.getElementById(`pipe-img-${i}`);
            if(el) el.style.transform = `rotate(${window.jobGameData.pipes[i]}deg)`;
        }

        window.activeJobTimer = setInterval(() => {
            window.jobGameData.time--;
            const timerEl = document.getElementById('job-timer');
            if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
            
            if (window.jobGameData.time <= 0) {
                clearInterval(window.activeJobTimer);
                window.finishJobMinigame(false, -5, "The pipes burst! You're soaked.", "💥");
            }
        }, 1000);
    }, 100);
};

// 3. Brick Layer (Timing Alignment)
window.startJobGame_brick_layer = function() {
    window.jobGameData = { time: 15, level: 0, required: 3, frame: 0, active: true };

    window.dropBrick = function() {
        if (!window.jobGameData.active) return;
        
        // Target is at 50%
        let currentPos = 50 + Math.sin(window.jobGameData.frame * (0.05 + (window.jobGameData.level * 0.02))) * 40;
        let diff = Math.abs(currentPos - 50);

        if (diff < 8) { // Generous alignment window
            // Success
            const stack = document.getElementById('brick-stack');
            if (stack) {
                stack.innerHTML += `<div class="w-24 h-6 bg-orange-700 border-2 border-orange-900 rounded shadow-md mx-auto mb-1 animate-pop flex gap-1 p-1"><div class="w-full h-full border border-orange-800/50"></div><div class="w-full h-full border border-orange-800/50"></div></div>`;
            }
            
            window.jobGameData.level++;
            document.getElementById('brick-count').innerText = `${window.jobGameData.level}/${window.jobGameData.required}`;

            if (window.jobGameData.level >= window.jobGameData.required) {
                window.jobGameData.active = false;
                clearInterval(window.activeJobTimer);
                const crane = document.getElementById('crane-brick');
                if(crane) crane.style.display = 'none';
                
                setTimeout(() => {
                    window.finishJobMinigame(true, 5, "You stacked the bricks perfectly straight.", "🧱");
                }, 500);
            }
        } else {
            // Missed!
            window.jobGameData.active = false;
            clearInterval(window.activeJobTimer);
            const crane = document.getElementById('crane-brick');
            if(crane) {
                crane.classList.add('translate-y-24', 'rotate-45', 'opacity-0');
            }
            setTimeout(() => {
                window.finishJobMinigame(false, -5, "You dropped the brick misaligned and the stack fell over.", "💥");
            }, 600);
        }
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Brick Layer</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">15s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-2">Tap to drop the swinging brick precisely in the center!</p>
            <div class="text-sm font-bold text-slate-300 mb-4">Stacked: <span id="brick-count" class="text-green-400">0/3</span></div>
            
            <div class="w-full h-56 bg-sky-900 border-4 border-slate-700 rounded-xl relative overflow-hidden flex flex-col justify-end pb-4 cursor-crosshair shadow-inner" onmousedown="window.dropBrick()" ontouchstart="(e)=>{e.preventDefault(); window.dropBrick();}">
                <!-- Center Guide -->
                <div class="absolute w-px h-full bg-white/20 left-1/2 top-0 pointer-events-none"></div>

                <!-- Swinging Crane Brick -->
                <div id="crane-brick" class="absolute top-4 w-24 h-6 bg-orange-600 border-2 border-orange-800 rounded shadow-lg transition-transform duration-75 flex gap-1 p-1 z-20" style="left: 50%; transform: translateX(-50%);">
                    <div class="w-full h-full border border-orange-500/50"></div><div class="w-full h-full border border-orange-500/50"></div>
                </div>

                <!-- Placed Bricks Stack -->
                <div id="brick-stack" class="w-full flex flex-col justify-end z-10 pointer-events-none">
                    <!-- Base Foundation -->
                    <div class="w-32 h-6 bg-slate-600 border-2 border-slate-800 rounded shadow-md mx-auto"></div>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Work Task", html, "Give Up (-10 Perf)", "🧱", () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        window.finishJobMinigame(false, -10, "You abandoned the site.", "🏃");
    });

    setTimeout(() => {
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            window.jobGameData.frame++;

            // Timer
            if (window.jobGameData.frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    window.jobGameData.active = false;
                    clearInterval(window.activeJobTimer);
                    window.finishJobMinigame(false, -5, "You took too long. The cement dried.", "⏱️");
                }
            }

            // Swing Brick (Speeds up each level)
            const speed = 0.05 + (window.jobGameData.level * 0.02);
            let leftPos = 50 + Math.sin(window.jobGameData.frame * speed) * 35;
            
            const crane = document.getElementById('crane-brick');
            if (crane) crane.style.left = `${leftPos}%`;

        }, 16);
    }, 100);
};

// 4. Lawn Mower (NES Off-Road Controls)
window.startJobGame_lawn_mower = function() {
    // Top-down tank/car mechanics
    window.jobGameData = {
        x: 50, y: 50, angle: -90, speed: 0,
        keys: { up: false, down: false, left: false, right: false },
        cutGrid: new Array(25).fill(false), // 5x5 grid
        time: 20,
        active: true
    };

    // Keyboard bindings (Global, cleaned up on end)
    const handleKey = (e, isDown) => {
        if (!window.jobGameData.active) return;
        if(e.key === "ArrowUp" || e.key === "w") window.jobGameData.keys.up = isDown;
        if(e.key === "ArrowDown" || e.key === "s") window.jobGameData.keys.down = isDown;
        if(e.key === "ArrowLeft" || e.key === "a") window.jobGameData.keys.left = isDown;
        if(e.key === "ArrowRight" || e.key === "d") window.jobGameData.keys.right = isDown;
    };
    window.mowerKeyDown = (e) => handleKey(e, true);
    window.mowerKeyUp = (e) => handleKey(e, false);
    
    document.addEventListener("keydown", window.mowerKeyDown);
    document.addEventListener("keyup", window.mowerKeyUp);

    // On-screen Mobile Controls
    window.setMowerKey = function(key, val) {
        if (window.jobGameData.active) window.jobGameData.keys[key] = val;
    };

    const html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-2 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Lawn Mower</h2>
                <div class="text-2xl font-black text-red-400" id="job-timer">20s</div>
            </div>
            <p class="text-[10px] text-slate-400 mb-2">Drive the mower to cut the grass! (Use Arrows/WASD or buttons below)</p>
            
            <div class="text-sm font-bold text-slate-300 mb-2">Mowed: <span id="mow-count" class="text-green-400">0/25</span></div>

            <!-- Yard Area (Relative % positioning) -->
            <div id="yard-area" class="relative w-full h-48 bg-emerald-800 border-4 border-slate-700 rounded-lg overflow-hidden shadow-inner mb-4">
                <!-- 5x5 Grid of Grass Patches -->
                ${new Array(25).fill(0).map((_, i) => {
                    let col = i % 5;
                    let row = Math.floor(i / 5);
                    return `<div id="grass-${i}" class="absolute w-1/5 h-1/5 bg-green-600 transition-colors duration-300" style="left: ${col*20}%; top: ${row*20}%; border: 1px solid rgba(0,0,0,0.1);"></div>`;
                }).join('')}

                <!-- Mower Sprite -->
                <div id="mower-vehicle" class="absolute w-6 h-6 bg-red-600 border-2 border-red-800 shadow-md flex items-center justify-center rounded-sm z-20 transition-none" style="left: 50%; top: 50%; transform-origin: center; transform: translate(-50%, -50%) rotate(-90deg);">
                    <!-- Mower front blade indicator -->
                    <div class="absolute right-0 w-1 h-full bg-slate-300"></div>
                </div>
            </div>

            <!-- Mobile D-Pad Controls -->
            <div class="grid grid-cols-3 gap-1 max-w-[150px] mx-auto opacity-70">
                <div></div>
                <button class="bg-slate-700 py-3 rounded-t-xl active:bg-acs-gold text-white" onmousedown="window.setMowerKey('up',true)" onmouseup="window.setMowerKey('up',false)" ontouchstart="(e)=>{e.preventDefault(); window.setMowerKey('up',true);}" ontouchend="window.setMowerKey('up',false)">⬆️</button>
                <div></div>
                <button class="bg-slate-700 py-3 rounded-l-xl active:bg-acs-gold text-white" onmousedown="window.setMowerKey('left',true)" onmouseup="window.setMowerKey('left',false)" ontouchstart="(e)=>{e.preventDefault(); window.setMowerKey('left',true);}" ontouchend="window.setMowerKey('left',false)">⬅️</button>
                <button class="bg-slate-700 py-3 active:bg-acs-gold text-white" onmousedown="window.setMowerKey('down',true)" onmouseup="window.setMowerKey('down',false)" ontouchstart="(e)=>{e.preventDefault(); window.setMowerKey('down',true);}" ontouchend="window.setMowerKey('down',false)">⬇️</button>
                <button class="bg-slate-700 py-3 rounded-r-xl active:bg-acs-gold text-white" onmousedown="window.setMowerKey('right',true)" onmouseup="window.setMowerKey('right',false)" ontouchstart="(e)=>{e.preventDefault(); window.setMowerKey('right',true);}" ontouchend="window.setMowerKey('right',false)">➡️</button>
            </div>
        </div>
    `;

    const cleanupMower = () => {
        window.jobGameData.active = false;
        clearInterval(window.activeJobTimer);
        document.removeEventListener("keydown", window.mowerKeyDown);
        document.removeEventListener("keyup", window.mowerKeyUp);
    };

    window.queueModal("Work Task", html, "Walk Away (-10 Perf)", "🚜", () => {
        cleanupMower();
        window.finishJobMinigame(false, -10, "You left the mower running in the yard.", "🏃");
    });

    setTimeout(() => {
        let frame = 0;
        window.activeJobTimer = setInterval(() => {
            if (!window.jobGameData.active) return;
            frame++;

            // Timer
            if (frame % 60 === 0) {
                window.jobGameData.time--;
                const timerEl = document.getElementById('job-timer');
                if(timerEl) timerEl.innerText = window.jobGameData.time + "s";
                
                if (window.jobGameData.time <= 0) {
                    cleanupMower();
                    window.finishJobMinigame(false, -5, "Shift ended before you finished the lawn.", "⏱️");
                }
            }

            // Physics Loop (NES Off-Road style)
            const d = window.jobGameData;
            
            // Steering (Turning)
            if (d.keys.left) d.angle -= 5;
            if (d.keys.right) d.angle += 5;

            // Acceleration
            if (d.keys.up) d.speed += 0.2; // Gas
            if (d.keys.down) d.speed -= 0.2; // Reverse/Brake

            // Friction / Drag
            d.speed *= 0.85;

            // Math to move X/Y based on rotation angle
            let rad = d.angle * (Math.PI / 180);
            d.x += Math.cos(rad) * d.speed;
            d.y += Math.sin(rad) * d.speed;

            // Boundaries (Keep inside 0-100%)
            if (d.x < 0) d.x = 0; if (d.x > 100) d.x = 100;
            if (d.y < 0) d.y = 0; if (d.y > 100) d.y = 100;

            // Render Vehicle Position
            const mower = document.getElementById('mower-vehicle');
            if (mower) {
                mower.style.left = d.x + '%';
                mower.style.top = d.y + '%';
                mower.style.transform = `translate(-50%, -50%) rotate(${d.angle}deg)`;
            }

            // Cutting Logic (Check which 20x20 grid square we are in)
            let col = Math.floor(d.x / 20.001); // 0-4
            let row = Math.floor(d.y / 20.001); // 0-4
            let idx = row * 5 + col;

            if (idx >= 0 && idx < 25 && !d.cutGrid[idx]) {
                d.cutGrid[idx] = true;
                const grassEl = document.getElementById(`grass-${idx}`);
                if (grassEl) grassEl.classList.replace('bg-green-600', 'bg-lime-400');
                
                let cutCount = d.cutGrid.filter(c => c).length;
                document.getElementById('mow-count').innerText = `${cutCount}/25`;

                // Win Condition
                if (cutCount >= 25) {
                    cleanupMower();
                    window.finishJobMinigame(true, 10, "You mowed the entire lawn perfectly!", "🌿");
                }
            }
        }, 16);
    }, 100);
};

