type BaseTask = {
  id: string;
  title: string;
  description: string;
  tag?: Tag | null;
  date: Date;
  repeat: string;
  preview: boolean;
  status?: "completed" | "overdue" | "current" | null;
};

export type Task = BaseTask & {
  startTime: string;
  endTime: string;
};

export type TimeOption = { label: string; value: string };

export type TaskForm = BaseTask & {
  startTime: TimeOption;
  endTime: TimeOption;
};

export type Tag = {
  label: string;
  color: string;
};

export type PreviewTask = {
  date: Date;
  startTime: string;
  endTime: string;
};
