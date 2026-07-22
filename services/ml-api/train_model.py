from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    r2_score,
    root_mean_squared_error,
)

import joblib

SERVICE_ROOT = Path(__file__).resolve().parent
REPOSITORY_ROOT = SERVICE_ROOT.parent.parent

DATA_PATH = REPOSITORY_ROOT / "data" / "House Price Dataset.csv"
MODEL_PATH = (
    SERVICE_ROOT
    / "artifacts"
    / "housing_price_model.joblib"
)

FEATURE_COLUMNS = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]

TARGET_COLUMN = "price"
MODEL_COLUMNS = FEATURE_COLUMNS + [TARGET_COLUMN]

def validate_data(data: pd.DataFrame) -> None:
    missing_columns = [
        column for column in MODEL_COLUMNS if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Dataset is missing required columns: {missing_columns}"
        )

    for column in MODEL_COLUMNS:
        missing_count = data[column].isna().sum()

        if missing_count > 0:
            raise ValueError(
                f"Column '{column}' contains {missing_count} missing values"
            )
        if not pd.api.types.is_numeric_dtype(data[column]):
            raise ValueError(
                f"Column '{column}' must contain numeric values"
            )

def main() -> None:
    data = pd.read_csv(DATA_PATH)
    validate_data(data)
    print("Data validation passed.")
    X = data[FEATURE_COLUMNS]
    y = data[TARGET_COLUMN]
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=1,
    )

    model = LinearRegression()
    model.fit(X_train, y_train)
    print("Model training completed.")

    predictions = model.predict(X_test)

    print("Actual prices:")
    print(y_test.to_numpy())

    print("Predicted prices:")
    print(predictions.round(2))

    mae = mean_absolute_error(y_test, predictions)
    print(f"MAE: ${mae:,.2f}")

    rmse = root_mean_squared_error(y_test, predictions)
    print(f"RMSE: ${rmse:,.2f}")

    r2 = r2_score(y_test, predictions)
    print(f"R²: {r2:.4f}")

    model_artifact = {
        "model": model,
        "feature_columns": FEATURE_COLUMNS,
        "metrics": {
            "mae": mae,
            "rmse": rmse,
            "r2": r2,
        },
    }
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model_artifact, MODEL_PATH)

    print(f"Model artifact saved to: {MODEL_PATH}")

    print(f"Model intercept: {model.intercept_:.2f}")
    print("Model coefficients:")
    for feature, coef in zip(FEATURE_COLUMNS, model.coef_, strict=True):
        print(f"  {feature}: {coef:.2f}")

    print(f"Dataset shape: {data.shape}")
    print(f"Feature shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    print(f"Features: {X.columns.tolist()}")
    print(f"Training feature shape: {X_train.shape}")
    print(f"Test feature shape: {X_test.shape}")
    print(f"Training target shape: {y_train.shape}")
    print(f"Test target shape: {y_test.shape}")

if __name__ == "__main__":
    main()