import Board from "./Board";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";
import CreateNewBoard from "./components/CreateNewBoard";
import EditBoard from "./components/EditBoard";
import CreateNewTask from "./components/CreateNewTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchColumns, selectBoard } from "./slice/boardSlice";
import TaskDetailsModal from "./components/TaskDetailsModal";
import EditTask from "./components/EditTask";
import { FaRegEye } from "react-icons/fa6";
import { changeTheme } from "./slice/themeSlice";
import Loader from "./components/Loader";

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const dispatch = useDispatch();
  const {
    isCreateBoardModalVisible,
    isEditBoardModalVisible,
    iscreateTaskModalVisible,
    isEditTaskModalVisible,
    isTaskDetailsVisible,
  } = useSelector((state) => state.modal);
  const { theme } = useSelector((state) => state.theme);
  const { fetchBoardsLoading, fetchColumnsLoading } = useSelector(
    (state) => state.board
  );

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Add event listener to listen for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener when component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const board = JSON.parse(localStorage.getItem("board")) || "";
    if (board) {
      dispatch(selectBoard(board));
      dispatch(fetchColumns(board.columns));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const boardMaxHeight = windowHeight - headerHeight;

  return (
    <div
      className={`flex flex-col min-h-screen   ${
        theme === "dark"
          ? "bg-[#2b2c37] text-white"
          : "bg-[#f4f7fd] text-gray-900"
      }`}
    >
      <Header />
      {fetchBoardsLoading && fetchColumnsLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-1">
          <div
            className={`flex-[20%] max-w-[300px] ${
              isSidebarHidden ? "hidden" : "block"
            }`}
          >
            <Sidebar setIsSidebarHidden={setIsSidebarHidden} />
          </div>
          <div
            className={`flex-[80%] flex flex-col overflow-auto  board-container ${
              theme === "dark" ? "bg-[#20212c]" : "bg-[#e4ebfa]"
            }`}
            style={{ height: `${boardMaxHeight}px` }}
          >
            <Board />
          </div>
        </div>
      )}

      {isSidebarHidden && (
        <button
          onClick={() => setIsSidebarHidden(false)}
          className="absolute bg-[#635fc7] w-12 h-12 bottom-10 rounded-tr-full rounded-br-full flex items-center justify-center"
        >
          <FaRegEye className="text-lg text-white" />
        </button>
      )}

      {isCreateBoardModalVisible && <CreateNewBoard />}
      {isEditBoardModalVisible && <EditBoard />}
      {iscreateTaskModalVisible && <CreateNewTask />}
      {isEditTaskModalVisible && <EditTask />}
      {isTaskDetailsVisible && <TaskDetailsModal />}
    </div>
  );
}

export default App;
