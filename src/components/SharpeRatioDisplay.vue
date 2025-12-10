<!-- src/components/SHAPCalculator.vue -->
<script setup>
import { computed } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";

const portfolioStore = usePortfolioStore();

// 計算 Sharpe Ratio
const sharpeRatio = computed(() => portfolioStore.calcSharpeRatio(0));

// 根據 Sharpe Ratio 值計算要套用的顏色類別
const ratioTextColor = computed(() => {
    if (sharpeRatio.value <= 0) {
        return "text-red-500"; // 紅色 (負數或零)
    }
    return "text-green-500"; // 綠色 (正數)
});
</script>

<template>
    <div class="border border-t-0 border-r-0 border-gray-400 bg-white p-2">
        <h2 class="text-md font-semibold text-blue-700">Sharpe Ratio</h2>

        <span
            v-if="sharpeRatio !== null"
            :class="['mt-2 font-bold', ratioTextColor]"
        >
            {{ sharpeRatio.toFixed(4) }}
        </span>

        <span v-else class="mt-2 text-gray-500"> 尚無資料 </span>
    </div>
</template>
