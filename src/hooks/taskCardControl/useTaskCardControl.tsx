import type { Task } from "../../types/taskTypes";
import { useTasksContext } from "../../context/taskContext";
import { convertHHMMToMinutes } from "../../utils/timeUtils";
import { isSameDate, setDayOfDate } from "../../utils/dateUtils";
import {
  calculateLength,
  calculateStartingPosition,
  convertLengthToMinutes,
  convertLengthToTime,
  getLengthFromTask,
  getPostionFromTask,
} from "../../utils/timelineUtils";
import { useEffect, useRef } from "react";
import { splitTimeHHMM } from "../../utils/timeUtils";
import { checkSpace, findAllSpaces, findClosestSpace } from "./dayChangeUtils";
import { applyResize, checkNextTaskStartTime } from "./resizeUtils";
import {
  collisionCheck,
  findSpaceBetweenTasks,
  getSnappedTimesFromCollision,
} from "./collisionUtils";
import { BUFFER, TIME_INTERVAL } from "./constants";
import { findCenterBetweenTimes } from "./previewUtils";
import type { MoveByTime, MoveParams } from "./types";
export type UseTaskCardControlProps = {
  task: Task;
  hasDraggedRef: ReturnType<typeof useRef<boolean>>;
  setTaskLength: React.Dispatch<React.SetStateAction<number>>;
  setTaskPosition: React.Dispatch<React.SetStateAction<number>>;
  taskRef: ReturnType<typeof useRef<HTMLDivElement | null>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
};

export function useTaskCardControl({
  task,
  hasDraggedRef,
  setTaskLength,
  setTaskPosition,
  taskRef,
  timelineRef,
}: UseTaskCardControlProps) {
  const {
    draftTasks,
    draftAction,
    saveTasks,
    handleSetPreviewTask,
    editDraftTask,
    deleteDraftTasks,
    handleDraftAction,
    editIsDragging,
  } = useTasksContext();
  const { tasks } = useTasksContext();
  const timeLine = timelineRef.current;
  let previewTaskRef = useRef<Task | null>(null);
  let currentTaskRef = useRef<Task>(task);
  let currentTasksRef = useRef<Task[]>(draftTasks ? draftTasks : []);
  let isDragging = false;
  const timelineHeight = 1680;
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

  function handleCancel() {
    const prevTask = tasks.find((taskA) => taskA.id === currentTaskRef.current.id);
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
    deleteDraftTasks();
    handleDraftAction(null);
  }

  function onMouseDown(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>,
    type: "resize" | "move"
  ) {
    e.stopPropagation();
    let difference = 0;
    isDragging = true;
    editIsDragging(true);
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

      const mouseCurrentY = event.pageY;
      difference = mouseCurrentY - mousePrevY;

      const selectedIndex = sortedTasks.findIndex((t) => t.id === task.id);
      const mouseStartTime = convertLengthToTime(difference, startHours, startMinutes);
      const cardLength = calculateLength(startHours, startMinutes, endHours, endMinutes);
      const newLength = cardLength + difference;
      const differenceMinutes = convertLengthToMinutes(difference);

      if (type === "move") handleMoveType();
      if (type === "resize") handleResizeType();

      function handleMoveType() {
        const movementNotWithinInterval =
          type === "move" && differenceMinutes % TIME_INTERVAL !== 0;

        if (movementNotWithinInterval) return;
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
          handleCollided(direction, currentTask, cardLength, mouseStartTime, event.pageY);
        } else {
          handleMove({ currentTask, difference, startPosition });
          handleSetPreviewTask(null);
          previewTaskRef.current = null;
        }
      }

      function handleResizeType() {
        const resizeNotWithinInterval =
          type === "resize" && differenceMinutes % TIME_INTERVAL !== 0;

        if (resizeNotWithinInterval) return;
        handleResize(newLength, currentTask, startPosition);
      }
    }

    function onMouseUp() {
      isDragging = false;
      editIsDragging(false);
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

  function handleResize(newLength: number, currentTask: Task, startPosition: number) {
    const nextTaskTime = checkNextTaskStartTime(
      currentTask,
      draftTasks ? draftTasks : []
    );
    const hasDraggedEnough = newLength > 3;
    const hasReachedNextTask =
      nextTaskTime !== null && startPosition + newLength > nextTaskTime;
    const overflowTimeLine = startPosition + newLength >= timelineHeight;
    const validHeightAndSpace =
      taskRef.current && newLength > 5.83 && startPosition + newLength < timelineHeight;
    let height: number | null = null;

    if (nextTaskTime) {
      if (hasDraggedEnough) hasDraggedRef.current = true;
    }
    if (hasReachedNextTask) {
      height = nextTaskTime - startPosition + 1;
    } else if (overflowTimeLine) {
      height = timelineHeight - startPosition;
    } else if (validHeightAndSpace) {
      height = newLength;
    }

    if (height) {
      applyResize(
        height,
        startHours,
        startMinutes,
        currentTask,
        editDraftTask,
        setTaskLength
      );
    }
  }

  function handleMove(params: MoveParams) {
    let startTime;
    let endTime;
    let position;
    const setTimesPassed = "setStartTime" in params && "setEndTime" in params;

    if (setTimesPassed) {
      const { setStartTime, setEndTime } = params as MoveByTime;
      startTime = setStartTime;
      endTime = setEndTime;
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      position = calculateStartingPosition(startHours, startMinutes);
    } else {
      startTime = convertLengthToTime(params.difference, startHours, startMinutes);
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

    setTaskPosition(position);
    editDraftTask(newTask);
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
    if (newTimes) {
      const mouseLocation = convertHHMMToMinutes(mouseStartTime);
      const newLocation = convertHHMMToMinutes(newTimes?.startTime);
      const mousePassedNextTask =
        direction === "next" && mouseLocation > newLocation - BUFFER;
      const mousePassedPrevTask =
        direction === "prev" && mouseLocation < newLocation + BUFFER;

      if (mousePassedNextTask) {
        handleMove({
          currentTask,
          setStartTime: newTimes.startTime,
          setEndTime: newTimes.endTime,
        });
        handleSetPreviewTask(null);
      } else if (mousePassedPrevTask) {
        handleMove({
          currentTask,
          setStartTime: newTimes.startTime,
          setEndTime: newTimes.endTime,
        });
        handleSetPreviewTask(null);
      }
    }
  }

  function handleSetPreview(
    mousePosition: number,
    direction: string,
    currentTask: Task,
    times: { startTime: string; endTime: string }
  ) {
    const timelineRect = timeLine?.getBoundingClientRect();
    const scrollTop = timeLine?.scrollTop ?? 0;
    const absoluteY = (mousePosition ?? 0) - (timelineRect?.top ?? 0) - 115 + scrollTop;
    const currTaskStartPoint =
      direction === "next" ? currentTask.endTime : currentTask.startTime;
    timelineRef.current && timelineRef.current.getBoundingClientRect();
    const centerPoint = findCenterBetweenTimes(
      direction === "next" ? times?.startTime : times?.endTime,
      currTaskStartPoint
    );
    const mouseCloserToNextLocation =
      (direction === "next" && absoluteY > centerPoint) ||
      (direction === "prev" && absoluteY < centerPoint);

    if (mouseCloserToNextLocation) {
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

  function handleChangeDay(direction: "prev" | "next") {
    let currentTask = { ...currentTaskRef.current };
    currentTask.date = setDayOfDate(currentTask.date, direction, 1);

    const tasksArray = currentTasksRef.current.map((task) => {
      return task.id === currentTask.id ? currentTask : task;
    });
    const sortedTaskIncludingCurrent = getSortedTasks(currentTask.date, tasksArray);
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

  function getSortedTasks(date: Date, tasks: Task[]) {
    return [...tasks]
      .sort((t1, t2) => {
        return convertHHMMToMinutes(t1.startTime) - convertHHMMToMinutes(t2.startTime);
      })
      .filter((t) => isSameDate(t.date, date));
  }

  return { onMouseDown, handleChangeDay };
}
