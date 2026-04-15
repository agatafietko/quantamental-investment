import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function AgentWarRoom() {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [governorDecision, setGovernorDecision] = useState(null);

  useEffect(() => {
    fetch('/api/heatmap')
      .then(res => res.json())
      .then(data => setHeatmap(data))
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
      
      // Simulate sequential transcript arrival
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
    // Normalizing logic for alpha heatmap to Gold (#D4AF37)
    let opacity = 0;
    if (type === 'percent') opacity = value;
    else if (type === 'score') opacity = value / 100;
    else opacity = value; // assume 0-1
    return `rgba(212, 175, 55, ${Math.max(0.05, Math.min(1, opacity))})`;
  };

  return (
    <div className="max-w-6xl w-full mx-auto pb-12 flex flex-col h-full">
      <div className="mb-12 shrink-0">
        <h2 className="font-serif text-[3.5rem] leading-none mb-4 tracking-tight">Agent War Room</h2>
        <p className="font-sans text-xs uppercase tracking-[0.1em] text-ink/60">Alpha Heatmap & Multi-Agent Intelligence</p>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* Left Column: Heatmap and Pod Debate */}
        <div className="col-span-8 flex flex-col space-y-8 min-h-0">
          
          {/* Alpha Heatmap */}
          <div className="shrink-0">
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
                    {heatmap.map((row) => (
                      <tr key={row.ticker} className="border-b border-outline-variant/10 cursor-pointer hover:bg-gold/10 transition-colors" onClick={() => navigate('/deep-dive?ticker=' + row.ticker)}>
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

          {/* Chat Transcript Area */}
          <Card className="flex-1 bg-ivory shadow-ambient flex flex-col min-h-0 border-t-[0.5pt] border-gold mt-8">
            <CardHeader className="bg-ivory-low pb-4 border-b border-outline-variant/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Intelligence Pods Stream</CardTitle>
                {isScanning && <span className="font-sans text-xs uppercase tracking-widest text-gold animate-pulse">Running Scan...</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-6 px-8 flex flex-col space-y-6 bg-ivory">
              {transcript.map((msg, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-sans text-[0.65rem] font-bold tracking-widest uppercase mb-1 text-ink/40">
                    [{msg.agent}]
                  </span>
                  <p className="font-serif text-lg leading-relaxed text-ink">
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

        {/* Right Column: Governor Output & Controls */}
        <div className="col-span-4 flex flex-col space-y-8">
          
          <div className="shrink-0 border-[3px] border-ink p-8 bg-ink text-ivory h-[400px] flex flex-col justify-between">
            <div>
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ivory/50 mb-6">Governor Agent Directive</p>
              
              {!governorDecision && !isScanning && (
                <p className="font-serif text-2xl text-ivory/30 animate-pulse">Awaiting Synthesis...</p>
              )}
              
              {isScanning && (
                <p className="font-sans text-xs uppercase tracking-widest text-gold animate-pulse mt-4">&gt; Compiling vector matrices...</p>
              )}
              
              {governorDecision && (
                <div className="font-serif">
                  <span className="text-gold text-4xl block mb-4 border-b border-gold/30 pb-4">APPROVED</span>
                  <p className="text-2xl leading-snug">{governorDecision}</p>
                </div>
              )}
            </div>
            <div className="flex w-full mt-12 justify-between items-end border-t border-ivory/20 pt-4">
               <span className="font-sans text-[0.55rem] uppercase tracking-widest text-ivory/40">Auth Level: Alpha</span>
               <span className="font-sans text-[0.55rem] uppercase tracking-widest text-gold">Ready</span>
            </div>
          </div>

          <div className="mt-auto bg-ivory-high p-6 border-t border-outline-variant">
            <Button 
               variant="primaryGradient" 
               className="w-full text-lg py-5 tracking-wide" 
               onClick={initializeScan} 
               disabled={isScanning || governorDecision !== null}
            >
              {isScanning ? "Processing..." : "Initialize Intelligence Scan"}
            </Button>
            
            {governorDecision && (
              <Button 
                variant="tertiary" 
                className="w-full mt-4 text-xs hover:border-b-gold" 
                onClick={() => { setTranscript([]); setGovernorDecision(null); }}
              >
                Reset Network
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
