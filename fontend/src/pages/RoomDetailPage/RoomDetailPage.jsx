import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDetailRoomAction } from "../../redux/thunks/detailRoomThunks";
import {
  EnvironmentOutlined,
  StarFilled,
  ShareAltOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Image, Spin } from "antd";
import InfoRoomLeft from "./InfoRoomLeft";
import InfoRoomRight from "./InfoRoomRight";
import Comment from "./Comment";
import ModalCalendar from "./ModalCalendar";
import { checkIsBookedAction } from "../../redux/thunks/bookingThunks";

export default function RoomDetailPage() {
  const { infoRoom, listComment } = useSelector(
    (state) => state.detailRoomSlice
  );
  const { listIdBooking } = useSelector((state) => state.bookingSlice);
  const dispatch = useDispatch();
  const params = useParams();
  const idRoom = params.id;
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  useEffect(() => {
    if (idRoom) {
      const numericIdRoom = Number(idRoom); // 👈 chuyển idRoom sang số
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

  const renderTienIch = () => {
    const tienIchMapping = {
      mayGiat: { label: "Máy giặt", icon: <i className="fa fa-water" /> },
      banLa: { label: "Bàn là", icon: <i className="fa fa-tshirt" /> },
      tivi: { label: "Tivi", icon: <i className="fa fa-desktop" /> },
      dieuHoa: {
        label: "Điều hòa",
        icon: <i className="fa fa-temperature-low" />,
      },
      wifi: { label: "Wifi", icon: <i className="fa fa-wifi" /> },
      bep: { label: "Bếp", icon: <i className="fa fa-utensils" /> },
      doXe: { label: "Bãi đỗ xe", icon: <i className="fa fa-car-side" /> },
      hoBoi: { label: "Hồ bơi", icon: <i className="fa fa-swimming-pool" /> },
      baiUi: { label: "Bàn ủi", icon: <i className="fa fa-water" /> },
    };

    return Object.entries(tienIchMapping).map(([key, { label, icon }]) => {
      if (infoRoom?.[key]) {
        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition hover:border-rose-300 hover:shadow-sm"
          >
            <span className="text-lg text-rose-500">{icon}</span>
            <span className="font-medium">{label}</span>
          </div>
        );
      }
      return null;
    });
  };
  // Check loading
  const isLoading = !infoRoom || Object.keys(infoRoom).length === 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải chi tiết phòng..." />
      </div>
    );
  }

  return (
    <div className={`${themeMode}`}>
      <div className="container space-y-6 pt-28 pb-16">
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
              <span className="underline">{listComment?.length || 0} đánh giá</span>
              <span className="text-gray-400">·</span>
              <span className="flex items-center gap-1">
                <EnvironmentOutlined /> Việt Nam
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium underline transition hover:bg-gray-100">
                <ShareAltOutlined /> Chia sẻ
              </button>
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium underline transition hover:bg-gray-100">
                <HeartOutlined /> Lưu
              </button>
            </div>
          </div>
        </div>

        {/* Gallery ảnh kiểu Airbnb */}
        {(() => {
          const gallery = (
            infoRoom.danhSachAnh?.length
              ? infoRoom.danhSachAnh
              : [infoRoom.hinhAnh]
          ).slice(0, 5);
          return (
            <Image.PreviewGroup>
              <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:h-[460px]">
                <div className="col-span-4 row-span-2 h-full md:col-span-2">
                  <Image
                    src={gallery[0]}
                    width="100%"
                    height="100%"
                    className="object-cover"
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
                      className="object-cover"
                      style={{ height: "100%", objectFit: "cover" }}
                      rootClassName="h-full w-full"
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          );
        })()}

        {/* Nội dung + widget đặt phòng */}
        <div className="grid grid-cols-1 gap-8 lg:flex lg:gap-10">
          <InfoRoomLeft />
          <InfoRoomRight />
        </div>

        {/* Tiện ích */}
        <div className="space-y-4 border-t pt-8">
          <h2 className="text-xl font-bold">Các tiện ích đi kèm</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {renderTienIch()}
          </div>
        </div>

        {/* Bình luận */}
        <div className="border-t pt-8">
          <Comment idRoom={idRoom} />
        </div>

        <ModalCalendar />
      </div>
    </div>
  );
}
