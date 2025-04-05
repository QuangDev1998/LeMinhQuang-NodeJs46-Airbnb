import React from "react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ListBooking from "./ListBooking";
import { fetchListBookingAction } from "../../redux/thunks/quanLyBookingThunks";
import { setListBookingAction } from "../../redux/slices/quanLyBookingSlice";
import { bookingServices } from "../../services/bookingServices";
import { Input } from "antd";
import ModalEditQLBooking from "./ModalEditQLBooking";

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
    <div>
      <div className="flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý Booking</h1>
      </div>
      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Nhập mã người dùng..."
        onChange={handleChangeSearch}
        value={valueInput}
      />
      {/* list booking */}
      <ListBooking
        fetchSearchBooking={fetchSearchBooking}
        valueInput={valueInput}
      />
      {/* modal edit */}
      <ModalEditQLBooking
        fetchSearchBooking={fetchSearchBooking}
        valueInput={valueInput}
      />
    </div>
  );
}
