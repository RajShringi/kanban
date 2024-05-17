import React from "react";
import { useDispatch } from "react-redux";
import { open } from "../slice/modalSlice";

export default function BoardEmpty() {
  const dispatch = useDispatch();

  function createBoard() {
    dispatch(open({ modal: "editBoard" }));
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <p>This board is empty. Create a new column to get started.</p>
        <div>
          <button
            onClick={createBoard}
            className={`flex items-center gap-4 bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold disabled:cursor-not-allowed`}
          >
            <h3 className="font-bold ">+ Add New Column</h3>
          </button>
        </div>
      </div>
    </div>
  );
}
