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
  height?: string;
  width?: string;
};

function Calendar({
  selectedDate,
  handleSelectDate,
  highlightSecondary,
  showToday = true,
  showTaskInCell,
  height,
  width,
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
    handleSelectDate(newDate);
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

  function getPrefixCells(
    prefix: number,
    prevMonthActive: Date,
    nextMonthSelected: Date,
    today: Date,
    numberOfDaysPrev: number
  ) {
    let cells: JSX.Element[] = [];
    Array.from({ length: prefix }, (_, i) => {
      const date = i + 1;
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
            compareDateArrayToDate(highlightSecondary, nextMonthSelected) === true
              ? "secondary"
              : ""
          } ${
            isSameDate(today, prevMonthFindToday) && showToday === true ? "today" : ""
          }`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleSelect(e, "prev")}
        >
          {numberOfDaysPrev}
        </div>
      );
      numberOfDaysPrev++;
    });
    return cells;
  }

  function getDayCells(numberOfDays: number, today: Date) {
    let cells: JSX.Element[] = [];
    Array.from({ length: numberOfDays }, (_, i) => {
      const date = i + 1;
      const calendarDate = new Date(dateView.getFullYear(), dateView.getMonth(), date);
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
          } ${isSameDate(today, calendarDate) && showToday === true ? "today" : ""}
           `}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleSelect(e, "current")}
        >
          {date}
          <div className="container">
            {showTaskInCell
              ? taskList?.map((task, index) => {
                  if (isSameDate(task.date, calendarDate)) {
                    return (
                      <div
                        key={index}
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
    return cells;
  }

  function getSuffixCells(suffix: number, today: Date) {
    let cells: JSX.Element[] = [];
    Array.from({ length: suffix }, (_, i) => {
      const date = i + 1;
      const nextMonth = new Date(dateView.getFullYear(), dateView.getMonth() + 1, date);
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
          } ${isSameDate(today, nextMonth) && showToday === true ? "today" : ""}`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => handleSelect(e, "next")}
        >
          {date}
        </div>
      );
    });
    return cells;
  }

  function generateCells(date: Date) {
    const prevMonth = setMonthOfDate(date, "prev", 1);
    let numberOfDaysPrev = daysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
    const prefix = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
    const numberOfDays = daysInMonth(date.getFullYear(), date.getMonth());
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
    const suffix = 42 - (numberOfDays + prefix);
    numberOfDaysPrev = numberOfDaysPrev - prefix + 1;
    const today = new Date();
    let cells: JSX.Element[] = [
      ...getPrefixCells(
        prefix,
        prevMonthActive,
        nextMonthSelected,
        today,
        numberOfDaysPrev
      ),
      ...getDayCells(numberOfDays, today),
      ...getSuffixCells(suffix, today),
    ];
    return cells;
  }

  return (
    <div
      data-testid="calendar"
      className="calendar"
      style={{
        height: height ? height + "px" : undefined,
        width: width ? width + "px" : undefined,
      }}
    >
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
