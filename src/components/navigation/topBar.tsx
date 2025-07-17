import "./topBar.css";
import Button from "../common/button";
import { getMonthName, addSixToDays } from "../../utils/dateUtils";
import type { modalType } from "../../types/modalTypes";

type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  handleShowModal: (type: modalType) => void;
  showModal: "none" | "view" | "create";
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleDraftAction: (action: "save" | "cancel" | null) => void;
  enableEditMode: () => void;
};

function TopUtilityBar({
  selectedDate,
  handleSelectDate,
  handleShowModal,
  showModal,
  isEditing,
  setIsEditing,
  handleDraftAction,
  enableEditMode,
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

  function handleCancelEdit() {
    setIsEditing(false);
    handleDraftAction("cancel");
  }

  function handleSave() {
    handleDraftAction("save");
    setTimeout(() => {
      setIsEditing(false);
    }, 80);
  }

  function handleCreateTask() {
    handleShowModal("create");
    enableEditMode();
  }

  function handleSetEditing() {
    setIsEditing(true);
    enableEditMode();
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
      {showModal === "create" ? null : (
        <div className="button-container">
          <Button className="btn-main" onClick={handleCreateTask}>
            Create Task
          </Button>
          {isEditing ? (
            <>
              <Button className="btn-plain" onClick={handleSave}>
                Save
              </Button>
              <Button className="btn-plain" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <Button className="btn-plain" onClick={handleSetEditing}>
              To Plan
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default TopUtilityBar;
