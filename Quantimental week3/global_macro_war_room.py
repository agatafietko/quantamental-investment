import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
import time
from datetime import datetime, timedelta

# --- CONSOLE CONFIG ---
st.set_page_config(page_title="Global Macro War Room", layout="wide", initial_sidebar_state="collapsed")

# Custom CSS for "Decision Console" and Glassmorphism
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;400;600&display=swap');
    
    html, body, [data-testid="stAppViewContainer"] {
        background-color: #020617;
        background-image: 
            radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(79, 70, 229, 0.1) 0px, transparent 50%);
        color: #e2e8f0;
        font-family: 'Inter', sans-serif;
    }

    .stApp {
        background: transparent;
    }

    /* Decision Console Header */
    .console-header {
        font-family: 'Orbitron', sans-serif;
        background: linear-gradient(90deg, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 4px;
        margin-bottom: 30px;
        font-size: 2.5rem;
    }

    /* Glassmorphism Card */
    .glass-panel {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    /* Chat Transcript Styling */
    .transcript-container {
        height: 400px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.03);
        font-family: 'Inter', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    .agent-msg {
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 8px;
    }

    .analyst { border-left: 4px solid #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .quant { border-left: 4px solid #10b981; background: rgba(16, 185, 129, 0.05); }
    .risk { border-left: 4px solid #ef4444; background: rgba(239, 68, 68, 0.05); }

    .agent-label {
        font-weight: 700;
        font-size: 0.7rem;
        text-transform: uppercase;
        margin-bottom: 4px;
        display: block;
    }

    /* Execute Button Positioning & State */
    .stButton > button {
        width: 100%;
        border-radius: 12px;
        height: 60px;
        font-family: 'Orbitron', sans-serif;
        font-size: 1.2rem;
        letter-spacing: 2px;
        transition: all 0.3s ease;
    }

    /* Custom classes injected via markdown for button states */
    .btn-enabled {
        background: linear-gradient(90deg, #10b981, #059669) !important;
        color: white !important;
        border: none !important;
        box-shadow: 0 0 20px rgba(16, 135, 129, 0.4);
    }

    .btn-disabled {
        background: #1e293b !important;
        color: #64748b !important;
        border: 1px solid #334155 !important;
        cursor: not-allowed !important;
        box-shadow: none !important;
    }

    /* Hide standard UI */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# --- RESEARCH DATA (From Phase 1) ---
FOMC_DATA = [
    {"date": "2026-01-28", "headline": "Rates held at 3.50%-3.75%. Two dissents pushing for cuts.", "tilt": "Hawkish"},
    {"date": "2025-12-10", "headline": "Fed notes inflation resurging, holds rates steady.", "tilt": "Hawkish"},
    {"date": "2025-10-29", "headline": "Restrictive stance maintained due to elevated price pressures.", "tilt": "Hawkish"}
]

GEO_RISKS = [
    "US Political Revolution: Extreme policy unpredictability.",
    "Cold Energy War: US Petro-states vs China Electro-states.",
    "Russia-NATO Hybrid Conflict: Escalating cyber/sabotage risks.",
    "European Political Fracture: Collapse of centering responses.",
    "AI-Driven Volatility: Algorithmic flash crash risks."
]

# --- AGENTS ---

class AnalystAgent:
    def process(self):
        tilt = "Hawkish"
        summary = "Fed remains restrictive. Inflation persists despite slowing job gains. No easing in sight."
        sentiment_val = 0.3  # Out of 1.0 (Low confidence for Longs)
        return "Analyst", summary, sentiment_val

class QuantAgent:
    def process(self):
        try:
            spy = yf.Ticker("SPY")
            df = spy.history(period="1y")
            
            if df.empty or len(df) < 200:
                summary = "SPY Data Unavailable. Market status indeterminate."
                sentiment_val = 0.5
            else:
                ma200 = df['Close'].rolling(window=200).mean().iloc[-1]
                current_price = df['Close'].iloc[-1]
                
                if current_price > ma200:
                    summary = f"SPY is Bullish. Price (${current_price:.2f}) is ABOVE 200-day MA (${ma200:.2f})."
                    sentiment_val = 0.8
                else:
                    summary = f"SPY is Bearish. Price (${current_price:.2f}) is BELOW 200-day MA (${ma200:.2f})."
                    sentiment_val = 0.2
            return "Quant", summary, sentiment_val
        except Exception as e:
            return "Quant", f"Offline. Using fallback technicals.", 0.5

class RiskGuardian:
    def process(self):
        summary = f"High Alert. Found {len(GEO_RISKS)} Black Swan threats, including {GEO_RISKS[0][:40]}..."
        sentiment_val = 0.1 # Very low confidence due to risks
        return "Guardian", summary, sentiment_val

# --- MAIN ENGINE ---

def main():
    st.markdown('<h1 class="console-header">Global Macro War Room</h1>', unsafe_allow_html=True)
    
    # 1. Orchestrate Agents
    analyst = AnalystAgent()
    quant = QuantAgent()
    risk = RiskGuardian()
    
    with st.spinner("Synchronizing Agents..."):
        a_name, a_sum, a_val = analyst.process()
        q_name, q_sum, q_val = quant.process()
        r_name, r_sum, r_val = risk.process()
        time.sleep(1) # Simulated deliberation

    # 2. Logic: Confidence & Agreement
    # Weighted Confidence: Quant 40%, Analyst 30%, Risk 30%
    confidence = (q_val * 40 + a_val * 30 + r_val * 30)
    
    # Consensus Rule: Disagreement if any agent sentiment < 0.4
    consensus_reached = (a_val >= 0.4 and q_val >= 0.4 and r_val >= 0.4)
    
    # --- LAYOUT ---
    
    col_left, col_right = st.columns([1, 1])
    
    with col_left:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        st.subheader("Decision Console")
        
        # 3D Confidence Gauge
        fig = go.Figure(go.Indicator(
            mode = "gauge+number+delta",
            value = confidence,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Confidence Index", 'font': {'size': 24, 'family': 'Orbitron'}},
            delta = {'reference': 50, 'increasing': {'color': "#10b981"}},
            gauge = {
                'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "#475569"},
                'bar': {'color': "#3b82f6"},
                'bgcolor': "rgba(0,0,0,0)",
                'borderwidth': 2,
                'bordercolor': "#1e293b",
                'steps': [
                    {'range': [0, 40], 'color': 'rgba(239, 68, 68, 0.2)'},
                    {'range': [40, 70], 'color': 'rgba(245, 158, 11, 0.2)'},
                    {'range': [70, 100], 'color': 'rgba(16, 185, 129, 0.2)'}
                ],
                'threshold': {
                    'line': {'color': "white", 'width': 4},
                    'thickness': 0.75,
                    'value': confidence
                }
            }
        ))
        
        fig.update_layout(
            paper_bgcolor = "rgba(0,0,0,0)",
            plot_bgcolor = "rgba(0,0,0,0)",
            font = {'color': "#f8fafc", 'family': "Inter"},
            height=350,
            margin=dict(l=20, r=20, t=50, b=20)
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Action Button
        btn_class = "btn-enabled" if consensus_reached else "btn-disabled"
        btn_label = "EXECUTE POSITION" if consensus_reached else "EXECUTION LOCKED (DISAGREEMENT)"
        
        st.button(btn_label, disabled=not consensus_reached, key="exec_btn")
        
        # Inject CSS for the specific button based on state
        st.markdown(f"""
            <style>
                div[data-testid="stButton"] button {{
                    {'background: linear-gradient(90deg, #10b981, #059669) !important; color: white !important;' if consensus_reached else 'background: #1e293b !important; color: #64748b !important; opacity: 0.6; pointer-events: none;'}
                }}
            </style>
        """, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)

    with col_right:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        st.subheader("Agent Debate Transcript")
        
        transcript_html = f"""
        <div class="transcript-container">
            <div class="agent-msg analyst">
                <span class="agent-label" style="color:#3b82f6">Analyst Agent</span>
                I've reviewed the 3 most recent FOMC headlines. The tilt is definitively <b>{FOMC_DATA[0]['tilt']}</b>. 
                January 2026 meeting held rates at 3.5% despite unemployment concerns. I advise extreme caution.
            </div>
            <div class="agent-msg quant">
                <span class="agent-label" style="color:#10b981">Quant Agent</span>
                Technical analysis complete. {q_sum}. Market momentum shows a specific bias, but my confidence is dependent on the Analyst's macro view.
            </div>
            <div class="agent-msg risk">
                <span class="agent-label" style="color:#ef4444">Risk Guardian</span>
                I cannot approve this trade. I perceive <b>{len(GEO_RISKS)} high-impact threats</b>. 
                Specifically, the {GEO_RISKS[1]} and possible US {GEO_RISKS[0].split(':')[0]} create too much structural risk.
            </div>
            <div class="agent-msg analyst">
                <span class="agent-label" style="color:#3b82f6">Analyst Agent</span>
                Agreed with the Guardian. If the Fed won't cut under this geopolitical stress, we are entering a value trap.
            </div>
            <div class="agent-msg quant">
                <span class="agent-label" style="color:#10b981">Quant Agent</span>
                Understood. If consensus is failing, I am lowering my confidence score to {confidence:.1f}%.
            </div>
        </div>
        """
        st.markdown(transcript_html, unsafe_allow_html=True)
        
        # Detailed Risk Feed
        st.write("---")
        st.caption("Active Geopolitical Monitoring")
        for risk_item in GEO_RISKS:
            st.markdown(f"🚩 <small>{risk_item}</small>", unsafe_allow_html=True)
            
        st.markdown('</div>', unsafe_allow_html=True)

    # Sidebar Research Reference
    with st.sidebar:
        st.markdown('<h2 class="gradient-text">Research Base</h2>', unsafe_allow_html=True)
        st.subheader("Recent FOMC")
        for f in FOMC_DATA:
            st.markdown(f"**{f['date']}**")
            st.markdown(f"*{f['headline']}*")
            st.divider()

if __name__ == "__main__":
    main()
