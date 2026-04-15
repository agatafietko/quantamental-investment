import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt

# Download AAPL data
start_date = '2020-01-01'
end_date = '2024-12-31'
ticker = 'AAPL'

print(f"Downloading data for {ticker} from {start_date} to {end_date}...")
data = yf.download(ticker, start=start_date, end=end_date)

# Ensure data is not empty
if data.empty:
    print("No data found!")
    exit(1)

# Calculate SMAs
print("Calculating SMAs...")
# Retrieve the 'Close' column. yfinance might return a multi-index DataFrame.
# If it's multi-index (e.g. Price, Ticker), we want 'Close'.
if isinstance(data.columns, pd.MultiIndex):
    try:
        close_data = data['Close'][ticker]
    except KeyError:
         # Fallback if structure is different
        close_data = data['Close']
else:
    close_data = data['Close']

# Adjusting for potential different yfinance versions return types
if isinstance(close_data, pd.DataFrame):
     # If it's still a dataframe (e.g. single col), squeeze it to Series
    close_data = close_data.iloc[:, 0]


data['SMA50'] = close_data.rolling(window=50).mean()
data['SMA200'] = close_data.rolling(window=200).mean()

# Calculate Signal
# 1 when 50 > 200, else 0
print("Calculating Signal...")
data['Signal'] = 0
data.loc[data['SMA50'] > data['SMA200'], 'Signal'] = 1

# Plotting
print("Plotting strategy performance...")
plt.figure(figsize=(14, 7))
plt.plot(data.index, close_data, label='AAPL Close', alpha=0.5)
plt.plot(data.index, data['SMA50'], label='SMA 50', alpha=0.9)
plt.plot(data.index, data['SMA200'], label='SMA 200', alpha=0.9)

plt.title(f'{ticker} Price with SMA 50 and SMA 200')
plt.xlabel('Date')
plt.ylabel('Price')
plt.legend()
plt.grid(True)

# Save plot
output_file = 'strategy_performence.png'
plt.savefig(output_file)
print(f"Plot saved to {output_file}")
