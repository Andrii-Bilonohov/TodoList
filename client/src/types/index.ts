import { Id } from "convex/_generated/dataModel";

export interface Todo {
  id: Id<"todos">;
  text: string;
  completed: boolean;
  createdAt?: number;
}
