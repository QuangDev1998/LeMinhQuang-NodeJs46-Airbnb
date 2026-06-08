import React, { useEffect, useState } from "react";
import { phongServices } from "../../services/phongServices";
import SelectForm from "../HomePage/SelectForm";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";
import RoomCard from "../../components/RoomCard/RoomCard";
import CategoryBar from "../../components/CategoryBar/CategoryBar";

export default function RoomsPage() {
  const [phongArr, setPhongArr] = useState([]);
  const [category, setCategory] = useState("Tất cả");
  const navigate = useNavigate();
  const { soLuongKhach } = useSelector((state) => state.bookingSlice);
  const { themeMode } = useSelector((state) => state.darkModeSlice);

  // Lấy phòng theo danh mục (mặc định: tất cả)
  useEffect(() => {
    phongServices
      .getListPhongByCategory(category)
      .then((res) => {
        const data = res.data?.content || [];
        if (data.length === 0 && category === "Tất cả") {
          message.error("Không có dữ liệu phòng.");
        }
        setPhongArr(data);
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, [category]);

  const handleRoomClick = (id) => {
    navigate(`/room-detail/${id}`);
  };

  // SelectForm chọn theo địa điểm -> ghi đè danh sách
  const handleSelectRoomByLocation = async (id) => {
    const result = await phongServices.locationPhong(id);
    setPhongArr(result.data.content);
    setCategory("Tất cả");
  };

  const renderList = () => {
    const roomClone = phongArr.filter((phong) => phong.khach >= soLuongKhach);
    if (roomClone.length === 0) {
      return (
        <div className="col-span-full py-10 text-center text-lg font-semibold text-primary">
          Hiện tại không có phòng phù hợp với số lượng khách yêu cầu.
        </div>
      );
    }
    return roomClone.map((phong, i) => (
      <div data-aos="zoom-in" key={phong.id}>
        <RoomCard
          room={phong}
          onClick={() => handleRoomClick(phong.id)}
          rating={(4.5 + ((phong.id % 5) * 0.1)).toFixed(2)}
          badge={i % 4 === 0 ? "Được khách yêu thích" : null}
        />
      </div>
    ));
  };

  return (
    <div className={`${themeMode} pt-24`}>
      <SelectForm
        isRoompage={true}
        handleSelectRoomByLocation={handleSelectRoomByLocation}
      />
      <CategoryBar selected={category} onSelect={setCategory} />
      <div className="container py-8 pb-16">
        <h1 className="mb-6 text-2xl font-bold">
          {category === "Tất cả" ? "Chỗ ở tại Việt Nam" : category} ·{" "}
          {phongArr.length} căn
        </h1>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {renderList()}
        </div>
      </div>
    </div>
  );
}
