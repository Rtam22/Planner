import "./button.css";

type ButtonProps = {
  children: string;
  className: string;
  type?: "submit" | "button";
  onClick?: ((e: React.MouseEvent<any>) => void) | (() => void);
};

function Button({ children, className, type, onClick }: ButtonProps) {
  return (
    <button type={type} onClick={(e) => onClick?.(e)} className={className}>
      {children}
    </button>
  );
}

export default Button;
