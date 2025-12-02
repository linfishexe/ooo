import { defineStore } from "pinia";

export const useStockStore = defineStore("stock", {
    state: () => ({
        stockNames: [],
        stockDataRows: [],
    }),
    actions: {
        parseCSV(results) {
            this.stockDataRows = results.data;
            this.stockNames = [...new Set(results.data.map((row) => row[0]))]; // 第一欄是股票代碼
        },
    },
});
