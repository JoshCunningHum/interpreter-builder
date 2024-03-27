import type { ASTNode, ParseRule } from "@/types/Node";
import type { Token } from "@/types/Token";
import { get, set, useStorage, watchImmediate } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useTokenStore } from "./token";
import { computed, isRuntimeOnly, reactive, ref, toRefs } from "vue";
import { tokenize } from "@/logic/lexer";
import { produceAST } from "@/logic/ast";
import { PrepareParser } from "@/utils/builder/parseinit";

export interface ParseProcessLog {
    rule: ParseRule;
    ruleIndex: number;
    matches: [number, number][];
    pool: (ASTNode | Token)[];
    logs: any[];
    id: string;
}

export const useParserStore = defineStore("parser", () => {
    const tokenStore = useTokenStore();

    const exludedTokens = useStorage(
        "ib-exluded-tokens",
        new Array<number>(),
        localStorage,
    );

    const parseRules = useStorage(
        "ib-parse-rules",
        new Array<ParseRule>(),
        localStorage,
    );

    // Test Parsing
    const testSource = ref("");
    const tokens = computed(() => tokenize(testSource.value));

    const errorList = reactive<
        {
            id: string;
            e: Error;
            type: "map" | "match" | "other" | "runtime";
        }[]
    >([]);
    const parserValues = reactive<{
        data?: ReturnType<typeof PrepareParser>;
    }>({});

    const isTesting = ref(false);
    watchImmediate(tokens, (tkns) => {
        if (!get(isTesting)) return;

        errorList.splice(0);

        console.log(`Preparing Parser`);
        parserValues.data = PrepareParser({
            tokens: [...tkns],
            excludeTokens: [...exludedTokens.value],
            rules: [...parseRules.value],
            tokenDefs: [...tokenStore.tokens],
            log: true,
            onError: (msg, line, col, id = "") => {
                errorList.push({
                    id,
                    e: new Error(msg),
                    type: "runtime",
                });
            },
            onEvalError: (e, type, id = "") => {
                errorList.push({
                    id,
                    e,
                    type,
                });
            },
        });
    });

    const isRunning = ref(false);
    watchImmediate(
        parserValues,
        (v) => {
            if (!get(isTesting) || !v.data || isRunning.value) return;
            isRunning.value = true;
            produceAST(v.data);
            new Promise((resolve) => {
                if (!v.data) resolve(false);
                else {
                    console.log(`Producing AST`);
                    const buffer = parserValues.data;
                    produceAST(v.data);
                    parserValues.data = buffer;
                }
                setTimeout(() => resolve(true), 50);
            }).then(() => set(isRunning, false));
        },
        { deep: true },
    );

    const testLogs = computed(() => get(parserValues).data?.history || []);

    return {
        exludedTokens,
        parseRules,

        // Testing Mode
        isTesting,
        testSource,
        testTokens: tokens,
        testLogs,
        parserValues: computed(() => parserValues.data),
        errorList,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useParserStore, import.meta.hot));
}
