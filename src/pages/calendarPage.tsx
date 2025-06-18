import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopBar from "../components/navigation/topBar";
import FilterBar from "../components/filters/filterBar";
import { useEffect, useState } from "react";
import CalendarTimeline from "../components/calendar/calendarTimeline";
import type { CalendarDayProps } from "../components/calendar/calendarTimeline";
import { useTasksContext } from "../context/taskContext";
import type { PreviewTask, Task } from "../types/taskTypes";
import TaskForm from "../components/tasks/taskForm";
import Modal from "../components/common/modal";
import { getDayAndDayNumber, getSecondaryDates } from "../utils/dateUtils";
import type { modalType } from "../types/modalTypes";
import TaskView from "../components/tasks/taskView";
import type { FilterProps } from "../hooks/useFilters";
import { useFilters } from "../hooks/useFilters";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());
  const { applyFilter } = useFilters();
  const [showModal, setShowModal] = useState<"none" | "view" | "create">(
    "none"
  );
  const { tasks, tags, editTask, deleteTask } = useTasksContext();
  const [previewTask, setPreviewTask] = useState<PreviewTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filteredTasks, setfilteredTasks] = useState<Task[]>(tasks);
  const dates: CalendarDayProps[] = getDayAndDayNumber(selectedDate);
  const secondaryDates = getSecondaryDates(selectedDate, "forwards", 7);

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  function handleShowModal(type: modalType) {
    setShowModal(type);
  }

  function handleSetPreview(task: PreviewTask) {
    setPreviewTask(task ?? null);
  }

  function handleTaskClick(taskId: string) {
    const findTask = tasks.find((task) => taskId === task.id);
    setSelectedTask(findTask ?? null);
    setShowModal("view");
  }

  function clearTaskPreview() {
    setPreviewTask(null);
  }

  function handleFilterTasks(filters: FilterProps) {
    const filteredTasks = applyFilter(tasks, filters);
    setfilteredTasks(filteredTasks);
  }

  return (
    <div className="calendar-page">
      <Modal
        showModal={showModal}
        type={showModal === "create" ? "right" : "middle"}
        handleShowModal={handleShowModal}
        backDrop={
          showModal === "create" ? false : showModal === "view" ? true : true
        }
        width={showModal === "view" ? "1000px" : undefined}
        height={showModal === "view" ? "auto" : undefined}
      >
        {showModal === "create" && (
          <TaskForm
            handleSelectDate={handleSelectDate}
            handleSetPreview={handleSetPreview}
            clearTaskPreview={clearTaskPreview}
          />
        )}

        {showModal === "view" && (
          <TaskView
            task={selectedTask}
            onCancel={handleShowModal}
            onSave={editTask}
            onDelete={deleteTask}
          />
        )}
      </Modal>

      <MainNavigation />

      <FilterBar
        tasks={tasks}
        tags={tags}
        handleFilter={handleFilterTasks}
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        highlightSecondary={secondaryDates}
      />
      <div className="content">
        <TopBar
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
          handleShowModal={handleShowModal}
        />
        <div className="divider">
          <CalendarTimeline
            dates={dates}
            tasks={filteredTasks}
            selectedDate={selectedDate}
            previewTask={previewTask}
            onClick={handleTaskClick}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
