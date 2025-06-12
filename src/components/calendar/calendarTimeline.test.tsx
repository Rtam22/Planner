import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import CalendarTimeline from "./calendarTimeline";
import { getDayAndDayNumber } from "../../utils/dateUtils";
import { convertToDDMMYYYY } from "../../utils/dateUtils";

function renderComponent() {
  const mockFn = vi.fn();
  const date = new Date();
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 1));
  const task = [
    {
      id: "d2348dj1209e1k",
      title: "Morning Run",
      description: "5km park run.",
      tag: { label: "Fitness", value: "Health", color: "#0EA5E9" },
      date: dueDate,
      startTime: "07:00",
      endTime: "07:45",
      repeat: "Sat",
    },
  ];

  const previewTask = {
    date: new Date(),
    startTime: "02:00",
    endTime: "03:45",
  };
  render(
    <CalendarTimeline
      dates={getDayAndDayNumber(date)}
      tasks={task}
      selectedDate={date}
      previewTask={previewTask}
      onClick={mockFn}
    />
  );

  return { mockFn, date, dueDate, previewTask };
}

test("timestamps are shown in the timeline", () => {
  renderComponent();
  expect(screen.getAllByText(/am|pm/)).toHaveLength(26);
});

test("tasks are shown in the timeline and are in the right column", () => {
  const { dueDate } = renderComponent();
  const cellColumn = screen.getByTestId(convertToDDMMYYYY(dueDate));

  const task = within(cellColumn).getByText("Morning Run");
  expect(task).toBeInTheDocument();
});

test("preview task is rendered in the timeline", () => {
  const { previewTask } = renderComponent();
  const cellColumn = screen.getByTestId(convertToDDMMYYYY(previewTask.date));
  const findPreviewTask = within(cellColumn).getByText("Preview Task");
  expect(findPreviewTask).toBeInTheDocument();
});
