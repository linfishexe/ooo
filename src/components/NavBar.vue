<template>
    <!-- nav只在 md 以下顯示 -->
    <nav
        class="flex w-full justify-end border-b border-b-gray-400 bg-white px-5 py-3 md:hidden"
    >
        <SideMenuButton />
    </nav>
</template>

<script setup>
import SideMenuButton from "@/components/SideMenuButton.vue";
</script>
