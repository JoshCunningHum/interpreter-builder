import type { ParsePoolItem } from "@/utils/builder/parserutils";
import type { CodeFile } from "@/types/CodeFile";
import type { Token } from "@/types/Token";
import { produceAST } from "@/logic/ast";
import { tokenize } from "@/logic/lexer";
import { PrepareParser } from "@/utils/builder/parseinit";
import { get, set } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useParserStore } from "./parser";
import { useTokenStore } from "./token";
import { ref } from "vue";

export const useProcessStore = defineStore("process", () => {
  const tokenStore = useTokenStore();
  const parseStore = useParserStore();

  const fileExecuted = ref<CodeFile>();
  const tokens = ref<Token[]>([]);
  const pool = ref<ParsePoolItem[]>([]);

  const reset = () => {
    get(tokens).splice(0);
    set(fileExecuted, undefined);
  };

  const execute = (file: CodeFile) => {
    reset();
    set(fileExecuted, file);

    const _tokens = tokenize(file.data);
    get(tokens).push(..._tokens);

    const _parsed = PrepareParser({
      tokens: _tokens,
      rules: parseStore.parseRules,
      excludeTokens: parseStore.exludedTokens,
      log: true,
      tokenDefs: tokenStore.tokens,
      onError: console.error,
      onEvalError: console.error,
    });

    produceAST(_parsed);

    set(pool, _parsed.pool);
  };

  return {
    fileExecuted,
    tokens,

    reset,
    execute,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProcessStore, import.meta.hot));
}
