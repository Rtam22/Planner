import TaskCard from "../tasks/taskCard";
import "./calendarTimeline.css";
import { useRef } from "react";
import ScrollerWrapper from "../common/scrollerWrapper";
import type { PreviewTask, Task } from "../../types/taskTypes";
import { calculateLength, calculateStartingPosition } from "../../utils/timelineUtils";

import { convertToDDMMYYYY } from "../../utils/dateUtils";

export type CalendarDayProps = {
  day: string;
  dayDate: number;
  isToday: boolean;
};

type CalendarTimelineProps = {
  dates: CalendarDayProps[];
  tasks: Task[];
  selectedDate: Date;
  previewTask: PreviewTask | null;
  onClick: (taskId: string) => void;
  isEditing: boolean;
};

function CalendarTimeline({
  dates,
  tasks,
  selectedDate,
  previewTask,
  onClick,
  isEditing,
}: CalendarTimelineProps) {
  const scrollTime = 6 * 70;
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeStamps = [{ hour: 12, period: "pm" }];
  const daysInWeek = 7;
  let date = new Date(selectedDate);
  date.setDate(date.getDate() - 1);

  const [startHours, startMinutes] = previewTask?.startTime?.split(":").map(Number) || [
    0, 0,
  ];
  const [endHours, endMinutes] = previewTask?.endTime?.split(":").map(Number) || [0, 0];

  for (let i = 0; i < 25; i++) {
    const hour24 = i;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const period = hour24 < 12 || hour24 > 23 ? "am" : "pm";

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
    <ScrollerWrapper elementRef={timelineRef} scrollPosition={scrollTime}>
      <div ref={timelineRef} className="calendar-timeline">
        <div className="calendar-day-display">
          {dates.map((date, index) => (
            <div key={index} className="calendar-day" data-testid="calendar-day">
              <p>{date.day}</p>
              <div className={`center-container ${date.isToday ? "active" : ""} `}>
                <h3>{date.dayDate}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="horizontal">
          <div className="time-cells">
            {timeStamps.map((time, index) => (
              <div key={index} className="time-container">
                {index > 0 && (
                  <>
                    <p>{time.hour}</p>
                    <p>{time.period}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="cell-container">
            {Array.from({ length: daysInWeek }).map((_, index) => {
              date.setDate(date.getDate() + 1);

              return (
                <div
                  key={index}
                  className="cell-column"
                  data-testid={convertToDDMMYYYY(date)}
                >
                  {previewTask && compareDate(date, previewTask.date) && previewTask && (
                    <div
                      className="preview-task"
                      style={{
                        top: calculateStartingPosition(startHours, startMinutes),
                        height: `${calculateLength(
                          startHours,
                          startMinutes,
                          endHours,
                          endMinutes
                        )}px`,
                        maxHeight:
                          1680 - calculateStartingPosition(startHours, startMinutes),
                      }}
                    ></div>
                  )}
                  {tasks.map((task) => {
                    if (compareDate(task.date, date)) {
                      return (
                        <TaskCard
                          key={task.id}
                          onClick={onClick}
                          title={task.title}
                          task={task}
                          isEditing={isEditing}
                          timelineRef={timelineRef}
                        />
                      );
                    }
                  })}
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
