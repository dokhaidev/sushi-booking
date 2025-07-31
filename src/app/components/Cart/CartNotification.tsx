"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"

interface NotificationItem {
  id: string
  itemName: string
  timestamp: number
}

interface CartNotificationProps {
  show: boolean
  itemName: string
  onClose: () => void
}

// Global notification queue
let notificationQueue: NotificationItem[] = []
const notificationListeners: Set<(notifications: NotificationItem[]) => void> = new Set()

const addNotification = (itemName: string) => {
  const newNotification: NotificationItem = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    itemName,
    timestamp: Date.now(),
  }

  notificationQueue = [newNotification, ...notificationQueue]
  notificationListeners.forEach((listener) => listener([...notificationQueue]))

  // Auto remove after 4 seconds
  setTimeout(() => {
    removeNotification(newNotification.id)
  }, 4000)
}

const removeNotification = (id: string) => {
  notificationQueue = notificationQueue.filter((notification) => notification.id !== id)
  notificationListeners.forEach((listener) => listener([...notificationQueue]))
}

export default function CartNotification({ show, itemName, onClose }: CartNotificationProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    // Subscribe to notification updates
    notificationListeners.add(setNotifications)

    return () => {
      notificationListeners.delete(setNotifications)
    }
  }, [])

  useEffect(() => {
    if (show && itemName) {
      addNotification(itemName)
      onClose() // Close the trigger immediately
    }
  }, [show, itemName, onClose])

  const handleClose = (id: string) => {
    removeNotification(id)
  }

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              onClose={() => handleClose(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationItem
  index: number
  onClose: () => void
}

function NotificationItem({ notification, index, onClose }: NotificationItemProps) {
  return (
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
        delay: index * 0.08,
      }}
      layout
      layoutId={notification.id}
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
        className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-teal-50/50 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.2 }}
      />

      {/* Success Icon with enhanced animation */}
      <motion.div
        className="relative flex-shrink-0 w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 25,
          delay: index * 0.08 + 0.1,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <Check className="w-5 h-5 text-white drop-shadow-sm" />

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: index * 0.08 + 0.3,
          }}
        />
      </motion.div>

      {/* Content with stagger animation */}
      <motion.div
        className="flex-1 min-w-0 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 + 0.15 }}
      >
        <motion.p
          className="font-semibold text-gray-800 text-sm mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.2 }}
        >
          Đã thêm vào giỏ hàng
        </motion.p>
        <motion.p
          className="text-gray-600 text-xs truncate font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.25 }}
        >
          {notification.itemName}
        </motion.p>
      </motion.div>

      {/* Enhanced close button */}
      <motion.button
        onClick={onClose}
        className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 group"
        aria-label="Đóng thông báo"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.08 + 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </motion.button>

      {/* Enhanced progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/50 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 relative"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 4, ease: "linear", delay: index * 0.08 }}
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
              delay: index * 0.08 + 0.5,
            }}
          />
        </motion.div>
      </div>

      {/* Subtle border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-200/20 via-emerald-200/20 to-teal-200/20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.4 }}
      />
    </motion.div>
  )
}
