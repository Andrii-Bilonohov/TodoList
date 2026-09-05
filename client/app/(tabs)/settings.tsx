import React from "react";
import { StyleSheet, View, Text, Switch, Alert, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export default function SettingsScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const clearCompleted = useMutation(api.todos.clearCompleted);
    const clearAll = useMutation(api.todos.clearAll);

    const handleClearCompleted = () => {
        Alert.alert(
            "Очистити виконані",
            "Ви впевнені, що хочете видалити всі виконані завдання?",
            [
                { text: "Скасувати", style: "cancel" },
                {
                    text: "Видалити",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await clearCompleted();
                            const count = res?.deletedCount ?? 0;
                            Alert.alert("Успішно", `Видалено ${count} завдань`);
                        } catch (err) {
                            Alert.alert("Помилка", "Не вдалося видалити виконані завдання");
                        }
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            "Видалити ВСІ завдання",
            "Цю дію неможливо буде скасувати. Видалити всі завдання з хмари?",
            [
                { text: "Скасувати", style: "cancel" },
                {
                    text: "Видалити все",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await clearAll();
                            const count = res?.deletedCount ?? 0;
                            Alert.alert("Успішно", `Базу очищено. Видалено ${count} завдань`);
                        } catch (err) {
                            Alert.alert("Помилка", "Не вдалося повністю очистити базу");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.screenTitle, { color: colors.mainText }]}>Налаштування</Text>

            <View style={styles.section}>
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

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                    onPress={handleClearCompleted}
                    activeOpacity={0.7}
                >
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.mainText }]}>Очистити виконані</Text>
                        <Text style={[styles.subtitle, { color: colors.subText }]}>
                            Видалити завершені завдання із хмари
                        </Text>
                    </View>
                    <Text style={styles.arrowIcon}>🧹</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                    onPress={handleClearAll}
                    activeOpacity={0.7}
                >
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.errorText || "#ff4d4d" }]}>Очистити всю базу</Text>
                        <Text style={[styles.subtitle, { color: colors.subText }]}>
                            Повністю видалити всі поточні записи
                        </Text>
                    </View>
                    <Text style={styles.arrowIcon}>🗑️</Text>
                </TouchableOpacity>
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
    screenTitle: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
    },
    section: {
        gap: 12,
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
    arrowIcon: {
        fontSize: 18,
    },
});
