import "./topUtilityBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "./button";
import { getMonthName, addSixToDays } from "../utils/dateUtils";
type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
};

function TopUtilityBar({ selectedDate, handleSelectDate }: filterBarProps) {
  function handleDateChange(e: React.MouseEvent<HTMLDivElement>) {
    const button = e.currentTarget.textContent;
    console.log(button);
    let newDate = new Date(selectedDate);
    if (button === "‹") {
      newDate.setDate(selectedDate.getDate() - 7);
      handleSelectDate(newDate);
    } else {
      newDate.setDate(selectedDate.getDate() + 7);
      handleSelectDate(newDate);
    }
  }
  return (
    <div className="top-utility-bar">
      <div className="horizontal">
        <Button type="btn back-button" onClick={handleDateChange}>
          ‹
        </Button>
        <p>
          {getMonthName(selectedDate).slice(0, 3) +
            " " +
            selectedDate.getDate() +
            "-" +
            addSixToDays(selectedDate)}
        </p>
        <Button type="btn back-button" onClick={handleDateChange}>
          ›
        </Button>
      </div>
      <div className="button-container">
        <Button type="btn-main">Create Task</Button>
        <Button type="btn-plain">To Plan</Button>
      </div>
    </div>
  );
}

export default TopUtilityBar;
