"use client";
import { useState, useCallback, useEffect } from "react";
import { Sammy } from "@sammy-labs/success";
import { generateToken } from "./actions";
import { Bot, MessageSquare, Moon, Sun } from "lucide-react";

// Theme presets
const themePresets = {
  default: {
    primary: "#F84000", // Original Sammy orange
    secondary: "#0074D9", // Blue
    accent: "#FFC107", // Amber
    error: "#DC2626", // Red
    success: "#16A34A", // Green
  },
  indigo: {
    primary: "#6366F1", // Indigo
    secondary: "#A855F7", // Purple
    accent: "#EC4899", // Pink
    error: "#EF4444", // Red
    success: "#10B981", // Green
  },
  emerald: {
    primary: "#10B981", // Emerald
    secondary: "#0EA5E9", // Sky blue
    accent: "#8B5CF6", // Violet
    error: "#F43F5E", // Rose
    success: "#22C55E", // Green
  },
  rose: {
    primary: "#F43F5E", // Rose
    secondary: "#8B5CF6", // Violet
    accent: "#F59E0B", // Amber
    error: "#EF4444", // Red
    success: "#10B981", // Green
  },
  amber: {
    primary: "#F59E0B", // Amber
    secondary: "#0EA5E9", // Sky blue
    accent: "#8B5CF6", // Violet
    error: "#EF4444", // Red
    success: "#10B981", // Green
  },
};

type ThemePresetKey = keyof typeof themePresets;

export default function Chat() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themePreset, setThemePreset] = useState<ThemePresetKey>("indigo");
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

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const SammyProviderProps = {
    token,
    theme: isDarkMode ? "dark" : "light",
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
    // Add custom theme colors
    themeColors: {
      // Use selected theme preset
      ...themePresets[themePreset],
      // Common colors that change with dark/light mode
      background: isDarkMode ? "#1E1E2E" : "#FFFFFF",
      foreground: isDarkMode ? "#E2E8F0" : "#1F2937",
      border: isDarkMode ? "#383854" : "#E5E7EB",
    },
  };

  return (
    <div>
      {/* Theme controls */}
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme Mode:</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-700" />
            )}
          </button>
        </div>

        <div className="mt-2">
          <span className="text-sm font-medium">Color Theme:</span>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {(Object.keys(themePresets) as ThemePresetKey[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setThemePreset(preset)}
                className={`w-8 h-8 rounded-full ${
                  themePreset === preset
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : ""
                }`}
                style={{ backgroundColor: themePresets[preset].primary }}
                aria-label={`${preset} theme`}
              />
            ))}
          </div>
        </div>
      </div>

      <Sammy {...SammyProviderProps} />
    </div>
  );
}
