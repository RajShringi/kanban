import Board from "./Board";
import Sidebar from "./Sidebar";
import Header from "./Header";

function App() {
  return (
    <div className="flex flex-col min-h-screen  ">
      <Header />
      <div className="flex flex-1">
        <div className="flex-[15%]">
          <Sidebar />
        </div>
        <div className="flex-[85%]">
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;
