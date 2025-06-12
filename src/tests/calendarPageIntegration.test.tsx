import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import CalendarPage from "../pages/calendarPage";
import { TasksProvider } from "../context/taskContext";

function renderCalendarPage() {
  const date = new Date();
  const daynames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarRegex =
    /^(January|February|March|April|May|June|July|August|September|October|November|December) 20\d{2}$/i;
  const shortDateRegex =
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}-\d{1,2}$/i;

  render(
    <TasksProvider>
      <CalendarPage />
    </TasksProvider>
  );

  return {
    date: date,
    monthName: date.toLocaleString("default", { month: "long" }),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    currentDay: daynames[date.getDay()],
    daynames: daynames,
    calendarRegex: calendarRegex,
    shortDateRegex: shortDateRegex,
  };
}

describe("CalendarPage integration testing", () => {
  test("Initial dates are correct through all components", async () => {
    const { monthName, day, year, currentDay, calendarRegex, shortDateRegex } =
      renderCalendarPage();
    const calendarDay = await screen.findAllByTestId("calendar-day");
    const calendarDate = screen.getByText(calendarRegex);
    const utilityBarDateDisplay = screen.getByText(shortDateRegex);
    const [calendarDayName, calendarDayNumber] = Array.from(
      calendarDay[0].children
    );

    expect(calendarDate.textContent).toBe(`${monthName} ${year}`);
    expect(calendarDayName.textContent).toBe(currentDay);
    expect(calendarDayNumber.textContent).toBe(day.toString());
    expect(utilityBarDateDisplay?.textContent).toBe(
      `${monthName.slice(0, 3)} ${day}-${day + 6}`
    );
  });
});
