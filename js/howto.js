// --- HOW TO PLAY (phone app) ---
// Reference pages for every system. Each page is a list of { h, t } rows (heading + text).
// Keep these in sync with the game: numbers here are the real ones from the code.

window.HOWTO_PAGES = [
    {
        id: 'goal', icon: '🎯', title: 'The Point', tagline: 'Graduate. Get into college. Stay in one piece.',
        rows: [
            { h: 'Four Years', t: 'Each year is four seasons of 28 days. The game ends after the last day of Summer, Year 4.' },
            { h: 'No Game Over', t: "You can't lose. You can only become someone the ending has opinions about." },
            { h: 'The Ending', t: 'GPA, money, stress, energy, friends, your job and your college all decide who you turn out to be.' },
            { h: 'Ultimate Triton', t: "An award given every year to the most well-rounded student. Nobody will tell you what that means. It's probably not \"straight A's and no friends.\"" }
        ]
    },
    {
        id: 'stats', icon: '📊', title: 'Six Numbers', tagline: 'The bar across the top. Look at it occasionally.',
        rows: [
            { h: '💵 Cash', t: 'You start with $100. Paychecks are taxed, so the number on the check is a lie.' },
            { h: '⚡ Energy', t: 'Almost everything costs it. It refills overnight, minus 20 each for high stress, going to bed hungry, and being a Sleepyhead.' },
            { h: '🍔 Hunger', t: 'You wake up Hungry every morning (a Hungry Box fixes that). Eat something before bed, or tomorrow costs you 20 energy.' },
            { h: '🎓 GPA', t: 'Starts at 2.0. Class and homework raise it. Skipping and bad days lower it. Under 1.5 for two days is a problem.' },
            { h: '💬 Social', t: 'Drops 15 every day on its own. At 20 or below you\'re Lonely, and it shows up at work.' },
            { h: '🧠 Stress', t: 'Goes up from school, work and choices. Down from food, free time and friends. 85+ for two days is how people collapse.' }
        ]
    },
    {
        id: 'day', icon: '📅', title: 'One Day, Repeatedly', tagline: 'The loop. You will do this about 448 times.',
        rows: [
            { h: 'Once a Day', t: 'School, Homework, Clubs, Free Time and Work each happen once per day. A ✅ means done.' },
            { h: 'Order Matters', t: "Go to school first. Homework and Clubs stay locked until you do. And once you've worked a shift, school is closed." },
            { h: 'End Day', t: 'Advances the clock. A random event happens at night, you get a summary of what you did, and then it\'s tomorrow.' },
            { h: 'Weekends & Summer', t: 'No school, no clubs. Free Time becomes the Weekend menu. Summer break starts on Day 5 of Summer.' },
            { h: 'The Calendar', t: 'On the right of the dashboard. Holidays have icons. Some skip school. Most come with a spinner that decides how it goes.' }
        ]
    },
    {
        id: 'school', icon: '🏫', title: 'School & Homework', tagline: 'Attendance is, unfortunately, the whole game.',
        rows: [
            { h: 'Class', t: 'Needs 25 energy and a commute. Then a pop quiz: right answers raise your GPA. Academy and AP classes add extra rounds.' },
            { h: 'Commute', t: 'Walk (-20 energy), Bus ($4.50), Skateboard (-10 energy), E-Bike or Car (free, but they break). School and work each need one.' },
            { h: 'Skipping', t: 'Costs 15% GPA. End Day warns you first. Thinking about it is free.' },
            { h: 'Homework', t: 'You have to attend school first. 15 energy, +5% GPA, +15 stress. Organized and Multitasking make it cheaper.' },
            { h: 'Exams', t: 'Midterm on Day 12 and Final on Day 26 of every season. They replace the normal School button.' }
        ]
    },
    {
        id: 'food', icon: '🍔', title: 'Food & Energy', tagline: 'You are, at all times, a little bit hungry.',
        rows: [
            { h: 'Free Food', t: "School breakfast and lunch cost nothing and add a little stress. It's fine. Weekend snacks are free too, and worse. Pizza Friday is the one exception: it helps." },
            { h: 'Cheap Energy', t: 'Iced Coffee or Energy Drink ($5): lots of energy, lots of stress.' },
            { h: 'Comfort Food', t: 'Pancakes or a Burger ($10): big stress relief, and you stay full.' },
            { h: 'Real Food', t: 'Breakfast Burrito or Lentil Salad ($15): steady energy, no stress.' },
            { h: 'Hungry at School', t: "Going to class hungry wrecks your GPA. The game offers you breakfast first. Take it." },
            { h: 'Bedtime', t: "Go to bed hungry and you wake up with 20 less energy. Even the free school lunch counts as eating. Coffee and energy drinks don't." }
        ]
    },
    {
        id: 'jobs', icon: '💼', title: 'Jobs & Money', tagline: 'Adulthood, but 4 hours at a time.',
        rows: [
            { h: 'Getting Hired', t: 'Jobs board, pick a listing, then apply (20 energy). A resume check and an interview follow. The badge on each listing tells you how realistic it is.' },
            { h: 'Shifts', t: 'Need 35 energy (25 if you Multitask) and a commute. Weekday shifts are 4 hours, weekends 8. Summer shifts are 8, with a 40-hour week.' },
            { h: 'Weekly Cap', t: "You can work 24 hours a week, or 40 during summer break. It resets Monday. After that the Work button says MAX HOURS." },
            { h: 'Pay', t: 'About a quarter goes to taxes. Promotions raise your wage.' },
            { h: 'Rating', t: "Shown next to your name. Good shifts raise it. Skip work two days in a row and it drops 15 a day until you clock in. Weekends count. Once you've hit the weekly hour cap, though, days off stop counting until next week." },
            { h: 'Quitting', t: "It's on the Jobs board. Flunk out and school will make you quit for you." }
        ]
    },
    {
        id: 'shop', icon: '🛒', title: 'Shop & Stuff', tagline: 'Money goes in. Possessions come out.',
        rows: [
            { h: 'Item Shop', t: 'Top right of the dashboard. Items, Pets, Transportation and Subscriptions.' },
            { h: 'Subscriptions', t: 'They renew weekly, so cancel the ones you forgot about. Gym and Fishing License unlock weekday Free Time. Hungry Box means never hungry.' },
            { h: 'Inventory', t: 'Four hotbar slots next to the phone, and a backpack 🎒 for the rest. Many items have daily uses (the 1/3 on the icon).' },
            { h: 'Pets', t: 'They need daily care: feeding, litter, walks, tank cleaning. A happy pet helps with stress.' },
            { h: 'Transportation', t: 'Skateboard, E-Bike, Car. Cheaper to commute, more things to break.' }
        ]
    },
    {
        id: 'free', icon: '🎮', title: 'Free Time & Stress', tagline: 'The only part of the day that is yours.',
        rows: [
            { h: 'Weekdays', t: 'One activity per day: Paddle Ball (free), Game Station (needs the console), Workout (needs the Gym), or Quick Cast (needs a Fishing License).' },
            { h: 'Weekends & Summer', t: 'Game Marathon, Movie Night ($15), Go Fishing ($10), or a Day Trip ($50, the biggest stress relief in the game).' },
            { h: 'Fishing', t: 'Click when the ❗ shows up. Then pull the OPPOSITE way the fish swims: hold ◀ ▶ (or A / D) and watch the tension bar. The Pro Rod halves line strain.' },
            { h: 'Other Relief', t: 'Comfort food, Pear Pods, the VR headset, the Plushie (when stress is over 80), the Fidget Cube, pets, and friends.' }
        ]
    },
    {
        id: 'friends', icon: '👥', title: 'Friends', tagline: "They find you. You can't go looking.",
        rows: [
            { h: 'Meeting People', t: 'Daily events introduce them. Once they do, they show up in Contacts.' },
            { h: 'Hang Out', t: 'Contacts, then Hang Out. Costs 20 energy and plays a quick social minigame. Do well and you get Social back and some stress off.' },
            { h: 'Perks', t: "After 3 hangouts a friend's perk kicks in. Better grades, extra uses on your stuff, that kind of thing." },
            { h: 'Neglect', t: 'Ignore someone for 5 days and they start drifting. After 10 they ghost you and the perk goes with them.' }
        ]
    },
    {
        id: 'clubs', icon: '⚽', title: 'Clubs', tagline: 'After school. Show up.',
        rows: [
            { h: 'Access', t: 'Open from the Clubs button once you\'ve been to school. Not on weekends.' },
            { h: 'Schedule', t: 'Mon / Wed: Leviathan (band) and Theatre Arts. Tue / Thu: Soccer and Basketball. One club per schedule, so at most two.' },
            { h: 'Tryouts', t: "You have to make it first, with a minigame. Stick with it and you move up from the bench." },
            { h: 'Skipping', t: 'Miss a day your club meets and you lose 10 standing.' }
        ]
    },
    {
        id: 'college', icon: '🎓', title: 'College', tagline: 'The reason for all of this.',
        rows: [
            { h: 'Year 2', t: 'You pick a Career Academy. It adds a quiz round to every school day.' },
            { h: 'Year 3', t: 'You pick up to 2 AP classes. More rounds, more GPA on the line.' },
            { h: 'Year 4', t: 'The College App appears in Phone, Financials. Applying costs $50 and 40 energy, plus a typing essay. Each school shows your odds.' },
            { h: 'Decision Day', t: 'Spring of Year 4, Day 1. If you got in, the offer letter lists financial aid. It depends on your GPA, how broke you looked when you applied, and whether you had a job.' },
            { h: 'Paying', t: "Pick one school and commit. Tuition comes due on the last day of Senior year. Your savings and cash on hand pay it first. Investments don't count unless you sell them, and nobody will sell them for you. The Bank app tracks how close you are." },
            { h: 'Loans', t: "Whatever you can't cover becomes a student loan, and you choose the kind: cheap and boring, fast and sketchy, or the one where interest goes to college with you. It shows up in your ending." }
        ]
    },
    {
        id: 'warnings', icon: '⚠️', title: 'Things That Go Wrong', tagline: 'Read this before they happen.',
        rows: [
            { h: 'Burnout', t: 'Stress at 85+ two days running triggers a warning. Get it to 50 or lower by the next night or you collapse: -$250, -20% GPA, and you wake up wrecked. The Health app keeps score.' },
            { h: 'Failing Grades', t: 'Under a 1.5 GPA for two days and you get 3 school days to climb back to 2.0. Miss it and you pay a $200 tutoring fee and get forced out of your job.' },
            { h: 'Lonely', t: 'Social at 20 or below. Go see someone.' }
        ]
    },
    {
        id: 'phone', icon: '📱', title: 'Phone & Saving', tagline: 'Everything else is in here.',
        rows: [
            { h: 'The Phone', t: 'Tap your portrait or the phone icon. Contacts, Personal Info (ID Card, Health, Style), Socials (Readedit, Ding Dong), Financials (Bank, Invest, College App), Save, and this app.' },
            { h: 'Socials', t: 'Scrolling costs energy and lowers stress. Ding Dong boosts Social. Neither is productive. Both are very effective.' },
            { h: 'Bank & Invest', t: 'Money in the Bank is out of reach of impulse purchases, and it earns a little interest every day (about 6% a year). Investments move every day, in both directions.' },
            { h: 'Saving', t: "The game autosaves every night when the day summary appears, keeping the last two. You can also save by name in the Save app. Browser saves stay in that browser, so use Download to get a save file you can keep as a backup or load on another computer. Load from the title screen (Continue Career, or Load Save File)." }
        ]
    }
];

window.howToHtml = function(innerHtml) {
    return `
        <div id="howto-root" class="text-left">
            <div class="text-center mb-4">
                <h1 class="text-3xl font-black text-acs-gold uppercase tracking-widest leading-none">HOW TO PLAY</h1>
                <p class="text-slate-400 text-xs mt-2 italic">Everything the tutorial didn't have time to ruin.</p>
            </div>
            ${innerHtml}
        </div>`;
};

// Swap contents in place when the app is already open (no pop-in animation); otherwise open it fresh.
window.renderHowTo = function(innerHtml) {
    const html = window.howToHtml(innerHtml);
    const overlay = document.getElementById('modal-overlay');
    if (!overlay.classList.contains('hidden') && document.getElementById('howto-root')) {
        document.getElementById('modal-content').innerHTML = html;
        return;
    }
    overlay.classList.add('hidden');
    state.pendingModals.push({ rawHtml: html, onOpen: () => {} });
    window.processModalQueue();
};

window.openHowToPlay = function() {
    const buttons = window.HOWTO_PAGES.map(p => `
        <button onclick="window.openHowToPage('${p.id}')" class="p-3 bg-slate-800 border border-slate-600 rounded-xl hover:border-acs-gold hover:bg-slate-700 transition-all text-left flex items-center gap-3 group">
            <span class="text-2xl group-hover:scale-110 transition-transform">${p.icon}</span>
            <span class="text-[11px] font-black uppercase text-white leading-tight">${p.title}</span>
        </button>`).join('');

    window.renderHowTo(`
        <div class="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto custom-scroll pr-1">${buttons}</div>
        <button onclick="window.howToClose()" class="w-full mt-4 py-3 bg-slate-700 text-slate-300 rounded-xl font-black uppercase text-xs hover:bg-slate-600 transition-all">Back</button>`);
};

window.openHowToPage = function(id) {
    const i = window.HOWTO_PAGES.findIndex(p => p.id === id);
    if (i < 0) return window.openHowToPlay();
    const page = window.HOWTO_PAGES[i];
    const next = window.HOWTO_PAGES[(i + 1) % window.HOWTO_PAGES.length];

    const rows = page.rows.map(r => `
        <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
            <div class="text-[10px] font-black uppercase tracking-wider text-yellow-400 mb-1">${r.h}</div>
            <div class="text-sm text-slate-300 leading-snug">${r.t}</div>
        </div>`).join('');

    window.renderHowTo(`
        <div class="text-center mb-3">
            <div class="text-4xl mb-1">${page.icon}</div>
            <h2 class="text-xl font-black uppercase text-white leading-none">${page.title}</h2>
            <p class="text-xs text-slate-400 italic mt-1">${page.tagline}</p>
        </div>
        <div class="space-y-2 max-h-[45vh] overflow-y-auto custom-scroll pr-1">${rows}</div>
        <div class="grid grid-cols-2 gap-3 mt-4">
            <button onclick="window.openHowToPlay()" class="py-3 bg-slate-700 text-slate-300 rounded-xl font-black uppercase text-xs hover:bg-slate-600 transition-all">◀ Topics</button>
            <button onclick="window.openHowToPage('${next.id}')" class="py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs hover:bg-indigo-500 transition-all">Next ▶</button>
        </div>`);
};

window.howToClose = function() {
    if (window.phoneReturn('howto')) return;
    document.getElementById('modal-overlay').classList.add('hidden');
};
