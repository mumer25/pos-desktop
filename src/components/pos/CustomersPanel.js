export default function CustomersPanel({ customers = [], onSelect, selected }) {
  return (
    <div className="w-80 bg-white p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Customers</h2>

      <div className="flex flex-col gap-2">
        {customers.map((c) => {
          const initials = c.name
            ?.split(" ")
            .map(n => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition
                ${
                  selected?.id === c.id
                    ? "bg-blue-100 border border-blue-300"
                    : "hover:bg-gray-100"
                }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                {initials}
              </div>

              {/* Customer Info */}
              <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-800">
                  {c.name}
                </span>
                <span className="text-sm text-gray-500">
                  {c.phone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




// export default function CustomersPanel({ customers, onSelect, selected }) {
//   return (
//     <div className="w-60 bg-white p-4 border-r overflow-y-auto">
//       <h2 className="text-lg font-semibold mb-4">Customers</h2>
//       <div className="flex flex-col gap-2">
//         {customers.map((c) => (
//           <div
//             key={c.id}
//             onClick={() => onSelect(c)}
//             className={`cursor-pointer p-2 rounded ${
//               selected?.id === c.id ? "bg-blue-100" : "hover:bg-gray-100"
//             }`}
//           >
//             <div className="font-medium">{c.name}</div>
//             <div className="text-sm text-gray-500">{c.phone}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
