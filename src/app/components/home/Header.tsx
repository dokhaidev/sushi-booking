"use client"
import { useEffect, useState, useRef } from "react"
import { Bell, User, LogOut, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/app/context/authContext" // Import useAuth

interface UserData {
  // Aligned with User interface in AuthContext
  id: string | number
  name: string // Changed from ho_ten to name
  email: string
  [key: string]: any
}

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth() // Use user, isAuthenticated, logout from AuthContext
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = () => {
    logout() // Call logout from AuthContext
  }

  return (
    <header className="bg-white text-black border-b border-gray-200 p-4 flex justify-end items-center relative shadow-sm">
      <div className="flex items-center space-x-6 ml-6">
        {/* Icon thông báo */}
        <div className="relative cursor-pointer text-gray-600 hover:text-gray-800 transition-colors">
          <Bell className="w-6 h-6" />
          {/* Badge thông báo nếu cần */}
          {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span> */}
        </div>
        {/* Avatar hoặc Icon user */}
        {isAuthenticated && user ? ( // Check isAuthenticated and user object
          <div className="flex items-center space-x-2 relative min-w-0" ref={userMenuRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center space-x-2 group focus:outline-none transition-colors max-w-[200px] 2xl:max-w-[250px] text-[#333333] hover:text-[#666666]"
              aria-haspopup="true"
              aria-expanded={showDropdown}
              aria-label="User menu"
            >
              <div
                className={`w-8 h-8 xl:w-9 xl:h-9 rounded-full flex items-center justify-center text-white font-medium shadow-sm transition-all
                  bg-gradient-to-br from-[#E8D5C4] to-[#9E7676]
                  ${showDropdown ? "ring-2 ring-[#815B5B] ring-offset-2" : ""}
                `}
              >
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden sm:block min-w-0 flex-1 truncate" title={user.name}>
                {user.name}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#F0E6D2] overflow-hidden z-50">
                <div className="p-2 border-b border-[#F0E6D2] bg-[#FFF9F0]">
                  <p className="text-sm font-medium text-[#594545] px-2 py-1 truncate">{user.email}</p>
                </div>
                <div
                  onClick={() => {
                    router.push("/quan-tri/tong-quan")
                    setShowDropdown(false)
                  }}
                  className="flex items-center px-4 py-3 text-sm text-[#594545] hover:bg-[#F8F1E9] transition-colors cursor-pointer"
                >
                  <Home className="mr-3 text-[#815B5B]" size={16} />
                  Quay lại trang chủ
                </div>
                <div className="flex items-center px-4 py-3 text-sm text-[#594545] hover:bg-[#F8F1E9] transition-colors cursor-pointer">
                  <User className="mr-3 text-[#815B5B]" size={16} />
                  Thông tin tài khoản
                </div>
                <div className="border-t border-[#F0E6D2]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-[#F8F1E9] transition-colors"
                  >
                    <LogOut className="mr-3" size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // If not authenticated, or user object is null, display a simple User icon
          // The middleware should handle redirection to /dang-nhap for admin routes
          <User className="w-6 h-6 text-gray-600" />
        )}  
      </div>
    </header>
  )
}

export default Header
