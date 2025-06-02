export function getMonthName(dateView: Date) {
  return dateView.toLocaleDateString("default", { month: "long" });
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  return date.getDay();
}

export function addSixToDays(date: Date) {
  const futureDate = new Date(date);
  futureDate.setDate(date.getDate() + 6);
  return futureDate.getDate();
}

export function calculateStartingPosition() {
  const startingPosition = startHours * 70 + startMinutes - startingTime;
  return startingPosition;
}
