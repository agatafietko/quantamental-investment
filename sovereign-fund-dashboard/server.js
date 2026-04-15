import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());

// Internal helper for reading JSONs
const readJsonConfig = (filename) => {
    const filePath = path.join(__dirname, '../', filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
};

// 1. Short Interest Backend Endpoint (Real peak_dates.json)
app.get('/api/short-interest', (req, res) => {
    try {
        const data = readJsonConfig('peak_dates.json');
        const latestByTicker = data.reduce((acc, current) => {
            if (!acc[current.Ticker]) acc[current.Ticker] = current;
            return acc;
        }, {});
        res.json(Object.values(latestByTicker));
    } catch (error) {
        res.status(500).json({ error: 'Failed to access Short Interest data ledger.' });
    }
});

// 2. Portfolio Weights Simulation (Real read from portfolio_weights.json)
app.get('/api/portfolio', (req, res) => {
    try {
        const portfolio = readJsonConfig('portfolio_weights.json');
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'Failed to access Portfolio data.' });
    }
});

// 3. NewsAPI Simulated Oracle (Real read from news_api_data.json)
app.get('/api/news/:ticker', (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        const dispatches = readJsonConfig('news_api_data.json');
        const defaultNews = [
            { time: "Live", headline: `Automated scan complete: No major institutional events detected for ${ticker}.`, sentiment: "Neutral" }
        ];
        res.json(dispatches[ticker] || defaultNews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to access News API stream.' });
    }
});

// 4. Alpha Heatmap Endpoint (Real sentiment_heatmap.json)
app.get('/api/heatmap', (req, res) => {
    try {
        const data = readJsonConfig('sentiment_heatmap.json');
        const formattedList = Object.keys(data).map(ticker => {
            const latest = data[ticker][0];
            return {
                ticker: ticker,
                date: latest.Date,
                si: latest.ShortInterestPct,
                news: latest.NewsSentiment,
                retail: latest.RetailSentiment,
                crowded: latest.CrowdedScore
            };
        });
        res.json(formattedList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to access Heatmap Oracle.' });
    }
});

// 5. Dynamic Agent Debate Logic Route
app.get('/api/debate', (req, res) => {
    try {
        // Fetch heatmap data to synthesize live dynamic reasoning based on REAL values
        const data = readJsonConfig('sentiment_heatmap.json');
        
        // Find highest crowded and highest SI targets
        const entities = Object.keys(data);
        const latestValues = entities.map(t => ({ ticker: t, ...data[t][0] }));
        
        const mostShorted = latestValues.sort((a,b) => b.ShortInterestPct - a.ShortInterestPct)[0];
        const mostRetail = latestValues.sort((a,b) => b.RetailSentiment - a.RetailSentiment)[0];
        
        const debateSequence = [
            { agent: "SENTIMENT POD (VADER)", text: `Newsflow detects structural weaknesses. Retail chatter heavily skewing on ${mostRetail.ticker} given recent ${(mostRetail.NewsSentiment < 0.3) ? 'bearish constraints' : 'bullish divergence'}.` },
            { agent: "SHORT-INTEREST ORACLE", text: `Alert: ${mostShorted.ticker} short float stands at ${(mostShorted.ShortInterestPct * 100).toFixed(1)}%. Risk of rapid unwinding identified due to elevated squeeze probability.` },
            { agent: "MIRROR POD (13F LOGIC)", text: `Correlating institutional flow metrics. We are seeing mathematical crowding scores exceeding ${mostShorted.CrowdedScore} on target ${mostShorted.ticker}. Structural vulnerability highly aligned.` },
        ];
        
        res.json({
            transcript: debateSequence,
            decision: `TRADE CONFIRMED: INITIATE SYMMETRICAL ALLOCATION ON ${mostShorted.ticker}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to synthesize agent logic.' });
    }
});

app.listen(PORT, () => {
    console.log(`Command Center Oracle running on port ${PORT}`);
});
