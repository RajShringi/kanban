import Board from "./Board";
import Sidebar from "./Sidebar";
import Header from "./Header";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fd] text-gray-900">
      <Header />
      <div className="flex flex-1">
        <div className="flex-[20%] max-w-[300px]">
          <Sidebar />
        </div>
        <div className="flex-[80%]">
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;
