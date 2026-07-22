from pydantic import BaseModel, Field


class HouseFeatures(BaseModel):
    # Keep predictions within the feature ranges represented in the training dataset.
    # otherwise could be wrong predictions.
    square_footage: float = Field(ge=980, le=2400)
    bedrooms: int = Field(ge=2, le=4)
    bathrooms: float = Field(ge=1, le=3)
    year_built: int = Field(ge=1978, le=2012)
    lot_size: float = Field(ge=4400, le=10500)
    distance_to_city_center: float = Field(ge=2.1, le=8.2)
    school_rating: float = Field(ge=6.5, le=9.1)


class PredictionRequest(BaseModel):
    houses: list[HouseFeatures] = Field(min_length=1)


class PredictionResponse(BaseModel):
    predictions: list[float]
