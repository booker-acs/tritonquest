// --- DAY 1 CHECKLIST ---
// A short guided first day: a card on the dashboard that ticks off Eat, School, Homework and End Day.
// The first two steps pulse the matching button (guided); the last two you do on your own.
// Steps are read from game state, so there is nothing extra to keep in sync. The checklist ends on the
// morning of Day 2 with a message pointing at the How to Play phone app.

window.TUTORIAL_STEPS = [
    { id: 'eat',      icon: '🥯', text: 'Eat something.',      hint: "School breakfast is free. It's also… breakfast.", guided: true,  done: () => state.hungerLevel >= 1 },
    { id: 'school',   icon: '🏫', text: 'Go to school.',       hint: 'Attendance is, unfortunately, the whole game.',    guided: true,  done: () => state.hasAttendedSchoolToday },
    { id: 'homework', icon: '📝', text: 'Do your homework.',   hint: 'Yes, really. It unlocks after school.',            guided: false, done: () => state.hasDoneHomeworkToday },
    { id: 'endday',   icon: '🌙', text: 'End your day.',       hint: 'Sleep is a mechanic.',                             guided: false, done: () => false }
];

window.tutorialIsActive = function() {
    return !!(state.tutorial && state.tutorial.active && state.dayTotal === 1);
};

// Remember which steps got done, since the daily flags reset overnight and the wrap-up happens on Day 2.
window.recordTutorialProgress = function() {
    if (!state.tutorial || !state.tutorial.active || state.dayTotal !== 1) return;
    if (!state.tutorial.done) state.tutorial.done = {};
    window.TUTORIAL_STEPS.forEach(s => { if (s.done()) state.tutorial.done[s.id] = true; });
};

window.tutorialCurrentStep = function() {
    return window.TUTORIAL_STEPS.find(s => !s.done()) || null;
};

// Returns a class to splice into a button so it pulses while it's the guided next step.
window.tutorialPulse = function(stepId) {
    if (!window.tutorialIsActive()) return '';
    const current = window.tutorialCurrentStep();
    return (current && current.id === stepId && current.guided) ? ' tutorial-pulse' : '';
};

window.renderTutorialCard = function() {
    if (!window.tutorialIsActive()) return '';
    window.recordTutorialProgress();

    const current = window.tutorialCurrentStep();
    const doneCount = window.TUTORIAL_STEPS.filter(s => s.done()).length;

    const tiles = window.TUTORIAL_STEPS.map(s => {
        const done = s.done();
        const isCurrent = current && current.id === s.id;
        const box = done
            ? `<span class="w-5 h-5 rounded-full bg-green-500 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">✓</span>`
            : `<span class="w-5 h-5 rounded-full border-2 ${isCurrent ? 'border-yellow-300' : 'border-slate-600'} flex-shrink-0"></span>`;
        return `
            <div class="flex items-start gap-3 p-3 rounded-2xl border ${isCurrent ? 'border-yellow-300/60 bg-slate-800' : 'border-slate-700 bg-slate-800/40'} ${done ? 'opacity-60' : ''}">
                ${box}
                <div class="min-w-0">
                    <div class="text-xs font-black uppercase tracking-wide ${done ? 'text-slate-400 line-through' : 'text-white'}">${s.icon} ${s.text}</div>
                    <div class="text-[10px] text-slate-400 leading-snug mt-0.5">${s.hint}</div>
                </div>
            </div>`;
    }).join('');

    return `
        <div class="mb-6 p-4 glass-panel rounded-3xl border border-yellow-400/40 text-left">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <div class="text-[10px] font-black uppercase tracking-widest text-acs-gold">First Day</div>
                    <div class="text-xs text-slate-400">Four things. Then you're basically a student.</div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-xs font-black text-white">${doneCount}/${window.TUTORIAL_STEPS.length}</span>
                    <button onclick="window.skipTutorial()" class="text-[10px] font-bold uppercase text-slate-500 hover:text-white transition-colors">Skip</button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">${tiles}</div>
        </div>`;
};

window.skipTutorial = function() {
    window.queueModal(
        "Skip the checklist?",
        "Bold. Everything is in your phone under <strong>How to Play</strong> if you change your mind.",
        "Skip It", "⏭️",
        (confirmed) => {
            if (!confirmed) return;
            state.tutorial.active = false;
            state.tutorial.skipped = true;
            window.updateUI({ scroll: false, animate: false });
        },
        "Keep Going", false, "TUTORIAL"
    );
};

// Called on the morning of Day 2 (from checkForMorningEvents). Chains into the holiday check like the old tutorial did.
window.finishTutorial = function() {
    const t = state.tutorial;
    t.active = false;
    t.completed = true;
    const done = t.done || {};
    const allDone = ['eat', 'school', 'homework'].every(id => done[id]);

    const msg = allDone
        ? "That's the whole job: eat, show up, do the work, sleep. Repeat for four years.<br><br>Your phone has a <strong>How to Play</strong> app for everything we didn't have time to ruin."
        : "Day one is in the books. Not everything got checked off, but that's allowed. Probably.<br><br>Your phone has a <strong>How to Play</strong> app for everything we didn't have time to ruin.";

    window.queueModal("ORIENTATION COMPLETE", msg, "Got It", "🎓", () => window.checkHolidayTrigger(), null, false, "TUTORIAL");
};
