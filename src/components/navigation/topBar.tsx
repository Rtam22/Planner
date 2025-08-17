import "./topBar.css";

type TopBarProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

function TopBar({ left, right, className }: TopBarProps) {
  return (
    <div className={`top-bar ${className ?? ""}`} data-testid="top-utility-bar">
      <div className="horizontal">
        <div className="left">{left}</div>
        <div className="right"> {right}</div>
      </div>
    </div>
  );
}

export default TopBar;
