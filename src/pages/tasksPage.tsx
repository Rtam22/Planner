import { useMemo, useState } from "react";
import FilterBar from "../components/filters/filterBar";
import { useTasksContext } from "../context/taskContext";
import { useFilters } from "../hooks/useFilters";
import "./tasksPage.css";

function tasksPage() {
  const { tasks, tags, draftTasks } = useTasksContext();
  const { applyFilter, handleFilter, filters } = useFilters();
  const [selectedDate, setselectedDate] = useState<Date>(new Date());
  const filteredTasks = useMemo(() => {
    const baseTasks = draftTasks ? draftTasks : tasks;
    return applyFilter(baseTasks, filters);
  }, [tasks, draftTasks, filters]);

  function handleSelectDate(newDate: Date) {
    setselectedDate(newDate);
  }

  return (
    <div className="tasks-page">
      <FilterBar
        tasks={tasks}
        tags={tags}
        handleFilter={handleFilter}
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        filteredTasks={filteredTasks}
      />
      <div className="content"></div>
    </div>
  );
}

export default tasksPage;
