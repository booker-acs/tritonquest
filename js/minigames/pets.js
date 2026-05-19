// --- PETS SYSTEM (Fish, Cat, Dog) ---

// --- CAT & DOG LOGIC (Menu Shells) ---

window.openPetMenu = function(type) {
    if (type === 'fish') window.openFishTank();
    if (type === 'cat') window.openCatMenu();
    if (type === 'dog') window.openDogMenu();
};

window.updateCatName = function(newName) {
    state.catName = newName.trim() || "Stray Cat";
};

window.updateDogName = function(newName) {
    state.dogName = newName.trim() || "Rescue Dog";
};

window.openCatMenu = function() {
    // Initialize default name if missing
    if (!state.catName) state.catName = "Stray Cat";

    const catImg = `<img src="images/items/cat.webp" class="w-32 h-32 object-contain drop-shadow-md mb-2">`;

    const html = `
        <div class="max-w-md mx-auto py-2 text-center select-none">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">COMPANION</h1>
            <div class="bg-slate-800 rounded-2xl p-6 border-4 border-slate-700 shadow-inner mb-6 flex flex-col items-center">
                ${catImg}
                <div class="flex items-center gap-2 mt-2">
                    <input type="text" value="${state.catName}" onchange="window.updateCatName(this.value)" class="bg-slate-900 border-2 border-slate-600 rounded-lg px-3 py-1 text-white text-center font-black text-xl w-48 focus:border-acs-gold outline-none transition-colors shadow-inner" placeholder="Name your cat...">
                    <span class="text-slate-400 text-sm" title="Edit Name">✏️</span>
                </div>
                <div class="text-xs text-slate-400 italic mt-2">"Meow." (Translation: Feed me.)</div>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.interactPet('cat', 'feed')" class="py-4 bg-slate-700 border-2 border-slate-500 rounded-xl flex flex-col items-center justify-center hover:bg-green-600 hover:border-green-400 transition-all group ${state.catFed ? 'opacity-50 cursor-not-allowed' : ''}">
                    <span class="text-2xl mb-1">🐟</span>
                    <span class="font-bold text-[10px] uppercase text-white">Feed</span>
                </button>
                <button onclick="window.interactPet('cat', 'clean')" class="py-4 bg-slate-700 border-2 border-slate-500 rounded-xl flex flex-col items-center justify-center hover:bg-cyan-600 hover:border-cyan-400 transition-all group ${state.catClean ? 'opacity-50 cursor-not-allowed' : ''}">
                    <span class="text-2xl mb-1">🧹</span>
                    <span class="font-bold text-[10px] uppercase text-white">Clean</span>
                </button>
                <button onclick="window.interactPet('cat', 'play')" class="py-4 bg-slate-700 border-2 border-slate-500 rounded-xl flex flex-col items-center justify-center hover:bg-pink-600 hover:border-pink-400 transition-all group">
                    <span class="text-2xl mb-1">🧶</span>
                    <span class="font-bold text-[10px] uppercase text-white">Play</span>
                </button>
            </div>
        </div>
    `;
    window.queueModal("Cat", html, "Close", "🐾", null, null, false, "PET CARE");
};

window.openDogMenu = function() {
    // Initialize default name if missing
    if (!state.dogName) state.dogName = "Rescue Dog";

    const dogImg = `<img src="images/items/dog.webp" class="w-32 h-32 object-contain drop-shadow-md mb-2">`;

    const html = `
        <div class="max-w-md mx-auto py-2 text-center select-none">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">COMPANION</h1>
            <div class="bg-slate-800 rounded-2xl p-6 border-4 border-slate-700 shadow-inner mb-6 flex flex-col items-center">
                ${dogImg}
                <div class="flex items-center gap-2 mt-2">
                    <input type="text" value="${state.dogName}" onchange="window.updateDogName(this.value)" class="bg-slate-900 border-2 border-slate-600 rounded-lg px-3 py-1 text-white text-center font-black text-xl w-48 focus:border-acs-gold outline-none transition-colors shadow-inner" placeholder="Name your dog...">
                    <span class="text-slate-400 text-sm" title="Edit Name">✏️</span>
                </div>
                <div class="text-xs text-slate-400 italic mt-2">Tail wagging at 100mph.</div>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.interactPet('dog', 'feed')" class="py-4 bg-slate-700 border-2 border-slate-500 rounded-xl flex flex-col items-center justify-center hover:bg-green-600 hover:border-green-400 transition-all group ${state.dogFed ? 'opacity-50 cursor-not-allowed' : ''}">
                    <span class="text-2xl mb-1">🍖</span>
                    <span class="font-bold text-[10px] uppercase text-white">Feed</span>
                </button>
                <button onclick="window.interactPet('dog', 'walk')" class="py-4 bg-slate-700 border-2 border-slate-500 rounded-xl flex flex-col items-center justify-center hover:bg-orange-600 hover:border-orange-400 transition-all group ${state.dogWalked ? 'opacity-50 cursor-not-allowed' : ''}">
                    <span class="text-2xl mb-1">🦮</span>
                    <span class="font-bold text-[10px] uppercase text-white">Walk</span>
                </button>
                <button onclick="window.interactPet('dog', 'play')" class="py-4 bg-slate-700 border-2 border-slate-500 rounded-xl flex flex-col items-center justify-center hover:bg-pink-600 hover:border-pink-400 transition-all group">
                    <span class="text-2xl mb-1">🎾</span>
                    <span class="font-bold text-[10px] uppercase text-white">Play</span>
                </button>
            </div>
        </div>
    `;
    window.queueModal("Dog", html, "Close", "🐾", null, null, false, "PET CARE");
};

// Main Interaction Router
window.interactPet = function(pet, action) {
    if (pet === 'cat') {
        if (action === 'feed' && state.catFed) return;
        if (action === 'clean' && state.catClean) return;
        
        document.getElementById('modal-overlay').classList.add('hidden');
        
        // Launch Cat Minigames
        if (action === 'feed') window.startCatFeedGame();
        else if (action === 'clean') window.startCatCleanGame();
        else if (action === 'play') window.startCatPlayGame();
        return;
    }
    
    if (pet === 'dog') {
        if (action === 'feed' && state.dogFed) return;
        if (action === 'walk' && state.dogWalked) return;
        
        document.getElementById('modal-overlay').classList.add('hidden');
        
        // Launch Dog Minigames
        if (action === 'feed') window.startDogFeedGame();
        else if (action === 'walk') window.startDogWalkGame();
        else if (action === 'play') window.startDogPlayGame();
        return;
    }
};


// --- CAT MINIGAMES ---

// Shared Win Function for Cat Games
window.winCatGame = function(action, msg, icon) {
    document.getElementById('modal-overlay').classList.add('hidden');
    
    if (action === 'feed') state.catFed = true;
    if (action === 'clean') state.catClean = true;
    if (action === 'play') {
        state.energy = Math.max(0, state.energy - 5);
        state.dayStats.energy -= 5;
        state.stress = Math.max(0, state.stress - 15);
        state.dayStats.stress -= 15;
        msg += "<br><br><span class='text-green-400 font-bold'>-15% Stress</span> <span class='text-red-400 font-bold ml-2'>-5 Energy</span>";
    }

    if (typeof window.updateUI === 'function') window.updateUI();

    setTimeout(() => {
        window.queueModal("CAT LOVE", msg, "Nice", icon, () => {
            window.openCatMenu();
        });
    }, 100);
};

// 1. Feeding Minigame
window.startCatFeedGame = function() {
    window.catFood = 0;
    window.catWater = 0;
    window.activeFill = null;
    const catName = state.catName || "The cat";

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Dinner Time</h2>
            <p class="text-xs text-slate-400 mb-6">Hold the buttons to fill the bowls!</p>
            
            <div class="flex justify-center gap-8 mb-6">
                <!-- Food Bowl -->
                <div class="flex flex-col items-center">
                    <div class="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden relative flex items-end justify-center shadow-inner mb-3">
                        <div id="cat-food-fill" class="w-full bg-amber-700 transition-all duration-75" style="height: 0%; background-image: radial-gradient(#92400e 15%, transparent 16%); background-size: 8px 8px;"></div>
                    </div>
                    <button class="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg uppercase tracking-wider active:bg-amber-500 active:scale-95"
                            onmousedown="window.activeFill = 'food'" onmouseup="window.activeFill = null" onmouseleave="window.activeFill = null"
                            ontouchstart="window.activeFill = 'food'" ontouchend="window.activeFill = null">
                        Pour Food
                    </button>
                </div>

                <!-- Water Bowl -->
                <div class="flex flex-col items-center">
                    <div class="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden relative flex items-end justify-center shadow-inner mb-3">
                        <div id="cat-water-fill" class="w-full bg-blue-500/80 transition-all duration-75" style="height: 0%;"></div>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg uppercase tracking-wider active:bg-blue-500 active:scale-95"
                            onmousedown="window.activeFill = 'water'" onmouseup="window.activeFill = null" onmouseleave="window.activeFill = null"
                            ontouchstart="window.activeFill = 'water'" ontouchend="window.activeFill = null">
                        Pour Water
                    </button>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Feed " + catName, html, "Cancel", "🍽️", () => { clearInterval(window.catFeedInt); });

    window.catFeedInt = setInterval(() => {
        if (window.activeFill === 'food' && window.catFood < 100) window.catFood += 3;
        if (window.activeFill === 'water' && window.catWater < 100) window.catWater += 3;

        const foodEl = document.getElementById('cat-food-fill');
        const waterEl = document.getElementById('cat-water-fill');
        
        if (foodEl) foodEl.style.height = window.catFood + '%';
        if (waterEl) waterEl.style.height = window.catWater + '%';

        if (window.catFood >= 100 && window.catWater >= 100) {
            clearInterval(window.catFeedInt);
            window.winCatGame('feed', `You filled both bowls. ${catName} immediately started munching!`, "🐟");
        }
    }, 50);
};

// 2. Cleaning Minigame
window.startCatCleanGame = function() {
    window.poops = [];
    const catName = state.catName || "Your cat";

    let html = `
        <div class="text-center select-none">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Litter Duty</h2>
            <p class="text-xs text-slate-400 mb-4">Click the clumps to scoop them up.</p>
            
            <div class="relative w-full h-64 bg-amber-100 border-4 border-amber-800/80 rounded-2xl overflow-hidden cursor-crosshair shadow-inner" style="background-image: radial-gradient(#d4b483 15%, transparent 16%); background-size: 10px 10px;">
    `;
    
    // Generate 6 random poops
    for(let i=0; i<6; i++) {
        let x = 10 + Math.random() * 70;
        let y = 10 + Math.random() * 70;
        let rot = Math.random() * 360;
        html += `<div id="poop-${i}" class="absolute text-4xl cursor-pointer hover:scale-110 transition-transform drop-shadow-md" style="left:${x}%; top:${y}%; transform: rotate(${rot}deg);" onmousedown="window.scoopPoop(${i})">💩</div>`;
        window.poops.push(i);
    }
    html += `</div></div>`;

    window.queueModal("Clean Litter", html, "Cancel", "🧹");
};

window.scoopPoop = function(id) {
    let el = document.getElementById('poop-'+id);
    if(el) {
        el.style.transform = "scale(0)";
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 200);
    }
    
    window.poops = window.poops.filter(p => p !== id);
    if(window.poops.length === 0) {
        window.winCatGame('clean', `The litter box is spotless. ${state.catName || "Your cat"} approaches it immediately.`, "✨");
    }
};

// 3. Laser Pointer Minigame
window.startCatPlayGame = function() {
    window.catGameTime = 10;
    // Spawn cat in top-left, laser closer to center-right to avoid instant death
    window.catPos = {x: 50, y: 50};
    window.laserPos = {x: 200, y: 150};
    window.catSpeed = 3.5; // Slightly slower pixels per frame
    const catName = state.catName || "the cat";

    let html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-2 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Laser Pointer</h2>
                <div class="text-2xl font-black text-red-400" id="cat-timer">10.0s</div>
            </div>
            <p class="text-xs text-slate-400 mb-2">Drag the laser dot to keep it away from ${catName}!</p>
            
            <div id="laser-area" class="relative w-full h-64 bg-slate-900 border-4 border-slate-700 rounded-2xl overflow-hidden cursor-none shadow-inner" 
                 onmousemove="window.moveLaser(event)" 
                 ontouchmove="window.moveLaserTouch(event)"
                 oncontextmenu="return false;">
                
                <!-- Laser Dot -->
                <div id="cat-laser" class="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_red] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-20" style="left:200px; top:150px;"></div>
                
                <!-- Cat Hunter Sprite (Image) -->
                <div id="cat-hunter" class="absolute w-12 h-12 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-75" style="left:50px; top:50px;">
                    <img src="images/items/cat.webp" class="w-full h-full object-contain">
                </div>
            </div>
        </div>
    `;

    window.queueModal("Play Time", html, "Give Up", "🔴", () => { clearInterval(window.catPlayInt); });

    let lastTime = Date.now();
    window.catPlayInt = setInterval(() => {
        let now = Date.now();
        let dt = (now - lastTime) / 1000;
        lastTime = now;

        window.catGameTime -= dt;
        
        // WIN CONDITION
        if(window.catGameTime <= 0) {
            clearInterval(window.catPlayInt);
            window.winCatGame('play', `${state.catName || "The cat"} is exhausted and purring on the floor.`, "💤");
            return;
        }

        const timerEl = document.getElementById('cat-timer');
        if(timerEl) timerEl.innerText = window.catGameTime.toFixed(1) + "s";

        // AI Logic: Move cat towards laser
        let dx = window.laserPos.x - window.catPos.x;
        let dy = window.laserPos.y - window.catPos.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        // LOSE CONDITION (Distance < 20px means caught)
        if (dist < 20) {
            clearInterval(window.catPlayInt);
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                window.queueModal("Caught!", `${state.catName || "The cat"} pounced on the red dot! Try again.`, "Okay", "💥", () => {
                    window.openCatMenu();
                });
            }, 100);
            return;
        }

        // Apply Velocity
        if (dist > 0) {
            window.catPos.x += (dx / dist) * window.catSpeed;
            window.catPos.y += (dy / dist) * window.catSpeed;
        }

        // Update Cat DOM Position
        const hunterEl = document.getElementById('cat-hunter');
        if (hunterEl) {
            hunterEl.style.left = window.catPos.x + 'px';
            hunterEl.style.top = window.catPos.y + 'px';
            
            // Flip cat horizontally based on movement direction
            if (dx > 0) hunterEl.style.transform = "translate(-50%, -50%) scaleX(-1)";
            else hunterEl.style.transform = "translate(-50%, -50%) scaleX(1)";
        }

    }, 16); // ~60 FPS
};

window.moveLaser = function(e) {
    let area = document.getElementById('laser-area');
    if(!area) return;
    let rect = area.getBoundingClientRect();
    
    // Constrain to box
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));
    
    window.laserPos.x = x;
    window.laserPos.y = y;
    
    const laserEl = document.getElementById('cat-laser');
    if (laserEl) {
        laserEl.style.left = window.laserPos.x + 'px';
        laserEl.style.top = window.laserPos.y + 'px';
    }
};

window.moveLaserTouch = function(e) {
    e.preventDefault(); // Stop mobile screen scrolling while dragging laser
    if (e.touches && e.touches.length > 0) {
        window.moveLaser(e.touches[0]);
    }
};

// --- DOG MINIGAMES ---

// Shared Win Function for Dog Games
window.winDogGame = function(action, msg, icon) {
    document.getElementById('modal-overlay').classList.add('hidden');
    
    if (action === 'feed') state.dogFed = true;
    if (action === 'walk') state.dogWalked = true;
    if (action === 'play') {
        state.energy = Math.max(0, state.energy - 5);
        state.dayStats.energy -= 5;
        state.stress = Math.max(0, state.stress - 15);
        state.dayStats.stress -= 15;
        msg += "<br><br><span class='text-green-400 font-bold'>-15% Stress</span> <span class='text-red-400 font-bold ml-2'>-5 Energy</span>";
    }

    if (typeof window.updateUI === 'function') window.updateUI();

    setTimeout(() => {
        window.queueModal("DOG LOVE", msg, "Nice", icon, () => {
            window.openDogMenu();
        });
    }, 100);
};

// 1. Dog Feeding Minigame
window.startDogFeedGame = function() {
    window.dogFood = 0;
    window.dogWater = 0;
    window.activeDogFill = null;
    const dogName = state.dogName || "The dog";

    const html = `
        <div class="text-center select-none pb-2">
            <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest mb-2">Chow Time</h2>
            <p class="text-xs text-slate-400 mb-6">Hold the buttons to fill the bowls!</p>
            
            <div class="flex justify-center gap-8 mb-6">
                <!-- Food Bowl -->
                <div class="flex flex-col items-center">
                    <div class="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden relative flex items-end justify-center shadow-inner mb-3">
                        <div id="dog-food-fill" class="w-full bg-amber-800 transition-all duration-75" style="height: 0%; background-image: radial-gradient(#78350f 20%, transparent 21%); background-size: 10px 10px;"></div>
                    </div>
                    <button class="px-4 py-2 bg-amber-700 text-white font-bold rounded-lg uppercase tracking-wider active:bg-amber-600 active:scale-95"
                            onmousedown="window.activeDogFill = 'food'" onmouseup="window.activeDogFill = null" onmouseleave="window.activeDogFill = null"
                            ontouchstart="window.activeDogFill = 'food'" ontouchend="window.activeDogFill = null">
                        Pour Kibble
                    </button>
                </div>

                <!-- Water Bowl -->
                <div class="flex flex-col items-center">
                    <div class="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden relative flex items-end justify-center shadow-inner mb-3">
                        <div id="dog-water-fill" class="w-full bg-blue-500/80 transition-all duration-75" style="height: 0%;"></div>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg uppercase tracking-wider active:bg-blue-500 active:scale-95"
                            onmousedown="window.activeDogFill = 'water'" onmouseup="window.activeDogFill = null" onmouseleave="window.activeDogFill = null"
                            ontouchstart="window.activeDogFill = 'water'" ontouchend="window.activeDogFill = null">
                        Pour Water
                    </button>
                </div>
            </div>
        </div>
    `;

    window.queueModal("Feed " + dogName, html, "Cancel", "🍖", () => { clearInterval(window.dogFeedInt); });

    window.dogFeedInt = setInterval(() => {
        if (window.activeDogFill === 'food' && window.dogFood < 100) window.dogFood += 3;
        if (window.activeDogFill === 'water' && window.dogWater < 100) window.dogWater += 3;

        const foodEl = document.getElementById('dog-food-fill');
        const waterEl = document.getElementById('dog-water-fill');
        
        if (foodEl) foodEl.style.height = window.dogFood + '%';
        if (waterEl) waterEl.style.height = window.dogWater + '%';

        if (window.dogFood >= 100 && window.dogWater >= 100) {
            clearInterval(window.dogFeedInt);
            window.winDogGame('feed', `You filled both bowls. ${dogName} is scarfing it down!`, "🍖");
        }
    }, 50);
};

// 2. Dog Walk Minigame
window.startDogWalkGame = function() {
    window.dogWalkData = { poops: [], collected: 0, missed: 0, frame: 0 };
    const dogName = state.dogName || "The dog";

    let html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-2 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Neighborhood Walk</h2>
                <div class="text-sm font-bold text-slate-300">Bagged: <span id="poop-count" class="text-green-400">0/5</span></div>
            </div>
            <p class="text-[10px] text-slate-400 mb-2">Click the poops to bag them as ${dogName} walks! Miss 3 and you're in trouble.</p>
            
            <div id="walk-area" class="relative w-full h-48 bg-green-800 border-4 border-slate-700 rounded-2xl overflow-hidden shadow-inner" style="background-image: radial-gradient(#166534 15%, transparent 16%); background-size: 20px 20px;">
                
                <!-- Background Scrolling Details -->
                <div id="walk-bg" class="absolute inset-0 z-0 opacity-50" style="background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px);"></div>
                
                <!-- Dog Sprite -->
                <div id="walking-dog" class="absolute w-20 h-20 pointer-events-none z-10 transition-transform" style="right: 15%; bottom: 10px;">
                    <img src="images/items/dog.webp" class="w-full h-full object-contain">
                </div>
            </div>
        </div>
    `;

    window.queueModal("Walk " + dogName, html, "Head Home Early", "🦮", () => { clearInterval(window.dogWalkInt); });

    window.dogWalkInt = setInterval(() => {
        const d = window.dogWalkData;
        d.frame++;
        
        // Background Scroll
        const bgEl = document.getElementById('walk-bg');
        if (bgEl) {
            bgEl.style.backgroundPositionX = `${-(d.frame * 2)}px`;
        }

        // Bobbing dog
        const dogEl = document.getElementById('walking-dog');
        if (dogEl) {
            dogEl.style.transform = `translateY(${Math.sin(d.frame * 0.2) * 6}px) scaleX(-1)`;
        }

        // Spawn poop from the right side of the screen
        if (d.frame % 70 === 0 && Math.random() > 0.2) {
            const id = Date.now() + Math.random();
            d.poops.push({ id, x: 80, y: 10 + Math.random() * 20 }); // X is percentage, Y is pixels from bottom
            const area = document.getElementById('walk-area');
            if (area) {
                const p = document.createElement('div');
                p.id = `dpoop-${id}`;
                p.className = "absolute text-3xl cursor-pointer hover:scale-110 active:scale-90 transition-transform drop-shadow-md z-20";
                p.innerHTML = "💩";
                p.style.bottom = `${10 + Math.random() * 30}px`;
                p.style.left = "80%";
                p.onmousedown = () => window.bagPoop(id);
                p.ontouchstart = (e) => { e.preventDefault(); window.bagPoop(id); }; // Mobile fix
                area.appendChild(p);
            }
        }

        // Move poops left
        for (let i = 0; i < d.poops.length; i++) {
            let p = d.poops[i];
            p.x -= 0.6; // Scroll speed
            const el = document.getElementById(`dpoop-${p.id}`);
            if (el) el.style.left = p.x + '%';

            // Off screen
            if (p.x < -10) {
                if (el) el.remove();
                d.poops.splice(i, 1);
                i--;
                d.missed++;
                
                // Lose Condition
                if (d.missed >= 3) {
                    clearInterval(window.dogWalkInt);
                    document.getElementById('modal-overlay').classList.add('hidden');
                    setTimeout(() => {
                        window.queueModal("Gross!", "You left too many messes on the sidewalk. The neighbors are furious.", "Oops", "😠", () => window.openDogMenu());
                    }, 100);
                    return;
                }
            }
        }
    }, 16);
};

window.bagPoop = function(id) {
    const d = window.dogWalkData;
    const idx = d.poops.findIndex(p => p.id === id);
    if (idx > -1) {
        d.poops.splice(idx, 1);
        const el = document.getElementById(`dpoop-${id}`);
        if (el) {
            el.innerHTML = "🛍️";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            setTimeout(() => el.remove(), 200);
        }
        d.collected++;
        const cnt = document.getElementById('poop-count');
        if (cnt) cnt.innerText = `${d.collected}/5`;

        if (d.collected >= 5) {
            clearInterval(window.dogWalkInt);
            window.winDogGame('walk', `You had a nice walk and kept the neighborhood clean!`, "🦮");
        }
    }
};

// 3. Dog Fetch Minigame
window.startDogPlayGame = function() {
    window.fetchData = { state: 'ready', dogX: 5, ballX: 5, targetX: 5, throws: 0, frame: 0 };
    const dogName = state.dogName || "The dog";

    let html = `
        <div class="text-center select-none pb-2">
            <div class="flex justify-between items-center mb-2 px-2">
                <h2 class="text-xl font-black text-acs-gold uppercase tracking-widest">Fetch</h2>
                <div class="text-sm font-bold text-slate-300">Retrieved: <span id="fetch-count" class="text-green-400">0/5</span></div>
            </div>
            <p class="text-xs text-slate-400 mb-2">Click anywhere on the grass to throw the ball!</p>
            
            <div id="fetch-area" class="relative w-full h-48 bg-green-700 border-4 border-slate-700 rounded-2xl overflow-hidden shadow-inner cursor-crosshair" onmousedown="window.throwBall(event)" ontouchstart="window.throwBallTouch(event)">
                
                <!-- Ball -->
                <div id="fetch-ball" class="absolute w-6 h-6 text-2xl z-10 transition-none drop-shadow" style="left: 5%; bottom: 20px; transform-origin: center;">🎾</div>
                
                <!-- Dog Sprite -->
                <div id="fetch-dog" class="absolute w-16 h-16 pointer-events-none z-20 transition-none" style="left: 5%; bottom: 20px;">
                    <img src="images/items/dog.webp" class="w-full h-full object-contain drop-shadow-lg">
                </div>
            </div>
        </div>
    `;
    window.queueModal("Play Fetch", html, "Stop Playing", "🎾", () => { clearInterval(window.dogFetchInt); });

    window.dogFetchInt = setInterval(() => {
        const d = window.fetchData;
        d.frame++;
        
        const dogEl = document.getElementById('fetch-dog');
        const ballEl = document.getElementById('fetch-ball');
        
        if (d.state === 'thrown') {
            // Ball moving to target rapidly
            if (d.ballX < d.targetX) d.ballX += 4;
            if (d.ballX > d.targetX) d.ballX = d.targetX;
            
            // Dog chasing ball
            if (d.dogX < d.ballX) d.dogX += 2.5;
            
            // Bobbing dog animation facing right
            if (dogEl) {
                dogEl.style.transform = `translateY(${Math.abs(Math.sin(d.frame * 0.3)) * -10}px) scaleX(1)`;
            }
            
            // Check if dog reached the ball
            if (d.dogX >= d.targetX && d.ballX >= d.targetX) {
                d.state = 'returning';
            }
        } else if (d.state === 'returning') {
            // Dog runs back with ball
            d.dogX -= 2.0;
            d.ballX = d.dogX; // Dog carries ball
            
            // Bobbing dog animation flipped (facing left)
            if (dogEl) {
                dogEl.style.transform = `translateY(${Math.abs(Math.sin(d.frame * 0.3)) * -10}px) scaleX(-1)`;
            }
            
            // Returned safely
            if (d.dogX <= 5) {
                d.dogX = 5;
                d.ballX = 5;
                d.state = 'ready';
                d.throws++;
                
                if (dogEl) dogEl.style.transform = `translateY(0px) scaleX(1)`;
                
                const cnt = document.getElementById('fetch-count');
                if (cnt) cnt.innerText = `${d.throws}/5`;
                
                // Win Condition
                if (d.throws >= 5) {
                    clearInterval(window.dogFetchInt);
                    window.winDogGame('play', `${dogName} had a blast playing fetch! They look pleasantly exhausted.`, "🎾");
                }
            }
        } else {
            // Idle state
            if (dogEl) dogEl.style.transform = `translateY(0px) scaleX(1)`;
        }

        // Apply DOM updates
        if (dogEl) dogEl.style.left = d.dogX + '%';
        if (ballEl) {
            ballEl.style.left = d.ballX + '%';
            // Roll the ball while it's being thrown, stop spinning when held
            if (d.state === 'thrown' && d.ballX < d.targetX) {
                ballEl.style.transform = `rotate(${d.frame * 15}deg)`;
            } else {
                ballEl.style.transform = `rotate(0deg)`;
            }
        }
    }, 16);
};

window.throwBall = function(e) {
    const d = window.fetchData;
    if (d.state !== 'ready') return; // Can only throw if dog is holding ball
    
    let area = document.getElementById('fetch-area');
    if(!area) return;
    
    let rect = area.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let targetPct = (clickX / rect.width) * 100;
    
    // Ensure it's thrown at least somewhat to the right
    if (targetPct > 20) {
        d.targetX = Math.min(90, targetPct);
        d.state = 'thrown';
    }
};

window.throwBallTouch = function(e) {
    e.preventDefault(); 
    if (e.touches && e.touches.length > 0) {
        window.throwBall(e.touches[0]);
    }
};