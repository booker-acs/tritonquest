window.renderMinigameList = function() {
            const screen = document.getElementById('game-screen');
            
            // Define Categories
            const categories = [
                {
                    title: "Item & Leisure Games",
                    games: [
                        { name: "Paddle Ball", func: "startPaddleGame" },
                        { name: "Super Paddleball", func: "startSuperPaddleGame" },
                        { name: "Pixel Jump", func: "startGameMarathon" },
                        { name: "Desktop Defender", func: "startDefenderGame" },
                        { name: "Triton Kart 64", func: "startAeroKart" },
                        { name: "Fishing", func: "startFishingGame" },
                        { name: "Popcorn Catch", func: "startPopcornGame" },                        
                        { name: "Scenic Drive", func: "startDrivingGame" },
                        { name: "VR Headset", func: "useVRHeadset" }
                    ]
                },
                 {
                    title: "Gym Games",
                    games: [
                        { name: "Bench Press", func: "startBenchPressGame" },
                        { name: "Treadmill", func: "startTreadmillGame" },
                        { name: "Rowing", func: "startRowingGame" },
                        { name: "Jumprope", func: "startJumpRopeGame" },
                        { name: "Leg Press", func: "startLegPressGame" },
                        
                    ]
                },
                {
                    title: "Pet Care Games",
                    games: [
                        { name: "Fish Tank Menu", func: "openFishTank" },
                        { name: "Cat Base Menu", func: "openCatMenu" },
                        { name: "Dog Base Menu", func: "openDogMenu" },
                        { name: "Cat: Feed", func: "startCatFeedGame" },
                        { name: "Cat: Litter", func: "startCatCleanGame" },
                        { name: "Cat: Laser", func: "startCatPlayGame" },
                        { name: "Dog: Feed", func: "startDogFeedGame" },
                        { name: "Dog: Walk", func: "startDogWalkGame" },
                        { name: "Dog: Fetch", func: "startDogPlayGame" }
                    ]
                },
                {
                    title: "Job Games (Retail, Food, Daycare)",
                    games: [
                        { name: "Restock Rush", func: "startJobGame_restock_rush" },
                        { name: "Spill Cleanup", func: "startJobGame_spill_cleanup" },
                        { name: "Barcode Scanner", func: "startJobGame_barcode_scanner" },
                        { name: "Karen Defense", func: "startJobGame_karen_defense" },
                        { name: "Burger Stacker", func: "startJobGame_burger_stacker" },
                        { name: "Latte Art", func: "startJobGame_coffee_pour" },
                        { name: "Dish Duty", func: "startJobGame_dish_duty" },
                        { name: "Fry Station", func: "startJobGame_fry_fryer" },
                        { name: "Naptime Ninja", func: "startJobGame_naptime_ninja" },
                        { name: "Toy Sort", func: "startJobGame_toy_sort" },
                        { name: "Tantrum Tamer", func: "startJobGame_tantrum_tamer" },
                        { name: "Tag Tracker", func: "startJobGame_tag_tracker" }
                    ]
                },
                {
                    title: "Job Games (Tech, Animal, Labor)",
                    games: [
                        { name: "Bug Smasher", func: "startJobGame_bug_smasher" },
                        { name: "Wire Connect", func: "startJobGame_wire_connect" },
                        { name: "Reboot Sequence", func: "startJobGame_reboot_sequence" },
                        { name: "Password Cracker", func: "startJobGame_password_cracker" },
                        { name: "Kibble Catch", func: "startJobGame_kibble_catch" },
                        { name: "Pet Petter", func: "startJobGame_pet_petter" },
                        { name: "Fish Netter", func: "startJobGame_fish_netter" },
                        { name: "Grooming Shears", func: "startJobGame_grooming_shears" },
                        { name: "Heavy Lifting", func: "startJobGame_heavy_lifting" },
                        { name: "Pipe Connect", func: "startJobGame_pipe_connect" },
                        { name: "Brick Layer", func: "startJobGame_brick_layer" },
                        { name: "Lawn Mower", func: "startJobGame_lawn_mower" }
                    ]
                },
                {
                    title: "School Minigames",
                    games: [
                        { name: "Pop Quiz Panic", func: "startSchoolGame_pop_quiz_panic" },
                        { name: "Sneaky Snacker", func: "startSchoolGame_sneaky_snacker" },
                        { name: "Paper Toss", func: "startSchoolGame_paper_toss" },
                        { name: "Keep Awake", func: "startSchoolGame_keep_awake" },
                        { name: "Pass the Note", func: "startSchoolGame_pass_the_note" },
                        { name: "Chem Lab Mix", func: "startSchoolGame_chem_lab_mix" },
                        { name: "Hallway Dodger", func: "startSchoolGame_hallway_dodger" },
                        { name: "Doodle Master", func: "startSchoolGame_doodle_master" },
                        { name: "Locker Jam", func: "startSchoolGame_locker_jam" },
                        { name: "Desk Drummer", func: "startSchoolGame_desk_drummer" }
                    ]
                },
                {
                    title: "Club Tryouts",
                    games: [
                        { name: "Band (Rhythm)", func: "startRhythmGame", args: ['tryout', 'band'] },
                        { name: "Theatre (Spotlight)", func: "startTheatreGame", args: ['tryout'] },
                        { name: "Soccer (Kick)", func: "startSoccerGame", args: ['tryout'] },
                        { name: "Basketball (Hoop)", func: "startBasketballGame", args: ['tryout'] }
                    ]
                },
                {
                    title: "Daily Events",
                    games: [
                        { name: "Seagull Attack", func: "startSeagullEvent" },
                        { name: "Popup Blocker", func: "startPopupGame" },                     
                        { name: "Vending Machine", func: "startVendingMachineEvent" },
                        { name: "Locker Jam", func: "startLockerJamEvent" },
                        { name: "Rainstorm", func: "startRainEvent" },
                        { name: "Phone Drop", func: "startPhoneEvent" },
                        { name: "Lab Coat", func: "startLabEvent" },
                        { name: "Field Trip", func: "startTripEvent" },
                        { name: "Burger Rush", func: "startBurgerEvent" },
                        { name: "Perfect Pump", func: "startGasGame" },
                        { name: "Microwave", func: "startMicrowaveGame" },
                        { name: "The Nod", func: "startNodGame" },
                        { name: "USB Struggle", func: "startUSBGame" },
                        { name: "Claw Machine", func: "startClawGame" },
                        { name: "Fly Swatter", func: "startFlySwatterGame" },
                        { name: "Bubble Wrap", func: "startBubbleWrapGame" },
                        { name: "Book Tower", func: "startBookTowerGame" },
                        { name: "Cable Chaos", func: "startCableGame" },
                        { name: "Text Ninja", func: "startTextNinjaGame" },
                        { name: "Screen Cleaner", func: "startCleanerGame" },
                        { name: "Wire Knot", func: "startWireKnotGame" },
                        { name: "Zipper", func: "startZipperGame" },
                        { name: "Wifi Signal", func: "startWifiGame" },
                        { name: "Coffee Pour", func: "startCoffeeGame" },
                        { name: "Lost Book", func: "startBookEvent" },
                        { name: "Locker Combo II", func: "startLockerComboGame" },
                        { name: "Holiday Spinner", func: "startHolidaySpinner", args: [window.HOLIDAYS['Fall'][1]] },
                        { name: "Roundmeal", func: "startRoundmealEvent" },
                        { name: "Guitar", func: "startGuitarEvent" },
                        { name: "Mascot Duty", func: "startMascotEvent" }
                    ]
                },
                {
                    title: "Career & Social",
                    games: [
                        { name: "Salary Negotiation", func: "startNegotiationGame", args: ['debug'] },
                        { name: "Typing Exam", func: "startTypingGame" },
                        { name: "Social: The Dap", func: "startDapGame", args: ['debug'] },
                        { name: "Social: Yap Sesh", func: "startYapGame", args: ['debug'] },
                        { name: "Social: Handshake", func: "startHandshakeGame", args: ['debug'] },
                        { name: "Social: Aux Cord", func: "startAuxGame", args: ['debug'] },
                        { name: "Social: Photo Booth", func: "startPhotoGame", args: ['debug'] },
                        { name: "Resume Logic", func: "startApply", args: ['bullseye'] }, 
                        { name: "Interview Logic", func: "enterInterview", args: ['bullseye'] },
                        { name: "School Quiz", func: "triggerSchoolQuiz" }
                    ]
                }
            ];

                    let listHtml = '';

                    // Loop through categories to build sections
                    categories.forEach(cat => {
                        const buttons = cat.games.map(g => {
                            let onclickStr = "";
                            if (g.args) {
                                if (typeof g.args[0] === 'object') {
                                    onclickStr = `window.${g.func}(window.HOLIDAYS['Fall'][1])`;
                                } else {
                                    const args = g.args.map(a => `'${a}'`).join(',');
                                    onclickStr = `window.${g.func}(${args})`;
                                }
                            } else {
                                onclickStr = `window.${g.func}()`;
                            }

                            return `
                            <button onclick="${onclickStr}" 
                                class="p-3 bg-slate-800 border border-slate-600 rounded-xl hover:bg-acs-gold hover:text-acs-navy transition-all text-[10px] font-bold uppercase shadow-sm truncate">
                                ${g.name}
                            </button>
                            `;
                        }).join('');

                        listHtml += `
                            <div class="mb-6">
                                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest text-left border-b border-slate-700 pb-1 mb-3">${cat.title}</h3>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    ${buttons}
                                </div>
                            </div>
                        `;
                    });

                    screen.innerHTML = `
                        <div class="h-full flex flex-col text-center animate-pop">
                            <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest">DEBUG MENU</h1>
                            <p class="text-slate-400 mb-4 text-sm">Select a Minigame to Test</p>
                            
                            <div class="overflow-y-auto pr-2 custom-scroll flex-grow pb-4 text-left">
                                ${listHtml}
                            </div>
                            
                            <button onclick="location.reload()" class="mt-4 py-3 bg-red-900 text-red-200 rounded-xl font-black uppercase text-xs hover:bg-red-700 flex-shrink-0">Exit Debug (Reload)</button>
                        </div>
                    `;
        };