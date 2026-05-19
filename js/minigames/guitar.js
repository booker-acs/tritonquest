window.startGuitarEvent = function() {
            state.hasGuitar = true;
            state.guitarDurability = 3;
            

            // --- FIX: Add to inventory array so it renders ---
            if (!state.purchasedItems.includes('guitar')) {
                state.purchasedItems.push('guitar');
            }
            if (typeof window.syncInventoryLayout === 'function') window.syncInventoryLayout();
                    
            // Dynamic Art Lookup
            const artKey = 'guitar_icon';
            const iconContent = (window.GAME_ART && window.GAME_ART[artKey])
                ? window.GAME_ART[artKey]
                : "🎸"; 

            let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                <div class="text-amber-400 flex justify-between"><span>Item Acquired</span><span>Mason's Guitar</span></div>
                <div class="text-slate-400 flex justify-between"><span>Durability</span><span>3 Uses</span></div>
            </div>`;
            
            window.queueModal("*SHREDDING NOISES*", "You won a signed 2026 series Mason Shepard guitar at an ACS auction. The inscription reads: 'I don't know why you want me to sign this, but ok.'", "Awesome", iconContent, () => window.finalizeDay(), null, false, "DAILY EVENT");
        };

        window.useGuitar = function() {
            // 1. Consume Durability & Reduce Stress immediately
            state.guitarDurability--;
            state.stress = Math.max(0, state.stress - 40);
            state.dayStats.stress -= 40;
            state.log.unshift("Played Mason's Guitar. Stress melted away.");

            // Dynamic Art Lookup
            const artKey = 'guitar_icon';
            const iconContent = (window.GAME_ART && window.GAME_ART[artKey])
                ? window.GAME_ART[artKey]
                : "🎸";

            // 2. Check for Breakage
            if (state.guitarDurability <= 0) {
                state.hasGuitar = false;
                // --- FIX: Remove from inventory array when broken ---
                state.purchasedItems = state.purchasedItems.filter(i => i !== 'guitar');
                if (typeof window.syncInventoryLayout === 'function') window.syncInventoryLayout();
                        window.queueModal(
                    "SNAP!", 
                    "You shredded too hard and the neck snapped! You broke Mason's guitar! (Luckily, he has another one).", 
                    "Oops", 
                    "💥", 
                    () => window.updateUI()
                );
            } else {
                let flavorText = "";
                if (state.guitarDurability === 2) {
                    flavorText = "You just nailed the solo from Leviathan's 2025 smash hit song 'Naughty List'.";
                } else if (state.guitarDurability === 1) {
                    flavorText = "You made up your own song. It goes like this.\nJudjudwoooojudjudjudjudjudwooooooojunjun";
                }

                let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                    <div class="text-green-400 flex justify-between"><span>Stress</span><span>-40%</span></div>
                    <div class="text-slate-500 flex justify-between"><span>Durability</span><span>${state.guitarDurability} left</span></div>
                </div>`;
                
                window.queueModal(
                    "ROCK ON", 
                    flavorText + html, 
                    "Nice", 
                    iconContent, 
                    () => window.updateUI()
                );
            }
        };