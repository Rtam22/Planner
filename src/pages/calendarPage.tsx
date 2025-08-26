import "./calendarPage.css";
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
import { useFilters } from "../hooks/useFilters";
import Confirmation from "../components/common/confirmation";
import DateNavigator from "../components/calendar/dateNavigator";
import EditControls from "../components/calendar/editControls";
import type { ViewOptions } from "../components/filters/viewSelect";
import Calendar from "../components/calendar/calendar";

function CalendarPage() {
  const {
    tasks,
    isEditing,
    draftTasks,
    tags,
    previewTask,
    deleteTask,
    enableEditMode,
    handleDraftAction,
    setIsEditing,
    saveTasks,
    deleteDraftTasks,
  } = useTasksContext();

  const [view, setView] = useState<"Calendar" | "Timeline">("Calendar");
  const [selectedDate, setselectedDate] = useState<Date>(new Date());

  const { applyFilter, handleFilter, filters } = useFilters();
  const [showModal, setShowModal] = useState<"none" | "view" | "create">("none");
  const [showConfirmation, setShowConfirmation] = useState<"none" | "confirmation">(
    "none"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dates: CalendarDayProps[] = getDayAndDayNumber(selectedDate);
  const secondaryDates = getSecondaryDates(selectedDate, "forwards", 7);
  const filteredTasks = useMemo(() => {
    const baseTasks = draftTasks ? draftTasks : tasks;
    return applyFilter(baseTasks, filters);
  }, [tasks, draftTasks, isEditing, filters]);
  const viewOptions: ViewOptions[] = ["Calendar", "Timeline"];

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  function handleSetView(type: "Calendar" | "Timeline") {
    setView(type);
  }

  function handleShowModal(type: modalType) {
    if (type === "create" && view === "Timeline") {
      setIsEditing(true);
    }
    setShowModal(type);
  }

  function handleCancelModal(type: modalType) {
    const draft = draftTasks?.filter((task) => task.preview === false);
    if (JSON.stringify(draft) !== JSON.stringify(tasks)) {
      setShowConfirmation("confirmation");
      setShowModal(type);
    } else {
      setShowModal(type);
      handleDraftAction("cancel");
      setIsEditing(false);
    }
  }

  function handleTaskClick(taskId: string) {
    const findTask = tasks.find((task) => taskId === task.id);
    setSelectedTask(findTask ?? null);
    setShowModal("view");
  }

  function handleCreateSave() {
    if (isEditing) {
      console.log("");
      handleDraftAction("save");
      setTimeout(() => {
        setIsEditing(false);
      }, 80);
    }
    setShowModal("none");
  }

  function handleShowConfirmation() {
    setShowConfirmation("none");
    handleDraftAction("cancel");
    setTimeout(() => {
      setIsEditing(false);
    }, 80);
  }

  function handleConfirmationSave() {
    setShowConfirmation("none");
    handleDraftAction("saveTimeline");
    setTimeout(() => {
      setIsEditing(false);
    }, 80);
  }

  return (
    <>
      <FilterBar
        viewSelect={{ view: view, setView: handleSetView, options: viewOptions }}
        tasks={tasks}
        tags={tags}
        handleFilter={handleFilter}
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        highlightSecondary={secondaryDates}
        filteredTasks={filteredTasks}
      />
      <div className="calendar-page">
        {showModal === "view" && (
          <Modal
            showModal={showModal}
            position="middle"
            setClose={handleShowModal}
            backDrop={true}
            width="1000px"
            height="auto"
            modalType="view"
          >
            <TaskView
              task={selectedTask}
              onCancel={handleShowModal}
              onDelete={deleteTask}
            />
          </Modal>
        )}

        {showConfirmation === "confirmation" && (
          <Modal
            showModal={showConfirmation}
            position="middle"
            setClose={handleShowConfirmation}
            backDrop={true}
            removeCloseButton={true}
            zIndexInput={21}
            width="300px"
            height="120px"
            modalType="confirmation"
          >
            <Confirmation
              buttonConfirmTitle="Save"
              buttonCancelTitle="Cancel"
              onClickConfirm={handleConfirmationSave}
              onClickCancel={handleShowConfirmation}
            >
              Save changes to the timeline?
            </Confirmation>
          </Modal>
        )}
        <TopBar
          left={
            <DateNavigator
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
              amountOfDays={6}
            />
          }
          right={
            <EditControls
              handleShowModal={handleShowModal}
              showModal={showModal}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleDraftAction={handleDraftAction}
              enableEditMode={enableEditMode}
            />
          }
        />
        <div className="content">
          <div className="horizontal">
            {view === "Timeline" && (
              <CalendarTimeline
                dates={dates}
                tasks={filteredTasks}
                selectedDate={selectedDate}
                previewTask={previewTask}
                onClick={handleTaskClick}
                isEditing={isEditing}
              />
            )}
            {view === "Calendar" && (
              <Calendar
                showTaskInCell={filteredTasks}
                onClickTask={handleTaskClick}
                size="large"
              />
            )}

            <Modal
              showModal={showModal}
              position="right"
              setClose={handleCancelModal}
              backDrop={false}
              width="400px"
              modalType="create"
            >
              <TaskForm
                handleSelectDate={handleSelectDate}
                handleCreateSave={handleCreateSave}
                selectedDate={selectedDate}
                tasks={tasks}
                showModal={showModal}
                hasDraft={true}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarPage;
