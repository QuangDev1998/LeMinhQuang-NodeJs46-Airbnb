import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { phongServices } from "../../services/phongServices";
import SelectForm from "../HomePage/SelectForm";
import { useSelector } from "react-redux";
import RoomCard from "../../components/RoomCard/RoomCard";

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

  const filteredRooms = rooms.filter((room) => room.khach >= soLuongKhach);
  const locationName = locationMapping[+id] || "Địa điểm không xác định";

  const renderList = () => {
    if (filteredRooms.length === 0) {
      return (
        <div className="py-10 text-lg font-semibold text-primary">
          Không có phòng phù hợp với số lượng khách yêu cầu.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        {filteredRooms.map((room, i) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={() => handleRoomClick(room.id)}
            rating={(4.5 + ((room.id % 5) * 0.1)).toFixed(2)}
            badge={i % 4 === 0 ? "Được khách yêu thích" : null}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`${themeMode} pt-24`}>
      <SelectForm isRoompage={false} handleSelectRoomByLocation={() => {}} />

      <div className="container pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h1 className="mb-1 text-2xl font-bold">
              Chỗ ở tại {locationName}
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              {filteredRooms.length} chỗ ở · Có thể đặt ngay
            </p>
            {renderList()}
          </div>
          <div className="hidden lg:block">
            <iframe
              title="Google Maps"
              className="sticky top-28 h-[600px] w-full rounded-2xl shadow-airbnb"
              src={`https://www.google.com/maps?q=${locationName}&output=embed`}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
