import React, { useMemo, useState, useCallback } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { TodoSkeleton } from "@/components/TodoSkeleton";

export default function HomeScreen() {
  const { colors } = useTheme();

  const todos = useQuery(api.todos.getTodos);
  const loading = todos === undefined;

  const [mutationError, setMutationError] = useState<string | null>(null);

  const completedCount = useMemo(
    () => (todos ?? []).filter((t) => t.completed).length,
    [todos]
  );

  const addTodoMutation = useMutation(api.todos.createTodo);
  const toggleTodoMutation = useMutation(api.todos.toggleTodo);
  const deleteTodoMutation = useMutation(api.todos.deleteTodo);
  const updateTodoMutation = useMutation(api.todos.updateTodo);

  const withErrorHandling = useCallback(
    (fn: () => Promise<void>) => async () => {
      try {
        setMutationError(null);
        await fn();
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : "Не вдалося виконати операцію"
        );
      }
    },
    []
  );

  const handleAdd = useCallback(
    async (text: string) => {
      try {
        setMutationError(null);
        await addTodoMutation({ text });
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : "Не вдалося додати завдання"
        );
      }
    },
    [addTodoMutation]
  );

  const handleToggle = useCallback(
    async (id: Id<"todos">) => {
      if (!id) return;
      await withErrorHandling(async () => {
        await toggleTodoMutation({ id });
      })();
    },
    [toggleTodoMutation, withErrorHandling]
  );

  const handleDelete = useCallback(
    async (id: Id<"todos">) => {
      if (!id) return;
      await withErrorHandling(async () => {
        await deleteTodoMutation({ id });
      })();
    },
    [deleteTodoMutation, withErrorHandling]
  );

  const handleEdit = useCallback(
    async (id: Id<"todos">, text: string) => {
      if (!id) {
        setMutationError("Не вдалося оновити: відсутній id завдання");
        return;
      }
      await withErrorHandling(async () => {
        await updateTodoMutation({ id, text });
      })();
    },
    [updateTodoMutation, withErrorHandling]
  );

  return (
    <View style={[styles.appContainer, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.todoCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            shadowColor: "#000",
          },
        ]}
      >
        <Header totalCount={todos?.length ?? 0} completedCount={completedCount} />

        {mutationError && (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: colors.errorBackground, borderColor: colors.errorBorder },
            ]}
          >
            <View style={styles.errorContent}>
              <Text style={[styles.errorTitle, { color: colors.errorText }]}>⚠️ Помилка:</Text>
              <Text style={[styles.errorText, { color: colors.errorText }]}>{mutationError}</Text>
            </View>
            <Pressable
              style={[styles.retryBtn, { backgroundColor: colors.retryButtonBackground }]}
              onPress={() => setMutationError(null)}
            >
              <Text style={[styles.retryText, { color: colors.white }]}>Закрити</Text>
            </Pressable>
          </View>
        )}

        <TodoForm onAdd={handleAdd} loading={loading} />

        {loading ? (
          <TodoSkeleton />
        ) : (
          <TodoList
            todos={todos ?? []}
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
    shadowOffset: { width: 0, height: 10 },
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
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  retryText: {
    fontWeight: "600",
    fontSize: 13,
  },
});