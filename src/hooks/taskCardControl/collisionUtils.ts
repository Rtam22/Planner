import type { Task } from "../../types/taskTypes";
import {
  calculateLengthBetweenTasks,
  convertPixelsToMinutes,
  getSortedTasks,
} from "../../utils/timelineUtils";
import {
  convertHHMMToMinutes,
  convertMinutesToHHMM,
  getTimeDifferenceInMinutes,
} from "../../utils/timeUtils";
import { TIMELINE_END, TIMELINE_START } from "./constants";

export function findSpaceBetweenTasks(
  direction: "next" | "prev",
  currentTask: Task,
  tasks: Task[],
  currentTaskHeight: number
) {
  let sortedTasks = getSortedTasks(currentTask.date, tasks);
  let taskIndex = sortedTasks.findIndex((t) => t.id === currentTask.id);
  const AT_TASK_END = sortedTasks.length - 2;
  const AT_TASK_START = 1;
  const step = direction === "next" ? 1 : -1;
  const isWithinBounds = (i: number) =>
    direction === "next" ? i < sortedTasks.length - 1 : i > 0;

  for (let i = taskIndex; isWithinBounds(i); i += step) {
    let taskA =
      direction === "next"
        ? sortedTasks[i + step].endTime
        : sortedTasks[i + step].startTime;
    let taskB: string;
    if (i === AT_TASK_START && direction === "prev") {
      taskB = TIMELINE_START;
    } else if (i === AT_TASK_END && direction === "next") {
      taskB = TIMELINE_END;
    } else {
      taskB =
        direction === "next"
          ? sortedTasks[i + step + step].startTime
          : sortedTasks[i + step + step].endTime;
    }
    const spaceBetweenTasks = calculateLengthBetweenTasks(
      direction === "next" ? taskA : taskB,
      direction === "next" ? taskB : taskA
    );
    if (spaceBetweenTasks >= currentTaskHeight) {
      return calculateNewTimes(direction, currentTask, sortedTasks[i + step]);
    }
  }
}

function calculateNewTimes(
  direction: "next" | "prev",
  currentTask: Task,
  secondaryTask: Task
) {
  const differenceMinutes = getTimeDifferenceInMinutes(
    currentTask.startTime,
    currentTask.endTime
  );

  if (direction === "next") {
    const startMinutes = convertHHMMToMinutes(secondaryTask.endTime);
    return {
      startTime: secondaryTask.endTime,
      endTime: convertMinutesToHHMM(startMinutes + differenceMinutes),
    };
  } else {
    const endMinutes = convertHHMMToMinutes(secondaryTask.startTime);
    return {
      startTime: convertMinutesToHHMM(endMinutes - differenceMinutes),
      endTime: secondaryTask.startTime,
    };
  }
}

export function collisionCheck(
  selectedTaskIndex: number,
  sortedTasks: Task[],
  difference: number,
  task: Task
) {
  const nextTask = sortedTasks[selectedTaskIndex + 1];
  const prevTask = sortedTasks[selectedTaskIndex - 1];
  const differenceMinutes = convertPixelsToMinutes(difference);
  const currentEnd = convertHHMMToMinutes(task.endTime) + differenceMinutes;
  const currentStart = convertHHMMToMinutes(task.startTime) + differenceMinutes;
  const nextStart = convertHHMMToMinutes(nextTask ? nextTask.startTime : TIMELINE_END);

  const prevEnd = convertHHMMToMinutes(prevTask ? prevTask.endTime : TIMELINE_START);

  if (currentEnd > nextStart) {
    return {
      hasCollided: true,
      setStart: nextTask?.startTime ?? TIMELINE_END,
      setEnd: nextTask?.endTime ?? TIMELINE_END,
      direction: "next",
    };
  } else if (currentStart < prevEnd) {
    return {
      hasCollided: true,
      setStart: prevTask?.startTime ?? TIMELINE_START,
      setEnd: prevTask?.endTime ?? TIMELINE_START,
      direction: "prev",
    };
  }
  return {
    check: false,
  };
}

export function getSnappedTimesFromCollision(
  taskA: Task,
  taskBTime: string,
  type: "next" | "prev"
) {
  const duration = getTimeDifferenceInMinutes(taskA.startTime, taskA.endTime);
  if (type === "next") {
    const selectedTaskEndInMinutes = convertHHMMToMinutes(taskBTime);
    const newStartTimeInMinutes = selectedTaskEndInMinutes - duration;
    return convertMinutesToHHMM(newStartTimeInMinutes);
  }
  if (type === "prev") {
    const startMinutes = convertHHMMToMinutes(taskBTime);
    const newEndMinutes = startMinutes + duration;
    return convertMinutesToHHMM(newEndMinutes);
  }
}

export function getCollisionTime(
  hasCollided: boolean,
  direction: string,
  currentTask: Task,
  setStart: string,
  setEnd: string
) {
  let collidedTimes = null;
  if (hasCollided) {
    const start =
      direction === "next"
        ? getSnappedTimesFromCollision(currentTask, setStart, "next")
        : setEnd;
    const end =
      direction === "prev"
        ? getSnappedTimesFromCollision(currentTask, setEnd, "prev")
        : setStart;
    if (start && end) collidedTimes = { startTime: start, endTime: end };
  }
  return collidedTimes;
}
