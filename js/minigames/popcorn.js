// --- POPCORN CATCH MINIGAME ---
        window.popcornData = { 
            score: 0, 
            bucketX: 50, 
            items: [], 
            gameActive: false, 
            interval: null, 
            frame: 0,
            progress: 0 
        };

        window.startPopcornGame = function() {
            if (state.balance < 15) {
                 window.queueModal("No Funds", "Movie tickets cost $15.", "Okay", "💸");
                 return;
            }

            document.getElementById('modal-overlay').classList.add('hidden');
            
            window.popcornData = { score: 0, bucketX: 50, items: [], gameActive: true, interval: null, frame: 0, progress: 20 };

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">FREE TIME</h1>
                    <div class="text-6xl mb-4">🍿</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Popcorn Catch</h2>
                    <p class="text-slate-300 mb-6 text-sm">Catch the kernels, butter, and salt! Avoid the rest!</p>
                    
                    <div class="w-full h-4 bg-slate-800 rounded-full mb-2 overflow-hidden border border-slate-600">
                        <div id="pop-progress" class="h-full bg-yellow-400 transition-all duration-100" style="width: 20%"></div>
                    </div>

                    <!-- Game Area -->
                    <div id="popcorn-area" class="rounded-3xl h-64 relative overflow-hidden border-4 border-slate-700 cursor-none shadow-2xl" 
                         onmousemove="window.movePopcornBucket(event)"
                         style="background: linear-gradient(to bottom, #0f172a 0%, #000000 100%);">
                        
                        <!-- Screen Glow -->
                        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-40 bg-indigo-500/10 blur-3xl pointer-events-none"></div>

                        <!-- Seat Rows (Bottom 1/3) -->
                        <div class="absolute bottom-0 w-full h-24 pointer-events-none overflow-hidden">
                            <!-- Back Row -->
                            <div class="absolute bottom-16 left-0 w-full flex justify-center gap-1 opacity-40 scale-90">
                                ${Array(10).fill('<div class="w-8 h-10 bg-red-900 rounded-t-lg border-t border-red-800"></div>').join('')}
                            </div>
                            <!-- Middle Row -->
                            <div class="absolute bottom-8 left-0 w-full flex justify-center gap-1 opacity-60 scale-95">
                                ${Array(10).fill('<div class="w-9 h-12 bg-red-800 rounded-t-lg border-t border-red-700"></div>').join('')}
                            </div>
                            <!-- Front Row -->
                            <div class="absolute bottom-0 left-0 w-full flex justify-center gap-1 opacity-80">
                                ${Array(10).fill('<div class="w-10 h-14 bg-red-700 rounded-t-lg border-t border-red-600"></div>').join('')}
                            </div>
                        </div>

                        <!-- Bucket (Image) -->
                        <img id="pop-bucket" src="images/minigames/popcorn/bucket1.webp" class="absolute bottom-2 w-16 h-16 object-contain -translate-x-1/2 transition-all duration-75 pointer-events-none z-20" style="left: 50%;">
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.popcornData.interval = setInterval(window.updatePopcornGame, 20); 
                }
            });
            window.processModalQueue();
        };

        window.movePopcornBucket = function(e) {
            if (!window.popcornData.gameActive) return;
            const area = document.getElementById('popcorn-area');
            if (!area) return;
            
            const rect = area.getBoundingClientRect();
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            
            // Clamp to keep image inside (approx 10% padding for width of bucket)
            x = Math.max(10, Math.min(90, x)); 
            window.popcornData.bucketX = x;
            
            const bucket = document.getElementById('pop-bucket');
            if(bucket) bucket.style.left = x + '%';
        };

        window.updatePopcornGame = function() {
            const d = window.popcornData;
            d.frame++;
            const area = document.getElementById('popcorn-area');

            // 1. Spawn Items
            if (d.frame % 25 === 0) { 
                const isBad = Math.random() < 0.3; 
                const item = document.createElement('div');
                
                if (isBad) {
                    const badOptions = ["🪳", "🫟", "🍅", "💩", "🦷"];
                    item.innerText = badOptions[Math.floor(Math.random() * badOptions.length)];
                    item.className = "absolute text-2xl transition-none";
                } else {
                    // 20% chance for Kernel Image, 80% for Emojis
                    if (Math.random() < 0.2) {
                        item.innerHTML = `<img src="images/minigames/popcorn/kernel.webp" class="w-6 h-6 object-contain">`;
                        item.className = "absolute w-6 h-6 transition-none";
                    } else {
                        const goodOptions = ["🧈", "🧂"];
                        item.innerText = goodOptions[Math.floor(Math.random() * goodOptions.length)];
                        item.className = "absolute text-2xl transition-none";
                    }
                }
                
                item.style.top = "-30px";
                item.style.left = (Math.random() * 90 + 5) + "%";
                item.dataset.type = isBad ? "bad" : "good";
                item.dataset.y = -10;
                area.appendChild(item);
                d.items.push(item);
            }

            // 2. Move & Check Collision
            for (let i = 0; i < d.items.length; i++) {
                let item = d.items[i];
                let y = parseFloat(item.dataset.y);
                y += 1.5; 
                item.dataset.y = y;
                item.style.top = y + "%";

                let itemX = parseFloat(item.style.left);
                
                if (y > 80 && y < 95 && Math.abs(itemX - d.bucketX) < 10) {
                    if (item.dataset.type === 'good') {
                        d.progress += 10;
                    } else {
                        d.progress -= 20;
                        const flash = document.createElement('div');
                        flash.className = "absolute inset-0 bg-red-500/20 pointer-events-none";
                        area.appendChild(flash);
                        setTimeout(() => flash.remove(), 100);
                    }
                    item.remove();
                    d.items.splice(i, 1);
                    i--;
                }
                else if (y > 100) {
                    item.remove();
                    d.items.splice(i, 1);
                    i--;
                }
            }

            // 3. Update Progress
            d.progress = Math.max(0, Math.min(100, d.progress));
            const bar = document.getElementById('pop-progress');
            if (bar) bar.style.width = d.progress + '%';

            // --- IMPROVED BUCKET SWAP LOGIC (5 Stages) ---
            const bucketImg = document.getElementById('pop-bucket');
            if (bucketImg) {
                let imgNum = 1;
                
                if (d.progress >= 80) imgNum = 5;
                else if (d.progress >= 60) imgNum = 4;
                else if (d.progress >= 40) imgNum = 3;
                else if (d.progress >= 20) imgNum = 2;
                else imgNum = 1;

                const targetSrc = `images/minigames/popcorn/bucket${imgNum}.webp`;
                
                // Only update if changed to prevent flicker/reload
                if (!bucketImg.src.includes(targetSrc)) {
                    bucketImg.src = targetSrc;
                }
            }

            // 4. Win/Loss Check
            if (d.progress >= 100) {
                window.finishPopcornGame(true);
            } else if (d.progress <= 0) {
                window.finishPopcornGame(false, "You spilled everything!");
            }
        };

        window.finishPopcornGame = function(success, msg) {
            window.popcornData.gameActive = false;
            clearInterval(window.popcornData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            // Delay to prevent accidental clicks
            setTimeout(() => {
                if (success) {
                    state.balance -= 15; state.dayStats.cash -= 15;
                    state.energy = Math.max(0, state.energy - 15); state.dayStats.energy -= 15;
                    state.stress = Math.max(0, state.stress - 40); state.dayStats.stress -= 40;
                    state.hasRelaxedToday = true;

                    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                        <div class="text-red-400 flex justify-between"><span>Ticket Cost</span><span>-$15.00</span></div>
                        <div class="text-red-400 flex justify-between"><span>Energy</span><span>-15%</span></div>
                        <div class="text-green-400 flex justify-between"><span>Satisfaction</span><span>-40% Stress</span></div>
                    </div>`;
                    
                    window.queueModal("GREAT MOVIE!", "The popcorn was buttery and the movie was awesome." + html, "Nice", "🍿", () => window.updateUI());
                } else {
                    state.balance -= 15; state.dayStats.cash -= 15;
                    // Still lose money, but no stress relief
                    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                        <div class="text-red-400 flex justify-between"><span>Ticket Cost</span><span>-$15.00</span></div>
                        <div class="text-red-400 flex justify-between"><span>Messy</span><span>+5% Stress</span></div>
                    </div>`;
                    
                    window.queueModal("RUINED", (msg || "Bad vibes.") + "<br>You left early." + html, "Ugh", "🎬", () => window.updateUI());
                }
                
                // Add the safety lock logic here if desired (re-using the logic from Fishing)
                const btn = document.getElementById('modal-confirm-btn');
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50');
                    setTimeout(() => { btn.disabled = false; btn.classList.remove('opacity-50'); }, 1000);
                }

            }, 100);
        };