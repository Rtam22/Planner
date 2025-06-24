import type { Task } from "../types/taskTypes";
import { useTasksContext } from "../context/taskContext";
import { convertHHMMToMinutes, isSameDate } from "../utils/dateUtils";
import { calculateStartingPosition } from "../utils/timelineUtils";
import type { useRef } from "react";

export type UseTaskCardResizeAndMoveProps = {
  startHours: number;
  startMinutes: number;
  task: Task;
  hasDraggedRef: ReturnType<typeof useRef<boolean>>;
  setTaskLength: React.Dispatch<React.SetStateAction<number>>;
  cardLength: number;
  startPosition: number;
  taskRef: ReturnType<typeof useRef<HTMLDivElement | null>>;
};

export function useTaskCardResizeAndMove({
  startHours,
  startMinutes,
  task,
  hasDraggedRef,
  setTaskLength,
  cardLength,
  startPosition,
  taskRef,
}: UseTaskCardResizeAndMoveProps) {
  const { tasks, editTask } = useTasksContext();
  let isDragging = false;
  let animationFrameId: number | null = null;
  const timelineHeight = 1680;

  function onMouseDown(
    e: React.MouseEvent<HTMLButtonElement>,
    type: "resize" | "move"
  ) {
    e.stopPropagation();
    isDragging = true;
    hasDraggedRef.current = false;
    const mousePrevY = e.pageY;
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    function onMouseMove(event: MouseEvent) {
      const mouseCurrentY = event.pageY;
      const difference = mouseCurrentY - mousePrevY;
      const newLength = cardLength + difference;
      const nextTaskTime = checkNextTaskStartTime(task);

      if (type === "resize") {
        if (newLength > 3) hasDraggedRef.current = true;
        if (
          nextTaskTime !== undefined &&
          startPosition + newLength > nextTaskTime
        ) {
          setTimeFromLength(nextTaskTime - startPosition + 1);
        } else if (startPosition + newLength >= timelineHeight) {
          setTimeFromLength(timelineHeight - startPosition);
        } else if (
          taskRef.current &&
          newLength > 5.83 &&
          startPosition + newLength < timelineHeight
        ) {
          setTimeFromLength(newLength);
        }
      }
      if (type === "move") {
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

    function setTimeFromLength(height: number) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      const pixelsPerMinute = 70 / 60;
      const durationMinutes = Math.floor(height / pixelsPerMinute);

      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = startTotalMinutes + durationMinutes;

      const hours24 = Math.floor(endTotalMinutes / 60);
      const minutes = endTotalMinutes % 60;

      const newEndTime = `${String(hours24).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
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
