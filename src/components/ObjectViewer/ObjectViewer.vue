<script setup lang="ts">
import { JsonViewer } from "vue3-json-viewer";

const {
    obj,
    expandDepth = 1,
    boxed = false,
    pretext = "",
    expanded = false,
} = defineProps<{
    obj: Object | Array<any> | null | undefined;
    expandDepth?: number;
    boxed?: boolean;
    pretext?: string;
    expanded?: boolean;
}>();
</script>

<template>
    <span class="flex gap-2 pb-1">
        <span
            v-if="!!pretext"
            class="jv-cdark jv-key"
            >{{ pretext }}</span
        >
        <JsonViewer
            v-if="obj !== undefined"
            :expanded="expanded"
            theme="cdark"
            :value="obj"
            :boxed="boxed"
            :expand-depth="expandDepth"
        />
        <span
            v-else
            class="jv-cdark jv-undefined"
            >undefined</span
        >
    </span>
</template>

<style lang="scss" scoped></style>
