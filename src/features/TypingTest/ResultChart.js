import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { perSecondWpmAction } from "./typingtestSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: false,
      text: "wpm chart",
    },
    legend: {
      display: false,
    },
  },
  scales: {
    wpm: {
      type: "linear",
      display: true,
      position: "left",
      suggestedMin: 0,
      ticks: {
        font: {
          family: "Roboto Mono",
        },
        maxTicksLimit: 4,
      },
    },

  },
};

const ResultChart = ({ perSecondWpm, elapsedTime }) => {
  // Remove the first dummy object in perSecondWpm array. For now
  let stats = JSON.parse(JSON.stringify(perSecondWpm));
  stats.shift();
  // Display the endTime as the last x-axis data point on graph
  stats[stats.length - 1].index = elapsedTime / 1000;

  const labels = stats.map((obj) => obj.index);
  const data = {
    labels,
    datasets: [
      {
        label: "wpm",
        data: stats.map((obj) => obj.wpm),
        type: 'line',
        borderColor: "rgb(0,250,154)",
        backgroundColor: "rgba(128,128,128, 0.5)",
        yAxisID: "wpm",
        tension: 0.1,
      },
      {
        label: "raw",
        data: stats.map((obj) => obj.rawWpm),
        type: 'line',
        borderColor: "rgb(100, 102, 105)",
        backgroundColor: "rgba(128,128,128, 0.5)",
        yAxisID: "wpm",
        tension: 0.1,
      },
      // {
      //   label: 'errors',
      //   data: stats.map((obj) => obj.mistakesHere),
      //   borderColor: 'rgb(202, 71, 84)',
      //   backgroundColor: 'rgba(255, 255, 255, 0)',
      //   yAxisID: 'errors',
      // },
    ],
  };

  return <Line options={options} data={data} />;
};

export default ResultChart;
