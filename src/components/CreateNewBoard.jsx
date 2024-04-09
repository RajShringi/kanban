import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import ReactDom from "react-dom";
import { useEffect, useRef, useState } from "react";
import { close } from "../slice/modalSlice";

function CreateNewBoard() {
  const [boardName, SetBoardName] = useState("");
  const [columns, setColumns] = useState(["", ""]);
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
  }

  function handleColumnInput(e, index) {
    setColumns((prev) => {
      const col = [...prev];
      col[index] = e.target.value;
      return col;
    });
  }

  function deleteColumnInput(index) {
    setColumns((prev) => {
      return prev.filter((column, idx) => idx !== index);
    });
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
              className="block w-full px-2 py-3 border border-gray-300 rounded-md text-sm outline-none"
              type="text"
              placeholder="e.g. Web Development"
              value={boardName}
              onChange={(e) => SetBoardName(e.target.value)}
            />
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
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2"
                    >
                      <input
                        className="block px-2 py-3 border border-gray-300 rounded-md w-[95%] outline-none text-sm"
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
          <button className="block mt-4 w-full bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold">
            Create New Board
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default CreateNewBoard;
