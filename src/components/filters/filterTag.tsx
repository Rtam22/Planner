import type { Tag } from "../../types/taskTypes";
import Button from "../common/button";
import "./filterTag.css";

type FilterTagProps = {
  selectedTags: string[];
  tag: Tag;
  setTags: (tags: string[]) => void;
};

function FilterTag({ tag, setTags, selectedTags }: FilterTagProps) {
  function handleClick() {
    const tagIndex = selectedTags.findIndex(
      (selectedtag) => selectedtag === tag.label
    );

    if (tagIndex === -1) {
      setTags([...selectedTags, tag.label]);
    } else {
      setTags([...selectedTags.filter((_, i) => i !== tagIndex)]);
    }
  }
  return (
    <div className="filter-tag horizontal">
      <Button
        className={`btn-filter ${
          selectedTags.find((selectedTag) => selectedTag === tag.label)
            ? "selected"
            : ""
        }`}
        onClick={handleClick}
      >
        <div style={{ backgroundColor: tag.color }} className="tag-color"></div>
        <p>{tag.label}</p>
      </Button>
    </div>
  );
}

export default FilterTag;
