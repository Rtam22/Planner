import type { Task } from "../../types/taskTypes";
import "./taskCard.css";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import { convertTimeString24To12 } from "../../utils/dateUtils";
import { useContext, useRef, useState } from "react";
import { useTasksContext } from "../../context/taskContext";

type calendarTaskCardProps = {
  title: string;
  onClick: (taskId: string) => void;
  task: Task;
};

function TaskCard({ title, onClick, task }: calendarTaskCardProps) {
  const { editTask } = useTasksContext();
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
  const [taskEndTime, setTaskEndTime] = useState<number>(cardLength);

  let isDragging = false;
  if (startPosition + cardLength > timelineHeight)
    cardLength = timelineHeight - startPosition;

  function handleClick() {
    onClick(task.id);
  }

  function setTimeFromLength(height: number) {
    const pixelsPerMinute = 70 / 60;
    const totalMinutes = Math.floor(height / pixelsPerMinute);
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const newEndTime = `${startHours + hours24}:${String(minutes).padStart(
      2,
      "0"
    )}`;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (task.endTime !== newEndTime) {
        editTask({ ...task, endTime: newEndTime });
      }
    }, 0.5);
    setTaskEndTime(height);
  }

  function onMouseDown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    isDragging = true;
    const mousePrevY = e.pageY;
    let mouseCurrentY;
    let mouseCurrentX;
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    function onMouseMove(event: MouseEvent) {
      if (!isDragging) return;
      mouseCurrentY = event.pageY;
      mouseCurrentX = event.pageX;
      const difference = mouseCurrentY - mousePrevY;
      const newLength = cardLength + difference;
      if (taskRef.current && newLength > 5.83 * 3) {
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
        height: `${taskEndTime}px`,
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
