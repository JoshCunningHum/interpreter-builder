<script setup lang="ts">
import { useParserStore } from "@/stores/parser";
import { useTokenStore } from "@/stores/token";
import genidnum from "@/utils/genidnum";
import { get, set, useArrayMap } from "@vueuse/core";
import draggable from "vuedraggable";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onMounted, ref } from "vue";
import Item from "./Item.vue";
import type { ParseRule } from "@/types/Node";

const emit = defineEmits<{
  (e: "initializeAddHook", func: () => void): void;
}>();

const parseStore = useParserStore();
const tokenStore = useTokenStore();
const { tokens, tokensSorted } = storeToRefs(tokenStore);
const { exludedTokens, parseRules } = storeToRefs(parseStore);

const mappedTokens = useArrayMap(tokensSorted, (t) => ({
  label: t.name,
  value: t.id,
  color: "red",
}));

// Adding Rules
const add = () => {
  get(parseRules).push({
    id: genidnum(),
    match: `((slice, whole)) => {
      // Enter pattern matching logic here \n})(...args)`,
    mapper: `({}) => {
        // Enter mapping here \n})(args)`,
    name: "",
  });
};

onMounted(() => emit("initializeAddHook", add));

// Collapse/Uncollapse

const collapseSignal = ref(1);
const collapseReset = () => set(collapseSignal, 0);

// Collective Splitter Width
const splitterWidth = ref(50);

// Lazy Load Item Component
const LazyItem = defineAsyncComponent(() => import("./Item.vue"));
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <!-- Sanitize Section -->

    <q-item
      flat
      dense
    >
      <q-item-section>
        <div class="flex flex-col">
          <span class="text-xl font-medium">Parsing Rules</span>
          <span class="text-hint text-xs"
            >Catch patterns and return a node structure to produce the AST</span
          >
        </div>
      </q-item-section>
      <q-item-section side>
        <q-btn label="Uncollapse" />
      </q-item-section>
    </q-item>
    <q-scroll-area class="flex-grow">
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
        </q-expansion-item>
      </q-card>

      <!-- Items -->
      <draggable
        class="mt-2 flex flex-col gap-4"
        v-model="parseRules"
        item-key="id"
        :animation="200"
        group="token-definitinos"
        ghostClass="opacity-25"
        handle=".handle"
        tag="div"
      >
        <template
          #item="{
            element: t,
            index: i,
          }: {
            element: ParseRule;
            index: number;
          }"
        >
          <LazyItem
            :splitter="splitterWidth"
            :collapse="collapseSignal"
            @collapseReset="collapseReset"
            @splitter-move="(v) => (splitterWidth = v)"
            :rule="t"
            :index="i"
          />
        </template>
      </draggable>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped></style>
