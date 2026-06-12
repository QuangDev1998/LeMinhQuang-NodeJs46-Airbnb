import { useRef, useState } from "react";
import { Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import ListViTri from "./ListViTri";
import { setIsModalOpenAction } from "../../redux/slices/quanLyViTriSlice";
import ModalQLViTri from "./ModalQLViTri";
import ModalEditQLViTri from "./ModalEditQLViTri";
import { fetchListViTriAction } from "../../redux/thunks/quanLyViTriThunks";
import AdminHeader from "../../components/Admin/AdminHeader";

export default function QuanLyViTriPage() {
  const [valueInput, setValueInput] = useState("");
  const searchRef = useRef(null);
  const dispatch = useDispatch();

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
        fetchListViTriAction({ currentPage: 1, valueInput: value.trimStart() })
      );
    }, 1000);
  };

  return (
    <div className="space-y-5">
      <AdminHeader
        title="Quản lý vị trí"
        subtitle="Thêm, tìm kiếm và chỉnh sửa các địa điểm cho thuê"
        action={
          <button
            onClick={() => dispatch(setIsModalOpenAction(true))}
            className="flex items-center gap-2 rounded-full bg-[#ff385c] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <PlusOutlined /> Thêm vị trí
          </button>
        }
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined className="text-gray-400" />}
          className="mb-4 max-w-md"
          placeholder="Tìm tên vị trí..."
          onChange={handleChangeSearch}
          value={valueInput}
        />
        <ListViTri valueInput={valueInput} />
      </div>

      <ModalQLViTri valueInput={valueInput} />
      <ModalEditQLViTri valueInput={valueInput} />
    </div>
  );
}
