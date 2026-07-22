from datetime import date

from pydantic import BaseModel, Field


CURRENT_YEAR = date.today().year


class PropertyFeatures(BaseModel):
    square_footage: float = Field(gt=0)
    bedrooms: int = Field(gt=0)
    bathrooms: float = Field(gt=0)
    year_built: int = Field(ge=1800, le=CURRENT_YEAR)
    lot_size: float = Field(gt=0)
    distance_to_city_center: float = Field(ge=0)
    school_rating: float = Field(ge=0, le=10)


class EstimateRequest(BaseModel):
    houses: list[PropertyFeatures] = Field(min_length=1)


class EstimateResponse(BaseModel):
    predictions: list[float]