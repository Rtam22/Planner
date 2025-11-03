import "./note.css";
import type { NoteType } from "../widgetTypes";

type NoteProps = {
  note: NoteType;
  handleSave: (note: NoteType) => void;
};

function Note({ note, handleSave }: NoteProps) {
  return (
    <div className="note">
      <textarea
        value={note.content}
        onChange={(e) => handleSave({ ...note, content: e.target.value })}
      />
    </div>
  );
}

export default Note;
