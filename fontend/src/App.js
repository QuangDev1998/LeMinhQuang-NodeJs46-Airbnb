import "./App.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { ConfigProvider, theme as antdTheme } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./templates/AdminLayout";
import QuanLyNguoiDungPage from "./pages/QuanLyNguoiDungPage/QuanLyNguoiDungPage";
import QuanLyViTriPage from "./pages/QuanLyViTriPage/QuanLyViTriPage";
import QuanLyPhongPage from "./pages/QuanLyPhongPage/QuanLyPhongPage";
import QuanLyBookingPage from "./pages/QuanLyBookingPage/QuanLyBookingPage";
import InfoUserPage from "./pages/InfoUserPage/InfoUserPage";
import RoomDetailPage from "./pages/RoomDetailPage/RoomDetailPage";
import Spinner from "./components/Spinner/Spinner";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Layout from "./templates/Layout";
import HomePage from "./pages/HomePage/HomePage";
import RoomsPage from "./pages/RoomsPage/RoomsPage";
import RoomsVitri from "./pages/RoomsPage/RoomsVitri";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import ScrollToTop from "./pages/ScrollToTop/ScrollToTop";
import QuanLySoLieu from "./pages/QuanLySoLieu/QuanLySoLieu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginData } from "./redux/slices/userSlice";
import { fetchFavoriteIdsAction } from "./redux/slices/favoriteSlice";

// disable: 'mobile' -> KHÔNG áp opacity:0 trên điện thoại (tránh ảnh/nội dung
// bị ẩn khi animation không kích hoạt). once: true -> chạy 1 lần, không lặp.
AOS.init({ once: true, duration: 700, disable: "mobile" });
function App() {
  const dispatch = useDispatch();
  const { themeMode } = useSelector((state) => state.darkModeSlice);

  // Đồng bộ class dark/light lên <html> để TOÀN BỘ app (kể cả header) đổi màu
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    root.classList.toggle("light", themeMode !== "dark");
  }, [themeMode]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("USER_LOGIN");
      const loginData = raw && raw !== "undefined" ? JSON.parse(raw) : null;
      if (loginData) {
        dispatch(setLoginData(loginData));
        // Tải danh sách phòng đã yêu thích để đánh dấu trái tim
        dispatch(fetchFavoriteIdsAction());
      }
    } catch (err) {
      console.error("Lỗi JSON.parse USER_LOGIN:", err);
      localStorage.removeItem("USER_LOGIN");
    }
  }, [dispatch]);
  return (
    <ConfigProvider
      theme={{
        // Dark mode cho TOÀN BỘ antd (Modal/Form/Select/Table/DatePicker/Tag...)
        algorithm:
          themeMode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: { colorPrimary: "#ff385c" },
      }}
    >
      <div>
        <Spinner />
        <BrowserRouter>
          <ScrollToTop />
        <Routes>
          <Route
            path="/info-user"
            element={<Layout content={<InfoUserPage />} />}
          />
          <Route path="/" element={<Layout content={<HomePage />} />} />
          <Route path="/rooms" element={<Layout content={<RoomsPage />} />} />
          <Route
            path="/favorites"
            element={<Layout content={<FavoritesPage />} />}
          />
          <Route
            path="/rooms/:id"
            element={<Layout content={<RoomsVitri />} />}
          />
          <Route
            path="/admin/QuanLySoLieu"
            element={<AdminLayout content={<QuanLySoLieu />} />}
          />
          <Route
            path="/admin/QuanLyNguoiDung"
            element={<AdminLayout content={<QuanLyNguoiDungPage />} />}
          />
          <Route
            path="/admin/QuanLyViTri"
            element={<AdminLayout content={<QuanLyViTriPage />} />}
          />
          <Route
            path="/admin/QuanLyPhong"
            element={<AdminLayout content={<QuanLyPhongPage />} />}
          />
          <Route
            path="/admin/QuanLyBooking"
            element={<AdminLayout content={<QuanLyBookingPage />} />}
          />
          <Route
            path="/room-detail/:id"
            element={<Layout content={<RoomDetailPage />} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
