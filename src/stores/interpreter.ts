import { evaluateAST } from "@/logic/interpreter";
import { type EvalDef } from "@/types/Evals";
import type { ASTNode } from "@/types/Node";
import { PrepareInterpreter } from "@/utils/builder/interpreterinit";
import { isNode } from "@/utils/builder/parserutils";
import { get, set, useStorage, watchImmediate } from "@vueuse/core";
import { acceptHMRUpdate, defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useGlobalStore } from "./global";
import { useParserStore } from "./parser";
import type {
    ErrorHandlerCallbackFn,
    ScanHandlerCallbackFn,
} from "@/utils/builder/interpretertools";

export const useInterpreterStore = defineStore("interpreter", () => {
    const evalDefs = useStorage(
        "ib-eval-defs",
        new Array<EvalDef>(),
        localStorage,
    );

    const parserStore = useParserStore();
    const globalStore = useGlobalStore();
    const { parserValues, isTesting: isTestingParser } =
        storeToRefs(parserStore);
    const { glob_obj } = storeToRefs(globalStore);

    const errorLists = reactive<
        { id: string; e: Error; type: "Runtime" | "Logic" }[]
    >([]);
    const interpreterValues = ref<ReturnType<typeof PrepareInterpreter>>();

    const isTesting = ref(false);
    watchImmediate([parserValues, isTesting], () => {
        const ast = parserValues.value;

        // Do not continue if we are not testing or there is no AST yet
        if (!get(isTesting) || !ast) return;

        // Prepare Callbacks
        const onPrint = console.log;
        const onScan: ScanHandlerCallbackFn = async (msg, answer) =>
            answer(prompt(msg) || "");
        const onError: ErrorHandlerCallbackFn = (msg, line, col, id = "") =>
            errorLists.push({ id, e: new Error(msg), type: "Runtime" });
        const onEvalError = (e: Error, id = "") =>
            errorLists.push({ id, e, type: "Logic" });

        // Prepare Global Environment
        globalStore.create_env();
        const glob = glob_obj.value;

        // Prepare AST, make sure no tokens left
        const tree = ast.pool.filter((n): n is ASTNode => isNode(n));

        // Reset states
        errorLists.splice(0);
        interpreterValues.value = undefined;

        // Instantiate the interpreter runtime
        interpreterValues.value = PrepareInterpreter({
            onPrint,
            onScan,
            onError,
            onEvalError,
            tree,
            defs: evalDefs.value,
            glob,
        });
    });

    const isRunning = ref(false);
    watchImmediate(interpreterValues, (v) => {
        if (!get(isTesting)) return;
        if (get(isRunning) || !v) return;
        set(isRunning, true);
        evaluateAST(v, true).then(() => {
            const buffer = interpreterValues.value;
            interpreterValues.value = buffer;
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
        interpreterValues,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useInterpreterStore, import.meta.hot),
    );
}
