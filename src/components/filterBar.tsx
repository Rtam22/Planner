import Calendar from "./calendar/calendar";
import "./filterBar.css";

type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
};

function FilterBar({ selectedDate, handleSelectDate }: filterBarProps) {
  return (
    <div className="filter-bar">
      <Calendar
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
      />
    </div>
  );
}

export default FilterBar;
