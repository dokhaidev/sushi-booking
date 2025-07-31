"use client"

import type React from "react"

import { motion } from "framer-motion"
import { FiDollarSign } from "react-icons/fi"
import type { PaymentNotesFormProps } from "../../types/Booking/PaymentNotesForm.types"
import { useTranslation } from "../../lib/i18n/client"

export default function PaymentNotesForm({ formData, setFormData }: PaymentNotesFormProps) {
  const { t } = useTranslation("reservation")

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "cash" | "vnpay"
    const newFormData = { ...formData, payment_method: value }
    setFormData(newFormData)
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFormData = { ...formData, note: e.target.value }
    setFormData(newFormData)
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiDollarSign className="mr-2 text-[#AF763E]" />
        {t("payment_note_title")}
      </h2>

      <div className="space-y-4">
        {/* Payment method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("payment_method_label")}</label>
          <select
            value={formData.payment_method}
            onChange={handlePaymentMethodChange}
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg outline-none transition hover:border-[#AF763E] focus:border-[#AF763E] focus:ring-1 focus:ring-[#AF763E]"
          >
            <option value="cash">{t("payment_cash")}</option>
            <option value="vnpay">{t("payment_vnpay")}</option>
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("note_label")}</label>
          <textarea
            value={formData.note}
            onChange={handleNoteChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none transition hover:border-[#AF763E] focus:border-[#AF763E] focus:ring-1 focus:ring-[#AF763E]"
            rows={3}
            placeholder={t("note_placeholder")}
          />
        </div>
      </div>
    </motion.div>
  )
}
