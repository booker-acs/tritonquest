// --- BANK INTEREST, TUITION DAY & STUDENT LOANS ---
// Savings earn a little interest every day. On the last day of Senior year the college bill comes due:
// savings and cash on hand pay it first, and anything left over becomes a student loan (you pick one).
// Investments are never sold automatically; the player gets a reminder first.

(function () {

window.BANK_INTEREST_DAILY = 0.0005;   // 0.05% a day, about 6% per game-year
window.LOAN_TERM_MONTHS = 120;         // 10-year repayment

window.LOAN_OPTIONS = [
    { id: 'federal', icon: '🏛️', name: 'Triton Federal Student Loan', apr: 0.04, deferredYears: 0, bonus: 0,
      pitch: 'Boring. Responsible. Mildly insulting.',
      terms: 'Fixed 4%. Payments start after graduation.' },
    { id: 'private', icon: '🦅', name: 'Eagle Eye Private Lending', apr: 0.09, deferredYears: 0, bonus: 500,
      pitch: 'Approved in four minutes. The fine print takes longer to read than your college essay.',
      terms: 'Fixed 9%. Includes a $500 signing bonus, because they like you.' },
    { id: 'deferred', icon: '⏳', name: 'Pay-It-Later™ Deferred Plan', apr: 0.07, deferredYears: 4, bonus: 0,
      pitch: 'No payments until graduation. Interest, however, will be attending college with you.',
      terms: '7%. Interest builds for 4 years before repayment even starts.' }
];

window.tuitionDayActive = false;

window.moneyText = function(n) {
    return '$' + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const round2 = (n) => Math.round(n * 100) / 100;

// ---------- Bank interest ----------

// Called once a day from finalizeDay. Adds a line to that day's summary when there is interest to show.
window.applyBankInterest = function(summaryLines) {
    const bank = state.bankBalance || 0;
    const interest = round2(bank * window.BANK_INTEREST_DAILY);
    if (interest < 0.01) return 0;
    state.bankBalance = round2(bank + interest);
    state.bankInterestEarned = round2((state.bankInterestEarned || 0) + interest);
    if (summaryLines) summaryLines.push({ name: 'Savings Interest', cost: interest, type: 'savings' });
    return interest;
};

// ---------- Investments ----------

window.getPortfolioValue = function() {
    const portfolio = state.portfolio || {};
    return Object.keys(portfolio).reduce((sum, key) => {
        const holding = portfolio[key];
        const asset = (typeof getInvestmentById === 'function') ? getInvestmentById(key) : null;
        return (asset && holding && holding.quantity > 0) ? sum + holding.quantity * asset.price : sum;
    }, 0);
};

// Back button of the Invest app: during Tuition Day it returns to the tuition flow instead of the phone.
window.investBack = function() {
    if (window.tuitionDayActive) { window.startTuitionDay(); return; }
    if (!window.phoneReturn('invest')) window.openPhoneMenu();
};

// ---------- Loan maths ----------

window.loanTerms = function(opt, principal) {
    const startBalance = principal * Math.pow(1 + opt.apr, opt.deferredYears);   // interest builds while you're in school
    const r = opt.apr / 12, n = window.LOAN_TERM_MONTHS;
    const monthly = startBalance * r / (1 - Math.pow(1 + r, -n));
    return { startBalance: round2(startBalance), monthly: round2(monthly), totalRepaid: round2(monthly * n) };
};

// ---------- Tuition Day ----------

// Morning of the last day of Senior year: tell the player what's coming.
window.showTuitionDueNotice = function() {
    const college = window.COLLEGE_DB.find(c => c.id === state.committedCollege.id);
    const bank = state.bankBalance || 0, cash = Math.max(0, state.balance);
    const held = window.getPortfolioValue();
    const investNote = held >= 1
        ? `<div class="text-amber-400 text-xs font-bold mt-3">You're holding ${window.moneyText(held)} in investments. They don't count until you sell them (Phone → Financials → Invest). Nobody will do it for you.</div>`
        : '';

    window.queueModal(
        "TUITION DUE TONIGHT",
        `Today is the last day of high school. It is also the day the bill arrives.
         <div class="mt-4 border-t border-slate-600 pt-4 text-sm font-bold text-left space-y-1">
            <div class="flex justify-between"><span>${college.name}</span><span class="text-red-400">${window.moneyText(state.committedCollege.cost)}</span></div>
            <div class="flex justify-between"><span>Your savings</span><span class="text-green-400">${window.moneyText(bank)}</span></div>
            <div class="flex justify-between"><span>Cash on hand</span><span class="text-green-400">${window.moneyText(cash)}</span></div>
         </div>
         <div class="text-xs text-slate-400 mt-3">Savings and cash pay it first. Anything left over becomes a student loan.</div>
         ${investNote}`,
        "Understood", "🧾", () => window.checkHolidayTrigger(), null, false, "SENIOR YEAR"
    );
};

// Entry point: called when the final day ends.
window.startTuitionDay = function() {
    window.tuitionDayActive = true;
    document.getElementById('modal-overlay').classList.add('hidden');

    if (!state.committedCollege) return window.finishTuitionDay();

    if (window.getPortfolioValue() >= 1 && !window.tuitionSkipInvestCheck) {
        window.queueModal(
            "BEFORE THE BILL",
            `You're still holding <strong>${window.moneyText(window.getPortfolioValue())}</strong> in investments. They won't count toward tuition unless you sell them, and they will not be sold for you.`,
            "Open Invest", "📈",
            (openInvest) => {
                if (openInvest) {
                    window.openInvestmentApp();
                } else {
                    window.tuitionSkipInvestCheck = true;
                    window.showTuitionBill();
                }
            },
            "Continue Anyway", false, "TUITION DAY"
        );
        return;
    }
    window.showTuitionBill();
};

// Pays what it can from savings first, then cash. Returns what was taken.
window.payTuitionFromFunds = function(amount) {
    let remaining = amount;
    const fromSavings = round2(Math.min(state.bankBalance || 0, remaining));
    state.bankBalance = round2((state.bankBalance || 0) - fromSavings);
    remaining = round2(remaining - fromSavings);

    const fromCash = round2(Math.min(Math.max(0, state.balance), remaining));
    state.balance = round2(state.balance - fromCash);
    remaining = round2(remaining - fromCash);

    state.endgameStats.totalMoneySpent += fromSavings + fromCash;
    return { fromSavings, fromCash, remaining };
};

window.showTuitionBill = function() {
    const college = window.COLLEGE_DB.find(c => c.id === state.committedCollege.id);
    const cost = state.committedCollege.cost;
    const bank = state.bankBalance || 0, cash = Math.max(0, state.balance);
    const shortfall = round2(Math.max(0, cost - bank - cash));

    if (shortfall === 0) {
        const paid = window.payTuitionFromFunds(cost);
        state.tuition = { cost, paidInFull: true, fromSavings: paid.fromSavings, fromCash: paid.fromCash };
        window.queueModal(
            "TUITION PAID",
            `${college.name} has been paid in full. With real money. That you had.
             <div class="mt-4 border-t border-slate-600 pt-4 text-sm font-bold text-left space-y-1">
                <div class="flex justify-between"><span>Tuition</span><span>${window.moneyText(cost)}</span></div>
                <div class="flex justify-between text-green-400"><span>From savings</span><span>-${window.moneyText(paid.fromSavings)}</span></div>
                <div class="flex justify-between text-green-400"><span>From cash</span><span>-${window.moneyText(paid.fromCash)}</span></div>
                <div class="flex justify-between border-t border-slate-600 pt-2 mt-2"><span>Left over</span><span class="text-acs-gold">${window.moneyText((state.bankBalance || 0) + state.balance)}</span></div>
             </div>`,
            "Graduate", "🎓", () => window.finishTuitionDay(), null, false, "TUITION DAY"
        );
        return;
    }

    window.showLoanChoices(college, cost, bank, cash, shortfall);
};

window.showLoanChoices = function(college, cost, bank, cash, shortfall) {
    const cards = window.LOAN_OPTIONS.map(opt => {
        const t = window.loanTerms(opt, shortfall);
        return `
            <button onclick="window.confirmLoan('${opt.id}')" class="w-full text-left p-4 bg-slate-800 border-2 border-slate-600 rounded-2xl hover:border-acs-gold hover:bg-slate-700 transition-all">
                <div class="flex items-center gap-3 mb-1">
                    <span class="text-3xl">${opt.icon}</span>
                    <div>
                        <div class="font-black text-sm text-white leading-tight">${opt.name}</div>
                        <div class="text-[10px] text-slate-400 italic">${opt.pitch}</div>
                    </div>
                </div>
                <div class="text-[10px] text-slate-300 mt-2">${opt.terms}</div>
                <div class="flex justify-between text-xs font-bold mt-2">
                    <span class="text-acs-gold">${window.moneyText(t.monthly)} / month for 10 years</span>
                    <span class="text-red-400">${window.moneyText(t.totalRepaid)} total</span>
                </div>
            </button>`;
    }).join('');

    window.queueModal(
        "TUITION DAY",
        `${college.name} wants ${window.moneyText(cost)}. Your savings (${window.moneyText(bank)}) and cash (${window.moneyText(cash)}) go to it first, which leaves you <strong class="text-red-400">${window.moneyText(shortfall)}</strong> short. Choose how to borrow it.
         <div class="mt-4 space-y-3 max-h-[45vh] overflow-y-auto custom-scroll pr-1">${cards}</div>`,
        null, "🧾", null, null, false, "THE BILL"
    );
};

window.confirmLoan = function(optionId) {
    const opt = window.LOAN_OPTIONS.find(o => o.id === optionId);
    const cost = state.committedCollege.cost;
    const available = (state.bankBalance || 0) + Math.max(0, state.balance);
    const shortfall = round2(Math.max(0, cost - available));
    const t = window.loanTerms(opt, shortfall);

    document.getElementById('modal-overlay').classList.add('hidden');
    window.queueModal(
        "SIGN HERE?",
        `<strong>${opt.name}</strong><br>You borrow <strong>${window.moneyText(shortfall)}</strong> at ${(opt.apr * 100).toFixed(0)}%.
         ${opt.deferredYears ? `<br>It grows to ${window.moneyText(t.startBalance)} before repayment starts.` : ''}
         <div class="mt-3 text-sm font-bold">${window.moneyText(t.monthly)} / month for 10 years<br><span class="text-red-400">${window.moneyText(t.totalRepaid)} total</span></div>
         ${opt.bonus ? `<div class="text-green-400 text-xs font-bold mt-2">+${window.moneyText(opt.bonus)} signing bonus</div>` : ''}`,
        "Sign It", opt.icon,
        (signed) => {
            if (signed) window.signLoan(opt, shortfall);
            else setTimeout(window.showTuitionBill, 100);
        },
        "Back", false, "TUITION DAY"
    );
};

window.signLoan = function(opt, shortfall) {
    const cost = state.committedCollege.cost;
    const paid = window.payTuitionFromFunds(cost - shortfall);
    const t = window.loanTerms(opt, shortfall);

    state.loan = { id: opt.id, name: opt.name, principal: shortfall, apr: opt.apr, monthly: t.monthly, totalRepaid: t.totalRepaid };
    state.tuition = { cost, paidInFull: false, fromSavings: paid.fromSavings, fromCash: paid.fromCash, borrowed: shortfall };
    if (opt.bonus) {
        state.balance = round2(state.balance + opt.bonus);
        state.endgameStats.totalMoneyEarned += opt.bonus;
    }

    setTimeout(() => {
        window.queueModal(
            "LOAN SIGNED",
            `Congratulations. You are now an adult with a payment plan.
             <div class="mt-4 border-t border-slate-600 pt-4 text-sm font-bold text-left space-y-1">
                <div class="flex justify-between"><span>Paid from savings</span><span>${window.moneyText(paid.fromSavings)}</span></div>
                <div class="flex justify-between"><span>Paid from cash</span><span>${window.moneyText(paid.fromCash)}</span></div>
                <div class="flex justify-between text-red-400"><span>Borrowed</span><span>${window.moneyText(shortfall)}</span></div>
             </div>`,
            "Graduate", "🎓", () => window.finishTuitionDay(), null, false, "TUITION DAY"
        );
    }, 100);
};

window.finishTuitionDay = function() {
    window.tuitionDayActive = false;
    window.tuitionSkipInvestCheck = false;
    document.getElementById('modal-overlay').classList.add('hidden');
    state.step = 'endgame';
    window.updateUI();
};

// Text and numbers the ending uses.
window.getTuitionSummary = function() {
    const loan = state.loan || null;
    const tuition = state.tuition || null;
    const debt = loan ? loan.principal : 0;
    return {
        debt,
        hasLoan: !!loan,
        loanType: loan ? loan.id : '',
        paidInFull: !!(tuition && tuition.paidInFull),
        note: loan
            ? `You owe about ${window.moneyText(debt)} in student loans, which is a problem for a future you who is, frankly, very busy.`
            : (tuition && tuition.paidInFull ? 'Tuition is paid in full, which is the kind of sentence nobody your age gets to say.' : '')
    };
};

})();
