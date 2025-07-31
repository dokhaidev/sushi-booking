import type React from "react"; // <-- Đảm bảo import React
import type { TimeSlot, BookingFormData } from "../../types/booking";

export interface DateTimeSelectorProps {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>; // <-- Sửa đổi ở đây
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>; // <-- Sửa đổi ở đây
  availableSlots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onFetchSlots: () => void;
  today: string;
}