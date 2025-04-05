import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import { nguoiDungServices } from "../../services/nguoiDungServices";
import dayjs from "dayjs";
import { setIsModalEditOpenAction } from "../../redux/slices/quanLyNguoiDungSlice";
import {
  fetchListUserAction,
  fetchUserInfoAction,
} from "../../redux/thunks/quanLyNguoiDungThunks";

export default function ModalEditQLNguoiDung({ valueInput }) {
  const { isModalEditOpen, userInfo, currentPage } = useSelector(
    (state) => state.quanLyNguoiDungSlice
  );
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState();
  const dispatch = useDispatch();

  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
  };
  const hideModal = () => {
    dispatch(setIsModalEditOpenAction(false));
  };
  // hàm submit form
  const handleOk = (values) => {
    values.birthday = dayjs(values.birthday);
    // gọi api edit
    nguoiDungServices
      .editUser(userInfo.id, values)
      .then((result) => {
        // => => update list
        dispatch(fetchUserInfoAction(userInfo.id));
        dispatch(fetchListUserAction({ currentPage, valueInput }));
        dispatch(setIsModalEditOpenAction(false));
        message.success("Cập nhật thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Cập nhật thất bại");
      });
  };
  const renderInitialValues = () => {
    if (userInfo) {
      return {
        id: userInfo.id,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        gender: userInfo.gender,
        birthday: dayjs(userInfo.birthday),
        role: userInfo.role,
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
        <h1 className="my-3 text-2xl text-center">Cập nhật người dùng</h1>
        <Row gutter={24}>
          {/* Col left */}
          <Col className="gutter-row" span={24} md={12}>
            {/* id */}
            <Form.Item name="id" label="Mã người dùng">
              <Input disabled />
            </Form.Item>

            {/* phone */}
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                  whitespace: true,
                },
                {
                  required: true,
                  message: "Phải là số",
                  pattern: new RegExp(/^[0-9]+$/),
                },

                {
                  required: true,
                  message: "Phải có 10 số",
                  pattern: new RegExp(/^\d{10}$/),
                },
              ]}
              hasFeedback
            >
              <Input
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            {/* gender */}
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giới tính!",
                },
              ]}
              hasFeedback
            >
              <Select
                placeholder="Chọn giới tính"
                options={[
                  {
                    value: true,
                    label: "Nam",
                  },
                  {
                    value: false,
                    label: "Nữ",
                  },
                ]}
              ></Select>
            </Form.Item>
          </Col>
          {/* Col right */}
          <Col className="gutter-row" span={24} md={12}>
            {/* name */}
            <Form.Item
              name="name"
              label="Tên người dùng"
              tooltip="Tên hiển thị với mọi người"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên người dùng!",
                  whitespace: true,
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            {/* email */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                  whitespace: true,
                },
              ]}
              hasFeedback
            >
              <Input disabled />
            </Form.Item>

            {/* birthday */}
            <Form.Item
              name="birthday"
              label="Ngày sinh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày sinh!",
                },
              ]}
              hasFeedback
            >
              <DatePicker
                maxDate={dayjs(new Date())}
                format="DD/MM/YYYY"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* role */}
        <Form.Item
          name="role"
          label="Chức vụ"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn chức vụ!",
            },
          ]}
          hasFeedback
        >
          <Radio.Group onChange={onChangeRadio} value={radioValue}>
            <Radio value="ADMIN">Admin</Radio>
            <Radio value="USER">User</Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </div>
  );
}
