import { useState } from "react";
import "./note.css";
import type { NoteType } from "./notesWidget";

type NoteProps = {
  note: NoteType;
  handleSave: (note: NoteType) => void;
};

function Note({ note, handleSave }: NoteProps) {
  const [selectedNote, setSelectedNote] = useState<NoteType>(note);

  return (
    <div className="note">
      <textarea
        onBlur={() => handleSave(selectedNote)}
        value={selectedNote.content}
        onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
      />
    </div>
  );
}

export default Note;
