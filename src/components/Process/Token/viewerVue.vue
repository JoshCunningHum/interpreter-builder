<script setup lang="tsx">
import { useTokenStore } from "@/stores/token";
import { storeToRefs } from "pinia";
import { computed, h, toRefs } from "vue";
import type { Token, TokenDef } from "@/types/Token";
import type { JSX } from "vue/jsx-runtime";
import { get, reactify } from "@vueuse/core";

const code = defineModel<string>({ default: "" });
const props = withDefaults(
  defineProps<{
    exceptions?: number[];
    tokens?: Token[];
    tokenDefs?: TokenDef[];
  }>(),
  {
    tokens: () => [],
    tokenDefs: () => [],
    exceptions: () => [],
  },
);

const { tokenDefs, exceptions, tokens } = toRefs(props);

const getTokenDefinition = (tokenType: number) => {
  return tokenDefs.value.find((def) => def.id === tokenType);
};

const tokenElement = (token: Token) => {
  return <span class="bg-red-500">{token.value}</span>;
};

// regex for matchin only 1 equal sign, fails if it is preceded by double or triple signs

const init = (source: string, tokens: Token[]) => {
  let cursor = 0;

  // traverse through tokens
  const result = [...tokens, null]
    .map((token, i, arr) => {
      const tokenStartAt =
        token === null
          ? source.length + 1
          : source.slice(cursor).indexOf(token.value);

      const elements: (string | Token)[] = [];
      if (cursor !== tokenStartAt) {
        const sliced = source.slice(cursor, tokenStartAt - 1);
        cursor += sliced.length;
        elements.push(sliced);
      }
      if (token !== null) {
        cursor += token.value.length;
        elements.push(token);
      }

      return elements;
    })
    .flat();

  console.log(result);

  return result;
};

// const result = computed(() => init(code.value, tokens.value));

const mapper = computed(() => [0, 1, 2, 3].map((n) => h("span", [`${n}`])));
</script>

<template>
  <span>Test</span>
  <pre>{{ mapper }}</pre>
</template>

<style lang="scss" scoped></style>
