import { createContext, useContext, useState } from "react";
import type { Task, Tag } from "../types/taskTypes";
import { initialTags, initialTasks } from "../data/taskData";
import useLocalStorage from "../hooks/useLocalStorage";
import { convertArrayDateStringToDate } from "../utils/dateUtils";

type TasksContextType = {
  tasks: Task[];
  tags: Tag[];
  draftTasks: Task[] | null;
  previewTask: Task | null;
  draftAction: "save" | "cancel" | null;
  addTask: (selectedTask: Task) => void;
  addDraftTask: (selectedTask: Task) => void;
  deleteTask: (selectedTask: Task) => void;
  editTask: (selectedTask: Task) => void;
  addTag: () => void;
  handleSetPreviewTask: (task: Task | null) => void;
  enableEditMode: () => void;
  editDraftTask: (task: Task) => void;
  commitDraftTasks: () => void;
  deleteDraftTasks: () => void;
  handleDraftAction: (action: "save" | "cancel" | null) => void;
  saveTasks: (tasks: Task[]) => void;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>({
    key: "tasks",
    initialValue: initialTasks,
    reviver: convertArrayDateStringToDate,
  });
  const [draftAction, setDraftAction] = useState<"save" | "cancel" | null>(null);
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

  function saveTasks(tasks: Task[]) {
    setTasks([...tasks]);
  }

  function handleSetPreviewTask(task: Task | null) {
    setPreviewTask(task);
  }

  function addTag() {
    setTags([...tags]);
  }

  function enableEditMode() {
    setDraftTasks([...tasks]);
  }

  function addDraftTask(selectedTask: Task) {
    if (draftTasks) setDraftTasks([...draftTasks, selectedTask]);
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
      saveTasks(draftTasks);
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
        addDraftTask,
        deleteTask,
        editTask,
        addTag,
        handleSetPreviewTask,
        enableEditMode,
        editDraftTask,
        commitDraftTasks,
        deleteDraftTasks,
        handleDraftAction,
        saveTasks,
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
