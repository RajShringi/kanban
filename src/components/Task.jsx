import React, { memo } from "react";
import { selectTask } from "../slice/boardSlice";
import { open } from "../slice/modalSlice";
import { useDispatch } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

function Task({ task, index }) {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  function handleClickOnTask(task) {
    dispatch(selectTask(task));
    dispatch(open({ modal: "taskDetails" }));
  }

  const subTaskLength = task?.subTasks.length;
  const isDoneSubTasks = task?.subTasks.filter(
    (subTask) => subTask.isDone
  ).length;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          onClick={() => handleClickOnTask(task)}
          key={task._id}
          className={`shadow-md rounded-md p-4 cursor-grab touch-none mb-4 ${
            theme === "dark" ? "bg-[#2b2c37]" : "bg-white "
          }`}
        >
          <h3
            className={`font-bold text-lg ${
              theme === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            {task.name}
          </h3>
          <p className="text-xs text-gray-400 font-bold">
            {isDoneSubTasks} of {subTaskLength} subtasks
          </p>
        </div>
      )}
    </Draggable>
  );
}

export default memo(Task);
