'use client';

import React from 'react';
import CompanyProfile from '../../components/CompanyProfile';
import FundamentalCard from '../../components/FundamentalCard';
import { Layers } from 'lucide-react';

export default function FundamentalsPage() {
    // Mock Data for Apple Inc.
    const company = {
        name: 'Apple Inc.',
        ticker: 'AAPL',
        sector: 'Technology / Consumer Electronics',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and Wearables, Home, and Accessories.'
    };

    const metrics = [
        { label: 'P/E Ratio', value: '28.5x', trend: 'neutral', subtext: 'Industry Avg: 24.2x' },
        { label: 'Market Cap', value: '$2.8T', trend: 'up', subtext: 'Global Rank: #1' },
        { label: 'EPS (TTM)', value: '$6.42', trend: 'up', subtext: '+12% YoY' },
        { label: 'Dividend Yield', value: '0.55%', trend: 'neutral', subtext: 'Payout Ratio: 15%' },
        { label: 'Profit Margin', value: '25.3%', trend: 'up', subtext: 'Top Tier' },
        { label: 'Revenue (TTM)', value: '$385B', trend: 'down', subtext: '-1.5% YoY' },
        { label: 'Beta (5Y)', value: '1.28', trend: 'neutral', subtext: 'Moderate Volatility' },
        { label: 'Free Cash Flow', value: '$102B', trend: 'up', subtext: 'Strong Liquidity' },
    ];

    return (
        <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col">
            {/* Header Navigation */}
            <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-[var(--cyber-blue)]">
                    <Layers size={20} />
                    <span className="font-mono text-xs tracking-widest uppercase">Fundamental Analysis Module v2.0</span>
                </div>
                <a href="/" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                    ← Returnt to Market
                </a>
            </header>

            {/* Main Content */}
            <CompanyProfile {...company} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((m, i) => (
                    // @ts-ignore
                    <FundamentalCard key={i} {...m} />
                ))}
            </div>

            {/* Editorial Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 holographic-card p-8">
                    <h2 className="text-2xl text-white mb-6 border-b border-white/10 pb-2">Analyst Summary</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-white/80 leading-relaxed mb-4">
                            Apple continues to demonstrate robust ecosystem stickiness, driving services revenue to new highs. Despite a slight contraction in hardware sales year-over-year, the high-margin Services segment has cushioned the bottom line.
                        </p>
                        <p className="text-white/80 leading-relaxed">
                            <strong className="text-[var(--cyber-amber)]">Bull Case:</strong> Accelerated Vision Pro adoption and AI integration in iOS 18 could trigger a new supercycle.
                        </p>
                    </div>
                </div>

                <div className="holographic-card p-8 flex flex-col justify-center items-center text-center">
                    <h3 className="text-white/50 uppercase tracking-widest text-xs font-bold mb-2">Consensus Rating</h3>
                    <div className="text-5xl font-black text-[var(--cyber-blue)] mb-2">BUY</div>
                    <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map(s => (
                            <div key={s} className={`w-8 h-1 ${s <= 4 ? 'bg-[var(--cyber-blue)]' : 'bg-white/10'}`}></div>
                        ))}
                    </div>
                    <p className="text-xs text-white/30 mt-4 font-mono">Based on 32 Analyst Ratings</p>
                </div>
            </div>
        </main>
    );
}
