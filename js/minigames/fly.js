window.flyData = { hits: 0, maxHits: 3, interval: null, timer: 0 };

        window.startFlySwatterGame = function() {
            window.flyData = { hits: 0, maxHits: 3, interval: null, timer: 0 };

            const html = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🗞️</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Annoyance</h2>
                    <p class="text-slate-300 mb-6 text-sm">Swat the fly 3 times before it bites you!</p>
                    
                    <!-- Added cursor-none and onmousemove -->
                    <div id="fly-zone" class="bg-white rounded-xl border-4 border-slate-300 h-[300px] relative overflow-hidden cursor-none shadow-inner" onmousemove="window.moveSwatter(event)">
                        
                        <!-- The Fly -->
                        <div id="the-fly" onmousedown="window.hitFly()" class="absolute text-4xl transition-all duration-300 ease-in-out cursor-none select-none z-10" style="top: 50%; left: 50%;">🪰</div>
                        
                        <!-- The Custom Cursor (Newspaper) -->
                        <!-- pointer-events-none ensures clicks pass through to the fly -->
                        <div id="swatter-cursor" class="absolute text-6xl pointer-events-none transition-none z-20 origin-bottom-right" style="left: -100px; top: -100px;">🗞️</div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const fly = document.getElementById('the-fly');
                    
                    // Move fly randomly
                    window.flyData.interval = setInterval(() => {
                        if (!fly) return;
                        window.flyData.timer++;
                        
                        // Fail condition: Time out (~10 seconds)
                        if (window.flyData.timer > 20) { 
                            window.finishFlyGame(false);
                            return;
                        }

                        const top = Math.random() * 85;
                        const left = Math.random() * 85;
                        const rot = Math.random() * 360;
                        
                        fly.style.top = top + '%';
                        fly.style.left = left + '%';
                        fly.style.transform = `rotate(${rot}deg)`;
                    }, 500); 
                }
            });
            window.processModalQueue();
        };

        window.moveSwatter = function(e) {
            const swatter = document.getElementById('swatter-cursor');
            const zone = document.getElementById('fly-zone');
            
            if (swatter && zone) {
                const rect = zone.getBoundingClientRect();
                // Calculate position relative to the container
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Offset slightly so the "hit" part of the newspaper is under the cursor
                swatter.style.left = (x - 20) + 'px'; 
                swatter.style.top = (y - 40) + 'px';
            }
        };

        window.hitFly = function() {
            window.flyData.hits++;
            const fly = document.getElementById('the-fly');
            const swatter = document.getElementById('swatter-cursor');
            
            // Visual hit feedback on Fly
            if(fly) {
                fly.innerText = "💥";
                setTimeout(() => { if(fly) fly.innerText = "🪰"; }, 200);
            }

            // Visual animation on Swatter
            if(swatter) {
                swatter.style.transform = "rotate(-45deg) scale(0.9)";
                setTimeout(() => { if(swatter) swatter.style.transform = "rotate(0deg) scale(1)"; }, 100);
            }

            if (window.flyData.hits >= 3) {
                window.finishFlyGame(true);
            }
        };

        window.finishFlyGame = function(success) {
            clearInterval(window.flyData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 5);
                    window.queueModal("GOTCHA", "You swatted the pest. Peace is restored. <br><span class='text-green-400'>-5% Stress</span>", "Phew", "💀", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.stress += 5;
                    state.energy = Math.max(0, state.energy - 5);
                    window.queueModal("OUCH", "It bit you! Now you have an itchy welt on your arm. <br><span class='text-red-400'>+5% Stress</span>", "Itchy", "🦟", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };