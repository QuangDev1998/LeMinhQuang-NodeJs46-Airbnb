import React, { useEffect, useState } from "react";
import { message, Popconfirm, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createListBookedRoomAction,
  createListIdBookingAction,
} from "../../redux/thunks/infoUserThunks";
import { fetchListViTriAction } from "../../redux/thunks/quanLyViTriThunks";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { viTriServices } from "../../services/viTriServices";
import { setListViTriAction } from "../../redux/slices/quanLyViTriSlice";
import dayjs from "dayjs";
import { bookingServices } from "../../services/bookingServices";
import { getListIdBookingAction } from "../../redux/thunks/bookingThunks";

export default function ListBookedRoom() {
  const idUser = useSelector((state) => state.userSlice.loginData?.user.id);
  const { listIdBooking, listBookedRoom, listBooked } = useSelector(
    (state) => state.infoUserSlice
  );
  const { listViTri } = useSelector((state) => state.quanLyViTriSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fixed items per page

  useEffect(() => {
    viTriServices
      .getListViTri()
      .then((result) => {
        dispatch(setListViTriAction(result.data.content));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    dispatch(createListIdBookingAction(idUser));
  }, [dispatch, idUser]);
  useEffect(() => {
    dispatch(createListBookedRoomAction(listIdBooking));
  }, [dispatch, listIdBooking]);
  useEffect(() => {
    dispatch(fetchListViTriAction());
  }, []);

  const renderTinhThanh = (id) => {
    if (!Array.isArray(listViTri)) return "Không rõ";

    const index = listViTri.findIndex((viTri) => viTri.id === id);
    return index !== -1 ? listViTri[index].tinhThanh : "Không rõ";
  };

  const renderDateBookRoom = (idBooking) => {
    let index = listBooked.findIndex((room) => room.id === idBooking);
    if (index !== -1) {
      const ngayDen = dayjs(listBooked[index].ngay_den).format("DD/MM/YYYY");
      const ngayDi = dayjs(listBooked[index].ngay_di).format("DD/MM/YYYY");
      return (
        <span>
          {ngayDen} - {ngayDi}
        </span>
      );
    }
  };

  const renderRoomInfo = (maPhong, idBooking) => {
    let index = listBookedRoom.findIndex((room) => room.id === maPhong);
    if (index === -1) return null;
    const room = listBookedRoom[index];
    const amenities = [
      { ok: room.dieuHoa, label: "Điều hòa" },
      { ok: room.bep, label: "Bếp" },
      { ok: room.hoBoi, label: "Hồ bơi" },
    ];
    return (
      <div className="hover-lift group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-airbnb">
        {/* Nút thao tác */}
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            onClick={() => navigate(`/room-detail/${room.id}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition hover:scale-110 hover:text-[#ff385c]"
            title="Xem chi tiết"
          >
            <InfoCircleOutlined />
          </button>
          <Popconfirm
            title="Huỷ đặt phòng"
            description="Bạn có chắc muốn huỷ đặt phòng này?"
            onConfirm={() => confirm(idBooking)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow transition hover:scale-110"
              title="Huỷ đặt"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Ảnh */}
          <div className="h-48 w-full overflow-hidden sm:h-auto sm:w-64 sm:shrink-0">
            <img
              src={room.hinhAnh}
              alt={room.tenPhong}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          {/* Thông tin */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <h3 className="pr-20 text-lg font-bold text-gray-900">
                {room.tenPhong}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                <EnvironmentOutlined className="mr-1" />
                {renderTinhThanh(room.maViTri)}
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ff385c]/10 px-3 py-1 text-sm font-medium text-[#ff385c]">
              <i className="far fa-calendar" />
              {renderDateBookRoom(idBooking)}
            </span>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
              <span>{room.phongNgu} phòng ngủ</span>
              <span>{room.giuong} giường</span>
              <span>{room.phongTam} phòng tắm</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {amenities.map((a, i) => (
                <span
                  key={i}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    a.ok
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-400 line-through"
                  }`}
                >
                  {a.label}
                </span>
              ))}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-3">
              <span className="text-lg font-extrabold text-gray-900">
                ${room.giaTien}
              </span>
              <span className="text-sm text-gray-500"> / đêm</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListBookedRoom = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRooms = listBooked.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return currentRooms.map((room) => (
      <div key={room.id}>{renderRoomInfo(room.ma_phong, room.id)}</div>
    ));
  };

  const handleDeleteBookedRoom = (id) => {
    bookingServices
      .deleteBooking(id)
      .then((result) => {
        message.success("Xóa thành công");
        dispatch(getListIdBookingAction(idUser));
        dispatch(createListIdBookingAction(idUser));
      })
      .catch((err) => {
        message.error("Xóa thất bại");
        console.error(err);
      });
  };

  const confirm = (id) => {
    handleDeleteBookedRoom(id);
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-airbnb">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Phòng đã thuê</h2>
        {listBookedRoom.length > 0 && (
          <span className="rounded-full bg-[#ff385c]/10 px-3 py-1 text-xs font-semibold text-[#ff385c]">
            {listBooked.length} chuyến đi
          </span>
        )}
      </div>

      {listBookedRoom.length > 0 ? (
        <div>
          <div className="space-y-5">{renderListBookedRoom()}</div>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={listBooked.length}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
            className="mt-5 text-center"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <i className="fa-regular fa-calendar-xmark text-4xl text-gray-300" />
          <p className="text-gray-500">Bạn chưa đặt phòng nào.</p>
          <a
            href="/rooms"
            className="rounded-full bg-[#ff385c] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Khám phá chỗ ở
          </a>
        </div>
      )}
    </div>
  );
}
