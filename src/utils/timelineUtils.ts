import type { Task } from "../types/taskTypes";

export function calculateLength(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number
) {
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }
  const pixelsPerMinute = 70 / 60;
  return (endTotalMinutes - startTotalMinutes) * pixelsPerMinute;
}

export function calculateStartingPosition(
  startHours: number,
  startMinutes: number
) {
  const pixelsPerMinute = 70 / 60;
  const startingPosition = startHours * 70 + startMinutes * pixelsPerMinute;
  return startingPosition;
}

export function convertLengthToTime(
  difference: number,
  hours: number,
  minutes: number
) {
  const time = difference / 70;
  const hoursDiff = Math.floor(time);
  const minutesDiff = Math.round((time - hoursDiff) * 60);

  const totalMinutes = minutes + minutesDiff;
  const extraHours = Math.floor(totalMinutes / 60);
  const normalizedMinutes = totalMinutes % 60;

  const totalHours = hours + hoursDiff + extraHours;

  return `${String(totalHours).padStart(2, "0")}:${String(
    normalizedMinutes
  ).padStart(2, "0")}`;
}

export function getHoursAndMinutes(task: Task) {
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);
  return { startHours, startMinutes, endHours, endMinutes };
}

export function convertPixelsToMinutes(pixels: number) {
  return Math.round((pixels * 60) / 70);
}

export function adjustColor(hex: string, amount: number = 30): string {
  let color = hex.replace("#", "");

  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(color, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function convertLengthToMinutes(lengthPx: number): number {
  const pixelsPerMinute = 70 / 60;
  return Math.round(lengthPx / pixelsPerMinute);
}

export function convertMinutesToLength(minutes: number): number {
  const pixelsPerMinute = 70 / 60;
  return Math.round(Math.abs(minutes) * pixelsPerMinute);
}
