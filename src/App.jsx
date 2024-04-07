import Board from "./Board";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";
import CreateNewBoard from "./components/CreateNewBoard";

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
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
    </div>
  );
}

export default App;
