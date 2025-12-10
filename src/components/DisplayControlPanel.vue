<!-- src/components/DisplayControlPanel.vue -->
<script setup>
import { computed } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import { useChartStore } from "@/stores/useChartStore";
import ToggleSwitch from "@/components/ToggleSwitch.vue";

const portfolioStore = usePortfolioStore();
const stockStore = useStockDataStore();
const chartStore = useChartStore();

// 計算出現在圖表上的項目列表
const displayItems = computed(() => {
    const ids = portfolioStore.selectedStockIds;
    if (ids.length === 0) return [];

    const items = [];

    // 1. 主線 (平均 or 單一)
    if (ids.length === 1) {
        const stock = stockStore.stocks[ids[0]];
        items.push({ label: stock.name, color: "#2b5fce" });
    } else {
        items.push({ label: "平均分配", color: "#2b5fce" });
        // 2. 其他個股
        ids.forEach((id) => {
            const stock = stockStore.stocks[id];
            items.push({ label: stock.name, color: stock.color });
        });
    }
    return items;
});
</script>

<template>
    <div class="relative overflow-y-auto border-t border-t-gray-400 px-4 py-3">
        <h2 class="text-lg font-semibold">走勢顯示控制</h2>
        <slot></slot>
        <div class="mt-3 flex flex-wrap content-start items-center gap-6">
            <ToggleSwitch
                v-for="item in displayItems"
                :key="item.label"
                :label="item.label"
                :model-value="chartStore.isVisible(item.label)"
                :color="item.color"
                @update:modelValue="chartStore.toggleVisibility(item.label)"
            />
        </div>
    </div>
</template>
