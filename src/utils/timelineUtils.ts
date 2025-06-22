export function calculateLength(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number
) {
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }
  const pixelsPerMinute = 70 / 60;
  return (endTotalMinutes - startTotalMinutes) * pixelsPerMinute;
}

export function calculateStartingPosition(
  startHours: number,
  startMinutes: number
) {
  const pixelsPerMinute = 70 / 60;
  const startingPosition = startHours * 70 + startMinutes * pixelsPerMinute;
  return startingPosition;
}
