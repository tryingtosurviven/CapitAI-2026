// state.js - Centralized State Management for Lifepath AI

const StateManager = {
  summaryKey: "lifepath_data",
  portfolioKey: "lifepath_portfolio",

  getDefaultSummary() {
    return {
      netWorth: 286500,
      wellnessScore: 78,
      liquidityMonths: 8.8,
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

  getSeedPortfolio() {
    if (!window.__lifepathSeedPortfolio) {
      if (window.mockPortfolio) {
        window.__lifepathSeedPortfolio = this.clone(window.mockPortfolio);
      } else {
        window.__lifepathSeedPortfolio = {
          user: {
            name: "Demo Investor",
            profile: "Balanced",
            goal: "Retire by 50"
          },
          summary: {
            netWorth: 286500,
            wealthWellnessScore: 78,
            monthlyExpenses: 4200,
            emergencyMonths: 8.8
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
      }
    }
    return this.clone(window.__lifepathSeedPortfolio);
  },

  getDefaultPortfolio() {
    return this.getSeedPortfolio();
  },

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  round(value) {
    return Math.round(value);
  },

  computePortfolioNumbers(portfolio) {
    const safePortfolio = this.mergeDeep(this.getDefaultPortfolio(), portfolio || {});
    const assetBreakdown = Array.isArray(safePortfolio.assetBreakdown) ? safePortfolio.assetBreakdown : [];
    const allocation = Array.isArray(safePortfolio.allocation) ? safePortfolio.allocation : [];
    const linkedAccounts = Array.isArray(safePortfolio.linkedAccounts) ? safePortfolio.linkedAccounts : [];

    let cashValue = 0;
    let investmentsValue = 0;
    let cryptoValue = 0;
    let privateValue = 0;

    if (assetBreakdown.length > 0) {
      assetBreakdown.forEach((item) => {
        const assetName = String(item.asset || "").toLowerCase();
        const value = Number(item.value || 0);

        if (assetName.includes("cash")) cashValue += value;
        else if (assetName.includes("etf") || assetName.includes("equity") || assetName.includes("portfolio")) investmentsValue += value;
        else if (assetName.includes("crypto")) cryptoValue += value;
        else if (assetName.includes("private") || assetName.includes("equipment")) privateValue += value;
      });
    } else if (allocation.length > 0) {
      allocation.forEach((item) => {
        const label = String(item.label || "").toLowerCase();
        const value = Number(item.value || 0);

        if (label.includes("cash")) cashValue += value;
        else if (label.includes("investment")) investmentsValue += value;
        else if (label.includes("crypto")) cryptoValue += value;
        else if (label.includes("private")) privateValue += value;
      });
    } else if (linkedAccounts.length > 0) {
      linkedAccounts.forEach((item) => {
        const value = Number(item.balance || 0);
        if (item.category === "Bank") cashValue += value;
        else if (item.category === "Investment") investmentsValue += value;
        else if (item.category === "Crypto") cryptoValue += value;
        else if (item.category === "Private Asset") privateValue += value;
      });
    }

    const netWorth = cashValue + investmentsValue + cryptoValue + privateValue;
    const monthlyExpenses = Number(safePortfolio.summary?.monthlyExpenses || 4200);
    const emergencyMonths = monthlyExpenses > 0 ? +(cashValue / monthlyExpenses).toFixed(1) : 0;

    safePortfolio.summary = {
      ...safePortfolio.summary,
      netWorth,
      monthlyExpenses,
      emergencyMonths
    };

    safePortfolio.allocation = [
      { label: "Cash", value: cashValue, color: "#4f46e5" },
      { label: "Investments", value: investmentsValue, color: "#06b6d4" },
      { label: "Crypto", value: cryptoValue, color: "#f59e0b" },
      { label: "Private Assets", value: privateValue, color: "#10b981" }
    ];

    return safePortfolio;
  },

  computeWWI(portfolio) {
    const allocation = Array.isArray(portfolio.allocation) ? portfolio.allocation : [];
    const summary = portfolio.summary || {};
    const monthlyExpenses = Number(summary.monthlyExpenses || 4200);

    const total = allocation.reduce((sum, item) => sum + Number(item.value || 0), 0);

    const bucketValue = (label) => {
      const match = allocation.find(item => item.label === label);
      return Number(match?.value || 0);
    };

    const cashValue = bucketValue("Cash");
    const investmentsValue = bucketValue("Investments");
    const cryptoValue = bucketValue("Crypto");
    const privateValue = bucketValue("Private Assets");

    const cashPct = total > 0 ? cashValue / total : 0;
const investmentsPct = total > 0 ? investmentsValue / total : 0;
const cryptoPct = total > 0 ? cryptoValue / total : 0;
const privatePct = total > 0 ? privateValue / total : 0;
const liquidPct = total > 0 ? (cashValue + investmentsValue) / total : 0;
const emergencyMonths = monthlyExpenses > 0 ? +(cashValue / monthlyExpenses).toFixed(1) : 0;

    // Diversification
    const shares = [cashPct, investmentsPct, cryptoPct, privatePct].filter(v => v > 0);
    const hhi = shares.reduce((sum, s) => sum + (s * s), 0);
    const maxBucket = Math.max(cashPct, investmentsPct, cryptoPct, privatePct);

    let diversification = 100;
    diversification -= Math.max(0, (hhi - 0.25) * 90);
    diversification -= Math.max(0, (maxBucket - 0.45) * 70);
    diversification -= Math.max(0, (cryptoPct - 0.20) * 45);
    diversification = this.clamp(this.round(diversification), 35, 95);

    // Liquidity Strength
    let liquidity = 35;
    liquidity += Math.min(40, emergencyMonths * 5.5);
    liquidity += Math.min(20, cashPct * 100 * 0.35);
    liquidity += Math.min(10, liquidPct * 100 * 0.1);
    liquidity -= Math.max(0, (privatePct - 0.35) * 30);
    liquidity = this.clamp(this.round(liquidity), 25, 98);

    // Fragility Score
    let fragility = 82;
    fragility -= Math.max(0, cryptoPct - 0.10) * 85;
    fragility -= Math.max(0, privatePct - 0.30) * 45;
    fragility -= Math.max(0, 0.12 - cashPct) * 120;
    fragility -= Math.max(0, 6 - emergencyMonths) * 3.5;
    fragility += Math.min(8, investmentsPct * 10);
    fragility = this.clamp(this.round(fragility), 20, 95);

    // Behavior Discipline
    let behavior = 78;
    behavior -= Math.max(0, cryptoPct - 0.12) * 55;
    behavior -= Math.max(0, maxBucket - 0.50) * 35;
    behavior += Math.min(8, emergencyMonths * 0.6);
    behavior += cashPct >= 0.10 ? 4 : 0;
    behavior = this.clamp(this.round(behavior), 35, 95);

    // Goal Viability
    let goalViability = 70;
    goalViability += Math.min(10, investmentsPct * 12);
    goalViability += Math.min(8, emergencyMonths * 0.7);
    goalViability -= Math.max(0, cryptoPct - 0.18) * 35;
    goalViability -= Math.max(0, privatePct - 0.40) * 18;
    goalViability = this.clamp(this.round(goalViability), 40, 95);

    const wealthWellnessScore = this.clamp(
      this.round(
        diversification * 0.25 +
        liquidity * 0.25 +
        fragility * 0.20 +
        behavior * 0.15 +
        goalViability * 0.15
      ),
      0,
      100
    );

    return {
      diversification,
      liquidity,
      fragility,
      behavior,
      goalViability,
      wealthWellnessScore,
      derived: {
        total,
        cashPct,
        investmentsPct,
        cryptoPct,
        privatePct,
        liquidPct,
        emergencyMonths,
        maxBucket
      }
    };
  },

  generateInsights(portfolio, analytics) {
    const d = analytics.derived;
    const insights = [];

    if (d.emergencyMonths >= 8) {
      insights.push(`You have around ${d.emergencyMonths.toFixed(1)} months of essential expenses in cash, which is a healthy liquidity buffer.`);
    } else if (d.emergencyMonths >= 6) {
      insights.push(`Your cash reserve covers about ${d.emergencyMonths.toFixed(1)} months of expenses. This is reasonable, but there is room to strengthen resilience.`);
    } else {
      insights.push(`Your liquidity buffer is only about ${d.emergencyMonths.toFixed(1)} months. This leaves the portfolio more exposed to short-term shocks.`);
    }

    if (d.cryptoPct > 0.18) {
      insights.push("Crypto exposure is above the ideal range for a balanced profile. Gradual de-risking could improve resilience and reduce fragility.");
    } else {
      insights.push("Your digital asset exposure remains within a more manageable range for a balanced investor profile.");
    }

    if (d.privatePct > 0.30) {
      insights.push("Private assets add long-term value, but a large share of illiquid wealth can reduce flexibility during stress events.");
    } else {
      insights.push("The portfolio maintains a reasonable balance between liquid market assets and long-term private holdings.");
    }

    return insights;
  },

  generateSuggestedActions(portfolio, analytics) {
    const d = analytics.derived;
    const actions = [];

    if (d.cryptoPct > 0.18) {
      actions.push("Dial crypto down toward an 8–12% range over the next 3–6 months using scheduled rebalancing instead of reactive selling.");
    }

    if (d.emergencyMonths < 9) {
      const monthlyExpenses = Number(portfolio.summary?.monthlyExpenses || 4200);
      const targetCash = monthlyExpenses * 9;
      const currentCash = d.cashPct * d.total;
      const shortfall = Math.max(0, Math.round(targetCash - currentCash));
      actions.push(`Top up your emergency cash by about S$${shortfall.toLocaleString("en-SG")} so you consistently maintain at least 9 months of liquid runway.`);
    }

    if (d.privatePct > 0.35) {
      actions.push("Gradually move a small slice of private-asset concentration into diversified ETFs so more of your wealth remains flexible and scenario-resilient.");
    }

    if (d.maxBucket > 0.50) {
      actions.push("Introduce a concentration guardrail: review and rebalance any single asset bucket that grows above 50% of total wealth.");
    }

    actions.push("Create a simple 24-hour cooling-off rule before reacting to large market drops. This can improve behavioral discipline and reduce regret-driven decisions.");

    return actions.slice(0, 4);
  },

  enrichPortfolio(portfolio) {
    const computedPortfolio = this.computePortfolioNumbers(portfolio);
    const wwi = this.computeWWI(computedPortfolio);

    computedPortfolio.summary = {
      ...computedPortfolio.summary,
      wealthWellnessScore: wwi.wealthWellnessScore,
      emergencyMonths: wwi.derived.emergencyMonths
    };

    computedPortfolio.analytics = {
      ...(computedPortfolio.analytics || {}),
      diversification: wwi.diversification,
      liquidity: wwi.liquidity,
      fragility: wwi.fragility,
      behavior: wwi.behavior,
      goalViability: wwi.goalViability,
      wealthWellnessScore: wwi.wealthWellnessScore,
      derived: wwi.derived
    };

    computedPortfolio.insights = this.generateInsights(computedPortfolio, wwi);

    const existingActions = Array.isArray(computedPortfolio.analytics?.suggestedActions)
      ? computedPortfolio.analytics.suggestedActions
      : [];

    computedPortfolio.analytics.suggestedActions =
      existingActions.length > 0
        ? existingActions
        : this.generateSuggestedActions(computedPortfolio, wwi);

    return computedPortfolio;
  },

  syncSummaryWithPortfolio(portfolio) {
    const computedPortfolio = this.enrichPortfolio(portfolio);
    const currentState = this.get();

    const updatedState = {
      ...currentState,
      netWorth: computedPortfolio.summary.netWorth,
      wellnessScore: computedPortfolio.summary.wealthWellnessScore,
      liquidityMonths: computedPortfolio.summary.emergencyMonths,
      diversification: computedPortfolio.analytics.diversification,
      fragility: computedPortfolio.analytics.fragility
    };

    localStorage.setItem(this.summaryKey, JSON.stringify(updatedState));
    return updatedState;
  },

  init() {
    if (!localStorage.getItem(this.summaryKey)) {
      localStorage.setItem(this.summaryKey, JSON.stringify(this.getDefaultSummary()));
    }

    const defaultPortfolio = this.enrichPortfolio(this.getDefaultPortfolio());
    const existingRaw = localStorage.getItem(this.portfolioKey);

    if (!existingRaw) {
      localStorage.setItem(this.portfolioKey, JSON.stringify(defaultPortfolio));
    } else {
      try {
        const existingPortfolio = JSON.parse(existingRaw);
        const repairedPortfolio = this.enrichPortfolio(
          this.mergeDeep(defaultPortfolio, existingPortfolio)
        );
        localStorage.setItem(this.portfolioKey, JSON.stringify(repairedPortfolio));
      } catch (e) {
        localStorage.setItem(this.portfolioKey, JSON.stringify(defaultPortfolio));
      }
    }

    const portfolio = this.getPortfolio();
    window.mockPortfolio = this.clone(portfolio);
    this.syncSummaryWithPortfolio(portfolio);
  },

  get() {
    const raw = localStorage.getItem(this.summaryKey);
    try {
      return raw ? JSON.parse(raw) : this.getDefaultSummary();
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
    const defaultPortfolio = this.enrichPortfolio(this.getDefaultPortfolio());

    try {
      const parsed = raw ? JSON.parse(raw) : {};
      return this.enrichPortfolio(this.mergeDeep(defaultPortfolio, parsed));
    } catch (e) {
      localStorage.setItem(this.portfolioKey, JSON.stringify(defaultPortfolio));
      return defaultPortfolio;
    }
  },

  setPortfolio(portfolio) {
    const defaultPortfolio = this.getDefaultPortfolio();
    const safePortfolio = this.enrichPortfolio(
      this.mergeDeep(defaultPortfolio, portfolio || {})
    );

    localStorage.setItem(this.portfolioKey, JSON.stringify(safePortfolio));
    window.mockPortfolio = this.clone(safePortfolio);
    this.syncSummaryWithPortfolio(safePortfolio);

    return safePortfolio;
  },

  updatePortfolio(partial) {
    const currentPortfolio = this.getPortfolio();
    const updatedPortfolio = this.mergeDeep(currentPortfolio, partial || {});
    return this.setPortfolio(updatedPortfolio);
  },

  replaceLinkedAccounts(linkedAccounts) {
    const portfolio = this.getPortfolio();
    portfolio.linkedAccounts = Array.isArray(linkedAccounts) ? linkedAccounts : [];
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
