"use client";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

export default function OrderList({ items, setItems }) {
  const increment = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decrement = (id) => {
    setItems(
      items
        .map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const subTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const itemsCount = items.reduce((sum, i) => sum + i.qty, 0);

  const discount = 0;
  const orderTax = 0;
  const shipping = 0;
  const packingService = 0;

  const totalPayable =
    subTotal - discount + orderTax + shipping + packingService;

  return (
    <div className="flex flex-col h-full">
      {/* Table Header */}
      <div className="grid grid-cols-6 bg-gray-100 font-semibold text-sm px-3 py-2 border-b">
        <div className="col-span-2">Product</div>
        <div className="text-right">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Subtotal</div>
        <div className="text-center">Remove</div>
      </div>

      {/* Table Body */}
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
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-sm">{item.qty}</span>
                <button
                  onClick={() => increment(item.id)}
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300"
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
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Summary Footer */}
      <div className="bg-gray-50 px-3 py-3 border-t border-gray-400 top-6 space-y-2">
        {/* Top Row: Items and Subtotal */}
        <div className="flex justify-between bg-gray-200 text-sm font-medium">
          <div>Items: {itemsCount}</div>
          <div>Sub Total: {subTotal.toFixed(2)}</div>
        </div>

        {/* Second Row: Discount, Tax, Shipping, Packing/Service (label on top, value below) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {[
            { label: "Discount", value: discount },
            { label: "Order Tax", value: orderTax },
            { label: "Shipping", value: shipping },
            { label: "Packing/Service", value: packingService },
          ].map((field) => (
            <div
              key={field.label}
              className="flex flex-col items-center bg-white px-2 py-1 rounded shadow"
            >
              <span className="text-xs text-gray-500">{field.label}</span>
              <span className="font-semibold">{field.value.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total Payable */}
        <div className="bg-blue-300 px-3 py-2 rounded text-lg font-bold flex justify-between">
          <div>Total Payable:</div>
          <div>{totalPayable.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
