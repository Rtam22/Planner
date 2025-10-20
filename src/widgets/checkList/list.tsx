import CheckListItem from "./checkListItem";
import type { ListItem } from "./checkListWidget";
import "./list.css";

type ListProps = {
  items: ListItem[];
  handleSave: (newItem: ListItem) => void;
  handleDelete: (item: ListItem) => void;
};

function List({ items, handleSave, handleDelete }: ListProps) {
  return (
    <div className="checklist-list">
      {items.map((item) => {
        return (
          <CheckListItem
            key={item.id}
            item={item}
            handleSave={handleSave}
            handleDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}

export default List;
