import { useEffect, useState, type JSX } from "react";
import "./calendar.css";
import Button from "../common/button";
import {
  getMonthName,
  daysInMonth,
  getFirstDayOfMonth,
  setMonthOfDate,
  isSameDate,
  compareDateArrayToDate,
} from "../../utils/dateUtils";

export type calendarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  highlightSecondary?: Date[];
  showToday?: boolean;
};

function Calendar({
  selectedDate,
  handleSelectDate,
  highlightSecondary,
  showToday = true,
}: calendarProps) {
  const [dateView, setDateView] = useState(new Date());
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  useEffect(() => {
    setDateView(selectedDate);
  }, [selectedDate]);

  function handleSelect(
    event: React.MouseEvent<HTMLDivElement>,
    type: "prev" | "current" | "next"
  ) {
    const selectDay = Number(event.currentTarget.id);
    let newDate = new Date(dateView.getFullYear(), dateView.getMonth(), 1);
    if (type === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (type === "next") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    newDate.setDate(selectDay);
    handleSelectDate(new Date(newDate));
  }

  function handleDateChange(e: React.MouseEvent<HTMLDivElement>) {
    const button = e.currentTarget.textContent;
    const newDate = new Date(dateView.getFullYear(), dateView.getMonth(), 1);

    if (button === "‹") {
      newDate.setMonth(dateView.getMonth() - 1);
      setDateView(newDate);
    } else if (button === "›") {
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
    const today = new Date();
    let cells: JSX.Element[] = [];

    Array.from({ length: preffix }, (_, i) => {
      cells.push(
        <div
          key={"preffix" + i}
          id={numberOfDaysPrev.toString()}
          data-testid="cal-cell"
          className={`cal-cell is-outside-month ${
            isSameDate(
              selectedDate,
              new Date(
                dateView.getFullYear(),
                dateView.getMonth() - 1,
                numberOfDaysPrev
              )
            )
              ? "active"
              : ""
          } ${
            compareDateArrayToDate(
              highlightSecondary,
              new Date(
                dateView.getFullYear(),
                dateView.getMonth() - 1,
                numberOfDaysPrev
              )
            ) === true
              ? "secondary"
              : ""
          }`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
            handleSelect(e, "prev")
          }
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
            isSameDate(
              selectedDate,
              new Date(dateView.getFullYear(), dateView.getMonth(), date)
            )
              ? "active"
              : ""
          } ${
            compareDateArrayToDate(
              highlightSecondary,
              new Date(dateView.getFullYear(), dateView.getMonth(), date)
            ) === true
              ? "secondary"
              : ""
          } ${
            isSameDate(
              today,
              new Date(dateView.getFullYear(), dateView.getMonth(), date)
            ) && showToday === true
              ? "today"
              : ""
          }
           `}
          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
            handleSelect(e, "current")
          }
        >
          {date}
        </div>
      );
    });

    Array.from({ length: suffix }, (_, i) => {
      const date = i + 1;
      cells.push(
        <div
          id={date.toString()}
          key={"suffix" + i}
          data-testid="cal-cell"
          className={`cal-cell is-outside-month ${
            isSameDate(
              selectedDate,
              new Date(
                selectedDate.getFullYear(),
                dateView.getMonth() + 1,
                date
              )
            )
              ? "active"
              : ""
          } ${
            compareDateArrayToDate(
              highlightSecondary,
              new Date(dateView.getFullYear(), dateView.getMonth() + 1, date)
            ) === true
              ? "secondary"
              : ""
          }`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
            handleSelect(e, "next")
          }
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
        <Button type="button" className="btn-plain" onClick={handleDateChange}>
          ‹
        </Button>
        <p data-testid="calendar-date">
          {getMonthName(dateView) + " " + dateView.getFullYear()}
        </p>
        <Button type="button" className="btn-plain" onClick={handleDateChange}>
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
