"use server";

interface AuthResponse {
  token: string;
  expires_at: string;
}

interface AuthRequest {
  api_key?: string;
  org_id: string;
  user_data: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export async function generateToken(
  baseUrl: string
): Promise<AuthResponse | null> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.SAMMY_API_KEY;

    if (!apiKey) {
      console.error("SAMMY_API_KEY is not defined in environment variables");
      return null;
    }

    // Prepare the request body according to the API schema
    const authRequest: AuthRequest = {
      org_id: process.env.ORG_ID || "00000000-0000-0000-0000-000000000000",
      user_data: {
        user_id: process.env.USER_ID || "00000000-0000-0000-0000-000000000001",
        first_name: "Demo",
        last_name: "User",
        email: "demo@example.com",
      },
    };

    // Call the authentication endpoint to get a JWT token
    const response = await fetch(`${baseUrl}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(authRequest),
    });

    if (!response.ok) {
      // Log more details about the error
      const errorText = await response.text();
      console.error(
        `Failed to generate token: ${response.status} ${response.statusText}`
      );
      console.error(`Error details: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return {
      token: data.token,
      expires_at:
        data.expires_at || new Date(Date.now() + 240 * 60 * 1000).toISOString(), // Fallback if expires_at is not provided
    };
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
}
