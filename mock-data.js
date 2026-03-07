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
    "Your liquidity buffer covers about 8 months of essential expenses.",
    "Crypto exposure is slightly high relative to your balanced risk profile.",
    "Your portfolio is diversified, but private assets are less liquid in emergencies."
  ],

  linkedAccounts: [
    { name: "DBS / POSB", category: "Bank", balance: 22000, status: "Connected" },
    { name: "OCBC", category: "Bank", balance: 15000, status: "Connected" },
    { name: "Syfe", category: "Investment", balance: 38500, status: "Connected" },
    { name: "Endowus", category: "Investment", balance: 29000, status: "Connected" },
    { name: "Tiger Brokers", category: "Investment", balance: 42000, status: "Connected" },
    { name: "Crypto.com", category: "Crypto", balance: 14500, status: "Connected" },
    { name: "MetaMask", category: "Crypto", balance: 25500, status: "Connected" },
    { name: "3D Printing Equipment", category: "Private Asset", balance: 100000, status: "Manual" }
  ],

  assetBreakdown: [
    { asset: "Cash Accounts", type: "Liquid", value: 37000 },
    { asset: "ETF / Equity Portfolio", type: "Market", value: 109500 },
    { asset: "Crypto Wallets", type: "Volatile", value: 40000 },
    { asset: "Private Equipment", type: "Illiquid", value: 100000 }
  ],

  analytics: {
    diversification: 81,
    liquidity: 74,
    fragility: 63,
    behavior: 79,
    suggestedActions: [
      "Reduce crypto allocation from 14% to below 10% over the next 3 months.",
      "Increase emergency cash buffer by S$8,000 to strengthen shock resilience.",
      "Set a cooling-off rule before selling during sharp market drops.",
      "Gradually shift part of private-asset concentration into liquid diversified ETFs."
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