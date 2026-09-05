import type { Todo } from "@/types";
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { TodoItem } from "@/components/TodoItem";

import type { Id } from "convex/_generated/dataModel";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: Id<"todos">) => Promise<void>;
  onDelete: (id: Id<"todos">) => Promise<void>;
  onEdit: (id: Id<"todos">, text: string) => Promise<void>;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.todoEmpty}>
        <Text style={styles.emptyText}>Список завдань порожній. Додайте нове завдання вище!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item: any) => item._id || item.id}
      renderItem={({ item }: { item: any }) => {
        const actualId = item._id || item.id;

        return (
          <TodoItem
            todo={item}
            onToggle={async () => {
              if (actualId) await onToggle(actualId);
            }}
            onDelete={async () => {
              if (actualId) await onDelete(actualId);
            }}
            onEdit={async (text: string) => {
              if (actualId) await onEdit(actualId, text);
            }}
          />
        );
      }}
      contentContainerStyle={styles.todoList}
    />
  );
}

const styles = StyleSheet.create({
  todoEmpty: {
    paddingVertical: 36,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
  todoList: {
    flexDirection: "column",
    gap: 8,
  }
});
