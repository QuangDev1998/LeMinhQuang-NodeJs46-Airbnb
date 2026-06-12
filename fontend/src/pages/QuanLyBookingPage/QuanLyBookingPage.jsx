import React from "react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ListBooking from "./ListBooking";
import { fetchListBookingAction } from "../../redux/thunks/quanLyBookingThunks";
import { setListBookingAction } from "../../redux/slices/quanLyBookingSlice";
import { bookingServices } from "../../services/bookingServices";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalEditQLBooking from "./ModalEditQLBooking";
import AdminHeader from "../../components/Admin/AdminHeader";

export default function QuanLyBookingPage() {
  const dispatch = useDispatch();
  const [valueInput, setvalueInput] = useState("");
  const searchRef = useRef(null);

  //  debounce tính năng search
  const handleChangeSearch = (e) => {
    let { value } = e.target;
    setvalueInput(value.trimStart());
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      fetchSearchBooking(value.trimStart());
    }, 1000);
  };
  const fetchSearchBooking = (keyword) => {
    // nếu thanh search trống trả về list booking mặc định
    if (keyword === "") {
      dispatch(fetchListBookingAction());
    }
    // nếu có gọi api search và set list booking theo data trả về
    else {
      bookingServices
        .searchBooking(keyword)
        .then((result) => {
          dispatch(setListBookingAction(result.data.content));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  return (
    <div className="space-y-5">
      <AdminHeader
        title="Quản lý booking"
        subtitle="Tra cứu và chỉnh sửa các đơn đặt phòng theo mã người dùng"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined className="text-gray-400" />}
          className="mb-4 max-w-md"
          placeholder="Nhập mã người dùng..."
          onChange={handleChangeSearch}
          value={valueInput}
        />
        <ListBooking
          fetchSearchBooking={fetchSearchBooking}
          valueInput={valueInput}
        />
      </div>

      <ModalEditQLBooking
        fetchSearchBooking={fetchSearchBooking}
        valueInput={valueInput}
      />
    </div>
  );
}
