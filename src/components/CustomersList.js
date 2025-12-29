export default function CustomersList({ customers, onSelect }) {
  return (
    <div className="w-1/4 bg-white p-4 border-r">
      <h2 className="font-bold mb-3">Customers</h2>
      {customers.map(c => (
        <div
          key={c.id}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(c)}
        >
          {c.name}
        </div>
      ))}
    </div>
  );
}
