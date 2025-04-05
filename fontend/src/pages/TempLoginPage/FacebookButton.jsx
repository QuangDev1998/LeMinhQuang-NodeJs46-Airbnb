import React, { useEffect } from "react";
import { FacebookLogin } from "react-facebook-login-lite";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { setLoginData } from "../../redux/slices/userSlice";
import { getListIdBookingAction } from "../../redux/thunks/bookingThunks";
import { authServices } from "../../services/authServices";
import { nguoiDungServices } from "../../services/nguoiDungServices";

const FacebookButton = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      // console.log("User from session:", savedUser);
    }
  }, []);

  const handleSuccess = async (response) => {
    const { authResponse } = response || {};
    const accessToken = authResponse?.accessToken;

    if (!accessToken) {
      message.error("Không thể lấy Access Token từ Facebook.");
      return;
    }

    try {
      // Gọi Facebook Graph API để lấy thông tin người dùng
      const fbResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      const data = await fbResponse.json();

      if (!data || !data.name || !data.picture?.data?.url) {
        throw new Error("Không thể lấy dữ liệu từ Facebook.");
      }

      const avatarUrl = data.picture.data.url;

      // Kiểm tra người dùng trong hệ thống
      const result = await nguoiDungServices.findUser(1, 10, data.name);
      const userData = result.data.content.data[0];

      if (userData) {
        // Người dùng đã tồn tại, thực hiện đăng nhập
        const userLogin = {
          email: userData.email,
          password: userData.password,
        };

        try {
          const loginResult = await authServices.login(userLogin);
          message.success("Đăng nhập thành công!");

          const loggedInUser = loginResult.data.content;
          loggedInUser.user.avatar = avatarUrl;
          // Thêm avatar vào thông tin người dùng
          const userWithAvatar = { ...loggedInUser };

          // Lưu thông tin vào state và localStorage
          dispatch(setLoginData(userWithAvatar));
          localStorage.setItem("USER_LOGIN", JSON.stringify(userWithAvatar));

          // Lấy danh sách phòng đã đặt
          dispatch(getListIdBookingAction(loggedInUser.user.id));

          // Gọi hàm đóng Modal
          if (onLoginSuccess) {
            onLoginSuccess();
          }

          // Điều hướng đến trang cần
          navigate();
        } catch (err) {
          message.error("Đăng nhập thất bại, vui lòng thử lại!");
        }
      } else {
        // Người dùng không tồn tại, thực hiện đăng ký
        const userRegister = {
          id: 0,
          name: data.name,
          email: data.email,
          password: "123a",
          phone: "0328984656",
          birthday: "1998-12-22",
          gender: true,
          role: "user",
        };

        try {
          const registerResult = await authServices.register(userRegister);

          if (registerResult.data.content) {
            const userLogin = {
              email: userRegister.email,
              password: userRegister.password,
            };

            const loginResult = await authServices.login(userLogin);
            message.success("Đăng nhập thành công!");

            const loggedInUser = loginResult.data.content;

            // Thêm avatar vào thông tin người dùng
            const userWithAvatar = { ...loggedInUser, avatar: avatarUrl };

            // Lưu thông tin vào state và localStorage
            dispatch(setLoginData(userWithAvatar));
            localStorage.setItem("USER_LOGIN", JSON.stringify(userWithAvatar));

            // Lấy danh sách phòng đã đặt
            dispatch(getListIdBookingAction(loggedInUser.user.id));

            // Gọi hàm đóng Modal
            if (onLoginSuccess) {
              onLoginSuccess();
            }

            // Điều hướng đến trang cần
            navigate();
          }
        } catch (err) {
          message.error("Đăng nhập thất bại, vui lòng thử lại!");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const handleFailure = (error) => {
    console.error("Facebook login failed:", error);
    alert("Login failed. Please try again.");
  };

  return (
    <div className="mt-3">
      <FacebookLogin
        appId="8939394042796946" // Thay bằng App ID của bạn
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        scope="public_profile,email" // Yêu cầu quyền
        buttonStyle={{
          padding: "20px",
          background: "#4267B2",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        btnText="Đăng Nhập Bằng Facebook"
      >
        Đăng nhập bằng Facebook
      </FacebookLogin>
    </div>
  );
};

export default FacebookButton;
