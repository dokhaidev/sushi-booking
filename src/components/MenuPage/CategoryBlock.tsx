interface Props {
  title: string;
  description: string;
  slug: string;
}

export default function CategoryBlock({ title, description }: Props) {
  return (
    <div className="bg-[#FFF1E5] p-6 rounded-lg shadow-md border border-[#EAD5C5]">
      <h3 className="text-xl font-semibold text-[#D94F4F]">{title}</h3>
      <p className="mt-2 text-[#6E4C35]">{description}</p>
      <div className="mt-4 text-right text-sm text-[#A0866F] italic">
        {/* Có thể thêm hình ảnh hoặc nút chi tiết */}
        Đang cập nhật món ăn...
      </div>
    </div>
  );
}
