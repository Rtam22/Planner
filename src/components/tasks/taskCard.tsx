import type { Task } from "../../types/taskTypes";
import "./taskCard.css";
import {
  adjustColor,
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import { convertTimeString24To12 } from "../../utils/dateUtils";
import React, { useEffect, useRef, useState } from "react";
import { useTaskCardControl } from "../../hooks/useTaskCardControl";
import Button from "../common/button";

type calendarTaskCardProps = {
  title: string;
  onClick?: (taskId: string) => void;
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
  const [taskPosition, setTaskPosition] = useState<number>(startPosition);
  const hasDraggedRef = useRef(false);
  if (startPosition + cardLength > timelineHeight)
    cardLength = timelineHeight - startPosition;

  const { onMouseDown, handleChangeDay } = useTaskCardControl({
    task,
    hasDraggedRef,
    setTaskLength,
    setTaskPosition,
    taskRef,
  });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onClick) return;
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick(task.id);
  }

  function hasd() {}

  useEffect(() => {
    setTaskLength(cardLength);
    setTaskPosition;
  }, [task]);

  return (
    <div
      ref={taskRef}
      data-testid="calendar-task-card"
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
        onMouseDown(e, "move");
      }}
      className="calendar-task-card"
      style={{
        top: taskPosition,
        height: `${taskLength}px`,
        backgroundColor: task.tag?.color,
      }}
    >
      <Button
        color={task.tag?.color}
        className="btn-move-left"
        onClick={() => handleChangeDay("prev")}
      >
        ‹
      </Button>
      <Button
        color={task.tag?.color}
        className="btn-move-right"
        onClick={() => handleChangeDay("next")}
      >
        ›
      </Button>
      <div className="container">
        <h3>{title}</h3>
        <p>{`${startTime} - ${endTime}`}</p>
      </div>
      <Button
        className="btn-resize"
        color={adjustColor(task.tag?.color ?? "#ccc", -20)}
        onMouseDown={(e) => onMouseDown(e, "resize")}
        onClick={(e) => e.stopPropagation()}
      ></Button>
    </div>
  );
}

export default TaskCard;
