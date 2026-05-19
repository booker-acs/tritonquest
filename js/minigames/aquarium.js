// --- AQUARIUM SYSTEM ---

// 1. Define Fish Database (Ordered by price)
window.FISH_DB = [
    { id: 'shrimp', name: 'Red Cherry Shrimp', icon: 'images/aquarium/shrimp.webp', cost: 5, stressRelief: 1, desc: 'Hardworking bottom feeder. Loves algae.', effect: 'Low stress relief.' },
    { id: 'betta', name: 'Betta Fish', icon: 'images/aquarium/betta.webp', cost: 15, stressRelief: 3, desc: 'Fierce and vibrant. A striking solo swimmer.', effect: 'Standard upkeep.' },
    { id: 'barb', name: 'Tiger Barb', icon: 'images/aquarium/barb.webp', cost: 15, stressRelief: 3, desc: 'Active and zippy. Loves exploring the tank.', effect: 'Standard upkeep.' },
    { id: 'shark', name: 'Red Tailed Shark Shark', icon: 'images/aquarium/shark.webp', cost: 20, stressRelief: 5, desc: 'Sleek and powerful. A tank bully.', effect: 'Makes water dirty faster.' },
    { id: 'ram', name: 'German Blue Ram', icon: 'images/aquarium/ram.webp', cost: 25, stressRelief: 6, desc: 'Colorful and peaceful. Shines in clean water.', effect: 'Fragile: Loses health quickly.' },
    { id: 'gourami', name: 'Opaline Gourami', icon: 'images/aquarium/gourami.webp', cost: 30, stressRelief: 7, desc: 'Graceful and calm with long, elegant fins.', effect: 'Requires pristine water.' },
    { id: 'eel', name: 'Tire Track Eel', icon: 'images/aquarium/eel.webp', cost: 40, stressRelief: 7, desc: 'A long, slithering escape artist. Loves hiding.', effect: 'High metabolism (hungry fast).' },
    { id: 'pleco', name: 'Bristlenose Pleco', icon: 'images/aquarium/pleco.webp', cost: 45, stressRelief: 5, desc: 'A peculiar bottom-dweller.', effect: 'Passively cleans the tank.' }
];

window.FISH_NAMES = ["Bubbles", "Finnegan", "Sushi", "Neptune", "Salty", "Captain", "Glub", "Flipper", "Jaws", "Goldie", "Wanda", "Swim Shady"];

// Global states
window.tankPellets = [];
window.isFeedingMode = false;
window.isCleaningMode = false;
window.isScrubbing = false;
window.algaeSpots = [];

// --- HELPER FUNCTIONS ---
window.getTankStressRelief = function() {
    if (!state.fish || state.fish.length === 0) return 0;
    let total = 0;
    state.fish.forEach(f => {
        // Fallbacks for legacy saves without proper DB mapping
        let base = 5; 
        if (f.stressRelief !== undefined) {
            base = f.stressRelief;
        } else if (f.icon) {
            if (f.icon.includes('shrimp')) base = 1;
            else if (f.icon.includes('betta') || f.icon.includes('barb')) base = 3;
            else if (f.icon.includes('ram')) base = 6;
            else if (f.icon.includes('gourami') || f.icon.includes('eel')) base = 7;
        }
        total += (base + (state.tankLevel || 0));
    });
    return total;
};

// --- FISH TANK LOGIC ---

window.updateFishTank = function() {
    const tank = document.getElementById('aquarium-tank');
    if (!tank) return;

    // --- ANIMATION LOGIC (Background & Plants) ---
    if (typeof window.tankFrame === 'undefined') window.tankFrame = 0;
    window.tankFrame++;

    if (window.tankFrame % 10 === 0) {
        const frameNum = (Math.floor(window.tankFrame / 10) % 3) + 1; 
        const bubImg = document.getElementById('tank-bub-img');
        if (bubImg) {
            bubImg.src = `images/aquarium/bub${frameNum}.webp`;
        }
    }

    if (window.tankFrame % 20 === 0) {
        const plantFrameNum = (Math.floor(window.tankFrame / 20) % 3) + 1; 
        const plantImg = document.getElementById('tank-plants-img');
        if (plantImg) {
            plantImg.src = `images/aquarium/plant${plantFrameNum}.webp`;
        }
    }

    // --- PELLET LOGIC ---
    if (window.tankPellets && window.tankPellets.length > 0) {
        const tankRect = tank.getBoundingClientRect();
        
        for (let i = 0; i < window.tankPellets.length; i++) {
            let p = window.tankPellets[i];
            
            // Gravity
            if (p.y < 85) { // Stop at ~85% (bottom)
                p.y += 0.5; // Fall speed
            }
            
            const pEl = document.getElementById(`pellet-${p.id}`);
            if (pEl) {
                pEl.style.top = p.y + '%';
            } else {
                // If element missing, remove data
                window.tankPellets.splice(i, 1);
                i--;
                continue;
            }

            // Check collision with Hungry Fish
            for (let j = 0; j < state.fish.length; j++) {
                const fish = state.fish[j];
                const anim = window.fishAnimData[j];
                
                // Only eat if not full
                if (fish.hunger < 2) {
                    const dx = Math.abs(p.x - anim.x);
                    const dy = Math.abs(p.y - anim.y);
                    
                    // Hitbox: within 5% x and 5% y
                    if (dx < 5 && dy < 5) {
                        // EAT
                        fish.hunger = 2; // Full
                        fish.health = Math.min(100, fish.health + 5); // Small instant heal from eating
                        state.fishFed = true;
                        window.tankPellets.splice(i, 1);
                        i--; // Adjust loop
                        if (pEl) pEl.remove();
                        
                        // Visual Feedback
                        const fishEl = document.getElementById(`fish-container-${j}`);
                        if (fishEl) {
                            const yum = document.createElement('div');
                            yum.innerText = "❤️";
                            yum.className = "absolute -top-4 left-0 text-xs animate-bounce text-red-500";
                            fishEl.appendChild(yum);
                            setTimeout(() => yum.remove(), 1000);
                        }
                        
                        window.updateTankUI();
                        break; // Pellet consumed
                    }
                    
                    // Simple AI: Move hungry fish towards food if close
                    if (dx < 20 && dy < 20) {
                        anim.depth = 0; // Swim up to the glass to grab it!
                        if (p.x > anim.x) anim.vx += 0.05;
                        else anim.vx -= 0.05;
                        if (p.y > anim.y) anim.vy += 0.05;
                        else anim.vy -= 0.05;
                    }
                }
            }
        }
    }

    // --- FISH MOVEMENT & ANIMATION LOGIC ---
    const fishSpriteFrame = (Math.floor(window.tankFrame / 12) % 2) === 0 ? '' : '2';

    window.fishAnimData.forEach((f, i) => {
        const el = document.getElementById(`fish-container-${i}`);
        const sprite = document.getElementById(`fish-sprite-${i}`);
        const fishState = state.fish[i];
        
        if (el && sprite) {
            // Friction/Limit speed
            f.vx = Math.max(-1, Math.min(1, f.vx));
            f.vy = Math.max(-1, Math.min(1, f.vy));
            
            f.x += f.vx;
            f.y += f.vy;

            // Wall Collision
            if (f.x <= 5 || f.x >= 85) f.vx *= -1;
            if (f.y <= 5 || f.y >= 80) f.vy *= -1;
            
            // Random Turn and occasional depth change
            if (Math.random() < 0.02) {
                f.vx = (Math.random() - 0.5) * 0.5;
                f.vy = (Math.random() - 0.5) * 0.5;
                // 30% chance to swim to a different depth layer on a turn
                if (Math.random() < 0.3) {
                    f.depth = Math.floor(Math.random() * 3); // 0=Front, 1=Mid, 2=Back
                }
            }

            // Calculate Species Specific Scaling
            let speciesScale = 1.0;
            if (fishState && fishState.icon) {
                if (fishState.icon.includes('eel.webp')) speciesScale = 1.5;
                else if (fishState.icon.includes('gourami.webp')) speciesScale = 1.25;
                else if (fishState.icon.includes('shrimp.webp')) speciesScale = 0.75;
                // Pleco, Ram, and others use standard scale 1.0
                
                // Update Fish Image Frame
                if (fishState.icon.includes('.webp')) {
                    sprite.src = fishState.icon.replace('.webp', `${fishSpriteFrame}.webp`);
                }
            }

            // Render Layout & Depth
            el.style.left = f.x + '%';
            el.style.top = f.y + '%';

            // Z-Indices mapping: 0 = Front (z-50), 1 = Mid (z-35), 2 = Back (z-25)
            const zIndices = [50, 35, 25];
            const baseScales = [1, 0.85, 0.70];
            const finalScale = baseScales[f.depth] * speciesScale;
            
            el.style.zIndex = zIndices[f.depth];
            el.style.transform = `scale(${finalScale})`;

            // Handle horizontal flip on the internal sprite so the container transform isn't overridden
            if (f.vx > 0) sprite.style.transform = "scaleX(-1)";
            else sprite.style.transform = "scaleX(1)";
        }
    });
};

window.openFishTank = function() {
    if (window.aquariumAudio) {
        window.aquariumAudio.pause(); // Safety check in case it's already playing
    }
    window.aquariumAudio = new Audio("audio/loops/fishtank.ogg"); 
    window.aquariumAudio.volume = 0.3;
    window.aquariumAudio.loop = true;
    window.aquariumAudio.play().catch(e => console.log("Music play failed", e));
    // Init State (Start Empty)
    if (!state.fish) state.fish = [];
    if (typeof state.tankLevel === 'undefined') state.tankLevel = 0;
    if (typeof state.tankBg === 'undefined') state.tankBg = 1;
    // Determine if they've claimed their first free fish (legacy support check included)
    if (typeof state.firstFishClaimed === 'undefined') state.firstFishClaimed = state.fish.length > 0;
    
    // Ensure all fish have required stats
    state.fish.forEach(f => {
        if (typeof f.hunger === 'undefined') f.hunger = 1; // Default to Fine
        if (typeof f.health === 'undefined') f.health = 100; // Default max health
    });

    // Reset Modes
    window.isFeedingMode = false;
    window.isCleaningMode = false;
    window.isScrubbing = false;
    window.tankPellets = [];
    window.algaeSpots = [];

    window.tankFrame = 0;
    // Ensure fishAnimData matches state.fish length
    window.fishAnimData = state.fish.map(() => ({
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        depth: Math.floor(Math.random() * 3) // Initial random layer depth (0-2)
    }));

    // Generate Layers
    let waterStatus = "Crystal Clear";
    let waterColor = "text-blue-400";
    let frameImage = "images/aquarium/frontframe.webp";
    
    if (state.fishWaterDays <= 3) { 
        waterStatus = "Murky"; waterColor = "text-yellow-500"; frameImage = "images/aquarium/frontframe2.webp"; 
    }
    if (state.fishWaterDays <= 0) { 
        waterStatus = "Filthy"; waterColor = "text-red-500"; frameImage = "images/aquarium/frontframe3.webp"; 
    }

    const fishHtml = state.fish.map((f, i) => {
        const isImage = f.icon.includes('/') || f.icon.includes('.');
        const content = isImage 
            ? `<img id="fish-sprite-${i}" src="${f.icon}" class="w-12 h-12 object-contain transition-transform duration-300 ease-in-out drop-shadow-sm">`
            : `<div id="fish-sprite-${i}" class="text-4xl transition-transform duration-300 ease-in-out">${f.icon}</div>`;

        let hungerText = f.hunger >= 2 ? 'Full' : (f.hunger === 1 ? 'Hungry' : 'Starving');
        let hungerColor = f.hunger >= 2 ? 'text-blue-400' : (f.hunger === 1 ? 'text-yellow-400' : 'text-red-400');
        let healthColor = f.health > 50 ? 'text-green-400' : 'text-red-400';

        // Calculate Species Specific Scaling
        let speciesScale = 1.0;
        if (f.icon) {
            if (f.icon.includes('eel.webp')) speciesScale = 1.5;
            else if (f.icon.includes('gourami.webp')) speciesScale = 1.25;
            else if (f.icon.includes('shrimp.webp')) speciesScale = 0.75;
        }

        const d = window.fishAnimData[i];
        const zIndices = [50, 35, 25];
        const baseScales = [1, 0.85, 0.70];
        const finalScale = baseScales[d.depth] * speciesScale;

        return `
        <div id="fish-container-${i}" class="absolute flex flex-col items-center transition-all duration-300 ease-in-out group" style="left: ${d.x}%; top: ${d.y}%; width: 60px; z-index: ${zIndices[d.depth]}; transform: scale(${finalScale});">
            ${content}
            <div class="text-[8px] font-bold text-white/90 bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-center">
                <div class="text-[9px] mb-0.5 border-b border-slate-600 pb-0.5">${f.name}</div>
                <div class="${healthColor}">❤️ ${f.health}/100</div>
                <div class="${hungerColor}">🍗 ${hungerText}</div>
            </div>
        </div>`;
    }).join('');

    let decoLayersHtml = '';
    // Level 3 Upgrade Layer (Wood)
    if (state.tankLevel >= 3) decoLayersHtml += `<img id="tank-wood" src="images/aquarium/wood.webp" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 20;">`;
    // Level 2 Upgrade Layer (Castle)
    if (state.tankLevel >= 2) decoLayersHtml += `<img id="tank-castle" src="images/aquarium/castle.webp" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 30;">`;
    // Level 1 Upgrade Layer (Plants - Animated)
    if (state.tankLevel >= 1) decoLayersHtml += `<img id="tank-plants-img" src="images/aquarium/plant1.webp" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 40;">`;

    // Buttons
    const canAdd = state.fish.length < 5; 
    const canUpgrade = state.tankLevel < 3;
    const fishCostText = state.firstFishClaimed ? '($$)' : '(FREE)';
    const addFishBtn = canAdd ? `<button onclick="window.addFish()" class="flex-1 py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-500 font-bold hover:border-acs-gold hover:text-acs-gold transition-all flex items-center justify-center gap-2"><span>+ Fish</span> <span class="text-[9px] opacity-70">${fishCostText}</span></button>` : `<div class="flex-1 py-3 border-2 border-transparent rounded-xl text-slate-600 font-bold text-center bg-slate-900/50">Tank Full</div>`;
    const upgradeBtn = canUpgrade ? `<button onclick="window.upgradeTank()" class="flex-1 py-3 border-2 border-dashed border-purple-600 rounded-xl text-purple-400 font-bold hover:border-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-2"><span>Upgrade</span> <span class="text-[9px] opacity-70">($30)</span></button>` : `<div class="flex-1 py-3 border-2 border-transparent rounded-xl text-green-600 font-bold text-center bg-slate-900/50">Max Level</div>`;

    const bgImageName = state.tankBg === 1 ? 'base.webp' : `base${state.tankBg}.webp`;

    const tankHtml = `
        <div class="select-none">
            <div id="aquarium-tank" class="rounded-3xl w-full aspect-[675/384] relative overflow-hidden shadow-xl mb-4 bg-transparent cursor-default" onclick="window.handleTankClick(event)">
                <!-- Base Background (Static/Swappable) -->
                <img id="tank-base-img" src="images/aquarium/${bgImageName}" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0;">
                
                <!-- Bubbles Layer (Animated) -->
                <img id="tank-bub-img" src="images/aquarium/bub1.webp" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 10;">
                
                <!-- Decorations Layers (Z 20-40) -->
                ${decoLayersHtml}
                
                <!-- Swimming Fish -->
                ${fishHtml}
                
                <!-- Pellets Layer -->
                <div id="pellet-layer" class="absolute inset-0 pointer-events-none" style="z-index: 60;"></div>

                <!-- Front Frame Overlay (Dynamic) -->
                <img src="${frameImage}" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 70;">
                
                <!-- Algae Overlay Layer for Cleaning -->
                <div id="algae-layer" class="absolute inset-0 pointer-events-none" style="z-index: 80;"></div>

                <!-- Custom Cursors -->
                <img id="feed-cursor" src="images/aquarium/food.webp" class="hidden absolute w-8 h-8 pointer-events-none" style="transform-origin: center; z-index: 90;">
                <img id="clean-cursor" src="images/aquarium/scrubber.webp" class="hidden absolute w-12 h-12 pointer-events-none" style="transform-origin: center; z-index: 90;">
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-xs font-bold mb-4">
                <div class="bg-slate-900 p-2 rounded-lg border border-slate-700 text-center">
                    <div class="text-slate-500 uppercase tracking-wider mb-1">Hunger</div>
                    <div id="tank-hunger-status" class="text-white">Calculating...</div>
                </div>
                <div class="bg-slate-900 p-2 rounded-lg border border-slate-700 text-center">
                    <div class="text-slate-500 uppercase tracking-wider mb-1">Water</div>
                    <div class="${waterColor}">${waterStatus} (${Math.max(0, state.fishWaterDays)} days)</div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-3">
                <button id="btn-feed" onclick="window.feedFish()" class="py-3 bg-indigo-600 rounded-xl text-white font-black hover:bg-indigo-500 transition-all ${state.fish.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}">Feed 🪱</button>
                <button id="btn-clean" onclick="window.cleanFishTank()" class="py-3 bg-cyan-600 rounded-xl text-white font-black hover:bg-cyan-500 transition-all ${state.fishWaterDays >= 7 ? 'opacity-50 cursor-not-allowed' : ''}">Clean 🧼</button>
            </div>
            
            <div class="flex gap-3 mb-2">
                ${addFishBtn}
                ${upgradeBtn}
            </div>

            <div class="flex items-center justify-center gap-4 mb-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/50">
                <button onclick="window.changeTankBg(-1)" class="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-xs transition-all">◀</button>
                <span id="tank-bg-label" class="text-[9px] font-bold text-slate-500 uppercase tracking-widest w-24 text-center">BG ${state.tankBg}/7</span>
                <button onclick="window.changeTankBg(1)" class="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-xs transition-all">▶</button>
            </div>

            <div class="mt-2 pt-2 border-t border-slate-700 text-[9px] text-slate-500 flex justify-between px-1">
                <span>Relief: -${window.getTankStressRelief()}% Stress</span>
                <span>Level: ${state.tankLevel}/3</span>
            </div>
        </div>
    `;

    state.pendingModals.push({
        title: "Fish Tank",
        text: tankHtml,
        icon: "💧",
        superHeader: "PET CARE",
        buttonText: "Close",
        showCloseX: false,
        choices: null,
        callback: () => {
            if (window.fishAnimInterval) clearInterval(window.fishAnimInterval);
            window.isFeedingMode = false;
            window.isCleaningMode = false;
            window.isScrubbing = false;
            // --- NEW: STOP OVERLAY AUDIO ---
            if (window.aquariumAudio) {
                window.aquariumAudio.pause();
                window.aquariumAudio.currentTime = 0;
            }
            
        
        },
        onOpen: () => {
            if (window.fishAnimInterval) clearInterval(window.fishAnimInterval);
            window.fishAnimInterval = setInterval(window.updateFishTank, 50);
            
            // Interaction tracking for Feed / Clean
            const tank = document.getElementById('aquarium-tank');
            
            tank.addEventListener('mousemove', (e) => {
                const rect = tank.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (window.isFeedingMode) {
                    const cursor = document.getElementById('feed-cursor');
                    cursor.style.left = (x - 16) + 'px';
                    cursor.style.top = (y - 16) + 'px';
                } else if (window.isCleaningMode) {
                    const cursor = document.getElementById('clean-cursor');
                    cursor.style.left = (x - 24) + 'px'; // Center scrubber
                    cursor.style.top = (y - 24) + 'px';
                    
                    if (window.isScrubbing) {
                        window.handleScrub(x, y, rect.width, rect.height);
                    }
                }
            });

            // Scrubbing trigger listeners
            tank.addEventListener('mousedown', () => { window.isScrubbing = true; });
            tank.addEventListener('mouseup', () => { window.isScrubbing = false; });
            tank.addEventListener('mouseleave', () => { window.isScrubbing = false; });

            window.updateTankUI();
        }
    });
    window.processModalQueue();
};

window.changeTankBg = function(dir) {
    if (typeof state.tankBg === 'undefined') state.tankBg = 1;
    
    state.tankBg += dir;
    if (state.tankBg > 7) state.tankBg = 1;
    if (state.tankBg < 1) state.tankBg = 7;
    
    const bgImageName = state.tankBg === 1 ? 'base.webp' : `base${state.tankBg}.webp`;
    
    const bgImg = document.getElementById('tank-base-img');
    if (bgImg) bgImg.src = `images/aquarium/${bgImageName}`;
    
    const bgLabel = document.getElementById('tank-bg-label');
    if (bgLabel) bgLabel.innerText = `BG ${state.tankBg}/7`;
};

window.updateTankUI = function() {
    const statusEl = document.getElementById('tank-hunger-status');
    if (!statusEl) return;
    
    if (!state.fish || state.fish.length === 0) {
        statusEl.innerText = "Empty Tank";
        statusEl.className = "text-slate-500";
    } else {
        // Evaluate individual states rather than average
        const starvingCount = state.fish.filter(f => f.hunger === 0).length;
        const hungryCount = state.fish.filter(f => f.hunger === 1).length;
        
        if (starvingCount > 0) {
            statusEl.innerText = `${starvingCount} Starving!`;
            statusEl.className = "text-red-500 animate-pulse";
        } else if (hungryCount > 0) {
            statusEl.innerText = `${hungryCount} Hungry`;
            statusEl.className = "text-yellow-400";
        } else {
            statusEl.innerText = "All Full";
            statusEl.className = "text-green-400";
        }
    }
    
    // Update Mode Buttons
    const feedBtn = document.getElementById('btn-feed');
    if (feedBtn) {
        if (window.isFeedingMode) {
            feedBtn.innerText = "Stop Feeding";
            feedBtn.className = "py-3 bg-red-600 rounded-xl text-white font-black hover:bg-red-500 transition-all";
        } else {
            feedBtn.innerText = "Feed 🪱";
            feedBtn.className = `py-3 bg-indigo-600 rounded-xl text-white font-black hover:bg-indigo-500 transition-all ${state.fish && state.fish.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`;
        }
    }
    
    const cleanBtn = document.getElementById('btn-clean');
    if (cleanBtn) {
        if (window.isCleaningMode) {
            cleanBtn.innerText = "Stop Cleaning";
            cleanBtn.className = "py-3 bg-red-600 rounded-xl text-white font-black hover:bg-red-500 transition-all";
        } else {
            cleanBtn.innerText = "Clean 🧼";
            cleanBtn.className = `py-3 bg-cyan-600 rounded-xl text-white font-black hover:bg-cyan-500 transition-all ${state.fishWaterDays >= 7 ? 'opacity-50 cursor-not-allowed' : ''}`;
        }
    }
};

// --- INTERACTION LOGIC ---

window.feedFish = function() {
    if (!state.fish || state.fish.length === 0) return;
    if (window.isCleaningMode) window.cleanFishTank(); // Toggle off cleaning if active

    window.isFeedingMode = !window.isFeedingMode;
    const tank = document.getElementById('aquarium-tank');
    const feedCursor = document.getElementById('feed-cursor');
    
    if (window.isFeedingMode) {
        tank.classList.add('cursor-none');
        feedCursor.classList.remove('hidden');
    } else {
        tank.classList.remove('cursor-none');
        feedCursor.classList.add('hidden');
    }
    
    window.updateTankUI();
};

window.handleTankClick = function(e) {
    if (!window.isFeedingMode) return;
    if (state.balance < 1) {
        window.isFeedingMode = false;
        window.updateTankUI();
        return;
    }

    // Spawn Pellet
    state.balance -= 1;
    state.dayStats.cash -= 1;
    window.updateUI(); 

    const tank = document.getElementById('aquarium-tank');
    const rect = tank.getBoundingClientRect();
    
    // Calc click pos in %
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    
    const id = Date.now() + Math.random();
    window.tankPellets.push({ id: id, x: xPct, y: yPct });
    
    const pellet = document.createElement('div');
    pellet.id = `pellet-${id}`;
    pellet.innerText = "🪱"; 
    pellet.className = "absolute text-xs pointer-events-none transition-none";
    pellet.style.left = xPct + '%';
    pellet.style.top = yPct + '%';
    document.getElementById('pellet-layer').appendChild(pellet);
    
    // Money Floater
    const float = document.createElement('div');
    float.innerText = "-$1";
    float.className = "absolute text-red-400 text-xs font-bold pointer-events-none animate-ping";
    float.style.left = xPct + '%';
    float.style.top = yPct + '%';
    // Ensures the float appears above everything else
    float.style.zIndex = '100'; 
    tank.appendChild(float);
    setTimeout(() => float.remove(), 500);

    // Cursor Animation (Rotate)
    const cursor = document.getElementById('feed-cursor');
    if (cursor) {
        cursor.style.transform = "rotate(45deg)";
        setTimeout(() => cursor.style.transform = "rotate(0deg)", 100);
    }
};

window.cleanFishTank = function() {
    if (state.fishWaterDays >= 7 && !window.isCleaningMode) return;
    
    if (!window.isCleaningMode && state.energy < 15) {
        document.getElementById('modal-overlay').classList.add('hidden');
        window.queueModal("Too Tired", "Cleaning the tank takes 15 Energy.", "Okay", "💤", () => window.openFishTank());
        return;
    }
    
    if (window.isFeedingMode) window.feedFish(); // Toggle off feeding if active
    
    window.isCleaningMode = !window.isCleaningMode;
    window.isScrubbing = false;

    const tank = document.getElementById('aquarium-tank');
    const cursor = document.getElementById('clean-cursor');
    const algaeLayer = document.getElementById('algae-layer');

    if (window.isCleaningMode) {
        tank.classList.add('cursor-none');
        cursor.classList.remove('hidden');
        
        // Spawn Algae Spots
        algaeLayer.innerHTML = '';
        window.algaeSpots = [];
        for (let i = 0; i < 8; i++) {
            const id = 'algae-' + i;
            const x = 10 + Math.random() * 80; 
            const y = 10 + Math.random() * 80; 
            
            window.algaeSpots.push({ id, x, y, hp: 100 });
            
            const spot = document.createElement('div');
            spot.id = id;
            spot.className = "absolute w-20 h-20 bg-green-700/70 rounded-full blur-md mix-blend-multiply transition-opacity duration-75";
            spot.style.left = `calc(${x}% - 40px)`;
            spot.style.top = `calc(${y}% - 40px)`;
            algaeLayer.appendChild(spot);
        }
    } else {
        // Cancel cleaning
        tank.classList.remove('cursor-none');
        cursor.classList.add('hidden');
        algaeLayer.innerHTML = '';
    }
    
    window.updateTankUI();
};

window.handleScrub = function(mouseX, mouseY, tWidth, tHeight) {
    let spotsLeft = 0;
    
    window.algaeSpots.forEach(spot => {
        if (spot.hp <= 0) return;
        spotsLeft++;
        
        const spotX = (spot.x / 100) * tWidth;
        const spotY = (spot.y / 100) * tHeight;
        
        const dx = mouseX - spotX;
        const dy = mouseY - spotY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 50) { // Scrubbing radius
            spot.hp -= 12; // Scrub power
            const el = document.getElementById(spot.id);
            if (el) {
                el.style.opacity = spot.hp / 100;
                if (spot.hp <= 0) {
                    el.remove();
                    spotsLeft--;
                }
            }
        }
    });
    
    if (spotsLeft === 0 && window.isCleaningMode) {
        window.finishCleaning();
    }
};

window.finishCleaning = function() {
    window.isCleaningMode = false;
    window.isScrubbing = false;
    
    state.energy -= 15;
    state.dayStats.energy -= 15;
    state.fishWaterDays = 7;
    
    const tank = document.getElementById('aquarium-tank');
    tank.classList.remove('cursor-none');
    
    if (window.fishAnimInterval) clearInterval(window.fishAnimInterval);
    document.getElementById('modal-overlay').classList.add('hidden');
    
    setTimeout(() => {
        window.queueModal("SPARKLING CLEAN", "You scrubbed the glass clean! Your fish appreciate it.<br><br><span class='text-red-400'>-15% Energy</span>", "Nice", "✨", () => {
            window.openFishTank();
        });
    }, 100);
};

// --- TANK PURCHASES & FISH SELECTION ---

window.addFish = function() {
    if (window.fishAnimInterval) clearInterval(window.fishAnimInterval);
    document.getElementById('modal-overlay').classList.add('hidden');

    const topBannerText = state.firstFishClaimed ? "Choose your new aquatic companion." : "<span class='text-green-400 font-bold'>Your first fish is FREE!</span><br>Choose your new aquatic companion.";
    
    // Stacked List Layout for better description visibility
    let optionsHtml = `<div class="grid grid-cols-1 gap-2 mt-4 max-h-[55vh] overflow-y-auto pr-1 custom-scroll text-left">`;
    window.FISH_DB.forEach((fish, index) => {
        const costDisplay = state.firstFishClaimed ? `$${fish.cost}` : "FREE";
        const costColor = state.firstFishClaimed ? "text-green-400" : "text-acs-gold";
        
        // Disable button if can't afford (only applies after first free fish)
        const canAfford = !state.firstFishClaimed || state.balance >= fish.cost;
        const btnClass = canAfford 
            ? "bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-acs-gold" 
            : "bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed";

        optionsHtml += `
            <button ${canAfford ? `onclick="window.confirmAddFish('${fish.id}')"` : ''} class="border-2 rounded-xl p-3 flex items-center gap-4 transition-all group ${btnClass}">
                <div class="bg-slate-900 rounded-lg p-2 flex-shrink-0">
                    <img src="${fish.icon}" class="w-12 h-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform">
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-white font-bold uppercase tracking-wider text-[11px] leading-none">${fish.name}</span>
                        <span class="${costColor} font-black text-xs leading-none">${costDisplay}</span>
                    </div>
                    <div class="text-[9px] text-slate-400 leading-tight mb-1">"${fish.desc}"</div>
                    <div class="flex items-center gap-2 mt-1 pt-1 border-t border-slate-700">
                        <span class="text-[8px] text-purple-300 font-bold tracking-widest uppercase flex items-center gap-1">
                            <span>🎭</span> -${fish.stressRelief}% STRESS
                        </span>
                        <span class="text-[8px] text-amber-500 italic">• ${fish.effect}</span>
                    </div>
                </div>
            </button>
        `;
    });
    optionsHtml += `</div>`;

    setTimeout(() => {
        window.queueModal("FISH STORE", topBannerText + optionsHtml, "Cancel", "🐠", () => {
            window.openFishTank(); // Go back if canceled
        });
    }, 100);
};

window.confirmAddFish = function(fishId) {
    // Clear pending modal to prevent 'Cancel' button callback overlap
    state.pendingModals = []; 
    document.getElementById('modal-overlay').classList.add('hidden');

    const dbFish = window.FISH_DB.find(f => f.id === fishId);
    if (!dbFish) return;

    if (state.firstFishClaimed) {
        if (state.balance < dbFish.cost) {
            setTimeout(() => {
                window.queueModal("No Funds", `You need $${dbFish.cost} to buy a ${dbFish.name}.`, "Okay", "💸", () => { window.openFishTank(); });
            }, 50);
            return;
        }
        state.balance -= dbFish.cost;
        state.dayStats.cash -= dbFish.cost;
    } else {
        state.firstFishClaimed = true;
    }
    
    const newFish = {
        icon: dbFish.icon,
        name: window.FISH_NAMES[Math.floor(Math.random() * window.FISH_NAMES.length)],
        type: dbFish.id, // Save the ID for mechanic tracking
        stressRelief: dbFish.stressRelief,
        health: 100,
        hunger: 2 
    };
    
    if (!state.fish) state.fish = [];
    state.fish.push(newFish);
    
    setTimeout(window.openFishTank, 50);
};

window.upgradeTank = function() {
    if (state.balance < 30) {
        document.getElementById('modal-overlay').classList.add('hidden');
        window.queueModal("No Funds", "Tank upgrade costs $30.", "Okay", "💸", () => window.openFishTank());
        return;
    }
    if (state.tankLevel >= 3) return;

    state.balance -= 30;
    state.dayStats.cash -= 30;
    state.tankLevel++;

    if (window.fishAnimInterval) clearInterval(window.fishAnimInterval);
    document.getElementById('modal-overlay').classList.add('hidden');
    setTimeout(() => {
        window.queueModal("UPGRADE COMPLETE", `Your tank looks amazing! Fish are happier.<br><span class="text-green-400">Bonus Stress Relief per fish.</span>`, "View Tank", "✨", () => {
            window.openFishTank();
        });
    }, 100);
};

// --- DAILY UPDATE LOGIC ---
window.processAquariumDaily = function() {
    if (!state.fish || state.fish.length === 0) return;
    
    let deadFish = [];
    
    // 1. Calculate Global Water Quality Modifiers (Shark/Pleco)
    let waterChange = 0;
    state.fish.forEach(f => {
        if (f.icon.includes('shark')) waterChange -= 1; // Sharks make tank dirty faster
        if (f.icon.includes('pleco')) waterChange += 1; // Plecos clean the tank passively
    });
    
    // Apply bonus water modifiers (Standard -1 decay is handled elsewhere/offset by this)
    if (typeof state.fishWaterDays !== 'undefined') {
        state.fishWaterDays = Math.max(0, Math.min(7, state.fishWaterDays + waterChange));
    }
    
    // 2. Process Individual Fish States
    for (let i = state.fish.length - 1; i >= 0; i--) {
        let f = state.fish[i];
        let isEel = f.icon.includes('eel');
        let isRam = f.icon.includes('ram');
        let isGourami = f.icon.includes('gourami');
        
        // A. Hunger Decay
        f.hunger = Math.max(0, f.hunger - (isEel ? 2 : 1)); // Eels burn double hunger
        
        // B. Health Logic based on Species specifics
        if (f.hunger <= 0 || state.fishWaterDays <= 0 || (isGourami && state.fishWaterDays <= 3)) {
            // Suffers if starving, or in filthy water (Gourami suffers in murky water)
            let damage = isRam ? 40 : 25; // Rams take massive penalty damage
            f.health -= damage; 
        } else if (f.hunger === 2 && state.fishWaterDays > 3) {
            // Heals if well fed and clean water
            f.health = Math.min(100, f.health + 15);
        }
        
        // C. Death Check
        if (f.health <= 0) {
            deadFish.push(f.name);
            state.fish.splice(i, 1);
        }
    }
    
    // 3. Apply Daily Stress Relief (Passive Buff)
    const dailyRelief = window.getTankStressRelief();
    if (dailyRelief > 0) {
        state.stress = Math.max(0, state.stress - dailyRelief);
        state.dayStats.stress -= dailyRelief;
    }

    // Alert the player if tragedy struck
    if (deadFish.length > 0) {
        const names = deadFish.join(', ');
        state.log.unshift(`Aquarium tragedy: ${names} passed away from neglect.`);
        
        // Queue modal so the player sees it immediately upon waking up
        window.queueModal("AQUARIUM TRAGEDY", `You neglected your fish. <b>${names}</b> passed away...<br><br>The tank has freed up space.`, "RIP", "🪦", null, null, false, "PET CARE");
    }
};