<!-- src/components/StockChart.vue -->
<script setup>
import {
    ref,
    onMounted,
    onBeforeUnmount,
    watch,
    computed,
    shallowRef,
} from "vue";
import Chart from "chart.js/auto";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import { useChartStore } from "@/stores/useChartStore";

const canvasRef = ref(null);
const chartInstance = shallowRef(null);
const portfolioStore = usePortfolioStore();
const stockStore = useStockDataStore();
const chartStore = useChartStore();

// --- 核心邏輯：將 Store 資料轉換為 Chart.js 格式 ---
const chartData = computed(() => {
    const ids = portfolioStore.selectedStockIds;
    const pValues = portfolioStore.portfolioValues;
    const days = pValues.length;

    if (days === 0) return { labels: [], datasets: [] };

    const labels = Array.from({ length: days }, (_, i) => i + 1);
    const datasets = [];

    // 1. 建立主線 (平均或單一)
    if (ids.length > 0) {
        const isSingle = ids.length === 1;
        datasets.push({
            label: isSingle ? stockStore.stocks[ids[0]].name : "平均分配",
            data: pValues,
            borderColor: "#2b5fce",
            borderWidth: 4,
            order: 1,
        });
    }

    // 2. 建立個股比較線 (當選多支時)
    if (ids.length > 1) {
        ids.forEach((id) => {
            const stock = stockStore.stocks[id];
            datasets.push({
                label: stock.name,
                data: portfolioStore.singleValues[id] || [],
                borderColor: stock.color,
                borderWidth: 1,
                order: 10,
            });
        });
    }

    return { labels, datasets };
});

// --- 生命週期與更新 ---
onMounted(() => {
    chartInstance.value = new Chart(canvasRef.value, {
        type: "line",
        data: chartData.value, // 初始資料
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
            plugins: { legend: { display: false } },
        },
    });
});

onBeforeUnmount(() => chartInstance.value?.destroy());

// 監聽 computed 資料變化 -> 更新圖表
watch(chartData, (newData) => {
    if (!chartInstance.value) return;
    chartInstance.value.data = newData;
    updateVisibility(); // 重繪時套用隱藏設定
    chartInstance.value.update();
});

// 監聽隱藏設定 -> 更新顯示狀態
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
        <canvas class="h-full w-full" ref="canvasRef"></canvas>
    </div>
</template>
