"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AuthContext } from "../../context/authContext";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiClock,
  FiHome,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const navLinks = [
    {
      href: "/",
      label: "Trang chủ",
      icon: <FiHome size={18} className="md:hidden" />,
    },
    { href: "/thuc-don", label: "Thực đơn" },
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
    { href: "/lien-he", label: "Liên hệ" },
    { href: "/dat-ban", label: "Đặt bàn", highlight: true },
  ];

  return (
    <header
      className={`sticky sm:px-16 lg:px-18 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-[#F8F1E9] border-b border-[#AF763E]"
      }`}
    >
      <div className="container mx-auto py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="flex items-center space-x-2"
              aria-label="Trang chủ"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  scrolled ? "bg-[#AF763E]" : "bg-[#AF763E]"
                }`}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2252/2252075.png"
                  alt="Sushi Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h1
                className={`text-2xl font-bold hidden sm:block ${
                  scrolled ? "text-[#333333]" : "text-[#333333]"
                }`}
              >
                Sushi Takumi
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg transition-all ${
                  pathname === link.href
                    ? scrolled
                      ? "text-[#333333] font-medium"
                      : "text-[#333333] font-medium"
                    : scrolled
                    ? "text-[#333333] hover:text-[#666666]"
                    : "text-[#333333] hover:text-[#666666]"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navUnderline"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      scrolled ? "bg-[#9E7676]" : "bg-[#815B5B]"
                    }`}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                {link.highlight && !pathname.includes(link.href) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B04242] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B04242]"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div
            className="hidden md:flex items-center space-x-3 relative"
            ref={userMenuRef}
          >
            {user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 group focus:outline-none transition-colors ${
                    userMenuOpen
                      ? "text-[#333333]"
                      : scrolled
                      ? "text-[#333333] hover:text-[#666666]"
                      : "text-[#333333] hover:text-[#666666]"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium shadow-sm transition-all ${
                      scrolled
                        ? "bg-gradient-to-br from-[#E8D5C4] to-[#9E7676]"
                        : "bg-gradient-to-br from-[#9E7676] to-[#815B5B]"
                    } ${
                      userMenuOpen ? "ring-2 ring-[#815B5B] ring-offset-2" : ""
                    }`}
                  >
                    <FiUser size={16} />
                  </motion.div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#F0E6D2] overflow-hidden z-50"
                    >
                      <div className="p-2 border-b border-[#F0E6D2] bg-[#FFF9F0]">
                        <p className="text-sm font-medium text-[#594545] px-2 py-1 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-[#594545] hover:bg-[#F8F1E6] transition-colors"
                      >
                        <FiUser className="mr-3 text-[#815B5B]" size={16} />
                        Thông tin cá nhân
                      </Link>

                      <Link
                        href="/user/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-[#594545] hover:bg-[#F8F1E6] transition-colors"
                      >
                        <FiClock className="mr-3 text-[#815B5B]" size={16} />
                        Lịch sử đơn hàng
                      </Link>

                      <Link
                        href="/user/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-[#594545] hover:bg-[#F8F1E6] transition-colors"
                      >
                        <FiSettings className="mr-3 text-[#815B5B]" size={16} />
                        Cài đặt tài khoản
                      </Link>

                      <div className="border-t border-[#F0E6D2]">
                        <button
                          onClick={() => {
                            logout?.();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-[#F8F1E6] transition-colors"
                        >
                          <FiLogOut className="mr-3" size={16} />
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dang-nhap"
                  className={`transition-colors text-sm font-medium px-3 py-1.5 ${
                    scrolled
                      ? "text-[#333333] hover:text-[#666666]"
                      : "text-[#333333] hover:text-[#666666]"
                  }`}
                >
                  Đăng nhập
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/dang-ky"
                    className={`px-4 py-2 rounded-lg transition-all shadow hover:shadow-md text-sm font-medium block ${
                      scrolled
                        ? "bg-gradient-to-r from-[#AF763E] to-[#6B5E3C] text-white"
                        : "bg-gradient-to-r from-[#AF763E] to-[#6B5E3C] text-white"
                    }`}
                  >
                    Đăng ký
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <FiX size={24} className="text-[#333333]" />
            ) : (
              <FiMenu
                size={24}
                className={scrolled ? "text-[#333333]" : "text-[#666666]"}
              />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 rounded-lg mx-2 transition-colors ${
                        pathname === link.href
                          ? "bg-[#F8F1E9] text-[#333333] font-medium"
                          : "text-[#333333] hover:bg-[#F8F1E9]"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon && <span className="mr-3">{link.icon}</span>}
                      {link.label}
                      {link.highlight && !pathname.includes(link.href) && (
                        <span className="ml-2 h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B04242] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B04242]"></span>
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-3 mt-3 border-t border-[#E8D5C4] mx-4">
                  {user ? (
                    <>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.1,
                        }}
                        className="flex items-center px-4 py-3 space-x-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#9E7676] flex items-center justify-center text-white font-medium shadow-sm">
                          <FiUser size={16} />
                        </div>
                        <div>
                          <p className="text-[#594545] font-medium">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#815B5B] truncate">
                            {user.email}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.15,
                        }}
                      >
                        <Link
                          href="/user"
                          className="flex items-center px-4 py-2 text-[#815B5B] hover:bg-[#F8F1E6] rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiUser className="mr-3" size={16} />
                          Thông tin cá nhân
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.2,
                        }}
                      >
                        <Link
                          href="/user/orders"
                          className="flex items-center px-4 py-2 text-[#815B5B] hover:bg-[#F8F1E6] rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiClock className="mr-3" size={16} />
                          Lịch sử đơn hàng
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.25,
                        }}
                      >
                        <Link
                          href="/user/settings"
                          className="flex items-center px-4 py-2 text-[#815B5B] hover:bg-[#F8F1E6] rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiSettings className="mr-3" size={16} />
                          Cài đặt tài khoản
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.3,
                        }}
                        className="border-t border-[#E8D5C4] mt-2"
                      >
                        <button
                          onClick={() => {
                            logout?.();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-[#F8F1E6] rounded-md"
                        >
                          <FiLogOut className="mr-3" size={16} />
                          Đăng xuất
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.1,
                        }}
                      >
                        <Link
                          href="/dang-nhap"
                          className="flex items-center px-4 py-2 text-[#333333] hover:bg-[#F8F1E6] rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Đăng nhập
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.15,
                        }}
                      >
                        <Link
                          href="/dang-ky"
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#AF763E] to-[#6B5E3C] text-white rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Đăng ký
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
