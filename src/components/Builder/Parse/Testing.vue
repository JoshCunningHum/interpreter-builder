<script setup lang="ts">
import CMEditorCode from "@/components/CMEditorCode.vue";
import getEnumKeys from "@/utils/getEnumKeys";
import { ref } from "vue";
import Json from "./TestView/Json.vue";
import Timeline from "./TestView/Timeline.vue";
import Tree from "./TestView/Tree.vue";
import { useParserStore } from "@/stores/parser";
import { storeToRefs } from "pinia";

// Splitter
const splitter_value = ref(50);

// Mode
enum Mode {
  Process,
  Tree,
  Json,
}

const modes = getEnumKeys(Mode).map((mode, i) => ({
  label: mode,
  value: i,
}));

const mode = ref(Mode.Process);

// Test Source
const parseStore = useParserStore();
const { testSource } = storeToRefs(parseStore);
</script>

<template>
  <q-splitter
    :limits="[30, 70]"
    v-model="splitter_value"
    class="flex-grow gap-2"
  >
    <template #before>
      <q-scroll-area class="h-full rounded bg-[#2E3235]">
        <CMEditorCode v-model="testSource" />
      </q-scroll-area>
    </template>
    <template #after>
      <div class="flex h-full flex-col gap-2 rounded">
        <div class="flex">
          <q-btn-toggle
            v-model="mode"
            toggle-color="secondary"
            :options="modes"
            dense
            push
            padding="0 1rem"
          />

          <q-btn
            icon="mdi-cog"
            push
            round
            class="ml-auto"
          />
        </div>
        <div class="flex-grow rounded">
          <Json v-if="mode === Mode.Json" />
          <Timeline v-if="mode === Mode.Process" />
          <Tree v-if="mode === Mode.Tree" />
        </div>
      </div>
    </template>
  </q-splitter>
</template>

<style lang="scss" scoped></style>
