import Board from "./Board";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";
import CreateNewBoard from "./components/CreateNewBoard";
import EditBoard from "./components/EditBoard";
import CreateNewTask from "./components/CreateNewTask";
import { useDispatch } from "react-redux";
import { fetchColumns, selectBoard } from "./slice/boardSlice";

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const board = JSON.parse(localStorage.getItem("board")) || "";
    if (board) {
      dispatch(selectBoard(board));
      dispatch(fetchColumns(board.columns));
    }
  }, []);

  const boardMaxHeight = `calc(100vh-${headerHeight}px)`;
  console.log({ boardMaxHeight });

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fd] text-gray-900">
      <Header />
      <div className="flex flex-1">
        <div className="flex-[20%] max-w-[300px]">
          <Sidebar />
        </div>
        <div
          className={`flex flex-col flex-[80%] h-[${boardMaxHeight}] overflow-auto bg-[#e4ebfa] board-container`}
        >
          <Board />
        </div>
      </div>
      <CreateNewBoard />
      <EditBoard />
      <CreateNewTask />
    </div>
  );
}

export default App;
