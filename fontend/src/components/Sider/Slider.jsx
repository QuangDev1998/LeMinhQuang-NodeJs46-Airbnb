import { useEffect, useRef, useState } from "react";
import {
  AimOutlined,
  BarChartOutlined,
  CalendarOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import airbnbLogo from "../../assets/image/airbnb-1.aabeefedaf30b8c7011a022cdb5a6425.png";

const NAV_ITEMS = [
  { to: "/admin/QuanLySoLieu", label: "Thống kê", icon: <BarChartOutlined /> },
  {
    to: "/admin/QuanLyNguoiDung",
    label: "Người dùng",
    icon: <UserOutlined />,
  },
  { to: "/admin/QuanLyViTri", label: "Vị trí", icon: <AimOutlined /> },
  { to: "/admin/QuanLyPhong", label: "Phòng", icon: <HomeOutlined /> },
  { to: "/admin/QuanLyBooking", label: "Booking", icon: <CalendarOutlined /> },
];

export default function Slider({ content }) {
  const user = useSelector((state) => state.userSlice.loginData);
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false); // thu gọn sidebar (desktop)
  const [mobileOpen, setMobileOpen] = useState(false); // drawer (mobile)
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userBtnRef = useRef(null);

  // Đóng menu user khi click ra ngoài
  useEffect(() => {
    const onClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        userBtnRef.current &&
        !userBtnRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Đổi route -> đóng drawer mobile
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("USER_LOGIN");
    message.success("Đăng xuất thành công!");
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  const currentLabel =
    NAV_ITEMS.find((i) => i.to === location.pathname)?.label || "Quản trị";

  // Nội dung sidebar (dùng chung cho desktop & drawer mobile)
  const sidebarBody = (onNav) => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={`flex h-16 items-center gap-2 border-b border-gray-100 px-4 ${
          collapsed ? "lg:justify-center" : ""
        }`}
      >
        <img src={airbnbLogo} alt="logo" className="h-8 w-8 object-contain" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-[#ff385c]">
            airbnb<span className="text-gray-400"> admin</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNav}
            title={item.label}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                collapsed ? "lg:justify-center" : ""
              } ${
                isActive
                  ? "bg-[#ff385c] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Về trang chủ */}
      <div className="border-t border-gray-100 p-3">
        <a
          href="/"
          title="Về trang chủ"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 ${
            collapsed ? "lg:justify-center" : ""
          }`}
        >
          <span className="text-lg">
            <AppstoreOutlined />
          </span>
          {!collapsed && <span>Về trang chủ</span>}
        </a>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ===== Sidebar desktop ===== */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-gray-200 bg-white transition-all duration-300 lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarBody()}
      </aside>

      {/* ===== Drawer mobile ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 text-gray-400 hover:text-gray-700"
          aria-label="Đóng menu"
        >
          <CloseOutlined />
        </button>
        {sidebarBody(() => setMobileOpen(false))}
      </aside>

      {/* ===== Khu vực chính ===== */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
          <div className="flex items-center gap-3">
            {/* Toggle thu gọn (desktop) */}
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 lg:flex"
              aria-label="Thu gọn menu"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 lg:hidden"
              aria-label="Mở menu"
            >
              <MenuOutlined />
            </button>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              {currentLabel}
            </h2>
          </div>

          {/* User */}
          <div className="relative">
            <button
              ref={userBtnRef}
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-600">
                {user?.user?.avatar ? (
                  <img
                    src={user.user.avatar}
                    alt="avatar"
                    className="h-9 w-9 object-cover"
                  />
                ) : (
                  <UserOutlined />
                )}
              </span>
              <span className="hidden max-w-[140px] truncate text-sm font-semibold text-gray-800 sm:block">
                {user?.user?.name}
              </span>
            </button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
              >
                <div className="px-4 py-3">
                  <p className="truncate font-semibold text-gray-900">
                    {user?.user?.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {user?.user?.email}
                  </p>
                </div>
                <div className="h-px bg-gray-100" />
                <a
                  href="/info-user"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  <UserOutlined /> Trang cá nhân
                </a>
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  <HomeOutlined /> Về trang chủ
                </a>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-gray-100"
                >
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Nội dung trang */}
        <main className="flex-1 p-4 md:p-6">{content}</main>
      </div>
    </div>
  );
}
