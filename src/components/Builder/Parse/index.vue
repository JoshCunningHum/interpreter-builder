<script setup lang="ts">
import { useParserStore } from "@/stores/parser";
import { useTokenStore } from "@/stores/token";
import { useArrayMap } from "@vueuse/core";
import { storeToRefs } from "pinia";

const parseStore = useParserStore();
const tokenStore = useTokenStore();
const { tokens, tokensSorted } = storeToRefs(tokenStore);
const { exludedTokens, parseRules } = storeToRefs(parseStore);

const mappedTokens = useArrayMap(tokensSorted, (t) => ({
  label: t.name,
  value: t.id,
  color: "red",
}));
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <!-- Sanitize Section -->
    <q-card
      flat
      bordered
    >
      <q-expansion-item
        switch-toggle-side
        label="Sanitize Tokens"
        caption="Specify tokens that are not included for parsing, like comments and whitespaces"
      >
        <template #header>
          <div class="flex flex-col">
            <span class="text-subtitle1 font-bold">Sanitize Tokens</span>
            <span class="text-caption text-hint"
              >Specify tokens that are not included for parsing, like comments
              and whitespaces.</span
            >
          </div>
        </template>
        <q-card>
          <q-card-section>
            <q-option-group
              type="checkbox"
              style="max-width: calc(100vw - 500px)"
              class="flex basis-0 flex-wrap"
              :options="mappedTokens"
              v-model="exludedTokens"
            />
          </q-card-section>
        </q-card>
        <q-card> </q-card>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<style lang="scss" scoped></style>
