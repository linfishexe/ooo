<!-- src/components/ToggleSwitch.vue -->
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    modelValue: { type: Boolean, default: true }, // 初始狀態
    label: { type: String, required: true }, // 顯示文字
    color: { type: String, default: "rgb(200,100,100)" }, // 開關顏色，預設紅色
});

const emit = defineEmits(["update:modelValue"]);

const isOn = ref(props.modelValue);

watch(
    () => props.modelValue,
    (val) => {
        isOn.value = val;
    },
);

function toggle() {
    isOn.value = !isOn.value;
    emit("update:modelValue", isOn.value);
}
</script>

<template>
    <div
        class="flex h-6 cursor-pointer items-center gap-1 leading-none select-none"
        @click="toggle"
    >
        <!-- 開關容器 -->
        <div
            class="relative h-6 w-12 rounded-full border border-gray-400 transition-colors duration-150"
            :style="{ backgroundColor: isOn ? props.color : '#ccc' }"
        >
            <!-- 球 -->
            <div
                class="absolute top-0.5 h-[18px] w-[18px] rounded-full border border-gray-400 bg-white shadow transition-transform duration-150"
                :class="isOn ? 'translate-x-[26px]' : 'translate-x-0.5'"
            ></div>
        </div>
        <!-- 文字 -->
        <span>{{ label }}</span>
    </div>
</template>
