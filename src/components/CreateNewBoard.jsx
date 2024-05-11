import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import ReactDom from "react-dom";
import { useEffect, useRef, useState } from "react";
import { close } from "../slice/modalSlice";
import { createBoard, createNewBoardReq } from "../slice/boardSlice";

function CreateNewBoard() {
  const [boardName, SetBoardName] = useState("");
  const [columns, setColumns] = useState(["", ""]);
  const [errors, SetErrors] = useState({
    boardNameErr: "",
    columnsErr: ["", ""],
  });
  const { boards } = useSelector((state) => state.board);

  const ref = useRef("");
  const dispatch = useDispatch();
  const { isCreateBoardModalVisible } = useSelector((state) => state.modal);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ modal: "createBoard" }));
      }
    };

    if (isCreateBoardModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateBoardModalVisible, close]);

  function addColumnInput(e) {
    e.preventDefault();
    setColumns([...columns, ""]);
    SetErrors((prev) => {
      return {
        ...prev,
        columnsErr: [...prev.columnsErr, ""],
      };
    });
  }

  function handleColumnInput(e, index) {
    setColumns((prev) => {
      const col = [...prev];
      col[index] = e.target.value;
      return col;
    });
    SetErrors((prev) => {
      const col = [...prev.columnsErr];
      col[index] = "";
      return { ...prev, columnsErr: col };
    });
  }

  function deleteColumnInput(index) {
    setColumns((prev) => {
      return prev.filter((column, idx) => idx !== index);
    });

    SetErrors((prev) => {
      return {
        ...prev,
        columnsErr: prev.columnsErr.filter((col, idx) => idx !== index),
      };
    });
  }

  function handleBoardName(e) {
    SetErrors((prev) => ({ ...prev, boardNameErr: "" }));
    SetBoardName(e.target.value);
  }

  function validate() {
    let isValid = true;
    if (!boardName) {
      SetErrors((prev) => ({ ...prev, boardNameErr: "Field can't be empty" }));
      isValid = false;
    }
    if (boards.map((board) => board.name).includes(boardName)) {
      SetErrors((prev) => ({
        ...prev,
        boardNameErr: "Board is already present",
      }));
      isValid = false;
    }
    const columnsErr = columns.map((col) =>
      col === "" ? "Field can't be empty" : ""
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
    dispatch(createBoard({ name: boardName, columns }));
    dispatch(createNewBoardReq({ name: boardName, columns }));
    dispatch(close({ modal: "createBoard" }));
  }

  if (!isCreateBoardModalVisible) {
    return null;
  }

  return ReactDom.createPortal(
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75">
      <div ref={ref} className="bg-white p-4 rounded-md max-w-[480px] w-full">
        <h3 className="text-xl font-semibold mb-6">Add New Board</h3>
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
              value={boardName}
              required
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
                {columns.map((columnInput, index) => {
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className={`block px-2 py-3 border border-gray-300 rounded-md w-[95%] outline-none text-sm 
                          ${errors.columnsErr[index] ? "border-red-400" : ""}`}
                          type="text"
                          placeholder="column name"
                          value={columnInput}
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
            Create New Board
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default CreateNewBoard;
