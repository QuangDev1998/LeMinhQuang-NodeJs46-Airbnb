import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { message, Modal, Popover, Select, Button } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  MenuOutlined,
  UserOutlined,
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TempFormLogin from "../../pages/TempLoginPage/TempFormLogin";
import TempFormRegister from "../../pages/TempLoginPage/TempFormRegister";
import "@fortawesome/fontawesome-free/css/all.min.css";
import airbnbLogo from "../../assets/image/airbnb-1.aabeefedaf30b8c7011a022cdb5a6425.png";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";
import {
  setSoLuongKhach,
  setNgayDen,
  setNgayDi,
  setTotalDay,
  setDateChosen,
} from "../../redux/slices/bookingSlice";
import { viTriServices } from "../../services/viTriServices";
import DarkLightToggle from "../DarkLightToggle/DarkLightToggle";
import FacebookButton from "../../pages/TempLoginPage/FacebookButton";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import { addDays } from "date-fns";
import dayjs from "dayjs";

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

  // ===== Bộ lọc tìm kiếm ở header (địa điểm + ngày + số khách) =====
  const { soLuongKhach, ngayDen, ngayDi, dateChosen } = useSelector(
    (state) => state.bookingSlice
  );
  const [locations, setLocations] = useState([]);
  const [openSearch, setOpenSearch] = useState(false); // popover của pill thu gọn
  const [openSearchBig, setOpenSearchBig] = useState(false); // popover của bộ lọc mở rộng
  const [openSearchMobile, setOpenSearchMobile] = useState(false); // popover bộ lọc mobile
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  // Bộ lọc chỉ mở rộng (to) ở trang chủ khi chưa cuộn; còn lại là pill thu gọn
  const isHome = location.pathname === "/";
  const expanded = isHome && !isScrolled;
  const [dateRange, setDateRange] = useState([
    { startDate: ngayDen, endDate: ngayDi, key: "selection" },
  ]);

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
    const { startDate, endDate } = item.selection;
    dispatch(setNgayDen(startDate));
    dispatch(setNgayDi(endDate));
    dispatch(setTotalDay(Math.round((endDate - startDate) / 86400000)));
    // Đánh dấu người dùng đã chủ động chọn ngày -> mới bật lọc theo ngày
    dispatch(setDateChosen(true));
  };

  useEffect(() => {
    viTriServices
      .findViTri("", 1, 100)
      .then((res) => {
        const data = res.data?.content?.data || [];
        setLocations(
          data.map((it) => ({
            id: it.id,
            tinhThanh: it.tinh_thanh,
            tenViTri: it.ten_vi_tri,
          }))
        );
      })
      .catch((err) => console.error("Lỗi lấy địa điểm:", err));
  }, []);

  const handleSearchFilter = () => {
    setOpenSearch(false);
    setOpenSearchBig(false);
    setOpenSearchMobile(false);
    // Có chọn địa điểm -> lọc theo vị trí; không chọn -> xem tất cả
    navigate(selectedLocationId ? `/rooms/${selectedLocationId}` : "/rooms");
  };

  const selectedLocationName =
    locations.find((l) => l.id === selectedLocationId)?.tinhThanh ||
    "Địa điểm bất kỳ";

  const dateLabel = dateChosen
    ? `${dayjs(dateRange[0].startDate).format("DD/MM")} - ${dayjs(
        dateRange[0].endDate
      ).format("DD/MM")}`
    : "Thêm ngày";

  const searchContent = (
    <div className="w-[320px] max-w-[88vw] p-2">
      <p className="mb-2 text-sm font-semibold text-gray-700">
        Bạn muốn đến đâu?
      </p>
      <Select
        showSearch
        allowClear
        value={selectedLocationId ?? undefined}
        placeholder="Chọn địa điểm"
        optionFilterProp="label"
        className="w-full"
        onChange={(val) => setSelectedLocationId(val ?? null)}
        options={locations.map((l) => ({ value: l.id, label: l.tinhThanh }))}
      />
      <p className="mb-1 mt-3 text-sm font-semibold text-gray-700">
        Chọn ngày
      </p>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <DateRange
          className="w-full"
          ranges={dateRange}
          onChange={handleDateChange}
          months={1}
          minDate={new Date()}
          maxDate={addDays(new Date(), 180)}
          rangeColors={["#ff385c"]}
          locale={vi}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Khách</span>
        <div className="flex items-center gap-2">
          <Button
            shape="circle"
            size="small"
            icon={<MinusOutlined />}
            disabled={soLuongKhach <= 1}
            onClick={() => dispatch(setSoLuongKhach(soLuongKhach - 1))}
          />
          <span className="w-5 text-center font-semibold">{soLuongKhach}</span>
          <Button
            shape="circle"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => dispatch(setSoLuongKhach(soLuongKhach + 1))}
          />
        </div>
      </div>
      <button
        onClick={handleSearchFilter}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff385c] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <SearchOutlined /> Tìm kiếm
      </button>
    </div>
  );

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
      if (window.scrollY > 24) {
        setShowDropdown(false);
        setIsScrolled(true);
        setIsDropdownOpen(false);
        // Đóng popover bộ lọc mở rộng khi bắt đầu cuộn (tránh popover treo lơ lửng)
        setOpenSearchBig(false);
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

        {/* Pill tìm kiếm THU GỌN - hiện khi đã cuộn (hoặc không ở trang chủ) */}
        <Popover
          content={searchContent}
          trigger="click"
          placement="bottom"
          open={openSearch}
          onOpenChange={(v) => !expanded && setOpenSearch(v)}
        >
          <button
            className={`hidden origin-center items-center gap-3 rounded-full border border-gray-200 bg-white py-2 pl-6 pr-2 text-sm font-medium shadow-sm transition-all duration-500 ease-out hover:shadow-md md:flex ${
              expanded
                ? "pointer-events-none scale-[0.4] opacity-0"
                : "scale-100 opacity-100"
            }`}
          >
            <span className="text-gray-800">{selectedLocationName}</span>
            <span className="h-5 w-px bg-gray-300" />
            <span className="text-gray-800">{dateLabel}</span>
            <span className="h-5 w-px bg-gray-300" />
            <span className="text-gray-500">{soLuongKhach} khách</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff385c] text-white">
              <SearchOutlined />
            </span>
          </button>
        </Popover>

        {/* Cụm bên phải */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NavLink
            to="/rooms"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 lg:block"
          >
            Cho thuê chỗ ở trên Airbnb
          </NavLink>
          <button
            onClick={() => navigate("/favorites")}
            aria-label="Yêu thích"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
          >
            <HeartOutlined />
          </button>
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
                    <NavLink
                      to="/favorites"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Yêu thích
                    </NavLink>
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

      {/* Bộ lọc MỞ RỘNG (to) - chỉ ở trang chủ khi chưa cuộn; thu nhỏ mượt khi cuộn xuống */}
      <div
        className={`hidden origin-top justify-center overflow-hidden px-4 transition-all duration-500 ease-out md:flex ${
          expanded
            ? "max-h-32 scale-100 pb-4 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 scale-[0.4] pb-0 opacity-0"
        }`}
      >
        <Popover
          content={searchContent}
          trigger="click"
          placement="bottom"
          open={openSearchBig}
          onOpenChange={(v) => expanded && setOpenSearchBig(v)}
        >
          <button className="flex w-full max-w-3xl items-stretch justify-between rounded-full border border-gray-200 bg-white p-2 shadow-md transition hover:shadow-lg">
            <span className="flex flex-1 flex-col items-start justify-center rounded-full px-6 py-1 text-left transition hover:bg-gray-50">
              <span className="text-xs font-bold text-gray-800">Địa điểm</span>
              <span className="truncate text-sm text-gray-500">
                {selectedLocationId ? selectedLocationName : "Tìm điểm đến"}
              </span>
            </span>
            <span className="my-2 w-px bg-gray-200" />
            <span className="flex flex-1 flex-col items-start justify-center rounded-full px-6 py-1 text-left transition hover:bg-gray-50">
              <span className="text-xs font-bold text-gray-800">Ngày</span>
              <span className="truncate text-sm text-gray-500">{dateLabel}</span>
            </span>
            <span className="my-2 w-px bg-gray-200" />
            <span className="flex flex-1 items-center justify-between gap-2 rounded-full pl-6 pr-1 transition hover:bg-gray-50">
              <span className="flex flex-col items-start justify-center py-1 text-left">
                <span className="text-xs font-bold text-gray-800">Khách</span>
                <span className="text-sm text-gray-500">
                  {soLuongKhach} khách
                </span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-lg text-white">
                <SearchOutlined />
              </span>
            </span>
          </button>
        </Popover>
      </div>

      {/* Thanh tìm kiếm cho mobile - mở bộ lọc địa điểm/ngày/khách */}
      <div className="border-t border-gray-100 px-4 pb-3 pt-2 md:hidden">
        <Popover
          content={searchContent}
          trigger="click"
          placement="bottom"
          open={openSearchMobile}
          onOpenChange={setOpenSearchMobile}
        >
          <button className="flex w-full items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm">
            <SearchOutlined className="text-[#ff385c]" />
            <span className="truncate font-semibold text-gray-800">
              {selectedLocationId ? selectedLocationName : "Tìm kiếm điểm đến"}
            </span>
            <span className="ml-auto text-xs text-gray-400">
              {dateChosen ? dateLabel : ""} · {soLuongKhach} khách
            </span>
          </button>
        </Popover>
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
