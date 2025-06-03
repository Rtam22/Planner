import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import CalendarPage from "../pages/calendarPage"; // ✅ default import
import { TasksProvider } from "../context/taskContext";

function renderCalendarPage() {
  render(
    <TasksProvider>
      <CalendarPage />
    </TasksProvider>
  );
  return {
    calendar: screen.getByTestId("calendar"),
    topUtilityBar: screen.getByTestId("top-utility-bar"),
    calendarDate: screen.getByTestId("calendar-date").textContent,
    calendarDay: screen.getAllByTestId("calendar-day"),
  };
}

describe("CalendarPage integration testing", () => {
  let date: Date;
  let monthName: string;
  let day: number;
  let month: number;
  let year: number;
  let currentDay: string;

  const daynames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  beforeEach(() => {
    date = new Date();
    monthName = date.toLocaleString("default", { month: "long" });
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    currentDay = daynames[date.getDay()];
  });

  it("Initial dates are correct", async () => {
    const { topUtilityBar, calendarDate, calendarDay } = renderCalendarPage();
    const utilityBarDateDisplay = topUtilityBar.querySelector("p");
    const [calendarDayName, calendarDayNumber] = Array.from(
      calendarDay[0].children
    );
    console.log(date);

    expect(calendarDate).toBe(`${monthName} ${year}`);
    expect(utilityBarDateDisplay?.textContent).toBe(
      `${monthName.slice(0, 3)} ${day}-${day + 6}`
    );
    expect(calendarDayName.textContent).toBe(currentDay);
  });

  it("Calendar buttons changes the date", async () => {
    const { calendar } = renderCalendarPage();
    const calendarButtons = within(calendar).getAllByRole("button");

    //Calendar back button changes date to previous months
    for (let i = 0; i < 3; i++) {
      await userEvent.click(calendarButtons[0]);
    }

    date.setMonth(date.getMonth() - 3);
    let expectedMonth = date.toLocaleString("default", { month: "long" });
    let expectedYear = date.getFullYear();

    await waitFor(() => {
      expect(screen.getByTestId("calendar-date").textContent).toBe(
        `${expectedMonth} ${expectedYear}`
      );
    });

    //Calendar back button changes date to future months
    for (let i = 0; i < 4; i++) {
      await userEvent.click(calendarButtons[1]);
    }

    date.setMonth(date.getMonth() + 4);
    expectedMonth = date.toLocaleString("default", { month: "long" });
    expectedYear = date.getFullYear();

    await waitFor(() => {
      expect(screen.getByTestId("calendar-date").textContent).toBe(
        `${expectedMonth} ${expectedYear}`
      );
    });
  });
});
