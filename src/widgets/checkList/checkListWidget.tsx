import { useState } from "react";
import Button from "../../components/common/button";
import { baseLayout } from "../widgetConsts";
import "./checkListWidget.css";
import List from "./list";

export type ListItem = {
  completed: boolean;
  content: string;
};

function checkListWidget() {
  const [items, setItems] = useState<ListItem[]>([
    { completed: false, content: "dsadsa" },
    { completed: true, content: "dsadsa dsadsa a" },
    { completed: false, content: "d sad sa " },
  ]);
  function handleCreate() {}
  return (
    <div style={baseLayout}>
      <div className="centered">
        <Button
          className="btn"
          style={{ fontSize: 18, transform: "translateY(-3px)" }}
          onClick={handleCreate}
        >
          +
        </Button>
      </div>
      <List items={items} />
    </div>
  );
}

export default checkListWidget;
