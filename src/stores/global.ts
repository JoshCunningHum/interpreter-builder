import { DEFAULT_GLOBAL_TEMPLATE } from "@/logic/defaults";
import { PrepareGlobal } from "@/logic/environment";
import { set, useStorage, watchImmediate } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
    const glob = useStorage<string>(
        "ib-global",
        DEFAULT_GLOBAL_TEMPLATE,
        localStorage,
    );

    const glob_obj = ref<Record<string, any>>({});
    const parse_err = ref<Error>();

    const create_env = () => {
        const def = glob.value;
        set(parse_err, undefined);
        set(
            glob_obj,
            PrepareGlobal({
                def,
                onError: console.error,
                onEvalError: (e) => {
                    set(parse_err, e);
                },
                onLog: console.log,
            }),
        );
    };

    watchImmediate(glob, create_env);

    return {
        glob,
        glob_obj,
        parse_err,
        create_env,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot));
}
