import React, { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import type { Todo } from "@/types";
import { useTheme } from "@/hooks/useTheme";

import {
  getTodos,
  addTodo,
  toggleTodo,
  updateTodoText,
  deleteTodo,
} from "@/services/api";

import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";

export default function HomeScreen() {
  const { colors } = useTheme();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(
        "Не вдалося з'єднатися з json-server. Переконайтеся, що сервер запущено на порту 3000."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (text: string) => {
    try {
      const newTodo = await addTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      Alert.alert(
        "Помилка",
        "Не вдалося додати завдання. Перевірте з'єднання з сервером."
      );
      console.error(err);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      );
      await toggleTodo(id, completed);
    } catch (err) {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
      Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
      console.error(err);
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text } : t))
      );
      await updateTodoText(id, text);
    } catch (err) {
      fetchTodos();
      Alert.alert("Помилка", "Не вдалося оновити текст завдання.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await deleteTodo(id);
    } catch (err) {
      fetchTodos();
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
      console.error(err);
    }
  };

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  return (
    <View style={[styles.appContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.todoCard, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }]}>

        <Header
          totalCount={todos.length}
          completedCount={completedCount}
        />

        {error && (
          <View style={[styles.errorBanner, {
            backgroundColor: colors.errorBackground,
            borderColor: colors.errorBorder
          }]}>
            <View style={styles.errorContent}>
              <Text style={[styles.errorTitle, { color: colors.errorText }]}>
                ⚠️ Помилка з'єднання:
              </Text>
              <Text style={[styles.errorText, { color: colors.errorText }]}>
                {error}
              </Text>
              <View style={styles.serverTip}>
                <Text style={[styles.serverTipText, {
                  backgroundColor: colors.errorBackground,
                  color: colors.errorText
                }]}>
                  cd server && npm start
                </Text>
              </View>
            </View>

            <Pressable
              style={[styles.retryBtn, { backgroundColor: colors.retryButtonBackground }]}
              onPress={fetchTodos}
            >
              <Text style={[styles.retryText, { color: colors.white }]}>
                Повторити
              </Text>
            </Pressable>
          </View>
        )}

        <TodoForm
          onAdd={handleAdd}
          loading={loading}
        />

        {loading && todos.length === 0 ? (
          <View style={styles.todoLoading}>
            <ActivityIndicator
              size="large"
              color={colors.buttonBackground}
            />
            <Text style={[styles.loadingText, { color: colors.subText }]}>
              Завантаження завдань...
            </Text>
          </View>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 16,
  },
  todoCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  errorContent: {
    flex: 1,
    marginRight: 12,
  },
  errorTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
  },
  serverTip: {
    marginTop: 6,
  },
  serverTipText: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontFamily: "monospace",
  },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  retryText: {
    fontWeight: "600",
    fontSize: 13,
  },
  todoLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});
