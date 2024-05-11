import { useDispatch, useSelector } from "react-redux";
import Column from "./Column";
import { open } from "./slice/modalSlice";
import { DragDropContext } from "react-beautiful-dnd";
import { moveTask, moveTaskReq } from "./slice/boardSlice";

function Board() {
  const { activeBoard } = useSelector((state) => state.board);
  const columns = activeBoard?.columns;
  const dispatch = useDispatch();

  function handleNewColumnClick() {
    dispatch(open({ modal: "editBoard" }));
  }

  function handleDragEnd(e) {
    console.log(e);
    const taskId = e.draggableId;
    const destinationColumn = e.destination.droppableId;
    const destinationIndex = e.destination.index;
    const sourceColumn = e.source.droppableId;
    const dragIndex = e.source.index;

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

  return (
    <div className="flex gap-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`bg-[#e4ebfa] p-4 min-w-max flex gap-4`}>
          {!columns
            ? ""
            : columns.map((column) => (
                <Column key={column._id} column={column} />
              ))}
        </div>
      </DragDropContext>
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
