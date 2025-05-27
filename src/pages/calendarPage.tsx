import "./calendarPage.css";
import MainNavigation from "../components/navigation/mainNavigation";
import TopUtilityBar from "../components/topUtilityBar";
import ScrollerWrapper from "../components/scrollerWrapper";
import FilterBar from "../components/filterBar";
import { useState } from "react";

function CalendarPage() {
  const [selectedDate, setselectedDate] = useState(new Date());

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }
  return (
    <div className="calendar-page">
      <MainNavigation />
      <FilterBar
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
      />
      <div className="content">
        <TopUtilityBar
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
        />
        <div className="divider">
          <ScrollerWrapper />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
