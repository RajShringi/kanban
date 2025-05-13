import { MdOutlineDeleteOutline, MdOutlineMoreVert } from "react-icons/md";
import kanbanLightImage from "./assets/kanban-light-logo.svg";
import kanbanDarkImage from "./assets/kanban-dark-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { close, open } from "./slice/modalSlice";
import { useEffect, useRef } from "react";
import { logout, userLogin } from "./slice/userSlice";
import {
  boardLogout,
  deleteBoard,
  deleteBoardReq,
  fetchBoards,
  fetchColumns,
  selectBoard,
} from "./slice/boardSlice";
import { FiEdit2, FiUser } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";

function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const { activeBoard } = useSelector((state) => state.board);
  const openHeaderTooltip = () => {
    dispatch(open({ tooltip: "header" }));
  };

  useEffect(() => {
    async function fetchUserBoards() {
      if (user) {
        const result = await dispatch(fetchBoards());
        if (result.meta.requestStatus === "fulfilled") {
          console.log(result, "header");
          const boards = result?.payload?.boards;
          const board = JSON.parse(localStorage.getItem("board"));
          if (boards.length > 0 && !board) {
            localStorage.setItem("board", JSON.stringify(boards[0]));
            dispatch(selectBoard(boards[0]));
            dispatch(fetchColumns(boards[0].columns));
          }
        }
      }
    }
    fetchUserBoards();
  }, []);

  const createTask = () => {
    dispatch(open({ modal: "createTask" }));
  };

  return (
    <div
      className={`flex  header ${
        theme === "dark" ? "bg-[#2b2c37]" : "bg-white "
      }`}
    >
      <div
        className={`flex-[20%] max-w-[300px] flex items-center px-6  border-r ${
          theme === "dark" ? "border-r-[#2b2c37]" : "border-r-[#e4ebfa]"
        }`}
      >
        {theme === "dark" ? (
          <img src={kanbanDarkImage} alt="kanban-dark-logo" />
        ) : (
          <img src={kanbanLightImage} alt="kanban-logo" />
        )}
      </div>
      <div className="flex-[80%] flex justify-between items-center px-4 py-6">
        <h2 className="font-bold text-2xl">
          {activeBoard ? activeBoard.name : ""}
        </h2>
        <div className="space-x-4 flex items-center relative">
          <button
            className="bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold disabled:cursor-not-allowed"
            onClick={createTask}
            disabled={Object.keys(activeBoard).length === 0}
          >
            + Add new task
          </button>
          <button onClick={openHeaderTooltip}>
            <MdOutlineMoreVert className="text-2xl text-gray-400 cursor-pointer" />
          </button>
          <HeaderTooltip />
        </div>
      </div>
    </div>
  );
}

function HeaderTooltip() {
  const { isHeaderTooltipVisible } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { activeBoard, boards } = useSelector((state) => state.board);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ tooltip: "header" }));
      }
    };

    if (isHeaderTooltipVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isHeaderTooltipVisible]);

  function editBoard() {
    dispatch(open({ modal: "editBoard" }));
    dispatch(close({ tooltip: "header" }));
  }

  function handleDeleteBoard() {
    dispatch(deleteBoardReq(activeBoard._id));
    dispatch(deleteBoard(activeBoard._id));
    const filterBoards = boards.filter((brd) => brd._id !== activeBoard._id);
    const board = !filterBoards[0] ? "" : filterBoards[0];
    const columns = !filterBoards[0] ? "" : filterBoards[0].columns;
    dispatch(selectBoard(board));
    dispatch(fetchColumns(columns));
    dispatch(close({ tooltip: "header" }));
  }

  function handleLogout() {
    dispatch(logout());
    dispatch(boardLogout());
    dispatch(close({ tooltip: "header" }));
  }

  if (!isHeaderTooltipVisible) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`absolute flex flex-col gap-4 p-4 rounded-md w-[150px] 2xl:w-[200px] shadow-md top-20 right-0 z-10 ${
        theme === "dark" ? "bg-[#2b2c37]" : "bg-white"
      }`}
    >
      <p
        className={`text-left text-sm text-gray-400 flex gap-2 items-center ${
          theme === "dark" ? "hover:text-white" : "hover:text-gray-700"
        }`}
      >
        <span>
          <FiUser className="text-xl" />
        </span>
        <span>{user.name}</span>
      </p>
      <button
        onClick={editBoard}
        className={`flex text-left text-sm text-gray-400 disabled:cursor-not-allowed gap-2 ${
          theme === "dark" ? "hover:text-white" : "hover:text-gray-700"
        }`}
        disabled={Object.keys(activeBoard).length === 0}
      >
        <span>
          <FiEdit2 className="text-lg" />
        </span>
        <span>Edit Board</span>
      </button>
      {/* all board column are deleted clear board button functionality */}
      {/* <button
        className={`block text-left text-sm text-gray-400 disabled:cursor-not-allowed ${
          theme === "dark" ? "hover:text-white" : "hover:text-gray-700"
        }`}
        disabled={Object.keys(activeBoard).length === 0}
      >
        Clear Board
      </button> */}

      <button
        onClick={handleDeleteBoard}
        className={`flex gap-2 text-left text-sm text-red-400  disabled:cursor-not-allowed ${
          theme === "dark" ? "hover:text-red-300" : "hover:text-red-600"
        }`}
        disabled={Object.keys(activeBoard).length === 0}
      >
        <span>
          <MdOutlineDeleteOutline className="text-xl" />
        </span>
        <span>Delete Board</span>
      </button>

      <button
        onClick={handleLogout}
        className={`flex gap-2 text-left text-sm text-[#635fc7]  disabled:cursor-not-allowed hover:text-[#635fc8c9]`}
      >
        <span>
          <TbLogout2 className="text-xl" />
        </span>
        <span>log out</span>
      </button>
    </div>
  );
}

export default Header;
