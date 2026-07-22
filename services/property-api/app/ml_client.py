import os

import httpx
from pydantic import ValidationError

from app.schemas import EstimateRequest, EstimateResponse


ML_API_URL = os.getenv(
    "ML_API_URL",
    "http://127.0.0.1:8000",
).rstrip("/")


class MLServiceUnavailableError(Exception):
    pass


class MLServiceResponseError(Exception):
    pass


async def request_predictions(
    request: EstimateRequest,
) -> EstimateResponse:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{ML_API_URL}/predict",
                json=request.model_dump(),
            )

        response.raise_for_status()

    except httpx.RequestError as error:
        raise MLServiceUnavailableError(
            "Could not connect to the ML API"
        ) from error

    except httpx.HTTPStatusError as error:
        raise MLServiceResponseError(
            f"ML API returned status {error.response.status_code}"
        ) from error

    try:
        return EstimateResponse.model_validate(response.json())

    except (ValueError, ValidationError) as error:
        raise MLServiceResponseError(
            "ML API returned an invalid response"
        ) from error