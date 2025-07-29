import { useEffect, useMemo, useRef, useState } from "react";
import "./taskForm.css";
import Button from "../common/button";
import { useTasksContext } from "../../context/taskContext";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { Task } from "../../types/taskTypes";
import { formatDateToYYYYMMDD, parseYYYYMMDDToDate } from "../../utils/dateUtils";
import { convert24To12HourTime } from "../../utils/timeUtils";
import {
  checkStartTimeJumpPrevTask,
  checkTaskExist,
  filterOutPreviewTask,
  getAdjustedEndTime,
  getAllTimeOptions,
  getEndTimesAfterStart,
} from "../../utils/taskFormUtils";
import { calculateChangeDateTimes } from "../../hooks/taskCardControl/dayChangeUtils";

type CreateTaskModal = {
  handleSelectDate: (newDate: Date) => void;
  handleCreateSave: () => void;
  selectedDate: Date;
  tasks: Task[];
};

type TagOption = {
  label: string;
  value: string;
  highlight?: boolean;
  endHighlight?: boolean;
};

export type TimeOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
  highlight?: boolean;
  endHighlight?: boolean;
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
  option: (base, state) => {
    const { highlight, endHighlight } = state.data;
    const isDisabled = state.isDisabled;
    const isSelected = state.isSelected;
    const isFocused = state.isFocused && !isDisabled;
    let backgroundColor = "white";
    if (isDisabled) {
      backgroundColor = "rgb(245, 245, 245)";
    } else if (isSelected) {
      backgroundColor = "rgb(221, 227, 252)";
    } else if (endHighlight) {
      backgroundColor = "rgb(221, 227, 252)";
    } else if (highlight) {
      backgroundColor = "rgb(255, 245, 231)";
    }

    if (isFocused) {
      if (highlight) backgroundColor = "rgb(237, 240, 253)";
      else backgroundColor = "rgb(237, 240, 255)";
    }

    return {
      ...base,
      backgroundColor,
      color: isDisabled ? "#999" : "black",
      fontSize: "14px",
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      padding: "10px 12px",
      borderLeft: endHighlight
        ? "2px solid rgb(90, 165, 240)"
        : highlight
        ? "2px solid rgb(237, 180, 100)"
        : isSelected
        ? "2px solid rgb(90, 165, 240)"
        : "2px solid transparent",
    };
  },
};

function TaskForm({ handleSelectDate, handleCreateSave }: CreateTaskModal) {
  const { addDraftTask, editDraftTask, tags, draftTasks, isDragging } = useTasksContext();
  const id = useRef(uuidv4());
  const tagOptions = tags.map((tag) => {
    return { label: tag.label, value: tag.label.toLowerCase() };
  });
  const [tasks, setTasks] = useState<Task[]>(draftTasks ?? []);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tag, setTag] = useState<TagOption | null>(tagOptions[0]);
  const [date, setDate] = useState<string>(() => {
    return formatDateToYYYYMMDD(new Date());
  });
  const [startTime, setStartTime] = useState<{ label: string; value: string } | null>(
    null
  );
  const [endTime, setEndTime] = useState<{ label: string; value: string } | null>(null);
  const [repeat, setRepeat] = useState<string>("");

  const draftTaskDates = useMemo(() => {
    return JSON.stringify(
      draftTasks
        ?.filter((task) => task.id !== id.current)
        .map((task) => task.date.toISOString()) ?? []
    );
  }, [draftTasks]);

  const startTimeOptionsAll = useMemo(() => {
    return getAllTimeOptions(
      parseYYYYMMDDToDate(date),
      draftTasks ? draftTasks : tasks,
      "start",
      startTime ? startTime.value : undefined,
      endTime ? endTime.value : undefined
    );
  }, [startTime, endTime, date, isDragging, draftTaskDates]);

  const endTimeOptionsAll = useMemo(() => {
    if (!isDragging) {
      return getAllTimeOptions(
        parseYYYYMMDDToDate(date),
        draftTasks ? filterOutPreviewTask(draftTasks, id.current) : tasks,
        "end"
      );
    }
    return [];
  }, [isDragging, date, draftTaskDates]);

  const draftPreview = useMemo(() => {
    if (!isDragging) {
      return draftTasks?.find((task) => task.id === id.current);
    }
  }, [isDragging, draftTasks]);

  const endTimeOptions = useMemo(() => {
    return getEndTimesAfterStart(
      startTime ? startTime.label : "12:00am",
      endTimeOptionsAll,
      parseYYYYMMDDToDate(date),
      draftTasks ? draftTasks : tasks,
      id.current
    );
  }, [startTime, endTime, endTimeOptionsAll]);

  useEffect(() => {
    if (draftTasks && !isDragging) {
      setTasks(draftTasks);
    }
  }, [isDragging, draftTaskDates]);

  useEffect(() => {
    if (!isDragging && draftPreview) {
      setEndTime({
        label: convert24To12HourTime(draftPreview.endTime),
        value: draftPreview.endTime,
      });
      setStartTime({
        label: convert24To12HourTime(draftPreview.startTime),
        value: draftPreview.startTime,
      });
      setDate(formatDateToYYYYMMDD(draftPreview.date));
    }
  }, [isDragging, draftPreview]);

  function handleSetTitle(value: string) {
    setTitle(value);
    if (!startTime || !endTime) return;
    handlePreview(startTime?.value, endTime?.value, undefined, value);
  }

  function getTaskDetails(
    preview: boolean,
    startPrev?: string,
    endPrev?: string,
    dateInput?: string,
    titleInput?: string
  ) {
    const [year, month, day] = dateInput ? dateInput.split("-") : date.split("-");
    const getTag = tags.find((t) => t.label.toLowerCase() === tag?.value.toLowerCase());
    const resolvedStartTime = preview ? startPrev : startTime?.value;
    const resolvedEndTime = preview ? endPrev : endTime?.value;
    if (!resolvedStartTime || !resolvedEndTime) return;
    return {
      id: id.current,
      title: titleInput ? titleInput : title,
      description: description,
      tag: preview ? null : getTag,
      date: new Date(Number(year), Number(month) - 1, Number(day)),
      startTime: resolvedStartTime,
      endTime: resolvedEndTime,
      repeat: repeat,
      preview: preview,
    };
  }

  function handleSetDate(newDate: string) {
    setDate(newDate);
    const newTask = getTaskDetails(false, undefined, undefined, newDate);
    if (!newTask || !draftTasks) return;
    const newTimes = calculateChangeDateTimes(newTask, draftTasks);
    if (newTimes) {
      setStartTime({
        label: convert24To12HourTime(newTimes?.startTime),
        value: newTimes?.startTime,
      });
      setEndTime({
        label: convert24To12HourTime(newTimes?.endTime),
        value: newTimes?.endTime,
      });
      handlePreview(newTimes.startTime, newTimes.endTime, newDate);
    }
  }

  function handleSetTime(type: "start" | "end", time: { label: string; value: string }) {
    if (!draftTasks) return;

    if (type === "start") {
      const newEndTimeOptions = getEndTimesAfterStart(
        time.label,
        endTimeOptionsAll,
        parseYYYYMMDDToDate(date),
        draftTasks,
        id.current
      );

      const newEndTime = getAdjustedEndTime(
        time.label,
        newEndTimeOptions,
        startTime,
        endTime
      );

      const jumpedPrevTask = checkStartTimeJumpPrevTask(
        parseYYYYMMDDToDate(date),
        draftTasks,
        id.current,
        time.value
      );

      if (newEndTime) {
        setEndTime(newEndTime);
      }

      if (!startTime) {
        setEndTime(newEndTimeOptions[0]);
        handlePreview(time.value, newEndTimeOptions[0].value);
      }
      setStartTime(time);
      if (!endTime) return;
      if (jumpedPrevTask) {
        const jumpedEndTime = newEndTimeOptions[newEndTimeOptions.length - 1];
        setEndTime(jumpedEndTime);
        handlePreview(time.value, jumpedEndTime.value);
        return;
      }
      handlePreview(time.value, newEndTime ? newEndTime.value : endTime.value);
    } else if (type === "end" && startTime) {
      setEndTime(time);
      handlePreview(startTime?.value, time.value);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!startTime || !endTime) return;
    e.preventDefault();
    const newTask = getTaskDetails(false);
    if (!newTask) return;
    if (draftPreview) {
      editDraftTask(newTask);
    } else {
      addDraftTask(newTask);
    }

    handleCreateSave();
  }

  function handlePreview(
    startPrev: string,
    endPrev: string,
    dateInput?: string,
    titleInput?: string
  ) {
    if (!dateInput) {
      if (!date) return;
    }

    const previewTask = dateInput
      ? getTaskDetails(true, startPrev, endPrev, dateInput)
      : titleInput
      ? getTaskDetails(true, startPrev, endPrev, undefined, titleInput)
      : getTaskDetails(true, startPrev, endPrev);
    const taskExists = checkTaskExist(id.current, draftTasks ? draftTasks : tasks);

    if (!previewTask) return;
    if (previewTask && taskExists) {
      editDraftTask(previewTask);
    } else {
      addDraftTask(previewTask);
    }
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
          onChange={(e) => handleSetTitle(e.currentTarget.value)}
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
          onChange={(e) => handleSetDate(e.currentTarget.value)}
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
            value={
              startTimeOptionsAll.find((option) => option.value === startTime?.value) ||
              startTime
            }
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
            value={
              endTimeOptions.find((option) => option.value === endTime?.value) || endTime
            }
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

export default TaskForm;
