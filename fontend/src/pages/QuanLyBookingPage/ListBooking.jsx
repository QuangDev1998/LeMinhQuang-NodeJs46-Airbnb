import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookingInfoAction,
  fetchListBookingAction,
} from "../../redux/thunks/quanLyBookingThunks";
import { Popconfirm, Table, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { bookingServices } from "../../services/bookingServices";
import { setIsModalEditOpenAction } from "../../redux/slices/quanLyBookingSlice";

export default function ListBooking({ fetchSearchBooking, valueInput }) {
  const { listBooking } = useSelector((state) => state.quanLyBookingSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchListBookingAction());
  }, [dispatch]);

  const columns = [
    {
      title: "Mã đặt phòng",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Mã phòng",
      dataIndex: "ma_phong",
      key: "ma_phong",
      sorter: (a, b) => a.ma_phong - b.ma_phong,
    },
    {
      title: "Mã người dùng",
      dataIndex: "ma_nguoi_dat",
      key: "ma_nguoi_dat",
      sorter: (a, b) => a.ma_nguoi_dat - b.ma_nguoi_dat,
    },
    { title: "Ngày đến", dataIndex: "ngay_den", key: "ngay_den" },
    { title: "Ngày đi", dataIndex: "ngay_di", key: "ngay_di" },
    {
      title: "Số khách",
      dataIndex: "so_luong_khach",
      key: "so_luong_khach",
      sorter: (a, b) => a.so_luong_khach - b.so_luong_khach,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              dispatch(fetchBookingInfoAction(record.id)).then(() => {
                dispatch(setIsModalEditOpenAction(true));
              });
            }}
            className="text-2xl cursor-pointer mr-2"
          />
          <Popconfirm
            title="Xoá đặt phòng"
            description="Bạn có chắc muốn xóa đặt phòng?"
            onConfirm={() => handleDeleteBooking(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined className="text-2xl cursor-pointer" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const renderListBooking = () => {
    return listBooking.map((b) => ({
      key: b.id,
      id: b.id,
      ma_phong: b.ma_phong,
      ngay_den: dayjs(b.ngay_den).format("DD/MM/YYYY"),
      ngay_di: dayjs(b.ngay_di).format("DD/MM/YYYY"),
      so_luong_khach: b.so_luong_khach,
      ma_nguoi_dat: b.ma_nguoi_dat,
    }));
  };

  const handleDeleteBooking = (id) => {
    bookingServices
      .deleteBooking(id)
      .then(() => {
        fetchSearchBooking(valueInput);
        message.success("Xóa thành công");
      })
      .catch(() => message.error("Xóa thất bại"));
  };

  return (
    <Table
      dataSource={renderListBooking()}
      columns={columns}
      scroll={{ x: "max-content" }}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
}
