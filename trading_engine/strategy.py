from abc import ABC, abstractmethod
import pandas as pd

class Strategy(ABC):
    """
    Abstract base class for trading strategies.
    Ensures a consistent interface for the trading engine.
    """

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Takes OHLCV data associated with a ticker and generates trading signals.
        
        Parameters:
        - data: pd.DataFrame with columns like ['Open', 'High', 'Low', 'Close', 'Volume']
        
        Returns:
        - pd.DataFrame: The input data with an added 'Signal' column.
          1 for Buy, -1 for Sell, 0 for Hold/Neutral.
        """
        pass
