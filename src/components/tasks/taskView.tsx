import React, { useEffect, useRef } from "react";
import "./taskView.css";
import type { Task } from "../../types/taskTypes";
import Button from "../common/button";
import type { modalType } from "../../types/modalTypes";
import Calendar from "../calendar/calendar";
import { useTaskForm } from "../../hooks/taskform/useTaskForm";
import { customStyles } from "./taskForm";
import { formatDateToYYYYMMDD, parseYYYYMMDDToDate } from "../../utils/dateUtils";
import Select from "react-select";
import { convert24To12HourTime } from "../../utils/timeUtils";

type TaskViewProps = {
  task: Task | null;
  onCancel: (type: modalType) => void;
  onDelete: (task: Task) => void;
};

function TaskView({ task, onCancel, onDelete }: TaskViewProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    title,
    description,
    startTime,
    endTime,
    date,
    repeat,
    startTimeOptionsAll,
    endTimeOptions,
    handleSetTitle,
    handleSetDescription,
    handleSetDate,
    handleSetTime,
    handleSetRepeat,
    handleSubmit,
  } = useTaskForm({
    editTimelineMode: false,
    currentTask: task ? task : null,
  });

  useEffect(() => {
    if (task) {
      handleSetTitle(task.title);
      handleSetDescription(task.description);
      handleSetDate(formatDateToYYYYMMDD(task.date));
      handleSetTime("start", {
        label: convert24To12HourTime(task.startTime),
        value: task.startTime,
      });
      handleSetTime("end", {
        label: convert24To12HourTime(task.endTime),
        value: task.endTime,
      });
      handleSetRepeat(task.repeat);
    }
  }, []);

  const currentTaskDate = task?.date ? [task.date] : [];

  function handleSave(e: React.MouseEvent<any>) {
    e.preventDefault();
    handleSubmit(e);
    onCancel("none");
  }

  function handleDelete() {
    if (!task) return;
    onDelete(task);
    onCancel("none");
  }

  function handleTextAreaSizing(e: React.FormEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  task === null && <div>Task not found</div>;

  return (
    <div className="task-view">
      {task === null ? (
        <p>Task could not be found or has been deleted</p>
      ) : (
        <>
          {task.tag && (
            <div className="horizontal">
              <span className="horizontal">
                <p style={{ color: task.tag.color }}>#</p>
                <p>{task.tag.label}</p>
              </span>
            </div>
          )}
          <form onSubmit={handleSave}>
            <hr className="full-width"></hr>
            <input
              className="title"
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => handleSetTitle(e.currentTarget.value)}
            ></input>
            <hr className="full-width"></hr>
            <div className="wrapper">
              <div className="col-left">
                <div>
                  <textarea
                    rows={1}
                    onInput={handleTextAreaSizing}
                    onFocus={handleTextAreaSizing}
                    ref={textAreaRef}
                    id="title"
                    name="title"
                    value={description}
                    onChange={(e) => {
                      handleSetDescription(e.currentTarget.value);
                    }}
                  ></textarea>
                </div>
              </div>
              <hr className="full-width-horizontal"></hr>
              <div className="col-right">
                <div className="container">
                  <fieldset>
                    <Calendar
                      showToday={false}
                      selectedDate={parseYYYYMMDDToDate(date)}
                      handleSelectDate={handleSetDate}
                      highlightSecondary={currentTaskDate}
                      height="280"
                    />
                  </fieldset>
                  <fieldset className="time-input">
                    <Select
                      styles={customStyles}
                      id="startTime"
                      options={startTimeOptionsAll}
                      placeholder="Select..."
                      name="startTime"
                      value={
                        startTimeOptionsAll.find(
                          (option) => option.value === startTime?.value
                        ) || startTime
                      }
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      required
                      onChange={(selected) => {
                        selected && handleSetTime("start", selected);
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
                        endTimeOptions.find(
                          (option) => option.value === endTime?.value
                        ) || endTime
                      }
                      onChange={(selected) => {
                        selected && handleSetTime("end", selected);
                      }}
                    />
                  </fieldset>
                  <fieldset>
                    <label htmlFor="repeat">Repeat</label>
                    <select
                      name="repeat"
                      id="repeat"
                      value={repeat}
                      onChange={(e) => handleSetRepeat(e.currentTarget.value)}
                    >
                      <option value="None">None</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Fortnightly">Fortnightly</option>
                    </select>
                  </fieldset>
                </div>
              </div>
            </div>
            <hr />
            <div className=" button-container">
              <Button type="submit" className="btn-plain-lg">
                Save
              </Button>
              <Button
                onClick={() => onCancel("none")}
                type="button"
                className="btn-plain-lg"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} type="button" className="btn-plain-lg warn">
                Delete
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default TaskView;
