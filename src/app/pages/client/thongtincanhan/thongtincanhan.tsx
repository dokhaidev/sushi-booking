"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Lock,
  History,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit,
  Check,
  X,
  Camera,
} from "lucide-react";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/authContext";

export default function UserDashboard() {
  const { user: authUser, isLoading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "orders">("profile");
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [tempUser, setTempUser] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authUser) {
      const defaultUser = {
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        gender: authUser.gender || "",
        birthdate: authUser.birthdate || "",
        address: authUser.address || "",
        avatar: authUser.avatar || "https://i.pravatar.cc/150?img=56",
      };
      setUser(defaultUser);
      setTempUser(defaultUser);
    }
  }, [authUser]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatar = event.target?.result as string;
        setUser((prev) => ({ ...prev, avatar }));
        setTempUser((prev) => ({ ...prev, avatar }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempUser({ ...user });
    setEditMode(true);
  };

  const handleSave = () => {
    setUser({ ...tempUser });
    updateUser(tempUser);
    setEditMode(false);
  };

  const handleCancel = () => setEditMode(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading || !user || !tempUser) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 inline-block">
            Tài khoản của tôi
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Quản lý thông tin cá nhân, bảo mật và đơn hàng
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Animated Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-b border-gray-200"
          >
            <nav className="flex -mb-px">
              <TabButton
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                icon={<User className="w-5 h-5" />}
                label="Thông tin cá nhân"
              />
              <TabButton
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                icon={<Lock className="w-5 h-5" />}
                label="Bảo mật"
              />
              <TabButton
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
                icon={<History className="w-5 h-5" />}
                label="Đơn hàng"
              />
            </nav>
          </motion.div>

          {/* Tab Content with Animation */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileTab
                    user={editMode ? tempUser : user}
                    editMode={editMode}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onInputChange={handleInputChange}
                    onAvatarClick={handleAvatarClick}
                    fileInputRef={fileInputRef}
                    onFileChange={handleFileChange}
                  />
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SecurityTab />
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrdersTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Tab Components ==========

function ProfileTab({
  user,
  editMode,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onAvatarClick,
  fileInputRef,
  onFileChange,
}: {
  user: any;
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative cursor-pointer"
            onClick={onAvatarClick}
          >
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: editMode ? 1 : 0 }}
              className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center"
            >
              <Camera className="text-white w-8 h-8" />
            </motion.div>
          </motion.div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="text-center md:text-left">
          {editMode ? (
            <div className="flex flex-col items-center md:items-start space-y-4">
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={onInputChange}
                className="text-2xl font-bold text-gray-900 bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-600">{user.email}</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </>
          )}

          <div className="mt-6 flex gap-3 justify-center md:justify-start">
            {editMode ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Check className="w-4 h-4" />
                  Lưu thay đổi
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <X className="w-4 h-4" />
                  Hủy bỏ
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa hồ sơ
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<User className="text-blue-600" />}
          title="Thông tin cơ bản"
          editMode={editMode}
          items={[
            {
              label: "Họ tên",
              value: user.name,
              name: "name",
              editable: true,
            },
            {
              label: "Giới tính",
              value: user.gender,
              name: "gender",
              editable: true,
            },
            {
              label: "Ngày sinh",
              value: user.birthdate,
              name: "birthdate",
              editable: true,
            },
          ]}
          onInputChange={onInputChange}
        />
        <InfoCard
          icon={<MapPin className="text-blue-600" />}
          title="Liên hệ"
          editMode={editMode}
          items={[
            {
              label: "Email",
              value: user.email,
              name: "email",
              editable: true,
            },
            {
              label: "Số điện thoại",
              value: user.phone,
              name: "phone",
              editable: true,
            },
            {
              label: "Địa chỉ",
              value: user.address,
              name: "address",
              editable: true,
            },
          ]}
          onInputChange={onInputChange}
        />
      </div>
    </div>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Bảo mật tài khoản
      </h2>
      <form className="space-y-6">
        <div className="space-y-5">
          <PasswordInput
            label="Mật khẩu hiện tại"
            value={passwords.current}
            showPassword={showPassword.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            onToggleVisibility={() => toggleShowPassword("current")}
          />
          <PasswordInput
            label="Mật khẩu mới"
            value={passwords.new}
            showPassword={showPassword.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            onToggleVisibility={() => toggleShowPassword("new")}
          />
          <PasswordInput
            label="Xác nhận mật khẩu"
            value={passwords.confirm}
            showPassword={showPassword.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            onToggleVisibility={() => toggleShowPassword("confirm")}
          />
        </div>
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition"
          >
            Cập nhật mật khẩu
          </motion.button>
        </div>
      </form>
    </div>
  );
}

function OrdersTab() {
  const orders = [
    { id: 101, date: "01/06/2024", total: "450,000đ", status: "Đã giao" },
    { id: 102, date: "10/06/2024", total: "120,000đ", status: "Đang xử lý" },
    { id: 103, date: "15/06/2024", total: "320,000đ", status: "Đã huỷ" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Lịch sử đơn hàng
      </h2>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có đơn hàng
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Bạn chưa có đơn hàng nào được đặt.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-xl"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Mã đơn
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Ngày đặt
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Tổng tiền
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    #{order.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.total}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="#"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem chi tiết
                    </motion.a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

// ========== UI Components ==========

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex items-center justify-center py-4 px-6 text-sm font-medium w-1/3 relative",
        active
          ? "text-blue-600"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      <span className="flex items-center gap-2 z-10">
        {icon}
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="tabIndicator"
          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

function InfoCard({
  icon,
  title,
  items,
  editMode,
  onInputChange,
}: {
  icon: React.ReactNode;
  title: string;
  items: {
    label: string;
    value: string;
    name?: string;
    editable?: boolean;
  }[];
  editMode?: boolean;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-full">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">{item.label}</p>
            {editMode && item.editable ? (
              <input
                type="text"
                name={item.name}
                value={item.value}
                onChange={onInputChange}
                className="mt-1 w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses = {
    "Đã giao": "bg-green-100 text-green-800",
    "Đang xử lý": "bg-yellow-100 text-yellow-800",
    "Đã huỷ": "bg-red-100 text-red-800",
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={classNames(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        statusClasses[status as keyof typeof statusClasses] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </motion.span>
  );
}
