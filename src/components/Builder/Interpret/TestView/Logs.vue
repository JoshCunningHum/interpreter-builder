<script setup lang="ts">
import { useInterpreterStore } from "@/stores/interpreter";
import { storeToRefs } from "pinia";
import { get, set } from "@vueuse/core";
import { computed } from "vue";
import LogItem from "./LogItem.vue";
import CenterContent from "@/components/CenterContent.vue";

const interpretStore = useInterpreterStore();
const { interpreterValues } = storeToRefs(interpretStore);

const logs = computed(() => get(interpreterValues)?.logs || []);
</script>

<template>
    <div v-if="logs.length > 0">
        <LogItem
            v-for="(log, i) in logs"
            :key="i"
            :log="log"
        />
    </div>
    <CenterContent
        class="h-52"
        v-else
    >
        <div class="text-muted text-subtitle1">
            No Logs Created yet - {{ logs.length }}
        </div>
    </CenterContent>
</template>

<style lang="scss" scoped></style>
