import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDetailRoomAction } from "../../redux/thunks/detailRoomThunks";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Image, Spin } from "antd";
import InfoRoomLeft from "./InfoRoomLeft";
import InfoRoomRight from "./InfoRoomRight";
import Comment from "./Comment";
import ModalCalendar from "./ModalCalendar";
import { checkIsBookedAction } from "../../redux/thunks/bookingThunks";

export default function RoomDetailPage() {
  const { infoRoom } = useSelector((state) => state.detailRoomSlice);
  const { listIdBooking } = useSelector((state) => state.bookingSlice);
  const dispatch = useDispatch();
  const params = useParams();
  const idRoom = params.id;
  const { themeMode } = useSelector((state) => state.darkModeSlice);

  useEffect(() => {
    if (idRoom) {
      dispatch(fetchDetailRoomAction(idRoom)).then((result) => {
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
          <div key={key}>
            {icon} {label}
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
      <div className="pt-28 space-y-5 container">
        <h1 className="text-2xl font-bold">{infoRoom.tenPhong}</h1>
        <div className="flex items-center gap-2">
          <EnvironmentOutlined />
          <a href="#">Việt Nam</a>
        </div>

        <div className="w-full">
          <Image src={infoRoom.hinhAnh} className="rounded-lg" width="100%" />
        </div>

        <div className="divide-y-2 space-y-5">
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:flex gap-5">
              <InfoRoomLeft />
              <InfoRoomRight />
            </div>

            <div>
              <h1 className="text-xl font-bold">Các tiện ích đi kèm</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderTienIch()}
              </div>
            </div>
          </div>

          <Comment idRoom={idRoom} />
        </div>

        <ModalCalendar />
      </div>
    </div>
  );
}
