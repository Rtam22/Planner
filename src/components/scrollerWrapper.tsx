import { useEffect } from "react";
import "./scrollerWrapper.css";

type ScrollerWrapperProps = {
  children: React.ReactNode;
  elementRef: React.RefObject<HTMLDivElement | null>;
  scrollPosition: number;
};

function ScrollerWrapper({
  children,
  elementRef,
  scrollPosition,
}: ScrollerWrapperProps) {
  useEffect(() => {
    const element = elementRef?.current;
    if (element && scrollPosition) {
      element.scrollTop = scrollPosition;
    }
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
