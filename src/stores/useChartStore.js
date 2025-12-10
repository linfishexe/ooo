// src/stores/useChartStore.js
import { defineStore } from "pinia";

export const useChartStore = defineStore("chart", {
    state: () => ({
        hiddenLabels: [], // 簡單的字串陣列，存被隱藏的 label
    }),
    actions: {
        toggleVisibility(label) {
            if (this.hiddenLabels.includes(label)) {
                this.hiddenLabels = this.hiddenLabels.filter(
                    (l) => l !== label,
                );
            } else {
                this.hiddenLabels.push(label);
            }
        },
        isVisible(label) {
            return !this.hiddenLabels.includes(label);
        },
    },
});
