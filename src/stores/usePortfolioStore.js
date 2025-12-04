// src/stores/usePortfolioStore.js
import { defineStore } from "pinia";
import { useStockDataStore } from "@/stores/useStockDataStore";
export const usePortfolioStore = defineStore("portfolio", {
    state: () => ({
        selectedStocks: [],
        stockStates: {},
        portfolioValues: [], // 平均分配資金水位
        singleValues: {}, // 每檔股票單獨投入走勢 { id: [values] }
    }),
    actions: {
        selectStock(id) {
            if (!this.selectedStocks.includes(id)) {
                this.selectedStocks.push(id);
                this.stockStates[id] = true;
            }
            this.calcPortfolioValues();
        },
        unselectStock(id) {
            this.selectedStocks = this.selectedStocks.filter((s) => s !== id);
            delete this.stockStates[id];
            this.calcPortfolioValues();
        },
        toggleStockState(id) {
            if (this.stockStates[id] !== undefined) {
                this.stockStates[id] = !this.stockStates[id];
            }
        },
        calcPortfolioValues(initialCapital = 10000000) {
            const stockDataStore = useStockDataStore();
            if (this.selectedStocks.length === 0) {
                this.portfolioValues = [];
                this.singleValues = {};
                return;
            }

            // 平均分配計算
            const capitalPerStock = Math.floor(
                initialCapital / this.selectedStocks.length,
            );
            let remain =
                initialCapital - capitalPerStock * this.selectedStocks.length;

            const holdings = this.selectedStocks.map((id) => {
                const firstPrice = stockDataStore.stockDataRows[id].data[0];
                const shares = Math.floor(capitalPerStock / firstPrice);
                const usedCash = shares * firstPrice;
                remain += capitalPerStock - usedCash;
                return { id, shares };
            });

            const days = stockDataStore.stockDataRows[0].data.length;
            this.portfolioValues = Array.from(
                { length: days },
                (_, dayIndex) => {
                    let value = remain;
                    holdings.forEach((h) => {
                        const price =
                            stockDataStore.stockDataRows[h.id].data[dayIndex];
                        if (!isNaN(price)) value += h.shares * price;
                    });
                    return Math.round(value);
                },
            );

            // 單一股票投入計算
            this.singleValues = {};
            this.selectedStocks.forEach((id) => {
                const firstPrice = stockDataStore.stockDataRows[id].data[0];
                const shares = Math.floor(initialCapital / firstPrice);
                const remainSingle = initialCapital - shares * firstPrice;

                this.singleValues[id] = stockDataStore.stockDataRows[
                    id
                ].data.map((price) =>
                    Math.round(remainSingle + shares * price),
                );
            });
        },
    },
});
