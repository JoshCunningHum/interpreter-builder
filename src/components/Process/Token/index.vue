<script setup lang="ts">
import { useProcessStore } from "@/stores/process";
import { useTokenStore } from "@/stores/token";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import TokenViewer from "./viewer";
import { get, useArrayDifference, useArrayMap } from "@vueuse/core";

const tokenStore = useTokenStore();
const processStore = useProcessStore();

const { tokens, fileExecuted: file } = storeToRefs(processStore);
const { tokens: tokenDefinitions, tokensSorted: tokenDefinitionsSorted } =
  storeToRefs(tokenStore);

// Display toggler

const definitionIDs = useArrayMap(tokenDefinitions, (def) => def.id);
const hiddenDisplay = ref([...definitionIDs.value]);
const mappedDefinitions = useArrayMap(tokenDefinitionsSorted, (def) => ({
  label: def.name,
  value: def.id,
  color: "green",
}));
const exceptions = useArrayDifference(definitionIDs, hiddenDisplay);

// Bulk toggle/untoggle
const hasSelectedAll = computed(
  () => definitionIDs.value.length === hiddenDisplay.value.length,
);

const bulkToggle = () => {
  if (hiddenDisplay.value.length !== 0) get(hiddenDisplay).splice(0);
  else {
    get(hiddenDisplay).splice(0);
    get(hiddenDisplay).push(...definitionIDs.value);
  }
  console.log(get(hiddenDisplay));
};

// Splitter
const splitWidth = ref(85);
</script>

<template>
  <q-splitter
    v-model="splitWidth"
    disable
  >
    <template #before>
      <q-scroll-area class="h-full">
        <TokenViewer
          v-if="!!file"
          :code="file.data"
          :tokens="tokens"
          :tokenDefs="tokenDefinitions"
          :exceptions="exceptions"
        />
      </q-scroll-area>
    </template>

    <template #after>
      <q-scroll-area class="h-full">
        <div class="p-4">
          <q-btn
            dense
            @click="bulkToggle()"
            :label="`${hasSelectedAll ? 'Toggle' : 'Untoggle'} All`"
            :icon="`mdi-checkbox-${hasSelectedAll ? 'marked' : 'blank'}-outline`"
          />
          <q-option-group
            type="checkbox"
            v-model="hiddenDisplay"
            :options="mappedDefinitions"
          >
          </q-option-group>
        </div>
      </q-scroll-area>
    </template>
  </q-splitter>
</template>

<style lang="scss" scoped></style>
