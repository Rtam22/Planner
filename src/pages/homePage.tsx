import { useState } from "react";
import Grid from "../components/common/grid";
import TopBar from "../components/navigation/topBar";
import "./homePage.css";
import Button from "../components/common/button";
import NotesWidget from "../widgets/notes/notesWidget";
import BoardTabs, { type EditTitle } from "../components/dashboard/boardTabs";
import { v4 as uuidv4 } from "uuid";
import CheckListWidget from "../widgets/checkList/checkListWidget";

type Widgets = "notes" | "checkList";

export type Board = {
  id: string;
  title: string;
  widgets: Widgets[] | null;
};
function HomePage() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: uuidv4(),
      title: "General",
      widgets: ["notes", "checkList"],
    },
    { id: uuidv4(), title: "Notes", widgets: null },
  ]);
  const [selectedBoard, setSelectedBoard] = useState<Board>(
    boards ? boards[0] : { id: uuidv4(), title: "Notes", widgets: null }
  );

  function handleCreateBoard() {
    const newBoard: Board = { id: uuidv4(), title: "Untitled", widgets: null };
    setBoards([...boards, newBoard]);
  }

  function handleSelectBoard(board: Board) {
    setSelectedBoard(board);
  }

  function renderWidget(widget: Widgets) {
    switch (widget) {
      case "notes":
        return <NotesWidget />;
      case "checkList":
        return <CheckListWidget />;
    }
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

  return (
    <div className="dashboard">
      <TopBar left={<h3>Planner Dashboard</h3>} />
      <div className="weather-container"></div>
      <div className="split-container">
        <BoardTabs
          boards={boards}
          onSelect={handleSelectBoard}
          onAdd={handleCreateBoard}
          selectedBoard={selectedBoard}
          onRename={handleRenameBoard}
        />
        <div className="container">
          <Button className="btn-plain">Add</Button>
          <Button className="btn-plain">Edit</Button>
          <Button className="btn-plain">Delete</Button>
        </div>
      </div>
      <Grid>
        {selectedBoard.widgets?.map((widget) => {
          return renderWidget(widget);
        })}
      </Grid>
    </div>
  );
}

export default HomePage;
