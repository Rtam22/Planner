import { convertMinutesToLength } from "../../utils/timelineUtils";
import { convertHHMMToMinutes } from "../../utils/timeUtils";

export function findCenterBetweenTimes(timeA: string, timeB: string) {
  const minutesA = convertHHMMToMinutes(timeA);
  const minutesB = convertHHMMToMinutes(timeB);
  return convertMinutesToLength(Math.floor((minutesA + minutesB) / 2));
}
