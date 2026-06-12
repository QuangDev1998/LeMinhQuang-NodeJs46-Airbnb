import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, Input, message, InputNumber, DatePicker } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { setIsModalEditOpenAction } from "../../redux/slices/quanLyBookingSlice";
import dayjs from "dayjs";
import { bookingServices } from "../../services/bookingServices";
import { fetchBookingInfoAction } from "../../redux/thunks/quanLyBookingThunks";
import AdminModalHeader from "../../components/Admin/AdminModalHeader";

export default function ModalEditQLBooking({ fetchSearchBooking, valueInput }) {
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
      .then(() => {
        dispatch(fetchBookingInfoAction(bookingInfo.id));
        fetchSearchBooking(valueInput);
        dispatch(setIsModalEditOpenAction(false));
        message.success("Cập nhật thành công");
      })
      .catch(() => {
        message.error("Cập nhật thất bại");
      });
  };

  const renderInitialValues = () => {
    if (bookingInfo) {
      return {
        id: bookingInfo.id,
        ma_phong: bookingInfo.ma_phong,
        ngay_den: dayjs(bookingInfo.ngay_den),
        ngay_di: dayjs(bookingInfo.ngay_di),
        so_luong_khach: bookingInfo.so_luong_khach,
        ma_nguoi_dat: bookingInfo.ma_nguoi_dat,
      };
    }
  };

  return (
    <Modal
      className="admin-modal"
      centered
      closable={false}
      open={isModalEditOpen}
      okText="Cập nhật"
      cancelText="Hủy"
      onCancel={hideModal}
      destroyOnClose
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: { backgroundColor: "#ff385c", borderColor: "#ff385c" },
      }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={renderInitialValues()}
          onFinish={handleOk}
        >
          {dom}
        </Form>
      )}
    >
      <AdminModalHeader
        icon={<CalendarOutlined />}
        title="Cập nhật booking"
        subtitle="Chỉnh sửa thông tin đơn đặt phòng"
      />

      <Form.Item name="id" label="Mã booking">
        <Input disabled />
      </Form.Item>
      <Form.Item name="ma_phong" label="Mã phòng">
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="ngay_den"
        label="Ngày đến"
        rules={[{ required: true, message: "Vui lòng chọn ngày đến!" }]}
        hasFeedback
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="ngay_di"
        label="Ngày đi"
        rules={[{ required: true, message: "Vui lòng chọn ngày đi!" }]}
        hasFeedback
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="so_luong_khach"
        label="Số khách"
        rules={[{ required: true, message: "Vui lòng nhập số khách!" }]}
        hasFeedback
      >
        <InputNumber min={1} max={10} placeholder="1" className="w-full" />
      </Form.Item>
      <Form.Item name="ma_nguoi_dat" label="Mã người dùng">
        <Input disabled />
      </Form.Item>
    </Modal>
  );
}
