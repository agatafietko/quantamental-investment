import pandas as pd
import numpy as np
import yfinance as yf

class DataHandler:
    """
    Handles data ingestion and preparation for the trading engine.
    """

    @staticmethod
    def get_yfinance_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
        """Fetches historical OHLCV data from Yahoo Finance."""
        df = yf.download(ticker, start=start_date, end=end_date)
        if df.empty:
            raise ValueError(f"No data found for ticker {ticker}")
        
        # yfinance columns are MultiIndex if multiple tickers, or single Index.
        # Ensure standard columns.
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
            
        return df

    @staticmethod
    def generate_mock_data(days: int = 200, seed: int = 42) -> pd.DataFrame:
        """Generates synthetic OHLCV data for testing."""
        np.random.seed(seed)
        dates = pd.date_range(start="2024-01-01", periods=days)
        
        # Random walk for prices
        returns = np.random.normal(0, 0.02, days)
        price_paths = 100 * np.cumprod(1 + returns)
        
        df = pd.DataFrame(index=dates)
        df['Close'] = price_paths
        df['Open'] = df['Close'].shift(1).fillna(100)
        df['High'] = df[['Open', 'Close']].max(axis=1) * (1 + np.abs(np.random.normal(0, 0.005, days)))
        df['Low'] = df[['Open', 'Close']].min(axis=1) * (1 - np.abs(np.random.normal(0, 0.005, days)))
        df['Volume'] = np.random.randint(1000, 10000, days)
        
        return df

    @staticmethod
    def load_csv(filepath: str) -> pd.DataFrame:
        """Loads OHLCV data from a CSV file."""
        df = pd.read_csv(filepath, index_col=0, parse_dates=True)
        return df
