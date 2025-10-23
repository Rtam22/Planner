import { useState } from "react";
import "./countdownForm.css";
import Button from "../../components/common/button";
import type { CountDownDate } from "./countdownWidget";

type CountdownFormProps = {
  selectedTime: CountDownDate | undefined;
  handleSetTime: (date: CountDownDate) => void;
};

function CountdownForm({ selectedTime, handleSetTime }: CountdownFormProps) {
  const [selected, setSelected] = useState<CountDownDate>(
    selectedTime ? selectedTime : { time: "", date: "" }
  );

  function submitSetTime() {
    if (selected.time.trim() === "" || selected.date.trim() === "") return;
    handleSetTime(selected);
  }
  return (
    <div className="time-form-container">
      <input
        type="date"
        onChange={(e) => setSelected((prev) => ({ ...prev, date: e.target.value }))}
        value={selected.date}
      />
      <input
        type="time"
        onChange={(e) => setSelected((prev) => ({ ...prev, time: e.target.value }))}
        value={selected.time}
      />
      <Button className="btn" onClick={submitSetTime} height="50px">
        Set Countdown
      </Button>
    </div>
  );
}

export default CountdownForm;
