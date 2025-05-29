import { useEffect, useState } from "react";
import "./calendar.css";
import Button from "../button";
import {
  getMonthName,
  daysInMonth,
  getFirstDayOfMonth,
} from "../../utils/dateUtils";
type calendarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
};

function Calendar({ selectedDate, handleSelectDate }: calendarProps) {
  const [dateView, setDateView] = useState(new Date());
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  useEffect(() => {
    setDateView(selectedDate);
  }, [selectedDate]);

  function handleSelect(event: React.MouseEvent<HTMLDivElement>) {
    const selectDay = Number(event.currentTarget.id);
    handleSelectDate(
      new Date(dateView.getFullYear(), dateView.getMonth(), selectDay)
    );
  }

  function handleDateChange(e: React.MouseEvent<HTMLDivElement>) {
    const button = e.currentTarget.textContent;
    const newDate = new Date(dateView);

    if (button === "‹") {
      newDate.setMonth(dateView.getMonth() - 1);
      setDateView(newDate);
    } else {
      newDate.setMonth(dateView.getMonth() + 1);
      setDateView(newDate);
    }
  }

  function generateCells(date: Date) {
    const numberOfDays = daysInMonth(date.getFullYear(), date.getMonth());
    const firstDay = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
    let cells = [];
    let count = 0;
    let secondary = 0;
    if (selectedDate.getMonth() != dateView.getMonth())
      secondary =
        daysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()) -
        selectedDate.getDate();
    for (let i = 0; i < 42; i++) {
      if (i < firstDay || i > numberOfDays + firstDay) {
        cells.push(<div key={i} className="cal-cell"></div>);
      } else if (i < numberOfDays + firstDay) {
        count++;

        cells.push(
          <div
            key={i}
            id={count.toString()}
            className={`cal-cell filled ${
              selectedDate.getFullYear() === dateView.getFullYear() &&
              selectedDate.getMonth() === dateView.getMonth() &&
              selectedDate.getDate() === count
                ? "active"
                : ""
            } ${
              count > selectedDate.getDate() &&
              selectedDate.getMonth() === dateView.getMonth() &&
              count < selectedDate.getDate() + 7
                ? "secondary"
                : ""
            }
            ${
              selectedDate.getMonth() === dateView.getMonth() - 1 &&
              secondary < 6
                ? "secondary"
                : ""
            }`}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => handleSelect(e)}
          >
            {count}
          </div>
        );
        secondary++;
      }
    }
    return cells;
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <Button type="btn-plain" onClick={handleDateChange}>
          ‹
        </Button>
        <p>{getMonthName(dateView) + " " + dateView.getFullYear()} </p>
        <Button type="btn-plain" onClick={handleDateChange}>
          ›
        </Button>
      </div>
      <div className="cal-days">
        {days.map((day, i) => (
          <p key={i}>{day}</p>
        ))}
      </div>
      <div className="cal-cell-container">{generateCells(dateView)}</div>
    </div>
  );
}

export default Calendar;
