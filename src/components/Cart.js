export default function Cart({ cart, customer }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = async () => {
    if (!customer) return alert("Select customer");
    await window.api.saveTransaction({
      customerId: customer.id,
      total,
      items: cart
    });
    alert("Order Placed ✔");
  };

  return (
    <div className="w-1/4 bg-white p-4 border-l">
      <h2 className="font-bold">Cart</h2>

      {cart.map((i, idx) => (
        <div key={idx} className="flex justify-between">
          <span>{i.name}</span>
          <span>{i.price}</span>
        </div>
      ))}

      <div className="mt-4 font-bold">Total: Rs {total}</div>

      <button
        onClick={checkout}
        className="mt-3 w-full bg-blue-600 text-white p-2 rounded"
      >
        Confirm Order
      </button>
    </div>
  );
}
