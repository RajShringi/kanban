import { useDispatch, useSelector } from "react-redux";
import Column from "./Column";
import { open } from "./slice/modalSlice";
import { DragDropContext } from "react-beautiful-dnd";
import { moveTask, moveTaskReq } from "./slice/boardSlice";
import BoardEmpty from "./components/BoardEmpty";
import NoBoardAlert from "./components/NoBoardAlert";
import Loader from "./components/Loader";

function Board() {
  const { activeBoard, boards, moveTaskLoading } = useSelector(
    (state) => state.board
  );
  const columns = activeBoard?.columns;
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  function handleNewColumnClick() {
    dispatch(open({ modal: "editBoard" }));
  }

  function handleDragEnd(e) {
    const taskId = e?.draggableId;
    const destinationColumn = e?.destination?.droppableId;
    const destinationIndex = e?.destination?.index;
    const sourceColumn = e?.source?.droppableId;
    const dragIndex = e?.source?.index;
    if (sourceColumn === destinationColumn && dragIndex === destinationIndex) {
      return;
    }

    dispatch(
      moveTask({
        taskId,
        destinationColumn,
        sourceColumn,
        dragIndex,
        destinationIndex,
      })
    );
    const moveInfo = {
      taskId,
      sourceColumnId: sourceColumn,
      destinationColumnId: destinationColumn,
      destinationIndex,
    };
    dispatch(moveTaskReq(moveInfo));
  }

  if (moveTaskLoading) {
    return (
      <div className="flex justify-center items-center gap-4 h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className={`p-4 w-full flex gap-4 ${
            theme === "dark" ? "bg-[#20212c]" : "bg-[#e4ebfa] "
          }`}
        >
          {boards.length === 0 ? (
            <NoBoardAlert />
          ) : !columns || columns.length === 0 ? (
            <BoardEmpty />
          ) : (
            columns.map((column) => <Column key={column._id} column={column} />)
          )}
          {/* {!columns ? (
            boards.length === 0 ? (
              <NoBoardAlert />
            ) : (
              <BoardEmpty />
            )
          ) : (
            columns.map((column) => <Column key={column._id} column={column} />)
          )} */}
        </div>
      </DragDropContext>
      {boards.length === 0 ? (
        ""
      ) : columns && columns.length > 0 ? (
        <button
          onClick={handleNewColumnClick}
          disabled={Object.keys(activeBoard).length === 0}
          className={`flex w-[280px] py-2 shrink-0 my-9  justify-center items-center font-bold text-2xl  rounded-md transition-all hover:scale-90 disabled:cursor-not-allowed ${
            theme === "dark"
              ? "bg-[#2b2c3775] text-white"
              : "bg-[#f1f5fc] text-gray-500"
          }`}
        >
          + New Column
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default Board;
