<template>
    <div class="flex h-dvh flex-col">
        <NavBar />
        <main class="relative flex h-full min-h-0 overflow-x-hidden">
            <section class="h-full min-h-0 w-full">
                <StockChart class="h-[75%] p-3" />
                <DisplayControlPanel class="h-[25%]" />
            </section>
            <SideMenu />
        </main>
    </div>
    <CSVLoadPanel />
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import StockChart from "@/components/StockChart.vue";
import SideMenu from "@/components/SideMenu.vue";
import DisplayControlPanel from "@/components/DisplayControlPanel.vue";
import CSVLoadPanel from "@/components/CSVLoadPanel.vue";
</script>
