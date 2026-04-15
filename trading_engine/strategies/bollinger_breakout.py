import pandas as pd
from ..strategy import Strategy

class BollingerBandBreakout(Strategy):
    def __init__(self, window: int = 20, num_std: float = 2.0):
        super().__init__("Bollinger Band Breakout")
        self.window = window
        self.num_std = num_std

    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        df = data.copy()
        
        # Calculate Bollinger Bands
        df['SMA'] = df['Close'].rolling(window=self.window).mean()
        df['STD'] = df['Close'].rolling(window=self.window).std()
        df['Upper'] = df['SMA'] + (df['STD'] * self.num_std)
        df['Lower'] = df['SMA'] - (df['STD'] * self.num_std)
        
        # Initialize Signal
        df['Signal'] = 0
        
        # State tracking for Breakout
        in_position = False
        
        for i in range(len(df)):
            if not in_position:
                # Buy when price > upper band
                if df['Close'].iloc[i] > df['Upper'].iloc[i]:
                    df.iloc[i, df.columns.get_loc('Signal')] = 1
                    in_position = True
            else:
                # Sell when price < lower band
                if df['Close'].iloc[i] < df['Lower'].iloc[i]:
                    df.iloc[i, df.columns.get_loc('Signal')] = -1
                    in_position = False
        
        return df
