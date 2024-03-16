import type { ASTNode, ParseRule } from "@/types/Node";
import type { Token } from "@/types/Token";
import { get, useStorage } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useTokenStore } from "./token";
import { computed, ref } from "vue";
import { tokenize } from "@/logic/lexer";
import { produceAST } from "@/logic/ast";

export interface ParseProcessLog {
    rule: ParseRule;
    ruleIndex: number;
    matches: [number, number][];
    pool: (ASTNode | Token)[];
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

    const sanitizeTokens = (tokens: Token[]) =>
        tokens.filter((t) => !get(exludedTokens).includes(t.type));

    const testSource = ref("");
    const testTokens = computed(() =>
        sanitizeTokens(tokenize(get(testSource))),
    );
    const testParseResult = computed(() =>
        produceAST({
            tokens: testTokens.value,
            excludeTokens: exludedTokens.value,
            rules: parseRules.value,
            tokenDefs: tokenStore.tokens,
            log: true,
        }),
    );
    const testLogs = computed(() => get(testParseResult).history || []);

    return {
        exludedTokens,
        parseRules,

        // Testing Mode
        testSource,
        testTokens,
        testLogs,
        testParseResult,

        sanitizeTokens,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useParserStore, import.meta.hot));
}
