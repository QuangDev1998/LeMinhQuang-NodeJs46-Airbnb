import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ConfigProvider, DatePicker } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  setDonDatPhong,
  setTongDoanhThu,
} from "../../redux/slices/quanLySoLieuSlice";

dayjs.locale("vi");
Chartjs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function DoanhThu() {
  const {
    listDatPhong,
    listIdGiaTien,

    donDatPhong,
    tongDoanhThu,
  } = useSelector((state) => state.quanLySoLieuSlice);
  const [max, setMax] = useState(null);
  const [avg, setAvg] = useState(null);
  const [min, setMin] = useState(null);
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();

  const onChange = (date, dateString) => {
    let from = dayjs(date[0]).valueOf();
    let to = dayjs(date[1]).valueOf();
    let tongTienArr = calculateTongTien(from, to);
    const min = Math.min(...tongTienArr);
    const max = Math.max(...tongTienArr);
    let sum = null;
    for (let i = 0; i < tongTienArr.length; i++) {
      sum += tongTienArr[i];
    }
    const avg = Math.floor(sum / tongTienArr.length);
    setMin(min);
    setMax(max);
    setAvg(avg);
    dispatch(setDonDatPhong(tongTienArr.length));
    dispatch(setTongDoanhThu(sum));
  };
  const calculateTienPhong = ({ maPhong, ngayDen, ngayDi }) => {
    let from = dayjs(ngayDen);
    let to = dayjs(ngayDi);
    // tính tổng số ngày đặt phòng
    let days = Math.round((to - from) / (1000 * 3600 * 24));
    let index = listIdGiaTien.findIndex((item) => item.id === maPhong);
    // nếu ko tìm được giá tiền theo id => return 0
    if (index !== -1) {
      let tienPhong = listIdGiaTien[index].giaTien * days;
      return tienPhong;
    } else {
      return 0;
    }
  };
  const calculateTongTien = (from, to) => {
    let tongTienArr = [];
    listDatPhong.map((booking) => {
      let date = dayjs(booking.ngayDen).valueOf();
      let tongTien = calculateTienPhong(booking);
      // nếu booking nằm trong khoảng thời gian thì && giá trị > 0 => push vào array
      if (from <= date && date <= to) {
        if (tongTien > 0) {
          tongTienArr.push(tongTien);
        }
      }
    });
    return tongTienArr;
  };
  const lineChartData = {
    labels: ["Thấp nhất", "Trung bình", "Cao nhất"],
    datasets: [
      {
        label: "$",

        data: [min, avg, max],
        backgroundColor: "rgb(254, 107, 110)",
        borderColor: "rgb(175, 225, 175)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "black",
        anchor: "end",
        align: "top",
        font: {
          size: 18,
        },
        formatter: (value) => {
          return `${value}`;
        },
      },
    },
    scales: {
      y: {
        display: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu / đơn ($)",
        },
        type: "linear",
        grace: "10%",
      },
      x: {
        display: true,

        offset: true,
      },
    },
  };
  return (
    <div className="p-5 border-2 rounded-lg space-y-3">
      <h1 className="font-bold">Doanh thu</h1>
      <ConfigProvider locale={vi_VN}>
        <RangePicker
          format={"DD/MM/YYYY"}
          onChange={onChange}
          maxDate={dayjs(new Date())}
        />
      </ConfigProvider>
      <div className="flex  gap-3">
        <div className="border-2 rounded-lg p-5 shadow-sm">
          <h1 className="font-bold">Tổng doanh thu</h1>
          <p>{tongDoanhThu} $</p>
        </div>
        <div className="border-2 rounded-lg p-5 shadow-sm">
          <h1 className="font-bold">Đơn đặt phòng</h1>
          <p>{donDatPhong} đơn</p>
        </div>
      </div>
      <div className="h-80 border-2 rounded-lg shadow-sm p-5">
        <Line data={lineChartData} options={options} />
      </div>
    </div>
  );
}
