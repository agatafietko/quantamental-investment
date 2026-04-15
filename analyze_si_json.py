import pandas as pd
import json

# Load the data
file_path = "/Users/ziwenqin/Downloads/Stock Short Interest Data.csv"
df = pd.read_csv(file_path)

# Target tickers
tickers = ["AFRM", "SQ", "PYPL", "SHOP", "TSLA"]

results = []

for ticker in tickers:
    ticker_df = df[df['Ticker'] == ticker].copy()
    top_3 = ticker_df.sort_values(by='Squeeze Score', ascending=False).head(3)
    
    for _, row in top_3.iterrows():
        results.append({
            "Ticker": ticker,
            "Date": row['Business Date'],
            "Squeeze Score": row['Squeeze Score'],
            "Short Interest %": row['ShortInterestPct'],
            "Crowded Score": row['Crowded Score']
        })

print(json.dumps(results, indent=2))
