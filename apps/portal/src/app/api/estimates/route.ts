const PROPERTY_API_URL =
  process.env.PROPERTY_API_URL ?? "http://127.0.0.1:8001";

// Proxy the request through Next.js to avoid browser CORS issues
// and handle failures from the Property API.
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const response = await fetch(
      `${PROPERTY_API_URL}/estimates`,
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
        detail: "Property API is unavailable",
      },
      {
        status: 503,
      },
    );
  }
}