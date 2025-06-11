"use client";

export default function ComboTabs({
  onSelect,
}: {
  onSelect: (comboOnly: boolean) => void;
}) {
  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        onClick={() => onSelect(false)}
        className="px-5 py-2 bg-white rounded-full border hover:shadow-md"
      >
        Tất cả món
      </button>
      <button
        onClick={() => onSelect(true)}
        className="px-5 py-2 bg-[#F97316] text-white rounded-full hover:shadow-md"
      >
        Combo ưu đãi
      </button>
    </div>
  );
}
