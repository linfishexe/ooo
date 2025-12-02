<template>
    <div class="p-4">
        <h2>請選擇要載入的走勢CSV</h2>
        <input type="file" @change="loadCSV" accept=".csv" />
        <button @click="loadDefault">載入預設 CSV</button>

        <StockList :stocks="stockStore.stockNames" @select="showCharts" />
        <StockChart :labels="labels" :datasets="datasets" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStockStore } from "./stores/useStockStore";
import StockList from "./components/StockList.vue";
import StockChart from "./components/StockChart.vue";
import Papa from "papaparse";

const stockStore = useStockStore();
const labels = ref([]);
const datasets = ref([]);

function loadCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
        complete: (results) => stockStore.parseCSV(results),
    });
}

function loadDefault() {
    fetch("https://linfishexe.github.io/ooo/20210501-20210531.csv")
        .then((res) => res.text())
        .then((csvText) =>
            Papa.parse(csvText, {
                complete: (results) => stockStore.parseCSV(results),
            }),
        );
}

function showCharts(index) {
    // TODO: 根據選擇的股票生成 datasets
}
</script>
