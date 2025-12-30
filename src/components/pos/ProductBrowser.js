"use client";
import Image from "next/image";

export default function ProductBrowser({ products, onAdd, onQuotation, onSuspend, onPayment }) {
  return (
    <div className="flex flex-col h-full">
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
          All
        </button>
        <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
          Category 1
        </button>
        <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
          Category 2
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => onAdd(p)}
            className="bg-white shadow rounded-lg p-2 cursor-pointer hover:shadow-lg flex flex-col items-center"
          >
            <div className="w-full h-28 relative mb-2">
              <Image
                src={p.image || "/items/placeholder.png"}
                alt={p.name}
                fill
                style={{ objectFit: "cover", borderRadius: "0.5rem" }}
              />
            </div>
            <div className="text-center text-sm font-semibold">{p.name}</div>
            <div className="text-center text-xs text-gray-600">Rs. {p.price}</div>
          </div>
        ))}
      </div>

      {/* Bottom action buttons */}
      <div className="flex gap-2 mt-4 p-2 border-t border-gray-200">
        <button onClick={onQuotation} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-300">
          Quotation
        </button>
        <button onClick={onSuspend} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
          Suspend
        </button>
        <button 
          onClick={onPayment}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Payment
        </button>
      </div>
    </div>
  );
}




// "use client";
// import Image from "next/image";

// export default function ProductBrowser({ products, onAdd }) {
//   return (
//     <div className="flex flex-col h-full">
//       {/* Category filter pills */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
//           All
//         </button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
//           Category 1
//         </button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
//           Category 2
//         </button>
//       </div>

//       {/* Product grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => onAdd(p)}
//             className="bg-white shadow rounded-lg p-2 cursor-pointer hover:shadow-lg flex flex-col items-center"
//           >
//             <div className="w-full h-28 relative mb-2">
//               <Image
//                 src={p.image || "/items/placeholder.png"}
//                 alt={p.name}
//                 fill
//                 style={{ objectFit: "cover", borderRadius: "0.5rem" }}
//               />
//             </div>
//             <div className="text-center text-sm font-semibold">{p.name}</div>
//             <div className="text-center text-xs text-gray-600">Rs. {p.price}</div>
//           </div>
//         ))}
//       </div>

//       {/* Bottom action buttons */}
//       <div className="flex gap-2 mt-4 p-2 border-t border-gray-200">
//         <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
//           Quotation
//         </button>
//         <button className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
//           Suspend
//         </button>
//         <button className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
//           Payment
//         </button>
//       </div>
//     </div>
//   );
// }
