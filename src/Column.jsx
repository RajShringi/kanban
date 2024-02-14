function Column() {
  const Tasks = [
    {
      id: 1,
      task: "clean your room",
      subtasks: 3,
      completedSubtaks: 2,
      completed: false,
    },

    {
      id: 2,
      task: "play Fortnite",
      subtasks: 3,
      completedSubtaks: 2,
      completed: false,
    },

    {
      id: 3,
      task: "play Fortnite",
      subtasks: 3,
      completedSubtaks: 2,
      completed: false,
    },

    {
      id: 4,
      task: "play Fortnite",
      subtasks: 3,
      completedSubtaks: 2,
      completed: false,
    },

    {
      id: 5,
      task: "play Fortnite",
      subtasks: 3,
      completedSubtaks: 2,
      completed: false,
    },

    {
      id: 6,
      task: "play Fortnite",
      subtasks: 3,
      completedSubtaks: 2,
      completed: false,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-[280px]">
      {/* Column Name */}
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <h4 className="text-slate-500 tracking-widest font-semibold text-sm uppercase">
          Todo (2)
        </h4>
      </div>

      {/* Column Tasks */}
      {Tasks &&
        Tasks.map((task) => {
          return (
            <div
              key={task.id}
              className="bg-white shadow-md rounded-md p-4 cursor-pointer"
            >
              <h3 className="font-bold text-lg text-gray-700">{task.task}</h3>
              <p className="text-xs text-gray-400 font-bold">
                {task.completedSubtaks} of {task.subtasks} subtasks
              </p>
            </div>
          );
        })}
    </div>
  );
}
export default Column;
