<script setup>
import { computed, ref } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import { useChartStore } from "@/stores/useChartStore";
import ToggleSwitch from "@/components/ToggleSwitch.vue";

const portfolioStore = usePortfolioStore();
const stockDataStore = useStockDataStore();
const chartStore = useChartStore();

const selectedStocks = computed(() => portfolioStore.selectedStocks);
const stockVisibility = ref({});

function toggleVisibility(stockId, visible) {
    let datasetLabel;
    if (stockId === "avg") {
        datasetLabel = "平均分配資金水位";
    } else {
        datasetLabel = stockDataStore.stockNames[stockId]?.name || "?";
    }
    chartStore.visibilityMap[datasetLabel] = visible;
    chartStore.setDatasetVisibility(datasetLabel, visible);
}
</script>

<template>
    <div class="overflow-y-auto border-t border-t-gray-400 px-4 py-3">
        <h2 class="text-lg font-semibold text-blue-700">走勢顯示控制</h2>
        <div class="mt-3 flex flex-wrap content-start items-center gap-6">
            <!-- 只有一檔股票時：顯示藍線，但 label 改成股票名稱 -->
            <!-- 單檔股票時 -->
            <div class="w-full" v-if="selectedStocks.length === 1">
                <ToggleSwitch
                    :label="
                        stockDataStore.stockNames[selectedStocks[0]]?.name ||
                        '?'
                    "
                    :model-value="stockVisibility[selectedStocks[0]] ?? true"
                    color="#2b5fce"
                    @update:modelValue="
                        (val) => toggleVisibility(selectedStocks[0], val)
                    "
                />
            </div>

            <!-- 多檔股票時：顯示均分 + 各股票 -->
            <div class="w-full" v-else-if="selectedStocks.length > 1">
                <ToggleSwitch
                    label="均分"
                    :model-value="stockVisibility['avg'] ?? true"
                    color="#2b5fce"
                    @update:modelValue="(val) => toggleVisibility('avg', val)"
                />
            </div>

            <ToggleSwitch
                v-if="selectedStocks.length > 1"
                v-for="id in selectedStocks"
                :key="id"
                :label="stockDataStore.stockNames[id]?.name || '?'"
                :model-value="stockVisibility[id] ?? true"
                :color="portfolioStore.stockColors[id]"
                @update:modelValue="(val) => toggleVisibility(id, val)"
            />
        </div>
    </div>
</template>
