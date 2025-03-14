"use client";
import { useState, useCallback, useEffect } from "react";
import { Sammy } from "@sammy-labs/success";
import { generateToken } from "./actions";
import { Bot, MessageSquare } from "lucide-react";

export default function Chat() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_SAMMY_BASE_URL || "http://localhost:8000";

  // Function to fetch a new token
  const fetchToken = useCallback(async () => {
    setLoading(true);
    try {
      const result = await generateToken(baseUrl);
      if (result && result.token) {
        setToken(result.token);
        setError(null);
      } else {
        setError("Failed to generate token");
        setToken(undefined);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
      setError("Error fetching token");
      setToken(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch token on component mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Handle token expiration
  const handleTokenExpired = useCallback(() => {
    console.log("Token has expired - refreshing");
    fetchToken();
  }, [fetchToken]);

  const SammyProviderProps = {
    token,
    theme: "light",
    logo: "/11x.svg",
    botImage: "/alice.png",
    baseUrl,
    width: "500px",
    height: "950px",
    initialChatText: "Hi I'm Alice, how can I help you today?",
    botIcon: Bot,
    chatIcon: MessageSquare,
    position: "bottom-right" as const,
    onTokenExpired: handleTokenExpired,
  };

  if (loading) {
    return <div className="hidden">Loading...</div>;
  }

  if (error) {
    return <div className="hidden">{error}</div>;
  }

  return <Sammy {...SammyProviderProps} />;
}
