import { createContext, useContext, useState } from "react";
import type { Task, Tag } from "../components/types/taskTypes";
import { initialTags, initialTasks } from "../data/taskData";

type TasksContextType = {
  tasks: Task[];
  tags: Tag[];
  addTask: (newTask: Task) => void;
  removeTask: () => void;
  editTask: () => void;
  addTag: () => void;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  function addTask(newTask: Task) {
    setTasks([...tasks, newTask]);
  }

  function removeTask() {}

  function editTask() {}

  function addTag() {
    setTags([...tags]);
  }

  return (
    <TasksContext.Provider
      value={{ tasks, tags, addTask, removeTask, editTask, addTag }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}
