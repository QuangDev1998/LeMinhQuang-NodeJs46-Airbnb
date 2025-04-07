import React, { useEffect, useState } from "react";
import { Button, Card, message, Popconfirm, Pagination } from "antd";
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
      const ngayDen = dayjs(listBooked[index].ngayDen).format("DD/MM/YYYY");
      const ngayDi = dayjs(listBooked[index].ngayDi).format("DD/MM/YYYY");
      return (
        <span className="text-sm block">
          {ngayDen} - {ngayDi}
        </span>
      );
    }
  };

  const renderRoomInfo = (maPhong, idBooking) => {
    let index = listBookedRoom.findIndex((room) => room.id === maPhong);
    if (index !== -1) {
      let room = listBookedRoom[index];
      return (
        <Card hoverable data-aos="zoom-in">
          <div className="grid grid-cols1 md:grid-cols-2 gap-5 z-0">
            <div className="absolute top-0 right-0 grid grid-cols1 md:flex gap-2 z-10">
              <Button
                className="h-8 w-8 text-blue-500"
                onClick={() => {
                  navigate(`/room-detail/${room.id}`);
                }}
              >
                <InfoCircleOutlined />
              </Button>

              <Popconfirm
                title="Xoá người dùng"
                description="Bạn có chắc muốn xóa người dùng?"
                onConfirm={() => confirm(idBooking)}
                okText="Có"
                cancelText="Không"
                okButtonProps={{
                  danger: "danger",
                }}
                className="z-50"
              >
                <Button className="h-8 w-8 text-red-500">
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </div>
            <div className="h-48">
              <img
                src={room.hinhAnh}
                alt=""
                className="h-full object-cover rounded-md"
              />
            </div>
            <div className="divide-y-2">
              <div>
                <h1 className="text-lg font-bold">{room.tenPhong}</h1>
                <div className=" text-gray-400">
                  {renderDateBookRoom(idBooking)}
                </div>

                <p className="text-sm">
                  <EnvironmentOutlined className="mr-1" />
                  {renderTinhThanh(room.maViTri)}
                </p>
              </div>

              <div className="mt-2 flex justify-start gap-5 text-gray-500">
                <ul>
                  <li>{room.phongNgu} phòng ngủ</li>
                  <li>{room.giuong} giường</li>
                  <li>{room.phongTam} phòng tắm</li>
                </ul>
                <ul>
                  <li>{room.dieuHoa ? "v" : "x"} Điều hòa</li>
                  <li>{room.bep ? "v" : "x"} Bếp</li>
                  <li>{room.hoBoi ? "v" : "x"} Hồ bơi</li>
                </ul>
              </div>
              <div className="mt-2">
                <p>
                  <span className="font-bold">$ {room.giaTien}</span> / đêm
                </p>
              </div>
            </div>
          </div>
        </Card>
      );
    }
  };

  const renderListBookedRoom = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRooms = listBooked.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return currentRooms.map((room) => (
      <div className="mt-5 duration-300" key={room.id}>
        {renderRoomInfo(room.ma_phong, room.id)}
      </div>
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
        message.success("Xóa thất bại");
        console.error(err);
      });
  };

  const confirm = (id) => {
    handleDeleteBookedRoom(id);
  };

  return (
    <div>
      {listBookedRoom.length > 0 ? (
        <div>
          <h1 className="text-xl font-bold">Phòng đã thuê</h1>
          {/* Pagination ở trên */}
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={listBooked.length}
            showSizeChanger={false}
            onChange={(page) => {
              setCurrentPage(page);
            }}
            className="my-4"
          />
          <div className="relative">{renderListBookedRoom()}</div>
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-bold">Phòng đã thuê</h1>
          <a href="/" className="hover:underline text-primary">
            Hiện bạn chưa có phòng, bạn có muốn đặt phòng?
          </a>
        </div>
      )}
    </div>
  );
}
