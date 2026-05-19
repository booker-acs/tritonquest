window.towerData = { 
            stack: [], // Array of widths/positions
            currentWidth: 100, // %
            currentX: 0, 
            direction: 1, 
            speed: 2, 
            level: 0, 
            maxLevels: 5,
            gameActive: false,
            interval: null 
        };

        window.startBookTowerGame = function() {
            window.towerData = { 
                stack: [], 
                currentWidth: 50, // Start with 50% width block
                currentX: 0, 
                direction: 2, 
                speed: 2, 
                level: 0, 
                maxLevels: 5,
                gameActive: true,
                interval: null 
            };

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none" onmousedown="window.placeBook()">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📚</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Book Tower</h2>
                    <p class="text-slate-300 mb-6 text-sm">Click to stack the books! Don't let them fall.</p>
                    
                    <!-- Game Area -->
                    <div class="bg-slate-800 rounded-xl border-4 border-slate-600 w-64 h-64 mx-auto relative overflow-hidden flex flex-col-reverse shadow-inner cursor-pointer" id="tower-area">
                        <!-- Base -->
                        <div class="w-full h-2 bg-slate-500 flex-shrink-0"></div>
                        <!-- Stacked blocks inject here -->
                        <div id="tower-stack" class="flex flex-col-reverse w-full h-full relative"></div>
                        <!-- Active Block (Absolute) -->
                        <div id="active-book" class="absolute bottom-2 bg-indigo-500 h-8 rounded border border-white/20 transition-none" style="width: 50%; left: 0%;"></div>
                    </div>
                    
                    <p class="text-[10px] text-slate-500 mt-4 italic">Stack ${window.towerData.maxLevels} books to win.</p>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const block = document.getElementById('active-book');
                    
                    window.towerData.interval = setInterval(() => {
                        const d = window.towerData;
                        if (!d.gameActive) return;

                        // Move Block
                        d.currentX += d.direction * d.speed;
                        
                        // Bounce off walls (accounting for width)
                        // Range is 0 to (100 - width)
                        const maxPos = 100 - d.currentWidth;
                        
                        if (d.currentX > maxPos || d.currentX < 0) {
                            d.direction *= -1;
                        }
                        
                        if(block) block.style.left = d.currentX + '%';
                    }, 20);
                }
            });
            window.processModalQueue();
        };

        window.placeBook = function() {
            const d = window.towerData;
            if (!d.gameActive) return;

            const stackContainer = document.getElementById('tower-stack');
            const activeBlock = document.getElementById('active-book');

            // 1. Calculate Overlap
            let prevX = 25; // Center (50% width centered at 25% left)
            let prevWidth = 50; 
            
            if (d.level > 0) {
                const prevBlock = d.stack[d.level - 1];
                prevX = prevBlock.x;
                prevWidth = prevBlock.w;
            }

            // Current placement
            const currX = d.currentX;
            const currW = d.currentWidth;

            // Logic: Calculate intersection
            const left = Math.max(prevX, currX);
            const right = Math.min(prevX + prevWidth, currX + currW);
            const newWidth = right - left;

            // 2. Fail Check (Missed completely)
            if (newWidth <= 0) {
                window.finishTowerGame(false);
                return;
            }

            // 3. Success (Place Block)
            d.currentWidth = newWidth;
            d.currentX = left; // Snap to the overlapped section
            
            // Add visual static block to stack
            const staticBlock = document.createElement('div');
            staticBlock.className = "h-8 bg-indigo-600 border border-white/20 rounded flex-shrink-0";
            staticBlock.style.width = newWidth + '%';
            staticBlock.style.marginLeft = left + '%'; // Use margin for flex positioning
            stackContainer.appendChild(staticBlock);
            
            // Add to logic stack
            d.stack.push({ x: left, w: newWidth });
            
            // Reset Active Block for next level
            d.level++;
            d.speed += 0.5; // Faster!
            
            // Win Check
            if (d.level >= d.maxLevels) {
                window.finishTowerGame(true);
                return;
            }

            // Reset pos for next spawn (start from left)
            d.currentX = 0; 
            activeBlock.style.width = d.currentWidth + '%';
            activeBlock.style.bottom = (2 + (d.level * 32)) + 'px'; // Move visual up (32px = h-8)
            // Note: In this simple CSS setup, we just keep the active block relative to bottom. 
            // A better way is absolute positioning. Let's adjust active block bottom.
            activeBlock.style.bottom = ((d.level * 32) + 8) + 'px'; // +8 for base padding
        };

        window.finishTowerGame = function(success) {
            window.towerData.gameActive = false;
            clearInterval(window.towerData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 15);
                    window.queueModal("TALL ORDER", "You carried all the books without dropping them. <br><span class='text-green-400'>-15% Stress</span>", "Nice", "📚", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.stress += 10;
                    window.queueModal("TIMBER!", "The stack toppled over. Loudly. In the quiet library. <br><span class='text-red-400'>+10% Stress</span>", "Shhh!", "💥", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };