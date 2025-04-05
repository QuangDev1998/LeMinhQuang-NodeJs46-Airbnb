import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { phongServices } from "../../services/phongServices";
import SelectForm from "../HomePage/SelectForm";
import { useSelector } from "react-redux";

export default function RoomsVitri() {
  const { soLuongKhach } = useSelector((state) => state.bookingSlice);
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const { themeMode } = useSelector((state) => state.darkModeSlice);

  const locationMapping = {
    1: "Hồ Chí Minh",
    2: "Cần Thơ",
    3: "Nha Trang",
    4: "Hà Nội",
    5: "Phú Quốc",
    6: "Đà Nẵng",
    7: "Đà Lạt",
    8: "Phan Thiết",
  };

  const handleRoomClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  const renderList = () => {
    const filteredRooms = rooms.filter((room) => room.khach >= soLuongKhach);

    if (filteredRooms.length === 0) {
      return (
        <div className="text-xl font-bold text-primary">
          Không có phòng phù hợp với số lượng khách yêu cầu.
        </div>
      );
    }

    return filteredRooms.map((room) => (
      <div
        key={room.id}
        onClick={() => handleRoomClick(room.id)}
        className="border rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer grid md:flex"
      >
        <img
          src={room.hinhAnh}
          alt={room.tenPhong}
          className="w-full md:w-48 h-48 object-cover"
        />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">
              {room.tenPhong}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong}{" "}
              giường • {room.phongTam} phòng tắm
            </p>
            <p className="text-gray-700 mt-2 text-sm line-clamp-2">
              {room.moTa}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold">${room.giaTien} / đêm</p>
            <p className="text-xs font-medium text-gray-500">
              {room.wifi && "WiFi • "}
              {room.mayGiat && "Máy giặt • "}
              {room.hoBoi && "Hồ bơi"}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    if (id) {
      phongServices
        .locationPhong(id)
        .then((res) => {
          const content = res.data?.content || [];
          setRooms(content);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy dữ liệu phòng:", err);
        });
    }
  }, [id]);

  return (
    <div className={`${themeMode}`}>
      <div
        className="relative w-full h-[50vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1950&q=80)",
        }}
      >
        <div className="absolute w-full h-full bg-black opacity-50"></div>
        <h1 className="relative text-white text-3xl font-bold z-10">
          {locationMapping[+id] || "Địa điểm không xác định"}
        </h1>
      </div>

      <SelectForm isRoompage={false} handleSelectRoomByLocation={() => {}} />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Phòng tại khu vực này</h2>
          {renderList()}
        </div>
        <div>
          <iframe
            title="Google Maps"
            className="w-full h-full min-h-[400px] rounded-lg shadow-lg"
            src={`https://www.google.com/maps?q=${
              locationMapping[+id] || "Vietnam"
            }&output=embed`}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
