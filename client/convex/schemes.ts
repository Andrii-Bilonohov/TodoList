import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    todos: defineTable({
        id: v.id("todos"),
        text: v.string(),
        isCompleted: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_creation_time", ["createdAt"])
        .index("by_completion", ["isCompleted"]),
});