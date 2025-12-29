export default function CartPanel({ cart, customer, onRemove, children }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="w-80 bg-white p-4 border-l border-gray-300 overflow-y-auto flex flex-col">
      <h2 className="text-lg text-gray-500 font-semibold text-center mb-4">Cart</h2>

      {customer ? (
        <div className="mb-2 text-sm text-gray-700">
          Customer: <span className="font-medium">{customer.name}</span>
        </div>
      ) : (
        <div className="mb-2 text-sm text-red-500">Select a customer</div>
      )}

      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 && <div className="text-gray-500">Cart is empty</div>}
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                Rs. {item.price} x {item.qty} = Rs. {item.price * item.qty}
              </div>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-2">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>Rs. {total}</span>
        </div>
        {children /* checkout button passed from POSPage */}
      </div>
    </div>
  );
}
