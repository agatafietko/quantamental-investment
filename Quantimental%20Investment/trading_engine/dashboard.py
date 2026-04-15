import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime, timedelta
from trading_engine.data_handler import DataHandler
from trading_engine.backtester import Backtester
from trading_engine.strategies import BollingerBandBreakout, MeanReversion, RSIMomentum

# Page Configuration
st.set_page_config(page_title="Quant Trading Engine", layout="wide")

# Custom CSS for Professional Emerald Theme
st.markdown("""
<style>
    /* Global Overrides */
    :root {
        --deep-slate: #061616;
        --emerald-neon: #10b981;
        --emerald-soft: #34d399;
        --forest-dark: #064e3b;
        --glass-bg: rgba(16, 185, 129, 0.03);
        --glass-border: rgba(16, 185, 129, 0.15);
    }
    
    .stApp {
        background-color: var(--deep-slate);
        color: #ecfdf5;
    }
    
    /* Target ALL headers regardless of nesting */
    h1, h2, h3, h4, h5, h6, [data-testid="stHeader"] h1 {
        color: var(--emerald-neon) !important;
        font-weight: 800 !important;
        text-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
    }
    
    .stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {
        color: var(--emerald-neon) !important;
    }

    /* Sidebar Personlization */
    [data-testid="stSidebar"] {
        background-color: #041010;
        border-right: 1px solid var(--glass-border);
    }
    
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {
        color: var(--emerald-soft) !important;
    }

    /* Glass Cards */
    .glass-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .glass-card:hover {
        transform: translateY(-8px);
        border-color: var(--emerald-neon);
        box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);
        background: rgba(16, 185, 129, 0.1);
    }
    
    .metric-label {
        color: #a7f3d0 !important;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
    }
    
    .metric-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: white !important;
        text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
    }
    
    /* Form Elements */
    .stSelectbox label, .stDateInput label {
        color: var(--emerald-neon) !important;
        font-weight: 600 !important;
    }

    /* Hide Streamlit elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

    /* Scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: var(--deep-slate);
    }
    ::-webkit-scrollbar-thumb {
        background: var(--forest-dark);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--emerald-neon);
    }
</style>
""", unsafe_allow_html=True)

# Sidebar
st.sidebar.markdown("""
    <h1 style='color: #34d399; font-size: 1.5rem; font-weight: 800; margin-bottom: -20px;'>
        🛡️ Quant Trading Engine
    </h1>
""", unsafe_allow_html=True)
st.sidebar.markdown("---")
st.sidebar.subheader("🕹️ Strategy Control")
ticker = st.sidebar.selectbox("Select Ticker", ["AAPL", "TSLA", "BTC-USD"])
start_date = st.sidebar.date_input("Start Date", datetime.now() - timedelta(days=365))
end_date = st.sidebar.date_input("End Date", datetime.now())
strategy_name = st.sidebar.selectbox("Select Strategy", ["Bollinger Band Breakout", "Mean Reversion", "RSI Momentum"])

# Strategy selection map
STRATEGIES = {
    "Bollinger Band Breakout": BollingerBandBreakout,
    "Mean Reversion": MeanReversion,
    "RSI Momentum": RSIMomentum
}

# 1. Fetch Data
try:
    data = DataHandler.get_yfinance_data(ticker, start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
except Exception as e:
    st.error(f"Error fetching data: {e}")
    st.stop()

# 2. Run Strategy
strategy_class = STRATEGIES[strategy_name]
strategy = strategy_class()
data_with_signals = strategy.generate_signals(data)

# 3. Backtest
backtester = Backtester(initial_capital=10000.0)
results = backtester.run(data_with_signals)
metrics = backtester.get_metrics(results)

# 4. Hero Row Stats
st.markdown(f"""
    <h1 style='color: #10b981; font-weight: 800; text-shadow: 0 0 15px rgba(16, 185, 129, 0.3); margin-bottom: 0px;'>
        🛡️ Quant Trading Engine | {ticker}
    </h1>
    <p style='color: #34d399; font-weight: 600; font-size: 1.1rem; margin-top: -10px; margin-bottom: 20px;'>
        Strategy: {strategy_name}
    </p>
""", unsafe_allow_html=True)

hero_col1, hero_col2, hero_col3, hero_col4 = st.columns(4)

net_profit = metrics['Final Portfolio Value'] - 10000.0
net_profit_pct = (net_profit / 10000.0) * 100
profit_color = "#34d399" if net_profit >= 0 else "#f87171"

def glass_card(label, value, delta=None, color="white"):
    delta_html = f'<div class="metric-delta" style="color: {color}">{delta}</div>' if delta else ""
    return f"""
    <div class="glass-card">
        <div class="metric-label">{label}</div>
        <div class="metric-value">{value}</div>
        {delta_html}
    </div>
    """

hero_col1.markdown(glass_card("Portfolio Value", f"${metrics['Final Portfolio Value']:,.2f}"), unsafe_allow_html=True)
hero_col2.markdown(glass_card("Net Profit", f"${net_profit:,.2f}", f"{net_profit_pct:+.2f}%", profit_color), unsafe_allow_html=True)
hero_col3.markdown(glass_card("Max Drawdown", f"{metrics['Max Drawdown (%)']:.2f}%", color="#f87171"), unsafe_allow_html=True)
hero_col4.markdown(glass_card("Sharpe Ratio", f"{metrics['Sharpe Ratio']:.2f}", color="#10b981"), unsafe_allow_html=True)

# 5. Visualization (Plotly)
st.write("") # Spacer

fig = go.Figure()

# Candlestick chart with custom tooltips
fig.add_trace(go.Candlestick(
    x=results.index,
    open=results['Open'],
    high=results['High'],
    low=results['Low'],
    close=results['Close'],
    name="Price",
    increasing_line_color='#10b981', decreasing_line_color='#f87171',
    hoverlabel=dict(bgcolor="rgba(6, 78, 59, 0.9)"),
    hovertemplate="<b>Date: %{x}</b><br>Open: %{open}<br>High: %{high}<br>Low: %{low}<br>Close: %{close}<extra></extra>"
))

# Buy Signals
buy_signals = results[results['Signal'] == 1]
fig.add_trace(go.Scatter(
    x=buy_signals.index,
    y=buy_signals['Close'],
    mode='markers',
    marker=dict(symbol='triangle-up', size=16, color='#10b981', line=dict(width=2, color='#ecfdf5')),
    name='Buy Signal',
    hovertemplate="<b>BUY SIGNAL</b><br>Price: %{y:.2f}<br>Date: %{x}<extra></extra>"
))

# Sell Signals
sell_signals = results[results['Signal'] == -1]
fig.add_trace(go.Scatter(
    x=sell_signals.index,
    y=sell_signals['Close'],
    mode='markers',
    marker=dict(symbol='triangle-down', size=16, color='#f87171', line=dict(width=2, color='#ecfdf5')),
    name='Sell Signal',
    hovertemplate="<b>SELL SIGNAL</b><br>Price: %{y:.2f}<br>Date: %{x}<extra></extra>"
))

# Add indicators
if 'SMA' in results.columns:
    fig.add_trace(go.Scatter(x=results.index, y=results['SMA'], line=dict(color='#fcd34d', width=1.5), name='Midline (SMA)'))
if 'Upper' in results.columns:
    fig.add_trace(go.Scatter(x=results.index, y=results['Upper'], line=dict(color='#d1fae5', dash='dash', width=1), name='Upper Band'))
if 'Lower' in results.columns:
    fig.add_trace(go.Scatter(x=results.index, y=results['Lower'], line=dict(color='#d1fae5', dash='dash', width=1), name='Lower Band'))

fig.update_layout(
    height=700,
    template='plotly_dark',
    xaxis_rangeslider_visible=False,
    paper_bgcolor='rgba(0,0,0,0)',
    plot_bgcolor='rgba(0,0,0,0)',
    margin=dict(l=20, r=20, t=20, b=20),
    legend=dict(yanchor="top", y=0.99, xanchor="left", x=0.01),
    font=dict(family="Inter, sans-serif")
)
st.plotly_chart(fig, use_container_width=True)

# Data Table
if st.checkbox("Show Data Table"):
    st.dataframe(results.tail(50), use_container_width=True)
