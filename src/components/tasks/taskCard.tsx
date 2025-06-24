import type { Task } from "../../types/taskTypes";
import "./taskCard.css";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import { convertTimeString24To12 } from "../../utils/dateUtils";
import { useEffect, useRef, useState } from "react";
import { useTaskCardResizeAndMove } from "../../hooks/useTaskCardResizeAndMove";

type calendarTaskCardProps = {
  title: string;
  onClick: (taskId: string) => void;
  task: Task;
};

function TaskCard({ title, onClick, task }: calendarTaskCardProps) {
  // const { tasks, editTask } = useTasksContext();
  const taskRef = useRef<HTMLDivElement | null>(null);
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);
  const startPosition = calculateStartingPosition(startHours, startMinutes);
  const timelineHeight = 1680;
  const startTime = convertTimeString24To12(task.startTime);
  const endTime = convertTimeString24To12(task.endTime);
  let cardLength = calculateLength(
    startHours,
    startMinutes,
    endHours,
    endMinutes
  );
  const [taskLength, setTaskLength] = useState<number>(cardLength);
  const hasDraggedRef = useRef(false);
  if (startPosition + cardLength > timelineHeight)
    cardLength = timelineHeight - startPosition;

  const { onMouseDown } = useTaskCardResizeAndMove({
    startHours,
    startMinutes,
    task,
    hasDraggedRef,
    setTaskLength,
    cardLength,
    startPosition,
    taskRef,
  });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick(task.id);
  }

  useEffect(() => {
    setTaskLength(cardLength);
  }, [task]);

  return (
    <div
      ref={taskRef}
      data-testid="calendar-task-card"
      onClick={(e) => {
        handleClick(e);
      }}
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
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
          onMouseDown(e, "resize")
        }
        onClick={(e) => e.stopPropagation()}
      ></button>
    </div>
  );
}

export default TaskCard;
