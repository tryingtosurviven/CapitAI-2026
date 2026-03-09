require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value);
}

function computeWWI({ cashValue, securitiesValue, cryptoValue, privateAssetsValue, monthlyExpenses = 4200 }) {
  const total = cashValue + securitiesValue + cryptoValue + privateAssetsValue;

  const cashPct = total > 0 ? cashValue / total : 0;
  const investmentsPct = total > 0 ? securitiesValue / total : 0;
  const cryptoPct = total > 0 ? cryptoValue / total : 0;
  const privatePct = total > 0 ? privateAssetsValue / total : 0;
  const liquidPct = total > 0 ? (cashValue + securitiesValue) / total : 0;
  const emergencyMonths = monthlyExpenses > 0 ? cashValue / monthlyExpenses : 0;

  const shares = [cashPct, investmentsPct, cryptoPct, privatePct].filter(v => v > 0);
  const hhi = shares.reduce((sum, s) => sum + (s * s), 0);
  const maxBucket = Math.max(cashPct, investmentsPct, cryptoPct, privatePct);

  let diversification = 100;
  diversification -= Math.max(0, (hhi - 0.25) * 90);
  diversification -= Math.max(0, (maxBucket - 0.45) * 70);
  diversification -= Math.max(0, (cryptoPct - 0.20) * 45);
  diversification = clamp(round(diversification), 35, 95);

  let liquidity = 35;
  liquidity += Math.min(40, emergencyMonths * 5.5);
  liquidity += Math.min(20, cashPct * 100 * 0.35);
  liquidity += Math.min(10, liquidPct * 100 * 0.1);
  liquidity -= Math.max(0, (privatePct - 0.35) * 30);
  liquidity = clamp(round(liquidity), 25, 98);

  let fragility = 82;
  fragility -= Math.max(0, cryptoPct - 0.10) * 85;
  fragility -= Math.max(0, privatePct - 0.30) * 45;
  fragility -= Math.max(0, 0.12 - cashPct) * 120;
  fragility -= Math.max(0, 6 - emergencyMonths) * 3.5;
  fragility += Math.min(8, investmentsPct * 10);
  fragility = clamp(round(fragility), 20, 95);

  let behavior = 78;
  behavior -= Math.max(0, cryptoPct - 0.12) * 55;
  behavior -= Math.max(0, maxBucket - 0.50) * 35;
  behavior += Math.min(8, emergencyMonths * 0.6);
  behavior += cashPct >= 0.10 ? 4 : 0;
  behavior = clamp(round(behavior), 35, 95);

  let goalViability = 70;
  goalViability += Math.min(10, investmentsPct * 12);
  goalViability += Math.min(8, emergencyMonths * 0.7);
  goalViability -= Math.max(0, cryptoPct - 0.18) * 35;
  goalViability -= Math.max(0, privatePct - 0.40) * 18;
  goalViability = clamp(round(goalViability), 40, 95);

  const wealthWellnessScore = clamp(
    round(
      diversification * 0.25 +
      liquidity * 0.25 +
      fragility * 0.20 +
      behavior * 0.15 +
      goalViability * 0.15
    ),
    0,
    100
  );

  const analytics = {
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

  const insights = [];

  if (emergencyMonths >= 8) {
    insights.push(`You have around ${emergencyMonths.toFixed(1)} months of essential expenses in cash, which is a healthy liquidity buffer.`);
  } else if (emergencyMonths >= 6) {
    insights.push(`Your cash reserve covers about ${emergencyMonths.toFixed(1)} months of expenses. This is reasonable, but there is room to strengthen resilience.`);
  } else {
    insights.push(`Your liquidity buffer is only about ${emergencyMonths.toFixed(1)} months. This leaves the portfolio more exposed to short-term shocks.`);
  }

  if (cryptoPct > 0.18) {
    insights.push("Crypto exposure is above the ideal range for a balanced profile. Gradual de-risking could improve resilience and reduce fragility.");
  } else {
    insights.push("Your digital asset exposure remains within a more manageable range for a balanced investor profile.");
  }

  if (privatePct > 0.30) {
    insights.push("Private assets add long-term value, but a large share of illiquid wealth can reduce flexibility during stress events.");
  } else {
    insights.push("The portfolio maintains a reasonable balance between liquid market assets and long-term private holdings.");
  }

  const suggestedActions = [];

  if (cryptoPct > 0.18) {
    suggestedActions.push("Dial crypto down toward an 8–12% range over the next 3–6 months using scheduled rebalancing instead of reactive selling.");
  }

  if (emergencyMonths < 9) {
    const targetCash = monthlyExpenses * 9;
    const shortfall = Math.max(0, Math.round(targetCash - cashValue));
    suggestedActions.push(`Top up your emergency cash by about S$${shortfall.toLocaleString("en-SG")} so you consistently maintain at least 9 months of liquid runway.`);
  }

  if (privatePct > 0.35) {
    suggestedActions.push("Gradually move a small slice of private-asset concentration into diversified ETFs so more of your wealth remains flexible and scenario-resilient.");
  }

  if (maxBucket > 0.50) {
    suggestedActions.push("Introduce a concentration guardrail: review and rebalance any single asset bucket that grows above 50% of total wealth.");
  }

  suggestedActions.push("Create a simple 24-hour cooling-off rule before reacting to large market drops. This can improve behavioral discipline and reduce regret-driven decisions.");

  analytics.suggestedActions = suggestedActions.slice(0, 4);

  return {
    analytics,
    insights,
    summary: {
      netWorth: total,
      wealthWellnessScore,
      monthlyExpenses,
      emergencyMonths: +emergencyMonths.toFixed(1)
    }
  };
}

app.post("/api/chat", async (req, res) => {
  const { prompt, portfolioContext } = req.body;
  const q = prompt.toLowerCase();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemInstruction = `You are Lifepath AI. User Net Worth: $${portfolioContext.netWorth}. User Goal: Retire by 50. Assets include Cash, Stocks, Crypto, and $100k in 3D Printing Equipment. Focus on: ${prompt}`;
    const result = await model.generateContent([systemInstruction, prompt]);
    res.json({ response: result.response.text() });
  } catch (err) {
    console.log("AI Limit Hit - Switching to LifePath Mock Logic");

    let fallback = "";

    if (q.includes("house") || q.includes("afford")) {
      fallback = "As your Financial Digital Twin, I've analyzed your $1.5M house goal. Currently, your Net Worth suggests this would create 'Mortgage Stress'. I recommend delaying by 18 months.";
    } else if (q.includes("liquidity")) {
      fallback = "Liquidity Analysis: Your current cash-to-asset ratio is healthy. You have enough buffer to cover approximately 12 months of expenses.";
    } else if (q.includes("crash") || q.includes("drop")) {
      fallback = "Crash Scenario: If crypto drops 50%, your high cash allocation serves as a safety guardrail for your Wealth Wellness Score.";
    } else {
      fallback = "I recommend maintaining a 6-month liquidity buffer to preserve your high Wellness Score.";
    }

    res.json({ response: fallback });
  }
});

app.get("/api/portfolio", async (req, res) => {
  try {
    const portfolio = {
      user: {
        name: "Demo Investor",
        age: 32,
        riskProfile: "balanced",
        goal: "Retire by 50"
      },
      privateAssets: [
        { name: "3D Printing Equipment", value: 100000, type: "Illiquid", status: "Manual" }
      ],
      cashAccounts: [
        { name: "DBS / POSB", institution: "DBS", currency: "SGD", balance: 22000 },
        { name: "OCBC", institution: "OCBC", currency: "SGD", balance: 15000 }
      ],
      securities: [
        { symbol: "AAPL", qty: 20 },
        { symbol: "VOO", qty: 15 },
        { symbol: "TSLA", qty: 10 }
      ],
      crypto: [
        { symbol: "bitcoin", qty: 0.3 },
        { symbol: "ethereum", qty: 2.0 }
      ]
    };

    const fmpKey = process.env.FMP_API_KEY;

    for (let sec of portfolio.securities) {
      try {
        const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${sec.symbol}?apikey=${fmpKey}`;
        const { data } = await axios.get(fmpUrl);
        sec.price = (data && data[0]) ? data[0].price : (sec.symbol === "AAPL" ? 200 : 400);
      } catch (e) {
        console.log(`FMP API error for ${sec.symbol}, using mock.`);
        sec.price = (sec.symbol === "AAPL" ? 200 : 400);
      }
    }

    const cgKey = process.env.COINGECKO_API_KEY;
    let cryptoData;

    try {
      const cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&x_cg_demo_api_key=${cgKey}`;
      const response = await axios.get(cgUrl);
      cryptoData = response.data;
    } catch (e) {
      console.log("CoinGecko API error, using mock prices.");
      cryptoData = {
        bitcoin: { usd: 60000 },
        ethereum: { usd: 3000 }
      };
    }

    portfolio.crypto = portfolio.crypto.map(c => {
      const entry = cryptoData[c.symbol.toLowerCase()];
      const price = entry ? entry.usd : 0;
      return { ...c, price };
    });

    const cashValue = portfolio.cashAccounts.reduce((sum, a) => sum + a.balance, 0);
    const securitiesValue = portfolio.securities.reduce((sum, s) => sum + s.qty * s.price, 0);
    const cryptoValue = portfolio.crypto.reduce((sum, c) => sum + c.qty * c.price, 0);
    const privateAssetsValue = portfolio.privateAssets.reduce((sum, p) => sum + p.value, 0);

    const allocation = {
      cash: cashValue,
      securities: securitiesValue,
      crypto: cryptoValue,
      private: privateAssetsValue
    };

    const computed = computeWWI({
      cashValue,
      securitiesValue,
      cryptoValue,
      privateAssetsValue,
      monthlyExpenses: 4200
    });

    const metrics = {
      netWorth: computed.summary.netWorth,
      allocation,
      liquidityRatio: computed.analytics.derived.liquidPct,
      cryptoPct: computed.analytics.derived.cryptoPct,
      wellnessScore: computed.analytics.wealthWellnessScore,
      diversification: computed.analytics.diversification,
      liquidity: computed.analytics.liquidity,
      fragility: computed.analytics.fragility,
      behavior: computed.analytics.behavior,
      goalViability: computed.analytics.goalViability,
      emergencyMonths: computed.summary.emergencyMonths
    };

    res.json({
      portfolio,
      metrics,
      analytics: computed.analytics,
      insights: computed.insights,
      summary: computed.summary
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch live data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});