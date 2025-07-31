"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { FiCalendar, FiUsers, FiClock, FiX } from "react-icons/fi";
import type { DateTimeSelectorProps } from "../../types/Booking/DateTimeSelector.types";
import { useTranslation } from "../../lib/i18n/client";

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
  const { t } = useTranslation("reservation");

  const [initialRestoredTime, setInitialRestoredTime] = useState<string | null>(
    null
  );
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  // Prevent body scroll when popup is shown
  useEffect(() => {
    if (showGuestWarning) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    };
  }, [showGuestWarning]);

  // ✅ Load saved data and set initial state
  useEffect(() => {
    const saved = localStorage.getItem("booking_info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("DateTimeSelector: Loaded from localStorage:", parsed);
        if (parsed.date) {
          setSelectedDate(parsed.date);
        } else {
          setSelectedDate(today);
        }

        if (parsed.guest_count !== undefined) {
          const safeGuest = Math.max(1, Number(parsed.guest_count));
          setFormData((prev) => ({ ...prev, guest_count: safeGuest }));
        }
      } catch (e) {
        console.error("Failed to parse saved booking data", e);
        localStorage.removeItem("booking_info");
        setSelectedDate(today);
      }
    } else {
      setSelectedDate(today);
    }
  }, [setFormData, setSelectedDate, today]);

  // ✅ Load initialRestoredTime from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("booking_info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("DateTimeSelector: Loaded for initial time:", parsed);
        if (parsed.time) {
          setInitialRestoredTime(parsed.time);
        }
      } catch (e) {
        console.error("Failed to parse saved booking data for time", e);
        localStorage.removeItem("booking_info");
      }
    }
  }, []);

  // ✅ Fetch slots when selectedDate or guest_count changes
  useEffect(() => {
    if (selectedDate && formData.guest_count > 0) {
      console.log(
        "DateTimeSelector: Fetching slots for",
        selectedDate,
        "guests:",
        formData.guest_count
      );
      onFetchSlots();
    }
  }, [selectedDate, formData.guest_count, onFetchSlots]);

  // ✅ Restore saved time if available
  useEffect(() => {
    if (initialRestoredTime && availableSlots.length > 0) {
      const found = availableSlots.some(
        (slot) => slot.time === initialRestoredTime
      );
      if (found) {
        console.log("DateTimeSelector: Restoring time:", initialRestoredTime);
        onTimeSelect(initialRestoredTime);
      } else {
        console.log(
          "Restored time NOT in available slots:",
          initialRestoredTime
        );
      }
      setInitialRestoredTime(null);
    }
  }, [availableSlots, initialRestoredTime, onTimeSelect]);

  // ✅ Save data to localStorage when changes
  useEffect(() => {
    const bookingInfo = {
      date: selectedDate,
      time: selectedTime,
      guest_count: formData.guest_count,
    };
    localStorage.setItem("booking_info", JSON.stringify(bookingInfo));
  }, [selectedDate, selectedTime, formData.guest_count]);

  // ✅ Handle guest count change with improved input clearing
  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      setFormData((prev) => ({ ...prev, guest_count: 0 }));
      setShowGuestWarning(false);
      return;
    }

    const numValue = Number(value);
    
    // If not a valid number or less than 1, set to 1
    if (isNaN(numValue) || numValue < 1) {
      setFormData((prev) => ({ ...prev, guest_count: 1 }));
      return;
    }

    // Show warning for large groups (>=40)
    if (numValue >= 40) {
      setShowGuestWarning(true);
    } else {
      setShowGuestWarning(false);
    }

    setFormData((prev) => ({ ...prev, guest_count: numValue }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-opacity duration-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiCalendar className="mr-2 text-[#AF763E]" />
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Date selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("date_label")}
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

          {/* Guest count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("guest_count_label")}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={formData.guest_count || ''}
                onChange={handleGuestCountChange}
                className="w-full pl-10 pr-3 py-2.5 border border-[#e5d5c2] rounded-lg focus:ring-1 focus:ring-[#AF763E] focus:border-[#AF763E] outline-none transition"
              />
              <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AF763E]" />
            </div>
          </div>
        </div>

        {/* Time slots */}
        {availableSlots.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("available_slots")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onTimeSelect(slot.time)}
                  className={`p-2.5 border rounded-lg text-sm flex items-center justify-center gap-1 transition-colors hover:scale-[1.01] active:scale-[0.99] duration-100 ${
                    selectedTime === slot.time
                      ? "bg-[#AF763E] text-white border-[#AF763E]"
                      : "bg-white hover:bg-gray-50 border-[#e5d5c2] text-gray-700"
                  }`}
                >
                  <FiClock size={14} />
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popup with full-height backdrop and improved scrolling */}
      {showGuestWarning && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Full-height backdrop */}
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
          
          {/* Popup container */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-[#f3e9dc] animate-fade-in overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowGuestWarning(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
              
              <div className="flex flex-col items-center">
                <div className="bg-[#f9f3ed] p-3 rounded-full mb-4">
                  <FiUsers size={24} className="text-[#AF763E]" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  {t("guest_limit_warning_title")}
                </h3>
                
                <p className="text-gray-600 text-sm text-center mb-4">
                  {t("guest_limit_warning_message")}
                </p>
                
                <div className="w-full bg-[#f9f3ed] rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm text-gray-700 font-medium">
                    {t("contact_for_large_group")}
                  </p>
                  <a 
                    href="tel:0919919810" 
                    className="text-[#AF763E] font-semibold hover:underline"
                  >
                    0919 919 810
                  </a>
                </div>
                
                <button
                  onClick={() => setShowGuestWarning(false)}
                  className="w-full py-2.5 bg-[#AF763E] text-white rounded-lg hover:bg-[#996237] transition-colors font-medium"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}