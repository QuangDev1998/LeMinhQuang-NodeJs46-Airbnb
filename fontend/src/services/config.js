import axios from "axios";
import { store } from "../redux/store";
import { turnOffLoading, turnOnLoading } from "../redux/slices/spinnerSlice";

// Production: đặt REACT_APP_API_URL trên Netlify (vd https://api.domain.com/api)
// Dev (localhost) tự fallback nếu không có biến môi trường.
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const http = axios.create({
  baseURL: BASE_URL,
});

const getLoginData = () => {
  try {
    const raw = localStorage.getItem("USER_LOGIN");
    return raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Add a request interceptor
http.interceptors.request.use(
  function (config) {
    store.dispatch(turnOnLoading());
    const loginData = getLoginData();
    if (loginData?.access_token) {
      config.headers.Authorization = `Bearer ${loginData.access_token}`;
    }
    return config;
  },
  function (error) {
    store.dispatch(turnOffLoading());
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    store.dispatch(turnOffLoading());
    return response;
  },
  async function (error) {
    store.dispatch(turnOffLoading());

    const originalRequest = error.config;
    const status = error.response?.status;
    const loginData = getLoginData();

    // Token hết hạn -> thử refresh 1 lần rồi gọi lại request gốc
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      loginData?.refresh_token
    ) {
      originalRequest._retry = true;
      try {
        // Dùng axios "thuần" để tránh lặp interceptor
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: loginData.refresh_token,
        });
        const { access_token, refresh_token, user } = res.data;
        const newLoginData = {
          ...loginData,
          access_token,
          refresh_token: refresh_token ?? loginData.refresh_token,
          user: user ?? loginData.user,
        };
        localStorage.setItem("USER_LOGIN", JSON.stringify(newLoginData));

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return http(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại -> đăng xuất
        localStorage.removeItem("USER_LOGIN");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
