"""
CryptoGuard - Cryptocurrency Trading Risk Classification
Author: Anuska Dasgupta
Created: 2026
Description: Data loading module with yfinance API and CSV fallback
"""

import os

import pandas as pd
import yfinance as yf


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def load_from_yfinance(symbol: str, start: str, end: str) -> pd.DataFrame | None:
	"""Primary loader: pull OHLCV data from yfinance.

	Returns a DataFrame or None if download fails or is empty.
	"""

	try:
		df = yf.download(symbol, start=start, end=end)
	except Exception as exc:  # network / API errors
		print(f"[WARN] yfinance download failed for {symbol}: {exc}")
		return None

	if df is None or df.empty:
		print(f"[WARN] yfinance returned no data for {symbol}.")
		return None

	return df


def load_from_csv(coin_name: str) -> pd.DataFrame | None:
	"""Fallback loader: use local CSV in the data folder.

	Expects files like coin_Bitcoin.csv with columns containing
	at least: Date, Open, High, Low, Close, Volume.
	"""

	filename = f"coin_{coin_name}.csv"
	csv_path = os.path.join(DATA_DIR, filename)

	if not os.path.exists(csv_path):
		print(f"[WARN] Local CSV not found at {csv_path}.")
		return None

	try:
		df = pd.read_csv(csv_path)
	except Exception as exc:
		print(f"[WARN] Failed to read CSV {csv_path}: {exc}")
		return None

	required_cols = {"Open", "High", "Low", "Close", "Volume"}
	if not required_cols.issubset(df.columns):
		print(f"[WARN] CSV {csv_path} missing required OHLCV columns {required_cols}.")
		return None

	# Align structure to yfinance-style index/columns
	df = df.copy()
	df["Date"] = pd.to_datetime(df["Date"]) if "Date" in df.columns else pd.NaT
	df.set_index("Date", inplace=True, drop=True)

	return df[["Open", "High", "Low", "Close", "Volume"]]


def load_crypto_data(
	symbol: str = "BTC-USD",
	coin_name: str = "Bitcoin",
	start: str = "2021-01-01",
	end: str = "2024-01-01",
) -> pd.DataFrame:
	"""Load crypto time series using yfinance, with CSV as backup.

	Order (Option A):
	  1. Try yfinance with the given ticker symbol
	  2. If that fails/empty, fall back to local CSV in data/
	"""

	print(f"[INFO] Attempting to load data from yfinance for {symbol}...")
	df = load_from_yfinance(symbol, start, end)

	if df is not None:
		print("[INFO] Loaded data from yfinance.")
		return df

	print("[INFO] Falling back to local CSV data...")
	df = load_from_csv(coin_name)

	if df is None or df.empty:
		raise RuntimeError("Unable to load data from either yfinance or local CSV.")

	print("[INFO] Loaded data from local CSV.")
	return df

