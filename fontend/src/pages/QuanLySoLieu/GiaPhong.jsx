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

export default function GiaPhong() {
  const { listGiaTien } = useSelector((state) => state.quanLySoLieuSlice);
  const giaMax = Math.max(...listGiaTien);
  const giaMin = Math.min(...listGiaTien);
  const calculateAverage = () => {
    let sum = 0;
    for (let i = 0; i < listGiaTien.length; i++) {
      sum += listGiaTien[i];
    }
    let avg = sum / listGiaTien.length;
    return Math.floor(avg);
  };
  const barChartData = {
    labels: ["Thấp nhất", "Trung bình", "Cao nhất"],
    datasets: [
      {
        label: "$",
        data: [giaMin, calculateAverage(), giaMax],
        backgroundColor: "rgb(254, 107, 110)",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Giá phòng / đêm",
      },
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
      x: {
        grid: { display: false }, // Ẩn lưới X
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Giá phòng ($)",
        },
      },
    },
  };
  return (
    <div className="h-52 w-full border-2 p-5 rounded-lg shadow-sm">
      <Bar data={barChartData} options={options} />
    </div>
  );
}
