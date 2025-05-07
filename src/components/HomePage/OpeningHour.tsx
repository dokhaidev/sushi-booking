export default function OpeningHours() {
  return (
    <div>
      <h4 className="text-2xl font-bold mb-6 text-gray-500">Giờ mở cửa</h4>
      <ul className="space-y-4">
        <li className="flex justify-between items-center hover:bg-gray-100 p-2 rounded-lg transition duration-300">
          <span className="text-gray-700">Thứ 2 - Thứ 6:</span>
          <span className="text-gray-600">11:30 - 14:00, 17:00 - 22:00</span>
        </li>
        <li className="flex justify-between items-center hover:bg-gray-100 p-2 rounded-lg transition duration-300">
          <span className="text-gray-700">Thứ 7, CN & ngày lễ:</span>
          <span className="text-gray-600">12:00 - 22:00</span>
        </li>
      </ul>
    </div>
  );
}
