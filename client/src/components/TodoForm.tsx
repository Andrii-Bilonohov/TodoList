import { useState } from "react";
import {
  TextInput,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({
  onAdd,
  loading,
}: TodoFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

  const isDisabled =
    !text.trim() ||
    loading ||
    isSubmitting;

  return (
    <View style={styles.todoForm}>
      <TextInput
        style={styles.todoInput}
        placeholder="Що потрібно зробити?"
        placeholderTextColor="#94a3b8"
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
          isDisabled &&
            styles.todoAddBtnDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isDisabled}
      >
        <Text style={styles.todoAddBtnText}>
          {isSubmitting
            ? "Додаємо..."
            : "Додати"}
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
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    color: "#1e293b",
  },
  todoAddBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    borderRadius: 10,
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  todoAddBtnDisabled: {
    opacity: 0.5,
  },
  todoAddBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});