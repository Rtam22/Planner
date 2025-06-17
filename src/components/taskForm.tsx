import { useState } from "react";
import "./taskForm.css";
import Button from "./button";
import { useTasksContext } from "../context/taskContext";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { PreviewTask } from "./types/taskTypes";

type createTaskModal = {
  handleSelectDate: (newDate: Date) => void;
  handleSetPreview: (task: PreviewTask) => void;
  clearTaskPreview: () => void;
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
  handleSelectDate,
  handleSetPreview,
  clearTaskPreview,
}: createTaskModal) {
  const [title, setTitle] = useState<string>("");
  const [description, setDscription] = useState<string>("");
  const [tag, setTag] = useState<TagOption | null>();
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [repeat, setRepeat] = useState<string>("");

  const { addTask, tags } = useTasksContext();
  const tagOptions = tags.map((tag) => {
    return { label: tag.value, value: tag.value.toLowerCase() };
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const [year, month, day] = date.split("-");
    const getTag = tags.find(
      (t) => t.value.toLowerCase() === tag?.value.toLowerCase()
    );

    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      title: title,
      description: description,
      tag: getTag,
      date: new Date(Number(year), Number(month) - 1, Number(day)),
      startTime: startTime,
      endTime: endTime,
      repeat: repeat,
    };
    clearTaskPreview();
    addTask(newTask);
  }

  function handlePreview() {
    console.log(startTime);
    if (date === "" && startTime === "" && endTime === "") {
      return;
    }

    if (startTime === endTime) {
      console.log("no");
      return;
    }
    const [year, month, day] = date.split("-");
    const previewDate = new Date(Number(year), Number(month) - 1, Number(day));
    handleSelectDate(previewDate);
    const previewTask = {
      date: new Date(Number(year), Number(month) - 1, Number(day)),
      startTime: startTime,
      endTime: endTime,
    };
    handleSetPreview(previewTask);
  }

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
        <div className="horizontal time">
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
          <Button
            type="button"
            className="btn-secondary"
            onClick={handlePreview}
          >
            Preview
          </Button>
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

export default CreateTaskModal;
