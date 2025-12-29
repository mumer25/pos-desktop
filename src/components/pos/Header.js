"use client";
import { useState } from "react";

export default function Header({ onToggle }) {
  return (
    <div className="h-16 bg-blue-600 text-white flex items-center justify-between px-4 shadow relative">
      {/* Left Section: Toggle + Location */}
      <div className="flex items-center gap-3">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="text-white text-xl p-2 rounded hover:bg-blue-500 transition z-50"
        >
          ☰
        </button>

        {/* Location */}
        <div className="flex items-center gap-1">
          <span className="font-medium">Location:</span>
          <span className="font-bold">Main Branch</span>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-4">
        <button className="bg-black px-3 py-1 rounded hover:bg-green-600">
          Add Expense
        </button>
        <button className="bg-black px-3 py-1 rounded hover:bg-yellow-600">
          Recent Transactions
        </button>
      </div>
    </div>
  );
}



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
