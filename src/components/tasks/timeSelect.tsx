import "./timeSelect.css";
import Select from "react-select";
import { useMemo } from "react";
import {
  getEndTimeOptions,
  getEndTimeOptionsAll,
  getStartTimeOptionsAll,
} from "../../hooks/taskform/timeSelectUtils";
import type { Task, TimeOption } from "../../types/taskTypes";
import type { StylesConfig } from "react-select";
import type { TagOption } from "../../hooks/taskform/useTaskForm";

export const customStyles: StylesConfig<TagOption, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "2px",
    borderColor: "black",
    boxShadow: state.isFocused ? "0 0 0 1pxrgb(252, 252, 252)" : "none",
    "&:hover": {
      borderColor: "black",
      cursor: "text",
    },

    height: "25px",
    border: "1px, solid,rgb(83, 83, 83)",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 5px",
    display: "flex",
    alignItems: "center",
    transform: "translateY(-3px)",
    fontSize: "14px",
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    color: "black",
  }),
  option: (base, state) => {
    const { highlight, endHighlight } = state.data;
    const isDisabled = state.isDisabled;
    const isSelected = state.isSelected;
    const isFocused = state.isFocused && !isDisabled;
    let backgroundColor = "white";
    if (isDisabled) {
      backgroundColor = "rgb(245, 245, 245)";
    } else if (isSelected) {
      backgroundColor = "rgb(221, 227, 252)";
    } else if (endHighlight) {
      backgroundColor = "rgb(221, 227, 252)";
    } else if (highlight) {
      backgroundColor = "rgb(255, 245, 231)";
    }

    if (isFocused) {
      if (highlight) backgroundColor = "rgb(237, 240, 253)";
      else backgroundColor = "rgb(237, 240, 255)";
    }

    return {
      ...base,
      backgroundColor,
      color: isDisabled ? "#999" : "black",
      fontSize: "14px",
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      padding: "10px 12px",
      borderLeft: endHighlight
        ? "2px solid rgb(90, 165, 240)"
        : highlight
        ? "2px solid rgb(237, 180, 100)"
        : isSelected
        ? "2px solid rgb(90, 165, 240)"
        : "2px solid transparent",
    };
  },
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};
type TimeSelectProps = {
  onChange: (option: TimeOption) => void;
  tasks: Task[];
  date: string;
  id: string;
  startTime?: TimeOption;
  endTime?: TimeOption;
  draftTasks?: Task[];
};

function TimeSelect({
  onChange,
  tasks,
  date,
  id,
  startTime,
  endTime,
  draftTasks,
}: TimeSelectProps) {
  const startTimeOptionsAll = useMemo(() => {
    return getStartTimeOptionsAll(
      tasks,
      date,
      id,
      startTime ? startTime : undefined,
      endTime ? endTime : undefined,
      draftTasks ? draftTasks : undefined
    );
  }, [startTime, endTime, date, draftTasks]);

  const endTimeOptionsAll = useMemo(() => {
    return getEndTimeOptionsAll(
      tasks,
      date,
      id,
      true,
      draftTasks ? draftTasks : undefined
    );
  }, [date]);

  const endTimeOptions = useMemo(() => {
    return getEndTimeOptions(
      tasks,
      date,
      id,
      startTime ? startTime : undefined,
      endTimeOptionsAll,
      draftTasks
    );
  }, [startTime, endTime, endTimeOptionsAll]);

  return (
    <>
      <Select
        styles={customStyles}
        id="startTime"
        options={startTimeOptionsAll}
        placeholder="Select..."
        name="startTime"
        value={
          startTimeOptionsAll.find((option) => option.value === startTime?.value) ||
          startTime
        }
        menuPortalTarget={document.body}
        menuPosition="fixed"
        required
        onChange={(selected) => {
          selected && onChange(selected);
        }}
      />
      <p>to</p>
      <Select
        required
        styles={customStyles}
        id="endTime"
        options={endTimeOptions}
        placeholder="Select..."
        name="endTime"
        isDisabled={!startTime}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        value={
          endTimeOptions.find((option) => option.value === endTime?.value) || endTime
        }
        onChange={(selected) => {
          selected && onChange(selected);
        }}
      />
    </>
  );
}

export default TimeSelect;
