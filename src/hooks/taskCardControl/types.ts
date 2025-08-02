import type { Task } from "../../types/taskTypes";

export type MoveByTask = {
  currentTask: Task;
  difference: number;
  startPosition: number;
  type?: "date" | null;
  setStartTime?: never;
  setEndTime?: never;
};

export type MoveByTime = {
  currentTask: Task;
  setStartTime: string;
  setEndTime: string;
  type?: "date" | null;
  startPosition?: never;
  difference?: never;
};

export type MoveParams = MoveByTask | MoveByTime;
