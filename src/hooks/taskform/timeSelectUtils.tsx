import { parseYYYYMMDDToDate } from "../../utils/dateUtils";
import {
  filterOutPreviewTask,
  getAllTimeOptions,
  getEndTimesAfterStart,
} from "./taskFormUtils";
import type { Task } from "../../types/taskTypes";
import type { TimeOption } from "../../components/tasks/taskForm";

export function getStartTimeOptionsAll(
  tasks: Task[],
  date: string,
  currentTaskID?: string,
  startTime?: { label: string; value: string },
  endTime?: { label: string; value: string },
  draftTasks?: Task[]
) {
  const source = draftTasks
    ? draftTasks
    : currentTaskID
    ? tasks.filter((task) => task.id !== currentTaskID)
    : tasks;
  return getAllTimeOptions(
    parseYYYYMMDDToDate(date),
    source,
    "start",
    startTime?.value,
    endTime?.value
  );
}

export function getEndTimeOptionsAll(
  tasks: Task[],
  date: string,
  currentTaskID: string,
  preview: boolean,
  draftTasks?: Task[],
  isDragging: boolean = false
) {
  const filteredTasks = tasks.filter((task) => task.id !== currentTaskID);
  const source = preview
    ? draftTasks
      ? filterOutPreviewTask(draftTasks, currentTaskID)
      : filterOutPreviewTask(tasks, currentTaskID)
    : filteredTasks;
  if (!isDragging) {
    return getAllTimeOptions(parseYYYYMMDDToDate(date), source, "end");
  }
  return [];
}

export function getEndTimeOptions(
  tasks: Task[],
  date: string,
  currentTaskID: string,
  startTime: { label: string; value: string } = { label: "12:00am", value: "12:00" },
  endTimeOptionsAll: TimeOption[],
  draftTasks?: Task[] | null
) {
  const filteredTasks = currentTaskID
    ? tasks.filter((task) => task.id !== currentTaskID)
    : tasks;
  return getEndTimesAfterStart(
    startTime.label,
    endTimeOptionsAll,
    parseYYYYMMDDToDate(date),
    draftTasks ? draftTasks : filteredTasks,
    currentTaskID
  );
}
