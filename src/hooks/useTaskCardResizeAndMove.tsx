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
  getHoursAndMinutes,
} from "../utils/timelineUtils";
import { useEffect, useRef } from "react";
import { getTimeDifferenceInMinutes } from "../utils/timeUtils";

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
  const { tasks, editTask } = useTasksContext();
  let currentTaskRef = useRef(task);
  let isDragging = false;
  let animationFrameId: number | null = null;
  const timelineHeight = 1680;
  const sortedTasks = tasks
    .sort((t1, t2) => {
      return (
        convertHHMMToMinutes(t1.startTime) - convertHHMMToMinutes(t2.startTime)
      );
    })
    .filter((t) => isSameDate(t.date, task.date));
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
      /*       const taskMinutes =
        convertHHMMToMinutes(currentTask.endTime) -
        convertHHMMToMinutes(currentTask.startTime);
        
 */

      const nextTaskTime = checkNextTaskStartTime(currentTask);
      let cardLength = calculateLength(
        startHours,
        startMinutes,
        hoursEnd,
        minutesEnd
      );
      const newLength = cardLength + difference;

      if (type === "move") {
        const { hasCollided, collidedStart, collidedEnd, direction } =
          collisionCheck(selectedIndex, sortedTasks, difference);
        // console.log(collidedTask?.endTime);
        if (hasCollided) {
          const newTime = {
            startTime:
              direction === "next"
                ? getSnappedTimesFromCollision(
                    currentTask,
                    collidedStart,
                    "next"
                  )
                : collidedEnd,
            endTime:
              direction === "prev"
                ? getSnappedTimesFromCollision(currentTask, collidedEnd, "prev")
                : collidedStart,
          };

          handleMove(newTime.startTime, newTime.endTime);
        } else {
          handleMove();
        }

        //  collisionCheck(currentTask, difference, cardLength);
      }

      if (type === "resize") {
        if (newLength > 3) hasDraggedRef.current = true;
        if (
          nextTaskTime !== undefined &&
          startPosition + newLength > nextTaskTime
        ) {
          setTimeFromLength(
            nextTaskTime - startPosition + 1,
            startHours,
            startMinutes
          );
        } else if (startPosition + newLength >= timelineHeight) {
          setTimeFromLength(
            timelineHeight - startPosition,
            startHours,
            startMinutes
          );
        } else if (
          taskRef.current &&
          newLength > 5.83 &&
          startPosition + newLength < timelineHeight
        ) {
          setTimeFromLength(newLength, startHours, startMinutes);
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

    function collisionCheck(
      selectedTaskIndex: number,
      sortedTasks: Task[],
      difference: number
    ) {
      const endOfTimeLine = {
        start: "00:00",
        end: "24:00",
      };
      const selectedTaskEndTime =
        convertHHMMToMinutes(sortedTasks[selectedTaskIndex].endTime) +
        difference;
      const selectedTaskStartTime =
        convertHHMMToMinutes(sortedTasks[selectedTaskIndex].startTime) +
        difference;
      const nextTaskStartTime = convertHHMMToMinutes(
        sortedTasks[selectedTaskIndex + 1]
          ? sortedTasks[selectedTaskIndex + 1].startTime
          : "24:00"
      );
      const prevTaskEndTime = convertHHMMToMinutes(
        sortedTasks[selectedIndex - 1]
          ? sortedTasks[selectedIndex - 1].endTime
          : "00:00"
      );

      console.log(selectedTaskEndTime + " " + nextTaskStartTime);

      if (selectedTaskEndTime > nextTaskStartTime) {
        return {
          hasCollided: true,
          collidedStart:
            sortedTasks[selectedTaskIndex + 1]?.startTime ?? endOfTimeLine.end,
          collidedEnd:
            sortedTasks[selectedTaskIndex + 1]?.endTime ?? endOfTimeLine.end,
          direction: "next",
        };
      } else if (selectedTaskStartTime < prevTaskEndTime) {
        return {
          hasCollided: true,
          collidedStart:
            sortedTasks[selectedTaskIndex - 1]?.startTime ??
            endOfTimeLine.start,
          collidedEnd:
            sortedTasks[selectedTaskIndex - 1]?.endTime ?? endOfTimeLine.start,
          direction: "prev",
        };
      }
      return {
        check: false,
      };
    }

    function handleMove(setStartTime?: string, setEndTime?: string) {
      let newStartTime;
      let newEndTime;
      let position;

      if (setStartTime && setEndTime) {
        newStartTime = setStartTime;
        newEndTime = setEndTime;
        const [startHours, startMinutes] = newStartTime.split(":").map(Number);
        position = calculateStartingPosition(startHours, startMinutes);
      } else {
        newStartTime = convertLengthToTime(
          difference,
          startHours,
          startMinutes
        );
        position = Math.floor(startPosition) + difference;
        newEndTime = convertLengthToTime(difference, hoursEnd, minutesEnd);
      }

      const newTask: Task = {
        ...currentTask,
        startTime: newStartTime,
        endTime: newEndTime,
      };

      animationFrameId = requestAnimationFrame(() => {
        currentTaskRef.current = newTask;
        editTask(newTask);
        setTaskPosition(position);
        animationFrameId = null;
      });
    }
    /* 
    function collisionCheck(
      currentTask: Task,
      difference: number,
      cardLength: number
    ) {
      //if (taskHopDifference > 100) return;
      const prevTaskValues = task;
      const differenceMinutes = convertLengthToMinutes(difference);
      const selectedTaskStartTime =
        convertHHMMToMinutes(prevTaskValues.startTime) + differenceMinutes;
      const selectedTaskEndTime =
        convertHHMMToMinutes(prevTaskValues.endTime) + differenceMinutes;
      const selectedTaskTotalTime = selectedTaskEndTime - selectedTaskStartTime;

      const selectedIndex = sortedTasks.findIndex(
        (t) => t.id === currentTask.id
      );

      // for (let i = selectedIndex + 1; i < sortedTasks.length; i++) {
      const taskStartTime = convertHHMMToMinutes(
        sortedTasks[selectedIndex + 1].startTime
      );
      const taskEndTime = convertHHMMToMinutes(
        sortedTasks[selectedIndex + 1].endTime
      );
      //  if (taskHopDifference > 100) break;
      console.log(selectedTaskEndTime + " " + taskStartTime);
      if (
        selectedTaskStartTime > taskStartTime &&
        selectedTaskStartTime < taskEndTime
      ) {
        const spaceBetweenTasks = sortedTasks[selectedIndex + 2]
          ? convertHHMMToMinutes(sortedTasks[selectedIndex + 2].startTime) -
            convertHHMMToMinutes(sortedTasks[selectedIndex + 1].endTime)
          : convertHHMMToMinutes("24:00") -
            convertHHMMToMinutes(sortedTasks[selectedIndex + 1].endTime);
        if (spaceBetweenTasks > selectedTaskTotalTime) {
          const newEndTime = convertMinutesToHHMM(
            convertHHMMToMinutes(sortedTasks[selectedIndex + 1].endTime) +
              selectedTaskTotalTime
          );
          const updatedTask = {
            ...currentTask,
            startingTime: sortedTasks[selectedIndex + 1].endTime,
            endTime: newEndTime,
          };
          const [startH, startM] =
            sortedTasks[selectedIndex + 1].endTime.split(":");
          const taskTimes = getHoursAndMinutes(sortedTasks[selectedIndex + 1]);
          taskHopDifference =
            calculateLength(
              taskTimes.startHours,
              taskTimes.startMinutes,
              taskTimes.endHours,
              taskTimes.endMinutes
            ) + cardLength;
          currentTask = updatedTask;
          editTask(updatedTask);
          setTaskPosition(
            calculateStartingPosition(Number(startH), Number(startM))
          );
        }
      }
      //  }
    }
 */
    function setTimeFromLength(
      height: number,
      startHours: number,
      startMinutes: number
    ) {
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
