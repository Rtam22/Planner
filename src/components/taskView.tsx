import { useEffect, useRef, useState } from "react";
import "./taskView.css";
import type { Task } from "./types/taskTypes";
import Button from "./button";

type TaskViewProps = {
  task: Task | null;
};

function TaskView({ task }: TaskViewProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentEdit, setCurrentEdit] = useState<
    "title" | "description" | "startTime" | "endTime" | "none"
  >("none");
  const [title, setTitle] = useState<string>(task ? task.title : "");
  const [description, setDescription] = useState<string>(
    task ? task.description : ""
  );
  const [startTime, setStartTime] = useState<string>(
    task ? task.startTime : ""
  );
  const [endTime, setEndTime] = useState<string>(task ? task.endTime : "");

  function handleSubmit() {}

  useEffect(() => {
    if (currentEdit === "description" && textAreaRef.current) {
      const element = textAreaRef.current;
      element.focus();
      element.selectionStart = element.selectionEnd = element.value.length;
    }
  }, [currentEdit]);

  function handleSave(e: React.MouseEvent<any>) {}

  function handleDelete(e: React.MouseEvent<any>) {}

  function handleCancel(e: React.MouseEvent<any>) {}

  return (
    <div className="task-view">
      {task === null ? (
        <p>Task could not be found or has been deleted</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="header"></div>
          <hr className="full-width"></hr>
          {currentEdit === "title" ? (
            <input
              className="title"
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              onBlur={() => {
                setCurrentEdit("none");
              }}
              autoFocus
            ></input>
          ) : (
            <p
              className="title"
              onClick={() => {
                setCurrentEdit("title");
              }}
            >
              {title}
            </p>
          )}
          <hr className="full-width"></hr>
          <div className="wrapper">
            <div className="col-left">
              {currentEdit === "description" ? (
                <textarea
                  ref={textAreaRef}
                  id="title"
                  name="title"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  onBlur={() => {
                    setCurrentEdit("none");
                  }}
                  autoFocus
                ></textarea>
              ) : (
                <p
                  className="description"
                  onClick={() => {
                    setCurrentEdit("description");
                  }}
                >
                  {description}
                </p>
              )}
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
              onClick={handleCancel}
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
