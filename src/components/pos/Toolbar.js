"use client";
import { useState } from "react";
import { FaSearch, FaBarcode, FaPlus } from "react-icons/fa";

export default function Toolbar({ customers = [], selectedCustomer, onSelectCustomer }) {
  const [search, setSearch] = useState("");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const defaultCustomer = { id: "walkin", name: "Walk-in Customer" };

  return (
    <div className="bg-gray-100 p-3 shadow-sm flex justify-center">
      {/* Center Partition with 2 columns */}
      <div className="grid grid-cols-2 w-full max-w-6xl gap-4 items-center">

        {/* Left Column: Search + Scan + Add */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Enter Product name / SKU / Scan barcode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
            <FaBarcode />
          </button>

          <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center">
            <FaPlus />
          </button>
        </div>

        {/* Right Column: Customer + Plus + Date */}
        <div className="flex items-center gap-2 justify-end">
          {/* <span className="text-gray-700 font-medium hidden md:block">Customer:</span> */}
          <div className="flex items-center gap-1">
            <select
              value={selectedCustomer?.id || defaultCustomer.id}
              onChange={(e) => {
                const customer = customers.find(c => c.id === parseInt(e.target.value));
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

            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
              <FaPlus />
            </button>
          </div>

          <div className="text-gray-700 font-medium ml-4">{formattedDate}</div>
        </div>

      </div>
    </div>
  );
}
