import type { ListItem } from "./checkList/checkListWidget";

type baseWidget = {
  boardId: string;
  widgetId: string;
};

export type NoteType = {
  id: string;
  content: string;
};

export type Widget =
  | {
      id: string;
      type: "notes";
      savedContent: NoteType[] | null;
    }
  | {
      id: string;
      type: "checklist";
      savedContent: ListItem[];
    }
  | {
      id: string;
      type: "countdown";
      savedContent: null;
    };

export type NotesWidgetProps = baseWidget & {
  handleSaveNotes: (notes: NoteType[]) => void;
  savedNotes: NoteType[] | null;
};
