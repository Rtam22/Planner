import type { CalendarDayProps } from "../components/calendar/calendarDates";

export function getMonthName(dateView: Date) {
  return dateView.toLocaleDateString("default", { month: "long" });
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const result = [6, 0, 1, 2, 3, 4, 5];
  return result[date.getDay()];
}

export function addSixToDays(date: Date) {
  const futureDate = new Date(date);
  futureDate.setDate(date.getDate() + 6);
  return futureDate.getDate();
}

export function getDayAndDayNumber(selectedDate: Date) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates: CalendarDayProps[] = [];
  let dateForDisplay = new Date(selectedDate);
  for (let i = 0; i < 7; i++) {
    dates.push({
      day: dayNames[dateForDisplay.getDay()],
      dayDate: dateForDisplay.getDate(),
    });
    dateForDisplay.setDate(dateForDisplay.getDate() + 1);
  }

  return dates;
}

export function convertToDDMMYYYY(date: Date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
}

export function convertTimeString24To12(time: string) {
  const [h, m] = time.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  const period = h < 12 ? "AM" : "PM";
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}
