"use client";
import { useState, useEffect } from "react";
import Header from "@/components/pos/Header";
import Sidebar from "@/components/pos/Sidebar";
import CustomersPanel from "@/components/pos/CustomersPanel";
import ItemsPanel from "@/components/pos/ItemsPanel";
import CartPanel from "@/components/pos/CartPanel";

export default function POSPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar closed by default
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);

  // Fetch customers and items from SQLite
  useEffect(() => {
    async function fetchData() {
      const dbCustomers = await window.api.getCustomers();
      const dbItems = await window.api.getItems();
      setCustomers(dbCustomers);
      setItems(dbItems);
    }
    fetchData();
  }, []);

  // Add item to cart
  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId));
  };

  // Checkout and save transaction
  const handleCheckout = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const result = await window.api.saveTransaction(selectedCustomer.id, cart);
    alert(`Transaction saved!\nID: ${result.transactionId}\nTotal: ${result.total}`);
    setCart([]); // clear cart
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main POS Panels */}
        <div className={`flex-1 flex transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-0"}`}>
          {/* Customers Panel */}
          <CustomersPanel
            customers={customers}
            onSelect={setSelectedCustomer}
            selected={selectedCustomer}
          />

          {/* Items Panel */}
          <ItemsPanel
            items={items}
            onAdd={addToCart}
          />

          {/* Cart Panel */}
          <CartPanel
            cart={cart}
            customer={selectedCustomer}
            onRemove={removeFromCart}
          >
            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
            >
              Checkout
            </button>
          </CartPanel>
        </div>
      </div>
    </div>
  );
}
