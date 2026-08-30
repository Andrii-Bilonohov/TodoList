import { ThemeContext } from "@/contexts/ThemeContext";
import { COLORS } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    ReactNode,
    useEffect,
    useState,
} from "react";

const THEME_STORAGE_KEY = "@theme_mode";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDarkMode(JSON.parse(savedTheme));
                }
            } catch (error) {
                console.error("Помилка завантаження теми з AsyncStorage:", error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const nextMode = !isDarkMode;
            setIsDarkMode(nextMode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextMode));
        } catch (error) {
            console.error("Помилка збереження теми:", error);
        }
    };

    const currentColors = isDarkMode ? COLORS.dark : COLORS.light;

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                colors: currentColors,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};