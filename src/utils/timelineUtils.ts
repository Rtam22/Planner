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
  startMinutes: number
) {
  const startingPosition = startHours * 70 + startMinutes;
  return startingPosition;
}
