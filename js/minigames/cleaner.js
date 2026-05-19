window.cleanerData = { cleaned: 0, total: 40 };

        window.startCleanerGame = function() {
            window.cleanerData = { cleaned: 0, total: 40 };

            // Generate Smudges
            let smudges = "";
            for(let i=0; i<40; i++) {
                const top = Math.random() * 90;
                const left = Math.random() * 90;
                smudges += `<div class="smudge absolute w-8 h-8 bg-slate-500/50 rounded-full blur-sm" style="top:${top}%; left:${left}%;" onmouseover="window.wipeSmudge(this)"></div>`;
            }

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📱</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Greasy Screen</h2>
                    <p class="text-slate-300 mb-6 text-sm">Wipe the fingerprints off!</p>
                    
                    <div id="screen-area" class="bg-black border-4 border-slate-700 h-[300px] w-[200px] mx-auto rounded-xl relative overflow-hidden cursor-crosshair">
                        <!-- Clean BG -->
                        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-900"></div>
                        <!-- Smudges Overlay -->
                        <div id="smudge-layer" class="absolute inset-0">
                            ${smudges}
                        </div>
                    </div>
                </div>
            `;

            state.pendingModals.push({ rawHtml: html, onOpen: ()=>{} });
            window.processModalQueue();
        };

        window.wipeSmudge = function(el) {
            if (el.style.opacity === '0') return;
            el.style.opacity = '0'; // Visual remove
            el.style.pointerEvents = 'none'; // Prevent double count
            window.cleanerData.cleaned++;

            if (window.cleanerData.cleaned >= 35) { // 90% roughly
                 document.getElementById('modal-overlay').classList.add('hidden');
                 setTimeout(() => {
                    state.stress = Math.max(0, state.stress - 5);
                    window.queueModal("CRYSTAL CLEAR", "So shiny. So satisfying. <br><span class='text-green-400'>-5% Stress</span>", "Nice", "✨", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }, 200);
            }
        };