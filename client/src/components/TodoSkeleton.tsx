import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const TodoSkeleton = () => {
    const { colors } = useTheme();

    const shimmerAnimated = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(shimmerAnimated, {
                toValue: SCREEN_WIDTH,
                duration: 1500,
                useNativeDriver: true,
            })
        );

        animation.start();
        return () => animation.stop();
    }, [shimmerAnimated]);

    const renderRow = () => (
        <View style={styles.skeletonRow}>
            <View style={[styles.skeletonCheck, { backgroundColor: colors.border }]}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        { transform: [{ translateX: shimmerAnimated }, { skewX: "-25deg" }] },
                    ]}
                />
            </View>

            <View style={[styles.skeletonText, { backgroundColor: colors.border }]}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        { transform: [{ translateX: shimmerAnimated }, { skewX: "-25deg" }] },
                    ]}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.skeletonContainer}>
            {renderRow()}
            {renderRow()}
            {renderRow()}
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonContainer: {
        marginTop: 20,
        width: "100%",
    },
    skeletonRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
        width: "100%",
    },
    skeletonCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 14,
        position: "relative",
        overflow: "hidden",
    },
    skeletonText: {
        flex: 1,
        height: 18,
        borderRadius: 6,
        position: "relative",
        overflow: "hidden",
    },
    shimmerOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.28)",
    },
});
