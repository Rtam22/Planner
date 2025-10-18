import CheckListItem from "./checkListItem";
import type { ListItem } from "./checkListWidget";
import "./list.css";

type ListProps = {
  items: ListItem[];
};

function List({ items }: ListProps) {
  return (
    <div className="checklist-list">
      {items.map((item) => {
        return <CheckListItem item={item} />;
      })}
    </div>
  );
}

export default List;
