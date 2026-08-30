import React from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.mainText }]}>Темна тема</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>
                        {isDarkMode ? "Увімкнено" : "Вимкнено"}
                    </Text>
                </View>

                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: colors.buttonBackground }}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.border}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
});
