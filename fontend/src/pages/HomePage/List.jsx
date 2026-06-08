import React, { useEffect, useState } from "react";
import { viTriServices } from "../../services/viTriServices";
import { useNavigate } from "react-router-dom";

export default function List() {
  const [vitriArr, setVitriArr] = useState([]);
  const navigate = useNavigate();

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

  const renderVitriList = () => {
    if (vitriArr.length === 0) {
      return (
        <p className="col-span-full text-center text-gray-500">
          Không có dữ liệu hiển thị.
        </p>
      );
    }

    return vitriArr.map((vitri) => (
      <div
        key={vitri.id}
        onClick={() => handleNavigation(vitri.id)}
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 transition hover:shadow-airbnb"
      >
        <img
          src={vitri.hinh_anh}
          alt={vitri.ten_vi_tri}
          className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">
            {vitri.ten_vi_tri}
          </p>
          <p className="truncate text-sm text-gray-500">
            {vitri.tinh_thanh}, {vitri.quoc_gia}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div className="container py-10">
      <h2 className="mb-5 text-2xl font-bold">
        Khám phá những điểm đến gần đây
      </h2>
      <div
        id="listSection"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {renderVitriList()}
      </div>
    </div>
  );
}
