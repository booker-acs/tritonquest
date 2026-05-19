// --- VR HEADSET MINIGAME ---

// Global state for the VR viewport
window.vrData = { 
    panX: 0, 
    isDragging: false, 
    lastMouseX: 0, 
    currentScene: null 
};

window.useVRHeadset = function() {
    let vrLimit = 1;
    if (window.hasActiveFriend('matheus') && (state.matheusHangouts || 0) >= 3) {
        vrLimit = 2;
    }

    if (state.vrUsage >= vrLimit) {
        window.queueModal("Battery Low", "The headset needs to charge. You've hit your daily session limit.", "Okay", "🪫");
        return;
    }
    
    if (state.energy < 5) {
        window.queueModal("Too Tired", "You are too dizzy to use VR right now.", "Okay", "💫");
        return;
    }

    // --- SCENE DEFINITIONS ---
    // We use a 3-Layer Parallax system. 
    // To use images later, just replace the inner HTML with: <img src="images/vr/your_image.webp" class="w-full h-full object-cover">
    const scenes = [
        { 
            name: "Synthwave Sunset", 
            bgClass: "bg-slate-900",
            // Layer 1: Sky & Sun (Moves Slowest)
            layer1: `
                <div class="absolute inset-0" style="background: linear-gradient(to bottom, #2e0249 0%, #0f172a 100%);"></div>
                <div class="absolute w-40 h-40 rounded-full" style="top: 10%; left: 40%; background: linear-gradient(to bottom, #ec4899 0%, #eab308 100%); box-shadow: 0 0 40px #ec4899;"></div>
                <!-- Stars -->
                <div class="absolute w-1 h-1 bg-white rounded-full opacity-50" style="top: 20%; left: 10%;"></div>
                <div class="absolute w-1 h-1 bg-white rounded-full opacity-80" style="top: 15%; left: 80%;"></div>
                <div class="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60" style="top: 30%; left: 60%;"></div>
            `,
            // Layer 2: Abstract Mountains (Moves Medium)
            layer2: `
                <div class="absolute bottom-12 w-0 h-0 border-l-[200px] border-l-transparent border-r-[200px] border-r-transparent border-b-[150px] border-b-purple-900 opacity-70" style="left: 10%;"></div>
                <div class="absolute bottom-12 w-0 h-0 border-l-[300px] border-l-transparent border-r-[300px] border-r-transparent border-b-[200px] border-b-indigo-950 opacity-90" style="left: 40%;"></div>
                <div class="absolute bottom-12 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[100px] border-b-purple-800 opacity-80" style="left: 80%;"></div>
            `,
            // Layer 3: Neon Grid Floor (Moves Fastest)
            layer3: `
                <div class="absolute bottom-0 w-full h-16 bg-purple-950 border-t border-pink-500 overflow-hidden shadow-[0_-5px_15px_rgba(236,72,153,0.5)]">
                    <div class="w-full h-px bg-pink-500/30 mt-2"></div>
                    <div class="w-full h-px bg-pink-500/50 mt-3"></div>
                    <div class="w-full h-px bg-pink-500/70 mt-4"></div>
                    <div class="w-full h-px bg-pink-500/90 mt-5"></div>
                </div>
            `
        },
        {
            name: "Deep Space Station",
            bgClass: "bg-black",
            layer1: `
                <div class="absolute inset-0 bg-black"></div>
                <!-- Giant Planet -->
                <div class="absolute w-64 h-64 rounded-full" style="top: -20%; left: 20%; background: radial-gradient(circle at 30% 30%, #3b82f6, #1e3a8a, #020617); box-shadow: inset -20px -20px 40px rgba(0,0,0,0.8);"></div>
                <div class="absolute w-2 h-2 bg-blue-200 rounded-full animate-pulse" style="top: 40%; left: 70%;"></div>
                <div class="absolute w-1 h-1 bg-white rounded-full opacity-50" style="top: 60%; left: 30%;"></div>
            `,
            layer2: `
                <!-- Distant Asteroids -->
                <div class="absolute w-12 h-10 bg-slate-800 rounded-full" style="top: 40%; left: 50%; transform: rotate(20deg);"></div>
                <div class="absolute w-8 h-6 bg-slate-700 rounded-full" style="top: 30%; left: 85%; transform: rotate(-15deg);"></div>
                <div class="absolute w-16 h-12 bg-slate-900 rounded-full" style="top: 50%; left: 15%; transform: rotate(45deg);"></div>
            `,
            layer3: `
                <!-- Foreground Station Silhouettes -->
                <div class="absolute bottom-0 w-32 h-20 bg-slate-950 border-t-2 border-r-2 border-slate-700" style="left: 5%;"></div>
                <div class="absolute bottom-0 w-16 h-32 bg-slate-950 border-t-2 border-l-2 border-r-2 border-slate-700" style="left: 60%;"></div>
                <div class="absolute bottom-20 w-8 h-8 bg-red-500/20 rounded-full animate-ping" style="left: 62%;"></div>
            `
        }
    ];

    const scene = scenes[Math.floor(Math.random() * scenes.length)];
    window.vrData = { panX: 0, isDragging: false, lastMouseX: 0, currentScene: scene };

    const vrHtml = `
        <div class="max-w-md mx-auto py-2 select-none">
            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">VIRTUAL REALITY</h1>
            <div class="text-6xl mb-2">🥽</div>
            <h2 class="text-xl font-black uppercase italic text-white mb-2">${scene.name}</h2>
            <p class="text-slate-300 mb-4 text-xs">Swipe or drag to look around.</p>
            
            <!-- Viewport -->
            <div id="vr-viewport" class="${scene.bgClass} rounded-3xl h-64 relative overflow-hidden border-4 border-slate-700 cursor-grab active:cursor-grabbing shadow-inner"
                 onmousedown="window.startVRDrag(event)"
                 onmousemove="window.dragVR(event)"
                 onmouseup="window.stopVRDrag()"
                 onmouseleave="window.stopVRDrag()"
                 ontouchstart="window.startVRDrag(event.touches[0])"
                 ontouchmove="window.dragVR(event.touches[0])"
                 ontouchend="window.stopVRDrag()">
                 
                 <!-- Layer 1: Background (Slowest Parallax, W: 1200px) -->
                 <div id="vr-layer-1" class="absolute top-0 left-0 h-full w-[1200px] pointer-events-none transition-transform duration-75 ease-out will-change-transform">
                    ${scene.layer1}
                 </div>
                 
                 <!-- Layer 2: Midground (Medium Parallax, W: 1600px) -->
                 <div id="vr-layer-2" class="absolute top-0 left-0 h-full w-[1600px] pointer-events-none transition-transform duration-75 ease-out will-change-transform">
                    ${scene.layer2}
                 </div>

                 <!-- Layer 3: Foreground (Fastest Parallax, W: 2000px) -->
                 <div id="vr-layer-3" class="absolute top-0 left-0 h-full w-[2000px] pointer-events-none transition-transform duration-75 ease-out will-change-transform">
                    ${scene.layer3}
                 </div>
                 
                 <!-- VR Vignette / Lens Overlay -->
                 <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_120%)]"></div>
                 
                 <!-- Crosshair -->
                 <div class="absolute top-1/2 left-1/2 w-2 h-2 border border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference"></div>
            </div>

            <button onclick="window.exitVR()" class="w-full mt-4 py-4 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-purple-500 transition-all text-sm">
                Disconnect
            </button>
        </div>
    `;

    state.pendingModals.push({
        rawHtml: vrHtml,
        onOpen: () => {}
    });
    window.processModalQueue();
};

window.startVRDrag = function(e) {
    window.vrData.isDragging = true;
    // e.clientX works for mouse, e.pageX works if passing touches[0] from mobile
    window.vrData.lastMouseX = e.clientX || e.pageX; 
};

window.dragVR = function(e) {
    if (!window.vrData.isDragging) return;
    
    const currentX = e.clientX || e.pageX;
    const delta = currentX - window.vrData.lastMouseX;
    
    window.vrData.panX += delta;
    window.vrData.lastMouseX = currentX;

    // Clamping: Max scroll right is based on the widest layer (2000px) minus the viewport width (~350px)
    if (window.vrData.panX > 0) window.vrData.panX = 0;
    if (window.vrData.panX < -1650) window.vrData.panX = -1650;

    // Apply Parallax scaling to layers
    const l1 = document.getElementById('vr-layer-1');
    const l2 = document.getElementById('vr-layer-2');
    const l3 = document.getElementById('vr-layer-3');
    
    // Multipliers determine depth speed
    if(l1) l1.style.transform = `translateX(${window.vrData.panX * 0.2}px)`; 
    if(l2) l2.style.transform = `translateX(${window.vrData.panX * 0.6}px)`; 
    if(l3) l3.style.transform = `translateX(${window.vrData.panX * 1.0}px)`; 
};

window.stopVRDrag = function() {
    window.vrData.isDragging = false;
};

window.exitVR = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
    
    // Apply Stats
    state.vrUsage++;
    state.energy = Math.max(0, state.energy - 5);
    state.dayStats.energy -= 5;
    state.stress = Math.max(0, state.stress - 30);
    state.dayStats.stress -= 30;
    
    state.hasRelaxedToday = true;

    let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
        <div class="text-red-400 flex justify-between"><span>Energy</span><span>-5%</span></div>
        <div class="text-green-400 flex justify-between"><span>Immersion</span><span>-30% Stress</span></div>
    </div>`;
    
    setTimeout(() => {
        window.queueModal("DISCONNECTED", "You return to the real world. It seems duller than before." + html, "Okay", "🔌", () => {
            if (typeof window.updateUI === 'function') window.updateUI();
        });
    }, 100);
};