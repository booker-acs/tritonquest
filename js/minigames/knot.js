window.knotData = { progress: 0, isDragging: false };

        window.startWireKnotGame = function() {
            window.knotData = { progress: 0, isDragging: false };

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none" onmouseup="window.knotData.isDragging=false" onmouseleave="window.knotData.isDragging=false">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🎧</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Wire Knot</h2>
                    <p class="text-slate-300 mb-6 text-sm">Drag the knot to the end to untangle!</p>
                    
                    <div class="relative h-20 bg-slate-800 rounded-full border-4 border-slate-600 mb-8 mx-4 flex items-center px-2">
                        <!-- Wire Line -->
                        <div class="absolute left-4 right-4 h-1 bg-white opacity-20"></div>
                        
                        <!-- The Knot (Draggable) -->
                        <div id="wire-knot" class="absolute w-12 h-12 bg-white rounded-full text-2xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg hover:scale-110 transition-transform" 
                             style="left: 0%;"
                             onmousedown="window.knotData.isDragging=true">
                            ➰
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const container = document.querySelector('.relative.h-20');
                    const knot = document.getElementById('wire-knot');
                    
                    container.addEventListener('mousemove', (e) => {
                        if (!window.knotData.isDragging) return;
                        
                        const rect = container.getBoundingClientRect();
                        let x = e.clientX - rect.left - 24; // Center offset
                        let pct = (x / (rect.width - 48)) * 100;
                        
                        // Constraint: Can only move forward, not back (simulate untangling friction)
                        // Or just standard slider logic? Let's do standard slider but with friction feeling.
                        
                        pct = Math.max(0, Math.min(100, pct));
                        
                        // Update visual
                        knot.style.left = pct + '%';
                        window.knotData.progress = pct;
                        
                        if (pct >= 95) {
                            window.finishWireGame();
                        }
                    });
                }
            });
            window.processModalQueue();
        };

        window.finishWireGame = function() {
            window.knotData.isDragging = false;
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                state.stress = Math.max(0, state.stress - 5);
                window.queueModal("UNTANGLED", "Satisfying. Now you can listen to music. <br><span class='text-green-400'>-5% Stress</span>", "Nice", "🎶", () => window.finalizeDay(), null, false, "DAILY EVENT");
            }, 100);
        };