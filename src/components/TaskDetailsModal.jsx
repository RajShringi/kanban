import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeIsDone,
  changeStatusOfTask,
  changeTaskColumn,
  deleteTaskReq,
  postChangeIsDone,
  removeTask,
} from "../slice/boardSlice";
import { close, open } from "../slice/modalSlice";
import { MdOutlineMoreVert } from "react-icons/md";

export default function TaskDetailsModal() {
  const { activeBoard, selectedTask } = useSelector((state) => state.board);
  const { isTaskDetailsVisible } = useSelector((state) => state.modal);
  const { theme } = useSelector((state) => state.theme);
  const ref = useRef("");
  const taskActionRef = useRef("");
  const dispatch = useDispatch();
  const [isListOpen, setIsListOpen] = useState(false);
  const [isTaskActionsVisible, setIsTaskActionsVisible] = useState(false);
  const { columnIndex, taskIndex } = selectedTask;
  const task =
    columnIndex !== undefined && taskIndex !== undefined
      ? activeBoard.columns[columnIndex].tasks[taskIndex]
      : null;

  const completedSubtask = task?.subTasks.filter(
    (subTask) => subTask.isDone
  ).length;

  const changeStatus = (status) => {
    setIsListOpen(false);
    dispatch(changeTaskColumn(status));
    dispatch(changeStatusOfTask(status));
    dispatch(close({ modal: "taskDetails" }));
  };

  const handleCheckboxChange = (e, subTaskId) => {
    const isDone = e.target.checked;
    dispatch(changeIsDone({ isDone, subTaskId }));
    dispatch(postChangeIsDone({ isDone, subTaskId }));
  };

  const handleEditTaskButton = () => {
    dispatch(close({ modal: "taskDetails" }));
    dispatch(open({ modal: "editTask" }));
  };

  function deleteTask() {
    dispatch(removeTask(task._id));
    dispatch(close({ modal: "taskDetails" }));
    dispatch(deleteTaskReq(task._id));
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ modal: "taskDetails" }));
      }
    };

    if (isTaskDetailsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTaskDetailsVisible, close]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (taskActionRef.current && !taskActionRef.current.contains(e.target)) {
        setIsTaskActionsVisible(false);
      }
    };

    if (isTaskActionsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTaskActionsVisible, setIsTaskActionsVisible]);

  if (!isTaskDetailsVisible) {
    return;
  }

  return ReactDom.createPortal(
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75">
      <div
        ref={ref}
        className={`p-4 rounded-md w-2/6 flex flex-col gap-4 ${
          theme === "dark" ? "bg-[#2b2c37] text-white" : "bg-white "
        }`}
      >
        <div className="flex items-center justify-between relative">
          <h3 className="text-xl font-semibold">{task.name}</h3>
          <button onClick={() => setIsTaskActionsVisible(true)}>
            <MdOutlineMoreVert className="text-2xl text-gray-400 cursor-pointer" />
          </button>

          {isTaskActionsVisible && (
            <div
              ref={taskActionRef}
              className={`absolute flex flex-col gap-1 items-start w-[120px] rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] -right-10 top-10 ${
                theme === "dark" ? "bg-[#2b2c37]" : "bg-white"
              }`}
            >
              <button
                onClick={handleEditTaskButton}
                className={`block text-sm text-gray-400 p-2 ${
                  theme === "dark" ? "hover:text-white" : "hover:text-gray-700"
                }`}
              >
                Edit Task
              </button>
              <button
                onClick={deleteTask}
                className={`block text-sm text-red-400  p-2 ${
                  theme === "dark" ? "hover:text-red-300" : "hover:text-red-600"
                }`}
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">{task.description}</p>
        <div>
          <label className="block text-gray-500 text-xs font-bold mb-2">
            Subtasks ({completedSubtask} of {task.subTasks.length})
          </label>
          <ul className="flex flex-col gap-2 max-h-[130px] overflow-auto">
            {task.subTasks.map((subTask) => {
              return (
                <li
                  key={subTask._id}
                  className={`flex gap-4 px-4 py-2 rounded-md ${
                    theme === "dark" ? "bg-[#20212c]" : "bg-[#f4f7fd]"
                  }`}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, subTask._id)}
                    checked={subTask.isDone}
                  />
                  <p
                    className={`text-sm font-medium ${
                      subTask.isDone === true
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {subTask.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative">
          <label className="block text-gray-500 text-xs font-bold mb-2">
            Current Status
          </label>
          <button
            onClick={() => setIsListOpen(!isListOpen)}
            className={`block px-2 py-3 border  rounded-md w-full text-left text-sm ${
              theme === "dark" ? "border-[#94a3b840]" : "border-gray-300"
            }`}
          >
            {activeBoard.columns[selectedTask.columnIndex].name}
          </button>
          {isListOpen && (
            <ul
              className={`absolute top-20 left-0 right-0 shadow-md rounded-md p-2 ${
                theme === "dark" ? "bg-[#2b2c37]" : "bg-white "
              }`}
            >
              {activeBoard.columns.map((column, index) => {
                return (
                  <li
                    onClick={() => changeStatus(column._id)}
                    key={column._id}
                    className={`text-gray-400 cursor-pointer text-sm py-1 ${
                      theme === "dark"
                        ? "hover:text-white"
                        : "hover:text-gray-800 "
                    }`}
                  >
                    {column.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
