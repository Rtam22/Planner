import { useState } from "react";
import "./button.css";
import { adjustColor } from "../../utils/timelineUtils";

type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: string | React.ReactNode;
  className: string;
  type?: "submit" | "button";
  backgroundColor?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: (e: React.MouseEvent<any>) => void;
  width?: string;
  height?: string;
  minHeight?: string | undefined;
  border?: string;
  color?: string;
  styles?: React.CSSProperties;
  hoverColor?: string;
};
type ButtonInactiveProps = ButtonBaseProps & {
  active?: false;
  activeBackgroundColor?: never;
  activeColor?: never;
};

type ButtonActiveProps = ButtonBaseProps & {
  active: boolean;
  activeBackgroundColor: string;
  activeColor: string;
};

type ButtonProps = ButtonActiveProps | ButtonInactiveProps;

function Button({
  children,
  className,
  type = "button",
  onClick,
  onMouseDown,
  backgroundColor,
  width,
  height,
  border,
  color,
  minHeight,
  active,
  activeBackgroundColor,
  activeColor,
  hoverColor,
  styles,
  ...rest
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isActive = active === true;
  const bgColor =
    isHovered && !isActive
      ? hoverColor
        ? hoverColor
        : backgroundColor
        ? adjustColor(backgroundColor, -20)
        : backgroundColor
      : isActive
      ? activeBackgroundColor
      : backgroundColor;

  return (
    <button
      style={{
        backgroundColor: bgColor,
        width: width,
        height: height,
        border: border ? border : undefined,
        color: active ? activeColor : color && color,
        minHeight: minHeight && minHeight,
        ...styles,
      }}
      type={type}
      onClick={(e) => onClick?.(e)}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => onMouseDown?.(e)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
