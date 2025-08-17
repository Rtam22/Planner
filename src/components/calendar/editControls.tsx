import type { modalType } from "../../types/modalTypes";
import Button from "../common/button";
import "./editControls.css";

type EditControlsProps = {
  handleShowModal: (type: modalType) => void;
  showModal: "none" | "view" | "create";
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleDraftAction: (action: "save" | "cancel" | null) => void;
  enableEditMode: () => void;
};

function EditControls({
  handleShowModal,
  showModal,
  isEditing,
  setIsEditing,
  handleDraftAction,
  enableEditMode,
}: EditControlsProps) {
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
    if (isEditing === false) {
      enableEditMode();
    }
  }

  function handleSetEditing() {
    setIsEditing(true);
    enableEditMode();
  }

  return (
    <>
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
              Edit Timeline
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default EditControls;
