<!-- scr/components/DisplayControlPanel.vue -->
<script setup>
import { computed } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import { useChart } from "@/composables/useChart";

const portfolioStore = usePortfolioStore();
const stockDataStore = useStockDataStore();
const { getChartInstance } = useChart(); // 需要在 useChart 裡加一個方法回傳 chartInstance

// 目前勾選的股票清單
const selectedStocks = computed(() => portfolioStore.selectedStocks);

// 切換顯示狀態
function toggleVisibility(stockId) {
    const chart = getChartInstance();
    if (!chart) return;

    const datasetIndex = chart.data.datasets.findIndex(
        (ds) => ds.label === stockDataStore.stockNames[stockId]?.name,
    );
    if (datasetIndex !== -1) {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.hidden = !meta.hidden;
        chart.update();
    }
}
</script>

<template>
    <div class="flex flex-wrap gap-2 border-t border-t-gray-400 p-2">
        <div
            v-for="id in selectedStocks"
            :key="id"
            class="flex cursor-pointer items-center gap-2 rounded border px-3 py-1"
            @click="toggleVisibility(id)"
        >
            <span>{{ stockDataStore.stockNames[id]?.name || "?" }}</span>
        </div>
    </div>
</template>
