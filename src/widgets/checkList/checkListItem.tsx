import "./checkListItem.css";
import type { ListItem } from "./checkListWidget";

type CheckListItemProps = { item: ListItem };
function CheckListItem({ item }: CheckListItemProps) {
  return (
    <div className="checklist-item">
      <input type="checkbox" />
      <p>{item.content}</p>
    </div>
  );
}

export default CheckListItem;
