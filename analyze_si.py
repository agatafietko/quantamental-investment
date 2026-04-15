import pandas as pd

# Load the data
file_path = "/Users/ziwenqin/Downloads/Stock Short Interest Data.csv"
df = pd.read_csv(file_path)

# Target tickers
tickers = ["AFRM", "SQ", "PYPL", "SHOP", "TSLA"]

results = {}

for ticker in tickers:
    ticker_df = df[df['Ticker'] == ticker].copy()
    # Sort by Squeeze Score descending and take top 3
    top_3 = ticker_df.sort_values(by='Squeeze Score', ascending=False).head(3)
    
    # Select requested columns
    top_3_display = top_3[['Business Date', 'Squeeze Score', 'ShortInterestPct', 'Crowded Score']]
    results[ticker] = top_3_display

# Output for Task 1, Step 1
for ticker, data in results.items():
    print(f"--- {ticker} Top 3 Squeeze Dates ---")
    print(data.to_string(index=False))
    print("\n")
