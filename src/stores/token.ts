import type { ReservedWord, TokenDef } from "@/types/Token"
import { alphabeticalComparator } from "@/utils/comparators";
import { useLocalStorage, useStorage } from "@vueuse/core"
import { defineStore, acceptHMRUpdate } from "pinia"
import { computed } from "vue";

export const useTokenStore = defineStore("token", () => {

    const tokens = useStorage(
        'ib-tokens',
        new Array<TokenDef>(),
        localStorage,
    );

    const tokensSorted = computed(() => [...tokens.value].sort((a, b) => alphabeticalComparator()(a.name, b.name)))

    const reserves = useStorage(
        'ib-reserve-words',
        new Array<ReservedWord>(),
        localStorage
    )

    const TokenEnum = computed(() => tokens.value.reduce((acc, token) => {
        acc[token.name] = token.id;
        return acc;
    }, {} as Record<string, number>));

    return {
        tokens,
        tokensSorted,

        reserves,
        TokenEnum
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTokenStore, import.meta.hot))
}
