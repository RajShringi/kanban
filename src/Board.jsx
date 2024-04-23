import { useSelector } from "react-redux";
import Column from "./Column";

function Board() {
  const { activeBoard } = useSelector((state) => state.board);
  const columns = activeBoard?.columns;
  return (
    <div className={`bg-[#e4ebfa] p-4 min-w-max flex flex-grow gap-4`}>
      {!columns
        ? ""
        : columns.map((column) => <Column key={column._id} column={column} />)}
      <button className="flex w-[280px] py-2 shrink-0 mt-9 bg-[#f1f5fc] justify-center items-center font-bold text-2xl text-gray-500 rounded-md transition-all hover:scale-90">
        + New Column
      </button>
    </div>
  );
}

export default Board;
