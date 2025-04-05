import React from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
} from "../../redux/slices/bookingSlice";

export default function ModalReBooking() {
  const dispatch = useDispatch();
  const { isModalReBookingOpen } = useSelector((state) => state.bookingSlice);

  const handleOk = () => {
    dispatch(setIsModalReBookingOpen(false));
    dispatch(setIsModalPaymentOpen(true));
  };

  const handleCancel = () => {
    dispatch(setIsModalReBookingOpen(false));
  };

  return (
    <Modal
      title="Phòng này bạn đã đặt"
      okText="Tiếp tục"
      cancelText="Không"
      open={isModalReBookingOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <p>Bạn đã từng đặt phòng này trước đó.</p>
      <p>Bạn có muốn tiếp tục đặt lại phòng này không?</p>
    </Modal>
  );
}
