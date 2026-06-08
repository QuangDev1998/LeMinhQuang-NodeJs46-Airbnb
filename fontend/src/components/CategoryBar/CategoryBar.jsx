import React, { useEffect, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { phongServices } from "../../services/phongServices";

// Map tên loại chỗ ở -> icon FontAwesome
const ICONS = {
  "Tất cả": "fa-border-all",
  Phòng: "fa-bed",
  "Hồ bơi tuyệt vời": "fa-water-ladder",
  "Bãi biển": "fa-umbrella-beach",
  "Cabin gỗ": "fa-tree",
  "Trang trại": "fa-tractor",
  "Nhà nhỏ xinh": "fa-house",
  "Tuyệt tác kiến trúc": "fa-landmark",
  "Trên mặt nước": "fa-water",
  "Khung cảnh tuyệt vời": "fa-mountain",
  "Thành phố nổi tiếng": "fa-city",
};

const iconFor = (name) => ICONS[name] || "fa-house";

export default function CategoryBar({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);
  const scrollerRef = useRef(null);

  useEffect(() => {
    phongServices
      .getCategories()
      .then((res) => {
        const data = res.data?.content || [];
        setCategories([
          { loaiPhong: "Tất cả" },
          ...data.map((c) => ({ loaiPhong: c.loaiPhong })),
        ]);
      })
      .catch((err) => console.error("Lỗi lấy danh mục:", err));
  }, []);

  const scrollBy = (delta) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative border-b border-gray-200 bg-white">
      <div className="container relative">
        {/* nút cuộn trái */}
        <button
          onClick={() => scrollBy(-300)}
          className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition hover:scale-105 md:flex"
        >
          <LeftOutlined className="text-xs" />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-auto scroll-smooth py-4 md:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((c) => {
            const active = (selected || "Tất cả") === c.loaiPhong;
            return (
              <button
                key={c.loaiPhong}
                onClick={() => onSelect(c.loaiPhong)}
                className={`group flex min-w-fit flex-col items-center gap-2 border-b-2 pb-2 transition ${
                  active
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                <i className={`fa-solid ${iconFor(c.loaiPhong)} text-xl`} />
                <span className="whitespace-nowrap text-xs font-semibold">
                  {c.loaiPhong}
                </span>
              </button>
            );
          })}
        </div>

        {/* nút cuộn phải */}
        <button
          onClick={() => scrollBy(300)}
          className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition hover:scale-105 md:flex"
        >
          <RightOutlined className="text-xs" />
        </button>
      </div>
    </div>
  );
}
