import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  KeyOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CrownFilled,
} from "@ant-design/icons";
import winner from "../../assets/image/winner.png";

export default function InfoRoomLeft() {
  const { infoRoom, listComment } = useSelector(
    (state) => state.detailRoomSlice
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const rating = listComment?.length
    ? parseFloat(
        (
          listComment.reduce((s, c) => s + c.saoBinhLuan, 0) /
          listComment.length
        ).toFixed(2)
      )
    : 0;

  const moTa = infoRoom.moTa || "";
  const isLong = moTa.length > 220;

  const highlights = [
    {
      icon: <KeyOutlined />,
      title: "Tự nhận phòng",
      sub: "Tự nhận phòng bằng khoá thông minh.",
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Vị trí tuyệt vời",
      sub: "Khách gần đây đánh giá cao vị trí này.",
    },
    {
      icon: <CalendarOutlined />,
      title: "Miễn phí huỷ trong 48 giờ",
      sub: "Huỷ trong vòng 48 giờ để được hoàn tiền.",
    },
  ];

  return (
    <div className="basis-2/3 space-y-6 divide-y divide-gray-200">
      {/* Chủ nhà */}
      <div className="flex items-start justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Toàn bộ {infoRoom.loaiPhong?.toLowerCase() || "căn hộ"} · Chủ nhà
            Airbnb
          </h2>
          <p className="mt-1 text-gray-600">
            {infoRoom.khach} khách · {infoRoom.phongNgu} phòng ngủ ·{" "}
            {infoRoom.giuong} giường · {infoRoom.phongTam} phòng tắm
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ff385c] to-[#bd1e59] text-lg font-bold text-white">
            A
          </span>
          {rating >= 4 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#ff385c]">
              <CrownFilled /> Siêu chủ nhà
            </span>
          )}
        </div>
      </div>

      {/* Điểm nổi bật */}
      <div className="space-y-4 py-6">
        {highlights.map((h, i) => (
          <div className="flex items-start gap-4" key={i}>
            <span className="mt-0.5 text-xl text-gray-800">{h.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{h.title}</p>
              <p className="text-sm text-gray-500">{h.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Huy hiệu được yêu thích */}
      {rating >= 4 && (
        <div className="py-6">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5">
            <img src={winner} alt="winner" className="h-14 w-14" />
            <div>
              <p className="font-bold text-gray-900">
                Được khách yêu thích trên Airbnb
              </p>
              <p className="text-sm text-gray-500">
                Một trong những ngôi nhà được yêu thích nhất trên Airbnb dựa
                trên đánh giá, điểm xếp hạng và độ tin cậy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mô tả */}
      <div className="py-6">
        <p className="leading-relaxed text-gray-700">
          {isExpanded || !isLong ? moTa : `${moTa.slice(0, 220)}...`}
        </p>
        {isLong && (
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="mt-2 font-semibold text-gray-900 underline"
          >
            {isExpanded ? "Thu gọn" : "Hiển thị thêm"}
          </button>
        )}
      </div>
    </div>
  );
}
