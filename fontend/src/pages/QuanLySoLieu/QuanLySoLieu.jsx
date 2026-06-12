import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HomeOutlined,
  CalendarOutlined,
  StarFilled,
  DollarOutlined,
} from "@ant-design/icons";
import {
  fetchListBinhLuanAction,
  fetchListDatPhongAction,
  fetchListPhongAction,
} from "../../redux/thunks/quanLySoLieuThunks";
import { Chart as Chartjs } from "chart.js";
import GiaPhong from "./GiaPhong";
import Rating from "./Rating";
import RatingPercentage from "./RatingPercentage";
import DoanhThu from "./DoanhThu";
import TopPhong from "./TopPhong";
import AdminHeader from "../../components/Admin/AdminHeader";

// Màu chữ & lưới mặc định cho mọi biểu đồ (đọc được ở cả nền sáng/tối)
Chartjs.defaults.color = "#6b7280";
Chartjs.defaults.borderColor = "rgba(128,128,128,0.15)";

// Thẻ bọc biểu đồ
function ChartCard({ title, icon, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff385c]/10 text-[#ff385c]">
            {icon}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function QuanLySoLieu() {
  const dispatch = useDispatch();
  const { listPhong, listDatPhong, listRating, tongDoanhThu } = useSelector(
    (state) => state.quanLySoLieuSlice
  );

  useEffect(() => {
    dispatch(fetchListPhongAction());
    dispatch(fetchListBinhLuanAction());
    dispatch(fetchListDatPhongAction());
  }, []);

  const stats = [
    {
      icon: <HomeOutlined />,
      label: "Phòng",
      value: listPhong?.length || 0,
      tint: "bg-rose-50 text-rose-500",
    },
    {
      icon: <CalendarOutlined />,
      label: "Lượt đặt phòng",
      value: listDatPhong?.length || 0,
      tint: "bg-blue-50 text-blue-500",
    },
    {
      icon: <StarFilled />,
      label: "Đánh giá",
      value: listRating?.length || 0,
      tint: "bg-amber-50 text-amber-500",
    },
    {
      icon: <DollarOutlined />,
      label: "Doanh thu",
      value:
        tongDoanhThu != null
          ? `$${Number(tongDoanhThu).toLocaleString("en-US")}`
          : "—",
      tint: "bg-emerald-50 text-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Thống kê tổng quan"
        subtitle="Tổng hợp số liệu phòng, đặt phòng, đánh giá và doanh thu"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${s.tint}`}
            >
              {s.icon}
            </span>
            <div className="min-w-0">
              <p className="truncate text-2xl font-extrabold text-gray-900">
                {s.value}
              </p>
              <p className="truncate text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ hàng 1 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Tỉ lệ đánh giá theo sao" icon={<StarFilled />}>
          <RatingPercentage />
        </ChartCard>
        <ChartCard title="Số lượng đánh giá theo sao" icon={<StarFilled />}>
          <Rating />
        </ChartCard>
      </div>

      {/* Biểu đồ hàng 2 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Phân bố giá phòng / đêm" icon={<DollarOutlined />}>
          <GiaPhong />
        </ChartCard>
        <ChartCard title="Top phòng được đặt nhiều" icon={<HomeOutlined />}>
          <TopPhong />
        </ChartCard>
      </div>

      {/* Doanh thu (full width) */}
      <ChartCard title="Doanh thu theo thời gian" icon={<CalendarOutlined />}>
        <DoanhThu />
      </ChartCard>
    </div>
  );
}
