import { addNumberToDays, getMonthName } from "../../utils/dateUtils";
import Button from "../common/button";
import "./dateNavigator.css";

type dateNavigatorProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  amountOfDays?: number;
};

function dateNavigator({
  selectedDate,
  handleSelectDate,
  amountOfDays,
}: dateNavigatorProps) {
  let newDate = new Date(selectedDate);

  function handleDateChange(e: React.MouseEvent<HTMLDivElement>) {
    const button = e.currentTarget.textContent;
    if (button === "‹") {
      newDate.setDate(selectedDate.getDate() - 1);
      handleSelectDate(newDate);
    } else {
      newDate.setDate(selectedDate.getDate() + 1);
      handleSelectDate(newDate);
    }
  }

  return (
    <div className="date-navigator">
      <Button className="btn back-button" onClick={handleDateChange}>
        ‹
      </Button>
      <p data-testid="date-display-utility">
        {amountOfDays && amountOfDays > 1
          ? getMonthName(selectedDate).slice(0, 3) +
            " " +
            selectedDate.getDate() +
            "-" +
            addNumberToDays(selectedDate, amountOfDays)
          : getMonthName(selectedDate).slice(0, 3) + " " + selectedDate.getDate()}
      </p>
      <Button className="btn back-button" onClick={handleDateChange}>
        ›
      </Button>
    </div>
  );
}
export default dateNavigator;
