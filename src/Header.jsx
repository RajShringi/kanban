function Header() {
  return (
    <div className="bg-[#f4f7fd] flex justify-between py-6">
      <div className="flex-[15%]">Kanban</div>
      <div className="flex-[85%] flex justify-between">
        <h2>Example Board</h2>
        <div className="space-x-4">
          <button>+Add new task</button>
          <button>icon</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
