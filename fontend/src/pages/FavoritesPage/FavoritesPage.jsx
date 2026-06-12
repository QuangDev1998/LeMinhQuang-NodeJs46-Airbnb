import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { favoriteServices } from "../../services/favoriteServices";
import RoomCard from "../../components/RoomCard/RoomCard";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userSlice.loginData?.user);
  const favoriteIds = useSelector((state) => state.favoriteSlice.favoriteIds);
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải lại danh sách mỗi khi đăng nhập hoặc danh sách yêu thích đổi
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    favoriteServices
      .getMyFavorites()
      .then((res) => setRooms(res.data?.content || []))
      .catch(() => message.error("Không tải được danh sách yêu thích"))
      .finally(() => setLoading(false));
  }, [user, favoriteIds]);

  if (!user) {
    return (
      <div className={`${themeMode} pt-36 pb-20 md:pt-32`}>
        <div className="container text-center">
          <HeartOutlined className="text-5xl text-[#ff385c]" />
          <h1 className="mt-4 text-2xl font-bold">Danh sách yêu thích</h1>
          <p className="mt-2 text-gray-500">
            Đăng nhập để lưu và xem những phòng bạn yêu thích.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeMode} pt-36 pb-16 md:pt-28`}>
      <div className="container">
        <h1 className="mb-2 text-3xl font-bold">Danh sách yêu thích</h1>
        <p className="mb-6 text-gray-500">
          {rooms.length} phòng đã lưu
        </p>

        {loading ? (
          <p className="py-10 text-center text-gray-500">Đang tải...</p>
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 py-16 text-center">
            <HeartOutlined className="text-4xl text-gray-300" />
            <p className="mt-4 font-semibold text-gray-700">
              Bạn chưa lưu phòng nào
            </p>
            <p className="mt-1 text-gray-500">
              Bấm vào biểu tượng trái tim trên mỗi phòng để lưu lại.
            </p>
            <button
              onClick={() => navigate("/rooms")}
              className="button-primary mt-5"
            >
              Khám phá phòng
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => navigate(`/room-detail/${room.id}`)}
                rating={(4.5 + ((room.id % 5) * 0.1)).toFixed(2)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
