import React from "react";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { authServices } from "../../services/authServices";
import dayjs from "dayjs";
import { setModalContent } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

export default function TempFormRegister({ onRegisterSuccess }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // Hàm xử lý khi người dùng gửi form
  const handleSubmit = async (values) => {
    const { name, email, password, phone, birthday, gender } = values;
    // Chuyển đổi giá trị giới tính cho API (true cho nam, false cho nữ)
    const genderValue =
      gender === "male" ? true : gender === "female" ? false : null;

    // Dữ liệu gửi lên API
    const data = {
      id: 0,
      name: name,
      email: email,
      password: password,
      phone: phone,
      birthday: birthday.format("YYYY-MM-DD"),
      gender: genderValue,
      role: "user",
    };
    authServices
      .register(data)
      .then(() => {
        message.success("Đăng ký thành công");
        form.resetFields();
        dispatch(setModalContent("login"));
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      })
      .catch((err) => {
        message.error("Đăng ký không thành công");
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-6">
        Đăng ký tài khoản Airbnb
      </h2>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
      >
        {/* Tên */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Vui lòng nhập tên của bạn!",
            },
          ]}
        >
          <Input placeholder="Điền tên vào đây..." />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Vui lòng nhập email!",
            },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Điền email vào đây..." />
        </Form.Item>

        {/* Mật khẩu */}
        <Form.Item
          label="Password"
          name="pass_word"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Vui lòng nhập mật khẩu!",
            },
            {
              pattern: /[a-zA-Z]/,
              message: "Mật khẩu phải chứa ít nhất một chữ cái!",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        {/* Số điện thoại */}
        <Form.Item label="Phone number" required>
          <Input.Group compact>
            {/* Select mã vùng */}
            <Form.Item
              name="countryCode"
              noStyle
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng chọn mã vùng!",
                },
              ]}
            >
              <Select placeholder="Mã vùng" style={{ width: "30%" }}>
                <Select.Option value="+84">+84 (Vietnam)</Select.Option>
                <Select.Option value="+44">+44 (UK)</Select.Option>
                <Select.Option value="+61">+61 (Australia)</Select.Option>
              </Select>
            </Form.Item>
            {/* Input số điện thoại */}
            <Form.Item
              name="phone"
              noStyle
              dependencies={["countryCode"]}
              rules={[
                {
                  validator: (_, value, callback) => {
                    if (!value) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số điện thoại!")
                      );
                    }
                    if (!/^0\d{9}$/.test(value)) {
                      return Promise.reject(
                        new Error(
                          "Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số!"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                style={{ width: "70%" }}
                placeholder="Nhập số điện thoại (10 số, bắt đầu bằng 0)"
                maxLength={10}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        {/* Ngày sinh và Giới tính */}
        <div className="flex gap-4">
          <Form.Item
            label="Birthday"
            name="birthday"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            className="flex-1"
          >
            <DatePicker
              maxDate={dayjs(new Date())}
              className="w-full"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            className="flex-1"
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Nút gửi */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold h-10 rounded-md"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
