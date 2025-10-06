import React, { useEffect, useRef, useState } from "react";
import "./taskView.css";
import type { Task, TaskForm, TimeOption } from "../../types/taskTypes";
import Button from "../common/button";
import type { modalType } from "../../types/modalTypes";
import Calendar from "../calendar/calendar";
import { formatDateToYYYYMMDD } from "../../utils/dateUtils";
import { convert24To12HourTime } from "../../utils/timeUtils";
import { useTasksContext } from "../../context/taskContext";
import TimeSelect from "./timeSelect";

type TaskViewProps = {
  task: Task | null;
  onCancel: (type: modalType) => void;
  onDelete: (task: Task) => void;
};

function TaskView({ task, onCancel, onDelete }: TaskViewProps) {
  const { tasks } = useTasksContext();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [taskDetails, setTaskDetails] = useState<TaskForm>(setInitialTaskDetails());
  const { editTask } = useTasksContext();

  function getTimeLabel(time: string) {
    const result: TimeOption = { label: convert24To12HourTime(time), value: time };
    return result;
  }

  function setInitialTaskDetails() {
    const taskDetails = task
      ? {
          id: task.id,
          title: task.title,
          description: task.description,
          tag: task.tag,
          date: task.date,
          startTime: getTimeLabel(task.startTime),
          endTime: getTimeLabel(task.endTime),
          repeat: task.repeat,
          preview: false,
        }
      : {
          id: "",
          title: "",
          description: "",
          tag: null,
          date: new Date(),
          startTime: { label: "", value: "" },
          endTime: { label: "", value: "" },
          repeat: "",
          preview: false,
        };
    return taskDetails;
  }

  useEffect(() => {
    handleTextAreaSizing();
  }, [taskDetails.description]);

  const currentTaskDate = task?.date ? [task.date] : [];

  function handleSave(e: React.MouseEvent<any>) {
    e.preventDefault();
    const newTask: Task = {
      ...taskDetails,
      startTime: taskDetails.startTime.value,
      endTime: taskDetails.endTime.value,
    };
    editTask(newTask);
    onCancel("none");
  }

  function handleDelete() {
    if (!task) return;
    onDelete(task);
    onCancel("none");
  }

  function handleDate(date: Date) {
    setTaskDetails({ ...taskDetails, date: date });
  }

  function handleTextAreaSizing() {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  function handleTimeChange() {}

  task === null && <div>Task not found</div>;

  return (
    <div className="task-view">
      {task === null ? (
        <p>Task could not be found or has been deleted</p>
      ) : (
        <>
          {task.tag && (
            <div className="horizontal tag-container">
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
              value={taskDetails.title}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, title: e.currentTarget.value })
              }
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
                    value={taskDetails.description}
                    onChange={(e) =>
                      setTaskDetails({
                        ...taskDetails,
                        description: e.currentTarget.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <hr className="full-width-horizontal"></hr>
              <div className="col-right">
                <div className="container">
                  <fieldset>
                    <Calendar
                      showToday={false}
                      selectedDate={taskDetails.date}
                      onCellClick={handleDate}
                      highlightSecondary={currentTaskDate}
                      height="280"
                      size="small"
                    />
                  </fieldset>
                  <fieldset className="time-input">
                    <TimeSelect
                      onChange={handleTimeChange}
                      tasks={tasks}
                      date={formatDateToYYYYMMDD(taskDetails.date)}
                      id={taskDetails.id}
                      startTime={taskDetails.startTime}
                      endTime={taskDetails.endTime}
                    ></TimeSelect>
                  </fieldset>
                  <fieldset>
                    <label htmlFor="repeat">Repeat</label>
                    <select
                      name="repeat"
                      id="repeat"
                      value={taskDetails.repeat}
                      onChange={(e) =>
                        setTaskDetails({ ...taskDetails, repeat: e.currentTarget.value })
                      }
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
