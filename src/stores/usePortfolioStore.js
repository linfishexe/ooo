// src/stores/usePortfolioStore.js
import { defineStore } from "pinia";
import { useStockDataStore } from "@/stores/useStockDataStore";

export const usePortfolioStore = defineStore("portfolio", {
    state: () => ({
        selectedStockIds: [], // 改名 id 比較明確
        portfolioValues: [], // 綜合走勢
        singleValues: {}, // 個股模擬走勢 { id: [] }
    }),
    actions: {
        toggleStock(id) {
            if (this.selectedStockIds.includes(id)) {
                this.selectedStockIds = this.selectedStockIds.filter(
                    (s) => s !== id,
                );
            } else {
                this.selectedStockIds.push(id);
            }
            this.calcPortfolioValues();
        },

        calcPortfolioValues(initialCapital = 10000000) {
            const stockStore = useStockDataStore();
            if (this.selectedStockIds.length === 0) {
                this.portfolioValues = [];
                this.singleValues = {};
                return;
            }

            // 1. 計算每檔分配金額
            const capitalPerStock = Math.floor(
                initialCapital / this.selectedStockIds.length,
            );

            // 2. 計算個股持倉 (Shares & Remain)
            const holdings = this.selectedStockIds.map((id) => {
                const stock = stockStore.stocks[id];
                const firstPrice = stock.data[0];
                const shares = Math.floor(capitalPerStock / firstPrice);
                const remain = capitalPerStock - shares * firstPrice;
                return { id, shares, remain, data: stock.data };
            });

            // 修正餘額誤差 (加回第一檔)
            const totalAllocated = holdings.reduce(
                (sum, h) => sum + h.shares * h.data[0] + h.remain,
                0,
            );
            holdings[0].remain += initialCapital - totalAllocated;

            // 3. 計算每日資產總值 (Portfolio Trend)
            const days = holdings[0].data.length;
            this.portfolioValues = Array.from({ length: days }, (_, i) => {
                return holdings.reduce((sum, h) => {
                    const price = h.data[i];
                    return (
                        sum + h.remain + (isNaN(price) ? 0 : h.shares * price)
                    );
                }, 0);
            });

            // 4. 計算單一股票全押走勢 (用於圖表比較)
            this.singleValues = {};
            this.selectedStockIds.forEach((id) => {
                const stock = stockStore.stocks[id];
                const firstPrice = stock.data[0];
                const shares = Math.floor(initialCapital / firstPrice);
                const remain = initialCapital - shares * firstPrice;
                this.singleValues[id] = stock.data.map(
                    (price) => remain + shares * price,
                );
            });
        },

        calcSharpeRatio(riskFreeRate = 0) {
            if (!this.portfolioValues || this.portfolioValues.length < 2)
                return null;
            const returns = [];
            for (let i = 1; i < this.portfolioValues.length; i++) {
                const prev = this.portfolioValues[i - 1];
                const curr = this.portfolioValues[i];
                if (prev > 0) returns.push((curr - prev) / prev);
            }
            if (returns.length === 0) return null;
            const avgReturn =
                returns.reduce((sum, r) => sum + r, 0) / returns.length;
            const variance =
                returns.reduce(
                    (sum, r) => sum + Math.pow(r - avgReturn, 2),
                    0,
                ) / returns.length;
            const stdDev = Math.sqrt(variance);
            return stdDev === 0 ? null : (avgReturn - riskFreeRate) / stdDev;
        },
    },
});
