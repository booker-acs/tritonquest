window.startRoundmealEvent = function() {
            const iconHtml = window.GAME_ART.roundmeal || "🍱";
            window.queueModal("ROUNDMEAL", "The cafeteria is serving this protein-blasted delight.\nIt serves 3 men.", "CALL THE BOYS!",iconHtml, (eat) => {
            
                let html = "";
                if (eat) {
                    // 1. Immediate Effect
                    state.hungerLevel = 2; 
                    state.roundmealActive = true; // Show badge now
                    state.roundmealQueued = true; // Ensure it stays for tomorrow
                    
                    state.energy = Math.max(0, state.energy - 10);
                    state.dayStats.energy -= 10;
                    
                    html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                        <div class="text-acs-gold flex justify-between"><span>Status</span><span>BLASTED</span></div>
                        <div class="text-red-400 flex justify-between"><span>Heavy Meal</span><span>-10% Energy</span></div>
                    </div>`;
                    window.queueModal("BLASTED", "You feel the protein surge. Muscle Boys ASSEMBLE!" + html, "Ugh", "💪", () => window.finalizeDay());
                } else {
                    state.hungerLevel = 0; 
                    state.stress = Math.min(100, state.stress + 5);
                    state.dayStats.stress += 5;
                    
                    html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                        <div class="text-red-400 flex justify-between"><span>Starving</span><span>Hungry Status</span></div>
                        <div class="text-red-400 flex justify-between"><span>Hangry</span><span>+5% Stress</span></div>
                    </div>`;
                    window.queueModal("SKIPPED", "You walk away. Davis told you it's a frozen product." + html, "Safe", "🚫", () => window.finalizeDay());
                }
            }, "I don't buy from Henton's", false, "DAILY EVENT");
        };