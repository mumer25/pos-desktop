export default function ItemsList({ items, onAdd }) {
  return (
    <div className="w-2/4 p-4 grid grid-cols-3 gap-3">
      {items.map(i => (
        <div
          key={i.id}
          className="bg-white p-3 shadow cursor-pointer"
          onClick={() => onAdd(i)}
        >
          <h3>{i.name}</h3>
          <p className="text-green-600">Rs {i.price}</p>
        </div>
      ))}
    </div>
  );
}
