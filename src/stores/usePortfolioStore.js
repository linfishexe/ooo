// src/stores/usePortfolioStore.js
import { defineStore } from "pinia";
import { useStockDataStore } from "@/stores/useStockDataStore";
import {
    calculatePortfolioTrend,
    calculateSingleStockTrend,
    calculateSharpeRatio,
} from "@/utils/finance";

export const usePortfolioStore = defineStore("portfolio", {
    state: () => ({
        selectedStockIds: [],
        initialCapital: 10000000,
    }),
    getters: {
        selectedStocks: (state) => {
            const stockStore = useStockDataStore();
            return state.selectedStockIds
                .map((id) => stockStore.stocks[id])
                .filter(Boolean);
        },

        portfolioValues: (state) => {
            return calculatePortfolioTrend(
                state.selectedStocks,
                state.initialCapital,
            );
        },

        singleValues: (state) => {
            const result = {};
            const stockStore = useStockDataStore();
            state.selectedStockIds.forEach((id) => {
                const stock = stockStore.stocks[id];
                result[id] = calculateSingleStockTrend(
                    stock,
                    state.initialCapital,
                );
            });
            return result;
        },

        sharpeRatio: (state) => {
            return calculateSharpeRatio(state.portfolioValues);
        },
    },
    actions: {
        toggleStock(id) {
            if (this.selectedStockIds.includes(id)) {
                this.selectedStockIds = this.selectedStockIds.filter(
                    (s) => s !== id,
                );
            } else {
                this.selectedStockIds.push(id);
            }
        },
        calcSharpeRatio() {
            return this.sharpeRatio;
        },
    },
});
