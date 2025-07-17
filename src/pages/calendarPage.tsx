import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopBar from "../components/navigation/topBar";
import FilterBar from "../components/filters/filterBar";
import { useMemo, useState } from "react";
import CalendarTimeline from "../components/calendar/calendarTimeline";
import type { CalendarDayProps } from "../components/calendar/calendarTimeline";
import { useTasksContext } from "../context/taskContext";
import type { Task } from "../types/taskTypes";
import TaskForm from "../components/tasks/taskForm";
import Modal from "../components/common/modal";
import { getDayAndDayNumber, getSecondaryDates } from "../utils/dateUtils";
import type { modalType } from "../types/modalTypes";
import TaskView from "../components/tasks/taskView";
import type { FilterProps } from "../hooks/useFilters";
import { useFilters } from "../hooks/useFilters";

function CalendarPage() {
  const {
    tasks,
    draftTasks,
    tags,
    previewTask,
    editTask,
    deleteTask,
    handleSetPreviewTask,
    enableEditMode,
    handleDraftAction,
  } = useTasksContext();
  const [selectedDate, setselectedDate] = useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { applyFilter } = useFilters();
  const [showModal, setShowModal] = useState<"none" | "view" | "create">("none");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterProps>({
    filters: {
      search: "",
      tags: [],
    },
  });
  const dates: CalendarDayProps[] = getDayAndDayNumber(selectedDate);
  const secondaryDates = getSecondaryDates(selectedDate, "forwards", 7);
  const filteredTasks = useMemo(() => {
    const baseTasks = isEditing && draftTasks ? draftTasks : tasks;
    return applyFilter(baseTasks, filters);
  }, [tasks, draftTasks, isEditing, filters]);

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  function handleShowModal(type: modalType) {
    if (type === "create") {
      setIsEditing(true);
    }
    setShowModal(type);
  }

  function handleCancelModal(type: modalType) {
    setShowModal(type);
    handleDraftAction("cancel");
    setIsEditing(false);
  }

  function handleSetPreview(task: Task | null) {
    handleSetPreviewTask(task);
  }

  function handleTaskClick(taskId: string) {
    const findTask = tasks.find((task) => taskId === task.id);
    setSelectedTask(findTask ?? null);
    setShowModal("view");
  }

  function handleFilterTasks(filters: FilterProps) {
    setFilters(filters);
  }

  return (
    <div className="calendar-page">
      {showModal === "view" && (
        <Modal
          showModal={showModal}
          type="middle"
          handleShowModal={handleShowModal}
          backDrop={true}
          width="1000px"
          height="auto"
        >
          <TaskView
            task={selectedTask}
            onCancel={handleShowModal}
            onSave={editTask}
            onDelete={deleteTask}
          />
        </Modal>
      )}
      <MainNavigation />

      <FilterBar
        tasks={tasks}
        tags={tags}
        handleFilter={handleFilterTasks}
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        highlightSecondary={secondaryDates}
        filteredTasks={filteredTasks}
      />
      <div className="content">
        <TopBar
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
          handleShowModal={handleShowModal}
          showModal={showModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleDraftAction={handleDraftAction}
          enableEditMode={enableEditMode}
        />
        <div className="horizontal">
          <CalendarTimeline
            dates={dates}
            tasks={filteredTasks}
            selectedDate={selectedDate}
            previewTask={previewTask}
            onClick={handleTaskClick}
            isEditing={isEditing}
          />

          {showModal === "create" && (
            <Modal
              showModal={showModal}
              type="right"
              handleShowModal={handleCancelModal}
              backDrop={false}
            >
              <TaskForm
                handleSelectDate={handleSelectDate}
                handleSetPreview={handleSetPreview}
              />
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
