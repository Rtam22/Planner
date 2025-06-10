import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import CalendarDates from "./calendarDates";

test("Dates are correctly displayed", () => {
  render(<CalendarDates day="Sun" dayDate={15} />);

  expect(screen.getByText("Sun")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "15" }));
});
