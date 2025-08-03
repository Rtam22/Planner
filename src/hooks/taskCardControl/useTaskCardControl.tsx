import type { Task } from "../../types/taskTypes";
import { useTasksContext } from "../../context/taskContext";
import { convert24To12HourTime, convertHHMMToMinutes } from "../../utils/timeUtils";
import { setDayOfDate } from "../../utils/dateUtils";
import {
  calculateLength,
  calculateStartingPosition,
  convertLengthToMinutes,
  convertLengthToTime,
  getLengthFromTask,
  getPostionFromTask,
  getSortedTasks,
} from "../../utils/timelineUtils";
import { useEffect, useRef } from "react";
import { splitTimeHHMM } from "../../utils/timeUtils";
import { calculateChangeDateTimes } from "./dayChangeUtils";
import { applyResize, checkNextTaskStartTime } from "./resizeUtils";
import {
  collisionCheck,
  findSpaceBetweenTasks,
  getCollisionTime,
} from "./collisionUtils";
import { BUFFER, TIME_INTERVAL } from "./constants";
import { findCenterBetweenTimes } from "./previewUtils";
import type { MoveByTime, MoveParams } from "./types";
export type UseTaskCardControlProps = {
  task: Task;
  hasDraggedRef: ReturnType<typeof useRef<boolean>>;
  setTaskLength: React.Dispatch<React.SetStateAction<number>>;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  setTaskPosition: React.Dispatch<React.SetStateAction<number>>;
  taskRef: ReturnType<typeof useRef<HTMLDivElement | null>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
};

export function useTaskCardControl({
  task,
  hasDraggedRef,
  setTaskLength,
  setTaskPosition,
  setStartTime,
  setEndTime,
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
    } else if (draftAction === "save" || draftAction === "saveTimeline") {
      handleSave(draftAction);
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

  function handleSave(type: "save" | "saveTimeline") {
    if (!draftTasks) return;
    if (type === "save") {
      saveTasks(draftTasks);
    } else if (type === "saveTimeline") {
      saveTasks(draftTasks?.filter((task) => task.preview === false));
    }
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
      if (!isDragging) return;
      currentTask = currentTaskRef.current;
      const mouseCurrentY = event.pageY;
      difference = mouseCurrentY - mousePrevY;
      const cardLength = calculateLength(startHours, startMinutes, endHours, endMinutes);
      const newLength = cardLength + difference;
      const differenceMinutes = convertLengthToMinutes(difference);
      const movementNotWithinInterval =
        type === "move" && differenceMinutes % TIME_INTERVAL !== 0;
      const sortedTasks = getSortedTasks(
        currentTaskRef.current.date,
        currentTasksRef.current
      );
      const selectedIndex = sortedTasks.findIndex((t) => t.id === task.id);

      if (movementNotWithinInterval) return;
      const { hasCollided, setStart, setEnd, direction } = collisionCheck(
        selectedIndex,
        sortedTasks,
        difference,
        task
      );
      const collidedTimes = hasCollided
        ? getCollisionTime(hasCollided, direction, currentTask, setStart, setEnd)
        : null;

      if (type === "move")
        handleMoveType(
          collidedTimes,
          direction,
          currentTask,
          difference,
          cardLength,
          startPosition,
          event.pageY
        );
      if (type === "resize")
        handleResizeType(differenceMinutes, newLength, type, currentTask, startPosition);
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
      editDraftTask(currentTaskRef.current);
      setTimeout(() => {
        handleSetPreviewTask(null);
        previewTaskRef.current = null;
        hasDraggedRef.current = false;
      }, 50);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    }
  }

  function handleResizeType(
    differenceMinutes: number,
    newLength: number,
    type: string,
    currentTask: Task,
    startPosition: number
  ) {
    const resizeNotWithinInterval =
      type === "resize" && differenceMinutes % TIME_INTERVAL !== 0;

    if (resizeNotWithinInterval) return;
    handleResize(newLength, currentTask, startPosition);
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
      height = Math.round(nextTaskTime) - startPosition;
    } else if (overflowTimeLine) {
      height = timelineHeight - startPosition;
    } else if (validHeightAndSpace) {
      height = newLength;
    }

    if (height && currentTaskRef?.current) {
      applyResize(
        height,
        startHours,
        startMinutes,
        currentTask,
        currentTaskRef,
        setTaskLength,
        setEndTime
      );
    }
  }

  function handleMoveType(
    collidedTimes: {
      startTime: string;
      endTime: string;
    } | null,
    direction: string | undefined,
    currentTask: Task,
    difference: number,
    cardLength: number,
    startPosition: number,
    mouseY: number
  ) {
    if (collidedTimes && direction) {
      if (!collidedTimes?.startTime || !collidedTimes?.endTime) return;
      handleMove({
        currentTask,
        setStartTime: collidedTimes.startTime,
        setEndTime: collidedTimes.endTime,
      });
      const mouseStartTime = convertLengthToTime(difference, startHours, startMinutes);
      handleCollided(direction, currentTask, cardLength, mouseStartTime, mouseY);
    } else {
      handleMove({ currentTask, difference, startPosition });
      handleSetPreviewTask(null);
      previewTaskRef.current = null;
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

    if (params.type === "date") {
      editDraftTask(newTask);
    }
    setTaskPosition(position);
    setStartTime(convert24To12HourTime(newTask.startTime));
    setEndTime(convert24To12HourTime(newTask.endTime));
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
    const newTimes = calculateChangeDateTimes(currentTask, currentTasksRef.current);
    if (newTimes) {
      handleMove({
        currentTask,
        setStartTime: newTimes.startTime,
        setEndTime: newTimes.endTime,
        type: "date",
      });
    }
  }

  return { onMouseDown, handleChangeDay };
}
