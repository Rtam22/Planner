import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopUtilityBar from "../components/topUtilityBar";
import ScrollerWrapper from "../components/scrollerWrapper";
import FilterBar from "../components/filterBar";
import { useState } from "react";
import CreateTaskModal from "../components/createTaskModal";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  function handleShowModal(modal: string) {
    setShowCreateModal(!showCreateModal);
    console.log(showCreateModal);
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
          <ScrollerWrapper />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
