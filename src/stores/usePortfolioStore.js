// src/stores/usePortfolioStore.js
import { defineStore } from "pinia";
import { useStockDataStore } from "@/stores/useStockDataStore";
export const usePortfolioStore = defineStore("portfolio", {
    state: () => ({
        selectedStocks: [],
        stockStates: {},
        portfolioValues: [], // 平均分配資金水位
        singleValues: {}, // 每檔股票單獨投入走勢 { id: [values] }
        stockColors: {}, // 每檔股票的顏色
    }),
    actions: {
        assignColors() {
            const stockDataStore = useStockDataStore();
            const count = stockDataStore.stockNames.length;
            const colors = this._generateDistinctColors(count);
            stockDataStore.stockNames.forEach((stock, idx) => {
                this.stockColors[stock.id] = colors[idx];
            });
        },
        _generateDistinctColors(count) {
            const colors = [];
            for (let i = 0; i < count; i++) {
                const hue = Math.floor((360 / count) * i);
                colors.push(`hsla(${hue}, 70%, 50%, 0.6)`);
            }
            return colors;
        },
        toggleStockState(id) {
            if (this.selectedStocks.includes(id)) {
                this.selectedStocks = this.selectedStocks.filter(
                    (s) => s !== id,
                );
            } else {
                this.selectedStocks.push(id);
            }
            this.calcPortfolioValues();
        },

        // 主方法：調度
        calcPortfolioValues(initialCapital = 10000000) {
            const stockDataStore = useStockDataStore();
            if (this.selectedStocks.length === 0) {
                this.portfolioValues = [];
                this.singleValues = {};
                return;
            }

            const holdings = this._calcHoldings(stockDataStore, initialCapital);
            this.portfolioValues = this._calcPortfolioTrend(
                stockDataStore,
                holdings,
                initialCapital,
            );
            this.singleValues = this._calcSingleTrends(
                stockDataStore,
                initialCapital,
            );
        },

        // 計算持股分配
        _calcHoldings(stockDataStore, initialCapital) {
            const capitalPerStock = Math.floor(
                initialCapital / this.selectedStocks.length,
            );
            let remain =
                initialCapital - capitalPerStock * this.selectedStocks.length;

            return this.selectedStocks.map((id) => {
                const firstPrice = stockDataStore.stockDataRows[id].data[0];
                const shares = Math.floor(capitalPerStock / firstPrice);
                const usedCash = shares * firstPrice;
                remain += capitalPerStock - usedCash;
                return { id, shares, remain };
            });
        },

        // 計算整體走勢
        _calcPortfolioTrend(stockDataStore, holdings, initialCapital) {
            const days = stockDataStore.stockDataRows[0].data.length;
            return Array.from({ length: days }, (_, dayIndex) => {
                let value = holdings[0].remain; // 初始剩餘資金
                holdings.forEach((h) => {
                    const price =
                        stockDataStore.stockDataRows[h.id].data[dayIndex];
                    if (!isNaN(price)) value += h.shares * price;
                });
                return Math.round(value);
            });
        },

        // 計算單一股票走勢
        _calcSingleTrends(stockDataStore, initialCapital) {
            const result = {};
            this.selectedStocks.forEach((id) => {
                const firstPrice = stockDataStore.stockDataRows[id].data[0];
                const shares = Math.floor(initialCapital / firstPrice);
                const remainSingle = initialCapital - shares * firstPrice;

                result[id] = stockDataStore.stockDataRows[id].data.map(
                    (price) => Math.round(remainSingle + shares * price),
                );
            });
            return result;
        },
    },
});
