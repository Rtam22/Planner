import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopUtilityBar from "../components/topBar";
import FilterBar from "../components/filterBar";
import { useState } from "react";
import CalendarTimeline from "../components/calendar/calendarTimeline";
import type { CalendarDayProps } from "../components/calendar/CalendarDates";
import { useTasksContext } from "../context/taskContext";
import type { PreviewTask } from "../components/types/taskTypes";
import TaskForm from "../components/taskForm";
import Modal from "../components/modal";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const { tasks } = useTasksContext();
  const [previewTask, setPreviewTask] = useState<PreviewTask | null>(null);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates: CalendarDayProps[] = [];
  let dateForDisplay = new Date(selectedDate);
  console.log(selectedDate);
  for (let i = 0; i < 7; i++) {
    dates.push({
      day: dayNames[dateForDisplay.getDay()],
      dayDate: dateForDisplay.getDate(),
    });
    dateForDisplay.setDate(dateForDisplay.getDate() + 1);
  }

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  function handleShowModal() {
    setShowModal(!showModal);
  }

  function handleSetPreview(task: PreviewTask) {
    setPreviewTask(task ?? null);
  }

  function clearTaskPreview() {
    setPreviewTask(null);
  }
  return (
    <div className="calendar-page">
      <Modal showModal={showModal} handleShowModal={handleShowModal}>
        <TaskForm
          handleSelectDate={handleSelectDate}
          handleSetPreview={handleSetPreview}
          clearTaskPreview={clearTaskPreview}
        />
      </Modal>
      <MainNavigation />
      <FilterBar
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
      />
      <div className="content">
        <TopUtilityBar
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
          handleShowModal={handleShowModal}
        />
        <div className="divider">
          <CalendarTimeline
            dates={dates}
            tasks={tasks}
            selectedDate={selectedDate}
            previewTask={previewTask}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
