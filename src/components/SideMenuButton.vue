<script setup>
import { useUiStore } from "@/stores/useUiStore";
const uiStore = useUiStore();
</script>

<template>
    <button
        @click="uiStore.toggleSideMenu()"
        class="relative flex h-8 w-7 cursor-pointer items-center justify-center outline-0"
    >
        <span
            :class="[
                'absolute h-0.5 w-6 origin-center rounded bg-gray-700 transition-all duration-200',
                uiStore.isSideMenuOpen ? 'rotate-45' : '-translate-y-2',
            ]"
        ></span>
        <span
            :class="[
                'absolute h-0.5 w-6 origin-center rounded bg-gray-700 transition-all duration-200',
                uiStore.isSideMenuOpen ? 'opacity-0' : '',
            ]"
        ></span>
        <span
            :class="[
                'absolute h-0.5 w-6 origin-center rounded bg-gray-700 transition-all duration-200',
                uiStore.isSideMenuOpen ? '-rotate-45' : 'translate-y-2',
            ]"
        ></span>
    </button>
</template>
