import { useDispatch, useSelector } from "react-redux";
import Column from "./Column";
import { open } from "./slice/modalSlice";

function Board() {
  const { activeBoard } = useSelector((state) => state.board);
  const columns = activeBoard?.columns;
  const dispatch = useDispatch();
  function handleNewColumnClick() {
    dispatch(open({ modal: "editBoard" }));
  }

  return (
    <div className={`bg-[#e4ebfa] p-4 min-w-max flex gap-4`}>
      {!columns
        ? ""
        : columns.map((column) => <Column key={column._id} column={column} />)}
      <button
        onClick={handleNewColumnClick}
        className="flex w-[280px] py-2 shrink-0 mt-9 bg-[#f1f5fc] justify-center items-center font-bold text-2xl text-gray-500 rounded-md transition-all hover:scale-90"
      >
        + New Column
      </button>
    </div>
  );
}

export default Board;
