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

    const isRunning = ref(false);
    const isTesting = ref(false);
    watchImmediate(tokens, (tkns) => {
        if (!get(isTesting)) return;

        errorList.splice(0);

        parserValues.data = PrepareParser({
            tokens: [...tkns],
            excludeTokens: [...exludedTokens.value],
            rules: [...parseRules.value],
            tokenDefs: [...tokenStore.tokens],
            log: true,
            onError: (msg, line, col, id = "") => {
                console.error(msg);
                errorList.push({
                    id,
                    e: new Error(msg),
                    type: "runtime",
                });
            },
            onEvalError: (e, type, id = "") => {
                console.error(e);
                errorList.push({
                    id,
                    e,
                    type,
                });
            },
        });

        new Promise((resolve) => {
            if (!get(isTesting) || !parserValues.data || get(isRunning))
                return resolve(false);

            set(isRunning, true);
            produceAST(parserValues.data);
            parserValues.data = JSON.parse(JSON.stringify(parserValues.data));
            set(isRunning, false);
            resolve(true);
        });
    });

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
