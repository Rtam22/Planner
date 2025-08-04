import type { Task } from "../../types/taskTypes";
import "./taskCard.css";
import {
  adjustColor,
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import {} from "../../utils/dateUtils";
import React, { useEffect, useRef, useState } from "react";
import { useTaskCardControl } from "../../hooks/taskCardControl/useTaskCardControl";
import Button from "../common/button";
import { useTasksContext } from "../../context/taskContext";
import { convert24To12HourTime } from "../../utils/timeUtils";

type calendarTaskCardProps = {
  title: string;
  onClick?: (taskId: string) => void;
  task: Task;
  isEditing: boolean;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  preview: boolean;
};

function TaskCard({
  title,
  onClick,
  task,
  isEditing,
  timelineRef,
  preview,
}: calendarTaskCardProps) {
  const { draftTasks } = useTasksContext();
  const taskRef = useRef<HTMLDivElement | null>(null);
  let [startHours, startMinutes] = task.startTime.split(":").map(Number);
  let [endHours, endMinutes] = task.endTime.split(":").map(Number);
  const startPosition = calculateStartingPosition(startHours, startMinutes);
  const timelineHeight = 1680;
  const [startTime, setStartTime] = useState<string>(
    convert24To12HourTime(task.startTime)
  );
  const [endTime, setEndTime] = useState<string>(convert24To12HourTime(task.endTime));
  let cardLength = calculateLength(startHours, startMinutes, endHours, endMinutes);
  const [taskLength, setTaskLength] = useState<number>(cardLength);
  const [taskPosition, setTaskPosition] = useState<number>(startPosition);
  const hasDraggedRef = useRef(false);
  if (startPosition + cardLength > timelineHeight)
    cardLength = timelineHeight - startPosition;
  const handleMouseDown = isEditing
    ? (e: React.MouseEvent<HTMLDivElement>) => onMouseDown(e, "move")
    : undefined;
  const handleOnClick = !isEditing
    ? (e: React.MouseEvent<HTMLDivElement>) => handleClick(e)
    : undefined;
  const { onMouseDown, handleChangeDay } = useTaskCardControl({
    task,
    hasDraggedRef,
    setTaskLength,
    setTaskPosition,
    setStartTime,
    setEndTime,
    taskRef,
    timelineRef,
  });

  useEffect(() => {
    if (!draftTasks) {
      initializeDataWithContext();
    }
  }, [task, draftTasks]);

  useEffect(() => {
    if (!draftTasks) return;
    const previewTask = draftTasks.find((task) => task.preview === true);
    if (!previewTask || !task.preview) return;
    setTaskLength(calculateLength(startHours, startMinutes, endHours, endMinutes));
    setTaskPosition(calculateStartingPosition(startHours, startMinutes));
    setStartTime(convert24To12HourTime(previewTask.startTime));
    setEndTime(convert24To12HourTime(previewTask.endTime));
  }, [draftTasks]);

  function initializeDataWithContext() {
    setStartTime(convert24To12HourTime(task.startTime));
    setEndTime(convert24To12HourTime(task.endTime));
    [startHours, startMinutes] = task.startTime.split(":").map(Number);
    [endHours, endMinutes] = task.endTime.split(":").map(Number);
    cardLength = calculateLength(startHours, startMinutes, endHours, endMinutes);
    setTaskLength(cardLength);
    setTaskPosition(calculateStartingPosition(startHours, startMinutes));
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onClick) return;
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick(task.id);
  }

  return (
    <div
      ref={taskRef}
      data-testid="calendar-task-card"
      onMouseDown={isEditing ? handleMouseDown : undefined}
      className={`calendar-task-card ${preview ? "preview" : ""}`}
      style={{
        top: taskPosition,
        height: `${taskLength}px`,
        backgroundColor: task.tag?.color,
      }}
      onClick={handleOnClick}
    >
      {isEditing && (
        <>
          <Button
            backgroundColor={task.tag?.color}
            className={`btn-move-left ${preview ? "preview" : ""}`}
            onClick={() => handleChangeDay("prev")}
            minHeight={taskLength < 18 ? "16" : ""}
          >
            ‹
          </Button>
          <Button
            backgroundColor={task.tag?.color}
            className={`btn-move-right ${preview ? "preview" : ""}`}
            onClick={() => handleChangeDay("next")}
            minHeight={taskLength < 18 ? "16" : ""}
          >
            ›
          </Button>
          <Button
            className={`btn-resize ${preview ? "preview" : ""}`}
            backgroundColor={
              preview ? "#BCBBBB" : adjustColor(task.tag?.color ?? "#646464", -20)
            }
            onMouseDown={(e) => onMouseDown(e, "resize")}
            onClick={(e) => e.stopPropagation()}
          ></Button>
        </>
      )}

      <div className="container" style={{ paddingTop: taskLength < 50 ? ".3%" : "3%" }}>
        <h3>{title}</h3>
        <p>{`${startTime} - ${endTime}`}</p>
      </div>
    </div>
  );
}

export default TaskCard;
