import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { viTriServices } from "../../services/viTriServices";
import { useNavigate } from "react-router-dom";

export default function List() {
  const [vitriArr, setVitriArr] = useState([]);
  const navigate = useNavigate();

  // Lấy dữ liệu từ API
  useEffect(() => {
    viTriServices
      .findViTri("", 1, 8)
      .then((res) => {
        const data = res.data?.content?.data || [];
        setVitriArr(data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, []);

  const handleNavigation = (id) => {
    navigate(`/rooms/${id}`);
  };

  // Render danh sách các vị trí
  const renderVitriList = () => {
    if (vitriArr.length === 0) {
      return (
        <p className="text-center text-gray-500">Không có dữ liệu hiển thị.</p>
      );
    }

    return vitriArr.map((vitri) => (
      <Card
        key={vitri.id}
        hoverable
        onClick={() => handleNavigation(vitri.id)}
        className="flex flex-row items-center gap-0 rounded-lg shadow-md p-2 bg-white cursor-pointer"
      >
        <div className="flex gap-3 items-center">
          {/* Hình ảnh */}
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={vitri.hinh_anh}
              alt={vitri.ten_vi_tri}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Thông tin */}
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-black">{vitri.ten_vi_tri}</p>
            <p className="text-sm text-gray-500">
              {vitri.tinh_thanh}, {vitri.quoc_gia}
            </p>
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-xl font-bold mb-4">Khám phá địa điểm</h2>
      <div
        id="listSection"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {renderVitriList()}
      </div>
    </div>
  );
}
