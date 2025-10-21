import { useState } from "react";
import "./checkListItem.css";
import type { ListItem } from "./checkListWidget";
import Button from "../../components/common/button";

type CheckListItemProps = {
  item: ListItem;
  handleSave: (newItem: ListItem) => void;
  handleDelete: (item: ListItem) => void;
};

function CheckListItem({ item, handleSave, handleDelete }: CheckListItemProps) {
  const [currentItem, setCurrentItem] = useState<ListItem>(item);

  function handleBlurSave() {
    handleSave(currentItem);
  }

  function handleCheckBox() {
    const newItem = { ...currentItem, completed: !currentItem.completed };
    setCurrentItem(newItem);
    handleSave(newItem);
  }

  return (
    <div className={`checklist-item ${currentItem.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={currentItem.completed}
        onChange={handleCheckBox}
        id="completed"
      />
      <input
        className="input-text"
        id="context"
        type="text"
        value={currentItem.content}
        onBlur={handleBlurSave}
        onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
      />
      <Button onClick={() => handleDelete(currentItem)} className="btn">
        dsa
      </Button>
    </div>
  );
}

export default CheckListItem;
