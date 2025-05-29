import { useRef, useEffect } from "react";
import CalendarTimeline from "./calendar/calendarTimeline";
import "./scrollerWrapper.css";

function ScrollerWrapper() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    let isDragging = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;

    function onMouseDown(event: MouseEvent) {
      if (event.button !== 0) return;
      isDragging = true;
      console.log(isDragging);
      startX = event.pageX;
      startY = event.pageY;
      scrollLeft = timeline?.scrollLeft ?? 0;
      scrollTop = timeline?.scrollTop ?? 0;
      document.body.style.cursor = "grabbing";
    }

    function onMouseMove(event: MouseEvent) {
      if (!isDragging) return;
      event.preventDefault();
      const dx = event.pageX - startX;
      const dy = event.pageY - startY;
      timeline ? (timeline.scrollLeft = scrollLeft - dx) : null;
      timeline ? (timeline.scrollTop = scrollTop - dy) : null;
    }

    function onMouseUp() {
      isDragging = false;
      document.body.style.cursor = "default";
    }

    timeline?.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      timeline?.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="Scroller-wrapper">
      <CalendarTimeline timelineRef={timelineRef} />
    </div>
  );
}

export default ScrollerWrapper;
