<script setup lang="ts">
import { useParserStore } from "@/stores/parser";
import { storeToRefs } from "pinia";
import TimelineItem from "./TimelineItem.vue";

const parseStore = useParserStore();
const { testLogs, testTokens } = storeToRefs(parseStore);
</script>

<template>
  <div class="h-full">
    <q-scroll-area class="h-full">
      <TimelineItem
        v-for="log in testLogs"
        :log="log"
        :key="log.id"
      />
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped></style>
