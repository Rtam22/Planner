import type { Task } from "../../types/taskTypes";
import { convert24To12HourTime } from "../../utils/timeUtils";
import "./taskItem.css";

type taskItemProps = {
  task: Task;
  onClick: (taskId: string) => void;
};

function TaskItem({ task, onClick }: taskItemProps) {
  return (
    <div className="task-item" onClick={() => onClick(task.id)}>
      <div className="tag-color" style={{ backgroundColor: task.tag?.color }}></div>
      <div>{task.title}</div>
      <div>{convert24To12HourTime(task.startTime)}</div>
      <div>{convert24To12HourTime(task.endTime)}</div>
      <div>fgdgf</div>
    </div>
  );
}

export default TaskItem;
