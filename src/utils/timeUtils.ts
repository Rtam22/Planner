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
