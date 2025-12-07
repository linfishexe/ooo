<!-- src/App.vue -->
<template>
    <div class="flex h-dvh min-w-[300px] flex-col">
        <NavBar>
            <SideMenuButton />
        </NavBar>
        <main class="relative flex h-full min-h-0 overflow-x-hidden">
            <section class="h-full min-h-0 w-full">
                <StockChart class="h-[75%]" />
                <DisplayControlPanel class="h-[25%]">
                    <SHAPCalculator class="absolute top-0 right-0 w-[120px]" />
                </DisplayControlPanel>
            </section>
            <SideMenu />
        </main>
    </div>
    <CSVLoadPanel />
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import SideMenuButton from "@/components/SideMenuButton.vue";
import StockChart from "@/components/StockChart.vue";
import SideMenu from "@/components/SideMenu.vue";
import DisplayControlPanel from "@/components/DisplayControlPanel.vue";
import CSVLoadPanel from "@/components/CSVLoadPanel.vue";
import SHAPCalculator from "@/components/SHAPCalculator.vue";
</script>
