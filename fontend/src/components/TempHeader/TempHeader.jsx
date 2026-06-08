import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TempFormLogin from "../../pages/TempLoginPage/TempFormLogin";
import TempFormRegister from "../../pages/TempLoginPage/TempFormRegister";
import "@fortawesome/fontawesome-free/css/all.min.css";
import airbnbLogo from "../../assets/image/airbnb-1.aabeefedaf30b8c7011a022cdb5a6425.png";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";
import DarkLightToggle from "../DarkLightToggle/DarkLightToggle";
import FacebookButton from "../../pages/TempLoginPage/FacebookButton";

export default function TempHeader() {
  const user = useSelector((state) => state.userSlice.loginData);
  const { isModalOpen, modalContent } = useSelector((state) => state.userSlice);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefMobi = useRef(null);
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const navigate = useNavigate();
  const userIconRef = useRef(null);
  const [, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("LIST_ID_BOOKING");
    message.success("Đăng xuất thành công!");
    setTimeout(() => {
      setShowDropdown(false);
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowDropdown(false);
        setIsScrolled(true);
        setIsDropdownOpen(false);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      if (
        dropdownRefMobi.current &&
        !dropdownRefMobi.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGohome = () => {
    navigate("/");
  };
  const handleOpenModal = (content) => {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
    setShowDropdown(false);
  };
  const handleCloseModal = () => {
    dispatch(setIsModalOpen(false));
  };
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setIsDropdownOpen(false);
  };

  const avatarUrl = user?.user?.avatar;

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={handleGohome}
          className="flex shrink-0 cursor-pointer items-center gap-2"
        >
          <img
            src={airbnbLogo}
            alt="Airbnb logo"
            className="h-8 w-8 object-contain"
          />
          <span className="hidden text-2xl font-bold tracking-tight text-[#ff385c] sm:block">
            airbnb
          </span>
        </div>

        {/* Thanh tìm kiếm giữa (giống Airbnb) */}
        <button
          onClick={() => navigate("/rooms")}
          className="hidden items-center gap-3 rounded-full border border-gray-200 bg-white py-2 pl-6 pr-2 text-sm font-medium shadow-sm transition hover:shadow-md md:flex"
        >
          <span className="text-gray-800">Địa điểm bất kỳ</span>
          <span className="h-5 w-px bg-gray-300" />
          <span className="text-gray-800">Tuần bất kỳ</span>
          <span className="h-5 w-px bg-gray-300" />
          <span className="text-gray-500">Thêm khách</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff385c] text-white">
            <SearchOutlined />
          </span>
        </button>

        {/* Cụm bên phải */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NavLink
            to="/rooms"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 lg:block"
          >
            Cho thuê chỗ ở trên Airbnb
          </NavLink>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 sm:flex">
            <GlobalOutlined />
          </button>
          <DarkLightToggle />

          {/* Pill profile */}
          <div className="relative" ref={dropdownRefMobi}>
            <button
              ref={userIconRef}
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-gray-300 py-1.5 pl-3 pr-1.5 transition hover:shadow-md"
            >
              <MenuOutlined className="text-gray-600" />
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-white">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="h-8 w-8 object-cover"
                  />
                ) : (
                  <UserOutlined />
                )}
              </span>
            </button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl"
                style={{ zIndex: 1000 }}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="truncate font-semibold text-gray-900">
                        {user.user.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {user.user.email}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-gray-100" />
                    {location.pathname !== "/info-user" && (
                      <a
                        href="/info-user"
                        className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                      >
                        Trang cá nhân
                      </a>
                    )}
                    {user.user.role === "ADMIN" && (
                      <a
                        href="/admin/QuanLySoLieu"
                        className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                      >
                        Trang quản trị
                      </a>
                    )}
                    <NavLink
                      to="/rooms"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Danh sách phòng
                    </NavLink>
                    <div className="my-1 h-px bg-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleOpenModal("login")}
                      className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => handleOpenModal("register")}
                      className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Đăng ký
                    </button>
                    <div className="my-1 h-px bg-gray-100" />
                    <NavLink
                      to="/rooms"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Danh sách phòng
                    </NavLink>
                    <button
                      onClick={() => handleScrollTo("contactSection")}
                      className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Liên hệ
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm rút gọn cho mobile */}
      <div className="border-t border-gray-100 px-4 pb-3 pt-2 md:hidden">
        <button
          onClick={() => navigate("/rooms")}
          className="flex w-full items-center gap-3 rounded-full border border-gray-200 px-4 py-2.5 text-sm shadow-sm"
        >
          <SearchOutlined className="text-[#ff385c]" />
          <span className="font-semibold text-gray-800">Tìm kiếm điểm đến</span>
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={420}
      >
        {modalContent === "login" ? (
          <>
            <TempFormLogin
              onLoginSuccess={() => {
                dispatch(setIsModalOpen(false));
                setShowDropdown(false);
              }}
              setModalContent={setModalContent}
            />
            <FacebookButton
              onLoginSuccess={() => {
                dispatch(setIsModalOpen(false));
                setShowDropdown(false);
              }}
            />
          </>
        ) : (
          <TempFormRegister
            onRegisterSuccess={() => {
              dispatch(setModalContent("login"));
              setShowDropdown(false);
            }}
            setModalContent={setModalContent}
          />
        )}
      </Modal>
    </header>
  );
}
