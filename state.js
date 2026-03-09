// state.js - Centralized State Management for Lifepath AI

const StateManager = {
  summaryKey: "lifepath_data",
  portfolioKey: "lifepath_portfolio",

  getDefaultSummary() {
    return {
      netWorth: 286500,
      wellnessScore: 78,
      liquidityMonths: 8.3,
      retirementProbability: 74,
      diversification: 81,
      fragility: 63,
      activeScenario: "None",
      lastUpdated: "Today at 9:00 AM",
      dataSource: "Simulated LifePath dataset"
    };
  },

  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  mergeDeep(target, source) {
    if (!source || typeof source !== "object") return target;
    const output = Array.isArray(target) ? [...target] : { ...target };

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (Array.isArray(sourceValue)) {
        output[key] = this.clone(sourceValue);
      } else if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue)
      ) {
        output[key] = this.mergeDeep(
          targetValue && typeof targetValue === "object" ? targetValue : {},
          sourceValue
        );
      } else {
        output[key] = sourceValue;
      }
    });

    return output;
  },

  getDefaultPortfolio() {
    return {
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
      insights: [],
      linkedAccounts: [],
      assetBreakdown: [],
      analytics: {},
      scenarios: {}
    };
  },

  init() {
    if (!localStorage.getItem(this.summaryKey)) {
      localStorage.setItem(
        this.summaryKey,
        JSON.stringify(this.getDefaultSummary())
      );
    }

    const defaultPortfolio = this.getDefaultPortfolio();
    const existingRaw = localStorage.getItem(this.portfolioKey);

    if (!existingRaw) {
      localStorage.setItem(
        this.portfolioKey,
        JSON.stringify(defaultPortfolio)
      );
    } else {
      try {
        const existingPortfolio = JSON.parse(existingRaw);
        const repairedPortfolio = this.mergeDeep(
          defaultPortfolio,
          existingPortfolio
        );
        localStorage.setItem(
          this.portfolioKey,
          JSON.stringify(repairedPortfolio)
        );
      } catch (e) {
        localStorage.setItem(
          this.portfolioKey,
          JSON.stringify(defaultPortfolio)
        );
      }
    }

    // CRITICAL FIX: always expose portfolio to charts
    const portfolio = this.getPortfolio();
    window.mockPortfolio = portfolio;
  },

  get() {
    this.init();
    const raw = localStorage.getItem(this.summaryKey);
    try {
      return JSON.parse(raw);
    } catch (e) {
      const fallback = this.getDefaultSummary();
      localStorage.setItem(this.summaryKey, JSON.stringify(fallback));
      return fallback;
    }
  },

  update(newValues) {
    const currentState = this.get();
    const updatedState = { ...currentState, ...newValues };
    localStorage.setItem(this.summaryKey, JSON.stringify(updatedState));
    return updatedState;
  },

  getPortfolio() {
    const raw = localStorage.getItem(this.portfolioKey);
    const defaultPortfolio = this.getDefaultPortfolio();

    try {
      const parsed = raw ? JSON.parse(raw) : {};
      return this.mergeDeep(defaultPortfolio, parsed);
    } catch (e) {
      localStorage.setItem(
        this.portfolioKey,
        JSON.stringify(defaultPortfolio)
      );
      return defaultPortfolio;
    }
  },

  setPortfolio(portfolio) {
    const defaultPortfolio = this.getDefaultPortfolio();
    const safePortfolio = this.mergeDeep(defaultPortfolio, portfolio || {});

    localStorage.setItem(
      this.portfolioKey,
      JSON.stringify(safePortfolio)
    );

    window.mockPortfolio = safePortfolio;

    return safePortfolio;
  },

  updatePortfolio(partial) {
    const currentPortfolio = this.getPortfolio();
    const updatedPortfolio = this.mergeDeep(
      currentPortfolio,
      partial || {}
    );

    return this.setPortfolio(updatedPortfolio);
  },

  replaceLinkedAccounts(linkedAccounts) {
    const portfolio = this.getPortfolio();
    portfolio.linkedAccounts = Array.isArray(linkedAccounts)
      ? linkedAccounts
      : [];

    return this.setPortfolio(portfolio);
  },

  reset() {
    localStorage.removeItem(this.summaryKey);
    localStorage.removeItem(this.portfolioKey);
    this.init();
  },

  syncMockPortfolioToState() {
    if (window.mockPortfolio) {
      this.setPortfolio(window.mockPortfolio);
    }
  }
};

StateManager.init();
