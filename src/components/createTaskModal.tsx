import { useState } from "react";
import "./createTaskModal.css";
import Button from "./button";
import { useTasksContext } from "../context/taskContext";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { Tag } from "./types/taskTypes";

type createTaskModal = {
  showCreateModal: boolean;
  handleShowModal: (modal: string) => void;
};

type TagOption = {
  label: string;
  value: string;
};

const customStyles: StylesConfig<TagOption, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "2px",
    borderColor: "black",
    boxShadow: state.isFocused ? "0 0 0 1pxrgb(252, 252, 252)" : "none",
    "&:hover": {
      borderColor: "black",
      cursor: "text",
    },
    height: "30px",
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
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#E5EAFF"
      : state.isFocused
      ? "#F3F5FF"
      : "white",
    color: state.isSelected ? "black" : "black",
    padding: "10px 12px",
    fontSize: "14px",
    fontFamily: '"Inter", "Segoe UI", sans-serif',
  }),
};

function CreateTaskModal({
  handleShowModal,
  showCreateModal,
}: createTaskModal) {
  const [title, setTitle] = useState<string>("");
  const [description, setDscription] = useState<string>("");
  const [tag, setTag] = useState<TagOption | null>();
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [repeat, setRepeat] = useState<string>("");

  const { tasks, addTask, tags } = useTasksContext();
  const tagOptions = tags.map((tag) => {
    return { label: tag.value, value: tag.value.toLowerCase() };
  });
  console.log(tagOptions);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const getTag = tags.find(
      (t) => t.value.toLowerCase() === tag?.value.toLowerCase()
    );
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      title: title,
      description: description,
      tag: getTag,
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
            required
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
          <Select
            styles={customStyles}
            id="tag"
            options={tagOptions}
            name="tag"
            value={tag}
            onChange={(selected) => setTag(selected)}
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
            required
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
              required
            />
            <p>to</p>
            <input
              type="time"
              name="time"
              id="time"
              value={endTime?.toString()}
              onChange={(e) => setEndTime(e.currentTarget.value)}
              required
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
