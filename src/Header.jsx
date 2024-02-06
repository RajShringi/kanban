import MenuKebab from "./assets/MenuKebab.svg";
import kanbanLightImage from "./assets/kanban-light-logo.svg";

function Header() {
  return (
    <div className="bg-white flex  items-stretch">
      <div className="flex-[18%] flex items-center max-w-[300px] px-6  border-r border-r-[#e4ebfa]">
        <img src={kanbanLightImage} alt="kanban-logo" />
      </div>
      <div className="flex-[82%] flex justify-between items-center px-4 py-6">
        <h2 className="font-bold text-2xl">Platform Launch</h2>
        <div className="space-x-4 flex items-center">
          <button className="bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold">
            + Add new task
          </button>
          <button>
            <img src={MenuKebab} alt="MenuKebab" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
