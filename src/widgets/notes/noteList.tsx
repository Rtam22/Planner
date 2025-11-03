import { innerContainer } from "../widgetConsts";
import type { NoteType } from "../widgetTypes";
import "./noteList.css";

type NoteListProps = {
  notes: NoteType[];
  handleClick: (id: string) => void;
};

function NoteList({ notes, handleClick }: NoteListProps) {
  return (
    <div style={innerContainer}>
      {notes.map((note) => {
        return (
          <div className="note-item" key={note.id} onClick={() => handleClick(note.id)}>
            <div className="color-box"></div>
            <p>{note.content}</p>
          </div>
        );
      })}
    </div>
  );
}

export default NoteList;
