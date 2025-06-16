import { useEffect, useState, type JSX } from "react";
import "./calendar.css";
import Button from "../button";
import {
  getMonthName,
  daysInMonth,
  getFirstDayOfMonth,
  setMonthOfDate,
} from "../../utils/dateUtils";

export type calendarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  highlightSecondary?: Date[];
};

function Calendar({
  selectedDate,
  handleSelectDate,
  highlightSecondary,
}: calendarProps) {
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
    const newDate = new Date(dateView.getFullYear(), dateView.getMonth(), 1);

    if (button === "‹") {
      newDate.setMonth(dateView.getMonth() - 1);
      setDateView(newDate);
    } else {
      newDate.setMonth(dateView.getMonth() + 1);
      setDateView(newDate);
    }
  }

  function generateCells(date: Date) {
    const prevMonth = setMonthOfDate(date, "prev", 1);
    let numberOfDaysPrev = daysInMonth(
      prevMonth.getFullYear(),
      prevMonth.getMonth()
    );
    const preffix = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
    const numberOfDays = daysInMonth(date.getFullYear(), date.getMonth());
    const suffix = 42 - (numberOfDays + preffix);
    numberOfDaysPrev = numberOfDaysPrev - preffix + 1;

    let cells: JSX.Element[] = [];

    Array.from({ length: preffix }, (_, i) => {
      cells.push(
        <div
          key={"preffix" + i}
          data-testid="cal-cell"
          className={`cal-cell is-outside-month ${
            selectedDate.getFullYear() === dateView.getFullYear() &&
            selectedDate.getMonth() === dateView.getMonth() - 1 &&
            selectedDate.getDate() === numberOfDaysPrev
              ? "active"
              : ""
          } ${
            highlightSecondary?.some(
              (secondaryDate) =>
                secondaryDate.getFullYear() === dateView.getFullYear() &&
                secondaryDate.getMonth() === dateView.getMonth() - 1 &&
                secondaryDate.getDate() === numberOfDaysPrev
            )
              ? "secondary"
              : ""
          }`}
        >
          {numberOfDaysPrev}
        </div>
      );
      numberOfDaysPrev++;
    });

    Array.from({ length: numberOfDays }, (_, i) => {
      const date = i + 1;
      cells.push(
        <div
          data-testid="cal-cell"
          key={`cells${i}`}
          id={date.toString()}
          className={`cal-cell ${
            selectedDate.getFullYear() === dateView.getFullYear() &&
            selectedDate.getMonth() === dateView.getMonth() &&
            selectedDate.getDate() === date
              ? "active"
              : ""
          } ${
            highlightSecondary?.some(
              (secondaryDate) =>
                secondaryDate.getFullYear() === dateView.getFullYear() &&
                secondaryDate.getMonth() === dateView.getMonth() &&
                secondaryDate.getDate() === date
            )
              ? "secondary"
              : ""
          }
           `}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleSelect(e)}
        >
          {date}
        </div>
      );
    });

    Array.from({ length: suffix }, (_, i) => {
      const date = i + 1;
      cells.push(
        <div
          key={"suffix" + i}
          data-testid="cal-cell"
          className={`cal-cell is-outside-month ${
            selectedDate.getFullYear() === dateView.getFullYear() &&
            selectedDate.getMonth() === dateView.getMonth() + 1 &&
            selectedDate.getDate() === date
              ? "active"
              : ""
          } ${
            highlightSecondary?.some(
              (secondaryDate) =>
                secondaryDate.getFullYear() === dateView.getFullYear() &&
                secondaryDate.getMonth() === dateView.getMonth() + 1 &&
                secondaryDate.getDate() === date
            )
              ? "secondary"
              : ""
          }`}
        >
          {date}
        </div>
      );
    });

    return cells;
  }

  return (
    <div data-testid="calendar" className="calendar">
      <div className="cal-header">
        <Button className="btn-plain" onClick={handleDateChange}>
          ‹
        </Button>
        <p data-testid="calendar-date">
          {getMonthName(dateView) + " " + dateView.getFullYear()}
        </p>
        <Button className="btn-plain" onClick={handleDateChange}>
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
