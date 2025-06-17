import Calendar from "./calendar/calendar";
import "./filterBar.css";
type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  highlightSecondary?: Date[];
};

function FilterBar({
  selectedDate,
  handleSelectDate,
  highlightSecondary,
}: filterBarProps) {
  return (
    <div className="filter-bar">
      <Calendar
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        highlightSecondary={highlightSecondary}
      />
    </div>
  );
}

export default FilterBar;
