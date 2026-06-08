import React from "react";
import { Form, Input, message } from "antd";
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
        const { access_token, refresh_token, user } = res.data;

        // Lưu vào Redux (setLoginData đã tự lưu localStorage)
        const loginPayload = { user, access_token, refresh_token };
        dispatch(setLoginData(loginPayload));

        // Load danh sách đã đặt phòng theo user.id
        dispatch(getListIdBookingAction(user.id));

        message.success("Đăng nhập thành công!");

        if (onLoginSuccess) onLoginSuccess();
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        message.error("Đăng nhập thất bại, vui lòng thử lại!");
      });
  };

  return (
    <div className="pt-2">
      <h2 className="border-b border-gray-200 pb-4 text-center text-lg font-bold text-gray-900">
        Đăng nhập hoặc đăng ký
      </h2>

      <div className="pt-5">
        <h3 className="mb-4 text-2xl font-semibold text-gray-900">
          Chào mừng bạn đến với Airbnb
        </h3>

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
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="pass_word"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password size="large" placeholder="Mật khẩu" />
          </Form.Item>

          <button type="submit" className="button-primary mt-1 w-full">
            Đăng nhập
          </button>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <span
            className="cursor-pointer font-semibold text-[#ff385c] underline"
            onClick={() => dispatch(setModalContent("register"))}
          >
            Đăng ký ngay
          </span>
        </p>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          hoặc
          <span className="h-px flex-1 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
