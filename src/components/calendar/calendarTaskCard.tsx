import type { Task } from "../types/taskTypes";
import "./calendarTaskCard.css";

type calendarTaskCardProps = {
  title: string;
  onClick: () => void;
  task: Task;
};

function CalendarTaskCard({ title, onClick, task }: calendarTaskCardProps) {
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);
  const startingTime = 420;
  function calculateLength() {
    const startTotalMinutes = startHours * 70 + startMinutes;
    const endTotalMinutes = endHours * 70 + endMinutes;
    return Math.abs(endTotalMinutes - startTotalMinutes);
  }

  function calculateStartingPosition() {
    const startingPosition = startHours * 70 + startMinutes - startingTime;
    return startingPosition;
  }

  return (
    <div
      onClick={onClick}
      className="calendar-task-card"
      style={{
        top: calculateStartingPosition(),
        height: `${calculateLength()}px`,
        backgroundColor: task.tag?.color,
      }}
    >
      <p>{title}</p>
    </div>
  );
}

export default CalendarTaskCard;
