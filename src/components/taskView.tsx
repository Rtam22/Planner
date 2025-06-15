import React, { useRef, useState } from "react";
import "./taskView.css";
import type { Task } from "./types/taskTypes";
import Button from "./button";
import type { modalType } from "./types/modalTypes";

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
  const [endTime, setEndTime] = useState<string>(task?.endTime ?? "");
  const [date, setDate] = useState<Date>(task?.date ?? new Date());

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
      repeat: task.repeat,
      tag: task.tag,
    };
    onSave(updatedTask);
    onCancel("none");
  }

  console.log(task?.date);

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
        <form onSubmit={handleSubmit}>
          <div className="header"></div>
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
                  <label htmlFor=""></label>
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
      )}
    </div>
  );
}

export default TaskView;
