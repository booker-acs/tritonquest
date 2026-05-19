// --- INVENTORY & HOTBAR SYSTEM ---

window.inventorySelectedSlot = null;

window.syncInventoryLayout = function() {
    if (!state.inventoryLayout) {
        state.inventoryLayout = {
            hotbar: [null, null, null, null],
            backpack: Array(16).fill(null) // 16 backpack slots
        };
    }

    if (!state.inventoryLayout.hotbar) state.inventoryLayout.hotbar = [null, null, null, null];
    if (!state.inventoryLayout.backpack) state.inventoryLayout.backpack = Array(16).fill(null);

    let placedItems = [...state.inventoryLayout.hotbar, ...state.inventoryLayout.backpack].filter(i => i !== null);

    if (state.purchasedItems && Array.isArray(state.purchasedItems)) {
        // Items that shouldn't appear in the backpack (vehicles, subscriptions, etc.)
        const ignoredItems = ['car', 'bicycle', 'skateboard', 'ebike', 'eyemobile'];
        
        state.purchasedItems.forEach(item => {
            if (ignoredItems.includes(item)) return;

            if (!placedItems.includes(item)) {
                let placed = false;
                // Try hotbar first
                for (let i = 0; i < state.inventoryLayout.hotbar.length; i++) {
                    if (state.inventoryLayout.hotbar[i] === null) {
                        state.inventoryLayout.hotbar[i] = item;
                        placed = true;
                        break;
                    }
                }
                // Then backpack
                if (!placed) {
                    for (let i = 0; i < state.inventoryLayout.backpack.length; i++) {
                        if (state.inventoryLayout.backpack[i] === null) {
                            state.inventoryLayout.backpack[i] = item;
                            placed = true;
                            break;
                        }
                    }
                }
            }
        });
    }

    // Remove lost/sold items
    for (let i = 0; i < state.inventoryLayout.hotbar.length; i++) {
        if (state.inventoryLayout.hotbar[i] !== null && !state.purchasedItems.includes(state.inventoryLayout.hotbar[i])) {
            state.inventoryLayout.hotbar[i] = null;
        }
    }
    for (let i = 0; i < state.inventoryLayout.backpack.length; i++) {
        if (state.inventoryLayout.backpack[i] !== null && !state.purchasedItems.includes(state.inventoryLayout.backpack[i])) {
            state.inventoryLayout.backpack[i] = null;
        }
    }
};

window.openInventoryModal = function() {
    window.syncInventoryLayout();
    window.inventorySelectedSlot = null;
    
    const wrapperHtml = `<div id="inventory-modal-inner" class="select-none">${window.getInventoryModalHTML()}</div>`;
    
    window.queueModal("Backpack", wrapperHtml, "Done", "🎒", () => {
        window.inventorySelectedSlot = null;
        if (typeof window.updateUI === 'function') window.updateUI(); // Refresh main screen to show hotbar changes
    });
};

window.getInventoryModalHTML = function() {
    let html = `
        <div class="text-center mb-2">
            <p class="text-xs text-slate-400">Click an item to select it, then click an empty slot or another item to swap.</p>
        </div>
        
        <!-- Hotbar Section -->
        <div class="mb-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
            <h3 class="text-[10px] font-bold text-acs-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>Active Hotbar</span>
                <div class="h-px bg-slate-700 flex-1"></div>
            </h3>
            <div class="flex justify-center gap-3">
            <button class="w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 rounded-xl transition-all duration-200 relative border-slate-600 bg-slate-800" disabled>
                <img src="images/items/phone.webp" class="w-8 h-8 object-contain drop-shadow-md">
            </button>
    `;

    for (let i = 0; i < 4; i++) {
        html += window.renderInventorySlot('hotbar', i);
    }

    html += `
            </div>
        </div>
        
        <!-- Backpack Section -->
        <div class="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/50">
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>Backpack Storage</span>
                <div class="h-px bg-slate-700 flex-1"></div>
            </h3>
            <div class="grid grid-cols-4 gap-3">
    `;

    for (let i = 0; i < state.inventoryLayout.backpack.length; i++) {
        html += window.renderInventorySlot('backpack', i);
    }

    html += `
            </div>
        </div>
    `;

    return html;
};

window.renderInventorySlot = function(type, index) {
    const item = state.inventoryLayout[type][index];
    const isSelected = window.inventorySelectedSlot && window.inventorySelectedSlot.type === type && window.inventorySelectedSlot.index === index;
    
    let borderClass = isSelected ? "border-acs-gold shadow-[0_0_10px_rgba(255,215,0,0.5)] scale-105 z-10" : "border-slate-600 hover:border-slate-400";
    let bgClass = isSelected ? "bg-slate-700" : (item ? "bg-slate-800" : "bg-slate-800/30");
    let dashClass = !item && !isSelected ? "border-dashed opacity-50" : "border-solid";
    
    let innerHtml = '';
    if (item) {
        innerHtml = `<img src="images/items/${item}.webp" class="w-8 h-8 object-contain drop-shadow-md" onerror="this.style.display='none';">`;
    }

    return `
        <button onclick="window.handleInventorySlotClick('${type}', ${index})" class="w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 rounded-xl transition-all duration-200 relative ${borderClass} ${bgClass} ${dashClass}">
            ${innerHtml}
        </button>
    `;
};

window.handleInventorySlotClick = function(type, index) {
    if (!window.inventorySelectedSlot) {
        if (state.inventoryLayout[type][index] !== null) {
            window.inventorySelectedSlot = { type, index };
        }
    } else if (window.inventorySelectedSlot.type === type && window.inventorySelectedSlot.index === index) {
        window.inventorySelectedSlot = null; // Deselect
    } else {
        const srcType = window.inventorySelectedSlot.type;
        const srcIdx = window.inventorySelectedSlot.index;
        
        // Swap
        const temp = state.inventoryLayout[srcType][srcIdx];
        state.inventoryLayout[srcType][srcIdx] = state.inventoryLayout[type][index];
        state.inventoryLayout[type][index] = temp;
        
        window.inventorySelectedSlot = null;
    }

    const modalInner = document.getElementById('inventory-modal-inner');
    if (modalInner) {
        modalInner.innerHTML = window.getInventoryModalHTML();
    }
};