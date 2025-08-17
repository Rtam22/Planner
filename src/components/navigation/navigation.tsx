import "./navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faHouse, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useTasksContext } from "../../context/taskContext";

function Navigation() {
  const { draftTasks, deleteDraftTasks } = useTasksContext();
  return (
    <div className="navigation-container">
      <NavLink onClick={() => draftTasks && deleteDraftTasks} to="/" end>
        <FontAwesomeIcon icon={faHouse} className="nav-icon" />
      </NavLink>
      <div className="link-container">
        <NavLink
          onClick={() => draftTasks && deleteDraftTasks}
          to="/tasks"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FontAwesomeIcon icon={faListCheck} className="nav-icon" />
        </NavLink>
        <NavLink
          onClick={() => draftTasks && deleteDraftTasks}
          to="/calendar"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FontAwesomeIcon icon={faCalendar} className="nav-icon" />
        </NavLink>
      </div>
    </div>
  );
}

export default Navigation;
