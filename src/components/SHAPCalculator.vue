<!-- src/components/SHAPCalculator.vue -->
<script setup>
import { computed } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";

const portfolioStore = usePortfolioStore();

// 計算 Sharpe Ratio
const sharpeRatio = computed(() => portfolioStore.calcSharpeRatio(0));
</script>

<template>
    <div class="border border-t-0 border-gray-400 bg-white p-2">
        <h2 class="text-md font-semibold text-blue-700">Sharpe Ratio</h2>
        <span v-if="sharpeRatio !== null" class="mt-2 text-gray-800">
            {{ sharpeRatio.toFixed(4) }}
        </span>
        <span v-else class="mt-2 text-gray-500">尚無資料</span>
    </div>
</template>
