import type { TimeOption } from "../components/tasks/taskForm";
import { TIME_INTERVAL } from "../hooks/taskCardControl/constants";
import type { Task } from "../types/taskTypes";
import { isSameDate } from "./dateUtils";
import {
  convertHHMMToMinutes,
  convertMinutesToHHMM,
  minutesToTimeAMPM,
  timeAMPMToMinutes,
} from "./timeUtils";

export function filterOutPreviewTask(tasks: Task[], id: string) {
  return tasks.filter((task) => task.id !== id);
}

export function getEndTimesAfterStart(
  filterTime: string,
  times: { label: string; value: string }[],
  date: Date,
  tasks: Task[],
  id: string
) {
  let found = false;

  const filterTimeMinutes = timeAMPMToMinutes(filterTime);
  const nextTaskTime = getClosestNextTaskTime(filterTimeMinutes, date, tasks, id);
  const endTimeLimit = nextTaskTime && convertHHMMToMinutes(nextTaskTime?.startTime);
  const result = times.filter((option) => {
    const timeMinutes = convertHHMMToMinutes(option.value);
    if (endTimeLimit && timeMinutes > endTimeLimit) {
      return false;
    }
    if (found) return true;
    if (filterTimeMinutes < timeMinutes) {
      found = true;
      return true;
    }
    return false;
  });

  return result;
}

function getClosestNextTaskTime(time: number, date: Date, tasks: Task[], id: string) {
  const filteredTasks = tasks.filter(
    (task) => task.id !== id && isSameDate(task.date, date)
  );
  let closestTask: { id: string; difference: number } | null = null;

  for (let i = 0; i < filteredTasks.length; i++) {
    const taskTime = convertHHMMToMinutes(filteredTasks[i].startTime);
    const difference = Math.abs(taskTime - time);
    const closestNextTask =
      closestTask === null || (difference < closestTask.difference && taskTime > time);
    if (closestNextTask) {
      if (taskTime > time) closestTask = { id: filteredTasks[i].id, difference };
    }
  }
  return closestTask && tasks.find((task) => task.id === closestTask?.id);
}

export function filterArrayByDateAndTime(date: Date, tasks: Task[]) {
  const filteredTasks = getTasksByDate(date, tasks);
  return filteredTasks.sort(
    (a, b) => convertHHMMToMinutes(a.startTime) - convertHHMMToMinutes(b.startTime)
  );
}

export function getAllTimeOptions(
  date: Date,
  tasks: Task[],
  type: "start" | "end",
  startTime?: string,
  endTime?: string
) {
  const selectedStartMinutes = startTime ? convertHHMMToMinutes(startTime) : undefined;
  const selectedEndMinutes = endTime ? convertHHMMToMinutes(endTime) : undefined;
  const END_MINUTES = 1440;
  const orderedTasks = filterArrayByDateAndTime(date, tasks);
  let currentTime = 0;
  let availableTimes: TimeOption[] = [];

  for (let i = 0; i < orderedTasks.length + 1; i++) {
    const task = orderedTasks[i];
    const compareStartMinutes = task && convertHHMMToMinutes(task.startTime);
    const compareEndMinutes = task && convertHHMMToMinutes(task.endTime);
    const boundary = i < orderedTasks.length ? compareEndMinutes : END_MINUTES;

    while (type === "start" ? currentTime < boundary : currentTime <= boundary) {
      const label = minutesToTimeAMPM(currentTime);
      const value = convertMinutesToHHMM(currentTime);

      const endTimeReachedTask = type === "end" && currentTime >= compareStartMinutes;
      const startTimeReachedTask =
        currentTime >= compareStartMinutes && type !== "end" && !task.preview;
      const inSelectedTimeFrame =
        selectedStartMinutes != undefined &&
        selectedEndMinutes != undefined &&
        currentTime > selectedStartMinutes &&
        currentTime < selectedEndMinutes;

      if (endTimeReachedTask) {
        availableTimes.push({ label: label, value: value });
        break;
      } else if (inSelectedTimeFrame) {
        availableTimes.push({ label: label, value: value, highlight: true });
      } else if (startTimeReachedTask) {
        availableTimes.push({ label: label, value: value, isDisabled: true });
      } else {
        availableTimes.push({ label: label, value: value });
      }
      currentTime += TIME_INTERVAL;
    }
    if (i > orderedTasks.length - 1) break;

    const newTime = convertHHMMToMinutes(orderedTasks[i].endTime);
    currentTime = type === "start" ? newTime : newTime + TIME_INTERVAL;
  }

  return availableTimes;
}

export function getTasksByDate(date: Date, tasks: Task[]) {
  return tasks.filter((task) => isSameDate(task.date, date));
}

export function getAdjustedEndTime(
  time: string,
  timeSlots: { label: string; value: string }[],
  startTime: { label: string; value: string } | null,
  endTime: { label: string; value: string } | null
) {
  if (endTime && startTime) {
    const startMinutes = timeAMPMToMinutes(startTime.label);
    const newStartMinutes = timeAMPMToMinutes(time);
    const endMinutes = timeAMPMToMinutes(endTime.label);

    if (newStartMinutes >= endMinutes) {
      const difference = Math.abs(startMinutes - endMinutes);
      let numberOfHops = Math.floor(difference / TIME_INTERVAL - 1);
      if (numberOfHops >= timeSlots.length) {
        numberOfHops = timeSlots.length - 1;
      }

      return timeSlots[numberOfHops];
    }
    return null;
  }
}

export function checkStartTimeJumpPrevTask(
  date: Date,
  tasks: Task[],
  id: string,
  startTime: string
) {
  const orderedTasks = filterArrayByDateAndTime(date, tasks);
  const indexOfPrev = orderedTasks.findIndex((task) => task.id === id) - 1;
  if (indexOfPrev < 0) return false;
  const prevTaskStartMinutes = convertHHMMToMinutes(orderedTasks[indexOfPrev].startTime);
  const newStartMinutes = convertHHMMToMinutes(startTime);
  return prevTaskStartMinutes > newStartMinutes ? true : false;
}

export function checkTaskExist(taskId: string, tasks: Task[]) {
  return tasks?.find((task) => task.id === taskId);
}
