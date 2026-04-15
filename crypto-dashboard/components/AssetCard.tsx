'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AssetCardProps {
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    data: number[]; // Array of prices for sparkline
}

export default function AssetCard({ name, symbol, price, change24h, data }: AssetCardProps) {
    const isPositive = change24h >= 0;
    // Premium neon colors
    const color = isPositive ? '#39ff14' : '#ff3a3a';
    const gradientId = `gradient-${symbol}`;

    const chartData = data.map((val, i) => ({ i, value: val }));

    return (
        <div className="glass p-6 relative overflow-hidden group">
            {/* Background Glow Effect on Hover */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl`}
                style={{ backgroundColor: color }}></div>

            <div className="flex justify-between items-start mb-6 z-10 relative">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/80">
                            {symbol[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white tracking-wide">{name}</h3>
                            <span className="text-xs text-white/50 font-medium tracking-wider">{symbol}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white tracking-tight text-glow">
                        ${price.toLocaleString()}
                    </div>
                    <div className={`flex items-center justify-end gap-1 text-sm font-semibold mt-1 ${isPositive ? 'text-[#39ff14]' : 'text-[#ff3a3a]'}`}>
                        {isPositive ? <ArrowUp size={16} strokeWidth={3} /> : <ArrowDown size={16} strokeWidth={3} />}
                        {Math.abs(change24h)}%
                    </div>
                </div>
            </div>

            <div className="h-24 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ background: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            isAnimationActive={true}
                        />
                        <YAxis domain={['auto', 'auto']} hide />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
