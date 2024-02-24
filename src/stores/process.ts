import { tokenize } from "@/logic/lexer";
import type { CodeFile } from "@/types/CodeFile";
import type { Token } from '@/types/Token';
import { get, set } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useProcessStore = defineStore("process", () => {

    const fileExecuted = ref<CodeFile>();
    const tokens = ref<Token[]>([]);

    const reset = () => {
        get(tokens).splice(0);
        set(fileExecuted, undefined);
    }

    const execute = (file: CodeFile) => {
        reset();
        set(fileExecuted, file);

        get(tokens).push(...tokenize(file.data));
    }

    return {
        fileExecuted,
        tokens,

        reset,
        execute
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProcessStore, import.meta.hot))
}
