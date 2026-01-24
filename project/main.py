"""
CryptoGuard - Cryptocurrency Trading Risk Classification
Author: Anuska Dasgupta
Created: 2026
Description: Main entry point for the CLI application
"""

import sys

from data_loader import load_crypto_data
from features import build_features
from model_utils import train_decision_tree, predict_risk


def main() -> None:
    print("\n--- Cryptocurrency Trading Risk Prediction (Decision Tree + yfinance/CSV) ---")

    # Basic CLI config – easy to extend later
    symbol = input("Enter ticker symbol (default BTC-USD): ") or "BTC-USD"
    coin_name = "Bitcoin"  # used for CSV fallback – can be mapped later
    start = input("Enter start date YYYY-MM-DD (default 2021-01-01): ") or "2021-01-01"
    end = input("Enter end date YYYY-MM-DD (default 2024-01-01): ") or "2024-01-01"

    df_raw = load_crypto_data(symbol=symbol, coin_name=coin_name, start=start, end=end)
    data = build_features(df_raw)

    print(f"[INFO] Dataset prepared with {len(data)} rows after feature engineering.")

    model, _ = train_decision_tree(data)

    print("\nEnter the following values to get a model-based risk prediction:\n")

    try:
        return_val = float(input("Enter Return (e.g., 0.01 for 1%): "))
        volatility = float(input("Enter Volatility (e.g., 0.03): "))
        volume_change = float(input("Enter Volume Change (e.g., 0.05 for 5%): "))
    except ValueError:
        print("\n❌ Invalid input. Please enter numeric values.")
        sys.exit(1)

    risk_label_str = predict_risk(model, return_val, volatility, volume_change)
    print(f"\n✅ Predicted Trade Risk (Decision Tree): {risk_label_str}")


if __name__ == "__main__":
    main()
