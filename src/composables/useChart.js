// src/composables/useChart.js
import { markRaw, toRaw } from "vue";
import { Chart } from "chart.js/auto";

export function useChart() {
    let chartInstance = null;

    function initChart(canvasElement) {
        const cfg = {
            type: "line",
            data: {
                labels: [],
                datasets: [],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) =>
                                (value / 10000).toLocaleString() + "萬",
                        },
                    },
                },
            },
        };
        chartInstance = markRaw(new Chart(canvasElement, cfg));
    }

    function updateChart(labels, datasets) {
        const chart = toRaw(chartInstance);
        chart.data.labels = labels;
        chart.data.datasets = datasets;
        chart.update();
    }

    function destroyChart() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    }

    return { initChart, updateChart, destroyChart };
}
