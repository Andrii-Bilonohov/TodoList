import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function TabsLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.buttonBackground,
                tabBarStyle: {
                    backgroundColor: colors.cardBackground,
                    borderTopWidth: 1,
                    elevation: 5,
                    paddingBottom: 4,
                    paddingTop: 4,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Завдання",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "checkbox" : "checkbox-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="statistics"
                options={{
                    title: "Статистика",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "stats-chart" : "stats-chart-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Налаштування",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "settings" : "settings-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
