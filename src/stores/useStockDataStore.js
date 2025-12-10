import { defineStore } from "pinia";
import Papa from "papaparse";

export const useStockDataStore = defineStore("stockData", {
    state: () => ({
        stocks: [], // 結構: { id, name, data: [], color: '' }
        isCsvLoaded: false,
    }),
    actions: {
        async loadCsvFile(file) {
            Papa.parse(file, {
                complete: (results) => this._processCsv(results.data),
            });
        },
        async loadCsvUrl(url) {
            const response = await fetch(url);
            const csvText = await response.text();
            Papa.parse(csvText, {
                complete: (results) => this._processCsv(results.data),
            });
        },
        _processCsv(rows) {
            const cleanRows = rows.filter(
                (r) => Array.isArray(r) && r.length && r.some((c) => c !== ""),
            );
            const header = cleanRows[0];
            const body = cleanRows.slice(1);
            const count = header.length;

            this.stocks = header.map((name, colIndex) => ({
                id: colIndex,
                name,
                data: body.map((row) => {
                    const n = Number(row[colIndex]);
                    return Number.isFinite(n) ? n : null;
                }),
                // 直接在此產生顏色，簡單明瞭
                color: `hsla(${Math.floor((360 / count) * colIndex)}, 70%, 50%, 0.6)`,
            }));

            this.isCsvLoaded = true;
        },
    },
});
