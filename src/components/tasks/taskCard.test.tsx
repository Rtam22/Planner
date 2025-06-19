import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import CalendarTaskCard from "./taskCard";
import {
  calculateLength,
  calculateStartingPosition,
} from "../../utils/timelineUtils";
import userEvent from "@testing-library/user-event";
import { TasksProvider } from "../../context/taskContext";

function renderComponent() {
  const mockFn = vi.fn();
  const task = {
    id: "d2348dj1209e1k",
    title: "Morning Run",
    description: "5km park run.",
    tag: { label: "Fitness", value: "Health", color: "#0EA5E9" },
    date: new Date("2025-06-06"),
    startTime: "07:00",
    endTime: "07:45",
    repeat: "Sat",
  };
  const [startHours, startMinutes] = task.startTime.split(":").map(Number);
  const [endHours, endMinutes] = task.endTime.split(":").map(Number);
  const startingTime = 420;

  render(
    <TasksProvider>
      <CalendarTaskCard title="Morning Run" onClick={mockFn} task={task} />{" "}
    </TasksProvider>
  );

  return {
    task,
    startHours,
    startMinutes,
    endHours,
    endMinutes,
    startingTime,
    mockFn,
  };
}

test("Component displays the correct values and color", async () => {
  const { task } = renderComponent();
  const title = await screen.findByText("Morning Run");
  const taskCard = screen.getByTestId("calendar-task-card");

  expect(title).toBeInTheDocument();
  expect(taskCard).toHaveStyle({ backgroundColor: task.tag.color });
});

test("Task card height and starting position is correct based on time", () => {
  const { startHours, startMinutes, endMinutes, endHours } = renderComponent();
  const startingPosition = calculateStartingPosition(startHours, startMinutes);
  const taskHeight = calculateLength(
    startHours,
    startMinutes,
    endHours,
    endMinutes
  );

  const taskCard = screen.getByTestId("calendar-task-card");
  expect(taskCard).toHaveStyle({ height: `${taskHeight}px` });
  expect(taskCard).toHaveStyle({ top: `${startingPosition}px` });
});

test("Onclick gets called when clicking component", async () => {
  const { mockFn } = renderComponent();
  await userEvent.click(screen.getByTestId("calendar-task-card"));
  expect(mockFn).toHaveBeenCalled();
});
