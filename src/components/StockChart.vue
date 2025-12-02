<template>
    <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";

const props = defineProps({
    labels: Array,
    datasets: Array,
});

const canvas = ref(null);
let chart = null;

onMounted(() => {
    chart = new Chart(canvas.value, {
        type: "line",
        data: {
            labels: props.labels,
            datasets: props.datasets,
        },
    });
});

watch(
    () => props.datasets,
    (newVal) => {
        chart.data.datasets = newVal;
        chart.update();
    },
);
</script>
