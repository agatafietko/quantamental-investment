'use client';

import React from 'react';

interface FundamentalCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export default function FundamentalCard({ label, value, subtext, trend }: FundamentalCardProps) {
    return (
        <div className="holographic-card p-6 rounded-none border-l-4 border-l-transparent hover:border-l-[var(--cyber-blue)] group">
            <h3 className="text-secondary text-xs uppercase tracking-widest font-bold mb-2 opacity-60">
                {label}
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['Space_Grotesk'] text-white group-hover:text-[var(--cyber-blue)] transition-colors">
                    {value}
                </span>
                {trend && (
                    <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>
                        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
                    </span>
                )}
            </div>
            {subtext && (
                <p className="text-[10px] text-white/40 mt-2 font-mono ml-0.5">
                    {subtext}
                </p>
            )}

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
        </div>
    );
}
