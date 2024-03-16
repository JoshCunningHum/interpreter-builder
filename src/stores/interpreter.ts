import { type EvalDef } from "@/types/Evals";
import { useStorage } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useInterpreterStore = defineStore("interpreter", () => {
    const evalDefs = useStorage(
        "ib-eval-defs",
        new Array<EvalDef>(),
        localStorage,
    );

    return {
        evalDefs,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useInterpreterStore, import.meta.hot),
    );
}
