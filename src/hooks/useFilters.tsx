import type { Task } from "../components/types/taskTypes";

export type FilterProps = {
  filters: {
    search: string;
    tags: string[] | null;
  };
};

export function useFilters() {
  function createTaskFilter({ filters }: FilterProps) {
    return (task: Task) => {
      const searchResult = filters.search
        ? task.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const tagsResult = filters.tags
        ? filters.tags.some((tag) => tag === task.tag?.label)
        : true;

      return searchResult && tagsResult;
    };
  }

  function applyFilter(tasks: Task[], filters: FilterProps) {
    const args = createTaskFilter(filters);
    return tasks.filter(args);
  }
  return { applyFilter };
}
