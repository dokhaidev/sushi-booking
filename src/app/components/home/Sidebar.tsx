"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FaHome,
  FaUsers,
  FaUtensils,
  FaChair,
  FaShoppingCart,
  FaGift,
  FaCommentDots,
  FaUserTie,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const pathname = usePathname()

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const menuItems = [
    {
      key: "dashboard",
      label: "Tổng quan",
      href: "/quan-tri/tong-quan",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      key: "quanly",
      label: "Quản lý",
      icon: <FaUtensils className="w-5 h-5" />, // General management icon
      children: [
        {
          key: "nguoidung",
          label: "Quản lý người dùng",
          href: "/quan-tri/quan-ly/nguoi-dung",
          icon: <FaUsers className="w-4 h-4" />,
        },
        {
          key: "thucdon",
          label: "Quản lý thực đơn",
          href: "/quan-tri/quan-ly/thuc-don",
          icon: <FaUtensils className="w-4 h-4" />,
        },
        {
          key: "ban",
          label: "Quản lý bàn",
          href: "/quan-tri/quan-ly/ban",
          icon: <FaChair className="w-4 h-4" />,
        },
        {
          key: "donhang",
          label: "Quản lý đơn hàng",
          href: "/quan-tri/quan-ly/don-hang",
          icon: <FaShoppingCart className="w-4 h-4" />,
        },
        {
          key: "khuyenmai",
          label: "Quản lý voucher",
          href: "/quan-tri/quan-ly/khuyen-mai",
          icon: <FaGift className="w-4 h-4" />,
        },
        {
          key: "phanhoi",
          label: "Quản lý phản hồi",
          href: "/quan-tri/quan-ly/phan-hoi",
          icon: <FaCommentDots className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "nhanvien",
      label: "Nhân viên",
      icon: <FaUserTie className="w-5 h-5" />, // Employee management icon
      children: [
        {
          key: "bep",
          label: "Nhân viên bếp",
          href: "/quan-tri/nhan-vien/bep",
          icon: <FaUtensils className="w-4 h-4" />,
        },
      ],
    },
  ]

  const renderMenu = (items: any[], level = 0) => {
    return items.map((item) => {
      const isOpen = openMenus.includes(item.key)
      const hasChildren = item.children && item.children.length > 0
      const isActive = item.href && pathname.startsWith(item.href)

      return (
        <div key={item.key} className={`mb-1`}>
          <div
            className={`flex items-center justify-between px-3 py-2 text-base rounded-lg cursor-pointer transition-colors duration-200
            ${isActive ? "bg-[#9c6b66] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}
            ${level > 0 ? "pl-6" : "pl-3"}
            `}
            onClick={() => (hasChildren ? toggleMenu(item.key) : null)}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.href ? (
                <Link href={item.href} className="flex-1">
                  {item.label}
                </Link>
              ) : (
                <span className="flex-1">{item.label}</span>
              )}
            </div>
            {hasChildren && (
              <span className="text-sm transition-transform duration-200">
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            )}
          </div>
          {hasChildren && isOpen && <div className="mt-1 space-y-1">{renderMenu(item.children, level + 1)}</div>}
        </div>
      )
    })
  }

  return (
    <aside className="w-64 bg-white text-black p-4 flex flex-col border-r border-gray-200 shadow-lg sticky h-screen top-0 left-0">
      <div className="text-2xl font-extrabold text-[#9c6b66] mb-8 text-center">Admin Panel</div>
      <nav className="flex-1 overflow-y-auto">{renderMenu(menuItems)}</nav>
    </aside>
  )
}

export default Sidebar
