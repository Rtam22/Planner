import { useState } from "react";
import "./button.css";
import { adjustColor } from "../../utils/timelineUtils";

type ButtonProps = {
  children?: string | React.ReactNode;
  className: string;
  type?: "submit" | "button";
  backgroundColor?: string;
  onClick?: ((e: React.MouseEvent<any>) => void) | (() => void);
  onMouseDown?: (e: React.MouseEvent<any>) => void;
  width?: string;
  height?: string;
  minHeight?: string;
  border?: string;
  color?: string;
};

function Button({
  children,
  className,
  type,
  onClick,
  onMouseDown,
  backgroundColor,
  width,
  height,
  border,
  color,
  minHeight,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <button
      style={{
        backgroundColor: isHovered
          ? backgroundColor
            ? adjustColor(backgroundColor, -20)
            : backgroundColor
          : backgroundColor,
        width: width && width + "px",
        height: height && height + "px",
        border: border ? border : undefined,
        color: color && color,
        minHeight: minHeight && minHeight + "px",
      }}
      type={type}
      onClick={(e) => onClick?.(e)}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => onMouseDown?.(e)}
    >
      {children}
    </button>
  );
}

export default Button;
