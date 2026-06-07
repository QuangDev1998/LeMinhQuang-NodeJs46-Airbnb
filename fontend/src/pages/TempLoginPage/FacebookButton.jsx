import React from "react";
import { FacebookLogin } from "react-facebook-login-lite";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { setLoginData } from "../../redux/slices/userSlice";
import { getListIdBookingAction } from "../../redux/thunks/bookingThunks";
import { authServices } from "../../services/authServices";

const FacebookButton = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (response) => {
    const accessToken = response?.authResponse?.accessToken;
    if (!accessToken) {
      message.error("Không thể lấy Access Token từ Facebook.");
      return;
    }

    try {
      // Backend tự xác thực token với Facebook, tìm/tạo user và trả về JWT
      const res = await authServices.facebookLogin(accessToken);
      const loggedInUser = res.data; // { access_token, refresh_token, user }

      dispatch(setLoginData(loggedInUser));
      dispatch(getListIdBookingAction(loggedInUser.user.id));

      message.success("Đăng nhập thành công!");
      if (onLoginSuccess) onLoginSuccess();
      navigate("/");
    } catch (err) {
      console.error("Đăng nhập Facebook thất bại:", err);
      message.error("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
    }
  };

  const handleFailure = (error) => {
    console.error("Facebook login failed:", error);
    message.error("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
  };

  return (
    <div className="mt-3">
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID || "8939394042796946"}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        scope="public_profile,email"
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
