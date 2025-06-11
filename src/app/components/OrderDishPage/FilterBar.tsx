"use client";

const categories = [
  "Tất cả",
  "Sushi",
  "Nướng",
  "Khai vị",
  "Tráng miệng",
  "Thức uống",
];

export default function FilterBar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center my-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full border ${
            selected === cat
              ? "bg-[#0689C4] text-white"
              : "bg-white text-gray-700"
          } hover:shadow-md transition-all`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
