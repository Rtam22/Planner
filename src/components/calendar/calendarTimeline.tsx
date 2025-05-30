import CalendarDayDisplay from "./calendarDayDisplay";
import CalendarTaskCard from "./calendarTaskCard";
import "./calendarTimeline.css";
import { useRef } from "react";
import type { CalendarDayProps } from "./calendarDay";
import ScrollerWrapper from "../scrollerWrapper";
import type { Task } from "../types/taskTypes";

type CalendarTimelineProps = {
  dates: CalendarDayProps[];
  tasks: Task[];
  selectedDate: Date;
};

function CalendarTimeline({
  dates,
  tasks,
  selectedDate,
}: CalendarTimelineProps) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeStamps = [];
  let date = new Date(selectedDate);
  date.setDate(date.getDate() - 1);

  for (let i = 5; i < 31; i++) {
    const hour24 = i % 24;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const period = hour24 < 12 ? "am" : "pm";

    timeStamps.push({ hour: hour12, period });
  }

  function onCLick() {
    console.log("dsadsa");
  }

  function compareDate(taskDate: Date, date: Date) {
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  }

  return (
    <ScrollerWrapper timelineRef={timelineRef}>
      <div ref={timelineRef} className="calendar-timeline">
        <CalendarDayDisplay dates={dates} />
        <div className="horizontal">
          <div className="time-cells">
            {timeStamps.map((time, index) => (
              <div className="time-container">
                <p key={index}>{time.hour}</p>
                <p>{time.period}</p>
              </div>
            ))}
          </div>
          <div className="cell-container">
            {Array.from({ length: 7 }).map((_, index) => {
              date.setDate(date.getDate() + 1);
              return (
                <div key={index} className="cell-column">
                  {tasks.map((task) => {
                    if (compareDate(task.date, date)) {
                      return (
                        <CalendarTaskCard
                          key={task.id}
                          onClick={onCLick}
                          title={task.title}
                          task={task}
                        />
                      );
                    }
                  })}

                  {Array.from({ length: 24 }).map((_, index) => (
                    <div key={index} className="cell"></div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollerWrapper>
  );
}

export default CalendarTimeline;
