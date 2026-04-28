import type { ListItem } from "./checkList/checkListWidget";

type BaseWidget = {
  boardId: string;
  widgetId: string;
};

export type NoteType = {
  id: string;
  content: string;
};

export type Widget =
  | { id: string; type: "notes"; savedContent: NoteType[] | null }
  | { id: string; type: "checklist"; savedContent: ListItem[] }
  | { id: string; type: "countdown"; savedContent: null };

export type NotesWidgetProps = BaseWidget & {
  handleSaveNotes: (notes: NoteType[]) => void;
  savedNotes: NoteType[] | null;
};

export type WidgetContent = NoteType[] | ListItem[] | null;

export type SaveDispatcher = ((
  type: "notes",
  content: NoteType[] | null,
  widgetId: string
) => void) &
  ((type: "checklist", content: ListItem[], widgetId: string) => void) &
  ((type: "countdown", content: null, widgetId: string) => void);
