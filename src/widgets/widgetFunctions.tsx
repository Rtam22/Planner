import type { Board } from "../pages/homePage";
import type { ListItem } from "./checkList/checkListWidget";
import CheckListWidget from "./checkList/checkListWidget";
import CountdownWidget from "./countdown/countdownWidget";
import NotesWidget from "./notes/notesWidget";
import type { AllWidgetTypes } from "./widgetConsts";
import type { NoteType, SaveDispatcher, Widget } from "./widgetTypes";
import { v4 as uuidv4 } from "uuid";

export function renderWidget(widget: Widget, board: Board, handleSave: SaveDispatcher) {
  const selectedWidget = board.widgets.find((w) => w.id === widget.id);
  switch (widget.type) {
    case "notes":
      const onSaveNotes = (notes: NoteType[]) => {
        handleSave("notes", notes, widget.id);
      };
      return (
        <NotesWidget
          savedNotes={selectedWidget ? selectedWidget.savedContent : null}
          widgetId={widget.id}
          boardId={board.id}
          handleSaveNotes={onSaveNotes}
        />
      );
    case "checklist":
      return <CheckListWidget />;
    case "countdown":
      return <CountdownWidget />;
    default:
      return null;
  }
}

export function createWidget(type: AllWidgetTypes): Widget {
  switch (type) {
    case "notes":
      return { id: uuidv4(), type, savedContent: [] as NoteType[] };
    case "checklist":
      return { id: uuidv4(), type, savedContent: [] as ListItem[] };
    case "countdown":
      return { id: uuidv4(), type, savedContent: null };
  }
}
