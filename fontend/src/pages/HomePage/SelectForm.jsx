import React, { useState, useEffect } from "react";
import { Button, message, Popover } from "antd";
import { SearchOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import dayjs from "dayjs";
import { viTriServices } from "../../services/viTriServices";
import {
  setNgayDen,
  setNgayDi,
  setSoLuongKhach,
  setTotalDay,
} from "../../redux/slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { vi } from "date-fns/locale";
import { addDays } from "date-fns";

export default function SelectForm({ isRoompage, handleSelectRoomByLocation }) {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const [locations, setLocations] = useState([]);
  const [openLocation, setOpenLocation] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ngayDen, ngayDi, soLuongKhach } = useSelector(
    (state) => state.bookingSlice
  );

  const [dateRange, setDateRange] = useState([
    {
      startDate: ngayDen,
      endDate: ngayDi,
      key: "selection",
    },
  ]);

  useEffect(() => {
    viTriServices
      .findViTri("", 1, 100)
      .then((res) => {
        const data = res.data?.content?.data || [];
        const filtered = data.map((item) => ({
          id: item.id,
          hinhAnh: item.hinh_anh,
          tenViTri: item.ten_vi_tri,
          tinhThanh: item.tinh_thanh,
        }));
        setLocations(filtered);
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
    let { startDate, endDate } = item.selection;
    dispatch(setNgayDen(startDate));
    dispatch(setNgayDi(endDate));
    let days = Math.round((endDate - startDate) / (1000 * 3600 * 24));
    dispatch(setTotalDay(days));
  };

  const handleSearch = () => {
    if (selectedLocationId === null) {
      if (window.location.pathname === "/") {
        navigate("/rooms");
        return;
      }

      if (window.location.pathname.startsWith("/rooms")) {
        message.warning("Vui lòng chọn địa điểm trước khi tìm kiếm!");
        return;
      }
    }

    navigate(`/rooms/${selectedLocationId}`);
  };

  const handleSelectLocation = (id) => {
    if (id === null) {
      setSelectedLocationId(null);
      setOpenLocation(false);
      return;
    }

    setSelectedLocationId(id);

    if (isRoompage) {
      handleSelectRoomByLocation(id);
    }

    setOpenLocation(false);
  };

  const locationContent = (
    <div className="p-4">
      <p className="font-bold text-lg mb-2">Tìm kiếm địa điểm</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${
            selectedLocationId === null ? "opacity-50" : ""
          }`}
          onClick={() => handleSelectLocation(null)}
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300">
            <span className="text-gray-500 font-medium">None</span>
          </div>
          <p className="mt-2 text-sm font-medium">None</p>
        </div>

        {locations.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              selectedLocationId === item.id ? "opacity-50" : ""
            }`}
            onClick={() => handleSelectLocation(item.id)}
          >
            <img
              src={item.hinhAnh}
              alt={item.tenViTri}
              className="w-16 h-16 object-cover rounded-md shadow-sm"
            />
            <p className="mt-2 text-sm font-medium">{item.tinhThanh}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const guestContent = (
    <div className="flex items-center justify-between w-40 p-2">
      <p className="text-gray-800 font-medium">Khách</p>
      <div className="flex items-center gap-2">
        <Button
          shape="circle"
          icon={<MinusOutlined />}
          size="small"
          disabled={soLuongKhach <= 1}
          onClick={() => dispatch(setSoLuongKhach(soLuongKhach - 1))}
        />
        <span className="font-semibold">{soLuongKhach}</span>
        <Button
          shape="circle"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => dispatch(setSoLuongKhach(soLuongKhach + 1))}
        />
      </div>
    </div>
  );

  const dateContent = (
    <div className="p-4">
      <DateRange
        className="w-full"
        ranges={dateRange}
        onChange={handleDateChange}
        months={1}
        minDate={new Date()}
        rangeColors={["rgb(254, 107, 110)"]}
        locale={vi}
        maxDate={addDays(new Date(), 180)}
      />
    </div>
  );

  const selectedLocationName =
    locations.find((loc) => loc.id === selectedLocationId)?.tinhThanh ||
    "Chọn địa điểm";

  return (
    <div className={`${themeMode} mt-16 mb-10 px-2`}>
      <div className="container w-full bg-white border rounded-lg md:rounded-full shadow-sm py-2 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
        <Popover
          content={locationContent}
          trigger="click"
          placement="bottom"
          open={openLocation}
          onOpenChange={(visible) => setOpenLocation(visible)}
        >
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">Địa điểm</p>
            <span className="text-black text-lg sm:text-xl">
              {selectedLocationName}
            </span>
          </div>
        </Popover>

        <Popover content={dateContent} trigger="click" placement="bottom">
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Thời gian
            </p>
            <span className="text-gray-800 text-base sm:text-lg">
              {dayjs(dateRange[0].startDate).format("DD/MM/YYYY")} -{" "}
              {dayjs(dateRange[0].endDate).format("DD/MM/YYYY")}
            </span>
          </div>
        </Popover>

        <div className="flex items-center justify-center text-center px-4">
          <Popover content={guestContent} trigger="click" placement="bottom">
            <div className="flex items-center cursor-pointer">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Thêm khách
                </p>
                <span className="text-gray-800 text-base sm:text-lg">
                  {soLuongKhach} khách
                </span>
              </div>
              <div className="ml-10">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}
