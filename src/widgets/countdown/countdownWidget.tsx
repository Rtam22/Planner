import { useEffect, useRef, useState } from "react";
import { baseLayout, innerContainer } from "../widgetConsts";
import CountdownForm from "./countdownForm";
import "./countdownWidget.css";
import CountDownDisplay from "./countDownDisplay";
import useLocalStorage from "../../hooks/useLocalStorage";

export type CountDownDate = {
  time: string;
  date: string;
};
export type Time = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function CountdownWidget() {
  const [selectedTime, setSelectedTime] = useLocalStorage<CountDownDate | undefined>({
    key: "countDown",
    initialValue: undefined,
  });
  const [time, setTime] = useState<Time | undefined>(
    selectedTime ? calculateTimeleft(selectedTime) : undefined
  );

  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (!selectedTime) return;
    if (intervalRef.current !== null) return;
    startInterval();
    return () => stopInterval();
  }, [selectedTime]);

  function handleGetTimes(time: CountDownDate) {
    setSelectedTime(time);
  }

  function startInterval() {
    if (!selectedTime) return;
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(intervalTicks, 1000);
  }

  function stopInterval() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function intervalTicks() {
    if (!selectedTime) return;
    setTime(calculateTimeleft(selectedTime));
  }

  function calculateTimeleft(target: CountDownDate) {
    const currentDate = new Date();
    const targetDate = new Date(`${target.date}T${target.time}:00`);
    const difference = targetDate.getTime() - currentDate.getTime();

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return { days: days, hours: hours, minutes: minutes, seconds: seconds };
  }

  return (
    <div style={baseLayout}>
      <div style={innerContainer}>
        <CountDownDisplay time={time} />
      </div>
      <CountdownForm selectedTime={selectedTime} handleSetTime={handleGetTimes} />
    </div>
  );
}

export default CountdownWidget;
