import "./calendarDayDisplay.css";
import CalendarDay from "./calendarDay";
import type { CalendarDayProps } from "./calendarDay";

type CalendarDayDisplayProps = {
  dates: CalendarDayProps[];
};

function CalendarDayDisplay({ dates }: CalendarDayDisplayProps) {
  return (
    <div className="calendar-day-display">
      {dates.map((date) => (
        <CalendarDay day={date.day} dayDate={date.dayDate} />
      ))}
    </div>
  );
}

export default CalendarDayDisplay;
