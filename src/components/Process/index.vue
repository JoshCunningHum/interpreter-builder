<script setup lang="ts">
import { useProcessStore } from "@/stores/process";
import type { CodeFile } from "@/types/CodeFile";
import { ref } from "vue";
import ProcessTabs from "../ProcessTabs.vue";
import Interpreter from "./Interpret/index.vue";
import Parse from "./Parse/index.vue";
import ProcessOperations from "./ProcessOperations.vue";
import Token from "./Token/index.vue";

const tabs = [Token, Parse, Interpreter];
const tab = ref(0);

// Execute source code
const processStore = useProcessStore();

const exec = (f: CodeFile) => {
  console.log(f);
  processStore.execute(f);
};
</script>

<template>
  <div class="flex h-screen">
    <ProcessTabs v-model="tab" />
    <div class="flex flex-grow flex-col">
      <ProcessOperations @execute="exec" />
      <q-tab-panels
        v-model="tab"
        animated
        keep-alive
        vertical
        class="flex-grow p-0"
      >
        <q-tab-panel
          v-for="(t, i) in tabs"
          :key="i"
          :name="i"
          class="flex w-full p-0"
        >
          <component
            :is="t"
            class="flex-grow"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
