"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants for menu links with explicit type for 'i'
  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  // Animation for mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <header className="bg-gradient-to-r from-[#FDF8F3] via-[#FFF8E8] to-[#FDF8F3] border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-4xl font-bold text-[#1B1B1B] tracking-tight flex items-center"
        >
          Sushi <span className="text-[#D94F4F] ml-1">Takumi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-12 text-lg font-medium">
          {["Thực đơn", "Về chúng tôi", "Liên hệ", "Đặt chỗ"].map(
            (item, index) => (
              <motion.div
                key={item}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
              >
                <Link
                  href={
                    item === "Trang chủ"
                      ? "/"
                      : item === "Thực đơn"
                      ? "/menu"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className="text-[#1B1B1B] hover:text-[#D94F4F] transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#D94F4F] group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            )
          )}
        </nav>

        {/* Reservation Button (Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden md:block"
        >
          <Link
            href="/reservations"
            className="bg-[#E76F51] hover:bg-[#d65c40] text-white px-6 py-2 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Đặt bàn
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none text-[#1B1B1B]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </motion.svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="md:hidden bg-[#FDF8F3] border-t border-gray-200 px-6 py-6 shadow-inner"
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={mobileMenuVariants}
      >
        <nav className="flex flex-col space-y-4 text-lg font-medium">
          {["Thực đơn", "Về chúng tôi", "Liên hệ", "Đặt chỗ"].map(
            (item, index) => (
              <motion.div
                key={item}
                custom={index}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                variants={linkVariants}
              >
                <Link
                  href={
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className="text-[#1B1B1B] hover:text-[#D94F4F] transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            )
          )}
          <motion.div
            custom={4}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={linkVariants}
          >
            <Link
              href="/reservations"
              className="block bg-[#E76F51] hover:bg-[#d65c40] text-white px-5 py-1.5 rounded-lg font-medium text-center transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Đặt bàn
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </header>
  );
}
