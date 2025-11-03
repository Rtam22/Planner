import { useState } from "react";
import Button from "../../components/common/button";
import { baseLayout, centeredContainer, splitContainer } from "../widgetConsts";
import NoteList from "./noteList";
import "./notesWidget.css";
import Note from "./note";
import { v4 as uuidv4 } from "uuid";
import type { NotesWidgetProps, NoteType } from "../widgetTypes";

function NotesWidget({ handleSaveNotes, savedNotes }: NotesWidgetProps) {
  const [notes, setNotes] = useState<NoteType[]>(savedNotes ? savedNotes : []);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [unsaved, setUnsaved] = useState<boolean>(false);
  // const [selectedColor, setSelectedColor] = useState<string>();

  function handleSelectNote(id: string) {
    const newNote = notes.find((note) => note.id === id);
    setSelectedNote(newNote ? newNote : null);
  }

  function handleBack() {
    if (selectedNote && selectedNote.content === "") {
      handleCompleteSave();
    }
    setSelectedNote(null);
  }

  function handleCreate() {
    const newNote = { id: uuidv4(), title: "", content: "" };
    setNotes((prev) => [...prev, newNote]);
    setSelectedNote(newNote);
    setUnsaved(true);
  }

  function handleLocalSave(note: NoteType) {
    setSelectedNote(note);
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    setUnsaved(true);
  }

  function handleDelete() {
    if (selectedNote) setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
    setSelectedNote(null);
  }

  function handleCompleteSave() {
    setNotes((prev) => {
      if (unsaved) handleSaveNotes(prev);
      return prev;
    });
  }

  return (
    <div style={baseLayout} className="widget">
      {!selectedNote ? (
        <div
          className="centered"
          style={{ ...centeredContainer /*  backgroundColor: selectedColor  */ }}
        >
          <Button
            className="btn"
            style={{ fontSize: 18, transform: "translateY(-3px)" }}
            onClick={handleCreate}
          >
            +
          </Button>
        </div>
      ) : (
        <div style={splitContainer}>
          <div>
            <Button className="btn-plain" onClick={handleBack}>
              Back
            </Button>
          </div>
          <div className="button-container">
            <Button className="btn-plain" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
      {selectedNote ? (
        <Note handleSave={handleLocalSave} note={selectedNote} />
      ) : (
        <NoteList notes={notes} handleClick={handleSelectNote} />
      )}
    </div>
  );
}

export default NotesWidget;
