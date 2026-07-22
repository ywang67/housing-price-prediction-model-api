const MARKET_API_URL =
  process.env.MARKET_API_URL ?? "http://127.0.0.1:8002";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const response = await fetch(
      `${MARKET_API_URL}/api/market/what-if`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    const responseBody = await response.json();

    return Response.json(responseBody, {
      status: response.status,
    });
  } catch {
    return Response.json(
      {
        detail: "Market API is unavailable.",
      },
      {
        status: 503,
      },
    );
  }
}
