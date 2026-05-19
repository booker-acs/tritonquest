window.comboData = { code: "", input: "", state: 'memorize' };

        window.startLockerComboGame = function() {
            // Generate random 3-digit code
            const code = Math.floor(100 + Math.random() * 900).toString();
            window.comboData = { code: code, input: "", state: 'memorize' };

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">🔢</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">Mental Math?</h2>
                    <p id="combo-instruction" class="text-slate-300 mb-6 text-sm">Memorize the code!</p>
                    
                    <!-- Display Screen -->
                    <div class="bg-black border-4 border-slate-600 rounded-xl p-4 w-48 mx-auto mb-6 h-20 flex items-center justify-center shadow-inner">
                        <div id="combo-display" class="font-mono text-4xl text-green-500 font-bold tracking-widest">${code}</div>
                    </div>

                    <!-- Keypad (Hidden initially) -->
                    <div id="combo-keypad" class="grid grid-cols-3 gap-2 w-48 mx-auto opacity-50 pointer-events-none transition-opacity">
                        ${[1,2,3,4,5,6,7,8,9].map(n => `<button onclick="window.typeCombo(${n})" class="bg-slate-800 p-3 rounded-lg text-white font-bold border border-slate-600 hover:bg-slate-700 active:scale-95 shadow-sm">${n}</button>`).join('')}
                        <button onclick="window.clearCombo()" class="bg-red-900/50 text-red-200 p-3 rounded-lg font-bold border border-red-800 hover:bg-red-800">C</button>
                        <button onclick="window.typeCombo(0)" class="bg-slate-800 p-3 rounded-lg text-white font-bold border border-slate-600 hover:bg-slate-700 active:scale-95 shadow-sm">0</button>
                        <button onclick="window.submitCombo()" class="bg-green-900/50 text-green-200 p-3 rounded-lg font-bold border border-green-800 hover:bg-green-800">⏎</button>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    // Hide code after 2 seconds
                    setTimeout(() => {
                        const display = document.getElementById('combo-display');
                        const keypad = document.getElementById('combo-keypad');
                        const instr = document.getElementById('combo-instruction');
                        
                        if(display) {
                            window.comboData.state = 'input';
                            display.innerText = "_ _ _";
                            display.classList.replace('text-green-500', 'text-slate-500');
                            keypad.classList.remove('opacity-50', 'pointer-events-none');
                            instr.innerText = "Enter the code.";
                        }
                    }, 2000);
                }
            });
            window.processModalQueue();
        };

        window.typeCombo = function(num) {
            const d = window.comboData;
            if (d.state !== 'input' || d.input.length >= 3) return;
            
            d.input += num;
            document.getElementById('combo-display').innerText = d.input.padEnd(3, ' _');
        };

        window.clearCombo = function() {
            if (window.comboData.state !== 'input') return;
            window.comboData.input = "";
            document.getElementById('combo-display').innerText = "_ _ _";
        };

        window.submitCombo = function() {
            const d = window.comboData;
            if (d.input.length !== 3) return;

            document.getElementById('modal-overlay').classList.add('hidden');
            
            setTimeout(() => {
                if (d.input === d.code) {
                    state.grades = Math.min(100, state.grades + 2);
                    window.queueModal("ACCESS GRANTED", "Sharp memory. You opened the locker. <br><span class='text-green-400'>+2% GPA</span>", "Nice", "🔓", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.stress = Math.min(100, state.stress + 10);
                    window.queueModal("ACCESS DENIED", `The code was ${d.code}. You forgot. <br><span class='text-red-400'>+10% Stress</span>`, "Ugh", "🔒", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };