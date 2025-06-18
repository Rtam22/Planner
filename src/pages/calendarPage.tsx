import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopBar from "../components/topBar";
import FilterBar from "../components/filterBar";
import { useState } from "react";
import CalendarTimeline from "../components/calendar/calendarTimeline";
import type { CalendarDayProps } from "../components/calendar/calendarTimeline";
import { useTasksContext } from "../context/taskContext";
import type { PreviewTask, Task } from "../components/types/taskTypes";
import TaskForm from "../components/taskForm";
import Modal from "../components/modal";
import { getDayAndDayNumber, getSecondaryDates } from "../utils/dateUtils";
import type { modalType } from "../components/types/modalTypes";
import TaskView from "../components/taskView";
import type { FilterProps } from "../hooks/useFilters";
import { useFilters } from "../hooks/useFilters";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());
  const { applyFilter } = useFilters();
  const [showModal, setShowModal] = useState<"none" | "view" | "create">(
    "none"
  );
  const { tasks, editTask, deleteTask } = useTasksContext();
  const [previewTask, setPreviewTask] = useState<PreviewTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTasks, setShowTasks] = useState<Task[]>(tasks);
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

  function handleFilter(filters: FilterProps) {
    const filteredTasks = applyFilter(tasks, filters);
    setShowTasks(filteredTasks);
    console.log(filteredTasks);
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
        handleFilter={handleFilter}
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
            tasks={showTasks}
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
