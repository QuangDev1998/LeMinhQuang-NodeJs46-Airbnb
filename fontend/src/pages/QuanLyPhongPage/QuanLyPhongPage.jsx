import React, { useRef, useState } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import ListPhong from "./ListPhong";
import { fetchListPhongAction } from "../../redux/thunks/quanLyPhongThunks";
import { setIsModalOpenAction } from "../../redux/slices/quanLyPhongSlice";
import ModalQLPhong from "./ModalQLPhong";
import ModalEditQLPhong from "./ModalEditQLPhong";

export default function QuanLyPhongPage() {
  const [valueInput, setValueInput] = useState("");
  const searchRef = useRef(null);
  const dispatch = useDispatch();

  // debounce tính năng search
  const handleChangeSearch = (e) => {
    let { value } = e.target;
    setValueInput(value.trimStart());
    // nếu đã có input search => xóa setTimeout cũ / tạo setTimeout mới
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      dispatch(
        fetchListPhongAction({ currentPage: 1, valueInput: value.trimStart() })
      );
    }, 1000);
  };

  return (
    <div>
      <div className="md:flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý phòng</h1>
        <button
          onClick={() => dispatch(setIsModalOpenAction(true))}
          className="button-primary"
        >
          + Thêm phòng mới
        </button>
      </div>
      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Tìm tên phòng"
        onChange={handleChangeSearch}
        value={valueInput}
      />
      {/* list phòng */}
      <ListPhong valueInput={valueInput} />
      {/* modal add */}
      <ModalQLPhong valueInput={valueInput} />
      {/* modal edit */}
      <ModalEditQLPhong valueInput={valueInput} />
    </div>
  );
}
