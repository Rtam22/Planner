import "./App.css";
import CalendarPage from "./pages/calendarPage";
import { TasksProvider } from "./context/taskContext";
function App() {
  return (
    <>
      <TasksProvider>
        <CalendarPage />
      </TasksProvider>
    </>
  );
}

export default App;
