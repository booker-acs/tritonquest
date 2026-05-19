window.bubbleData = { popped: 0, total: 20 };

        window.startBubbleWrapGame = function() {
            window.bubbleData = { popped: 0, total: 20 };

            let gridHtml = '';
            for(let i=0; i<20; i++) {
                // Added data-state="fresh" to track status reliably
                gridHtml += `
                    <div id="bubble-${i}" data-state="fresh" onclick="window.popBubble(${i})" class="aspect-square cursor-pointer hover:scale-105 transition-transform select-none relative p-1">
                        <img id="img-${i}" src="images/minigames/bubble_unpopped.webp" class="w-full h-full object-contain pointer-events-none">
                    </div>
                `;
            }

            const html = `
                <div class="max-w-md mx-auto py-2 text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📦</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Package Arrived</h2>
                    <p class="text-slate-300 mb-6 text-sm">Pop all the bubbles! It's mandatory.</p>
                    
                    <div class="bg-slate-800 p-4 rounded-xl border-4 border-slate-600">
                        <div class="grid grid-cols-5 gap-3">
                            ${gridHtml}
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {}
            });
            window.processModalQueue();
        };

        window.popBubble = function(id) {
            const el = document.getElementById(`bubble-${id}`);
            const img = document.getElementById(`img-${id}`);
            
            // 1. Robust Check: Use data attribute instead of filename
            if (el.dataset.state === 'popped') return;
            
            // Mark as popped immediately
            el.dataset.state = 'popped';

            // 2. Play Sound
            const sfx = new Audio('audio/pop.ogg');
            sfx.volume = 0.5;
            sfx.play().catch(()=>{});

            // 3. Swap Image
            img.src = "images/minigames/bubble_popped.webp";
            
            // 4. Visual Pop Animation
            el.style.transform = "scale(0.9)";
            setTimeout(() => el.style.transform = "scale(1)", 100);
            
            // Disable interaction visuals
            el.classList.remove('cursor-pointer', 'hover:scale-105');
            el.classList.add('cursor-default', 'opacity-80');

            // 5. Update Logic
            window.bubbleData.popped++;

            if (window.bubbleData.popped >= window.bubbleData.total) {
                setTimeout(() => {
                    document.getElementById('modal-overlay').classList.add('hidden');
                    state.stress = Math.max(0, state.stress - 10);
                    window.queueModal("SATISFYING", "That was better than what was actually in the package. <br><span class='text-green-400'>-10% Stress</span>", "Nice", "😌", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }, 500); // Slight delay to let the last sound play
            }
        };