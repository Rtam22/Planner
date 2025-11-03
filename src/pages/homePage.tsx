import { useMemo, useRef, useState } from "react";
import Grid from "../components/common/grid";
import TopBar from "../components/navigation/topBar";
import "./homePage.css";
import Button from "../components/common/button";
import NotesWidget from "../widgets/notes/notesWidget";
import BoardTabs, { type EditTitle } from "../components/dashboard/boardTabs";
import { v4 as uuidv4 } from "uuid";
import CheckListWidget, { type ListItem } from "../widgets/checkList/checkListWidget";
import CountdownWidget from "../widgets/countdown/countdownWidget";
import DropDown from "../components/common/dropdown";
import { allWidgetTitles, type AllWidgetTypes } from "../widgets/widgetConsts";
import type { NoteType, Widget } from "../widgets/widgetTypes";

export type Board = {
  id: string;
  title: string;
  widgets: Widget[];
};

function HomePage() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: uuidv4(),
      title: "General",
      widgets: [
        { id: uuidv4(), type: "notes", savedContent: [] },
        { id: uuidv4(), type: "checklist", savedContent: [] },
        { id: uuidv4(), type: "countdown", savedContent: null },
      ],
    },
    { id: uuidv4(), title: "Notes", widgets: [] },
  ]);

  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0].id);

  const selectedBoard = useMemo(
    () => boards.find((b) => b.id === selectedBoardId) ?? null,
    [boards, selectedBoardId]
  );

  function handleCreateBoard() {
    const newBoard: Board = { id: uuidv4(), title: "Untitled", widgets: [] };
    setBoards([...boards, newBoard]);
  }

  function handleSelectBoard(board: Board) {
    setSelectedBoardId(board.id);
  }

  function renderWidget(widget: Widget, board: Board) {
    const selectedWidget = board.widgets.find((w) => w.id === widget.id);
    switch (widget.type) {
      case "notes":
        return (
          <NotesWidget
            savedNotes={selectedWidget ? selectedWidget.savedContent : null}
            widgetId={widget.id}
            boardId={board.id}
            handleSaveNotes={handleSaveItems}
          />
        );
      case "checklist":
        return <CheckListWidget />;
      case "countdown":
        return <CountdownWidget />;
    }
  }

  function createWidget(type: AllWidgetTypes): Widget {
    switch (type) {
      case "notes":
        return { id: uuidv4(), type, savedContent: [] as NoteType[] };
      case "checklist":
        return { id: uuidv4(), type, savedContent: [] as ListItem[] };
      case "countdown":
        return { id: uuidv4(), type, savedContent: null };
    }
  }

  function handleSaveItems() {}

  function addWidget(item: AllWidgetTypes) {
    setBoards((prev) => {
      return prev.map((board) =>
        board.id === selectedBoardId
          ? {
              ...board,
              widgets: [...board.widgets, createWidget(item)],
            }
          : board
      );
    });
  }

  function handleRenameBoard(boardDetails: EditTitle) {
    setBoards((prev) => {
      const updated = prev.map((prevBoard) =>
        prevBoard.id === boardDetails.id
          ? { ...prevBoard, title: boardDetails.title }
          : prevBoard
      );
      return updated;
    });
  }
  const [addDropDown, setAddDropDown] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  return (
    <div className="dashboard">
      <TopBar left={<h3>Planner Dashboard</h3>} />
      <div className="weather-container"></div>
      <div className="split-container">
        <BoardTabs
          boards={boards}
          onSelect={handleSelectBoard}
          onAdd={handleCreateBoard}
          selectedBoardId={selectedBoardId}
          onRename={handleRenameBoard}
        />
        <div className="container">
          <Button className="btn-plain" onClick={() => setAddDropDown(!addDropDown)}>
            Add
          </Button>
          <Button className="btn-plain">Edit</Button>
          <Button className="btn-plain">Delete</Button>
          {addDropDown && (
            <DropDown
              ref={dropdownRef}
              items={[...allWidgetTitles]}
              onClick={addWidget}
            />
          )}
        </div>
      </div>
      <Grid>
        {selectedBoard &&
          selectedBoard.widgets?.map((widget, index) => {
            return (
              <div style={{ width: "100%", height: "100%" }} key={index}>
                {renderWidget(widget, selectedBoard)}
              </div>
            );
          })}
      </Grid>
    </div>
  );
}

export default HomePage;
