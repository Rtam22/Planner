import React from "react";
import type { AllWidgetTypes, WidgetArray } from "../../widgets/widgetConsts";
import Button from "./button";
import "./dropDown.css";

type DropDownProps = {
  items: WidgetArray;
  onClick: (item: AllWidgetTypes) => void;
  styles?: React.CSSProperties;
};

function DropDownInner(
  { items, styles, onClick }: DropDownProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className="drop-down" style={{ ...styles }}>
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            className="btn"
            onClick={() => onClick(item)}
            styles={{ padding: "10px" }}
          >
            {item}
          </Button>
        );
      })}
    </div>
  );
}
const DropDown = React.forwardRef<HTMLDivElement, DropDownProps>(DropDownInner);
export default DropDown;
