import { useEffect } from "react";
import "./scrollerWrapper.css";

type ScrollerWrapperProps = {
  children: React.ReactNode;
  elementRef: React.RefObject<HTMLDivElement | null>;
  scrollTopPosition: number;
  selectedDate?: Date;
};

function ScrollerWrapper({
  children,
  elementRef,
  scrollTopPosition,
  selectedDate,
}: ScrollerWrapperProps) {
  console.log(selectedDate);
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [selectedDate]);
  useEffect(() => {
    const element = elementRef?.current;
    if (element && scrollTopPosition) {
      element.scrollTop = scrollTopPosition;
    }
    let isDragging = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;

    function onMouseDown(event: MouseEvent) {
      const isTaskCard = (event.target as HTMLElement).closest(".calendar-task-card");
      const isButton = (event.target as HTMLElement).closest("button");
      if (isTaskCard || isButton) return;
      if (event.button !== 0) return;
      isDragging = true;
      startX = event.pageX;
      startY = event.pageY;
      scrollLeft = element?.scrollLeft ?? 0;
      scrollTop = element?.scrollTop ?? 0;
      document.body.style.cursor = "grabbing";
    }

    function onMouseMove(event: MouseEvent) {
      if (!isDragging) return;
      event.preventDefault();
      const dx = event.pageX - startX;
      const dy = event.pageY - startY;
      element ? (element.scrollLeft = scrollLeft - dx) : null;
      element ? (element.scrollTop = scrollTop - dy) : null;
    }

    function onMouseUp() {
      isDragging = false;
      document.body.style.cursor = "default";
    }

    element?.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      element?.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <div className="Scroller-wrapper">{children}</div>;
}

export default ScrollerWrapper;
