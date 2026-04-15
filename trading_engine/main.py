import pandas as pd
import matplotlib.pyplot as plt
from trading_engine.strategies import BollingerBandBreakout, MeanReversion, RSIMomentum
from trading_engine.data_handler import DataHandler
from trading_engine.backtester import Backtester

def plot_results(results_dict):
    """Plots the cumulative returns of all strategies."""
    plt.figure(figsize=(12, 6))
    
    for name, df in results_dict.items():
        plt.plot(df.index, df['Cum_Strategy_Returns'], label=name)
    
    # Plot baseline (Buy and Hold) - assuming same for all, just use the first one
    first_df = list(results_dict.values())[0]
    plt.plot(first_df.index, first_df['Cum_Returns'], label='Buy & Hold (Baseline)', linestyle='--', alpha=0.5)
    
    plt.title('Strategy Performance Comparison')
    plt.xlabel('Date')
    plt.ylabel('Cumulative Return')
    plt.legend()
    plt.grid(True)
    plt.savefig('strategy_performance.png')
    print("Performance plot saved as 'strategy_performance.png'")

def main():
    print("Initializing Trading Engine...")
    
    # 1. Get Data
    handler = DataHandler()
    data = handler.generate_mock_data(days=365)
    print(f"Data generated: {len(data)} rows.")

    # 2. Define Strategies
    strategies = [
        BollingerBandBreakout(),
        MeanReversion(),
        RSIMomentum()
    ]

    # 3. Run Backtests
    backtester = Backtester(initial_capital=10000.0)
    results_dict = {}

    for strategy in strategies:
        print(f"\n--- Testing Strategy: {strategy.name} ---")
        
        # Generate Signals
        data_with_signals = strategy.generate_signals(data)
        
        # Run Backtest
        results = backtester.run(data_with_signals)
        results_dict[strategy.name] = results
        
        # Print Metrics
        metrics = backtester.get_metrics(results)
        for k, v in metrics.items():
            if isinstance(v, float):
                print(f"{k}: {v:.2f}")
            else:
                print(f"{k}: {v}")

    # 4. Visualize
    plot_results(results_dict)

if __name__ == "__main__":
    main()
