import "./taskForm.css";
import Button from "../common/button";
import Select from "react-select";

import type { Task } from "../../types/taskTypes";
import { useTaskForm } from "../../hooks/taskform/useTaskForm";
import { useEffect } from "react";
import { customStyles } from "./timeSelect";

type CreateTaskModal = {
  handleSelectDate: (newDate: Date) => void;
  handleCreateSave: () => void;
  selectedDate: Date;
  tasks: Task[];
  showModal: "none" | "view" | "create";
  hasDraft: boolean;
};

export type TimeOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
  highlight?: boolean;
  endHighlight?: boolean;
};

function TaskForm({ handleCreateSave, showModal, hasDraft }: CreateTaskModal) {
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
    handleClear,
  } = useTaskForm({
    editTimelineMode: true,
    currentTask: null,
    handleCreateSave,
    hasDraft,
  });

  useEffect(() => {
    if (showModal !== "create") handleClear();
  });

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
          disabled
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
