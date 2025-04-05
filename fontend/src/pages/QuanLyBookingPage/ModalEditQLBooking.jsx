import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, Input, message, InputNumber, DatePicker } from "antd";
import { setIsModalEditOpenAction } from "../../redux/slices/quanLyBookingSlice";
import dayjs from "dayjs";
import { bookingServices } from "../../services/bookingServices";
import { fetchBookingInfoAction } from "../../redux/thunks/quanLyBookingThunks";

export default function ModalQLBooking({ fetchSearchBooking, valueInput }) {
  const { isModalEditOpen, bookingInfo } = useSelector(
    (state) => state.quanLyBookingSlice
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const hideModal = () => {
    dispatch(setIsModalEditOpenAction(false));
  };
  const handleOk = (values) => {
    bookingServices
      .editBooking(values.id, values)
      .then((result) => {
        fetchBookingInfoAction(bookingInfo.id);
        fetchSearchBooking(valueInput);
        dispatch(setIsModalEditOpenAction(false));
        message.success("Cập nhật thành công");
      })
      .catch((err) => {
        message.error("Cập nhật thất bại");
      });
  };
  const renderInitialValues = () => {
    if (bookingInfo) {
      return {
        id: bookingInfo.id,
        maPhong: bookingInfo.maPhong,
        ngayDen: dayjs(bookingInfo.ngayDen),
        ngayDi: dayjs(bookingInfo.ngayDi),
        soLuongKhach: bookingInfo.soLuongKhach,
        maNguoiDung: bookingInfo.maNguoiDung,
      };
    }
  };
  return (
    <div>
      <Modal
        closable={false}
        open={isModalEditOpen}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: {
            backgroundColor: "rgb(254 107 110)",
          },
        }}
        prop
        onCancel={hideModal}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            clearOnDestroy
            initialValues={renderInitialValues()}
            onFinish={(values) => handleOk(values)}
          >
            {dom}
          </Form>
        )}
      >
        <h1 className="my-3 text-2xl text-center">Cập nhật booking</h1>

        {/* id */}
        <Form.Item name="id" label="Mã booking">
          <Input disabled />
        </Form.Item>
        {/* maPhong */}
        <Form.Item name="maPhong" label="Mã phòng">
          <Input disabled />
        </Form.Item>
        {/* ngayDen */}
        <Form.Item
          name="ngayDen"
          label="Ngày đến"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngày đến!",
            },
          ]}
          hasFeedback
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        {/* ngayDi */}
        <Form.Item
          name="ngayDi"
          label="Ngày đi"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngày đi!",
            },
          ]}
          hasFeedback
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        {/* soLuongKhach */}
        <Form.Item
          name="soLuongKhach"
          label="Số khách"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số khách!",
            },
          ]}
          hasFeedback
        >
          <InputNumber min={1} max={10} placeholder="1" className="w-full" />
        </Form.Item>
        {/* maNguoiDung */}
        <Form.Item name="maNguoiDung" label="Mã người dùng">
          <Input disabled />
        </Form.Item>
      </Modal>
    </div>
  );
}
