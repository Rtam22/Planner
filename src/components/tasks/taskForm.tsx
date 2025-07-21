import { useEffect, useMemo, useState } from "react";
import "./taskForm.css";
import Button from "../common/button";
import { useTasksContext } from "../../context/taskContext";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { Task } from "../../types/taskTypes";
import { formatDateToYYYYMMDD, parseYYYYMMDDToDate } from "../../utils/dateUtils";
import {
  getAvailableTimes,
  getTimesAfter,
  timeAMPMToMinutes,
} from "../../utils/timeUtils";
type createTaskModal = {
  handleSelectDate: (newDate: Date) => void;
  handleSetPreview: (task: Task | null) => void;
  handleCreateSave: () => void;
  selectedDate: Date;
  tasks: Task[];
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
    minWidth: "150px",
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
    backgroundColor: state.isDisabled
      ? "#f5f5f5"
      : state.isSelected
      ? "#E5EAFF"
      : state.isFocused
      ? "#F3F5FF"
      : "white",
    color: state.isDisabled ? "#999" : "black",
    padding: "10px 12px",
    fontSize: "14px",
    fontFamily: '"Inter", "Segoe UI", sans-serif',
  }),
};

function CreateTaskModal({
  handleSelectDate,
  handleSetPreview,
  handleCreateSave,
  selectedDate,
}: createTaskModal) {
  const { addDraftTask, tags, draftTasks, isDragging } = useTasksContext();
  const [tasks, setTasks] = useState<Task[]>(draftTasks ?? []);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tag, setTag] = useState<TagOption | null>();
  const [date, setDate] = useState<string>(() => {
    return formatDateToYYYYMMDD(new Date(selectedDate));
  });
  const [startTime, setStartTime] = useState<{ label: string; value: string } | null>(
    null
  );
  const [endTime, setEndTime] = useState<{ label: string; value: string } | null>(null);
  const [repeat, setRepeat] = useState<string>("");

  const tagOptions = tags.map((tag) => {
    return { label: tag.label, value: tag.label.toLowerCase() };
  });

  const [endTimeOptions, setEndTimeOptions] = useState(() =>
    getAvailableTimes(parseYYYYMMDDToDate(date), tasks, "end")
  );
  const [startTimeOptionsAll, setStartTimeOptionsAll] = useState(() =>
    getAvailableTimes(parseYYYYMMDDToDate(date), draftTasks ? draftTasks : tasks, "start")
  );

  const endTimeOptionsAll = useMemo(() => {
    if (!isDragging) {
      return getAvailableTimes(
        parseYYYYMMDDToDate(date),
        draftTasks ? draftTasks : tasks,
        "end"
      );
    }
    return [];
  }, [isDragging]);

  useEffect(() => {
    if (draftTasks && !isDragging) {
      setTasks(draftTasks);
      setStartTimeOptionsAll(
        getAvailableTimes(
          parseYYYYMMDDToDate(date),
          draftTasks ? draftTasks : tasks,
          "start"
        )
      );

      if (startTime && !isDragging) {
        setEndTimeOptions(
          getTimesAfter(
            startTime.value,
            endTimeOptionsAll,
            parseYYYYMMDDToDate(date),
            draftTasks
          )
        );
      }
    }
  }, [isDragging]);

  function handleSetTime(type: "start" | "end", time: { label: string; value: string }) {
    if (!draftTasks) {
      return;
    }
    const newEndTimeOptions = getTimesAfter(
      time.value,
      endTimeOptionsAll,
      parseYYYYMMDDToDate(date),
      draftTasks
    );
    const timeIncrements = 5;
    if (type === "start") {
      if (endTime && startTime) {
        const startMinutes = timeAMPMToMinutes(startTime.value);
        const newStartMinutes = timeAMPMToMinutes(time.value);
        const endMinutes = timeAMPMToMinutes(endTime.value);
        if (newStartMinutes > endMinutes) {
          const difference = Math.abs(startMinutes - endMinutes);
          const numberOfHops = difference / timeIncrements - 1;
          setEndTime(newEndTimeOptions[numberOfHops]);
        }
      }
      setStartTime(time);
      setEndTimeOptions(newEndTimeOptions);
    } else if (type === "end") {
      setEndTime(time);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const [year, month, day] = date.split("-");
    const getTag = tags.find((t) => t.label.toLowerCase() === tag?.value.toLowerCase());
    if (!startTime || !endTime) return;
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      title: title,
      description: description,
      tag: getTag,
      date: new Date(Number(year), Number(month) - 1, Number(day)),
      startTime: startTime?.value,
      endTime: startTime?.value,
      repeat: repeat,
    };
    handleSetPreview(null);
    addDraftTask(newTask);
    handleCreateSave();
  }
  /* 
  function handlePreview() {
    if (date === "" && startTime === "" && endTime === "") {
      return;
    }

    if (startTime === endTime) {
      return;
    }
    const [year, month, day] = date.split("-");
    const previewDate = new Date(Number(year), Number(month) - 1, Number(day));
    const getTag = tags.find((t) => t.label.toLowerCase() === tag?.value.toLowerCase());
    handleSelectDate(previewDate);
    const previewTask = {
      id: uuidv4(),
      title: title,
      description: description,
      tag: getTag,
      date: new Date(Number(year), Number(month) - 1, Number(day)),
      startTime: startTime,
      endTime: endTime,
      repeat: repeat,
    };
    handleSetPreview(previewTask);
  } */

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
          onChange={(e) => setDescription(e.currentTarget.value)}
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
          <Select
            styles={customStyles}
            id="startTime"
            options={startTimeOptionsAll}
            placeholder="Select..."
            name="startTime"
            value={startTime}
            onChange={(selected) => {
              selected && handleSetTime("start", selected);
            }}
          />
          <p>to</p>
          <Select
            styles={customStyles}
            id="endTime"
            options={endTimeOptions}
            placeholder="Select..."
            name="endTime"
            isDisabled={!startTime}
            value={endTime}
            onChange={(selected) => {
              selected && handleSetTime("end", selected);
            }}
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
