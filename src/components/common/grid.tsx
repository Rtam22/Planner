import "./grid.css";

type GridProps = {
  children: React.ReactNode;
  gap?: number;
};

function Grid({ children, gap = 50 }: GridProps) {
  return (
    <div
      className="grid"
      style={{
        gap,
      }}
    >
      {children}
    </div>
  );
}

export default Grid;
