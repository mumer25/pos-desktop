"use client";
import { useState } from "react";
import { FaTimes, FaExclamationCircle, FaTrash, FaPlus, FaHistory } from "react-icons/fa";

export default function Header({ onToggle, orderStatus, suspendedOrders = [], onLoadSuspended, onDeleteSuspended }) {
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);

  return (
    <div className="h-16 bg-blue-600 text-white flex items-center justify-between px-4 shadow-md relative">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="text-white text-2xl p-2 rounded hover:bg-blue-500 transition"
        >
          ☰
        </button>

        <div className="flex flex-col leading-tight">
          <span className="text-xs text-gray-200 uppercase">Location</span>
          <span className="font-bold">Main Branch</span>
        </div>

        <div className="flex flex-col ml-4 leading-tight">
          <span className="text-xs text-gray-200 uppercase">Order Status</span>
          <span className="font-bold">
            {orderStatus === "none" ? "Idle" : orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 bg-black/80 hover:bg-gray-600 px-3 py-1 rounded transition">
          <FaPlus /> Add Expense
        </button>
        <button className="flex items-center gap-1 bg-black/80 hover:bg-gray-600 px-3 py-1 rounded transition">
          <FaHistory /> Transactions
        </button>

        {/* Suspended Orders Button */}
        <button
          onClick={() => setShowSuspendedModal(true)}
          className="relative flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded transition"
        >
          <FaExclamationCircle /> Suspended Orders
          {suspendedOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {suspendedOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* SUSPENDED ORDERS MODAL */}
      {showSuspendedModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto relative p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <FaExclamationCircle className="text-yellow-500" /> Suspended Orders
              </h2>
              <button
                onClick={() => setShowSuspendedModal(false)}
                className="text-gray-400 hover:text-red-500 text-lg transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}
            {suspendedOrders.length === 0 ? (
              <div className="text-gray-500 text-center py-10">
                No suspended orders available
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {suspendedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md cursor-pointer transition bg-gray-50"
                  >
                    <div
                      className="flex flex-col flex-1"
                      onClick={() => {
                        onLoadSuspended(order);
                        setShowSuspendedModal(false);
                      }}
                    >
                      <span className="font-semibold text-gray-700">
                        {order.customer?.name || "Walk-in Customer"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.items?.length || 0} items | Total: Rs. {order.totalPayable?.toFixed(2) || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer"
                        onClick={() => {
                          onLoadSuspended(order);
                          setShowSuspendedModal(false);
                        }}
                      >
                        Resume
                      </span>
                      <FaTrash
                        className="text-red-500 hover:text-red-700 cursor-pointer transition"
                        onClick={() => onDeleteSuspended(order.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER */}
            {/* <button
              onClick={() => setShowSuspendedModal(false)}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition font-semibold"
            >
              Close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}




// "use client";
// import { useState } from "react";

// export default function Header({ onToggle, orderStatus }) {
//   return (
//     <div className="h-16 bg-blue-600 text-white flex items-center justify-between px-4 shadow relative">
//       {/* Left Section: Toggle + Location */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onToggle}
//           className="text-white text-xl p-2 rounded hover:bg-blue-500 transition z-50"
//         >
//           ☰
//         </button>

//         <div className="flex items-center gap-1">
//           <span className="font-medium">Location:</span>
//           <span className="font-bold">Main Branch</span>
//         </div>

//         {/* Order Status */}
//         <div className="flex items-center gap-1 ml-4">
//           <span className="font-medium">Order Status:</span>
//           <span className="font-bold">
//             {orderStatus === "none" ? "Idle" : orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
//           </span>
//         </div>
//       </div>

//       {/* Right Section: Action Buttons */}
//       <div className="flex items-center gap-4">
//         <button className="bg-black px-3 py-1 rounded hover:bg-green-600">
//           Add Expense
//         </button>
//         <button className="bg-black px-3 py-1 rounded hover:bg-yellow-600">
//           Recent Transactions
//         </button>
//       </div>
//     </div>
//   );
// }






// "use client";
// import { useState } from "react";

// export default function Header({ onToggle }) {
//   return (
//     <div className="h-16 bg-blue-600 text-white flex items-center justify-between px-4 shadow relative">
//       {/* Left Section: Toggle + Location */}
//       <div className="flex items-center gap-3">
//         {/* Toggle Button */}
//         <button
//           onClick={onToggle}
//           className="text-white text-xl p-2 rounded hover:bg-blue-500 transition z-50"
//         >
//           ☰
//         </button>

//         {/* Location */}
//         <div className="flex items-center gap-1">
//           <span className="font-medium">Location:</span>
//           <span className="font-bold">Main Branch</span>
//         </div>
//       </div>

//       {/* Right Section: Action Buttons */}
//       <div className="flex items-center gap-4">
//         <button className="bg-black px-3 py-1 rounded hover:bg-green-600">
//           Add Expense
//         </button>
//         <button className="bg-black px-3 py-1 rounded hover:bg-yellow-600">
//           Recent Transactions
//         </button>
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useState } from "react";

// export default function Header({
//   onToggle,
//   customers,
//   selectedCustomer,
//   onSelectCustomer
// }) {
//   const [search, setSearch] = useState("");

//   return (
//     <div className="h-16 bg-blue-600 text-white flex items-center justify-between px-4 shadow relative">
//       {/* Left Section: Toggle + Location */}
//       <div className="flex items-center gap-3">
//         {/* Toggle Button */}
//         <button
//           onClick={onToggle}
//           className="text-white text-xl p-2 rounded hover:bg-blue-500 transition"
//         >
//           ☰
//         </button>

//         {/* Location */}
//         <div className="flex items-center gap-1">
//           <span className="font-medium">Location:</span>
//           <span className="font-bold">Main Branch</span>
//         </div>
//       </div>

//       {/* Right Section: Actions & Tabs */}
//       <div className="flex items-center gap-4">
//         {/* Optional: Customer Select */}
//         {customers && customers.length > 0 && (
//           <select
//             value={selectedCustomer?.id || ""}
//             onChange={(e) => {
//               const customer = customers.find(
//                 (c) => c.id === parseInt(e.target.value)
//               );
//               onSelectCustomer(customer);
//             }}
//             className="text-black px-2 py-1 rounded"
//           >
//             <option value="">Select Customer</option>
//             {customers.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name} ({c.phone})
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Action Buttons */}
//         <button className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">
//           Add Expense
//         </button>
//         <button className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">
//           Recent Transactions
//         </button>

//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-2 py-1 rounded text-black"
//         />
//       </div>
//     </div>
//   );
// }




// export default function Header({ onToggle }) {
//   return (
//     <div className="h-14 bg-blue-500 shadow flex items-center justify-between px-4 z-40 relative">
//       <div className="flex items-center gap-3">
//         {/* Toggle always visible */}
//         <button
//           onClick={onToggle}
//           className="text-xl p-1 rounded hover:bg-gray-200 transition z-50"
//         >
//           ☰
//         </button>
//         <h1 className="font-bold text-lg">POS Desktop</h1>
//       </div>

//       <div className="flex items-center gap-4">
//         {/* <span className="text-sm">Cashier</span> */}
//         <button className="text-red-500 text-sm">Logout</button>
//       </div>
//     </div>
//   );
// }
