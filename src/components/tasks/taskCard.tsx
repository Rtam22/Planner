import type { Task } from "../../types/taskTypes";
import "./taskCard.css";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import {
  convertHHMMToMinutes,
  convertTimeString24To12,
  isSameDate,
} from "../../utils/dateUtils";
import { useContext, useEffect, useRef, useState } from "react";
import { useTasksContext } from "../../context/taskContext";

type calendarTaskCardProps = {
  title: string;
  onClick: (taskId: string) => void;
  task: Task;
};

function TaskCard({ title, onClick, task }: calendarTaskCardProps) {
  const { tasks, editTask } = useTasksContext();
  const taskRef = useRef<HTMLDivElement | null>(null);
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);
  const startPosition = calculateStartingPosition(startHours, startMinutes);
  const timelineHeight = 1680;
  const startTime = convertTimeString24To12(task.startTime);
  const endTime = convertTimeString24To12(task.endTime);
  let timeoutId: ReturnType<typeof setTimeout>;
  let cardLength = calculateLength(
    startHours,
    startMinutes,
    endHours,
    endMinutes
  );
  const [taskLength, setTaskLength] = useState<number>(cardLength);
  let isDragging = false;
  if (startPosition + cardLength > timelineHeight)
    cardLength = timelineHeight - startPosition;

  function handleClick() {
    onClick(task.id);
  }

  useEffect(() => {
    setTaskLength(cardLength);
  }, [task]);

  function setTimeFromLength(height: number) {
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
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (task.endTime !== newEndTime) {
        editTask(newTask);
        setTaskLength(height);
      }
    }, 1);
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
          convertHHMMToMinutes(a.startTime) - convertHHMMToMinutes(b.startTime)
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

  function onMouseDown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    isDragging = true;
    const mousePrevY = e.pageY;
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    function onMouseMove(event: MouseEvent) {
      if (!isDragging) return;
      const mouseCurrentY = event.pageY;
      const difference = mouseCurrentY - mousePrevY;
      const newLength = cardLength + difference;
      const nextTaskTime = checkNextTaskStartTime(task);

      if (
        nextTaskTime !== undefined &&
        startPosition + newLength > nextTaskTime
      ) {
        console.log("height");
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

    function onMouseUp() {
      isDragging = false;
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    }
  }

  return (
    <div
      ref={taskRef}
      data-testid="calendar-task-card"
      onClick={handleClick}
      className="calendar-task-card"
      style={{
        top: startPosition,
        height: `${taskLength}px`,
        backgroundColor: task.tag?.color,
      }}
    >
      <h3>{title}</h3>
      <p>{`${startTime} - ${endTime}`}</p>
      <button
        className="btn-resize"
        onMouseDown={onMouseDown}
        onClick={(e) => e.stopPropagation()}
      ></button>
    </div>
  );
}

export default TaskCard;
