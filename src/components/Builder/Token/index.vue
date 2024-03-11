<script setup lang="ts">
import { useExport } from "@/hooks/useExport";
import { useImport } from "@/hooks/useImport";
import { useTokenStore } from "@/stores/token";
import type { TokenDef } from "@/types/Token";
import genidnum from "@/utils/genidnum";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onActivated, onMounted, ref } from "vue";
import draggable from "vuedraggable";

const emit = defineEmits<{
  (e: "initializeAddHook", func: () => void): void;
}>();

const tokenStore = useTokenStore();
const { tokens } = storeToRefs(tokenStore);

const add = () => {
  get(tokens).push({
    id: genidnum(),
    match: `(({ slice, whole }) => {
    // Enter token finding logic here...
})`,
    name: "",
  });
};

onActivated(() => emit("initializeAddHook", add));

// Toggling collapse and expand for all items
const collapseSignal = ref(1);
const collapseReset = () => set(collapseSignal, 0);

// Lazy Load Item Component
const LazyItem = defineAsyncComponent(() => import("./Item.vue"));
</script>

<template>
  <div class="flex w-full flex-col">
    <q-item
      flat
      dense
    >
      <q-item-section>
        <div class="flex flex-col">
          <span class="text-xl font-medium">Define Tokens</span>
          <span class="text-hint text-xs"
            >Define token and the its pattern capture logic</span
          >
        </div>
      </q-item-section>
      <q-item-section side>
        <q-btn-group>
          <q-btn
            @click="useImport('TokenDefinitions')"
            icon="mdi-import"
            label="Import"
          />
          <q-btn
            @click="useExport('TokenDefinitions')"
            icon="mdi-export"
            label="Export"
          />
          <q-btn
            @click="
              collapseSignal =
                collapseSignal === -1 ? 1 : collapseSignal === 0 ? 1 : -1
            "
            >{{ collapseSignal === -1 ? "Expand" : "Collapse" }} All</q-btn
          >
        </q-btn-group>
      </q-item-section>
    </q-item>

    <div
      v-if="tokens.length === 0"
      class="flex flex-grow items-center justify-center"
    >
      <div class="text-h5 text-muted select-none">No Token Definitions</div>
    </div>
    <q-scroll-area
      v-else
      class="mt-2 flex-grow"
    >
      <draggable
        class="flex flex-col gap-4"
        v-model="tokens"
        item-key="id"
        :animation="200"
        group="token-definitinos"
        ghostClass="opacity-25"
        handle=".handle"
      >
        <template
          #item="{ element: t, index: i }: { element: TokenDef; index: number }"
        >
          <LazyItem
            :collapse="collapseSignal"
            @collapseReset="collapseReset"
            :def="t"
            :key="t.id"
            :index="i"
          />
        </template>
      </draggable>
    </q-scroll-area>
    <!-- <q-btn
      @click="add"
      color="primary"
      text-color="white"
      label="Add Token"
    /> -->
  </div>
</template>

<style lang="scss" scoped></style>
