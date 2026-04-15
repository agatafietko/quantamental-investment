'use client';

import React from 'react';

interface RiskMeterProps {
    score: number; // 0-100
}

export default function RiskMeter({ score }: RiskMeterProps) {
    // Premium Neon Colors
    let color = '#39ff14'; // Neon Green
    if (score > 40) color = '#facc15'; // Yellow
    if (score > 70) color = '#ff3a3a'; // Neon Red

    const radius = 90;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * (circumference / 2);

    return (
        <div className="glass flex flex-col items-center justify-center p-8 w-full max-w-lg mx-auto mb-12 relative overflow-visible">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50 rounded-2xl pointer-events-none"></div>

            <h2 className="text-sm font-bold text-white/60 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2 w-full text-center">
                Market Risk Analysis
            </h2>

            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 1.5}
                    width={radius * 2}
                    className="transform rotate-180 overflow-visible"
                >
                    <defs>
                        <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background Track */}
                    <circle
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeDasharray={`${circumference / 2} ${circumference}`}
                        strokeLinecap="round"
                    />

                    {/* Progress Arc with Glow */}
                    <circle
                        stroke={color}
                        strokeWidth={stroke}
                        strokeDasharray={`${circumference / 2} ${circumference}`}
                        style={{
                            strokeDashoffset,
                            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        filter="url(##glow-filter)"
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[10%] text-center">
                    <span className="text-6xl font-black tracking-tighter drop-shadow-2xl" style={{ color: '#fff', textShadow: `0 0 30px ${color}` }}>
                        {score}
                    </span>
                    <div className="text-[10px] font-bold text-white/40 tracking-widest mt-2 uppercase">Risk Index</div>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-black/20 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }}></div>
                <span className="text-xs font-medium text-white/80">
                    {score > 70 ? 'EXTREME GREED' : score > 40 ? 'NEUTRAL' : 'FEAR'}
                </span>
            </div>
        </div>
    );
}
