import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"

import type { Todo } from "@/types";

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
    let isMounted = true;

    getTodos()
      .then((data) => {
        if (isMounted) {
          setTodos(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            "Не вдалося з'єднатися з json-server. Переконайтеся, що сервер запущено на порту 3000."
          );
        }

        console.error(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
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

  const handleToggle = async (
    id: string,
    completed: boolean
  ) => {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed }
            : t
        )
      );

      await toggleTodo(id, completed);
    } catch (err) {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: !completed }
            : t
        )
      );

      Alert.alert(
        "Помилка",
        "Не вдалося оновити статус завдання."
      );

      console.error(err);
    }
  };

  const handleEdit = async (
    id: string,
    text: string
  ) => {
    try {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, text }
            : t
        )
      );

      await updateTodoText(id, text);
    } catch (err) {
      fetchTodos();

      Alert.alert(
        "Помилка",
        "Не вдалося оновити текст завдання."
      );

      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTodos((prev) =>
        prev.filter((t) => t.id !== id)
      );

      await deleteTodo(id);
    } catch (err) {
      fetchTodos();

      Alert.alert(
        "Помилка",
        "Не вдалося видалити завдання."
      );

      console.error(err);
    }
  };

  const completedCount = useMemo(
    () =>
      todos.filter((t) => t.completed).length,
    [todos]
  );

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.todoCard}>

        <Header
          totalCount={todos.length}
          completedCount={completedCount}
        />

        {error && (
          <View style={styles.errorBanner}>
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>
                ⚠️ Помилка з'єднання:
              </Text>

              <Text style={styles.errorText}>
                {error}
              </Text>

              <View style={styles.serverTip}>
                <Text style={styles.serverTipText}>
                  cd server && npm start
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.retryBtn}
              onPress={fetchTodos}
            >
              <Text style={styles.retryText}>
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
              color="#6366f1"
            />

            <Text style={styles.loadingText}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 16,
  },
  todoCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
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
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
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
    color: "#991b1b",
    marginBottom: 4,
  },
  errorText: {
    color: "#991b1b",
    fontSize: 14,
  },
  serverTip: {
    marginTop: 6,
  },
  serverTipText: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: "#991b1b",
    fontSize: 12,
    fontFamily: "monospace",
  },
  retryBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  retryText: {
    color: "#ffffff",
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
    color: "#64748b",
    fontSize: 14,
  },
});
