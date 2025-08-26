import { useEffect, useRef, useState } from "react";
import Button from "../common/button";
import "./viewSelect.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
export type ViewOptions = "Calendar" | "Timeline";

export type ViewSelectProps = {
  view: ViewOptions;
  setView: (type: ViewOptions) => void;
  options: ViewOptions[];
};

function ViewSelect({ view, setView, options }: ViewSelectProps) {
  const [dropdown, setDropDown] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  function handleDropDown() {
    setDropDown(!dropdown);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdown === false) return;
      const element = elementRef.current;
      const target = e.target as Node | null;
      if (!element || !target) return;

      if (!element.contains(target)) {
        setDropDown(false);
      }
    }

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [dropdown]);

  function handleSetView(option: ViewOptions) {
    setView(option);
    setDropDown(!dropdown);
  }

  return (
    <div className="view-select" ref={elementRef}>
      <Button className="btn" onClick={handleDropDown}>
        <div className="container">
          <p>
            {view} <FontAwesomeIcon icon={faCaretDown} style={{ fontSize: "14px" }} />
          </p>
        </div>
      </Button>
      {dropdown && (
        <div className="drop-down">
          {options.map((option, index) => {
            if (option === view) return;
            return (
              <Button
                key={index}
                className="btn-filter"
                height="40"
                onClick={() => handleSetView(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ViewSelect;
