import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPageAction,
  setIsModalEditOpenAction,
  setListViTriAction,
} from "../../redux/slices/quanLyViTriSlice";
import { message, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { viTriServices } from "../../services/viTriServices";
import {
  fetchListViTriAction,
  fetchViTriInfoAction,
} from "../../redux/thunks/quanLyViTriThunks";

export default function ListViTri({ valueInput }) {
  const { token } = useSelector((state) => state.userSlice.loginData);
  const { listViTri, totalRow, currentPage } = useSelector(
    (state) => state.quanLyViTriSlice
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchListViTriAction({ currentPage, valueInput }));
  }, []);

  const handlePageChange = (pageIndex, pageSize) => {
    // cập nhật lại currentPage và call api search => set list theo page mới
    dispatch(setCurrentPageAction(pageIndex));
    viTriServices
      .findViTri2(pageIndex, pageSize, valueInput)
      .then((result) => {
        dispatch(setListViTriAction(result.data.content.data));
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // Table data
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "tenViTri",
      key: "tenViTri",
      render: (_, dataObject) => {
        return (
          <div className="md:flex items-center">
            <img
              src={dataObject.hinhAnh}
              alt="avatar"
              className="mr-2 w-36 h-16 object-cover"
            />
            <p>{dataObject.tenViTri}</p>
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
      title: "Quốc gia",
      dataIndex: "quocGia",
      key: "quocGia",
      render: (_, dataObject) => {
        return <p className="underline">{dataObject.quocGia}</p>;
      },
    },
    {
      title: "Thao tác",
      fixed: "right",
      key: "action",
      render: (_, dataObject) => {
        return (
          <div>
            {/* nút edit */}
            <EditOutlined
              onClick={() => {
                dispatch(fetchViTriInfoAction(dataObject.id))
                  .then((result) => {
                    dispatch(setIsModalEditOpenAction(true));
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
              className=" text-2xl hover:cursor-pointer mr-2"
            />
            {/* Popconfirm bọc nút xóa => confirm => chạy hàm xóa */}
            <Popconfirm
              title="Xoá người dùng"
              description="Bạn có chắc muốn xóa người dùng?"
              onConfirm={() => confirm(dataObject.id)}
              okText="Có"
              cancelText="Không"
              okButtonProps={{
                danger: "danger",
              }}
            >
              <DeleteOutlined className=" text-2xl hover:cursor-pointer " />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const renderListVitri = () => {
    return listViTri.map((viTri) => {
      return {
        key: viTri.id,
        id: viTri.id,
        tenViTri: viTri.tenViTri,
        tinhThanh: viTri.tinhThanh,
        quocGia: viTri.quocGia,
        hinhAnh: viTri.hinhAnh,
      };
    });
  };
  const handleDeleteViTri = (id) => {
    viTriServices
      .deleteViTri(id, token)
      .then((result) => {
        dispatch(fetchListViTriAction({ currentPage, valueInput }));
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.err("Xóa thất bại");
      });
  };
  const confirm = (id) => {
    handleDeleteViTri(id);
  };
  return (
    <Table
      dataSource={renderListVitri()}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        total: totalRow, // total để hiện số trang
        defaultCurrent: 1,
        current: currentPage,
        pageSize: 3, // Số dòng mỗi trang
        onChange: handlePageChange,
      }}
    />
  );
}
