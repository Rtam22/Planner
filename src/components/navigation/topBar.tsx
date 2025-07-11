import "./topBar.css";
import Button from "../common/button";
import { getMonthName, addSixToDays } from "../../utils/dateUtils";
import type { modalType } from "../../types/modalTypes";

type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  handleShowModal: (type: modalType) => void;
  showModal: "none" | "view" | "create";
};

function TopUtilityBar({
  selectedDate,
  handleSelectDate,
  handleShowModal,
  showModal,
}: filterBarProps) {
  function handleDateChange(e: React.MouseEvent<HTMLDivElement>) {
    const button = e.currentTarget.textContent;
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
    <div className="top-utility-bar" data-testid="top-utility-bar">
      <div className="horizontal">
        <Button className="btn back-button" onClick={handleDateChange}>
          ‹
        </Button>
        <p data-testid="date-display-utility">
          {getMonthName(selectedDate).slice(0, 3) +
            " " +
            selectedDate.getDate() +
            "-" +
            addSixToDays(selectedDate)}
        </p>
        <Button className="btn back-button" onClick={handleDateChange}>
          ›
        </Button>
      </div>
      <div className="button-container">
        <Button
          className="btn-main"
          onClick={() =>
            handleShowModal(showModal === "create" ? "none" : "create")
          }
        >
          Create Task
        </Button>
        <Button className="btn-plain">To Plan</Button>
      </div>
    </div>
  );
}

export default TopUtilityBar;
