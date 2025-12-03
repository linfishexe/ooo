// src/stores/ui.js
import { defineStore } from "pinia";

export const useUiStore = defineStore("uiStore", {
    state: () => ({
        isSideMenuOpen: false,
    }),
    actions: {
        toggleSideMenu() {
            this.isSideMenuOpen = !this.isSideMenuOpen;
        },
    },
});
