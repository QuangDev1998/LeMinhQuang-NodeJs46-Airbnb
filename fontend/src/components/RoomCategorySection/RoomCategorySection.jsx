import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { phongServices } from "../../services/phongServices";
import CategoryBar from "../CategoryBar/CategoryBar";
import RoomCard from "../RoomCard/RoomCard";

/**
 * Khối duyệt phòng theo danh mục (CategoryBar + lưới RoomCard) - dùng ở trang chủ.
 */
export default function RoomCategorySection() {
  const navigate = useNavigate();
  const { soLuongKhach } = useSelector((state) => state.bookingSlice);
  const [category, setCategory] = useState("Tất cả");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    phongServices
      .getListPhongByCategory(category)
      .then((res) => setRooms(res.data?.content || []))
      .catch((err) => console.error("Lỗi lấy phòng:", err))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = rooms.filter((r) => r.khach >= soLuongKhach);

  return (
    <div>
      <CategoryBar selected={category} onSelect={setCategory} />

      <div className="container py-8">
        <h2 className="mb-6 text-2xl font-bold">
          {category === "Tất cả" ? "Chỗ ở nổi bật" : category}
        </h2>

        {loading ? (
          <p className="py-10 text-center text-gray-500">Đang tải phòng...</p>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            Không có phòng phù hợp.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((room, i) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => navigate(`/room-detail/${room.id}`)}
                rating={(4.5 + ((room.id % 5) * 0.1)).toFixed(2)}
                badge={i % 5 === 0 ? "Được khách yêu thích" : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
