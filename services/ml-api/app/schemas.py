from pydantic import BaseModel, Field


class HouseFeatures(BaseModel):
    square_footage: float
    bedrooms: int
    bathrooms: float
    year_built: int
    lot_size: float
    distance_to_city_center: float
    school_rating: float


class PredictionRequest(BaseModel):
    houses: list[HouseFeatures] = Field(min_length=1)


class PredictionResponse(BaseModel):
    predictions: list[float]
