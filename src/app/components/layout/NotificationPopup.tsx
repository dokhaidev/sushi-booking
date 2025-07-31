"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

interface NotificationPopupProps {
  message: string
  onClose: () => void
  type?: "success" | "error" | "info"
  show?: boolean // Control visibility from parent
}

const NotificationPopup = ({ message, onClose, type = "success", show = true }: NotificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 3000) // Duration for this single popup
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show, onClose])

  const handleClose = () => {
    setIsVisible(false)
    // Allow time for exit animation before calling onClose
    setTimeout(() => {
      onClose()
    }, 300) // Match exit transition duration
  }

  if (!show || !isVisible) return null

  const typeConfig = {
    success: {
      bgColor: "bg-green-500",
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      progressBarColor: "bg-green-500",
      iconComponent: CheckCircle,
    },
    error: {
      bgColor: "bg-red-500",
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      progressBarColor: "bg-red-500",
      iconComponent: AlertCircle,
    },
    info: {
      bgColor: "bg-blue-500",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      progressBarColor: "bg-blue-500",
      iconComponent: Info,
    },
  }

  const config = typeConfig[type]
  const IconComponent = config.iconComponent

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <motion.div
        initial={{
          opacity: 0,
          x: 400,
          scale: 0.8,
          rotateY: 45,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          rotateY: 0,
        }}
        exit={{
          opacity: 0,
          x: 400,
          scale: 0.8,
          rotateY: -45,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
        layout
        className="relative max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 flex items-center gap-3 pointer-events-auto overflow-hidden"
        style={{
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
        whileHover={{
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 },
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${
            type === "success"
              ? "from-green-50/50 via-emerald-50/30 to-teal-50/50"
              : type === "error"
                ? "from-red-50/50 via-rose-50/30 to-pink-50/50"
                : "from-blue-50/50 via-cyan-50/30 to-sky-50/50"
          } rounded-2xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        {/* Icon with enhanced animation */}
        <motion.div
          className={`relative flex-shrink-0 w-11 h-11 bg-gradient-to-br ${
            type === "success"
              ? "from-green-400 to-emerald-500"
              : type === "error"
                ? "from-red-400 to-rose-500"
                : "from-blue-400 to-cyan-500"
          } rounded-full flex items-center justify-center shadow-lg`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 25,
            delay: 0.1,
          }}
          whileHover={{ scale: 1.1 }}
        >
          <IconComponent className="w-5 h-5 text-white drop-shadow-sm" />
          {/* Pulse ring */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              type === "success" ? "bg-green-400" : type === "error" ? "bg-red-400" : "bg-blue-400"
            }`}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.3,
            }}
          />
        </motion.div>
        {/* Content with stagger animation */}
        <motion.div
          className="flex-1 min-w-0 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.p
            className="font-semibold text-gray-800 text-sm mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        </motion.div>
        {/* Enhanced close button */}
        <motion.button
          onClick={handleClose}
          className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 group"
          aria-label="Đóng thông báo"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </motion.button>
        {/* Enhanced progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/50 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${
              type === "success"
                ? "from-green-400 via-emerald-500 to-teal-500"
                : type === "error"
                  ? "from-red-400 via-rose-500 to-pink-500"
                  : "from-blue-400 via-cyan-500 to-sky-500"
            } relative`}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }} // Duration for this single popup
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        </div>
        {/* Subtle border glow */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
            type === "success"
              ? "from-green-200/20 via-emerald-200/20 to-teal-200/20"
              : type === "error"
                ? "from-red-200/20 via-rose-200/20 to-pink-200/20"
                : "from-blue-200/20 via-cyan-200/20 to-sky-200/20"
          } pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
      </motion.div>
    </div>
  )
}

export default NotificationPopup
