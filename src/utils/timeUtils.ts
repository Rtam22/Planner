import type { Task } from "../types/taskTypes";
import { isSameDate } from "./dateUtils";
import { TIME_INTERVAL } from "../hooks/taskCardControl/constants";
// General utils

export function getTimeDifferenceInMinutes(start: string, end: string): number {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

export function splitTimeHHMM(task: Task) {
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);

  return [startHours, startMinutes, endHours, endMinutes];
}

export function convertHHMMToMinutes(time: string) {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function convertMinutesToHHMM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}`;
}

export function minutesToTimeAMPM(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? "pm" : "am";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const paddedMinutes = minutes.toString().padStart(2, "0");

  return `${hours12}:${paddedMinutes}${period}`;
}

export function timeAMPMToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) throw new Error("Invalid time format. Expected HH:MMam/pm");

  let [_, hoursStr, minutesStr, period] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (period.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (period.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

export function convert24To12HourTime(time: string): string {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const suffix = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute}${suffix}`;
}

// Task utils

export function getEndTimesAfterStart(
  filterTime: string,
  times: { label: string; value: string }[],
  date: Date,
  tasks: Task[]
) {
  let found = false;
  const filterTimeMinutes = timeAMPMToMinutes(filterTime);
  const nextTaskTime = getClosestNextTaskTime(filterTimeMinutes, date, tasks);
  const endTimeLimit = nextTaskTime && convertHHMMToMinutes(nextTaskTime?.startTime);
  const result = times.filter((option) => {
    const timeMinutes = timeAMPMToMinutes(option.label);

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

function getClosestNextTaskTime(time: number, date: Date, tasks: Task[]) {
  const filteredTasks = tasks.filter((task) => isSameDate(task.date, date));
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

export function getAllTimeOptions(date: Date, tasks: Task[], type: "start" | "end") {
  const END_MINUTES = 1440;
  const orderedTasks = filterArrayByDateAndTime(date, tasks);
  let currentTime = 0;
  let availableTimes = [];

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

      if (endTimeReachedTask) {
        availableTimes.push({ label: label, value: value });
        break;
      }
      if (startTimeReachedTask) {
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

export function getAvailableEndTimes(
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
      if (numberOfHops > timeSlots.length) numberOfHops = timeSlots.length - 1;
      return timeSlots[numberOfHops];
    }
    return null;
  }
}
