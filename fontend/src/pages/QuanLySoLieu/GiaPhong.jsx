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
  const hasData = Array.isArray(listGiaTien) && listGiaTien.length > 0;
  // Tránh Math.max/min trên mảng rỗng (trả về ±Infinity)
  const giaMax = hasData ? Math.max(...listGiaTien) : 0;
  const giaMin = hasData ? Math.min(...listGiaTien) : 0;
  const calculateAverage = () => {
    if (!hasData) return 0;
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
        backgroundColor: ["#fbbf24", "#ff385c", "#10b981"],
        borderRadius: 10,
        barPercentage: 0.6,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
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
    <div className="h-60 w-full">
      <Bar data={barChartData} options={options} />
    </div>
  );
}
