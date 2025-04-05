import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  setIsModalCalendarOpen,
  setTienTruocThue,
  setSoLuongKhach,
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
  setListIdBooking,
} from "../../redux/slices/bookingSlice";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";
import { message } from "antd";
import ModalPayment from "./ModalPayment";
import ModalReBooking from "./ModalReBooking";
import { bookingServices } from "../../services/bookingServices";

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
    const body = {
      maPhong: infoRoom.id,
      ngayDen: dayjs(ngayDen).add(1, "day"),
      ngayDi: dayjs(ngayDi).add(1, "day"),
      soLuongKhach,
      maNguoiDung: user.id,
    };
    bookingServices.createBooking(body).then(() => {
      const updated = [...(listIdBooking || []), infoRoom.id];
      localStorage.setItem("LIST_ID_BOOKING", JSON.stringify(updated));
      dispatch(setListIdBooking(updated));
      dispatch(setIsModalPaymentOpen(false));
      message.success("Đặt phòng thành công");
    });
  };

  const tienNgay = infoRoom.giaTien * totalDay;
  dispatch(setTienTruocThue(tienNgay + 8));

  return (
    <div className="basis-1/3 sticky top-0 w-full lg:h-80">
      <div className="p-5 space-y-5 divide-y-2 border rounded-lg shadow-lg">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div>
              <span className="font-bold">{infoRoom.giaTien}$</span> / đêm
            </div>
            <div className="flex gap-2">
              <StarFilled className="text-primary" />
              <span className="font-bold">{calculateRating()}</span>
              <span className="underline text-gray-500">
                {listComment.length} đánh giá
              </span>
            </div>
          </div>
          <div className="border-2 rounded-lg">
            <div className="flex">
              <div
                className="p-3 grow border-r-2 cursor-pointer"
                onClick={() => dispatch(setIsModalCalendarOpen(true))}
              >
                <p className="font-bold">Nhận phòng</p>
                <p>{dayjs(ngayDen).format("DD/MM/YYYY")}</p>
              </div>
              <div
                className="p-3 grow cursor-pointer"
                onClick={() => dispatch(setIsModalCalendarOpen(true))}
              >
                <p className="font-bold">Trả phòng</p>
                <p>{dayjs(ngayDi).format("DD/MM/YYYY")}</p>
              </div>
            </div>
            <div className="p-3 border-t-2">
              <p className="font-bold text-center">Khách</p>
              <div className="flex justify-evenly items-center">
                <button onClick={() => handleSoKhachChange(-1)}>-</button>
                <span>{soLuongKhach}</span>
                <button onClick={() => handleSoKhachChange(1)}>+</button>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <p>
              ${infoRoom.giaTien} x {totalDay} đêm
            </p>
            <p className="font-bold">${tienNgay}</p>
          </div>
          <div className="flex justify-between">
            <p>Phí vệ sinh</p>
            <p className="font-bold">$8</p>
          </div>
        </div>

        <div className="space-y-5 py-3">
          <div className="flex justify-between">
            <p>Tổng cộng trước thuế</p>
            <p className="font-bold">${tienTruocThue}</p>
          </div>
          <button className="button-primary w-full font-bold" onClick={isLogin}>
            Đặt phòng
          </button>
          <p
            className="text-primary underline cursor-pointer"
            onClick={() => (window.location.href = "/info-user")}
          >
            * Vào trang User để xem thông tin phòng đã đặt
          </p>
        </div>
      </div>
      <ModalPayment bookingAction={bookingAction} />
      <ModalReBooking />
    </div>
  );
}
