import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { close } from "../slice/modalSlice";
import { createNewtask, postNewTask, updateTaskId } from "../slice/boardSlice";

export default function CreateNewTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    subTasks: [""],
    status: "",
  });

  const [isListOpen, setIsListOpen] = useState(false);
  const dispatch = useDispatch();
  const { iscreateTaskModalVisible } = useSelector((state) => state.modal);
  const { activeBoard } = useSelector((state) => state.board);
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
  }

  function deleteSubTask(index) {
    setTask((prev) => ({
      ...prev,
      subTasks: prev.subTasks.filter((subTask, idx) => idx !== index),
    }));
  }

  function addNewSubTask(e) {
    e.preventDefault();
    setTask((prev) => ({ ...prev, subTasks: [...prev.subTasks, ""] }));
  }

  function toggleList(e) {
    e.preventDefault();
    setIsListOpen(!isListOpen);
  }

  function selectStatus(status) {
    setTask((prev) => ({ ...prev, status }));
    setIsListOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newTask = {
      name: task.title,
      description: task.description,
      subTasks: task.subTasks,
      column: task.status._id,
    };
    dispatch(createNewtask({ task: newTask }));
    dispatch(close({ modal: "createTask" }));
    try {
      // const res = await fetch("http://localhost:3000/api/tasks", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     authorization: `Token ${user.token}`,
      //   },
      //   body: JSON.stringify({
      //     task: newTask,
      //   }),
      // });
      // const json = await res.json();
      // dispatch(updateTaskId({ task: json.task }));
      dispatch(postNewTask(newTask));
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
      <div ref={ref} className="bg-white p-4 rounded-md max-w-[480px] w-full">
        <h3 className="text-xl font-semibold mb-6">Add New Task</h3>
        <form>
          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Title
            </label>
            <input
              className="block w-full px-2 py-3 border border-gray-300 rounded-md text-sm outline-none"
              type="text"
              placeholder="e.g. Start learning things"
              value={task.title}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Description(optional)
            </label>
            <textarea
              className="block w-full px-2 py-3 border border-gray-300 rounded-md text-sm outline-none resize-none"
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
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2"
                    >
                      <input
                        className="block px-2 py-3 border border-gray-300 rounded-md w-[95%] outline-none text-sm"
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
              className="block px-2 py-3 border border-gray-300 rounded-md w-full text-left text-sm"
              onClick={toggleList}
            >
              {task.status === "" ? "Select a status" : task.status.name}
            </button>
            {isListOpen && (
              <ul className="absolute top-20 bg-white left-0 right-0 shadow-md rounded-md p-2">
                {activeBoard.columns.map((column, index) => {
                  return (
                    <li
                      onClick={() =>
                        selectStatus({ _id: column._id, name: column.name })
                      }
                      key={column._id}
                      className="text-gray-400 hover:text-gray-800 cursor-pointer text-sm py-1"
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
