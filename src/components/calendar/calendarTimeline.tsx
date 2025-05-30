import CalendarDayDisplay from "./calendarDayDisplay";
import CalendarTaskCard from "./calendarTaskCard";
import "./calendarTimeline.css";
import { useRef, type RefObject } from "react";
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
  const timeStamps = [""];
  let date = new Date(selectedDate);
  date.setDate(date.getDate() - 1);

  for (let i = 6; i < 30; i++) {
    const hour = i % 24;
    const padded = String(hour).padStart(2, "0");
    timeStamps.push(`${padded}:00`);
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
              <p key={index}>{time}</p>
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
