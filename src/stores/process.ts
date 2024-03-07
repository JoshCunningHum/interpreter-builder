import { produceAST } from "@/logic/ast";
import { tokenize } from "@/logic/lexer";
import type { CodeFile } from "@/types/CodeFile";
import type { ASTNode } from "@/types/Node";
import type { Token } from "@/types/Token";
import { get, set } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useParserStore } from "./parser";
import { useTokenStore } from "./token";

export const useProcessStore = defineStore("process", () => {
  const parseStore = useParserStore();
  const tokenStore = useTokenStore();

  const fileExecuted = ref<CodeFile>();
  const tokens = ref<Token[]>([]);
  const pool = ref<(ASTNode | Token)[]>([]);

  const reset = () => {
    get(tokens).splice(0);
    set(fileExecuted, undefined);
  };

  const execute = (file: CodeFile) => {
    reset();
    set(fileExecuted, file);

    const tokenize_result = tokenize(file.data);
    get(tokens).push(...tokenize_result);
    const ast_result = produceAST({
      tokens: tokenize_result,
      excludeTokens: parseStore.exludedTokens,
      rules: parseStore.parseRules,
      tokenDefs: tokenStore.tokens,
      log: false,
    });
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
