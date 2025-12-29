export default function BottomActions() {
  return (
    <div className="flex gap-2 p-3 bg-white shadow-md">
      <button className="flex-1 bg-yellow-400 text-white py-2 rounded">
        Quotation
      </button>
      <button className="flex-1 bg-orange-500 text-white py-2 rounded">
        Suspend
      </button>
      <button className="flex-1 bg-green-600 text-white py-2 rounded">
        Payment
      </button>
    </div>
  );
}
