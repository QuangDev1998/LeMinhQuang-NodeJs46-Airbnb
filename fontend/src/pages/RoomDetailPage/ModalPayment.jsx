import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalPaymentOpen } from "../../redux/slices/bookingSlice";
import { DatePicker, Form, Input, Modal, Radio, Space, Tabs } from "antd";
import dayjs from "dayjs";

export default function ModalPayment({ bookingAction }) {
  const { isModalPaymentOpen, tienTruocThue } = useSelector(
    (state) => state.bookingSlice
  );
  const [value, setValue] = useState("online");
  const [activeTab, setActiveTab] = useState("1");
  const [optionTab1, setOptionTab] = useState("online");
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(setIsModalPaymentOpen(false));
  };

  const handleCancel = () => {
    dispatch(setIsModalPaymentOpen(false));
  };

  const onChange = (key) => {
    setActiveTab(key);
  };

  const onChangeRadio = (e) => {
    setValue(e.target.value);
    setOptionTab(e.target.value);
  };

  const onFinish = (values) => {
    bookingAction();
  };

  const onFinishFailed = (errorInfo) => {
    console.error(errorInfo);
  };

  const renderContentTab1 = () => (
    <div>
      <Radio.Group onChange={onChangeRadio} value={value}>
        <Space direction="vertical">
          <Radio value="online">
            <div className="grid grid-cols-1 md:flex justify-center items-center gap-3 text-xl">
              <p>Thanh toán bằng thẻ</p>
              <div>
                <i className="fab fa-cc-visa" />
                <i className="fab fa-cc-mastercard" />
                <i className="fab fa-cc-amazon-pay" />
                <i className="fa fa-credit-card" />
              </div>
            </div>
          </Radio>
          <Radio value="offline">
            <div className="grid grid-cols-1 md:flex justify-center items-center gap-3 text-xl">
              <p>Thanh toán bằng tiền mặt</p>
              <div>
                <i className="fa fa-money-bill" />
              </div>
            </div>
          </Radio>
        </Space>
      </Radio.Group>
      <div className="w-full mt-5">
        <button
          type="button"
          className="button-primary"
          onClick={() => setActiveTab("2")}
        >
          Tiếp
        </button>
      </div>
    </div>
  );

  const renderContentTab2 = () => {
    if (optionTab1 === "online") {
      return (
        <Form
          name="payment"
          style={{ maxWidth: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            soThe1: "",
            soThe2: "",
            soThe3: "",
            soThe4: "",
            maThe: "",
            chuThe: "",
          }}
        >
          <Form.Item
            label="Số thẻ"
            name="soThe"
            rules={[
              { required: true, message: "Số thẻ không được để trống!" },
              { pattern: /^[0-9]+$/, message: "Phải là số!" },
            ]}
          >
            <Space>
              {["soThe1", "soThe2", "soThe3", "soThe4"].map((field) => (
                <Form.Item
                  key={field}
                  name={field}
                  noStyle
                  rules={[
                    { required: true, message: "Phải có 4 số!" },
                    { pattern: /^\d{4}$/, message: "Phải có 4 số!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              ))}
            </Space>
          </Form.Item>

          <Form.Item
            label="Mã thẻ"
            name="maThe"
            wrapperCol={{ span: 4 }}
            rules={[
              { required: true, message: "Mã thẻ không được để trống!" },
              { pattern: /^\d{3}$/, message: "Phải có 3 số!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày hết hạn"
            name="HSD"
            rules={[
              { required: true, message: "Ngày hết hạn không được để trống!" },
            ]}
          >
            <DatePicker format="MM/YYYY" picker="month" minDate={dayjs()} />
          </Form.Item>

          <Form.Item
            label="Tên chủ thẻ"
            name="chuThe"
            rules={[
              { required: true, message: "Tên chủ thẻ không được để trống!" },
              { pattern: /^[a-zA-Z\s]+$/, message: "Phải là chữ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="flex justify-between mt-5">
            <button
              type="button"
              className="button-outline-primary"
              onClick={() => setActiveTab("1")}
            >
              Quay lại
            </button>
            <button className="button-primary" type="submit">
              Thanh toán
            </button>
          </div>
        </Form>
      );
    }

    return (
      <div>
        <p>
          Số tiền mặt cần trả:{" "}
          <span className="font-bold">{tienTruocThue} $</span>
        </p>
        <div className="flex justify-between mt-5">
          <button
            type="button"
            className="button-outline-primary"
            onClick={() => setActiveTab("1")}
          >
            Quay lại
          </button>
          <button className="button-primary" onClick={bookingAction}>
            Thanh toán
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={isModalPaymentOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Tabs
        activeKey={activeTab}
        items={[
          { key: "1", label: "Hình thức", children: renderContentTab1() },
          { key: "2", label: "Thanh toán", children: renderContentTab2() },
        ]}
        onChange={onChange}
      />
    </Modal>
  );
}
