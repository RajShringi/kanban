import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { close } from "../slice/modalSlice";

export default function CreateNewTask() {
  const [subTasks, setSubTasks] = useState([""]);
  const [status, setStatus] = useState(["todo", "doing", "completed"]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const dispatch = useDispatch();
  const { iscreateTaskModalVisible } = useSelector((state) => state.modal);
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
    setSubTasks((prev) => {
      const newSubTasks = [...prev];
      newSubTasks[index] = e.target.value;
      return newSubTasks;
    });
  }

  function deleteSubTask(index) {
    setSubTasks(subTasks.filter((subTask, idx) => idx !== index));
  }

  function addNewSubTask(e) {
    e.preventDefault();
    setSubTasks([...subTasks, ""]);
  }

  function toggleList(e) {
    e.preventDefault();
    setIsListOpen(!isListOpen);
  }

  function selectStatus(status) {
    setCurrentStatus(status);
    setIsListOpen(false);
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
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Description(optional)
            </label>
            <textarea
              className="block w-full px-2 py-3 border border-gray-300 rounded-md text-sm outline-none resize-none"
              placeholder="e.g. Start learning things"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Subtasks
            </label>
            <div className="flex flex-col gap-4">
              {/* repeat this for column */}
              <div className="flex flex-col gap-4 max-h-[150px] overflow-auto">
                {subTasks.map((subTask, index) => {
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
              {currentStatus === "" ? "Select a status" : currentStatus}
            </button>
            {isListOpen && (
              <ul className="absolute top-20 bg-white left-0 right-0 shadow-md rounded-md p-2">
                {status.map((sta, index) => {
                  return (
                    <li
                      onClick={() => selectStatus(sta)}
                      key={index}
                      className="text-gray-400 hover:text-gray-800 cursor-pointer text-sm py-1"
                    >
                      {sta}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button className="block mt-4 w-full bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold">
            Create Task
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
