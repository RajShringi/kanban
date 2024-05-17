import React from "react";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { open } from "../slice/modalSlice";

export default function NoBoardAlert() {
  const dispatch = useDispatch();

  function createBoard() {
    dispatch(open({ modal: "createBoard" }));
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <button
        onClick={createBoard}
        className={`flex items-center gap-4 bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold disabled:cursor-not-allowed`}
      >
        <TbLayoutBoardSplit className="text-xl" />
        <h3 className="font-bold ">+ Create New Board</h3>
      </button>
    </div>
  );
}
