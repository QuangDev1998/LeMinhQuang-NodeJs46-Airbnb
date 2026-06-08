import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StarFilled,
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckCircleFilled,
  SafetyCertificateFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  setIsModalCalendarOpen,
  setTienTruocThue,
  setSoLuongKhach,
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
} from "../../redux/slices/bookingSlice";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";
import { message } from "antd";
import ModalPayment from "./ModalPayment";
import ModalReBooking from "./ModalReBooking";
import { bookingServices } from "../../services/bookingServices";
import {
  createListBookedRoomAction,
  createListIdBookingAction,
} from "../../redux/thunks/infoUserThunks";
import { getListIdBookingAction } from "../../redux/thunks/bookingThunks";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-US");

export default function InfoRoomRight() {
  const dispatch = useDispatch();
  const { infoRoom, listComment } = useSelector(
    (state) => state.detailRoomSlice
  );
  const {
    soLuongKhach,
    totalDay,
    ngayDen,
    ngayDi,
    tienTruocThue,
    isBooked,
    listIdBooking,
  } = useSelector((state) => state.bookingSlice);
  const user = useSelector((state) => state.userSlice.loginData?.user);

  const calculateRating = () => {
    if (!listComment?.length) return 0;
    const total = listComment.reduce((acc, c) => acc + c.saoBinhLuan, 0);
    return parseFloat((total / listComment.length).toFixed(2));
  };

  const handleSoKhachChange = (delta) => {
    let newVal = soLuongKhach + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > infoRoom.khach) newVal = infoRoom.khach;
    dispatch(setSoLuongKhach(newVal));
  };

  const isLogin = () => {
    if (!user) {
      dispatch(setModalContent("login"));
      dispatch(setIsModalOpen(true));
      return message.warning("Đăng nhập để đặt phòng");
    }
    return isBooked
      ? dispatch(setIsModalReBookingOpen(true))
      : dispatch(setIsModalPaymentOpen(true));
  };

  const bookingAction = () => {
    if (!user?.id) {
      message.warning("Bạn chưa đăng nhập!");
      return;
    }

    const body = {
      ma_phong: infoRoom.id,
      ngay_den: dayjs(ngayDen).add(1, "day"),
      ngay_di: dayjs(ngayDi).add(1, "day"),
      so_luong_khach: soLuongKhach,
      ma_nguoi_dat: user.id,
    };

    console.log("📦 Body gửi đi:", body); // debug

    bookingServices.createBooking(body).then(() => {
      const updated = [...(listIdBooking || []), infoRoom.id];
      localStorage.setItem("LIST_ID_BOOKING", JSON.stringify(updated));

      // ✅ Đúng thứ tự cần cập nhật:
      dispatch(getListIdBookingAction(user.id));
      dispatch(createListIdBookingAction(user.id));
      dispatch(createListBookedRoomAction(updated));

      dispatch(setIsModalPaymentOpen(false));
      message.success("Đặt phòng thành công");
    });
  };
  const tienNgay = (infoRoom.giaTien || 0) * totalDay;
  const rating = calculateRating();

  // Cập nhật tổng tiền trước thuế khi giá phòng / số đêm thay đổi
  // (không dispatch trực tiếp trong thân render để tránh re-render lặp)
  useEffect(() => {
    dispatch(setTienTruocThue(tienNgay + 8));
  }, [tienNgay, dispatch]);

  const openCalendar = () => dispatch(setIsModalCalendarOpen(true));

  return (
    <div className="basis-1/3 w-full">
      <div className="lg:sticky lg:top-28 rounded-3xl border border-gray-200 bg-white text-gray-800 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        {/* Giá + đánh giá */}
        <div className="flex items-end justify-between">
          <div className="leading-none">
            <span className="text-3xl font-extrabold text-gray-900">
              ${fmt(infoRoom.giaTien)}
            </span>
            <span className="text-gray-500 text-base"> / đêm</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <StarFilled style={{ color: "rgb(254,107,110)" }} />
            <span className="font-semibold text-gray-900">{rating}</span>
            <span className="text-gray-400">·</span>
            <span className="underline text-gray-500">
              {listComment.length} đánh giá
            </span>
          </div>
        </div>

        {isBooked && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            <CheckCircleFilled />
            Bạn đã từng đặt phòng này
          </div>
        )}

        {/* Ngày + khách */}
        <div className="mt-5 rounded-2xl border border-gray-300 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-300">
            <button
              type="button"
              onClick={openCalendar}
              className="text-left p-3 transition hover:bg-gray-50"
            >
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <CalendarOutlined /> Nhận phòng
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {dayjs(ngayDen).format("DD/MM/YYYY")}
              </p>
            </button>
            <button
              type="button"
              onClick={openCalendar}
              className="text-left p-3 transition hover:bg-gray-50"
            >
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <CalendarOutlined /> Trả phòng
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {dayjs(ngayDi).format("DD/MM/YYYY")}
              </p>
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-gray-300 p-3">
            <div>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                <UserOutlined /> Khách
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {soLuongKhach} khách
                <span className="font-normal text-gray-400">
                  {" "}
                  · tối đa {infoRoom.khach}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSoKhachChange(-1)}
                disabled={soLuongKhach <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition hover:border-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <MinusOutlined />
              </button>
              <span className="w-5 text-center font-semibold">
                {soLuongKhach}
              </span>
              <button
                type="button"
                onClick={() => handleSoKhachChange(1)}
                disabled={soLuongKhach >= infoRoom.khach}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition hover:border-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <PlusOutlined />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="mt-5 w-full rounded-2xl py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99]"
          style={{
            background:
              "linear-gradient(90deg, rgb(254,107,110), rgb(225,72,108))",
          }}
          onClick={isLogin}
        >
          {isBooked ? "Đặt lại phòng" : "Đặt phòng"}
        </button>
        <p className="mt-3 text-center text-sm text-gray-400">
          Bạn vẫn chưa bị trừ tiền
        </p>

        {/* Chi tiết giá */}
        <div className="mt-5 space-y-3 text-gray-700">
          <div className="flex justify-between">
            <p className="underline">
              ${fmt(infoRoom.giaTien)} x {totalDay} đêm
            </p>
            <p>${fmt(tienNgay)}</p>
          </div>
          <div className="flex justify-between">
            <p className="underline">Phí vệ sinh</p>
            <p>$8</p>
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-extrabold text-gray-900">
            <p>Tổng cộng trước thuế</p>
            <p>${fmt(tienTruocThue)}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <SafetyCertificateFilled style={{ color: "rgb(254,107,110)" }} />
          Miễn phí hủy trong 48 giờ
        </div>

        <p
          className="mt-3 cursor-pointer text-center text-sm text-gray-500 underline transition hover:text-rose-500"
          onClick={() => (window.location.href = "/info-user")}
        >
          Xem các phòng bạn đã đặt
        </p>
      </div>

      <ModalPayment bookingAction={bookingAction} />
      <ModalReBooking />
    </div>
  );
}
