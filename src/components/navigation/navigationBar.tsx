import "./navigationBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Navigation from "./navigation";

function NavigationBar() {
  return (
    <div className="main-navigation">
      <Navigation />

      <button className="mobile-menu-button">
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
    </div>
  );
}

export default NavigationBar;
