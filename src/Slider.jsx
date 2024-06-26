import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeTheme } from "./slice/themeSlice";

function Slider() {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  function handleToggle(e) {
    dispatch(changeTheme(theme === "dark" ? "light" : "dark"));
  }

  return (
    <>
      <label
        className="w-11 h-6 bg-[#635fc7] inline-block relative rounded-full cursor-pointer transition-all"
        htmlFor="toggle"
      >
        <input
          className=" sr-only peer"
          type="checkbox"
          id="toggle"
          checked={theme === "dark"}
          onChange={handleToggle}
        />
        <span className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 peer-checked:left-6 transition-all duration-100"></span>
      </label>
    </>
  );
}
export default Slider;
