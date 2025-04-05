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
  // Table data
  const columns = [
    {
      title: "Mã đặt phòng",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Mã phòng",
      dataIndex: "maPhong",
      key: "maPhong",
      sorter: (a, b) => a.maPhong - b.maPhong,
    },
    {
      title: "Mã người dùng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      sorter: (a, b) => a.maNguoiDung - b.maNguoiDung,
    },
    {
      title: "Ngày đến",
      dataIndex: "ngayDen",
      key: "ngayDen",
    },
    {
      title: "Ngày đi",
      dataIndex: "ngayDi",
      key: "ngayDi",
    },
    {
      title: "Số khách",
      dataIndex: "soLuongKhach",
      key: "soLuongKhach",
      sorter: (a, b) => a.soLuongKhach - b.soLuongKhach,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_, dataObject) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                dispatch(fetchBookingInfoAction(dataObject.id))
                  .then((result) => {
                    dispatch(setIsModalEditOpenAction(true));
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
              className=" text-2xl hover:cursor-pointer mr-2"
            />
            <Popconfirm
              title="Xoá đặt phòng"
              description="Bạn có chắc muốn xóa đặt phòng?"
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
  const renderListBooking = () => {
    return listBooking.map((booking) => {
      return {
        key: booking.id,
        id: booking.id,
        maPhong: booking.maPhong,
        ngayDen: dayjs(booking.ngayDen).format("DD/MM/YYYY"),
        ngayDi: dayjs(booking.ngayDi).format("DD/MM/YYYY"),
        soLuongKhach: booking.soLuongKhach,
        maNguoiDung: booking.maNguoiDung,
      };
    });
  };
  const handleDeleteBooking = (id) => {
    bookingServices
      .deleteBooking(id)
      .then((result) => {
        fetchSearchBooking(valueInput);
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Xóa thất bại");
      });
  };
  const confirm = (id) => {
    handleDeleteBooking(id);
  };
  return (
    <Table
      dataSource={renderListBooking()}
      columns={columns}
      scroll={{ x: "max-content" }}
      showSorterTooltip={{
        target: "sorter-icon",
      }}
    />
  );
}
