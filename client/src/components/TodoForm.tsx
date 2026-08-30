import React, { useState } from "react";
import { TextInput, Pressable, Text, View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !text.trim() || loading || isSubmitting;

  return (
    <View style={styles.todoForm}>
      <TextInput
        style={[
          styles.todoInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.todoInputBackground,
            color: colors.mainText,
          },
        ]}
        placeholder="Що потрібно зробити?"
        placeholderTextColor={colors.placeholderText}
        value={text}
        onChangeText={setText}
        editable={!loading && !isSubmitting}
        maxLength={120}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <Pressable
        style={[
          styles.todoAddBtn,
          {
            backgroundColor: colors.buttonBackground,
            shadowColor: colors.buttonBackground,
          },
          isDisabled && styles.todoAddBtnDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isDisabled}
      >
        <Text style={[styles.todoAddBtnText, { color: colors.white }]}>
          {isSubmitting ? "Додаємо..." : "Додати"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  todoForm: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  todoInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  todoAddBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  todoAddBtnDisabled: {
    opacity: 0.5,
  },
  todoAddBtnText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
