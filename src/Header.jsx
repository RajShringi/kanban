import { MdOutlineMoreVert } from "react-icons/md";
import kanbanLightImage from "./assets/kanban-light-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { close, open } from "./slice/modalSlice";
import { useEffect, useRef } from "react";
import { fetchUser } from "./slice/userSlice";
import {
  deleteBoard,
  deleteBoardReq,
  fetchBoards,
  fetchColumns,
  selectBoard,
} from "./slice/boardSlice";

function Header() {
  const dispatch = useDispatch();
  // <DeleteCode>
  const { user } = useSelector((state) => state.user);
  const { activeBoard } = useSelector((state) => state.board);
  useEffect(() => {
    if (user) {
      dispatch(fetchBoards());
    }
  }, [user]);
  // </DeleteCode>
  const openHeaderTooltip = () => {
    dispatch(open({ tooltip: "header" }));
  };

  const createTask = () => {
    dispatch(open({ modal: "createTask" }));
  };

  // Delete this code <DeleteCode>
  const fakeUserLogin = () => {
    dispatch(fetchUser());
  };
  //Delete this code </DeleteCode>

  return (
    <div className="bg-white flex  header">
      <div className="flex-[20%] max-w-[300px] flex items-center px-6  border-r border-r-[#e4ebfa]">
        <img src={kanbanLightImage} alt="kanban-logo" />
      </div>
      <div className="flex-[80%] flex justify-between items-center px-4 py-6">
        <h2 className="font-bold text-2xl">Platform Launch</h2>
        <div className="space-x-4 flex items-center relative">
          <button
            className="px-6 py-3 rounded-full bg-indigo-500 text-white"
            onClick={fakeUserLogin}
          >
            {user ? user.name : "fake user"}
          </button>
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

  if (!isHeaderTooltipVisible) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="absolute flex flex-col gap-4 p-4 bg-white rounded-md w-[150px] 2xl:w-[200px] shadow-md top-20 right-0"
    >
      <button
        onClick={editBoard}
        className="block text-left text-sm text-gray-400 hover:text-gray-700"
      >
        Edit Board
      </button>
      {/* all board column are deleted clear board button functionality */}
      <button className="block text-left text-sm text-gray-400 hover:text-gray-700">
        Clear Board
      </button>
      <button
        onClick={handleDeleteBoard}
        className="block text-left text-sm text-red-400 hover:text-red-600"
      >
        Delete Board
      </button>
    </div>
  );
}

export default Header;
