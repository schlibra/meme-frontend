import { defineStore } from "pinia";
import {ref} from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const mainLoading = ref(false)
    const dataLoading = ref(false)

    return {
        mainLoading,
        dataLoading,
    }
})