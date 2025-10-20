import { useState } from "react";
import Button from "../../components/common/button";
import { baseLayout } from "../widgetConsts";
import "./checkListWidget.css";
import List from "./list";
import { v4 as uuidv4 } from "uuid";

export type ListItem = {
  id: string;
  completed: boolean;
  content: string;
};

function checkListWidget() {
  const [items, setItems] = useState<ListItem[]>([
    { id: uuidv4(), completed: false, content: "dsadsa" },
    { id: uuidv4(), completed: true, content: "dsadsa dsadsa a" },
    { id: uuidv4(), completed: false, content: "d sad sa " },
  ]);
  function handleCreate() {
    setItems((prev) => [...prev, { id: uuidv4(), completed: false, content: "" }]);
  }

  function handleDelete(item: ListItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  function handleSave(newItem: ListItem) {
    setItems((prev) =>
      prev.map((item) =>
        newItem.id === item.id ? { ...item, completed: !item.completed } : item
      )
    );
  }
  return (
    <div style={baseLayout} className="widget">
      <div className="centered">
        <Button
          className="btn"
          style={{ fontSize: 18, transform: "translateY(-3px)" }}
          onClick={handleCreate}
        >
          +
        </Button>
      </div>
      <List items={items} handleSave={handleSave} handleDelete={handleDelete} />
    </div>
  );
}

export default checkListWidget;
