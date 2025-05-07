import CategoryBlock from "./CategoryBlock";

export default function CategorySection() {
  const categories = [
    {
      title: "Khai vị",
      description: "Khơi dậy khẩu vị của bạn với món khai vị truyền thống",
      slug: "khai-vi",
    },
    {
      title: "Sushi",
      description: "Mỗi miếng sushi là một tác phẩm nghệ thuật",
      slug: "sushi",
    },
    {
      title: "Sashimi",
      description: "Cắt lát ngọt mịn và tươi chuẩn từng miếng",
      slug: "sashimi",
    },
    {
      title: "Rolls",
      description: "Các loại cuốn truyền thống và hiện đại",
      slug: "rolls",
    },
    {
      title: "Cơm & Mì",
      description: "Các món cơm và mì truyền thống Nhật Bản",
      slug: "com-mi",
    },
    {
      title: "Đồ uống",
      description: "Thức uống tinh tế kết hợp với ẩm thực Nhật Bản",
      slug: "do-uong",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
      {categories.map((cat) => (
        <CategoryBlock key={cat.slug} {...cat} />
      ))}
    </div>
  );
}
