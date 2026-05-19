window.usbData = { correctSide: 0, currentSide: 0, attempts: 0, timer: 4.0, interval: null };

        window.startUSBGame = function() {
            window.usbData = { 
                correctSide: Math.random() < 0.5 ? 0 : 1, // 0=Up, 1=Down
                currentSide: 0, 
                attempts: 0,
                timer: 4.0,
                interval: null
            };

            const html = `
                <div class="max-w-md mx-auto py-2 text-center select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">💾</div>
                    <h2 class="text-2xl font-black uppercase text-white mb-2">USB Struggle</h2>
                    <p class="text-slate-300 mb-6 text-sm">Plug it in before class starts!</p>
                    
                    <div class="text-right text-red-400 font-mono font-bold mb-2" id="usb-timer">4.0s</div>
                    
                    <div class="relative bg-slate-800 h-32 rounded-xl flex items-center justify-center border-4 border-slate-600 mb-6 px-8">
                        <!-- Port -->
                        <div class="w-6 h-12 bg-black border-2 border-slate-500 rounded-sm mr-4 shadow-inner"></div>
                        
                        <!-- USB Image -->
                        <img id="usb-stick" src="images/minigames/usb.webp" class="w-32 h-16 object-contain transition-transform duration-200" style="transform: rotate(0deg);">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <button onclick="window.flipUSB()" class="bg-blue-600 text-white py-3 rounded-xl font-black uppercase shadow-lg hover:bg-blue-500 transition-all">FLIP</button>
                        <button onclick="window.insertUSB()" class="bg-green-600 text-white py-3 rounded-xl font-black uppercase shadow-lg hover:bg-green-500 transition-all">INSERT</button>
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: html,
                onOpen: () => {
                    const timerEl = document.getElementById('usb-timer');
                    window.usbData.interval = setInterval(() => {
                        window.usbData.timer -= 0.1;
                        if(timerEl) timerEl.innerText = Math.max(0, window.usbData.timer).toFixed(1) + 's';
                        if(window.usbData.timer <= 0) window.finishUSBGame(false);
                    }, 100);
                }
            });
            window.processModalQueue();
        };

        window.flipUSB = function() {
            window.usbData.currentSide = window.usbData.currentSide === 0 ? 1 : 0;
            const stick = document.getElementById('usb-stick');
            // Visual flip (180 degrees)
            if(stick) stick.style.transform = window.usbData.currentSide === 1 ? "rotate(180deg)" : "rotate(0deg)";
        };

        window.insertUSB = function() {
            if (window.usbData.currentSide === window.usbData.correctSide) {
                // Success Animation
                const stick = document.getElementById('usb-stick');
                if(stick) {
                    stick.style.transition = "margin-left 0.2s";
                    stick.style.marginLeft = "-40px"; // Move into port
                }
                setTimeout(() => window.finishUSBGame(true), 200);
            } else {
                // Wrong side!
                const stick = document.getElementById('usb-stick');
                // Apply red filter to indicate jam
                stick.style.filter = "sepia(1) saturate(5) hue-rotate(-50deg)";
                stick.style.transform += " translateX(5px)"; // Jiggle
                
                setTimeout(() => {
                    stick.style.filter = "none";
                    stick.style.transform = stick.style.transform.replace(" translateX(5px)", "");
                }, 200);
                
                window.usbData.timer -= 1.0; // Penalty
            }
        };

        window.finishUSBGame = function(success) {
            clearInterval(window.usbData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');
            
            setTimeout(() => {
                if (success) {
                    state.stress = Math.max(0, state.stress - 5);
                    window.queueModal("CONNECTED", "First try! (Okay, maybe second try). <br><span class='text-green-400'>-5% Stress</span>", "Nice", "✅", () => window.finalizeDay(), null, false, "DAILY EVENT");
                } else {
                    state.stress += 10;
                    window.queueModal("FAILED", "You couldn't get it in. The presentation started without you. <br><span class='text-red-400'>+10% Stress</span>", "Ugh", "🔌", () => window.finalizeDay(), null, false, "DAILY EVENT");
                }
            }, 100);
        };