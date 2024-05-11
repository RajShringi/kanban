import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { close } from "../slice/modalSlice";
import { editBoard, editBoardReq } from "../slice/boardSlice";

export default function EditBoard() {
  const [columns, setColumns] = useState(["", ""]);
  const { activeBoard, boards } = useSelector((state) => state.board);
  const boardInfo = {
    _id: activeBoard._id,
    name: activeBoard.name,
    columns: activeBoard.columns,
  };
  const columnsBeforeUpdate = activeBoard.columns;
  const [board, setBoard] = useState(boardInfo);
  const ref = useRef(null);
  const [errors, SetErrors] = useState({
    boardNameErr: "",
    columnsErr: board.columns.map((col) => ""),
  });

  const { isEditBoardModalVisible } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ modal: "editBoard" }));
      }
    }

    if (isEditBoardModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditBoardModalVisible, close]);

  function addColumnInput(e) {
    e.preventDefault();
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, { name: "" }],
    }));
    SetErrors((prev) => {
      return {
        ...prev,
        columnsErr: [...prev.columnsErr, ""],
      };
    });
  }

  function handleColumnInput(e, index) {
    setBoard((prev) => {
      const newColumns = JSON.parse(JSON.stringify([...prev.columns]));
      newColumns[index].name = e.target.value;
      return { ...prev, columns: newColumns };
    });
    SetErrors((prev) => {
      const col = [...prev.columnsErr];
      col[index] = "";
      return { ...prev, columnsErr: col };
    });
  }

  function deleteColumnInput(index) {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col, idx) => idx !== index),
    }));
    SetErrors((prev) => {
      return {
        ...prev,
        columnsErr: prev.columnsErr.filter((col, idx) => idx !== index),
      };
    });
  }

  function columnsActions() {
    let addUpdateActions = board.columns
      .map((column) => {
        console.log({ column });
        if (!Object.hasOwn(column, "_id")) {
          return { name: column.name, action: "add" };
        }
        const index = columnsBeforeUpdate.findIndex(
          (col) => col._id === column._id
        );
        if (index !== -1 && columnsBeforeUpdate[index].name !== column.name) {
          return { _id: column._id, name: column.name, action: "update" };
        }
      })
      .filter(Boolean);

    const deletedColumns = columnsBeforeUpdate
      .map((column) => {
        if (board.columns.findIndex((col) => col._id === column._id) === -1) {
          return { _id: column._id, action: "delete", name: column.name };
        }
      })
      .filter(Boolean);
    const columnsWithActions = [...addUpdateActions, ...deletedColumns];
    console.log(columnsWithActions, "columnsActions");
    return columnsWithActions;
  }

  function handleBoardName(e) {
    SetErrors((prev) => ({ ...prev, boardNameErr: "" }));
    setBoard((prev) => ({ ...prev, name: e.target.value }));
  }

  function validate() {
    let isValid = true;
    if (!board.name) {
      SetErrors((prev) => ({ ...prev, boardNameErr: "Field can't be empty" }));
      isValid = false;
    }
    if (
      board.name !== activeBoard.name &&
      boards.map((bd) => bd.name).includes(board.name)
    ) {
      SetErrors((prev) => ({
        ...prev,
        boardNameErr: "Board is already present",
      }));
      isValid = false;
    }
    const columnsErr = board.columns.map((col) =>
      col.name === "" ? "Field can't be empty" : ""
    );
    SetErrors((prev) => ({ ...prev, columnsErr }));
    if (columnsErr.some((err) => err !== "")) {
      isValid = false;
    }
    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    dispatch(
      editBoardReq({
        _id: board._id,
        name: board.name,
        columns: columnsActions(),
      })
    );
    dispatch(editBoard({ board }));
    dispatch(close({ modal: "editBoard" }));
  }

  if (!isEditBoardModalVisible) {
    return null;
  }

  return ReactDom.createPortal(
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75">
      <div ref={ref} className="bg-white p-4 rounded-md max-w-[480px] w-full">
        <h3 className="text-xl font-semibold mb-6">Edit Board</h3>
        <form>
          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Board Name
            </label>
            <input
              className={`block w-full px-2 py-3 border border-gray-300 rounded-md text-sm outline-none ${
                errors.boardNameErr ? "border-red-400" : ""
              }`}
              type="text"
              placeholder="e.g. Web Development"
              value={board.name}
              onChange={handleBoardName}
            />
            <span className="text-sm text-red-400">{errors.boardNameErr}</span>
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-bold mb-2">
              Board Columns
            </label>
            <div className="flex flex-col gap-4">
              {/* repeat this for column */}
              <div className="flex flex-col gap-4 max-h-[150px] overflow-auto">
                {board.columns.map((column, index) => {
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className={`block px-2 py-3 border border-gray-300 rounded-md w-[95%] outline-none text-sm 
                          ${errors.columnsErr[index] ? "border-red-400" : ""}`}
                          type="text"
                          placeholder="column name"
                          value={column.name}
                          onChange={(e) => handleColumnInput(e, index)}
                        />
                        <RxCross2
                          onClick={() => deleteColumnInput(index)}
                          className="text-3xl w-[5%]  text-gray-500 cursor-pointer"
                        />
                      </div>
                      <span className="text-sm text-red-400">
                        {errors.columnsErr[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={addColumnInput}
                className="block bg-[#625fc721] hover:bg-[#625fc70a] px-2 py-3 rounded-full text-[#635fc7] font-bold"
              >
                + Add New Column
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="block mt-4 w-full bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold"
          >
            Edit Board
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
