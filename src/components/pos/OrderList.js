"use client";
import { useState, useMemo } from "react";
import { FaPlus, FaMinus, FaTimes, FaEdit } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast

export default function OrderList({
  items,
  setItems,
  discount,
  setDiscount,
  orderTax,
  setOrderTax,
  shipping,
  setShipping,
  packingService,
  setPackingService,
}) {
  const [editField, setEditField] = useState(null);

  /* ------------------ Item Controls ------------------ */
  const increment = (id) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
    toast.success("Quantity increased");
  };

  const decrement = (id) => {
    const updated = items
      .map((i) =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      )
      .filter((i) => i.qty > 0);

    setItems(updated);

    toast.success("Quantity decreased");
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
    toast.error("Item removed");
  };

  /* ------------------ Calculations ------------------ */
  const itemsCount = items.reduce((sum, i) => sum + i.qty, 0);

  const itemsSubTotal = useMemo(() => {
    return items.reduce((sum, i) => sum + i.qty * i.price, 0);
  }, [items]);

  const calculatedDiscount = (itemsSubTotal * discount) / 100;
  const calculatedTax = (itemsSubTotal * orderTax) / 100;

  const totalPayable = Math.max(
    0,
    itemsSubTotal - calculatedDiscount + calculatedTax + shipping + packingService
  );

  /* ------------------ Handlers ------------------ */
  const handleValueChange = (field, value) => {
    const val = Math.max(0, parseFloat(value) || 0);

    switch (field) {
      case "Discount":
        setDiscount(val);
        break;
      case "Order Tax":
        setOrderTax(val);
        break;
      case "Shipping":
        setShipping(val);
        break;
      case "Packing/Service":
        setPackingService(val);
        break;
      default:
        break;
    }

    toast.success(`${field} updated`);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="flex flex-col h-full">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="grid grid-cols-6 bg-gray-100 font-semibold text-sm px-3 py-2 border-b">
        <div className="col-span-2">Product</div>
        <div className="text-right">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Subtotal</div>
        <div className="text-center">Remove</div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            No items selected
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-6 items-center px-3 py-2 border-b hover:bg-gray-50 gap-2"
            >
              <div className="col-span-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">
                  SKU: {item.sku || item.id}
                </div>
              </div>

              <div className="text-right text-sm">{item.price.toFixed(2)}</div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => decrement(item.id)}
                  className="bg-gray-200 p-1 rounded"
                >
                  <FaMinus size={12} />
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => increment(item.id)}
                  className="bg-gray-200 p-1 rounded"
                >
                  <FaPlus size={12} />
                </button>
              </div>

              <div className="text-right font-semibold text-sm">
                {(item.price * item.qty).toFixed(2)}
              </div>

              <div className="text-center">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-3 py-3 border-t space-y-2">
        <div className="flex justify-between bg-gray-200 text-sm font-medium">
          <div>Items: {itemsCount}</div>
          <div>Sub Total: {totalPayable.toFixed(2)}</div>
        </div>

        {/* Charges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {[
            { label: "Discount", value: discount, suffix: "%" },
            { label: "Order Tax", value: orderTax, suffix: "%" },
            { label: "Shipping", value: shipping },
            { label: "Packing/Service", value: packingService },
          ].map((field) => (
            <div
              key={field.label}
              className="bg-white px-2 py-1 rounded shadow"
            >
              <span className="text-xs text-gray-500">{field.label}</span>

              {editField === field.label ? (
                <input
                  type="number"
                  value={field.value}
                  autoFocus
                  onBlur={() => setEditField(null)}
                  onChange={(e) =>
                    handleValueChange(field.label, e.target.value)
                  }
                  className="w-full border px-1 text-sm"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {field.value}
                    {field.suffix || ""}
                  </span>
                  <FaEdit
                    size={12}
                    className="cursor-pointer"
                    onClick={() => setEditField(field.label)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-blue-300 px-3 py-2 rounded text-lg font-bold flex justify-between">
          <div>Total Payable:</div>
          <div>{totalPayable.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}




// 2-1-2026
// "use client";
// import { useState, useMemo } from "react";
// import { FaPlus, FaMinus, FaTimes, FaEdit } from "react-icons/fa";

// export default function OrderList({ items, setItems, discount, setDiscount, orderTax, setOrderTax, shipping, setShipping, packingService, setPackingService }) {
//   // const [discount, setDiscount] = useState(0); // %
//   // const [orderTax, setOrderTax] = useState(0); // %
//   // const [shipping, setShipping] = useState(0);
//   // const [packingService, setPackingService] = useState(0);
//   const [editField, setEditField] = useState(null);

//   /* ------------------ Item Controls ------------------ */
//   const increment = (id) => {
//     setItems(items.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
//   };

//   const decrement = (id) => {
//     setItems(
//       items
//         .map(i =>
//           i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
//         )
//         .filter(i => i.qty > 0)
//     );
//   };

//   const removeItem = (id) => {
//     setItems(items.filter(i => i.id !== id));
//   };

//   /* ------------------ Calculations ------------------ */
//   const itemsCount = items.reduce((sum, i) => sum + i.qty, 0);

//   const itemsSubTotal = useMemo(() => {
//     return items.reduce((sum, i) => sum + i.qty * i.price, 0);
//   }, [items]);

//   // % based calculations
//   const calculatedDiscount = (itemsSubTotal * discount) / 100;
//   const calculatedTax = (itemsSubTotal * orderTax) / 100;

//   const totalPayable = Math.max(
//     0,
//     itemsSubTotal -
//       calculatedDiscount +
//       calculatedTax +
//       shipping +
//       packingService
//   );

//   /* ------------------ Handlers ------------------ */
//   const handleValueChange = (field, value) => {
//     const val = Math.max(0, parseFloat(value) || 0);

//     switch (field) {
//       case "Discount":
//         setDiscount(val);
//         break;
//       case "Order Tax":
//         setOrderTax(val);
//         break;
//       case "Shipping":
//         setShipping(val);
//         break;
//       case "Packing/Service":
//         setPackingService(val);
//         break;
//       default:
//         break;
//     }
//   };

//   /* ------------------ UI ------------------ */
//   return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="grid grid-cols-6 bg-gray-100 font-semibold text-sm px-3 py-2 border-b">
//         <div className="col-span-2">Product</div>
//         <div className="text-right">Price</div>
//         <div className="text-center">Quantity</div>
//         <div className="text-right">Subtotal</div>
//         <div className="text-center">Remove</div>
//       </div>

//       {/* Body */}
//       <div className="flex-1 overflow-y-auto">
//         {items.length === 0 ? (
//           <div className="text-center text-gray-400 py-6">
//             No items selected
//           </div>
//         ) : (
//           items.map(item => (
//             <div
//               key={item.id}
//               className="grid grid-cols-6 items-center px-3 py-2 border-b hover:bg-gray-50 gap-2"
//             >
//               <div className="col-span-2">
//                 <div className="font-medium">{item.name}</div>
//                 <div className="text-xs text-gray-500">
//                   SKU: {item.sku || item.id}
//                 </div>
//               </div>

//               <div className="text-right text-sm">
//                 {item.price.toFixed(2)}
//               </div>

//               <div className="flex items-center justify-center gap-2">
//                 <button onClick={() => decrement(item.id)} className="bg-gray-200 p-1 rounded">
//                   <FaMinus size={12} />
//                 </button>
//                 <span>{item.qty}</span>
//                 <button onClick={() => increment(item.id)} className="bg-gray-200 p-1 rounded">
//                   <FaPlus size={12} />
//                 </button>
//               </div>

//               <div className="text-right font-semibold text-sm">
//                 {(item.price * item.qty).toFixed(2)}
//               </div>

//               <div className="text-center">
//                 <button onClick={() => removeItem(item.id)} className="text-red-500">
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Footer */}
//       <div className="bg-gray-50 px-3 py-3 border-t space-y-2">
//         <div className="flex justify-between bg-gray-200 text-sm font-medium">
//           <div>Items: {itemsCount}</div>
//           {/* Subtotal synced with total */}
//           <div>Sub Total: {totalPayable.toFixed(2)}</div>
//         </div>

//         {/* Charges */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
//           {[
//             { label: "Discount", value: discount, suffix: "%" },
//             { label: "Order Tax", value: orderTax, suffix: "%" },
//             { label: "Shipping", value: shipping },
//             { label: "Packing/Service", value: packingService },
//           ].map(field => (
//             <div key={field.label} className="bg-white px-2 py-1 rounded shadow">
//               <span className="text-xs text-gray-500">{field.label}</span>

//               {editField === field.label ? (
//                 <input
//                   type="number"
//                   value={field.value}
//                   autoFocus
//                   onBlur={() => setEditField(null)}
//                   onChange={(e) =>
//                     handleValueChange(field.label, e.target.value)
//                   }
//                   className="w-full border px-1 text-sm"
//                 />
//               ) : (
//                 <div className="flex items-center justify-between">
//                   <span className="font-semibold">
//                     {field.value}{field.suffix || ""}
//                   </span>
//                   <FaEdit
//                     size={12}
//                     className="cursor-pointer"
//                     onClick={() => setEditField(field.label)}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Total */}
//         <div className="bg-blue-300 px-3 py-2 rounded text-lg font-bold flex justify-between">
//           <div>Total Payable:</div>
//           <div>{totalPayable.toFixed(2)}</div>
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";
// import { useState } from "react";
// import { FaPlus, FaMinus, FaTimes, FaEdit } from "react-icons/fa";

// export default function OrderList({ items, setItems }) {
//   const [discount, setDiscount] = useState(0);
//   const [orderTax, setOrderTax] = useState(0);
//   const [shipping, setShipping] = useState(0);
//   const [packingService, setPackingService] = useState(0);

//   const [editField, setEditField] = useState(null); // track which field is being edited

//   const increment = (id) => {
//     setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
//   };

//   const decrement = (id) => {
//     setItems(
//       items
//         .map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
//         .filter((i) => i.qty > 0)
//     );
//   };

//   const removeItem = (id) => {
//     setItems(items.filter((i) => i.id !== id));
//   };

//   const subTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
//   const itemsCount = items.reduce((sum, i) => sum + i.qty, 0);

//   const totalPayable = subTotal - discount + orderTax + shipping + packingService;

//   // handle editing value changes
//   const handleValueChange = (field, value) => {
//     const val = parseFloat(value) || 0;
//     switch (field) {
//       case "Discount":
//         setDiscount(val);
//         break;
//       case "Order Tax":
//         setOrderTax(val);
//         break;
//       case "Shipping":
//         setShipping(val);
//         break;
//       case "Packing/Service":
//         setPackingService(val);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Table Header */}
//       <div className="grid grid-cols-6 bg-gray-100 font-semibold text-sm px-3 py-2 border-b">
//         <div className="col-span-2">Product</div>
//         <div className="text-right">Price</div>
//         <div className="text-center">Quantity</div>
//         <div className="text-right">Subtotal</div>
//         <div className="text-center">Remove</div>
//       </div>

//       {/* Table Body */}
//       <div className="flex-1 overflow-y-auto">
//         {items.length === 0 ? (
//           <div className="text-center text-gray-400 py-6">No items selected</div>
//         ) : (
//           items.map((item) => (
//             <div
//               key={item.id}
//               className="grid grid-cols-6 items-center px-3 py-2 border-b hover:bg-gray-50 gap-2"
//             >
//               <div className="col-span-2">
//                 <div className="font-medium">{item.name}</div>
//                 <div className="text-xs text-gray-500">SKU: {item.sku || item.id}</div>
//               </div>
//               <div className="text-right text-sm">{item.price.toFixed(2)}</div>
//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => decrement(item.id)}
//                   className="bg-gray-200 p-1 rounded hover:bg-gray-300"
//                 >
//                   <FaMinus size={12} />
//                 </button>
//                 <span className="text-sm">{item.qty}</span>
//                 <button
//                   onClick={() => increment(item.id)}
//                   className="bg-gray-200 p-1 rounded hover:bg-gray-300"
//                 >
//                   <FaPlus size={12} />
//                 </button>
//               </div>
//               <div className="text-right font-semibold text-sm">
//                 {(item.price * item.qty).toFixed(2)}
//               </div>
//               <div className="text-center">
//                 <button
//                   onClick={() => removeItem(item.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Order Summary Footer */}
//       <div className="bg-gray-50 px-3 py-3 border-t border-gray-400 space-y-2">
//         {/* Top Row: Items and Subtotal */}
//         <div className="flex justify-between bg-gray-200 text-sm font-medium">
//           <div>Items: {itemsCount}</div>
//           <div>Sub Total: {subTotal.toFixed(2)}</div>
//         </div>

//         {/* Second Row: Discount, Tax, Shipping, Packing/Service */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
//           {[
//             { label: "Discount", value: discount },
//             { label: "Order Tax", value: orderTax },
//             { label: "Shipping", value: shipping },
//             { label: "Packing/Service", value: packingService },
//           ].map((field) => (
//             <div
//               key={field.label}
//               className="flex flex-col items-center bg-white px-2 py-1 rounded shadow w-full"
//             >
//               <span className="text-xs text-gray-500">{field.label}</span>
//               <div className="flex items-center gap-1">
//                 {editField === field.label ? (
//                   <input
//                     type="number"
//                     value={field.value}
//                     autoFocus
//                     onBlur={() => setEditField(null)}
//                     onChange={(e) => handleValueChange(field.label, e.target.value)}
//                     className="w-16 px-1 py-0.5 border border-gray-300 rounded text-sm"
//                   />
//                 ) : (
//                   <>
//                     <span className="font-semibold">{field.value.toFixed(2)}</span>
//                     <button onClick={() => setEditField(field.label)}>
//                       <FaEdit size={12} className="text-gray-500 hover:text-gray-700" />
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Total Payable */}
//         <div className="bg-blue-300 px-3 py-2 rounded text-lg font-bold flex justify-between">
//           <div>Total Payable:</div>
//           <div>{totalPayable.toFixed(2)}</div>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";
// import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

// export default function OrderList({ items, setItems }) {
//   const increment = (id) => {
//     setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
//   };

//   const decrement = (id) => {
//     setItems(
//       items
//         .map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
//         .filter((i) => i.qty > 0)
//     );
//   };

//   const removeItem = (id) => {
//     setItems(items.filter((i) => i.id !== id));
//   };

//   const subTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
//   const itemsCount = items.reduce((sum, i) => sum + i.qty, 0);

//   const discount = 0;
//   const orderTax = 0;
//   const shipping = 0;
//   const packingService = 0;

//   const totalPayable =
//     subTotal - discount + orderTax + shipping + packingService;

//   return (
//     <div className="flex flex-col h-full">
//       {/* Table Header */}
//       <div className="grid grid-cols-6 bg-gray-100 font-semibold text-sm px-3 py-2 border-b">
//         <div className="col-span-2">Product</div>
//         <div className="text-right">Price</div>
//         <div className="text-center">Quantity</div>
//         <div className="text-right">Subtotal</div>
//         <div className="text-center">Remove</div>
//       </div>

//       {/* Table Body */}
//       <div className="flex-1 overflow-y-auto">
//         {items.length === 0 ? (
//           <div className="text-center text-gray-400 py-6">
//             No items selected
//           </div>
//         ) : (
//           items.map((item) => (
//             <div
//               key={item.id}
//               className="grid grid-cols-6 items-center px-3 py-2 border-b hover:bg-gray-50 gap-2"
//             >
//               <div className="col-span-2">
//                 <div className="font-medium">{item.name}</div>
//                 <div className="text-xs text-gray-500">
//                   SKU: {item.sku || item.id}
//                 </div>
//               </div>
//               <div className="text-right text-sm">{item.price.toFixed(2)}</div>
//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => decrement(item.id)}
//                   className="bg-gray-200 p-1 rounded hover:bg-gray-300"
//                 >
//                   <FaMinus size={12} />
//                 </button>
//                 <span className="text-sm">{item.qty}</span>
//                 <button
//                   onClick={() => increment(item.id)}
//                   className="bg-gray-200 p-1 rounded hover:bg-gray-300"
//                 >
//                   <FaPlus size={12} />
//                 </button>
//               </div>
//               <div className="text-right font-semibold text-sm">
//                 {(item.price * item.qty).toFixed(2)}
//               </div>
//               <div className="text-center">
//                 <button
//                   onClick={() => removeItem(item.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Order Summary Footer */}
//       <div className="bg-gray-50 px-3 py-3 border-t border-gray-400 top-6 space-y-2">
//         {/* Top Row: Items and Subtotal */}
//         <div className="flex justify-between bg-gray-200 text-sm font-medium">
//           <div>Items: {itemsCount}</div>
//           <div>Sub Total: {subTotal.toFixed(2)}</div>
//         </div>

//         {/* Second Row: Discount, Tax, Shipping, Packing/Service (label on top, value below) */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
//           {[
//             { label: "Discount", value: discount },
//             { label: "Order Tax", value: orderTax },
//             { label: "Shipping", value: shipping },
//             { label: "Packing/Service", value: packingService },
//           ].map((field) => (
//             <div
//               key={field.label}
//               className="flex flex-col items-center bg-white px-2 py-1 rounded shadow"
//             >
//               <span className="text-xs text-gray-500">{field.label}</span>
//               <span className="font-semibold">{field.value.toFixed(2)}</span>
//             </div>
//           ))}
//         </div>

//         {/* Total Payable */}
//         <div className="bg-blue-300 px-3 py-2 rounded text-lg font-bold flex justify-between">
//           <div>Total Payable:</div>
//           <div>{totalPayable.toFixed(2)}</div>
//         </div>
//       </div>
//     </div>
//   );
// }
