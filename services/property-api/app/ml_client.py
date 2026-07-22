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
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        super().__init__(detail)


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
        response_body = error.response.json()
        raise MLServiceResponseError(
            error.response.status_code,
            response_body.get("detail", "ML API rejected the request"),
        ) from error

    try:
        return EstimateResponse.model_validate(response.json())

    except (ValueError, ValidationError) as error:
        raise MLServiceResponseError(
            502,
            "ML API returned an invalid response"
        ) from error


async def request_model_info() -> dict:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{ML_API_URL}/model-info")

        response.raise_for_status()
        return response.json()

    except (httpx.RequestError, httpx.HTTPStatusError) as error:
        raise MLServiceUnavailableError(
            "Could not load model information"
        ) from error
