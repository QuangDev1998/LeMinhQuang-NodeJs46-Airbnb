import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { setLoginData } from "../../redux/slices/userSlice";
import { getListIdBookingAction } from "../../redux/thunks/bookingThunks";
import { fetchFavoriteIdsAction } from "../../redux/slices/favoriteSlice";
import { authServices } from "../../services/authServices";

const FB_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID || "8939394042796946";
const FB_VERSION = "v19.0";

// Nạp Facebook JS SDK một lần duy nhất, dùng chung cho mọi lần mount.
let fbSdkPromise = null;
const loadFacebookSdk = () => {
  if (fbSdkPromise) return fbSdkPromise;

  fbSdkPromise = new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: false,
        version: FB_VERSION,
      });
      resolve(window.FB);
    };

    const id = "facebook-jssdk";
    if (document.getElementById(id)) return; // script đang nạp dở

    const script = document.createElement("script");
    script.id = id;
    script.src = "https://connect.facebook.net/vi_VN/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => reject(new Error("Không tải được Facebook SDK"));
    document.body.appendChild(script);
  });

  return fbSdkPromise;
};

const FacebookButton = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadFacebookSdk()
      .then(() => mounted && setReady(true))
      .catch((err) => {
        console.error("Facebook SDK load error:", err);
        if (mounted) setReady(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const authenticateWithBackend = async (accessToken) => {
    try {
      // Backend tự xác thực token với Facebook, tìm/tạo user và trả về JWT
      const res = await authServices.facebookLogin(accessToken);
      const loggedInUser = res.data; // { access_token, refresh_token, user }

      dispatch(setLoginData(loggedInUser));
      dispatch(getListIdBookingAction(loggedInUser.user.id));
      dispatch(fetchFavoriteIdsAction());

      message.success("Đăng nhập thành công!");
      if (onLoginSuccess) onLoginSuccess();
      navigate("/");
    } catch (err) {
      console.error("Đăng nhập Facebook thất bại:", err);
      message.error("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
    }
  };

  const handleClick = () => {
    if (!window.FB) {
      message.error("Facebook SDK chưa sẵn sàng, vui lòng thử lại sau giây lát.");
      return;
    }

    setLoading(true);
    window.FB.login(
      (response) => {
        setLoading(false);
        if (response.status === "connected" && response.authResponse?.accessToken) {
          authenticateWithBackend(response.authResponse.accessToken);
        } else {
          // Người dùng đóng popup hoặc từ chối cấp quyền
          message.info("Bạn đã hủy đăng nhập bằng Facebook.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready || loading}
      className="relative flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg
        className="absolute left-4 h-5 w-5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#1877F2"
          d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.955.93-1.955 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
        />
      </svg>
      {loading
        ? "Đang xử lý..."
        : ready
        ? "Tiếp tục với Facebook"
        : "Đang tải Facebook..."}
    </button>
  );
};

export default FacebookButton;
