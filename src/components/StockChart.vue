<template>
    <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";

const props = defineProps({
    labels: Array,
    datasets: Array,
});

const chartCanvas = ref(null);
let chart = null;

onMounted(() => {
    chart = new Chart(chartCanvas.value, {
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
