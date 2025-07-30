import { useEffect, useMemo, useRef, useState } from "react";
import { useTasksContext } from "../../context/taskContext";
import { v4 as uuidv4 } from "uuid";
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
} from "./taskFormUtils";
import { calculateChangeDateTimes } from "../../hooks/taskCardControl/dayChangeUtils";

export type TagOption = {
  label: string;
  value: string;
  highlight?: boolean;
  endHighlight?: boolean;
};

type TaskFormProps = {
  editTimelineMode: boolean;
  currentTask: Task | null;
  handleCreateSave?: () => void;
};

export function useTaskForm({
  editTimelineMode,
  currentTask,
  handleCreateSave,
}: TaskFormProps) {
  const editTimeline = editTimelineMode;
  const { addDraftTask, editDraftTask, editTask, tags, draftTasks, isDragging, tasks } =
    useTasksContext();
  const id = useRef(!currentTask ? uuidv4() : currentTask.id);
  const tagOptions = tags.map((tag) => {
    return { label: tag.label, value: tag.label.toLowerCase() };
  });
  const [taskArray, setTaskArray] = useState<Task[]>(
    draftTasks ?? tasks.filter((task) => task.id !== id.current)
  );
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

  const taskDates = useMemo(() => {
    const source = draftTasks ? draftTasks : tasks;
    return JSON.stringify(
      source
        ?.filter((task) => task.id !== id.current)
        .map((task) => task.date.toISOString()) ?? []
    );
  }, [draftTasks ?? taskArray]);

  const startTimeOptionsAll = useMemo(() => {
    return getAllTimeOptions(
      parseYYYYMMDDToDate(date),
      draftTasks ? draftTasks : taskArray,
      "start",
      startTime ? startTime.value : undefined,
      endTime ? endTime.value : undefined
    );
  }, [startTime, endTime, date, isDragging, taskDates]);

  const endTimeOptionsAll = useMemo(() => {
    const source = draftTasks ? draftTasks : tasks;
    if (!isDragging) {
      return getAllTimeOptions(
        parseYYYYMMDDToDate(date),
        source ? filterOutPreviewTask(source, id.current) : taskArray,
        "end"
      );
    }
    return [];
  }, [isDragging, date, taskDates]);

  const endTimeOptions = useMemo(() => {
    return getEndTimesAfterStart(
      startTime ? startTime.label : "12:00am",
      endTimeOptionsAll,
      parseYYYYMMDDToDate(date),
      draftTasks ? draftTasks : taskArray,
      id.current
    );
  }, [startTime, endTime, endTimeOptionsAll]);

  const draftPreview = useMemo(() => {
    if (!isDragging && editTimeline) {
      return draftTasks?.find((task) => task.id === id.current);
    }
  }, [isDragging, draftTasks]);

  useEffect(() => {
    if (draftTasks && !isDragging && editTimeline) {
      setTaskArray(draftTasks);
    }
  }, [isDragging, taskDates]);

  useEffect(() => {
    if (!isDragging && draftPreview && editTimeline) {
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
    if (!startTime || !endTime || !editTimeline) return;
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
    if (!newTask) return;
    const newTimes = calculateChangeDateTimes(newTask, tasks);

    if (newTimes) {
      setStartTime({
        label: convert24To12HourTime(newTimes?.startTime),
        value: newTimes?.startTime,
      });
      setEndTime({
        label: convert24To12HourTime(newTimes?.endTime),
        value: newTimes?.endTime,
      });
      if (!editTimelineMode) handlePreview(newTimes.startTime, newTimes.endTime, newDate);
    }
  }

  function handleSetTime(type: "start" | "end", time: { label: string; value: string }) {
    if (!editTimeline) {
      type === "start" ? setStartTime(time) : setEndTime(time);
      return;
    }
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
    const newTask = getTaskDetails(false);

    if (!newTask) return;

    if (currentTask && !editTimelineMode) {
      editTask(newTask);
    } else {
      if (!startTime || !endTime || !handleCreateSave) return;
      e.preventDefault();

      if (!newTask) return;
      if (draftPreview) {
        editDraftTask(newTask);
      } else {
        addDraftTask(newTask);
      }
      handleCreateSave();
    }
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
    const taskExists = checkTaskExist(id.current, draftTasks ? draftTasks : taskArray);

    if (!previewTask) return;
    if (previewTask && taskExists) {
      editDraftTask(previewTask);
    } else {
      addDraftTask(previewTask);
    }
  }
  function handleSetDescription(string: string) {
    setDescription(string);
  }

  function handleSetRepeat(string: string) {
    setRepeat(string);
  }
  function handleSetTag(tag: TagOption | null) {
    setTag(tag);
  }

  return {
    title,
    description,
    date,
    tag,
    startTime,
    endTime,
    repeat,
    startTimeOptionsAll,
    endTimeOptions,
    tagOptions,
    handleSubmit,
    handleSetTime,
    handleSetDate,
    handleSetTitle,
    handleSetDescription,
    handleSetRepeat,
    handleSetTag,
  };
}
