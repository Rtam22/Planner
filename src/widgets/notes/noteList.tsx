import "./noteList.css";
import type { NoteType } from "./notesWidget";

type NoteListProps = {
  notes: NoteType[];
  handleClick: (id: string) => void;
};

function NoteList({ notes, handleClick }: NoteListProps) {
  return (
    <div className="note-list">
      {notes.map((note) => {
        return (
          <div className="note-item" key={note.id} onClick={() => handleClick(note.id)}>
            {note.content}
          </div>
        );
      })}
    </div>
  );
}

export default NoteList;
