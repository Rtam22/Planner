export type Task = {
  id: string;
  title: string;
  description: string;
  tag?: Tag | null;
  date: Date;
  startTime: string;
  endTime: string;
  repeat: string;
  preview: boolean;
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
