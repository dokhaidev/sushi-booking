import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface NotificationPopupProps {
  message: string;
  onClose: () => void;
}

const NotificationPopup = ({ message, onClose }: NotificationPopupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-6 right-6 z-50 max-w-sm w-full rounded-2xl shadow-2xl border-l-[6px] p-5 flex items-start gap-4 backdrop-blur-sm"
      style={{
        background: "linear-gradient(135deg, #fdf6ed, #f9efe4)",
        borderColor: "#AF763E",
      }}
    >
      <div className="pt-1">
        <Check className="w-6 h-6 drop-shadow" style={{ color: "#AF763E" }} />
      </div>
      <div className="flex-1">
        <p
          className="font-semibold text-base leading-snug"
          style={{ color: "#AF763E" }}
        >
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="transition-all duration-200 p-1 rounded-full hover:bg-orange-100"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500 hover:text-[#AF763E]" />
      </button>
    </motion.div>
  );
};

export default NotificationPopup;
