import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListBookedRoom from "./ListBookedRoom";
import {
  setIsModalEditOpenAction,
  setIsModalUpHinhOpenAction,
} from "../../redux/slices/infoUserSlice";
import ModalUpHinh from "./ModalUpHinh";
import {
  createListBookedRoomAction,
  fetchInfoUserAction,
} from "../../redux/thunks/infoUserThunks";
import ModalEditInfoUser from "./ModalEditInfoUser";
import { message } from "antd";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";
import { CheckOutlined } from "@ant-design/icons";

export default function InfoUserPage() {
  const dispatch = useDispatch();
  const idUser = useSelector((state) => state.userSlice.loginData?.user.id);
  const { infoUser } = useSelector((state) => state.infoUserSlice);
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const { listIdBooking } = useSelector((state) => state.bookingSlice); // 👈 thêm vào

  // 🔁 Tự động fetch lại info user khi user hoặc listIdBooking thay đổi
  useEffect(() => {
    if (idUser) {
      dispatch(fetchInfoUserAction(idUser));
      dispatch(createListBookedRoomAction(listIdBooking));
    }
  }, [idUser, listIdBooking]);

  const renderRequireLogin = () => {
    if (!idUser) {
      dispatch(setModalContent("login"));
      dispatch(setIsModalOpen(true));
      message.warning("Đăng nhập để xem thông tin cá nhân");
    }
  };

  return (
    <div className={`${themeMode} pt-24`}>
      <div>
        {/* header trang */}
        <div className="container pt-4">
          <h1 className="text-3xl font-bold">Hồ sơ của bạn</h1>
          <p className="mt-1 text-gray-500">
            Thông tin chi tiết về tài khoản{" "}
            <span className="font-semibold text-[#ff385c]">
              {infoUser.name}
            </span>
          </p>
        </div>

        {/* info */}
        <div className="container grid lg:flex gap-10 py-6">
          {/* info left */}
          <div
            className="block lg:sticky top-0 basis-1/4"
            style={{
              minHeight: "500px",
              maxHeight: "100vh",
            }}
          >
            <div className="space-y-3 rounded-2xl border border-gray-200 p-5 shadow-airbnb">
              {/* avatar */}
              <div>
                <img
                  src={
                    infoUser.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                  }
                  alt="avatar"
                  className="mx-auto h-36 w-36 object-cover rounded-full"
                />
              </div>
              <div className="w-full flex justify-center">
                <button
                  className="button-primary my-3"
                  onClick={() => dispatch(setIsModalUpHinhOpenAction(true))}
                >
                  Cập nhật ảnh
                </button>
              </div>
              <div className="divide-y-2">
                <div>
                  <div className="flex justify-start gap-3">
                    <img
                      className="w-6"
                      src="https://cdn-icons-png.flaticon.com/512/5972/5972778.png"
                      alt=""
                    />
                    <h1 className="font-bold text-xl">Xác minh danh tính</h1>
                  </div>
                  <p>Xác minh danh tính của bạn để nhận huy hiệu.</p>
                  <p>
                    <i className="fa fa-award text-primary mr-3" />
                    Chủ nhà siêu cấp
                  </p>
                  <button
                    className="mb-5 button-primary"
                    onClick={() => message.info("Hiện chưa có danh hiệu mới")}
                  >
                    Nhận huy hiệu
                  </button>
                </div>
                {idUser && (
                  <div>
                    <h1 className="font-bold text-xl">ADMIN ĐÃ XÁC NHẬN</h1>
                    <ul>
                      <li>
                        <CheckOutlined /> Địa chỉ email
                      </li>
                      <li>
                        <CheckOutlined /> Số điện thoại
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* info right */}
          <div className="basis-3/4 space-y-3 p-5">
            <h1 className="text-xl font-bold">
              Xin chào, tôi là {infoUser.name}
            </h1>
            <p className="text-sm text-gray-500">Bắt đầu tham gia vào 2024</p>
            <button
              className="button-primary"
              onClick={() => dispatch(setIsModalEditOpenAction(true))}
            >
              Chỉnh sửa hồ sơ
            </button>
            {/* danh sách phòng đã book */}
            <ListBookedRoom />
          </div>
        </div>

        {/* modals */}
        <ModalUpHinh idUser={idUser} />
        <ModalEditInfoUser />
      </div>

      <div>{renderRequireLogin()}</div>
    </div>
  );
}
