import { useState } from "react";
import type { Task } from "../components/types/taskTypes";
import { v4 as uuidv4 } from "uuid";

const initialTasks = [
  {
    id: uuidv4(),
    title: "Finish portfolio website",
    description: "Complete the homepage and contact form.",
    tag: "Work",
    date: new Date("2025-06-01"),
    startTime: "09:00",
    endTime: "11:00",
    repeat: "None",
  },
  {
    id: uuidv4(),
    title: "Buy groceries",
    description: "Milk, eggs, bread, and veggies.",
    tag: "Personal",
    date: new Date("2025-06-01"),
    startTime: "17:00",
    endTime: "18:00",
    repeat: "Weekly",
  },
  {
    id: uuidv4(),
    title: "Gym session",
    description: "Leg day workout: squats, lunges, deadlifts.",
    tag: "Health",
    date: new Date("2025-06-02"),
    startTime: "07:30",
    endTime: "08:30",
    repeat: "Mon/Wed/Fri",
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addTask(newTask: Task) {
    setTasks([...tasks, newTask]);
  }

  function removeTask() {}

  function editTask() {}

  return { tasks, addTask, removeTask, editTask };
}
