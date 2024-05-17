import { useEffect, useState } from "react";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { IoSunny } from "react-icons/io5";
import { RiMoonClearFill } from "react-icons/ri";
import { FaRegEyeSlash } from "react-icons/fa6";
import Slider from "./Slider";
import { useDispatch, useSelector } from "react-redux";
import { open } from "./slice/modalSlice";
import { fetchColumns, selectBoard } from "./slice/boardSlice";

function Sidebar({ setIsSidebarHidden }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div
      className={`min-h-full border-r  flex flex-col pt-4 pb-8 justify-between ${
        theme === "dark"
          ? "bg-[#2b2c37] border-[#2b2c37]"
          : "bg-white border-[#e4ebfa] "
      }`}
    >
      <div className="space-y-4">
        <h4 className="uppercase text-gray-500 px-6 font-semibold text-sm tracking-widest">
          All Board (3)
        </h4>
        <AllBoards />
      </div>

      <div>
        <div
          className={`flex items-center justify-center p-4 rounded-md space-x-4 mx-6 ${
            theme === "dark" ? "bg-[#20212c]" : "bg-[#f4f7fd]"
          }`}
        >
          <IoSunny className="text-xl text-gray-400" />
          <Slider />
          <RiMoonClearFill className="text-xl text-gray-400" />
        </div>
        <button
          onClick={() => setIsSidebarHidden(true)}
          className="flex items-center space-x-4 cursor-pointer py-4 pl-6 pr-6 text-gray-400 rounded-r-full hover:text-[#635fc7]"
        >
          <FaRegEyeSlash className="text-xl" />
          <p className="font-bold">Hide Sidebar</p>
        </button>
      </div>
    </div>
  );
}
export default Sidebar;

function AllBoards() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { boards, activeBoard } = useSelector((state) => state.board);
  const { user } = useSelector((state) => state.user);

  function createBoard() {
    dispatch(open({ modal: "createBoard" }));
  }

  function handleClickBoard(board) {
    dispatch(selectBoard(board));
    dispatch(fetchColumns(board.columns));
  }

  return (
    <div>
      {boards.map((board) => {
        return (
          <div
            key={board._id}
            className={`${
              activeBoard._id === board._id
                ? "bg-[#635fc7] text-white"
                : theme === "dark"
                ? "text-gray-400 hover:bg-[white] hover:text-[#635fc7]"
                : "text-gray-400 hover:bg-[#625fc71e] hover:text-[#635fc7]"
            } flex items-center space-x-4 cursor-pointer py-4 pl-6 w-[90%] rounded-r-full`}
            onClick={() => handleClickBoard(board)}
          >
            <TbLayoutBoardSplit className="text-xl" />
            <h3 className="font-bold">{board.name}</h3>
          </div>
        );
      })}
      <button
        onClick={createBoard}
        className={`flex items-center space-x-4 cursor-pointer py-4 pl-6 text-[#635fc7] rounded-r-full`}
      >
        <TbLayoutBoardSplit className="text-xl" />
        <h3 className="font-bold ">+ Create New Board</h3>
      </button>
    </div>
  );
}
