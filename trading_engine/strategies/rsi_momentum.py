import pandas as pd
import numpy as np
from ..strategy import Strategy

class RSIMomentum(Strategy):
    def __init__(self, period: int = 14, buy_threshold: int = 30, sell_threshold: int = 70):
        super().__init__("RSI Momentum")
        self.period = period
        self.buy_threshold = buy_threshold
        self.sell_threshold = sell_threshold

    def calculate_rsi(self, series: pd.Series, period: int) -> pd.Series:
        delta = series.diff()
        gain = (delta.where(delta > 0, 0)).fillna(0)
        loss = (-delta.where(delta < 0, 0)).fillna(0)

        avg_gain = gain.rolling(window=period, min_periods=1).mean()
        avg_loss = loss.rolling(window=period, min_periods=1).mean()

        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        df = data.copy()
        
        # Calculate RSI
        df['RSI'] = self.calculate_rsi(df['Close'], self.period)
        
        # Initialize Signal
        df['Signal'] = 0
        
        # State tracking for RSI Momentum
        in_position = False
        
        for i in range(len(df)):
            if not in_position:
                # Buy at RSI < 30
                if df['RSI'].iloc[i] < self.buy_threshold:
                    df.iloc[i, df.columns.get_loc('Signal')] = 1
                    in_position = True
            else:
                # Sell at RSI > 70
                if df['RSI'].iloc[i] > self.sell_threshold:
                    df.iloc[i, df.columns.get_loc('Signal')] = -1
                    in_position = False
        
        return df
