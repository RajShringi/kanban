import { useState } from "react";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { IoSunny } from "react-icons/io5";
import { RiMoonClearFill } from "react-icons/ri";
import { FaRegEyeSlash } from "react-icons/fa6";
import Slider from "./Slider";
import { useDispatch } from "react-redux";
import { open } from "./slice/modalSlice";

const userBoards = ["Example Board1", "Example Board2", "Example Board3"];

function Sidebar() {
  return (
    <div className="bg-white min-h-full border-r border-[#e4ebfa] flex flex-col pt-4 pb-8 justify-between">
      <div className="space-y-4">
        <h4 className="uppercase text-gray-500 px-6 font-semibold text-sm tracking-widest">
          All Board (3)
        </h4>
        <AllBoards />
      </div>

      <div>
        <div className="flex items-center justify-center p-4 rounded-md space-x-4 mx-6 bg-[#f4f7fd]">
          <IoSunny className="text-xl text-gray-400" />
          <Slider />
          <RiMoonClearFill className="text-xl text-gray-400" />
        </div>
        <button className="flex items-center space-x-4 cursor-pointer py-4 pl-6 pr-6 text-gray-400 rounded-r-full hover:text-[#635fc7]">
          <FaRegEyeSlash className="text-xl" />
          <p className="font-bold">Hide Sidebar</p>
        </button>
      </div>
    </div>
  );
}
export default Sidebar;

function AllBoards() {
  const [Boards, setBoards] = useState(userBoards);
  const [activeBoard, setActiveBoard] = useState("Example Board1");
  const dispatch = useDispatch();

  function createBoard() {
    dispatch(open({ modal: "createBoard" }));
  }

  return (
    <div>
      {Boards.map((board, index) => {
        return (
          <div
            key={index}
            className={`${
              activeBoard === board
                ? "bg-[#635fc7] text-white"
                : "text-gray-400 hover:bg-[#625fc71e] hover:text-[#635fc7]"
            } flex items-center space-x-4 cursor-pointer py-4 pl-6 w-[90%] rounded-r-full`}
          >
            <TbLayoutBoardSplit className="text-xl" />
            <h3 className="font-bold">{board}</h3>
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
