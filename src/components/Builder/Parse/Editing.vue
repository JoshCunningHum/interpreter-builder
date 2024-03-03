<script setup lang="ts">
import { useParserStore } from "@/stores/parser";
import { useTokenStore } from "@/stores/token";
import type { ParseRule } from "@/types/Node";
import { useArrayMap } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, ref, toRefs } from "vue";
import draggable from "vuedraggable";

const props = defineProps<{
  collapseSignal: number;
}>();

const emit = defineEmits<{
  (e: "collapseReset"): void;
}>();

const tokenStore = useTokenStore();
const parseStore = useParserStore();
const { tokensSorted } = storeToRefs(tokenStore);
const { exludedTokens, parseRules } = storeToRefs(parseStore);

// Sanitize Tokens
const mappedTokens = useArrayMap(tokensSorted, (t) => ({
  label: t.name,
  value: t.id,
  color: "red",
}));

// Collapse/Uncollapse

const { collapseSignal } = toRefs(props);
const collapseReset = () => emit("collapseReset");

// Collective Splitter Width
const splitterWidth = ref(50);

// Lazy Load Item Component
const LazyItem = defineAsyncComponent(() => import("./Item.vue"));
</script>

<template>
  <q-scroll-area class="flex-grow">
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
      </q-expansion-item>
    </q-card>

    <!-- Items -->
    <draggable
      class="mt-3 flex flex-col gap-2"
      v-model="parseRules"
      item-key="id"
      :animation="200"
      group="token-definitinos"
      ghostClass="opacity-25"
      handle=".handle"
      tag="div"
    >
      <template
        #item="{ element: t, index: i }: { element: ParseRule; index: number }"
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
</template>

<style lang="scss" scoped></style>
