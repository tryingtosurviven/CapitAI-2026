window.mockPortfolio = {
  user: {
    name: "Demo Investor",
    profile: "Balanced",
    goal: "Retire by 50"
  },

  summary: {
    netWorth: 286500,
    wealthWellnessScore: 78,
    monthlyExpenses: 4200,
    emergencyMonths: 8.3
  },

  detailedAccounts: {
    Bank: [
      { coin: "Savings Account", symbol: "POSB", wallet: "POSB Digibank", balance: 15000, valueUsd: 11070 },
      { coin: "Multiplier Account", symbol: "DBS", wallet: "DBS iWealth", balance: 12000, valueUsd: 8856 },
      { coin: "360 Account", symbol: "OCBC", wallet: "OCBC Digital", balance: 10000, valueUsd: 7380 }
    ],
    Investment: [
      { coin: "S&P 500 ETF", symbol: "VOO", wallet: "Tiger Brokers", balance: 42000, valueUsd: 30996 },
      { coin: "REIT+ Portfolio", symbol: "REIT", wallet: "Syfe", balance: 38500, valueUsd: 28413 },
      { coin: "Core Equity", symbol: "CASH+", wallet: "Endowus", balance: 29000, valueUsd: 21402 }
    ],
    Crypto: [
      { coin: "Bitcoin", symbol: "BTC", wallet: "Crypto.com App", balance: 10000, valueUsd: 7380 },
      { coin: "Ethereum", symbol: "ETH", wallet: "MetaMask (Mainnet)", balance: 15000, valueUsd: 11070 },
      { coin: "Solana", symbol: "SOL", wallet: "Crypto.com App", balance: 4500, valueUsd: 3321 },
      { coin: "Chainlink", symbol: "LINK", wallet: "MetaMask (Mainnet)", balance: 6000, valueUsd: 4428 },
      { coin: "Polygon", symbol: "MATIC", wallet: "MetaMask (Mainnet)", balance: 4500, valueUsd: 3321 }
    ],
    "Private Asset": [
      { coin: "3D Printer Cluster", symbol: "BIZ", wallet: "Physical Assets", balance: 100000, valueUsd: 73800 }
    ]
  },

  allocation: [
    { label: "Cash", value: 37000, color: "#4f46e5" },
    { label: "Investments", value: 109500, color: "#06b6d4" },
    { label: "Crypto", value: 40000, color: "#f59e0b" },
    { label: "Private Assets", value: 100000, color: "#10b981" }
  ],

  insights: [
    "You have around 8 months of essential expenses in cash, which is a healthy liquidity buffer.",
    "Crypto is slightly above your target range for a balanced profile. Gradual de-risking can reduce future stress.",
    "Private assets like your 3D printing business are valuable but illiquid. They should not be your first line of defence in an emergency."
  ],

  linkedAccounts: [
    { name: "CASH ACCOUNTS", category: "Bank", balance: 37000, status: "Connected" },
    { name: "ETF / EQUITY PORTFOLIO", category: "Investment", balance: 109500, status: "Connected" },
    { name: "CRYPTO WALLETS", category: "Crypto", balance: 40000, status: "Connected" },
    { name: "PRIVATE EQUIPMENT", category: "Private Asset", balance: 100000, status: "Owned" }
  ],

  assetBreakdown: [
    { asset: "Cash Accounts", type: "Liquid", value: 37000, liquidityTier: "T+0", ladderNote: "Immediately accessible for expenses and emergencies." },
    { asset: "ETF / Equity Portfolio", type: "Market", value: 109500, liquidityTier: "T+2", ladderNote: "Can usually be sold and settled within 2 trading days." },
    { asset: "Crypto Wallets", type: "Volatile", value: 40000, liquidityTier: "T+0 to T+1", ladderNote: "Fast to access, but highly volatile under stress scenarios." },
    { asset: "Private Equipment", type: "Illiquid", value: 100000, liquidityTier: "T+30+", ladderNote: "High value but slower to monetize in an emergency." }
  ],

  analytics: {
    diversification: 81,
    liquidity: 74,
    fragility: 63,
    behavior: 79,
    suggestedActions: [
      "Dial crypto down from 14% toward 8–10% over the next 3–6 months, using scheduled rebalancing instead of panic selling.",
      "Top up your emergency cash by about S$8,000 so you always have at least 9–12 months of expenses in liquid form.",
      "Create a simple rule: wait 24 hours before reacting to big market drops. This reduces emotional, regret-driven trades.",
      "Gradually shift a small slice of your private-asset value into diversified ETFs so more of your wealth is liquid and flexible."
    ]
  },

  scenarios: {
    base: {
      netWorth: 286500,
      wellnessScore: 78,
      retirementProbability: 74,
      liquidityMonths: 8.3,
      wealthSurvivalYears: 18.4,
      liquidityFailureMonths: 8.3,
      regretProbability: "LOW",
      actionPriority: "Stay disciplined",
      headline: "Stable baseline with moderate volatility exposure.",
      changeText: "This is your current baseline before any shock is applied."
    },

    marketCrash: {
      netWorth: 228400,
      wellnessScore: 61,
      retirementProbability: 56,
      liquidityMonths: 6.4,
      wealthSurvivalYears: 11.0,
      liquidityFailureMonths: 3.2,
      regretProbability: "HIGH",
      actionPriority: "Protect liquidity first",
      headline: "A -30% market crash materially weakens your long-term plan.",
      changeText: "Equities fall sharply, confidence drops, and liquid market wealth shrinks quickly."
    },

    cryptoCrash: {
      netWorth: 254500,
      wellnessScore: 68,
      retirementProbability: 63,
      liquidityMonths: 7.6,
      wealthSurvivalYears: 13.8,
      liquidityFailureMonths: 4.6,
      regretProbability: "HIGH",
      actionPriority: "Reduce concentration",
      headline: "Crypto volatility spills into overall portfolio confidence.",
      changeText: "Digital asset prices fall sharply and drag down your total portfolio value."
    },

    jobLoss: {
      netWorth: 279000,
      wellnessScore: 59,
      retirementProbability: 60,
      liquidityMonths: 4.1,
      wealthSurvivalYears: 9.4,
      liquidityFailureMonths: 2.7,
      regretProbability: "HIGH",
      actionPriority: "Extend cash runway",
      headline: "A 6-month income loss exposes your short-term fragility.",
      changeText: "Income stops temporarily, increasing pressure on liquidity and emergency reserves."
    },

    housingPurchase: {
      netWorth: 268000,
      wellnessScore: 62,
      retirementProbability: 58,
      liquidityMonths: 3.8,
      wealthSurvivalYears: 10.6,
      liquidityFailureMonths: 2.4,
      regretProbability: "MEDIUM",
      actionPriority: "Avoid overcommitting",
      headline: "A housing purchase reduces flexibility and concentrates wealth.",
      changeText: "Down payment and associated costs reduce available cash and increase illiquid exposure."
    },

    childEducation: {
      netWorth: 272500,
      wellnessScore: 65,
      retirementProbability: 61,
      liquidityMonths: 5.0,
      wealthSurvivalYears: 12.1,
      liquidityFailureMonths: 3.5,
      regretProbability: "MEDIUM",
      actionPriority: "Start goal-based funding",
      headline: "Education planning adds recurring long-term funding pressure.",
      changeText: "Education costs reduce future investable surplus and make disciplined planning more important."
    }
  }
};