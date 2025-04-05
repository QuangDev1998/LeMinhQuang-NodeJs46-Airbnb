import { useRef, useState } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import ListViTri from "./ListViTri";
import { setIsModalOpenAction } from "../../redux/slices/quanLyViTriSlice";
import ModalQLViTri from "./ModalQLViTri";
import ModalEditQLViTri from "./ModalEditQLViTri";
import { fetchListViTriAction } from "../../redux/thunks/quanLyViTriThunks";

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
    <div>
      <div className="md:flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý vị trí</h1>
        <button
          onClick={() => dispatch(setIsModalOpenAction(true))}
          className="button-primary"
        >
          + Thêm vị trí mới
        </button>
      </div>
      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Tìm tên vị trí"
        onChange={handleChangeSearch}
        value={valueInput}
      />
      {/* list vị trí */}
      <ListViTri valueInput={valueInput} />
      {/* modal add */}
      <ModalQLViTri valueInput={valueInput} />
      {/* modal edit */}
      <ModalEditQLViTri valueInput={valueInput} />
    </div>
  );
}
