import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopUtilityBar from "../components/topUtilityBar";
import FilterBar from "../components/filterBar";
import { useState } from "react";
import CreateTaskModal from "../components/createTaskModal";
import CalendarTimeline from "../components/calendar/calendarTimeline";
import type { CalendarDayProps } from "../components/calendar/calendarDay";
import { useTasksContext } from "../context/taskContext";
import type { PreviewTask } from "../components/types/taskTypes";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
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
    setShowCreateModal(!showCreateModal);
  }

  function handleSetPreview(task: PreviewTask) {
    setPreviewTask(task ?? null);
  }

  function clearTaskPreview() {
    setPreviewTask(null);
  }
  return (
    <div className="calendar-page">
      <CreateTaskModal
        showCreateModal={showCreateModal}
        handleShowModal={handleShowModal}
        handleSelectDate={handleSelectDate}
        handleSetPreview={handleSetPreview}
        clearTaskPreview={clearTaskPreview}
      />
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
