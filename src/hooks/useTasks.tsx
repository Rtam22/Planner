import { useState } from "react";
import type { Task, Tag } from "../components/types/taskTypes";
import { initialTags, initialTasks } from "../data/taskData";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  function addTask(newTask: Task) {
    setTasks([...tasks, newTask]);
  }

  function removeTask() {}

  function editTask() {}

  return { tasks, addTask, removeTask, editTask, tags };
}
