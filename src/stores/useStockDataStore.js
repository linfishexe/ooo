// src/stores/useStockDataStore.js
import { defineStore } from "pinia";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import Papa from "papaparse";

export const useStockDataStore = defineStore("stockData", {
    state: () => ({
        stockNames: [],
        stockDataRows: [],
        isCsvLoaded: false,
    }),
    actions: {
        async loadCsvFile(file) {
            return new Promise((resolve, reject) => {
                Papa.parse(file, {
                    complete: (results) => {
                        this._processCsv(results.data);
                        this.isCsvLoaded = true;
                        resolve();
                    },
                    error: (err) => reject(err),
                });
            });
        },
        async loadCsvUrl(url) {
            const response = await fetch(url);
            const csvText = await response.text();
            Papa.parse(csvText, {
                complete: (results) => {
                    this._processCsv(results.data);
                    this.isCsvLoaded = true;
                },
            });
        },
        _processCsv(rows) {
            const cleanRows = rows.filter(
                (r) => Array.isArray(r) && r.length && r.some((c) => c !== ""),
            );
            const header = cleanRows[0];
            const body = cleanRows.slice(1);

            this.stockNames = header.map((name, i) => ({ id: i, name }));
            this.stockDataRows = header.map((_, colIndex) => ({
                id: colIndex,
                data: body.map((row) => {
                    const n = Number(row[colIndex]);
                    return Number.isFinite(n) ? n : null;
                }),
            }));

            // 生成顏色
            const portfolioStore = usePortfolioStore();
            portfolioStore.assignColors();
        },
    },
});
