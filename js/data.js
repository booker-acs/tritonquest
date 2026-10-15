// 1. DATA STRUCTURES (Scoped for Global Access)
        // ==========================================
        window.DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        window.SEASONS = ["Fall", "Winter", "Spring", "Summer"];
        window.MENU_MUSIC_PLAYLIST = [
            "audio/loops/loop1.ogg",
            "audio/loops/loop2.ogg",
            "audio/loops/loop3.ogg",
            "audio/loops/loop4.ogg" 
        ];
        window.RHYTHM_TRACKS = [
            "audio/band.ogg",
            "audio/grunge.ogg",
            "audio/punk.ogg",
            "audio/glam.ogg"
        ];
        // --- STYLE STUDIO DATA ---
        window.PREMIUM_HAIR = ['#39ff14', '#00ffff', '#d946ef']; // Neon Green, Cyan, Purple
        
        window.ACCESSORIES = [
            { id: 'none', name: 'None', cost: 0, icon: '🚫' },
            { id: 'glasses', name: 'Wire Specs', cost: 50, icon: '👓' },
            { id: 'beanie', name: 'Beanie', cost: 75, icon: '🧢' },
            { id: 'clown', name: 'Honk Honk', cost: 20, icon: '🤡' },
            { id: 'monocle', name: 'The Baron', cost: 150, icon: '🧐' }
        ];
        // UPDATED: Holidays with Audio Overrides
        window.HOLIDAYS = {
            "Fall": {
                1: { 
                    name: "First Day of School", icon: "🎒", desc: "Welcome back! The air is crisp, and the syllabus is terrifying. Good luck.", audioFile: "audio/loops/loop1.ogg",
                    spinData: [
                        { label: "Ready", color: "#4ade80", effect: { grades: 2, stress: -5 }, msg: "You actually did the summer reading. Teachers love you." },
                        { label: "Late", color: "#f87171", effect: { grades: -2, stress: 5 }, msg: "You slept through your alarm. Not a great start." },
                        { label: "Ready", color: "#4ade80", effect: { grades: 2, stress: -5 }, msg: "Fresh supplies, fresh start. You feel prepared." },
                        { label: "Late", color: "#f87171", effect: { grades: -2, stress: 5 }, msg: "You forgot your locker combo. Panic mode." }
                    ]
                },
                6: { 
                    name: "Laborious Day", icon: "🛠️", desc: "Work twice as hard today and enjoy it tomorrow!", audioFile: "audio/holidays/labor.ogg",
                    spinData: [
                        { label: "Work", color: "#facc15", effect: { cash: 30, energy: -20 }, msg: "You put in the extra hours and got paid." },
                        { label: "Rest", color: "#60a5fa", effect: { energy: 20, stress: -5 }, msg: "You decided to actually take the day off." },
                        { label: "Work", color: "#facc15", effect: { cash: 30, energy: -20 }, msg: "The grind never stops. Wallet is heavier, eyelids are heavier." },
                        { label: "Rest", color: "#60a5fa", effect: { energy: 20, stress: -5 }, msg: "Nap time. Best decision ever." }
                    ]
                },
                18: { 
                    name: "Friendsgiving", icon: "🍗", desc:"A time for friends, food, and 5 hour naps.", audioFile: "audio/holidays/friends.ogg", noSchool: true,
                    spinData: [
                        { label: "Feast", color: "#fb923c", effect: { hungerSet: 2, stress: -10 }, msg: "The food was incredible. You are stuffed." },
                        { label: "Drama", color: "#f87171", effect: { stress: 15 }, msg: "Someone brought up politics at the table. It got awkward." },
                        { label: "Feast", color: "#fb923c", effect: { hungerSet: 2, stress: -10 }, msg: "Leftovers for days. Hunger satisfied." },
                        { label: "Drama", color: "#f87171", effect: { stress: 15 }, msg: "Your friends are fighting over the last roll. Stressful." }
                    ]
                },
                26: { 
                    name: "Skel-o-ween", icon: "💀", desc:"Spoopy scary skellingtons! Wait, can we try that again?", audioFile: "audio/holidays/skelo.ogg",
                    spinData: [
                        { label: "Treat", color: "#fbbf24", effect: { energy: 10, stress: -5 }, msg: "Full sized candy bars! Sugar rush!" },
                        { label: "Trick", color: "#a855f7", effect: { stress: 5, energy: -5 }, msg: "Someone egged your shoes. Rude." },
                        { label: "Treat", color: "#fbbf24", effect: { energy: 10, stress: -5 }, msg: "You found a stash of chocolate. Life is good." },
                        { label: "Trick", color: "#a855f7", effect: { stress: 5, energy: -5 }, msg: "Jump scare! You spilled your drink." }
                    ]
                }
            },
            "Winter": {
                1: { 
                    name: "New Winter's Day", icon: "🪩", desc:"If we were using a normal calendar, it would be a new year!", audioFile: "audio/holidays/newwinter.ogg", noSchool: true,
                    spinData: [
                        { label: "New Me", color: "#2dd4bf", effect: { energy: 20 }, msg: "Resolution: Actually sleep. You feel energized." },
                        { label: "Old Me", color: "#94a3b8", effect: { stress: 5 }, msg: "You already broke your resolution. Oh well." },
                        { label: "New Me", color: "#2dd4bf", effect: { energy: 20 }, msg: "Fresh start. Clean slate." },
                        { label: "Old Me", color: "#94a3b8", effect: { stress: 5 }, msg: "Same habits, different season." }
                    ]
                },
                14: { 
                    name: "Midwinter's Day", icon:"🌬️", desc:"Halfway to Spring. You laugh in the face of Winter! *shivering*", audioFile: "audio/holidays/midwinter.ogg",
                    spinData: [
                        { label: "Cozy", color: "#fb923c", effect: { stress: -10 }, msg: "Hot cocoa by the fire. Perfect." },
                        { label: "Freeze", color: "#60a5fa", effect: { energy: -10 }, msg: "You forgot your gloves. Your fingers are icicles." },
                        { label: "Cozy", color: "#fb923c", effect: { stress: -10 }, msg: "Blanket burrito mode activated." },
                        { label: "Freeze", color: "#60a5fa", effect: { energy: -10 }, msg: "The heater broke. Shivering consumes calories." }
                    ]
                },
                28: { 
                    name: "Wintermas", icon: "❄️", desc:"A time for joy, hot cocoa, and freezing to death waiting for the bus.", audioFile: "audio/holidays/wintermas.ogg",
                    spinData: [
                        { label: "Nice", color: "#4ade80", effect: { cash: 25, stress: -10 }, msg: "You got exactly what you wanted! And cash!" },
                        { label: "Naughty", color: "#f87171", effect: { stress: 10 }, msg: "You got coal. Literally just a rock." },
                        { label: "Nice", color: "#4ade80", effect: { cash: 25, stress: -10 }, msg: "Gifts galore. You feel appreciated." },
                        { label: "Naughty", color: "#f87171", effect: { stress: 10 }, msg: "Santa skipped your house." }
                    ]
                }
            },
            "Spring": {
                5: { 
                    name: "Raccoon Day", icon: "🦝", desc:"If Westport Wally eats from the blue trash can, its 2 more weeks of Winter.", audioFile: "audio/holidays/raccoon.ogg",
                    spinData: [
                        { label: "Green", color: "#75f472", effect: { stress: 5 }, msg: "6 more weeks of winter. Ugh." },
                        { label: "Blue", color: "#72b6f4", effect: { stress: -5 }, msg: "Early spring! Pack away the coats." },
                        { label: "Green", color: "#75f472", effect: { stress: 5 }, msg: "The raccoon saw his shadow. Depression ensues." },
                        { label: "Blue", color: "#72b6f4", effect: { stress: -5 }, msg: "Sunlight is coming. Hope returns." }
                    ]
                },
                13: { 
                    name: "Love's Day", icon: "💖", desc:"Love is in the air. Or maybe that's just pollen. Either way, buy some chocolate.", audioFile: "audio/holidays/loveday.ogg",
                    spinData: [
                        { label: "Loves Me", color: "#f472b6", effect: { stress: -15 }, msg: "You got a valentine! It's from someone cute." },
                        { label: "Not", color: "#64748b", effect: { stress: 10 }, msg: "Empty mailbox. Just spam." },
                        { label: "Loves Me", color: "#f472b6", effect: { stress: -15 }, msg: "Discount candy and good vibes." },
                        { label: "Not", color: "#64748b", effect: { stress: 10 }, msg: "You spent the day third-wheeling a couple." }
                    ]
                },
                17: { 
                    name: "Spring Jubilee", icon: "🌱", desc:"The official end of Winter. Finally.", audioFile: "audio/holidays/jubiilee.ogg", noSchool: true,
                    spinData: [
                        { label: "Bloom", color: "#4ade80", effect: { stress: -10 }, msg: "Flowers are blooming. The world is colorful." },
                        { label: "Sneeze", color: "#fbbf24", effect: { energy: -5 }, msg: "Pollen everywhere. Your eyes are itchy." },
                        { label: "Bloom", color: "#4ade80", effect: { stress: -10 }, msg: "Picnic weather. Very relaxing." },
                        { label: "Sneeze", color: "#fbbf24", effect: { energy: -5 }, msg: "You sneezed 40 times in a row." }
                    ]
                },
                28: { 
                    name: "Fool's Day", icon: "🃏", desc:"Trust no one. Not even the vending machine. ESPECIALLY not the vending machine.", audioFile: "audio/holidays/foolday.ogg",
                    spinData: [
                        { label: "Fooled", color: "#f87171", effect: { cash: -5 }, msg: "You bought a fake winning lottery ticket." },
                        { label: "The Fool", color: "#a855f7", effect: { stress: -5 }, msg: "You pulled off a legendary prank." },
                        { label: "Fooled", color: "#f87171", effect: { cash: -5 }, msg: "Someone put tape on your mouse sensor." },
                        { label: "The Fool", color: "#a855f7", effect: { stress: -5 }, msg: "You replaced the salt with sugar. Classic." }
                    ]
                }
            },
            "Summer": {
                4: { 
                    name: "Last Day of School", icon: "🎓", desc:"Why do they even make you go?", audioFile: "audio/holidays/lastschool.ogg",
                    spinData: [
                        { label: "Freedom", color: "#facc15", effect: { stress: -20 }, msg: "School's out! Summer begins!" },
                        { label: "Boredom", color: "#94a3b8", effect: { energy: -5 }, msg: "The teacher made you watch a documentary." },
                        { label: "Freedom", color: "#facc15", effect: { stress: -20 }, msg: "Threw your papers in the trash." },
                        { label: "Boredom", color: "#94a3b8", effect: { energy: -5 }, msg: "You had to clean out your locker. Gross." }
                    ]
                },
                20: { 
                    name: "Grilldependence Day", icon: "🌭", desc:"Mark your nation's founding. Celebrate by grilling a firework!", audioFile: "audio/holidays/grillday.ogg",
                    spinData: [
                        { label: "Master", color: "#f87171", effect: { hungerSet: 2 }, msg: "Perfectly grilled hot dog. Delicious." },
                        { label: "Burnt", color: "#1a202c", effect: { stress: 5 }, msg: "You dropped your burger in the coals." },
                        { label: "Master", color: "#f87171", effect: { hungerSet: 2 }, msg: "You are the king of the grill." },
                        { label: "Burnt", color: "#1a202c", effect: { stress: 5 }, msg: "It rained on the BBQ." }
                    ]
                },
                28: { 
                    name: "End of Vacation", icon: "🏖️", desc:"You ever feel like...you've done this before?", audioFile: "audio/holidays/lastsummer.ogg",
                    spinData: [
                        { label: "Ready", color: "#4ade80", effect: { energy: 20 }, msg: "You feel rested and ready for next year." },
                        { label: "Dread", color: "#60a5fa", effect: { stress: 10 }, msg: "The Sunday Scaries, but for a whole season." },
                        { label: "Ready", color: "#4ade80", effect: { energy: 20 }, msg: "New supplies, new attitude." },
                        { label: "Dread", color: "#60a5fa", effect: { stress: 10 }, msg: "You didn't do your summer reading." }
                    ]
                }
            }
        };
        // --- INJECT EXAMS INTO SCHEDULE ---
        const EXAM_DATES = {
            12: { name: "Midterms", icon: "📝", desc: "Halfway point. High stakes testing." },
            26: { name: "Final Exams", icon: "🚨", desc: "The cumulative test. Do or die." }
        };

        Object.keys(window.HOLIDAYS).forEach(season => {
            if (season === 'Summer') return; // Skip injecting exams into Summer
            for (const [day, data] of Object.entries(EXAM_DATES)) {
                // Only add if a holiday doesn't already exist there
                if (!window.HOLIDAYS[season][day]) {
                    window.HOLIDAYS[season][day] = data;
                }
            }
        });


        // --- CAREER ACADEMIES ---
        window.ACADEMIES = {
            'health': { name: "Health & Medical", icon: "🩹", desc: "Biology, Anatomy, and First Aid." },
            'media': { name: "Media Arts", icon: "🎥", desc: "Design, Art History, and Technology." },
            'teaching': { name: "Teaching & Social Services", icon: "⚖️", desc: "Psychology, Pedagogy, and Law." },
            'business': { name: "Business", icon: "💼", desc: "Economics, Marketing, and Finance." },
            'stem': { name: "STEM", icon: "⚙️", desc: "Coding, Engineering Design, and Robotics." }
        };

        window.ACADEMY_QUESTIONS = {
            'health': [
                { q: "What connects muscle to bone?", choices: ["Ligament", "Tendon", "Cartilage"], correct: 1 },
                { q: "The 'femur' is located in the...", choices: ["Arm", "Thigh", "Spine"], correct: 1 },
                { q: "What is the body's largest organ?", choices: ["Liver", "Skin", "Brain"], correct: 1 },
                { q: "What does CPR stand for?", choices: ["Cardiopulmonary Resuscitation", "Chest Pressure Rhythm", "Cardiac Pulse Rate"], correct: 0 },
                { q: "Which blood type is the universal donor?", choices: ["AB+", "O Negative", "A Negative"], correct: 1 },
                { q: "Hypertension is another name for...", choices: ["High Blood Pressure", "Anxiety", "Low Blood Sugar"], correct: 0 },
                { q: "What carries oxygen to cells?", choices: ["White Blood Cells", "Platelets", "Red Blood Cells"], correct: 2 },
                { q: "The 'patella' is commonly known as the...", choices: ["Elbow", "Kneecap", "Shoulder Blade"], correct: 1 },
                { q: "Which system fights infection?", choices: ["Endocrine", "Lymphatic/Immune", "Digestive"], correct: 1 },
                { q: "What is the normal resting heart rate for adults?", choices: ["100-120 bpm", "60-100 bpm", "40-60 bpm"], correct: 1 }
            ],
            'media': [
                { q: "Which file format supports transparency?", choices: ["JPG", "PNG", "TXT"], correct: 1 },
                { q: "Primary colors of light (Screens) are:", choices: ["RGB", "CMYK", "RYB"], correct: 0 },
                { q: "The 'Golden Ratio' is approximately:", choices: ["1.618", "3.14", "2.5"], correct: 0 },
                { q: "In typography, 'Leading' refers to...", choices: ["Space between letters", "Space between lines", "Font size"], correct: 1 },
                { q: "CMYK stands for Cyan, Magenta, Yellow, and...", choices: ["Key (Black)", "Krypton", "Kale"], correct: 0 },
                { q: "Which software is vector-based?", choices: ["Photoshop", "Illustrator", "Premiere"], correct: 1 },
                { q: "The rule of thirds is used in...", choices: ["Composition", "Color Theory", "Coding"], correct: 0 },
                { q: "What is a 'serif'?", choices: ["A font style with feet", "A sans-serif font", "A type of brush"], correct: 0 },
                { q: "Which resolution is 1080p?", choices: ["1920x1080", "1280x720", "3840x2160"], correct: 0 },
                { q: "FPS stands for...", choices: ["Frames Per Second", "First Person Shooter", "Files Per System"], correct: 0 }
            ],
            'teaching': [
                { q: "Who developed the Hierarchy of Needs?", choices: ["Freud", "Maslow", "Pavlov"], correct: 1 },
                { q: "The study of society is called:", choices: ["Sociology", "Psychology", "Civics"], correct: 0 },
                { q: "IEP stands for:", choices: ["Individualized Education Program", "International Exam Protocol", "Internal Evaluation Plan"], correct: 0 },
                { q: "Scaffolding in education means...", choices: ["Building physical structures", "Supporting student learning steps", "Punishing bad behavior"], correct: 1 },
                { q: "Bloom's Taxonomy classifies...", choices: ["Learning objectives", "Plant species", "Classroom layouts"], correct: 0 },
                { q: "What is a 'mandated reporter'?", choices: ["A journalist", "A teacher required to report abuse", "A principal"], correct: 1 },
                { q: "Which is a 'summative' assessment?", choices: ["Pop Quiz", "Final Exam", "Class Discussion"], correct: 1 },
                { q: "Piaget is famous for stages of...", choices: ["Cognitive Development", "Moral Development", "Physical Growth"], correct: 0 },
                { q: "What does ESL stand for?", choices: ["English as a Second Language", "Early School Learning", "Educational Standard Level"], correct: 0 },
                { q: "Positive reinforcement involves...", choices: ["Adding a reward", "Taking away a privilege", "Ignoring behavior"], correct: 0 }
            ],
            'business': [
                { q: "What represents ownership in a company?", choices: ["Bond", "Stock", "Loan"], correct: 1 },
                { q: "ROI stands for:", choices: ["Rate of Interest", "Return on Investment", "Risk of Inflation"], correct: 1 },
                { q: "Supply and...", choices: ["Cost", "Demand", "Profit"], correct: 1 },
                { q: "What is a 'Bear Market'?", choices: ["Prices rising", "Prices falling", "Stable prices"], correct: 1 },
                { q: "The '4 Ps' of Marketing are Product, Price, Place, and...", choices: ["Promotion", "People", "Process"], correct: 0 },
                { q: "Assets = Liabilities + ...", choices: ["Equity", "Revenue", "Expenses"], correct: 0 },
                { q: "What is a CEO?", choices: ["Chief Executive Officer", "Chief Economic Officer", "Company Employee Owner"], correct: 0 },
                { q: "Liquid assets are...", choices: ["Cash or easily converted", "Buildings and land", "Inventory"], correct: 0 },
                { q: "B2B stands for...", choices: ["Business to Business", "Back to Basics", "Buyer to Buyer"], correct: 0 },
                { q: "Gross Profit is...", choices: ["Revenue minus Cost of Goods", "Revenue minus All Expenses", "Taxable Income"], correct: 0 }
            ],
            'stem': [
                { q: "Python: How do you define a function?", choices: ["function myFunc()", "def my_func():", "func myFunc{}"], correct: 1 },
                { q: "Robotics: What does a servo motor do?", choices: ["Rotates to a specific angle", "Spins continuously", "Powers the battery"], correct: 0 },
                { q: "CAD: What does 'Extrude' do?", choices: ["Deletes a face", "Turns 2D shape into 3D", "Rotates the view"], correct: 1 },
                { q: "Python: Lists are enclosed in...", choices: ["( )", "{ }", "[ ]"], correct: 2 },
                { q: "Drafting: What is an 'Isometric' view?", choices: ["Top down", "3D view at 30 degrees", "Side profile"], correct: 1 },
                { q: "Physics: Force = Mass x ...", choices: ["Velocity", "Acceleration", "Gravity"], correct: 1 },
                { q: "Electronics: What resists current flow?", choices: ["Resistor", "Capacitor", "Diode"], correct: 0 },
                { q: "Python: What prints text to console?", choices: ["echo()", "console.log()", "print()"], correct: 2 },
                { q: "CAD: A 'Fillet' creates...", choices: ["A rounded edge", "A sharp corner", "A hole"], correct: 0 },
                { q: "Robotics: What is a sensor?", choices: ["An input device", "An output device", "The brain"], correct: 0 }
            ]
        };

        // --- AP CLASSES ---
        window.AP_CLASSES = {
            'lit': { name: "AP Literature", icon: "📚", desc: "Analysis of fiction and poetry." },
            'gov': { name: "AP Government", icon: "⚖️", desc: "Politics, laws, and the constitution." },
            'bio': { name: "AP Biology", icon: "🧬", desc: "Advanced genetics and cell theory." },
            'humangeo': { name: "AP Human Geo", icon: "🌍", desc: "Population, culture, and migration." },
            'history': { name: "AP History", icon: "📜", desc: "World history and historical causality." }
        };

        window.AP_QUESTIONS = {
            'lit': [
                { q: "Who wrote '1984'?", choices: ["Orwell", "Huxley", "Bradbury"], correct: 0 },
                { q: "A 14-line poem is a...", choices: ["Haiku", "Sonnet", "Limerick"], correct: 1 },
                { q: "The antagonist is the...", choices: ["Hero", "Villain", "Narrator"], correct: 1 },
                { q: "Which term means 'exaggeration'?", choices: ["Hyperbole", "Metaphor", "Simile"], correct: 0 },
                { q: "A story's underlying message is the...", choices: ["Plot", "Theme", "Setting"], correct: 1 },
                { q: "Shakespeare wrote in...", choices: ["Old English", "Early Modern English", "Middle English"], correct: 1 },
                { q: "Which is an Epic Poem?", choices: ["The Odyssey", "The Raven", "The Road Not Taken"], correct: 0 },
                { q: "What is 'Alliteration'?", choices: ["Repetition of vowel sounds", "Repetition of consonant sounds", "Rhyming at end of lines"], correct: 1 },
                { q: "Who wrote 'Pride and Prejudice'?", choices: ["Austen", "Dickens", "Bronte"], correct: 0 },
                { q: "A 'bildungsroman' is a...", choices: ["Ghost story", "Coming of age story", "Tragedy"], correct: 1 }
            ],
            'gov': [
                { q: "How many branches of US Govt?", choices: ["3", "4", "2"], correct: 0 },
                { q: "Term length for a Senator?", choices: ["2 years", "4 years", "6 years"], correct: 2 },
                { q: "The Bill of Rights is the first...", choices: ["5 Amendments", "10 Amendments", "Article"], correct: 1 },
                { q: "Who confirms Supreme Court nominees?", choices: ["The House", "The Senate", "The President"], correct: 1 },
                { q: "What is a filibuster?", choices: ["A delay tactic in Senate", "A type of bill", "A veto"], correct: 0 },
                { q: "How many Justices on the Supreme Court?", choices: ["7", "9", "12"], correct: 1 },
                { q: "The 'Executive Branch' is led by...", choices: ["Congress", "The President", "The Chief Justice"], correct: 1 },
                { q: "What is 'Federalism'?", choices: ["Rule by a King", "Division of power between State/Fed", "Total control by Fed"], correct: 1 },
                { q: "The 19th Amendment granted...", choices: ["Free Speech", "Women's Suffrage", "End of Slavery"], correct: 1 },
                { q: "A Presidential Veto can be overridden by...", choices: ["2/3 vote in Congress", "Supreme Court", "State Governors"], correct: 0 }
            ],
            'bio': [
                { q: "DNA shape is a...", choices: ["Single Helix", "Double Helix", "Triple Helix"], correct: 1 },
                { q: "Mitosis results in...", choices: ["2 identical cells", "4 unique cells", "Dead cells"], correct: 0 },
                { q: "Photosynthesis occurs in...", choices: ["Mitochondria", "Chloroplasts", "Nucleus"], correct: 1 },
                { q: "What molecule stores energy?", choices: ["ATP", "DNA", "RNA"], correct: 0 },
                { q: "Which is NOT a kingdom of life?", choices: ["Fungi", "Virus", "Animalia"], correct: 1 },
                { q: "Osmosis is the diffusion of...", choices: ["Sugar", "Water", "Salt"], correct: 1 },
                { q: "Gregor Mendel studied...", choices: ["Pea Plants", "Fruit Flies", "Mice"], correct: 0 },
                { q: "Enzymes are...", choices: ["Lipids", "Proteins", "Carbohydrates"], correct: 1 },
                { q: "What is the 'control group'?", choices: ["The group receiving treatment", "The group kept normal", "The scientists"], correct: 1 },
                { q: "Ribosomes make...", choices: ["Proteins", "Energy", "Waste"], correct: 0 }
            ],
            'humangeo': [
                { q: "A 'Push Factor' causes people to...", choices: ["Leave", "Stay", "Visit"], correct: 0 },
                { q: "Which is a Megacity?", choices: ["Tokyo", "Boston", "Austin"], correct: 0 },
                { q: "Gentrification changes a neighborhood's...", choices: ["Climate", "Wealth/Class", "Elevation"], correct: 1 },
                { q: "What is 'Demography'?", choices: ["Study of maps", "Study of population", "Study of rocks"], correct: 1 },
                { q: "Which is a 'Universalizing Religion'?", choices: ["Hinduism", "Christianity", "Judaism"], correct: 1 },
                { q: "The 'Demographic Transition Model' tracks...", choices: ["Birth/Death rates", "Migration paths", "Language spread"], correct: 0 },
                { q: "What is a 'Nation-State'?", choices: ["A country with one dominant culture", "A state with no government", "A colony"], correct: 0 },
                { q: "Subsistence agriculture is...", choices: ["Farming for profit", "Farming for survival", "Factory farming"], correct: 1 },
                { q: "Which sector is 'Service' jobs?", choices: ["Primary", "Secondary", "Tertiary"], correct: 2 },
                { q: "NATO is a...", choices: ["Military Alliance", "Trade Deal", "Charity"], correct: 0 }
            ],
            'history': [
                { q: "Industrial Revolution began in...", choices: ["USA", "France", "Britain"], correct: 2 },
                { q: "The Cold War was between...", choices: ["USA/USSR", "UK/Germany", "China/Japan"], correct: 0 },
                { q: "The Magna Carta limited the power of...", choices: ["The Church", "The King", "The Peasants"], correct: 1 },
                { q: "Who was the first Emperor of Rome?", choices: ["Julius Caesar", "Augustus", "Nero"], correct: 1 },
                { q: "The French Revolution started in...", choices: ["1776", "1789", "1812"], correct: 1 },
                { q: "Which empire used the Silk Road?", choices: ["Mongol", "Aztec", "Inca"], correct: 0 },
                { q: "The printing press was invented by...", choices: ["Gutenberg", "Da Vinci", "Galileo"], correct: 0 },
                { q: "World War I began after the assassination of...", choices: ["Franz Ferdinand", "Kaiser Wilhelm", "Tsar Nicholas"], correct: 0 },
                { q: "The Berlin Wall fell in...", choices: ["1989", "1991", "1975"], correct: 0 },
                { q: "Who wrote 'The Communist Manifesto'?", choices: ["Marx", "Lenin", "Stalin"], correct: 0 }
            ]
        };

        // --- COLLEGE DATABASE ---
        // Tiers: 1=Ivy, 2=Private, 3=State, 4=Community, 5=Trade
        // Types: 'stem', 'arts', 'business', 'health', 'general'
        window.COLLEGE_DB = [
            // TIER 1: IVY / ELITE (Requires ~3.8 - 4.0+)
            { id: 'harvard_north', name: "Harvard of the North", tier: 1, type: 'general', minGPA: 3.9, icon: "🏛️", desc: "Exclusive. Expensive. Elite.", cost: 65000 },
            { id: 'mit_east', name: "M.I.T. (East)", tier: 1, type: 'stem', minGPA: 3.9, icon: "🤖", desc: "For geniuses and robots only.", cost: 62000 },
            { id: 'yale_jr', name: "Yale Jr.", tier: 1, type: 'business', minGPA: 3.8, icon: "⚖️", desc: "Where future CEOs are made.", cost: 68000 },

            // TIER 2: PRIVATE / SELECTIVE (Requires ~3.2 - 3.7)
            { id: 'st_augustus', name: "St. Augustus Univ.", tier: 2, type: 'general', minGPA: 3.4, icon: "⛪", desc: "Old money and polo shirts.", cost: 55000 },
            { id: 'risd_lite', name: "R.I. Design Inst.", tier: 2, type: 'arts', minGPA: 3.2, icon: "🎨", desc: "Top tier art program.", cost: 52000 },
            { id: 'bentley_biz', name: "Bentley's Business", tier: 2, type: 'business', minGPA: 3.3, icon: "📈", desc: "Finance bros start here.", cost: 58000 },
            { id: 'northeastern_u', name: "North-Eastern U", tier: 2, type: 'stem', minGPA: 3.5, icon: "💻", desc: "Co-op programs and coding.", cost: 60000 },

            // TIER 3: STATE SCHOOLS (Requires ~2.5 - 3.1)
            { id: 'umass_d', name: "UMass Dartmouth", tier: 3, type: 'general', minGPA: 2.7, icon: "🏴‍☠️", desc: "Go Corsairs! Local and reliable.", cost: 28000 },
            { id: 'bridgewater', name: "Bridgewater State", tier: 3, type: 'teaching', minGPA: 2.8, icon: "🐻", desc: "Great for future teachers.", cost: 26000 },
            { id: 'salem_state', name: "Salem State", tier: 3, type: 'arts', minGPA: 2.6, icon: "🧙‍♀️", desc: "Spooky vibes, good liberal arts.", cost: 27000 },
            { id: 'mass_maritime', name: "Mass Maritime", tier: 3, type: 'stem', minGPA: 2.9, icon: "🚢", desc: "Discipline and engineering.", cost: 30000 },

            // TIER 4: COMMUNITY (Requires ~1.5 - 2.4, Open Enrollment essentially)
            { id: 'bristol_cc', name: "Bristol Comm. College", tier: 4, type: 'general', minGPA: 1.5, icon: "🐝", desc: "Smart start. Saves money.", cost: 6000 },
            { id: 'cape_cod_cc', name: "Cape Cod Comm. College", tier: 4, type: 'general', minGPA: 1.5, icon: "🌊", desc: "Study by the sea.", cost: 6500 },
            { id: 'massasoit', name: "Massasoit Comm. College", tier: 4, type: 'general', minGPA: 1.5, icon: "🏞️", desc: "Affordable and accessible.", cost: 5500 },

            // TIER 5: TRADE / TECHNICAL (Specific Skills, GPA less important)
            { id: 'gnb_vocab', name: "GNB Voc-Tech (Post-Grad)", tier: 5, type: 'stem', minGPA: 2.0, icon: "🔧", desc: "Hands-on certification.", cost: 12000 },
            { id: 'code_bootcamp', name: "New Bedford Code Camp", tier: 5, type: 'stem', minGPA: 2.0, icon: "⌨️", desc: "6 weeks to a new career.", cost: 15000 },
            { id: 'nursing_inst', name: "City Nursing Inst.", tier: 5, type: 'health', minGPA: 2.5, icon: "🩺", desc: "Fast track to the ER.", cost: 18000 }
        ];

        window.GAME_ART = {
            // -- NPC PORTRAITS --
            // If you have an image, uncomment the line. If commented out, the game uses the default emoji.
            
            'ophelia_portrait': `<img src="images/friends/ophelia.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Sarah">`,
            'brad_portrait': `<img src="images/friends/brad.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Brad">`,
            'kingt_portrait': `<img src="images/friends/kingt.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="King Triton">`,
            'matheus_portrait': `<img src="images/friends/matheus.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'collyn_portrait': `<img src="images/friends/collyn.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'jeff_portrait': `<img src="images/friends/jeff.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'baptiste_portrait': `<img src="images/friends/baptiste.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'nate_portrait': `<img src="images/friends/nate.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'mason_portrait': `<img src="images/friends/mason.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'alan_portrait': `<img src="images/friends/alan.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'sawyer_portrait': `<img src="images/friends/sawyer.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            'kevin_portrait': `<img src="images/friends/kevvy.webp" class="w-12 h-12 rounded-full border border-slate-500 bg-slate-700 object-cover" alt="Glitch">`,
            
            // -- SPECIAL ITEMS (Examples) --
             'vr_icon': `<img src="images/items/vr.webp" class="w-16 h-16 object-contain">`,
             'plush_icon': `<img src="images/items/plush.webp" class="w-16 h-16 object-contain">`,
             'guitar_icon':`<img src="images/items/guitar.webp" class="w-24 h-24 object-contain">`,
             'roundmeal':`<img src="images/items/roundmeal.webp" class="w-24 h-24 object-contain">`,
             'fidget_icon':`<img src="images/items/fidget.webp" class="w-16 h-16 object-contain">`,
             'fish_icon':`<img src="images/items/fish.webp" class="w-32 h-24 object-contain">`,
             'cat_icon':`<img src="images/items/cat.webp" class="w-32 h-24 object-contain">`,
             'dog_icon':`<img src="images/items/dog.webp" class="w-32 h-24 object-contain">`,
             'rod_upgrade_icon':`<img src="images/items/rod_upgrade.webp" class="w-16 h-16 object-contain">`,
             'textbooks_icon':`<img src="images/items/textbooks.webp" class="w-16 h-16 object-contain">`,
             'camera_icon':`<img src="images/items/camera.webp" class="w-16 h-16 object-contain">`,
             'console_icon':`<img src="images/items/console.webp" class="w-16 h-16 object-contain">`,
             'car_icon':`<img src="images/items/car.webp" class="w-28 h-16 object-contain">`,
             'ebike_icon':`<img src="images/items/ebike.webp" class="w-16 h-16 object-contain">`,
             'skateboard_icon':`<img src="images/items/skateboard.webp" class="w-16 h-16 object-contain">`,
             
             
             


             'shoes_icon':`<img src="images/items/shoes.webp" class="w-28 h-16 object-contain">`,
             
             'club_band_icon':`<img src="images/items/leviathan.webp" class="w-12 h-12 object-contain">`,
             'acorn_icon':`<img src="images/items/acorn.webp" class="w-16 h-16 object-contain">`,
             'pearpods_icon':`<img src="images/items/pearpods.webp" class="w-16 h-16 object-contain">`,

             // -- PHONE APPS --
             'app_readedit_icon':`<img src="images/apps/readedit.webp" class="w-16 h-16 object-contain">`,
             'app_dingdong_icon':`<img src="images/apps/dingdong.webp" class="w-16 h-16 object-contain">`,
             'app_invest_icon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#22c55e"/><path d="M20 75 L40 55 L55 65 L80 40" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            
            // -- COMPLEX SVGs --
            // You can also paste raw SVG strings here to keep your logic code clean
            'logo_main': `<svg viewBox="0 0 100 100">...</svg>` 
        };

        window.INVESTMENT_DATA = {
            indexFund: {
                id: 'index',
                name: "Triton 500 Index Fund",
                description: "A diversified, low-risk fund that tracks the top 500 companies. Slow, steady growth.",
                price: 150.00, // Price per share
                originalPrice: 150.00,
                volatility: 0.05, // Low volatility
                trend: 1.001 // Slightly positive long-term trend
            },
            commodities: [
                { id: 'gold', name: "Gold", icon: "📀", price: 1800.00, originalPrice: 1800.00, volatility: 0.1, trend: 1.0005, description: "The classic safe-haven asset. Stable, but not a huge earner." },
                { id: 'silver', name: "Silver", icon: "💿", price: 25.00, originalPrice: 25.00, volatility: 0.25, trend: 1, description: "More volatile than gold, with industrial and jewelry demand." },
                { id: 'lithium', name: "Lithium", icon: "🪨", price: 40.00, originalPrice: 40.00, volatility: 0.6, trend: 1.002, description: "The 'white gold' of the battery world. High risk, high reward." }
            ],
            stocks: [
                { id: 'pear', name: "Pear Inc.", ticker: "PEAR", icon: "🍐", price: 170.00, originalPrice: 170.00, volatility: 0.3, trend: 1.0015, description: "The biggest tech company in the world. Sells premium phones and computers." },
                { id: 'hentons', name: "Henton's Corp.", ticker: "RDML", icon: "🍲", price: 160.00, originalPrice: 160.00, volatility: 0.2, trend: 1, description: "A massive retail chain known for the Roundmeal© and making you buy things you don't need." },
                { id: 'gameslop', name: "GameSlop", ticker: "GMSL", icon: "🫟", price: 20.00, originalPrice: 20.00, volatility: 0.95, trend: 0.999, description: "A struggling video game retailer. Very popular on the r/SuperStonks subreadedit." }
            ],
            crypto: [
                { id: 'bitcorn', name: "BitCorn", ticker: "CRN", icon: "🌽", price: 2500.00, originalPrice: 2500.00, volatility: 0.8, trend: 1.001, description: "The original digital currency. It's either the future of finance or a complete joke." },
                { id: 'slugcoin2', name: "SlugCoin 2", ticker: "SLG2", icon: "🦠", price: 0.08, originalPrice: 0.08, volatility: 1.5, trend: 1, description: "It's the sequel to the meme. To the moon? Or to the floor?" },
                { id: 'coincoin', name: "Coin Coin", ticker: "COIN", icon: "🪙", price: 0.00001, originalPrice: 0.00001, volatility: 2.5, trend: 1, description: "So volatile it makes SlugCoin 2 look like a government bond. Zeroes or hero?" }
            ]
        };

        // Dictionary for Typing Game
        window.ACADEMIC_WORDS = ["Logic", "Thesis", "Ratio", "Cells", "Atom", "Civics", "Essay", "Grade", "Study", "Focus", "Math", "History", "Lab", "Paper", "Exam", "Audit", "Credit", "Debt", "Major", "Minor"];
        window.FISH_OPTS = ['🐠', '🐡', '🐟', '🦐', '🐌'];
        window.FISH_NAMES = ["Sir Bubbles", "Finnegan", "Sushi", "Neptune", "Salty", "Captain", "Glub", "Flipper", "Jaws", "Goldie", "Wanda", "Swim Shady"];
        
        window.TRAITS = [
            { id: 'reliable', name: 'Reliable', icon: '⏰', desc: 'Performance never drops below 50%.' },
            { id: 'outgoing', name: 'Outgoing', icon: '🤝', desc: 'Hiring bonus for Service jobs.' },
            { id: 'organized', name: 'Organized', icon: '📁', desc: 'Homework costs less Energy.' },
            { id: 'techie', name: 'Tech-Savvy', icon: '💻', desc: 'Huge hiring bonus for Tech jobs.' },
            { id: 'patient', name: 'Patient', icon: '🧘', desc: 'Work causes 25% less Stress.' }
        ];

        window.NEGATIVE_TRAITS = [
            { id: 'shy', name: 'Shy', icon: '😶', desc: 'Hard to get Service jobs. +Stress.' },
            { id: 'clumsy', name: 'Clumsy', icon: '🩹', desc: 'Hard to get Labor/Food jobs.' },
            { id: 'distracted', name: 'Distracted', icon: '📱', desc: 'Homework gives less GPA.' },
            { id: 'sleepy', name: 'Sleepyhead', icon: '😴', desc: 'Wake up with only 80% Energy.' },
            { id: 'messy', name: 'Unorganized', icon: '🌪️', desc: 'Hard to get Food/Medical jobs.' }
        ];

        window.SKILLS = [
            { id: 'customer', name: 'Customer Service', icon: '💬', desc: '$15 Tip Bonus in Food/Retail.' },
            { id: 'fast', name: 'Fast Learner', icon: '⚡', desc: 'GPA gains are nearly doubled.' },
            { id: 'aid', name: 'First Aid', icon: '🩹', desc: 'Heal 20% Stress every morning.' },
            { id: 'code', name: 'Basic Coding', icon: '⌨️', desc: '1.5x Wages in Tech jobs.' },
            { id: 'multitask', name: 'Multitasking', icon: '🤹', desc: 'Work & School cost -10 Energy.' }
        ];

        window.SCHOOL_QUIZ_BANK = [
            // Spelling/Grammar (7)
            { q: "Spelling: Which is spelled correctly?", choices: ["Definitely", "Definitly", "Defenitely"], correct: 0 },
            { q: "Spelling: Select the correct spelling.", choices: ["Receive", "Recieve", "Receve"], correct: 0 },
            { q: "Grammar: Which word is a verb?", choices: ["Happy", "Run", "Blue"], correct: 1 },
            { q: "Grammar: What is the plural of 'Mouse'?", choices: ["Mouses", "Mice", "Mise"], correct: 1 },
            { q: "Grammar: Identify the adjective.", choices: ["Quickly", "Soft", "Run"], correct: 1 },
            { q: "Spelling: Synonym for 'Happy'.", choices: ["Joyful", "Sad", "Angry"], correct: 0 },
            { q: "Grammar: Which sentence is correct?", choices: ["Me went home.", "I went home.", "Him went home."], correct: 1 },

            // Math (7)
            { q: "Math: What is 15 multiplied by 4?", choices: ["45", "50", "60"], correct: 2 },
            { q: "Math: Solve for X: 2x + 5 = 15", choices: ["5", "10", "20"], correct: 0 },
            { q: "Math: What is the square root of 64?", choices: ["6", "8", "10"], correct: 1 },
            { q: "Math: A triangle has angles 90 and 45. The third is?", choices: ["35", "45", "55"], correct: 1 },
            { q: "Math: What is 10% of 200?", choices: ["10", "20", "50"], correct: 1 },
            { q: "Math: Solve: 12 / 4 + 2", choices: ["5", "6", "8"], correct: 0 },
            { q: "Math: Perimeter of a square with side 5?", choices: ["20", "25", "10"], correct: 0 },

            // History (7)
            { q: "History: Who was the first US President?", choices: ["Thomas Jefferson", "George Washington", "Abraham Lincoln"], correct: 1 },
            { q: "History: In what year did WWII end?", choices: ["1918", "1945", "1960"], correct: 1 },
            { q: "History: 'We the People' starts which document?", choices: ["Declaration of Independence", "The Constitution", "The Magna Carta"], correct: 1 },
            { q: "History: Who wrote the Declaration of Independence?", choices: ["Washington", "Jefferson", "Franklin"], correct: 1 },
            { q: "History: Which empire built the Colosseum?", choices: ["Greek", "Roman", "Egyptian"], correct: 1 },
            { q: "History: First person on the moon?", choices: ["Armstrong", "Aldrin", "Gagarin"], correct: 0 },
            { q: "History: The Great Wall is located in...", choices: ["Japan", "China", "India"], correct: 1 },

            // Science (7)
            { q: "Science: Chemical symbol for Water?", choices: ["H2O", "CO2", "O2"], correct: 0 },
            { q: "Science: The Red Planet is...", choices: ["Venus", "Mars", "Jupiter"], correct: 1 },
            { q: "Science: What force keeps us on the ground?", choices: ["Magnetism", "Friction", "Gravity"], correct: 2 },
            { q: "Science: Plants absorb which gas?", choices: ["Oxygen", "Nitrogen", "Carbon Dioxide"], correct: 2 },
            { q: "Science: Center of an atom?", choices: ["Electron", "Nucleus", "Proton"], correct: 1 },
            { q: "Science: Powerhouse of the cell?", choices: ["Nucleus", "Mitochondria", "Ribosome"], correct: 1 },
            { q: "Science: Which is a mammal?", choices: ["Shark", "Whale", "Eagle"], correct: 1 },

            // Specials (15)
            { q: "Music: How many strings on a standard guitar?", choices: ["4", "6", "8"], correct: 1 },
            { q: "Music: Symbol for a 'sharp' note?", choices: ["#", "b", "&"], correct: 0 },
            { q: "Art: Which are primary colors?", choices: ["Red/Blue/Yellow", "Green/Purple/Orange", "Black/White/Grey"], correct: 0 },
            { q: "Art: Impressionism is a style of...", choices: ["Painting", "Sculpture", "Dance"], correct: 0 },
            { q: "Tech: What does CPU stand for?", choices: ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit"], correct: 0 },
            { q: "Tech: Which is an operating system?", choices: ["Python", "Windows", "HTML"], correct: 1 },
            { q: "Tech: What is RAM?", choices: ["Random Access Memory", "Read All Memory", "Run All Media"], correct: 0 },
            { q: "Medicine: What does CPR stand for?", choices: ["Cardiopulmonary Resuscitation", "Chest Pressure Rhythm", "Cardiac Pulse Rate"], correct: 0 },
            { q: "Medicine: The femur is located in the...", choices: ["Arm", "Leg", "Skull"], correct: 1 },
            { q: "Medicine: Which organ pumps blood?", choices: ["Heart", "Liver", "Lungs"], correct: 0 },
            { q: "Crime: What is a fingerprint?", choices: ["Biometric ID", "DNA sample", "Blood type"], correct: 0 },
            { q: "Crime: What does CSI stand for?", choices: ["Crime Scene Investigation", "Criminal Service Intelligence", "City Safety Institute"], correct: 0 },
            { q: "Finance: What is a budget?", choices: ["Spending plan", "Bank account", "Credit card"], correct: 0 },
            { q: "Finance: Which grows money faster?", choices: ["Compound Interest", "Simple Interest", "Hiding it"], correct: 0 },
            { q: "Finance: A 'Bear Market' means prices are...", choices: ["Rising", "Falling", "Flat"], correct: 1 }
        ];

        window.RESUME_QUIZ_BANK = [
            { q: "Which of these should NEVER be on a job application?", choices: ["Work History", "Your full home address and SSN", "LinkedIn Profile"], correct: 1 },
            { q: "What type of email address is UNPROFESSIONAL?", choices: ["name.work@email.com", "partyguy123@fake.com", "j.smith@email.com"], correct: 1 },
            { q: "What should you avoid on a resume?", choices: ["Typos and slang", "Bullet points", "Action verbs"], correct: 0 },
            { q: "What is the best font choice for a professional resume?", choices: ["Comic Sans", "Arial or Calibri", "Chiller"], correct: 1 },
            { q: "How long should a standard entry-level resume be?", choices: ["1 page", "3-5 pages", "Just a sticky note"], correct: 0 },
            { q: "What is the most important step before submitting?", choices: ["Guessing the manager's name", "Proofreading for spelling errors", "Attaching a selfie"], correct: 1 },
            { q: "Which detail is NOT required for a student resume?", choices: ["Education History", "Relevant Skills", "Marital Status"], correct: 2 },
            { q: "What is the primary purpose of a Cover Letter?", choices: ["To repeat your resume exactly", "To introduce yourself and highlight fit", "To list salary demands"], correct: 1 },
            { q: "Who is the best person to list as a Reference?", choices: ["Your Mom", "A teacher or former coach", "Your gaming buddy"], correct: 1 },
            { q: "What is a 'Soft Skill'?", choices: ["Typing speed", "Teamwork and Communication", "Forklift Certification"], correct: 1 },
            // New Questions: Availability, MA Laws, App Items
            { q: "Availability: What does 'Open Availability' mean?", choices: ["You can work any shift/day", "The store is open 24/7", "You have no skills"], correct: 0 },
            { q: "MA Law: What document is required for workers under 18?", choices: ["Library Card", "Youth Employment Permit", "Parent Note"], correct: 1 },
            { q: "Application: What goes in 'Employment History'?", choices: ["Your favorite hobbies", "Past jobs and duties", "Future career goals"], correct: 1 },
            { q: "MA Law: Latest work time for 14-15 year olds on school nights?", choices: ["7:00 PM", "9:00 PM", "10:00 PM"], correct: 0 },
            { q: "MA Law: Max hours for 16-17 year olds on a school day?", choices: ["4 hours", "6 hours", "9 hours"], correct: 0 },
            { q: "Application: What is a 'Reference'?", choices: ["A dictionary definition", "Someone who can vouch for your work ethic", "A link to your website"], correct: 1 },
            { q: "Availability: If you play sports after school, you should...", choices: ["List 'Open Availability'", "List specific hours you can work", "Don't mention it"], correct: 1 },
            { q: "MA Law: On school nights, 16-17 year olds must stop by...", choices: ["8:00 PM", "10:00 PM", "Midnight"], correct: 0 },
            { q: "Application: 'Salary Desired' - Best answer for a first job?", choices: ["$100/hr", "Negotiable / Minimum Wage", "Zero"], correct: 1 },
            { q: "General: What happens if you lie on an application?", choices: ["You get a bonus", "Nothing", "Grounds for termination"], correct: 2 }
        ];

        const readedit_POSTS = [
            { user: "u/HistoryBuff99", sub: "r/TodayILearned", title: "TIL Abraham Lincoln actually invented the 'Chokeslam' wrestling move during a debate in 1858.", icon: "🎩" },
            { user: "u/TownCrier", sub: "r/WorldNews", title: "BREAKING: British Tea Tax increased by 3%. Harbor protest scheduled for Tuesday. Bring your own mugs.", icon: "☕" },
            { user: "u/GoodBoyo", sub: "r/Wholesome", title: "Local Golden Retriever elected Mayor for a 3rd consecutive term. Approval rating holds steady at 14/10.", icon: "🦮" },
            { user: "u/RecordBreaker", sub: "r/MildlyInteresting", title: "Man eats 400 lbs of cotton candy in one sitting. Doctors say he has effectively become a cloud.", icon: "☁️" },
            { user: "u/SpoonLover", sub: "r/UnpopularOpinion", title: "Cereal is technically a cold soup and I am tired of pretending it's not.", icon: "🥣" },
            { user: "u/PhoneticFan", sub: "r/ShowerThoughts", title: "The letter 'C' is completely useless. We have 'S' and 'K'. 'C' is just a poseur.", icon: "🔤" },
            { user: "u/ConspiracyCarl", sub: "r/HistoryMemes", title: "Napoleon wasn't short. He was actually three toddlers in a trench coat trying to buy R-rated movies.", icon: "🇫🇷" },
            { user: "u/WhiteStarLine", sub: "r/Travel", title: "UPDATE: Titanic arrives in NY ahead of schedule! The iceberg was actually just a smudge on the binoculars.", icon: "🚢" },
            { user: "u/KnittyGritty", sub: "r/Pics", title: "My grandma spent the last year knitting sweaters for all the cold trees in the park.", icon: "🧶" },
            { user: "u/CatStare", sub: "r/Gaming", title: "New world record set for 'Staring at a blank wall' by a local Tabby Cat (47 hours).", icon: "🐈" },
        // --- NEW ADDITIONS (20) ---
            { user: "u/AncientAliens", sub: "r/Architecture", title: "The Pyramids were actually built top-down. The anti-gravity generators are still in the basement.", icon: "📐" },
            { user: "u/BenFranklinFan", sub: "r/TechSupport", title: "Help: My kite got struck by lightning and now my wig is emitting 5G wifi.", icon: "⚡" },
            { user: "u/NuggetTruth", sub: "r/HotTakes", title: "Boneless wings are just chicken nuggets that went to private school and got an ego.", icon: "🍗" },
            { user: "u/LibraryAlexandria", sub: "r/Books", title: "FIRE SALE! Everything must go! Literally everything. Please bring buckets of water.", icon: "🔥" },
            { user: "u/SleepyGary", sub: "r/LifeHacks", title: "If you sleep for 18 hours a day, you save a fortune on groceries. Doctors hate this one trick.", icon: "💤" },
            { user: "u/DinoDenier", sub: "r/Science", title: " dinosaurs didn't go extinct, they just evolved into dragons. Open your eyes.", icon: "🦖" },
            { user: "u/HydroHomie", sub: "r/UnpopularOpinion", title: "Water tastes different at 3AM. It is spicy water. Day water is round. Night water is pointy.", icon: "💧" },
            { user: "u/TrojanHorse", sub: "r/Unboxing", title: "UNBOXING VIDEO: You won't BELIEVE what is inside this giant wooden horse! (Gone Wrong).", icon: "🎁" },
            { user: "u/SockDetective", sub: "r/Mysteries", title: "I found the Dimension of Lost Socks behind my dryer. They have formed a republic.", icon: "🧦" },
            { user: "u/JuliusSeizure", sub: "r/Politics", title: "Et Tu, Brute? A thread on workplace betrayal and why you shouldn't trust guys with knives.", icon: "🗡️" },
            { user: "u/BreadPitt", sub: "r/FoodPorn", title: "I made a sandwich using two other sandwiches as buns. I can see through time now.", icon: "🥪" },
            { user: "u/FlatEarther2026", sub: "r/Maps", title: "The Earth isn't flat. It's shaped like a velociraptor. The Pacific Ocean is the mouth.", icon: "🌎" },
            { user: "u/SirIsaacNewton", sub: "r/TIFU", title: "TIFU by sitting under an apple tree. Now I have to invent Calculus. My head hurts.", icon: "🍎" },
            { user: "u/VibeChecker", sub: "r/HotTakes", title: "Pineapple on pizza is fine. You guys are just dramatic.", icon: "🍕" },
            { user: "u/GhostRealestate", sub: "r/Finance", title: "I charged the ghost in my attic rent. He paid in ectoplasm. Does the IRS tax ghost goo?", icon: "👻" },
            { user: "u/MozartDroptheBeat", sub: "r/MusicProduction", title: "Check out my new mixtape 'Requiem in D Minor'. The bass drop at the end is killer.", icon: "🎹" },
            { user: "u/FloridaMan", sub: "r/NotTheOnion", title: "Local man tries to wrestle an alligator to 'impress a seagull'. The seagull was unimpressed.", icon: "🐊" },
            { user: "u/WrightBros", sub: "r/DIY", title: "We glued some fabric to a bicycle and threw it off a hill. I think we just invented travel.", icon: "✈️" },
            { user: "u/PlantDad", sub: "r/Wholesome", title: "My cactus finally bloomed after 4 years. I cried for 20 minutes. His name is Spike Lee.", icon: "🌵" },
            { user: "u/ExistentialEd", sub: "r/ShowerThoughts", title: "If you clean a vacuum cleaner, you become the vacuum cleaner.", icon: "🧹" }
        ];

        window.DINGDONG_DB = [
            { 
                user: "@based_jumper", 
                desc: "Don't look down... 🏔️🪂 #nope #basejump #hellno", 
                src: "images/dingdong/stunt.webm",
                likes: "2.7M"
            },
            { 
                user: "@tex_flex", 
                desc: "Mr. Steal Yo' Girl 🪤🐴 #suave #texas #bighats", 
                src: "images/dingdong/cowboykid.webm",
                likes: "1.6M"
            },
            { 
                user: "@doggo_moves_br", 
                desc: "When the beat drops, we dance! 🐕💃 #dog #brazil #funk", 
                src: "images/dingdong/dogdance.webm",
                likes: "2.4M"
            },
            { 
                user: "@history_uncovered", 
                desc: "They actually have bodies underground?! 🗿🤯 #history #moai", 
                src: "images/dingdong/easter.webm",
                likes: "850K"
            },
            { 
                user: "@deep_blue_vibes", 
                desc: "Met a new friend at 30ft down 🐠🕺 #scuba #ocean", 
                src: "images/dingdong/fishdance.webm",
                likes: "1.1M"
            },
            { 
                user: "@science_lab_tv", 
                desc: "Don't try this at home! 🧪💥 #science #reaction", 
                src: "images/dingdong/foam.webm",
                likes: "3.2M"
            },
            { 
                user: "@breakfast_king", 
                desc: "The perfect flip doesn't exi... 🍳🔥 #cooking #satisfying", 
                src: "images/dingdong/friedeggs.webm",
                likes: "400K"
            },
            { 
                user: "@travel_wanderlust", 
                desc: "Bucket list check. Absolutely unreal. 🌌✨ #aurora #travel", 
                src: "images/dingdong/lights.webm",
                likes: "900K"
            },
            { 
                user: "@sleight_of_hand", 
                desc: "Watch closely... how does he do it? 🪄👀 #magic #illusion", 
                src: "images/dingdong/magic.webm",
                likes: "550K"
            },
            { 
                user: "@gym_fails_daily", 
                desc: "New crossfit routine just dropped. Is this safe? 🏋️‍♂️🚑 #gym #fitness", 
                src: "images/dingdong/newworkout.webm",
                likes: "150K"
            },
            { 
                user: "@wildlife_moments", 
                desc: "The drama in Antarctica is real 🐧👋 #nature #slap", 
                src: "images/dingdong/penguin.webm",
                likes: "4.5M"
            },
            { 
                user: "@kitchen_hacks_101", 
                desc: "You've been opening these wrong your whole life. 🍎🔪 #hack #fruit", 
                src: "images/dingdong/pomegranate.webm",
                likes: "2.1M"
            },
            { 
                user: "@relatable_memes", 
                desc: "It really do be like that sometimes 💀😂 #mood #relatable", 
                src: "images/dingdong/reaction.webm",
                likes: "750K"
            },
            { 
                user: "@dad_life_chronicles", 
                desc: "Insurance scam caught on camera! 😂🚗 #kids #funny", 
                src: "images/dingdong/runover.webm",
                likes: "1.8M"
            },
            { 
                user: "@marine_biologist_jen", 
                desc: "Sharks are older than trees! 🦈🌲 #facts #ocean", 
                src: "images/dingdong/shark.webm",
                likes: "600K"
            },
            { 
                user: "@cat_vibes", 
                desc: "He really do be vibing tho 🐱 #cat #music", 
                src: "images/dingdong/vibingcat.webm",
                likes: "1.2M"
            },                        
            { 
                user: "@retro_tech", 
                desc: "Loading screens in 1995 💾 #nostalgia", 
                src: "images/dingdong/loading.webm",
                likes: "120K"
            },
             { 
                user: "@trust_n_believe", 
                desc: "He almost made it! 🎖️🫟 #fail #faceplant", 
                src: "images/dingdong/backflip.webm",
                likes: "720K"
            },
            { 
                user: "@dance_trends", 
                desc: "Can you do this? 💃 #challenge", 
                src: "images/dingdong/panda.webm",
                likes: "3.5M"
            }
        ];

        const PEAR_POD_PLAYLIST = [
            { artist: "Kazeem's Dream Machine", song: "N.T.L.T.B.G.", file: "audio/pearpods/toolate.ogg" },//
            { artist: "Leviathan", song: "Naughty List", file: "audio/pearpods/naughty.ogg" },//
            { artist: "King Triton", song: "Atlantis Anthem", file: "audio/pearpods/tritonanthem.ogg" },//
            { artist: "The Tom Walsh Experience", song: "(I Don't Want To) Do That", file: "audio/pearpods/dothat.ogg" },//
            { artist: "Trident 86", song: "Playing The Thumb Again", file: "audio/pearpods/thumbagain.ogg" },//
            { artist: "BroKoli", song: "Red Rover", file: "audio/pearpods/redrover.ogg" },//
            { artist: "Oasis", song: "Wonderwall", file: "audio/pearpods/roll.ogg" },//
            { artist: "Joe Oyota", song: "Spot Thief", file: "audio/pearpods/spotthief.ogg" },
            { artist: "Leviathan", song: "Caveman Song", file: "audio/pearpods/caveman.ogg" },//
            //{ artist: "Leviathan", song: "Home Depot Theme" },
            //{ artist: "Lil' Mister Al", song: "Six Seveeeeeen" },
            { artist: "Squareknot", song: "Roundmeal (Covered In Flies)", file: "audio/pearpods/roundmeal.ogg" },//
            { artist: "Malletdescend", song: "We Sing So High", file: "audio/pearpods/sohigh.ogg" },//
            { artist: "Lady Lynn", song: "Immediately", file: "audio/pearpods/immediately.ogg" },//
            { artist: "Amy Corriveau Quartet", song: "Business As Usual", file: "audio/pearpods/business.ogg" },//
            { artist: "Doctor Greewood", song: "Mark of a Champion", file: "audio/pearpods/champion.ogg" },//
            { artist: "Mr. P", song: "You Down With I.S.S.", file: "audio/pearpods/iss.ogg" },//
            { artist: "Murphy's Law", song: "Smile, Mr. Booker", file: "audio/pearpods/smile.ogg" },//
            { artist: "Ronnie James Booker", song: "Where Did You Go?", file: "audio/pearpods/wheredidyougo.ogg" },//
            { artist: "Mickey Chav", song: "Meat Madness", file: "audio/pearpods/madness.ogg" },//
            { artist: "Big Dan Band", song: "Your Yondrin' Heart", file: "audio/pearpods/yonderin.ogg" }//
            
        ];

        window.JOB_BANK = [
            // RETAIL (6)
            { id: 'bullseye', name: 'Bullseye Mart', logo: '🎯', type: 'retail', wage: 15.00, color: 'bg-red-500', hex: '#ef4444', flavor: "Duties include organizing red spheres and explaining to customers that we don't sell 'hope'." },
            { id: 'cinema', name: 'Cinema City', logo: '🍿', type: 'retail', wage: 13.00, color: 'bg-slate-900', hex: '#0f172a', flavor: "You will be paid in popcorn smell. Sweep the aisles. Do not look directly at the silver screen." },
            { id: 'books', name: 'Shelf-Life', logo: '📖', type: 'retail', wage: 15.50, color: 'bg-amber-800', hex: '#92400e', flavor: "Organize books by color, not content. Shush anyone who breathes too loudly. The dust is mandatory." },
            { id: 'stylestreet', name: 'Style Street', logo: '👗', type: 'retail', wage: 14.50, color: 'bg-pink-500', hex: '#ec4899', flavor: "Fold clothes until your hands cramp. Tell everyone they look 'fabulous' even if they are wearing a burlap sack." },
            { id: 'cleankicks', name: 'Clean Kicks', logo: '👟', type: 'retail', wage: 15.50, color: 'bg-slate-700', hex: '#334155', flavor: "Guard the sneakers. They are worth more than your car. Do not crease the merchandise." },
            { id: 'megabasket', name: 'Mega Basket', logo: '🧺', type: 'retail', wage: 15.25, color: 'bg-red-900', hex: '#7f1d1d', flavor: "It's a grocery store. It's a lifestyle. It's a cage. Stock the shelves before the void consumes them." },

            // FOOD (6)
            { id: 'burgerworld', name: 'Burger Galaxy', logo: '🍔', type: 'food', wage: 13.50, color: 'bg-yellow-500', hex: '#eab308', flavor: "Flip the patties. Salt the fries. Ignore the grease stains on your soul. Smile." },
            { id: 'coffee', name: 'Coffee Cavern', logo: '☕', type: 'food', wage: 14.50, color: 'bg-emerald-600', hex: '#059669', flavor: "Learn the difference between a latte and a cappuccino. If you burn the milk, the beans will know." },
            { id: 'pixelpizza', name: 'Pixel Pizzeria', logo: '🍕', type: 'food', wage: 14.00, color: 'bg-orange-500', hex: '#f97316', flavor: "The dough must be spun. The cheese must be melted. The delivery must be under 30 minutes or time collapses." },
            { id: 'tacotime', name: 'Taco Time', logo: '🌮', type: 'food', wage: 13.75, color: 'bg-red-600', hex: '#dc2626', flavor: "Tuesday is mandatory. Tuesday is eternal. Fill the shells." },
            { id: 'thecave', name: 'The Cave', logo: '⚓', type: 'food', wage: 16.00, color: 'bg-blue-900', hex: '#1e3a8a', flavor: "It's damp. It's dark. The crab cakes are fresh. Do not ask about the source of the brine." },
            { id: 'bagelbay', name: 'Bagel Bay', logo: '🥯', type: 'food', wage: 14.25, color: 'bg-orange-300', hex: '#fdba74', flavor: "Boil. Bake. Spread. Repeat. You are the cream cheese artist now." },

            // DAYCARE (6)
            { id: 'kidscastle', name: 'Tots & Blocks', logo: '🏰', type: 'daycare', wage: 17.00, color: 'bg-purple-500', hex: '#a855f7', flavor: "Survive the toddler pit. Avoid the sticky surfaces. They smell fear." },
            { id: 'littlelearners', name: 'Little Learners', logo: '🖍️', type: 'daycare', wage: 17.50, color: 'bg-yellow-400', hex: '#facc15', flavor: "Teach them letters. Teach them shapes. Pray they don't teach you despair." },
            { id: 'recroll', name: 'Rec & Roll', logo: '⚽', type: 'daycare', wage: 16.50, color: 'bg-orange-400', hex: '#fb923c', flavor: "Watch them run in circles. Blow the whistle. Do not let them escape the perimeter." },
            { id: 'brainybunch', name: 'Brainy Bunch', logo: '📚', type: 'daycare', wage: 18.00, color: 'bg-blue-500', hex: '#3b82f6', flavor: "They are smarter than you. Just pretend you know the answers." },
            { id: 'bigsibs', name: 'Big Sibs', logo: '🤝', type: 'daycare', wage: 16.75, color: 'bg-teal-500', hex: '#14b8a6', flavor: "Be a role model. Even if you are faking it. Especially if you are faking it." },
            { id: 'youthhub', name: 'The Youth Hub', logo: '🎮', type: 'daycare', wage: 17.25, color: 'bg-indigo-500', hex: '#6366f1', flavor: "Supervise the gaming. Resolve disputes over controller lag. Don't lose." },

            // TECH (6)
            { id: 'tech', name: 'Gadget Garage', logo: '🔧', type: 'tech', wage: 19.00, color: 'bg-cyan-600', hex: '#0891b2', flavor: "Turn it off. Turn it on. If that fails, hit it with a wrench. Gently." },
            { id: 'cybersolutions', name: 'Cyber Solutions', logo: '🌐', type: 'tech', wage: 20.00, color: 'bg-blue-600', hex: '#2563eb', flavor: "The code is broken. The deadline was yesterday. Here is your caffeinated beverage." },
            { id: 'screensavers', name: 'Screen Savers', logo: '📱', type: 'tech', wage: 18.50, color: 'bg-indigo-500', hex: '#6366f1', flavor: "Fix the cracks. Replace the glass. Ignore the notifications popping up on the locked screens." },
            { id: 'clickfix', name: 'Click & Fix', logo: '🖱️', type: 'tech', wage: 17.50, color: 'bg-slate-600', hex: '#4b5563', flavor: "Answer the phone. Ask if it is plugged in. Sigh audibly." },
            { id: 'techtalk', name: 'Tech Talk', logo: '🎧', type: 'tech', wage: 16.50, color: 'bg-violet-600', hex: '#7c3aed', flavor: "Read the script. Do not deviate. The customer is always wrong, but tell them they are right." },
            { id: 'codecorner', name: 'Code Corner', logo: '💻', type: 'tech', wage: 19.50, color: 'bg-slate-800', hex: '#1e293b', flavor: "Teach the children Python. If they start coding in assembly, call the authorities." },

            // ANIMAL (6)
            { id: 'pristine', name: 'Pristine Aquariums', logo: '🐠', type: 'animal', wage: 16.25, color: 'bg-blue-400', hex: '#60a5fa', flavor: "Scrub the algae. Feed the fish. Do not tap on the glass. The glass taps back." },
            { id: 'wagwalkers', name: 'Wag Walkers', logo: '🦮', type: 'animal', wage: 15.50, color: 'bg-green-600', hex: '#16a34a', flavor: "They pull. You follow. Pick up the poop. It is the circle of life." },
            { id: 'pawsprimp', name: 'Paws & Primp', logo: '✂️', type: 'animal', wage: 17.00, color: 'bg-pink-600', hex: '#db2777', flavor: "Make the poodle look like a lion. Try not to get bitten. The bows are mandatory." },
            { id: 'cityzoo', name: 'City Zoo', logo: '🦁', type: 'animal', wage: 18.00, color: 'bg-amber-600', hex: '#d97706', flavor: "Shovel the manure. Feed the beasts. Do not make eye contact with the primates." },
            { id: 'cozycritters', name: 'Cozy Critters', logo: '🏠', type: 'animal', wage: 15.00, color: 'bg-orange-400', hex: '#fb923c', flavor: "Watch the cat sleep. Feed the cat. The cat judges you. Accept your judgment." },
            { id: 'safarizone', name: 'Safari Zone', logo: '🦓', type: 'animal', wage: 17.50, color: 'bg-emerald-700', hex: '#047857', flavor: "It's like a zoo, but with a jeep. Keep your arms inside the vehicle. The ostriches are aggressive." },

            // LABOR (6)
            { id: 'greenthumb', name: 'Green Thumb', logo: '🌿', type: 'labor', wage: 16.50, color: 'bg-emerald-600', hex: '#059669', flavor: "Cut the grass. Trim the hedges. The plants are listening. Make them look presentable." },
            { id: 'lawnforce', name: 'Lawn Force', logo: '🚜', type: 'labor', wage: 15.50, color: 'bg-lime-600', hex: '#65a30d', flavor: "Mow until the sun goes down. The lines must be straight. The grass demands symmetry." },
            { id: 'ironclad', name: 'Ironclad Build', logo: '🏗️', type: 'labor', wage: 18.00, color: 'bg-stone-700', hex: '#44403c', flavor: "Lift heavy things. Put them down. Repeat. Wear your helmet or the foreman will yell." },
            { id: 'flowmaster', name: 'Flow Master', logo: '🔧', type: 'labor', wage: 19.00, color: 'bg-cyan-700', hex: '#0e7490', flavor: "Pipes leak. You fix them. Try not to think about what is in the pipes." },
            { id: 'briskbuilders', name: 'Brisk Builders', logo: '🧱', type: 'labor', wage: 17.50, color: 'bg-orange-700', hex: '#c2410c', flavor: "Stack the bricks. Mix the mortar. Build the wall. Do not ask what we are keeping out." },
            { id: 'titanmovers', name: 'Titan Movers', logo: '📦', type: 'labor', wage: 17.00, color: 'bg-amber-700', hex: '#b45309', flavor: "Lift with your legs. Pivot. Don't drop the piano. The piano is haunted." }
        ];
        
        window.STORE_ITEMS = [
            // ITEMS
            { id: 'fidget', name: 'Ultimate Fidget Cube', cost: 24.99, icon: '🧊', desc: 'Click to reduce Stress by 0.1%. Easy to lose.', category: 'items' },
            { id: 'plush', name: 'Triton Plushie', cost: 39.99, icon: '🧸', desc: 'Emergency relief if Stress > 80%. Costs Social. Limited uses.', category: 'items' },
            { id: 'textbooks', name: 'Textbook Bundle', cost: 120.00, icon: '📚', desc: 'Passive: +1 GPA gain from all study sources.', category: 'items' },
            { id: 'rod_upgrade', name: 'Pro Rod', cost: 200.00, icon: '🎣', desc: 'High quality reel. Reduces line tension gain by 50%.', category: 'items' },
            { id: 'pearpods', name: 'Pear Pods Pro', cost: 249.99, icon: '🎧', desc: '*Unlocks Music* Listen to tunes. Lowers stress, slight distraction.', category: 'items' },
            { id: 'camera', name: 'Retro Camera', cost: 250.00, icon: '📸', desc: 'Snap a pic. +15 Social, -5 Stress daily.', category: 'items' },
            { id: 'shoes', name: 'Designer Shoes', cost: 299.99, icon: '👟', desc: 'Lowers stress passively. Lasts 5 days.', category: 'items' },
            { id: 'console', name: 'Game Station X', cost: 499.99, icon: '🕹️', desc: '*Unlocks Video Games* A better way to spend your Free Time.', category: 'items' }, // NEW
            { id: 'vr', name: 'VR Headset', cost: 899.99, icon: '🕹️' , desc: 'Escape reality. Return to monke.', category: 'items' },
            
            // PETS (New Category)
            { id: 'cat', name: 'Stray Cat', cost: 45.00, icon: '🐈‍⬛', desc: 'Low maintenance. Judgemental.', category: 'pets' },
            { id: 'fish', name: 'Aquarium Setup', cost: 99.99, icon: '🐟', desc: 'Needs daily feeding and weekly cleaning. Reduces stress if happy.', category: 'pets' },
            { id: 'dog', name: 'Rescue Dog', cost: 200.00, icon: '🐕', desc: 'High energy. Needs walks. Loves you.', category: 'pets' },
            
            // TRANSPORTATION
            { id: 'skateboard', name: 'Skateboard', cost: 149.99, icon: '🛹', desc: 'Reduces commute energy cost by 50%.', category: 'transportation' },
            { id: 'ebike', name: 'Used E-Bike', cost: 750.00, icon: '🛵', desc: 'Zero effort, but the battery is unreliable.', category: 'transportation' },
            { id: 'car', name: 'Used Car', cost: 2000.00, icon: '🚗', desc: 'Free travel, risk of repairs.', category: 'transportation' },
            
            // SUBSCRIPTIONS (NEW)
            { id: 'studyhero', name: 'StudyHero+', cost: 9.99, icon: '🧠', desc: 'Removes 1 wrong answer from quizzes. Billed weekly.', category: 'subscriptions' },
            { id: 'hotify', name: 'Hotify Premium', cost: 14.99, icon: '📛', desc: 'Skip tracks on Pear Pods. Billed weekly.', category: 'subscriptions' },
            { id: 'gym', name: 'Gym Membership', cost: 19.99, icon: '🏋️', desc: 'Access the Gym on weekdays. High stress relief. Billed weekly.', category: 'subscriptions' },
            { id: 'eyemobile', name: 'Eye-Mobile Data', cost: 24.99, icon: '👁️‍🗨️', desc: 'Unlimited scrolling. Slower energy drain. Billed weekly.', category: 'subscriptions' },
            { id: 'fishing_license', name: 'Fishing License', cost: 27.99, icon: '🎫', desc: 'Permits fishing on weekdays. Billed weekly.', category: 'subscriptions' },
            { id: 'hungrybox', name: 'Hungry Box', cost: 63.99, icon: '🍱', desc: 'Never go hungry. Food delivered daily. Billed weekly.', category: 'subscriptions' }
        ];

        window.CLUBS_DB = [
            { id: 'soccer', name: 'Soccer', icon: '⚽', days: [1, 3], desc: "Tue / Thu", group: 'TTH' },
            { id: 'basketball', name: 'Basketball', icon: '🏀', days: [1, 3], desc: "Tue / Thu", group: 'TTH' },
            { id: 'band', name: 'Leviathan', icon: '🥁', days: [0, 2], desc: "Mon / Wed", group: 'MW' },
            { id: 'theatre', name: 'Theatre Arts', icon: '🎭', days: [0, 2], desc: "Mon / Wed", group: 'MW' }
        ];

        // --- SOCIAL NPC DATA ---
        // call this to unlock in events: window.unlockContact('namehere')
        window.NPC_DB = {
            'crush':  { name: "Your Crush", title: "The Romance", icon: "❤️", desc: "Reduces Stress daily. Warning: High maintenance.", unlockText: "You finally exchanged numbers with your crush! Your heart is doing backflips. Don't be weird." },
            'sawyer': { name: "Sawyer", title: "The Brain", icon: "📒", desc: "Explains your homework in homeroom!.", unlockText: "You and Sawyer exchanged notes... and numbers. He seems like a great study buddy." },
            'collyn': { name: "Collyn", title: "The Bro", icon: "🏋️‍♂️", desc: "Can get you a gym membership.", unlockText: "After a solid workout, you and Collyn are officially gym bros. You've got his number now." },
            'matheus':{ name: "Matheus", title: "The Hacker", icon: "👾", desc: "Can hack video games.", unlockText: "Matheus was impressed by your tech skills (or lack thereof) and added you as a contact. He moves mysteriously." },
            'kingt':  { name: "King Triton", title: "The Mascot", icon: "🔱", desc: "Immunity to Academic Probation.", unlockText: "As the Ultimate Triton, you've earned the respect of the mascot himself. King Triton has graced your contacts." },
            'alan':   { name: "Alan", title: "The Wizard", icon: "🧙‍♂️", desc: "Pretty good with ebikes and spells.", unlockText: "Alan, the e-bike wizard, gave you his number after a particularly impressive wheelie. Or maybe it was a spell." },
            'mason':  { name: "Mason", title: "The Virtuoso", icon: "🎶", desc: "Might let you borrow his guitar.", unlockText: "You and Mason jammed for a bit, and he thought you were cool enough to get his number. Rock on." },
            'baptiste':{ name: "Baptiste", title: "The Mechanic", icon: "🔧", desc: "Free repairs during breakdowns.", unlockText: "After saving you from a car breakdown, Baptiste gave you his number. A useful contact to have!" },
            'nate':   { name: "Nate", title: "The Soldier", icon: "🪖", desc: "Higher daily energy recovery.", unlockText: "Your skills on the court impressed Nate. He gave you a nod of respect and his contact info." },
            'brad':   { name: "Bradley", title: "The Athlete", icon: "⚽", desc: "Will pay you to do his homework.", unlockText: "Bradley saw your potential... to help him with his homework. He's added you to his contacts." },
            'kevin':  { name: "Kevvy", title: "The Truant", icon: "⏰", desc: "Skip school penalties reduced.", unlockText: "You and Kevvy bonded over your mutual 'flexibility' with school hours. He's now in your contacts." },
            'jeff':   { name: "Jeffrey", title: "The Bad Influence", icon: "🚭", desc: "Unlocks risky but high-reward events.", unlockText: "You've entered the danger zone. Jeffrey has added you. Be careful." },
            'ophelia':{ name: "Ophelia", title: "The Networker", icon: "📲", desc: "Social meter decreases slower.", unlockText: "Ophelia, the center of the social universe, has added you to her vast network. You're in." }
        };

        

        window.FISH_LOOT_TABLE = [
            // TRASH (Weight: 30%) - Half Stress Relief (-25%)
            { id: 'boot', name: "Old Boot", type: 'trash', value: 0, weight: 15, img: "images/minigames/fishing/boot.webp", desc: "Well, at least it's not a tire." },
            { id: 'line', name: "Tangled Line", type: 'trash', value: 0, weight: 15, img: "images/minigames/fishing/line.webp", desc: "A frustrating mess of nylon." },
            
            // COMMON (Weight: 50%) - Normal Stress Relief (-50%)
            { id: 'bass', name: "Largemouth Bass", type: 'common', value: 10, weight: 20, img: "images/minigames/fishing/bass.webp", desc: "A solid catch." },
            { id: 'perch', name: "Yellow Perch", type: 'common', value: 8, weight: 15, img: "images/minigames/fishing/perch.webp", desc: "Small but spirited." },
            { id: 'pickerel', name: "Chain Pickerel", type: 'common', value: 12, weight: 15, img: "images/minigames/fishing/pickerel.webp", desc: "Watch out for those teeth." },

            // RARE (Weight: 15%) - Bonus Stress Relief (-75%)
            { id: 'striper', name: "Striped Bass", type: 'rare', value: 30, weight: 5, img: "images/minigames/fishing/striper.webp", desc: "A prized catch!" },
            { id: 'bluefish', name: "Bluefish", type: 'rare', value: 25, weight: 5, img: "images/minigames/fishing/bluefish.webp", desc: "Fights hard and bites harder." },
            { id: 'trout', name: "Lake Trout", type: 'rare', value: 35, weight: 5, img: "images/minigames/fishing/trout.webp", desc: "A beautiful specimen from the deep." },

            // LEGENDARY (Weight: 5%) - Special Effects
            { id: 'goldfish', name: "Golden Fish", type: 'legendary', value: 300, weight: 1, img: "images/minigames/fishing/goldfish.webp", desc: "You have a sudden urge to feed this to a cat." },
            { id: 'harpoon', name: "Old Harpoon", type: 'legendary', value: 200, weight: 1, img: "images/minigames/fishing/harpoon.webp", desc: "An antique from a bygone era." },
            { id: 'scallops', name: "Box of Scallops", type: 'legendary', value: 50, weight: 1, img: "images/minigames/fishing/scallops.webp", desc: "Weird that they're already boxed and frozen...", effect: 'hunger' },
            { id: 'note', name: "Strange Note", type: 'legendary', value: 100, weight: 1, img: "images/minigames/fishing/note.webp", desc: "'IOU 1 Fish.' There is a $100 bill clipped to it.", effect: 'cash_only' },
            
            // SPECIAL (Conditional)
            { id: 'pearpods', name: "Pear Pods Pro", type: 'special', value: 0, weight: 1, img: "images/minigames/fishing/pearpods.webp", desc: "You reeled in a pair of Pear Pods! Hopefully they still work.", effect: 'unlock' }
        ];

        window.DAILY_EVENT_DB = [
            
            //start eventhide tabs
            // --- JEFFREY ARC EVENTS ---
            {
                id: 'jeff_skip',
                req: 'school',
                type: 'jeff',
                title: "SKIP DAY",
                text: "Jeffrey pulls up in his beat-up sedan. 'Get in. We're going to the arcade instead of Bio.'",
                icon: "🚗",
                choices: [
                    { label: "Let's Ride", effects: { stress: -20, grades: -5 }, resultTitle: "HIGH SCORE", resultText: "You beat the high score on Pac-Man. You failed the Bio quiz." },
                    { label: "Can't Today", effects: { stress: 5, grades: 2 }, resultTitle: "RESPONSIBLE", resultText: "You went to class. Jeff called you a nerd." }
                ]
            },
            {
                id: 'jeff_vandal',
                req: 'school',
                type: 'jeff',
                title: "ART PROJECT",
                text: "Jeff hands you a spray paint can. 'Let's improve the mascot mural.'",
                icon: "🎨",
                choices: [
                    { label: "Tag It", effects: { stress: -10, cash: -50 }, resultTitle: "VANDALISM", resultText: "It looked cool until the janitor caught you. Fine: $50." },
                    { label: "Stop Him", effects: { stress: 5 }, resultTitle: "SAVED", resultText: "You convinced him to draw on paper instead." }
                ]
            },
            {
                id: 'jeff_prank',
                req: 'school',
                type: 'jeff',
                title: "THE PRANK",
                text: "Jeff wants to release three pigs in the school labeled 1, 2, and 4.",
                icon: "🐷",
                choices: [
                    { label: "Legendary", effects: { stress: -15, grades: -2 }, resultTitle: "CHAOS", resultText: "The teachers are still looking for Pig #3." },
                    { label: "Too Risky", effects: { stress: 0 }, resultTitle: "NOPE", resultText: "You talked him out of it. The pigs were returned to the farm." }
                ]
            },
            {
                id: 'jeff_fireworks',
                req: 'school',
                type: 'jeff',
                title: "FIREWORKS",
                text: "Jeff found illegal fireworks. 'Roof of the gym. Midnight. Be there.'",
                icon: "🎆",
                choices: [
                    { label: "Lit", effects: { energy: -20, stress: -20 }, resultTitle: "BOOM", resultText: "It was beautiful. You are exhausted today though." },
                    { label: "Dangerous", effects: { energy: 10 }, resultTitle: "SLEEP", resultText: "You slept instead. You heard sirens later." }
                ]
            },
            {
                id: 'jeff_gamble',
                type: 'jeff',
                title: "POKER NIGHT",
                text: "Jeff is hosting a high-stakes poker game in his basement.",
                icon: "🃏",
                choices: [
                    { label: "All In", effects: { cash: -50, stress: 10 }, resultTitle: "LOST IT ALL", resultText: "You lost $50. Jeff bought pizza with your money." },
                    { label: "Fold", effects: { cash: 0 }, resultTitle: "WATCHING", resultText: "You watched them lose money. Smart move." }
                ]
            },
            {
                id: 'jeff_concert',
                type: 'jeff',
                title: "THE GIG",
                text: "Jeff's band 'Electric Toaster' is playing a dive bar on a school night.",
                icon: "🎸",
                choices: [
                    { label: "Mosh Pit", effects: { energy: -30, stress: -30 }, resultTitle: "DEAF", resultText: "Your ears are ringing. Worth it." },
                    { label: "Study", effects: { grades: 5 }, resultTitle: "BORING", resultText: "You studied. Jeff says the show sucked anyway." }
                ]
            },
            {
                id: 'jeff_crypto',
                type: 'jeff',
                title: "CRYPTO KING",
                text: "Jeff wants you to invest in 'SlugCoin2'. He says it's going to the moon.",
                icon: "📉",
                choices: [
                    { label: "Invest", effects: { cash: -20 }, resultTitle: "RUG PULL", resultText: "The value went to zero in 10 minutes." },
                    { label: "Scam", effects: { cash: 0 }, resultTitle: "SAVED", resultText: "You explained Ponzi schemes to him." }
                ]
            },
            {
                id: 'jeff_fight',
                type: 'jeff',
                title: "FIGHT CLUB",
                text: "Someone insulted Jeff's leather jacket. He wants backup.",
                icon: "👊",
                choices: [
                    { label: "Fight", effects: { energy: -20, stress: 20 }, resultTitle: "BLACK EYE", resultText: "You won, but you hurt." },
                    { label: "De-escalate", effects: { stress: -5 }, resultTitle: "PEACE", resultText: "You talked them down. Jeff is annoyed but safe." }
                ]
            },
            {
                id: 'jeff_steal',
                type: 'choice',
                title: "FIVE FINGER DISCOUNT",
                text: "Jeff dares you to steal a candy bar from Henton's.",
                icon: "🍫",
                choices: [
                    { label: "Steal It", effects: { stress: 10, hungerSet: 1 }, resultTitle: "THIEF", resultText: "The guilt tastes worse than the chocolate." },
                    { label: "Pay for it", effects: { cash: -2 }, resultTitle: "HONEST", resultText: "You bought it for him. He rolled his eyes." }
                ]
            },
            {
                id: 'jeff_hack',
                req: 'school',
                type: 'choice',
                title: "GRADE HACK",
                text: "Jeff knows a guy who can change your grades in the system.",
                icon: "💻",
                choices: [
                    { label: "Do it", effects: { grades: -10 }, resultTitle: "CAUGHT", resultText: "They tracked the IP. Massive penalty." },
                    { label: "Study", effects: { grades: 2 }, resultTitle: "REAL WORK", resultText: "You earned the grade yourself." }
                ]
            },
            {
                id: 'loiterer',
                req: 'school',
                type: 'choice',
                title: "BEHIND THE GYM",
                text: "You spot a guy in a leather jacket loitering behind the bleachers. He offers you a 'smoke'.",
                icon: "🚬",
                choices: [
                    {
                        label: "Accept",
                        effects: { stress: -20, energy: -10 },
                        resultTitle: "COUGHING",
                        resultText: "It tasted terrible, but you feel rebellious. You exchanged numbers."
                    },
                    {
                        label: "Narc",
                        effects: { stress: 5, grades: 2 },
                        resultTitle: "TOLD ON HIM",
                        resultText: "You told the principal. You feel morally superior but socially isolated."
                    }
                ]
            },

            //Normal Events (No Req)
            // --- NEW: POSITIVE / NEUTRAL DAILY EVENTS (8) ---
            {
                id: 'good_playlist',
                type: 'passive',
                title: "NEW FAVORITE SONG",
                text: "The algorithm recommended a song that perfectly matches your exact vibe today.",
                icon: "🎧",
                btn: "Vibe",
                effects: { stress: -10 },
                result: "You put it on repeat for three hours."
            },
            {
                id: 'perfect_weather',
                type: 'passive',
                title: "PERFECT WEATHER",
                text: "It's exactly 72 degrees with a light breeze and zero humidity. The world is beautiful.",
                icon: "☀️",
                btn: "Bask",
                effects: { energy: 10, stress: -5 },
                result: "You actually enjoyed being outside for once."
            },
            {
                id: 'free_sample',
                type: 'choice',
                title: "FREE SAMPLE",
                text: "A mall kiosk worker aggressively offers you a piece of teriyaki chicken on a toothpick.",
                icon: "🍗",
                choices: [
                    {
                        label: "Eat it",
                        effects: { hungerSet: 1, energy: 5 },
                        resultTitle: "TASTY",
                        resultText: "Surprisingly good, though you feel guilty for not buying any."
                    },
                    {
                        label: "Avoid Eye Contact",
                        effects: { stress: -2 },
                        resultTitle: "AWKWARD",
                        resultText: "You speed-walked past them staring at your phone."
                    }
                ]
            },
            {
                id: 'friendly_dog',
                type: 'passive',
                title: "FRIENDLY DOG",
                text: "A golden retriever bumped its head against your leg and demanded pets.",
                icon: "🐕",
                btn: "Pet",
                effects: { stress: -15 },
                result: "All your worldly troubles vanished for 45 seconds."
            },
            {
                id: 'green_lights',
                type: 'passive',
                title: "GREEN LIGHTS",
                text: "You hit every single green light on your commute. You feel like a master of time and space.",
                icon: "🚥",
                btn: "Speed",
                effects: { energy: 5, stress: -5 },
                result: "You arrived 4 minutes early."
            },
            {
                id: 'jacket_money',
                type: 'passive',
                title: "FORGOTTEN WEALTH",
                text: "You put on a jacket you haven't worn in months and found a crumpled $10 bill in the pocket.",
                icon: "🧥",
                btn: "Score",
                effects: { cash: 10 },
                result: "Past-you is looking out for present-you."
            },
            {
                id: 'flash_sale',
                type: 'choice',
                title: "FLASH SALE",
                text: "Your favorite online store is having a massive 24-hour clearance sale.",
                icon: "🛍️",
                choices: [
                    {
                        label: "Treat Yourself",
                        effects: { cash: -25, stress: -20 },
                        resultTitle: "RETAIL THERAPY",
                        resultText: "You bought some cool stuff you probably didn't need."
                    },
                    {
                        label: "Save Money",
                        effects: { stress: 5 },
                        resultTitle: "RESPONSIBLE",
                        resultText: "You closed the tab, but you keep thinking about that shirt."
                    }
                ]
            },
            {
                id: 'good_hair',
                type: 'passive',
                title: "GOOD HAIR DAY",
                text: "Your hair dried perfectly today without you even trying. You look like a protagonist.",
                icon: "✨",
                btn: "Flawless",
                effects: { stress: -10, social: 5 },
                result: "You caught yourself looking in every reflective surface."
            },

            // --- NEW: MINOR NEGATIVE EVENTS (10) ---
            {
                id: 'stubbed_toe',
                type: 'passive',
                title: "OOF",
                text: "You stubbed your pinky toe on the bed frame. You saw the cosmos for a second.",
                icon: "🦶",
                btn: "Hobble",
                effects: { stress: 10, energy: -5 },
                result: "You had to walk with a slight limp all morning."
            },
            {
                id: 'spilled_coffee',
                type: 'passive',
                title: "SPILL",
                text: "You bumped the table and spilled your drink right on your lap.",
                icon: "☕",
                btn: "Sigh",
                effects: { stress: 15 },
                result: "You had to dry it under the bathroom hand dryer."
            },
            {
                id: 'forgot_umbrella',
                type: 'choice',
                title: "SUDDEN DOWNPOUR",
                text: "It started pouring rain and you don't have an umbrella.",
                icon: "🌧️",
                choices: [
                    {
                        label: "Run For It",
                        effects: { energy: -15, stress: 10 },
                        resultTitle: "SOAKED",
                        resultText: "You sprinted all the way there. You are absolutely drenched."
                    },
                    {
                        label: "Wait it out",
                        effects: { energy: -5, stress: 5 },
                        resultTitle: "LATE",
                        resultText: "You stood under an awning for 20 minutes."
                    }
                ]
            },
            {
                id: 'weird_smell',
                type: 'passive',
                title: "PHANTOM SMELL",
                text: "There is a terrible smell following you today. Did you step in something? Is it you?",
                icon: "👃",
                btn: "Paranoia",
                effects: { stress: 10 },
                result: "You kept subtly sniffing your own shirt."
            },
            {
                id: 'spam_calls',
                type: 'passive',
                title: "SCAM LIKELY",
                text: "You received 6 spam calls in a row regarding your car's extended warranty.",
                icon: "📱",
                btn: "Block",
                effects: { stress: 10 },
                result: "Your phone won't stop vibrating."
            },
            {
                id: 'bird_poop',
                type: 'passive',
                title: "BOMBS AWAY",
                text: "A pigeon scored a direct hit on your shoulder. They say it's good luck. It doesn't feel like it.",
                icon: "🕊️",
                btn: "Wipe it",
                effects: { stress: 20 },
                result: "You had to use a rough paper towel to get it off."
            },
            {
                id: 'long_line',
                type: 'choice',
                title: "LONG LINE",
                text: "You just wanted a quick snack, but the checkout line is moving at a snail's pace.",
                icon: "🛒",
                choices: [
                    {
                        label: "Wait it out",
                        effects: { energy: -10, stress: 5 },
                        resultTitle: "PATIENT",
                        resultText: "You waited 15 minutes just to buy a bag of chips."
                    },
                    {
                        label: "Leave",
                        effects: { stress: 10 },
                        resultTitle: "FRUSTRATED",
                        resultText: "You left empty-handed and annoyed."
                    }
                ]
            },
            {
                id: 'bug_bite',
                type: 'passive',
                title: "MYSTERY BITE",
                text: "You woke up with a huge, incredibly itchy bug bite on your ankle.",
                icon: "🦟",
                btn: "Scratch",
                effects: { stress: 10 },
                result: "You've been reaching down to scratch it all day."
            },
            {
                id: 'stepped_gum',
                type: 'passive',
                title: "STICKY",
                text: "You stepped in a huge wad of fresh pink gum.",
                icon: "👟",
                btn: "Scrape",
                effects: { stress: 15, energy: -5 },
                result: "You spent 10 minutes scraping it off on a curb."
            },
            {
                id: 'loud_neighbor',
                type: 'passive',
                title: "BASS DROP",
                text: "Someone nearby played loud EDM music until 3 AM last night. You slept terribly.",
                icon: "🔊",
                btn: "Yawn",
                effects: { energy: -20, stress: 15 },
                result: "You are running entirely on caffeine today."
            },

            // --- NEW: SEVERE NEGATIVE EVENTS (5) ---
            {
                id: 'fraud_alert',
                type: 'choice',
                title: "FRAUD ALERT",
                text: "Your bank texted you about a suspicious $150 charge at 'Dave's Jet Ski Emporium'.",
                icon: "💳",
                choices: [
                    {
                        label: "Panic Cancel",
                        effects: { stress: 40, cash: -30 },
                        resultTitle: "LOCKED OUT",
                        resultText: "You cancelled the card, but they still got away with $30. Now you have no debit card for a week."
                    },
                    {
                        label: "Call Bank",
                        effects: { energy: -30, stress: 30 },
                        resultTitle: "ON HOLD",
                        resultText: "You spent two hours on hold. They reversed the charge, but you are mentally drained."
                    }
                ]
            },
            {
                id: 'dropped_phone',
                type: 'choice',
                title: "SHATTERED",
                text: "Your phone slipped from your hand and fell perfectly flat on the concrete.",
                icon: "📱",
                choices: [
                    {
                        label: "Pay for Repair",
                        effects: { cash: -100, stress: 10 },
                        resultTitle: "EXPENSIVE",
                        resultText: "The screen is fixed, but your wallet is crying."
                    },
                    {
                        label: "Live with it",
                        effects: { stress: 30 },
                        resultTitle: "GLASS SHARDS",
                        resultText: "You cut your thumb a little bit every time you swipe."
                    }
                ]
            },
            {
                id: 'toothache',
                type: 'choice',
                title: "TOOTHACHE",
                text: "You bit into something and felt a sharp, agonizing pain in your back molar.",
                icon: "🦷",
                choices: [
                    {
                        label: "Go to Dentist",
                        effects: { cash: -150, energy: -20 },
                        resultTitle: "CAVITY",
                        resultText: "They drilled it. It was expensive, loud, and awful."
                    },
                    {
                        label: "Ignore it",
                        effects: { stress: 50, energy: -10 },
                        resultTitle: "THROBBING",
                        resultText: "The pain is distracting you from literally everything."
                    }
                ]
            },
            {
                id: 'lost_wallet',
                type: 'passive',
                title: "PANIC ATTACK",
                text: "You couldn't find your wallet. You tore your room apart, cancelled a card, and then found it in your fridge.",
                icon: "🥶",
                btn: "Idiot",
                effects: { stress: 45, energy: -20 },
                result: "Your heart rate was 140bpm for an hour."
            },
            {
                id: 'ticket',
                type: 'passive',
                title: "CITATION",
                text: "You parked in a 'Loading Zone' for exactly 4 minutes. A meter maid materialized out of nowhere.",
                icon: "🎟️",
                btn: "Pay Up",
                effects: { cash: -75, stress: 25 },
                result: "You got a $75 parking ticket. Day ruined."
            },
            {
                id: 'grandma',
                type: 'passive',
                title: "GRANDMA'S LETTER",
                text: "You received a physical letter from your grandma. It smells like lavender and contains a crisp bill.",
                icon: "✉️",
                btn: "Thanks Grandma",
                effects: { cash: 25, stress: -5 },
                result: "You feel loved and richer."
            },
            {
                id: 'subtrap',
                type: 'passive',
                title: "SUBSCRIPTION TRAP",
                text: "You forgot to cancel the 7-day free trial for 'Premium Birdwatching App'. The charge just hit.",
                icon: "📱",
                btn: "Oof",
                effects: { cash: -14.99, stress: 5 },
                result: "You canceled it immediately, but the money is gone."
            },
            {
                id: 'squirrel',
                type: 'passive',
                title: "REJOICE!",
                text: "A squirrel climbed on your shoulder and handed you an acorn. You are the Chosen One.",
                icon: "🐿️",
                btn: "Accept",
                effects: { stress: -20, grantAcorn: true },
                result: "You have been blessed."
            },
            {
                id: 'traveler',
                type: 'choice',
                title: "TIME TRAVELER",
                text: "A disheveled person grabs your shoulders, eyes wide with panic.<br><br>'WHAT YEAR IS IT?!'",
                icon: "⏳",
                choices: [
                    {
                        label: "Tell the Truth",
                        effects: { stress: 5 },
                        resultTitle: "HE SCREAMS",
                        resultText: "He screams in horror and vanishes into thin air."
                    },
                    {
                        label: "Lie (Say 1999)",
                        effects: { stress: -5 },
                        resultTitle: "RELIEF",
                        resultText: "You tell him it's 1999. He sighs in relief, hands you a slap bracelet, and walks away."
                    }
                ]
            },
            {
                id: 'gym',
                type: 'choice',
                title: "GYM GUILT",
                text: "You haven't been to the gym in... a while. Do you go for a run or binge watch a show?",
                icon: "🏃",
                choices: [
                    {
                        label: "Go for Run",
                        effects: { energy: -15, stress: -15 },
                        resultTitle: "WORKOUT",
                        resultText: "You regret it for the first mile, but feel great afterwards."
                    },
                    {
                        label: "Watch TV",
                        effects: { energy: 5, stress: 5 },
                        resultTitle: "NETFLIX",
                        resultText: "You watch 6 episodes of a show you've seen twice before."
                    }
                ]
            },                                      
            {
                id: 'pyramid',
                type: 'choice',
                title: "OPPORTUNITY?",
                text: "An old high school acquaintance DM's you about a 'business opportunity' selling essential oils. #BossBabe",
                icon: "📉",
                choices: [
                    {
                        label: "Invest ($50)",
                        effects: { cash: -50, stress: 20 },
                        resultTitle: "IT'S A SCAM",
                        resultText: "No one wants to buy 'Musk of Despair'. You realize your mistake immediately."
                    },
                    {
                        label: "Block Them",
                        effects: { stress: -5 },
                        resultTitle: "BLOCKED",
                        resultText: "You block them instantly. You feel smarter already."
                    }
                ]
            },
            {
                id: 'puddle',
                type: 'passive',
                title: "PUDDLE OF DOOM",
                text: "You stepped in a puddle that was much deeper than it looked. Your socks are squishy.",
                icon: "💧",
                btn: "Gross",
                effects: { stress: 15, energy: -5 },
                result: "You squelch all the way home."
            },
            {
                id: 'nocharger',
                type: 'passive',
                title: "1% BATTERY",
                text: "You forgot your phone charger. You spend the whole day in battery saver mode anxiety.",
                icon: "🪫",
                btn: "Panic",
                effects: { stress: 5 },
                result: "Your phone died right before the bus ride home."
            },
            
            {
                id: 'ootd',
                type: 'passive',
                title: "FIT CHECK",
                text: "You wore that new shirt today. Three different people complimented you.",
                icon: "👕",
                btn: "Strut",
                effects: { stress: -10 },
                result: "Confidence is at an all-time high."
            },
            {
                id: 'crushtext',
                type: 'passive',
                title: "NEW MESSAGE",
                text: "Your crush liked your story. This is not a drill.",
                icon: "❤️",
                btn: "Panic",
                effects: { stress: -10, energy: 5 },
                result: "You spent 30 minutes analyzing the meaning."
            },            
            {
                id: 'penexplosion',
                type: 'passive',
                title: "INK DISASTER",
                text: "Your pen exploded in your pocket. You look like a blue dalmatian.",
                icon: "🖊️",
                btn: "Scrub",
                effects: { stress: 10 },
                result: "The stain is permanent."
            },
            {
                id: 'scholarship',
                type: 'passive',
                title: "MERIT GRANT",
                text: "You won a local essay contest you forgot you entered! A check arrived in the mail.",
                icon: "🎓",
                btn: "Incredible",
                effects: { cash: 150, stress: -20, grades: 5 },
                result: "Financial pressure relief: Acquired."
            },
            //School Events (School Req)
            {
                id: 'closetab',
                req: 'school',
                type: 'passive',
                title: "CLOSED TAB",
                text: "Tech closed one of your tabs.\nSure, you were playing Snake, but you're still furious.",
                icon: "🐍",
                btn: "Thanks Mike!",
                effects: {stress: +10 },
                result: "You Google 'snKAe gme' and try again..."
            },            
            {
                id: 'banned',
                req: 'school',
                type: 'passive',
                title: "BANNED!",
                text: "You said something you shouldn't have in class. Your teacher threw a cheese block at you.",
                icon: "🧀",
                btn: "Ouch",
                effects: { grades: -2, stress: 15 },
                result: "You have been disciplined."
            },
            {
                id: 'mime',
                req: 'school',
                type: 'passive',
                title: "MIME ATTACK",
                text: "A mime trapped you in an invisible box on your way to class. You couldn't find the invisible door for 20 minutes.",
                icon: "🤡",
                btn: "Escaped",
                effects: { grades: -5, stress: 10 },
                result: "It was humiliating."
            },
            {
                id: 'meat',
                req: 'school',
                type: 'choice',
                title: "MYSTERY MEAT",
                text: "The cafeteria is serving 'Shepherd's Surprise'. It is glowing slightly.",
                icon: "🍖",
                choices: [
                    {
                        label: "Eat It",
                        effects: { energy: -10, hungerSet: 2 },
                        resultTitle: "DIGESTING",
                        resultText: "It tastes like... static? But you are full."
                    },
                    {
                        label: "Starve",
                        effects: { stress: 5, hungerSet: 0 },
                        resultTitle: "SKIPPED",
                        resultText: "You decide not to risk it. Your stomach growls in protest."
                    }
                ]
            },
            {
                id: 'substitute',
                req: 'school',
                type: 'passive',
                title: "SUBSTITUTE TEACHER",
                text: "Your hardest teacher is out sick. The sub put on a movie from 2004.",
                icon: "📺",
                btn: "Chill",
                effects: { stress: -5, energy: 5 },
                result: "Easiest class of the year."
            },
            {
                id: 'extrafries',
                req: 'school',
                type: 'passive',
                title: "CURLY FRIES",
                text: "The cafeteria worker gave you an extra scoop of curly fries. They whispered, 'Take it, kid.'",
                icon: "🍟",
                btn: "Score",
                effects: { energy: 5, hungerSet: 1 },
                result: "A small victory for the stomach."
            },
            {
                id: 'hallwaytrip',
                req: 'school',
                type: 'passive',
                title: "THE STUMBLE",
                text: "You tripped over your own shoelace in the main hallway. Everyone saw. Even the cool seniors.",
                icon: "👟",
                btn: "Recover",
                effects: { stress: 10 },
                result: "You played it off as a dance move, but nobody bought it."
            },
            {
                id: 'firedrill',
                req: 'school',
                type: 'choice',
                title: "FIRE DRILL",
                text: "The alarm goes off during a test. It's obviously a drill, but it's freezing outside.",
                icon: "🔥",
                choices: [
                    {
                        label: "Stand Outside",
                        effects: { energy: -5, stress: -5 }, // Break from test
                        resultTitle: "FRESH AIR",
                        resultText: "You got a break from the test, but you're shivering."
                    },
                    {
                        label: "Hide in Bathroom",
                        effects: { stress: 10 },
                        resultTitle: "CAUGHT",
                        resultText: "A teacher found you. You got detention for 'endangering safety'."
                    }
                ]
            },
            {
                id: 'foundcash',
                req: 'school',
                type: 'passive',
                title: "GROUND SCORE",
                text: "You found a crumpled five-dollar bill in the vending machine return slot.",
                icon: "💵",
                btn: "Yoink",
                effects: { cash: 5, stress: -2 },
                result: "Lunch is on the floor today."
            },
            {
                id: 'guminhair',
                req: 'school',
                type: 'passive',
                title: "STICKY SITUATION",
                text: "Someone stuck gum under the desk. You leaned back. Now it's in your hair.",
                icon: "💇",
                btn: "Gross",
                effects: { stress: 10, energy: -5 },
                result: "You spent an hour scrubbing it out with peanut butter."
            },
            {
                id: 'dreamteam',
                req: 'school',
                type: 'passive',
                title: "DREAM TEAM",
                text: "For the group project, you got paired with the smartest kids in class.",
                icon: "🤓",
                btn: "Coast",
                effects: { grades: 3, energy: 5 },
                result: "You did the title slide. They did the rest."
            },
            {
                id: 'buslate',
                req: 'school',
                type: 'passive',
                title: "SCHEDULE CHANGE",
                text: "The bus didn't show up for 40 minutes. You had to stand in the rain.",
                icon: "🚌",
                btn: "Sigh",
                effects: { energy: -10, stress: 5 },
                result: "You finally got home, soaked and tired."
            },
            {
                id: 'wifidown',
                req: 'school',
                type: 'passive',
                title: "NO CONNECTION",
                text: "Campus Wi-Fi went down. You actually had to... read a physical book.",
                icon: "📶",
                btn: "Bored",
                effects: { stress: 5, grades: 1 },
                result: "You learned something, but at what cost?"
            },
            {
                id: 'sneeze',
                req: 'school',
                type: 'passive',
                title: "SPLASH ZONE",
                text: "A stranger sneezed directly on you in the hallway. You feel spiritual unclean.",
                icon: "🤧",
                btn: "Ew",
                effects: { stress: 5, energy: -5 },
                result: "You used half a bottle of hand sanitizer."
            },
            {
                id: 'masterpiece',
                req: 'school',
                type: 'passive',
                title: "ACCIDENTAL ART",
                text: "Your doodle in the margins of your notes is actually kind of fire.",
                icon: "🎨",
                btn: "Nice",
                effects: { stress: -5 },
                result: "You framed it on your fridge."
            },
            {
                id: 'gymhero',
                req: 'school',
                type: 'choice',
                title: "DODGEBALL",
                text: "It's dodgeball day in gym class. You are the last one standing on your team.",
                icon: "🏐",
                choices: [
                    {
                        label: "Go for Glory",
                        effects: { energy: -10, stress: -10 },
                        resultTitle: "CLUTCH",
                        resultText: "You caught the ball! Your team wins!"
                    },
                    {
                        label: "Take the Hit",
                        effects: { energy: -2, stress: 5 },
                        resultTitle: "OUT",
                        resultText: "You got hit in the face immediately."
                    }
                ]
            },
            {
                id: 'lockersmell',
                req: 'school',
                type: 'passive',
                title: "MYSTERY STENCH",
                text: "Something in your locker has gone bad. Very bad. It might be sentient.",
                icon: "🤢",
                btn: "Clean it",
                effects: { stress: 5, energy: -5 },
                result: "It was a banana from last semester."
            },
            {
                id: 'wrongclass',
                req: 'school',
                type: 'passive',
                title: "WRONG ROOM",
                text: "You sat in the wrong classroom for 20 minutes before realizing it was AP Calculus.",
                icon: "what",
                btn: "Leave",
                effects: { stress: 5 },
                result: "You snuck out the back door."
            },
            {
                id: 'freeperiod',
                req: 'school',
                type: 'passive',
                title: "FREE PERIOD",
                text: "Assembly was cancelled. You have an hour of free time.",
                icon: "⏰",
                btn: "Relax",
                effects: { energy: 10 },
                result: "You took a power nap in the library."
            },
            {
                id: 'popquiz',
                req: 'school',
                type: 'choice',
                title: "POP QUIZ",
                text: "Teacher announces a surprise quiz. You didn't read the chapter.",
                icon: "📝",
                choices: [
                    {
                        label: "Guess C",
                        effects: { grades: -2, stress: 5 },
                        resultTitle: "C FOR COOKIE",
                        resultText: "It wasn't C. It was never C."
                    },
                    {
                        label: "Cheat (Look over)",
                        effects: { grades: 5, stress: 20 }, // High risk flavor
                        resultTitle: "SNEAKY",
                        resultText: "You got away with it, but you're sweating bullets."
                    }
                ]
            },
            {
                id: 'plagiarism',
                req: 'school',
                type: 'choice',
                title: "PLAGIARISM SCARE",
                text: "Turnitin.com flagged your paper as 98% AI generated. You wrote it yourself!",
                icon: "🤖",
                choices: [
                    {
                        label: "Fight It",
                        effects: { stress: 30, energy: -20, grades: 5 }, // Kept grade, lost sanity
                        resultTitle: "VINDICATED",
                        resultText: "You showed your draft history. The teacher apologized, but you're exhausted."
                    },
                    {
                        label: "Accept Zero",
                        effects: { grades: -15, stress: -5 }, // Save stress, lose grade
                        resultTitle: "GAVE UP",
                        resultText: "You didn't have the energy to fight. Your GPA took a massive hit."
                    }
                ]
            },
            {
                id: 'viralvideo',
                req: 'school',
                type: 'passive',
                title: "CAMPUS CELEBRITY",
                text: "A video of you catching a falling tray in the cafeteria went viral. You are a legend.",
                icon: "🤳",
                btn: "Famous",
                effects: { stress: -40, energy: 20 },
                result: "Everyone is high-fiving you. You feel invincible."
            },
            {
                id: 'bluescreen',
                req: 'school',
                type: 'passive',
                title: "BLUE SCREEN",
                text: "Your laptop died. The hard drive is corrupted. Your term paper is gone.",
                icon: "💻",
                btn: "Scream",
                effects: { cash: -80, stress: 30, grades: -5 },
                result: "You paid for data recovery, but the paper was lost. You have to start over."
            },
            {
                id: 'fieldday',
                req: 'school',
                type: 'choice',
                title: "SKIP DAY",
                text: "The entire class is skipping to go to the beach. If you go, you miss a major review session.",
                icon: "🏖️",
                choices: [
                    {
                        label: "Go to Beach",
                        effects: { stress: -50, grades: -10 },
                        resultTitle: "BEST DAY EVER",
                        resultText: "You made memories that will last forever. You also failed the chem test."
                    },
                    {
                        label: "Stay & Study",
                        effects: { grades: 10, stress: 10 },
                        resultTitle: "RESPONSIBLE",
                        resultText: "The school was empty. You learned a lot, but you feel lonely."
                    }
                ]
            },
            {
                id: 'voidstare',
                req: 'school',
                type: 'passive',
                title: "THE VOID",
                text: "You stared into the middle distance during Math class. For a second, the distance stared back.",
                icon: "👁️",
                btn: "Blink",
                effects: { stress: 10, energy: -5 },
                result: "You feel smaller than you did this morning."
            },
            {
                id: 'forgottenlocker',
                req: 'school',
                type: 'passive',
                title: "LOCKER 666",
                text: "You opened your locker, but it wasn't your locker. It was full of moss and old letters addressed to 'The Keeper'.",
                icon: "🔒",
                btn: "Close it",
                effects: { stress: 15 },
                result: "You closed it. When you opened it again, your books were back. They smell like damp earth."
            },
            {
                id: 'shadowfriend',
                req: 'school',
                type: 'choice',
                title: "SHADOW FRIEND",
                text: "Your shadow is moving independently of your body today. It keeps miming for you to skip class.",
                icon: "👤",
                choices: [
                    {
                        label: "Obey Shadow",
                        effects: { grades: -5, stress: -10 },
                        resultTitle: "LIBERATED",
                        resultText: "You skipped class. Your shadow seems pleased. It is slightly taller now."
                    },
                    {
                        label: "Ignore It",
                        effects: { stress: 10, energy: -5 },
                        resultTitle: "DISOBEDIENCE",
                        resultText: "You went to class. Your shadow spent the whole hour tripping people."
                    }
                ]
            },
            {
                id: 'glitch',
                req: 'school',
                type: 'passive',
                title: "TEXTURE ERROR",
                text: "The texture of the cafeteria pizza didn't load. It's just a purple and black checkerboard square.",
                icon: "🟪",
                btn: "Eat it?",
                effects: { hungerSet: 2, stress: 5 },
                result: "It tasted like static and static electricity. You are full, but confused."
            },
            {
                id: 'fog',
                req: 'school',
                type: 'passive',
                title: "THE FOG",
                text: "A dense fog rolled into the gymnasium during the pep rally. No one else seemed to notice the glowing eyes in the rafters.",
                icon: "🌫️",
                btn: "Ignore",
                effects: { stress: 20 },
                result: "You clapped along with the cheerleaders, but you kept one eye on the ceiling."
            },
            // --- CUSTOM EVENTS ---
            {
                id: 'dresscode',
                req: 'school',
                type: 'choice',
                title: "DRESS CODED",
                text: "You got caught by Mr. A in the hallway with your hoodie on.",
                icon: "🧥",
                choices: [
                    {
                        label: "Run Away",
                        effects: { energy: -10, grades: -5, stress: 10 },
                        resultTitle: "FUGITIVE",
                        resultText: "You escaped, but now you have to hide every time you see him."
                    },
                    {
                        label: "Take Punishment",
                        effects: { stress: 15 }, // "Lose stress" usually means "Gain Stress" in context of punishment
                        resultTitle: "DETENTION",
                        resultText: "You took the detention slip. At least your conscience is clear."
                    }
                ]
            },
            {
                id: 'leviathan',
                req: 'school',
                type: 'passive',
                title: "LEVIATHAN CONCERT",
                text: "Leviathan played a surprise concert in the gym today. There was an actual mosh pit.",
                icon: "🎸",
                btn: "Mosh",
                effects: { energy: -30, stress: -50 },
                result: "You are exhausted, bruised, and incredibly happy."
            },
            {
                id: 'ultimatetriton',
                req: 'school',
                type: 'passive',
                title: "UNITED AWARDS",
                text: "You were voted the Ultimate Triton! Everyone is cheering for you.",
                icon: "🏆",
                btn: "Humble Bow",
                effects: { stress: -20, grades: 10 },
                result: "This will look great on your resume."
            },
            {
                id: 'stolenlife',
                req: 'school',
                type: 'passive',
                title: "STOLEN LIFE",
                text: "Someone stole your Chromebook charger while you were in the bathroom.",
                icon: "🔌",
                btn: "Why me?",
                effects: { stress: 20, grades: -5 },
                result: "You had to borrow one from the library, but it was already dead."
            },
            {
                id: 'yondr',
                req: 'school',
                type: 'choice',
                title: "YONDR JAILBREAK",
                text: "A classmate offers to use a magnet to break open your Yondr pouch.",
                icon: "🧲",
                choices: [
                    {
                        label: "Do it",
                        effects: { stress: 15, grades: -5 }, // Stress from fear of getting caught
                        resultTitle: "FREEDOM?",
                        resultText: "You got your phone back, but you spent the whole period hiding it under the desk."
                    },
                    {
                        label: "Nah",
                        effects: { stress: -5, grades: 5 }, // Relief from not risking it
                        resultTitle: "FOCUSED",
                        resultText: "You actually paid attention in class. It was weird."
                    }
                ]
            },
            {
                id: 'blownfuse',
                req: 'school',
                type: 'passive',
                title: "BLOWN FUSE",
                text: "Someone in the STEM Academy blew a main fuse working on their capstone. Half the day's classes were cancelled.",
                icon: "💥",
                btn: "Sweet",
                effects: { stress: -15, energy: 10 },
                result: "You spent the afternoon hanging out in the quad."
            },
            {
                id: 'cricket',
                req: 'school',
                type: 'passive',
                title: "GIANT CRICKET",
                text: "A cricket the size of a hamster was jumping around your classroom. For some reason, you were terrified.",
                icon: "🦗",
                btn: "Hide",
                effects: { stress: 25 },
                result: "It touched your foot. You will never be clean again."
            },
            {
                id: 'boringlecture',
                req: 'school',
                type: 'choice',
                title: "BORING LECTURE",
                text: "Mr. Booker is droning on about the history of the mechanical pencil.",
                icon: "✏️",
                choices: [
                    {
                        label: "Listen",
                        effects: { energy: -15, grades: 5 },
                        resultTitle: "DILIGENT",
                        resultText: "You took detailed notes. Your hand cramps, but you understand the lead advancement mechanism perfectly."
                    },
                    {
                        label: "Sleep",
                        effects: { energy: 15, grades: -5 },
                        resultTitle: "NAP TIME",
                        resultText: "You woke up with drool on your desk. You missed the entire lesson."
                    }
                ]
            },
            
            //Work Events (Work req)        
            {
                id: 'doubleshift',
                req: 'work',
                type: 'choice',
                title: "DOUBLE SHIFT",
                text: "Your manager begs you to cover a shift for someone who 'fell into a fountain'.",
                icon: "😓",
                choices: [
                    {
                        label: "Take It",
                        effects: { cash: 50, energy: -30, stress: 10 },
                        resultTitle: "THE GRIND",
                        resultText: "You power through the shift. You are tired, but richer."
                    },
                    {
                        label: "Decline",
                        effects: { energy: 5 }, // Optional: Add 'perf: -10' if you want to track that logic
                        resultTitle: "DECLINED",
                        resultText: "You value your time more than money right now."
                    }
                ]
            },  
            // --- NEW: GENERAL WORK EVENTS (25) ---
            {
                id: 'work_birthday',
                req: 'work',
                type: 'passive',
                title: "BREAKROOM BIRTHDAY",
                text: "It's a coworker's birthday. There is a slightly dry sheet cake sitting in the breakroom.",
                icon: "🎂",
                btn: "Free Sugar",
                effects: { energy: 10, stress: -5 },
                result: "The frosting was entirely vegetable shortening, but free food is free food."
            },
            {
                id: 'work_chatterbox',
                req: 'work',
                type: 'choice',
                title: "THE CHATTERBOX",
                text: "A coworker corners you and starts complaining about their neighbor's dog. You have a lot of work to do.",
                icon: "🗣️",
                choices: [
                    {
                        label: "Listen",
                        effects: { social: 10, jobPerformance: -5, stress: 5 },
                        resultTitle: "GOSSIP",
                        resultText: "You heard the whole saga. Your coworker likes you more, but you fell behind on your tasks."
                    },
                    {
                        label: "Walk Away",
                        effects: { social: -10, jobPerformance: 5 },
                        resultTitle: "FOCUSED",
                        resultText: "You cut them off and got back to work. Productive, but a little rude."
                    }
                ]
            },
            {
                id: 'work_early',
                req: 'work',
                type: 'passive',
                title: "EARLY DISMISSAL",
                text: "It's totally dead today. The boss looks around, sighs, and says you can go home early.",
                icon: "🏃‍♂️",
                btn: "Freedom!",
                effects: { energy: 15, stress: -20 },
                result: "You sprinted to your car before they could change their mind."
            },
            {
                id: 'work_micromanager',
                req: 'work',
                type: 'passive',
                title: "BREATHING DOWN YOUR NECK",
                text: "Your manager stood three feet behind you for twenty minutes just 'watching your workflow'.",
                icon: "👁️",
                btn: "Uncomfortable",
                effects: { stress: 20, energy: -10 },
                result: "You forgot how to use your hands properly while they were watching."
            },
            {
                id: 'work_cover_shift',
                req: 'work',
                type: 'choice',
                title: "DESPERATE TEXT",
                text: "A coworker texts you: 'Plz cover my shift tomorrow. My goldfish is sick.'",
                icon: "📱",
                choices: [
                    {
                        label: "I Got You",
                        effects: { social: 15, energy: -15, stress: 10 },
                        resultTitle: "TEAM PLAYER",
                        resultText: "You agreed to cover. They owe you one, but say goodbye to your free time."
                    },
                    {
                        label: "Read at 2:00 PM",
                        effects: { social: -10, stress: -5 },
                        resultTitle: "GHOSTED",
                        resultText: "You left them on read. Boundaries are important."
                    }
                ]
            },
            {
                id: 'work_lunch_thief',
                req: 'work',
                type: 'passive',
                title: "LUNCH THIEF",
                text: "You went to the fridge to get your lunch. It's gone. Only an empty Tupperware remains.",
                icon: "🥪",
                btn: "Furious",
                effects: { stress: 25, hungerSet: 0, energy: -10 },
                result: "You had to work the rest of your shift starving and angry."
            },
            {
                id: 'work_tip',
                req: 'work',
                type: 'passive',
                title: "GENEROUS TIP",
                text: "A customer or client was incredibly impressed with your service and slipped you a $20 bill.",
                icon: "💵",
                btn: "Score",
                effects: { cash: 20, stress: -10, jobPerformance: 5 },
                result: "Hard work actually paid off today!"
            },
            {
                id: 'work_outage',
                req: 'work',
                type: 'choice',
                title: "SYSTEM DOWN",
                text: "The main computer system crashed. Nobody can do any work for at least an hour.",
                icon: "💻",
                choices: [
                    {
                        label: "Relax",
                        effects: { stress: -15, energy: 10, jobPerformance: -5 },
                        resultTitle: "CHILLING",
                        resultText: "You scrolled on your phone in the breakroom until it came back online."
                    },
                    {
                        label: "Look Busy",
                        effects: { stress: 5, jobPerformance: 10 },
                        resultTitle: "BROWN NOSER",
                        resultText: "You organized a drawer. The manager definitely noticed your dedication."
                    }
                ]
            },
            {
                id: 'work_blame',
                req: 'work',
                type: 'choice',
                title: "THE MISTAKE",
                text: "A major error was found in today's work. The boss is asking who is responsible.",
                icon: "👈",
                choices: [
                    {
                        label: "Own Up",
                        effects: { stress: 15, jobPerformance: -10, social: 5 },
                        resultTitle: "HONESTY",
                        resultText: "You took the heat. You got yelled at, but your coworkers respect you for not throwing them under the bus."
                    },
                    {
                        label: "Stay Silent",
                        effects: { stress: -5, social: -15 },
                        resultTitle: "COWARDICE",
                        resultText: "The team got a collective lecture. Everyone is mad at each other now."
                    }
                ]
            },
            {
                id: 'work_meeting',
                req: 'work',
                type: 'passive',
                title: "POINTLESS MEETING",
                text: "Management called a mandatory all-hands meeting. It lasted an hour. It could have been an email.",
                icon: "🥱",
                btn: "Yawn",
                effects: { energy: -15, stress: 10 },
                result: "You literally felt your life force draining away."
            },
            {
                id: 'work_hvac',
                req: 'work',
                type: 'passive',
                title: "CLIMATE CRISIS",
                text: "The AC unit broke down. The workplace is a humid 85 degrees.",
                icon: "🥵",
                btn: "Sweat",
                effects: { stress: 20, energy: -20 },
                result: "You are sticky, exhausted, and miserable."
            },
            {
                id: 'work_eotm',
                req: 'work',
                type: 'passive',
                title: "STAR EMPLOYEE",
                text: "You were recognized for your hard work! Your picture is going on the wall.",
                icon: "🏆",
                btn: "Humble Brag",
                effects: { cash: 25, stress: -15, jobPerformance: 20 },
                result: "You got a $25 gift card and a firm handshake."
            },
            {
                id: 'work_gossip',
                req: 'work',
                type: 'choice',
                title: "JUICY GOSSIP",
                text: "Coworkers are whispering about why the assistant manager was crying. Do you ask?",
                icon: "🤫",
                choices: [
                    {
                        label: "Get the Tea",
                        effects: { social: 15, jobPerformance: -5 },
                        resultTitle: "IN THE LOOP",
                        resultText: "You spent 20 minutes gossiping. You are fully up to date on workplace lore."
                    },
                    {
                        label: "Stay Professional",
                        effects: { social: -5, jobPerformance: 5 },
                        resultTitle: "MINDING BUSINESS",
                        resultText: "You kept your head down. Drama avoided."
                    }
                ]
            },
            {
                id: 'work_spill',
                req: 'work',
                type: 'passive',
                title: "CLUMSY",
                text: "You completely missed your mouth and spilled coffee all over your uniform.",
                icon: "☕",
                btn: "Hide It",
                effects: { stress: 15, jobPerformance: -5 },
                result: "You smelled like dark roast and looked unprofessional all day."
            },
            {
                id: 'work_train_newbie',
                req: 'work',
                type: 'choice',
                title: "THE NEW HIRE",
                text: "The boss assigns you to train the new employee for the day.",
                icon: "🐣",
                choices: [
                    {
                        label: "Train Well",
                        effects: { energy: -20, jobPerformance: 15 },
                        resultTitle: "MENTOR",
                        resultText: "It took all your energy to explain everything, but the boss was impressed."
                    },
                    {
                        label: "Bare Minimum",
                        effects: { energy: 5, jobPerformance: -10 },
                        resultTitle: "SLACKER",
                        resultText: "You basically let them stand there and watch. They learned nothing."
                    }
                ]
            },
            {
                id: 'work_payroll_error',
                req: 'work',
                type: 'passive',
                title: "PAYROLL GLITCH",
                text: "Your paycheck is short. You have to spend your break arguing with the payroll department.",
                icon: "📉",
                btn: "Frustrated",
                effects: { stress: 25, cash: -15 },
                result: "They'll 'add it to the next check'. You are out of pocket for now."
            },
            {
                id: 'work_donuts',
                req: 'work',
                type: 'passive',
                title: "DONUT DAY",
                text: "A vendor brought two dozen glazed donuts for the staff!",
                icon: "🍩",
                btn: "Eat Two",
                effects: { energy: 10, stress: -10, hungerSet: 1 },
                result: "A sugary burst of morale."
            },
            {
                id: 'work_late_relief',
                req: 'work',
                type: 'passive',
                title: "LATE RELIEF",
                text: "The person supposed to take over your shift is 25 minutes late. You can't leave until they arrive.",
                icon: "⌚",
                btn: "Impatient",
                effects: { stress: 15, energy: -10 },
                result: "You stared at the door the entire time."
            },
            {
                id: 'work_fire_drill',
                req: 'work',
                type: 'passive',
                title: "BUILDING EVACUATION",
                text: "The fire alarm went off. It was just burnt popcorn, but you got to stand outside for 20 minutes.",
                icon: "🚨",
                btn: "Fresh Air",
                effects: { stress: -10, energy: 5 },
                result: "A nice, unexpected break from the grind."
            },
            {
                id: 'work_compliment',
                req: 'work',
                type: 'passive',
                title: "OVERHEARD PRAISE",
                text: "You accidentally overheard your manager telling the boss what a great job you've been doing.",
                icon: "👂",
                btn: "Proud",
                effects: { stress: -20, jobPerformance: 10, social: 5 },
                result: "Your confidence is through the roof today."
            },
            {
                id: 'work_bathroom_hide',
                req: 'work',
                type: 'choice',
                title: "BATHROOM BREAK",
                text: "You are completely overwhelmed. The bathroom is the only place with a lock.",
                icon: "🚽",
                choices: [
                    {
                        label: "Hide for 15 Mins",
                        effects: { energy: 15, stress: -15, jobPerformance: -10 },
                        resultTitle: "SANITY RESTORED",
                        resultText: "You sat on the toilet and scrolled social media. Your boss noticed you were gone."
                    },
                    {
                        label: "Quick Trip",
                        effects: { stress: 5, jobPerformance: 5 },
                        resultTitle: "SOLDIERING ON",
                        resultText: "You splashed water on your face and got back to the floor."
                    }
                ]
            },
            {
                id: 'work_unpaid_ot',
                req: 'work',
                type: 'choice',
                title: "JUST ONE MORE THING",
                text: "You are clocked out, jacket on, walking to the door. The boss asks, 'Can you help with one quick thing?'",
                icon: "🧥",
                choices: [
                    {
                        label: "Help Out",
                        effects: { stress: 15, energy: -10, jobPerformance: 15 },
                        resultTitle: "UNPAID LABOR",
                        resultText: "It took 20 minutes. You didn't get paid, but you scored major brownie points."
                    },
                    {
                        label: "Say No",
                        effects: { stress: -5, jobPerformance: -15 },
                        resultTitle: "CLOCKING OUT",
                        resultText: "You smiled, pointed to your watch, and left. The boss glared."
                    }
                ]
            },
            {
                id: 'work_weird_client',
                req: 'work',
                type: 'passive',
                title: "STRANGE ENCOUNTER",
                text: "You had a 10-minute interaction with someone who didn't blink once and spoke entirely in riddles.",
                icon: "👽",
                btn: "Creeped Out",
                effects: { stress: 15, energy: -5 },
                result: "You need a shower just to wash the weird vibes off."
            },
            {
                id: 'work_pizza_party',
                req: 'work',
                type: 'passive',
                title: "CORPORATE APPRECIATION",
                text: "Management promised a reward for record profits. They bought three cheese pizzas.",
                icon: "🍕",
                btn: "Have a Slice",
                effects: { stress: -5, hungerSet: 2 },
                result: "It's a little insulting, but you did get a free lunch."
            },
            {
                id: 'work_vending_jackpot',
                req: 'work',
                type: 'passive',
                title: "THE JACKPOT",
                text: "You put money in the breakroom vending machine for some chips. THREE bags fell out.",
                icon: "🎰",
                btn: "Miracle",
                effects: { stress: -25, energy: 15 },
                result: "You are the chosen one. Today is going to be a great day."
            },
            
            
            
            
            // --- MINIGAMES (Reference function) ---
            { id: 'vending', req: 'school', type: 'minigame', func: 'startVendingMachineEvent' },
            { id: 'locker', req: 'school', type: 'minigame', func: 'startLockerJamEvent' },
            { id: 'mascot', req: 'school', type: 'minigame', func: 'startMascotEvent' },
            { id: 'rain', type: 'minigame', func: 'startRainEvent' },
            { id: 'seagull', type: 'minigame', func: 'startSeagullEvent' },
            { id: 'phone', type: 'minigame', func: 'startPhoneEvent' },
            { id: 'lab', req: 'school', type: 'minigame', func: 'startLabEvent' },
            { id: 'trip', req: 'school', type: 'minigame', func: 'startTripEvent' },
            { id: 'book', req: 'school', type: 'minigame', func: 'startBookEvent' },
            { id: 'burger', type: 'minigame', func: 'startBurgerEvent' },
            { id: 'popup', type: 'minigame', func: 'startPopupEvent' },
            { id: 'gas', type: 'minigame', func: 'startGasGame' },
            { id: 'microwave', type: 'minigame', func: 'startMicrowaveGame' },
            { id: 'nod', type: 'minigame', func: 'startNodGame' },
            { id: 'usb', type: 'minigame', func: 'startUSBGame' },
            { id: 'claw', type: 'minigame', func: 'startClawGame' },
            { id: 'knot', type: 'minigame', func: 'startWireKnotGame' },
            { id: 'zipper', type: 'minigame', func: 'startZipperGame' },
            { id: 'wifi', type: 'minigame', func: 'startWifiGame' },
            { id: 'coffee', type: 'minigame', func: 'startCoffeeGame' },
            { id: 'cleaner', type: 'minigame', func: 'startCleanerGame' },
            { id: 'ninja', type: 'minigame', func: 'startTextNinjaGame' },
            { id: 'fly', type: 'minigame', func: 'startFlySwatterGame' },
            { id: 'bubble', type: 'minigame', func: 'startBubbleWrapGame' },
            { id: 'combo', req: 'school', type: 'minigame', func: 'startLockerComboGame' },
            { id: 'tower', req: 'school', type: 'minigame', func: 'startBookTowerGame' },
            { id: 'cables', type: 'minigame', func: 'startCableGame' },
            // Add the Item Events (Guitar, Acorn) or any other daily event functions with weird logic
            { id: 'roundmeal', type: 'minigame', func: 'startRoundmealEvent' },
            { id: 'guitar', type: 'minigame', func: 'startGuitarEvent' },
            { id: 'obelisk', type: 'minigame', func: 'startObeliskEvent' },
            { id: 'hair', type: 'minigame', func: 'startHairEvent' },


            //end eventhide tags
        ];

        window.INTERVIEW_QUESTIONS = {
            generic: [
                { q: "Tell us about a time you worked as part of a team.", options: [{t:"I prefer working alone", p:5}, {t:"I helped a teammate finish a project", p:35}, {t:"I once led a group project", p:40}] },
                { q: "How do you handle high-pressure situations?", options: [{t:"I panic", p:0}, {t:"I stay calm and prioritize tasks", p:40}, {t:"I just work faster", p:25}] },
                { q: "Why are you interested in working for us?", options: [{t:"I just need the money", p:10}, {t:"I value your company's mission", p:40}, {t:"My friend told me to apply", p:20}] },
                { q: "What would you do if you saw a coworker being lazy?", options: [{t:"Tell everyone", p:5}, {t:"Offer to help them get on track", p:35}, {t:"Mind my own business", p:15}] },
                { q: "What is your greatest professional strength?", options: [{t:"I am very fast", p:30}, {t:"My attention to detail", p:40}, {t:"I am always on time", p:35}] },
                { q: "How do you handle feedback from a supervisor?", options: [{t:"I get defensive", p:0}, {t:"I listen and try to improve", p:40}, {t:"I ignore it", p:5}] },
                { q: "Tell us about a mistake you made and how you fixed it.", options: [{t:"I never make mistakes", p:5}, {t:"I admitted it and corrected it quickly", p:40}, {t:"I asked someone else to fix it", p:20}] },
                { q: "What does 'good customer service' mean to you?", options: [{t:"Being fast", p:25}, {t:"Solving the customer's problem with a smile", p:40}, {t:"Doing exactly what I'm told", p:20}] },
                { q: "Where do you see yourself in two years?", options: [{t:"Still here, growing with the company", p:40}, {t:"In a higher paying job elsewhere", p:10}, {t:"I'm not sure yet", p:20}] },
                { q: "If you have too many tasks, how do you manage them?", options: [{t:"Do the easiest ones first", p:20}, {t:"Prioritize by urgency and importance", p:40}, {t:"Try to do them all at once", p:15}] }
            ],
            retail: [
                { q: "Customer wants a discount for a scratch. Policy says no.", options: [{t:"Give it anyway", p:5}, {t:"Politely explain policy", p:40}, {t:"Get manager", p:30}] },
                { q: "You suspect a customer is shoplifting. What do you do?", options: [{t:"Tackle them", p:0}, {t:"Alert security or manager", p:40}, {t:"Ignore it", p:10}] },
                { q: "A customer comes in 5 minutes before closing.", options: [{t:"Tell them we are closed", p:5}, {t:"Help them quickly and politely", p:40}, {t:"Hide in the back", p:0}] },
                { q: "A customer asks for an item we don't carry.", options: [{t:"Say 'No'", p:5}, {t:"Suggest a similar alternative", p:40}, {t:"Tell them to check Amazon", p:0}] },
                { q: "The credit card machine goes down during a rush.", options: [{t:"Panic and shout", p:0}, {t:"Apologize and switch to cash/manual", p:40}, {t:"Close the store", p:5}] },
                { q: "You see a coworker giving free items to friends.", options: [{t:"Join in", p:0}, {t:"Report it to management", p:40}, {t:"Ignore it", p:10}] }
            ],
            food: [
                { q: "A customer is unhappy with their meal. What's your move?", options: [{t:"Tell them it looks fine", p:0}, {t:"Apologize and offer replacement", p:40}, {t:"Get manager", p:30}] },
                { q: "You drop a utensil on the floor during a rush.", options: [{t:"Pick it up and use it", p:0}, {t:"Grab a clean one immediately", p:40}, {t:"Wipe it on your apron", p:5}] },
                { q: "A customer claims to have a serious allergy.", options: [{t:"Tell them to order something else", p:10}, {t:"Consult the allergen guide and chef", p:40}, {t:"Guess if the food is safe", p:0}] },
                { q: "We run out of a main ingredient during dinner rush.", options: [{t:"Hide in the freezer", p:0}, {t:"Inform servers to 86 the item", p:40}, {t:"Serve a different item without asking", p:5}] },
                { q: "You cut your finger while chopping veg.", options: [{t:"Keep working, it's just a scratch", p:0}, {t:"Wash, bandage, and glove up", p:40}, {t:"Go home immediately", p:10}] },
                { q: "A customer tips you remarkably well.", options: [{t:"Pocket it all", p:10}, {t:"Follow the tip pool policy", p:40}, {t:"Refuse it", p:15}] }
            ],
            daycare: [
                { q: "Two children are fighting over a single toy.", options: [{t:"Take it away", p:20}, {t:"Distract one or teach sharing", p:40}, {t:"Let them fight", p:0}] },
                { q: "A parent is late picking up their child.", options: [{t:"Leave the child outside", p:0}, {t:"Stay with the child until they arrive", p:40}, {t:"Call the police immediately", p:10}] },
                { q: "A child is crying because they miss their parents.", options: [{t:"Tell them to stop", p:5}, {t:"Comfort them and engage in play", p:40}, {t:"Put them in timeout", p:0}] },
                { q: "A child refuses to eat their lunch.", options: [{t:"Force them to eat", p:0}, {t:"Encourage them gently but don't force", p:40}, {t:"Throw it away", p:10}] },
                { q: "You notice a strange rash on a child's arm.", options: [{t:"Ignore it", p:0}, {t:"Isolate child and notify director/parent", p:40}, {t:"Put a bandaid on it", p:15}] },
                { q: "A parent is angry about paint on their kid's clothes.", options: [{t:"Blame the kid", p:5}, {t:"Apologize and explain it's non-toxic", p:40}, {t:"Laugh it off", p:0}] }
            ],
            tech: [
                { q: "A client is angry that their repair is taking too long.", options: [{t:"Ignore calls", p:0}, {t:"Explain delay honestly", p:40}, {t:"Blame others", p:15}] },
                { q: "You don't know how to fix a specific issue.", options: [{t:"Pretend you do", p:0}, {t:"Research or ask a senior tech", p:40}, {t:"Tell them it's broken forever", p:5}] },
                { q: "A client asks for your password to 'test' something.", options: [{t:"Give it to them", p:0}, {t:"Politely decline, security risk", p:40}, {t:"Type it in for them", p:25}] },
                { q: "A user clicks a phishing link on a company PC.", options: [{t:"Disconnect network and scan", p:40}, {t:"Yell at the user", p:0}, {t:"Ignore it if it looks fine", p:0}] },
                { q: "You need to explain 'The Cloud' to a senior citizen.", options: [{t:"Use complex jargon", p:5}, {t:"Use a simple filing cabinet analogy", p:40}, {t:"Tell them it's magic", p:10}] },
                { q: "Your code works on your laptop but breaks in production.", options: [{t:"Blame the server", p:10}, {t:"Check environment variables and logs", p:40}, {t:"Give up", p:0}] }
            ],
            animal: [
                { q: "A dog in the kennel is showing signs of aggression.", options: [{t:"Enter anyway", p:0}, {t:"Alert senior and use barrier", p:40}, {t:"Yell", p:5}] },
                { q: "An animal refuses to eat their medication.", options: [{t:"Force feed them", p:10}, {t:"Hide it in a treat (if allowed)", p:40}, {t:"Skip the dose", p:0}] },
                { q: "You notice a cage latch looks loose.", options: [{t:"Fix it or report it immediately", p:40}, {t:"Leave it for the next shift", p:0}, {t:"Tape it shut", p:15}] },
                { q: "A customer wants a fish but has no tank setup.", options: [{t:"Sell it anyway", p:5}, {t:"Refuse sale and educate them", p:40}, {t:"Sell them a bowl", p:10}] },
                { q: "Two dogs start fighting in the play group.", options: [{t:"Grab their collars", p:0}, {t:"Make loud noise or use water spray", p:40}, {t:"Run away", p:0}] },
                { q: "You find a tick on a client's pet.", options: [{t:"Ignore it", p:0}, {t:"Remove safely and notify owner", p:40}, {t:"Shave the dog", p:5}] }
            ],
            labor: [
                { q: "This job requires heavy lifting and working in the rain. Are you ready?", options: [{t:"I prefer air conditioning", p:0}, {t:"I'm physically fit and don't mind the weather", p:40}, {t:"I'll try my best", p:20}] },
                { q: "You see a safety hazard on the worksite.", options: [{t:"Ignore it to finish faster", p:0}, {t:"Stop and report/fix it", p:40}, {t:"Work around it carefully", p:20}] },
                { q: "A tool breaks while you are using it.", options: [{t:"Hide it in the truck", p:0}, {t:"Report it to the foreman", p:40}, {t:"Try to glue it", p:10}] },
                { q: "You are assigned a task you haven't been trained for.", options: [{t:"Wing it", p:5}, {t:"Ask for instruction/training", p:40}, {t:"Refuse to work", p:0}] },
                { q: "A coworker isn't wearing their hard hat.", options: [{t:"Laugh at them", p:5}, {t:"Remind them of safety protocol", p:40}, {t:"Ignore it", p:10}] },
                { q: "The project is behind schedule and it's 5 PM.", options: [{t:"Leave immediately", p:10}, {t:"Ask supervisor if overtime is needed", p:40}, {t:"Work for free", p:20}] }
            ]
        };

       window.WORK_SCENARIOS = {
            generic: [
                { q: "You're running late. How do you handle it?", choices: ["Sneak in", "Call supervisor", "Make up an excuse"], correct: 1, perf: 5, stress: 5 },
                { q: "A coworker is spreading rumors about you.", choices: ["Confront loudly", "Ignore it", "Discuss with Manager"], correct: 2, stress: 10 },
                { q: "You found a wallet with $100 near lockers.", choices: ["Pocket it", "Turn it in", "Leave it"], correct: 1, ethics: true, perf: 10 },
                { q: "The fire alarm is blaring.", choices: ["Grab bag", "Finish task", "Evacuate now"], correct: 2, safety: true },
                { q: "You're feeling totally burnt out halfway through.", choices: ["Quietly leave", "Take scheduled break", "4 energy drinks"], correct: 1, energy: 10, stress: 5 },
                { q: "Boss gives you a task you don't know.", choices: ["Say busy", "Wing it", "Ask for guidance"], correct: 2, perf: 10 },
                { q: "Coworker trips and drops box.", choices: ["Laugh", "Check if okay", "Ignore"], correct: 1, safety: true },
                { q: "Internet goes down.", choices: ["Nap", "Manual tasks", "Complain"], correct: 1, perf: 10 },
                { q: "Client offers forbidden tip.", choices: ["Take it", "Decline politely", "Report them"], correct: 1, ethics: true, perf: 10 },
                { q: "You broke equipment.", choices: ["Hide it", "Blame other", "Report it"], correct: 2, ethics: true }
            ],
            retail: [
                { q: "Line is 10 people long and register is slow.", choices: ["Close lane", "Call for backup", "Walk away"], correct: 1, energy: 10, perf: 10 },
                { q: "A customer tries to return an obviously used item.", choices: ["Refuse loudly", "Check policy/Manager", "Just accept it"], correct: 1, stress: 10 },
                { q: "You spot a child knocking over a display.", choices: ["Yell at them", "Clean it up silently", "Help them/Find parent"], correct: 2, perf: 5 },
                { q: "The register freezes during a transaction.", choices: ["Hit the machine", "Apologize and reboot", "Tell customer to leave"], correct: 1, stress: 5 },
                { q: "You spot a counterfeit $50 bill.", choices: ["Accept it anyway", "Accuse customer", "Decline and call lead"], correct: 2, ethics: true },
                { q: "A customer tries to use an expired coupon.", choices: ["Accept it", "Refuse politely", "Call Manager"], correct: 2, perf: 5 },
                { q: "You find a spill in Aisle 4.", choices: ["Ignore it", "Put up wet floor sign/Clean", "Page someone else"], correct: 1, safety: true },
                { q: "A customer asks for an item item that is out of stock.", choices: ["Check the back (fake)", "Check the back (real)", "Say 'No'"], correct: 1, perf: 5 },
                { q: "It's 5 minutes to closing time and a group walks in.", choices: ["Lock the door", "Greet them quickly", "Hide in bathroom"], correct: 1, stress: 10 },
                { q: "Your drawer is short $10 at end of shift.", choices: ["Put $10 in from pocket", "Report the error", "Fix numbers"], correct: 1, ethics: true }
            ],
            food: [
                { q: "Customer informs you of severe peanut allergy.", choices: ["Say 'I think it's fine'", "Alert kitchen/clean", "Eat elsewhere"], correct: 1, safety: true },
                { q: "You drop a tray of drinks on yourself.", choices: ["Cry in freezer", "Clean up and keep going", "Walk out"], correct: 1, stress: 15, perf: 5 },
                { q: "The kitchen messed up a VIP order.", choices: ["Serve it anyway", "Blame the chef", "Apologize and rush fix"], correct: 2, perf: 10 },
                { q: "A customer says the food is cold (it's steaming).", choices: ["Argue with logic", "Re-heat it anyway", "Ignore them"], correct: 1, stress: 10 },
                { q: "Soda machine runs out of syrup during rush.", choices: ["Serve water instead", "Replace box quickly", "Put 'Out of Order' sign"], correct: 1, energy: 10 },
                { q: "You drop a glass in the ice bin.", choices: ["Pick glass out", "Melt bin and clean", "Ignore it"], correct: 1, safety: true },
                { q: "A customer tips you directly, against pool policy.", choices: ["Pocket it", "Put in jar", "Refuse"], correct: 1, ethics: true },
                { q: "You accidentally burnt a steak.", choices: ["Serve it anyway", "Hide it", "Recook immediately"], correct: 2, perf: 5 },
                { q: "Health inspector arrives unannounced.", choices: ["Panic", "Wash hands/Stay calm", "Run out back"], correct: 1, stress: 10 },
                { q: "A coworker didn't show up.", choices: ["Complain loudly", "Work double station", "Slow down service"], correct: 1, energy: 20 }
            ],
            daycare: [
                { q: "A toddler won't stop crying after parent leaves.", choices: ["Give candy", "Distract with toy", "Corner"], correct: 1, energy: 10, stress: 10 },
                { q: "Two kids are fighting over the blue crayon.", choices: ["Snatch it away", "Let them brawl", "Teach sharing/Trade"], correct: 2, perf: 5 },
                { q: "A parent is 20 minutes late for pickup.", choices: ["Leave child outside", "Call emergency contact", "Stay and wait"], correct: 2, energy: 15 },
                { q: "A child scrapes their knee on the playground.", choices: ["First Aid immediately", "Tell them to toughen up", "Ignore it"], correct: 0, safety: true },
                { q: "It's nap time, but one kid wants to scream.", choices: ["Yell back", "Read a quiet story", "Earplugs"], correct: 1, stress: 10 },
                { q: "A child has a fever.", choices: ["Isolate and call parent", "Give medicine (unauthorized)", "Let them play"], correct: 0, safety: true },
                { q: "You lost track of a child during head count.", choices: ["Panic/Search", "Assume they are there", "Ask other kids"], correct: 0, stress: 20 },
                { q: "A parent forgot diapers.", choices: ["Use another kid's", "Call parent", "Let them go without"], correct: 1, ethics: true },
                { q: "Spilled glitter everywhere.", choices: ["Leave for janitor", "Clean immediately", "Let kids roll in it"], correct: 1, energy: 10 },
                { q: "Kid asks where babies come from.", choices: ["Explain biology", "Redirect/Distract", "Ask parents"], correct: 1, perf: 5 }
            ],
            tech: [
                { q: "Client is panicking about lost data.", choices: ["Promise 100% fix", "Explain process", "Blame them"], correct: 1, stress: 10, perf: 10 },
                { q: "You accidentally deleted a config file.", choices: ["Hide the mistake", "Restore backup/Admit", "Blame the intern"], correct: 1, ethics: true },
                { q: "Customer spilled coffee on laptop but denies it.", choices: ["Call them a liar", "Show evidence politely", "Fix under warranty"], correct: 1, stress: 10 },
                { q: "The server crashes 5 minutes before your shift ends.", choices: ["Leave it for night crew", "Stay late to fix", "Pretend you didn't see"], correct: 1, energy: 20, perf: 15 },
                { q: "A user forgot their password for the 5th time.", choices: ["Reset patiently", "Mock them", "Hang up"], correct: 0, stress: 5 },
                { q: "Phishing email detected on network.", choices: ["Ignore", "Disconnect/Scan", "Forward to everyone"], correct: 1, safety: true },
                { q: "Client asks for software piracy.", choices: ["Do it", "Refuse/Explain policy", "Charge extra"], correct: 1, ethics: true },
                { q: "Ticket queue is overflowing.", choices: ["Delete old tickets", "Work fastest first", "Prioritize by severity"], correct: 2, perf: 10 },
                { q: "Coffee spill on your keyboard.", choices: ["Unplug immediately", "Keep typing", "Use hairdryer"], correct: 0, safety: true },
                { q: "Legacy code breaks everything.", choices: ["Cry", "Rollback version", "Blame previous dev"], correct: 1, stress: 15 }
            ],
            animal: [
                { q: "Large dog growling at smaller dog.", choices: ["Physical intervention", "Use barrier/Distract", "Yell"], correct: 1, safety: true },
                { q: "A cat escapes its carrier in the lobby.", choices: ["Close doors/Calmly catch", "Chase wildly", "Let it roam"], correct: 0, energy: 10 },
                { q: "You run out of the specific food a picky eater needs.", choices: ["Starve them", "Check inventory/Sub", "Give them trash"], correct: 1, perf: 5 },
                { q: "An animal bites you (minor).", choices: ["Hide the wound", "Clean and report", "Hit the animal"], correct: 1, safety: true },
                { q: "A parrot keeps mimicking your complaints.", choices: ["Teach it swears", "Laugh it off", "Cover the cage"], correct: 1, stress: 5 },
                { q: "Owner refuses necessary treatment for pet.", choices: ["Do it anyway", "Explain risks clearly", "Yell at owner"], correct: 1, stress: 10 },
                { q: "You find a tick on a dog.", choices: ["Pull it out", "Remove safely/Save", "Ignore"], correct: 1, safety: true },
                { q: "Feeding time chaos.", choices: ["Feed Alpha first", "Separate animals", "Throw food in pile"], correct: 1, safety: true },
                { q: "Animal gets loose in parking lot.", choices: ["Run after it", "Lure with food", "Call police"], correct: 1, energy: 15 },
                { q: "You accidentally mix up two similar cats.", choices: ["Hope nobody notices", "Check microchips", "Guess"], correct: 1, ethics: true }
            ],
            labor: [
                { q: "You accidentally dug a hole in the client's prize flowerbed.", choices: ["Cover it up", "Apologize & Replace", "Blame the mower"], correct: 1, ethics: true, perf: 10 },
                { q: "It starts pouring rain mid-job.", choices: ["Go home without asking", "Wait in truck/Ask lead", "Keep working (unsafe)"], correct: 1, safety: true },
                { q: "You measure once and cut twice (it's wrong).", choices: ["Use it anyway", "Admit and recut", "Hide the wood"], correct: 1, perf: 5 },
                { q: "A heavy box is slipping from your grip.", choices: ["Drop it on foot", "Call for help/Lower", "Throw it"], correct: 1, safety: true },
                { q: "Client changes the layout halfway through.", choices: ["Refuse angrily", "Check with foreman", "Do it for cash"], correct: 1, stress: 10 },
                { q: "Safety guard removed from saw.", choices: ["Use it anyway", "Reattach it", "Work faster"], correct: 1, safety: true },
                { q: "Found a bees nest under the deck.", choices: ["Hit with shovel", "Work around it", "Spray/Call Pro"], correct: 2, safety: true },
                { q: "Coworker is slacking off.", choices: ["Do their work", "Report them", "Ignore/Focus on self"], correct: 2, perf: 5 },
                { q: "Back hurts from lifting.", choices: ["Lift with back", "Take break/Stretch", "Lift with legs next time"], correct: 1, energy: 5 },
                { q: "Client offers you a beer while working.", choices: ["Accept it", "Decline politely", "Drink it in truck"], correct: 1, ethics: true }
            ]
        };

        window.EXPENSES_POOL = [
            // Mundane
            { name: "Laundry", cost: 3.50 }, 
            { name: "School Supplies", cost: 5.25 },
            { name: "Vending Machine", cost: 1.50 }, 
            { name: "Library Fine", cost: 0.50 }, 
            { name: "Phone Bill", cost: 15.00 }, 
            { name: "Toothpaste", cost: 3.25 },
            { name: "Ramen Restock", cost: 8.00 },
            { name: "Lost a $10 bill", cost: 10.00 },
            
            // Funny/Annoying
            { name: "Squirrel Bribe", cost: 2.00 }, 
            { name: "Gum Removal", cost: 5.00 }, 
            { name: "Accidental Click", cost: 1.99 },
            { name: "Emergency Taco", cost: 7.50 }, 
            { name: "Internet Overage", cost: 5.00 }, 
            { name: "Snack Tax", cost: 4.25 }, 
            { name: "Apology Card", cost: 3.50 },
            
            // Absurd
            { name: "Premium Air Sub", cost: 0.99 }, 
            { name: "Pigeon Insurance", cost: 2.50 }, 
            { name: "Dream Storage", cost: 3.00 }, 
            { name: "Caffeinated Soap", cost: 4.50 },
            { name: "A Perfect Apple", cost: 3.00 },
            { name: "Mosquito Charity", cost: 1.00 },
            
            // Creepy/Dark
            { name: "Iron Maiden Tax", cost: 6.66 }, 
            { name: "'They' Found You", cost: 10.00 }, 
            { name: "Goblin Hush Money", cost: 5.00 }, 
            { name: "'What's In The Box?' Fee", cost: 7.00 }, 
            { name: "Underworld Bridge Toll", cost: 1.00 },
            { name: "Memory Erasure", cost: 12.00 },
            { name: "Shadow Fee", cost: 2.25 }
        ];

        window.APPEARANCE_OPTIONS = {
            skin: ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'],
            eyeColor: ['#634e34', '#a79543', '#6c9657', '#3b82f6'], // Brown, Hazel, Green, Blue
            shirt: ['#002147', '#50C878', '#E94E77', '#FDB913', '#2E4053'],
            hairColor: ['#1A1A1A', '#4B2C20', '#F1C232', '#C0392B', '#BDC3C7'],
            hairStyle: ['bald', 'short', 'bowl', 'bun', 'long', 'spiky']
        };

        

        window.RECAP_TITLES = [
            "Night Passes...",
            "Passed Out...",
            "Goodnight, Moon...",
            "Catch Some Zs...",
            "Call It A Night...",
            "Next Time On Dragonball Z...",
            "I Sleep...",
            "Past Your Bedtime...",
            "Knocked Out...",
            "Sleep (feat. Scrolling On My Phone)...",
            "Another Day...",
            "Nighty Night...",
            "Be Sure To Get A Full 8 Hours...",
            "Lights Out...",
            "Is a Nighttime Nap Just Sleeping...?",
            "Tomorrow is Another Day",
            "Don't Forget to Clean Up Your Toys...",
            "Loading Sleep Patterns...",
            "Goodnight, Room",
            "*snoring loudly*"

        ];