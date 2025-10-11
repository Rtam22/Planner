import "./noteList.css";
import type { Note } from "./notesWidget";

type NoteListProps = {
  notes: Note[];
};

function NoteList({ notes }: NoteListProps) {
  return <div className="note-list"></div>;
}

export default NoteList;
