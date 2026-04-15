import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';


export default function GlobalOverview() {
  const [data, setData] = useState({
    aum: "--",
    ytd: "--",
    performance: [],
    positions: []
  });

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(fetchedData => setData(fetchedData))
      .catch(err => console.error("Failed to load portfolio:", err));
  }, []);

  return (
    <div className="max-w-6xl w-full mx-auto pb-12">
      {/* Top Header Section */}
      <div className="flex justify-between items-end mb-16">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-ink/60 mb-2">Total Assets Under Management</p>
          <h2 className="font-serif text-[4rem] leading-none">{data.aum}</h2>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/60 mb-2">YTD Return</p>
          <h3 className="font-serif text-3xl text-gold">{data.ytd}</h3>
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant mb-12 opacity-30" />

      {/* Main Asymmetric Grid */}
      <div className="grid grid-cols-12 gap-12">
        {/* Left Column (Wider for chart and narrative) */}
        <div className="col-span-8 flex flex-col space-y-12">
          <Card className="bg-ivory" goldTop>
            <CardHeader className="px-0 pt-0">
              <div className="flex justify-between items-end mb-4">
                <CardTitle className="text-3xl">Aggregate Performance</CardTitle>
                <span className="font-sans text-xs uppercase tracking-widest text-ink/50">Fiscal 2026</span>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 h-[300px]">
              {data.performance.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c4c6cf" strokeOpacity={0.2} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontFamily: 'Work Sans', fontSize: 10, fill: '#001F3F', opacity: 0.6 }} dy={10} />
                    <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '0px', backgroundColor: '#FAF9F5', border: '1px solid #D4AF37', color: '#000613' }}
                      itemStyle={{ fontFamily: 'Newsreader' }}
                      labelStyle={{ fontFamily: 'Work Sans', textTransform: 'uppercase', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="#001F3F" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <div className="prose">
             <h3 className="font-serif text-2xl border-b border-gold inline-block pb-2">Director's Commentary</h3>
             <p className="font-serif text-base leading-relaxed mt-4">
               The current macroeconomic regime remains highly sensitive to unexpected shifts in the Federal Reserve's dot plot. Our algorithmic scanning indicates a prolonged period of suppressed volatility may precede a structural dislocation. Positioning remains heavily anchored in high-conviction momentum assets, while maintaining a robust cash-equivalent drag to deploy opportunistically.
             </p>
          </div>
        </div>

        {/* Right Column (Narrower for dense data) */}
        <div className="col-span-4 pl-8 border-l border-outline-variant/30">
          <h3 className="font-serif text-xl border-b border-gold inline-block pb-2 mb-8">Top Allocations</h3>
          
          <div className="flex flex-col space-y-6">
            {data.positions.map((pos) => (
              <div key={pos.ticker} className="flex flex-col group">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-sans text-sm font-bold tracking-widest">{pos.ticker}</span>
                  <span className="font-serif text-lg">{pos.alloc}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-ink/70 text-sm">{pos.name}</span>
                  <span className={cn("font-serif text-sm", pos.return.startsWith('+') ? 'text-gold' : 'text-ink-light')}>
                    {pos.return}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button variant="tertiary" className="w-full justify-start pl-0 border-b-outline-variant hover:border-b-gold">
              View Full Ledger &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
