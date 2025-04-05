import React from "react";
import { Button, Form, Input, message } from "antd";
import { authServices } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginData, setModalContent } from "../../redux/slices/userSlice";
import { getListIdBookingAction } from "../../redux/thunks/bookingThunks";

export default function TempFormLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    authServices
      .login(values)
      .then((res) => {
        const { access_token, user } = res.data;

        // Lưu vào Redux + localStorage
        const loginPayload = { user, access_token };
        dispatch(setLoginData(loginPayload));
        localStorage.setItem("USER_LOGIN", JSON.stringify(loginPayload));

        // Load danh sách đã đặt phòng theo user.id
        dispatch(getListIdBookingAction(user.id));

        message.success("Đăng nhập thành công!");

        // Đóng modal nếu có callback
        if (onLoginSuccess) onLoginSuccess();

        // Chuyển trang nếu cần
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        message.error("Đăng nhập thất bại, vui lòng thử lại!");
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-6">
        Đăng nhập Airbnb
      </h2>

      <Form
        layout="vertical"
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          email: "admin@gmail.com",
          pass_word: "admin123",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Vui lòng nhập tài khoản" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="pass_word"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Vui lòng nhập mật khẩu" />
        </Form.Item>

        <div className="flex justify-between mt-4">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 rounded-md"
            onClick={() => dispatch(setModalContent("register"))}
          >
            Đăng ký
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black hover:bg-gray-800 text-white font-medium px-6 rounded-md"
          >
            Đăng nhập
          </Button>
        </div>
      </Form>
    </div>
  );
}
