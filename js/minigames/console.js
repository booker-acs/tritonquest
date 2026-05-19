// --- GAME STATION X DATABASE ---
window.CONSOLE_GAMES = [
    { 
        id: 'superpaddle', 
        name: 'Super Paddleball', 
        price: 0, 
        icon: 'images/minigames/console/paddlecart.webp', 
        desc: 'Just like your regular paddleball, but virtual!', 
        action: 'window.startSuperPaddleGame()' 
    },
    { 
        id: 'pixeljump', 
        name: 'Pixel Jump', 
        price: 39.99, 
        icon: 'images/minigames/console/pixelcart.webp', 
        desc: `Buy your own copy! Stop borrowing your friends'!`, 
        action: 'window.startGameMarathon()' 
    },
    { 
        id: 'defender', 
        name: 'Desktop Defender', 
        price: 49.99,
        icon: 'images/minigames/console/defendercart.webp', 
        desc: 'Vertical scrolling arcade shooter!', 
        action: 'window.startDefenderGame()' 
    },    
    { 
        id: 'kart', 
        name: 'Triton Kart 64', 
        price: 59.99, 
        icon: 'images/minigames/console/tritonkartcart.webp', 
        desc: 'High speed 64-bit racing action!', 
        action: 'window.startAeroKart()' 
    }
];

window.currentConsoleIndex = 0;
window.consoleMenuAudio = null;

// --- LEISURE HUB ROUTER ---


// --- GAME STATION X INTERFACE ---

window.launchConsoleGame = function(id) {
    document.getElementById('modal-overlay').classList.add('hidden');
    state.consoleUsesToday++;
    
    // Stop all audio before launching the game
    if (window.stopAllAudio) {
        window.stopAllAudio();
    }
    
    const game = window.CONSOLE_GAMES.find(g => g.id === id);
    if (game) {
        setTimeout(() => eval(game.action), 100);
    }
};

window.renderGameConsole = function() {
    const game = window.CONSOLE_GAMES[window.currentConsoleIndex];
    
    // Check if it's free, OR if the player has bought it
    if (!state.purchasedItems) state.purchasedItems = [];
    const isUnlocked = game.price === 0 || state.purchasedItems.includes(game.id);
    
    // 1. Pause ALL other audio sources
    if(window.stopAllAudio) window.stopAllAudio();

    // 2. Start Console Menu Music
    if (!window.consoleMenuAudio) {
        window.consoleMenuAudio = new Audio('audio/loops/xmenu.ogg');
        window.consoleMenuAudio.loop = true;
        window.consoleMenuAudio.volume = 0.5;
    }
    if (window.consoleMenuAudio.paused) {
        window.consoleMenuAudio.play().catch(e => console.warn("Menu Audio blocked:", e));
    }
    
    let screenHtml = "";
    let actionBtn = "";

    if (isUnlocked) {
        screenHtml = `
            <img src="${game.icon}" class="w-32 h-32 object-contain drop-shadow-xl mb-2 animate-pulse hover:scale-105 transition-transform" alt="${game.name}">
            <div class="font-black text-xl text-white uppercase tracking-widest">${game.name}</div>
            <div class="text-xs text-green-400 font-bold mt-1">READY TO PLAY</div>
        `;
        actionBtn = `<button onclick="window.launchConsoleGame('${game.id}')" class="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-black text-white uppercase shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all">PLAY NOW</button>`;
    } else {
        screenHtml = `
            <img src="${game.icon}" class="w-32 h-32 object-contain drop-shadow-xl mb-2 grayscale opacity-40" alt="${game.name}">
            <div class="font-black text-xl text-slate-400 uppercase tracking-widest">${game.name}</div>
            <div class="text-xs text-red-400 font-bold mt-1">LOCKED</div>
        `;
        actionBtn = `<button onclick="window.buyConsoleGame('${game.id}', ${game.price})" class="w-full py-3 bg-acs-gold hover:bg-yellow-400 rounded-xl font-black text-acs-navy uppercase shadow-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all">BUY FOR $${game.price}</button>`;
    }

    const html = `
        <div class="bg-slate-800 p-4 rounded-3xl border-8 border-slate-700 shadow-2xl relative select-none">
            <!-- Screen styling with scanlines -->
            <div class="bg-slate-900 rounded-2xl border-4 border-slate-950 p-6 flex flex-col items-center justify-center h-56 text-center shadow-inner relative overflow-hidden">
                <div class="absolute inset-0 pointer-events-none opacity-10" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px);"></div>
                ${screenHtml}
            </div>
            
            <div class="text-[10px] text-slate-400 text-center mt-3 h-8 px-4 italic leading-tight">
                "${game.desc}"
            </div>

            <!-- Controls -->
            <div class="flex justify-between items-center mt-4">
                <button onclick="window.switchConsoleGame(-1)" class="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl hover:bg-slate-600 active:bg-slate-500 shadow-md text-slate-300 transition-all">◀</button>
                
                <div class="flex-1 px-4">
                    ${actionBtn}
                </div>

                <button onclick="window.switchConsoleGame(1)" class="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl hover:bg-slate-600 active:bg-slate-500 shadow-md text-slate-300 transition-all">▶</button>
            </div>
        </div>
        <div class="text-center text-[9px] text-slate-500 mt-4 uppercase tracking-widest font-bold">Use arrows to browse games</div>
    `;

    // The "Power Off" button executes a callback to cleanly stop the menu audio
    window.queueModal("GAME STATION X", html, "Power Off", "📺", () => {
        if (window.consoleMenuAudio) {
            window.consoleMenuAudio.pause();
            window.consoleMenuAudio.currentTime = 0;
        }
        if (window.manageBackgroundAudio) window.manageBackgroundAudio();
    }, null, false, "CONSOLE");
};

window.switchConsoleGame = function(dir) {
    window.currentConsoleIndex += dir;
    
    // Loop around if they hit the ends of the array
    if (window.currentConsoleIndex < 0) window.currentConsoleIndex = window.CONSOLE_GAMES.length - 1;
    if (window.currentConsoleIndex >= window.CONSOLE_GAMES.length) window.currentConsoleIndex = 0;
    
    // Close current modal and immediately pop open the next one
    document.getElementById('modal-overlay').classList.add('hidden');
    state.pendingModals = []; 
    setTimeout(() => {
        window.renderGameConsole();
    }, 50);
};

window.buyConsoleGame = function(id, price) {
    if (state.balance < price) {
        document.getElementById('modal-overlay').classList.add('hidden');
        window.queueModal("Insufficient Funds", "You don't have enough money to buy this game cartridge.", "Bummer", "💸", () => window.renderGameConsole());
        return;
    }
    
    state.balance -= price;
    state.dayStats.cash -= price;
    state.purchasedItems.push(id);
    if (typeof window.syncInventoryLayout === 'function') window.syncInventoryLayout();
    
    document.getElementById('modal-overlay').classList.add('hidden');
    state.pendingModals = [];
    setTimeout(() => {
        window.queueModal("PURCHASE SUCCESSFUL", "Game cartridge acquired! Inserted into Game Station X.", "Play Now", "💾", () => window.renderGameConsole());
    }, 50);
};