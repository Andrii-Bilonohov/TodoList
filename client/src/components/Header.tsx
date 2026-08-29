import {
  Text,
  View,
  StyleSheet,
} from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({
  totalCount,
  completedCount,
}: HeaderProps) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.headerTitleGroup}>
        <Text style={styles.headerIcon}>
          📝
        </Text>

        <Text style={styles.headerText}>
          Мій Список Завдань
        </Text>
      </View>

      <Text style={styles.headerSubtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    marginBottom: 24,
    alignItems: "center",
  },

  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 6,
  },

  headerIcon: {
    fontSize: 18,
  },

  headerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
});

