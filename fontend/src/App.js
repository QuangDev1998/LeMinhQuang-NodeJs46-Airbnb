import "./App.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AOS from "aos";
import "aos/dist/aos.css";
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
import ScrollToTop from "./pages/ScrollToTop/ScrollToTop";
import QuanLySoLieu from "./pages/QuanLySoLieu/QuanLySoLieu";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginData } from "./redux/slices/userSlice";

AOS.init();
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const raw = localStorage.getItem("USER_LOGIN");
    const loginData = raw ? JSON.parse(raw) : null;
    if (loginData) {
      dispatch(setLoginData(loginData));
    }
  }, []);
  return (
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
            path="/rooms/:id"
            element={<Layout content={<RoomsVitri />} />}
          />
          <Route
            path="/info-user"
            element={<Layout content={<InfoUserPage />} />}
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
  );
}

export default App;
