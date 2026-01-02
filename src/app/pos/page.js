"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/pos/Header";
import Toolbar from "@/components/pos/Toolbar";
import OrderList from "@/components/pos/OrderList";
import ProductBrowser from "@/components/pos/ProductBrowser";
import Sidebar from "@/components/pos/Sidebar";
import TransactionsModal from "@/components/pos/TransactionsModal";
import toast, { Toaster } from "react-hot-toast"; // ✅ toast import

export default function POSPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderStatus, setOrderStatus] = useState("none"); // "none", "quotation", "suspend", "paid"

  // Charges
  const [discount, setDiscount] = useState(0);
  const [orderTax, setOrderTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [packingService, setPackingService] = useState(0);

  const [suspendedOrders, setSuspendedOrders] = useState([]);

  const [showTransactions, setShowTransactions] = useState(false);
const [transactions, setTransactions] = useState([]);

  // Toolbar search ref for autofocus
  const searchRef = useRef(null);

  useEffect(() => {
    if (orderItems.length === 0) {
      searchRef.current?.focus();
    }
  }, [orderItems]);

  useEffect(() => {
    if (window.electron) {
      window.electron.onWindowFocus(() => {
        setTimeout(() => {
          document.activeElement?.blur();
          window.focus();
        }, 0);
      });
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      if (typeof window !== "undefined" && window.api) {
        const dbCustomers = await window.api.getCustomers();
        const dbItems = await window.api.getItems();
        setCustomers(dbCustomers);
        setProducts(dbItems);
      }
    }
    fetchData();
  }, []);

  // Add product
  const addProduct = (product) => {
    const existing = orderItems.find((i) => i.id === product.id);
    if (existing) {
      setOrderItems(
        orderItems.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setOrderItems([...orderItems, { ...product, qty: 1 }]);
    }
  };

  const removeProduct = (productId) => {
    setOrderItems(orderItems.filter((i) => i.id !== productId));
  };

  // Compute totals
  const itemsSubTotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const calculatedDiscount = (itemsSubTotal * discount) / 100;
  const calculatedTax = (itemsSubTotal * orderTax) / 100;
  const totalPayable = Math.max(
    0,
    itemsSubTotal - calculatedDiscount + calculatedTax + shipping + packingService
  );

  // Handle transaction
  const handleTransaction = async (status, paymentData) => {
  if (status !== "quotation" && status !== "suspend" && !selectedCustomer) 
    return toast.error("Please select a customer");

  if ((status === "quotation" || status === "paid" || status === "suspend") && orderItems.length === 0) 
    return toast.error("Cart is empty");

  const finalAmount = status === "paid" ? paymentData?.amount ?? totalPayable : totalPayable;
  const customerId = selectedCustomer ? selectedCustomer.id : null;

  const result = await window.api.saveTransaction(customerId, orderItems, status, finalAmount);

  if (status === "suspend") {
    // Add to suspended orders
    const suspendedOrder = {
      id: Date.now(), // unique ID
      items: [...orderItems],
      discount,
      orderTax,
      shipping,
      packingService,
      customer: selectedCustomer,
      timestamp: new Date(),
    };
    setSuspendedOrders([...suspendedOrders, suspendedOrder]);
    toast.success("Order suspended!");
  } else if (status === "paid") {
    toast.success("Payment completed!");
  } else if (status === "quotation") {
    toast.success("Quotation saved!");
  }

  if (status === "paid" || status === "suspend") {
    // Reset current order
    setOrderItems([]);
    setDiscount(0);
    setOrderTax(0);
    setShipping(0);
    setPackingService(0);
    setSelectedCustomer(null);
  }

  setOrderStatus(status);
  setTimeout(() => searchRef.current?.focus(), 0);
};


// Load a suspended order
const handleLoadSuspended = (order) => {
  setOrderItems(order.items || []);
  setDiscount(order.discount || 0);
  setOrderTax(order.orderTax || 0);
  setShipping(order.shipping || 0);
  setPackingService(order.packingService || 0);
  setSelectedCustomer(order.customer || null);
  setOrderStatus("none"); // reset status
};

// Delete a suspended order
const handleDeleteSuspended = (orderId) => {
  setSuspendedOrders(suspendedOrders.filter((o) => o.id !== orderId));
};


const openTransactions = async () => {
  const data = await window.api.getTransactions();
  setTransactions(data);
  setShowTransactions(true);
};

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

     <Header
  customers={customers}
  selectedCustomer={selectedCustomer}
  onSelectCustomer={setSelectedCustomer}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
  orderStatus={orderStatus}
  suspendedOrders={suspendedOrders}
  onDeleteSuspended={handleDeleteSuspended}
  onOpenTransactions={openTransactions}
  onLoadSuspended={(order) => {
    setOrderItems(order.items);
    setDiscount(order.discount);
    setOrderTax(order.orderTax);
    setShipping(order.shipping);
    setPackingService(order.packingService);
    setSelectedCustomer(order.customer);
    setOrderStatus("none");
    setSuspendedOrders(suspendedOrders.filter(o => o.id !== order.id));
    toast.success("Suspended order loaded!");
  }}
/>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Toolbar
        ref={searchRef}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
        products={products}
        onAddProduct={addProduct}
      />

      <TransactionsModal
  open={showTransactions}
  onClose={() => setShowTransactions(false)}
  transactions={transactions}
/>


      <div className="flex-1 p-2 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
        <div className="md:col-span-6 bg-white p-4 shadow flex flex-col h-full overflow-y-auto rounded">
          <OrderList
            items={orderItems}
            setItems={setOrderItems}
            discount={discount}
            setDiscount={setDiscount}
            orderTax={orderTax}
            setOrderTax={setOrderTax}
            shipping={shipping}
            setShipping={setShipping}
            packingService={packingService}
            setPackingService={setPackingService}
          />
        </div>

        <div className="md:col-span-6 bg-gray-50 p-4 shadow flex flex-col h-full overflow-y-auto rounded">
          <ProductBrowser
            products={products}
            onAdd={addProduct}
            onQuotation={() => handleTransaction("quotation")}
            onSuspend={() => handleTransaction("suspend")}
            onPayment={(payment) => handleTransaction("paid", payment)}
            totalPayable={totalPayable}
            orderStatus={orderStatus}
          />
        </div>
      </div>
    </div>
  );
}




// 2-1-2026
// "use client";

// import { useState, useEffect, useRef } from "react";
// import Header from "@/components/pos/Header";
// import Toolbar from "@/components/pos/Toolbar";
// import OrderList from "@/components/pos/OrderList";
// import ProductBrowser from "@/components/pos/ProductBrowser";
// import Sidebar from "@/components/pos/Sidebar";

// export default function POSPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [orderItems, setOrderItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   // POSPage.jsx
// const [orderStatus, setOrderStatus] = useState("none"); // "none", "quotation", "suspend", "paid"


//   // Charges lifted here
//   const [discount, setDiscount] = useState(0);
//   const [orderTax, setOrderTax] = useState(0);
//   const [shipping, setShipping] = useState(0);
//   const [packingService, setPackingService] = useState(0);

//   // Toolbar search ref for autofocus
//   const searchRef = useRef(null);

//   // Fetch initial data
//   useEffect(() => {
//     async function fetchData() {
//       if (typeof window !== "undefined" && window.api) {
//         const dbCustomers = await window.api.getCustomers();
//         const dbItems = await window.api.getItems();
//         setCustomers(dbCustomers);
//         setProducts(dbItems);
//       }
//     }
//     fetchData();
//   }, []);

//   // Add product
//   const addProduct = (product) => {
//     const existing = orderItems.find((i) => i.id === product.id);
//     if (existing) {
//       setOrderItems(
//         orderItems.map((i) =>
//           i.id === product.id ? { ...i, qty: i.qty + 1 } : i
//         )
//       );
//     } else {
//       setOrderItems([...orderItems, { ...product, qty: 1 }]);
//     }
//   };

//   const removeProduct = (productId) => {
//     setOrderItems(orderItems.filter((i) => i.id !== productId));
//   };

//   // Compute totals including charges
//   const itemsSubTotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
//   const calculatedDiscount = (itemsSubTotal * discount) / 100;
//   const calculatedTax = (itemsSubTotal * orderTax) / 100;
//   const totalPayable = Math.max(
//     0,
//     itemsSubTotal - calculatedDiscount + calculatedTax + shipping + packingService
//   );

//   // Handle transaction
//   const handleTransaction = async (status, paymentData) => {
//     // if (!selectedCustomer) return alert("Please select a customer");
//     // if (orderItems.length === 0) return alert("Cart is empty");

//      if (status !== "quotation" && status !== "suspend" && !selectedCustomer) 
//     return alert("Please select a customer");
  
//   if ((status === "quotation" || status === "paid" || status === "suspend") && orderItems.length === 0) 
//     return alert("Cart is empty");

//     // final amount to pass
//     const finalAmount =
//       status === "paid"
//         ? paymentData?.amount ?? totalPayable
//         : totalPayable;

//         const customerId = selectedCustomer ? selectedCustomer.id : null;

//     const result = await window.api.saveTransaction(
//       customerId,
//       orderItems,
//       status,
//       finalAmount
//       // paymentData || { amount: totalPayable, method: paymentData?.method || "cash" }
//     );

//     let msg = "";
//     if (status === "paid") msg = `Payment completed!`;
//     else if (status === "suspend") msg = `Order suspended!`;
//     else if (status === "quotation") msg = `Quotation saved!`;

//     alert(`${msg}\nTransaction ID: ${result.transactionId}\nTotal: ${finalAmount.toFixed(2)}`);

//     setOrderStatus(status);
//    if (status === "paid" || status === "suspend") {
//     setOrderItems([]);
//     setDiscount(0);
//     setOrderTax(0);
//     setShipping(0);
//     setPackingService(0);
//   }

//     // Reset search input
//     if (searchRef.current) {
//       searchRef.current.focus();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <Header
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//         orderStatus={orderStatus}
//       />

//       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <Toolbar
//         ref={searchRef}
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         products={products}
//         onAddProduct={addProduct}
//       />

//       <div className="flex-1 p-2 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
//         <div className="md:col-span-6 bg-white p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           <OrderList
//             items={orderItems}
//             setItems={setOrderItems}
//             discount={discount}
//             setDiscount={setDiscount}
//             orderTax={orderTax}
//             setOrderTax={setOrderTax}
//             shipping={shipping}
//             setShipping={setShipping}
//             packingService={packingService}
//             setPackingService={setPackingService}
//           />
//         </div>

//         <div className="md:col-span-6 bg-gray-50 p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           <ProductBrowser
//             products={products}
//             onAdd={addProduct}
//             onQuotation={() => handleTransaction("quotation")}
//             onSuspend={() => handleTransaction("suspend")}
//             onPayment={(payment) => handleTransaction("paid", payment)}
//             totalPayable={totalPayable}
//             orderStatus={orderStatus}
            
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



// TotalPayable Calculation Added
// "use client";

// import { useState, useEffect } from "react";
// import Header from "@/components/pos/Header";
// import Toolbar from "@/components/pos/Toolbar";
// import OrderList from "@/components/pos/OrderList";
// import ProductBrowser from "@/components/pos/ProductBrowser";
// import Sidebar from "@/components/pos/Sidebar";
// import BottomActions from "@/components/pos/BottomActions";

// export default function POSPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [orderItems, setOrderItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const [paymentData, setPaymentData] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       if (typeof window !== "undefined" && window.api) {
//         const dbCustomers = await window.api.getCustomers();
//         const dbItems = await window.api.getItems();
//         setCustomers(dbCustomers);
//         setProducts(dbItems);
//       }
//     }
//     fetchData();
//   }, []);

//   const addProduct = (product) => {
//     const existing = orderItems.find((i) => i.id === product.id);
//     if (existing) {
//       setOrderItems(
//         orderItems.map((i) =>
//           i.id === product.id ? { ...i, qty: i.qty + 1 } : i
//         )
//       );
//     } else {
//       setOrderItems([...orderItems, { ...product, qty: 1 }]);
//     }
//   };

//   const removeProduct = (productId) => {
//     setOrderItems(orderItems.filter((i) => i.id !== productId));
//   };

//   const handleCheckout = async () => {
//     if (!selectedCustomer) return alert("Please select a customer");
//     if (orderItems.length === 0) return alert("Cart is empty");

//     if (window.api) {
//       const result = await window.api.saveTransaction(
//         selectedCustomer.id,
//         orderItems
//       );
//       alert(`Transaction saved!\nID: ${result.transactionId}\nTotal: ${result.total}`);
//       setOrderItems([]);
//     }
//   };

//  const handleTransaction = async (status) => {
//   if (!selectedCustomer) {
//     alert("Please select a customer");
//     return;
//   }
//   if (orderItems.length === 0) {
//     alert("Cart is empty");
//     return;
//   }

//   const result = await window.api.saveTransaction(
//     selectedCustomer.id,
//     orderItems,
//     status
//   );

//   let msg = "";
//   if (status === "paid") msg = `Payment completed!`;
//   else if (status === "suspend") msg = `Order suspended!`;
//   else if (status === "quotation") msg = `Quotation saved!`;

//   alert(`${msg}\nTransaction ID: ${result.transactionId}\nTotal: ${result.total}`);
//   setOrderItems([]);
//   setPaymentData(null);
//   window.dispatchEvent(new Event("pos:resetCharges"));

// };

// const totalPayable = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <Header
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//       />

//       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <Toolbar
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         products={products}
//         onAddProduct={addProduct}
//       />

//       <div className="flex-1 p-2 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
//         <div className="md:col-span-6 bg-white p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           <OrderList items={orderItems} setItems={setOrderItems} />
//         </div>
//         <div className="md:col-span-6 bg-gray-50 p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           {/* <ProductBrowser products={products} onAdd={addProduct} /> */}
// <ProductBrowser
//   products={products}
//   onAdd={addProduct}
//   onQuotation={() => handleTransaction("quotation")}
//   onSuspend={() => handleTransaction("suspend")}
//   onPayment={() => handleTransaction("paid")}
//   totalPayable={totalPayable}
//   onConfirmPayment={(payment) => handleTransaction("paid", payment)}
// />


//         </div>
//       </div>

//       {/* <div className="bg-gray-100 p-2 border-t">
//         <BottomActions onCheckout={handleCheckout} />
//       </div> */}
//     </div>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import Header from "@/components/pos/Header";
// import Toolbar from "@/components/pos/Toolbar";
// import OrderList from "@/components/pos/OrderList";
// import ProductBrowser from "@/components/pos/ProductBrowser";
// import Sidebar from "@/components/pos/Sidebar";
// import BottomActions from "@/components/pos/BottomActions";

// export default function POSPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [orderItems, setOrderItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const [paymentData, setPaymentData] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       if (typeof window !== "undefined" && window.api) {
//         const dbCustomers = await window.api.getCustomers();
//         const dbItems = await window.api.getItems();
//         setCustomers(dbCustomers);
//         setProducts(dbItems);
//       }
//     }
//     fetchData();
//   }, []);

//   const addProduct = (product) => {
//     const existing = orderItems.find((i) => i.id === product.id);
//     if (existing) {
//       setOrderItems(
//         orderItems.map((i) =>
//           i.id === product.id ? { ...i, qty: i.qty + 1 } : i
//         )
//       );
//     } else {
//       setOrderItems([...orderItems, { ...product, qty: 1 }]);
//     }
//   };

//   const removeProduct = (productId) => {
//     setOrderItems(orderItems.filter((i) => i.id !== productId));
//   };

//   const handleCheckout = async () => {
//     if (!selectedCustomer) return alert("Please select a customer");
//     if (orderItems.length === 0) return alert("Cart is empty");

//     if (window.api) {
//       const result = await window.api.saveTransaction(
//         selectedCustomer.id,
//         orderItems
//       );
//       alert(`Transaction saved!\nID: ${result.transactionId}\nTotal: ${result.total}`);
//       setOrderItems([]);
//     }
//   };

//  const handleTransaction = async (status) => {
//   if (!selectedCustomer) {
//     alert("Please select a customer");
//     return;
//   }
//   if (orderItems.length === 0) {
//     alert("Cart is empty");
//     return;
//   }

//   const result = await window.api.saveTransaction(
//     selectedCustomer.id,
//     orderItems,
//     status
//   );

//   let msg = "";
//   if (status === "paid") msg = `Payment completed!`;
//   else if (status === "suspend") msg = `Order suspended!`;
//   else if (status === "quotation") msg = `Quotation saved!`;

//   alert(`${msg}\nTransaction ID: ${result.transactionId}\nTotal: ${result.total}`);
//   setOrderItems([]);
//   setPaymentData(null);
// };

// const totalPayable = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <Header
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//       />

//       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <Toolbar
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         products={products}
//         onAddProduct={addProduct}
//       />

//       <div className="flex-1 p-2 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
//         <div className="md:col-span-6 bg-white p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           <OrderList items={orderItems} setItems={setOrderItems} />
//         </div>
//         <div className="md:col-span-6 bg-gray-50 p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           {/* <ProductBrowser products={products} onAdd={addProduct} /> */}
// <ProductBrowser
//   products={products}
//   onAdd={addProduct}
//   onQuotation={() => handleTransaction("quotation")}
//   onSuspend={() => handleTransaction("suspend")}
//   onPayment={() => handleTransaction("paid")}
//   totalPayable={totalPayable}
//   onConfirmPayment={(payment) => handleTransaction("paid", payment)}
// />


//         </div>
//       </div>

//       {/* <div className="bg-gray-100 p-2 border-t">
//         <BottomActions onCheckout={handleCheckout} />
//       </div> */}
//     </div>
//   );
// }




// "use client";
// import { useState, useEffect } from "react";

// import Header from "@/components/pos/Header";
// import Toolbar from "@/components/pos/Toolbar";
// import OrderList from "@/components/pos/OrderList";
// import ProductBrowser from "@/components/pos/ProductBrowser";
// import Sidebar from "@/components/pos/Sidebar";
// import BottomActions from "@/components/pos/BottomActions";

// export default function POSPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar closed by default
//   const [orderItems, setOrderItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   // Fetch customers and products from SQLite
//   useEffect(() => {
//     async function fetchData() {
//       const dbCustomers = await window.api.getCustomers();
//       const dbItems = await window.api.getItems();
//       setCustomers(dbCustomers);
//       setProducts(dbItems);
//     }
//     fetchData();
//   }, []);

//   // Add product to order
//   const addProduct = (product) => {
//     const existing = orderItems.find((i) => i.id === product.id);
//     if (existing) {
//       setOrderItems(
//         orderItems.map((i) =>
//           i.id === product.id ? { ...i, qty: i.qty + 1 } : i
//         )
//       );
//     } else {
//       setOrderItems([...orderItems, { ...product, qty: 1 }]);
//     }
//   };

//   // Remove product from order
//   const removeProduct = (productId) => {
//     setOrderItems(orderItems.filter((i) => i.id !== productId));
//   };

//   // Checkout
//   const handleCheckout = async () => {
//     if (!selectedCustomer) {
//       alert("Please select a customer");
//       return;
//     }
//     if (orderItems.length === 0) {
//       alert("Cart is empty");
//       return;
//     }

//     const result = await window.api.saveTransaction(
//       selectedCustomer.id,
//       orderItems
//     );
//     alert(
//       `Transaction saved!\nID: ${result.transactionId}\nTotal: ${result.total}`
//     );
//     setOrderItems([]);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Top Header */}
//       <Header
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//       />

//     <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       {/* Toolbar / Second Header with 2-column centered partition */}
//       <Toolbar
//         customers={customers}
//         selectedCustomer={selectedCustomer}
//         onSelectCustomer={setSelectedCustomer}
//       />

//       {/* Main Content - 2-column grid for OrderList and ProductBrowser */}
//       <div className="flex-1 p-2 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
//         {/* Left Column: Order List / Cart */}
//         <div className="md:col-span-6 bg-white p-4 shadow flex flex-col h-full overflow-y-auto rounded">
//           <OrderList
//             items={orderItems}
//             setItems={setOrderItems}
//             onRemove={removeProduct}
//           />
//         </div>

//         {/* Right Column: Product Browser */}
//         <div className="md:col-span-6 bg-gray-50 p-4 shadow overflow-y-auto rounded">
//           <ProductBrowser products={products} onAdd={addProduct} />
//         </div>
//       </div>

//       {/* Bottom Action Buttons */}
//       {/* <BottomActions onCheckout={handleCheckout} /> */}
//     </div>
//   );
// }






// "use client";
// import { useState, useEffect } from "react";
// import Header from "@/components/pos/Header";
// import Sidebar from "@/components/pos/Sidebar";
// import CustomersPanel from "@/components/pos/CustomersPanel";
// import ItemsPanel from "@/components/pos/ItemsPanel";
// import CartPanel from "@/components/pos/CartPanel";

// export default function POSPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar closed by default
//   const [customers, setCustomers] = useState([]);
//   const [items, setItems] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [cart, setCart] = useState([]);

//   // Fetch customers and items from SQLite
//   useEffect(() => {
//     async function fetchData() {
//       const dbCustomers = await window.api.getCustomers();
//       const dbItems = await window.api.getItems();
//       setCustomers(dbCustomers);
//       setItems(dbItems);
//     }
//     fetchData();
//   }, []);

//   // Add item to cart
//   const addToCart = (item) => {
//     const existing = cart.find(i => i.id === item.id);
//     if (existing) {
//       setCart(cart.map(i =>
//         i.id === item.id ? { ...i, qty: i.qty + 1 } : i
//       ));
//     } else {
//       setCart([...cart, { ...item, qty: 1 }]);
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = (itemId) => {
//     setCart(cart.filter(i => i.id !== itemId));
//   };

//   // Checkout and save transaction
//   const handleCheckout = async () => {
//     if (!selectedCustomer) {
//       alert("Please select a customer");
//       return;
//     }
//     if (cart.length === 0) {
//       alert("Cart is empty");
//       return;
//     }

//     const result = await window.api.saveTransaction(selectedCustomer.id, cart);
//     alert(`Transaction saved!\nID: ${result.transactionId}\nTotal: ${result.total}`);
//     setCart([]); // clear cart
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <Header onToggle={() => setSidebarOpen(!sidebarOpen)} />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//         {/* Main POS Panels */}
//         <div className={`flex-1 flex transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-0"}`}>
//           {/* Customers Panel */}
//           <CustomersPanel
//             customers={customers}
//             onSelect={setSelectedCustomer}
//             selected={selectedCustomer}
//           />

//           {/* Items Panel */}
//           <ItemsPanel
//             items={items}
//             onAdd={addToCart}
//           />

//           {/* Cart Panel */}
//           <CartPanel
//             cart={cart}
//             customer={selectedCustomer}
//             onRemove={removeFromCart}
//           >
//             {/* Checkout button */}
//             <button
//               onClick={handleCheckout}
//               className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
//             >
//               Checkout
//             </button>
//           </CartPanel>
//         </div>
//       </div>
//     </div>
//   );
// }
