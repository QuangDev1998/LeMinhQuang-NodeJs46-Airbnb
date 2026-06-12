import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  KeyOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CrownFilled,
} from "@ant-design/icons";

// Một nhánh lá nguyệt quế (kiểu huy hiệu "Khách yêu thích" của Airbnb).
// flip=true để lật thành nhánh đối xứng bên kia.
function Laurel({ flip }) {
  // hình 1 chiếc lá (hướng sang phải)
  const leaf = "M0 0 C 5 -4.5, 13 -4.5, 17 0 C 13 4.5, 5 4.5, 0 0 Z";
  // vị trí + góc xoay của từng lá dọc theo cành cong
  const leaves = [
    [40, 106, -118],
    [34, 94, -112],
    [29, 82, -106],
    [26, 70, -100],
    [25, 58, -94],
    [27, 46, -86],
    [31, 34, -78],
    [37, 23, -70],
    [44, 14, -62],
  ];
  return (
    <svg
      viewBox="0 0 60 120"
      className={`h-24 w-auto text-gray-900 ${flip ? "-scale-x-100" : ""}`}
      fill="currentColor"
    >
      <path
        d="M47 114 C 32 96 22 60 40 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r], i) => (
        <path key={i} d={leaf} transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
    </svg>
  );
}

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

      {/* Huy hiệu "Khách yêu thích" kiểu Airbnb (2 nhánh lá nguyệt quế ôm điểm) */}
      {rating >= 4 && (
        <div className="py-6">
          <div className="flex flex-col items-center rounded-2xl border border-gray-200 px-4 py-6">
            <div className="flex items-center justify-center gap-1">
              <Laurel flip />
              <span className="text-5xl font-extrabold leading-none text-gray-900">
                {rating}
              </span>
              <Laurel />
            </div>
            <p className="mt-3 text-lg font-bold text-gray-900">
              Được khách yêu thích
            </p>
            <p className="mt-1 max-w-md text-center text-sm text-gray-500">
              Một trong những ngôi nhà được yêu thích nhất trên Airbnb dựa trên
              đánh giá, điểm xếp hạng và độ tin cậy.
            </p>
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
