import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaskReq, editTask, editTaskReq } from "../slice/boardSlice";
import { close } from "../slice/modalSlice";

export default function EditTask() {
  const ref = useRef("");
  const dispatch = useDispatch();
  const { activeBoard, selectedTask } = useSelector((state) => state.board);
  const { isEditTaskModalVisible } = useSelector((state) => state.modal);
  const { theme } = useSelector((state) => state.theme);
  const { columnIndex, taskIndex } = selectedTask;
  const currentTask = activeBoard.columns[columnIndex].tasks[taskIndex];
  const subTasksBeforeUpdate = currentTask.subTasks;
  const status = activeBoard.columns.filter((col) => {
    if (col._id === currentTask.column) {
      return { _id: col._id, name: col.name };
    }
  })[0];
  const [task, setTask] = useState({ ...currentTask, status });
  const [isListOpen, setIsListOpen] = useState(false);
  const [errors, SetErrors] = useState({
    titleErr: "",
    subTasksErr: [""],
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ modal: "editTask" }));
      }
    };

    if (isEditTaskModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditTaskModalVisible, close]);

  function handleSubTaskInput(e, index) {
    setTask((prev) => {
      const newSubTasks = JSON.parse(JSON.stringify([...prev.subTasks]));
      newSubTasks[index].name = e.target.value;
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
    setTask((prev) => ({
      ...prev,
      subTasks: [...prev.subTasks, { name: "", isDone: false }],
    }));
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
    setIsListOpen(false);
  }

  function subTaskActions() {
    let addUpdateActions = task.subTasks
      .map((subTask) => {
        if (!Object.hasOwn(subTask, "_id")) {
          return { name: subTask.name, action: "add" };
        }
        const index = subTasksBeforeUpdate.findIndex(
          (sub) => sub._id === subTask._id
        );
        if (index !== -1 && subTasksBeforeUpdate[index].name !== subTask.name) {
          return { _id: subTask._id, name: subTask.name, action: "update" };
        }
      })
      .filter(Boolean);

    const deletedSubTasks = subTasksBeforeUpdate
      .map((subTask) => {
        if (task.subTasks.findIndex((sub) => sub._id === subTask._id) === -1) {
          return { _id: subTask._id, action: "delete", name: subTask.name };
        }
      })
      .filter(Boolean);
    const subTasksWithActions = [...addUpdateActions, ...deletedSubTasks];
    console.log(subTasksWithActions, "subTaskwithactions");
    return subTasksWithActions;
  }

  function handleTaskTitle(e) {
    SetErrors((prev) => ({ ...prev, titleErr: "" }));
    setTask((prev) => ({ ...prev, name: e.target.value }));
  }

  function validate() {
    let isValid = true;
    if (!task.name) {
      SetErrors((prev) => ({ ...prev, titleErr: "Field can't be empty" }));
      isValid = false;
    }

    const subTasksErr = task.subTasks.map((subTask) =>
      subTask.name === "" ? "Field can't be empty" : ""
    );
    SetErrors((prev) => ({ ...prev, subTasksErr }));
    if (subTasksErr.some((err) => err !== "")) {
      isValid = false;
    }

    if (!task.status.name) {
      SetErrors((prev) => ({ ...prev, statusErr: "Select task status" }));
      isValid = false;
    }
    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const reqTask = {
      _id: task._id,
      name: task.name,
      description: task.description,
      subTasks: subTaskActions(),
      column: task.status._id,
    };
    dispatch(editTaskReq(reqTask));
    dispatch(
      editTask({
        task: {
          _id: task._id,
          name: task.name,
          description: task.description,
          subTasks: task.subTasks,
          column: task.status._id,
        },
      })
    );
    dispatch(close({ modal: "editTask" }));
  }

  return ReactDom.createPortal(
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75">
      <div
        ref={ref}
        className={`p-4 rounded-md w-2/6 ${
          theme === "dark" ? "bg-[#2b2c37] text-white" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-semibold mb-6">Edit Task</h3>
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
              value={task.name}
              onChange={handleTaskTitle}
            />
            <span className="text-sm text-red-400">{errors.titleErr}</span>
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Description(optional)
            </label>
            <textarea
              className={`block w-full px-2 py-3 border rounded-md text-sm outline-none resize-none
              ${
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
                          ${
                            errors.subTasksErr[index]
                              ? "border-red-400"
                              : theme === "dark"
                              ? "border-[#94a3b840]"
                              : "border-gray-300"
                          } ${
                            theme === "dark" ? "bg-[#2b2c37] " : "bg-white "
                          }`}
                          type="text"
                          placeholder="column name"
                          value={subTask.name}
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
              className={`block px-2 py-3 border rounded-md w-full text-left text-sm ${
                theme === "dark" ? "border-[#94a3b840]" : "border-gray-300"
              }`}
              onClick={toggleList}
            >
              {task.status === "" ? "Select a status" : task.status.name}
            </button>
            {isListOpen && (
              <ul
                className={`absolute top-20 bg-white left-0 right-0 shadow-md rounded-md p-2  ${
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
            Save Changes
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
