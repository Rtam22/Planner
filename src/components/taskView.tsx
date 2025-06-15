import React, { useEffect, useRef, useState } from "react";
import "./taskView.css";
import type { Task } from "./types/taskTypes";
import Button from "./button";
import type { modalType } from "./types/modalTypes";

type TaskViewProps = {
  task: Task | null;
  handleCancel: (type: modalType) => void;
};

function TaskView({ task, handleCancel }: TaskViewProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [title, setTitle] = useState<string>(task ? task.title : "");
  const [description, setDescription] = useState<string>(
    task ? task.description : ""
  );
  const [startTime, setStartTime] = useState<string>(
    task ? task.startTime : ""
  );
  const [endTime, setEndTime] = useState<string>(task ? task.endTime : "");

  function handleSubmit() {}

  function handleSave(e: React.MouseEvent<any>) {}

  function handleDelete(e: React.MouseEvent<any>) {}

  function handleTextAreaSizing(e: React.FormEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

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
            <Button onClick={handleSave} type="button" className="btn-plain-lg">
              Save
            </Button>
            <Button
              onClick={() => handleCancel("none")}
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
