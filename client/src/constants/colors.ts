import { ThemeColors } from "@/types/themeColors";

export const COLORS : { light: ThemeColors; dark: ThemeColors } = {
    light: {
        background: "#f5f7fb",
        mainText: "#1e293b",
        subText: "#64748b",
        cardBackground: "#ffffff",
        border: "#e2e8f0",
        errorBackground: "#fef2f2",
        errorBorder: "#fecaca",
        errorText: "#991b1b",
        retryButtonBackground: "#dc2626",
        placeholderText: "#94a3b8",
        todoInputBackground: "#f8fafc",
        buttonBackground: "#6366f1",
        white: "#ffffff",
        colorCompleted: "#94a3b8",
        green: "#10b981",
    } as const,
    dark: {
    background: "#0f172a",
    mainText: "#f8fafc",
    subText: "#94a3b8",
    cardBackground: "#1e293b",
    border: "#334155",
    errorBackground: "#451a03",
    errorBorder: "#7f1d1d",
    errorText: "#fca5a5",
    retryButtonBackground: "#ef4444",
    placeholderText: "#475569",
    todoInputBackground: "#0f172a",
    buttonBackground: "#6366f1",
    white: "#ffffff",
    colorCompleted: "#475569",
    green: "#34d399",
  } as const
}