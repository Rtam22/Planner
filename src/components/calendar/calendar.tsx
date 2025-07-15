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
import type { Task } from "../../types/taskTypes";

export type calendarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  highlightSecondary?: Date[];
  showToday?: boolean;
  showTaskInCell?: Task[];
};

function Calendar({
  selectedDate,
  handleSelectDate,
  highlightSecondary,
  showToday = true,
  showTaskInCell,
}: calendarProps) {
  const [dateView, setDateView] = useState(new Date());
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const taskList = showTaskInCell ? showTaskInCell : null;
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
      const date = i + 1;
      const prevMonthActive = new Date(
        dateView.getFullYear(),
        dateView.getMonth() - 1,
        numberOfDaysPrev
      );
      const nextMonthSelected = new Date(
        dateView.getFullYear(),
        dateView.getMonth() + 1,
        numberOfDaysPrev
      );
      const prevMonthFindToday = new Date(
        dateView.getFullYear(),
        dateView.getMonth() - 1,
        date
      );
      cells.push(
        <div
          key={"preffix" + i}
          id={numberOfDaysPrev.toString()}
          data-testid="cal-cell"
          className={`cal-cell is-outside-month ${
            isSameDate(selectedDate, prevMonthActive) ? "active" : ""
          } ${
            compareDateArrayToDate(highlightSecondary, nextMonthSelected) ===
            true
              ? "secondary"
              : ""
          } ${
            isSameDate(today, prevMonthFindToday) && showToday === true
              ? "today"
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
      const calendarDate = new Date(
        dateView.getFullYear(),
        dateView.getMonth(),
        date
      );
      cells.push(
        <div
          data-testid="cal-cell"
          key={`cells${i}`}
          id={date.toString()}
          className={`cal-cell ${
            isSameDate(selectedDate, calendarDate) ? "active" : ""
          } ${
            compareDateArrayToDate(highlightSecondary, calendarDate) === true
              ? "secondary"
              : ""
          } ${
            isSameDate(today, calendarDate) && showToday === true ? "today" : ""
          }
           `}
          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
            handleSelect(e, "current")
          }
        >
          {date}
          <div className="container">
            {showTaskInCell
              ? taskList?.map((task) => {
                  if (isSameDate(task.date, calendarDate)) {
                    return (
                      <div
                        className="task-box"
                        style={{ backgroundColor: task.tag?.color }}
                      ></div>
                    );
                  }
                })
              : null}
          </div>
        </div>
      );
    });

    Array.from({ length: suffix }, (_, i) => {
      const date = i + 1;
      const nextMonth = new Date(
        dateView.getFullYear(),
        dateView.getMonth() + 1,
        date
      );
      cells.push(
        <div
          id={date.toString()}
          key={"suffix" + i}
          data-testid="cal-cell"
          className={`cal-cell is-outside-month ${
            isSameDate(selectedDate, nextMonth) ? "active" : ""
          } ${
            compareDateArrayToDate(highlightSecondary, nextMonth) === true
              ? "secondary"
              : ""
          } ${
            isSameDate(today, nextMonth) && showToday === true ? "today" : ""
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
