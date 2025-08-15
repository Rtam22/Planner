import "./App.css";
import CalendarPage from "./pages/calendarPage";
import { TasksProvider } from "./context/taskContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import MainNavigation from "./components/navigation/navigationBar";

function App() {
  return (
    <div className="app">
      <TasksProvider>
        <MainNavigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </TasksProvider>
    </div>
  );
}

export default App;
