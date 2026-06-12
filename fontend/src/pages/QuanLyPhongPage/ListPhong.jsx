import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Popconfirm, Popover, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  fetchListPhongAction,
  fetchPhongInfoAction,
} from "../../redux/thunks/quanLyPhongThunks";
import { phongServices } from "../../services/phongServices";
import {
  setCurrentPageAction,
  setIsModalEditOpenAction,
} from "../../redux/slices/quanLyPhongSlice";
import { viTriServices } from "../../services/viTriServices";
import { setListViTriAction } from "../../redux/slices/quanLyViTriSlice";

export default function ListPhong({ valueInput }) {
  const { token } = useSelector((state) => state.userSlice.loginData);
  const { listPhong, totalRow, currentPage } = useSelector(
    (state) => state.quanLyPhongSlice
  );
  const { listViTri } = useSelector((state) => state.quanLyViTriSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchListPhongAction({ currentPage, valueInput }));
    viTriServices
      .getListViTri()
      .then((result) => {
        dispatch(setListViTriAction(result.data.content));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handlePageChange = (pageIndex, pageSize) => {
    dispatch(setCurrentPageAction(pageIndex));
    dispatch(fetchListPhongAction({ currentPage: pageIndex, valueInput }));
  };

  // Table data
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên phòng",
      dataIndex: "tenPhong",
      key: "tenPhong",
      render: (_, dataObject) => {
        return (
          <div className="md:flex items-center">
            <img
              src={dataObject.hinhAnh}
              alt="avatar"
              className="mr-2 w-36 h-16 object-cover"
            />
            <p>{dataObject.tenPhong}</p>
          </div>
        );
      },
    },
    {
      title: "Tỉnh thành",
      dataIndex: "tinhThanh",
      key: "tinhThanh",
    },
    {
      title: "Thông tin",
      dataIndex: "moTa",
      key: "moTa",
      render: (_, dataObject) => {
        const content = <p>{dataObject.moTa}</p>;
        return (
          <Popover content={content} title="Chi tiết">
            <p className="cursor-pointer underline">Chi tiết</p>
          </Popover>
        );
      },
    },
    {
      title: "Thao tác",
      fixed: "right",
      key: "action",
      render: (_, dataObject) => {
        return (
          <div className="flex items-center gap-2">
            {/* nút edit */}
            <button
              title="Sửa"
              onClick={() => {
                dispatch(fetchPhongInfoAction(dataObject.id))
                  .then((result) => {
                    dispatch(setIsModalEditOpenAction(true));
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-500"
            >
              <EditOutlined />
            </button>
            {/* Popconfirm bọc nút xóa => confirm => chạy hàm xóa */}
            <Popconfirm
              title="Xoá phòng"
              description="Bạn có chắc muốn xóa phòng?"
              onConfirm={() => confirm(dataObject.id)}
              okText="Có"
              cancelText="Không"
              okButtonProps={{
                danger: "danger",
              }}
            >
              <button
                title="Xoá"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500"
              >
                <DeleteOutlined />
              </button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const renderTinhThanh = (id) => {
    const index = listViTri.findIndex((viTri) => viTri.id === id);
    if (index !== -1) {
      // listViTri lấy từ /vi-tri (snake_case)
      return listViTri[index].ten_vi_tri;
    }
  };
  const renderListPhong = () => {
    return listPhong.map((phong) => {
      return {
        key: phong.id,
        id: phong.id,
        tenPhong: phong.tenPhong,
        moTa: phong.moTa,
        // mapRoom trả viTriId (không phải maViTri)
        tinhThanh: renderTinhThanh(phong.viTriId),
        hinhAnh: phong.hinhAnh,
      };
    });
  };
  const handleDeletePhong = (id) => {
    phongServices
      .deletePhong(id, token)
      .then((result) => {
        dispatch(fetchListPhongAction({ currentPage, valueInput }));
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Xóa thất bại");
      });
  };
  const confirm = (id) => {
    handleDeletePhong(id);
  };
  return (
    <Table
      dataSource={renderListPhong()}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        total: totalRow,
        defaultCurrent: 1,
        current: currentPage,
        pageSize: 10,
        onChange: handlePageChange,
      }}
    />
  );
}
