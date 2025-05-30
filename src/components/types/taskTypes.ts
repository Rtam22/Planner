import type { Input } from "react-select/animated";

export type Task = {
  id: string;
  title: string;
  description: string;
  tag?: Tag | null;
  date: Date;
  startTime: string;
  endTime: string;
  repeat: string;
};

export type Tag = {
  label: string;
  value: string;
  color: string;
};
