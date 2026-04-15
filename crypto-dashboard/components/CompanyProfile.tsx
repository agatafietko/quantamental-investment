'use client';

import React from 'react';

interface CompanyProfileProps {
    name: string;
    ticker: string;
    description: string;
    sector: string;
    logoUrl?: string; // Optional for now
}

export default function CompanyProfile({ name, ticker, description, sector }: CompanyProfileProps) {
    return (
        <div className="holographic-card p-8 mb-8 relative border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-5xl font-bold text-white tracking-tight">{name}</h1>
                        <span className="px-3 py-1 bg-[var(--cyber-blue)] text-black font-bold text-xs uppercase tracking-wider rounded-sm">
                            {ticker}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50 font-mono">
                        <span>SECTOR: <span className="text-white">{sector}</span></span>
                        <span>|</span>
                        <span>EXCHANGE: <span className="text-white">NASDAQ</span></span>
                    </div>
                </div>

                <div className="max-w-xl text-right">
                    <p className="text-white/70 leading-relaxed text-sm border-l border-[var(--cyber-amber)] pl-4">
                        {description}
                    </p>
                </div>
            </div>

            {/* Scanning Line Animation */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--cyber-blue)] to-transparent opacity-50"></div>
        </div>
    );
}
