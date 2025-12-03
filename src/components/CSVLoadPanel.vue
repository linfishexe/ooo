<script setup>
import uploadCSV from "@/assets/uploadCSV.svg";
import { useStockStore } from "@/stores/useStockStore"; // 匯入 Pinia store
const stockStore = useStockStore(); // 建立 store 實例
</script>

<template>
    <div
        v-if="!stockStore.isCsvLoaded"
        class="absolute top-0 left-0 z-20 flex h-screen w-full flex-col items-center justify-center bg-white text-center"
    >
        <h2 class="text-xl font-semibold">請選擇要載入的走勢CSV</h2>

        <img
            :src="uploadCSV"
            alt="uploadCSV"
            class="w-[clamp(300px,90%,800px)]"
        />

        <div
            class="z-10 mt-4 flex items-center justify-center gap-5 text-center"
        >
            <!-- 載入預設 CSV 按鈕 -->
            <button
                id="loadDefaultBtn"
                class="h-[50px] w-[150px] cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-base text-white hover:bg-blue-400 active:bg-blue-600"
                @click="
                    stockStore.loadCsvUrl(
                        'https://linfishexe.github.io/ooo/20210501-20210531.csv',
                    )
                "
            >
                載入預設 CSV
            </button>

            <!-- 上傳 CSV 按鈕 -->
            <label
                for="csvFile"
                class="flex h-[50px] w-[150px] cursor-pointer items-center justify-center rounded-md border border-blue-500 bg-white text-base text-blue-500 select-none hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white"
            >
                上傳自己的 CSV
            </label>
            <input
                type="file"
                id="csvFile"
                accept=".csv"
                class="hidden"
                @change="(e) => stockStore.loadCsvFile(e.target.files[0])"
            />
        </div>
    </div>
</template>
