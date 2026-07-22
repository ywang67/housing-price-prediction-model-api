from pathlib import Path

import joblib
from fastapi import FastAPI

import pandas as pd
from app.schemas import PredictionRequest, PredictionResponse

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "artifacts" / "housing_price_model.joblib"

model_artifact = joblib.load(MODEL_PATH)
model = model_artifact["model"]
feature_columns = model_artifact["feature_columns"]
metrics = model_artifact["metrics"]

app = FastAPI(title="Housing Price Prediction API")

@app.get("/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "healthy",
        "model_loaded": model is not None,
    }

@app.get("/model-info")
def model_info() -> dict:
    coefficients = {}

    for feature, coefficient in zip(
        feature_columns,
        model.coef_,
    ):
        coefficients[feature] = float(coefficient)

    return {
        "model_type": "LinearRegression",
        "intercept": float(model.intercept_),
        "coefficients": coefficients,
        "metrics": {
            "mae": float(metrics["mae"]),
            "rmse": float(metrics["rmse"]),
            "r2": float(metrics["r2"]),
        },
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    rows = []

    for house in request.houses:
        rows.append(house.model_dump())

    input_data = pd.DataFrame(
        rows,
        columns=feature_columns,
    )

    model_predictions = model.predict(input_data)

    prediction_values = []

    for prediction in model_predictions:
        prediction_values.append(round(float(prediction), 2))

    return PredictionResponse(predictions=prediction_values)
