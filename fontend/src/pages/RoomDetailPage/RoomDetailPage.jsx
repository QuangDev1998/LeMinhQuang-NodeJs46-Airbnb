import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDetailRoomAction } from "../../redux/thunks/detailRoomThunks";
import {
  EnvironmentOutlined,
  StarFilled,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  SafetyOutlined,
  KeyOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Image, Spin, message } from "antd";
import InfoRoomLeft from "./InfoRoomLeft";
import InfoRoomRight from "./InfoRoomRight";
import Comment from "./Comment";
import ModalCalendar from "./ModalCalendar";
import { checkIsBookedAction } from "../../redux/thunks/bookingThunks";
import { toggleFavoriteAction } from "../../redux/slices/favoriteSlice";
import { setIsModalOpen, setModalContent } from "../../redux/slices/userSlice";

const CITY_BY_ID = {
  1: "Hồ Chí Minh",
  2: "Cần Thơ",
  3: "Nha Trang",
  4: "Hà Nội",
  5: "Phú Quốc",
  6: "Đà Nẵng",
  7: "Đà Lạt",
  8: "Phan Thiết",
};

export default function RoomDetailPage() {
  const { infoRoom, listComment } = useSelector(
    (state) => state.detailRoomSlice
  );
  const { listIdBooking } = useSelector((state) => state.bookingSlice);
  const user = useSelector((state) => state.userSlice.loginData?.user);
  const favoriteIds = useSelector((state) => state.favoriteSlice.favoriteIds);
  const dispatch = useDispatch();
  const params = useParams();
  const idRoom = params.id;
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const liked = favoriteIds.includes(infoRoom?.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: infoRoom?.tenPhong, url: window.location.href })
        .catch(() => {});
      return;
    }
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => message.success("Đã sao chép liên kết phòng"))
      .catch(() => message.info(window.location.href));
  };

  const handleSave = () => {
    if (!user) {
      dispatch(setModalContent("login"));
      dispatch(setIsModalOpen(true));
      message.warning("Đăng nhập để lưu phòng yêu thích");
      return;
    }
    dispatch(toggleFavoriteAction(infoRoom.id));
  };

  useEffect(() => {
    if (idRoom) {
      const numericIdRoom = Number(idRoom);
      dispatch(fetchDetailRoomAction(numericIdRoom)).then((result) => {
        const roomId = result?.payload?.id;
        if (roomId) {
          dispatch(checkIsBookedAction({ listIdBooking, idRoom: roomId }));
        }
      });
    }
  }, [idRoom]);

  useEffect(() => {
    if (infoRoom?.id) {
      dispatch(checkIsBookedAction({ listIdBooking, idRoom: infoRoom.id }));
    }
  }, [listIdBooking, infoRoom]);

  const rating = listComment?.length
    ? parseFloat(
        (
          listComment.reduce((acc, c) => acc + c.saoBinhLuan, 0) /
          listComment.length
        ).toFixed(2)
      )
    : 0;

  const cityName = CITY_BY_ID[infoRoom?.viTriId] || "Việt Nam";

  const renderTienIch = () => {
    const tienIchMapping = {
      wifi: { label: "Wifi", icon: "fa-wifi" },
      bep: { label: "Bếp", icon: "fa-utensils" },
      mayGiat: { label: "Máy giặt", icon: "fa-soap" },
      dieuHoa: { label: "Điều hòa", icon: "fa-temperature-low" },
      tivi: { label: "Tivi", icon: "fa-tv" },
      banLa: { label: "Bàn là", icon: "fa-shirt" },
      banUi: { label: "Bàn ủi", icon: "fa-fire" },
      doXe: { label: "Bãi đỗ xe", icon: "fa-car-side" },
      hoBoi: { label: "Hồ bơi", icon: "fa-person-swimming" },
    };

    return Object.entries(tienIchMapping).map(([key, { label, icon }]) => (
      <div
        key={key}
        className={`flex items-center gap-4 py-3 ${
          infoRoom?.[key] ? "" : "text-gray-400 line-through"
        }`}
      >
        <i className={`fa-solid ${icon} w-6 text-center text-xl`} />
        <span className="font-medium">{label}</span>
      </div>
    ));
  };

  // Điểm đánh giá theo hạng mục (suy ra quanh điểm tổng để hiển thị trực quan)
  const ratingCategories = [
    { label: "Mức độ sạch sẽ", delta: 0.1 },
    { label: "Độ chính xác", delta: 0.0 },
    { label: "Nhận phòng", delta: 0.15 },
    { label: "Giao tiếp", delta: 0.05 },
    { label: "Vị trí", delta: -0.05 },
    { label: "Giá trị", delta: -0.1 },
  ].map((c) => ({
    label: c.label,
    value: Math.max(0, Math.min(5, rating ? rating + c.delta : 0)),
  }));

  const isLoading = !infoRoom || Object.keys(infoRoom).length === 0;
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" tip="Đang tải chi tiết phòng..." />
      </div>
    );
  }

  const gallery = (
    infoRoom.danhSachAnh?.length ? infoRoom.danhSachAnh : [infoRoom.hinhAnh]
  ).slice(0, 5);

  return (
    <div className={`${themeMode}`}>
      <div className="container space-y-6 pt-36 pb-16 md:pt-28">
        {/* Tiêu đề + hành động */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold md:text-3xl">
            {infoRoom.tenPhong}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-1 font-semibold">
                <StarFilled style={{ color: "rgb(254,107,110)" }} />
                {rating}
              </span>
              <span className="text-gray-400">·</span>
              <span className="underline">
                {listComment?.length || 0} đánh giá
              </span>
              <span className="text-gray-400">·</span>
              <span className="flex items-center gap-1">
                <EnvironmentOutlined /> {cityName}, Việt Nam
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium underline transition hover:bg-gray-100"
              >
                <ShareAltOutlined /> Chia sẻ
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium underline transition hover:bg-gray-100"
              >
                {liked ? (
                  <HeartFilled style={{ color: "#ff385c" }} />
                ) : (
                  <HeartOutlined />
                )}{" "}
                {liked ? "Đã lưu" : "Lưu"}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery ảnh kiểu Airbnb */}
        <Image.PreviewGroup>
          <div className="grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:h-[460px]">
            <div className="col-span-4 row-span-2 h-full md:col-span-2">
              <Image
                src={gallery[0]}
                width="100%"
                height="100%"
                style={{ height: "100%", objectFit: "cover" }}
                rootClassName="h-full w-full"
              />
            </div>
            {gallery.slice(1, 5).map((src, idx) => (
              <div key={idx} className="hidden h-full md:block">
                <Image
                  src={src}
                  width="100%"
                  height="100%"
                  style={{ height: "100%", objectFit: "cover" }}
                  rootClassName="h-full w-full"
                />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>

        {/* Thanh điều hướng dính (desktop) */}
        <nav className="sticky top-[84px] z-20 -mx-1 hidden border-b border-gray-200 bg-white/90 px-1 backdrop-blur md:block">
          <div className="flex gap-8 text-sm font-semibold text-gray-600">
            {[
              ["#amenities", "Tiện nghi"],
              ["#reviews", "Đánh giá"],
              ["#location", "Vị trí"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="border-b-2 border-transparent py-4 transition hover:border-gray-800 hover:text-gray-900"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* Nội dung + widget đặt phòng */}
        <div className="grid grid-cols-1 gap-8 lg:flex lg:gap-10">
          <InfoRoomLeft />
          <InfoRoomRight />
        </div>

        {/* Tiện nghi */}
        <div id="amenities" className="scroll-mt-28 border-t pt-8">
          <h2 className="mb-4 text-xl font-bold md:text-2xl">
            Nơi này có những gì cho bạn
          </h2>
          <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {renderTienIch()}
          </div>
        </div>

        {/* Đánh giá: điểm tổng + breakdown + danh sách */}
        <div id="reviews" className="scroll-mt-28 border-t pt-8">
          <h2 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
            <StarFilled style={{ color: "rgb(254,107,110)" }} />
            {rating} · {listComment?.length || 0} đánh giá
          </h2>

          {listComment?.length > 0 && (
            <div className="mt-6 grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {ratingCategories.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm text-gray-700">
                    {c.label}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gray-800"
                      style={{ width: `${(c.value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-gray-800">
                    {c.value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            <Comment idRoom={idRoom} />
          </div>
        </div>

        {/* Vị trí + bản đồ */}
        <div id="location" className="scroll-mt-28 border-t pt-8">
          <h2 className="mb-1 text-xl font-bold md:text-2xl">Bạn sẽ ở đây</h2>
          <p className="mb-4 text-gray-500">
            <EnvironmentOutlined className="mr-1" />
            {cityName}, Việt Nam
          </p>
          <iframe
            title="Bản đồ vị trí"
            className="h-[300px] w-full rounded-2xl border border-gray-200 md:h-[420px]"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              cityName + ", Việt Nam"
            )}&output=embed`}
          />
        </div>

        {/* Điều cần biết */}
        <div className="grid gap-8 border-t pt-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-bold">
              <CalendarOutlined /> Nội quy nhà
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>Nhận phòng sau 14:00</li>
              <li>Trả phòng trước 12:00</li>
              <li>Tối đa {infoRoom.khach} khách</li>
              <li>Không tổ chức tiệc / sự kiện</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-bold">
              <SafetyOutlined /> An toàn & chỗ ở
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>Có máy phát hiện khói</li>
              <li>Có bình chữa cháy</li>
              <li>Camera an ninh ngoài trời</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-bold">
              <KeyOutlined /> Chính sách hủy
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>Miễn phí hủy trong 48 giờ</li>
              <li>Hoàn tiền một phần trước 7 ngày</li>
              <li>Xem chi tiết khi đặt phòng</li>
            </ul>
          </div>
        </div>

        <ModalCalendar />
      </div>
    </div>
  );
}
