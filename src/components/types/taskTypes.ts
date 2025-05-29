export type Task = {
  id: string;
  title: string;
  description: string;
  tag?: string;
  date: Date;
  startTime: string;
  endTime: string;
  repeat: string;
};
