import type { Task } from "../types/taskTypes";
import "./calendarTaskCard.css";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import { convertTimeString24To12 } from "../../utils/dateUtils";
type calendarTaskCardProps = {
  title: string;
  onClick: (taskId: string) => void;
  task: Task;
};

function CalendarTaskCard({ title, onClick, task }: calendarTaskCardProps) {
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
  if (startPosition + cardLength > timelineHeight)
    cardLength = timelineHeight - startPosition;

  function handleClick() {
    onClick(task.id);
  }

  return (
    <div
      data-testid="calendar-task-card"
      onClick={handleClick}
      className="calendar-task-card"
      style={{
        top: startPosition,
        height: `${cardLength}px`,
        backgroundColor: task.tag?.color,
      }}
    >
      <h3>{title}</h3>
      <p>{`${startTime} - ${endTime}`}</p>
    </div>
  );
}

export default CalendarTaskCard;
