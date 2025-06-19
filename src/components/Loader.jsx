function Loader({ asButton }) {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className={`"text-center ${asButton ? "m-0" : "my-4"}"`}>
        <div className="animate-spin w-8 h-8 border-4 rounded-full inline-block  border-t-transparent border-indigo-400"></div>
      </div>
    </div>
  );
}
export default Loader;
