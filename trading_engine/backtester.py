import pandas as pd
import numpy as np

class Backtester:
    """
    Backtests human-readable signals against historical data.
    """

    def __init__(self, initial_capital: float = 10000.0):
        self.initial_capital = initial_capital

    def run(self, data_with_signals: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates performance metrics based on Signal column.
        """
        df = data_with_signals.copy()
        
        # Calculate daily returns
        df['Returns'] = df['Close'].pct_change().fillna(0)
        
        # Position tracking (1 for long, 0 for neutral)
        # We start neutral. Signal 1 enters, Signal -1 exits.
        df['Position'] = 0
        current_pos = 0
        
        positions = []
        for signal in df['Signal']:
            if signal == 1:
                current_pos = 1
            elif signal == -1:
                current_pos = 0
            positions.append(current_pos)
            
        df['Position'] = positions
        
        # Strategy returns (Position is held from the day the signal is generated)
        # However, usually we trade at next day's open or end of day.
        # Let's assume Signal at end of day, held for next day.
        df['Strategy_Returns'] = df['Position'].shift(1).fillna(0) * df['Returns']
        
        # Cumulative Returns
        df['Cum_Returns'] = (1 + df['Returns']).cumprod()
        df['Cum_Strategy_Returns'] = (1 + df['Strategy_Returns']).cumprod()
        
        # Portfolio Value
        df['Portfolio_Value'] = self.initial_capital * df['Cum_Strategy_Returns']
        
        return df

    def get_metrics(self, backtest_results: pd.DataFrame):
        """Calculates key performance metrics."""
        returns = backtest_results['Strategy_Returns']
        total_return = backtest_results['Cum_Strategy_Returns'].iloc[-1] - 1
        sharpe_ratio = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() != 0 else 0
        
        # Drawdown
        cum_returns = backtest_results['Cum_Strategy_Returns']
        peak = cum_returns.cummax()
        drawdown = (cum_returns - peak) / peak
        max_drawdown = drawdown.min()
        
        return {
            "Total Return (%)": total_return * 100,
            "Sharpe Ratio": sharpe_ratio,
            "Max Drawdown (%)": max_drawdown * 100,
            "Final Portfolio Value": backtest_results['Portfolio_Value'].iloc[-1]
        }
