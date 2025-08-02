import Calendar from "../calendar/calendar";
import "./filterBar.css";
import Search from "./search";
import type { FilterProps } from "../../hooks/useFilters";
import { useEffect, useState } from "react";
import type { Tag, Task } from "../../types/taskTypes";
import FilterTag from "./filterTag";
import Button from "../common/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

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
  const [show, setShow] = useState<boolean>(true);

  function handleSetShow(boolean: boolean) {
    setShow(boolean);
  }

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
    <div
      className="filter-container"
      style={{
        width: show === true ? "500px" : "15px",
      }}
    >
      <Button className="btn-filter-circle" onClick={() => handleSetShow(!show)}>
        <FontAwesomeIcon icon={faBars} style={{ height: "20px", fontSize: "10px" }} />
      </Button>
      <div className="filter-bar">
        <Calendar
          selectedDate={selectedDate}
          handleSelectDate={handleSelectDate}
          highlightSecondary={highlightSecondary}
          showTaskInCell={filteredTasks ? filteredTasks : tasks}
          width="280"
          height="280"
        />
        <Search onSearch={setSearchQuery} useButton={false} width="280" />

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
    </div>
  );
}

export default FilterBar;
