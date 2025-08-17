import { useMemo, useState } from "react";
import FilterBar from "../components/filters/filterBar";
import { useTasksContext } from "../context/taskContext";
import { useFilters } from "../hooks/useFilters";
import "./tasksPage.css";
import TopBar from "../components/navigation/topBar";
import DateNavigator from "../components/calendar/dateNavigator";
import TaskList from "../components/tasks/taskList";
import Modal from "../components/common/modal";
import TaskView from "../components/tasks/taskView";
import type { Task } from "../types/taskTypes";
import { isSameDate } from "../utils/dateUtils";
import Button from "../components/common/button";
import TaskForm from "../components/tasks/taskForm";

function tasksPage() {
  const { tasks, tags, draftTasks, deleteTask } = useTasksContext();
  const { applyFilter, handleFilter, filters } = useFilters();
  const [selectedDate, setselectedDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const filteredTasks = useMemo(() => {
    const baseTasks = draftTasks ? draftTasks : tasks;
    return applyFilter(baseTasks, filters);
  }, [tasks, draftTasks, filters]);
  const [showModal, setShowModal] = useState<"none" | "view" | "create">("none");
  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  function handleTaskClick(taskId: string) {
    const findTask = tasks.find((task) => taskId === task.id);
    setSelectedTask(findTask ?? null);
    setShowModal("view");
  }

  function handleCloseModal() {
    setShowModal("none");
  }

  function handleCreateModal() {
    setShowModal((prev) => (prev === "create" ? "none" : "create"));
  }

  function handleCreateSave() {
    setShowModal("none");
  }

  return (
    <>
      <FilterBar
        tasks={tasks}
        tags={tags}
        handleFilter={handleFilter}
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        filteredTasks={filteredTasks}
      />
      <div className="tasks-page">
        {showModal === "view" && (
          <Modal
            showModal={showModal}
            position="middle"
            setClose={handleCloseModal}
            backDrop={true}
            width="1000px"
            height="auto"
            modalType="view"
          >
            <TaskView
              task={selectedTask}
              onCancel={handleCloseModal}
              onDelete={deleteTask}
            />
          </Modal>
        )}
        <TopBar
          left={
            <DateNavigator
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
            />
          }
          right={
            <Button className="btn-main" onClick={handleCreateModal}>
              Create Task
            </Button>
          }
        />
        <div className="content">
          <div className="center">
            <TaskList
              tasks={filteredTasks.filter((task) => isSameDate(task.date, selectedDate))}
              onClick={handleTaskClick}
            />
          </div>

          <Modal
            showModal={showModal}
            position="right"
            setClose={handleCloseModal}
            backDrop={false}
            width="400px"
            modalType="create"
            hover={true}
          >
            <TaskForm
              handleSelectDate={handleSelectDate}
              handleCreateSave={handleCreateSave}
              selectedDate={selectedDate}
              tasks={tasks}
              showModal={showModal}
              hasDraft={false}
            />
          </Modal>
        </div>
      </div>
    </>
  );
}

export default tasksPage;
