import { createContext, useContext, useState } from "react";
import type { Task, Tag } from "../types/taskTypes";
import { initialTags, initialTasks } from "../data/taskData";

type TasksContextType = {
  tasks: Task[];
  tags: Tag[];
  addTask: (selectedTask: Task) => void;
  deleteTask: (selectedTask: Task) => void;
  editTask: (selectedTask: Task) => void;
  addTag: () => void;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  function addTask(selectedTask: Task) {
    setTasks([...tasks, selectedTask]);
  }

  function deleteTask(selectedTask: Task) {
    setTasks(tasks.filter((task) => task.id !== selectedTask.id));
  }

  function editTask(selectedTask: Task) {
    setTasks(
      tasks.map((task) => {
        return task.id === selectedTask.id ? selectedTask : task;
      })
    );
  }

  function addTag() {
    setTags([...tags]);
  }

  return (
    <TasksContext.Provider
      value={{ tasks, tags, addTask, deleteTask, editTask, addTag }}
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
