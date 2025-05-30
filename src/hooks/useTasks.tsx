import { useState } from "react";
import type { Task, Tag } from "../components/types/taskTypes";
import { v4 as uuidv4 } from "uuid";

const initialTasks = [
  {
    id: uuidv4(),
    title: "Finish portfolio website",
    description: "Complete the homepage and contact form.",
    tag: {
      label: "Fitness",
      value: "Project",
      color: "#A89DFF",
    },
    date: new Date("2025-06-01"),
    startTime: "09:00",
    endTime: "11:00",
    repeat: "None",
  },
  {
    id: uuidv4(),
    title: "Buy groceries",
    description: "Milk, eggs, bread, and veggies.",
    tag: {
      label: "Fitness",
      value: "Project",
      color: "#A89DFF",
    },
    date: new Date("2025-06-01"),
    startTime: "17:00",
    endTime: "18:00",
    repeat: "Weekly",
  },
  {
    id: uuidv4(),
    title: "Gym session",
    description: "Leg day workout: squats, lunges, deadlifts.",
    tag: {
      label: "Fitness",
      value: "Project",
      color: "#A89DFF",
    },
    date: new Date("2025-06-02"),
    startTime: "07:30",
    endTime: "08:30",
    repeat: "Mon/Wed/Fri",
  },
];

const initialTags = [
  {
    label: "Project",
    value: "Project",
    color: "#A89DFF",
  },
  {
    label: "Learning",
    value: "Learning",
    color: "#60A5FA",
  },
  {
    label: "Meeting",
    value: "Meeting",
    color: "#10B981",
  },
  {
    label: "Fitness",
    value: "Fitness",
    color: "#22D3EE",
  },
];

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
