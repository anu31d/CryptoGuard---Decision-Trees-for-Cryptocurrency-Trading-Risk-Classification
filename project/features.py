"""
CryptoGuard - Cryptocurrency Trading Risk Classification
Author: Anuska Dasgupta
Created: 2026
Description: Feature engineering and risk labeling module
"""

import pandas as pd


def risk_label(vol: float) -> int:
	"""Map volatility to discrete risk bucket.

	0 -> Low, 1 -> Medium, 2 -> High
	"""

	if vol < 0.02:
		return 0
	if vol < 0.05:
		return 1
	return 2


def build_features(df: pd.DataFrame) -> pd.DataFrame:
	"""Add ML features and target risk labels to a price DataFrame."""

	data = df.copy()

	if "Close" not in data.columns or "Volume" not in data.columns:
		raise ValueError("Input DataFrame must contain 'Close' and 'Volume' columns.")

	data["Return"] = data["Close"].pct_change()
	data["Volatility"] = data["Return"].rolling(7).std()
	data["Volume_Change"] = data["Volume"].pct_change()

	data.dropna(inplace=True)
	data["Risk"] = data["Volatility"].apply(risk_label)

	return data

