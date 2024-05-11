import { Droppable } from "react-beautiful-dnd";
import Task from "./components/Task";
import { memo } from "react";

function Column({ column }) {
  if (!column) {
    return;
  }

  return (
    <Droppable droppableId={column._id}>
      {(provided) => (
        <div className="flex flex-col gap-4 w-[280px]">
          {/* Column Name */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <h4 className="text-slate-500 tracking-widest font-semibold text-sm uppercase">
              {column.name} ({column.tasks.length})
            </h4>
          </div>

          {/* Column Tasks */}
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col flex-grow transition-all"
          >
            {column.tasks.map((task, index) => {
              return <Task key={task._id} task={task} index={index} />;
            })}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
export default memo(Column);
