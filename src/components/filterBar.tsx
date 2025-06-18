import Calendar from "./calendar/calendar";
import "./filterBar.css";
import Search from "./search";
import type { FilterProps } from "../hooks/useFilters";
import { useEffect, useState } from "react";

type filterBarProps = {
  selectedDate: Date;
  handleSelectDate: (newDate: Date) => void;
  highlightSecondary?: Date[];
  handleFilter: (filters: FilterProps) => void;
};

function FilterBar({
  handleFilter,
  selectedDate,
  handleSelectDate,
  highlightSecondary,
}: filterBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[] | null>(null);

  useEffect(() => {
    const filters: FilterProps = {
      filters: {
        search: searchQuery,
        tags: selectedTags,
      },
    };
    handleFilter(filters);
  }, [searchQuery, selectedTags]);

  return (
    <div className="filter-bar">
      <Calendar
        selectedDate={selectedDate}
        handleSelectDate={handleSelectDate}
        highlightSecondary={highlightSecondary}
      />
      <Search onSearch={setSearchQuery} useButton={false} />
    </div>
  );
}

export default FilterBar;
