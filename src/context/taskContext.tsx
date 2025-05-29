import { Children, createContext, useContext } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../components/types/taskTypes";

const TasksContext = createContext<ReturnType<typeof useTasks> | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const taskHook = useTasks();
  return (
    <TasksContext.Provider value={taskHook}>{children}</TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}
