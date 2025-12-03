<template>
    <div class="flex h-dvh w-full flex-col">
        <NavBar />
        <main class="h-full min-h-0 w-full">
            <section class="h-full min-h-0 w-full">
                <div class="box-border h-[75%] w-full p-3">
                    <StockChart />
                </div>
                <div class="h-[25%]"></div>
            </section>
            <SideMenu />
        </main>
    </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import StockChart from "@/components/StockChart.vue";
import SideMenu from "@/components/SideMenu.vue";
import Papa from "papaparse";

function loadDefault() {
    fetch("https://linfishexe.github.io/ooo/20210501-20210531.csv")
        .then((res) => res.text())
        .then((csvText) =>
            Papa.parse(csvText, {
                complete: (results) => stockStore.parseCSV(results),
            }),
        );
}
</script>
