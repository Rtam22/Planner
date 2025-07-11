import React, { useRef, useState } from "react";
import "./taskView.css";
import type { Task } from "../../types/taskTypes";
import Button from "../common/button";
import type { modalType } from "../../types/modalTypes";
import Calendar from "../calendar/calendar";

type TaskViewProps = {
  task: Task | null;
  onCancel: (type: modalType) => void;
  onSave: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function TaskView({ task, onCancel, onSave, onDelete }: TaskViewProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [title, setTitle] = useState<string>(task?.title ?? "");
  const [description, setDescription] = useState<string>(
    task ? task.description : ""
  );
  const [startTime, setStartTime] = useState<string>(
    task ? task.startTime : ""
  );
  console.log(task?.endTime);
  const [endTime, setEndTime] = useState<string>(task?.endTime ?? "");
  const [date, setDate] = useState<Date>(task?.date ?? new Date());
  const [repeat, setRepeat] = useState<string>(task?.repeat ?? "");
  const currentTaskDate = task?.date ? [task.date] : [];
  function handleSubmit(e: React.MouseEvent<any>) {
    e.preventDefault();
    if (!task) return;
    const updatedTask: Task = {
      id: task.id,
      title: title,
      description: description,
      date: date,
      startTime: startTime,
      endTime: endTime,
      repeat: repeat,
      tag: task.tag,
    };
    onSave(updatedTask);
    onCancel("none");
  }

  function handleDelete() {
    if (!task) return;
    onDelete(task);
    onCancel("none");
  }

  function handleSelectDate(date: Date) {
    setDate(date);
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
          <form onSubmit={handleSubmit}>
            <hr className="full-width"></hr>
            <input
              className="title"
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
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
                      setDescription(e.currentTarget.value);
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
                      selectedDate={date}
                      handleSelectDate={handleSelectDate}
                      highlightSecondary={currentTaskDate}
                    />
                  </fieldset>
                  <fieldset>
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.currentTarget.value);
                      }}
                    ></input>
                  </fieldset>
                  <fieldset>
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.currentTarget.value);
                      }}
                    ></input>
                  </fieldset>
                  <fieldset>
                    <label htmlFor="repeat">Repeat</label>
                    <select
                      name="repeat"
                      id="repeat"
                      value={repeat}
                      onChange={(e) => setRepeat(e.currentTarget.value)}
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
              <Button
                onClick={handleDelete}
                type="button"
                className="btn-plain-lg warn"
              >
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
