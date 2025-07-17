import type { Task } from "../../types/taskTypes";

export type MoveByTask = {
  currentTask: Task;
  difference: number;
  startPosition: number;
  setStartTime?: never;
  setEndTime?: never;
};

export type MoveByTime = {
  currentTask: Task;
  setStartTime: string;
  setEndTime: string;
  startPosition?: never;
  difference?: never;
};

export type MoveParams = MoveByTask | MoveByTime;
