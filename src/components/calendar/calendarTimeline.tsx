import CalendarTaskCard from "./calendarTaskCard";
import "./calendarTimeline.css";
import { useRef } from "react";
import type { CalendarDayProps } from "./calendarDates";
import ScrollerWrapper from "../scrollerWrapper";
import type { PreviewTask, Task } from "../types/taskTypes";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import CalendarDates from "./calendarDates";
import { convertToDDMMYYYY } from "../../utils/dateUtils";

type CalendarTimelineProps = {
  dates: CalendarDayProps[];
  tasks: Task[];
  selectedDate: Date;
  previewTask: PreviewTask | null;
  onClick: (taskId: string) => void;
};

function CalendarTimeline({
  dates,
  tasks,
  selectedDate,
  previewTask,
  onClick,
}: CalendarTimelineProps) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeStamps = [];

  let date = new Date(selectedDate);
  date.setDate(date.getDate() - 1);

  const [startHours, startMinutes] = previewTask?.startTime
    ?.split(":")
    .map(Number) || [0, 0];
  const [endHours, endMinutes] = previewTask?.endTime
    ?.split(":")
    .map(Number) || [0, 0];
  const startingTime = 420;

  for (let i = 5; i < 31; i++) {
    const hour24 = i % 24;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const period = hour24 < 12 ? "am" : "pm";

    timeStamps.push({ hour: hour12, period });
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
        <div className="calendar-day-display">
          {dates.map((date, index) => (
            <CalendarDates key={index} day={date.day} dayDate={date.dayDate} />
          ))}
        </div>

        <div className="horizontal">
          <div className="time-cells">
            {timeStamps.map((time, index) => (
              <div key={index} className="time-container">
                <p>{time.hour}</p>
                <p>{time.period}</p>
              </div>
            ))}
          </div>
          <div className="cell-container">
            {Array.from({ length: 7 }).map((_, index) => {
              date.setDate(date.getDate() + 1);
              return (
                <div
                  key={index}
                  className="cell-column"
                  data-testid={convertToDDMMYYYY(date)}
                >
                  {index === 0 && previewTask && (
                    <div
                      className="preview-task"
                      style={{
                        top: calculateStartingPosition(
                          startHours,
                          startMinutes,
                          startingTime
                        ),
                        height: `${calculateLength(
                          startHours,
                          startMinutes,
                          endHours,
                          endMinutes
                        )}px`,
                        maxHeight:
                          1680 -
                          calculateStartingPosition(
                            startHours,
                            startMinutes,
                            startingTime
                          ),
                      }}
                    >
                      Preview Task
                    </div>
                  )}
                  {tasks.map((task) => {
                    if (compareDate(task.date, date)) {
                      return (
                        <CalendarTaskCard
                          key={task.id}
                          onClick={onClick}
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
