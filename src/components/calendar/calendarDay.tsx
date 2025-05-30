import "./calendarDay.css";

export type CalendarDayProps = {
  day: string;
  dayDate: number;
};

function CalendarDay({ day, dayDate }: CalendarDayProps) {
  return (
    <div className="calendar-day">
      <p>{day}</p>
      <h3>{dayDate}</h3>
    </div>
  );
}

export default CalendarDay;
