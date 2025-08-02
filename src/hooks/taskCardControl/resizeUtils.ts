import type { Task } from "../../types/taskTypes";
import { isSameDate } from "../../utils/dateUtils";
import { calculateStartingPosition } from "../../utils/timelineUtils";
import { convert24To12HourTime, convertHHMMToMinutes } from "../../utils/timeUtils";

export function applyResize(
  height: number,
  startHours: number,
  startMinutes: number,
  task: Task,
  currentTaskRef: React.RefObject<Task>,
  setTaskLength: (height: number) => void,
  setEndTime: (time: string) => void
) {
  const newEndTime = calculateResize(height, startHours, startMinutes);
  const newTask: Task = { ...task, endTime: newEndTime };
  currentTaskRef.current = newTask;
  setTaskLength(height);
  setEndTime(convert24To12HourTime(newTask.endTime));
}

export function calculateResize(
  height: number,
  startHours: number,
  startMinutes: number
) {
  const pixelsPerMinute = 70 / 60;
  const durationMinutes = Math.round(height / pixelsPerMinute);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = startTotalMinutes + durationMinutes;

  const hours24 = Math.floor(endTotalMinutes / 60);
  const minutes = endTotalMinutes % 60;

  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function checkNextTaskStartTime(task: Task, draftTasks: Task[]) {
  const tasksAfterSelected = draftTasks
    .filter((storedTask) => {
      if (
        isSameDate(task.date, storedTask.date) &&
        convertHHMMToMinutes(storedTask.startTime) >
          convertHHMMToMinutes(task.endTime) - 1
      )
        return task;
    })
    .sort(
      (a, b) => convertHHMMToMinutes(a.startTime) - convertHHMMToMinutes(b.startTime)
    );

  if (tasksAfterSelected.length > 0) {
    const [startHours, startMinutes] = tasksAfterSelected[0].startTime.split(":");
    return calculateStartingPosition(Number(startHours), Number(startMinutes));
  } else {
    return null;
  }
}
