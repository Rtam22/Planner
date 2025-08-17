import type { Task } from "../../types/taskTypes";
import TaskItem from "./taskItem";
import "./taskList.css";

type taskListProps = {
  tasks: Task[];
  onClick: (taskId: string) => void;
};

function TaskList({ tasks, onClick }: taskListProps) {
  return (
    <div className="task-list">
      <div className="task-header">
        <div>Title</div>
        <div>Start Time</div>
        <div>Due Time</div>
        <div>Status</div>
      </div>
      {tasks.map((task) => {
        return <TaskItem key={task.id} task={task} onClick={onClick} />;
      })}
    </div>
  );
}

export default TaskList;
