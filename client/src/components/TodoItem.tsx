import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (
    id: string,
    completed: boolean
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (
    id: string,
    text: string
  ) => Promise<void>;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [editText, setEditText] =
    useState(todo.text);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();

    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    if (trimmed !== todo.text) {
      try {
        setIsUpdating(true);
        await onEdit(todo.id, trimmed);
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <View
      style={[
        styles.todoItem,
        todo.completed &&
          styles.todoItemCompleted,
        isUpdating &&
          styles.todoItemUpdating,
      ]}
    >
      <Pressable
        style={[
          styles.checkboxContainer,
          isUpdating &&
            styles.disabled,
        ]}
        onPress={() =>
          onToggle(
            todo.id,
            !todo.completed
          )
        }
        disabled={isUpdating}
      >
        <View
          style={[
            styles.checkmark,
            todo.completed &&
              styles.checkmarkCompleted,
          ]}
        >
          {todo.completed && (
            <Text style={styles.checkmarkText}>
              ✓
            </Text>
          )}
        </View>
      </Pressable>

      {isEditing ? (
        <TextInput
          style={styles.todoEditInput}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSave}
          autoFocus
          maxLength={120}
          editable={!isUpdating}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
      ) : (
        <Pressable
          style={styles.todoTextContainer}
          onLongPress={() =>
            setIsEditing(true)
          }
          disabled={isUpdating}
        >
          <Text
            style={[
              styles.todoText,
              todo.completed &&
                styles.todoTextCompleted,
            ]}
          >
            {todo.text}
          </Text>
        </Pressable>
      )}

      <View style={styles.todoActions}>
        {!isEditing && (
          <Pressable
            style={styles.actionBtn}
            onPress={() =>
              setIsEditing(true)
            }
            disabled={isUpdating}
          >
            <Text style={styles.actionText}>
              ✏️
            </Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.actionBtn,
            styles.deleteBtn,
          ]}
          onPress={() =>
            onDelete(todo.id)
          }
          disabled={isUpdating}
        >
          <Text style={styles.actionText}>
            🗑️
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  todoItemCompleted: {
    backgroundColor: "#f8fafc",
  },
  todoItemUpdating: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.6,
  },
  checkboxContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 6,
  },
  checkmarkCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  checkmarkText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: "#1e293b",
  },
  todoTextCompleted: {
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  todoEditInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#6366f1",
    borderRadius: 6,
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    opacity: 0.85,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "transparent",
  },
  actionText: {
    fontSize: 15,
  },
});
