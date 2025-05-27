import "./mainNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function MainNavigation() {
  return (
    <div className="main-navigation">
      <button className="mobile-menu-button">
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
    </div>
  );
}

export default MainNavigation;
