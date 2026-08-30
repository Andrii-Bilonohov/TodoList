import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getTodos } from "@/services/api";
import { useTheme } from "@/hooks/useTheme";
import type { Todo } from "@/types";
import { useFocusEffect } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function StatisticsScreen() {
    const { colors } = useTheme();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTodos();
            setTodos(data);
        } catch (err: any) {
            setError(err.message || "Не вдалося завантажити статистику");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [])
    );

    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionRate / 100) * circumference;

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.buttonBackground} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background, padding: 24 }]}>
                <View style={[styles.errorCard, { backgroundColor: colors.errorBackground, borderColor: colors.errorBorder }]}>
                    <Text style={[styles.errorText, { color: colors.errorText }]}>{error}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: colors.retryButtonBackground }]}
                    onPress={fetchStats}
                >
                    <Text style={[styles.retryText, { color: colors.white }]}>Повторити спробу</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.mainText }]}>Статистика</Text>

            <View style={[styles.chartCard, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.chartContainer}>
                    <Svg width="120" height="120" viewBox="0 0 120 120">
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke={colors.border}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke={colors.green}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                        />
                    </Svg>
                    <View style={styles.chartTextContainer}>
                        <Text style={[styles.chartPercentage, { color: colors.mainText }]}>{completionRate}%</Text>
                    </View>
                </View>
                <View style={styles.chartInfo}>
                    <Text style={[styles.chartTitle, { color: colors.mainText }]}>Прогрес виконання</Text>
                    <Text style={[styles.chartSub, { color: colors.subText }]}>
                        {completed} з {total} завдань виконано
                    </Text>
                </View>
            </View>

            <View style={styles.grid}>
                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Всього</Text>
                    <Text style={[styles.statValue, { color: colors.mainText }]}>{total}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Активні</Text>
                    <Text style={[styles.statValue, { color: colors.buttonBackground }]}>{active}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Завершені</Text>
                    <Text style={[styles.statValue, { color: colors.green }]}>{completed}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Ефективність</Text>
                    <Text style={[styles.statValue, { color: colors.mainText }]}>
                        {completionRate > 70 ? "🔥" : completionRate > 30 ? "⚡" : "💤"}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
    },
    chartCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    chartTextContainer: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    chartPercentage: {
        fontSize: 20,
        fontWeight: "700",
    },
    chartInfo: {
        flex: 1,
        marginLeft: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    chartSub: {
        fontSize: 14,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    statCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "700",
    },
    errorCard: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        width: "100%",
    },
    errorText: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    retryText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
