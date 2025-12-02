<template>
    <aside>
        <h2>股票列表</h2>
        <ul>
            <li v-for="(stock, i) in stocks" :key="i">
                <button @click="$emit('select', i)">
                    {{ stock }}
                </button>
            </li>
        </ul>
    </aside>
</template>

<script setup>
const props = defineProps({
    stocks: Array,
});
</script>
