<template>
    <nav
        :class="[
            'flex w-full justify-end px-5 py-3',
            'border-b border-b-gray-400 bg-white',
            'md:hidden', // nav只在 md 以下顯示
        ]"
    >
        <SideMenuButton />
    </nav>
</template>

<script setup>
import SideMenuButton from "@/components/SideMenuButton.vue";
</script>
