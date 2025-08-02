import type { Task } from "../../types/taskTypes";
import { isSameDate } from "../../utils/dateUtils";
import {
  convertLengthToMinutes,
  convertMinutesToLength,
} from "../../utils/timelineUtils";
import { convertHHMMToMinutes, convertMinutesToHHMM } from "../../utils/timeUtils";
import { TIMELINE_END, TIMELINE_START } from "./constants";

type TimeSpot = {
  startMinutes: number;
  endMinutes: number;
};

type ClosestSpaceProps = {
  index: number;
  distance: number;
  placement: "top" | "bottom";
};

export function getSortedTasks(date: Date, tasks: Task[]) {
  return [...tasks]
    .sort((t1, t2) => {
      return convertHHMMToMinutes(t1.startTime) - convertHHMMToMinutes(t2.startTime);
    })
    .filter((t) => isSameDate(t.date, date));
}

export function calculateChangeDateTimes(currentTask: Task, tasks: Task[]) {
  const tasksArray = tasks.map((task) => {
    return task.id === currentTask.id ? currentTask : task;
  });
  const sortedTaskIncludingCurrent = getSortedTasks(currentTask.date, tasksArray);
  const taskIndex = sortedTaskIncludingCurrent.findIndex((t) => currentTask.id === t.id);
  const sortedTasks = sortedTaskIncludingCurrent.filter(
    (taskB) => currentTask.id !== taskB.id
  );
  const hasSpace = checkSpace(sortedTaskIncludingCurrent, taskIndex);
  if (hasSpace) {
    return {
      startTime: currentTask.startTime,
      endTime: currentTask.endTime,
    };
  }
  const availableSpaces = findAllSpaces(sortedTasks);
  return findClosestSpace(availableSpaces, currentTask);
}

function checkSpace(tasks: Task[], taskIndex: number) {
  const prevTask = tasks[taskIndex - 1];
  const currentTask = tasks[taskIndex];
  const nextTask = tasks[taskIndex + 1];
  const spaceStartMinutes = convertHHMMToMinutes(
    prevTask ? prevTask.endTime : TIMELINE_START
  );
  const spaceEndMinutes = convertHHMMToMinutes(
    nextTask ? nextTask.startTime : TIMELINE_END
  );
  const taskStartMinutes = convertHHMMToMinutes(currentTask.startTime);
  const taskEndMinutes = convertHHMMToMinutes(currentTask.endTime);
  if (spaceStartMinutes <= taskStartMinutes && spaceEndMinutes >= taskEndMinutes) {
    return true;
  } else {
    return false;
  }
}

export function calculateSpace(startTime: string, endTime: string) {
  const startMinutes = convertHHMMToMinutes(startTime);
  const endMinutes = convertHHMMToMinutes(endTime);
  return {
    startMinutes,
    endMinutes,
  };
}

export function findAllSpaces(tasks: Task[]) {
  let timeSpots: TimeSpot[] = [];
  for (let i = 0; i < tasks.length + 1; i++) {
    let startMinutesCurrent = i === tasks.length ? TIMELINE_END : tasks[i].startTime;
    let endMinutesPrev = i === 0 ? TIMELINE_START : tasks[i - 1].endTime;
    const times = calculateSpace(endMinutesPrev, startMinutesCurrent);
    timeSpots.push(times);
  }
  return timeSpots;
}

export function findClosestSpace(timeSpots: TimeSpot[], task: Task) {
  const currentStartMinutes = convertHHMMToMinutes(task.startTime);
  const currentEndMinutes = convertHHMMToMinutes(task.endTime);
  const cardLength = convertMinutesToLength(currentStartMinutes - currentEndMinutes);
  const cardMiddle = Math.floor(
    convertMinutesToLength(currentStartMinutes) + cardLength / 2
  );

  const validIndexes = getValidTimeSlots(timeSpots, cardLength);
  let closestSpace: ClosestSpaceProps | null = null;

  for (const i of validIndexes) {
    const space = timeSpots[i];
    const startDiff = Math.abs(convertMinutesToLength(space.startMinutes) - cardMiddle);
    const endDiff = Math.abs(convertMinutesToLength(space.endMinutes) - cardMiddle);

    const [placement, distance] =
      startDiff < endDiff ? ["top", startDiff] : ["bottom", endDiff];

    if (!closestSpace || distance < closestSpace.distance) {
      closestSpace = {
        index: i,
        distance: distance,
        placement: placement as "top" | "bottom",
      };
    }
  }

  if (closestSpace) {
    const { startMinutes, endMinutes } = timeSpots[closestSpace.index];
    const [finalStart, finalEnd] =
      closestSpace.placement === "top"
        ? [startMinutes, startMinutes + convertLengthToMinutes(cardLength)]
        : [endMinutes - convertLengthToMinutes(cardLength), endMinutes];

    return {
      startTime: convertMinutesToHHMM(finalStart),
      endTime: convertMinutesToHHMM(finalEnd),
    };
  } else {
    return null;
  }
}

export function getValidTimeSlots(timeSpots: TimeSpot[], length: number) {
  let index: number[] = [];
  for (let i = 0; i < timeSpots.length; i++) {
    const spaceLength = convertMinutesToLength(
      timeSpots[i].startMinutes - timeSpots[i].endMinutes
    );
    if (spaceLength >= length) {
      index.push(i);
    }
  }
  return index;
}
