import React from "react";
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function StatisticsScreen() {
    const { colors } = useTheme();

    const stats = useQuery(api.todos.getStats);
    const loading = stats === undefined;

    const total = stats?.total ?? 0;
    const completed = stats?.completed ?? 0;
    const active = stats?.active ?? 0;
    const completionRate = stats?.percentage ?? 0;

    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionRate / 100) * circumference;

    const performanceEmoji = completionRate > 70 ? "🔥" : completionRate > 30 ? "⚡" : "💤";

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.buttonBackground} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={[styles.title, { color: colors.mainText }]}>Статистика</Text>
            <View style={[styles.chartCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={styles.chartContainer}>
                    <Svg width="120" height="120" viewBox="0 0 120 120">
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke={colors.border}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            opacity={0.3}
                        />
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke={colors.green || "#10b981"}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                        />
                    </Svg>
                    <View style={styles.chartTextContainer}>
                        <Text style={[styles.chartPercentage, { color: colors.mainText }]}>
                            {completionRate}%
                        </Text>
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
                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH, borderColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Всього</Text>
                    <Text style={[styles.statValue, { color: colors.mainText }]}>{total}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH, borderColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Активні</Text>
                    <Text style={[styles.statValue, { color: colors.buttonBackground }]}>{active}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH, borderColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Завершені</Text>
                    <Text style={[styles.statValue, { color: colors.green || "#10b981" }]}>{completed}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.cardBackground, width: CARD_WIDTH, borderColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.subText }]}>Ефективність</Text>
                    <Text style={[styles.statValue, { color: colors.mainText }]}>{performanceEmoji}</Text>
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
        borderWidth: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
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
        borderWidth: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
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
});
