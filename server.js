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
      fallback =
        "As your Financial Digital Twin, I've analyzed your $1.5M house goal. Currently, your Net Worth suggests this would create 'Mortgage Stress'. I recommend delaying by 18 months.";
    } else if (q.includes("liquidity")) {
      fallback =
        "Liquidity Analysis: Your current cash-to-asset ratio is healthy. You have enough buffer to cover approximately 12 months of expenses.";
    } else if (q.includes("crash") || q.includes("drop")) {
      fallback =
        "Crash Scenario: If crypto drops 50%, your high cash allocation serves as a safety guardrail for your Wealth Wellness Score.";
    } else {
      fallback =
        "I recommend maintaining a 6-month liquidity buffer to preserve your high Wellness Score.";
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
        goal: "Retire by 50" // Added to match the UI screenshot
      },
      // New Category: Matches your "Other Assets" tab
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
        { symbol: "TSLA", qty: 10 } // Added for more diversification
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

    // New Net Worth including your 3D Printing business
    const netWorth = cashValue + securitiesValue + cryptoValue + privateAssetsValue;

    const allocation = {
      cash: cashValue,
      securities: securitiesValue,
      crypto: cryptoValue,
      private: privateAssetsValue // Add this to the allocation object for the chart
    };

    const liquidityRatio = netWorth > 0 ? cashValue / netWorth : 0;
    const cryptoPct = netWorth > 0 ? cryptoValue / netWorth : 0;

    let score = 100;
    if (cryptoPct > 0.3) score -= 15;
    if (liquidityRatio < 0.1) score -= 20;
    if (liquidityRatio < 0.05) score -= 10;
    if (score < 0) score = 0;

    const metrics = {
      netWorth,
      allocation,
      liquidityRatio,
      cryptoPct,
      wellnessScore: Math.round(score)
    };

    res.json({ portfolio, metrics });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch live data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});