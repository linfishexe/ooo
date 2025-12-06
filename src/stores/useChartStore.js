// src/stores/useChartStore.js
import { defineStore } from "pinia";
import { markRaw } from "vue";
import { Chart } from "chart.js/auto";

export const useChartStore = defineStore("chart", {
    state: () => ({
        chartInstance: null,
        visibilityMap: {}, // 記錄每個 dataset 的顯示狀態
    }),
    actions: {
        initChart(canvasElement) {
            this.chartInstance = markRaw(
                new Chart(canvasElement, {
                    type: "line",
                    data: { labels: [], datasets: [] },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: false,
                        scales: {
                            y: {
                                ticks: {
                                    callback: (value) =>
                                        (value / 10000).toLocaleString() + "萬",
                                },
                            },
                        },
                    },
                }),
            );
        },
        updateChart(labels, datasets) {
            if (!this.chartInstance) return;
            this.chartInstance.data.labels = labels;
            this.chartInstance.data.datasets = datasets;

            // 套用 hidden 狀態
            this.chartInstance.data.datasets.forEach((ds, idx) => {
                const visible = this.visibilityMap[ds.label] ?? true;
                this.chartInstance.getDatasetMeta(idx).hidden = !visible;
            });

            this.chartInstance.update();
        },
        toggleDatasetVisibility(label) {
            if (!this.chartInstance) return;
            const datasetIndex = this.chartInstance.data.datasets.findIndex(
                (ds) => ds.label === label,
            );
            if (datasetIndex !== -1) {
                const meta = this.chartInstance.getDatasetMeta(datasetIndex);
                meta.hidden = !meta.hidden;
                this.chartInstance.update();
            }
        },
        destroyChart() {
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }
        },

        setDatasetVisibility(label, visible) {
            if (!this.chartInstance) return;
            const datasetIndex = this.chartInstance.data.datasets.findIndex(
                (ds) => ds.label === label,
            );
            if (datasetIndex !== -1) {
                const meta = this.chartInstance.getDatasetMeta(datasetIndex);
                meta.hidden = !visible; // visible=true → hidden=false
                this.chartInstance.update();
            }
        },
    },
});
