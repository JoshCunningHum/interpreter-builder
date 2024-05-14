import { tokenize } from "@/logic/lexer";
import type { CodeFile } from "@/types/CodeFile";
import { PrepareParser } from "@/utils/builder/parseinit";
import { get, set, useLocalStorage } from "@vueuse/core";
import { acceptHMRUpdate, defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useParserStore } from "./parser";
import { useInterpreterStore } from "./interpreter";
import { useGlobalStore } from "./global";
import { useTokenStore } from "./token";
import { produceAST } from "@/logic/ast";
import { PrepareGlobal } from "@/logic/environment";
import { PrepareInterpreter } from "@/utils/builder/interpreterinit";
import type { ASTNode } from "@/types/Node";
import { evaluateAST } from "@/logic/interpreter";

export type OutputKind =
    | {
          text: string;
      }
    | {
          error: string;
          type: "runtime" | "eval";
      }
    | {
          isScanning: boolean;
          answer: (msg: string) => void;
          inputted: string;
      };

export const useIdeStore = defineStore("ide", () => {
    const tokenStore = useTokenStore();
    const parserStore = useParserStore();
    const interpreterStore = useInterpreterStore();
    const globalStore = useGlobalStore();

    const files = useLocalStorage("ib-files", new Array<CodeFile>());

    const current = ref<CodeFile>();

    const source = ref<string>();
    const outputs = ref<OutputKind[]>([]);

    // Interpreter Definitions
    const { tokens: tokenDefs } = storeToRefs(tokenStore);
    const { exludedTokens, parseRules } = storeToRefs(parserStore);
    const { evalDefs } = storeToRefs(interpreterStore);
    const { glob } = storeToRefs(globalStore);

    const taskcontroller = new AbortController();

    const reset = () => {
        set(outputs, []);
        set(source, "");
    };

    const onError = (msg: string, line: number, column: number) => {
        taskcontroller.abort(msg);
        const code = source.value;

        if (line > -1 && column > -1 && code) {
            const codeline = code.split("\n")[line - 1];
            msg = ` ${msg}\n${line}|${codeline}\n${"-".repeat(column + String(line).length)}^\n`;
        }

        outputs.value.push({
            error: msg,
            type: "runtime",
        });
    };

    const onEvalError = (e: Error) => {
        taskcontroller.abort("");
        // @ts-expect-error Will actuallyl print a line number if on mozilla
        console.error(e, e.lineNumber, e.columnNumber);
        outputs.value.push({
            error: e.message,
            type: "eval",
        });
    };

    const onPrint = (msg: string) => {
        outputs.value.push({
            text: msg,
        });
    };

    const onScan = async (
        msg: string,
        onAnswer: (msg: string) => void,
    ): Promise<void> => {
        outputs.value.push({
            isScanning: false,
            answer: onAnswer,
            inputted: "",
        });
    };

    const isRunning = ref(false);

    const execute = () => {
        reset();

        const file = get(current);
        if (!file) return;

        set(source, file.data);
        set(isRunning, true);

        new Promise((resolve, reject) => {
            // Listen for abort signal
            const abortListener = function (
                this: AbortSignal,
                { target }: Event,
            ) {
                taskcontroller.signal.removeEventListener(
                    "abort",
                    abortListener,
                );
                reject("aborted");
            };
            taskcontroller.signal.addEventListener("abort", abortListener);

            // tokenize
            const tokens = tokenize(file.data);
            // Parser
            const parser = PrepareParser({
                tokens,
                excludeTokens: exludedTokens.value,
                onError,
                onEvalError,
                rules: parseRules.value,
                tokenDefs: tokenDefs.value,
                source: source.value || "",
            });
            const ast = produceAST(parser).pool as ASTNode[];
            // Environment
            const global = PrepareGlobal({
                def: glob.value,
                onError,
                onEvalError,
                onLog: console.log,
            });
            // Interpreter
            const runtime = PrepareInterpreter({
                defs: evalDefs.value,
                glob: global,
                onError,
                onEvalError,
                onPrint,
                onScan,
                tree: ast,
            });
            evaluateAST(runtime).then(() => {
                // Done running
                resolve(true);
            });
        }).then(() => {
            set(isRunning, false);
        });
    };

    return {
        files,
        current,

        // Runtime
        source,
        outputs,
        execute,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useIdeStore, import.meta.hot));
}
