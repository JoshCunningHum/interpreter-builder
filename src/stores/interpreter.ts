import { type EvalDef } from "@/types/Evals";
import { get, set, useStorage, watchImmediate } from "@vueuse/core";
import { defineStore, acceptHMRUpdate, storeToRefs } from "pinia";
import { computed, reactive, ref, toRefs, watch } from "vue";
import { useParserStore } from "./parser";
import { evaluateAST } from "@/logic/interpreter";
import { PrepareInterpreter } from "@/utils/builder/interpreterinit";
import type { ASTNode } from "@/types/Node";
import { isNode } from "@/utils/builder/parserutils";

export const useInterpreterStore = defineStore("interpreter", () => {
    const evalDefs = useStorage(
        "ib-eval-defs",
        new Array<EvalDef>(),
        localStorage,
    );

    const parserStore = useParserStore();
    const { parserValues, isTesting: isTestingParser } =
        storeToRefs(parserStore);

    const errorLists = reactive<
        { id: string; e: Error; type: "Runtime" | "Logic" }[]
    >([]);
    const interpreterValues = reactive<{
        data?: ReturnType<typeof PrepareInterpreter>;
    }>({});

    const isTesting = ref(false);
    watchImmediate(parserValues, (ast) => {
        if (!get(isTesting) || !ast) return;

        const tree = ast.pool.filter((n): n is ASTNode => isNode(n));

        errorLists.splice(0);

        console.log(`Preparing Evaluator`);
        interpreterValues.data = undefined;
        interpreterValues.data = PrepareInterpreter({
            onPrint: console.log,
            onScan: async (msg, answer) => answer(prompt(msg) || ""),
            onError: (msg, line, col, id) => {
                console.error(msg);
                errorLists.push({
                    id: id || "",
                    e: new Error(msg),
                    type: "Runtime",
                });
            },
            onEvalError: (e, id = "") => {
                console.error(e);
                errorLists.push({ id, e, type: "Logic" });
            },
            tree,
            defs: evalDefs.value,
        });
    });

    const isRunning = ref(false);
    watchImmediate(interpreterValues, (v) => {
        if (!get(isTesting)) return;
        if (get(isRunning) || !v.data) return;
        set(isRunning, true);
        console.log(`Evaluating AST`);
        evaluateAST(v.data, true).then(() => {
            const buffer = interpreterValues.data;
            interpreterValues.data = buffer;
            set(isRunning, false);
        });
    });

    watch(isTesting, (v) => {
        set(isTestingParser, v);
    });

    return {
        isTesting,
        evalDefs,
        errorLists,
        interpreterValues: computed(() => interpreterValues.data),
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useInterpreterStore, import.meta.hot),
    );
}
