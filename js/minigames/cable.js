window.cableData = { 
            active: false, 
            cables: [], 
            draggingId: null, 
            mouseX: 0, mouseY: 0,
            connected: 0 
        };

        window.startCableGame = function() {
            window.cableData = { active: true, cables: [], draggingId: null, mouseX:0, mouseY:0, connected:0 };
            
            const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']; // Red, Blue, Green, Yellow
            // Scramble right side order
            const rightOrder = [0,1,2,3].sort(() => 0.5 - Math.random());

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🔌</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Cable Chaos</h2>
                    <p class="text-slate-300 mb-6 text-sm">Drag the plugs to the matching color ports!</p>
                    
                    <div class="relative bg-slate-900 rounded-xl border-4 border-slate-700 h-64 w-64 mx-auto overflow-hidden shadow-2xl cursor-crosshair">
                        <canvas id="cable-canvas" width="256" height="256" class="absolute inset-0 z-10"></canvas>
                        
                        <!-- Left Ports (Start) -->
                        <div class="absolute left-2 top-4 bottom-4 flex flex-col justify-around z-0">
                            ${colors.map((c, i) => `<div class="w-8 h-8 rounded-full border-2 border-white shadow-md" style="background:${c}" id="start-${i}"></div>`).join('')}
                        </div>

                        <!-- Right Ports (Targets) -->
                        <div class="absolute right-2 top-4 bottom-4 flex flex-col justify-around z-0">
                            ${rightOrder.map((cIdx, i) => `<div class="w-8 h-8 rounded-full border-4 border-slate-500 shadow-inner target-port" style="background:${colors[cIdx]}" data-color="${cIdx}" id="end-${i}"></div>`).join('')}
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const canvas = document.getElementById('cable-canvas');
                    const ctx = canvas.getContext('2d');
                    const rect = canvas.getBoundingClientRect();

                    // Init Cables
                    // We map y-coordinates based on the visual layout (roughly evenly spaced)
                    const spacing = 256 / 5; // 4 items, 5 spaces roughly
                    
                    window.cableData.cables = colors.map((c, i) => ({
                        id: i,
                        color: c,
                        startX: 20,
                        startY: 40 + (i * 55), // Manual spacing calc based on UI
                        endX: 20, 
                        endY: 40 + (i * 55),
                        isLocked: false
                    }));

                    // Handlers
                    const getMousePos = (e) => {
                        return { 
                            x: (e.clientX - rect.left) * (256 / rect.width), 
                            y: (e.clientY - rect.top) * (256 / rect.height) 
                        };
                    };

                    canvas.addEventListener('mousedown', (e) => {
                        const m = getMousePos(e);
                        // Check click near start points
                        window.cableData.cables.forEach(c => {
                            if (!c.isLocked && Math.abs(m.x - c.startX) < 30 && Math.abs(m.y - c.startY) < 30) {
                                window.cableData.draggingId = c.id;
                            }
                        });
                    });

                    canvas.addEventListener('mousemove', (e) => {
                        const m = getMousePos(e);
                        window.cableData.mouseX = m.x;
                        window.cableData.mouseY = m.y;
                    });

                    canvas.addEventListener('mouseup', (e) => {
                        if (window.cableData.draggingId === null) return;
                        
                        const c = window.cableData.cables[window.cableData.draggingId];
                        const m = getMousePos(e);
                        let matched = false;

                        // Check collision with right ports
                        // Iterate UI elements to find positions
                        const targets = document.querySelectorAll('.target-port');
                        targets.forEach(t => {
                            const tRect = t.getBoundingClientRect();
                            // Convert target screen pos to canvas pos
                            const tx = (tRect.left - rect.left + tRect.width/2) * (256 / rect.width);
                            const ty = (tRect.top - rect.top + tRect.height/2) * (256 / rect.height);
                            const tColor = parseInt(t.dataset.color);

                            // Collision + Color Match
                            if (Math.abs(m.x - tx) < 30 && Math.abs(m.y - ty) < 30 && c.id === tColor) {
                                c.endX = tx;
                                c.endY = ty;
                                c.isLocked = true;
                                matched = true;
                                window.cableData.connected++;
                            }
                        });

                        if (!matched) {
                            c.endX = c.startX;
                            c.endY = c.startY;
                        }

                        window.cableData.draggingId = null;

                        if (window.cableData.connected >= 4) {
                            window.finishCableGame(true);
                        }
                    });

                    // Loop
                    const loop = () => {
                        if (!window.cableData.active) return;
                        requestAnimationFrame(loop);
                        
                        ctx.clearRect(0,0,256,256);
                        
                        // Draw Cables
                        window.cableData.cables.forEach(c => {
                            ctx.beginPath();
                            ctx.lineWidth = 6;
                            ctx.lineCap = 'round';
                            ctx.strokeStyle = c.color;
                            ctx.moveTo(c.startX, c.startY);
                            
                            if (c.id === window.cableData.draggingId) {
                                // Dragging
                                ctx.lineTo(window.cableData.mouseX, window.cableData.mouseY);
                            } else {
                                // Static (Locked or Reset)
                                ctx.lineTo(c.endX, c.endY);
                            }
                            ctx.stroke();
                        });
                    };
                    loop();
                }
            });
            window.processModalQueue();
        };

        window.finishCableGame = function(success) {
            window.cableData.active = false;
            document.getElementById('modal-overlay').classList.add('hidden');
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 10);
                    window.queueModal("WIRED IN", "Everything is connected perfectly. <br><span class='text-green-400'>-10% Stress</span>", "Nice", "🔌", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };