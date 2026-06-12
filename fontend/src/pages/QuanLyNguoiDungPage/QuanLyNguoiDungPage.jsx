import React, { useRef, useState } from "react";
import { Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ListUser from "./ListUser";
import { setIsModalOpenAction } from "../../redux/slices/quanLyNguoiDungSlice";
import { useDispatch } from "react-redux";
import ModalQLNguoiDung from "./ModalQLNguoiDung";
import ModalEditQLNguoiDung from "./ModalEditQLNguoiDung";
import { fetchListUserAction } from "../../redux/thunks/quanLyNguoiDungThunks";
import AdminHeader from "../../components/Admin/AdminHeader";

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
    <div className="space-y-5">
      <AdminHeader
        title="Quản lý người dùng"
        subtitle="Thêm, tìm kiếm và chỉnh sửa tài khoản người dùng"
        action={
          <button
            onClick={() => dispatch(setIsModalOpenAction(true))}
            className="flex items-center gap-2 rounded-full bg-[#ff385c] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <PlusOutlined /> Thêm người dùng
          </button>
        }
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined className="text-gray-400" />}
          className="mb-4 max-w-md"
          placeholder="Tìm tên người dùng..."
          onChange={handleChangeSearch}
          value={valueInput}
        />
        <ListUser valueInput={valueInput} />
      </div>

      <ModalQLNguoiDung valueInput={valueInput} />
      <ModalEditQLNguoiDung valueInput={valueInput} />
    </div>
  );
}
