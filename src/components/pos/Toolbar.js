"use client";

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import { FaSearch, FaBarcode, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast"; // ✅ toast

const Toolbar = forwardRef(function Toolbar(
  {
    customers = [],
    selectedCustomer,
    onSelectCustomer,
    products = [],
    onAddProduct,
  },
  ref
) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scanning, setScanning] = useState(false);

  const searchInputRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const listRef = useRef(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const defaultCustomer = { id: "walkin", name: "Walk-in Customer" };

  // 🔗 Expose focus() to parent (POSPage)
  useEffect(() => {
    if (ref) {
      ref.current = {
        focus: () => {
          searchInputRef.current?.focus();
        },
      };
    }
  }, [ref]);

  // 🔁 Restore focus after barcode modal closes
  useEffect(() => {
    if (!scanning) {
      searchInputRef.current?.focus();
    }
  }, [scanning]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search)
    );
  }, [search, products]);

  const handleSelectProduct = (product) => {
    onAddProduct(product);
    setSearch("");
    setShowSuggestions(false);
    setActiveIndex(-1);

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectProduct(suggestions[activeIndex]);
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (listRef.current && activeIndex >= 0) {
      const el = listRef.current.children[activeIndex];
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleBarcodeInput = (e) => {
    if (e.key === "Enter") {
      const scannedSKU = e.target.value.trim();
      const product = products.find((p) => String(p.id) === scannedSKU);

      if (product) {
        onAddProduct(product);
      } else {
        // ✅ toast instead of alert
        toast.error("Product not found!");
      }

      e.target.value = "";
      setScanning(false);
    }
  };

  return (
    <div className="bg-gray-100 p-3 shadow-sm flex justify-center relative z-20">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="grid grid-cols-2 w-full max-w-6xl gap-4 items-center">
        {/* LEFT */}
        <div className="flex items-center gap-2 relative">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Enter Product name / SKU / Scan barcode"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={listRef}
                className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-1 max-h-64 overflow-y-auto"
              >
                {suggestions.map((p, index) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                      index === activeIndex
                        ? "bg-blue-100"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">
                        SKU: {p.id}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      Rs. {p.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={() => setScanning(true)}
          >
            <FaBarcode />
          </button>

          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <FaPlus />
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 justify-end">
          <select
            value={selectedCustomer?.id || defaultCustomer.id}
            onChange={(e) => {
              const customer = customers.find(
                (c) => c.id === parseInt(e.target.value)
              );
              onSelectCustomer(customer || defaultCustomer);
            }}
            className="px-3 py-2 rounded border border-gray-300"
          >
            <option value="walkin">Walk-in Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>

          <div className="text-gray-700 font-medium ml-4">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* BARCODE MODAL */}
      {scanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow flex flex-col items-center gap-2">
            <div className="font-medium">Scan your barcode…</div>
            <input
              ref={hiddenInputRef}
              type="text"
              autoFocus
              onKeyDown={handleBarcodeInput}
              className="border p-2 w-64 text-center"
            />
            <button
              onClick={() => setScanning(false)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Toolbar;






// 2-1-2026
// "use client";

// import { useState, useMemo, useRef, useEffect } from "react";
// import { FaSearch, FaBarcode, FaPlus } from "react-icons/fa";

// export default function Toolbar({
//   customers = [],
//   selectedCustomer,
//   onSelectCustomer,
//   products = [],
//   onAddProduct,
// }) {
//   const [search, setSearch] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(-1);

//   const [scanning, setScanning] = useState(false);
//   const hiddenInputRef = useRef(null);
//   const listRef = useRef(null);

//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en-PK", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const defaultCustomer = { id: "walkin", name: "Walk-in Customer" };

//   const suggestions = useMemo(() => {
//     if (!search.trim()) return [];
//     return products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(search.toLowerCase()) ||
//         String(p.id).includes(search)
//     );
//   }, [search, products]);

//   const handleSelectProduct = (product) => {
//     onAddProduct(product);
//     setSearch("");
//     setShowSuggestions(false);
//     setActiveIndex(-1);
//   };

//   // 🔑 Keyboard handling for search suggestions
//   const handleKeyDown = (e) => {
//     if (!showSuggestions || suggestions.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIndex((prev) =>
//         prev < suggestions.length - 1 ? prev + 1 : 0
//       );
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex((prev) =>
//         prev > 0 ? prev - 1 : suggestions.length - 1
//       );
//     }

//     if (e.key === "Enter" && activeIndex >= 0) {
//       e.preventDefault();
//       handleSelectProduct(suggestions[activeIndex]);
//     }

//     if (e.key === "Escape") {
//       setShowSuggestions(false);
//       setActiveIndex(-1);
//     }
//   };

//   // 👀 Auto scroll active item into view
//   useEffect(() => {
//     if (listRef.current && activeIndex >= 0) {
//       const el = listRef.current.children[activeIndex];
//       el?.scrollIntoView({ block: "nearest" });
//     }
//   }, [activeIndex]);

//   // 🔹 Handle barcode scan input
//   const handleBarcodeInput = (e) => {
//     if (e.key === "Enter") {
//       const scannedSKU = e.target.value.trim();
//       const product = products.find((p) => String(p.id) === scannedSKU);
//       if (product) {
//         onAddProduct(product);
//       } else {
//         alert("Product not found!");
//       }
//       e.target.value = "";
//       setScanning(false);
//     }
//   };

//   return (
//     <div className="bg-gray-100 p-3 shadow-sm flex justify-center relative z-20">
//       <div className="grid grid-cols-2 w-full max-w-6xl gap-4 items-center">

//         {/* LEFT COLUMN */}
//         <div className="flex items-center gap-2 relative">
//           <div className="relative flex-1">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               <FaSearch />
//             </span>

//             <input
//               type="text"
//               placeholder="Enter Product name / SKU / Scan barcode"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setShowSuggestions(true);
//               }}
//               onKeyDown={handleKeyDown}
//               onFocus={() => setShowSuggestions(true)}
//               className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />

//             {/* 🔽 Suggestions */}
//             {showSuggestions && suggestions.length > 0 && (
//               <div
//                 ref={listRef}
//                 className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-1 max-h-64 overflow-y-auto"
//               >
//                 {suggestions.map((p, index) => (
//                   <div
//                     key={p.id}
//                     onClick={() => handleSelectProduct(p)}
//                     className={`px-3 py-2 cursor-pointer flex justify-between items-center
//                       ${index === activeIndex ? "bg-blue-100" : "hover:bg-blue-50"}`}
//                   >
//                     <div>
//                       <div className="font-medium text-sm">{p.name}</div>
//                       <div className="text-xs text-gray-500">SKU: {p.id}</div>
//                     </div>
//                     <div className="text-sm font-semibold">Rs. {p.price}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Barcode Scan Button */}
//           <button
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             onClick={() => setScanning(true)}
//           >
//             <FaBarcode />
//           </button>

//           <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//             <FaPlus />
//           </button>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="flex items-center gap-2 justify-end">
//           <div className="flex items-center gap-1">
//             <select
//               value={selectedCustomer?.id || defaultCustomer.id}
//               onChange={(e) => {
//                 const customer = customers.find(
//                   (c) => c.id === parseInt(e.target.value)
//                 );
//                 onSelectCustomer(customer || defaultCustomer);
//               }}
//               className="px-3 py-2 rounded border border-gray-300"
//             >
//               <option value="walkin">Walk-in Customer</option>
//               {customers.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} ({c.phone})
//                 </option>
//               ))}
//             </select>

//             <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
//               <FaPlus />
//             </button>
//           </div>
//           <div className="text-gray-700 font-medium ml-4">{formattedDate}</div>
//         </div>
//       </div>

//       {/* 🔹 Barcode Scan Modal */}
//       {scanning && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-4 rounded shadow flex flex-col items-center gap-2">
//             <div className="font-medium">Scan your barcode...</div>
//             <input
//               ref={hiddenInputRef}
//               type="text"
//               onKeyDown={handleBarcodeInput}
//               autoFocus
//               className="border p-2 w-64 text-center"
//             />
//             <button
//               onClick={() => setScanning(false)}
//               className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// Barcodescanner version
// "use client";
// import { useState, useMemo, useRef, useEffect } from "react";
// import { FaSearch, FaBarcode, FaPlus } from "react-icons/fa";

// export default function Toolbar({
//   customers = [],
//   selectedCustomer,
//   onSelectCustomer,
//   products = [],
//   onAddProduct,
// }) {
//   const [search, setSearch] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(-1);

//   const listRef = useRef(null);

//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en-PK", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const defaultCustomer = { id: "walkin", name: "Walk-in Customer" };

//   const suggestions = useMemo(() => {
//     if (!search.trim()) return [];
//     return products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(search.toLowerCase()) ||
//         String(p.id).includes(search)
//     );
//   }, [search, products]);

//   const handleSelectProduct = (product) => {
//     onAddProduct(product);
//     setSearch("");
//     setShowSuggestions(false);
//     setActiveIndex(-1);
//   };

//   // 🔑 Keyboard handling
//   const handleKeyDown = (e) => {
//     if (!showSuggestions || suggestions.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIndex((prev) =>
//         prev < suggestions.length - 1 ? prev + 1 : 0
//       );
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex((prev) =>
//         prev > 0 ? prev - 1 : suggestions.length - 1
//       );
//     }

//     if (e.key === "Enter" && activeIndex >= 0) {
//       e.preventDefault();
//       handleSelectProduct(suggestions[activeIndex]);
//     }

//     if (e.key === "Escape") {
//       setShowSuggestions(false);
//       setActiveIndex(-1);
//     }
//   };

//   // 👀 Auto scroll active item into view
//   useEffect(() => {
//     if (listRef.current && activeIndex >= 0) {
//       const el = listRef.current.children[activeIndex];
//       el?.scrollIntoView({ block: "nearest" });
//     }
//   }, [activeIndex]);

//   return (
//     <div className="bg-gray-100 p-3 shadow-sm flex justify-center relative z-20">
//       <div className="grid grid-cols-2 w-full max-w-6xl gap-4 items-center">

//         {/* LEFT COLUMN */}
//         <div className="flex items-center gap-2 relative">
//           <div className="relative flex-1">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               <FaSearch />
//             </span>

//             <input
//               type="text"
//               placeholder="Enter Product name / SKU / Scan barcode"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setShowSuggestions(true);
//               }}
//               onKeyDown={handleKeyDown}
//               onFocus={() => setShowSuggestions(true)}
//               className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />

//             {/* 🔽 Suggestions */}
//             {showSuggestions && suggestions.length > 0 && (
//               <div
//                 ref={listRef}
//                 className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-1 max-h-64 overflow-y-auto"
//               >
//                 {suggestions.map((p, index) => (
//                   <div
//                     key={p.id}
//                     onClick={() => handleSelectProduct(p)}
//                     className={`px-3 py-2 cursor-pointer flex justify-between items-center
//                       ${
//                         index === activeIndex
//                           ? "bg-blue-100"
//                           : "hover:bg-blue-50"
//                       }`}
//                   >
//                     <div>
//                       <div className="font-medium text-sm">{p.name}</div>
//                       <div className="text-xs text-gray-500">
//                         SKU: {p.id}
//                       </div>
//                     </div>
//                     <div className="text-sm font-semibold">
//                       Rs. {p.price}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//             <FaBarcode />
//           </button>

//           <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//             <FaPlus />
//           </button>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="flex items-center gap-2 justify-end">
//           <div className="flex items-center gap-1">
//              <select
//               value={selectedCustomer?.id || defaultCustomer.id}
//               onChange={(e) => {
//                 const customer = customers.find(c => c.id === parseInt(e.target.value));
//                 onSelectCustomer(customer || defaultCustomer);
//               }}
//               className="px-3 py-2 rounded border border-gray-300"
//             >
//               <option value="walkin">Walk-in Customer</option>
//               {customers.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} ({c.phone})
//                 </option>
//               ))}
//             </select>

//             <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
//               <FaPlus />
//             </button>
//           </div>
//           <div className="text-gray-700 font-medium ml-4">
//             {formattedDate}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";
// import { useState } from "react";
// import { FaSearch, FaBarcode, FaPlus } from "react-icons/fa";

// export default function Toolbar({ customers = [], selectedCustomer, onSelectCustomer }) {
//   const [search, setSearch] = useState("");

//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en-PK", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric"
//   });

//   const defaultCustomer = { id: "walkin", name: "Walk-in Customer" };

//   return (
//     <div className="bg-gray-100 p-3 shadow-sm flex justify-center">
//       {/* Center Partition with 2 columns */}
//       <div className="grid grid-cols-2 w-full max-w-6xl gap-4 items-center">

//         {/* Left Column: Search + Scan + Add */}
//         <div className="flex items-center gap-2">
//           <div className="relative flex-1">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               <FaSearch />
//             </span>
//             <input
//               type="text"
//               placeholder="Enter Product name / SKU / Scan barcode"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
//             <FaBarcode />
//           </button>

//           <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center">
//             <FaPlus />
//           </button>
//         </div>

//         {/* Right Column: Customer + Plus + Date */}
//         <div className="flex items-center gap-2 justify-end">
//           {/* <span className="text-gray-700 font-medium hidden md:block">Customer:</span> */}
//           <div className="flex items-center gap-1">
//             <select
//               value={selectedCustomer?.id || defaultCustomer.id}
//               onChange={(e) => {
//                 const customer = customers.find(c => c.id === parseInt(e.target.value));
//                 onSelectCustomer(customer || defaultCustomer);
//               }}
//               className="px-3 py-2 rounded border border-gray-300"
//             >
//               <option value="walkin">Walk-in Customer</option>
//               {customers.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} ({c.phone})
//                 </option>
//               ))}
//             </select>

//             <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
//               <FaPlus />
//             </button>
//           </div>

//           <div className="text-gray-700 font-medium ml-4">{formattedDate}</div>
//         </div>

//       </div>
//     </div>
//   );
// }
