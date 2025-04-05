import React, { useEffect, useState } from "react";
import { phongServices } from "../../services/phongServices";
import SelectForm from "../HomePage/SelectForm";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";

export default function RoomsPage() {
  const [phongArr, setPhongArr] = useState([]);
  const navigate = useNavigate();
  const { soLuongKhach } = useSelector((state) => state.bookingSlice);
  const { themeMode } = useSelector((state) => state.darkModeSlice);

  useEffect(() => {
    phongServices
      .getListPhong()
      .then((res) => {
        if (res.data.content.length > 0) {
          setPhongArr(res.data.content);
        } else {
          message.error("Không có dữ liệu phòng.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, []);
  const renderList = () => {
    let roomClone = phongArr.filter((phong) => phong.khach >= soLuongKhach);
    if (roomClone.length > 0) {
      return roomClone.map((phong) => (
        <div
          data-aos="zoom-in"
          key={phong.id}
          onClick={() => handleRoomClick(phong.id)}
          className="bg-white rounded-lg shadow-lg overflow-hidden border flex flex-col duration-300 cursor-pointer hover:shadow-2xl"
        >
          <div className="relative">
            <img
              src={phong.hinhAnh || "https://via.placeholder.com/300"}
              alt={phong.tenPhong}
              className="w-full h-52 object-cover"
            />
            <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded-lg shadow-md">
              Guest favorite
            </span>
          </div>

          <div className="p-4 flex flex-col justify-between flex-grow">
            <h3 className="font-semibold text-lg truncate text-black">
              {phong.tenPhong}
            </h3>

            <p className="text-black text-base font-semibold mt-3">
              ${phong.giaTien} / night
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {phong.khach} khách · {phong.phongNgu} phòng ngủ · {phong.giuong}{" "}
              giường · {phong.phongTam} phòng tắm
            </p>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="text-xl font-bold mb-4 text-primary ">
          Hiện Tại Không Có Phòng Với Số Lượng Khách Theo Yêu Cầu
        </div>
      );
    }
  };
  // Hàm xử lý click
  const handleRoomClick = (id) => {
    navigate(`/room-detail/${id}`);
  };

  const handleSelectRoomByLocation = async (id) => {
    const result = await phongServices.locationPhong(id);
    setPhongArr(result.data.content);
  };

  return (
    <div className={`${themeMode}`}>
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1520769945061-0a448c463865?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80&#39)",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        <div className="flex justify-center z-10">
          <h1 className="text-white text-2xl">Danh Sách Các Phòng Hiện Tại</h1>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-80"
          style={{
            backgroundImage: "linear-gradient(195deg,#4c4c4c,#191919)",
          }}
        ></div>
      </div>
      <SelectForm
        isRoompage={true}
        handleSelectRoomByLocation={handleSelectRoomByLocation}
      />
      <div className="container">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Danh sách phòng</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderList()}
          </div>
        </div>
      </div>
    </div>
  );
}
