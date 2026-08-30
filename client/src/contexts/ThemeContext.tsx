import { ThemeColors } from "@/types/themeColors";
import {
    createContext,
} from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    colors: ThemeColors;
    toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);