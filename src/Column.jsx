function Column({ column }) {
  return (
    <div className="flex flex-col gap-4 w-[280px]">
      {/* Column Name */}
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <h4 className="text-slate-500 tracking-widest font-semibold text-sm uppercase">
          {column.name} ({column.tasks.length})
        </h4>
      </div>

      {/* Column Tasks */}
      {column &&
        column.tasks.length !== 0 &&
        column.tasks.map((task) => {
          return (
            <div
              key={task._id}
              className="bg-white shadow-md rounded-md p-4 cursor-pointer"
            >
              <h3 className="font-bold text-lg text-gray-700">{task.name}</h3>
              <p className="text-xs text-gray-400 font-bold">
                {task?.subTasks.filter((subTask) => subTask.isDone).length} of{" "}
                {task?.subTasks.length} subtasks
              </p>
            </div>
          );
        })}
    </div>
  );
}
export default Column;
