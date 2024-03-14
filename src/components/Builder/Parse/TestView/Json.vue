<script setup lang="ts">
import { useParserStore } from "@/stores/parser";
import { storeToRefs } from "pinia";
import Json from "@/components/TreeViewer/Json.vue";

const parseStore = useParserStore();
const { testParseResult } = storeToRefs(parseStore);
</script>

<template>
    <div class="h-full">
        <Json
            v-if="!!testParseResult.pool"
            :nodes="testParseResult.pool"
        />
    </div>
</template>

<style lang="scss" scoped></style>
