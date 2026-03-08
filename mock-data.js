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
    { name: "DBS / POSB", category: "Bank", balance: 22000, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "OCBC", category: "Bank", balance: 15000, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "Syfe", category: "Investment", balance: 38500, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "Endowus", category: "Investment", balance: 29000, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "Tiger Brokers", category: "Investment", balance: 42000, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "Crypto.com", category: "Crypto", balance: 14500, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "MetaMask", category: "Crypto", balance: 25500, status: "Connected", source: "Live FMP API", updatedAt: "Today at 9:00 AM" },
    { name: "3D Printing Equipment", category: "Private Asset", balance: 100000, status: "Manual", source: "Manual Entry", updatedAt: "Today at 9:00 AM" }
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
      liquidityMonths: 8.3
    },
    recession: {
      netWorth: 248000,
      wellnessScore: 67,
      retirementProbability: 61,
      liquidityMonths: 7.8,
      changeText: "Global equities weaken, private assets slow down, and risk appetite falls."
    },
    cryptoCrash: {
      netWorth: 262500,
      wellnessScore: 70,
      retirementProbability: 66,
      liquidityMonths: 8.1,
      changeText: "Digital asset prices fall sharply and drag down your total portfolio value."
    },
    rateHike: {
      netWorth: 274200,
      wellnessScore: 72,
      retirementProbability: 69,
      liquidityMonths: 7.4,
      changeText: "Higher interest rates reduce asset valuations and increase future borrowing stress."
    },
    jobLoss: {
      netWorth: 281000,
      wellnessScore: 64,
      retirementProbability: 65,
      liquidityMonths: 5.2,
      changeText: "Income stops temporarily, increasing pressure on liquidity and emergency reserves."
    },
    medicalEmergency: {
      netWorth: 270000,
      wellnessScore: 68,
      retirementProbability: 67,
      liquidityMonths: 6.0,
      changeText: "Unexpected healthcare costs reduce your cash buffer and short-term resilience."
    }
  }
};