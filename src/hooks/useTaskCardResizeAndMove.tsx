import type { Task } from "../types/taskTypes";
import { useTasksContext } from "../context/taskContext";
import {
  convertHHMMToMinutes,
  convertLengthToMinutes,
  convertMinutesToHHMM,
  isSameDate,
} from "../utils/dateUtils";
import {
  calculateLength,
  calculateStartingPosition,
  convertLengthToTime,
  convertPixelsToMinutes,
  getHoursAndMinutes,
} from "../utils/timelineUtils";
import { useEffect, useMemo, useRef } from "react";
import { getTimeDifferenceInMinutes } from "../utils/timeUtils";
import throttle from "lodash.throttle";

export type UseTaskCardResizeAndMoveProps = {
  task: Task;
  hasDraggedRef: ReturnType<typeof useRef<boolean>>;
  setTaskLength: React.Dispatch<React.SetStateAction<number>>;
  setTaskPosition: React.Dispatch<React.SetStateAction<number>>;
  taskRef: ReturnType<typeof useRef<HTMLDivElement | null>>;
};

export function useTaskCardResizeAndMove({
  task,
  hasDraggedRef,
  setTaskLength,
  setTaskPosition,
  taskRef,
}: UseTaskCardResizeAndMoveProps) {
  const TIMELINE_START = "00:00";
  const TIMELINE_END = "24:00";
  const { tasks, editTask } = useTasksContext();
  let currentTaskRef = useRef(task);
  let isDragging = false;
  let animationFrameId: number | null = null;
  const timelineHeight = 1680;
  const sortedTasks = useMemo(() => {
    return [...tasks]
      .sort((t1, t2) => {
        return (
          convertHHMMToMinutes(t1.startTime) -
          convertHHMMToMinutes(t2.startTime)
        );
      })
      .filter((t) => isSameDate(t.date, task.date));
  }, [tasks, task.date]);
  const selectedIndex = sortedTasks.findIndex((t) => t.id === task.id);

  useEffect(() => {
    currentTaskRef.current = task;
  }, [task]);

  function onMouseDown(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>,
    type: "resize" | "move"
  ) {
    e.stopPropagation();
    let difference = 0;
    let taskHopDifference = 0;
    isDragging = true;
    hasDraggedRef.current = false;
    const mousePrevY = e.pageY;
    const [initialStartHours, initialStartMinutes] = task.startTime
      .split(":")
      .map(Number);
    const startPosition = calculateStartingPosition(
      initialStartHours,
      initialStartMinutes
    );
    const findSpaceBetweenTasksThrottled = throttle(findSpaceBetweenTasks, 150);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    let currentTask = currentTaskRef.current;
    const [startHours, startMinutes] = currentTask.startTime
      .split(":")
      .map(Number);
    const [hoursEnd, minutesEnd] = currentTask.endTime.split(":").map(Number);

    function onMouseMove(event: MouseEvent) {
      currentTask = currentTaskRef.current;
      const mouseCurrentY = event.pageY;
      difference = mouseCurrentY - mousePrevY + taskHopDifference;

      const nextTaskTime = checkNextTaskStartTime(currentTask);
      let cardLength = calculateLength(
        startHours,
        startMinutes,
        hoursEnd,
        minutesEnd
      );
      const newLength = cardLength + difference;

      if (type === "move") {
        const { hasCollided, setStart, setEnd, direction } = collisionCheck(
          selectedIndex,
          sortedTasks,
          difference
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

          findSpaceBetweenTasksThrottled(
            direction as "next" | "prev",
            currentTask,
            cardLength
          );

          handleMove(newTime.startTime, newTime.endTime);
        } else {
          handleMove();
        }
      }

      if (type === "resize") {
        if (newLength > 3) hasDraggedRef.current = true;
        if (
          nextTaskTime !== undefined &&
          startPosition + newLength > nextTaskTime
        ) {
          handleResize(nextTaskTime - startPosition + 1);
        } else if (startPosition + newLength >= timelineHeight) {
          handleResize(timelineHeight - startPosition);
        } else if (
          taskRef.current &&
          newLength > 5.83 &&
          startPosition + newLength < timelineHeight
        ) {
          handleResize(newLength);
        }
      }
    }

    function onMouseUp() {
      isDragging = false;
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 1);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    }

    function getSnappedTimesFromCollision(
      taskA: Task,
      taskBTime: string,
      type: "next" | "prev"
    ) {
      const duration = getTimeDifferenceInMinutes(
        taskA.startTime,
        taskA.endTime
      );
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

    function getCurrentTaskIndex(id: string) {
      return sortedTasks.findIndex((task) => task.id === id);
    }

    function collisionCheck(
      selectedTaskIndex: number,
      sortedTasks: Task[],
      difference: number
    ) {
      const currentTask = sortedTasks[selectedTaskIndex];
      const nextTask = sortedTasks[selectedTaskIndex + 1];
      const prevTask = sortedTasks[selectedTaskIndex - 1];
      const differenceMinutes = convertPixelsToMinutes(difference);
      const currentEnd =
        convertHHMMToMinutes(currentTask.endTime) + differenceMinutes;
      const currentStart =
        convertHHMMToMinutes(currentTask.startTime) + differenceMinutes;
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

    function handleMove(setStartTime?: string, setEndTime?: string) {
      let startTime;
      let endTime;
      let position;

      if (setStartTime && setEndTime) {
        startTime = setStartTime;
        endTime = setEndTime;
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        position = calculateStartingPosition(startHours, startMinutes);
      } else {
        startTime = convertLengthToTime(difference, startHours, startMinutes);
        position = Math.floor(startPosition) + difference;
        endTime = convertLengthToTime(difference, hoursEnd, minutesEnd);
      }

      const newTask: Task = {
        ...currentTask,
        startTime: startTime,
        endTime: endTime,
      };

      animationFrameId = requestAnimationFrame(() => {
        currentTaskRef.current = newTask;
        editTask(newTask);
        setTaskPosition(position);
        animationFrameId = null;
      });
    }

    function calculateLengthBetweenTasks(timeA: string, timeB: string) {
      const taskAMinutes = convertHHMMToMinutes(timeA);
      const taskBMinutes = convertHHMMToMinutes(timeB);
      const differenceMinutes = Math.abs(taskAMinutes - taskBMinutes);
      const conversion = 70 / 60;

      return Math.round(differenceMinutes * conversion);
    }

    function findSpaceBetweenTasks(
      direction: "next" | "prev",
      currentTask: Task,
      currentTaskHeight: number
    ) {
      const taskIndex = getCurrentTaskIndex(currentTask.id);
      const AT_TASK_END = sortedTasks.length - 2;
      const AT_TASK_START = 1;
      const step = direction === "next" ? 1 : -1;
      const isWithinBounds = (i: number) =>
        direction === "next" ? i < sortedTasks.length - 1 : i > 0;

      for (let i = taskIndex; isWithinBounds(i); i += step) {
        const taskA = sortedTasks[i + step];
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
          direction === "next" ? taskA.endTime : taskB,
          direction === "next" ? taskB : taskA.startTime
        );

        if (spaceBetweenTasks > currentTaskHeight) {
          console.log("yes");
          break;
        }
      }
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

    function handleResize(height: number) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      const newEndTime = calculateResize(height);
      const newTask: Task = { ...task, endTime: newEndTime };

      animationFrameId = requestAnimationFrame(() => {
        editTask(newTask);
        setTaskLength(height);
        animationFrameId = null;
      });
    }

    function checkNextTaskStartTime(task: Task) {
      const tasksPastCurrent = tasks
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
  return { onMouseDown };
}
