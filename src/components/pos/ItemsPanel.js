import Image from "next/image";

export default function ItemsPanel({ items, onAdd }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Items</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded shadow p-2 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
            onClick={() => onAdd(item)}
          >
            <div className="w-16 h-16 relative mb-2">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.name}
                fill
                style={{ objectFit: "cover", borderRadius: "0.25rem" }}
                priority={true} // optional: improve LCP for small images
              />
            </div>
            <div className="text-center font-medium">{item.name}</div>
            <div className="text-sm text-gray-600">Rs. {item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
