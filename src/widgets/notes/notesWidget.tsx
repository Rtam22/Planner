import { useState } from "react";
import Button from "../../components/common/button";
import { baseLayout } from "../widgetConsts";
import NoteList from "./noteList";
import "./notesWidget.css";

export type Note = {
  id: string;
  title: string;
  content: string;
};

function NotesWidget() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "dsa", title: "string", content: "string" },
  ]);
  return (
    <div style={baseLayout} className="notes-widget">
      <div className="split-container">
        <div>
          <Button className="btn-plain">Search</Button>
        </div>
        <div>
          <Button className="btn-plain">New</Button>
        </div>
      </div>
      <NoteList notes={notes} />
    </div>
  );
}

export default NotesWidget;
