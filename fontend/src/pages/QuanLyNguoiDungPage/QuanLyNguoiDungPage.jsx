import React, { useRef, useState } from "react";
import { Input } from "antd";
import ListUser from "./ListUser";
import { setIsModalOpenAction } from "../../redux/slices/quanLyNguoiDungSlice";
import { useDispatch } from "react-redux";
import ModalQLNguoiDung from "./ModalQLNguoiDung";
import ModalEditQLNguoiDung from "./ModalEditQLNguoiDung";
import { fetchListUserAction } from "../../redux/thunks/quanLyNguoiDungThunks";

export default function QuanLyNguoiDungPage() {
  const [valueInput, setValueInput] = useState("");
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  //  debounce tính năng search
  const handleChangeSearch = (e) => {
    let { value } = e.target;
    setValueInput(value.trimStart());
    // nếu đã có input search => xóa setTimeout cũ / tạo setTimeout mới
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      dispatch(
        fetchListUserAction({ currentPage: 1, valueInput: value.trimStart() })
      );
    }, 1000);
  };

  return (
    <div>
      <div className="md:flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý User</h1>
        <button
          onClick={() => dispatch(setIsModalOpenAction(true))}
          className=" button-primary"
        >
          + Thêm người dùng mới
        </button>
      </div>
      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Tìm tên người dùng"
        onChange={handleChangeSearch}
        value={valueInput}
      />
      {/* list user */}
      <ListUser valueInput={valueInput} />
      {/* modal add */}
      <ModalQLNguoiDung valueInput={valueInput} />
      {/* modal edit */}
      <ModalEditQLNguoiDung valueInput={valueInput} />
    </div>
  );
}
