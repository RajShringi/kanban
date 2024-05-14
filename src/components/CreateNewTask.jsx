import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { close } from "../slice/modalSlice";
import { createTask, postNewTask } from "../slice/boardSlice";
import { nanoid } from "@reduxjs/toolkit";

export default function CreateNewTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    subTasks: [""],
    status: "",
  });
  const [errors, SetErrors] = useState({
    titleErr: "",
    subTasksErr: [""],
    statusErr: "",
  });

  const [isListOpen, setIsListOpen] = useState(false);
  const dispatch = useDispatch();
  const { iscreateTaskModalVisible } = useSelector((state) => state.modal);
  const { activeBoard } = useSelector((state) => state.board);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ modal: "createTask" }));
      }
    };

    if (iscreateTaskModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [iscreateTaskModalVisible, close]);

  function handleSubTaskInput(e, index) {
    setTask((prev) => {
      const newSubTasks = [...prev.subTasks];
      newSubTasks[index] = e.target.value;
      return { ...prev, subTasks: newSubTasks };
    });
    SetErrors((prev) => {
      const subT = [...prev.subTasksErr];
      subT[index] = "";
      return { ...prev, subTasksErr: subT };
    });
  }

  function deleteSubTask(index) {
    setTask((prev) => ({
      ...prev,
      subTasks: prev.subTasks.filter((subTask, idx) => idx !== index),
    }));
    SetErrors((prev) => {
      return {
        ...prev,
        subTasksErr: prev.subTasksErr.filter((subT, idx) => idx !== index),
      };
    });
  }

  function addNewSubTask(e) {
    e.preventDefault();
    setTask((prev) => ({ ...prev, subTasks: [...prev.subTasks, ""] }));
    SetErrors((prev) => {
      return {
        ...prev,
        subTasksErr: [...prev.subTasksErr, ""],
      };
    });
  }

  function toggleList(e) {
    e.preventDefault();
    setIsListOpen(!isListOpen);
  }

  function selectStatus(status) {
    setTask((prev) => ({ ...prev, status }));
    SetErrors((prev) => ({ ...prev, statusErr: "" }));
    setIsListOpen(false);
  }

  function handleTaskTitle(e) {
    SetErrors((prev) => ({ ...prev, titleErr: "" }));
    setTask((prev) => ({ ...prev, title: e.target.value }));
  }

  function validate() {
    let isValid = true;
    if (!task.title) {
      SetErrors((prev) => ({ ...prev, titleErr: "Field can't be empty" }));
      isValid = false;
    }

    const subTasksErr = task.subTasks.map((subTask) =>
      subTask === "" ? "Field can't be empty" : ""
    );
    SetErrors((prev) => ({ ...prev, subTasksErr }));
    if (subTasksErr.some((err) => err !== "")) {
      isValid = false;
    }

    if (!task.status) {
      SetErrors((prev) => ({ ...prev, statusErr: "Select task status" }));
      isValid = false;
    }
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const taskId = nanoid();
    const newTask = {
      name: task.title,
      description: task.description,
      subTasks: task.subTasks,
      column: task.status._id,
    };

    try {
      dispatch(createTask({ task: { ...newTask, _id: taskId } }));
      dispatch(close({ modal: "createTask" }));
      dispatch(postNewTask({ newTask: newTask, reduxTaskId: taskId }));
      setTask({ title: "", description: "", subTasks: [""], status: "" });
    } catch (error) {
      console.log(error);
    }
  }

  if (!iscreateTaskModalVisible) {
    return null;
  }

  return ReactDom.createPortal(
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75">
      <div
        ref={ref}
        className={`p-4 rounded-md  w-2/6 ${
          theme === "dark" ? "bg-[#2b2c37] text-white" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-semibold mb-6">Add New Task</h3>
        <form>
          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Title
            </label>
            <input
              className={`block w-full px-2 py-3 border border-gray-300 rounded-md text-sm outline-none ${
                errors.titleErr
                  ? "border-red-400"
                  : theme === "dark"
                  ? "border-[#94a3b840]"
                  : "border-gray-300"
              } ${theme === "dark" ? "bg-[#2b2c37] " : "bg-white "}`}
              type="text"
              placeholder="e.g. Start learning things"
              value={task.title}
              onChange={handleTaskTitle}
            />
            <span className="text-sm text-red-400">{errors.titleErr}</span>
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Description(optional)
            </label>
            <textarea
              className={`block w-full px-2 py-3 border rounded-md text-sm outline-none resize-none ${
                theme === "dark"
                  ? "bg-[#2b2c37] border-[#94a3b840]"
                  : "border-gray-300 bg-white"
              }`}
              placeholder="e.g. Start learning things"
              value={task.description}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, description: e.target.value }))
              }
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Subtasks
            </label>
            <div className="flex flex-col gap-4">
              {/* repeat this for column */}
              <div className="flex flex-col gap-4 max-h-[150px] overflow-auto">
                {task.subTasks.map((subTask, index) => {
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className={`block px-2 py-3 border border-gray-300 rounded-md w-[95%] outline-none text-sm 
                          ${theme === "dark" ? "bg-[#2b2c37] " : "bg-white "}
                           ${
                             errors.subTasksErr[index]
                               ? "border-red-400"
                               : theme === "dark"
                               ? "border-[#94a3b840]"
                               : "border-gray-300"
                           }`}
                          type="text"
                          placeholder="column name"
                          value={subTask}
                          onChange={(e) => handleSubTaskInput(e, index)}
                        />
                        <RxCross2
                          onClick={() => deleteSubTask(index)}
                          className="text-3xl w-[5%]  text-gray-500 cursor-pointer"
                        />
                      </div>
                      <span className="text-sm text-red-400">
                        {errors.subTasksErr[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={addNewSubTask}
                className="block bg-[#625fc721] hover:bg-[#625fc70a] px-2 py-3 rounded-full text-[#635fc7] font-bold"
              >
                + Add New Subtask
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Status
            </label>
            <button
              className={`block px-2 py-3 border border-gray-300 rounded-md w-full text-left text-sm ${
                errors.statusErr
                  ? "border-red-400"
                  : theme === "dark"
                  ? "border-[#94a3b840]"
                  : "border-gray-300"
              }`}
              onClick={toggleList}
            >
              {task.status === "" ? "Select a status" : task.status.name}
            </button>
            <span className="text-sm text-red-400">{errors.statusErr}</span>

            {isListOpen && (
              <ul
                className={`absolute top-20 left-0 right-0 shadow-md rounded-md p-2 ${
                  theme === "dark" ? "bg-[#2b2c37]" : "bg-white "
                }`}
              >
                {activeBoard.columns.map((column, index) => {
                  return (
                    <li
                      onClick={() =>
                        selectStatus({ _id: column._id, name: column.name })
                      }
                      key={column._id}
                      className={`text-gray-400 cursor-pointer text-sm py-1 ${
                        theme === "dark"
                          ? "hover:text-white"
                          : "hover:text-gray-800"
                      }`}
                    >
                      {column.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            className="block mt-4 w-full bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold"
            onClick={handleSubmit}
          >
            Create Task
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
