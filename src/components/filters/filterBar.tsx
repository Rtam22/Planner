import Calendar from "../calendar/calendar";
import "./filterBar.css";
import Search from "./search";
import type { FilterProps } from "../../hooks/useFilters";
import { useEffect, useState } from "react";
import type { Tag, Task } from "../../types/taskTypes";
import FilterTag from "./filterTag";

type filterBarProps = {
  tasks: Task[];
  tags: Tag[];
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  highlightSecondary?: Date[];
  handleFilter: (filters: FilterProps) => void;
  filteredTasks: Task[];
};

function FilterBar({
  tasks,
  tags,
  handleFilter,
  selectedDate,
  handleSelectDate,
  highlightSecondary,
  filteredTasks,
}: filterBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const filters: FilterProps = {
      filters: {
        search: searchQuery,
        tags: selectedTags,
      },
    };
    handleFilter(filters);
  }, [searchQuery, selectedTags, tasks]);

  return (
    <div className="filter-bar">
      <Calendar
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        highlightSecondary={highlightSecondary}
        showTaskInCell={filteredTasks ? filteredTasks : tasks}
      />
      <Search onSearch={setSearchQuery} useButton={false} />

      <div className="filter-section">
        <h4>Tags</h4>
        {tags.map((tag, index) => {
          return (
            <FilterTag
              key={index}
              selectedTags={selectedTags}
              tag={tag}
              setTags={setSelectedTags}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
