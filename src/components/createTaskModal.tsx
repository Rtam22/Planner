import { useState } from "react";
import "./createTaskModal.css";
import Button from "./button";
import { useTasksContext } from "../context/taskContext";
import { v4 as uuidv4 } from "uuid";

type createTaskModal = {
  showCreateModal: boolean;
  handleShowModal: (modal: string) => void;
};
function CreateTaskModal({
  handleShowModal,
  showCreateModal,
}: createTaskModal) {
  const [title, setTitle] = useState<string>("");
  const [description, setDscription] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [repeat, setRepeat] = useState<string>("");

  const { tasks, addTask } = useTasksContext();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      title: title,
      description: description,
      tag: tag,
      date: new Date(),
      startTime: startTime,
      endTime: endTime,
      repeat: repeat,
    };
    addTask(newTask);
  }

  return (
    <div className={`create-task-modal ${showCreateModal ? "" : "hidden"}`}>
      <div className="header-color"></div>
      <div className="header">
        <div></div>
        <Button
          type="btn-plain btn-ext"
          onClick={() => handleShowModal("createModal")}
        >
          X
        </Button>
      </div>
      <form
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
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDscription(e.currentTarget.value)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            name="tag"
            value={tag}
            onChange={(e) => setTag(e.currentTarget.value)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date?.toString()}
            onChange={(e) => setDate(e.currentTarget.value)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="time">Time</label>
          <div className="horizontal">
            <input
              type="time"
              id="time"
              name="time"
              value={startTime?.toString()}
              onChange={(e) => setStartTime(e.currentTarget.value)}
            />
            <p>to</p>
            <input
              type="time"
              name="time"
              id="time"
              value={endTime?.toString()}
              onChange={(e) => setEndTime(e.currentTarget.value)}
            />
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="repeat">repeat</label>
          <select
            id="repeat"
            name="repeat"
            value={repeat}
            onChange={(e) => setRepeat(e.currentTarget.value)}
          >
            <option value="1"> 1</option>
            <option value="2"> 2</option>
          </select>
        </fieldset>
        <fieldset>
          <Button type="btn-main">Save</Button>
        </fieldset>
      </form>
    </div>
  );
}

export default CreateTaskModal;
