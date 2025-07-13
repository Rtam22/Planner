import { createContext, useContext, useState } from "react";
import type { Task, Tag } from "../types/taskTypes";
import { initialTags, initialTasks } from "../data/taskData";

type TasksContextType = {
  tasks: Task[];
  tags: Tag[];
  draftTasks: Task[] | null;
  previewTask: Task | null;
  draftAction: "save" | "cancel" | null;
  addTask: (selectedTask: Task) => void;
  deleteTask: (selectedTask: Task) => void;
  editTask: (selectedTask: Task) => void;
  addTag: () => void;
  handleSetPreviewTask: (task: Task | null) => void;
  createDraftTasks: () => void;
  editDraftTask: (task: Task) => void;
  commitDraftTasks: () => void;
  deleteDraftTasks: () => void;
  handleDraftAction: (action: "save" | "cancel" | null) => void;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draftAction, setDraftAction] = useState<"save" | "cancel" | null>(
    null
  );
  const [draftTasks, setDraftTasks] = useState<Task[] | null>(null);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  function addTask(selectedTask: Task) {
    setTasks([...tasks, selectedTask]);
  }

  function deleteTask(selectedTask: Task) {
    setTasks(tasks.filter((task) => task.id !== selectedTask.id));
  }

  function handleDraftAction(action: "save" | "cancel" | null) {
    setDraftAction(action);
  }

  function editTask(selectedTask: Task) {
    setTasks(
      tasks.map((task) => {
        return task.id === selectedTask.id ? selectedTask : task;
      })
    );
  }

  function handleSetPreviewTask(task: Task | null) {
    setPreviewTask(task);
  }

  function addTag() {
    setTags([...tags]);
  }

  function createDraftTasks() {
    setDraftTasks([...tasks]);
  }

  function editDraftTask(selectedTask: Task) {
    if (draftTasks) {
      setDraftTasks(
        draftTasks.map((task) => {
          return task.id === selectedTask.id ? selectedTask : task;
        })
      );
    }
  }

  function commitDraftTasks() {
    if (draftTasks) {
      setDraftTasks(draftTasks);
    }
    deleteDraftTasks();
  }

  function deleteDraftTasks() {
    setDraftTasks(null);
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        tags,
        previewTask,
        draftTasks,
        draftAction,
        addTask,
        deleteTask,
        editTask,
        addTag,
        handleSetPreviewTask,
        createDraftTasks,
        editDraftTask,
        commitDraftTasks,
        deleteDraftTasks,
        handleDraftAction,
      }}
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
