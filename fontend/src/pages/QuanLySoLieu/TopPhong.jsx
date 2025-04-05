import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chartjs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
export default function TopPhong() {
  const { listDatPhong, listPhong } = useSelector(
    (state) => state.quanLySoLieuSlice
  );
  const calculateListBookedRoom = () => {
    const listBookedRoom = listDatPhong.map((phong) => {
      return phong.maPhong;
    });
    return listBookedRoom;
  };
  // Đếm số lần xuất hiện của mỗi số
  const numberCount = calculateListBookedRoom().reduce((count, num) => {
    count[num] = (count[num] || 0) + 1;
    return count;
  }, {});
  // Sắp xếp các số theo số lần xuất hiện và lấy top 5
  const topNumbers = Object.entries(numberCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([num]) => Number(num));

  // convert từ mã phòng => tên phòng
  const convertMaPhongToTenPhong = (maPhong) => {
    let index = listPhong.findIndex((phong) => phong.id === maPhong);
    if (index !== -1) {
      return listPhong[index].tenPhong;
    }
  };
  // convert từ mã phòng => lượt đặt
  const convertMaPhongToLuotDat = (maPhong) => {
    return numberCount[maPhong];
  };
  const renderTopFiveRoom = () => {
    let topFive = topNumbers.map((num) => {
      return {
        tenPhong: convertMaPhongToTenPhong(num),
        luotDat: convertMaPhongToLuotDat(num),
      };
    });
    return topFive;
  };
  const barChartData = {
    labels: renderTopFiveRoom().map((phong) => phong.tenPhong),
    datasets: [
      {
        label: "Lượt đặt",
        data: renderTopFiveRoom().map((phong) => phong.luotDat),
        backgroundColor: [
          "RGB(173, 216, 230)",
          "RGB(106, 90, 205)",
          "RGB(143, 188, 143)",
          "RGB(70, 130, 180)",
          "RGB(0, 139, 139)",
        ],
        borderWidth: 1,
        barPercentage: 0.8,
        borderRadius: "32",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: "black",
        anchor: "center",
        align: "middle",
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        display: false, // Ẩn trục X
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="h-52 w-full border-2 p-5 rounded-lg shadow-sm">
      <h1 className="font-bold">Top phòng</h1>
      <Bar data={barChartData} options={options} />
    </div>
  );
}
