import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { HeartFilled, HeartOutlined, StarFilled } from "@ant-design/icons";
import { toggleFavoriteAction } from "../../redux/slices/favoriteSlice";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-US");

/**
 * Card phòng theo phong cách Airbnb. Nút tim lưu vào BE (yêu thích).
 */
export default function RoomCard({ room, onClick, rating = 4.9, badge }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice.loginData?.user);
  const favoriteIds = useSelector((state) => state.favoriteSlice.favoriteIds);
  const liked = favoriteIds.includes(room.id);

  const handleHeart = (e) => {
    e.stopPropagation();
    if (!user) {
      dispatch(setModalContent("login"));
      dispatch(setIsModalOpen(true));
      message.warning("Đăng nhập để lưu phòng yêu thích");
      return;
    }
    dispatch(toggleFavoriteAction(room.id));
  };

  return (
    <div onClick={onClick} className="group cursor-pointer">
      {/* Ảnh */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <img
          src={room.hinhAnh || "https://via.placeholder.com/400"}
          alt={room.tenPhong}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow">
            {badge}
          </span>
        )}
        <button
          onClick={handleHeart}
          className="absolute right-3 top-3 text-2xl drop-shadow transition hover:scale-110"
          aria-label="Yêu thích"
        >
          {liked ? (
            <HeartFilled style={{ color: "#ff385c" }} />
          ) : (
            <HeartOutlined style={{ color: "white" }} />
          )}
        </button>
      </div>

      {/* Thông tin */}
      <div className="mt-3 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {room.tenPhong}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-gray-900">
            <StarFilled className="text-xs" />
            {rating}
          </span>
        </div>
        <p className="truncate text-sm text-gray-500">
          {room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường
        </p>
        <p className="pt-1 text-gray-900">
          <span className="font-semibold">${fmt(room.giaTien)}</span>
          <span className="text-gray-500"> / đêm</span>
        </p>
      </div>
    </div>
  );
}
