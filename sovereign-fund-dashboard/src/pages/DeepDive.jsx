import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

// Squeeze Risk Gauge Component enforcing Zero-Radius styling
const SqueezeGauge = ({ score }) => {
  // Normalize score between 0 and 100
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

export default function DeepDive() {
  const [searchParams] = useSearchParams();
  const urlTicker = searchParams.get('ticker');
  
  const [shortInterestData, setShortInterestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTicker, setActiveTicker] = useState(urlTicker || "AFRM");
  const [news, setNews] = useState([]);
  const [activeScore, setActiveScore] = useState(0);

  useEffect(() => {
    if (urlTicker) setActiveTicker(urlTicker.toUpperCase());
  }, [urlTicker]);

  // Fetch initial Short Interest CSV Data
  useEffect(() => {
    fetch('/api/short-interest')
      .then(res => res.json())
      .then(data => {
        setShortInterestData(data);
        if (data.length > 0 && !urlTicker) {
          setActiveScore(data[0]["Squeeze Score"]);
          setActiveTicker(data[0]["Ticker"]);
        }
      })
      .catch(err => console.error(err));
  }, [urlTicker]);

  // Fetch simulated NewsAPI endpoints
  useEffect(() => {
    if(!activeTicker) return;
    fetch(`/api/news/${activeTicker}`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error(err));
      
    // Update gauge based on active ticker
    const tickerData = shortInterestData.find(d => d.Ticker === activeTicker);
    if(tickerData) setActiveScore(tickerData["Squeeze Score"]);
  }, [activeTicker, shortInterestData]);

  const handleScan = () => {
    if (searchTerm) {
      setActiveTicker(searchTerm.toUpperCase());
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto pb-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-[3.5rem] leading-none mb-4 tracking-tight">Market Intelligence</h2>
          <p className="font-sans text-xs uppercase tracking-[0.1em] text-ink/60">Short Squeeze Identification & Sentiment Tracking</p>
        </div>
        <div className="w-64">
           {/* Connecting to the real-time Squeeze Score from Task 3 */}
           <SqueezeGauge score={activeScore} />
        </div>
      </div>

      <div className="flex flex-col space-y-16">
        
        {/* Search / Filter Command */}
        <div className="flex items-end space-x-6">
          <div className="flex-1">
            <p className="font-sans text-[0.65rem] uppercase mb-1 tracking-widest text-ink/50">TICKER / SECTOR OVERRIDE</p>
            <Input 
              placeholder="Enter Symbol (e.g. AFRM, TSLA, SQ)" 
              className="text-xl" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
          </div>
          <Button variant="primaryGradient" className="px-10" onClick={handleScan}>Scan Database</Button>
        </div>

        {/* Dense Data Section */}
        <div>
          <h3 className="font-serif text-2xl border-b border-gold inline-block pb-2 mb-8">Elevated Short Float Targets</h3>
          
          <Card className="bg-ivory border-t-[0.5pt] border-gold rounded-none">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="font-sans font-normal text-[0.7rem] uppercase tracking-widest text-ink/50 pb-3 top-0 pt-6 px-6">Entity (Ticker)</th>
                    <th className="font-sans font-normal text-[0.7rem] uppercase tracking-widest text-ink/50 pb-3 pt-6 px-6">Date Extracted</th>
                    <th className="font-sans font-normal text-[0.7rem] uppercase tracking-widest text-ink/50 pb-3 pt-6 px-6">Short % Float</th>
                    <th className="font-sans font-normal text-[0.7rem] uppercase tracking-widest text-ink/50 pb-3 pt-6 px-6 text-right">Squeeze Score</th>
                  </tr>
                </thead>
                <tbody>
                  {shortInterestData.map((row, index) => (
                    <tr 
                      key={row.Ticker} 
                      className={cn(
                        "transition-colors cursor-pointer",
                        index % 2 === 0 ? "bg-ivory" : "bg-ivory-low",
                        activeTicker === row.Ticker ? "border-l-4 border-l-gold" : "border-l-4 border-l-transparent"
                      )}
                      onClick={() => setActiveTicker(row.Ticker)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-serif text-lg font-bold">{row.Ticker}</div>
                      </td>
                      <td className="py-4 px-6 font-serif text-lg">{row.Date}</td>
                      <td className="py-4 px-6 font-serif text-lg text-ink/70">{(row["Short Interest %"] * 100).toFixed(2)}%</td>
                      <td className="py-4 px-6 font-serif text-xl text-right font-medium text-gold">{row["Squeeze Score"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Narrative / News Section */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.1em] border-b border-gold inline-block pb-2 mb-6">Recent Dispatches: {activeTicker}</h3>
            <ul className="space-y-6">
              {news.map((item, idx) => (
                <li key={idx} className="flex flex-col group cursor-pointer border-l-2 border-transparent hover:border-gold pl-3 transition-all">
                  <span className="font-sans text-[0.65rem] text-gold uppercase tracking-widest mb-1">{item.time} | {item.sentiment}</span>
                  <span className="font-serif text-lg leading-snug group-hover:text-ink-light transition-colors">{item.headline}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.1em] border-b border-gold inline-block pb-2 mb-6">Analysis</h3>
            <p className="font-serif text-[0.95rem] leading-relaxed text-ink/90">
              Correlating current short float data with retail sentiment scores derived from the news pipeline suggests an imminent unwinding in the identified sector. 
              The pressure vector points uniquely to high-beta assets driven by crowding effects (Current Score: <span className="text-gold font-bold">{activeScore}</span>).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
