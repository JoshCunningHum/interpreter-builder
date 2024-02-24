import type { CodeFile } from "@/types/CodeFile";
import { useLocalStorage } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from 'vue';

export const useIdeStore = defineStore("ide", () => {

    const files = useLocalStorage(
        'ib-files',
        new Array<CodeFile>(),
    );

    const current = ref<CodeFile>();

    return {
        files,
        current
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useIdeStore, import.meta.hot))
}
