import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime, timedelta
import time

# --- LEAD QUANT & UI/UX ARCHITECT CONFIG ---
st.set_page_config(page_title="Sentiment Alpha Pod", layout="wide", initial_sidebar_state="collapsed")

# Custom CSS for Glassmorphism and Dark-Blue Slate Theme
glassmorphism_css = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
    
    html, body, [data-testid="stAppViewContainer"] {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        font-family: 'Inter', sans-serif;
        color: #f8fafc;
    }

    .stApp {
        background: transparent;
    }

    /* Glassmorphism Card Effect */
    .glass-card {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        margin-bottom: 20px;
    }

    /* Gradient Text */
    .gradient-text {
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }

    /* Metric Styling */
    [data-testid="stMetricValue"] {
        font-size: 2rem;
        font-weight: 600;
        color: #38bdf8;
    }

    /* Hide Streamlit Header/Footer */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
"""
st.markdown(glassmorphism_css, unsafe_allow_html=True)

# --- AGENTS ---

import feedparser

class ScraperAgent:
    """Agent responsible for fetching the latest news headlines and price data."""
    def __init__(self, ticker="UBER"):
        self.ticker = ticker
        self.stock = yf.Ticker(ticker)

    def fetch_news(self, limit=100):
        """Fetch news headlines from Google News RSS for better reliability."""
        rss_url = f"https://news.google.com/rss/search?q={self.ticker}+stock&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(rss_url)
        
        headlines = []
        for entry in feed.entries[:limit]:
            # Convert published time to datetime
            dt = datetime.fromtimestamp(time.mktime(entry.published_parsed))
            headlines.append({
                'headline': entry.title,
                'publisher': entry.source.title if 'source' in entry else 'Google News',
                'timestamp': dt,
                'link': entry.link
            })
        
        return headlines

    def fetch_price_data(self, period="5d", interval="1h"):
        """Fetch historical price data."""
        return self.stock.history(period=period, interval=interval)

class LinguistAgent:
    """Agent responsible for sentiment analysis using VADER."""
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def score_headline(self, headline):
        """Returns the compound sentiment score."""
        scores = self.analyzer.polarity_scores(headline)
        return scores['compound']

# --- LOGIC ---

def generate_signal(score):
    if score > 0.4:
        return "LONG", "#10b981" # Green
    elif score < -0.4:
        return "SHORT", "#ef4444" # Red
    else:
        return "NEUTRAL", "#94a3b8" # Slate

# --- MAIN APP ---

def main():
    st.markdown('<h1 class="gradient-text">Sentiment Alpha Pod: $UBER</h1>', unsafe_allow_html=True)
    
    with st.spinner("Scraping Data & Analyzing Sentiment..."):
        scraper = ScraperAgent()
        linguist = LinguistAgent()
        
        # 1. Fetch Data
        raw_news = scraper.fetch_news(100)
        try:
            prices = scraper.fetch_price_data()
        except Exception as e:
            st.error(f"Error fetching price data: {e}")
            prices = pd.DataFrame()
        
        if not raw_news:
            st.warning("No news found for $UBER.")
            return

        # 2. Process Sentiment
        news_df = pd.DataFrame(raw_news)
        news_df['sentiment_score'] = news_df['headline'].apply(linguist.score_headline)
        
        avg_sentiment = news_df['sentiment_score'].mean()
        signal, color = generate_signal(avg_sentiment)

    # UI: Header Stats
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f'<div class="glass-card"><h4>Current Signal</h4><h2 style="color:{color}">{signal}</h2></div>', unsafe_allow_html=True)
    with col2:
        st.markdown(f'<div class="glass-card"><h4>Avg Sentiment</h4><h2>{avg_sentiment:.2f}</h2></div>', unsafe_allow_html=True)
    with col3:
        if not prices.empty:
            current_price = prices['Close'].iloc[-1]
            st.markdown(f'<div class="glass-card"><h4>Price</h4><h2>${current_price:.2f}</h2></div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="glass-card"><h4>Price</h4><h2>N/A</h2></div>', unsafe_allow_html=True)
    with col4:
        st.markdown(f'<div class="glass-card"><h4>Headlines</h4><h2>{len(news_df)}</h2></div>', unsafe_allow_html=True)

    # 3. Visualization: Dual-Axis Plotly Chart
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Y1: Candlestick Price
    if not prices.empty:
        fig.add_trace(
            go.Candlestick(
                x=prices.index,
                open=prices['Open'],
                high=prices['High'],
                low=prices['Low'],
                close=prices['Close'],
                name="Price",
                increasing_line_color="#10b981",
                decreasing_line_color="#ef4444"
            ),
            secondary_y=False,
        )
    else:
        st.info("Price data currently unavailable. Chart showing sentiment only.")

    # Y2: Sentiment Bars
    # We'll map news timestamps to the chart. Since we might have multiple news items, 
    # we'll jitter them slightly or group them if they share a timestamp.
    fig.add_trace(
        go.Bar(
            x=news_df['timestamp'],
            y=news_df['sentiment_score'],
            name="Sentiment",
            marker_color=news_df['sentiment_score'].apply(lambda x: "#10b981" if x > 0 else "#ef4444"),
            opacity=0.6,
            customdata=news_df['headline'],
            hovertemplate="<b>Score: %{y:.2f}</b><br>Headline: %{customdata}<extra></extra>"
        ),
        secondary_y=True,
    )

    # Style the chart for Dark Mode
    fig.update_layout(
        template="plotly_dark",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        xaxis_rangeslider_visible=False,
        height=600,
        margin=dict(l=20, r=20, t=50, b=20),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        hovermode="x unified"
    )

    fig.update_yaxes(title_text="Price ($)", secondary_y=False, gridcolor="rgba(255,255,255,0.1)")
    fig.update_yaxes(title_text="Sentiment Score", secondary_y=True, showgrid=False, range=[-1, 1])

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

    # Recent Headlines Feed
    st.markdown('<h3 class="gradient-text">Alpha Feed</h3>', unsafe_allow_html=True)
    for idx, row in news_df.iterrows():
        sig, sig_col = generate_signal(row['sentiment_score'])
        with st.container():
            st.markdown(f"""
            <div class="glass-card" style="padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #94a3b8; font-size: 0.8rem;">{row['timestamp'].strftime('%Y-%m-%d %H:%M')}</span>
                    <span style="background: {sig_col}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">{sig}</span>
                </div>
                <div style="margin-top: 5px; font-weight: 500;">{row['headline']}</div>
                <div style="color: #38bdf8; font-size: 0.9rem; margin-top: 5px;">Score: {row['sentiment_score']:.2f} | Publisher: {row['publisher']}</div>
            </div>
            """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
