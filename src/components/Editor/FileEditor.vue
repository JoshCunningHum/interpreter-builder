<script setup lang="ts">
import { useIdeStore } from "@/stores/ide";
import { storeToRefs } from "pinia";
import CenterContent from "@/components/CenterContent.vue";
import CMEditorCode from "../CMEditorCode.vue";
import { ref } from "vue";
import { set } from "@vueuse/core";
import FileEditorInfo from "./FileEditorInfo.vue";
import FileEditorOperations from "./FileEditorOperations.vue";
import FileEditorOutput from './FileEditorOutput.vue';

const ideStore = useIdeStore();
const { current } = storeToRefs(ideStore);

// Cursor
const cursor = ref(0);
const onCursorChange = (n: number) => set(cursor, n);

// Output
const leftSectionWidth = ref(70);

</script>

<template>
  <div
    class="flex-grow flex flex-col bg-[#2E3235]"
    v-if="!!current"
  >
    <!-- Header -->
    <FileEditorOperations />

    <!-- Main Editor -->
    <q-splitter v-model="leftSectionWidth"  class="flex-grow border-y border-l border-[#565A5D]">
      <template #before>
        <q-scroll-area class="h-full">
          <CMEditorCode
            v-model="current.data"
            @cursor-change="onCursorChange"
          />
        </q-scroll-area>
      </template>
      <template #after>
        <FileEditorOutput  />
      </template>
    </q-splitter>

    <!-- Footer -->
    <FileEditorInfo
      :cursor="cursor"
      :source="current.data"
    />
  </div>
  <CenterContent v-else>
    <q-item-label
      header
      class="text-h6"
      >No File Selected</q-item-label
    >
  </CenterContent>
</template>

<style lang="scss" scoped></style>
