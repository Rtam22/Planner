import type { Task } from "../types/taskTypes";
import "./calendarTaskCard.css";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
type calendarTaskCardProps = {
  title: string;
  onClick: (taskId: string) => void;
  task: Task;
};

function CalendarTaskCard({ title, onClick, task }: calendarTaskCardProps) {
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);
  const startingTime = 420;

  function handleClick() {
    onClick(task.id);
  }

  return (
    <div
      data-testid="calendar-task-card"
      onClick={handleClick}
      className="calendar-task-card"
      style={{
        top: calculateStartingPosition(startHours, startMinutes, startingTime),
        height: `${calculateLength(
          startHours,
          startMinutes,
          endHours,
          endMinutes
        )}px`,
        backgroundColor: task.tag?.color,
      }}
    >
      <p>{title}</p>
    </div>
  );
}

export default CalendarTaskCard;
