"use server";

export async function fetchAccessToken(): Promise<string> {
  const apiKey = process.env.HEYGEN_API_KEY;

  if (!apiKey) {
    throw new Error("API key not configured");
  }

  try {
    const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: { "x-api-key": apiKey },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const { data } = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw new Error("Failed to fetch token");
  }
}
