import type { ParseRule } from "@/types/Node";
import type { Token } from "@/types/Token";
import { get, useStorage } from "@vueuse/core"
import { defineStore, acceptHMRUpdate } from "pinia"

export const useParserStore = defineStore("parser", () => {

    const exludedTokens = useStorage(
        'ib-exluded-tokens',
        new Array<number>(),
        localStorage
    );

    const parseRules = useStorage(
        'ib-parse-rules',
        new Array<ParseRule>(),
        localStorage
    );

    const sanitizeTokens = (tokens: Token[]) => tokens.filter(t => !get(exludedTokens).includes(t.type));



    return {
        exludedTokens,
        parseRules,

        sanitizeTokens
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useParserStore, import.meta.hot))
}
