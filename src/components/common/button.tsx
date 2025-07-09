import { useState } from "react";
import "./button.css";
import { adjustColor } from "../../utils/timelineUtils";

type ButtonProps = {
  children?: string | React.ReactNode;
  className: string;
  type?: "submit" | "button";
  color?: string;
  onClick?: ((e: React.MouseEvent<any>) => void) | (() => void);
  onMouseDown?: (e: React.MouseEvent<any>) => void;
};

function Button({
  children,
  className,
  type,
  onClick,
  onMouseDown,
  color,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <button
      style={{
        backgroundColor: isHovered
          ? color
            ? adjustColor(color, -20)
            : color
          : color,
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
