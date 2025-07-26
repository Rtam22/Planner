import type { Task } from "../types/taskTypes";

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
  totalMinutes = totalMinutes % 1440;

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
