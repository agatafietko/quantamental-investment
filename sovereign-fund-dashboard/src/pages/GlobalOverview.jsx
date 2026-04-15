import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

// Squeeze Risk Gauge Component
const SqueezeGauge = ({ score }) => {
  const normalized = Math.min(100, Math.max(0, score || 0));
  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-outline-variant/20 h-4 mt-2 overflow-hidden flex">
        <div 
          className="bg-gold h-full transition-all duration-700 ease-in-out border-r-2 border-ink" 
          style={{ width: `${normalized}%` }} 
        />
      </div>
      <div className="flex justify-between w-full mt-2">
        <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ink/50">Low</span>
        <span className="font-serif text-3xl text-gold font-medium px-2">{score?.toFixed(1) || "--"}</span>
        <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ink/50">High</span>
      </div>
      <p className="font-sans text-[0.6rem] uppercase mt-1 tracking-widest text-ink/70">Squeeze Risk Gauge</p>
    </div>
  );
};

export default function GlobalOverview() {
  const navigate = useNavigate();

  // ----- Global Overview States -----
  const [data, setData] = useState({
    aum: "--",
    ytd: "--",
    performance: [],
    positions: []
  });

  // ----- Agent War Room States -----
  const [transcript, setTranscript] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [governorDecision, setGovernorDecision] = useState(null);

  // ----- Squeeze Risk States -----
  const [shortInterestData, setShortInterestData] = useState([]);
  const [activeScore, setActiveScore] = useState(0);

  // ----- 13F Modal State -----
  const [show13FModal, setShow13FModal] = useState(false);

  useEffect(() => {
    // 1. Fetch Portfolio
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(fetchedData => setData(fetchedData))
      .catch(err => console.error(err));

    // 2. Fetch Heatmap
    fetch('/api/heatmap')
      .then(res => res.json())
      .then(data => setHeatmap(data))
      .catch(err => console.error(err));

    // 3. Fetch Short Interest for Squeeze Risk
    fetch('/api/short-interest')
      .then(res => res.json())
      .then(data => {
        setShortInterestData(data);
        if (data.length > 0) setActiveScore(data[0]["Squeeze Score"]);
      })
      .catch(err => console.error(err));
  }, []);

  const initializeScan = async () => {
    setIsScanning(true);
    setTranscript([]);
    setGovernorDecision(null);
    
    try {
      const response = await fetch('/api/debate');
      const data = await response.json();
      const { transcript: sequence, decision } = data;
      
      sequence.forEach((entry, idx) => {
        setTimeout(() => {
          setTranscript(prev => [...prev, entry]);
          if (idx === sequence.length - 1) {
            setTimeout(() => {
              setIsScanning(false);
              setGovernorDecision(decision);
            }, 2000);
          }
        }, (idx + 1) * 1500);
      });
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const getHeatColor = (value, type) => {
    let opacity = 0;
    if (type === 'percent') opacity = value;
    else if (type === 'score') opacity = value / 100;
    else opacity = value;
    return `rgba(212, 175, 55, ${Math.max(0.05, Math.min(1, opacity))})`;
  };

  return (
    <div className="max-w-7xl w-full mx-auto pb-12 relative">
      
      {/* 13F Modal Overlay */}
      {show13FModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 transition-all">
          <Card className="bg-ivory border-[0.5pt] border-gold w-full max-w-4xl shadow-ambient">
            <CardHeader className="bg-ivory-low pb-4 border-b border-outline-variant/30 flex justify-between flex-row items-center">
               <CardTitle className="text-2xl font-serif text-ink tracking-tight">Agentic 13F Ledger (Projected Forward Holdings)</CardTitle>
               <Button variant="tertiary" onClick={() => setShow13FModal(false)}>Close &times;</Button>
            </CardHeader>
            <CardContent className="pt-6 h-96 overflow-y-auto">
               <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ink/50 mb-6">Secured Connection // Decrypted Portfolio Synthetics</p>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-serif text-gold text-lg border-b border-gold/30 pb-2 mb-4">Millennium (Risk-Controlled Pairs)</h4>
                   <ul className="space-y-4 font-mono text-sm text-ink/80">
                     <li>+ LONG: Energy / Utilities Factor</li>
                     <li>- SHORT: Tech / Duration Momentum</li>
                     <li className="text-gold font-bold">Target Beta Exposure: 0.05%</li>
                   </ul>
                 </div>
                 <div>
                   <h4 className="font-serif text-gold text-lg border-b border-gold/30 pb-2 mb-4">Bridgewater (Regime Macro)</h4>
                   <ul className="space-y-4 font-mono text-sm text-ink/80">
                      <li>+ LONG: Inflation-linked assets & Commodities</li>
                      <li>- SHORT: Global sovereign bonds</li>
                      <li className="text-gold font-bold">Thesis: Persistent Inflation Shock</li>
                   </ul>
                 </div>
               </div>
               
               <h4 className="font-serif text-gold text-lg border-b border-gold/30 pb-2 mt-8 mb-4">Renaissance (Quant Signals)</h4>
               <pre className="text-gold bg-ink p-4 rounded text-xs overflow-x-auto shadow-inner leading-relaxed">
{`{
  "statArb": [
     "Transient panic exploitation targeting illiquid small-caps",
     "High frequency mean-reversion sub-second trades"
  ],
  "latest_alpha": ` + JSON.stringify(data.positions, null, 2) + `
}`}
               </pre>
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* Main Grid: Row 1 - Heatmap & Squeeze Risk */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-9 shrink-0 flex flex-col min-h-0">
          <h3 className="font-serif text-xl border-b border-gold inline-block pb-2 mb-6">Alpha Heatmap</h3>
          <Card className="bg-ivory border-t-[0.5pt] border-gold rounded-none">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="font-sans font-normal text-[0.6rem] uppercase tracking-widest text-ink/50 py-4 px-6">Entity</th>
                    <th className="font-sans font-normal text-[0.6rem] uppercase tracking-widest text-ink/50 py-4 px-6 text-center">SI %</th>
                    <th className="font-sans font-normal text-[0.6rem] uppercase tracking-widest text-ink/50 py-4 px-6 text-center">News</th>
                    <th className="font-sans font-normal text-[0.6rem] uppercase tracking-widest text-ink/50 py-4 px-6 text-center">Retail</th>
                    <th className="font-sans font-normal text-[0.6rem] uppercase tracking-widest text-ink/50 py-4 px-6 text-center">Crowded</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmap.slice(0, 4).map((row) => (
                    <tr 
                      key={row.ticker} 
                      className="border-b border-outline-variant/10 cursor-pointer hover:bg-gold/10 transition-colors" 
                      onClick={() => navigate('/deep-dive?ticker=' + row.ticker)}
                      onMouseEnter={() => {
                        const target = shortInterestData.find(d => d.Ticker === row.ticker);
                        if (target) setActiveScore(target["Squeeze Score"]);
                      }}
                    >
                      <td className="py-3 px-6 font-serif text-lg font-bold">{row.ticker}</td>
                      <td className="p-1">
                        <div className="h-full w-full py-2 flex items-center justify-center font-serif" style={{ backgroundColor: getHeatColor(row.si * 4, 'percent') }}>
                          {(row.si * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="h-full w-full py-2 flex items-center justify-center font-serif text-ink" style={{ backgroundColor: getHeatColor(row.news, 'score') }}>
                          {row.news.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="h-full w-full py-2 flex items-center justify-center font-serif text-ink" style={{ backgroundColor: getHeatColor(row.retail, 'score') }}>
                          {row.retail.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className="h-full w-full py-2 flex items-center justify-center font-serif text-ink" style={{ backgroundColor: getHeatColor(row.crowded, 'score') }}>
                          {row.crowded}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3 flex flex-col justify-end">
           <SqueezeGauge score={activeScore} />
        </div>
      </div>

      {/* Row 2: War Room Stream & Governor Console */}
      <h3 className="font-serif text-xl border-b border-gold inline-block pb-2 mb-6">Agent War Room Connect</h3>
      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-8 flex flex-col min-h-0">
          <Card className="flex-1 bg-ivory shadow-ambient flex flex-col min-h-0 border-t-[0.5pt] border-gold">
            <CardHeader className="bg-ivory-low pb-4 border-b border-outline-variant/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Governor Console: Real-Time Inter-Pod Debate</CardTitle>
                {isScanning && <span className="font-sans text-xs uppercase tracking-widest text-gold animate-pulse">Running Scan...</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-6 px-8 flex flex-col space-y-6 h-[250px] bg-ivory">
              {transcript.map((msg, i) => (
                <div key={i} className="flex flex-col">
                  <span className={cn(
                    "font-sans text-[0.65rem] font-bold tracking-widest uppercase mb-1",
                    msg.agent === "GOVERNOR" ? "text-gold" : "text-ink/40"
                  )}>
                    [{msg.agent}]
                  </span>
                  <p className={cn(
                    "font-serif leading-relaxed",
                    msg.agent === "GOVERNOR" ? "text-xl text-ink font-bold" : "text-lg text-ink"
                  )}>
                    {msg.text}
                  </p>
                </div>
              ))}
              {!isScanning && transcript.length === 0 && (
                <p className="font-serif text-ink/40 italic">Awaiting manual initiation of network protocols.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4 flex flex-col space-y-8">
          <div className="shrink-0 border-[3px] border-ink p-6 bg-ink text-ivory flex-1 flex flex-col justify-between">
            <div>
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ivory/50 mb-4">Governor Agent Directive</p>
              {!governorDecision && !isScanning && (
                <p className="font-serif text-lg text-ivory/30 animate-pulse">Awaiting Synthesis...</p>
              )}
              {isScanning && (
                <p className="font-sans text-xs uppercase tracking-widest text-gold animate-pulse mt-2">&gt; Compiling vector matrices...</p>
              )}
              {governorDecision && (
                <div className="font-serif">
                  <span className="text-gold text-2xl block mb-2 border-b border-gold/30 pb-2">APPROVED</span>
                  <p className="text-lg leading-snug">{governorDecision}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4">
              <Button 
                variant="primaryGradient" 
                className="w-full text-base py-4 tracking-wide" 
                onClick={initializeScan} 
                disabled={isScanning || governorDecision !== null}
              >
                {isScanning ? "Processing..." : "Initialize Scan"}
              </Button>
              {governorDecision && (
                <Button 
                  variant="tertiary" 
                  className="w-full mt-2 text-[0.65rem] uppercase text-ivory/50 hover:text-gold" 
                  onClick={() => { setTranscript([]); setGovernorDecision(null); }}
                >
                  Reset Network
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant mb-12 opacity-30" />

      {/* Row 3: Performance & Institutional 13F */}
      <div className="grid grid-cols-12 gap-12">
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
        </div>

        <div className="col-span-4 pl-8 border-l border-outline-variant/30">
          <h3 className="font-serif text-xl border-b border-gold inline-block pb-2 mb-8">Institutional 13F Positions</h3>
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
            <Button 
               variant="tertiary" 
               className="w-full justify-start pl-0 border-b-outline-variant hover:border-b-gold"
               onClick={() => setShow13FModal(true)}
            >
              View Full 13F Ledger &rarr;
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
