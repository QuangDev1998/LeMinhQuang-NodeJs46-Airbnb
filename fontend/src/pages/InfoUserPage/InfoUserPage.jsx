import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { message } from "antd";
import {
  CameraOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  GiftOutlined,
  ManOutlined,
  WomanOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  HomeOutlined,
  StarFilled,
} from "@ant-design/icons";
import ListBookedRoom from "./ListBookedRoom";
import ModalUpHinh from "./ModalUpHinh";
import ModalEditInfoUser from "./ModalEditInfoUser";
import {
  setIsModalEditOpenAction,
  setIsModalUpHinhOpenAction,
} from "../../redux/slices/infoUserSlice";
import {
  createListBookedRoomAction,
  fetchInfoUserAction,
} from "../../redux/thunks/infoUserThunks";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";

export default function InfoUserPage() {
  const dispatch = useDispatch();
  const idUser = useSelector((state) => state.userSlice.loginData?.user.id);
  const { infoUser, listBooked } = useSelector((state) => state.infoUserSlice);
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const { listIdBooking } = useSelector((state) => state.bookingSlice);

  // Fetch lại info user khi user / danh sách booking thay đổi
  useEffect(() => {
    if (idUser) {
      dispatch(fetchInfoUserAction(idUser));
      dispatch(createListBookedRoomAction(listIdBooking));
    }
  }, [idUser, listIdBooking]);

  // Chưa đăng nhập -> mở modal đăng nhập
  useEffect(() => {
    if (!idUser) {
      dispatch(setModalContent("login"));
      dispatch(setIsModalOpen(true));
      message.warning("Đăng nhập để xem thông tin cá nhân");
    }
  }, [idUser, dispatch]);

  const avatar =
    infoUser.avatar ||
    "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
  const isAdmin = infoUser.role === "ADMIN";
  const tripCount = Array.isArray(listBooked) ? listBooked.length : 0;

  const infoItems = [
    { icon: <MailOutlined />, label: "Email", value: infoUser.email || "—" },
    {
      icon: <PhoneOutlined />,
      label: "Điện thoại",
      value: infoUser.phone || "—",
    },
    {
      icon: <GiftOutlined />,
      label: "Ngày sinh",
      value: infoUser.birth_day
        ? dayjs(infoUser.birth_day).format("DD/MM/YYYY")
        : "—",
    },
    {
      icon: infoUser.gender ? <ManOutlined /> : <WomanOutlined />,
      label: "Giới tính",
      value: infoUser.gender ? "Nam" : "Nữ",
    },
  ];

  const stats = [
    { icon: <HomeOutlined />, num: tripCount, label: "Chuyến đi" },
    { icon: <StarFilled />, num: "4.9", label: "Đánh giá" },
    { icon: <SafetyCertificateOutlined />, num: "2024", label: "Tham gia" },
  ];

  return (
    <div className={`${themeMode} min-h-screen bg-gray-50 pt-20 pb-16`}>
      {/* ===== Hồ sơ - banner + avatar ===== */}
      <div className="container">
        <div className="reveal relative mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-airbnb">
          <div
            className="h-32 w-full bg-cover bg-center md:h-48"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.30) 100%), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center md:flex-row md:items-end md:text-left">
            {/* Avatar nổi lên trên banner */}
            <div className="-mt-16 shrink-0 md:-mt-20">
              <div className="group relative">
                <img
                  src={avatar}
                  alt="avatar"
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg transition duration-300 group-hover:scale-105 md:h-36 md:w-36"
                />
                <button
                  onClick={() => dispatch(setIsModalUpHinhOpenAction(true))}
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#ff385c] text-white shadow-md transition hover:scale-110"
                  aria-label="Cập nhật ảnh"
                >
                  <CameraOutlined />
                </button>
              </div>
            </div>

            {/* Tên + huy hiệu */}
            <div className="flex-1 md:pb-2">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <h1 className="text-2xl font-bold text-gray-900">
                  {infoUser.name || "Người dùng"}
                </h1>
                {isAdmin && (
                  <span className="rounded-full bg-[#ff385c]/10 px-2.5 py-0.5 text-xs font-bold text-[#ff385c]">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                <EnvironmentOutlined className="mr-1" />
                Thành viên Airbnb · Tham gia 2024
              </p>
            </div>

            {/* Nút chỉnh sửa */}
            <button
              onClick={() => dispatch(setIsModalEditOpenAction(true))}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:scale-105 hover:bg-gray-100"
            >
              <EditOutlined /> Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </div>

      {/* ===== Thân: 2 cột ===== */}
      <div className="container mt-6 grid gap-6 lg:grid-cols-3">
        {/* Cột trái */}
        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div
            className="reveal hover-lift rounded-3xl border border-gray-200 bg-white p-6 shadow-airbnb"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex items-center gap-3">
              <SafetyCertificateOutlined className="text-2xl text-[#ff385c]" />
              <h2 className="text-lg font-bold text-gray-900">
                Xác minh danh tính
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Xác minh danh tính giúp tăng độ tin cậy và mở khoá huy hiệu đặc
              biệt.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#ff385c]/5 px-3 py-2 text-sm font-medium text-[#ff385c]">
              <i className="fa fa-award" /> Chủ nhà siêu cấp
            </div>
            <button
              onClick={() => message.info("Hiện chưa có danh hiệu mới")}
              className="button-primary mt-4 w-full"
            >
              Nhận huy hiệu
            </button>
          </div>

          <div
            className="reveal hover-lift rounded-3xl border border-gray-200 bg-white p-6 shadow-airbnb"
            style={{ animationDelay: "0.12s" }}
          >
            <h2 className="mb-3 text-lg font-bold text-gray-900">
              Đã được xác nhận
            </h2>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircleFilled className="text-green-500" /> Địa chỉ email
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleFilled className="text-green-500" /> Số điện thoại
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleFilled className="text-green-500" /> Tài khoản đang
                hoạt động
              </li>
            </ul>
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6 lg:col-span-2">
          {/* Thống kê */}
          <div
            className="reveal grid grid-cols-3 gap-4"
            style={{ animationDelay: "0.1s" }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="hover-lift rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-airbnb"
              >
                <div className="text-xl text-[#ff385c]">{s.icon}</div>
                <p className="mt-1 text-2xl font-extrabold text-gray-900">
                  {s.num}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Thông tin cá nhân */}
          <div
            className="reveal rounded-3xl border border-gray-200 bg-white p-6 shadow-airbnb"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Thông tin cá nhân
              </h2>
              <button
                onClick={() => dispatch(setIsModalEditOpenAction(true))}
                className="text-sm font-semibold text-[#ff385c] transition hover:underline"
              >
                Chỉnh sửa
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff385c]/10 text-[#ff385c]">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="truncate font-semibold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phòng đã thuê */}
          <div className="reveal" style={{ animationDelay: "0.2s" }}>
            <ListBookedRoom />
          </div>
        </div>
      </div>

      <ModalUpHinh idUser={idUser} />
      <ModalEditInfoUser />
    </div>
  );
}
