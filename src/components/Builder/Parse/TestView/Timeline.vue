<script setup lang="ts">
import { useParserStore } from "@/stores/parser";
import { storeToRefs } from "pinia";
import TimelineItem from "./TimelineItem.vue";

const parseStore = useParserStore();
const { testLogs, parserValues } = storeToRefs(parseStore);
</script>

<template>
    <div class="h-full">
        <TimelineItem
            v-for="log in testLogs"
            :log="log"
            :key="log.id"
        />
    </div>
</template>

<style lang="scss" scoped></style>
