import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Calendar from "./calendar";
import { getMonthName } from "../../utils/dateUtils";

function renderComponent() {
  const mockFn = vi.fn();
  const date = new Date();
  const calendarRegex =
    /^(January|February|March|April|May|June|July|August|September|October|November|December) 20\d{2}$/i;
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startingDay = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
  const utils = render(
    <Calendar selectedDate={date} handleSelectDate={mockFn} />
  );

  return {
    ...utils,
    mockFn,
    date,
    calendarRegex,
    year,
    month,
    day,
    startingDay,
  };
}

test("Initial values are correct and shows current date on load", () => {
  let { calendarRegex, year, month, day, startingDay } = renderComponent();
  const selectedDate = screen.getByText(calendarRegex);
  const dayCells = screen.getAllByText(/^([1-9]|[12][0-9]|3[01])$/);
  console.log(dayCells[1].textContent);
  const allCells = screen.getAllByTestId("calendar-day");

  expect(selectedDate.textContent).toBe(`${month} ${year}`);
  expect(dayCells[day - 1]).toHaveClass("active");
  for (let i = 0; i < 6; i++) {
    expect(dayCells[day + i]).toHaveClass("secondary");
  }
  expect(allCells[startingDay - 1].textContent).toBe("1");
});

test("Clicking next and back buttons changes the date", async () => {
  let { date, calendarRegex } = renderComponent();
  let newDate = new Date(date);
  const backButton = screen.getByRole("button", { name: "‹" });
  const fowardButton = screen.getByRole("button", { name: "›" });
  const selectedDate = screen.getByText(calendarRegex);

  for (let i = 0; i < 3; i++) {
    await userEvent.click(backButton);
    newDate.setMonth(newDate.getMonth() - 1);
  }

  expect(selectedDate.textContent).toBe(
    `${getMonthName(newDate)} ${newDate.getFullYear()}`
  );

  for (let i = 0; i < 5; i++) {
    await userEvent.click(fowardButton);
    newDate.setMonth(newDate.getMonth() + 1);
  }

  expect(selectedDate.textContent).toBe(
    `${getMonthName(newDate)} ${newDate.getFullYear()}`
  );
});

test("Clicking on a date highlights it and calls the selectdate functions", async () => {
  const { day, date, mockFn, rerender } = renderComponent();
  const dayCells = screen.getAllByText(/^([1-9]|[12][0-9]|3[01])$/);
  let testSelect = day === 15 ? 17 : 15;

  await userEvent.click(dayCells[testSelect - 1]);

  let newDate = new Date(date.getFullYear(), date.getMonth(), testSelect);
  expect(mockFn).toHaveBeenCalledWith(newDate);

  rerender(<Calendar selectedDate={newDate} handleSelectDate={mockFn} />);

  expect(dayCells[testSelect - 1]).toHaveClass("active");
});
