import CalendarDayDisplay from "./calendarDayDisplay";
import CalendarTaskCard from "./calendarTaskCard";
import "./calendarTimeline.css";
import type { RefObject } from "react";

type CalendarTimelineProps = {
  timelineRef: RefObject<HTMLDivElement | null>;
};

function CalendarTimeline({ timelineRef }: CalendarTimelineProps) {
  const timeStamps = [""];
  for (let i = 0; i < 25; i++) {
    const hour = String(i).padStart(2, "0");
    timeStamps.push(`${hour}:00`);
  }

  function onCLick() {
    console.log("dsadsa");
  }
  return (
    <div ref={timelineRef} className="calendar-timeline">
      <CalendarDayDisplay />
      <div className="horizontal">
        <div className="time-cells">
          {timeStamps.map((time, index) => (
            <p key={index}>{time}</p>
          ))}
        </div>
        <div className="cell-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="cell-column">
              <CalendarTaskCard onClick={onCLick} title="dsadsa" />
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="cell"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarTimeline;
