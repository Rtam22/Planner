import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopUtilityBar from "../components/topUtilityBar";
import FilterBar from "../components/filterBar";
import { useState } from "react";
import CreateTaskModal from "../components/createTaskModal";
import CalendarTimeline from "../components/calendar/calendarTimeline";
import type { CalendarDayProps } from "../components/calendar/calendarDay";
import { useTasksContext } from "../context/taskContext";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const { tasks } = useTasksContext();

  const dayNames = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates: CalendarDayProps[] = [];
  let dateForDisplay = new Date(selectedDate);

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
  return (
    <div className="calendar-page">
      <CreateTaskModal
        showCreateModal={showCreateModal}
        handleShowModal={handleShowModal}
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
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
