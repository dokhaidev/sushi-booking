"use client";
import { motion } from "framer-motion";
import { FiUser, FiPhone } from "react-icons/fi";
import type { BookingFormData } from "../../types/booking";

interface CustomerInfoFormProps {
  formData: BookingFormData;
  setFormData: (data: BookingFormData) => void;
}

export default function CustomerInfoForm({
  formData,
  setFormData,
}: CustomerInfoFormProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiUser className="mr-2 text-[#AF763E]" />
        Thông tin liên hệ
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer_name: e.target.value,
                })
              }
              className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
              placeholder="Nhập họ tên"
            />
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF763E]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.customer_phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer_phone: e.target.value,
                })
              }
              className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
              placeholder="Nhập số điện thoại"
            />
            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF763E]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
