"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Home, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/src/app/lib/i18n/client"

export default function PaymentSuccess() {
  const router = useRouter()
  const { t } = useTranslation("paymentSuccess")

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 py-[60px]">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-200 rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Success Message */}
          <div className="space-y-3 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-600 leading-relaxed">{t("reservation_message")}</p>
          </div>

          {/* Reservation Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>🍣</span>
              <span>{t("estimated_time", { time: "25-35 phút" })}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>{t("go_home")}</span>
            </button>

            <button
              onClick={() => router.back()}
              className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("go_back")}</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">{t("footer_text", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
