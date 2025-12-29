import { FaCashRegister, FaListAlt, FaChartLine, FaCog } from "react-icons/fa";

export default function Sidebar({ open, onClose }) {
  const menuItems = [
    { name: "POS", icon: <FaCashRegister size={24} /> },
    { name: "Customers", icon: <FaListAlt size={24} /> },
    { name: "Items", icon: <FaChartLine size={24} /> },
    // { name: "Settings", icon: <FaCog size={24} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 h-[calc(100%-56px)] w-30 bg-white text-black p-4 z-30
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="mb-4 text-white md:hidden"
          onClick={onClose}
        >
          ✕ Close
        </button>

        <nav className="mt-4 flex flex-col gap-4 text-center">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-gray-300 p-3 rounded flex flex-col items-center"
            >
              <div className="mb-1">{item.icon}</div>
              <div className="text-sm font-medium">{item.name}</div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
