// Refactored Investment App to use a single modal and content swapping

// Main entry point for the investment app
window.openInvestmentApp = function() {
    // This function creates the modal shell. All other functions will just update its content.
    const investmentAppShell = `
        <div id="investment-app-content" class="bg-slate-900 border-4 border-slate-700 rounded-[2rem] p-6 w-full max-w-md h-[70vh] shadow-2xl animate-pop relative flex flex-col text-white">
            <!-- Content will be rendered here by other functions -->
        </div>
    `;

    // Use rawHtml to create our persistent container
    state.pendingModals.push({
        rawHtml: investmentAppShell,
        onOpen: () => {
            // As soon as the modal is open, render the main menu into it
            window.renderInvestmentMainMenu();
        }
    });
    window.processModalQueue();
};

// Renders the main menu of the investment app
window.renderInvestmentMainMenu = function() {
    const contentEl = document.getElementById('investment-app-content');
    if (!contentEl) return; // Safety check

    const portfolio = state.portfolio || {};
    const totalValue = Object.keys(portfolio).reduce((sum, key) => {
        const investment = getInvestmentById(key);
        const holding = portfolio[key];
        if (investment && holding && holding.quantity > 0) {
            return sum + (holding.quantity * investment.price);
        }
        return sum;
    }, 0);

    let valueColor = 'text-white';
    if (state.previousPortfolioValue && state.previousPortfolioValue > 0) {
        if (totalValue > state.previousPortfolioValue) {
            valueColor = 'text-green-400';
        } else if (totalValue < state.previousPortfolioValue) {
            valueColor = 'text-red-400';
        }
    }

    const menuItems = [
        { id: 'indexFund', name: 'Triton 500 Index Fund', icon: '📈', desc: 'A diversified, low-risk fund.' },
        { id: 'stocks', name: 'Stocks', icon: '🏢', desc: 'Invest in individual companies.' },
        { id: 'commodities', name: 'Commodities', icon: '🪙', desc: 'Trade raw materials like gold and lithium.' },
        { id: 'crypto', name: 'Cryptocurrency', icon: '💎', desc: 'High-risk, high-reward digital assets.' }
    ];

    const menuButtonsHtml = menuItems.map(item => `
        <button onclick="window.renderInvestmentCategory('${item.id}')" 
        class="w-full text-left p-4 bg-slate-800 border-2 border-slate-600 rounded-xl hover:border-green-500 hover:bg-slate-700 transition-all flex items-center gap-4 group">
            <div class="text-3xl group-hover:scale-110 transition-transform">${item.icon}</div>
            <div>
                <div class="font-bold text-white text-sm group-hover:text-green-400">${item.name}</div>
                <div class="text-[10px] text-slate-400">${item.desc}</div>
            </div>
        </button>
    `).join('');

    contentEl.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-black uppercase text-green-400 leading-none">Invest</h2>
            <button onclick="window.investBack()" class="bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-slate-600">Back</button>
        </div>
        <div class="text-center mb-4">
            <div class="text-xs text-slate-400 uppercase font-bold">Portfolio Value</div>
            <div class="text-4xl font-black ${valueColor}">$${totalValue.toFixed(2)}</div>
        </div>
        <div class="flex-grow overflow-y-auto pr-1 custom-scroll">
            <div class="space-y-3">
                ${menuButtonsHtml}
            </div>
        </div>
    `;
};

// Renders a specific category of assets
window.renderInvestmentCategory = function(category) {
    const contentEl = document.getElementById('investment-app-content');
    if (!contentEl) return;

    let assets;
    let categoryName;

    if (category === 'indexFund') {
        assets = [window.INVESTMENT_DATA.indexFund];
        categoryName = "Triton 500 Index Fund";
    } else {
        assets = window.INVESTMENT_DATA[category];
        categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    }

    const assetsHtml = assets.map(asset => {
        const holding = state.portfolio[asset.id]?.quantity || 0;
        return `
            <button class="w-full p-4 bg-slate-800 rounded-lg text-left hover:bg-slate-700" onclick="window.renderInvestmentAsset('${asset.id}', '${category}')">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-bold text-white flex items-center gap-2">${asset.icon || ''} ${asset.name}</div>
                        <div class="text-xs text-slate-400 ml-8">${asset.ticker || ''}</div>
                    </div>
                    <div>
                        <div class="text-white font-bold">$${asset.price.toFixed(2)}</div>
                        <div class="text-xs text-right ${holding > 0 ? 'text-green-400' : 'text-slate-400'}">${holding > 0 ? holding.toFixed(4) : '0'} owned</div>
                    </div>
                </div>
            </button>
        `;
    }).join('');

    contentEl.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-black uppercase text-green-400 leading-none">${categoryName}</h2>
            <button onclick="window.renderInvestmentMainMenu()" class="bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-slate-600">Back</button>
        </div>
        <div class="flex-grow overflow-y-auto pr-1 custom-scroll">
            <div class="space-y-3">
                ${assetsHtml}
            </div>
        </div>
    `;
};

// Renders the details for a single asset
window.renderInvestmentAsset = function(assetId, category) {
    const contentEl = document.getElementById('investment-app-content');
    if (!contentEl) return;

    const asset = getInvestmentById(assetId);
    if (!asset) return;
    
    asset.category = category; // Ensure category is attached
    const holding = state.portfolio[assetId] || { quantity: 0, totalCost: 0 };
    const value = holding.quantity * asset.price;
    const gainLoss = value - holding.totalCost;
    const avgCost = holding.quantity > 0 ? holding.totalCost / holding.quantity : 0;
    const pctChange = avgCost > 0 ? ((asset.price - avgCost) / avgCost) * 100 : 0;

    const gainLossColor = gainLoss >= 0 ? 'text-green-400' : 'text-red-400';
    const history = state.investmentHistory ? (state.investmentHistory[assetId] || []) : [];
    const chartHtml = history.length > 1 ? generateSparklineSVG(history, gainLoss >= 0) : '<div class="h-24 flex items-center justify-center text-xs text-slate-500">Not enough price history to draw a chart.</div>';

    contentEl.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-2xl font-black uppercase text-green-400 leading-none flex items-center gap-2">${asset.icon || ''} ${asset.name}</h2>
            <button onclick="window.renderInvestmentCategory('${category}')" class="bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-slate-600">Back</button>
        </div>

        <div class="text-center mb-2">
            <div class="text-4xl font-black text-white">$${asset.price.toFixed(2)}</div>
            <div class="text-xs text-slate-400 uppercase font-bold">Current Price</div>
        </div>

        <div class="h-24 w-full mb-2">${chartHtml}</div>

        <div class="bg-slate-800 rounded-xl p-3 mb-2 text-xs">
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <div class="font-bold text-slate-400 uppercase">Shares Owned</div>
                    <div class="font-bold text-white text-sm">${holding.quantity.toFixed(4)}</div>
                </div>
                <div>
                    <div class="font-bold text-slate-400 uppercase">Market Value</div>
                    <div class="font-bold text-white text-sm">$${value.toFixed(2)}</div>
                </div>
                <div>
                    <div class="font-bold text-slate-400 uppercase">Total P/L</div>
                    <div class="font-bold ${gainLossColor} text-sm">${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)}</div>
                </div>
                <div>
                    <div class="font-bold text-slate-400 uppercase">Total % Change</div>
                    <div class="font-bold ${gainLossColor} text-sm">${pctChange.toFixed(2)}%</div>
                </div>
            </div>
        </div>
        
        <p class="text-xs text-slate-400 mb-2 flex-grow custom-scroll overflow-y-auto">${asset.description}</p>
        
        <div id="investment-transaction-area"></div>

        <div class="grid grid-cols-2 gap-4 mt-auto">
            <button onclick="window.renderTransactionUI('${assetId}', 'buy')" class="bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500">Buy</button>
            <button onclick="window.renderTransactionUI('${assetId}', 'sell')" class="bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-500 ${holding.quantity > 0 ? '' : 'opacity-50 cursor-not-allowed'}" ${holding.quantity > 0 ? '' : 'disabled'}>Sell</button>
        </div>
    `;
};

// Renders the Buy/Sell input form
window.renderTransactionUI = function(assetId, type) {
    const asset = getInvestmentById(assetId);
    const transactionArea = document.getElementById('investment-transaction-area');
    if (!transactionArea) return;

    transactionArea.innerHTML = `
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-600 mb-4">
            <h3 class="text-lg font-bold mb-2 text-center">${type === 'buy' ? 'Buy' : 'Sell'} ${asset.name}</h3>
            <div class="flex items-center bg-slate-700 rounded-lg p-2">
                <span class="text-slate-400 font-bold px-2">${type === 'buy' ? '$' : 'QTY'}</span>
                <input type="number" id="investment-amount" placeholder="0.00" class="flex-grow bg-transparent text-white text-right font-bold p-2 outline-none">
            </div>
            <div id="transaction-feedback" class="text-xs text-center mt-2 h-4"></div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <button onclick="window.renderInvestmentAsset('${assetId}', '${asset.category}')" class="bg-slate-600 text-white font-bold py-2 rounded-lg text-xs">Cancel</button>
                <button onclick="window.executeTransaction('${assetId}', '${type}')" class="bg-${type === 'buy' ? 'green' : 'red'}-600 text-white font-bold py-2 rounded-lg text-xs">Confirm</button>
            </div>
        </div>
    `;
    
    document.getElementById('investment-amount').focus();
    
    document.getElementById('investment-amount').addEventListener('input', (e) => {
        const feedbackEl = document.getElementById('transaction-feedback');
        const amount = parseFloat(e.target.value);
        if (isNaN(amount) || amount <= 0) {
            feedbackEl.innerHTML = '';
            return;
        }
        if (type === 'buy') {
            const quantity = amount / asset.price;
            feedbackEl.innerHTML = `You will get <span class="font-bold text-white">${quantity.toFixed(6)}</span> shares.`;
        } else {
            const value = amount * asset.price;
            feedbackEl.innerHTML = `You will receive <span class="font-bold text-white">$${value.toFixed(2)}</span>.`;
        }
    });
};

// Executes the buy or sell logic
window.executeTransaction = function(assetId, type) {
    const asset = getInvestmentById(assetId);
    const amountInput = document.getElementById('investment-amount');
    if (!amountInput) return;
    
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (!state.portfolio[assetId]) {
        state.portfolio[assetId] = { quantity: 0, totalCost: 0 };
    }

    if (type === 'buy') {
        const cost = amount; // Input is in dollars
        if (cost > state.balance) {
            alert("Insufficient funds.");
            return;
        }
        const quantity = cost / asset.price;
        state.balance -= cost;
        state.portfolio[assetId].quantity += quantity;
        state.portfolio[assetId].totalCost += cost;
    } else { // sell
        const quantity = amount; // Input is in shares
        const holding = state.portfolio[assetId].quantity || 0;
        if (quantity > holding) {
            alert("You don't own that many shares.");
            return;
        }
        const avgCost = state.portfolio[assetId].totalCost / holding;
        const proceeds = quantity * asset.price;
        state.balance += proceeds;
        state.portfolio[assetId].quantity -= quantity;
        state.portfolio[assetId].totalCost -= quantity * avgCost; // Reduce total cost proportionally
        if (state.portfolio[assetId].quantity <= 0) {
             state.portfolio[assetId].totalCost = 0;
        }
    }

    window.renderInvestmentAsset(assetId, asset.category);
    window.updateUI({ scroll: false, animate: false });
};


// Helper to find an investment by its ID across all categories
function getInvestmentById(id) {
    if (window.INVESTMENT_DATA.indexFund.id === id) {
        return { ...window.INVESTMENT_DATA.indexFund, category: 'indexFund' };
    }
    for (const category of ['commodities', 'stocks', 'crypto']) {
        const investment = window.INVESTMENT_DATA[category].find(inv => inv.id === id);
        if (investment) {
            return { ...investment, category };
        }
    }
    return null;
}

// Market simulation function
window.simulateMarket = function() {
    if (!state.investmentHistory) {
        state.investmentHistory = {};
    }

    // --- Store previous day's value BEFORE simulating ---
    const portfolio = state.portfolio || {};
    state.previousPortfolioValue = Object.keys(portfolio).reduce((sum, key) => {
        const investment = getInvestmentById(key);
        const holding = portfolio[key];
        if (investment && holding && holding.quantity > 0) {
            return sum + (holding.quantity * investment.price);
        }
        return sum;
    }, 0);


    const allInvestments = [
        window.INVESTMENT_DATA.indexFund,
        ...window.INVESTMENT_DATA.commodities,
        ...window.INVESTMENT_DATA.stocks,
        ...window.INVESTMENT_DATA.crypto
    ];

    allInvestments.forEach(asset => {
        // --- Price Simulation ---
        const volatility = asset.volatility;
        const trend = asset.trend;
        const randomFactor = (Math.random() - 0.5) * volatility;
        let newPrice = asset.price * (1 + randomFactor);
        newPrice *= trend;
        const minPrice = asset.originalPrice * 0.01;
        asset.price = Math.max(minPrice, newPrice);

        // --- History Tracking ---
        if (!state.investmentHistory[asset.id]) {
            state.investmentHistory[asset.id] = [];
        }
        // Add the new price to the history
        state.investmentHistory[asset.id].push(asset.price);
        // Optional: Keep history to a manageable size, e.g., last 30 days
        if (state.investmentHistory[asset.id].length > 30) {
            state.investmentHistory[asset.id].shift();
        }
    });
};

function generateSparklineSVG(data, isPositive) {
    const width = 300;
    const height = 96; // h-24
    const strokeWidth = 2;
    const color = isPositive ? '#22c55e' : '#ef4444';

    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - strokeWidth * 2) + strokeWidth;
        const y = height - ((d - min) / range) * (height - strokeWidth * 2) - strokeWidth;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    const lastPointY = parseFloat(points.split(' ').pop().split(',')[1]);

    return `
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradient-${isPositive ? 'pos' : 'neg'}" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke="${color}"
                stroke-width="${strokeWidth}"
                stroke-linecap="round"
                stroke-linejoin="round"
                points="${points}"
            />
            <polygon
                fill="url(#gradient-${isPositive ? 'pos' : 'neg'})"
                points="0,${height} ${points} ${width},${height}"
            />
             <line x1="0" y1="${lastPointY}" x2="${width}" y2="${lastPointY}" stroke="${color}" stroke-width="1" stroke-dasharray="2, 3" />
        </svg>
    `;
}
