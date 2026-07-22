from fastapi import FastAPI, HTTPException, status

from app.ml_client import (
    MLServiceResponseError,
    MLServiceUnavailableError,
    request_predictions,
)
from app.schemas import EstimateRequest, EstimateResponse


app = FastAPI(title="Property Value Estimator API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.post("/estimates", response_model=EstimateResponse)
async def create_estimate(
    request: EstimateRequest,
) -> EstimateResponse:
    try:
        return await request_predictions(request)

    except MLServiceUnavailableError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error

    except MLServiceResponseError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error