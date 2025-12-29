export default function Header({ onToggle }) {
  return (
    <div className="h-14 bg-blue-500 shadow flex items-center justify-between px-4 z-40 relative">
      <div className="flex items-center gap-3">
        {/* Toggle always visible */}
        <button
          onClick={onToggle}
          className="text-xl p-1 rounded hover:bg-gray-200 transition z-50"
        >
          ☰
        </button>
        <h1 className="font-bold text-lg">POS Desktop</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* <span className="text-sm">Cashier</span> */}
        <button className="text-red-500 text-sm">Logout</button>
      </div>
    </div>
  );
}
