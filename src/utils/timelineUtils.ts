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

export function convertLengthToTime(
  difference: number,
  hours: number,
  minutes: number
) {
  const time = difference / 70;
  const hoursDiff = Math.floor(time);
  const minutesDiff = Math.round((time - hoursDiff) * 60);

  const totalMinutes = minutes + minutesDiff;
  const extraHours = Math.floor(totalMinutes / 60);
  const normalizedMinutes = totalMinutes % 60;

  const totalHours = hours + hoursDiff + extraHours;

  return `${String(totalHours).padStart(2, "0")}:${String(
    normalizedMinutes
  ).padStart(2, "0")}`;
}
