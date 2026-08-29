import type { Todo } from "@/types";
import { TodoItem } from "./TodoItem";
import {
  Text,
  View,
  StyleSheet,
  FlatList
} from "react-native";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
        contentContainerStyle={styles.todoList}
      />
    );
}

const styles = StyleSheet.create({
    todoEmpty: {
       textAlign: "center",
       paddingVertical: 36,
       paddingHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "#94a3b8",
    },
    todoList: {
        flexDirection: "column",
        gap: 8,
    }
})
