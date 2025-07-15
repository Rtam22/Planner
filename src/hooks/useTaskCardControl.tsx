import type { Task } from "../types/taskTypes";
import { useTasksContext } from "../context/taskContext";
import { convertHHMMToMinutes, convertMinutesToHHMM } from "../utils/timeUtils";
import { isSameDate, setDayOfDate } from "../utils/dateUtils";
import {
  calculateLength,
  calculateStartingPosition,
  convertLengthToTime,
  convertPixelsToMinutes,
  convertMinutesToLength,
  convertLengthToMinutes,
  getLengthFromTask,
  getPostionFromTask,
  calculateLengthBetweenTasks,
} from "../utils/timelineUtils";
import { useEffect, useRef } from "react";
import { getTimeDifferenceInMinutes, splitTimeHHMM } from "../utils/timeUtils";
import { throttle } from "lodash";
export type UseTaskCardControlProps = {
  task: Task;
  hasDraggedRef: ReturnType<typeof useRef<boolean>>;
  setTaskLength: React.Dispatch<React.SetStateAction<number>>;
  setTaskPosition: React.Dispatch<React.SetStateAction<number>>;
  taskRef: ReturnType<typeof useRef<HTMLDivElement | null>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
};

type TimeSpot = {
  startMinutes: number;
  endMinutes: number;
};

type ClosestSpaceProps = {
  index: number;
  distance: number;
  placement: "top" | "bottom";
};

type MoveByTask = {
  currentTask: Task;
  difference: number;
  startPosition: number;
  setStartTime?: never;
  setEndTime?: never;
};

type MoveByTime = {
  currentTask: Task;
  setStartTime: string;
  setEndTime: string;
  startPosition?: never;
  difference?: never;
};

type MoveParams = MoveByTask | MoveByTime;

export function useTaskCardControl({
  task,
  hasDraggedRef,
  setTaskLength,
  setTaskPosition,
  taskRef,
  timelineRef,
}: UseTaskCardControlProps) {
  const TIMELINE_START = "00:00";
  const TIMELINE_END = "24:00";
  const {
    draftTasks,
    draftAction,
    previewTask,
    saveTasks,
    handleSetPreviewTask,
    editDraftTask,
    deleteDraftTasks,
    handleDraftAction,
  } = useTasksContext();
  const { tasks } = useTasksContext();
  const timeLine = timelineRef.current;
  let previewTaskRef = useRef<Task | null>(null);
  let currentTaskRef = useRef<Task>(task);
  let currentTasksRef = useRef<Task[]>(draftTasks ? draftTasks : []);
  let isDragging = false;
  let animationFrameId: number | null = null;
  const timelineHeight = 1680;
  const buffer = 10;
  const [startHours, startMinutes, endHours, endMinutes] = splitTimeHHMM(
    currentTaskRef.current
  );

  useEffect(() => {
    currentTaskRef.current = task;
  }, [task]);

  useEffect(() => {
    currentTasksRef.current = draftTasks ? draftTasks : [];
  }, [draftTasks]);

  useEffect(() => {
    if (draftAction === "cancel") {
      handleCancel();
    } else if (draftAction === "save") {
      handleSave();
    }
  }, [draftAction]);

  function onMouseDown(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>,
    type: "resize" | "move"
  ) {
    e.stopPropagation();
    let difference = 0;
    isDragging = true;
    hasDraggedRef.current = false;
    const mousePrevY = e.pageY;
    let currentTask = currentTaskRef.current;
    const [initialStartHours, initialStartMinutes] = task.startTime
      .split(":")
      .map(Number);
    const startPosition = calculateStartingPosition(
      initialStartHours,
      initialStartMinutes
    );

    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    function onMouseMove(event: MouseEvent) {
      const sortedTasks = getSortedTasks(
        currentTaskRef.current.date,
        currentTasksRef.current
      );
      document.body.style.cursor = "grabbing";
      currentTask = currentTaskRef.current;
      //   const draggedEl = taskRef.current;
      const mouseCurrentY = event.pageY;
      difference = mouseCurrentY - mousePrevY;
      const selectedIndex = sortedTasks.findIndex((t) => t.id === task.id);
      const mouseStartTime = convertLengthToTime(
        difference,
        startHours,
        startMinutes
      );
      let cardLength = calculateLength(
        startHours,
        startMinutes,
        endHours,
        endMinutes
      );
      const newLength = cardLength + difference;

      if (type === "move") {
        const { hasCollided, setStart, setEnd, direction } = collisionCheck(
          selectedIndex,
          sortedTasks,
          difference,
          task
        );

        if (hasCollided) {
          const newTime = {
            startTime:
              direction === "next"
                ? getSnappedTimesFromCollision(currentTask, setStart, "next")
                : setEnd,
            endTime:
              direction === "prev"
                ? getSnappedTimesFromCollision(currentTask, setEnd, "prev")
                : setStart,
          };

          if (!newTime?.startTime || !newTime?.endTime) return;

          handleMove({
            currentTask,
            setStartTime: newTime.startTime,
            setEndTime: newTime.endTime,
          });

          handleCollided(
            direction,
            currentTask,
            cardLength,
            mouseStartTime,
            event.pageY
          );
        } else {
          handleMove({ currentTask, difference, startPosition });
          handleSetPreviewTask(null);
          previewTaskRef.current = null;
        }
      }

      if (type === "resize") {
        const nextTaskTime = checkNextTaskStartTime(currentTask);
        handleResize(newLength, nextTaskTime, startPosition);
      }
    }

    function onMouseUp() {
      isDragging = false;
      if (previewTaskRef.current) {
        const newStartTime = previewTaskRef.current.startTime;
        const newEndTime = previewTaskRef.current.endTime;
        handleMove({
          currentTask,
          setStartTime: newStartTime,
          setEndTime: newEndTime,
        });
      }

      setTimeout(() => {
        handleSetPreviewTask(null);
        previewTaskRef.current = null;
        hasDraggedRef.current = false;
      }, 50);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    }
  }

  function getSnappedTimesFromCollision(
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

  function findCenterBetweenTimes(timeA: string, timeB: string) {
    const minutesA = convertHHMMToMinutes(timeA);
    const minutesB = convertHHMMToMinutes(timeB);
    return convertMinutesToLength(Math.floor((minutesA + minutesB) / 2));
  }

  function handleSetPreview(
    mousePosition: number,
    direction: string,
    currentTask: Task,
    times: { startTime: string; endTime: string }
  ) {
    const timelineRect = timeLine?.getBoundingClientRect();
    const scrollTop = timeLine?.scrollTop ?? 0;
    const absoluteY =
      (mousePosition ?? 0) - (timelineRect?.top ?? 0) - 115 + scrollTop;
    const currTaskStartPoint =
      direction === "next" ? currentTask.endTime : currentTask.startTime;
    timelineRef.current && timelineRef.current.getBoundingClientRect();
    const centerPoint = findCenterBetweenTimes(
      direction === "next" ? times?.startTime : times?.endTime,
      currTaskStartPoint
    );
    if (
      (direction === "next" && absoluteY > centerPoint) ||
      (direction === "prev" && absoluteY < centerPoint)
    ) {
      const previewTask = {
        ...currentTask,
        startTime: times.startTime,
        endTime: times.endTime,
      };
      handleSetPreviewTask(previewTask);
      previewTaskRef.current = previewTask;
    } else {
      handleSetPreviewTask(null);
      previewTaskRef.current = null;
    }
  }

  function handleCollided(
    direction: string,
    currentTask: Task,
    cardLength: number,
    mouseStartTime: string,
    mousePosition: number
  ) {
    const newTimes = findSpaceBetweenTasks(
      direction as "next" | "prev",
      currentTask,
      currentTasksRef.current,
      cardLength
    );
    if (!newTimes) return;
    handleSetPreview(mousePosition, direction, currentTask, newTimes);
    console.log(previewTask);
    if (newTimes) {
      const mouseLocation = convertHHMMToMinutes(mouseStartTime);
      const newLocation = convertHHMMToMinutes(newTimes?.startTime);
      if (
        direction === "next" &&
        newTimes?.startTime &&
        mouseLocation > newLocation - buffer
      ) {
        handleMove({
          currentTask,
          setStartTime: newTimes.startTime,
          setEndTime: newTimes.endTime,
        });
        handleSetPreviewTask(null);
      } else if (
        direction === "prev" &&
        newTimes?.startTime &&
        mouseLocation < newLocation + buffer
      ) {
        handleMove({
          currentTask,
          setStartTime: newTimes.startTime,
          setEndTime: newTimes.endTime,
        });
        handleSetPreviewTask(null);
      }
    }
  }

  function collisionCheck(
    selectedTaskIndex: number,
    sortedTasks: Task[],
    difference: number,
    task: Task
  ) {
    const nextTask = sortedTasks[selectedTaskIndex + 1];
    const prevTask = sortedTasks[selectedTaskIndex - 1];
    const differenceMinutes = convertPixelsToMinutes(difference);
    const currentEnd = convertHHMMToMinutes(task.endTime) + differenceMinutes;
    const currentStart =
      convertHHMMToMinutes(task.startTime) + differenceMinutes;
    const nextStart = convertHHMMToMinutes(
      nextTask ? nextTask.startTime : TIMELINE_END
    );

    const prevEnd = convertHHMMToMinutes(
      prevTask ? prevTask.endTime : TIMELINE_START
    );

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

  function findSpaceBetweenTasks(
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

  function handleMove(params: MoveParams) {
    let startTime;
    let endTime;
    let position;
    if ("setStartTime" in params && "setEndTime" in params) {
      const { setStartTime, setEndTime } = params as MoveByTime;
      startTime = setStartTime;
      endTime = setEndTime;
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      position = calculateStartingPosition(startHours, startMinutes);
    } else {
      startTime = convertLengthToTime(
        params.difference,
        startHours,
        startMinutes
      );
      position = Math.floor(params.startPosition) + params.difference;
      endTime = convertLengthToTime(params.difference, endHours, endMinutes);
    }
    const newTask: Task = {
      ...params.currentTask,
      startTime: startTime,
      endTime: endTime,
    };

    currentTaskRef.current = newTask;
    currentTasksRef.current = currentTasksRef.current.map((t) =>
      t.id === newTask.id ? newTask : t
    );

    animationFrameId = requestAnimationFrame(() => {
      setTaskPosition(position);
      editDraftTask(newTask);
      animationFrameId = null;
    });
  }

  function handleResize(
    newLength: number,
    nextTaskTime: number | undefined,
    startPosition: number
  ) {
    if (newLength > 3) hasDraggedRef.current = true;
    if (
      nextTaskTime !== undefined &&
      startPosition + newLength > nextTaskTime
    ) {
      applyResize(nextTaskTime - startPosition + 1);
    } else if (startPosition + newLength >= timelineHeight) {
      applyResize(timelineHeight - startPosition);
    } else if (
      taskRef.current &&
      newLength > 5.83 &&
      startPosition + newLength < timelineHeight
    ) {
      applyResize(newLength);
    }
  }

  function applyResize(height: number) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    const newEndTime = calculateResize(height);
    const newTask: Task = { ...task, endTime: newEndTime };

    animationFrameId = requestAnimationFrame(() => {
      editDraftTask(newTask);
      setTaskLength(height);
      animationFrameId = null;
    });
  }

  function calculateResize(height: number) {
    const pixelsPerMinute = 70 / 60;
    const durationMinutes = Math.floor(height / pixelsPerMinute);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = startTotalMinutes + durationMinutes;

    const hours24 = Math.floor(endTotalMinutes / 60);
    const minutes = endTotalMinutes % 60;

    return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  function checkNextTaskStartTime(task: Task) {
    if (draftTasks) {
      const tasksPastCurrent = draftTasks
        .filter((storedTask) => {
          if (
            isSameDate(task.date, storedTask.date) &&
            convertHHMMToMinutes(storedTask.startTime) >
              convertHHMMToMinutes(task.endTime) - 1
          )
            return task;
        })
        .sort(
          (a, b) =>
            convertHHMMToMinutes(a.startTime) -
            convertHHMMToMinutes(b.startTime)
        );

      if (tasksPastCurrent.length > 0) {
        const [startHours, startMinutes] =
          tasksPastCurrent[0].startTime.split(":");
        return calculateStartingPosition(
          Number(startHours),
          Number(startMinutes)
        );
      }
    }
  }

  function handleChangeDay(direction: "prev" | "next") {
    let currentTask = { ...currentTaskRef.current };
    currentTask.date = setDayOfDate(currentTask.date, direction, 1);

    const tasksArray = currentTasksRef.current.map((task) => {
      return task.id === currentTask.id ? currentTask : task;
    });
    const sortedTaskIncludingCurrent = getSortedTasks(
      currentTask.date,
      tasksArray
    );
    const taskIndex = sortedTaskIncludingCurrent.findIndex(
      (t) => currentTask.id === t.id
    );
    const sortedTasks = sortedTaskIncludingCurrent.filter(
      (taskB) => task.id !== taskB.id
    );

    const hasSpace = checkSpace(sortedTaskIncludingCurrent, taskIndex);
    if (hasSpace) {
      handleMove({
        currentTask,
        setStartTime: currentTask.startTime,
        setEndTime: currentTask.endTime,
      });
      return;
    }

    const availableSpaces = findAllSpaces(sortedTasks);
    const newTimes = findClosestSpace(availableSpaces, currentTask);

    if (newTimes) {
      handleMove({
        currentTask,
        setStartTime: newTimes.startTime,
        setEndTime: newTimes.endTime,
      });
    }
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
    if (
      spaceStartMinutes <= taskStartMinutes &&
      spaceEndMinutes >= taskEndMinutes
    ) {
      return true;
    } else {
      return false;
    }
  }

  function calculateSpace(startTime: string, endTime: string) {
    const startMinutes = convertHHMMToMinutes(startTime);
    const endMinutes = convertHHMMToMinutes(endTime);
    return {
      startMinutes,
      endMinutes,
    };
  }

  function findAllSpaces(tasks: Task[]) {
    let timeSpots: TimeSpot[] = [];
    for (let i = 0; i < tasks.length + 1; i++) {
      let startMinutesCurrent =
        i === tasks.length ? TIMELINE_END : tasks[i].startTime;
      let endMinutesPrev = i === 0 ? TIMELINE_START : tasks[i - 1].endTime;
      const times = calculateSpace(endMinutesPrev, startMinutesCurrent);
      timeSpots.push(times);
    }
    return timeSpots;
  }

  function findClosestSpace(timeSpots: TimeSpot[], task: Task) {
    const currentStartMinutes = convertHHMMToMinutes(task.startTime);
    const currentEndMinutes = convertHHMMToMinutes(task.endTime);
    const cardLength = convertMinutesToLength(
      currentStartMinutes - currentEndMinutes
    );
    const cardMiddle = Math.floor(
      convertMinutesToLength(currentStartMinutes) + cardLength / 2
    );

    const validIndexes = getValidTimeSlots(timeSpots, cardLength);
    let closestSpace: ClosestSpaceProps | null = null;

    for (const i of validIndexes) {
      const space = timeSpots[i];
      const startDiff = Math.abs(
        convertMinutesToLength(space.startMinutes) - cardMiddle
      );
      const endDiff = Math.abs(
        convertMinutesToLength(space.endMinutes) - cardMiddle
      );

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

  function getValidTimeSlots(timeSpots: TimeSpot[], length: number) {
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

  function handleCancel() {
    const prevTask = tasks.find(
      (taskA) => taskA.id === currentTaskRef.current.id
    );
    if (!prevTask) return;
    const taskLength = getLengthFromTask(prevTask);
    const taskPosition = getPostionFromTask(prevTask);
    deleteDraftTasks();
    handleDraftAction(null);
    setTaskPosition(taskPosition);
    setTaskLength(taskLength);
  }

  function handleSave() {
    draftTasks && saveTasks(draftTasks);
    deleteDraftTasks;
    handleDraftAction(null);
  }

  function getSortedTasks(date: Date, tasks: Task[]) {
    return [...tasks]
      .sort((t1, t2) => {
        return (
          convertHHMMToMinutes(t1.startTime) -
          convertHHMMToMinutes(t2.startTime)
        );
      })
      .filter((t) => isSameDate(t.date, date));
  }

  return { onMouseDown, handleChangeDay };
}
