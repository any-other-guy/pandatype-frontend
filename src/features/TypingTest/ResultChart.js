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
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { loadState } from "../../app/localStorage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
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
      title: {
        display: true,
        text: "Words per Minute",
        align: "center",
        font: {
          family: "Roboto Mono",
        },
      },
    },
    errors: {
      type: "linear",
      display: true,
      position: "right",
      min: 0,
      ticks: {
        font: {
          family: "Roboto Mono",
        },
        maxTicksLimit: 5, //TODO: TBD
        stepSize: 1,
      },
      title: {
        display: true,
        text: "Errors",
        align: "center",
        font: {
          family: "Roboto Mono",
        },
      },
      grid: {
        display: false,
        drawOnChartArea: false,
      },
    },
    x: {
      display: true,
      ticks: {
        font: {
          family: "Roboto Mono",
        },
        maxTicksLimit: 10,
      },
    },
  },
};

const ResultChart = ({ perSecondWpm, elapsedTime }) => {
  const theme = loadState("theme");
  // Remove the first dummy object in perSecondWpm array. For now
  let stats = JSON.parse(JSON.stringify(perSecondWpm));
  // Display the endTime as the last x-axis data point on graph
  stats[stats.length - 1].index = elapsedTime / 1000;

  const labels = stats.map((obj) => obj.index);
  const data = {
    labels,
    datasets: [
      {
        label: "wpm",
        data: stats.map((obj) => obj.wpm),
        type: "line",
        fill: true,
        borderColor: theme["main-color"],
        pointRadius: 2,
        pointBorderWidth: 3,
        backgroundColor: "rgba(100, 102, 105, 0.2)",
        yAxisID: "wpm",
        tension: 0.2,
      },
      {
        label: "raw",
        data: stats.map((obj) => obj.rawWpm),
        type: "line",
        fill: true,
        borderColor: theme["sub-color"],
        pointRadius: 2,
        pointBorderWidth: 3,
        backgroundColor: "rgba(100, 102, 105, 0.2)",
        yAxisID: "wpm",
        tension: 0.2,
      },
      {
        label: "errors",
        data: stats.map((obj) => {
          if (obj.mistakesHere === 0) obj.mistakesHere = null;
          return obj.mistakesHere;
        }),
        showLine: false,
        pointStyle: "crossRot",
        pointBorderWidth: 2,
        borderColor: theme["error-color"],
        yAxisID: "errors",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default ResultChart;
