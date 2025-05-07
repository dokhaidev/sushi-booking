const tabs = [
  "Đặc biệt",
  "Khai vị",
  "Sushi",
  "Sashimi",
  "Rolls",
  "Cơm",
  "Mì",
  "Đồ uống",
];

export default function SpecialTabs() {
  return (
    <div className="flex justify-center gap-2 flex-wrap px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className="bg-[#3D2B1F] text-white px-4 py-2 rounded-full hover:bg-[#5A3D2B] transition"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
