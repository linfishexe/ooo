<!-- src/components/StockChart.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from "vue";
import Chart from "chart.js/auto";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import { useChartStore } from "@/stores/useChartStore";

const canvasRef = ref(null);
const chartInstance = shallowRef(null); // 使用 shallowRef 避免深層響應式效能問題

const portfolioStore = usePortfolioStore();
const stockStore = useStockDataStore();
const chartStore = useChartStore();

// 初始化圖表
onMounted(() => {
    chartInstance.value = new Chart(canvasRef.value, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    ticks: {
                        callback: (v) => (v / 10000).toLocaleString() + "萬",
                    },
                },
            },
            plugins: {
                legend: { display: false }, // 我們自己做控制面板，所以隱藏內建 Legend
            },
        },
    });
});

onBeforeUnmount(() => chartInstance.value?.destroy());

// 監聽數據變化 -> 更新 Dataset
watch(
    () => [portfolioStore.portfolioValues, portfolioStore.selectedStockIds],
    () => {
        if (!chartInstance.value) return;

        const ids = portfolioStore.selectedStockIds;
        const days = portfolioStore.portfolioValues.length;
        const labels = Array.from({ length: days }, (_, i) => i + 1);

        const datasets = [];

        // 策略：如果只有一支，顯示該支(藍色)；如果多支，顯示均分(藍色) + 各股(各自顏色)
        const showAvg = ids.length > 0;

        if (showAvg) {
            // 只有一支時，平均線就是該股走勢，但名稱用該股名稱
            const isSingle = ids.length === 1;
            const label = isSingle
                ? stockStore.stocks[ids[0]].name
                : "平均分配";

            datasets.push({
                label,
                data: portfolioStore.portfolioValues,
                borderColor: "#2b5fce",
                borderWidth: 4,
                fill: false,
                order: 1, // 最上層
            });
        }

        if (ids.length > 1) {
            ids.forEach((id) => {
                const stock = stockStore.stocks[id];
                datasets.push({
                    label: stock.name,
                    data: portfolioStore.singleValues[id] || [],
                    borderColor: stock.color,
                    borderWidth: 1,
                    fill: false,
                    order: 10,
                });
            });
        }

        chartInstance.value.data = { labels, datasets };
        updateVisibility(); // 確保更新數據後，隱藏狀態正確
        chartInstance.value.update();
    },
    { deep: true },
);

// 監聽隱藏狀態變化 -> 只更新隱藏，不重繪數據
watch(() => chartStore.hiddenLabels, updateVisibility, { deep: true });

function updateVisibility() {
    if (!chartInstance.value) return;
    chartInstance.value.data.datasets.forEach((ds, index) => {
        const isHidden = chartStore.hiddenLabels.includes(ds.label);
        chartInstance.value.setDatasetVisibility(index, !isHidden);
    });
    chartInstance.value.update();
}
</script>

<template>
    <div class="p-3">
        <canvas class="h-full! w-full!" ref="canvasRef"></canvas>
    </div>
</template>
