from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException, status

import pandas as pd
from app.schemas import PredictionRequest, PredictionResponse

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "artifacts" / "housing_price_model.joblib"

model_artifact = joblib.load(MODEL_PATH)
model = model_artifact["model"]
feature_columns = model_artifact["feature_columns"]
metrics = model_artifact["metrics"]
feature_ranges = model_artifact["feature_ranges"]

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
        strict=True,
    ):
        coefficients[feature] = float(coefficient)

    return {
        "model_type": "LinearRegression",
        "intercept": float(model.intercept_),
        "coefficients": coefficients,
        "feature_ranges": feature_ranges,
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
        row = house.model_dump()

        for feature, value in row.items():
            limits = feature_ranges[feature]
            minimum = limits["minimum"]
            maximum = limits["maximum"]

            if value < minimum or value > maximum:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        f"{feature} must be between "
                        f"{minimum:g} and {maximum:g}."
                    ),
                )

        rows.append(row)

    input_data = pd.DataFrame(
        rows,
        columns=feature_columns,
    )

    model_predictions = model.predict(input_data)

    prediction_values = []

    for prediction in model_predictions:
        prediction_values.append(round(float(prediction), 2))

    return PredictionResponse(predictions=prediction_values)
