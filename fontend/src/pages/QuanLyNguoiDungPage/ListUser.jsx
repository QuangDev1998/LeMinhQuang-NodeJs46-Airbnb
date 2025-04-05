import React from "react";
import { Table, Avatar, Tag, Popconfirm, message } from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import {
  setCurrentPageAction,
  setIsModalEditOpenAction,
  setListUserAction,
} from "../../redux/slices/quanLyNguoiDungSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import dayjs from "dayjs";
import {
  fetchListUserAction,
  fetchUserInfoAction,
} from "../../redux/thunks/quanLyNguoiDungThunks";

export default function ListUser({ valueInput }) {
  const { listUser, totalRow, currentPage } = useSelector(
    (state) => state.quanLyNguoiDungSlice
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchListUserAction({ currentPage, valueInput }));
  }, []);

  const handlePageChange = (pageIndex, pageSize) => {
    // cập nhật lại currentPage và call api search => set list theo page mới
    dispatch(setCurrentPageAction(pageIndex));
    nguoiDungServices
      .findUser(pageIndex, pageSize, valueInput)
      .then((result) => {
        dispatch(setListUserAction(result.data.content.data));
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
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_, dataObject) => {
        return (
          <div className="md:flex items-center">
            {dataObject.avatar ? (
              <Avatar
                className="mr-2 h-8 w-8"
                src={<img src={dataObject.avatar} alt="avatar" />}
              />
            ) : (
              <Avatar icon={<UserOutlined />} className="mr-2 h-8 w-8" />
            )}

            <p className="truncate">{dataObject.name}</p>
          </div>
        );
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",

      render: (_, dataObject) => {
        return <p className="underline truncate">{dataObject.email}</p>;
      },
    },
    {
      title: "Người dùng ",
      dataIndex: "role",
      key: "role",
      render: (_, dataObject) => {
        if (dataObject.role === "ADMIN") {
          return <Tag color="red">ADMIN</Tag>;
        } else {
          return <Tag color="green">USER</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      fixed: "right",
      key: "action",
      render: (_, dataObject) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                dispatch(fetchUserInfoAction(dataObject.id))
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
  const renderListUser = () => {
    return listUser.map((user) => {
      return {
        key: user.id,
        avatar: user.avatar,
        id: user.id,
        name: user.name,
        birthday: dayjs(user.birthday).format("DD/MM/YYYY"),
        email: user.email,
        role: user.role,
      };
    });
  };
  const handleDeleteUser = (id) => {
    nguoiDungServices
      .deleteUser(id)
      .then((result) => {
        dispatch(fetchListUserAction({ currentPage, valueInput }));
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Xóa thất bại");
      });
  };

  const confirm = (id) => {
    handleDeleteUser(id);
  };
  return (
    <Table
      dataSource={renderListUser()}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        total: totalRow, // total để hiện số trang
        defaultCurrent: 1,
        current: currentPage,
        pageSize: 10, // Số dòng mỗi trang
        onChange: handlePageChange,
      }}
    />
  );
}
