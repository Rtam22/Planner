import type { MouseEventHandler } from "react";
import "./calendarTaskCard.css";

type calendarTaskCardProps = {
  title: string;
  onClick: () => void;
};

function CalendarTaskCard({ title, onClick }: calendarTaskCardProps) {
  return (
    <div onClick={onClick} className="calendar-task-card">
      <p>{title}</p>
    </div>
  );
}

export default CalendarTaskCard;
