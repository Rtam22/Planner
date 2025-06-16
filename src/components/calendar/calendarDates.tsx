import "./calendarDates.css";

export type CalendarDayProps = {
  day: string;
  dayDate: number;
  isToday: boolean;
};

function CalendarDay({ day, dayDate, isToday }: CalendarDayProps) {
  return (
    <div className="calendar-day" data-testid="calendar-day">
      <p>{day}</p>
      <div className={`center-container ${isToday ? "active" : ""} `}>
        <h3>{dayDate}</h3>
      </div>
    </div>
  );
}

export default CalendarDay;
