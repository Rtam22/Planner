import "./boardTabs.css";
import type { Board } from "../../pages/homePage";
import Button from "../common/button";
import { useEffect, useRef, useState } from "react";

type BoardTabsProps = {
  boards: Board[] | null;
  selectedBoard: Board;
  onSelect: (board: Board) => void;
  onAdd: () => void;
  onRename: (toEdit: EditTitle) => void;
};

export type EditTitle = {
  title: string;
  id: string;
};

function boardTabs({ boards, selectedBoard, onSelect, onAdd, onRename }: BoardTabsProps) {
  const [editingTitle, setEditingTitle] = useState<EditTitle | null>();
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const width = "120px";
  const height = "27px";

  useEffect(() => {
    if (isEditing !== null && inputRef) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function handleRename(toEdit: EditTitle) {
    setIsEditing(true);
    setEditingTitle(toEdit);
  }

  function handleSaveRename() {
    if (!isEditing || !editingTitle) return;
    setIsEditing(false);
    setEditingTitle(null);
    onRename(editingTitle);
  }

  const activeBackgroundColor = "#6973A7";
  return (
    <div className="tabs-container">
      {boards?.map((board) => {
        const isActive = selectedBoard.id === board.id;
        const isThisEditing = isEditing && editingTitle?.id === board.id;
        return (
          <div
            onClick={() => isActive && handleRename({ title: board.title, id: board.id })}
            className={`button-container ${isActive ? "active" : ""}`}
          >
            {isThisEditing ? (
              <input
                ref={inputRef}
                onBlur={handleSaveRename}
                value={editingTitle.title}
                style={{ width: width, height: height, textAlign: "center" }}
                onChange={(e) =>
                  setEditingTitle((prev) =>
                    prev ? { ...prev, title: e.target.value } : prev
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveRename();
                  if (e.key === "Escape") setIsEditing(false);
                }}
              ></input>
            ) : (
              <Button
                className="btn"
                onClick={() => onSelect(board)}
                width={width}
                height={height}
                active={isActive}
                activeColor="white"
                activeBackgroundColor={activeBackgroundColor}
              >
                {isEditing && isActive ? editingTitle?.title : board.title}
              </Button>
            )}
          </div>
        );
      })}
      <div className="button-container">
        <Button className="btn" height="27px" width="40px" onClick={() => onAdd()}>
          +
        </Button>
      </div>
    </div>
  );
}

export default boardTabs;
