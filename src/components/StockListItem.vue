<!-- src/components/StockListItem.vue -->
<script setup>
import { computed } from "vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore"; // 改成投資組合 store

const props = defineProps({
    stock: {
        type: Object,
        required: true,
    },
});

const portfolioStore = usePortfolioStore();

// 判斷是否 active
const isActive = computed(() =>
    portfolioStore.selectedStocks.includes(props.stock.id),
);

// 切換勾選狀態
function toggleSelect() {
    if (isActive.value) {
        portfolioStore.unselectStock(props.stock.id);
    } else {
        portfolioStore.selectStock(props.stock.id);
    }
}
</script>

<template>
    <li
        @click="toggleSelect"
        :class="[
            'box-border flex cursor-pointer items-center gap-5 rounded-lg border-2 p-4 select-none',
            isActive
                ? 'border-blue-500 bg-blue-500 hover:bg-blue-600'
                : 'border-gray-300 bg-gray-100 hover:bg-blue-100',
        ]"
    >
        <!-- 股票名稱 -->
        <div>
            <h3
                :class="[
                    isActive ? 'text-white' : 'text-blue-500',
                    'font-semibold',
                ]"
            >
                {{ stock.name }}
            </h3>
        </div>
    </li>
</template>
