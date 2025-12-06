<script setup>
import { useUiStore } from "@/stores/useUiStore";
import { useStockDataStore } from "@/stores/useStockDataStore";
import StockListItem from "@/components/StockListItem.vue";
const uiStore = useUiStore();
const stockDataStore = useStockDataStore();
</script>

<template>
    <section
        :class="[
            'box-border h-full w-[300px] border-l border-l-gray-400 bg-white',
            'transition-[right] duration-200',
            'absolute',
            'md:relative md:duration-0',
            uiStore.isSideMenuOpen ? 'right-0' : '-right-[300px] md:right-0',
        ]"
    >
        <div class="h-full overflow-y-auto p-3">
            <h2 class="mb-2 text-lg font-semibold">股票列表</h2>
            <ul class="space-y-2">
                <StockListItem
                    v-for="stock in stockDataStore.stockNames"
                    :key="stock.id"
                    :stock="stock"
                />
            </ul>
        </div>
    </section>
</template>
