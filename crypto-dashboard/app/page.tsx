'use client';

import React from 'react';
import RiskMeter from '../components/RiskMeter';
import AssetCard from '../components/AssetCard';
import { Activity, Wifi } from 'lucide-react';

export default function Home() {
    // Mock Data
    const riskScore = 72; // High risk

    const assets = [
        {
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 64150.85,
            change24h: 5.4,
            data: [61000, 61200, 61100, 61500, 62800, 63000, 62900, 63100, 63550, 64150],
        },
        {
            name: 'Ethereum',
            symbol: 'ETH',
            price: 3250.12,
            change24h: -1.2,
            data: [3300, 3290, 3280, 3270, 3260, 3265, 3250, 3240, 3245, 3250],
        },
        {
            name: 'Solana',
            symbol: 'SOL',
            price: 148.45,
            change24h: 12.8,
            data: [130, 132, 135, 133, 136, 140, 142, 145, 146, 148.45],
        },
    ];

    return (
        <main className="min-h-screen flex flex-col relative">
            {/* Sticky Glass Header */}
            <header className="sticky top-0 z-50 glass border-t-0 border-x-0 rounded-none border-b border-white/10 px-8 py-4 flex justify-between items-center backdrop-blur-xl bg-black/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Activity className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                            Crypto<span className="text-cyan-400">Pulse</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium">Quantimental Terminal</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Online
                    </div>
                </div>
            </header>

            <div className="flex-1 p-8 flex flex-col items-center w-full max-w-7xl mx-auto z-10">
                {/* Hero / Risk Section */}
                <section className="w-full mb-16 mt-8">
                    <div className="text-center mb-10">
                        <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter mb-4 drop-shadow-2xl">
                            MARKET OVERVIEW
                        </h2>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                            Live sentiment analysis and volatility tracking powered by advanced algorithms.
                        </p>
                    </div>
                    <RiskMeter score={riskScore} />
                </section>

                {/* Grid Layout */}
                <section className="w-full">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-cyan-500 rounded-full block"></span>
                            Top Assets
                        </h3>
                        <button className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider font-bold">
                            View All Markets →
                        </button>
                    </div>

                    <div className="dashboard-grid w-full">
                        {assets.map((asset) => (
                            <AssetCard
                                key={asset.symbol}
                                name={asset.name}
                                symbol={asset.symbol}
                                price={asset.price}
                                change24h={asset.change24h}
                                data={asset.data}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
