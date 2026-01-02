"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";


export default function ProductBrowser({
  products,
  onAdd,
  onQuotation,
  onSuspend,
  onPayment,
  totalPayable = 0,
  orderStatus,
}) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ["All"];
    products.forEach((p) => {
      if (p.category && !cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }, [products]);

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const isPanelVisible = paymentOpen && totalPayable > 0;

  const restoreAppFocus = () => {
    requestAnimationFrame(() => {
      document.activeElement?.blur();
      window.focus();
    });
  };

  const handleOpenPayment = () => {
    if (totalPayable <= 0) {
      toast.error("No amount to pay");
      return;
    }
    setAmount(totalPayable);
    setPaymentMethod("cash");
    setPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    onPayment && onPayment({ amount, paymentMethod });
    toast.success(`Payment of Rs.${amount.toFixed(2)} via ${paymentMethod} completed`);
    setPaymentOpen(false);
    restoreAppFocus();
  };

  return (
    <>
    <div className="flex flex-col h-full relative">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-6">
            {`No products found in "${activeCategory}" category.`}
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onAdd(p)}
              className="bg-white shadow rounded-lg p-2 cursor-pointer hover:shadow-lg border border-transparent hover:border-blue-300 transition-all flex flex-col items-center"
            >
              <div className="w-full h-28 relative mb-2">
                <Image
                  src={p.image || "/items/placeholder.png"}
                  alt={p.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="text-center text-sm font-semibold truncate w-full">{p.name}</div>
              <div className="text-center text-xs text-gray-500">Rs. {p.price}</div>
            </div>
          ))
        )}
      </div>

      {/* Bottom action buttons */}
      <div className="flex gap-2 mt-4 p-2 border-t border-gray-200">
        <button
          onClick={onQuotation}
          className={`flex-1 py-2 rounded font-medium transition ${
            orderStatus === "quotation"
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white hover:bg-blue-400"
          }`}
        >
          Quotation
        </button>

        <button
          onClick={onSuspend}
          className={`flex-1 py-2 rounded font-medium transition ${
            orderStatus === "suspend"
              ? "bg-yellow-700 text-white"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          Suspend
        </button>

        <button
          onClick={handleOpenPayment}
          disabled={totalPayable === 0}
          className={`flex-1 py-2 rounded font-bold text-white transition-all ${
            totalPayable === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 shadow-md"
          }`}
        >
          Payment
        </button>
      </div>

      {/* Payment Overlay Backdrop */}
      {isPanelVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => {
            setPaymentOpen(false);
            restoreAppFocus();
          }}
        />
      )}

      {/* Payment Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 transition-transform duration-300 z-50 flex flex-col
        ${isPanelVisible ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={() => setPaymentOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-200">
          <div className="text-gray-500 text-xs uppercase mb-1">Total Payable</div>
          <div className="text-2xl font-black text-gray-800">Rs. {totalPayable.toFixed(2)}</div>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">Bank</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">Amount Paid</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none font-mono text-lg"
            />
          </div>

          {amount > totalPayable && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md flex justify-between text-sm">
              <span>Change:</span>
              <span className="font-bold">Rs. {(amount - totalPayable).toFixed(2)}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirmPayment}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 shadow-lg mt-auto transition-transform active:scale-95"
        >
          Confirm Payment
        </button>
      </div>
    </div>



{/* Styles */}
       <style jsx>{`
  .product-grid::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* optional: hide background */
  }
  .product-grid {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
`}</style>
    </>

  );
}



// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import toast, { Toaster } from "react-hot-toast"; // ✅ add toast

// export default function ProductBrowser({
//   products,
//   onAdd,
//   onQuotation,
//   onSuspend,
//   onPayment,
//   totalPayable = 0,
//   orderStatus,
// }) {
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [amount, setAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   const isPanelVisible = paymentOpen && totalPayable > 0;

//   const restoreAppFocus = () => {
//     requestAnimationFrame(() => {
//       document.activeElement?.blur();
//       window.focus();
//     });
//   };

//   const handleOpenPayment = () => {
//     if (totalPayable <= 0) {
//       toast.error("No amount to pay");
//       return;
//     }
//     setAmount(totalPayable);
//     setPaymentMethod("cash");
//     setPaymentOpen(true);
//   };

//   const handleConfirmPayment = () => {
//     if (amount <= 0) {
//       toast.error("Amount must be greater than 0");
//       return;
//     }

//     onPayment && onPayment({ amount, paymentMethod });

//     // Show success toast instead of alert
//     toast.success(`Payment of Rs.${amount.toFixed(2)} via ${paymentMethod} completed`);

//     setPaymentOpen(false);
//     restoreAppFocus();
//   };

//   return (
//     <div className="flex flex-col h-full relative">
//       {/* Toast container */}
//       <Toaster position="top-right" reverseOrder={false} />

//       {/* Category filter pills */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button className="px-3 py-1 rounded-full bg-blue-500 text-white">All</button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Category 1</button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Category 2</button>
//       </div>

//       {/* Product grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => onAdd(p)}
//             className="bg-white shadow rounded-lg p-2 cursor-pointer hover:shadow-lg border border-transparent hover:border-blue-300 transition-all flex flex-col items-center"
//           >
//             <div className="w-full h-28 relative mb-2">
//               <Image
//                 src={p.image || "/items/placeholder.png"}
//                 alt={p.name}
//                 fill
//                 className="object-cover rounded-md"
//               />
//             </div>
//             <div className="text-center text-sm font-semibold truncate w-full">{p.name}</div>
//             <div className="text-center text-xs text-gray-500">Rs. {p.price}</div>
//           </div>
//         ))}
//       </div>

//       {/* Bottom action buttons */}
//       <div className="flex gap-2 mt-4 p-2 border-t border-gray-200">
//         <button
//           onClick={onQuotation}
//           className={`flex-1 py-2 rounded font-medium transition ${
//             orderStatus === "quotation"
//               ? "bg-blue-600 text-white"
//               : "bg-blue-500 text-white hover:bg-blue-400"
//           }`}
//         >
//           Quotation
//         </button>

//         <button
//           onClick={onSuspend}
//           className={`flex-1 py-2 rounded font-medium transition ${
//             orderStatus === "suspend"
//               ? "bg-yellow-700 text-white"
//               : "bg-yellow-500 text-white hover:bg-yellow-600"
//           }`}
//         >
//           Suspend
//         </button>

//         <button
//           onClick={handleOpenPayment}
//           disabled={totalPayable === 0}
//           className={`flex-1 py-2 rounded font-bold text-white transition-all ${
//             totalPayable === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-md"
//           }`}
//         >
//           Payment
//         </button>
//       </div>

//       {/* Payment Panel Overlay Backdrop */}
//       {isPanelVisible && (
//         <div
//           className="fixed inset-0 bg-black/30 z-40"
//           onClick={() => {
//             setPaymentOpen(false);
//             restoreAppFocus();
//           }}
//         />
//       )}

//       {/* Payment Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 transition-transform duration-300 z-50 flex flex-col
//         ${isPanelVisible ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold">Payment</h2>
//           <button onClick={() => setPaymentOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
//         </div>

//         <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-200">
//           <div className="text-gray-500 text-xs uppercase mb-1">Total Payable</div>
//           <div className="text-2xl font-black text-gray-800">Rs. {totalPayable.toFixed(2)}</div>
//         </div>

//         <div className="space-y-4 flex-1">
//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">Method</label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
//             >
//               <option value="cash">Cash</option>
//               <option value="card">Card</option>
//               <option value="upi">UPI / QR</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">Amount Paid</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none font-mono text-lg"
//             />
//           </div>

//           {amount > totalPayable && (
//             <div className="p-3 bg-green-50 text-green-700 rounded-md flex justify-between text-sm">
//               <span>Change:</span>
//               <span className="font-bold">Rs. {(amount - totalPayable).toFixed(2)}</span>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleConfirmPayment}
//           className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 shadow-lg mt-auto transition-transform active:scale-95"
//         >
//           Confirm Payment
//         </button>
//       </div>
//     </div>
//   );
// }



// 2-1-2026
// "use client";
// import { useState } from "react";
// import Image from "next/image";

// export default function ProductBrowser({
//   products,
//   onAdd,
//   onQuotation,
//   onSuspend,
//   onPayment,
//   totalPayable = 0,
//   orderStatus,
// }) {
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [amount, setAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   // Fix: Instead of useEffect, we derive the 'actual' open state.
//   // If totalPayable is 0, the panel should not be visible even if paymentOpen is true.
//   const isPanelVisible = paymentOpen && totalPayable > 0;

//   const handleOpenPayment = () => {
//     if (totalPayable <= 0) return;
//     setAmount(totalPayable);
//     setPaymentMethod("cash");
//     setPaymentOpen(true);
//   };

//   const handleConfirmPayment = () => {
//     if (amount <= 0) return alert("Amount must be greater than 0");

//     // 1. Notify parent of the payment
//     onPayment && onPayment({ amount, paymentMethod });
    
//     // 2. Alert the user
//     alert(`Payment of Rs.${amount.toFixed(2)} completed via ${paymentMethod}`);
    
//     // 3. Reset internal state immediately
//     setPaymentOpen(false);
//   };

//   return (
//     <div className="flex flex-col h-full relative">
//       {/* Category filter pills */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button className="px-3 py-1 rounded-full bg-blue-500 text-white">All</button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Category 1</button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Category 2</button>
//       </div>

//       {/* Product grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => onAdd(p)}
//             className="bg-white shadow rounded-lg p-2 cursor-pointer hover:shadow-lg border border-transparent hover:border-blue-300 transition-all flex flex-col items-center"
//           >
//             <div className="w-full h-28 relative mb-2">
//               <Image
//                 src={p.image || "/items/placeholder.png"}
//                 alt={p.name}
//                 fill
//                 className="object-cover rounded-md"
//               />
//             </div>
//             <div className="text-center text-sm font-semibold truncate w-full">{p.name}</div>
//             <div className="text-center text-xs text-gray-500">Rs. {p.price}</div>
//           </div>
//         ))}
//       </div>

//       {/* Bottom action buttons */}
//       <div className="flex gap-2 mt-4 p-2 border-t border-gray-200">
//         {/* <button onClick={onQuotation} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-medium">
//           Quotation
//         </button>
//         <button onClick={onSuspend} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 font-medium">
//           Suspend
//         </button> */}

//         <button 
//   onClick={onQuotation}
//   className={`flex-1 py-2 rounded font-medium transition ${
//     orderStatus === "quotation"
//       ? "bg-blue-600 text-white"
//       : "bg-gray-500 text-white hover:bg-gray-600"
//   }`}
// >
//   Quotation
// </button>

// <button
//   onClick={onSuspend}
//   className={`flex-1 py-2 rounded font-medium transition ${
//     orderStatus === "suspend"
//       ? "bg-yellow-700 text-white"
//       : "bg-yellow-500 text-white hover:bg-yellow-600"
//   }`}
// >
//   Suspend
// </button>

//         <button 
//           onClick={handleOpenPayment} 
//           disabled={totalPayable === 0}
//           className={`flex-1 py-2 rounded font-bold text-white transition-all ${
//             totalPayable === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-md"
//           }`}
//         >
//           {/* Payment (Rs. {totalPayable}) */}
//           Payment
//         </button>
//       </div>

//       {/* Payment Panel Overlay Backdrop */}
//       {isPanelVisible && (
//         <div 
//           className="fixed inset-0 bg-black/30 z-40 animate-fade-in" 
//           onClick={() => setPaymentOpen(false)}
//         />
//       )}

//       {/* Payment Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 transition-transform duration-300 z-50 flex flex-col
//           ${isPanelVisible ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold">Payment</h2>
//           <button onClick={() => setPaymentOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
//         </div>

//         <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-200">
//           <div className="text-gray-500 text-xs uppercase mb-1">Total Payable</div>
//           <div className="text-2xl font-black text-gray-800">Rs. {totalPayable.toFixed(2)}</div>
//         </div>

//         <div className="space-y-4 flex-1">
//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">Method</label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
//             >
//               <option value="cash">Cash</option>
//               <option value="card">Card</option>
//               <option value="upi">UPI / QR</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">Amount Paid</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none font-mono text-lg"
//             />
//           </div>

//           {amount > totalPayable && (
//             <div className="p-3 bg-green-50 text-green-700 rounded-md flex justify-between text-sm">
//               <span>Change:</span>
//               <span className="font-bold">Rs. {(amount - totalPayable).toFixed(2)}</span>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleConfirmPayment}
//           className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 shadow-lg mt-auto transition-transform active:scale-95"
//         >
//           Confirm Payment
//         </button>
//       </div>
//     </div>
//   );
// }




// "use client";
// import { useState } from "react";
// import Image from "next/image";

// export default function ProductBrowser({
//   products,
//   onAdd,
//   onQuotation,
//   onSuspend,
//   onPayment,
//   totalPayable = 0,
// }) {
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [amount, setAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   // Fix: Instead of useEffect, we derive the 'actual' open state.
//   // If totalPayable is 0, the panel should not be visible even if paymentOpen is true.
//   const isPanelVisible = paymentOpen && totalPayable > 0;

//   const handleOpenPayment = () => {
//     if (totalPayable <= 0) return;
//     setAmount(totalPayable);
//     setPaymentMethod("cash");
//     setPaymentOpen(true);
//   };

//   const handleConfirmPayment = () => {
//     if (amount <= 0) return alert("Amount must be greater than 0");

//     // 1. Notify parent of the payment
//     onPayment && onPayment({ amount, paymentMethod });
    
//     // 2. Alert the user
//     alert(`Payment of Rs.${amount.toFixed(2)} completed via ${paymentMethod}`);
    
//     // 3. Reset internal state immediately
//     setPaymentOpen(false);
//   };

//   return (
//     <div className="flex flex-col h-full relative">
//       {/* Category filter pills */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button className="px-3 py-1 rounded-full bg-blue-500 text-white">All</button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Category 1</button>
//         <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Category 2</button>
//       </div>

//       {/* Product grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             onClick={() => onAdd(p)}
//             className="bg-white shadow rounded-lg p-2 cursor-pointer hover:shadow-lg border border-transparent hover:border-blue-300 transition-all flex flex-col items-center"
//           >
//             <div className="w-full h-28 relative mb-2">
//               <Image
//                 src={p.image || "/items/placeholder.png"}
//                 alt={p.name}
//                 fill
//                 className="object-cover rounded-md"
//               />
//             </div>
//             <div className="text-center text-sm font-semibold truncate w-full">{p.name}</div>
//             <div className="text-center text-xs text-gray-500">Rs. {p.price}</div>
//           </div>
//         ))}
//       </div>

//       {/* Bottom action buttons */}
//       <div className="flex gap-2 mt-4 p-2 border-t border-gray-200">
//         <button onClick={onQuotation} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-medium">
//           Quotation
//         </button>
//         <button onClick={onSuspend} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 font-medium">
//           Suspend
//         </button>
//         <button 
//           onClick={handleOpenPayment} 
//           disabled={totalPayable === 0}
//           className={`flex-1 py-2 rounded font-bold text-white transition-all ${
//             totalPayable === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-md"
//           }`}
//         >
//           {/* Payment (Rs. {totalPayable}) */}
//           Payment
//         </button>
//       </div>

//       {/* Payment Panel Overlay Backdrop */}
//       {isPanelVisible && (
//         <div 
//           className="fixed inset-0 bg-black/30 z-40 animate-fade-in" 
//           onClick={() => setPaymentOpen(false)}
//         />
//       )}

//       {/* Payment Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 transition-transform duration-300 z-50 flex flex-col
//           ${isPanelVisible ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold">Payment</h2>
//           <button onClick={() => setPaymentOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
//         </div>

//         <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-200">
//           <div className="text-gray-500 text-xs uppercase mb-1">Total Payable</div>
//           <div className="text-2xl font-black text-gray-800">Rs. {totalPayable.toFixed(2)}</div>
//         </div>

//         <div className="space-y-4 flex-1">
//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">Method</label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
//             >
//               <option value="cash">Cash</option>
//               <option value="card">Card</option>
//               <option value="upi">UPI / QR</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-semibold text-gray-600">Amount Paid</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
//               className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none font-mono text-lg"
//             />
//           </div>

//           {amount > totalPayable && (
//             <div className="p-3 bg-green-50 text-green-700 rounded-md flex justify-between text-sm">
//               <span>Change:</span>
//               <span className="font-bold">Rs. {(amount - totalPayable).toFixed(2)}</span>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleConfirmPayment}
//           className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 shadow-lg mt-auto transition-transform active:scale-95"
//         >
//           Confirm Payment
//         </button>
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useState } from "react";
// import Image from "next/image";

// export default function ProductBrowser({
//   products,
//   onAdd,
//   onQuotation,
//   onSuspend,
//   onPayment,
//   totalPayable = 0, // total amount passed from POS page
// }) {
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [amount, setAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   // Open payment panel with current total
//   const handleOpenPayment = () => {
//     setAmount(totalPayable);
//     setPaymentMethod("cash");
//     setPaymentOpen(true);
//   };

//   // Confirm payment action
//   const handleConfirmPayment = () => {
//     if (amount <= 0) return alert("Amount must be greater than 0");
//     if (!paymentMethod) return alert("Select a payment method");

//     // You can replace this with actual API call or IPC call
//     onPayment && onPayment({ amount, paymentMethod });
//     alert(`Payment of Rs.${amount.toFixed(2)} completed via ${paymentMethod}`);
//     setPaymentOpen(false);
//   };

//   return (
//     <div className="flex flex-col h-full relative">

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
//         <button
//           onClick={onQuotation}
//           className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-300"
//         >
//           Quotation
//         </button>
//         <button
//           onClick={onSuspend}
//           className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
//         >
//           Suspend
//         </button>
//         <button
//           onClick={handleOpenPayment}
//           className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Payment
//         </button>
//       </div>

//       {/* Payment Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 transition-transform duration-300 z-50
//           ${paymentOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold">Payment</h2>
//           <button
//             onClick={() => setPaymentOpen(false)}
//             className="text-red-500 hover:text-red-700"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Total Amount */}
//         <div className="mb-4 p-3 bg-gray-100 rounded text-center text-xl font-bold">
//           Total: Rs. {amount.toFixed(2)}
//         </div>

//         {/* Payment Method */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Payment Method</label>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//           >
//             <option value="cash">Cash</option>
//             <option value="card">Card</option>
//             <option value="upi">UPI</option>
//           </select>
//         </div>

//         {/* Enter Amount */}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Amount Paid</label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(parseFloat(e.target.value))}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>

//         {/* Confirm Button */}
//         <button
//           onClick={handleConfirmPayment}
//           className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Confirm Payment
//         </button>
//       </div>
//     </div>
//   );
// }






// "use client";
// import Image from "next/image";

// export default function ProductBrowser({ products, onAdd, onQuotation, onSuspend, onPayment }) {
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
//         <button onClick={onQuotation} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-300">
//           Quotation
//         </button>
//         <button onClick={onSuspend} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
//           Suspend
//         </button>
//         <button 
//           onClick={onPayment}
//           className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Payment
//         </button>
//       </div>
//     </div>
//   );
// }




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
