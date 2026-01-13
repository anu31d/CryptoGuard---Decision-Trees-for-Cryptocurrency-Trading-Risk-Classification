import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# STEP 1: Download Crypto Data
# -----------------------------
crypto = yf.download("BTC-USD", start="2021-01-01", end="2024-01-01")

# -----------------------------
# STEP 2: Feature Engineering
# -----------------------------
crypto['Return'] = crypto['Close'].pct_change()
crypto['Volatility'] = crypto['Return'].rolling(7).std()
crypto['Volume_Change'] = crypto['Volume'].pct_change()

crypto.dropna(inplace=True)

# -----------------------------
# STEP 3: Risk Label Creation
# -----------------------------
def risk_label(vol):
    if vol < 0.02:
        return 0   # Low Risk
    elif vol < 0.05:
        return 1   # Medium Risk
    else:
        return 2   # High Risk

crypto['Risk'] = crypto['Volatility'].apply(risk_label)

# -----------------------------
# STEP 4: Prepare Dataset
# -----------------------------
X = crypto[['Return', 'Volatility', 'Volume_Change']]
y = crypto['Risk']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# STEP 5: Train Decision Tree
# -----------------------------
model = DecisionTreeClassifier(
    max_depth=5,
    criterion="gini",
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# STEP 6: Evaluate Model
# -----------------------------
y_pred = model.predict(X_test)

print("\nModel Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# -----------------------------
# STEP 7: User Input Prediction
# -----------------------------
print("\n--- Cryptocurrency Trading Risk Prediction ---")
print("Enter the following values to predict risk level:\n")

try:
    return_val = float(input("Enter Return (e.g., 0.01 for 1%): "))
    volatility = float(input("Enter Volatility (e.g., 0.03): "))
    volume_change = float(input("Enter Volume Change (e.g., 0.05 for 5%): "))
    
    user_input = [[return_val, volatility, volume_change]]
    prediction = model.predict(user_input)
    
    risk_map = {0: "Low Risk", 1: "Medium Risk", 2: "High Risk"}
    print("\n✅ Predicted Trade Risk:", risk_map[prediction[0]])
except ValueError:
    print("\n❌ Invalid input. Please enter numeric values.")
