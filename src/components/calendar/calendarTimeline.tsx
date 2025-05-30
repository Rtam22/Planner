import CalendarDayDisplay from "./calendarDayDisplay";
import CalendarTaskCard from "./calendarTaskCard";
import "./calendarTimeline.css";
import { useRef, type RefObject } from "react";
import type { CalendarDayProps } from "./calendarDay";
import ScrollerWrapper from "../scrollerWrapper";

type CalendarTimelineProps = {
  dates: CalendarDayProps[];
};

function CalendarTimeline({ dates }: CalendarTimelineProps) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeStamps = [""];
  for (let i = 0; i < 25; i++) {
    const hour = String(i).padStart(2, "0");
    timeStamps.push(`${hour}:00`);
  }

  function onCLick() {
    console.log("dsadsa");
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
    </ScrollerWrapper>
  );
}

export default CalendarTimeline;
