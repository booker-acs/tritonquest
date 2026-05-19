// --- DAILY EVENT: FAST FOOD RUSH (UPDATED BURGER) ---
        window.burgerData = { timer: 8.0, interval: null, dragItem: null, ingredients: 0 };

        window.startBurgerEvent = function() {
            if (window.burgerData.interval) clearInterval(window.burgerData.interval);
            state.step = 'event_burger';
            window.burgerData.timer = 8.0;
            window.burgerData.ingredients = 0;
            window.burgerData.dragItem = null;
            window.renderBurgerGame();

            // Countdown
            let count = 3;
            const countEl = document.getElementById('burger-countdown');
            const startLoop = setInterval(() => {
                count--;
                if (count > 0) {
                    if (countEl) countEl.innerText = count;
                } else {
                    clearInterval(startLoop);
                    if (countEl) countEl.style.display = 'none';
                    
                    window.burgerData.interval = setInterval(() => {
                        window.burgerData.timer -= 0.1;
                        const timerEl = document.getElementById('burger-timer');
                        if (timerEl) timerEl.innerText = Math.max(0, window.burgerData.timer).toFixed(1) + 's';
                        
                        if (window.burgerData.timer <= 0) {
                            window.finishBurgerGame(false);
                        }
                    }, 100);
                }
            }, 500);
        };

        window.startBurgerEvent = function() {
            if (window.burgerData.interval) clearInterval(window.burgerData.interval);
            window.burgerData.timer = 8.0;
            window.burgerData.ingredients = 0;
            window.burgerData.dragItem = null;

            // (Copy SVG content from existing renderBurgerGame into this string)
            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <!-- Insert Burger Icon SVG here -->
                    <div class="text-6xl mb-4">🍔</div> 
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Lunch Rush!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Assemble the burger! Drag ingredients to bottom bun.</p>
                    
                    <div class="mb-2 text-right text-xs font-bold text-acs-gold px-1" id="burger-timer">8.0s</div>

                    <div id="burger-area" class="bg-slate-800 rounded-3xl h-80 relative overflow-hidden border-4 border-slate-700 select-none" onmousemove="window.moveBurgerItem(event)" onmouseup="window.dropBurgerItem()">
                        <div id="burger-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold/80 z-30 pointer-events-none select-none">3</div>
                        
                        <!-- Ingredients (Draggable SVGs) -->
                        
                        <!-- Patty -->
                        <div class="draggable-ing absolute top-4 left-4 cursor-grab hover:scale-110 w-20 h-10" onmousedown="window.dragBurgerItem(event, this)" data-type="patty">
                            <svg viewBox="0 0 100 60" width="100%" height="100%">
                                <rect x="5" y="10" width="90" height="30" rx="10" fill="#78350f" stroke="#451a03" stroke-width="2"/>
                                <path d="M20,20 L40,35 M60,15 L80,25" stroke="#3f1a05" stroke-width="3" opacity="0.6"/>
                            </svg>
                        </div>
                        
                        <!-- Cheese -->
                        <div class="draggable-ing absolute top-4 left-1/2 -translate-x-1/2 cursor-grab hover:scale-110 w-20 h-10" onmousedown="window.dragBurgerItem(event, this)" data-type="cheese">
                            <svg viewBox="0 0 100 60" width="100%" height="100%">
                                <rect x="5" y="15" width="90" height="20" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
                            </svg>
                        </div>
                        
                        <!-- Lettuce -->
                        <div class="draggable-ing absolute top-4 right-4 cursor-grab hover:scale-110 w-20 h-10" onmousedown="window.dragBurgerItem(event, this)" data-type="lettuce">
                            <svg viewBox="0 0 100 60" width="100%" height="100%">
                                <path d="M5,30 Q20,10 35,30 T65,30 T95,30" fill="none" stroke="#22c55e" stroke-width="8" stroke-linecap="round"/>
                            </svg>
                        </div>
                        
                        <!-- Top Bun (New) -->
                        <div class="draggable-ing absolute top-20 left-1/2 -translate-x-1/2 cursor-grab hover:scale-110 w-20 h-12" onmousedown="window.dragBurgerItem(event, this)" data-type="topbun">
                             <svg viewBox="0 0 100 60" width="100%" height="100%">
                                <path d="M5,50 Q50,0 95,50 Z" fill="#FDB913" stroke="#92400e" stroke-width="2"/>
                                <circle cx="30" cy="30" r="2" fill="#fef3c7"/><circle cx="50" cy="20" r="2" fill="#fef3c7"/><circle cx="70" cy="30" r="2" fill="#fef3c7"/>
                            </svg>
                        </div>

                        <!-- Target Bun (Bottom) -->
                        <div id="target-bun" class="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-12">
                             <svg viewBox="0 0 100 60" width="100%" height="100%">
                                <path d="M5,10 Q50,60 95,10 Z" fill="#FDB913" stroke="#92400e" stroke-width="2"/>
                            </svg>
                        </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    let count = 3;
                    const countEl = document.getElementById('burger-countdown');
                    const startLoop = setInterval(() => {
                        count--;
                        if (count > 0) { if (countEl) countEl.innerText = count; } 
                        else {
                            clearInterval(startLoop);
                            if (countEl) countEl.style.display = 'none';
                            window.burgerData.interval = setInterval(() => {
                                window.burgerData.timer -= 0.1;
                                const timerEl = document.getElementById('burger-timer');
                                if (timerEl) timerEl.innerText = Math.max(0, window.burgerData.timer).toFixed(1) + 's';
                                if (window.burgerData.timer <= 0) window.finishBurgerGame(false);
                            }, 100);
                        }
                    }, 500);
                }
            });
            window.processModalQueue();
        };

        window.dragBurgerItem = function(e, el) {
            if(el.dataset.placed === "true") return;
            window.burgerData.dragItem = el;
            el.style.zIndex = 50; // Bring to front
            // Prevent default drag behavior
            e.preventDefault();
        };

        window.moveBurgerItem = function(e) {
            if (window.burgerData.dragItem) {
                const area = document.getElementById('burger-area');
                const rect = area.getBoundingClientRect();
                const x = e.clientX - rect.left - (window.burgerData.dragItem.offsetWidth / 2); 
                const y = e.clientY - rect.top - (window.burgerData.dragItem.offsetHeight / 2);
                window.burgerData.dragItem.style.left = x + 'px';
                window.burgerData.dragItem.style.top = y + 'px';
            }
        };

        window.dropBurgerItem = function() {
            const item = window.burgerData.dragItem;
            if (!item) return;

            const bun = document.getElementById('target-bun');
            const area = document.getElementById('burger-area');
            
            const itemRect = item.getBoundingClientRect();
            const bunRect = bun.getBoundingClientRect();
            const areaRect = area.getBoundingClientRect();

            // Simple collision check (overlap)
            const overlap = !(itemRect.right < bunRect.left || 
                              itemRect.left > bunRect.right || 
                              itemRect.bottom < bunRect.top || 
                              itemRect.top > bunRect.bottom);

            if (overlap) {
                // Stack Logic
                item.dataset.placed = "true";
                item.style.cursor = "default";
                item.style.zIndex = 10 + window.burgerData.ingredients; // Stack Z
                
                // 1. Horizontal Alignment: Center item over the bun
                // Calculate the center of the bun relative to the container
                const bunCenterX = (bunRect.left - areaRect.left) + (bunRect.width / 2);
                // Set item left so its center matches bun center
                item.style.left = (bunCenterX - (item.offsetWidth / 2)) + 'px';
                
                // 2. Vertical Stacking: Stack upwards
                // Get the top position of the bun relative to container
                const bunTop = bunRect.top - areaRect.top;
                
                // Define how much ingredients should overlap visually (e.g., 15px step)
                const stackStep = 15; 
                
                // Calculate new top: Start at bun top, move up by stack count, subtract item height to sit on top
                // We add a small 'overlap' (e.g., +10) so it settles into the ingredient below
                const stackY = bunTop - (window.burgerData.ingredients * stackStep);
                
                // Align the bottom of the item roughly with the stackY
                item.style.top = (stackY - item.offsetHeight + 15) + 'px'; 

                // 3. Reset Transform
                // Important: Remove the hover scale effect so it locks in place cleanly
                item.style.transform = 'none';

                window.burgerData.ingredients++;
                
                // We need 4 items now (Patty, Cheese, Lettuce, Top Bun)
                if (window.burgerData.ingredients >= 4) {
                    window.finishBurgerGame(true);
                }
            }

            window.burgerData.dragItem = null;
        };

        window.finishBurgerGame = function(success) {
            // 1. Stop the Timer
            clearInterval(window.burgerData.interval);
            
            // 2. CRITICAL: Force close the current game window
            document.getElementById('modal-overlay').classList.add('hidden'); 

            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;
            
            // 3. Queue the result with a slight delay to ensure the UI resets
            setTimeout(() => {
                if (success) {
                    // Success Logic
                    state.stress = Math.max(0, state.stress - 20); state.dayStats.stress -= 20;
                    state.balance -= 15; state.dayStats.cash -= 15;
                    
                    statHtml += `<div class="text-red-400 flex justify-between"><span>Food Cost</span><span>-$15.00</span></div>`;
                    statHtml += `<div class="text-green-400 flex justify-between"><span>Delicious</span><span>-20% Stress</span></div>`;
                    statHtml += `</div>`;
                    
                    window.queueModal("ORDER UP!", "You built the perfect burger. It was delicious." + statHtml, "Yum", "🍔", () => window.finalizeDay());
                } else {
                    // Failure Logic
                    state.balance -= 15; state.dayStats.cash -= 15;
                    state.stress = Math.min(100, state.stress + 10); state.dayStats.stress += 10;
                    
                    statHtml += `<div class="text-red-400 flex justify-between"><span>Food Cost</span><span>-$15.00</span></div>`;
                    statHtml += `<div class="text-red-400 flex justify-between"><span>Messy</span><span>+10% Stress</span></div>`;
                    statHtml += `</div>`;
                    
                    window.queueModal("SPLAT", "You dropped the ingredients everywhere. A sad lunch." + statHtml, "Sigh", "🥪", () => window.finalizeDay());
                }
            }, 100);
        };