<style scoped>
@reference "tailwindcss";

.hamburger-line {
    @apply absolute h-0.5 w-6 origin-center rounded bg-gray-700 transition-all duration-200;
}
</style>

<template>
    <button
        @click="isOpen = !isOpen"
        class="relative flex h-8 w-7 cursor-pointer items-center justify-center"
    >
        <!-- 三條線 -->
        <span
            :class="['hamburger-line', isOpen ? 'rotate-45' : '-translate-y-2']"
        ></span>
        <span :class="['hamburger-line', isOpen ? 'opacity-0' : '']"></span>
        <span
            :class="['hamburger-line', isOpen ? '-rotate-45' : 'translate-y-2']"
        ></span>
    </button>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
</script>
