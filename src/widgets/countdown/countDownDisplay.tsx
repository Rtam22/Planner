import "./countDownDisplay.css";
import type { Time } from "./countdownWidget";
type CountDownDisplayProps = {
  time: Time | undefined;
};
function CountDownDisplay({ time }: CountDownDisplayProps) {
  return (
    <div className="countdown-container">
      <div>
        <p className="countdown-number">{time ? time.days : "00"}</p>
        <p>Days</p>
      </div>
      <div>
        <p className="countdown-number">{time ? time.hours : "00"}</p>
        <p>Hours</p>
      </div>
      <div>
        <p className="countdown-number">{time ? time.minutes : "00"}</p>
        <p>Minutes</p>
      </div>
      <div>
        <p className="countdown-number">{time ? time.seconds : "00"}</p>
        <p>Seconds</p>
      </div>
    </div>
  );
}

export default CountDownDisplay;
