<script setup>
import { useUiStore } from "@/stores/useUiStore";
const uiStore = useUiStore();
</script>

<template>
    <section
        :class="[
            'box-border h-full w-[300px] border-l border-l-gray-400 bg-white',
            'transition-[right] duration-200',
            'absolute', // 小螢幕
            'md:relative md:duration-0', // 大螢幕
            uiStore.isSideMenuOpen ? 'right-0' : '-right-[300px] md:right-0',
        ]"
    >
        <div class="p-3"></div>
    </section>
</template>
