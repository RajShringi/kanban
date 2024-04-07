import { MdOutlineMoreVert } from "react-icons/md";
import kanbanLightImage from "./assets/kanban-light-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { close, open } from "./slice/modalSlice";
import { useEffect, useRef } from "react";

function Header() {
  const dispatch = useDispatch();

  const openHeaderTooltip = () => {
    dispatch(open({ tooltip: "header" }));
  };
  return (
    <div className="bg-white flex items-stretch header">
      <div className="flex-[20%] flex items-center max-w-[300px] px-6  border-r border-r-[#e4ebfa]">
        <img src={kanbanLightImage} alt="kanban-logo" />
      </div>
      <div className="flex-[80%] flex justify-between items-center px-4 py-6">
        <h2 className="font-bold text-2xl">Platform Launch</h2>
        <div className="space-x-4 flex items-center relative">
          <button className="bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold">
            + Add new task
          </button>
          <button onClick={openHeaderTooltip}>
            <MdOutlineMoreVert className="text-2xl text-gray-400" />
          </button>
          <HeaderTooltip />
        </div>
      </div>
    </div>
  );
}

function HeaderTooltip() {
  const { isHeaderTooltipVisible } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(close({ tooltip: "header" }));
      }
    };

    if (isHeaderTooltipVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isHeaderTooltipVisible]);

  if (!isHeaderTooltipVisible) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="absolute flex flex-col gap-4 p-4 bg-white rounded-md w-[40vh] shadow-md top-20 right-0"
    >
      <button className="block text-left text-sm text-gray-400 hover:text-gray-700">
        Edit Board
      </button>
      {/* all board column are deleted clear board button functionality */}
      <button className="block text-left text-sm text-gray-400 hover:text-gray-700">
        Clear Board
      </button>
      <button className="block text-left text-sm text-red-400 hover:text-red-600">
        Delete Board
      </button>
    </div>
  );
}

export default Header;
