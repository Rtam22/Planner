import "./topUtilityBar.css";
import Button from "./button";
import { getMonthName, addSixToDays } from "../utils/dateUtils";
import { useState } from "react";

type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  handleShowModal: (modal: string) => void;
};

function TopUtilityBar({
  selectedDate,
  handleSelectDate,
  handleShowModal,
}: filterBarProps) {
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
        <Button type="btn-main" onClick={() => handleShowModal("createTask")}>
          Create Task
        </Button>
        <Button type="btn-plain">To Plan</Button>
      </div>
    </div>
  );
}

export default TopUtilityBar;
