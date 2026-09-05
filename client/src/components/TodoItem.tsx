import React, { useState } from "react";
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  onEdit: (text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const isTodoCompleted = (todo as any).isCompleted || todo.completed;

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
        await onEdit(trimmed);
      } catch (e) {
        console.error(e);
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <View style={[styles.todoItem, { backgroundColor: colors.todoInputBackground || colors.cardBackground, borderColor: colors.border }, isUpdating && styles.todoItemUpdating]}>

      <Pressable
        style={[styles.checkboxContainer, isUpdating && styles.disabled]}
        onPress={onToggle}
        disabled={isUpdating}
      >
        <View style={[styles.checkmark, { backgroundColor: colors.cardBackground, borderColor: colors.placeholderText }, isTodoCompleted && { backgroundColor: colors.green || "#10b981", borderColor: colors.green || "#10b981" }]}>
          {isTodoCompleted && <Text style={[styles.checkmarkText, { color: colors.white }]}>✓</Text>}
        </View>
      </Pressable>

      {isEditing ? (
        <TextInput
          style={[styles.todoEditInput, { color: colors.mainText, backgroundColor: colors.cardBackground, borderColor: colors.buttonBackground }]}
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
          onLongPress={() => setIsEditing(true)}
          disabled={isUpdating}
        >
          <Text style={[styles.todoText, { color: colors.mainText }, isTodoCompleted && [styles.todoTextCompleted, { color: colors.colorCompleted || colors.subText }]]}>
            {todo.text}
          </Text>
        </Pressable>
      )}

      <View style={styles.todoActions}>
        {!isEditing && (
          <Pressable style={styles.actionBtn} onPress={() => setIsEditing(true)} disabled={isUpdating}>
            <Text style={styles.actionText}>✏️</Text>
          </Pressable>
        )}

        <Pressable style={styles.actionBtn} onPress={onDelete} disabled={isUpdating}>
          <Text style={styles.actionText}>🗑️</Text>
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
    borderRadius: 10,
    borderWidth: 1,
    gap: 12
  },
  todoItemUpdating: {
    opacity: 0.6
  },
  disabled: {
    opacity: 0.6
  },
  checkboxContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  checkmark: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 6
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: "700"
  },
  todoTextContainer: {
    flex: 1
  },
  todoText: {
    fontSize: 16
  },
  todoTextCompleted: {
    textDecorationLine: "line-through"
  },
  todoEditInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 6,
    borderWidth: 1.5
  },
  todoActions: {
    flexDirection: "row",
    gap: 12
  },
  actionBtn: {
    padding: 4
  },
  actionText: {
    fontSize: 16
  }
});
