<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import { useChart } from "@/composables/useChart";

const chartCanvas = ref(null);
const portfolioStore = usePortfolioStore();
const stockDataStore = useStockDataStore();
const { initChart, updateChart, destroyChart } = useChart(chartCanvas);

onMounted(() => {
    initChart(chartCanvas.value);
});

onBeforeUnmount(() => {
    destroyChart();
});

watch(
    () => portfolioStore.portfolioValues,
    (newValues) => {
        const values = Array.isArray(newValues) ? [...newValues] : [];
        const labels = values.map((_, i) => i + 1);

        const datasets = [
            {
                label: "平均分配資金水位",
                data: values,
                borderColor: "#2b5fce",
                borderWidth: 3,
                fill: false,
            },
        ];

        portfolioStore.selectedStocks.forEach((id) => {
            const singleData = portfolioStore.singleValues[id] || [];
            const stockName = stockDataStore.stockNames[id]?.name || "?";
            datasets.push({
                label: stockName,
                data: [...singleData],
                borderColor: `rgba(200, 100, 100, 0.5)`,
                borderWidth: 1,
                fill: false,
            });
        });

        updateChart(labels, datasets);
    },
);
</script>

<template>
    <div>
        <canvas ref="chartCanvas" class="h-full! w-full!"></canvas>
    </div>
</template>
