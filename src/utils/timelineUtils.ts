export function calculateLength(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number
) {
  const startTotalMinutes = startHours * 70 + startMinutes;
  let endTotalMinutes = endHours * 70 + endMinutes;

  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 70;
  }
  return Math.abs(endTotalMinutes - startTotalMinutes);
}

export function calculateStartingPosition(
  startHours: number,
  startMinutes: number,
  startingTime: number
) {
  if (startHours < 6) {
    return startHours * 70 + startMinutes - startingTime + 1680;
  }
  const startingPosition = startHours * 70 + startMinutes - startingTime;
  return startingPosition;
}
