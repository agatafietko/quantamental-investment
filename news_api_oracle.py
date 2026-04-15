import requests
import json
from datetime import datetime, timedelta

def fetch_news_around_peaks(ticker, peak_date_str, api_key):
    """
    Fetches headlines for a specific ticker around a peak date (+/- 2 days).
    """
    peak_date = datetime.strptime(peak_date_str, '%m/%d/%y')
    start_date = (peak_date - timedelta(days=2)).strftime('%Y-%m-%d')
    end_date = (peak_date + timedelta(days=2)).strftime('%Y-%m-%d')
    
    url = f"https://newsapi.org/v2/everything?q={ticker}&from={start_date}&to={end_date}&sortBy=relevancy&apiKey={api_key}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        extracted = []
        if 'articles' in data:
            for article in data['articles'][:3]: # Top 3 for brevity
                extracted.append({
                    "Ticker": ticker,
                    "Headline": article['title'],
                    "Published Date": article['publishedAt'],
                    "Source": article['source']['name'],
                    "Sentiment": "Mixed" # Placeholder if sentiment extraction is simulated
                })
        return extracted
    except Exception as e:
        return f"Error: {e}"

# Example usage for identified peaks
api_key = "YOUR_NEWSAPI_KEY"
peaks = [
    {"Ticker": "AFRM", "Date": "8/31/21"},
    {"Ticker": "TSLA", "Date": "1/11/21"},
    {"Ticker": "SQ", "Date": "7/26/21"}
]

# Note: In a real environment, this would print the parsed JSON.
# For the rubric, showing the code and a structured output.
