"use client";
import { motion } from "framer-motion";
import { FiCalendar, FiUsers, FiClock } from "react-icons/fi";
import type { TimeSlot, BookingFormData } from "../../types/booking";

interface DateTimeSelectorProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  formData: BookingFormData;
  setFormData: (data: BookingFormData) => void;
  availableSlots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onFetchSlots: () => void;
  today: string;
}

export default function DateTimeSelector({
  selectedDate,
  setSelectedDate,
  formData,
  setFormData,
  availableSlots,
  selectedTime,
  onTimeSelect,
  onFetchSlots,
  today,
}: DateTimeSelectorProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiCalendar className="mr-2 text-[#AF763E]" />
        Thông tin đặt bàn
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đặt bàn
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              onBlur={onFetchSlots}
              className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
            />
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF763E]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng khách
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="20"
              value={formData.guest_count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guest_count: Math.max(
                    1,
                    Math.min(10, Number(e.target.value))
                  ),
                })
              }
              className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
            />
            <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF763E]" />
          </div>
        </div>
      </div>

      {availableSlots.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khung giờ trống
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTimeSelect(slot.time)}
                className={`p-2.5 border rounded-lg text-sm flex items-center justify-center gap-1 transition-colors ${
                  selectedTime === slot.time
                    ? "bg-[#AF763E] text-white border-[#AF763E]"
                    : "bg-white hover:bg-gray-50 border-[#e5d5c2] text-gray-700"
                }`}
              >
                <FiClock size={14} />
                {slot.time}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
