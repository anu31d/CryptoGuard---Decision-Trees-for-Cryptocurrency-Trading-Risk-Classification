# CryptoGuard - Decision Trees for Cryptocurrency Trading Risk Classification

A machine learning application that classifies cryptocurrency trading risk levels using Decision Tree algorithms, helping traders make informed investment decisions.

---

## Overview

CryptoGuard analyzes historical cryptocurrency market data to predict trading risk levels (Low, Medium, High) based on key financial indicators. The system leverages scikit-learn's Decision Tree classifier trained on real market data from 23+ cryptocurrencies.

---

## Features

- **Real-time Data Integration** – Fetches live cryptocurrency data via yfinance API with automatic CSV fallback for offline analysis
- **Intelligent Feature Engineering** – Computes daily returns, 7-day rolling volatility, and volume changes from raw OHLCV data
- **Decision Tree Classification** – Trained model with Gini impurity criterion and max depth of 5 for optimal performance
- **Interactive Web Interface** – Modern UI for risk prediction with analytics dashboard and educational glossary
- **Multi-Coin Support** – Pre-loaded datasets for Bitcoin, Ethereum, Solana, Cardano, Dogecoin, and 18+ other cryptocurrencies

---

## Risk Classification

| Risk Level | Volatility Threshold | Description |
|------------|---------------------|-------------|
| 🟢 Low | < 2% | Stable market conditions with minimal price fluctuations |
| 🟡 Medium | 2% - 5% | Moderate market movement with manageable risk exposure |
| 🔴 High | > 5% | High volatility indicating significant price swings |

---

## Tech Stack

- **Python** – Core programming language
- **scikit-learn** – Decision Tree classifier implementation
- **pandas & NumPy** – Data manipulation and numerical computations
- **yfinance** – Real-time cryptocurrency data retrieval
- **HTML/CSS/JavaScript** – Interactive web interface with Chart.js visualizations

---

## Project Structure

```
CryptoGuard/
├── data/                    # Historical CSV data for 23 cryptocurrencies
│   ├── coin_Bitcoin.csv
│   ├── coin_Ethereum.csv
│   └── ...
├── project/
│   ├── main.py              # CLI entry point
│   ├── data_loader.py       # Data fetching (yfinance + CSV fallback)
│   ├── features.py          # Feature engineering & risk labeling
│   ├── model_utils.py       # Decision Tree training & prediction
│   ├── index.html           # Web interface
│   ├── styles.css           # UI styling
│   └── script.js            # Frontend logic
├── requirements.txt
└── README.md
```

---

## Model Details

- **Algorithm**: Decision Tree Classifier
- **Features**: Return, Volatility (7-day rolling std), Volume Change
- **Target**: Risk Label (0 = Low, 1 = Medium, 2 = High)
- **Train/Test Split**: 80/20
- **Hyperparameters**: max_depth=5, criterion="gini"

---

## Supported Cryptocurrencies

Bitcoin, Ethereum, Binance Coin, Cardano, Solana, XRP, Polkadot, Dogecoin, Uniswap, Chainlink, Litecoin, Stellar, Cosmos, Monero, EOS, Tron, Tether, USD Coin, Wrapped Bitcoin, Aave, NEM, IOTA, Crypto.com Coin