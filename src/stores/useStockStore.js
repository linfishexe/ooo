// src/stores/useStockStore.js
import { defineStore } from "pinia";
import Papa from "papaparse";

export const useStockStore = defineStore("stockStore", {
    state: () => ({
        stockNames: [], // 股票名稱清單
        stockDataRows: [], // 股票走勢資料
        selectedStocks: [], // 勾選的股票
        stockStates: {}, // 勾選股票的開關狀態 { id: true/false }
        isCsvLoaded: false,
    }),

    actions: {
        // 載入 CSV (檔案)
        async loadCsvFile(file) {
            return new Promise((resolve, reject) => {
                Papa.parse(file, {
                    complete: (results) => {
                        this._processCsv(results.data);
                        this.isCsvLoaded = true; // 載入完成
                        resolve();
                    },
                    error: (err) => reject(err),
                });
            });
        },

        // 載入 CSV (URL)
        async loadCsvUrl(url) {
            const response = await fetch(url);
            const csvText = await response.text();
            Papa.parse(csvText, {
                complete: (results) => {
                    this._processCsv(results.data);
                    this.isCsvLoaded = true; // 載入完成
                },
            });
        },

        // 處理 CSV 資料
        _processCsv(rows) {
            // 清掉空列
            const cleanRows = rows.filter(
                (r) => Array.isArray(r) && r.length && r.some((c) => c !== ""),
            );

            const header = cleanRows[0]; // 第一列：股票名稱
            const body = cleanRows.slice(1); // 之後每列：各時間點的價格

            // 股票名稱（用 index 當 id）
            this.stockNames = header.map((name, i) => ({ id: i, name }));

            // 走勢資料：每檔股票一筆 data（把每列的對應欄位取出來）
            this.stockDataRows = header.map((_, colIndex) => ({
                id: colIndex,
                data: body.map((row) => toNumber(row[colIndex])), // 逐列取該欄的數值
            }));
        },

        // 勾選股票
        selectStock(id) {
            if (!this.selectedStocks.includes(id)) {
                this.selectedStocks.push(id);
                this.stockStates[id] = false; // 預設打開
            }
        },

        // 取消勾選
        unselectStock(id) {
            this.selectedStocks = this.selectedStocks.filter((s) => s !== id);
            delete this.stockStates[id];
        },

        // 切換開關狀態
        toggleStockState(id) {
            if (this.stockStates[id] !== undefined) {
                this.stockStates[id] = !this.stockStates[id];
            }
        },
    },
});

function toNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}
