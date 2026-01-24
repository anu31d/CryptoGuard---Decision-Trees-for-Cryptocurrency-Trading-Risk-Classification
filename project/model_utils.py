import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier


def train_decision_tree(data: pd.DataFrame) -> tuple[DecisionTreeClassifier, pd.DataFrame]:
	"""Train a DecisionTreeClassifier on engineered crypto features."""

	feature_cols = ["Return", "Volatility", "Volume_Change"]
	X = data[feature_cols]
	y = data["Risk"]

	X_train, X_test, y_train, y_test = train_test_split(
		X, y, test_size=0.2, random_state=42
	)

	model = DecisionTreeClassifier(max_depth=5, criterion="gini", random_state=42)
	model.fit(X_train, y_train)

	y_pred = model.predict(X_test)

	print("\n[RESULT] Model Accuracy:", accuracy_score(y_test, y_pred))
	print("\n[RESULT] Classification Report:\n", classification_report(y_test, y_pred))

	return model, X_train


def predict_risk(model: DecisionTreeClassifier, ret: float, vol: float, vol_change: float) -> str:
	"""Use the trained model to predict a human-readable risk label."""

	user_input = np.array([[ret, vol, vol_change]])
	pred_class = int(model.predict(user_input)[0])

	risk_map = {0: "Low Risk", 1: "Medium Risk", 2: "High Risk"}
	return risk_map.get(pred_class, "Unknown")
