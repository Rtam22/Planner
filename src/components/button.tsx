import "./button.css";

type ButtonProps = {
  children: string;
  type: string;
  onClick?: ((e: React.MouseEvent<any>) => void) | (() => void);
};

function Button({ children, type, onClick }: ButtonProps) {
  return (
    <button onClick={(e) => onClick?.(e)} className={type}>
      {children}
    </button>
  );
}

export default Button;
