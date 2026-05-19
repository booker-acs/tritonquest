// --- HOLIDAY SPINNER LOGIC ---
        window.startHolidaySpinner = function(holiday) {
            const data = holiday.spinData;
            // The check that failed before. Now that you updated window.HOLIDAYS, this will pass.
            if (!data) {
                console.error("Missing spin data for holiday:", holiday.name);
                return; 
            }

            // CSS Gradient string for the 4 quadrants
            const gradient = `conic-gradient(
                ${data[0].color} 0deg 90deg, 
                ${data[1].color} 90deg 180deg, 
                ${data[2].color} 180deg 270deg, 
                ${data[3].color} 270deg 360deg
            )`;

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none text-center">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">SPECIAL DAY EVENT</h1>
                    <div class="text-6xl mb-2">${holiday.icon}</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-6">${holiday.name}</h2>
                    
                    <!-- SPINNER -->
                    <div class="relative w-64 h-64 mx-auto mb-8">
                        <!-- Wheel -->
                        <div id="holiday-wheel" class="w-full h-full rounded-full border-4 border-slate-700 shadow-xl transition-transform duration-[3s] ease-out"
                             style="background: ${gradient}; transform: rotate(0deg);">
                             
                             <div class="absolute top-[15%] right-[15%] text-xs font-black text-white drop-shadow-md rotate-45">${data[0].label}</div>
                             <div class="absolute bottom-[15%] right-[15%] text-xs font-black text-white drop-shadow-md rotate-[135deg]">${data[1].label}</div>
                             <div class="absolute bottom-[15%] left-[15%] text-xs font-black text-white drop-shadow-md rotate-[225deg]">${data[2].label}</div>
                             <div class="absolute top-[15%] left-[15%] text-xs font-black text-white drop-shadow-md rotate-[315deg]">${data[3].label}</div>
                        </div>

                        <!-- Pointer (Pointing UP) -->
                        <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg">⬇️</div>
                        
                        <!-- Center Cap -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-600"></div>
                    </div>

                    <button onclick="window.spinHolidayWheel()" id="btn-spin" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xl shadow-xl hover:bg-indigo-500 transition-all">SPIN!</button>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    window.currentSpinData = data;
                }
            });
            window.processModalQueue();
        };

        window.spinHolidayWheel = function() {
            const wheel = document.getElementById('holiday-wheel');
            const btn = document.getElementById('btn-spin');
            
            if (!wheel) return;
            
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');

            const randomDeg = Math.floor(Math.random() * 360);
            const totalSpin = 1440 + randomDeg; // 4 spins + random

            wheel.style.transform = `rotate(-${totalSpin}deg)`;

            setTimeout(() => {
                const finalAngle = totalSpin % 360;
                let index = 0;

                // 0-90: Q1 (Index 0), 90-180: Q2 (Index 1), etc.
                if (finalAngle < 90) index = 0;
                else if (finalAngle < 180) index = 1;
                else if (finalAngle < 270) index = 2;
                else index = 3;

                const result = window.currentSpinData[index];
                window.resolveHolidaySpin(result);

            }, 3100);
        };

        window.resolveHolidaySpin = function(result) {
            document.getElementById('modal-overlay').classList.add('hidden');
            
            if (result.effect.cash) state.balance += result.effect.cash;
            if (result.effect.stress) state.stress = Math.max(0, Math.min(100, state.stress + result.effect.stress));
            if (result.effect.energy) state.energy = Math.max(0, Math.min(100, state.energy + result.effect.energy));
            if (result.effect.grades) state.grades = Math.max(0, Math.min(100, state.grades + result.effect.grades));
            if (result.effect.hungerSet !== undefined) state.hungerLevel = result.effect.hungerSet;

            let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">`;
            if (result.effect.cash) html += `<div class="${result.effect.cash>0?'text-green-400':'text-red-400'} flex justify-between"><span>Money</span><span>${result.effect.cash>0?'+':''}$${result.effect.cash}</span></div>`;
            if (result.effect.stress) html += `<div class="${result.effect.stress<0?'text-green-400':'text-red-400'} flex justify-between"><span>Stress</span><span>${result.effect.stress>0?'+':''}${result.effect.stress}%</span></div>`;
            if (result.effect.energy) html += `<div class="${result.effect.energy>0?'text-green-400':'text-red-400'} flex justify-between"><span>Energy</span><span>${result.effect.energy>0?'+':''}${result.effect.energy}%</span></div>`;
            if (result.effect.grades) html += `<div class="${result.effect.grades>0?'text-green-400':'text-red-400'} flex justify-between"><span>GPA</span><span>${result.effect.grades>0?'+':''}${result.effect.grades}%</span></div>`;
            html += `</div>`;

            window.queueModal(result.label.toUpperCase(), result.msg + html, "Nice", "🎁", () => window.updateUI());
        };