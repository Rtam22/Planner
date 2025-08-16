import { useState } from "react";
import type { Task } from "../types/taskTypes";

export type FilterProps = {
  filters: {
    search: string;
    tags: string[];
  };
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterProps>({
    filters: {
      search: "",
      tags: [],
    },
  });

  function createTaskFilter({ filters }: FilterProps) {
    return (task: Task) => {
      const searchResult = filters.search
        ? task.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const tagsResult =
        filters.tags.length > 0
          ? filters.tags.some((tag) => tag === task.tag?.label)
          : true;

      return searchResult && tagsResult;
    };
  }

  function handleFilter(filters: FilterProps) {
    setFilters(filters);
  }

  function applyFilter(tasks: Task[], filters: FilterProps) {
    const args = createTaskFilter(filters);
    return tasks.filter(args);
  }
  return { applyFilter, handleFilter, filters };
}
