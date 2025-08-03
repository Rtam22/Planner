import "./taskForm.css";
import Button from "../common/button";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { Task } from "../../types/taskTypes";
import { useTaskForm, type TagOption } from "../../hooks/taskform/useTaskForm";

type CreateTaskModal = {
  handleSelectDate: (newDate: Date) => void;
  handleCreateSave: () => void;
  selectedDate: Date;
  tasks: Task[];
};

export type TimeOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
  highlight?: boolean;
  endHighlight?: boolean;
};

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

function TaskForm({ handleCreateSave }: CreateTaskModal) {
  const {
    title,
    description,
    tag,
    repeat,
    date,
    startTime,
    endTime,
    startTimeOptionsAll,
    tagOptions,
    endTimeOptions,
    handleSetDate,
    handleSubmit,
    handleSetTitle,
    handleSetDescription,
    handleSetTime,
    handleSetRepeat,
    handleSetTag,
  } = useTaskForm({ editTimelineMode: true, currentTask: null, handleCreateSave });

  return (
    <form
      className="task-form"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(e);
      }}
    >
      <fieldset>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => handleSetTitle(e.currentTarget.value)}
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => handleSetDescription(e.currentTarget.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="tag">Tag</label>
        <Select
          styles={customStyles}
          id="tag"
          options={tagOptions}
          placeholder="Select..."
          name="tag"
          isClearable
          value={tag}
          onChange={(selected) => handleSetTag(selected)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date?.toString()}
          onChange={(e) => handleSetDate(e.currentTarget.value)}
          required
        />
      </fieldset>
      <fieldset className="time-input">
        <label htmlFor="time">Time</label>
        <div className="horizontal time">
          <div style={{ width: "100%" }}>
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
              required
              onChange={(selected) => {
                selected && handleSetTime("start", selected);
              }}
            />
          </div>
          <p>to</p>
          <div style={{ width: "100%" }}>
            <Select
              required
              styles={customStyles}
              id="endTime"
              options={endTimeOptions}
              placeholder="Select..."
              name="endTime"
              isDisabled={!startTime}
              value={
                endTimeOptions.find((option) => option.value === endTime?.value) ||
                endTime
              }
              onChange={(selected) => {
                selected && handleSetTime("end", selected);
              }}
            />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <label htmlFor="repeat">repeat</label>
        <select
          id="repeat"
          name="repeat"
          value={repeat}
          onChange={(e) => handleSetRepeat(e.currentTarget.value)}
        >
          <option value="None">None</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Fortnightly">Fortnightly</option>
        </select>
      </fieldset>
      <fieldset>
        <Button type="submit" className="btn-main">
          Save
        </Button>
      </fieldset>
    </form>
  );
}

export default TaskForm;
