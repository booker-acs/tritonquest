// --- DAILY EVENT: LOST BOOK (SORTING/SEARCH) ---
        window.bookData = { timer: 5.0, interval: null, dragItem: null };

        window.startBookEvent = function() {
            if (window.bookData.interval) clearInterval(window.bookData.interval);
            window.bookData.timer = 5.0;
            window.bookData.dragItem = null;

            const trashItems = ['📄', '🥤', '📦', '🗞️', '🥡'];
            const trashHTML = trashItems.map((icon) => {
                const top = 20 + Math.random() * 50;
                const left = 20 + Math.random() * 60;
                return `<div class="draggable-trash absolute text-5xl cursor-grab select-none z-10 hover:scale-110 transition-transform" style="top: ${top}%; left: ${left}%;" onmousedown="window.dragBookItem(event, this)">${icon}</div>`;
            }).join('');

            const gameHtml = `
                <div class="max-w-md mx-auto py-2">
                    <h1 class="text-3xl font-black text-acs-gold mb-4 uppercase tracking-widest leading-none">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📚</div>
                    <h2 class="text-2xl font-black uppercase italic text-white mb-2">Lost Book!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Dig through the trash to find it!</p>
                    
                    <div class="mb-2 text-right text-xs font-bold text-acs-gold px-1" id="book-timer">5.0s</div>

                    <div id="book-area" class="bg-slate-800 rounded-3xl h-64 relative overflow-hidden border-4 border-slate-700" onmousemove="window.moveBookItem(event)" onmouseup="window.dropBookItem()">
                        <div id="book-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold/80 z-30 pointer-events-none select-none">3</div>
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl cursor-pointer z-0 hover:scale-110 transition-transform" onclick="window.finishBookGame(true)">📘</div>
                        ${trashHTML}
                    </div>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    let count = 3;
                    const countEl = document.getElementById('book-countdown');
                    const startLoop = setInterval(() => {
                        count--;
                        if (count > 0) { if (countEl) countEl.innerText = count; } 
                        else {
                            clearInterval(startLoop);
                            if (countEl) countEl.style.display = 'none';
                            window.bookData.interval = setInterval(() => {
                                window.bookData.timer -= 0.1;
                                const timerEl = document.getElementById('book-timer');
                                if (timerEl) timerEl.innerText = Math.max(0, window.bookData.timer).toFixed(1) + 's';
                                if (window.bookData.timer <= 0) window.finishBookGame(false);
                            }, 100);
                        }
                    }, 500);
                }
            });
            window.processModalQueue();
        };

        window.renderBookGame = function() {
            const screen = document.getElementById('game-screen');
            // Random positions for trash
            const trashItems = ['📄', '🥤', '📦', '🗞️', '🥡'];
            const trashHTML = trashItems.map((icon, i) => {
                const top = 20 + Math.random() * 50;
                const left = 20 + Math.random() * 60;
                return `<div class="draggable-trash absolute text-5xl cursor-grab select-none z-10 hover:scale-110 transition-transform" 
                         style="top: ${top}%; left: ${left}%;" 
                         onmousedown="window.dragBookItem(event, this)">${icon}</div>`;
            }).join('');

            screen.innerHTML = `
                <div class="max-w-md mx-auto py-10 animate-pop text-white text-center">
                    <h1 class="text-5xl font-black text-acs-gold mb-8 uppercase tracking-widest">DAILY EVENT</h1>
                    <div class="text-6xl mb-4">📚</div>
                    <h2 class="text-3xl font-black uppercase italic text-white mb-2">Lost Book!</h2>
                    <p class="text-slate-300 mb-8 text-sm">Dig through your locker trash to find the blue textbook!</p>
                    
                    <div class="mb-2 text-right text-xs font-bold text-acs-gold px-1" id="book-timer">5.0s</div>

                    <div id="book-area" class="bg-slate-800 rounded-3xl h-64 relative overflow-hidden border-4 border-slate-700" onmousemove="window.moveBookItem(event)" onmouseup="window.dropBookItem()">
                        <!-- Countdown -->
                        <div id="book-countdown" class="absolute inset-0 flex items-center justify-center text-8xl font-black text-acs-gold/80 z-30 pointer-events-none select-none">3</div>
                        
                        <!-- The Target Book (Hidden at bottom) -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl cursor-pointer z-0 hover:scale-110 transition-transform" onclick="window.finishBookGame(true)">📘</div>
                        
                        <!-- Trash Overlay -->
                        ${trashHTML}
                    </div>
                </div>
            `;
        };

        window.dragBookItem = function(e, el) {
            window.bookData.dragItem = el;
            el.style.zIndex = 20; // Bring to front
            // Initial offset not calculated for simplicity in this mini-patch, snaps to center is fine for "trash tossing" feel
        };

        window.moveBookItem = function(e) {
            if (window.bookData.dragItem) {
                const area = document.getElementById('book-area');
                const rect = area.getBoundingClientRect();
                const x = e.clientX - rect.left - 20; // center offset
                const y = e.clientY - rect.top - 20;
                window.bookData.dragItem.style.left = x + 'px';
                window.bookData.dragItem.style.top = y + 'px';
            }
        };

        window.dropBookItem = function() {
            if(window.bookData.dragItem) window.bookData.dragItem.style.zIndex = 10;
            window.bookData.dragItem = null;
        };

        window.finishBookGame = function(success) {
            clearInterval(window.bookData.interval);
        document.getElementById('modal-overlay').classList.add('hidden'); // Force close
            let statHtml = `<div class="mt-4 border-t border-slate-600 pt-4 space-y-1 text-sm font-bold">`;

            if (success) {
                statHtml += `<div class="text-green-400 flex justify-between"><span>Found It</span><span>$0.00 Cost</span></div>`;
                statHtml += `</div>`;
                window.queueModal("FOUND IT!", "It was under the old pizza box. Close call." + statHtml, "Nice", "📘", () => window.finalizeDay());
            } else {
                state.balance -= 40; state.dayStats.cash -= 40;
                state.stress = Math.min(100, state.stress + 20); state.dayStats.stress += 20;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Replacement Fee</span><span>-$40.00</span></div>`;
                statHtml += `<div class="text-red-400 flex justify-between"><span>Panic</span><span>+20% Stress</span></div>`;
                statHtml += `</div>`;
                window.queueModal("LOST", "You couldn't find it. The librarian made you pay for a replacement." + statHtml, "Ugh", "💸", () => window.finalizeDay());
            }
        };