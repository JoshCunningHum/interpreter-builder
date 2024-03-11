<script setup lang="ts">
import { useExport } from "@/hooks/useExport";
import { useImport } from "@/hooks/useImport";
import { useParserStore } from "@/stores/parser";
import genidnum from "@/utils/genidnum";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onActivated, onMounted, ref } from "vue";
import Editing from "./Editing.vue";
import Testing from "./Testing.vue";

const emit = defineEmits<{
  (e: "initializeAddHook", func: () => void): void;
}>();

const parseStore = useParserStore();
const { parseRules } = storeToRefs(parseStore);

// Adding Rules
const add = () => {
  get(parseRules).push({
    id: genidnum(),
    match: `(({ pool, T, N }) => {
      // Enter pattern matching logic here \n})`,
    mapper: `(({ pool, setKind, setBody, setData, start, end }) => {
        // Enter mapping here \n})`,
    name: "",
  });
};

onActivated(() => emit("initializeAddHook", add));

// Collapse/Uncollapse

const collapseSignal = ref(1);
const collapseReset = () => set(collapseSignal, 0);

// Edit/Test Mode
enum Mode {
  Editing,
  Testing,
}

const mode = ref(Mode.Editing);
</script>

<template>
  <div class="flex h-full flex-col gap-2">
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
        <q-btn-group>
          <q-btn
            @click="useImport('ParseRules')"
            icon="mdi-import"
            label="Import"
          />
          <q-btn
            @click="useExport('ParseRules')"
            icon="mdi-export"
            label="Export"
          />
          <q-btn
            v-show="mode === Mode.Editing"
            @click="
              collapseSignal =
                collapseSignal === -1 ? 1 : collapseSignal === 0 ? 1 : -1
            "
            >{{ collapseSignal === -1 ? "Expand" : "Collapse" }} All</q-btn
          >
          <q-btn
            @click="mode = [1, 0][mode]"
            :icon="['mdi-pencil', 'mdi-format-letter-matches'][mode]"
            :label="Mode[mode]"
          />
        </q-btn-group>
      </q-item-section>
    </q-item>

    <Editing
      v-if="mode === Mode.Editing"
      :collapse-signal="collapseSignal"
      @collapse-reset="collapseReset"
    />
    <Testing v-else />
  </div>
</template>

<style lang="scss" scoped></style>
