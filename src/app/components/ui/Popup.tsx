<<<<<<< HEAD
"use client";
import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
=======
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> 0ff8d5d468f2672545be86299bcf0ce6b2c15ccd

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
<<<<<<< HEAD
  children: ReactNode;
  type?: "success" | "error" | "info";
  duration?: number;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const typeClasses = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  return (
    <div className={`fixed top-5 right-5 z-50 border-l-4 p-4 shadow-lg rounded-md w-[300px] ${typeClasses[type]}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{title}</h4>
        <button onClick={onClose}><X size={16} /></button>
      </div>
      <div className="text-sm">{children}</div>
    </div>
=======
  children: React.ReactNode;
  width?: string; // eg: 'w-[600px]' or 'w-full md:w-[500px]'
  onConfirm?: () => void | Promise<void>
  mode?: "add" | "edit";
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children, width = 'w-full md:w-[600px]' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white rounded-2xl shadow-xl p-6 relative ${width} max-h-[90vh] overflow-y-auto`}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={onClose}
            >
              <X size={20} />
            </button>
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
>>>>>>> 0ff8d5d468f2672545be86299bcf0ce6b2c15ccd
  );
};

export default Popup;
