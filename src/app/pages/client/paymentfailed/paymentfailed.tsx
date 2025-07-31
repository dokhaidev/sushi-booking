"use client"

import { useRouter } from "next/navigation"
import { XCircle, Home, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/src/app/lib/i18n/client" 

export default function PaymentFailed() {
  const router = useRouter()
  const { t } = useTranslation("paymentFailed") 

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4 py-[60px]">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="p-8 text-center">
          {/* Failure Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-red-200 rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Failure Message */}
          <div className="space-y-3 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-600 leading-relaxed">{t("error_message")}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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
