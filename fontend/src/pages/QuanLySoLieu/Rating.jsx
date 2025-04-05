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

export default function Rating() {
  const { oneStar, twoStar, threeStar, fourStar, fiveStar } = useSelector(
    (state) => state.quanLySoLieuSlice
  );

  const barChartData = {
    labels: ["5", "4", "3", "2", "1"],
    datasets: [
      {
        label: "Số bình chọn",
        data: [
          fiveStar.length,
          fourStar.length,
          threeStar.length,
          twoStar.length,
          oneStar.length,
        ],
        backgroundColor: "rgb(255,255,102)",
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
      title: {
        display: true,
        text: "Rating",
      },
      legend: {
        position: "bottom",
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
        ticks: {
          callback: function (value) {
            const icons = ["5⭐", "4⭐", "3⭐", "2⭐", "1⭐"];
            return icons[value] || "";
          },
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
